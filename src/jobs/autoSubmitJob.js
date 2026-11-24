// to be handled by: Oladele Ogunyemi
import cron from 'node-cron';
import { Session } from '../models/index.js';
import { RULES, SESSION_MODES, SESSION_STATUS } from '../utils/constants.js';
import { autoSubmitIfExpired } from '../services/sessionTimer.js';

// Leftovers are picked up a minute later, so a big backlog can't block the server
const BATCH_SIZE = 200;

// Submits mocks still in progress after their time and the grace ran out,
// e.g. a student closed the app and never came back
export async function sweepExpiredMocks(now = new Date()) {
  const cutoff = new Date(now.getTime() - RULES.CBT_GRACE_SECONDS * 1000);

  const expired = await Session.find({
    mode: SESSION_MODES.CBT,
    status: SESSION_STATUS.IN_PROGRESS,
    expires_at: { $lt: cutoff },
  }).limit(BATCH_SIZE);

  let submitted = 0;
  for (const session of expired) {
    try {
      // The same function as the lazy check, and safe if the student submits at the same moment
      const result = await autoSubmitIfExpired(session);
      if (result.status === SESSION_STATUS.AUTO_SUBMITTED) submitted += 1;
    } catch (err) {
      // One broken session shouldn't stop the others
      console.error(`Auto submit failed for session ${session._id}:`, err.message);
    }
  }
  return submitted;
}

export function startAutoSubmitJob() {
  let isRunning = false;

  return cron.schedule('* * * * *', async () => {
    // Every minute. If a run takes longer, the next one is skipped instead of overlapping.
    if (isRunning) return;
    isRunning = true;
    try {
      const count = await sweepExpiredMocks();
      if (count > 0) console.log(`Auto submitted ${count} expired mock(s)`);
    } catch (err) {
      console.error('Auto submit job failed:', err.message);
    } finally {
      isRunning = false;
    }
  });
}
