
import { base44 } from '@/api/base44Client';
import { queueTTSJob } from './queueTTSJob';
import { processAllPendingTTSJobs } from './runTTSWorker';

/**
 * Backfills all meditations without audio
 * Queues TTS jobs and processes them
 */
export async function backfillAllMeditations() {
  try {
    // Get all meditations without audio
    const meditations = await base44.entities.Meditation.list();
    
    const meditationsNeedingAudio = meditations.filter(m => !m.tts_audio_url);

    console.log(`\n[Backfill] Found ${meditationsNeedingAudio.length} meditations needing audio generation`);

    // Queue TTS jobs for each
    for (const meditation of meditationsNeedingAudio) {
      await queueTTSJob(meditation.id);
      console.log(`[Backfill] Queued TTS job for: ${meditation.title}`);
    }

    console.log(`[Backfill] Successfully queued ${meditationsNeedingAudio.length} jobs`);
    console.log('[Backfill] Starting audio generation processing...\n');

    // Process all pending jobs
    await processAllPendingTTSJobs();
    
    console.log('[Backfill] Complete. All meditations have been queued and processed for audio generation.');
  } catch (error) {
    console.error('[Backfill] Error:', error);
    throw error;
  }
}
