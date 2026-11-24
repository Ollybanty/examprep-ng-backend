import crypto from 'node:crypto';
import { env } from '../config/env.js';

const hash = (text) => crypto.createHash('sha256').update(text).digest();

// Same length hashes let timingSafeEqual compare them without leaking how much of the guess was right
const matches = (given, expected) => crypto.timingSafeEqual(hash(given), hash(expected));

// Asks the browser for a username and password (HTTP Basic auth) before showing the docs
export function docsAuth(req, res, next) {
  const [scheme, encoded] = (req.headers.authorization || '').split(' ');

  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString();
    const colon = decoded.indexOf(':');
    if (colon !== -1) {
      // Both are always checked, so the time taken doesn't hint that the username was right
      const userOk = matches(decoded.slice(0, colon), env.docsUsername);
      const passOk = matches(decoded.slice(colon + 1), env.docsPassword);
      if (userOk && passOk) return next();
    }
  }

  // This header makes the browser show its login box
  res.set('WWW-Authenticate', 'Basic realm="ExamPrep NG API docs", charset="UTF-8"');
  return res.status(401).json({
    error: { code: 'DOCS_LOGIN_REQUIRED', message: 'Enter the docs username and password' },
  });
}
