/**
 * ElevenLabs TTS — Client-side voice synthesis
 * 
 * Calls ElevenLabs API directly from the browser.
 * Returns base64-encoded MP3 audio content.
 * 
 * Falls back to null if ElevenLabs fails (caller should
 * fall back to Google Cloud TTS via Base44 functions).
 */

const ELEVENLABS_API_KEY = 'sk_c5df5572687cd5fbb73131ada65b2cbf9344aad09b5985ca';

const VOICE_MAP = {
  gideon: { voiceId: 'nPczCjzI2devNBz1zQrb', stability: 0.6, similarity: 0.8 },   // Daniel — deep British elder
  hannah: { voiceId: 'EXAVITQu4vr4xnSDxMaL', stability: 0.7, similarity: 0.75 },   // Sarah — soft, gentle female (was Rachel; softer for meditations). Higher stability = calmer, less punchy delivery.
  chef:   { voiceId: 'yoZ06aMxZJJ28mfd3POQ', stability: 0.45, similarity: 0.8 },    // Sam — warm, friendly, clearly male
  coach:  { voiceId: 'cjVigY5qzO86Huf0OWal', stability: 0.35, similarity: 0.85 },    // Eric — deep, strong, energetic male
  paul:   { voiceId: '2EiwWnXFnvU5JabPnv8n', stability: 0.6, similarity: 0.8 },     // Clyde — measured calm authority
};

/**
 * Generate speech audio from text using ElevenLabs
 * @param {string} text - Text to speak
 * @param {string} character - Character key: gideon, hannah, chef, coach, paul
 * @returns {Promise<string|null>} Base64-encoded MP3 audio, or null on failure
 */
export async function elevenLabsSpeak(text, character) {
  const voice = VOICE_MAP[character];
  if (!voice || !text?.trim()) return null;

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text.slice(0, 5000),
        model_id: 'eleven_flash_v2_5',
        voice_settings: {
          stability: voice.stability,
          similarity_boost: voice.similarity,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) return null;

    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    // Convert to base64 in chunks to avoid call stack overflow on large audio
    const CHUNK = 8192;
    let binary = '';
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return btoa(binary);
  } catch (err) {
    console.warn(`[ElevenLabs] ${character} TTS failed:`, err.message);
    return null;
  }
}
