import mongoose from 'mongoose';
import { TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

const subjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Mathematics"
    code: { type: String, required: true, trim: true, lowercase: true }, // e.g. "mathematics"
    exams: [{ type: Schema.Types.ObjectId, ref: 'Exam' }],
    is_active: { type: Boolean, default: true },
  },
  TIMESTAMPS,
);

subjectSchema.index({ code: 1 }, { unique: true });

export const Subject = mongoose.model('Subject', subjectSchema);
