import mongoose from 'mongoose';
import { TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// Links a student to a class they joined
const classMemberSchema = new Schema(
  {
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    joined_at: { type: Date, default: Date.now },
  },
  TIMESTAMPS,
);

classMemberSchema.index({ class: 1, student: 1 }, { unique: true });
classMemberSchema.index({ student: 1 });

export const ClassMember = mongoose.model('ClassMember', classMemberSchema);
