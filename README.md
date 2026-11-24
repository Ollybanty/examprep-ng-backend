# ExamPrep NG Backend

REST API for **ExamPrep NG**, a WAEC and JAMB exam practice platform: verified past questions, timed CBT mocks, instant scoring, weak-topic tracking and teacher classes.

- **Stack:** Node.js, Express 5, MongoDB (Mongoose), JWT, bcryptjs, express-validator, Nodemailer (Gmail), node-cron
- **Base URL:** `http://localhost:4000/api/v1`
- **Specs:** the team's PRD and _Users Guide & Technical Documentation (MVP v1.0)_
- **Team tasks:** see [TASKS.md](TASKS.md).

## Getting started

1. **Install** Node.js 20 or newer, and MongoDB (local) or use the team's MongoDB Atlas connection string.
2. **Install packages**
   ```bash
   npm install
   ```
3. **Create your `.env`**
   ```bash
   cp .env.example .env
   ```
   Fill in the values. Ask the backend lead for the shared ones (Atlas, Gmail). If the Gmail values are empty, emails are printed in the terminal instead of being sent.
4. **Seed the database**
   ```bash
   npm run seed:taxonomy    # exams, subjects and topics
   npm run seed:admin       # first admin (from ADMIN_* in .env)
   npm run seed:dev-users   # test accounts + tokens (development only)
   ```
5. **Start the server**
   ```bash
   npm run dev
   ```
   Check it: `GET http://localhost:4000/api/v1/health`

## API docs (Swagger)

Every built endpoint is documented in [`docs/openapi.yaml`](docs/openapi.yaml) and shown at:

```
http://localhost:4000/api/docs
```

The page asks for a username and password. Set `DOCS_USERNAME` and `DOCS_PASSWORD` in `.env` to turn it on (the docs are off when either is empty). Ten wrong logins lock that IP out for 15 minutes.

- **Try it out:** get a token from `/auth/login`, click **Authorize** and paste it in. The token is forgotten when the tab closes.
- **Postman:** import `http://localhost:4000/api/docs/openapi.json` (with the same login) to get a ready made collection.
- **Adding an endpoint:** update `docs/openapi.yaml` in the same PR, then restart the server to see it.

## Deploying (Render)

The live API runs on Render (free plan) with MongoDB Atlas. Render deploys the `main` branch automatically, so merging `dev` into `main` is a release.

| Render setting    | Value            |
| ----------------- | ---------------- |
| Build command     | `npm ci`         |
| Start command     | `npm start`      |
| Health check path | `/api/v1/health` |

Environment variables are set in Render's dashboard, never in the code:

| Variable                         | Value on Render                                                |
| -------------------------------- | -------------------------------------------------------------- |
| `NODE_ENV`                       | `production`                                                   |
| `MONGODB_URI`                    | The Atlas connection string                                    |
| `JWT_SECRET`                     | A new random string, different from any laptop                 |
| `EMAIL_PROVIDER`                 | `brevo` (Render's free plan blocks Gmail's SMTP ports)         |
| `BREVO_API_KEY`, `EMAIL_USER`    | The Brevo API key, and the sender address confirmed in Brevo   |
| `DOCS_USERNAME`, `DOCS_PASSWORD` | The login for `/api/docs`                                      |
| `CORS_ORIGINS`                   | Every frontend address that calls the API, separated by commas |
| `FRONTEND_URL`                   | The frontend's live address, used in invite links              |

If the frontend sees a CORS error, check Render's logs for `CORS blocked: <address>` and add that address to `CORS_ORIGINS`.

## Scripts

| Command                      | What it does                                                 |
| ---------------------------- | ------------------------------------------------------------ |
| `npm run dev`                | Start with nodemon (restarts on changes)                     |
| `npm start`                  | Start without nodemon                                        |
| `npm test`                   | Run the automated tests (no database needed)                 |
| `npm run format`             | Format every file with Prettier                              |
| `npm run format:check`       | Check formatting without changing files                      |
| `npm run seed:taxonomy`      | Create/update exams, subjects and topics (safe to re-run)    |
| `npm run seed:admin`         | Create the first admin from `.env`                           |
| `npm run seed:dev-users`     | Create test accounts for each role and print their tokens    |
| `npm run seed:dev-questions` | Add sample questions for testing sessions (development only) |

## Project structure

```
src/
├── server.js        # starts the server after connecting to MongoDB
├── app.js           # Express app: middleware and routes
├── config/          # environment variables and database connection
├── models/          # Mongoose schemas (17 collections)
├── routes/          # one file per area; all mounted under /api/v1
├── controllers/     # one file per endpoint, grouped by area
├── services/        # shared logic: email, OTP, timer, scoring, mastery, quotas
├── middleware/      # auth/roles, validation, upload, errors, logger
├── validators/      # express-validator rules
├── jobs/            # scheduled jobs (CBT auto-submit)
└── utils/           # AppError, constants, tokens
scripts/             # seed and import scripts
postman/             # Postman collection
```

## Conventions

**Success response**

```json
{ "data": {} }
```

Lists also return `pagination: { page, limit, total, pages }`.

**Error response** (Technical Documentation B3)

```json
{ "error": { "code": "STRING_CODE", "message": "Human-readable message" } }
```

**Authentication:** send `Authorization: Bearer <token>` on protected routes.

**Roles:** `student`, `teacher` (must be approved by an admin before using teacher features), `admin`.

## Endpoints

| Area       | Method and path                                                                                                                                                                                | Access             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Health     | `GET /health`                                                                                                                                                                                  | Public             |
| Auth       | `POST /auth/register` · `POST /auth/verify-otp` · `POST /auth/resend-otp` · `POST /auth/login` · `POST /auth/forgot-password` · `POST /auth/reset-password` · `POST /auth/accept-admin-invite` | Public             |
| Profile    | `GET /users/me` · `PATCH /users/me/settings`                                                                                                                                                   | Logged in          |
| Onboarding | `PATCH /users/me/onboarding`                                                                                                                                                                   | Student            |
| Catalog    | `GET /exams` · `GET /subjects` · `GET /topics`                                                                                                                                                 | Logged in          |
| Questions  | `GET /questions` · `POST /questions/:id/bookmark` · `GET /bookmarks` · `POST /questions/:id/report`                                                                                            | Student            |
| Sessions   | `POST /sessions` · `GET /sessions/history` · `GET /sessions/:id` · `PATCH /sessions/:id/answer` · `POST /sessions/:id/submit` · `GET /sessions/:id/review`                                     | Student            |
| Analytics  | `GET /analytics/mastery`                                                                                                                                                                       | Student            |
| Classes    | `POST /classes` · `POST /classes/:id/assignments` · `GET /classes/:id/results` · `GET /classes/:id/results/export`                                                                             | Approved teacher   |
| Classes    | `GET /classes` · `GET /classes/:id/assignments`                                                                                                                                                | Teacher or student |
| Classes    | `POST /classes/join`                                                                                                                                                                           | Student            |
| Admin      | `/admin/questions` (CRUD, status, `bulk-csv`) · `/admin/reports` · `/admin/teachers` · `/admin/invites` · `/admin/users` · `/admin/analytics`                                                  | Admin              |

Endpoints that haven't been built yet return `501 NOT_IMPLEMENTED`. Full request and response examples for the built ones are in the [API docs](#api-docs-swagger).
