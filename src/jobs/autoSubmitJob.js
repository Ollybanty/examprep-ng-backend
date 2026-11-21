// to be handled by:
// Every minute, find CBT sessions that are still in_progress but whose expires_at has passed,
// and auto-submit each one with sessionTimer.autoSubmitIfExpired().
// This catches mocks where the student closed the app and never came back.
//
// When it's built, start it in src/server.js after the database connects:
//   import { startAutoSubmitJob } from './jobs/autoSubmitJob.js';
//   startAutoSubmitJob();
//
// import cron from 'node-cron';
export function startAutoSubmitJob() {
  // cron.schedule('* * * * *', async () => { ... });
  throw new Error('startAutoSubmitJob is not implemented yet');
}
