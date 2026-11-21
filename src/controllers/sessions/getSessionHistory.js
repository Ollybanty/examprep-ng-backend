// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/sessions/history
// Access: Student
//
// Task: List the student's past sessions (score history).
//
// Rules:
//   - Newest first, paginated.
//   - Return mode, subject, status, raw_score, total_questions, percentage, started_at, submitted_at.
//
// Spec: Brief: track score history over time
export async function getSessionHistory(req, res) {
  return notImplemented(res);
}
