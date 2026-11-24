import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Login token; clients send it as Authorization: Bearer <token>
export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

// Returns the token's payload, or throws if the token is invalid or expired
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

// For invite links. SHA 256, not bcrypt, so we can look the invite up by its hash.
// That's safe because the token is 64 random characters, not a guessable password.
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
