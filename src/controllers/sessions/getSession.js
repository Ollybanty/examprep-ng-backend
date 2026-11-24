// to be handled by: Oladele Ogunyemi
import { Session } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { autoSubmitIfExpired } from '../../services/sessionTimer.js';
import { buildSessionView } from '../../services/sessionView.js';

// GET /api/v1/sessions/:id  (Students, own sessions only)
export async function getSession(req, res) {
  const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new AppError(404, 'SESSION_NOT_FOUND', 'This session was not found');

  // A mock whose time ran out is submitted before we reply
  const current = await autoSubmitIfExpired(session);

  res.json({ data: { session: await buildSessionView(current) } });
}
