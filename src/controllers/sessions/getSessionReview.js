// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/sessions/:id/review
// Access: Student (owner)
//
// Task: Show every question with the student's answer, the correct answer and the explanation.
//
// Rules:
//   - Only AFTER the session is submitted or auto_submitted (409 SESSION_IN_PROGRESS otherwise).
//   - This is the only place a CBT student sees answers and explanations.
//
// Spec: Users Guide 3.2 (Review); Tech Doc B4.4
export async function getSessionReview(req, res) {
  return notImplemented(res);
}
