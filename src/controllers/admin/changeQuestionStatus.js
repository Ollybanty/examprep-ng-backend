// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';

// PATCH /api/v1/admin/questions/:id/status
// Access: Admin
//
// Task: Move a question through Draft → Reviewed → Published.
//
// Rules:
//   - Body: status.
//   - Allowed moves: draft→reviewed, reviewed→published, reviewed→draft, flagged→published (after fixing), published→draft (unpublish).
//   - Publishing without explanation_text or topic fails (the model enforces it). This is a QA check.
//
// Spec: PRD 5 (Question Quality Rule); Tech Doc B5 (Content Gate)
export async function changeQuestionStatus(req, res) {
  return notImplemented(res);
}
