import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { registerLimiter, verifyOtpLimiter, resendOtpLimiter } from '../middleware/rateLimit.js';
import { registerRules, verifyOtpRules, resendOtpRules } from '../validators/authValidators.js';
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
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/accept-admin-invite', acceptAdminInvite);

export default router;
