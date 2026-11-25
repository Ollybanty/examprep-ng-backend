import 'dotenv/config';
import mongoose from 'mongoose';



// Stop early with a clear message if a required variable is missing
const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  console.error('Copy .env.example to .env and fill in the values.');
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  // How many proxies sit in front of the app. Render has one, so rate limits see each user's real IP.
  trustProxy: Number(process.env.TRUST_PROXY ?? (process.env.NODE_ENV === 'production' ? 1 : 0)),
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // gmail (SMTP, for laptops) or brevo (HTTPS API, for Render, whose free plan blocks SMTP)
  emailProvider: (process.env.EMAIL_PROVIDER || 'gmail').toLowerCase(),
  emailUser: process.env.EMAIL_USER || '',
  emailAppPassword: process.env.EMAIL_APP_PASSWORD || '',
  emailFromName: process.env.EMAIL_FROM_NAME || 'ExamPrep NG',
  brevoApiKey: process.env.BREVO_API_KEY || '',
  adminName: process.env.ADMIN_NAME || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  // A trailing slash is removed, because browsers send the origin without one
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  // Used for links in emails, e.g. FRONTEND_URL/accept-invite?token=...
  frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, ''),
  // The API docs at /api/docs are only turned on when both are set
  docsUsername: process.env.DOCS_USERNAME || '',
  docsPassword: process.env.DOCS_PASSWORD || '',
  alocToken: process.env.ALOC_TOKEN || '',
  alocBaseUrl: process.env.ALOC_BASE_URL || 'https://dev.aloc.com.ng/api/v1',
  groqApiKey: process.env.GROQ_API_KEY || '',
};
