import React from 'react';
import { motion } from 'framer-motion';
import { getVerseOfDay } from '@/components/bible/BibleData';
import { BookOpen, Sparkles, Zap, Droplets } from 'lucide-react';

const affirmations = [
  "I am worthy of God's love and grace",
  "Today I will choose faith over fear",
  "My potential is limitless with God",
];

const getAffirmation = () => affirmations[new Date().getDate() % affirmations.length];

export default function TodaysOverview({ meditations = [], workoutPlans = [], challenges = [] }) {
  const verse = getVerseOfDay();
  const affirmation = getAffirmation();
  const suggestedMeditation = meditations.find(m => m.category === 'mindfulness');
  const suggestedWorkout = workoutPlans?.[0];
  const activeChallenge = challenges?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 space-y-3"
    >
      <h2 className="text-lg font-bold text-[#0A1A2F] px-4">Today's Overview</h2>

      {/* Scripture Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-xl p-4 mx-4"
      >
        <div className="flex items-start gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-[#0A1A2F] flex-shrink-0 mt-1" />
          <div className="min-w-0">
            <p className="font-serif italic text-[#0A1A2F] text-sm leading-relaxed">
              "{verse.text}"
            </p>
            <p className="text-xs text-[#0A1A2F]/60 mt-1">{verse.book} {verse.chapter}:{verse.verse}</p>
          </div>
        </div>
      </motion.div>

      {/* Affirmation Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-br from-[#D9B878] to-[#FD9C2D] rounded-xl p-4 mx-4"
      >
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#0A1A2F] flex-shrink-0 mt-1" />
          <div>
            <p className="text-[#0A1A2F] font-semibold text-sm">{affirmation}</p>
          </div>
        </div>
      </motion.div>

      {/* Suggested Activity Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#E6EBEF] to-[#AFC7E3] rounded-xl p-4 mx-4"
      >
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-[#0A1A2F] flex-shrink-0 mt-1" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#0A1A2F]/70 mb-1">Suggested for Today</p>
            {suggestedMeditation && (
              <p className="text-sm text-[#0A1A2F] font-medium truncate">
                🧘 {suggestedMeditation.title}
              </p>
            )}
            {suggestedWorkout && (
              <p className="text-sm text-[#0A1A2F] font-medium truncate">
                💪 {suggestedWorkout.title || 'Workout'} ({suggestedWorkout.duration_minutes}m)
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Hydration Reminder */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-xl p-4 mx-4"
      >
        <div className="flex items-start gap-2">
          <Droplets className="w-4 h-4 text-[#0A1A2F] flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs font-semibold text-[#0A1A2F]/70">Hydration Goal</p>
            <p className="text-sm text-[#0A1A2F] font-medium">8 glasses of water today</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}