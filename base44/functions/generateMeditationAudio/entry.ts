import { base44 } from "@/api/base44Client";

export async function generateMeditationAudio(meditation) {
  if (!meditation?.script) {
    throw new Error("Meditation has no script to convert to audio.");
  }

  // Generate the TTS audio
  const tts = await base44.ai.textToSpeech.create({
    text: meditation.script,
    voice: "soothing_female",
    format: "mp3"
  });

  // Save the audio URL back to the meditation record
  const updated = await base44.entities.Meditation.update(meditation.id, {
    tts_audio_url: tts.url
  });

  return updated;
}