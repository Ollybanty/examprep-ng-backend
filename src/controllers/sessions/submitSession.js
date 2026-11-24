// to be handled by: Oladele Ogunyemi
import { Session } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { SESSION_STATUS } from '../../utils/constants.js';
import { finishSession } from '../../services/sessionService.js';
import { autoSubmitIfExpired } from '../../services/sessionTimer.js';
import { buildResult } from '../../services/sessionView.js';

// POST /api/v1/sessions/:id/submit  (Students, own sessions only)
export async function submitSession(req, res) {
  const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new AppError(404, 'SESSION_NOT_FOUND', 'This session was not found');

  // Already finished (a double tap, or the timer got there first): reply with the same result
  if (session.status !== SESSION_STATUS.IN_PROGRESS) {
    return res.json({
      message: 'This session was already submitted',
      data: { result: await buildResult(session) },
    });
  }

  // A mock submitted after its time ran out is recorded as auto submitted
  let finished = await autoSubmitIfExpired(session);
  if (finished.status === SESSION_STATUS.IN_PROGRESS) {
    finished = await finishSession(session, SESSION_STATUS.SUBMITTED);
  }

  res.json({
    message:
      finished.status === SESSION_STATUS.AUTO_SUBMITTED
        ? 'Time was up, so your mock was submitted automatically'
        : 'Submitted',
    data: { result: await buildResult(finished) },
  });
}
