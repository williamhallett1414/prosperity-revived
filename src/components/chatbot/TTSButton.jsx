import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Square } from 'lucide-react';

export default function TTSButton({ text, className = '' }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown-style formatting for cleaner TTS
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#+\s/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  if (!('speechSynthesis' in window)) return null;

  return (
    <button
      onClick={handleSpeak}
      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
      className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
        isSpeaking
          ? 'text-orange-400 hover:text-orange-600'
          : 'text-gray-300 hover:text-gray-500'
      } ${className}`}
    >
      {isSpeaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
    </button>
  );
}