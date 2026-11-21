// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/admin/invites
// Access: Admin
//
// Task: Invite someone to become an admin.
//
// Rules:
//   - Body: email.
//   - Generate a random token (crypto.randomBytes(32).toString('hex')), store only its SHA-256 hash in AdminInvite.
//   - expires_at = now + RULES.ADMIN_INVITE_EXPIRY_HOURS (48h).
//   - Email the raw token (or a frontend link containing it) to the invitee.
//   - Don't invite an email that already has an account.
//
// Spec: Team decision: admins invite other admins
export async function inviteAdmin(req, res) {
  return notImplemented(res);
}
