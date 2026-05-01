/**
 * chefDanielTTS — Google Cloud Text-to-Speech for Chef Daniel
 *
 * Voice: en-US-Neural2-D
 *   Deep, rich, authoritative Neural2 male — warm but grounded.
 *   Neural2 = Google's highest quality tier after Studio.
 *   Deeper than J; gives Chef Daniel a confident, experienced culinary voice.
 *
 * Speaking rate: 0.97  — measured, assured pace
 * Pitch:         -2.0  — noticeably deeper (semitones)
 * Volume:        +1.2 dB
 * EQ:            headphone-class-device
 *
 * Returns: { audioContent: <base64 MP3> }
 * Secret required in base44: Google_TTS
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user   = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, {
        status: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const { text } = await req.json();
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return Response.json({ error: 'text is required' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const apiKey = Deno.env.get('Google_TTS');
    if (!apiKey) {
      return Response.json({ error: 'Google_TTS secret not configured' }, {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const cleaned = text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim()
      .slice(0, 4500);

    if (!cleaned) {
      return Response.json({ error: 'Empty text after cleaning' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const ttsResponse = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: cleaned },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-D',  // Deep, rich, authoritative male — experienced chef energy
          },
          audioConfig: {
            audioEncoding:    'MP3',
            speakingRate:     0.97,   // Measured, assured pace
            pitch:            -2.0,   // Noticeably deeper (semitones)
            volumeGainDb:     1.2,
            effectsProfileId: ['headphone-class-device'],
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errBody = await ttsResponse.text();
      console.error('[chefDanielTTS] Google API error:', ttsResponse.status, errBody);
      return Response.json(
        { error: `Google TTS error: ${ttsResponse.status}` },
        { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const { audioContent } = await ttsResponse.json();
    if (!audioContent) {
      return Response.json({ error: 'Empty audio from Google TTS' }, {
        status: 502, headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    console.log(`[chefDanielTTS] ✓ Generated for user ${user.id}`);
    return Response.json(
      { audioContent },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (err) {
    console.error('[chefDanielTTS] Unexpected error:', err);
    return Response.json({ error: 'Internal server error' }, {
      status: 500, headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
});