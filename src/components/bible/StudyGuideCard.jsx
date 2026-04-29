import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';

export default function StudyGuideCard({ guide, onClick, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group w-full text-left bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-2xl overflow-hidden shadow-sm dark:shadow-none hover:shadow-lg dark:shadow-none transition-all duration-300 border border-[#FAD98D]/15"
    >
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-bold text-[#0A1A2F] dark:text-white text-base mb-0.5">{guide.title}</h3>
        <p className="text-[#0A1A2F]/50 dark:text-white/50 text-xs">{guide.subtitle}</p>
      </div>

      <div className="px-4 pb-4">
        <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60 line-clamp-2 mb-3">
          {guide.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-[#0A1A2F]/40 dark:text-white/40">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{guide.chapters} chapters</span>
          </div>
          
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#c9a227]" />
        </div>
      </div>
    </motion.button>
  );
}