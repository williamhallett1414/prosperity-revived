/**
 * useAutoTTS — disabled; auto-speak on mobile requires a user gesture
 * and throws NotAllowedError on iOS Safari without it, crashing React.
 * TTS is available per-message via the Listen button in ChatScreen.
 */
export default function useAutoTTS() {
  return { isSpeaking: false, stop: () => {} };
}
