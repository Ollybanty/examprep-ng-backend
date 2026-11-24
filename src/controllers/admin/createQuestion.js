// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/admin/questions
// Access: Admin
//
// Task: Create one question.
//
// Rules:
//   - Body: exam_id, subject_id, topic_id, year, stem_text, options [{label, text}], correct_option, explanation_text.
//   - Saved as "draft" with source "manual" and created_by = req.user._id.
//   - The model already checks correct_option matches an option.
//
// Spec: Tech Doc B3 (Admin CMS)
export async function createQuestion(req, res) {
  return notImplemented(res);
}
