import { env } from '../config/env.js';
import { RULES } from '../utils/constants.js';
import { renderEmail } from './emailLayout.js';

// Each email returns { subject, text, html }. The plain text version helps with spam
// filters and apps that can't show HTML, so both should say the same thing.

const SIGN_OFF = 'ExamPrep NG';

export function verificationCodeEmail(name, code) {
  const expiry = `It expires in ${RULES.OTP_EXPIRY_MINUTES} minutes.`;
  const ignore = "If you didn't create an ExamPrep NG account, you can ignore this email.";
  return {
    subject: 'Your ExamPrep NG verification code',
    text: `Hi ${name},

Your verification code is: ${code}

${expiry} ${ignore}

${SIGN_OFF}`,
    html: renderEmail({
      preheader: `Your code is ${code}. ${expiry}`,
      heading: 'Verify your email',
      body: [
        { type: 'p', text: `Hi ${name},` },
        { type: 'p', text: 'Enter this code in the app to finish creating your account:' },
        { type: 'code', code },
        { type: 'small', text: `${expiry} ${ignore}` },
      ],
    }),
  };
}

export function passwordResetEmail(name, code) {
  const expiry = `It expires in ${RULES.OTP_EXPIRY_MINUTES} minutes.`;
  const ignore =
    "If you didn't ask for this, you can ignore this email and your password will stay the same.";
  return {
    subject: 'Your ExamPrep NG password reset code',
    text: `Hi ${name},

We got a request to reset your ExamPrep NG password. Your reset code is: ${code}

${expiry} ${ignore}

${SIGN_OFF}`,
    html: renderEmail({
      preheader: `Your reset code is ${code}. ${expiry}`,
      heading: 'Reset your password',
      body: [
        { type: 'p', text: `Hi ${name},` },
        {
          type: 'p',
          text: 'We got a request to reset your ExamPrep NG password. Enter this code in the app:',
        },
        { type: 'code', code },
        { type: 'small', text: `${expiry} ${ignore}` },
      ],
    }),
  };
}

export function teacherReviewEmail(name, decision) {
  const approved = decision === 'approved';

  if (approved) {
    const message =
      'Good news! An admin has approved your teacher account. You can now create classes, add students and set assignments.';
    return {
      subject: 'Your ExamPrep NG teacher account is approved',
      text: `Hi ${name},

${message}

${env.frontendUrl}

${SIGN_OFF}`,
      html: renderEmail({
        preheader: 'You can now create classes and set assignments.',
        heading: 'Your teacher account is approved',
        body: [
          { type: 'p', text: `Hi ${name},` },
          { type: 'p', text: message },
          { type: 'button', label: 'Open ExamPrep NG', url: env.frontendUrl },
        ],
      }),
    };
  }

  const message =
    'An admin has reviewed your teacher account and could not approve it at this time. You can still use ExamPrep NG, but teacher features stay locked.';
  const help = 'If you think this is a mistake, kindly reply to this email.';
  return {
    subject: 'Update on your ExamPrep NG teacher account',
    text: `Hi ${name},

${message} ${help}

${SIGN_OFF}`,
    html: renderEmail({
      preheader: 'An update on your teacher account.',
      heading: 'An update on your teacher account',
      body: [
        { type: 'p', text: `Hi ${name},` },
        { type: 'p', text: message },
        { type: 'p', text: help },
      ],
    }),
  };
}

export function adminInviteEmail(inviterName, link) {
  const expiry = `The link expires in ${RULES.ADMIN_INVITE_EXPIRY_HOURS} hours and can only be used once.`;
  const ignore = "If you weren't expecting this, you can ignore this email.";
  return {
    subject: "You've been invited to be an ExamPrep NG admin",
    text: `Hi,

${inviterName} has invited you to be an admin on ExamPrep NG.

Open this link to set up your account:
${link}

${expiry} ${ignore}

${SIGN_OFF}`,
    html: renderEmail({
      preheader: `${inviterName} has invited you to be an admin.`,
      heading: "You've been invited to be an admin",
      body: [
        { type: 'p', text: 'Hi,' },
        { type: 'p', text: `${inviterName} has invited you to be an admin on ExamPrep NG.` },
        { type: 'button', label: 'Set up my account', url: link },
        { type: 'small', text: `${expiry} ${ignore}` },
      ],
    }),
  };
}

// e.g. "Friday, 5 December 2026 at 18:00", in Lagos time
const formatDeadline = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: RULES.QUOTA_TIMEZONE,
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);

export function newAssignmentEmail(
  studentName,
  { teacherName, className, title, questionCount, deadline },
) {
  const due = `${formatDeadline(deadline)} (Lagos time)`;
  const start = 'Open ExamPrep NG and go to your class to start it. You get one attempt.';
  return {
    subject: `New assignment in ${className}: ${title}`,
    text: `Hi ${studentName},

${teacherName} has set a new assignment in ${className}.

${title}
${questionCount} questions
Due: ${due}

${start}

${SIGN_OFF}`,
    html: renderEmail({
      preheader: `${title}, due ${formatDeadline(deadline)}`,
      heading: 'You have a new assignment',
      body: [
        { type: 'p', text: `Hi ${studentName},` },
        { type: 'p', text: `${teacherName} has set a new assignment in ${className}.` },
        {
          type: 'details',
          rows: [
            ['Assignment', title],
            ['Questions', String(questionCount)],
            ['Due', due],
          ],
        },
        { type: 'button', label: 'Open ExamPrep NG', url: env.frontendUrl },
        { type: 'small', text: 'Go to your class to start it. You get one attempt.' },
      ],
    }),
  };
}
