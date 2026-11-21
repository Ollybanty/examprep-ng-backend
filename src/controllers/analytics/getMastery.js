// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/analytics/mastery
// Access: Student
//
// Task: Return the student's mastery per topic and recommended weak topics.
//
// Rules:
//   - Query: subject (optional).
//   - Return each topic's status, weighted_accuracy and attempts_count, grouped by subject.
//   - recommended_topics: the weakest "weak" topics (lowest accuracy first) in the student's selected subjects, max 3.
//
// Spec: Tech Doc B3 (Analytics), B4.2
export async function getMastery(req, res) {
  return notImplemented(res);
}
