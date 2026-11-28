// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { Assignment, Class } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { getPagination, paginationMeta } from '../../utils/pagination.js';
import {
  buildAssignmentResults,
  getClassStudents,
  getClassWeakTopics,
} from '../../services/classResultsService.js';

// GET /api/v1/classes/:id/results  (Approved teachers, own classes only)
// Assignments are paginated, because a class builds up many over a term
export async function getClassResults(req, res) {
  const q = matchedData(req, { locations: ['query'] });
  const { page, limit, skip } = getPagination(q);

  // No is_active filter, so a closed class still shows its results
  const classDoc = await Class.findOne({ _id: req.params.id, teacher: req.user._id })
    .populate('subject', 'name code')
    .lean();
  if (!classDoc) throw new AppError(404, 'CLASS_NOT_FOUND', 'This class was not found');

  const filter = { class: classDoc._id };
  const [students, assignments, total] = await Promise.all([
    getClassStudents(classDoc._id),
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

  const [assignmentResults, weakTopics] = await Promise.all([
    buildAssignmentResults(assignments, students),
    getClassWeakTopics(students, classDoc.subject?._id ?? null),
  ]);

  res.json({
    data: {
      class: { _id: classDoc._id, name: classDoc.name, subject: classDoc.subject },
      student_count: students.length,
      weak_topics: weakTopics,
      assignments: assignmentResults,
    },
    // Pagination is for the assignments
    pagination: paginationMeta({ page, limit }, total),
  });
}
