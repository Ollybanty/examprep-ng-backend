// to be handled by: Oladele
import { User } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { OTP_PURPOSES, ROLES, TEACHER_STATUS } from '../../utils/constants.js';
import { verifyOtpCode } from '../../services/otpService.js';
import { signToken } from '../../utils/token.js';

// POST /api/v1/auth/verify-otp  (Public)
export async function verifyOtp(req, res) {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  // Same error as a wrong code so no one can use this to check if an email is registered
  if (!user) {
    throw new AppError(
      400,
      'OTP_EXPIRED',
      'This code has expired or was not found. Kindly request a new one',
    );
  }
  if (user.is_verified) {
    throw new AppError(
      409,
      'ALREADY_VERIFIED',
      'This account is already verified. Kindly log in instead',
    );
  }

  await verifyOtpCode(user._id, OTP_PURPOSES.VERIFY_ACCOUNT, code);

  user.is_verified = true;
  await user.save();

  const isPendingTeacher =
    user.role === ROLES.TEACHER && user.teacher_status === TEACHER_STATUS.PENDING;

  res.json({
    message: isPendingTeacher
      ? 'Account verified. Teacher features unlock once an admin approves your account'
      : 'Account verified',
    data: { token: signToken(user), user },
  });
}
