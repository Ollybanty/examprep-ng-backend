import mongoose from 'mongoose';
import { SESSION_MODES, TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// Questions are picked on creation, so every student gets the same set
const assignmentSchema = new Schema(
  {
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, trim: true, maxlength: 120, default: '' },
    exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    topic: { type: Schema.Types.ObjectId, ref: 'Topic', default: null }, // null = mixed topics
    mode: { type: String, enum: Object.values(SESSION_MODES), default: SESSION_MODES.PRACTICE },
    question_count: { type: Number, required: true, min: 1, max: 100 },
    question_ids: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    deadline: { type: Date, required: true },
  },
  TIMESTAMPS,
);

assignmentSchema.index({ class: 1, deadline: 1 });

export const Assignment = mongoose.model('Assignment', assignmentSchema);
