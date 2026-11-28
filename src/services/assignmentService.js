// to be handled by: Oladele Ogunyemi
import { Assignment, ClassMember, Session } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { ASSIGNMENT_STATUS, SESSION_MODES, SESSION_STATUS } from '../utils/constants.js';
import { autoSubmitIfExpired, findRunningMock } from './sessionTimer.js';
import { sendEmail } from './emailService.js';
import { newAssignmentEmail } from './emailTemplates.js';

const FINISHED = [SESSION_STATUS.SUBMITTED, SESSION_STATUS.AUTO_SUBMITTED];

// Same reply for "doesn't exist" and "not your class"
const notFound = () => new AppError(404, 'ASSIGNMENT_NOT_FOUND', 'This assignment was not found');

// Returns { session, resumed }. resumed means an attempt they already started.
export async function startAssignmentSession(user, assignmentId) {
  const assignment = await Assignment.findById(assignmentId).populate('class', 'is_active');
  if (!assignment || !assignment.class?.is_active) throw notFound();

  const isMember = await ClassMember.exists({
    class: assignment.class._id,
    student: user._id,
  });
  if (!isMember) throw notFound();

  // One attempt each, so students can't retry until they get 100%
  const existing = await Session.findOne({ assignment: assignment._id, user: user._id });
  if (existing) {
    const current = await autoSubmitIfExpired(existing);
    if (current.status === SESSION_STATUS.IN_PROGRESS) return { session: current, resumed: true };
    throw new AppError(409, 'ASSIGNMENT_DONE', 'You already completed this assignment');
  }

  // The deadline stops new starts only. An attempt already started can be finished.
  if (assignment.deadline <= new Date()) {
    throw new AppError(409, 'ASSIGNMENT_CLOSED', 'The deadline for this assignment has passed');
  }

  const isCbt = assignment.mode === SESSION_MODES.CBT;

  // One running mock per student, and a timed assignment counts as one
  if (isCbt && (await findRunningMock(user._id))) {
    throw new AppError(
      409,
      'MOCK_IN_PROGRESS',
      'Finish the mock you are taking before starting this assignment',
    );
  }

  const now = new Date();
  try {
    const session = await Session.create({
      user: user._id,
      assignment: assignment._id,
      mode: assignment.mode,
      exam: assignment.exam,
      subject: assignment.subject,
      filters: { assignment_id: assignment._id },
      // Same set and order for everyone. No quota: homework isn't limited by the free plan.
      question_ids: assignment.question_ids,
      total_questions: assignment.question_ids.length,
      started_at: now,
      expires_at: isCbt ? new Date(now.getTime() + assignment.duration_minutes * 60 * 1000) : null,
    });
    return { session, resumed: false };
  } catch (err) {
    // A double tap: the unique index lets one in, so return that one
    if (err.code === 11000) {
      const winner = await Session.findOne({ assignment: assignment._id, user: user._id });
      if (winner) return { session: winner, resumed: true };
    }
    throw err;
  }
}

// Each assignment's status for one student, with one query. Also used by class results.
export async function getStudentAssignmentStatuses(studentId, assignments) {
  const sessions = await Session.find({
    user: studentId,
    assignment: { $in: assignments.map((a) => a._id) },
  });

  const checked = await Promise.all(sessions.map((s) => autoSubmitIfExpired(s)));
  const sessionByAssignment = new Map(checked.map((s) => [String(s.assignment), s]));

  const now = new Date();
  return new Map(
    assignments.map((a) => {
      const session = sessionByAssignment.get(String(a._id));
      let status;
      if (session && FINISHED.includes(session.status)) status = ASSIGNMENT_STATUS.COMPLETED;
      else if (session) status = ASSIGNMENT_STATUS.IN_PROGRESS;
      else if (a.deadline <= now) status = ASSIGNMENT_STATUS.MISSED;
      else status = ASSIGNMENT_STATUS.NOT_STARTED;

      return [
        String(a._id),
        {
          status,
          session_id: session?._id ?? null,
          percentage: status === ASSIGNMENT_STATUS.COMPLETED ? session.percentage : null,
        },
      ];
    }),
  );
}

// How many students finished each assignment, with one query
export async function countCompleted(assignmentIds) {
  const rows = await Session.aggregate([
    { $match: { assignment: { $in: assignmentIds }, status: { $in: FINISHED } } },
    { $group: { _id: '$assignment', count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((r) => [String(r._id), r.count]));
}

// Runs in the background. One failed email doesn't stop the rest.
export async function notifyClassOfAssignment(assignment, classDoc, teacherName) {
  const members = await ClassMember.find({ class: classDoc._id })
    .populate('student', 'full_name email is_active')
    .lean();

  for (const { student } of members) {
    if (!student?.is_active) continue;
    try {
      // One email each, so no student sees the others' addresses
      await sendEmail({
        to: student.email,
        ...newAssignmentEmail(student.full_name, {
          teacherName,
          className: classDoc.name,
          title: assignment.title,
          questionCount: assignment.question_ids.length,
          deadline: assignment.deadline,
        }),
      });
    } catch (err) {
      console.error(`Assignment email to student ${student._id} failed: ${err.message}`);
    }
  }
}
