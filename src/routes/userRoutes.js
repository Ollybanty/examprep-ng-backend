import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../utils/constants.js';
import { onboardingRules, settingsRules } from '../validators/userValidators.js';
import { getMe } from '../controllers/users/getMe.js';
import { completeOnboarding } from '../controllers/users/completeOnboarding.js';
import { updateSettings } from '../controllers/users/updateSettings.js';

const router = Router();

router.get('/users/me', requireAuth, getMe);
router.patch(
  '/users/me/onboarding',
  requireAuth,
  requireRole(ROLES.STUDENT),
  onboardingRules,
  validate,
  completeOnboarding,
);
router.patch('/users/me/settings', requireAuth, settingsRules, validate, updateSettings);

export default router;
