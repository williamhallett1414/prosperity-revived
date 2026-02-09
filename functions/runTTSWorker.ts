import { base44 } from "@/api/base44Client";
import { mixMeditationAudio } from "@/api/mixMeditationAudio";

// Optional: simple retry cap on jobs
const MAX_RETRIES = 3;

async function autoQueueMissingMeditations() {
  const meditations = await base44.entities.Meditation.list();

  for (const med of meditations) {
    // Only queue if no audio AND not already generating/ready/error
    if (!med.tts_audio_url && med.status === "pending") {
      console.log("[Worker] Auto-queueing meditation:", med.id);

      await base44.entities.TTSJob.create({
        meditation_id: med.id,
        status: "pending",
        attempts: 0
      });
    }
  }
}

async function getNextJob() {
  const jobs = await base44.entities.TTSJob.filter(
    { status: "pending" },
    "",
    1
  );

  return jobs[0] || null;
}

async function processJob(job) {
  console.log("[Worker] Processing job:", job.id, "for meditation:", job.meditation_id);

  // Mark job as processing
  await base44.entities.TTSJob.update(job.id, { status: "processing" });

  try {
    const meditation = await base44.entities.Meditation.get(job.meditation_id);

    if (!meditation) {
      throw new Error(`Meditation not found: ${job.meditation_id}`);
    }

    // Mark meditation as generating
    await base44.entities.Meditation.update(meditation.id, {
      status: "generating"
    });

    // Generate TTS
    console.log("[Worker] Generating TTS for:", meditation.id);
    const ttsResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a high-quality audio narration of the following meditation script in a calm, soothing, peaceful tone. Use a female voice. Return the audio file in MP3 format.\n\nScript:\n${meditation.script}`,
      add_context_from_internet: false
    });

    const ttsUrl = ttsResponse;

    // Mix with ambient
    console.log("[Worker] Mixing audio for:", meditation.id);
    const finalUrl = await mixMeditationAudio({
      ttsUrl,
      ambientUrl: meditation.ambient_url || "/ambient/calm_river.mp3"
    });

    // Update meditation with final audio
    await base44.entities.Meditation.update(meditation.id, {
      tts_audio_url: finalUrl,
      status: "ready"
    });

    // Mark job complete
    await base44.entities.TTSJob.update(job.id, {
      status: "complete"
    });

    console.log("[Worker] ✓ Completed job:", job.id);
  } catch (err) {
    console.error("[Worker] Error processing job:", job.id, err);

    const attempts = (job.attempts || 0) + 1;
    const isMaxed = attempts >= MAX_RETRIES;

    await base44.entities.TTSJob.update(job.id, {
      status: isMaxed ? "error" : "pending",
      attempts,
      error_message: err.message
    });

    if (!isMaxed) {
      console.log("[Worker] Job will be retried:", job.id, "attempt:", attempts);
    } else {
      console.log("[Worker] Job reached max retries, marked as error:", job.id);
      // Also mark meditation as error
      try {
        await base44.entities.Meditation.update(job.meditation_id, {
          status: "error"
        });
      } catch (_) {}
    }
  }
}

export async function runMeditationAudioWorker() {
  console.log("[Worker] Running meditation audio worker…");

  // 1) Auto-queue any meditations missing audio
  await autoQueueMissingMeditations();

  // 2) Fetch next pending job
  const job = await getNextJob();
  if (!job) {
    console.log("[Worker] No pending jobs found.");
    return;
  }

  // 3) Process that job
  await processJob(job);
}