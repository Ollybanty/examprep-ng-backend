// to be handled by:
import { notImplemented } from '../../utils/notImplemented.js';

// POST /api/v1/admin/questions/bulk-csv
// Access: Admin
//
// Task: Upload many questions from a CSV file.
//
// Rules:
//   - The file arrives as req.file (the uploadCsv middleware is already on the route; field name "file").
//   - Parse with csv-parse. Headers (DEC-04, see templates/questions-template.csv): exam, subject, topic, year, stem_text, option_a, option_b, option_c, option_d, correct_option, explanation_text.
//   - exam/subject/topic are names or codes; look them up. Max 500 rows.
//   - Validate every row. Save valid rows as "draft" with source "csv".
//   - Return { imported, failed, errors: [{ row, message }] }, e.g. "row 12: correct_option is missing".
//
// Spec: Tech Doc B3 (Admin CMS), B6 DEC-04
export async function bulkUploadQuestions(req, res) {
  return notImplemented(res);
}
