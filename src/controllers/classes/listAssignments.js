// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/classes/:id/assignments
// Access: Teacher owner or class member
//
// Task: List a class's assignments.
//
// Rules:
//   - Teacher must own the class; student must be a member (404 otherwise).
//   - For students, include whether they have completed each one.
//
// Spec: Users Guide 3.4
export async function listAssignments(req, res) {
  return notImplemented(res);
}
