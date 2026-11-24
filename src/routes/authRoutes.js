import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import {
  registerLimiter,
  verifyOtpLimiter,
  resendOtpLimiter,
  loginLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  acceptInviteLimiter,
} from '../middleware/rateLimit.js';
import {
  registerRules,
  verifyOtpRules,
  resendOtpRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  acceptAdminInviteRules,
} from '../validators/authValidators.js';
import { register } from '../controllers/auth/register.js';
import { verifyOtp } from '../controllers/auth/verifyOtp.js';
import { resendOtp } from '../controllers/auth/resendOtp.js';
import { login } from '../controllers/auth/login.js';
import { forgotPassword } from '../controllers/auth/forgotPassword.js';
import { resetPassword } from '../controllers/auth/resetPassword.js';
import { acceptAdminInvite } from '../controllers/auth/acceptAdminInvite.js';

const router = Router();

// Each route runs in this order: rate limit, validation rules, validate, then the controller
router.post('/auth/register', registerLimiter, registerRules, validate, register);
router.post('/auth/verify-otp', verifyOtpLimiter, verifyOtpRules, validate, verifyOtp);
router.post('/auth/resend-otp', resendOtpLimiter, resendOtpRules, validate, resendOtp);
router.post('/auth/login', loginLimiter, loginRules, validate, login);
router.post(
  '/auth/forgot-password',
  forgotPasswordLimiter,
  forgotPasswordRules,
  validate,
  forgotPassword,
);
router.post(
  '/auth/reset-password',
  resetPasswordLimiter,
  resetPasswordRules,
  validate,
  resetPassword,
);
router.post(
  '/auth/accept-admin-invite',
  acceptInviteLimiter,
  acceptAdminInviteRules,
  validate,
  acceptAdminInvite,
);

export default router;
