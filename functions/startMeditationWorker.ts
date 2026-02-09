import { runMeditationAudioWorker } from "./runTTSWorker.js";

let workerInterval = null;

/**
 * Start the meditation audio worker on a 15-second interval
 * This runs server-side and auto-generates audio for meditations
 */
export function startMeditationWorker() {
  if (workerInterval) {
    console.log("[Worker] Meditation audio worker is already running");
    return;
  }

  console.log("[Worker] Starting meditation audio worker (15s interval)…");

  workerInterval = setInterval(() => {
    runMeditationAudioWorker().catch(err => {
      console.error("[Worker] Error in worker interval:", err);
    });
  }, 15000); // 15 seconds

  // Also run once immediately
  runMeditationAudioWorker().catch(err => {
    console.error("[Worker] Error on initial run:", err);
  });
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