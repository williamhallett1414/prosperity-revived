import { base44 } from "@/api/base44Client";
import { GUIDED_MEDITATIONS_SEED } from "@/data/meditationSeed";

export async function resetReseedBackfill() {
  try {
    console.log("\n[Reset] Starting RESET + RESEED + BACKFILL…\n");

    // 1. DELETE ALL EXISTING MEDITATIONS
    console.log("[Reset] Deleting all existing meditations…");
    const existing = await base44.entities.Meditation.list();
    for (const med of existing) {
      await base44.entities.Meditation.delete(med.id);
    }
    console.log(`[Reset] ✓ Deleted ${existing.length} meditations`);

    // 2. DELETE ALL EXISTING TTS JOBS
    console.log("[Reset] Deleting all existing TTS jobs…");
    const existingJobs = await base44.entities.TTSJob.list();
    for (const job of existingJobs) {
      await base44.entities.TTSJob.delete(job.id);
    }
    console.log(`[Reset] ✓ Deleted ${existingJobs.length} TTS jobs`);

    // 3. RESEED ALL 30 MEDITATIONS
    console.log("[Reset] Reseeding all 30 meditations…");
    for (const med of GUIDED_MEDITATIONS_SEED) {
      await base44.entities.Meditation.create({
        id: med.id,
        title: med.title,
        description: med.description,
        category: med.category,
        duration_minutes: med.duration_minutes,
        image_url: med.image_url,
        script: med.script,
        ambient_url: med.ambient_url,
        status: "pending",
        tts_audio_url: null
      });
    }
    console.log(`[Reset] ✓ Reseeded ${GUIDED_MEDITATIONS_SEED.length} meditations`);

    // 4. QUEUE TTS JOBS FOR ALL 30
    console.log("[Reset] Queuing TTS jobs…");
    const seeded = await base44.entities.Meditation.list();
    for (const med of seeded) {
      await base44.entities.TTSJob.create({
        meditation_id: med.id,
        status: "pending",
        attempts: 0
      });
    }
    console.log(`[Reset] ✓ Queued ${seeded.length} TTS jobs`);

    console.log("\n[Reset] ✓ Reset + Reseed + Backfill completed successfully\n");

    return {
      success: true,
      message: "Reset + Reseed + Backfill completed successfully",
      meditationsCount: seeded.length,
      jobsQueued: seeded.length
    };
  } catch (err) {
    console.error("[Reset] Error:", err);
    throw err;
  }
}