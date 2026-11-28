import mongoose from 'mongoose';
import { OPTION_LABELS, TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// One student's answer to one question in one session
const answerSchema = new Schema(
  {
    session: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    question_version: { type: Number, required: true }, // the question's version when it was answered

    // Copied here so mastery can find a student's recent answers per topic without extra lookups
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    topic: { type: Schema.Types.ObjectId, ref: 'Topic', default: null },

    // Skipped = null selection and false correctness (Technical Documentation B2.1)
    selected_option: { type: String, enum: [...OPTION_LABELS, null], default: null },
    is_correct: { type: Boolean, default: false },
    is_flagged_for_review: { type: Boolean, default: false },
    answered_at: { type: Date, default: null },
  },
  TIMESTAMPS,
);

// One answer per question per session; changing an answer updates it
answerSchema.index({ session: 1, question: 1 }, { unique: true });
// Mastery: a student's answers in a topic, newest first
answerSchema.index({ user: 1, topic: 1, answered_at: -1 });
// Admin analytics: answers in the last few days
answerSchema.index({ answered_at: -1 });

answerSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Answer = mongoose.model('Answer', answerSchema);
