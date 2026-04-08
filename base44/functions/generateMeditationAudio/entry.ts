import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { meditation } = await req.json();
    if (!meditation?.script || !meditation?.id) {
      return Response.json({ error: 'Meditation with script required' }, { status: 400 });
    }

    // Generate audio using Hannah's voice
    const ttsResponse = await base44.functions.invoke('hannahTTS', {
      text: meditation.script
    });

    if (!ttsResponse?.audioContent) {
      throw new Error('Failed to generate audio with Hannah voice');
    }

    // Convert base64 audio to blob URL format for storage
    const dataUrl = `data:audio/mp3;base64,${ttsResponse.audioContent}`;

    // Save the audio URL back to the meditation record
    const updated = await base44.entities.Meditation.update(meditation.id, {
      tts_audio_url: dataUrl
    });

    return Response.json({ success: true, meditation: updated });
  } catch (error) {
    console.error('[generateMeditationAudio] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});