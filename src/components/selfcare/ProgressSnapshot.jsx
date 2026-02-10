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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      label: 'Meditations Completed',
      value: meditationsCompleted,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      label: 'Mood Trend',
      value: '↗️ Improving',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Trophy,
      label: 'Active Challenges',
      value: activeChallenges,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-8"
    >
      <h2 className="text-xl font-bold text-white mb-4">Your Progress</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg`}
            >
              <Icon className="w-6 h-6 mb-2 opacity-80" />
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs opacity-90">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}