// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/auth/accept-admin-invite
// Access: Public
//
// Task: Create an admin account from an invite link.
//
// Rules:
//   - Body: token, full_name, password.
//   - Hash the token and find an AdminInvite with that token_hash that is not expired and not accepted.
//   - Create the user with role "admin", is_verified true and the invite's email.
//   - Set accepted_at on the invite. Return { token, user }.
//
// Spec: Team decision: admins invite other admins
export async function acceptAdminInvite(req, res) {
  return notImplemented(res);
}
