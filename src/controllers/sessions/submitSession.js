// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/sessions/:id/submit
// Access: Student (owner)
//
// Task: Finish a session and score it.
//
// Rules:
//   - Only in_progress sessions owned by the student.
//   - Use scoringService.scoreSession(): +1 correct, 0 wrong or skipped; save raw_score, total_questions, percentage, submitted_at, status "submitted".
//   - Then update mastery for every topic in the session (masteryService.updateMasteryForSession).
//   - Return the score summary (e.g. 24/30 = 80%).
//
// Spec: Tech Doc B3 (Sessions); PRD 5 (Scoring)
export async function submitSession(req, res) {
  return notImplemented(res);
}
