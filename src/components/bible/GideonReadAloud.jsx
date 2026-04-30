/**
 * GideonReadAloud — A floating "Read Aloud" button that speaks
 * any text content using Gideon's Google Cloud TTS voice.
 *
 * Usage: <GideonReadAloud text="The passage to read..." />
 *
 * Features:
 * - Splits long text into chunks (max ~4000 chars per TTS call)
 * - Shows play/pause/stop controls
 * - Progress indicator
 * - Auto-advances through chunks
 */
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Pause, Play, Square, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Split text into TTS-friendly chunks at sentence boundaries
function chunkText(text, maxLen = 3500) {
  if (!text || text.length <= maxLen) return [text];
  const chunks = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }
    // Find last sentence boundary before maxLen
    let cutoff = maxLen;
    const lastPeriod = remaining.lastIndexOf('. ', cutoff);
    const lastQuestion = remaining.lastIndexOf('? ', cutoff);
    const lastExclaim = remaining.lastIndexOf('! ', cutoff);
    const best = Math.max(lastPeriod, lastQuestion, lastExclaim);
    if (best > maxLen * 0.3) cutoff = best + 1;
    chunks.push(remaining.slice(0, cutoff).trim());
    remaining = remaining.slice(cutoff).trim();
  }
  return chunks.filter(Boolean);
}

// Clean text for TTS — remove markdown, numbers-only lines, etc.
function cleanForTTS(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\d+\s*$/gm, '') // verse numbers alone
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function GideonReadAloud({ text, className = '' }) {
  const [state, setState] = useState('idle'); // idle | loading | playing | paused
  const [chunkIdx, setChunkIdx] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const audioRef = useRef(null);
  const stoppedRef = useRef(false);
  const chunksRef = useRef([]);

  const speakChunk = useCallback(async (chunk) => {
    return new Promise(async (resolve) => {
      try {
        const result = await base44.functions.invoke('gideonTTS', { text: chunk });
        const audioContent = result?.audioContent ?? result?.data?.audioContent;
        if (!audioContent) { resolve(); return; }

        const binary = atob(audioContent);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve(); };
        await audio.play();
      } catch {
        resolve();
      }
    });
  }, []);

  const startReading = useCallback(async () => {
    const cleaned = cleanForTTS(text);
    if (!cleaned) return;

    const chunks = chunkText(cleaned);
    chunksRef.current = chunks;
    setTotalChunks(chunks.length);
    stoppedRef.current = false;
    setState('loading');

    for (let i = 0; i < chunks.length; i++) {
      if (stoppedRef.current) break;
      setChunkIdx(i);
      setState('playing');
      await speakChunk(chunks[i]);
      if (stoppedRef.current) break;

      // Wait while paused
      while (audioRef.current === null && !stoppedRef.current) {
        // Check if we're paused (audio was paused externally)
        await new Promise(r => setTimeout(r, 200));
        // If state is no longer paused and audio is null, we finished the chunk
        break;
      }
    }

    if (!stoppedRef.current) {
      setState('idle');
      setChunkIdx(0);
    }
  }, [text, speakChunk]);

  const togglePause = () => {
    if (state === 'playing' && audioRef.current) {
      audioRef.current.pause();
      setState('paused');
    } else if (state === 'paused' && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setState('playing');
    }
  };

  const stop = () => {
    stoppedRef.current = true;
    if (audioRef.current) {
      try { audioRef.current.pause(); audioRef.current.src = ''; } catch {}
      audioRef.current = null;
    }
    setState('idle');
    setChunkIdx(0);
  };

  if (!text || text.trim().length < 20) return null;

  const isActive = state !== 'idle';

  return (
    <AnimatePresence>
      {!isActive ? (
        <motion.button
          key="read-btn"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={startReading}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#c9a227]/15 dark:bg-[#c9a227]/10 border border-[#c9a227]/25 dark:border-[#c9a227]/15 text-[#c9a227] hover:bg-[#c9a227]/25 transition-all ${className}`}
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-xs font-semibold">Read Aloud</span>
        </motion.button>
      ) : (
        <motion.div
          key="controls"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a227]/20 dark:bg-[#c9a227]/10 border border-[#c9a227]/30 dark:border-[#c9a227]/15 ${className}`}
        >
          {state === 'loading' ? (
            <Loader2 className="w-4 h-4 text-[#c9a227] animate-spin" />
          ) : (
            <button onClick={togglePause} className="p-1">
              {state === 'paused' ? (
                <Play className="w-4 h-4 text-[#c9a227]" />
              ) : (
                <Pause className="w-4 h-4 text-[#c9a227]" />
              )}
            </button>
          )}

          {totalChunks > 1 && (
            <span className="text-[10px] text-[#c9a227]/60 font-medium tabular-nums">
              {chunkIdx + 1}/{totalChunks}
            </span>
          )}

          <span className="text-[10px] text-[#c9a227] font-semibold">
            {state === 'loading' ? 'Loading...' : state === 'paused' ? 'Paused' : 'Reading'}
          </span>

          <button onClick={stop} className="p-1">
            <Square className="w-3.5 h-3.5 text-[#c9a227]/60" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
