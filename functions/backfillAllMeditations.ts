import { base44 } from "@/api/base44Client";

/**
 * Backfill: create TTS jobs for all meditations without audio
 */
export async function backfillAllMeditations() {
  try {
    const meditations = await base44.entities.Meditation.list();
    
    const meditationsNeedingAudio = meditations.filter(m => !m.tts_audio_url);
    
    console.log(`[Backfill] Found ${meditationsNeedingAudio.length} meditations needing audio`);

    // Queue TTS jobs for each
    for (const meditation of meditationsNeedingAudio) {
      await base44.entities.TTSJob.create({
        meditation_id: meditation.id,
        status: "pending"
      });
      console.log(`[Backfill] Queued TTS job for: ${meditation.title}`);
    }

    console.log(`[Backfill] Successfully queued ${meditationsNeedingAudio.length} jobs`);
    return {
      success: true,
      queued: meditationsNeedingAudio.length
    };
  } catch (error) {
    console.error("[Backfill] Error:", error);
    throw error;
  }
}