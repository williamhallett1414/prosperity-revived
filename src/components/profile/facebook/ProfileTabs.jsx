import React from 'react';
import { Users, MapPin, Image, Trophy, Activity, LayoutList, UsersRound, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
{ id: 'timeline', label: 'Timeline', icon: LayoutList },
{ id: 'about', label: 'About', icon: MapPin },
{ id: 'friends', label: 'Friends', icon: Users },
{ id: 'photos', label: 'Photos', icon: Image },
{ id: 'achievements', label: 'Achievements', icon: Trophy },
{ id: 'activity', label: 'Activity', icon: Activity },
{ id: 'groups', label: 'Groups', icon: UsersRound },
{ id: 'journey', label: 'Journey', icon: TrendingUp },
];

export default function ProfileTabs({ activeTab, onTabChange }) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="border-b border-[#D9B878]/25 bg-white rounded-t-lg">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-4 text-sm font-medium flex-1 min-w-max flex items-center justify-center gap-2 transition-colors relative border-b-2 ${
                  isActive
                    ? 'text-[#c9a227] border-[#c9a227]'
                    : 'text-[#0A1A2F]/50 border-transparent hover:text-[#0A1A2F] hover:border-[#D9B878]/40'
                }`}>
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive &&
                  <motion.div
                    layoutId="activeTab"
                    className="bg-[#c9a227] rounded-full absolute bottom-0 left-0 right-0 h-0.5"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                }
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
