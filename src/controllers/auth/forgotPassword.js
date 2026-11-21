// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/auth/forgot-password
// Access: Public
//
// Task: Email a password reset code.
//
// Rules:
//   - Body: email.
//   - Create an OTP with purpose "reset_password" and email it.
//   - Always return the same message whether or not the email exists.
//
// Spec: PRD section 7 (password resets)
export async function forgotPassword(req, res) {
  return notImplemented(res);
}
