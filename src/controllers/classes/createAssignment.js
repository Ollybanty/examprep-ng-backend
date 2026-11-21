// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/classes/:id/assignments
// Access: Approved teacher (class owner)
//
// Task: Assign work to a class.
//
// Rules:
//   - Body: title, exam_id, subject_id, topic_id (optional), mode, question_count, deadline.
//   - Only the teacher who owns the class (404 otherwise).
//   - deadline must be in the future.
//   - Pick question_count published questions now and save their ids, so every student gets the same set.
//   - Email the class members about the new assignment (sendEmail).
//
// Spec: Tech Doc B3 (Classroom); PRD 4B.2
export async function createAssignment(req, res) {
  return notImplemented(res);
}
