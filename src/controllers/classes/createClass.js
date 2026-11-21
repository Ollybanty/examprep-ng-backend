// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/classes
// Access: Approved teacher
//
// Task: Create a class and generate a join code.
//
// Rules:
//   - Body: name, subject_id (optional).
//   - Generate a unique 6-character join code (RULES.JOIN_CODE_LENGTH). Avoid look-alike characters (0/O, 1/I). Retry if it already exists.
//   - Return the class with its join_code.
//
// Spec: Tech Doc B3 (Classroom); Users Guide 3.4
export async function createClass(req, res) {
  return notImplemented(res);
}
