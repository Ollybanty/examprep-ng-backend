// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { User } from '../../models/index.js';
import { getPagination, paginationMeta } from '../../utils/pagination.js';

// Treats the search as plain text, so characters like . and * can't match everything or slow the database
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/v1/admin/users  (Admin)
export async function listUsers(req, res) {
  // In Express 5, cleaned query values (like page as a number) are in matchedData, not req.query
  const q = matchedData(req, { locations: ['query'] });
  const { page, limit, skip } = getPagination(q);

  const filter = {};
  if (q.role) filter.role = q.role;
  if (q.search) {
    const pattern = new RegExp(escapeRegex(q.search), 'i');
    filter.$or = [{ full_name: pattern }, { email: pattern }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({ data: users, pagination: paginationMeta({ page, limit }, total) });
}
