import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';

export default function StreakTracker({ type, count, lastDate }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!lastDate) return;
    const last = new Date(lastDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    setIsActive(
      last.toDateString() === today.toDateString() ||
      last.toDateString() === yesterday.toDateString()
    );
  }, [lastDate]);

  const streakLabels = {
    meditation: 'Meditation Streak',
    workout: 'Workout Streak',
    journaling: 'Journaling Streak',
    scripture: 'Scripture Streak',
    challenge: 'Challenge Streak',
    mood: 'Mood Check-in Streak'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }} className="bg-slate-50 text-slate-50 px-3 py-2 rounded-lg flex items-center gap-2">






      <Flame className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0A1A2F]/40'}`} />
      <div className="flex flex-col">
        <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-[#0A1A2F]/60'}`}>
          {streakLabels[type]}
        </span>
        <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-[#0A1A2F]'}`}>
          {count} {count === 1 ? 'day' : 'days'}
        </span>
      </div>
    </motion.div>);

}