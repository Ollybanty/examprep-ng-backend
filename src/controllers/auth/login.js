// to be handled by: Oladele
import bcrypt from 'bcryptjs';
import { User } from '../../models/index.js';
import { AppError } from '../../utils/AppError.js';
import { signToken } from '../../utils/token.js';

// Same error for an unknown email and a wrong password, so no one can check which emails are registered
const invalidCredentials = () =>
  new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');

// POST /api/v1/auth/login  (Public)
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password_hash');
  if (!user) throw invalidCredentials();

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw invalidCredentials();

  // Checked after the password so these errors don't reveal anything to someone without it
  if (!user.is_verified) {
    throw new AppError(
      403,
      'ACCOUNT_NOT_VERIFIED',
      'Kindly verify your email first. You can request a new code if yours has expired',
    );
  }
  if (!user.is_active) {
    throw new AppError(
      403,
      'ACCOUNT_DISABLED',
      'This account has been disabled. Kindly contact support',
    );
  }

  // Pending teachers can log in. requireApprovedTeacher blocks them on teacher routes only.
  user.last_login_at = new Date();
  await user.save();

  res.json({
    message: 'Logged in successfully',
    data: { token: signToken(user), user },
  });
}
