import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Dumbbell, Apple, Sparkles } from 'lucide-react';

export default function WellnessTabBar({ activeTab = 'workouts' }) {
  const navigate = useNavigate();

  const tabs = [
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'personalGrowth', label: 'Personal Growth', icon: Sparkles }
  ];

  const handleTabClick = (tabId) => {
    navigate(createPageUrl('Wellness') + `?tab=${tabId}`);
  };

  return (
    <div className="bg-white dark:bg-[#2d2d4a] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-0">
        <div className="flex items-center justify-between gap-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="relative flex-1 flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium transition-colors"
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FD9C2D]' : 'text-gray-400'}`} />
                <span className={isActive ? 'text-[#3C4E53] dark:text-[#FD9C2D]' : 'text-gray-500 dark:text-gray-400'}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#FD9C2D]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}