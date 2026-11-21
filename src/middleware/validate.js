import { validationResult } from 'express-validator';

// Use after express-validator rules: returns 400 VALIDATION_ERROR listing every failed rule
export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return res.status(400).json({
    error: { code: 'VALIDATION_ERROR', message: details[0].message, details },
  });
}
