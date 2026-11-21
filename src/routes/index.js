import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import catalogRoutes from './catalogRoutes.js';
import questionRoutes from './questionRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import classRoutes from './classRoutes.js';
import adminRoutes from './adminRoutes.js';

// Mounted under /api/v1. Route files use full paths (e.g. '/auth/login') so they're easy to search.
const router = Router();

router.get('/health', getHealth);

router.use(authRoutes);
router.use(userRoutes);
router.use(catalogRoutes);
router.use(questionRoutes);
router.use(sessionRoutes);
router.use(analyticsRoutes);
router.use(classRoutes);
router.use(adminRoutes);

export default router;
