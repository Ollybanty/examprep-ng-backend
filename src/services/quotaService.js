// to be handled by: Oladele Ogunyemi
import { UsageCounter } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { PLAN_TIERS, RULES } from '../utils/constants.js';

// Free plan: 15 practice questions a day, 1 CBT mock a month. Pro: unlimited.
// Days and months follow Lagos time (DEC 05), so limits reset at midnight WAT.

// 'en-CA' formats dates as 2026-11-21, the key format we store
const lagosDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: RULES.QUOTA_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function getPeriodKeys(date = new Date()) {
  const dayKey = lagosDate.format(date);
  return { dayKey, monthKey: dayKey.slice(0, 7) };
}

const isPro = (user) => user.plan_tier === PLAN_TIERS.PRO;

const PRACTICE_LIMIT_MESSAGE = `Free plan: ${RULES.FREE_PRACTICE_PER_DAY} practice questions a day. Come back tomorrow or upgrade to Pro`;
const CBT_LIMIT_MESSAGE = `Free plan: ${RULES.FREE_CBT_PER_MONTH} CBT mock a month. Upgrade to Pro for unlimited mocks`;

const quotaError = (message) => new AppError(403, 'QUOTA_EXCEEDED', message);

// Infinity for Pro. startSession uses this to shorten a session when few questions are left.
export async function getPracticeRemaining(user) {
  if (isPro(user)) return Infinity;

  const { dayKey } = getPeriodKeys();
  const counter = await UsageCounter.findOne({
    user: user._id,
    period_type: 'day',
    period_key: dayKey,
  });

  const used = counter?.practice_questions_answered ?? 0;
  return Math.max(RULES.FREE_PRACTICE_PER_DAY - used, 0);
}

export async function checkPracticeQuota(user) {
  if ((await getPracticeRemaining(user)) === 0) throw quotaError(PRACTICE_LIMIT_MESSAGE);
}

// Checks the limit and adds 1 in one database step, so two quick requests can't both pass at 14
async function incrementIfUnder(user, periodType, periodKey, field, limit) {
  const key = { user: user._id, period_type: periodType, period_key: periodKey };

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await UsageCounter.findOneAndUpdate(
        { ...key, [field]: { $lt: limit } },
        { $inc: { [field]: 1 } },
        { upsert: true },
      );
      return true;
    } catch (err) {
      if (err.code !== 11000) throw err;

      // 11000 means the row exists: either we're at the limit, or another request created
      // today's first row a moment before us. The real count tells us which one.
      const current = await UsageCounter.findOne(key);
      if (current && current[field] >= limit) return false;
    }
  }
  return false;
}

// Called the first time a free student answers a practice question
export async function usePracticeQuestion(user) {
  if (isPro(user)) return;

  const { dayKey } = getPeriodKeys();
  const added = await incrementIfUnder(
    user,
    'day',
    dayKey,
    'practice_questions_answered',
    RULES.FREE_PRACTICE_PER_DAY,
  );
  if (!added) throw quotaError(PRACTICE_LIMIT_MESSAGE);
}

export async function useCbtQuota(user) {
  if (isPro(user)) return;

  const { monthKey } = getPeriodKeys();
  const added = await incrementIfUnder(
    user,
    'month',
    monthKey,
    'cbt_mocks_started',
    RULES.FREE_CBT_PER_MONTH,
  );
  if (!added) throw quotaError(CBT_LIMIT_MESSAGE);
}
