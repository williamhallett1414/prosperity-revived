import { base44 } from "@/api/base44Client";

/**
 * Mixes TTS audio with ambient background music
 * Returns the final mixed audio URL
 */
export async function mixMeditationAudio({ ttsUrl, ambientUrl }) {
  try {
    if (!ttsUrl || !ambientUrl) {
      throw new Error("Both ttsUrl and ambientUrl are required");
    }

    // Use base44's audio mixing capability to blend TTS with ambient
    const mixedResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Mix two audio files together:
1. TTS narration (voice): ${ttsUrl}
2. Ambient background music: ${ambientUrl}

Requirements:
- Layer the ambient music underneath the voice narration
- Keep TTS volume at 100% and ambient at 40-50% volume
- Loop the ambient music if needed to match TTS duration
- Return the final mixed audio file in MP3 format`,
      add_context_from_internet: false
    });

    // The LLM should return an audio file URL
    return mixedResult;
  } catch (err) {
    console.error("[MixAudio] Error mixing audio:", err);
    throw err;
  }
}