// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// PATCH /api/v1/admin/questions/:id
// Access: Admin
//
// Task: Edit a question.
//
// Rules:
//   - If the question has been published before (version history matters): save the current content as a QuestionVersion FIRST, then increase version.
//   - Load → change fields → question.save() (NOT findByIdAndUpdate, or the content gate is skipped).
//   - Body: any of the fields from createQuestion, plus reason (why it changed).
//
// Spec: Tech Doc B3 (Admin CMS); Brief: corrected question is versioned
export async function updateQuestion(req, res) {
  return notImplemented(res);
}
