import mongoose from 'mongoose';
import { TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// A corrected question's old content, so past results stay accurate
const questionVersionSchema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    version: { type: Number, required: true }, // the version number of the saved (old) content
    snapshot: { type: Schema.Types.Mixed, required: true }, // stem_text, options, correct_option, explanation_text, topic, year
    edited_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, trim: true, default: '' },
  },
  TIMESTAMPS,
);

questionVersionSchema.index({ question: 1, version: 1 }, { unique: true });

export const QuestionVersion = mongoose.model('QuestionVersion', questionVersionSchema);
