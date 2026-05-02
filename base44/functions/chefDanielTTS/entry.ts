/**
 * Chef Daniel TTS — ElevenLabs Voice: Adam (pNInz6obpgDQGcFmaJgB)
 * Deep, warm male voice perfect for a chef persona.
 *
 * Converts text to speech using ElevenLabs API.
 * Returns base64-encoded MP3 audio.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return Response.json({ audioContent: null, error: 'No text provided' });
    }

    const API_KEY = Deno.env.get('ElevenLabs');
    const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam — deep warm male voice

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: text.slice(0, 5000),
          model_id: 'eleven_flash_v2_5',
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Chef Daniel TTS] ElevenLabs error:', response.status, errText);
      return Response.json({ audioContent: null, error: `ElevenLabs API error: ${response.status}` });
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const audioContent = btoa(binary);

    return Response.json({ audioContent });
  } catch (error) {
    console.error('[Chef Daniel TTS] Error:', error.message);
    return Response.json({ audioContent: null, error: error.message }, { status: 500 });
  }
});