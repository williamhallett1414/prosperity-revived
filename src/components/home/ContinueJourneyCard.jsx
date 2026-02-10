import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight, BookOpen, Dumbbell, Target, PenLine } from 'lucide-react';

export default function ContinueJourneyCard({ 
  activePlans = [], 
  challenges = [], 
  workoutSessions = [],
  journalEntries = []
}) {
  // Determine what to suggest next
  const getNextActivity = () => {
    // Check for active reading plan
    if (activePlans.length > 0) {
      const plan = activePlans[0];
      return {
        type: 'reading',
        icon: BookOpen,
        title: 'Continue Reading Plan',
        subtitle: plan.plan_name,
        link: createPageUrl(`PlanDetail?id=${plan.plan_id}`),
        gradient: 'from-[#AFC7E3] to-[#D9B878]'
      };
    }

    // Check for active challenges
    if (challenges.length > 0) {
      const challenge = challenges[0];
      return {
        type: 'challenge',
        icon: Target,
        title: 'Continue Challenge',
        subtitle: `Day ${(challenge.completed_days?.length || 0) + 1}`,
        link: createPageUrl('SelfCare'),
        gradient: 'from-[#D9B878] to-[#AFC7E3]'
      };
    }

    // Suggest workout if none today
    const today = new Date().toISOString().split('T')[0];
    const workoutToday = workoutSessions.find(s => s.date?.startsWith(today));
    if (!workoutToday) {
      return {
        type: 'workout',
        icon: Dumbbell,
        title: 'Start Your Workout',
        subtitle: 'Stay consistent with your fitness',
        link: createPageUrl('DiscoverWorkouts'),
        gradient: 'from-[#0A1A2F] to-[#AFC7E3]'
      };
    }

    // Suggest journaling
    const journalToday = journalEntries.find(e => e.created_date?.startsWith(today));
    if (!journalToday) {
      return {
        type: 'journal',
        icon: PenLine,
        title: 'Journal Your Thoughts',
        subtitle: 'Reflect on your day',
        link: createPageUrl('SelfCare'),
        gradient: 'from-[#D9B878] to-[#D9B878]'
      };
    }

    // Default
    return {
      type: 'default',
      icon: BookOpen,
      title: 'Continue Your Journey',
      subtitle: 'Explore spiritual growth',
      link: createPageUrl('Bible'),
      gradient: 'from-[#AFC7E3] to-[#AFC7E3]'
    };
  };

  const nextActivity = getNextActivity();
  const Icon = nextActivity.icon;

  return (
    <Link to={nextActivity.link}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`bg-gradient-to-r ${nextActivity.gradient} rounded-2xl p-6 shadow-lg mb-8`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#0A1A2F]/10 rounded-full p-3">
              <Icon className="w-6 h-6 text-[#0A1A2F]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0A1A2F] text-lg mb-1">{nextActivity.title}</h3>
              <p className="text-[#0A1A2F]/70 text-sm">{nextActivity.subtitle}</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#0A1A2F]/50" />
        </div>
      </motion.div>
    </Link>
  );
}