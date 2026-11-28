import { query } from 'express-validator';

// Same names as the session body, so the app can reuse the values
export const listYearsRules = [
  query('exam_id').isMongoId().withMessage('Choose a valid exam'),
  query('subject_id').isMongoId().withMessage('Choose a valid subject'),
  query('topic_id').optional().isMongoId().withMessage('Choose a valid topic'),
];
