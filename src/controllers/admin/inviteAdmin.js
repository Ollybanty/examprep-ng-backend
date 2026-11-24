// to be handled by: Oladele Ogunyemi
import crypto from 'node:crypto';
import { env } from '../../config/env.js';
import { User, AdminInvite } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { RULES } from '../../utils/constants.js';
import { hashToken } from '../../utils/token.js';
import { sendEmail } from '../../services/emailService.js';
import { adminInviteEmail } from '../../services/emailTemplates.js';

// POST /api/v1/admin/invites  (Admin)
export async function inviteAdmin(req, res) {
  const { email } = req.body;

  // One role per account, so existing users can't be turned into admins this way
  if (await User.exists({ email })) {
    throw new AppError(409, 'EMAIL_ALREADY_REGISTERED', 'This email already has an account');
  }

  // Inviting the same email again replaces the old invite, so only the newest link works
  await AdminInvite.deleteMany({ email, accepted_at: null });

  const token = crypto.randomBytes(32).toString('hex');
  const invite = await AdminInvite.create({
    email,
    token_hash: hashToken(token),
    invited_by: req.user._id,
    expires_at: new Date(Date.now() + RULES.ADMIN_INVITE_EXPIRY_HOURS * 60 * 60 * 1000),
  });

  // The real token only goes out in this email. The database only has its hash.
  const link = `${env.frontendUrl}/accept-invite?token=${token}`;
  await sendEmail({ to: email, ...adminInviteEmail(req.user.full_name, link) });

  res.status(201).json({
    message: 'Invite sent',
    data: { invite: { email: invite.email, expires_at: invite.expires_at } },
  });
}
