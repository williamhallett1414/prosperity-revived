/**
 * Coach Paul TTS — ElevenLabs Voice: Clyde (2EiwWnXFnvU5JabPnv8n)
 * 
 * Converts text to speech using ElevenLabs API.
 * Returns base64-encoded MP3 audio.
 */
export default async function handler({ text }: { text: string }) {
  if (!text || text.trim().length === 0) {
    return { audioContent: null, error: 'No text provided' };
  }

  const API_KEY = 'sk_c5df5572687cd5fbb73131ada65b2cbf9344aad09b5985ca';
  const VOICE_ID = '2EiwWnXFnvU5JabPnv8n';

  try {
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
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Coach Paul TTS] ElevenLabs error:', response.status, errText);
      return { audioContent: null, error: `ElevenLabs API error: ${response.status}` };
    }

    // ElevenLabs returns raw MP3 bytes
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const audioContent = btoa(binary);

    return { audioContent };
  } catch (error: any) {
    console.error('[Coach Paul TTS] Error:', error.message);
    return { audioContent: null, error: error.message };
  }
}
