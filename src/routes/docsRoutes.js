import { readFileSync } from 'node:fs';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';
import { docsLoginLimiter } from '../middleware/rateLimit.js';
import { docsAuth } from '../middleware/docsAuth.js';

// Read once at start up. Restart the server after editing docs/openapi.yaml.
const spec = parse(readFileSync(new URL('../../docs/openapi.yaml', import.meta.url), 'utf8'));

const router = Router();

// Every docs request needs the login, including the page's own scripts and the raw spec
router.use(docsLoginLimiter, docsAuth);

// The raw spec, for importing into Postman
router.get('/openapi.json', (req, res) => res.json(spec));

router.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(spec, {
    customSiteTitle: 'ExamPrep NG API docs',
    // Tokens pasted into Authorize are forgotten when the tab closes
    swaggerOptions: { persistAuthorization: false },
  }),
);

export default router;
