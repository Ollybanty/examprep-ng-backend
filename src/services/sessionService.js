// to be handled by: Oladele Ogunyemi
import { Session } from '../models/index.js';
import { SESSION_STATUS } from '../utils/constants.js';
import { scoreSession } from './scoringService.js';
import { updateMasteryForSession } from './masteryService.js';

// Used by both submit and auto submit, so they always score the same way
export async function finishSession(session, status) {
  // Claims the session only if it's still in progress. If submit and auto submit happen
  // at the same moment, only one gets it back and the other stops here.
  const claimed = await Session.findOneAndUpdate(
    { _id: session._id, status: SESSION_STATUS.IN_PROGRESS },
    { status, submitted_at: new Date() },
    { returnDocument: 'after' },
  );
  if (!claimed) return Session.findById(session._id);

  await scoreSession(claimed);
  await claimed.save();
  await updateMasteryForSession(claimed);

  return claimed;
}
