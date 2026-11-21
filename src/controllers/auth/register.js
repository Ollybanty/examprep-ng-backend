// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/auth/register
// Access: Public
//
// Task: Create a student or teacher account and email a 6-digit OTP to verify it.
//
// Rules:
//   - Body: full_name, email and/or phone, password, role ("student" or "teacher", default "student").
//   - Never allow role "admin" here. Admins come from the seed script or an admin invite.
//   - Hash the password with bcryptjs (10 salt rounds) and save it as password_hash.
//   - Teachers are saved with teacher_status "pending" automatically (User model).
//   - Create an OTP with purpose "verify_account" and email it with sendEmail().
//   - Return 201 with the user (no token yet; the account is not verified).
//   - Duplicate email/phone is handled by the error handler (409 DUPLICATE_VALUE).
//
// Spec: Tech Doc B3 (Auth), B2.1 (User); Users Guide 2.2
export async function register(req, res) {
  return notImplemented(res);
}
