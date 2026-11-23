// to be handled by: Oladele
import { User } from '../../models/index.js';
import { OTP_PURPOSES } from '../../utils/constants.js';
import { createOtp } from '../../services/otpService.js';
import { sendEmail } from '../../services/emailService.js';
import { verificationCodeEmail } from '../../services/emailTemplates.js';

// POST /api/v1/auth/resend-otp  (Public)
export async function resendOtp(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Only send a code if the account isn't verified yet and the 60 second wait is over
  if (user && !user.is_verified) {
    const code = await createOtp(user._id, OTP_PURPOSES.VERIFY_ACCOUNT);
    if (code) {
      await sendEmail({ to: user.email, ...verificationCodeEmail(user.full_name, code) });
    }
  }

  // Same reply every time so no one can use this to check if an email is registered
  res.json({
    message: 'If an unverified account exists for this email, a new code has been sent',
  });
}
