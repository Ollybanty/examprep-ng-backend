// Tests for the Block 3 rules. Run them with: npm test
// node:test and node:assert are built into Node, so there's nothing to install.
// These only test pure functions, so they don't need a database or a .env file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore } from '../src/services/scoringService.js';
import { calculateWeightedAccuracy, classifyMastery } from '../src/services/masteryService.js';
import { getPeriodKeys } from '../src/services/quotaService.js';
import { isExpired, secondsRemaining } from '../src/services/sessionTimer.js';

// ---------- Scoring: +1 correct, 0 wrong or skipped ----------

test('score: 24 right out of 30 is 80%', () => {
  assert.deepEqual(calculateScore(24, 30), { raw_score: 24, total_questions: 30, percentage: 80 });
});

test('score: percentages are rounded to whole numbers', () => {
  assert.equal(calculateScore(2, 3).percentage, 67); // 66.67 rounds up
  assert.equal(calculateScore(1, 3).percentage, 33); // 33.33 rounds down
});

test('score: all skipped is 0%, and no questions never divides by zero', () => {
  assert.equal(calculateScore(0, 40).percentage, 0);
  assert.equal(calculateScore(0, 0).percentage, 0);
});

// ---------- Mastery: weighted accuracy (Technical Documentation B4.2) ----------

test('mastery: the example from the docs is 80%', () => {
  // wrong, wrong, right, right, right (oldest first): 12/15
  assert.equal(calculateWeightedAccuracy([false, false, true, true, true]), 80);
});

test('mastery: newer answers count more than older ones', () => {
  const improving = calculateWeightedAccuracy([false, false, false, true, true, true]);
  const slipping = calculateWeightedAccuracy([true, true, true, false, false, false]);
  assert.ok(improving > slipping, `${improving} should be higher than ${slipping}`);
  assert.equal(improving, 71.4); // (4+5+6) / 21 = 71.43%
  assert.equal(slipping, 28.6); // (1+2+3) / 21 = 28.57%
});

test('mastery: no answers gives null, all right gives 100', () => {
  assert.equal(calculateWeightedAccuracy([]), null);
  assert.equal(calculateWeightedAccuracy([true, true, true, true, true]), 100);
});

test('mastery: under 5 answers is unrated, even at 100%', () => {
  assert.equal(classifyMastery(4, 100), 'unrated');
  assert.equal(classifyMastery(0, null), 'unrated');
});

test('mastery: 5 or more answers are classified at the 60 and 80 boundaries', () => {
  assert.equal(classifyMastery(5, 59.9), 'weak');
  assert.equal(classifyMastery(5, 60), 'developing');
  assert.equal(classifyMastery(5, 79.9), 'developing');
  assert.equal(classifyMastery(5, 80), 'strong');
});

// ---------- Quota: days and months in Lagos time ----------

test('quota: the day changes at midnight Lagos time, not midnight UTC', () => {
  // Lagos is UTC+1, so 22:59 UTC is 23:59 in Lagos (still the 23rd)
  assert.equal(getPeriodKeys(new Date('2026-11-23T22:59:59Z')).dayKey, '2026-11-23');
  // and 23:00 UTC is already midnight on the 24th in Lagos
  assert.equal(getPeriodKeys(new Date('2026-11-23T23:00:00Z')).dayKey, '2026-11-24');
});

test('quota: the month changes at midnight Lagos time too', () => {
  assert.deepEqual(getPeriodKeys(new Date('2026-11-30T23:30:00Z')), {
    dayKey: '2026-12-01',
    monthKey: '2026-12',
  });
});

// ---------- CBT timer ----------

const cbt = (expiresAt) => ({ mode: 'cbt', expires_at: new Date(expiresAt) });
const END = '2026-11-24T10:30:00Z';

test('timer: a mock is not expired before its end time', () => {
  assert.equal(isExpired(cbt(END), 0, new Date('2026-11-24T10:29:59Z')), false);
});

test('timer: a mock is expired right after its end time', () => {
  assert.equal(isExpired(cbt(END), 0, new Date('2026-11-24T10:30:01Z')), true);
});

test('timer: answers up to 5 seconds late are still accepted, 6 seconds is too late', () => {
  assert.equal(isExpired(cbt(END), 5, new Date('2026-11-24T10:30:05Z')), false);
  assert.equal(isExpired(cbt(END), 5, new Date('2026-11-24T10:30:06Z')), true);
});

test('timer: practice sessions never expire', () => {
  assert.equal(isExpired({ mode: 'practice', expires_at: null }), false);
  assert.equal(secondsRemaining({ mode: 'practice', expires_at: null }), null);
});

test('timer: seconds remaining counts down and stops at 0', () => {
  assert.equal(secondsRemaining(cbt(END), new Date('2026-11-24T10:00:00Z')), 1800); // 30 minutes
  assert.equal(secondsRemaining(cbt(END), new Date('2026-11-24T10:45:00Z')), 0);
});
