import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Zap, Dumbbell, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const actions = [
  { icon: BookOpen, label: 'Journal', color: 'from-[#D9B878] to-[#AFC7E3]', page: 'Wellness' },
  { icon: Heart, label: 'Prayer', color: 'from-[#AFC7E3] to-[#D9B878]', page: 'SelfCare' },
  { icon: Zap, label: 'Meditate', color: 'from-[#FD9C2D] to-[#D9B878]', page: 'DiscoverMeditations' },
  { icon: Dumbbell, label: 'Workout', color: 'from-[#D9B878] to-[#FD9C2D]', page: 'Wellness' },
  { icon: UtensilsCrossed, label: 'Nutrition', color: 'from-[#AFC7E3] to-[#FD9C2D]', page: 'Wellness' }
];

export default function QuickActionsRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8 px-4"
    >
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} to={createPageUrl(action.page)}>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-gradient-to-br ${action.color} text-[#0A1A2F] min-w-[70px] snap-start flex-shrink-0 shadow-sm`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-semibold text-center">{action.label}</span>
              </motion.button>
            </Link>
          );
        })}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
}