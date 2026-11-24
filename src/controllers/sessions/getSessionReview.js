// to be handled by: Oladele Ogunyemi
import { Session, Question, Answer } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { SESSION_STATUS } from '../../utils/constants.js';
import { autoSubmitIfExpired } from '../../services/sessionTimer.js';
import { buildResult } from '../../services/sessionView.js';

// GET /api/v1/sessions/:id/review  (Students, own sessions only)
// For a CBT mock, this is the only place answers are shown, and only after it's finished
export async function getSessionReview(req, res) {
  const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new AppError(404, 'SESSION_NOT_FOUND', 'This session was not found');

  const current = await autoSubmitIfExpired(session);

  // Showing answers while it runs would let a student look them up and go back
  if (current.status === SESSION_STATUS.IN_PROGRESS) {
    throw new AppError(
      409,
      'SESSION_IN_PROGRESS',
      'Submit this session first to see the answers and explanations',
    );
  }

  const [questions, answers, result] = await Promise.all([
    Question.find({ _id: { $in: current.question_ids } })
      .select('stem_text options year topic correct_option explanation_text')
      .populate('topic', 'name')
      .lean(),
    Answer.find({ session: current._id }).lean(),
    buildResult(current),
  ]);

  const questionById = new Map(questions.map((q) => [String(q._id), q]));
  const answerByQuestion = new Map(answers.map((a) => [String(a.question), a]));

  const items = current.question_ids.map((id, index) => {
    const question = questionById.get(String(id));
    const answer = answerByQuestion.get(String(id));
    const selected = answer?.selected_option ?? null;

    // For colours and filters in the app, e.g. "show only the ones I got wrong"
    let outcome = 'skipped';
    if (selected) outcome = answer.is_correct ? 'correct' : 'wrong';

    return {
      _id: id,
      number: index + 1,
      stem_text: question?.stem_text ?? null,
      options: question?.options ?? [],
      year: question?.year ?? null,
      topic: question?.topic ?? null,
      selected_option: selected,
      correct_option: question?.correct_option ?? null,
      is_correct: answer?.is_correct ?? false,
      outcome,
      is_flagged_for_review: answer?.is_flagged_for_review ?? false,
      explanation_text: question?.explanation_text ?? '',
    };
  });

  res.json({ data: { result, questions: items } });
}
