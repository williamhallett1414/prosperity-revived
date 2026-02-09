import { base44 } from '@/api/base44Client';
import { generateAndMixAudio } from './generateAndMixAudio';

/**
 * Auto-queues meditations that don't have audio yet
 */
async function autoQueueMissingMeditations() {
  try {
    const meditations = await base44.entities.Meditation.list();
    
    for (const meditation of meditations) {
      if (!meditation.tts_audio_url && meditation.status === 'pending') {
        const existingJob = await base44.entities.TTSJob.filter(
          { meditation_id: meditation.id },
          '',
          1
        );
        
        if (existingJob.length === 0) {
          console.log(`[TTS Worker] Auto-queuing: ${meditation.id} - ${meditation.title}`);
          await base44.entities.TTSJob.create({
            meditation_id: meditation.id,
            status: 'pending'
          });
        }
      }
    }
  } catch (error) {
    console.error('[TTS Worker] Auto-queue error:', error);
  }
}

/**
 * Background worker that processes pending TTS jobs
 * - Auto-queues any meditations missing audio
 * - Fetches pending meditation audio generation jobs
 * - Generates TTS from meditation scripts
 * - Mixes TTS with ambient background music
 * - Updates meditation records with final audio URLs
 * - Handles errors gracefully
 */
export async function runTTSWorker() {
  try {
    // Auto-queue any missing meditations before processing
    await autoQueueMissingMeditations();

    // Fetch first pending TTS job
    const jobs = await base44.entities.TTSJob.filter(
      { status: 'pending' },
      '',
      1
    );

    if (jobs.length === 0) {
      console.log('[TTS Worker] No pending jobs');
      return;
    }

    const job = jobs[0];
    console.log(`[TTS Worker] Processing job: ${job.id}`);

    // Update job status to processing
    await base44.entities.TTSJob.update(job.id, { 
      status: 'processing',
      error_message: null
    });

    // Fetch the meditation record
    const meditations = await base44.entities.Meditation.filter(
      { id: job.meditation_id },
      '',
      1
    );

    if (meditations.length === 0) {
      throw new Error(`Meditation not found: ${job.meditation_id}`);
    }

    const meditation = meditations[0];
    console.log(`[TTS Worker] Fetching meditation: ${meditation.id}`);

    // Update meditation status to generating
    await base44.entities.Meditation.update(meditation.id, {
      status: 'generating'
    });

    // Generate TTS and mix with ambient music
    const finalAudioUrl = await generateAndMixAudio(
      meditation.script,
      meditation.ambient_url || '/ambient/calm_river.mp3',
      meditation.id
    );

    // Update meditation with final mixed audio URL
    await base44.entities.Meditation.update(meditation.id, {
      tts_audio_url: finalAudioUrl,
      status: 'ready'
    });

    console.log(`[TTS Worker] ✓ Meditation ready: ${meditation.id}`);
    console.log(`[TTS Worker] Audio URL: ${finalAudioUrl}`);

    // Mark job as complete
    await base44.entities.TTSJob.update(job.id, { 
      status: 'complete',
      error_message: null
    });

  } catch (error) {
    console.error('[TTS Worker] Error:', error);
    
    // Update job with error status
    try {
      const jobs = await base44.entities.TTSJob.filter(
        { status: 'processing' },
        '',
        1
      );
      
      if (jobs.length > 0) {
        await base44.entities.TTSJob.update(jobs[0].id, {
          status: 'error',
          error_message: error.message
        });

        // Also update meditation status
        if (jobs[0].meditation_id) {
          await base44.entities.Meditation.update(jobs[0].meditation_id, {
            status: 'error'
          });
        }
      }
    } catch (updateError) {
      console.error('[TTS Worker] Failed to update error status:', updateError);
    }
  }
}

/**
 * Helper function to process all pending TTS jobs sequentially
 * Call this periodically (every 15-30 seconds) from your backend
 */
export async function processAllPendingTTSJobs() {
  const maxRetries = 10;
  let processed = 0;

  for (let i = 0; i < maxRetries; i++) {
    const jobs = await base44.entities.TTSJob.filter(
      { status: 'pending' },
      '',
      1
    );

    if (jobs.length === 0) {
      console.log(`[TTS Worker] Completed ${processed} jobs`);
      break;
    }

    await runTTSWorker();
    processed++;
  }
}