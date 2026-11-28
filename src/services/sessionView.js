// to be handled by: Oladele Ogunyemi

// What the student sees. Start and refresh both use this, so a refresh shows the same screen.
import { Answer, Question } from '../models/index.js';
import { SESSION_MODES, SESSION_STATUS } from '../utils/constants.js';
import { secondsRemaining } from './sessionTimer.js';
import { calculateScore } from './scoringService.js';

// correct_option and explanation_text are left out on purpose, so they can't leak
const SAFE_QUESTION_FIELDS = 'stem_text options year topic';

export async function buildSessionView(session) {
  const [questions, answers] = await Promise.all([
    Question.find({ _id: { $in: session.question_ids } })
      .select(SAFE_QUESTION_FIELDS)
      .populate('topic', 'name')
      .lean(),
    Answer.find({ session: session._id }).lean(),
  ]);

  const questionById = new Map(questions.map((q) => [String(q._id), q]));
  const answerByQuestion = new Map(answers.map((a) => [String(a.question), a]));

  const isPractice = session.mode === SESSION_MODES.PRACTICE;

  // Practice students already saw the answers to questions they answered, so show them again.
  // A mock never shows answers here, only in the review.
  const revealed = new Map();
  if (isPractice) {
    const answeredIds = answers.filter((a) => a.selected_option !== null).map((a) => a.question);
    const withAnswers = await Question.find({ _id: { $in: answeredIds } })
      .select('correct_option explanation_text')
      .lean();
    withAnswers.forEach((q) => revealed.set(String(q._id), q));
  }

  const items = session.question_ids.map((id, index) => {
    const question = questionById.get(String(id));
    const answer = answerByQuestion.get(String(id));
    const item = {
      _id: id,
      number: index + 1, // what the app shows: "Question 3 of 40"
      stem_text: question?.stem_text ?? null,
      options: question?.options ?? [],
      year: question?.year ?? null,
      topic: question?.topic ?? null,
      selected_option: answer?.selected_option ?? null,
      is_flagged_for_review: answer?.is_flagged_for_review ?? false,
    };

    const shown = revealed.get(String(id));
    if (shown) {
      item.is_correct = answer.is_correct;
      item.correct_option = shown.correct_option;
      item.explanation_text = shown.explanation_text;
    }
    return item;
  });

  const isFinished = session.status !== SESSION_STATUS.IN_PROGRESS;

  return {
    _id: session._id,
    mode: session.mode,
    status: session.status,
    assignment: session.assignment ?? null,
    exam: session.exam,
    subject: session.subject,
    filters: session.filters,
    started_at: session.started_at,
    expires_at: session.expires_at,
    // The app restarts its countdown from this after a refresh
    seconds_remaining: isFinished ? null : secondsRemaining(session),
    total_questions: session.total_questions,
    answered_count: answers.filter((a) => a.selected_option !== null).length,
    // Counted from the answers, like buildResult below
    ...(isFinished && {
      submitted_at: session.submitted_at,
      ...calculateScore(answers.filter((a) => a.is_correct).length, session.question_ids.length),
    }),
    questions: items,
  };
}

// The result screen: score, plus how many were right, wrong or skipped
export async function buildResult(session) {
  // Counted from the answers, which can't change once a session is finished. Reading the
  // session instead would show an empty score if two submits arrive at the same moment.
  const [correct, answered] = await Promise.all([
    Answer.countDocuments({ session: session._id, is_correct: true }),
    // A cleared CBT answer counts as skipped
    Answer.countDocuments({ session: session._id, selected_option: { $ne: null } }),
  ]);
  const score = calculateScore(correct, session.question_ids.length);

  return {
    session_id: session._id,
    mode: session.mode,
    status: session.status,
    submitted_at: session.submitted_at,
    ...score,
    correct,
    wrong: answered - correct,
    skipped: score.total_questions - answered, // never answered, or cleared
  };
}
