/**
 * Shared voice configuration for guided meditations and prayers.
 * Uses the same voice as Hannah (Mindset & Growth Coach) for a consistent,
 * warm, feminine narration across all meditation experiences.
 */

export const MEDITATION_VOICE = {
  rate:   0.84,   // unhurried warmth — matches Hannah
  pitch:  1.20,   // elevated, gentle — matches Hannah
  volume: 0.93,   // intimate, not loud — matches Hannah

  // Preferred voice names, in priority order (same as Hannah)
  names: [
    // macOS / Safari — female voices
    'Samantha', 'Karen', 'Victoria', 'Moira', 'Tessa',
    // Chrome
    'Google UK English Female',
    'Google US English Female',
    // Windows Neural — female only
    'Microsoft Jenny Online (Natural) - English (United States)',
    'Microsoft Aria Online (Natural) - English (United States)',
    // Windows Desktop — female only
    'Microsoft Zira Desktop - English (United States)',
    'Microsoft Hazel Desktop - English (Great Britain)',
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

  // Partial match on name keywords
  const keywords = ['samantha', 'karen', 'victoria', 'moira', 'tessa', 'jenny', 'aria', 'zira', 'hazel'];
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
