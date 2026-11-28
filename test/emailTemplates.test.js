import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../src/services/emailLayout.js';
import {
  verificationCodeEmail,
  passwordResetEmail,
  teacherReviewEmail,
  adminInviteEmail,
  newAssignmentEmail,
} from '../src/services/emailTemplates.js';

test('escapeHtml turns HTML into plain text', () => {
  assert.equal(
    escapeHtml(`<a href="x">Hi</a> & 'you'`),
    '&lt;a href=&quot;x&quot;&gt;Hi&lt;/a&gt; &amp; &#39;you&#39;',
  );
  assert.equal(escapeHtml(null), '');
});

test('a name with HTML in it shows as text, never as a real tag', () => {
  const email = newAssignmentEmail('<a href="https://bad.example">Click</a>', {
    teacherName: '<script>alert(1)</script>',
    className: 'SS3 <b>Maths</b>',
    title: 'Week 3',
    questionCount: 20,
    deadline: new Date('2026-12-05T17:00:00Z'),
  });
  assert.ok(!email.html.includes('<script>'));
  assert.ok(!email.html.includes('href="https://bad.example"'));
  assert.ok(email.html.includes('&lt;script&gt;'));
});

test('every email has a subject, plain text and HTML', () => {
  const all = [
    verificationCodeEmail('Ada', '123456'),
    passwordResetEmail('Ada', '123456'),
    teacherReviewEmail('Ada', 'approved'),
    teacherReviewEmail('Ada', 'rejected'),
    adminInviteEmail('Oladele', 'http://localhost:3000/accept-invite?token=abc'),
    newAssignmentEmail('Ada', {
      teacherName: 'Mrs Bello',
      className: 'SS3',
      title: 'Week 3',
      questionCount: 5,
      deadline: new Date(),
    }),
  ];
  for (const email of all) {
    assert.ok(email.subject);
    assert.ok(email.text.length > 20);
    assert.ok(email.html.startsWith('<!doctype html>'));
  }
});

test('codes and links appear in both the text and the HTML', () => {
  const code = verificationCodeEmail('Ada', '482913');
  assert.ok(code.text.includes('482913') && code.html.includes('482913'));

  const link = 'http://localhost:3000/accept-invite?token=abc';
  const invite = adminInviteEmail('Oladele', link);
  assert.ok(invite.text.includes(link) && invite.html.includes(`href="${link}"`));
});
