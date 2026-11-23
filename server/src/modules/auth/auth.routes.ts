// M1 User Management: UC-01 Log In, UC-02 Register Account.
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { signToken, Role } from '../../middleware/auth';
import { generateToken, hashToken } from '../../utils/tokens';
import { sendEmail } from '../../utils/mailer';

export const authRouter = Router();

const MMU_EMAIL_DOMAINS = ['@mmu.edu.my', '@student.mmu.edu.my'];
const LOGIN_ATTEMPT_LIMIT = 5;
const LOCKOUT_MINUTES = 15;
const RESET_VALID_MINUTES = 30;

interface UserRow {
  user_id: number;
  password_hash: string;
  role: Role;
  status: string;
  failed_logins: number;
  locked_until: string | null;
}

// FR-01, FR-02: register with MMU email; account stays PENDING until verified.
authRouter.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body as {
    name: string;
    email: string;
    phone?: string;
    password: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  if (!MMU_EMAIL_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain))) {
    return res.status(400).json({ error: 'Email must be an MMU address (@mmu.edu.my or @student.mmu.edu.my)' });
  }

  const existing = db.prepare('SELECT user_id FROM USER WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { token, hash } = generateToken();

  const result = db
    .prepare(
      `INSERT INTO USER (name, email, password_hash, phone, role, status, verify_token_hash)
       VALUES (?, ?, ?, ?, 'STUDENT_STAFF', 'PENDING', ?)`
    )
    .run(name, email, passwordHash, phone ?? null, hash);

  sendEmail(email, 'Verify your EcoBin MMU account', `Verification token: ${token}`);
  res.status(201).json({ userId: result.lastInsertRowid, message: 'Registered. Check email to verify account.' });
});

// FR-02: verify account with the emailed token.
authRouter.post('/verify', (req, res) => {
  const { email, token } = req.body as { email: string; token: string };
  const hash = hashToken(token);

  const user = db
    .prepare("SELECT user_id FROM USER WHERE email = ? AND verify_token_hash = ? AND status = 'PENDING'")
    .get(email, hash) as { user_id: number } | undefined;

  if (!user) return res.status(400).json({ error: 'Invalid or expired verification token' });

  db.prepare("UPDATE USER SET status = 'ACTIVE', verify_token_hash = NULL WHERE user_id = ?").run(user.user_id);
  res.json({ verified: true });
});

// FR-03, FR-04: login with 5-strike lockout.
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = db
    .prepare('SELECT user_id, password_hash, role, status, failed_logins, locked_until FROM USER WHERE email = ?')
    .get(email) as UserRow | undefined;

  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    return res.status(423).json({ error: `Account locked until ${user.locked_until}` });
  }
  if (user.status === 'PENDING') return res.status(403).json({ error: 'Account not yet verified' });
  if (user.status === 'INACTIVE') return res.status(403).json({ error: 'Account is deactivated' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const failedLogins = user.failed_logins + 1;
    const lockedUntil =
      failedLogins >= LOGIN_ATTEMPT_LIMIT
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
        : null;
    db.prepare('UPDATE USER SET failed_logins = ?, locked_until = ?, status = ? WHERE user_id = ?').run(
      failedLogins,
      lockedUntil,
      lockedUntil ? 'LOCKED' : user.status,
      user.user_id
    );
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  db.prepare(
    "UPDATE USER SET failed_logins = 0, locked_until = NULL, status = 'ACTIVE' WHERE user_id = ?"
  ).run(user.user_id);

  const token = signToken({ id: user.user_id, role: user.role });
  res.json({ token });
});

// FR-05: request a password reset link (valid 30 minutes).
authRouter.post('/request-reset', (req, res) => {
  const { email } = req.body as { email: string };
  const user = db.prepare('SELECT user_id FROM USER WHERE email = ?').get(email) as
    | { user_id: number }
    | undefined;

  // Always respond 200 so this endpoint can't be used to enumerate registered emails.
  if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

  const { token, hash } = generateToken();
  const expiresAt = new Date(Date.now() + RESET_VALID_MINUTES * 60_000).toISOString();
  db.prepare('UPDATE USER SET reset_token_hash = ?, reset_expires_at = ? WHERE user_id = ?').run(
    hash,
    expiresAt,
    user.user_id
  );

  sendEmail(email, 'Reset your EcoBin MMU password', `Reset token: ${token} (valid 30 minutes)`);
  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

authRouter.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body as { email: string; token: string; newPassword: string };
  const hash = hashToken(token);

  const user = db
    .prepare('SELECT user_id, reset_expires_at FROM USER WHERE email = ? AND reset_token_hash = ?')
    .get(email, hash) as { user_id: number; reset_expires_at: string } | undefined;

  if (!user || new Date(user.reset_expires_at) < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  db.prepare(
    'UPDATE USER SET password_hash = ?, reset_token_hash = NULL, reset_expires_at = NULL WHERE user_id = ?'
  ).run(passwordHash, user.user_id);

  res.json({ reset: true });
});
