// to be handled by: Oladele Ogunyemi
import bcrypt from 'bcryptjs';
import { User } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { OTP_PURPOSES } from '../../utils/constants.js';
import { verifyOtpCode } from '../../services/otpService.js';

// POST /api/v1/auth/reset-password  (Public)
export async function resetPassword(req, res) {
  const { email, code, new_password } = req.body;

  // Same error as an expired code so no one can use this to check if an email is registered
  const user = await User.findOne({ email });
  if (!user || !user.is_active) {
    throw new AppError(
      400,
      'OTP_EXPIRED',
      'This code has expired or was not found. Kindly request a new one',
    );
  }

  // Throws if the code is wrong or expired, so the password only changes with a valid code
  await verifyOtpCode(user._id, OTP_PURPOSES.RESET_PASSWORD, code);

  user.password_hash = await bcrypt.hash(new_password, 10);
  // Using the code proves they own the email, so an unverified account can log in after this
  user.is_verified = true;
  await user.save();

  res.json({ message: 'Password updated. Kindly log in with your new password' });
}
