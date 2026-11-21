// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// PATCH /api/v1/users/me/onboarding
// Access: Student
//
// Task: Save the student's target exam and subjects.
//
// Rules:
//   - Body: exam_id, subject_ids (array).
//   - Exam must exist and be active.
//   - Choose 4–6 subjects (RULES.MIN_SUBJECTS / MAX_SUBJECTS), no duplicates.
//   - Every subject must exist and be offered by the chosen exam (subject.exams includes exam_id).
//   - Return the updated user.
//
// Spec: Tech Doc B3 (Onboarding); PRD 4A.1
export async function completeOnboarding(req, res) {
  return notImplemented(res);
}
