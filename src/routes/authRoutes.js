import { Router } from 'express';
import { register } from '../controllers/auth/register.js';
import { verifyOtp } from '../controllers/auth/verifyOtp.js';
import { resendOtp } from '../controllers/auth/resendOtp.js';
import { login } from '../controllers/auth/login.js';
import { forgotPassword } from '../controllers/auth/forgotPassword.js';
import { resetPassword } from '../controllers/auth/resetPassword.js';
import { acceptAdminInvite } from '../controllers/auth/acceptAdminInvite.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/resend-otp', resendOtp);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/accept-admin-invite', acceptAdminInvite);

export default router;
