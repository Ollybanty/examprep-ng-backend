import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import { getMe } from '../controllers/users/getMe.js';
import { completeOnboarding } from '../controllers/users/completeOnboarding.js';
import { updateSettings } from '../controllers/users/updateSettings.js';

const router = Router();

router.get('/users/me', requireAuth, getMe);
router.patch('/users/me/onboarding', requireAuth, requireRole(ROLES.STUDENT), completeOnboarding);
router.patch('/users/me/settings', requireAuth, updateSettings);

export default router;
