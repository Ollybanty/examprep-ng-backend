import { param, query } from 'express-validator';
import { RULES } from '../utils/constants.js';

// Gives a clear 400 for a bad :id instead of a Mongoose CastError
export const idParamRule = param('id').isMongoId().withMessage('Invalid id');

// ?page and ?limit for any list route. toInt turns the URL text into numbers.
export const paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be 1 or more').toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: RULES.PAGE_LIMIT_MAX })
    .withMessage(`limit must be between 1 and ${RULES.PAGE_LIMIT_MAX}`)
    .toInt(),
];
