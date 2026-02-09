import { base44 } from "@/api/base44Client";

/**
 * Generates Text-to-Speech audio from a meditation script
 * Returns the URL of the generated audio file
 */
export async function generateTTSAudio(script) {
  try {
    if (!script) {
      throw new Error("Script is required for TTS generation");
    }

    // Use base44's TTS capability to generate high-quality audio narration
    const ttsResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a professional, high-quality audio narration in MP3 format for the following meditation script. Use a calm, soothing female voice with a peaceful tone:\n\n${script}`,
      add_context_from_internet: false
    });

    // The LLM should return an audio file URL
    return ttsResult;
  } catch (err) {
    console.error("[TTS] Error generating TTS audio:", err);
    throw err;
  }
}