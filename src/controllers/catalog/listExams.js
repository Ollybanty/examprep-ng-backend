// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/exams
// Access: Logged in
//
// Task: List the active exams (JAMB, WAEC).
//
// Rules:
//   - Only is_active exams. Return name, code, cbt_duration_minutes, cbt_question_count.
//
// Spec: PRD (Target Exams)
export async function listExams(req, res) {
  return notImplemented(res);
}
