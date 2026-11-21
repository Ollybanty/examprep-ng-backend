import { isDBConnected } from '../config/db.js';

// GET /api/v1/health
export function getHealth(req, res) {
  const dbConnected = isDBConnected();

  res.status(dbConnected ? 200 : 503).json({
    data: {
      status: dbConnected ? 'ok' : 'degraded',
      database: dbConnected ? 'connected' : 'disconnected',
      time: new Date().toISOString(),
    },
  });
}
