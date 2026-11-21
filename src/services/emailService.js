import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Gmail SMTP for now; switching provider later (e.g. Resend) only changes this file

const isConfigured = Boolean(env.emailUser && env.emailAppPassword);

const transporter = isConfigured
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: env.emailUser, pass: env.emailAppPassword },
    })
  : null;

// Prints the email in the terminal instead if Gmail isn't set up in .env
export async function sendEmail({ to, subject, text, html }) {
  if (!isConfigured) {
    console.log('\n--- EMAIL (not sent: EMAIL_USER / EMAIL_APP_PASSWORD not set) ---');
    console.log(`To: ${to}\nSubject: ${subject}\n\n${text}`);
    console.log('--- END EMAIL ---\n');
    return;
  }

  await transporter.sendMail({
    from: `"${env.emailFromName}" <${env.emailUser}>`,
    to,
    subject,
    text,
    html,
  });
}
