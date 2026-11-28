// Fixed values we share across the app. Import these instead of typing the strings

export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  // PARENT: 'parent', // coming after launch
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

// Draft, then Reviewed, then Published. Flagged means a student reported it
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

// A student's progress on an assignment, worked out from their session
export const ASSIGNMENT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  MISSED: 'missed', // the deadline passed before they started
};

export const REPORT_STATUS = {
  OPEN: 'open',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

// Rules from the PRD and the Technical Documentation
export const RULES = {
  MIN_SUBJECTS: 4,
  MAX_SUBJECTS: 6,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  OTP_MAX_ATTEMPTS: 5,
  OTP_RESEND_COOLDOWN_SECONDS: 60, // how long to wait before sending another code
  PASSWORD_MIN_LENGTH: 8,
  CBT_GRACE_SECONDS: 5, // we still accept answers that arrive up to 5 seconds late (B4.1)
  MASTERY_WINDOW: 30, // only the last 30 answers in a topic count (B4.2)
  MASTERY_MIN_ATTEMPTS: 5, // under 5 answers means not rated yet
  MASTERY_WEAK_BELOW: 60, // under 60% is weak
  MASTERY_STRONG_FROM: 80, // 80% and up is strong, 60 to 79% is developing
  RECOMMENDED_TOPICS_MAX: 3, // weak topics suggested to practise next
  CLASS_WEAK_TOPICS_MAX: 5, // topics shown in a teacher's class results
  FREE_PRACTICE_PER_DAY: 15,
  FREE_CBT_PER_MONTH: 1,
  PRACTICE_DEFAULT_QUESTIONS: 10, // when the student doesn't say how many
  PRACTICE_MAX_QUESTIONS: 40,
  QUOTA_TIMEZONE: 'Africa/Lagos', // quotas reset at midnight Lagos time (DEC 05)
  JOIN_CODE_LENGTH: 6,
  ASSIGNMENT_MAX_QUESTIONS: 100,
  ADMIN_INVITE_EXPIRY_HOURS: 48,
  PAGE_LIMIT_DEFAULT: 20, // items per page when the app doesn't say
  PAGE_LIMIT_MAX: 100,
};

// Adds created_at and updated_at to every collection, in snake_case like the docs
export const TIMESTAMPS = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } };
