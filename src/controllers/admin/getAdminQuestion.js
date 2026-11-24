// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/admin/questions/:id
// Access: Admin
//
// Task: Get one question with its version history.
//
// Rules:
//   - Include QuestionVersion records for this question, newest first.
//
// Spec: Brief: question versions
export async function getAdminQuestion(req, res) {
  return notImplemented(res);
}
