import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, BookOpen, Trophy, Clock, Zap } from 'lucide-react';

export default function ProfileStats({ userProgress, meditationSessions, workoutSessions, journalEntries }) {
  const stats = [
  {
    icon: Clock,
    label: 'Meditation Minutes',
    value: meditationSessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0,
    unit: 'min',
    color: 'from-[#3C4E53] to-[#FD9C2D]'
  },
  {
    icon: Zap,
    label: 'Workouts Completed',
    value: workoutSessions?.length || 0,
    unit: '',
    color: 'from-[#FD9C2D] to-[#FAD98D]'
  },
  {
    icon: BookOpen,
    label: 'Journal Entries',
    value: journalEntries?.length || 0,
    unit: '',
    color: 'from-[#FAD98D] to-[#FD9C2D]'
  },
  {
    icon: Trophy,
    label: 'Badges Earned',
    value: userProgress?.badges?.length || 0,
    unit: '',
    color: 'from-[#3C4E53] to-[#FAD98D]'
  }];


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 px-4">

      
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return null;












        })}
      </div>
    </motion.div>);

}