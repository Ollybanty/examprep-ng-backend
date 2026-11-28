import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { logger } from './middleware/logger.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
import docsRoutes from './routes/docsRoutes.js';

const app = express();

// Behind Render's proxy, this makes req.ip the user's real IP, so rate limits work per user
app.set('trust proxy', env.trustProxy);

// First, so even requests that fail later (e.g. bad JSON) are logged
app.use(logger);

app.use(helmet());

// Browsers: only the listed frontend URLs. No-origin requests (Postman, mobile) are allowed.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      // Shows up in the logs, so a frontend CORS error is easy to trace
      console.warn(`CORS blocked: ${origin} (add it to CORS_ORIGINS to allow it)`);
      return callback(null, false);
    },
    // Lets the frontend read the file name of a download, like the class results CSV
    exposedHeaders: ['Content-Disposition'],
  }),
);

// The API only receives short JSON (CSV uploads use multer)
app.use(express.json({ limit: '100kb' }));

app.use('/api/v1', routes);

// Swagger docs, behind a username and password. Off unless DOCS_USERNAME and DOCS_PASSWORD are set.
if (env.docsUsername && env.docsPassword) app.use('/api/docs', docsRoutes);

// These two must stay last
app.use(notFound);
app.use(errorHandler);

export default app;
