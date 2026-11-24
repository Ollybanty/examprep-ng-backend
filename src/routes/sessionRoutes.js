import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import { validate } from '../middleware/validate.js';
import {
  startSessionRules,
  getSessionRules,
  saveAnswerRules,
} from '../validators/sessionValidators.js';
import { startSession } from '../controllers/sessions/startSession.js';
import { getSessionHistory } from '../controllers/sessions/getSessionHistory.js';
import { getSession } from '../controllers/sessions/getSession.js';
import { saveAnswer } from '../controllers/sessions/saveAnswer.js';
import { submitSession } from '../controllers/sessions/submitSession.js';
import { getSessionReview } from '../controllers/sessions/getSessionReview.js';

const router = Router();

// /sessions/history must stay above /sessions/:id, or "history" is treated as an id
router.post(
  '/sessions',
  requireAuth,
  requireRole(ROLES.STUDENT),
  startSessionRules,
  validate,
  startSession,
);
router.get('/sessions/history', requireAuth, requireRole(ROLES.STUDENT), getSessionHistory);
router.get(
  '/sessions/:id',
  requireAuth,
  requireRole(ROLES.STUDENT),
  getSessionRules,
  validate,
  getSession,
);
router.patch(
  '/sessions/:id/answer',
  requireAuth,
  requireRole(ROLES.STUDENT),
  saveAnswerRules,
  validate,
  saveAnswer,
);
router.post('/sessions/:id/submit', requireAuth, requireRole(ROLES.STUDENT), submitSession);
router.get('/sessions/:id/review', requireAuth, requireRole(ROLES.STUDENT), getSessionReview);

export default router;
