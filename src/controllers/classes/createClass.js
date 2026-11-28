// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { Class, Subject } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { generateJoinCode } from '../../utils/joinCode.js';

const MAX_CODE_ATTEMPTS = 5;

// POST /api/v1/classes  (Approved teachers)
export async function createClass(req, res) {
  const { name, subject_id } = matchedData(req, { locations: ['body'] });

  if (subject_id) {
    const subject = await Subject.exists({ _id: subject_id, is_active: true });
    if (!subject) throw new AppError(404, 'SUBJECT_NOT_FOUND', 'This subject was not found');
  }

  // Save and let the unique index refuse a taken code, then try another.
  // Checking first and saving after could give two teachers the same code.
  let created;
  for (let attempt = 1; attempt <= MAX_CODE_ATTEMPTS; attempt++) {
    try {
      created = await Class.create({
        teacher: req.user._id,
        name,
        subject: subject_id ?? null,
        join_code: generateJoinCode(),
      });
      break;
    } catch (err) {
      if (err.code !== 11000) throw err;
    }
  }

  if (!created) {
    throw new AppError(500, 'JOIN_CODE_FAILED', 'Could not create a join code. Try again');
  }

  await created.populate('subject', 'name code');

  res.status(201).json({
    data: {
      _id: created._id,
      name: created.name,
      subject: created.subject,
      join_code: created.join_code,
      is_active: created.is_active,
      student_count: 0,
      created_at: created.created_at,
    },
    message: 'Class created. Share the join code with your students',
  });
}
