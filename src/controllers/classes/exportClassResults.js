// to be handled by: Oladele Ogunyemi
import { Assignment, Class } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { RULES } from '../../utils/constants.js';
import { toCsv } from '../../utils/csv.js';
import { buildAssignmentResults, getClassStudents } from '../../services/classResultsService.js';

// "2026-12-05 18:00" in Lagos time, which sorts correctly in a spreadsheet
const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('en-CA', {
        timeZone: RULES.QUOTA_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      })
        .format(date)
        .replace(',', '')
    : '';

// "SS3 Physics!" becomes "ss3-physics"
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'class';

const STATUS_LABELS = {
  completed: 'Completed',
  in_progress: 'In progress',
  not_started: 'Not started',
  missed: 'Missed',
};

// GET /api/v1/classes/:id/results/export  (Approved teachers, own classes only)
// Same data as GET /classes/:id/results, one row per student per assignment
export async function exportClassResults(req, res) {
  const classDoc = await Class.findOne({ _id: req.params.id, teacher: req.user._id }).lean();
  if (!classDoc) throw new AppError(404, 'CLASS_NOT_FOUND', 'This class was not found');

  const [students, assignments] = await Promise.all([
    getClassStudents(classDoc._id),
    Assignment.find({ class: classDoc._id })
      .sort({ deadline: -1 })
      .select('-question_ids')
      .populate('subject', 'name')
      .populate('topic', 'name')
      .lean(),
  ]);
  const results = await buildAssignmentResults(assignments, students);

  const headers = [
    'Assignment',
    'Subject',
    'Topic',
    'Type',
    'Deadline (Lagos time)',
    'Student',
    'Status',
    'Score',
    'Out of',
    'Percentage',
    'Submitted (Lagos time)',
  ];
  const rows = results.flatMap((a) =>
    a.students.map((s) => [
      a.title,
      a.subject?.name,
      a.topic?.name ?? 'All topics',
      a.mode === 'cbt' ? 'Timed' : 'Practice',
      formatDate(a.deadline),
      s.full_name,
      STATUS_LABELS[s.status],
      s.raw_score,
      s.total_questions,
      s.percentage,
      formatDate(s.submitted_at),
    ]),
  );

  const fileName = `${slugify(classDoc.name)}-results.csv`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  // The BOM tells Excel the file is UTF-8, so accented names show correctly
  res.send(`\uFEFF${toCsv(headers, rows)}`);
}
