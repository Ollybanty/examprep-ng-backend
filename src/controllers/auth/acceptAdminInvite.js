// to be handled by: Oladele Ogunyemi
import bcrypt from 'bcryptjs';
import { User, AdminInvite } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { ROLES } from '../../utils/constants.js';
import { signToken, hashToken } from '../../utils/token.js';

// One message for a wrong, expired or used link
const invalidInvite = () =>
  new AppError(400, 'INVITE_INVALID', 'This invite link is invalid or has expired');

// POST /api/v1/auth/accept-admin-invite  (Public)
export async function acceptAdminInvite(req, res) {
  const { token, full_name, password } = req.body;

  const unused = {
    token_hash: hashToken(token),
    accepted_at: null,
    expires_at: { $gt: new Date() },
  };

  const invite = await AdminInvite.findOne(unused);
  if (!invite) throw invalidInvite();

  // Someone may have registered with this email after the invite went out
  if (await User.exists({ email: invite.email })) {
    throw new AppError(409, 'EMAIL_ALREADY_REGISTERED', 'This email already has an account');
  }

  // Claims the invite in one step, so if the link is used twice at once only one admin is created
  const claimed = await AdminInvite.findOneAndUpdate(
    { _id: invite._id, ...unused },
    { accepted_at: new Date() },
  );
  if (!claimed) throw invalidInvite();

  // Opening the emailed link proves they own the email
  const user = await User.create({
    full_name,
    email: invite.email,
    password_hash: await bcrypt.hash(password, 10),
    role: ROLES.ADMIN,
    is_verified: true,
  });

  res.status(201).json({
    message: 'Admin account created',
    data: { token: signToken(user), user },
  });
}
