import mongoose from 'mongoose';
import { REPORT_STATUS, TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// A student reports a wrong answer or unclear question; it goes to the admin error review queue
const questionReportSchema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true, trim: true, maxlength: 1000 },
    status: { type: String, enum: Object.values(REPORT_STATUS), default: REPORT_STATUS.OPEN },
    resolution: { type: String, trim: true, default: '' }, // what the admin did
    resolved_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    resolved_at: { type: Date, default: null },
  },
  TIMESTAMPS,
);

questionReportSchema.index({ status: 1, created_at: 1 }); // the admin queue, oldest first
questionReportSchema.index({ question: 1 });

export const QuestionReport = mongoose.model('QuestionReport', questionReportSchema);
