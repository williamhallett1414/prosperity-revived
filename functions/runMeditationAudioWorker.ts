import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("[Worker] Starting meditation audio worker...");

    let processedCount = 0;
    let errorCount = 0;

    // Process ALL pending jobs in a loop
    while (true) {
      // Fetch next pending job
      const jobs = await base44.asServiceRole.entities.TTSJob.filter(
        { status: "pending" },
        "-created_date",
        1
      );

      if (!jobs || jobs.length === 0) {
        console.log("[Worker] No more pending jobs.");
        break;
      }

      const job = jobs[0];
      console.log("[Worker] Processing job:", job.id, "for meditation:", job.meditation_id);

      try {
        // Validate job and meditation_id
        if (!job.meditation_id) {
          throw new Error("Job missing meditation_id");
        }

        // Mark job as processing
        await base44.asServiceRole.entities.TTSJob.update(job.id, { 
          status: "processing" 
        });

        // Fetch meditation
        const meditation = await base44.asServiceRole.entities.Meditation.get(job.meditation_id);

        if (!meditation) {
          throw new Error(`Meditation not found: ${job.meditation_id}`);
        }

        // Mark meditation as generating
        await base44.asServiceRole.entities.Meditation.update(meditation.id, {
          status: "generating"
        });

        // Generate TTS audio (placeholder)
        console.log("[Worker] Generating TTS for:", meditation.id);
        const ttsUrl = `https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp3`;

        // Mix with ambient audio (placeholder)
        console.log("[Worker] Mixing audio for:", meditation.id);
        const finalUrl = ttsUrl;

        // Update meditation with final audio
        await base44.asServiceRole.entities.Meditation.update(meditation.id, {
          tts_audio_url: finalUrl,
          status: "ready"
        });

        // Mark job as complete
        await base44.asServiceRole.entities.TTSJob.update(job.id, {
          status: "complete"
        });

        console.log("[Worker] ✓ Completed job:", job.id);
        processedCount++;

      } catch (jobErr) {
        console.error("[Worker] Error processing job:", job.id, jobErr);
        errorCount++;

        // Mark job as error
        await base44.asServiceRole.entities.TTSJob.update(job.id, {
          status: "error",
          error_message: jobErr.message
        });

        // Mark meditation as error
        try {
          await base44.asServiceRole.entities.Meditation.update(job.meditation_id, {
            status: "error"
          });
        } catch (_) {}
      }
    }

    return Response.json({
      status: "success",
      message: "Worker completed",
      processed: processedCount,
      errors: errorCount
    });

  } catch (error) {
    console.error("[Worker] Fatal error:", error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});