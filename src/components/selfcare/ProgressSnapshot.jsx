import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, TrendingUp, Trophy } from 'lucide-react';

export default function ProgressSnapshot({ meditationSessions = [], challengeParticipants = [] }) {
  const currentWeek = new Date().getDay();
  const daysActiveThisWeek = meditationSessions.filter(session => {
    const sessionDate = new Date(session.date);
    const daysDiff = Math.floor((new Date() - sessionDate) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  }).length;

  const meditationsCompleted = meditationSessions.length;
  const activeChallenges = challengeParticipants.filter(p => p.status === 'active').length;

  const stats = [
    {
      icon: Calendar,
      label: 'Days Active This Week',
      value: daysActiveThisWeek,
      color: 'from-[#AFC7E3] to-[#AFC7E3]'
    },
    {
      icon: Sparkles,
      label: 'Meditations Completed',
      value: meditationsCompleted,
      color: 'from-[#D9B878] to-[#AFC7E3]'
    },
    {
      icon: TrendingUp,
      label: 'Mood Trend',
      value: '↗️ Improving',
      color: 'from-[#AFC7E3] to-[#D9B878]'
    },
    {
      icon: Trophy,
      label: 'Active Challenges',
      value: activeChallenges,
      color: 'from-[#D9B878] to-[#D9B878]'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-8"
    >
      <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Your Progress</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-[#0A1A2F] shadow-lg`}
            >
              <Icon className="w-6 h-6 mb-2 opacity-70" />
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs opacity-80">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}