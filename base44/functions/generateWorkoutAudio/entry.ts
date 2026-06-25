/**
 * generateWorkoutAudio — coached audio workout segment generator.
 *
 * Generates one segment of audio via ElevenLabs, uploads the resulting MP3
 * to permanent Base44 file storage, and returns the URL. Caches by a hash
 * of (text + voice + settings) so re-running the same generation returns
 * the cached URL instead of burning ElevenLabs credits.
 *
 * Why per-segment instead of one big call:
 *   - ElevenLabs has a per-request character cap (~5000 chars) and the
 *     existing TTS functions already enforce this.
 *   - Each "section" of the workout script (warmup, block1, rest1, etc.)
 *     is under 5000 chars on its own.
 *   - Generating per-segment lets us cache at the segment level — if we
 *     tweak Block 2's script we re-gen only Block 2, not the whole 20 min.
 *   - The final stitching (concat + silence pauses) happens client-side
 *     or in a separate stitching function, not here.
 *
 * Request body:
 *   {
 *     session_id: "strong-bones-01",        // logical session ID
 *     segment_id: "01-warmup",              // position in session
 *     text: "Hey. Welcome in. ...",         // the script for this segment
 *     voice_id?: "pqHfZKP75CvOlQylNhV4",    // ElevenLabs voice (default: Bill)
 *     voice_label?: "Bill",                 // for dashboard scanning
 *     stability?: 0.55,                     // ElevenLabs setting
 *     similarity_boost?: 0.85,
 *     style?: 0.30,
 *     force?: false                         // skip cache, regenerate
 *   }
 *
 * Response:
 *   { audio_url, cached: true|false, char_count, segment_id }
 *
 * Env: ElevenLabs (the API key, env var named the same way as other
 *      coach TTS functions — gideonTTS, hannahTTS, coachPaulTTS).
 */

import { base44 } from '@base44/sdk';

// Default voice = Bill (Coach David's workout voice).
const DEFAULT_VOICE_ID = 'pqHfZKP75CvOlQylNhV4';
const DEFAULT_VOICE_LABEL = 'Bill';

// Per-segment cap to avoid hitting ElevenLabs single-request limits.
// Sections in the strong-bones script are all comfortably below this.
const MAX_CHARS_PER_SEGMENT = 4800;

async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const {
      session_id,
      segment_id,
      text,
      voice_id = DEFAULT_VOICE_ID,
      voice_label = DEFAULT_VOICE_LABEL,
      stability = 0.55,
      similarity_boost = 0.85,
      style = 0.30,
      force = false,
    } = body;

    // Validate required fields.
    if (!session_id || !segment_id || !text) {
      return Response.json(
        { error: 'Missing required fields: session_id, segment_id, text' },
        { status: 400 }
      );
    }

    const trimmed = String(text).trim();
    if (trimmed.length === 0) {
      return Response.json({ error: 'Text is empty' }, { status: 400 });
    }
    if (trimmed.length > MAX_CHARS_PER_SEGMENT) {
      return Response.json(
        {
          error: `Segment too long (${trimmed.length} chars; max ${MAX_CHARS_PER_SEGMENT}). Split into smaller segments.`,
        },
        { status: 400 }
      );
    }

    // Build cache key from content + voice + settings. Two identical-text
    // requests at the same voice/settings will hit the same cache row.
    // Changing ANY of these invalidates the cache automatically.
    const content_hash = await sha256(
      `${trimmed}|${voice_id}|${stability}|${similarity_boost}|${style}`
    );

    // Cache lookup. Skip if force=true.
    if (!force) {
      const existing = await base44.asServiceRole.entities.WorkoutAudio.filter({
        content_hash,
      });
      if (existing.length > 0 && existing[0].audio_url) {
        return Response.json({
          audio_url: existing[0].audio_url,
          cached: true,
          char_count: trimmed.length,
          segment_id,
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
          // eleven_multilingual_v2 is the higher-quality model used for
          // longer-form narrative content. Chat TTS uses flash_v2_5 for
          // speed; for workouts we prioritize quality over latency since
          // we generate once and cache forever.
          model_id: 'eleven_multilingual_v2',
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
      console.error('[generateWorkoutAudio] ElevenLabs error:', elResponse.status, errText);
      return Response.json(
        { error: `ElevenLabs API error: ${elResponse.status} — ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    // Convert the audio response into a File and upload to Base44 storage.
    const arrayBuffer = await elResponse.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const filename = `workout-${session_id}-${segment_id}-${content_hash.slice(0, 8)}.mp3`;
    const file = new File([blob], filename, { type: 'audio/mpeg' });

    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    // Persist the cache row. If a row exists for this hash but had no
    // audio_url (failed previous attempt), update it; otherwise create new.
    const existingForHash = await base44.asServiceRole.entities.WorkoutAudio.filter({
      content_hash,
    });

    if (existingForHash.length > 0) {
      await base44.asServiceRole.entities.WorkoutAudio.update(existingForHash[0].id, {
        session_id,
        segment_id,
        audio_url: file_url,
        voice_id,
        voice_label,
        char_count: trimmed.length,
      });
    } else {
      await base44.asServiceRole.entities.WorkoutAudio.create({
        session_id,
        segment_id,
        content_hash,
        audio_url: file_url,
        voice_id,
        voice_label,
        char_count: trimmed.length,
      });
    }

    return Response.json({
      audio_url: file_url,
      cached: false,
      char_count: trimmed.length,
      segment_id,
    });
  } catch (error) {
    console.error('[generateWorkoutAudio] Error:', error.message);
    return Response.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
});
