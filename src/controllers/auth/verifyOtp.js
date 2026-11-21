// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/auth/verify-otp
// Access: Public
//
// Task: Check the OTP and mark the account as verified.
//
// Rules:
//   - Body: email (or phone) and code.
//   - Find the newest unexpired OTP for the user with purpose "verify_account".
//   - Wrong code: increase attempts. After RULES.OTP_MAX_ATTEMPTS (5) wrong tries, delete it and ask for a new code.
//   - Right code: set is_verified = true, delete the OTP, return a token (signToken) and the user.
//
// Spec: Tech Doc B3 (Auth), B4.4 (OTP protection)
export async function verifyOtp(req, res) {
  return notImplemented(res);
}
