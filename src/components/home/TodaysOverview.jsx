import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Book, Sparkles, Heart, Play, Dumbbell, Apple, Trophy } from 'lucide-react';
import { getVerseOfDay } from '@/components/bible/BibleData';

export default function TodaysOverview({ 
  meditations = [], 
  workoutPlans = [], 
  challenges = [], 
  moodToday = null 
}) {
  const verse = getVerseOfDay();
  
  const affirmations = [
    "God's peace guards my heart and mind.",
    "I walk in purpose and clarity today.",
    "Christ strengthens me in all things."
  ];
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todaysAffirmation = affirmations[dayOfYear % affirmations.length];

  const suggestedMeditation = meditations.find(m => m.status === 'ready') || meditations[0];
  const suggestedWorkout = workoutPlans[0];

  const overviewItems = [
    {
      icon: Book,
      label: 'Scripture',
      value: `${verse.book} ${verse.chapter}:${verse.verse}`,
      link: createPageUrl(`Bible?book=${verse.book}&chapter=${verse.chapter}`),
      gradient: 'from-[#AFC7E3] to-[#D9B878]'
    },
    {
      icon: Sparkles,
      label: 'Affirmation',
      value: todaysAffirmation,
      link: createPageUrl('SelfCare'),
      gradient: 'from-[#D9B878] to-[#AFC7E3]'
    },
    {
      icon: Heart,
      label: 'Mood Check',
      value: moodToday ? 'Checked in today ✓' : 'Tap to check in',
      link: createPageUrl('SelfCare'),
      gradient: 'from-[#D9B878] to-[#D9B878]'
    },
    {
      icon: Play,
      label: 'Meditation',
      value: suggestedMeditation?.title || 'Browse library',
      link: createPageUrl('DiscoverMeditations'),
      gradient: 'from-[#AFC7E3] to-[#AFC7E3]'
    },
    {
      icon: Dumbbell,
      label: 'Workout',
      value: suggestedWorkout?.title || 'Choose workout',
      link: createPageUrl('DiscoverWorkouts'),
      gradient: 'from-[#0A1A2F] to-[#AFC7E3]'
    },
    {
      icon: Apple,
      label: 'Nutrition',
      value: 'Track today\'s meals',
      link: createPageUrl('NutritionGuidance'),
      gradient: 'from-[#AFC7E3] to-[#D9B878]'
    },
    {
      icon: Trophy,
      label: 'Challenges',
      value: `${challenges.length} active`,
      link: createPageUrl('SelfCare'),
      gradient: 'from-[#D9B878] to-[#AFC7E3]'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">Today's Overview</h2>
      <div className="space-y-3">
        {overviewItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} to={item.link}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`bg-gradient-to-r ${item.gradient} rounded-2xl p-4 shadow-md hover:shadow-lg transition-all`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0A1A2F]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#0A1A2F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0A1A2F]/60 mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-[#0A1A2F] line-clamp-1">{item.value}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}