import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import { uploadCsv } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import {
  listTeachersRules,
  reviewTeacherRules,
  inviteAdminRules,
  listUsersRules,
  updateUserRules,
} from '../validators/adminValidators.js';
import { createQuestion } from '../controllers/admin/createQuestion.js';
import { listAdminQuestions } from '../controllers/admin/listAdminQuestions.js';
import { getAdminQuestion } from '../controllers/admin/getAdminQuestion.js';
import { updateQuestion } from '../controllers/admin/updateQuestion.js';
import { changeQuestionStatus } from '../controllers/admin/changeQuestionStatus.js';
import { bulkUploadQuestions } from '../controllers/admin/bulkUploadQuestions.js';
import { listReports } from '../controllers/admin/listReports.js';
import { resolveReport } from '../controllers/admin/resolveReport.js';
import { listTeachers } from '../controllers/admin/listTeachers.js';
import { reviewTeacher } from '../controllers/admin/reviewTeacher.js';
import { inviteAdmin } from '../controllers/admin/inviteAdmin.js';
import { listUsers } from '../controllers/admin/listUsers.js';
import { updateUser } from '../controllers/admin/updateUser.js';
import { getUsageAnalytics } from '../controllers/admin/getUsageAnalytics.js';

const router = Router();

router.post('/admin/questions', requireAuth, requireRole(ROLES.ADMIN), createQuestion);
router.get('/admin/questions', requireAuth, requireRole(ROLES.ADMIN), listAdminQuestions);
router.get('/admin/questions/:id', requireAuth, requireRole(ROLES.ADMIN), getAdminQuestion);
router.patch('/admin/questions/:id', requireAuth, requireRole(ROLES.ADMIN), updateQuestion);
router.patch(
  '/admin/questions/:id/status',
  requireAuth,
  requireRole(ROLES.ADMIN),
  changeQuestionStatus,
);
router.post(
  '/admin/questions/bulk-csv',
  requireAuth,
  requireRole(ROLES.ADMIN),
  uploadCsv,
  bulkUploadQuestions,
);
router.get('/admin/reports', requireAuth, requireRole(ROLES.ADMIN), listReports);
router.patch('/admin/reports/:id', requireAuth, requireRole(ROLES.ADMIN), resolveReport);
router.get(
  '/admin/teachers',
  requireAuth,
  requireRole(ROLES.ADMIN),
  listTeachersRules,
  validate,
  listTeachers,
);
router.patch(
  '/admin/teachers/:id/approval',
  requireAuth,
  requireRole(ROLES.ADMIN),
  reviewTeacherRules,
  validate,
  reviewTeacher,
);
router.post(
  '/admin/invites',
  requireAuth,
  requireRole(ROLES.ADMIN),
  inviteAdminRules,
  validate,
  inviteAdmin,
);
router.get(
  '/admin/users',
  requireAuth,
  requireRole(ROLES.ADMIN),
  listUsersRules,
  validate,
  listUsers,
);
router.patch(
  '/admin/users/:id',
  requireAuth,
  requireRole(ROLES.ADMIN),
  updateUserRules,
  validate,
  updateUser,
);
router.get('/admin/analytics', requireAuth, requireRole(ROLES.ADMIN), getUsageAnalytics);

export default router;
