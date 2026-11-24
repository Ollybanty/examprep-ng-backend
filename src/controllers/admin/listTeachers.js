// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { User } from '../../models/index.js';
import { ROLES } from '../../utils/constants.js';
import { getPagination, paginationMeta } from '../../utils/pagination.js';

// GET /api/v1/admin/teachers  (Admin)
export async function listTeachers(req, res) {
  const q = matchedData(req, { locations: ['query'] });
  const { page, limit, skip } = getPagination(q);

  const filter = { role: ROLES.TEACHER };
  if (q.status) filter.teacher_status = q.status;

  const [teachers, total] = await Promise.all([
    User.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({ data: teachers, pagination: paginationMeta({ page, limit }, total) });
}
