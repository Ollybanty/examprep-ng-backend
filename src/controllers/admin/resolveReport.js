// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// PATCH /api/v1/admin/reports/:id
// Access: Admin
//
// Task: Resolve or reject a report.
//
// Rules:
//   - Body: action ("resolve" | "reject"), resolution (note).
//   - Fixing the question itself is done with updateQuestion first.
//   - Set status, resolution, resolved_by, resolved_at.
//   - If no other open reports remain for the question, set it back to "published" (question.save()).
//   - Email the student who reported it.
//
// Spec: Users Guide 3.5; Brief: reporter is notified
export async function resolveReport(req, res) {
  return notImplemented(res);
}
