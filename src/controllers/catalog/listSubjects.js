// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/subjects
// Access: Logged in
//
// Task: List subjects, optionally filtered by exam.
//
// Rules:
//   - Query: ?exam=<exam id> (optional).
//   - Only is_active subjects.
//
// Spec: PRD (Core Subjects)
export async function listSubjects(req, res) {
  return notImplemented(res);
}