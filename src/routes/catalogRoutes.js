import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listExams } from '../controllers/catalog/listExams.js';
import { listSubjects } from '../controllers/catalog/listSubjects.js';
import { listTopics } from '../controllers/catalog/listTopics.js';

const router = Router();

router.get('/exams', requireAuth, listExams);
router.get('/subjects', requireAuth, listSubjects);
router.get('/topics', requireAuth, listTopics);

export default router;
