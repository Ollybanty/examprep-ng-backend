// to be handled by:
// The CBT timer (DEC-02: server timestamps, no Redis). See Technical Documentation B4.1.
//
// How it works:
//   1. When a CBT mock starts, the server saves expires_at = started_at + duration.
//   2. Every request for that session first calls autoSubmitIfExpired() (the "lazy" check).
//   3. A cron job (src/jobs/autoSubmitJob.js) runs every minute and submits mocks nobody came back to.

// True when a CBT session's time is up. Practice sessions never expire.
// Pass graceSeconds = RULES.CBT_GRACE_SECONDS when checking a late answer.
export function isExpired(session, graceSeconds = 0) {
  throw new Error('isExpired is not implemented yet');
}

// If the session is an expired, in-progress CBT mock: score it (scoringService),
// set status "auto_submitted" and submitted_at, update mastery, and return the updated session.
// Otherwise return the session unchanged.
export async function autoSubmitIfExpired(session) {
  throw new Error('autoSubmitIfExpired is not implemented yet');
}
