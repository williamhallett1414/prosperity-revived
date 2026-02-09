import { base44 } from "@base44/sdk/server";

/**
 * One-time script to generate audio for all existing meditations
 * Run this after ElevenLabs is connected to backfill audio for library meditations
 */
export default async function backfillMeditationAudio() {
  const meditations = await base44.entities.Meditation.list();

  const results = {
    generated: 0,
    skipped: 0,
    failed: 0
  };

  for (const med of meditations) {
    if (!med.audio_url) {
      try {
        console.log(`Generating audio for: ${med.title}`);
        
        // Generate TTS using ElevenLabs
        const result = await base44.integrations.ElevenLabs.GenerateSpeech({
          text: med.script,
          voice_id: "VOICE_ID", // Replace with your ElevenLabs voice ID
          model_id: "eleven_monolingual_v1"
        });

        // Update meditation with audio URL
        await base44.entities.Meditation.update(med.id, {
          audio_url: result.audio_url
        });

        results.generated++;
        console.log(`✓ Generated audio for: ${med.title}`);
      } catch (error) {
        results.failed++;
        console.error(`✗ Failed to generate audio for ${med.title}:`, error.message);
      }
    } else {
      results.skipped++;
      console.log(`Already has audio: ${med.title}`);
    }
  }

  console.log("\n=== Backfill Complete ===");
  console.log(`Generated: ${results.generated}`);
  console.log(`Skipped: ${results.skipped}`);
  console.log(`Failed: ${results.failed}`);

  return results;
}