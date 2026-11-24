// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { Mastery, Subject, Topic } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { MASTERY_STATUS, RULES } from '../../utils/constants.js';

// Weak topics first, so what needs work is at the top
const STATUS_ORDER = [
  MASTERY_STATUS.WEAK,
  MASTERY_STATUS.DEVELOPING,
  MASTERY_STATUS.STRONG,
  MASTERY_STATUS.UNRATED,
];

// GET /api/v1/analytics/mastery  (Students)
// Untried topics are included as "unrated", so the app can show the whole syllabus
export async function getMastery(req, res) {
  const { subject_id } = matchedData(req, { locations: ['query'] });
  const user = req.user;

  // The subject asked for, or the student's chosen subjects, or (before onboarding) what they've practised
  let subjectIds;
  if (subject_id) {
    if (!(await Subject.exists({ _id: subject_id, is_active: true }))) {
      throw new AppError(404, 'SUBJECT_NOT_FOUND', 'This subject was not found');
    }
    subjectIds = [subject_id];
  } else if (user.selected_subjects.length > 0) {
    subjectIds = user.selected_subjects;
  } else {
    subjectIds = await Mastery.distinct('subject', { user: user._id });
  }

  const [subjects, topics, masteries] = await Promise.all([
    Subject.find({ _id: { $in: subjectIds } })
      .select('name code')
      .lean(),
    Topic.find({ subject: { $in: subjectIds }, is_active: true })
      .select('name subject')
      .lean(),
    Mastery.find({ user: user._id, subject: { $in: subjectIds } }).lean(),
  ]);

  const masteryByTopic = new Map(masteries.map((m) => [String(m.topic), m]));

  const rows = topics.map((topic) => {
    const m = masteryByTopic.get(String(topic._id));
    return {
      subject_id: String(topic.subject),
      topic: { _id: topic._id, name: topic.name },
      status: m?.status ?? MASTERY_STATUS.UNRATED,
      weighted_accuracy: m?.weighted_accuracy ?? null,
      attempts_count: m?.attempts_count ?? 0,
      last_calculated_at: m?.last_calculated_at ?? null,
    };
  });

  // Weak first, then lowest accuracy first within the same status
  const byNeed = (a, b) =>
    STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) ||
    (a.weighted_accuracy ?? 101) - (b.weighted_accuracy ?? 101);

  const grouped = subjects.map((subject) => {
    const subjectRows = rows.filter((r) => r.subject_id === String(subject._id)).sort(byNeed);

    const summary = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]));
    subjectRows.forEach((r) => {
      summary[r.status] += 1;
    });

    return {
      subject,
      summary,
      topics: subjectRows.map(({ subject_id, ...rest }) => rest),
    };
  });

  // The weakest topics to practise next. The app can start practice on one with topic_id,
  // or on all of them with weak_topics: true.
  const subjectById = new Map(subjects.map((s) => [String(s._id), s]));
  const recommended_topics = rows
    .filter((r) => r.status === MASTERY_STATUS.WEAK)
    .sort((a, b) => a.weighted_accuracy - b.weighted_accuracy)
    .slice(0, RULES.RECOMMENDED_TOPICS_MAX)
    .map(({ subject_id, ...rest }) => ({ ...rest, subject: subjectById.get(subject_id) }));

  res.json({ data: { subjects: grouped, recommended_topics } });
}
