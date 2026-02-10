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
      color: 'from-[#AFC7E3] to-[#D9B878]'
    },
    {
      icon: Zap,
      label: 'Workouts Completed',
      value: workoutSessions?.length || 0,
      unit: '',
      color: 'from-[#D9B878] to-[#FD9C2D]'
    },
    {
      icon: BookOpen,
      label: 'Journal Entries',
      value: journalEntries?.length || 0,
      unit: '',
      color: 'from-[#FD9C2D] to-[#D9B878]'
    },
    {
      icon: Trophy,
      label: 'Badges Earned',
      value: userProgress?.badges?.length || 0,
      unit: '',
      color: 'from-[#D9B878] to-[#AFC7E3]'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 px-4"
    >
      <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Your Stats</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-[#0A1A2F]`}
            >
              <Icon className="w-5 h-5 mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-[#0A1A2F]/70 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}