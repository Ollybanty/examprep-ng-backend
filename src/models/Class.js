import mongoose from 'mongoose';
import { TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

// A teacher's class, e.g. "SS3 Physics". Students join with the join code.
const classSchema = new Schema(
  {
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', default: null },
    join_code: { type: String, required: true, uppercase: true, trim: true }, // e.g. "PHY7K2"
    is_active: { type: Boolean, default: true },
  },
  TIMESTAMPS,
);

classSchema.index({ join_code: 1 }, { unique: true });
classSchema.index({ teacher: 1 });

export const Class = mongoose.model('Class', classSchema);
