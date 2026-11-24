// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/admin/reports
// Access: Admin
//
// Task: The error review queue.
//
// Rules:
//   - Query: status (default "open"), page, limit.
//   - Oldest first. Populate the question (with answer and explanation) and the reporter's name.
//
// Spec: PRD 4C.2; Users Guide 3.5
export async function listReports(req, res) {
  return notImplemented(res);
}
