// to be handled by: Oladele Ogunyemi
import { Answer, Mastery } from '../models/index.js';
import { MASTERY_STATUS, RULES } from '../utils/constants.js';

// Weighted mastery based on the technical doc. Newer answers count more, so a student
// who improves sees the topic improve quickly. Example, oldest first:
//   wrong, wrong, right, right, right with weights 1 to 5 = (3+4+5) / 15 = 80% (strong)

// results: is_correct values, oldest first. Returns 0 to 100 with one decimal, or null if empty.
export function calculateWeightedAccuracy(results) {
  if (results.length === 0) return null;

  let earned = 0;
  let possible = 0;
  results.forEach((isCorrect, index) => {
    const weight = index + 1;
    possible += weight;
    if (isCorrect) earned += weight;
  });

  return Math.round((earned / possible) * 1000) / 10;
}

export function classifyMastery(attemptsCount, weightedAccuracy) {
  if (attemptsCount < RULES.MASTERY_MIN_ATTEMPTS || weightedAccuracy === null) {
    return MASTERY_STATUS.UNRATED;
  }
  if (weightedAccuracy < RULES.MASTERY_WEAK_BELOW) return MASTERY_STATUS.WEAK;
  if (weightedAccuracy < RULES.MASTERY_STRONG_FROM) return MASTERY_STATUS.DEVELOPING;
  return MASTERY_STATUS.STRONG;
}

// Always recalculates from the latest answers, so running it twice gives the same result
export async function updateTopicMastery(userId, subjectId, topicId) {
  const latest = await Answer.find({
    user: userId,
    topic: topicId,
    selected_option: { $ne: null }, // skipped questions tell us nothing
  })
    .sort({ answered_at: -1 })
    .limit(RULES.MASTERY_WINDOW)
    .select('is_correct');

  // The weights need oldest first
  const results = latest.reverse().map((answer) => answer.is_correct);

  const weightedAccuracy = calculateWeightedAccuracy(results);
  const status = classifyMastery(results.length, weightedAccuracy);

  return Mastery.findOneAndUpdate(
    { user: userId, topic: topicId },
    {
      subject: subjectId,
      attempts_count: results.length,
      weighted_accuracy: status === MASTERY_STATUS.UNRATED ? null : weightedAccuracy,
      status,
      last_calculated_at: new Date(),
    },
    { upsert: true, returnDocument: 'after' },
  );
}

export async function updateMasteryForSession(session) {
  const topicIds = await Answer.distinct('topic', {
    session: session._id,
    topic: { $ne: null }, // imported questions may not have a topic yet
    selected_option: { $ne: null },
  });

  await Promise.all(
    topicIds.map((topicId) => updateTopicMastery(session.user, session.subject, topicId)),
  );

  return topicIds.length;
}
