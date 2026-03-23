import { runMeditationAudioWorker } from "./runMeditationAudioWorker.js";

let workerInterval = null;

/**
 * Start the meditation audio worker on a 15-second interval
 */
export function startMeditationWorker() {
  if (workerInterval) {
    console.log("[Worker] Worker already running");
    return;
  }

  console.log("[Worker] Starting meditation audio worker (15s interval)");

  // Run immediately first
  runMeditationAudioWorker().catch(err => {
    console.error("[Worker] Initial run error:", err);
  });

  // Then run every 15 seconds
  workerInterval = setInterval(() => {
    runMeditationAudioWorker().catch(err => {
      console.error("[Worker] Interval run error:", err);
    });
  }, 15000);
}

/**
 * Stop the meditation audio worker
 */
export function stopMeditationWorker() {
  if (workerInterval) {
    clearInterval(workerInterval);
    workerInterval = null;
    console.log("[Worker] Meditation audio worker stopped");
  }
}