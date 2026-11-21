// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/sessions/:id
// Access: Student (owner)
//
// Task: Get a session so the student can continue it (e.g. after a page refresh).
//
// Rules:
//   - Only the session owner (404 otherwise, so ids can't be probed).
//   - If it is a CBT session past expires_at and still in_progress, auto-submit it FIRST (sessionTimer.autoSubmitIfExpired).
//   - Return the questions (no answers), the student's saved selections and flags, and seconds_remaining for CBT.
//   - This is the QA check: "Refresh during mock preserves state".
//
// Spec: Tech Doc B4.1, B5 (CBT Timer)
export async function getSession(req, res) {
  return notImplemented(res);
}
