import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import { getMastery } from '../controllers/analytics/getMastery.js';

const router = Router();

router.get('/analytics/mastery', requireAuth, requireRole(ROLES.STUDENT), getMastery);

export default router;
