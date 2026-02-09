import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    });

    console.log('[Worker] Starting meditation audio worker...');

    let processedCount = 0;
    let errorCount = 0;

    while (true) {
      const jobs = await base44.asServiceRole.entities.TTSJob.filter(
        { status: 'pending' },
        '-created_date',
        1
      );

      if (!jobs || jobs.length === 0) break;

      const job = jobs[0];
      console.log('[Worker] Processing job:', job.id);

      let success = false;
      let retries = 0;
      const maxRetries = 3;

      while (retries < maxRetries && !success) {
        try {
          await base44.asServiceRole.entities.TTSJob.update(job.id, {
            status: 'processing'
          });

          const meditation = await base44.asServiceRole.entities.Meditation.get(
            job.meditation_id
          );

          if (!meditation) throw new Error('Meditation not found');

          await base44.asServiceRole.entities.Meditation.update(meditation.id, {
            status: 'generating'
          });

          // Generate TTS audio with OpenAI
          console.log('[Worker] Generating TTS with OpenAI (attempt', retries + 1, 'of', maxRetries, ')...');
          const ttsResponse = await openai.audio.speech.create({
            model: 'tts-1',
            voice: 'alloy',
            input: meditation.script
          });

          // Get audio as buffer
          const audioBuffer = await ttsResponse.arrayBuffer();
          
          // Upload to Base44 storage (public)
          console.log('[Worker] Uploading audio file...');
          const uploadResult = await base44.integrations.Core.UploadFile({
            file: new Blob([audioBuffer], { type: 'audio/mpeg' })
          });

          const finalUrl = uploadResult.file_url;

          // Update meditation with final audio URL
          await base44.asServiceRole.entities.Meditation.update(meditation.id, {
            tts_audio_url: finalUrl,
            status: 'ready'
          });

          // Mark job complete
          await base44.asServiceRole.entities.TTSJob.update(job.id, {
            status: 'complete'
          });

          processedCount++;
          console.log('[Worker] ✓ Completed job:', job.id);
          success = true;

          // Delay to avoid rate limiting
          console.log('[Worker] Waiting 1500ms before next job...');
          await sleep(1500);

        } catch (err) {
          // Check if it's a rate limit error
          const isRateLimit = err.status === 429 || 
                             err.code === 'rate_limit_exceeded' ||
                             (err.message && err.message.includes('rate limit'));

          if (isRateLimit && retries < maxRetries - 1) {
            retries++;
            console.log('[Worker] Rate limit hit. Retrying in 2 seconds... (attempt', retries + 1, 'of', maxRetries, ')');
            await sleep(2000);
          } else {
            console.error('[Worker] Error processing job:', err.message);
            errorCount++;

            await base44.asServiceRole.entities.TTSJob.update(job.id, {
              status: 'error',
              error_message: err.message
            });

            try {
              await base44.asServiceRole.entities.Meditation.update(
                job.meditation_id,
                { status: 'error' }
              );
            } catch (_) {}

            success = true; // Exit retry loop on non-rate-limit error
          }
        }
      }
    }

    return Response.json({
      status: 'success',
      processed: processedCount,
      errors: errorCount
    });

  } catch (error) {
    console.error('[Worker] Fatal error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});