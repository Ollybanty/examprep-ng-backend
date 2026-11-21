// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/questions/:id/bookmark
// Access: Student
//
// Task: Bookmark a question, or remove the bookmark if it already exists.
//
// Rules:
//   - Question must exist and be published.
//   - If a Bookmark exists for (user, question), delete it and return { bookmarked: false }; otherwise create it and return { bookmarked: true }.
//
// Spec: Tech Doc B3 (Question actions)
export async function toggleBookmark(req, res) {
  return notImplemented(res);
}
