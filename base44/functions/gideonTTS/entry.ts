/**
 * gideonTTS — Google Cloud Text-to-Speech for Gideon
 *
 * Uses en-US-Studio-Q: Google's deepest, warmest Studio-quality male voice.
 * Speaking rate 0.88 (unhurried, every word carries weight).
 * Pitch -4.0 semitones (grounded gravitas, not robotic deep).
 *
 * Returns: { audioContent: <base64 MP3> }
 *
 * Secret required in base44: GOOGLE_TTS_API_KEY
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  // ── CORS pre-flight ──────────────────────────────────────────────────────
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
    // ── Auth ─────────────────────────────────────────────────────────────
    const base44 = createClientFromRequest(req);
    const user   = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, {
        status: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    // ── Parse body ───────────────────────────────────────────────────────
    const { text } = await req.json();
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return Response.json({ error: 'text is required' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    // ── Sanitize text for TTS ────────────────────────────────────────────
    const cleaned = text
      .replace(/\*\*(.+?)\*\*/g, '$1')   // strip bold markdown
      .replace(/\*(.+?)\*/g,     '$1')   // strip italic markdown
      .replace(/#{1,6}\s+/g,     '')     // strip headings
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // strip code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip links → label only
      .replace(/\n{3,}/g, '\n\n')        // collapse extra newlines
      .trim()
      .slice(0, 4500);                   // Google TTS hard limit is 5000 chars

    if (!cleaned) {
      return Response.json({ error: 'No speakable text after cleaning' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    // ── Google Cloud TTS API key ─────────────────────────────────────────
    const apiKey = Deno.env.get('Google_TTS');
    if (!apiKey) {
      console.error('[gideonTTS] GOOGLE_TTS_API_KEY secret not set');
      return Response.json({ error: 'TTS not configured' }, {
        status: 503,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    // ── Call Google Cloud TTS ─────────────────────────────────────────────
    // Voice: en-US-Studio-Q — deepest, warmest Google Studio male voice
    // Studio voices require audioEncoding LINEAR16 or MP3 — we use MP3
    const ttsResponse = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: cleaned },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Journey-D',  // Journey: most natural, wise elder male
          },
          audioConfig: {
            audioEncoding:  'MP3',
            speakingRate:   0.85,     // Slow, deliberate — every word has weight
            volumeGainDb:   1.0,
            effectsProfileId: ['headphone-class-device'],
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errBody = await ttsResponse.text();
      console.error('[gideonTTS] Google API error:', ttsResponse.status, errBody);
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

    console.log(`[gideonTTS] ✓ Generated ${Math.round(cleaned.length / 5)} words for user ${user.id}`);

    return Response.json(
      { audioContent },  // base64-encoded MP3
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (err) {
    console.error('[gideonTTS] Unexpected error:', err);
    return Response.json({ error: 'Internal server error' }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
});