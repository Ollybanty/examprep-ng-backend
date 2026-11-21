import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import { listQuestions } from '../controllers/questions/listQuestions.js';
import { toggleBookmark } from '../controllers/questions/toggleBookmark.js';
import { listBookmarks } from '../controllers/questions/listBookmarks.js';
import { reportQuestion } from '../controllers/questions/reportQuestion.js';

const router = Router();

router.get('/questions', requireAuth, requireRole(ROLES.STUDENT), listQuestions);
router.post('/questions/:id/bookmark', requireAuth, requireRole(ROLES.STUDENT), toggleBookmark);
router.get('/bookmarks', requireAuth, requireRole(ROLES.STUDENT), listBookmarks);
router.post('/questions/:id/report', requireAuth, requireRole(ROLES.STUDENT), reportQuestion);

export default router;
