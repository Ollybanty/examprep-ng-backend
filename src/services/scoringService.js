// to be handled by: Oladele Ogunyemi
import { Answer } from '../models/index.js';

// PRD section 5: +1 for a correct answer, 0 for wrong or skipped, e.g. 24/30 = 80%
export function calculateScore(correctCount, total) {
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  return { raw_score: correctCount, total_questions: total, percentage };
}

// Copies the score onto the session without saving it. finishSession saves it with the status.
export async function scoreSession(session) {
  const correctCount = await Answer.countDocuments({ session: session._id, is_correct: true });

  // question_ids is fixed at the start, so questions never answered still count as 0
  const score = calculateScore(correctCount, session.question_ids.length);

  Object.assign(session, score);
  return score;
}
