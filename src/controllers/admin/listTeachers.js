// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/admin/teachers
// Access: Admin
//
// Task: List teachers, e.g. those waiting for approval.
//
// Rules:
//   - Query: status (pending | approved | rejected), page, limit.
//
// Spec: Team decision: teachers need admin approval
export async function listTeachers(req, res) {
  return notImplemented(res);
}
