import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Book, Heart, Dumbbell, Play, Sparkles, Utensils } from 'lucide-react';
import { getVerseOfDay } from '@/components/bible/BibleData';

export default function DailyStartSection({ 
  meditations = [], 
  workoutPlans = [], 
  todayMealLog = null 
}) {
  const verse = getVerseOfDay();
  const suggestedMeditation = meditations.find(m => m.status === 'ready') || meditations[0];
  const suggestedWorkout = workoutPlans[0];

  const affirmations = [
    "God's peace guards my heart and mind.",
    "I walk in purpose and clarity today.",
    "Christ strengthens me in all things."
  ];
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todaysAffirmation = affirmations[dayOfYear % affirmations.length];

  const quickActions = [
    {
      id: 'scripture',
      icon: Book,
      label: 'Scripture',
      subtitle: verse.book + ' ' + verse.chapter + ':' + verse.verse,
      gradient: 'from-[#AFC7E3] to-[#D9B878]',
      link: createPageUrl(`Bible?book=${verse.book}&chapter=${verse.chapter}`)
    },
    {
      id: 'affirmation',
      icon: Sparkles,
      label: 'Affirmation',
      subtitle: todaysAffirmation.slice(0, 30) + '...',
      gradient: 'from-[#D9B878] to-[#AFC7E3]',
      link: createPageUrl('SelfCare')
    },
    {
      id: 'prayer',
      icon: Heart,
      label: '2-Min Prayer',
      subtitle: 'Start your day',
      gradient: 'from-[#D9B878] to-[#D9B878]',
      link: createPageUrl('SelfCare')
    },
    {
      id: 'meditation',
      icon: Play,
      label: 'Meditation',
      subtitle: suggestedMeditation?.title?.slice(0, 30) || 'Browse meditations',
      gradient: 'from-[#AFC7E3] to-[#AFC7E3]',
      link: suggestedMeditation?.id 
        ? createPageUrl(`DiscoverMeditations`) 
        : createPageUrl('DiscoverMeditations')
    },
    {
      id: 'workout',
      icon: Dumbbell,
      label: 'Workout',
      subtitle: suggestedWorkout?.title?.slice(0, 30) || 'View workouts',
      gradient: 'from-[#0A1A2F] to-[#AFC7E3]',
      link: createPageUrl('DiscoverWorkouts')
    },
    {
       id: 'nutrition',
       icon: Utensils,
       label: 'Nutrition',
       subtitle: todayMealLog ? 'Log meal' : 'Track meals',
       gradient: 'from-[#AFC7E3] to-[#D9B878]',
       link: `${createPageUrl('Wellness')}?tab=nutrition`
     }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-[#0A1A2F] mb-1">Today's Journey</h2>
        <p className="text-[#0A1A2F]/60 text-sm">Your daily path to spiritual and physical wellness</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={action.id} to={action.link}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-4 shadow-md hover:shadow-lg transition-all`}
              >
                <Icon className="w-6 h-6 text-[#0A1A2F] mb-2" />
                <h3 className="font-semibold text-[#0A1A2F] text-sm mb-1">{action.label}</h3>
                <p className="text-xs text-[#0A1A2F]/70 line-clamp-1">{action.subtitle}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}