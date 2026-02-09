
import { base44 } from '@/api/base44Client';
import { queueTTSJob } from './queueTTSJob';

export async function backfillAllMeditations() {
  try {
    // Get all meditations without audio
    const meditations = await base44.entities.Meditation.list();
    
    const meditationsNeedingAudio = meditations.filter(m => !m.tts_audio_url);

    console.log(`Found ${meditationsNeedingAudio.length} meditations needing audio generation`);

    // Queue TTS jobs for each
    for (const meditation of meditationsNeedingAudio) {
      await queueTTSJob(meditation.id);
      console.log(`Queued TTS job for: ${meditation.title}`);
    }

    console.log('Backfill complete. All meditations queued for audio generation.');
  } catch (error) {
    console.error('Backfill error:', error);
  }
}
