import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { logger } from './middleware/logger.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// First, so even requests that fail later (e.g. bad JSON) are logged
app.use(logger);

app.use(helmet());

// Browsers: only the listed frontend URLs. No-origin requests (Postman, mobile) are allowed.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  }),
);

// The API only receives short JSON (CSV uploads use multer)
app.use(express.json({ limit: '100kb' }));

app.use('/api/v1', routes);

// These two must stay last
app.use(notFound);
app.use(errorHandler);

export default app;
