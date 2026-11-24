import { body, query } from 'express-validator';
import { OPTION_LABELS, RULES, SESSION_MODES } from '../utils/constants.js';
import { idParamRule, paginationRules } from './commonValidators.js';

// POST /sessions
export const startSessionRules = [
  body('mode').isIn(Object.values(SESSION_MODES)).withMessage('mode must be "practice" or "cbt"'),
  body('exam_id').isMongoId().withMessage('Choose a valid exam'),
  body('subject_id').isMongoId().withMessage('Choose a valid subject'),
  // Practice only. A CBT mock always uses the exam's own settings.
  body('question_count')
    .optional()
    .isInt({ min: 1, max: RULES.PRACTICE_MAX_QUESTIONS })
    .withMessage(`question_count must be between 1 and ${RULES.PRACTICE_MAX_QUESTIONS}`)
    .toInt(),
  body('topic_id').optional().isMongoId().withMessage('Choose a valid topic'),
  body('year').optional().isInt({ min: 1970, max: 2100 }).withMessage('year is not valid').toInt(),
  body('weak_topics')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('weak_topics must be true or false'),
  body('assignment_id').optional().isMongoId().withMessage('assignment_id is not valid'),
];

// GET /sessions/:id
export const getSessionRules = [idParamRule];

// PATCH /sessions/:id/answer
export const saveAnswerRules = [
  idParamRule,
  body('question_id').isMongoId().withMessage('question_id is not valid'),
  // null clears a CBT answer. isIn can't check null, so this is a custom check.
  body('selected_option')
    .optional()
    .custom((value) => value === null || OPTION_LABELS.includes(value))
    .withMessage(`selected_option must be one of ${OPTION_LABELS.join(', ')}, or null`),
  body('is_flagged_for_review')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('is_flagged_for_review must be true or false'),
];

// POST /sessions/:id/submit
export const submitSessionRules = [idParamRule];

// GET /sessions/:id/review
export const reviewSessionRules = [idParamRule];

// GET /sessions/history?mode=cbt&subject_id=...&page=1&limit=20
export const sessionHistoryRules = [
  query('mode')
    .optional()
    .isIn(Object.values(SESSION_MODES))
    .withMessage('mode must be "practice" or "cbt"'),
  query('subject_id').optional().isMongoId().withMessage('subject_id is not valid'),
  ...paginationRules,
];

// GET /analytics/mastery?subject_id=...
export const masteryRules = [
  query('subject_id').optional().isMongoId().withMessage('subject_id is not valid'),
];
