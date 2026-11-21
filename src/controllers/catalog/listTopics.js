// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/topics
// Access: Logged in
//
// Task: List the topics in a subject.
//
// Rules:
//   - Query: ?subject=<subject id> (required, 400 if missing).
//   - Only is_active topics, sorted by name.
//
// Spec: Tech Doc B2.1
export async function listTopics(req, res) {
  return notImplemented(res);
}
