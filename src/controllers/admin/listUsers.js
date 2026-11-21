// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/admin/users
// Access: Admin
//
// Task: List and search users.
//
// Rules:
//   - Query: role, search (name or email), page, limit.
//   - Never return password_hash (the model already hides it).
//
// Spec: Brief: manage users
export async function listUsers(req, res) {
  return notImplemented(res);
}
