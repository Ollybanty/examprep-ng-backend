import mongoose from 'mongoose';
import { SESSION_MODES, SESSION_STATUS, TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// One practice session or CBT mock taken by a student
const sessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', default: null }, // set when started from a class assignment
    mode: { type: String, enum: Object.values(SESSION_MODES), required: true },
    exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },

    // How the questions were picked, e.g. { topic, year, random, weak_topics }
    filters: { type: Schema.Types.Mixed, default: {} },

    // Fixed when the session starts, in display order
    question_ids: [{ type: Schema.Types.ObjectId, ref: 'Question' }],

    // expires_at is set for CBT only: the server-side end time (DEC-02)
    started_at: { type: Date, required: true, default: Date.now },
    expires_at: { type: Date, default: null },
    submitted_at: { type: Date, default: null },
    status: {
      type: String,
      enum: Object.values(SESSION_STATUS),
      default: SESSION_STATUS.IN_PROGRESS,
    },

    // Set on submit: +1 correct, 0 wrong or skipped
    raw_score: { type: Number, default: null },
    total_questions: { type: Number, required: true, min: 1 },
    percentage: { type: Number, default: null },
  },
  TIMESTAMPS,
);

sessionSchema.index({ user: 1, created_at: -1 }); // a student's session history
sessionSchema.index({ status: 1, expires_at: 1 }); // the auto-submit sweep finds expired mocks
// One attempt per assignment per student. Partial, so sessions with no assignment don't clash.
sessionSchema.index(
  { assignment: 1, user: 1 },
  {
    name: 'one_attempt_per_assignment',
    unique: true,
    partialFilterExpression: { assignment: { $type: 'objectId' } },
  },
);
// One running CBT mock per student. Finished mocks and practice sessions aren't limited.
sessionSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: { mode: SESSION_MODES.CBT, status: SESSION_STATUS.IN_PROGRESS },
  },
);

sessionSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Session = mongoose.model('Session', sessionSchema);
