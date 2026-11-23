import { body } from 'express-validator';
import { RULES } from '../utils/constants.js';

export const onboardingRules = [
  // Checking the id format here stops Mongoose from throwing a 500 on values like "abc"
  body('exam_id').isMongoId().withMessage('Choose a valid exam'),
  body('subject_ids')
    .isArray({ min: RULES.MIN_SUBJECTS, max: RULES.MAX_SUBJECTS })
    .withMessage(`Choose between ${RULES.MIN_SUBJECTS} and ${RULES.MAX_SUBJECTS} subjects`)
    .bail()
    .custom((ids) => new Set(ids).size === ids.length)
    .withMessage('Each subject can only be chosen once'),
  body('subject_ids.*').isMongoId().withMessage('One of the subjects is not valid'),
];

// Every setting is optional so the app can send only the one that changed
export const settingsRules = [
  body('focus_mode_enabled')
    .optional()
    .isBoolean({ strict: true })
    .withMessage('focus_mode_enabled must be true or false'),
];
