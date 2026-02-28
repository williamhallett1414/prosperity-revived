import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { TrendingUp, Dumbbell, BookOpen, Brain } from 'lucide-react';

export default function ProfileJourneyTab({ user, userProgress, workoutSessions, meditationSessions, journalEntries }) {
  const stats = [
    {
      icon: Dumbbell,
      label: 'Workouts',
      value: userProgress?.workouts_completed || workoutSessions.length || 0,
      color: 'from-orange-400 to-red-500',
      bg: 'bg-orange-50'
    },
    {
      icon: BookOpen,
      label: 'Bible Readings',
      value: userProgress?.bible_readings_completed || 0,
      color: 'from-[#AFC7E3] to-[#AFC7E3]',
      bg: 'bg-[#F2F6FA]'
    },
    {
      icon: Brain,
      label: 'Meditations',
      value: userProgress?.meditations_completed || meditationSessions.length || 0,
      color: 'from-[#D9B878] to-[#FAD98D]',
      bg: 'bg-[#FAD98D]/10'
    },
    {
      icon: BookOpen,
      label: 'Journal Entries',
      value: journalEntries.length || 0,
      color: 'from-green-400 to-teal-500',
      bg: 'bg-green-50'
    },
  ];

  const hasActivity = stats.some(s => s.value > 0);

  return (
    <div className="space-y-4">
      {/* Streak & Level */}
      {userProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#3C4E53] to-[#2d3a3e] rounded-2xl p-5 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Current Streak</p>
              <p className="text-3xl font-bold">{userProgress.current_streak || 0} <span className="text-lg font-normal">days</span></p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm mb-1">Level</p>
              <p className="text-3xl font-bold">{userProgress.level || 1}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm mb-1">Points</p>
              <p className="text-3xl font-bold">{userProgress.total_points || 0}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${stat.bg} rounded-2xl p-4`}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {!hasActivity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#F2F6FA] rounded-2xl p-5 text-center"
        >
          <p className="text-sm text-[#3C4E53] mb-1 font-medium">Your journey is just beginning!</p>
          <p className="text-xs text-[#AFC7E3] mb-3">Log workouts, read the Bible, and journal to see your progress here.</p>
        </motion.div>
      )}

      <Link to={createPageUrl('ProgressDashboard')}>
        <Button className="w-full bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white gap-2 mt-2">
          <TrendingUp className="w-4 h-4" /> Full Journey Dashboard
        </Button>
      </Link>
    </div>
  );
}