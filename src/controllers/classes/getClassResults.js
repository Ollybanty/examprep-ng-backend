// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/classes/:id/results
// Access: Approved teacher (class owner)
//
// Task: Show class results: completion, scores and weakest topics.
//
// Rules:
//   - Only the class owner.
//   - For each assignment: which students completed it, and their scores.
//   - Weakest topics across the class: combine members' Mastery records and list the topics with the most "weak" students.
//
// Spec: Tech Doc B3 (Classroom); PRD 4B.3
export async function getClassResults(req, res) {
  return notImplemented(res);
}
