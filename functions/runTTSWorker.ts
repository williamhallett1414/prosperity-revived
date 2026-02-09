import { base44 } from "@/api/base44Client";

export async function runTTSWorker() {
  // 1. Get the next pending job
  const jobs = await base44.entities.TTSJob.list({
    filter: { status: "pending" },
    limit: 1
  });

  if (jobs.length === 0) return;

  const job = jobs[0];

  // 2. Mark job as processing
  await base44.entities.TTSJob.update(job.id, {
    status: "processing"
  });

  try {
    // 3. Load the meditation
    const meditation = await base44.entities.Meditation.get(job.meditation_id);

    // 4. Generate TTS
    const tts = await base44.ai.textToSpeech.create({
      text: meditation.script,
      voice: "soothing_female",
      format: "mp3"
    });

    // 5. Save audio URL
    await base44.entities.Meditation.update(meditation.id, {
      tts_audio_url: tts.url
    });

    // 6. Mark job complete
    await base44.entities.TTSJob.update(job.id, {
      status: "complete"
    });

  } catch (err) {
    await base44.entities.TTSJob.update(job.id, {
      status: "error",
      error_message: err.message
    });
  }
}