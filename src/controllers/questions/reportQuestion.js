// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/questions/:id/report
// Access: Student
//
// Task: Report a wrong answer or unclear question.
//
// Rules:
//   - Body: reason (required, max 1000 characters).
//   - Create a QuestionReport (status "open").
//   - Set the question's status to "flagged" so it goes into the admin review queue. Use question.save().
//   - Don't create a second open report from the same student for the same question.
//
// Spec: Tech Doc B3 (Question actions); Users Guide 3.5
export async function reportQuestion(req, res) {
  return notImplemented(res);
}
