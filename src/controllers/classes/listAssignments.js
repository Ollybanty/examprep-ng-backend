// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { Assignment, Class, ClassMember } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { ROLES } from '../../utils/constants.js';
import { getPagination, paginationMeta } from '../../utils/pagination.js';
import { countCompleted, getStudentAssignmentStatuses } from '../../services/assignmentService.js';

// GET /api/v1/classes/:id/assignments  (The class's teacher, or its students)
// The teacher also gets completion counts, a student their own progress
export async function listAssignments(req, res) {
  const q = matchedData(req, { locations: ['query'] });
  const { page, limit, skip } = getPagination(q);
  const isTeacher = req.user.role === ROLES.TEACHER;

  const classDoc = isTeacher
    ? await Class.findOne({ _id: req.params.id, teacher: req.user._id })
    : await Class.findOne({ _id: req.params.id, is_active: true });
  if (!classDoc) throw new AppError(404, 'CLASS_NOT_FOUND', 'This class was not found');
  if (!isTeacher) {
    const isMember = await ClassMember.exists({ class: classDoc._id, student: req.user._id });
    if (!isMember) throw new AppError(404, 'CLASS_NOT_FOUND', 'This class was not found');
  }

  const filter = { class: classDoc._id };
  const [assignments, total] = await Promise.all([
    Assignment.find(filter)
      .sort({ deadline: -1 })
      .skip(skip)
      .limit(limit)
      .select('-question_ids')
      .populate('exam', 'name code')
      .populate('subject', 'name code')
      .populate('topic', 'name')
      .lean(),
    Assignment.countDocuments(filter),
  ]);

  const now = new Date();
  const base = (a) => ({
    _id: a._id,
    title: a.title,
    exam: a.exam,
    subject: a.subject,
    topic: a.topic,
    mode: a.mode,
    question_count: a.question_count,
    duration_minutes: a.duration_minutes,
    deadline: a.deadline,
    is_open: a.deadline > now, // can it still be started?
    created_at: a.created_at,
  });

  let data;
  if (isTeacher) {
    const [completed, studentCount] = await Promise.all([
      countCompleted(assignments.map((a) => a._id)),
      ClassMember.countDocuments({ class: classDoc._id }),
    ]);
    data = assignments.map((a) => ({
      ...base(a),
      completed_count: completed.get(String(a._id)) ?? 0,
      student_count: studentCount,
    }));
  } else {
    const statuses = await getStudentAssignmentStatuses(req.user._id, assignments);
    data = assignments.map((a) => ({ ...base(a), my_progress: statuses.get(String(a._id)) }));
  }

  res.json({ data, pagination: paginationMeta({ page, limit }, total) });
}
