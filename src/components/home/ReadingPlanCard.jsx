import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';

export default function ReadingPlanCard({ plan, progress, onClick, index }) {
  const progressPercent = progress
    ? Math.round((progress.completed_days?.length || 0) / plan.duration * 100)
    : 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick?.(); }}
      className="group w-full text-left bg-white dark:bg-[#0A1A2F] rounded-2xl overflow-hidden border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 hover:border-[#c9a227]/50 hover:shadow-md dark:shadow-none transition-all duration-300"
    >
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[#0A1A2F] dark:text-white mb-1 group-hover:text-[#c9a227] transition-colors text-sm">
          {plan.name}
        </h3>
        <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mb-3 line-clamp-2 leading-relaxed">
          {plan.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-[#0A1A2F]/40 dark:text-white/40">
            <Calendar className="w-3.5 h-3.5" />
            <span>{plan.duration} days</span>
          </div>

          {progress && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-xs font-bold text-[#c9a227]">{progressPercent}%</span>
            </div>
          )}

          <ChevronRight className="w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30 group-hover:text-[#c9a227] group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </motion.button>
  );
}