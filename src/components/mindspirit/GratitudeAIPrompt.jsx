import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function GratitudeAIPrompt({ prompt, loading, onRefresh }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#FD9C2D]/10 to-[#FAD98D]/10 rounded-2xl border border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 p-5"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D] rounded-full flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#0A1A2F] dark:text-white dark:text-white">AI Reflection Prompt</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-7 h-7 rounded-full hover:bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 flex items-center justify-center transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#FAD98D] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2 mt-3">
          <div className="h-3 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 rounded-full w-full animate-pulse" />
          <div className="h-3 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 rounded-full w-3/4 animate-pulse" />
        </div>
      ) : (
        <p className="text-sm text-[#0A1A2F]/75 dark:text-white/75 leading-relaxed italic mt-1">
          "{prompt}"
        </p>
      )}
    </motion.div>
  );
}