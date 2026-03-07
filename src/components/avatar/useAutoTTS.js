/**
 * useAutoTTS — Auto-speaks the latest bot message when it changes.
 *
 * Usage:
 *   const { isSpeaking, stop } = useAutoTTS({ text, enabled, botConfig });
 *
 * botConfig should have { voiceRate, voicePitch } (both optional, default 1.0)
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { cleanForSpeech, splitIntoChunks } from '../../utils/ttsUtils';

export default function useAutoTTS({ text = '', enabled = true, botConfig = {} }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chunksRef      = useRef([]);
  const chunkIndexRef  = useRef(0);
  const activeRef      = useRef(false);

  const stop = useCallback(() => {
    activeRef.current = false;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speakNext = useCallback(() => {
    if (!activeRef.current) return;
    if (chunkIndexRef.current >= chunksRef.current.length) {
      setIsSpeaking(false);
      activeRef.current = false;
      return;
    }
    const utter = new SpeechSynthesisUtterance(chunksRef.current[chunkIndexRef.current]);
    utter.rate   = botConfig.voiceRate  ?? 1.0;
    utter.pitch  = botConfig.voicePitch ?? 1.0;
    utter.volume = 1;

    // Pick the best available voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google US English') ||
      v.name.includes('Samantha') ||
      v.name.includes('Alex') ||
      v.lang === 'en-US'
    );
    if (preferred) utter.voice = preferred;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend   = () => { chunkIndexRef.current += 1; speakNext(); };
    utter.onerror = () => { setIsSpeaking(false); activeRef.current = false; };

    window.speechSynthesis.speak(utter);
  }, [botConfig.voiceRate, botConfig.voicePitch]);

  // Fire whenever `text` changes (new bot message arrived)
  useEffect(() => {
    if (!enabled || !text || !('speechSynthesis' in window)) return;

    // Stop any ongoing speech first
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;

    chunksRef.current    = splitIntoChunks(cleaned);
    chunkIndexRef.current = 0;
    activeRef.current    = true;

    // Small delay — some browsers need a beat after cancel()
    const timer = setTimeout(speakNext, 120);
    return () => clearTimeout(timer);
  }, [text, enabled, speakNext]);

  // Stop on unmount
  useEffect(() => () => stop(), [stop]);

  return { isSpeaking, stop };
}
