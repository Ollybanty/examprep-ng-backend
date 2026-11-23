// to be handled by: Oladele Ogunyemi
import { Exam, Subject } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { populateProfile } from '../../utils/populateProfile.js';

// PATCH /api/v1/users/me/onboarding  (Students only)
// Students can call this again later to change their exam or subjects
export async function completeOnboarding(req, res) {
  const { exam_id, subject_ids } = req.body;

  const exam = await Exam.findOne({ _id: exam_id, is_active: true });
  if (!exam) throw new AppError(404, 'EXAM_NOT_FOUND', 'This exam was not found');

  const subjects = await Subject.find({
    _id: { $in: subject_ids },
    exams: exam_id,
    is_active: true,
  });

  // Fewer results means at least one subject is fake, inactive or not offered by this exam
  if (subjects.length !== subject_ids.length) {
    throw new AppError(
      400,
      'INVALID_SUBJECTS',
      `One or more subjects are not offered for ${exam.name}`,
    );
  }

  req.user.target_exam = exam._id;
  req.user.selected_subjects = subject_ids;
  await req.user.save();

  await populateProfile(req.user);
  res.json({ message: 'Onboarding complete', data: { user: req.user } });
}
