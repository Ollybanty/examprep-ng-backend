import mongoose from 'mongoose';
import { TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

const topicSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Quadratic Equations"
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    is_active: { type: Boolean, default: true },
  },
  TIMESTAMPS,
);

topicSchema.index({ subject: 1, name: 1 }, { unique: true });

export const Topic = mongoose.model('Topic', topicSchema);
