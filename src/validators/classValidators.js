import { body } from 'express-validator';
import { RULES, SESSION_MODES } from '../utils/constants.js';
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

export const createAssignmentRules = [
  idParamRule,
  // Left out: we make one like "Mathematics practice"
  body('title')
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage('title must be at most 120 characters'),
  body('exam_id').isMongoId().withMessage('Choose a valid exam'),
  body('subject_id').isMongoId().withMessage('Choose a valid subject'),
  body('topic_id').optional().isMongoId().withMessage('Choose a valid topic'),
  body('mode').isIn(Object.values(SESSION_MODES)).withMessage('mode must be "practice" or "cbt"'),
  body('question_count')
    .optional()
    .isInt({ min: 1, max: RULES.ASSIGNMENT_MAX_QUESTIONS })
    .withMessage(`question_count must be between 1 and ${RULES.ASSIGNMENT_MAX_QUESTIONS}`)
    .toInt(),
  body('deadline')
    // Strict, because nobody can tell if "05/12/2026" is 5 December or 12 May
    .isISO8601({ strict: true })
    .withMessage('deadline must be a date and time, e.g. 2026-12-05T18:00:00+01:00')
    .bail()
    .toDate()
    .custom((value) => value > new Date())
    .withMessage('deadline must be in the future'),
];

export const listAssignmentsRules = [idParamRule, ...paginationRules];

export const classResultsRules = [idParamRule, ...paginationRules];

export const exportClassResultsRules = [idParamRule];
