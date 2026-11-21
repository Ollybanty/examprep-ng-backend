// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/classes/join
// Access: Student
//
// Task: Join a class with a join code.
//
// Rules:
//   - Body: join_code (case-insensitive).
//   - Class must exist and be active (404 INVALID_JOIN_CODE otherwise).
//   - Joining twice returns 409 ALREADY_JOINED.
//
// Spec: Tech Doc B3 (Classroom)
export async function joinClass(req, res) {
  return notImplemented(res);
}
