// to be handled by:
// Weighted weak-topic mastery. See Technical Documentation B4.2.
//
// Example: 5 answers in a topic, oldest first: wrong, wrong, right, right, right
//   weights:            1      2      3      4      5   (newer answers count more)
//   weighted accuracy = (0×1 + 0×2 + 1×3 + 1×4 + 1×5) / (1+2+3+4+5) × 100 = 12/15 × 100 = 80% → strong

// Pure function: takes is_correct values OLDEST FIRST (max 30) and returns the weighted accuracy (0–100).
// Weight of the i-th answer = i (1 for the oldest).
export function calculateWeightedAccuracy(results) {
  throw new Error('calculateWeightedAccuracy is not implemented yet');
}

// Pure function: returns 'unrated' | 'weak' | 'developing' | 'strong' (MASTERY_STATUS).
//   fewer than RULES.MASTERY_MIN_ATTEMPTS (5) answers → unrated
//   below 60 → weak;  60–79.99 → developing;  80 and above → strong
export function classifyMastery(attemptsCount, weightedAccuracy) {
  throw new Error('classifyMastery is not implemented yet');
}

// After a session is submitted: for every topic in the session, load the student's last 30
// answers in that topic (Answer, newest first, then reverse to oldest first), calculate,
// classify, and upsert the Mastery document (user + topic).
export async function updateMasteryForSession(session) {
  throw new Error('updateMasteryForSession is not implemented yet');
}
