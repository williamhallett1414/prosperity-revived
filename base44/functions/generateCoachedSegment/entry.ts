/**
 * generateCoachedSegment — cached TTS for coached-workout audio segments.
 *
 * Wraps ElevenLabs with a content-hash cache stored in the WorkoutAudio
 * entity. Identical (text + voice + settings) returns the cached file
 * URL instead of regenerating, which is the difference between paying
 * once per unique line vs. paying every play.
 *
 * This is the workout-specific path. The existing `coachDavidTTS`
 * function still serves chat (where caching doesn't help — chat lines
 * are usually unique per user). Keeping them separate keeps each one
 * simple.
 *
 * Request body:
 *   {
 *     text: "Squats. 12 reps. Drive through the heels...",
 *     voice_id?: "pqHfZKP75CvOlQylNhV4",     // default: Bill (Coach David)
 *     stability?: 0.55,                       // default: matches client
 *     similarity_boost?: 0.85,
 *     style?: 0.30,
 *     model_id?: "eleven_flash_v2_5",         // default: fast model
 *     segment_type?: "exercise",              // optional, for dashboard
 *     force?: false                           // skip cache, regenerate
 *   }
 *
 * Response (success):
 *   { audio_url: "https://...", cached: true|false, char_count: 47 }
 *
 * Response (error):
 *   { error: "..." }
 *
 * Env: ElevenLabs (the API key, env var named the same way as other
 *      coach TTS functions — gideonTTS, hannahTTS, coachPaulTTS,
 *      coachDavidTTS).
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Defaults match the client-side Coach David config (src/utils/elevenLabsTTS.js).
// IMPORTANT: keep in sync with that file and with coachDavidTTS/entry.ts.
// Voice drift here = users hearing a different Coach David depending on
// which path served the audio.
const DEFAULT_VOICE_ID = 'pqHfZKP75CvOlQylNhV4'; // Bill
const DEFAULT_STABILITY = 0.55;
const DEFAULT_SIMILARITY = 0.85;
const DEFAULT_STYLE = 0.30;
const DEFAULT_MODEL_ID = 'eleven_flash_v2_5';
const MAX_CHARS = 4800; // ElevenLabs single-request limit (we stay under 5000)

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      text,
      voice_id = DEFAULT_VOICE_ID,
      stability = DEFAULT_STABILITY,
      similarity_boost = DEFAULT_SIMILARITY,
      style = DEFAULT_STYLE,
      model_id = DEFAULT_MODEL_ID,
      segment_type = null,
      force = false,
    } = body || {};

    if (!text || String(text).trim().length === 0) {
      return Response.json({ error: 'No text provided' }, { status: 400 });
    }
    const trimmed = String(text).trim();
    if (trimmed.length > MAX_CHARS) {
      return Response.json(
        { error: `Segment too long (${trimmed.length} chars; max ${MAX_CHARS}). Split into smaller segments.` },
        { status: 400 }
      );
    }

    // Build cache key from content + voice + every setting that affects output.
    // Any change to any of these invalidates the cache automatically.
    const content_hash = await sha256(
      `${trimmed}|${voice_id}|${stability}|${similarity_boost}|${style}|${model_id}`
    );

    // Cache lookup (skipped if force=true).
    if (!force) {
      const existing = await base44.asServiceRole.entities.WorkoutAudio.filter({ content_hash });
      if (existing.length > 0 && existing[0].audio_url) {
        return Response.json({
          audio_url: existing[0].audio_url,
          cached: true,
          char_count: trimmed.length,
        });
      }
    }

    // Cache miss — call ElevenLabs.
    const API_KEY = Deno.env.get('ElevenLabs');
    if (!API_KEY) {
      return Response.json(
        { error: 'ElevenLabs API key not configured in environment' },
        { status: 500 }
      );
    }

    const elResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: trimmed,
          model_id,
          voice_settings: {
            stability,
            similarity_boost,
            style,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elResponse.ok) {
      const errText = await elResponse.text();
      console.error('[generateCoachedSegment] ElevenLabs error:', elResponse.status, errText);
      return Response.json(
        { error: `ElevenLabs API error: ${elResponse.status} — ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    // Wrap the audio as a File and upload to Base44 storage. Returns a
    // permanent URL we can hand back to the player.
    const arrayBuffer = await elResponse.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const filename = `coached-${content_hash.slice(0, 12)}.mp3`;
    const file = new File([blob], filename, { type: 'audio/mpeg' });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    // Persist the cache row. Defensive: if a row exists for this hash but had
    // no audio_url (failed prior generation), update it instead of creating a
    // duplicate.
    const existingForHash = await base44.asServiceRole.entities.WorkoutAudio.filter({ content_hash });
    const preview_text = trimmed.slice(0, 80);
    if (existingForHash.length > 0) {
      await base44.asServiceRole.entities.WorkoutAudio.update(existingForHash[0].id, {
        audio_url: file_url,
        voice_id,
        char_count: trimmed.length,
        segment_type,
        preview_text,
      });
    } else {
      await base44.asServiceRole.entities.WorkoutAudio.create({
        content_hash,
        audio_url: file_url,
        voice_id,
        char_count: trimmed.length,
        segment_type,
        preview_text,
      });
    }

    return Response.json({
      audio_url: file_url,
      cached: false,
      char_count: trimmed.length,
    });
  } catch (error) {
    console.error('[generateCoachedSegment] Error:', error?.message || error);
    return Response.json(
      { error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
});
