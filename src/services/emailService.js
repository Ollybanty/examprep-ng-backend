import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Every email goes through sendEmail, so switching provider (e.g. to Resend) only changes this file.
// gmail uses SMTP. brevo uses an HTTPS API, because Render's free plan blocks SMTP ports.

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

const isGmail = env.emailProvider === 'gmail';
const isBrevo = env.emailProvider === 'brevo';

export const isEmailConfigured =
  (isGmail && Boolean(env.emailUser && env.emailAppPassword)) ||
  (isBrevo && Boolean(env.emailUser && env.brevoApiKey));

const gmailTransporter =
  isGmail && isEmailConfigured
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: { user: env.emailUser, pass: env.emailAppPassword },
      })
    : null;

async function sendWithBrevo({ to, subject, text, html }) {
  const response = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'api-key': env.brevoApiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: env.emailFromName, email: env.emailUser },
      to: [{ email: to }],
      subject,
      textContent: text,
      ...(html && { htmlContent: html }),
    }),
    signal: AbortSignal.timeout(10_000), // don't leave the request hanging if Brevo is slow
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo could not send the email (${response.status}): ${body}`);
  }
}

export async function sendEmail({ to, subject, text, html }) {
  if (!isEmailConfigured) {
    // Never print emails in production: they contain login codes and invite links
    if (env.isProduction) {
      throw new Error(`Email is not set up for EMAIL_PROVIDER "${env.emailProvider}"`);
    }
    console.log(`\n--- EMAIL (not sent: ${env.emailProvider} is not set up in .env) ---`);
    console.log(`To: ${to}\nSubject: ${subject}\n\n${text}`);
    console.log('--- END EMAIL ---\n');
    return;
  }

  if (isBrevo) return sendWithBrevo({ to, subject, text, html });

  await gmailTransporter.sendMail({
    from: `"${env.emailFromName}" <${env.emailUser}>`,
    to,
    subject,
    text,
    html,
  });
}
