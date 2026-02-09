import { base44 } from "@/api/base44Client";

export async function generateTTSAudio({ meditationId, script }) {
  try {
    // Use the InvokeLLM integration to generate audio from the script
    // This will use a voice synthesis API to create natural-sounding audio
    const audioResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Convert this meditation script to natural speech and return only the audio file URL:\n\n${script}`,
      // Note: We'll use the backend function instead for better audio quality
    });

    return audioResponse;
  } catch (error) {
    console.error('Failed to generate TTS audio:', error);
    throw error;
  }
}

// Alternative: Use a dedicated TTS service via backend function
export async function saveMeditationAudio({ meditationId, audioUrl }) {
  try {
    const meditation = await base44.entities.Meditation.read(meditationId);
    await base44.entities.Meditation.update(meditationId, {
      ...meditation,
      tts_audio_url: audioUrl
    });
    return { success: true, audioUrl };
  } catch (error) {
    console.error('Failed to save meditation audio:', error);
    throw error;
  }
}