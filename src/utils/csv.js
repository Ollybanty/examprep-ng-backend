// Quotes cells with commas, quotes or line breaks, and puts ' before text starting
// with = + - or @ so Excel shows it as text instead of running it (CSV injection)
function cell(value) {
  if (value === null || value === undefined) return '';
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[",\r\n]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(headers, rows) {
  // \r\n is what the CSV standard and Excel expect
  return [headers, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
}
