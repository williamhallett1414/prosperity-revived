import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function BadgeCard({ badge, earned, progress, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl p-4 text-center border ${
        earned
          ? 'bg-gradient-to-br from-[#FAD98D]/30 to-[#D9B878]/20 border-[#c9a227]/30'
          : 'bg-white border-[#D9B878]/20'
      }`}
    >
      <div className={`text-5xl mb-2 ${!earned && 'opacity-25 grayscale'}`}>
        {earned ? badge.icon : <Lock className="w-10 h-10 mx-auto text-[#0A1A2F]/20" />}
      </div>
      <h3 className={`font-bold text-sm mb-1 ${earned ? 'text-[#0A1A2F]' : 'text-[#0A1A2F]/60'}`}>
        {badge.name}
      </h3>
      <p className="text-xs text-[#0A1A2F]/45 mb-2 leading-snug">{badge.description}</p>
      <span className="text-[11px] font-bold text-[#c9a227]">+{badge.points} pts</span>
      {!earned && progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 bg-[#FAD98D]/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c9a227] to-[#D9B878] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-[#0A1A2F]/35 mt-1">{Math.round(progress)}%</p>
        </div>
      )}
    </motion.div>
  );
}