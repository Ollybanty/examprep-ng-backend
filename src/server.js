import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

start();
