import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { listYearsRules } from '../validators/catalogValidators.js';
import { listExams } from '../controllers/catalog/listExams.js';
import { listSubjects } from '../controllers/catalog/listSubjects.js';
import { listTopics } from '../controllers/catalog/listTopics.js';
import { listYears } from '../controllers/catalog/listYears.js';

const router = Router();

router.get('/exams', requireAuth, listExams);
router.get('/subjects', requireAuth, listSubjects);
router.get('/topics', requireAuth, listTopics);
router.get('/years', requireAuth, listYearsRules, validate, listYears);

export default router;
