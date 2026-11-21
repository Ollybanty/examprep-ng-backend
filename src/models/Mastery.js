import mongoose from 'mongoose';
import { MASTERY_STATUS, TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// A student's mastery of one topic, recalculated after each submitted session (Tech Doc B4.2)
const masterySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    attempts_count: { type: Number, default: 0 }, // answers counted (max 30)
    weighted_accuracy: { type: Number, default: null }, // 0–100, null while unrated
    status: { type: String, enum: Object.values(MASTERY_STATUS), default: MASTERY_STATUS.UNRATED },
    last_calculated_at: { type: Date, default: null },
  },
  TIMESTAMPS,
);

masterySchema.index({ user: 1, topic: 1 }, { unique: true });
masterySchema.index({ user: 1, subject: 1, status: 1 });

export const Mastery = mongoose.model('Mastery', masterySchema);
