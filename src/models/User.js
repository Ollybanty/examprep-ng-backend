import mongoose from 'mongoose';
import { ROLES, TEACHER_STATUS, PLAN_TIERS, RULES, TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    full_name: { type: String, required: true, trim: true, maxlength: 100 },

    // Email is required because we send codes by email. Phone is optional and saved as +234...
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: undefined },

    // Not returned unless we ask for it with .select('+password_hash')
    password_hash: { type: String, required: true, select: false },

    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },

    // Only for teachers. A pending teacher can log in but can't use teacher features yet
    teacher_status: { type: String, enum: [...Object.values(TEACHER_STATUS), null], default: null },

    target_exam: { type: Schema.Types.ObjectId, ref: 'Exam', default: null },
    selected_subjects: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
      default: [],
      validate: {
        // Empty until onboarding, then 4 to 6 subjects
        validator: (subjects) =>
          subjects.length === 0 ||
          (subjects.length >= RULES.MIN_SUBJECTS && subjects.length <= RULES.MAX_SUBJECTS),
        message: `Choose between ${RULES.MIN_SUBJECTS} and ${RULES.MAX_SUBJECTS} subjects`,
      },
    },

    plan_tier: { type: String, enum: Object.values(PLAN_TIERS), default: PLAN_TIERS.FREE },
    is_verified: { type: Boolean, default: false },
    focus_mode_enabled: { type: Boolean, default: true }, // Focus Mode is on by default (PRD)
    is_active: { type: Boolean, default: true }, // admins can deactivate an account
    last_login_at: { type: Date, default: null },
  },
  TIMESTAMPS,
);

// Email and phone must be unique. The phone check only counts users who added a phone
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } },
);
userSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $type: 'string' } } },
);

userSchema.pre('validate', function () {
  // New teachers start as pending. Other roles don't need a teacher status
  if (this.role === ROLES.TEACHER && !this.teacher_status) {
    this.teacher_status = TEACHER_STATUS.PENDING;
  }
  if (this.role !== ROLES.TEACHER) {
    this.teacher_status = null;
  }
});

// Never send the password hash to the client
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password_hash;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
