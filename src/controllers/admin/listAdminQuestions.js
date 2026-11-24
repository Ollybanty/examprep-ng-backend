// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/admin/questions
// Access: Admin
//
// Task: List all questions (any status) for the admin panel.
//
// Rules:
//   - Query: status, exam, subject, topic, year, search (in stem_text), page, limit.
//   - Admins DO see correct_option and explanation_text.
//
// Spec: Tech Doc B3 (Admin CMS)
export async function listAdminQuestions(req, res) {
  return notImplemented(res);
}
