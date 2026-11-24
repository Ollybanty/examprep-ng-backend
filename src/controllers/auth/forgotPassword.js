// to be handled by: Oladele Ogunyemi
import { User } from '../../models/index.js';
import { OTP_PURPOSES } from '../../utils/constants.js';
import { createOtp } from '../../services/otpService.js';
import { sendEmail } from '../../services/emailService.js';
import { passwordResetEmail } from '../../services/emailTemplates.js';

// Same reply every time so no one can use this to check if an email is registered
const genericResponse = (res) =>
  res.json({
    message: 'If an account exists for this email, a password reset code has been sent to it',
  });

// POST /api/v1/auth/forgot-password  (Public)
export async function forgotPassword(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.is_active) return genericResponse(res);

  // createOtp returns null if a code was sent less than a minute ago
  const code = await createOtp(user._id, OTP_PURPOSES.RESET_PASSWORD);
  if (code) {
    await sendEmail({ to: user.email, ...passwordResetEmail(user.full_name, code) });
  }

  return genericResponse(res);
}
