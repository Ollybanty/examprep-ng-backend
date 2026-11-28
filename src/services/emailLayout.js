// The shared look of every email. Tables and inline styles, because email apps strip
// <style> tags and ignore modern CSS.
import { env } from '../config/env.js';

// Colours and font from the design team
export const BRAND = {
  name: 'ExamPrep NG',
  logoUrl: env.emailLogoUrl, // a public PNG, email apps don't show SVG
  logoWidth: 160,
  primary: '#0755D9',
  primarySoft: '#EAF2FF',
  accent: '#FFC107', // only the line under the header, gold text on white is hard to read
  text: '#0B1F4D',
  muted: '#4A5B7A',
  background: '#FFFFFF',
  card: '#FFFFFF',
  border: '#D6E2F5',
  font: "Poppins, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "'Courier New', Courier, monospace",
};

// Names and titles come from users, so they're escaped to stop fake links in our emails
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// The pieces an email body is built from. All text is escaped here.
const blocks = {
  p: ({ text }) =>
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${BRAND.text};">${escapeHtml(text)}</p>`,

  code: ({ code }) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
      <tr><td align="center" style="background:${BRAND.primarySoft};border-radius:8px;padding:20px 12px;">
        <span style="font-family:${BRAND.mono};font-size:32px;font-weight:700;letter-spacing:8px;color:${BRAND.primary};">${escapeHtml(code)}</span>
      </td></tr>
    </table>`,

  // A table cell button, because Outlook ignores padding on links. The plain link is a fallback.
  button: ({ label, url }) => `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 16px;">
      <tr><td style="background:${BRAND.primary};border-radius:6px;">
        <a href="${escapeHtml(url)}" target="_blank" style="display:inline-block;padding:12px 24px;font-size:16px;font-weight:600;color:#FFFFFF;text-decoration:none;">${escapeHtml(label)}</a>
      </td></tr>
    </table>
    <p style="margin:0 0 20px;font-size:13px;line-height:1.5;color:${BRAND.muted};">
      If the button doesn't work, copy this link into your browser:<br>
      <a href="${escapeHtml(url)}" style="color:${BRAND.primary};word-break:break-all;">${escapeHtml(url)}</a>
    </p>`,

  // Label and value rows, e.g. "Due: Friday..."
  details: ({ rows }) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid ${BRAND.border};border-radius:8px;">
      ${rows
        .map(
          ([label, value], i) => `
      <tr>
        <td style="padding:10px 14px;font-size:14px;color:${BRAND.muted};width:35%;${i ? `border-top:1px solid ${BRAND.border};` : ''}">${escapeHtml(label)}</td>
        <td style="padding:10px 14px;font-size:14px;font-weight:600;color:${BRAND.text};${i ? `border-top:1px solid ${BRAND.border};` : ''}">${escapeHtml(value)}</td>
      </tr>`,
        )
        .join('')}
    </table>`,

  small: ({ text }) =>
    `<p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:${BRAND.muted};">${escapeHtml(text)}</p>`,
};

// The logo if we have one, otherwise the name as text
function header() {
  const inner = BRAND.logoUrl
    ? `<img src="${escapeHtml(BRAND.logoUrl)}" width="${BRAND.logoWidth}" alt="${escapeHtml(BRAND.name)}" style="display:block;border:0;max-width:100%;height:auto;">`
    : `<span style="font-size:22px;font-weight:700;color:${BRAND.primary};">${escapeHtml(BRAND.name)}</span>`;
  return `<tr><td style="padding:28px 32px 20px;border-bottom:3px solid ${BRAND.accent};">${inner}</td></tr>`;
}

// preheader is the preview line inboxes show after the subject
export function renderEmail({ preheader, heading, body }) {
  const content = body.map((block) => blocks[block.type](block)).join('\n');
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.background};font-family:${BRAND.font};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
        ${header()}
        <tr><td style="padding:28px 32px 12px;">
          <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:${BRAND.text};">${escapeHtml(heading)}</h1>
          ${content}
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:16px 32px;font-size:12px;line-height:1.5;color:${BRAND.muted};text-align:center;">
          You're getting this email because of your ${escapeHtml(BRAND.name)} account.<br>
          &copy; ${year} ${escapeHtml(BRAND.name)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
