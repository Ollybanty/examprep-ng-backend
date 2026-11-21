// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/sessions
// Access: Student
//
// Task: Start a practice session or a CBT mock.
//
// Rules:
//   - Body: mode ("practice" | "cbt"), exam_id, subject_id, and either filters { topic, year, random, weak_topics } with question_count, OR assignment_id.
//   - Check the free-plan quota first (quotaService): CBT = 1 per month, practice = 15 questions per day.
//   - Pick published questions that match the filters. weak_topics uses the student's weak topics from Mastery.
//   - If assignment_id is given: the student must be a member of that class, use the assignment's question_ids, and allow only one session per student per assignment.
//   - CBT: expires_at = started_at + exam.cbt_duration_minutes (server clock, DEC-02).
//   - Save question_ids and total_questions on the session.
//   - Return the session and its questions WITHOUT correct_option and explanation_text.
//
// Spec: Tech Doc B3 (Sessions), B4.1; Users Guide 3.1, 3.2
export async function startSession(req, res) {
  return notImplemented(res);
}
