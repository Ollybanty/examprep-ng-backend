// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { Session } from '../../models/index.js';
import { SESSION_MODES, SESSION_STATUS } from '../../utils/constants.js';
import { autoSubmitIfExpired } from '../../services/sessionTimer.js';
import { getPagination, paginationMeta } from '../../utils/pagination.js';

// GET /api/v1/sessions/history  (Students)
// Running sessions are included so the app can offer "continue"
export async function getSessionHistory(req, res) {
  const q = matchedData(req, { locations: ['query'] });
  const { page, limit, skip } = getPagination(q);

  const filter = { user: req.user._id };
  if (q.mode) filter.mode = q.mode;
  if (q.subject_id) filter.subject = q.subject_id;

  const [sessions, total] = await Promise.all([
    Session.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('exam', 'name code')
      .populate('subject', 'name code'),
    Session.countDocuments(filter),
  ]);

  // A mock that ran out while the student was away is submitted, so it never shows as running
  const checked = await Promise.all(
    sessions.map((s) =>
      s.mode === SESSION_MODES.CBT && s.status === SESSION_STATUS.IN_PROGRESS
        ? autoSubmitIfExpired(s)
        : s,
    ),
  );

  // An auto submitted session comes back without the exam and subject names, so fill them in again
  await Session.populate(checked, [
    { path: 'exam', select: 'name code' },
    { path: 'subject', select: 'name code' },
  ]);

  const data = checked.map((s) => ({
    _id: s._id,
    mode: s.mode,
    exam: s.exam,
    subject: s.subject,
    status: s.status,
    raw_score: s.raw_score,
    total_questions: s.total_questions,
    percentage: s.percentage,
    started_at: s.started_at,
    submitted_at: s.submitted_at,
  }));

  res.json({ data, pagination: paginationMeta({ page, limit }, total) });
}
