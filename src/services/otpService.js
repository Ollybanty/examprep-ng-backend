// to be handled by: Oladele
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { Otp } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { RULES } from '../utils/constants.js';

// Makes a new code and returns it so we can email it.
// Returns null if the last code was sent less than a minute ago, to stop spam
export async function createOtp(userId, purpose) {
  const latest = await Otp.findOne({ user: userId, purpose }).sort({ created_at: -1 });
  if (latest) {
    const secondsSinceLast = (Date.now() - latest.created_at.getTime()) / 1000;
    if (secondsSinceLast < RULES.OTP_RESEND_COOLDOWN_SECONDS) return null;
  }

  // randomInt is secure. Math.random() can be guessed
  const code = crypto
    .randomInt(0, 10 ** RULES.OTP_LENGTH)
    .toString()
    .padStart(RULES.OTP_LENGTH, '0');

  // Delete old codes so only the newest one works
  await Otp.deleteMany({ user: userId, purpose });
  await Otp.create({
    user: userId,
    purpose,
    code_hash: await bcrypt.hash(code, 10),
    expires_at: new Date(Date.now() + RULES.OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  return code;
}

// Checks the code and deletes it once it's used. Throws an error if it's wrong or expired
export async function verifyOtpCode(userId, purpose, code) {
  const otp = await Otp.findOne({ user: userId, purpose, expires_at: { $gt: new Date() } });
  if (!otp) {
    throw new AppError(
      400,
      'OTP_EXPIRED',
      'This code has expired or was not found. Kindly request a new one',
    );
  }

  const isMatch = await bcrypt.compare(code, otp.code_hash);
  if (!isMatch) {
    otp.attempts += 1;
    const attemptsLeft = RULES.OTP_MAX_ATTEMPTS - otp.attempts;

    if (attemptsLeft <= 0) {
      await otp.deleteOne();
      throw new AppError(
        429,
        'OTP_TOO_MANY_ATTEMPTS',
        'Too many wrong codes. Kindly request a new one',
      );
    }

    await otp.save();
    throw new AppError(400, 'OTP_INVALID', `Incorrect code. ${attemptsLeft} attempt(s) left`);
  }

  // Each code works only once
  await otp.deleteOne();
}
