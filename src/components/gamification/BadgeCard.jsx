import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function BadgeCard({ badge, earned, progress, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl p-4 text-center ${
        earned 
          ? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900' 
          : 'bg-white dark:bg-[#2d2d4a]'
      }`}
    >
      <div className={`text-5xl mb-2 ${!earned && 'opacity-30 grayscale'}`}>
        {earned ? badge.icon : <Lock className="w-12 h-12 mx-auto text-gray-400" />}
      </div>
      <h3 className={`font-semibold text-sm mb-1 ${earned ? 'text-amber-900 dark:text-amber-100' : 'text-[#1a1a2e] dark:text-white'}`}>
        {badge.name}
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{badge.description}</p>
      <div className="flex items-center justify-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
        <span>+{badge.points} pts</span>
      </div>
      {!earned && progress !== undefined && (
        <div className="mt-3">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(progress)}%</p>
        </div>
      )}
    </motion.div>
  );
}