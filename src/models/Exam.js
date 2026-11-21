import mongoose from 'mongoose';
import { TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// JAMB (UTME) and WAEC for the MVP. NECO and NABTEB can be added later.
const examSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "JAMB (UTME)"
    code: { type: String, required: true, trim: true, uppercase: true }, // e.g. "JAMB"
    cbt_duration_minutes: { type: Number, required: true, min: 1 },
    cbt_question_count: { type: Number, required: true, min: 1 },
    is_active: { type: Boolean, default: true },
  },
  TIMESTAMPS,
);

examSchema.index({ code: 1 }, { unique: true });

export const Exam = mongoose.model('Exam', examSchema);
