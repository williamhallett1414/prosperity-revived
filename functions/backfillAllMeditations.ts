import { base44 } from "@/api/base44Client";
import { queueTTSJob } from "@/functions/queueTTSJob";

export async function backfillAllMeditations() {
  const meditations = await base44.entities.Meditation.list();

  for (const med of meditations) {
    if (!med.tts_audio_url) {
      console.log("Queueing:", med.title);
      await queueTTSJob(med.id);
    } else {
      console.log("Already has audio:", med.title);
    }
  }

  console.log("Backfill queued.");
}