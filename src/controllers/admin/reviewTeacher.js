// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// PATCH /api/v1/admin/teachers/:id/approval
// Access: Admin
//
// Task: Approve or reject a teacher account.
//
// Rules:
//   - Body: decision ("approved" | "rejected").
//   - The user must have role "teacher".
//   - Email the teacher with the result.
//
// Spec: Team decision: teachers need admin approval
export async function reviewTeacher(req, res) {
  return notImplemented(res);
}
