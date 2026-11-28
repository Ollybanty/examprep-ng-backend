// to be handled by: Oladele Ogunyemi
// Used by both the results endpoint and the CSV, so they always match
import { ClassMember, Mastery, Session, Topic, Subject } from '../models/index.js';
import { ASSIGNMENT_STATUS, MASTERY_STATUS, RULES } from '../utils/constants.js';
import { autoSubmitIfExpired } from './sessionTimer.js';
import { progressStatus } from './assignmentService.js';

// Sorted by name
export async function getClassStudents(classId) {
  const members = await ClassMember.find({ class: classId })
    .populate('student', 'full_name')
    .lean();

  return members
    .filter((m) => m.student)
    .map((m) => ({ _id: m.student._id, full_name: m.student.full_name, joined_at: m.joined_at }))
    .sort((a, b) => a.full_name.localeCompare(b.full_name));
}

// Each assignment with every student's status and score
export async function buildAssignmentResults(assignments, students) {
  // One query for every attempt, not one per student per assignment
  const sessions = await Session.find({ assignment: { $in: assignments.map((a) => a._id) } });

  // A timed attempt that ran out is submitted now, so it never shows as in progress
  const checked = await Promise.all(sessions.map((s) => autoSubmitIfExpired(s)));

  const key = (assignmentId, studentId) => `${assignmentId}:${studentId}`;
  const sessionByKey = new Map(checked.map((s) => [key(s.assignment, s.user), s]));

  const now = new Date();
  return assignments.map((a) => {
    // Students who joined after the deadline were never given this work
    const eligible = students.filter((s) => s.joined_at <= a.deadline);

    const rows = eligible.map((student) => {
      const session = sessionByKey.get(key(a._id, student._id));
      const status = progressStatus(session, a, now);
      const done = status === ASSIGNMENT_STATUS.COMPLETED;
      return {
        _id: student._id,
        full_name: student.full_name,
        status,
        raw_score: done ? session.raw_score : null,
        total_questions: a.question_count,
        percentage: done ? session.percentage : null,
        submitted_at: done ? session.submitted_at : null,
      };
    });

    const completed = rows.filter((r) => r.status === ASSIGNMENT_STATUS.COMPLETED);
    // null, not 0, when nobody has finished, since 0 would look like everyone failed
    const average = completed.length
      ? Math.round((completed.reduce((sum, r) => sum + r.percentage, 0) / completed.length) * 10) /
        10
      : null;

    return {
      _id: a._id,
      title: a.title,
      exam: a.exam,
      subject: a.subject,
      topic: a.topic,
      mode: a.mode,
      question_count: a.question_count,
      deadline: a.deadline,
      is_open: a.deadline > now,
      student_count: rows.length,
      completed_count: completed.length,
      average_percentage: average,
      students: rows,
    };
  });
}

// Topics the most students are weak in, from the same mastery data students see.
// Only the class's subject counts, if it has one.
export async function getClassWeakTopics(students, subjectId = null) {
  if (students.length === 0) return [];

  const match = { user: { $in: students.map((s) => s._id) } };
  if (subjectId) match.subject = subjectId;

  // rated_count gives context: "8 of 12 rated students" says more than "8 students"
  const rows = await Mastery.aggregate([
    { $match: { ...match, status: { $ne: MASTERY_STATUS.UNRATED } } },
    {
      $group: {
        _id: '$topic',
        subject: { $first: '$subject' },
        weak_count: { $sum: { $cond: [{ $eq: ['$status', MASTERY_STATUS.WEAK] }, 1, 0] } },
        rated_count: { $sum: 1 },
      },
    },
    { $match: { weak_count: { $gt: 0 } } },
    { $sort: { weak_count: -1, rated_count: -1 } },
    { $limit: RULES.CLASS_WEAK_TOPICS_MAX },
  ]);

  const [topics, subjects] = await Promise.all([
    Topic.find({ _id: { $in: rows.map((r) => r._id) } })
      .select('name')
      .lean(),
    Subject.find({ _id: { $in: rows.map((r) => r.subject) } })
      .select('name code')
      .lean(),
  ]);
  const topicById = new Map(topics.map((t) => [String(t._id), t]));
  const subjectById = new Map(subjects.map((s) => [String(s._id), s]));

  return rows.map((r) => ({
    topic: topicById.get(String(r._id)) ?? null,
    subject: subjectById.get(String(r.subject)) ?? null,
    weak_count: r.weak_count,
    rated_count: r.rated_count,
  }));
}
