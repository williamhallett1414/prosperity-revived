import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, Heart, Play, Dumbbell, Apple } from 'lucide-react';

export default function QuickActionsRow() {
  const actions = [
    {
      icon: BookOpen,
      label: 'Journal',
      link: createPageUrl('SelfCare'),
      color: 'from-[#D9B878] to-[#AFC7E3]'
    },
    {
      icon: Heart,
      label: 'Prayer',
      link: createPageUrl('SelfCare'),
      color: 'from-[#AFC7E3] to-[#D9B878]'
    },
    {
      icon: Play,
      label: 'Meditate',
      link: createPageUrl('DiscoverMeditations'),
      color: 'from-[#AFC7E3] to-[#AFC7E3]'
    },
    {
      icon: Dumbbell,
      label: 'Workout',
      link: createPageUrl('DiscoverWorkouts'),
      color: 'from-[#0A1A2F] to-[#AFC7E3]'
    },
    {
      icon: Apple,
      label: 'Log Meal',
      link: createPageUrl('NutritionGuidance'),
      color: 'from-[#D9B878] to-[#D9B878]'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Quick Actions</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} to={action.link}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`min-w-[110px] bg-gradient-to-br ${action.color} rounded-2xl p-4 shadow-md snap-start flex flex-col items-center gap-2`}
              >
                <div className="w-12 h-12 rounded-full bg-[#0A1A2F]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#0A1A2F]" />
                </div>
                <span className="text-sm font-semibold text-[#0A1A2F]">{action.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}