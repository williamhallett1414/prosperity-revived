import { base44 } from "@/api/base44Client";
import { generateTTSAudio } from "./generateTTSAudio.js";
import { mixMeditationAudio } from "./mixMeditationAudio.js";

/**
 * Backend worker function - runs server-side
 * Can be triggered via scheduled task or API call
 */
export async function runScheduledMeditationWorker() {
  console.log("[Backend Worker] Starting meditation audio worker…");

  try {
    // Auto-queue meditations missing audio
    const meditations = await base44.entities.Meditation.list();
    for (const med of meditations) {
      if (!med.tts_audio_url && med.status === "pending") {
        console.log("[Backend Worker] Auto-queueing meditation:", med.id);
        await base44.entities.TTSJob.create({
          meditation_id: med.id,
          status: "pending"
        });
      }
    }

    // Get next pending job
    const jobs = await base44.entities.TTSJob.filter({ status: "pending" }, "", 1);
    const job = jobs[0];

    if (!job) {
      console.log("[Backend Worker] No pending jobs found.");
      return { status: "success", message: "No jobs to process" };
    }

    console.log("[Backend Worker] Processing job:", job.id, "for meditation:", job.meditation_id);

    // Mark job as processing
    await base44.entities.TTSJob.update(job.id, { status: "processing" });

    try {
      const meditation = await base44.entities.Meditation.get(job.meditation_id);

      if (!meditation) {
        throw new Error(`Meditation not found: ${job.meditation_id}`);
      }

      // Mark meditation as generating
      await base44.entities.Meditation.update(meditation.id, { status: "generating" });

      // Generate TTS
      console.log("[Backend Worker] Generating TTS for:", meditation.id);
      const ttsUrl = await generateTTSAudio(meditation.script);

      // Mix with ambient
      console.log("[Backend Worker] Mixing audio for:", meditation.id);
      const finalUrl = await mixMeditationAudio({
        ttsUrl,
        ambientUrl: meditation.ambient_url
      });

      // Update meditation with final audio
      await base44.entities.Meditation.update(meditation.id, {
        tts_audio_url: finalUrl,
        status: "ready"
      });

      // Mark job complete
      await base44.entities.TTSJob.update(job.id, { status: "complete" });

      console.log("[Backend Worker] ✓ Completed job:", job.id);

      return {
        status: "success",
        message: "Job completed successfully",
        meditation_id: meditation.id,
        job_id: job.id
      };
    } catch (err) {
      console.error("[Backend Worker] Error processing job:", job.id, err);

      // Mark job and meditation as error
      await base44.entities.TTSJob.update(job.id, {
        status: "error",
        error_message: err.message
      });

      try {
        await base44.entities.Meditation.update(job.meditation_id, {
          status: "error"
        });
      } catch (_) {}

      return {
        status: "error",
        message: "Job failed",
        error: err.message
      };
    }
  } catch (err) {
    console.error("[Backend Worker] Fatal error:", err);
    return {
      status: "error",
      message: "Worker failed",
      error: err.message
    };
  }
}