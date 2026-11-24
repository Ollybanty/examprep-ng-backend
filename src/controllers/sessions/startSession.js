// to be handled by: Oladele Ogunyemi
import mongoose from 'mongoose';
import { Exam, Subject, Topic, Question, Mastery, Session } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import {
  MASTERY_STATUS,
  QUESTION_STATUS,
  RULES,
  SESSION_MODES,
  SESSION_STATUS,
} from '../../utils/constants.js';
import {
  getPracticeRemaining,
  checkPracticeQuota,
  useCbtQuota,
} from '../../services/quotaService.js';
import { autoSubmitIfExpired } from '../../services/sessionTimer.js';
import { buildSessionView } from '../../services/sessionView.js';

// Returns the student's running CBT mock, or null. A mock whose time ran out is submitted first.
async function findRunningMock(userId) {
  const running = await Session.findOne({
    user: userId,
    mode: SESSION_MODES.CBT,
    status: SESSION_STATUS.IN_PROGRESS,
  });
  if (!running) return null;

  const current = await autoSubmitIfExpired(running);
  return current.status === SESSION_STATUS.IN_PROGRESS ? current : null;
}

const sendRunningMock = async (res, session) =>
  res.json({
    message: 'You already have a mock in progress',
    data: { session: await buildSessionView(session) },
  });

// POST /api/v1/sessions  (Students)
export async function startSession(req, res) {
  const { mode, exam_id, subject_id, question_count, topic_id, year, weak_topics, assignment_id } =
    req.body;
  const user = req.user;
  const isCbt = mode === SESSION_MODES.CBT;

  // Class assignments come with Block 4
  if (assignment_id) {
    throw new AppError(
      501,
      'NOT_IMPLEMENTED',
      'Starting a session from a class assignment is not built yet',
    );
  }

  const exam = await Exam.findOne({ _id: exam_id, is_active: true });
  if (!exam) throw new AppError(404, 'EXAM_NOT_FOUND', 'This exam was not found');

  const subject = await Subject.findOne({ _id: subject_id, exams: exam_id, is_active: true });
  if (!subject) {
    throw new AppError(404, 'SUBJECT_NOT_FOUND', `This subject is not offered for ${exam.name}`);
  }

  // One mock at a time: starting again returns the running one without using another mock
  if (isCbt) {
    const running = await findRunningMock(user._id);
    if (running) return sendRunningMock(res, running);
  }

  const match = { status: QUESTION_STATUS.PUBLISHED, exam: exam._id, subject: subject._id };
  let count;

  if (isCbt) {
    // A mock always uses the exam's length and the whole subject
    count = exam.cbt_question_count;
  } else {
    if (topic_id && weak_topics) {
      throw new AppError(400, 'INVALID_FILTERS', 'Choose either a topic or weak topics, not both');
    }

    if (topic_id) {
      if (!(await Topic.exists({ _id: topic_id, subject: subject._id }))) {
        throw new AppError(400, 'INVALID_TOPIC', `This topic is not part of ${subject.name}`);
      }
      // aggregate() doesn't convert text ids to ObjectIds like find() does
      match.topic = new mongoose.Types.ObjectId(topic_id);
    }

    if (weak_topics) {
      const weakTopicIds = await Mastery.distinct('topic', {
        user: user._id,
        subject: subject._id,
        status: MASTERY_STATUS.WEAK,
      });
      if (weakTopicIds.length === 0) {
        throw new AppError(
          409,
          'NO_WEAK_TOPICS',
          `You have no weak topics in ${subject.name} yet. Keep practising and we'll find them`,
        );
      }
      match.topic = { $in: weakTopicIds };
    }

    if (year) match.year = year;

    // A free student with 4 questions left today gets 4, even if they asked for 10
    await checkPracticeQuota(user);
    const remaining = await getPracticeRemaining(user);
    count = Math.min(question_count ?? RULES.PRACTICE_DEFAULT_QUESTIONS, remaining);
  }

  // $sample picks random questions in a random order
  const picked = await Question.aggregate([
    { $match: match },
    { $sample: { size: count } },
    { $project: { _id: 1 } },
  ]);

  if (picked.length === 0) {
    throw new AppError(
      404,
      'NO_QUESTIONS',
      'No questions match your choice yet. Try other filters',
    );
  }
  if (isCbt && picked.length < count) {
    throw new AppError(
      409,
      'NOT_ENOUGH_QUESTIONS',
      `A ${exam.code} mock needs ${count} questions, but ${subject.name} only has ${picked.length} so far`,
    );
  }

  if (isCbt) {
    try {
      await useCbtQuota(user);
    } catch (err) {
      // A double tap: the first tap used this month's mock, so return that mock
      const running = await findRunningMock(user._id);
      if (running) return sendRunningMock(res, running);
      throw err;
    }
  }

  const now = new Date();
  let session;
  try {
    session = await Session.create({
      user: user._id,
      mode,
      exam: exam._id,
      subject: subject._id,
      filters: isCbt ? {} : { topic_id, year, weak_topics },
      question_ids: picked.map((q) => q._id),
      total_questions: picked.length,
      started_at: now,
      expires_at: isCbt ? new Date(now.getTime() + exam.cbt_duration_minutes * 60 * 1000) : null,
    });
  } catch (err) {
    // The database allows one running mock per student, so if two starts raced, return the winner
    if (err.code === 11000 && isCbt) {
      const running = await findRunningMock(user._id);
      if (running) return sendRunningMock(res, running);
    }
    throw err;
  }

  res.status(201).json({
    message: isCbt ? 'Mock started' : 'Practice started',
    data: { session: await buildSessionView(session) },
  });
}
