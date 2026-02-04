import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Star } from 'lucide-react';
import { toast } from 'sonner';

export function showPointsNotification(points, action) {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-2xl"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Star className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg">+{points} Points!</p>
          <p className="text-sm text-white/90">{action}</p>
        </div>
      </div>
    </motion.div>
  ), { duration: 3000 });
}

export function showBadgeNotification(badge) {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-5 shadow-2xl min-w-[280px]"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-3"
        >
          {badge.icon}
        </motion.div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-5 h-5" />
          <p className="font-bold text-lg">New Badge Unlocked!</p>
        </div>
        <p className="font-semibold text-xl mb-1">{badge.name}</p>
        <p className="text-sm text-white/90">{badge.description}</p>
        <p className="text-xs text-white/80 mt-2">+{badge.points} points</p>
      </div>
    </motion.div>
  ), { duration: 5000 });
}

export function showLevelUpNotification(level) {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-5 shadow-2xl"
    >
      <div className="text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-2 animate-pulse" />
        <p className="font-bold text-2xl mb-1">Level Up!</p>
        <p className="text-3xl font-black mb-1">{level}</p>
        <p className="text-sm text-white/90">You're growing stronger! 🎉</p>
      </div>
    </motion.div>
  ), { duration: 4000 });
}