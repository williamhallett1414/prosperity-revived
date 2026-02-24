import React from 'react';
import { motion } from 'framer-motion';
import StreakTracker from '@/components/gamification/StreakTracker';
import { Flame } from 'lucide-react';

export default function ProfileStreaks({ userProgress, meditationSessions, workoutSessions, journalEntries }) {
  const calculateStreak = (sessions) => {
    if (!sessions || sessions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const sortedDates = sessions.
    map((s) => new Date(s.date || s.created_date)).
    sort((a, b) => b - a);

    for (const date of sortedDates) {
      const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getMostRecentDate = (sessions) => {
    if (!sessions || sessions.length === 0) return null;
    return sessions.reduce((latest, session) => {
      const date = new Date(session.date || session.created_date);
      return date > new Date(latest || 0) ? date.toISOString() : latest;
    }, null);
  };

  const meditationStreak = calculateStreak(meditationSessions);
  const workoutStreak = calculateStreak(workoutSessions);
  const journalingStreak = calculateStreak(journalEntries);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8">

      <div className="flex items-center gap-2 mb-4 px-4">
        <Flame className="w-5 h-5 text-[#FD9C2D]" />
        
      </div>

      <div className="px-4 space-y-3">
        <StreakTracker
          type="meditation"
          count={meditationStreak}
          lastDate={getMostRecentDate(meditationSessions)} />

        <StreakTracker
          type="workout"
          count={workoutStreak}
          lastDate={getMostRecentDate(workoutSessions)} />

        <StreakTracker
          type="journaling"
          count={journalingStreak}
          lastDate={getMostRecentDate(journalEntries)} />

      </div>
    </motion.div>);

}