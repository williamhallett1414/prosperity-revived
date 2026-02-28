import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProactiveSuggestionBanner({ suggestion, onAccept, onDismiss }) {
  if (!suggestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-[#F2F6FA] to-[#FAD98D]/10 dark:from-[#0A1A2F]/30 dark:to-[#1a1a2e]/30 border-b border-[#AFC7E3]/40 dark:border-blue-700 px-5 py-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#c9a227] to-[#D9B878] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {suggestion.title}
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {suggestion.message}
          </p>
          
          {suggestion.prompt_action && (
            <Button
              onClick={() => onAccept(suggestion.prompt_action)}
              className="mt-3 bg-gradient-to-r from-[#c9a227] to-[#D9B878] hover:from-blue-600 hover:to-[#c9a227] text-white text-sm h-9"
              size="sm"
            >
              {suggestion.prompt_action}
            </Button>
          )}
        </div>
        
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}