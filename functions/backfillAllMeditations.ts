
import { base44 } from "@/api/base44Client";
import { queueTTSJob } from "@/functions/queueTTSJob";

export async function backfillAllMeditations() {
  const meditations = await base44.entities.Meditation.list();

  for (const med of meditations) {
    // Only queue TTS for user-created meditations (proper UUID format)
    // Skip library items with string IDs like "breath-calm"
    const isLibraryItem = typeof med.id === 'string' && !med.id.match(/^[a-f0-9-]{36}$/);
    
    if (!isLibraryItem && !med.tts_audio_url) {
      console.log("Queueing:", med.title);
      await queueTTSJob({ meditationId: med.id });
    } else {
      console.log("Already has audio or is library item:", med.title);
    }
  }

  console.log("Backfill queued.");
}
