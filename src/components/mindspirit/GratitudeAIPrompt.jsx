import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function GratitudeAIPrompt({ prompt, loading, onRefresh }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#FD9C2D]/10 to-[#D9B878]/10 rounded-2xl border border-[#D9B878]/30 p-5"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#FD9C2D] to-[#D9B878] rounded-full flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#0A1A2F]">AI Reflection Prompt</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-7 h-7 rounded-full hover:bg-[#D9B878]/20 flex items-center justify-center transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#D9B878] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2 mt-3">
          <div className="h-3 bg-[#D9B878]/20 rounded-full w-full animate-pulse" />
          <div className="h-3 bg-[#D9B878]/20 rounded-full w-3/4 animate-pulse" />
        </div>
      ) : (
        <p className="text-sm text-[#0A1A2F]/75 leading-relaxed italic mt-1">
          "{prompt}"
        </p>
      )}
    </motion.div>
  );
}