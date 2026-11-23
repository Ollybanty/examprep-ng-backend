// to be handled by: Oladele
import bcrypt from 'bcryptjs';
import { User } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { OTP_PURPOSES, ROLES } from '../../utils/constants.js';
import { createOtp } from '../../services/otpService.js';
import { sendEmail } from '../../services/emailService.js';
import { verificationCodeEmail } from '../../services/emailTemplates.js';

// POST /api/v1/auth/register  (Public)
export async function register(req, res) {
  const { full_name, email, phone, password, role = ROLES.STUDENT } = req.body;

  if (await User.exists({ email })) {
    throw new AppError(
      409,
      'EMAIL_ALREADY_REGISTERED',
      'An account with this email already exists. Log in, or request a new code if you have not verified it',
    );
  }

  // The validator only allows student or teacher, so no one can register as admin
  // The User model sets teachers to pending until an admin approves them
  const user = await User.create({
    full_name,
    email,
    phone,
    role,
    password_hash: await bcrypt.hash(password, 10),
  });

  const code = await createOtp(user._id, OTP_PURPOSES.VERIFY_ACCOUNT);
  await sendEmail({ to: user.email, ...verificationCodeEmail(user.full_name, code) });

  res.status(201).json({
    message: 'Account created. Check your email for a 6-digit verification code',
    data: { user },
  });
}
