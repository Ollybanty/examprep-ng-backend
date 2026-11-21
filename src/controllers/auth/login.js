// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/auth/login
// Access: Public
//
// Task: Log in with email (or phone) and password, and return a token.
//
// Rules:
//   - Load the user with .select('+password_hash') and compare with bcryptjs.
//   - Wrong email or password: 401 INVALID_CREDENTIALS (same message for both).
//   - Unverified account: 403 ACCOUNT_NOT_VERIFIED. Deactivated account: 403 ACCOUNT_DISABLED.
//   - Pending teachers CAN log in (they just can't use teacher features yet).
//   - Update last_login_at. Return { token, user }.
//   - Rate limit this route.
//
// Spec: Tech Doc B3 (Auth)
export async function login(req, res) {
  return notImplemented(res);
}
