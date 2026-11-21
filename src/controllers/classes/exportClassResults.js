// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/classes/:id/results/export
// Access: Approved teacher (class owner)
//
// Task: Download class results as a CSV file.
//
// Rules:
//   - Same data as getClassResults, one row per student per assignment.
//   - Set headers: Content-Type text/csv and Content-Disposition attachment; filename="class-results.csv".
//
// Spec: PRD 4B.3 (simple report export)
export async function exportClassResults(req, res) {
  return notImplemented(res);
}
