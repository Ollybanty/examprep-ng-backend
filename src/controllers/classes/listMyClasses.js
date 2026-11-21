// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// GET /api/v1/classes
// Access: Teacher or student
//
// Task: List classes: a teacher sees classes they created, a student sees classes they joined.
//
// Rules:
//   - Teacher: Class.find({ teacher: req.user._id }) with a member count.
//   - Student: find their ClassMember records and return those classes (no join codes needed).
//
// Spec: Users Guide 3.4
export async function listMyClasses(req, res) {
  return notImplemented(res);
}
