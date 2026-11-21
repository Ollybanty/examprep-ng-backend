// Shared fixed values: import these instead of typing the strings

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  // PARENT: 'parent', // MMP (post-launch)
};

// Teachers can sign up, but an admin must approve them before they get full access
export const TEACHER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const PLAN_TIERS = {
  FREE: 'free',
  PRO: 'pro',
};

export const OTP_PURPOSES = {
  VERIFY_ACCOUNT: 'verify_account',
  RESET_PASSWORD: 'reset_password',
};

// Draft → Reviewed → Published, or Flagged when a student reports it
export const QUESTION_STATUS = {
  DRAFT: 'draft',
  REVIEWED: 'reviewed',
  PUBLISHED: 'published',
  FLAGGED: 'flagged',
};

export const QUESTION_SOURCES = {
  MANUAL: 'manual',
  CSV: 'csv',
  ALOC: 'aloc',
};

export const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export const SESSION_MODES = {
  PRACTICE: 'practice',
  CBT: 'cbt',
};

export const SESSION_STATUS = {
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  AUTO_SUBMITTED: 'auto_submitted',
};

export const MASTERY_STATUS = {
  UNRATED: 'unrated',
  WEAK: 'weak',
  DEVELOPING: 'developing',
  STRONG: 'strong',
};

export const REPORT_STATUS = {
  OPEN: 'open',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

// Business rules from the PRD and the Technical Documentation
export const RULES = {
  MIN_SUBJECTS: 4,
  MAX_SUBJECTS: 6,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  OTP_MAX_ATTEMPTS: 5,
  CBT_GRACE_SECONDS: 5, // late answers within 5 seconds of expiry are still accepted (B4.1)
  MASTERY_WINDOW: 30, // last 30 answers in a topic (B4.2)
  MASTERY_MIN_ATTEMPTS: 5, // fewer than 5 answers = unrated
  MASTERY_WEAK_BELOW: 60, // below 60% = weak
  MASTERY_STRONG_FROM: 80, // 80% and above = strong; 60–79% = developing
  FREE_PRACTICE_PER_DAY: 15,
  FREE_CBT_PER_MONTH: 1,
  QUOTA_TIMEZONE: 'Africa/Lagos', // DEC-05: limits reset at midnight Lagos time
  JOIN_CODE_LENGTH: 6,
  ADMIN_INVITE_EXPIRY_HOURS: 48,
};

// Gives every collection created_at / updated_at, matching the docs' snake_case fields
export const TIMESTAMPS = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } };
