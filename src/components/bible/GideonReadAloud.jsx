import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { elevenLabsSpeak } from '@/utils/elevenLabsTTS';

export default function GideonReadAloud({ text, label = 'Listen' }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = async () => {
    if (playing) {
      // Stop
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setPlaying(false);
      return;
    }

    if (!text) return;

    setLoading(true);
    try {
      const cleaned = text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/#{1,6}\s+/g, '')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim()
        .slice(0, 4500);

      if (!cleaned) {
        setLoading(false);
        return;
      }

      // Use Hannah's TTS voice
      const result = { audioContent: await elevenLabsSpeak(cleaned, 'gideon') };
      const audioContent = result?.audioContent ?? result?.data?.audioContent;

      if (audioContent) {
        const binary = atob(audioContent);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setPlaying(false);
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setPlaying(false);
        };

        await audio.play();
        setPlaying(true);
      }
    } catch (err) {
      console.warn('[ReadAloud] TTS failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePlay}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
        playing
          ? 'bg-[#FAD98D] text-[#0A1A2F]'
          : 'bg-[#FAD98D]/20 text-[#c9a227] hover:bg-[#FAD98D]/30'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : playing ? (
        <X className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      <span>{loading ? 'Loading…' : playing ? 'Stop' : label}</span>
    </motion.button>
  );
}