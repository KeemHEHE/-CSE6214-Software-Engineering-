// M1 User Management: UC-03 Manage Own Profile, UC-04 Manage User Accounts.
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { requireAuth, requireRole, Role } from '../../middleware/auth';

export const usersRouter = Router();

// UC-03: view and edit own profile.
usersRouter.get('/me', requireAuth, (req, res) => {
  const user = db
    .prepare('SELECT user_id, name, email, phone, role, status, email_notify, created_at FROM USER WHERE user_id = ?')
    .get(req.user!.id);
  res.json(user);
});

usersRouter.patch('/me', requireAuth, async (req, res) => {
  const { name, phone, password, email_notify } = req.body as {
    name?: string;
    phone?: string;
    password?: string;
    email_notify?: boolean;
  };

  if (name !== undefined) db.prepare('UPDATE USER SET name = ? WHERE user_id = ?').run(name, req.user!.id);
  if (phone !== undefined) db.prepare('UPDATE USER SET phone = ? WHERE user_id = ?').run(phone, req.user!.id);
  if (email_notify !== undefined)
    db.prepare('UPDATE USER SET email_notify = ? WHERE user_id = ?').run(email_notify ? 1 : 0, req.user!.id);
  if (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    db.prepare('UPDATE USER SET password_hash = ? WHERE user_id = ?').run(passwordHash, req.user!.id);
  }

  res.json({ updated: true });
});

// UC-04: administrator manages all accounts.
usersRouter.get('/', requireAuth, requireRole('ADMIN'), (_req, res) => {
  const users = db
    .prepare('SELECT user_id, name, email, phone, role, status, created_at FROM USER ORDER BY user_id')
    .all();
  res.json(users);
});

usersRouter.post('/', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const { name, email, phone, password, role } = req.body as {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: Role;
  };

  const passwordHash = await bcrypt.hash(password, 10);
  const result = db
    .prepare(
      "INSERT INTO USER (name, email, password_hash, phone, role, status) VALUES (?, ?, ?, ?, ?, 'ACTIVE')"
    )
    .run(name, email, passwordHash, phone ?? null, role);

  res.status(201).json({ userId: result.lastInsertRowid });
});

usersRouter.patch('/:id/role', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { role } = req.body as { role: Role };
  db.prepare('UPDATE USER SET role = ? WHERE user_id = ?').run(role, req.params.id);
  res.json({ updated: true });
});

usersRouter.patch('/:id/status', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { status } = req.body as { status: 'ACTIVE' | 'INACTIVE' };
  db.prepare('UPDATE USER SET status = ? WHERE user_id = ?').run(status, req.params.id);
  res.json({ updated: true });
});
