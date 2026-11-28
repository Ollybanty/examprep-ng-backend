// to be handled by: Taiwo Ganiyu
import { Exam } from '../../models/index.js';

// GET /api/v1/exams
// Access: Logged in
// Only active exams, with what the app needs to show each one
export async function listExams(req, res) {
  const exams = await Exam.find({ is_active: true })
    .select('name code cbt_duration_minutes cbt_question_count')
    .sort({ name: 1 });
  res.json({ data: exams });
}
