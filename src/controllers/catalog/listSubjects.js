// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';
import { Subject} from '../../models/index.js';

// GET /api/v1/subjects
// Access: Logged in
//
// Task: List subjects, optionally filtered by exam.
//
// Rules:
//   - Query: ?exam=<exam id> (optional).
//   - Only is_active subjects.
//
// Spec: PRD (Core Subjects)
export async function listSubjects(req, res) {
  const subjects = await Subject.find({is_active: true})
  .select("name code description exams ")
  .populate("exams", "name code")
  .sort({name:1});
  res.json({data:subjects})
}