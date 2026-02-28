import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, Zap } from 'lucide-react';

export default function ProfileStats({ userProgress, meditationSessions, workoutSessions, journalEntries }) {
  const stats = [
  {
    icon: Clock,
    label: 'Meditation Minutes',
    value: meditationSessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0,
    unit: 'min',
    color: 'from-[#0A1A2F] to-[#1a3a5c]'
  },
  {
    icon: Zap,
    label: 'Workouts Completed',
    value: workoutSessions?.length || 0,
    unit: '',
    color: 'from-[#c9a227] to-[#D9B878]'
  },
  {
    icon: BookOpen,
    label: 'Journal Entries',
    value: journalEntries?.length || 0,
    unit: '',
    color: 'from-[#c9a227] to-[#D9B878]'
  },
  {
    icon: Trophy,
    label: 'Badges Earned',
    value: userProgress?.badges?.length || 0,
    unit: '',
    color: 'from-[#0A1A2F] to-[#c9a227]'
  }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 px-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#FAD98D]/10 rounded-xl p-4 border border-[#D9B878]/25 shadow-sm"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-[#0A1A2F]">{stat.value}<span className="text-sm font-normal text-[#0A1A2F]/60 ml-1">{stat.unit}</span></p>
              <p className="text-xs text-[#0A1A2F]/60 mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}