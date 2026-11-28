// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { Class, ClassMember } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { getPagination, paginationMeta } from '../../utils/pagination.js';

// GET /api/v1/classes/:id/students  (Approved teachers, own classes only)
export async function listClassStudents(req, res) {
  const q = matchedData(req, { locations: ['query'] });
  const { page, limit, skip } = getPagination(q);

  const found = await Class.exists({ _id: req.params.id, teacher: req.user._id });
  if (!found) throw new AppError(404, 'CLASS_NOT_FOUND', 'This class was not found');

  const filter = { class: req.params.id };
  const [members, total] = await Promise.all([
    ClassMember.find(filter)
      .sort({ joined_at: -1 })
      .skip(skip)
      .limit(limit)
      // Names only. Teachers don't need student emails.
      .populate('student', 'full_name')
      .lean(),
    ClassMember.countDocuments(filter),
  ]);

  const data = members
    .filter((m) => m.student)
    .map((m) => ({
      _id: m.student._id,
      full_name: m.student.full_name,
      joined_at: m.joined_at,
    }));

  res.json({ data, pagination: paginationMeta({ page, limit }, total) });
}
