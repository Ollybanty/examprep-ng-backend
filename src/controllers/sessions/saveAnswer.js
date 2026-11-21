// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// PATCH /api/v1/sessions/:id/answer
// Access: Student (owner)
//
// Task: Save (or change) the answer to one question.
//
// Rules:
//   - Body: question_id, selected_option (A–D or null), is_flagged_for_review (optional).
//   - Session must be in_progress and the question must be in session.question_ids.
//   - CBT: reject if now > expires_at + RULES.CBT_GRACE_SECONDS (5s): auto-submit and return 409 SESSION_EXPIRED.
//   - Upsert the Answer (unique per session + question). Copy user, subject, topic and question_version onto it. Set answered_at.
//   - Practice: count it toward the daily quota, then return is_correct, correct_option and explanation_text immediately.
//   - CBT: return only { saved: true }. NO correctness, answer or explanation.
//
// Spec: Tech Doc B3 (Sessions), B4.1, B4.4
export async function saveAnswer(req, res) {
  return notImplemented(res);
}
