import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';

// Strip everything that sounds bad when read aloud
function cleanForSpeech(text) {
  return text
    // Markdown bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Markdown headers → spoken naturally with a pause
    .replace(/#{1,6}\s+/g, '')
    // Inline code
    .replace(/`[^`]*`/g, '')
    // Markdown links → just the label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Bullet list chars (-, *, •, ·) at line start → natural pause via comma
    .replace(/^[\s]*[-*•·]\s+/gm, '')
    // Numbered lists: "1. " "2. " etc → strip the number prefix
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Emoji — strip all Unicode emoji ranges
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    // Collapse multiple newlines to single pause
    .replace(/\n{3,}/g, '\n\n')
    // Remove trailing whitespace per line
    .split('\n').map(l => l.trim()).join('\n')
    .trim();
}

// Split long texts into chunks to avoid browser TTS 32KB limit
function splitIntoChunks(text, maxLength = 3000) {
  if (text.length <= maxLength) return [text];
  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = '';
  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length > maxLength) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current = (current + ' ' + sentence).trim();
    }
  }
  if (current) chunks.push(current.trim());
  return chunks.length ? chunks : [text.substring(0, maxLength)];
}

export default function TTSButton({ text, className = '', onSpeakingChange }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chunksRef = useRef([]);
  const chunkIndexRef = useRef(0);

  const speakNextChunk = () => {
    if (chunkIndexRef.current >= chunksRef.current.length) {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      chunksRef.current[chunkIndexRef.current]
    );
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => { setIsSpeaking(true); onSpeakingChange?.(true); };
    utterance.onend = () => {
      chunkIndexRef.current += 1;
      if (chunkIndexRef.current >= chunksRef.current.length) onSpeakingChange?.(false);
      speakNextChunk();
    };
    utterance.onerror = () => { setIsSpeaking(false); onSpeakingChange?.(false); };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onSpeakingChange?.(false);
      return;
    }

    const cleaned = cleanForSpeech(text);
    chunksRef.current = splitIntoChunks(cleaned);
    chunkIndexRef.current = 0;
    speakNextChunk();
  };

  // Stop speech if component unmounts (e.g. chat closes)
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  if (!('speechSynthesis' in window)) return null;

  return (
    <button
      onClick={handleSpeak}
      title={isSpeaking ? 'Stop reading' : 'Read aloud'}
      className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors text-[11px] font-medium ${
        isSpeaking
          ? 'bg-orange-50 text-orange-500 hover:bg-orange-100'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
      } ${className}`}
    >
      {isSpeaking ? (
        <><Square className="w-3.5 h-3.5" /><span>Stop</span></>
      ) : (
        <><Volume2 className="w-3.5 h-3.5" /><span>Listen</span></>
      )}
    </button>
  );
}
