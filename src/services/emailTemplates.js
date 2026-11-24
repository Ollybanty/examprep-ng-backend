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

export function passwordResetEmail(name, code) {
  return {
    subject: 'Your ExamPrep NG password reset code',
    text: `Hi ${name},

We got a request to reset your ExamPrep NG password. Your reset code is: ${code}

It expires in ${RULES.OTP_EXPIRY_MINUTES} minutes. If you didn't ask for this, you can ignore this email and your password will stay the same.

ExamPrep NG`,
  };
}

export function teacherReviewEmail(name, decision) {
  const approved = decision === 'approved';
  return {
    subject: approved
      ? 'Your ExamPrep NG teacher account is approved'
      : 'Update on your ExamPrep NG teacher account',
    text: approved
      ? `Hi ${name},

Good news! An admin has approved your teacher account. You can now create classes, add students and set assignments.

ExamPrep NG`
      : `Hi ${name},

An admin has reviewed your teacher account and could not approve it at this time. You can still use ExamPrep NG, but teacher features stay locked. If you think this is a mistake, kindly reply to this email.

ExamPrep NG`,
  };
}

export function adminInviteEmail(inviterName, link) {
  return {
    subject: "You've been invited to be an ExamPrep NG admin",
    text: `Hi,

${inviterName} has invited you to be an admin on ExamPrep NG.

Open this link to set up your account:
${link}

The link expires in ${RULES.ADMIN_INVITE_EXPIRY_HOURS} hours and can only be used once. If you weren't expecting this, you can ignore this email.

ExamPrep NG`,
  };
}
