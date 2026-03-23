/**
 * coachDavidTTS — Google Cloud Text-to-Speech for Coach David
 *
 * Voice: en-US-Neural2-D
 *   Authoritative, grounded, commanding Neural2 male voice.
 *   Google's own recommended male Neural2 for en-US.
 *   Deeper and more driven than Chef Daniel (Neural2-J).
 *   Distinct from Gideon (Studio-Q: deep/reverent) and
 *   Chef Daniel (Neural2-J: warm/friendly).
 *
 * Speaking rate: 1.10  — driven pace, punchy coach energy
 * Pitch:         -1.5  — grounded masculine authority (semitones)
 * Volume:        +1.8 dB — fills the room like a real coach
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
            name: 'en-US-Neural2-D',  // Authoritative, grounded — Google's recommended male Neural2
          },
          audioConfig: {
            audioEncoding:    'MP3',
            speakingRate:     1.10,   // Punchy driven coach pace
            pitch:            -1.5,   // Grounded masculine authority (semitones)
            volumeGainDb:     1.8,    // Fills the room — coach energy
            effectsProfileId: ['headphone-class-device'],
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errBody = await ttsResponse.text();
      console.error('[coachDavidTTS] Google API error:', ttsResponse.status, errBody);
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

    console.log(`[coachDavidTTS] ✓ Generated for user ${user.id}`);
    return Response.json(
      { audioContent },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (err) {
    console.error('[coachDavidTTS] Unexpected error:', err);
    return Response.json({ error: 'Internal server error' }, {
      status: 500, headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
});
