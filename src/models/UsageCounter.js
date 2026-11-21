import mongoose from 'mongoose';
import { TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// Free-plan usage per student, per day (practice) and per month (CBT), in Lagos time
const usageCounterSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    period_type: { type: String, enum: ['day', 'month'], required: true },
    period_key: { type: String, required: true },
    practice_questions_answered: { type: Number, default: 0 },
    cbt_mocks_started: { type: Number, default: 0 },
  },
  TIMESTAMPS,
);

usageCounterSchema.index({ user: 1, period_type: 1, period_key: 1 }, { unique: true });

export const UsageCounter = mongoose.model('UsageCounter', usageCounterSchema);
