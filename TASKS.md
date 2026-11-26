# ExamPrep NG Backend: Team Tasks

The foundation is built. What's left is the features, split into **4 blocks**. Each block is a set of files that belong together, so one person can own it without stepping on anyone else's work.

Every file you need to fill in already exists. It has a `// to be handled by:` line, a description of the task, the rules, and the section of the spec it comes from. Until it's built, the endpoint returns `501 NOT_IMPLEMENTED`.

---

## What's already done (don't rebuild these)

| Part                                                            | Where                                                                             |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Project setup, config, `.env` loading                           | `src/config/`                                                                     |
| All 17 database models, with validation and indexes             | `src/models/`                                                                     |
| Error handling in the documented format                         | `src/middleware/errorHandler.js`, `src/utils/AppError.js`                         |
| Login check and role checks                                     | `src/middleware/auth.js` (`requireAuth`, `requireRole`, `requireApprovedTeacher`) |
| Validation middleware                                           | `src/middleware/validate.js`                                                      |
| CSV upload middleware                                           | `src/middleware/upload.js`                                                        |
| Email sending (Gmail)                                           | `src/services/emailService.js` → `sendEmail()`                                    |
| JWT tokens                                                      | `src/utils/token.js` → `signToken()`, `verifyToken()`                             |
| Fixed values and business rules                                 | `src/utils/constants.js` (`ROLES`, `RULES`, statuses…)                            |
| Every route, wired to its controller with the right role checks | `src/routes/`                                                                     |
| Seed scripts: first admin, exams/subjects/topics, test accounts | `scripts/`                                                                        |

---

## The blocks

### Block 1: Accounts and auth (build FIRST: every other block's real testing needs it)

| File                                          | Endpoint                                    |
| --------------------------------------------- | ------------------------------------------- |
| `src/services/otpService.js`                  | shared by the auth controllers              |
| `src/controllers/auth/register.js`            | `POST /auth/register`                       |
| `src/controllers/auth/verifyOtp.js`           | `POST /auth/verify-otp`                     |
| `src/controllers/auth/resendOtp.js`           | `POST /auth/resend-otp`                     |
| `src/controllers/auth/login.js`               | `POST /auth/login`                          |
| `src/controllers/auth/forgotPassword.js`      | `POST /auth/forgot-password`                |
| `src/controllers/auth/resetPassword.js`       | `POST /auth/reset-password`                 |
| `src/controllers/auth/acceptAdminInvite.js`   | `POST /auth/accept-admin-invite`            |
| `src/controllers/users/getMe.js`              | `GET /users/me`                             |
| `src/controllers/users/completeOnboarding.js` | `PATCH /users/me/onboarding`                |
| `src/controllers/users/updateSettings.js`     | `PATCH /users/me/settings`                  |
| `src/controllers/admin/listTeachers.js`       | `GET /admin/teachers`                       |
| `src/controllers/admin/reviewTeacher.js`      | `PATCH /admin/teachers/:id/approval`        |
| `src/controllers/admin/inviteAdmin.js`        | `POST /admin/invites`                       |
| `src/controllers/admin/listUsers.js`          | `GET /admin/users`                          |
| `src/controllers/admin/updateUser.js`         | `PATCH /admin/users/:id`                    |
| `src/validators/authValidators.js` (new)      | express-validator rules for the auth routes |
| Rate limits on login, register, OTP routes    | `src/routes/authRoutes.js`                  |

**Done when:** register → OTP arrives → verify → login → `GET /users/me` works; 5 wrong OTPs blocks the code; a pending teacher gets `TEACHER_NOT_APPROVED` until an admin approves them.

### Block 2: Question bank and content

