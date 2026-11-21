// to be handled by:
// Free-plan limits, enforced on the server (Technical Documentation B4.4, PRD section 5).
//   Free: 15 practice questions per day, 1 CBT mock per month.  Pro: unlimited.
// Days and months are counted in Lagos time (DEC-05, confirmed), so limits reset at 00:00 WAT.

// Returns { dayKey: '2026-11-21', monthKey: '2026-11' } for the given date in Africa/Lagos time.
// Tip: new Intl.DateTimeFormat('en-CA', { timeZone: RULES.QUOTA_TIMEZONE }).format(date) gives '2026-11-21'.
export function getPeriodKeys(date = new Date()) {
  throw new Error('getPeriodKeys is not implemented yet');
}

// Throw AppError(403, 'QUOTA_EXCEEDED', ...) if a free user has already answered
// RULES.FREE_PRACTICE_PER_DAY practice questions today. Pro users always pass.
export async function checkPracticeQuota(user) {
  throw new Error('checkPracticeQuota is not implemented yet');
}

// Add 1 to today's practice_questions_answered (UsageCounter, upsert).
export async function recordPracticeAnswer(user) {
  throw new Error('recordPracticeAnswer is not implemented yet');
}

// Throw AppError(403, 'QUOTA_EXCEEDED', ...) if a free user has already started
// RULES.FREE_CBT_PER_MONTH mock(s) this month. Otherwise add 1 to cbt_mocks_started.
export async function useCbtQuota(user) {
  throw new Error('useCbtQuota is not implemented yet');
}
