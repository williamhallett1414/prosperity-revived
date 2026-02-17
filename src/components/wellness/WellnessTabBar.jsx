import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dumbbell, UtensilsCrossed, Heart } from 'lucide-react';

export default function WellnessTabBar({ activeTab = 'workouts' }) {
  const navigate = useNavigate();

  const tabs = [
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, selectedTab: 'workouts' },
    { id: 'nutrition', label: 'Nutrition', icon: UtensilsCrossed, selectedTab: 'nutrition' },
    { id: 'mind', label: 'Personal Growth', icon: Heart, selectedTab: 'personalGrowth' }
  ];

  const handleTabClick = (selectedTab) => {
    navigate(createPageUrl(`Wellness?selectedTab=${selectedTab}`));
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#E6EBEF]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (activeTab === 'personalGrowth' && tab.id === 'mind');
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.selectedTab)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-[#D9B878] text-[#0A1A2F] shadow-sm' 
                    : 'text-[#0A1A2F]/60 hover:text-[#0A1A2F]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}