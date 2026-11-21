// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/auth/reset-password
// Access: Public
//
// Task: Set a new password using the reset code.
//
// Rules:
//   - Body: email, code, new_password.
//   - Same OTP checks as verify-otp (expiry, max 5 attempts).
//   - Hash and save the new password, then delete the OTP.
//
// Spec: PRD section 7
export async function resetPassword(req, res) {
  return notImplemented(res);
}
