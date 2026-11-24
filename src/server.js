import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';
import { isEmailConfigured } from './services/emailService.js';
import { startAutoSubmitJob } from './jobs/autoSubmitJob.js';

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }

  // Auto submits expired CBT mocks every minute
  startAutoSubmitJob();

  if (env.isProduction && !isEmailConfigured) {
    console.warn(
      `Email is not set up (EMAIL_PROVIDER=${env.emailProvider}). Codes and invites will fail.`,
    );
  }

  app.listen(env.port, () => {
    if (env.isProduction) {
      console.log(`Server running on port ${env.port} (production)`);
      return;
    }
    console.log(`Server running on http://localhost:${env.port} (${env.nodeEnv})`);
    if (env.docsUsername && env.docsPassword) {
      console.log(`API docs: http://localhost:${env.port}/api/docs`);
    }
  });
}

start();
