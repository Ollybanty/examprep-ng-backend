import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';

// Mounted under /api/v1. Route files use full paths (e.g. '/auth/login') so they're easy to search.
const router = Router();

router.get('/health', getHealth);

export default router;
