/**
 * ttsUtils.js — Shared Text-to-Speech utilities
 * Used by TTSButton, useAutoTTS, and ChatScreen
 */

/** Strip markdown, emoji, and other artefacts that sound bad when read aloud */
export function cleanForSpeech(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*•·]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[VERSE\].*?\[\/VERSE\]/g, '')
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n').map(l => l.trim()).join('\n')
    .trim();
}

/** Split long text into ≤3000-char chunks to avoid browser SpeechSynthesis limits */
export function splitIntoChunks(text, maxLength = 3000) {
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
