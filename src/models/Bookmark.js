import mongoose from 'mongoose';
import { TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

const bookmarkSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  },
  TIMESTAMPS,
);

bookmarkSchema.index({ user: 1, question: 1 }, { unique: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
