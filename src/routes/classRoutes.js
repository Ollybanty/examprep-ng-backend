import { Router } from 'express';
import { requireAuth, requireRole, requireApprovedTeacher } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import { createClass } from '../controllers/classes/createClass.js';
import { listMyClasses } from '../controllers/classes/listMyClasses.js';
import { joinClass } from '../controllers/classes/joinClass.js';
import { createAssignment } from '../controllers/classes/createAssignment.js';
import { listAssignments } from '../controllers/classes/listAssignments.js';
import { getClassResults } from '../controllers/classes/getClassResults.js';
import { exportClassResults } from '../controllers/classes/exportClassResults.js';

const router = Router();

// /classes/join must stay above /classes/:id routes
router.post('/classes', requireAuth, requireApprovedTeacher, createClass);
router.get('/classes', requireAuth, requireRole(ROLES.TEACHER, ROLES.STUDENT), listMyClasses);
router.post('/classes/join', requireAuth, requireRole(ROLES.STUDENT), joinClass);
router.post('/classes/:id/assignments', requireAuth, requireApprovedTeacher, createAssignment);
router.get(
  '/classes/:id/assignments',
  requireAuth,
  requireRole(ROLES.TEACHER, ROLES.STUDENT),
  listAssignments,
);
router.get('/classes/:id/results', requireAuth, requireApprovedTeacher, getClassResults);
router.get('/classes/:id/results/export', requireAuth, requireApprovedTeacher, exportClassResults);

export default router;
