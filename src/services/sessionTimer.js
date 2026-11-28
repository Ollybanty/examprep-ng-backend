// to be handled by: Oladele Ogunyemi
import { Session } from '../models/index.js';
import { RULES, SESSION_MODES, SESSION_STATUS } from '../utils/constants.js';
import { finishSession } from './sessionService.js';

// CBT timer (DEC 02, Technical Documentation B4.1): the server saves expires_at when a mock
// starts, checks it on every request for that session, and a job every minute submits
// mocks nobody came back to. The app's countdown is only for display.

// Pass RULES.CBT_GRACE_SECONDS when checking a late answer. Practice never expires.
export function isExpired(session, graceSeconds = 0, now = new Date()) {
  if (session.mode !== SESSION_MODES.CBT || !session.expires_at) return false;
  return now.getTime() > session.expires_at.getTime() + graceSeconds * 1000;
}

// Lets the app restart its countdown after a refresh. Null for practice.
export function secondsRemaining(session, now = new Date()) {
  if (session.mode !== SESSION_MODES.CBT || !session.expires_at) return null;
  return Math.max(Math.floor((session.expires_at.getTime() - now.getTime()) / 1000), 0);
}

// Waits out the grace period too, so an answer sent in the last second is never lost
export async function autoSubmitIfExpired(session) {
  if (
    session.status === SESSION_STATUS.IN_PROGRESS &&
    isExpired(session, RULES.CBT_GRACE_SECONDS)
  ) {
    return finishSession(session, SESSION_STATUS.AUTO_SUBMITTED);
  }
  return session;
}

// Returns the student's running CBT mock, or null. A mock whose time ran out is submitted first.
export async function findRunningMock(userId) {
  const running = await Session.findOne({
    user: userId,
    mode: SESSION_MODES.CBT,
    status: SESSION_STATUS.IN_PROGRESS,
  });
  if (!running) return null;

  const current = await autoSubmitIfExpired(running);
  return current.status === SESSION_STATUS.IN_PROGRESS ? current : null;
}