| File                                            | Endpoint                            |
| ----------------------------------------------- | ----------------------------------- |
| `src/controllers/catalog/listExams.js`          | `GET /exams`                        |
| `src/controllers/catalog/listSubjects.js`       | `GET /subjects`                     |
| `src/controllers/catalog/listTopics.js`         | `GET /topics`                       |
| `src/controllers/admin/createQuestion.js`       | `POST /admin/questions`             |
| `src/controllers/admin/listAdminQuestions.js`   | `GET /admin/questions`              |
| `src/controllers/admin/getAdminQuestion.js`     | `GET /admin/questions/:id`          |
| `src/controllers/admin/updateQuestion.js`       | `PATCH /admin/questions/:id`        |
| `src/controllers/admin/changeQuestionStatus.js` | `PATCH /admin/questions/:id/status` |
| `src/controllers/admin/bulkUploadQuestions.js`  | `POST /admin/questions/bulk-csv`    |
| `src/controllers/questions/listQuestions.js`    | `GET /questions`                    |
| `src/controllers/questions/toggleBookmark.js`   | `POST /questions/:id/bookmark`      |
| `src/controllers/questions/listBookmarks.js`    | `GET /bookmarks`                    |
| `src/controllers/questions/reportQuestion.js`   | `POST /questions/:id/report`        |
| `src/controllers/admin/listReports.js`          | `GET /admin/reports`                |
| `src/controllers/admin/resolveReport.js`        | `PATCH /admin/reports/:id`          |
| `templates/questions-template.csv` (done)       | CSV template for the content team   |
| `scripts/importQuestions.js` (new, Phase 6)     | import past questions from ALOC     |

**ALOC notes for `scripts/importQuestions.js`:**

