// to be handled by:
// Scoring rule (PRD section 5): +1 for a correct answer, 0 for wrong or skipped.
// Display: raw score and percentage, e.g. 24/30 = 80%.

// Score a session from its Answer documents and save the result on the session.
//   - raw_score = number of answers with is_correct true
//   - total_questions = session.question_ids.length (unanswered questions count as 0)
//   - percentage = Math.round((raw_score / total_questions) * 100)
// Returns { raw_score, total_questions, percentage }.
export async function scoreSession(session) {
  throw new Error('scoreSession is not implemented yet');
}
