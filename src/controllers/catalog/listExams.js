// to be handled by: Taiwo Ganiyu
import { notImplemented } from '../../utils/notImplemented.js';
import { Exam } from '../../models/Exam.js';
// GET /api/v1/exams
// Access: Logged in
//
// Task: List the active exams (JAMB, WAEC).
//
// Rules:
//   - Only is_active exams. Return name, code, cbt_duration_minutes, cbt_question_count.
//
// Spec: PRD (Target Exams)

export async function listSubjects(req, res) {
  const exams = await Exam.find({
    is_active: true,
  })
    .select('name code, cbt_duration_minutes, cbt_question_count')
    .sort({ name: 1 });
  res.json({ data: exams });
}
