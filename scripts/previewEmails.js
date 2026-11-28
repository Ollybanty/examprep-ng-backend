// Saves every email as HTML in email-previews/ to check in a browser. Run: npm run preview:emails
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  verificationCodeEmail,
  passwordResetEmail,
  teacherReviewEmail,
  adminInviteEmail,
  newAssignmentEmail,
} from '../src/services/emailTemplates.js';

const outDir = new URL('../email-previews/', import.meta.url);
mkdirSync(outDir, { recursive: true });

// The last name has HTML in it, to check it shows as plain text
const emails = {
  'verification-code': verificationCodeEmail('Ada Obi', '482913'),
  'password-reset': passwordResetEmail('Ada Obi', '715204'),
  'teacher-approved': teacherReviewEmail('Mrs Bello', 'approved'),
  'teacher-rejected': teacherReviewEmail('Mrs Bello', 'rejected'),
  'admin-invite': adminInviteEmail(
    'Oladele Ogunyemi',
    'http://localhost:3000/accept-invite?token=sample-token',
  ),
  'new-assignment': newAssignmentEmail('<b>Tunde</b>', {
    teacherName: 'Mrs Bello',
    className: 'SS3 Maths',
    title: 'Week 3 algebra',
    questionCount: 20,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  }),
};

for (const [name, email] of Object.entries(emails)) {
  writeFileSync(new URL(`${name}.html`, outDir), email.html);
}
console.log(
  `Saved ${Object.keys(emails).length} previews in email-previews/. Open them in a browser.`,
);
