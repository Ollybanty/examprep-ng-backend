import mongoose from 'mongoose';
import { ROLES, TEACHER_STATUS, PLAN_TIERS, RULES, TIMESTAMPS } from '../utils/constants.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    full_name: { type: String, required: true, trim: true, maxlength: 100 },

    // At least one of email or phone is required (checked below)
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },

    // Hidden unless a query uses .select('+password_hash')
    password_hash: { type: String, required: true, select: false },

    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },

    // Teachers only: pending teachers can log in but can't use teacher features
    teacher_status: { type: String, enum: [...Object.values(TEACHER_STATUS), null], default: null },

    target_exam: { type: Schema.Types.ObjectId, ref: 'Exam', default: null },
    selected_subjects: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
      default: [],
      validate: {
        // Empty before onboarding, then 4–6 subjects
        validator: (subjects) =>
          subjects.length === 0 ||
          (subjects.length >= RULES.MIN_SUBJECTS && subjects.length <= RULES.MAX_SUBJECTS),
        message: `Choose between ${RULES.MIN_SUBJECTS} and ${RULES.MAX_SUBJECTS} subjects`,
      },
    },

    plan_tier: { type: String, enum: Object.values(PLAN_TIERS), default: PLAN_TIERS.FREE },
    is_verified: { type: Boolean, default: false },
    focus_mode_enabled: { type: Boolean, default: true }, // Focus Mode is ON by default (PRD)
    is_active: { type: Boolean, default: true }, // admins can deactivate accounts
    last_login_at: { type: Date, default: null },
  },
  TIMESTAMPS,
);

// Unique only when present (a user may have email, phone or both)
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } },
);
userSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $type: 'string' } } },
);

userSchema.pre('validate', function () {
  if (!this.email && !this.phone) {
    this.invalidate('email', 'Either email or phone is required');
  }
  // New teachers start as pending; other roles have no teacher status
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
