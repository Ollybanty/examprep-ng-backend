// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/questions
// Access: Student
//
// Task: Browse published questions with filters.
//
// Rules:
//   - Query: exam, subject, topic, year, page, limit (default 20, max 50).
//   - Only status "published".
//   - NEVER include correct_option or explanation_text (answer leakage, B4.4). Use .select('-correct_option -explanation_text').
//   - Return { data, pagination: { page, limit, total, pages } }.
//
// Spec: Tech Doc B3 (Questions), B4.4 (Answer leakage)
export async function listQuestions(req, res) {
  return notImplemented(res);
}
