// to be handled by: Oladele Ogunyemi
import { Class, ClassMember } from '../../models/index.js';
import { ROLES } from '../../utils/constants.js';

// GET /api/v1/classes  (Teachers and students)
// Not paginated, since people have only a few classes
export async function listMyClasses(req, res) {
  const data =
    req.user.role === ROLES.TEACHER
      ? await teacherClasses(req.user._id)
      : await studentClasses(req.user._id);
  res.json({ data });
}

async function teacherClasses(teacherId) {
  const classes = await Class.find({ teacher: teacherId })
    .sort({ created_at: -1 })
    .populate('subject', 'name code')
    .lean();

  // One query counts the students in every class
  const counts = await ClassMember.aggregate([
    { $match: { class: { $in: classes.map((c) => c._id) } } },
    { $group: { _id: '$class', count: { $sum: 1 } } },
  ]);
  const countByClass = new Map(counts.map((c) => [String(c._id), c.count]));

  return classes.map((c) => ({
    _id: c._id,
    name: c.name,
    subject: c.subject,
    join_code: c.join_code,
    is_active: c.is_active,
    student_count: countByClass.get(String(c._id)) ?? 0,
    created_at: c.created_at,
  }));
}

async function studentClasses(studentId) {
  const memberships = await ClassMember.find({ student: studentId })
    .sort({ joined_at: -1 })
    .populate({
      path: 'class',
      select: 'name subject teacher is_active',
      populate: [
        { path: 'subject', select: 'name code' },
        { path: 'teacher', select: 'full_name' },
      ],
    })
    .lean();

  // Closed classes are hidden, and a deleted class comes back as null
  return memberships
    .filter((m) => m.class?.is_active)
    .map((m) => ({
      _id: m.class._id,
      name: m.class.name,
      subject: m.class.subject,
      teacher: m.class.teacher,
      joined_at: m.joined_at,
    }));
}
