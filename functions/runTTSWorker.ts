import { base44 } from "@/api/base44Client";

export async function runTTSWorker(meditationId) {
  // 1. Get the job for this meditation
  const jobs = await base44.entities.TTSJob.filter({ 
    meditation_id: meditationId 
  }, '-created_date', 1);

  if (jobs.length === 0) return null;

  const job = jobs[0];

  // 2. If already processing or complete, poll for status
  if (job.status === "processing" || job.status === "pending") {
    // Poll every 2 seconds for up to 30 seconds
    const maxAttempts = 15;
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedJobs = await base44.entities.TTSJob.filter({ id: job.id }, null, 1);
      const currentJob = updatedJobs[0];

      if (currentJob.status === "complete") {
        const meditations = await base44.entities.Meditation.filter({ id: meditationId }, null, 1);
        return meditations[0];
      }

      if (currentJob.status === "error") {
        throw new Error(currentJob.error_message || 'TTS generation failed');
      }

      attempts++;
    }

    throw new Error('TTS generation timed out');
  }

  if (job.status === "complete") {
    const meditations = await base44.entities.Meditation.filter({ id: meditationId }, null, 1);
    return meditations[0];
  }

  if (job.status === "error") {
    throw new Error(job.error_message || 'TTS generation failed');
  }

  return null;
}