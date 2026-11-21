# Question upload template

Use `questions-template.csv` to upload many questions at once (`POST /api/v1/admin/questions/bulk-csv`).
Open it in Excel or Google Sheets, replace the example rows with your questions, and save as **CSV (UTF-8)**.

| Column                  | Required         | Notes                                                           |
| ----------------------- | ---------------- | --------------------------------------------------------------- |
| `exam`                  | Yes              | `JAMB` or `WAEC`                                                |
| `subject`               | Yes              | Subject name, e.g. `Physics`, `English Language`                |
| `topic`                 | Yes              | Must match a topic in that subject, e.g. `Motion`               |
| `year`                  | No               | Exam year, e.g. `2019`. Leave empty if unknown                  |
| `stem_text`             | Yes              | The question                                                    |
| `option_a` – `option_d` | A and B required | C and D can be empty for 2-option questions                     |
| `correct_option`        | Yes              | `A`, `B`, `C` or `D`                                            |
| `explanation_text`      | Yes to publish   | Why the answer is correct. Questions without one stay as drafts |

**Rules**

- Up to **500 rows** per file.
- Save as **UTF-8** so symbols like ₦, °, ÷ and × come through correctly.
- Write maths as plain text, e.g. `x^2 + 3x = 0`, `√16`, `3/4`.
- If a cell contains a comma, wrap it in double quotes (Excel and Google Sheets do this for you).
- Uploaded questions start as **drafts**. An admin reviews and publishes them.
