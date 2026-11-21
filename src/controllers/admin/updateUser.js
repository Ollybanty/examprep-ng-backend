// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// PATCH /api/v1/admin/users/:id
// Access: Admin
//
// Task: Activate/deactivate a user or change their plan.
//
// Rules:
//   - Body: is_active, plan_tier ("free" | "pro", used for testing Pro until payments exist).
//   - An admin can't deactivate themselves.
//
// Spec: Brief: manage users; PRD 5 (Pricing)
export async function updateUser(req, res) {
  return notImplemented(res);
}
