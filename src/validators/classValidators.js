import { body } from 'express-validator';
import { RULES } from '../utils/constants.js';
import { JOIN_CODE_ALPHABET } from '../utils/joinCode.js';
import { idParamRule, paginationRules } from './commonValidators.js';

export const createClassRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Class name is required')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Class name must be at most 100 characters'),
  // Optional, since a form class can cover more than one subject
  body('subject_id').optional().isMongoId().withMessage('subject_id is not valid'),
];

// Case insensitive, because students will type "phy7k2" too
const joinCodePattern = new RegExp(`^[${JOIN_CODE_ALPHABET}]{${RULES.JOIN_CODE_LENGTH}}$`, 'i');

export const joinClassRules = [
  body('join_code')
    .trim()
    .notEmpty()
    .withMessage('Join code is required')
    .bail()
    .matches(joinCodePattern)
    .withMessage(`Join code must be ${RULES.JOIN_CODE_LENGTH} letters or numbers`)
    .toUpperCase(),
];

export const listClassStudentsRules = [idParamRule, ...paginationRules];
