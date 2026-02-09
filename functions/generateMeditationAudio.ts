import { base44 } from "@base44/sdk/server";

/**
 * Generate TTS audio for a meditation using ElevenLabs
 * Requires: Backend functions enabled + ElevenLabs integration connected
 */
export default async function generateMeditationAudio(meditation) {
  if (!meditation?.script) {
    throw new Error("Meditation has no script to convert to audio");
  }

  // Generate TTS using ElevenLabs integration
  const result = await base44.integrations.ElevenLabs.GenerateSpeech({
    text: meditation.script,
    voice_id: "VOICE_ID", // Replace with your ElevenLabs voice ID
    model_id: "eleven_monolingual_v1"
  });

  // Update meditation with audio URL
  const updated = await base44.entities.Meditation.update(meditation.id, {
    audio_url: result.audio_url
  });

  return { success: true, audio_url: result.audio_url };
}