// D1: the real system depends on an SMTP email service (FR-02 verification,
// FR-05 password reset). No SMTP credentials are configured for this prototype,
// so sending is stubbed out to the console. Swap this for nodemailer + real
// SMTP settings when D1 is available.
export function sendEmail(to: string, subject: string, body: string): void {
  console.log(`[mailer stub] To: ${to} | Subject: ${subject}\n${body}`);
}
