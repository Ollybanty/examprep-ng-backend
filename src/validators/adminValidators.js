import { body, query } from 'express-validator';
import { ROLES, TEACHER_STATUS, PLAN_TIERS, RULES } from '../utils/constants.js';
import { idParamRule, paginationRules } from './commonValidators.js';

export const listTeachersRules = [
  query('status')
    .optional()
    .isIn(Object.values(TEACHER_STATUS))
    .withMessage('status must be pending, approved or rejected'),
  ...paginationRules,
];

// "pending" isn't a decision, so only approved or rejected
export const reviewTeacherRules = [
  idParamRule,
  body('decision')
    .isIn([TEACHER_STATUS.APPROVED, TEACHER_STATUS.REJECTED])
    .withMessage('decision must be "approved" or "rejected"'),
];

export const inviteAdminRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email is not valid')
    .toLowerCase(),
];

export const listUsersRules = [
  query('role').optional().isIn(Object.values(ROLES)).withMessage('role is not valid'),
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('search must be at most 100 characters'),
  ...paginationRules,
];

// Both are optional so the admin can change one at a time
export const updateUserRules = [
  idParamRule,
  body('is_active')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('is_active must be true or false'),
  body('plan_tier')
    .optional()
    .isIn(Object.values(PLAN_TIERS))
    .withMessage('plan_tier must be "free" or "pro"'),
];

export const analyticsRules = [
  query('days')
    .optional()
    .isInt({ min: 1, max: RULES.ANALYTICS_MAX_DAYS })
    .withMessage(`days must be between 1 and ${RULES.ANALYTICS_MAX_DAYS}`)
    .toInt(),
];
