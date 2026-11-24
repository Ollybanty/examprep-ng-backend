// to be handled by: Oladele Ogunyemi
import { User } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { ROLES } from '../../utils/constants.js';
import { sendEmail } from '../../services/emailService.js';
import { teacherReviewEmail } from '../../services/emailTemplates.js';

// PATCH /api/v1/admin/teachers/:id/approval  (Admin)
// An admin can change their mind later, e.g. approve someone they rejected
export async function reviewTeacher(req, res) {
  const { decision } = req.body;

  const teacher = await User.findOne({ _id: req.params.id, role: ROLES.TEACHER });
  if (!teacher) throw new AppError(404, 'TEACHER_NOT_FOUND', 'This teacher was not found');

  // Stops a double click from sending the same email twice
  if (teacher.teacher_status === decision) {
    throw new AppError(409, 'NO_CHANGE', `This teacher is already ${decision}`);
  }

  teacher.teacher_status = decision;
  await teacher.save();

  await sendEmail({ to: teacher.email, ...teacherReviewEmail(teacher.full_name, decision) });

  res.json({ message: `Teacher ${decision}`, data: { user: teacher } });
}
