// to be handled by: Oladele Ogunyemi
import { Session, Question, Answer } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { RULES, SESSION_MODES, SESSION_STATUS } from '../../utils/constants.js';
import { usePracticeQuestion } from '../../services/quotaService.js';
import { isExpired, autoSubmitIfExpired } from '../../services/sessionTimer.js';

// PATCH /api/v1/sessions/:id/answer  (Students, own sessions only)
// Practice answers are final and get feedback at once. CBT answers can change until time is up.
export async function saveAnswer(req, res) {
  const { question_id, selected_option, is_flagged_for_review } = req.body;

  if (selected_option === undefined && is_flagged_for_review === undefined) {
    throw new AppError(400, 'NOTHING_TO_SAVE', 'Send selected_option or is_flagged_for_review');
  }

  const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new AppError(404, 'SESSION_NOT_FOUND', 'This session was not found');

  // Late even after the 5 second grace: submit the mock and refuse the answer
  if (
    session.status === SESSION_STATUS.IN_PROGRESS &&
    isExpired(session, RULES.CBT_GRACE_SECONDS)
  ) {
    await autoSubmitIfExpired(session);
    throw new AppError(409, 'SESSION_EXPIRED', 'Time is up. Your mock has been submitted');
  }
  if (session.status !== SESSION_STATUS.IN_PROGRESS) {
    throw new AppError(409, 'SESSION_FINISHED', 'This session is already finished');
  }

  if (!session.question_ids.some((id) => id.equals(question_id))) {
    throw new AppError(400, 'QUESTION_NOT_IN_SESSION', 'This question is not part of this session');
  }

  const question = await Question.findById(question_id).select(
    'subject topic version options correct_option explanation_text',
  );
  if (!question) throw new AppError(404, 'QUESTION_NOT_FOUND', 'This question was not found');

  // Some questions only have options A to C
  if (selected_option && !question.options.some((o) => o.label === selected_option)) {
    throw new AppError(400, 'INVALID_OPTION', `This question has no option ${selected_option}`);
  }

  const isCorrect = Boolean(selected_option) && selected_option === question.correct_option;

  // Copied onto the answer so mastery can find answers per topic quickly
  const copied = {
    user: req.user._id,
    subject: question.subject,
    topic: question.topic,
    question_version: question.version,
  };

  if (session.mode === SESSION_MODES.PRACTICE) {
    if (!selected_option) {
      throw new AppError(400, 'ANSWER_REQUIRED', 'Choose an option to answer this question');
    }

    // create, not update, so the unique index stops a second answer to the same question
    let answer;
    try {
      answer = await Answer.create({
        session: session._id,
        question: question._id,
        ...copied,
        selected_option,
        is_correct: isCorrect,
        is_flagged_for_review: is_flagged_for_review ?? false,
        answered_at: new Date(),
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError(409, 'ANSWER_LOCKED', 'You already answered this question');
      }
      throw err;
    }

    // If no practice questions are left today, take the answer back.
    // Class assignments don't use the quota.
    if (!session.assignment) {
      try {
        await usePracticeQuestion(req.user);
      } catch (err) {
        await answer.deleteOne();
        throw err;
      }
    }

    return res.json({
      data: {
        saved: true,
        is_correct: isCorrect,
        correct_option: question.correct_option,
        explanation_text: question.explanation_text,
      },
    });
  }

  // CBT: only change what was sent. null clears an answer.
  const changes = {};
  if (selected_option !== undefined) {
    changes.selected_option = selected_option;
    changes.is_correct = isCorrect;
    changes.answered_at = selected_option === null ? null : new Date();
  }
  if (is_flagged_for_review !== undefined) changes.is_flagged_for_review = is_flagged_for_review;

  // $setOnInsert only fills these when the answer is first created
  await Answer.findOneAndUpdate(
    { session: session._id, question: question._id },
    { $set: changes, $setOnInsert: copied },
    { upsert: true },
  );

  // Nothing about correctness during a mock. That only appears in the review.
  res.json({ data: { saved: true } });
}
