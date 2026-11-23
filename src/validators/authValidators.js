import { body } from 'express-validator';
import { ROLES, RULES } from '../utils/constants.js';

// Nigerian numbers like 0803..., 234803... or +234803...
const NIGERIAN_PHONE = /^(?:\+?234|0)([789][01]\d{8})$/;

const emailRule = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .bail()
  .isEmail()
  .withMessage('Email is not valid')
  .toLowerCase();

const codeRule = body('code')
  .trim()
  .matches(new RegExp(`^\\d{${RULES.OTP_LENGTH}}$`))
  .withMessage(`Code must be ${RULES.OTP_LENGTH} digits`);

export const registerRules = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 100 })
    .withMessage('Full name must be at most 100 characters'),
  emailRule,
  body('password')
    .isString()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: RULES.PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${RULES.PASSWORD_MIN_LENGTH} characters`)
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain a letter')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .matches(NIGERIAN_PHONE)
    .withMessage('Phone must be a Nigerian number, e.g. 08031234567')
    .bail() // stop if the format is wrong so the line below only gets valid numbers
    .customSanitizer((phone) => `+234${phone.match(NIGERIAN_PHONE)[1]}`), // save it as +234...
  body('role')
    .optional()
    .isIn([ROLES.STUDENT, ROLES.TEACHER])
    .withMessage('Role must be "student" or "teacher"'),
];

export const verifyOtpRules = [emailRule, codeRule];

export const resendOtpRules = [emailRule];
