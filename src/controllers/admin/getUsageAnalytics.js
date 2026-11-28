// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import {
  Answer,
  Assignment,
  Class,
  Question,
  QuestionReport,
  Session,
  User,
} from '../../models/index.js';
import {
  QUESTION_STATUS,
  REPORT_STATUS,
  ROLES,
  RULES,
  SESSION_MODES,
  SESSION_STATUS,
  TEACHER_STATUS,
} from '../../utils/constants.js';

const FINISHED = [SESSION_STATUS.SUBMITTED, SESSION_STATUS.AUTO_SUBMITTED];

// Turns [{ _id: 'student', count: 40 }] into { student: 40, teacher: 0, ... }, with every key present
function countsByKey(rows, keys) {
  const counts = Object.fromEntries(keys.map((k) => [k, 0]));
  for (const row of rows) if (row._id in counts) counts[row._id] = row.count;
  return counts;
}

const groupBy = (field) => ({ $group: { _id: `$${field}`, count: { $sum: 1 } } });

// GET /api/v1/admin/analytics?days=7  (Admins)
// The last 7 days by default, counted back from now, so it's never empty on a Monday
export async function getUsageAnalytics(req, res) {
  const { days = RULES.ANALYTICS_DEFAULT_DAYS } = matchedData(req, { locations: ['query'] });
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  const inPeriod = { $gte: from };

  // All the counts run at the same time
  const [
    usersByRole,
    pendingTeachers,
    newUsers,
    finishedByMode,
    questionsAnswered,
    activeStudentRows,
    questionsByStatus,
    openReports,
    activeClasses,
    newAssignments,
  ] = await Promise.all([
    User.aggregate([{ $match: { is_active: true } }, groupBy('role')]),
    User.countDocuments({ role: ROLES.TEACHER, teacher_status: TEACHER_STATUS.PENDING }),
    User.countDocuments({ created_at: inPeriod }),

    Session.aggregate([
      { $match: { status: { $in: FINISHED }, submitted_at: inPeriod } },
      groupBy('mode'),
    ]),

    // A cleared CBT answer (null) isn't an answered question
    Answer.countDocuments({ answered_at: inPeriod, selected_option: { $ne: null } }),

    // Active student: answered at least one question. One row per student, then count the rows.
    Answer.aggregate([
      { $match: { answered_at: inPeriod, selected_option: { $ne: null } } },
      { $group: { _id: '$user' } },
      { $count: 'count' },
    ]),

    Question.aggregate([groupBy('status')]),
    QuestionReport.countDocuments({ status: REPORT_STATUS.OPEN }),
    Class.countDocuments({ is_active: true }),
    Assignment.countDocuments({ created_at: inPeriod }),
  ]);

  const sessions = countsByKey(finishedByMode, Object.values(SESSION_MODES));
  // $count gives no row when nothing matched
  const activeStudents = activeStudentRows[0]?.count ?? 0;

  // North Star (PRD): practice sessions per active student. null, not 0, when nobody was active.
  const northStar = activeStudents
    ? Math.round((sessions[SESSION_MODES.PRACTICE] / activeStudents) * 100) / 100
    : null;

  res.json({
    data: {
      period: { days, from, to },
      north_star: {
        practice_sessions_per_active_student: northStar,
      },
      users: {
        // Deactivated accounts are left out
        by_role: countsByKey(usersByRole, Object.values(ROLES)),
        pending_teachers: pendingTeachers,
        new_in_period: newUsers,
      },
      activity: {
        active_students: activeStudents,
        practice_sessions_completed: sessions[SESSION_MODES.PRACTICE],
        cbt_mocks_completed: sessions[SESSION_MODES.CBT],
        questions_answered: questionsAnswered,
      },
      content: {
        questions_by_status: countsByKey(questionsByStatus, Object.values(QUESTION_STATUS)),
        open_reports: openReports,
      },
      classes: {
        active_classes: activeClasses,
        assignments_created_in_period: newAssignments,
      },
    },
  });
}
