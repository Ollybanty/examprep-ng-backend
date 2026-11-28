// to be handled by: Oladele Ogunyemi
import { matchedData } from 'express-validator';
import { Class, ClassMember } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';

// POST /api/v1/classes/join  (Students)
export async function joinClass(req, res) {
  const { join_code } = matchedData(req, { locations: ['body'] });

  // A wrong code and a closed class get the same reply, so codes can't be probed
  const found = await Class.findOne({ join_code, is_active: true })
    .populate('subject', 'name code')
    .populate('teacher', 'full_name');
  if (!found) {
    throw new AppError(
      404,
      'INVALID_JOIN_CODE',
      'This join code is not valid. Check it and try again',
    );
  }

  // The unique (class, student) index stops a double tap from joining twice
  let member;
  try {
    member = await ClassMember.create({ class: found._id, student: req.user._id });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError(409, 'ALREADY_JOINED', 'You are already in this class');
    }
    throw err;
  }

  res.status(201).json({
    data: {
      class: {
        _id: found._id,
        name: found.name,
        subject: found.subject,
        teacher: found.teacher,
      },
      joined_at: member.joined_at,
    },
    message: `You joined ${found.name}`,
  });
}
