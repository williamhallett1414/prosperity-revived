/**
 * chefDanielTTS — Google Cloud Text-to-Speech for Chef Daniel
 *
 * Voice: en-US-Studio-M
 *   Google's warm, bright Studio male voice — upbeat and expressive,
 *   perfect for a charismatic culinary coach who loves food.
 *   Studio-M sits higher and more energetic than Studio-Q (Gideon's deep gravitas).
 *
 * Speaking rate: 1.02  — lively, food-enthusiast energy without rushing
 * Pitch:         +1.5  — slightly lifted, bright warmth (semitones)
 * Volume:        +1.2 dB
 * EQ:            headphone-class-device (warm, present)
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

    // Strip markdown formatting before sending to TTS
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

    // Voice: en-US-Studio-M — warm, bright, expressive Studio male
    const ttsResponse = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: cleaned },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Studio-M',  // Bright, warm, enthusiastic — perfect chef energy
          },
          audioConfig: {
            audioEncoding:    'MP3',
            speakingRate:     1.02,   // Lively food-coach pace
            pitch:            1.5,    // Slightly lifted warmth (semitones)
            volumeGainDb:     1.2,    // Present but not overpowering
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
        status: 502,
        headers: { 'Access-Control-Allow-Origin': '*' },
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
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
});
