// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/users/me
// Access: Logged in
//
// Task: Return the logged-in user's profile.
//
// Rules:
//   - req.user is already loaded by requireAuth.
//   - Populate target_exam and selected_subjects (name and code only, to keep the response small).
//
// Spec: Tech Doc B2.1 (User)
export async function getMe(req, res) {
  return notImplemented(res);
}
