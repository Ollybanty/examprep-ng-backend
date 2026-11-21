// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/auth/resend-otp
// Access: Public
//
// Task: Send a new verification code.
//
// Rules:
//   - Body: email (or phone).
//   - Delete any old verify_account OTPs for the user, then create and email a new one.
//   - Rate limit this route (e.g. 1 per minute) with express-rate-limit.
//   - Always return the same message whether or not the account exists, so attackers can't discover emails.
//
// Spec: Tech Doc B4.4 (OTP protection)
export async function resendOtp(req, res) {
  return notImplemented(res);
}
