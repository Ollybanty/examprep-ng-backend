// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/admin/analytics
// Access: Admin
//
// Task: Simple usage numbers for the admin dashboard.
//
// Rules:
//   - Counts: users by role, sessions completed this week, questions answered this week, active students this week, questions by status, open reports.
//   - North Star: practice sessions completed per active student per week.
//
// Spec: PRD 5 (North Star); Brief: view usage analytics
export async function getUsageAnalytics(req, res) {
  return notImplemented(res);
}
