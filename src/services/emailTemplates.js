import { RULES } from '../utils/constants.js';

// All email wording lives here. Each function returns { subject, text } for sendEmail()

export function verificationCodeEmail(name, code) {
  return {
    subject: 'Your ExamPrep NG verification code',
    text: `Hi ${name},

Your verification code is: ${code}

It expires in ${RULES.OTP_EXPIRY_MINUTES} minutes. If you didn't create an ExamPrep NG account, you can ignore this email.

ExamPrep NG`,
  };
}
