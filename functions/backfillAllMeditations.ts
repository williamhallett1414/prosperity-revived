import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("[Backfill] Creating TTS jobs for meditations missing audio...");

    // Fetch all meditations
    const meditations = await base44.asServiceRole.entities.Meditation.list();

    let queuedCount = 0;
    let skippedCount = 0;

    for (const meditation of meditations) {
      // Only queue if meditation has no audio URL
      if (!meditation.tts_audio_url) {
        console.log("[Backfill] Queueing meditation:", meditation.id);

        await base44.asServiceRole.entities.TTSJob.create({
          meditation_id: meditation.id,
          status: "pending"
        });

        queuedCount++;
      } else {
        skippedCount++;
      }
    }

    return Response.json({
      status: "success",
      message: "Backfill completed",
      queued: queuedCount,
      skipped: skippedCount,
      total: meditations.length
    });

  } catch (error) {
    console.error("[Backfill] Error:", error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});