- Base URL `https://dev.aloc.com.ng/api/v1` (in `.env` as `ALOC_BASE_URL`), header `X-API-Key: <ALOC_TOKEN>`.
- `GET /questions?subject=physics&examType=jamb&year=2010&limit=15` costs **1 credit per request** (max 15 questions). `GET /subjects`, `/coverage` and `/subjects/:subject/years` are free. Check `x-credits-remaining` in the response headers. We have 1,000 credits, so don't loop without a limit.
- Each question has `text`, `options` {A–D}, `correctAnswer`, `year`, `examType`, `imageUrl`, and `metadata.topic` / `metadata.subtopic`. Use the topic metadata to match our topics; Groq fills in the rest.
- ALOC's subject names: `english-language`, `mathematics`, `physics`, `chemistry`, `biology`, `economics`.
- Skip questions with an `imageUrl` for the MVP (we don't store diagrams yet).
- Don't use ALOC's `/explain` endpoint: it costs 10 credits per question. Groq drafts explanations instead.
- Save every imported question as `draft` with `source: "aloc"`; an admin publishes after checking.

**Done when:** an admin can create and CSV-upload questions; publishing without an explanation fails; students only see published questions and never see answers in `GET /questions`; a report flags the question and appears in the admin queue.

### Block 3: Sessions, scoring and mastery (the core of the app)

| File                                            | Endpoint                       |
| ----------------------------------------------- | ------------------------------ |
| `src/services/sessionTimer.js`                  | CBT timer and lazy auto-submit |
| `src/services/scoringService.js`                | +1 correct, 0 wrong/skipped    |
| `src/services/masteryService.js`                | weighted mastery (B4.2)        |
| `src/services/quotaService.js`                  | free-plan limits               |
| `src/jobs/autoSubmitJob.js`                     | auto-submit sweep every minute |
| `src/controllers/sessions/startSession.js`      | `POST /sessions`               |
| `src/controllers/sessions/getSession.js`        | `GET /sessions/:id`            |
| `src/controllers/sessions/saveAnswer.js`        | `PATCH /sessions/:id/answer`   |
| `src/controllers/sessions/submitSession.js`     | `POST /sessions/:id/submit`    |
| `src/controllers/sessions/getSessionReview.js`  | `GET /sessions/:id/review`     |
| `src/controllers/sessions/getSessionHistory.js` | `GET /sessions/history`        |
| `src/controllers/analytics/getMastery.js`       | `GET /analytics/mastery`       |

**Depends on:** Block 2 (needs published questions to test properly; insert a few by hand to start early).

**Done when:** every QA check in the Technical Documentation B5 passes: refresh keeps a mock's state; expiry auto-submits; late answers (after the 5-second grace) are rejected; no answers leak during CBT; 4 answers in a topic = unrated, 5+ classify correctly; the 16th free practice question in a day is blocked.

### Block 4: Classes, assignments and admin analytics (good for the third person)

| File                                            | Endpoint                          |
| ----------------------------------------------- | --------------------------------- |
| `src/controllers/classes/createClass.js`        | `POST /classes`                   |
| `src/controllers/classes/listMyClasses.js`      | `GET /classes`                    |
| `src/controllers/classes/joinClass.js`          | `POST /classes/join`              |
| `src/controllers/classes/createAssignment.js`   | `POST /classes/:id/assignments`   |
| `src/controllers/classes/listAssignments.js`    | `GET /classes/:id/assignments`    |
| `src/controllers/classes/getClassResults.js`    | `GET /classes/:id/results`        |
| `src/controllers/classes/exportClassResults.js` | `GET /classes/:id/results/export` |
| `src/controllers/admin/getUsageAnalytics.js`    | `GET /admin/analytics`            |

**Depends on:** Block 3 for results (students complete assignments through sessions). Creating classes, joining and assigning can start straight away.

**Done when:** a teacher creates a class, a student joins with the code, the teacher assigns work, the student completes it, and the teacher sees the score and weak topics, and can download the CSV.

---

## Owners

| Block                   | Owner                   | Why                                                                        |
| ----------------------- | ----------------------- | -------------------------------------------------------------------------- |
| 1. Accounts and auth    | Oladele Ogunyemi (done) | Everyone else depends on it, so it was built first and reviewed carefully  |
| 2. Question bank        | Taiwo Ganiyu            | Content the other blocks need, so it can start straight away               |
| 3. Sessions and mastery | Oladele Ogunyemi        | The core logic the team will be asked to explain (timer, scoring, mastery) |
| 4. Classes              | Olumide                 | Self-contained, so it can be built alongside Blocks 2 and 3                |

**Block 1 is done**, so you can register and log in for real. For quick testing, `npm run seed:dev-users` creates test accounts and prints a token for each. Paste one into Postman as `Authorization: Bearer <token>`.

---

## Team rules

1. **One feature per branch**, from the latest `dev`: e.g. `feat/auth-register`, `feat/question-crud`. Open a PR into `dev`.
2. **Only Oladele merges.** When your PR is ready, ask Oladele to review it. Never merge your own PR or anyone else's, and never push straight to `dev` or `main`.
3. **Fill in the owner line** at the top of the file: `// to be handled by: <your name>`.
4. **Delete `return notImplemented(res);`** when you build an endpoint.
5. **Responses:** success is `{ data }` (plus `message` when useful, and `pagination` for lists). Errors: `throw new AppError(status, 'CODE', 'Message')`; the error handler formats it. No try/catch needed (Express 5).
6. **Use the constants:** `ROLES.STUDENT`, `RULES.OTP_MAX_ATTEMPTS`, etc., never typed strings or numbers.
7. **Questions are saved with `.save()`**, never `findByIdAndUpdate`, or the "no publish without explanation" rule is skipped.
8. **Never send `correct_option` or `explanation_text` to a student** before the right moment (practice: after answering; CBT: after submitting).
9. **Owners only:** a student can only read their own sessions; a teacher only their own classes. Return 404 (not 403) for someone else's record.
10. **Document every endpoint you build** in `docs/openapi.yaml`, in the same PR. Copy the shape of a Block 1 endpoint. Check it at `/api/docs`.
11. **Format before you push:** `npm run format`.
12. **Never commit `.env`.**
