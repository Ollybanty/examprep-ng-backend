// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { Assignment, Class, Exam, Question, Subject, Topic } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { QUESTION_STATUS, RULES, SESSION_MODES } from '../../utils/constants.js';
import { notifyClassOfAssignment } from '../../services/assignmentService.js';

// POST /api/v1/classes/:id/assignments  (Approved teachers, own classes only)
// Questions are picked now and saved, so every student gets the same set
export async function createAssignment(req, res) {
  const { title, exam_id, subject_id, topic_id, mode, question_count, deadline } = matchedData(
    req,
    { locations: ['body'] },
  );

  const classDoc = await Class.findOne({
    _id: req.params.id,
    teacher: req.user._id,
    is_active: true,
  });
  if (!classDoc) throw new AppError(404, 'CLASS_NOT_FOUND', 'This class was not found');

  const exam = await Exam.findOne({ _id: exam_id, is_active: true });
  if (!exam) throw new AppError(404, 'EXAM_NOT_FOUND', 'This exam was not found');

  const subject = await Subject.findOne({ _id: subject_id, exams: exam._id, is_active: true });
  if (!subject) {
    throw new AppError(404, 'SUBJECT_NOT_FOUND', `This subject is not offered for ${exam.name}`);
  }

  const match = { status: QUESTION_STATUS.PUBLISHED, exam: exam._id, subject: subject._id };
  let topic = null;
  if (topic_id) {
    topic = await Topic.findOne({ _id: topic_id, subject: subject._id });
    if (!topic) {
      throw new AppError(400, 'INVALID_TOPIC', `This topic is not part of ${subject.name}`);
    }
    match.topic = topic._id;
  }

  const isCbt = mode === SESSION_MODES.CBT;

  // Left out: a timed one uses the exam's length, practice uses 10
  const count =
    question_count ?? (isCbt ? exam.cbt_question_count : RULES.PRACTICE_DEFAULT_QUESTIONS);

  const picked = await Question.aggregate([
    { $match: match },
    { $sample: { size: count } },
    { $project: { _id: 1 } },
  ]);

  if (picked.length === 0) {
    throw new AppError(
      404,
      'NO_QUESTIONS',
      'No questions match this choice yet. Try other filters',
    );
  }
  // The teacher asked for a number, so say how many exist instead of giving fewer
  if (picked.length < count) {
    throw new AppError(
      409,
      'NOT_ENOUGH_QUESTIONS',
      `Only ${picked.length} questions match this choice. Ask for ${picked.length} or fewer`,
    );
  }

  // Keeps the exam's pace: 20 JAMB questions get 15 minutes
  const durationMinutes = isCbt
    ? Math.max(1, Math.round((count * exam.cbt_duration_minutes) / exam.cbt_question_count))
    : null;

  const assignment = await Assignment.create({
    class: classDoc._id,
    created_by: req.user._id,
    title: title || `${topic?.name ?? subject.name} ${isCbt ? 'timed test' : 'practice'}`,
    exam: exam._id,
    subject: subject._id,
    topic: topic?._id ?? null,
    mode,
    question_count: count,
    question_ids: picked.map((q) => q._id),
    duration_minutes: durationMinutes,
    deadline,
  });

  // Not awaited, so the teacher doesn't wait for the emails
  notifyClassOfAssignment(assignment, classDoc, req.user.full_name).catch((err) =>
    console.error(`Assignment emails failed: ${err.message}`),
  );

  res.status(201).json({
    data: {
      _id: assignment._id,
      title: assignment.title,
      exam: { _id: exam._id, name: exam.name, code: exam.code },
      subject: { _id: subject._id, name: subject.name, code: subject.code },
      topic: topic ? { _id: topic._id, name: topic.name } : null,
      mode: assignment.mode,
      question_count: assignment.question_count,
      duration_minutes: assignment.duration_minutes,
      deadline: assignment.deadline,
      created_at: assignment.created_at,
    },
    message: 'Assignment created. Your students will get an email about it',
  });
}
