/**
 * Shared voice configuration for guided meditations and prayers.
 *
 * IMPORTANT — how this actually behaves on iPhone:
 * The guided meditation player uses the browser's built-in Web Speech API
 * (window.speechSynthesis), NOT ElevenLabs. On iOS, Safari/WKWebView gives you
 * essentially one voice per locale and substitutes its default (usually
 * "Samantha" for en-US) regardless of which name we request — so the `names`
 * list below only takes effect on platforms where voice selection works
 * (some Android, macOS, Windows). The levers that DO reliably work on iOS are
 * rate / pitch / volume, so those are tuned here to make narration softer.
 *
 * Softening notes:
 *  - pitch was 1.20 (raised above natural = brighter, stronger, more present).
 *    Lowered to 1.0 (natural) so the voice reads gentler — this is the single
 *    biggest factor in the "too strong" feeling.
 *  - rate slightly slower (0.84 -> 0.80) for a calmer, more unhurried cadence.
 *  - volume eased down (0.93 -> 0.85) so it feels intimate, not assertive.
 */

export const MEDITATION_VOICE = {
  rate:   0.80,   // unhurried, calm cadence
  pitch:  1.0,    // natural pitch — softer than the previous raised 1.20
  volume: 0.85,   // gentle and intimate, not loud

  // Preferred voice names, in priority order. Reordered to favor softer,
  // breathier voices first. (Effective only where the platform honors voice
  // selection — on iOS the system usually substitutes its locale default.)
  names: [
    // macOS / iOS — softer female voices first
    'Karen',       // Australian, mellow and warm
    'Moira',       // Irish, gentle and soft
    'Tessa',       // South African, calm
    'Fiona',       // Scottish, soft
    'Samantha',    // US default — clearer/stronger, kept as common fallback
    'Victoria',
    // Chrome
    'Google UK English Female',
    'Google US English Female',
    // Windows Neural — female, softer first
    'Microsoft Aria Online (Natural) - English (United States)',
    'Microsoft Jenny Online (Natural) - English (United States)',
    // Windows Desktop — female only
    'Microsoft Hazel Desktop - English (Great Britain)',
    'Microsoft Zira Desktop - English (United States)',
  ],
};

/**
 * Find the best matching voice from available system voices.
 * Falls back to any English voice, then any voice at all.
 */
export function findHannahVoice(voices) {
  if (!voices || voices.length === 0) return null;

  // Try each preferred name in order
  for (const name of MEDITATION_VOICE.names) {
    const match = voices.find(v => v.name === name);
    if (match) return match;
  }

  // Partial match on name keywords (softer voices first)
  const keywords = ['karen', 'moira', 'tessa', 'fiona', 'samantha', 'victoria', 'aria', 'jenny', 'hazel', 'zira'];
  for (const kw of keywords) {
    const match = voices.find(v => v.name.toLowerCase().includes(kw));
    if (match) return match;
  }

  // Any female-identified English voice
  const femaleEn = voices.find(v =>
    v.lang.startsWith('en') && (
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman')
    )
  );
  if (femaleEn) return femaleEn;

  // Any English voice
  const anyEn = voices.find(v => v.lang.startsWith('en'));
  if (anyEn) return anyEn;

  // Last resort
  return voices[0];
}
