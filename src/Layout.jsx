import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Users, User, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner.jsx';
import NotificationBell from '@/components/notifications/NotificationBell';

import { Dumbbell, Utensils } from 'lucide-react';

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Wellness', icon: Heart, page: 'Wellness' },
  { name: 'Workouts', icon: Dumbbell, page: 'DiscoverWorkouts' },
  { name: 'Nutrition', icon: Utensils, page: 'NutritionGuidance' },
  { name: 'Profile', icon: User, page: 'Profile' },
];

export default function Layout({ children, currentPageName }) {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-[#F2F6FA]">
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --color-soft-mist: #F2F6FA;
          --color-deep-navy: #0A1A2F;
          --color-soft-gold: #D9B878;
          --color-cloud-gray: #E6EBEF;
          --color-gentle-sky: #AFC7E3;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #0A1A2F;
        }
        
        .font-serif {
          font-family: 'Georgia', 'Times New Roman', serif;
        }
      `}</style>
      
      {/* Top Bar with Notification Bell */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-[#E6EBEF] px-4 py-3 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6980ade9ca08df558ed28bdd/d9b97f241_ProsperityRevivedSymbol.jpeg" 
              alt="Prosperity Revived" 
              className="w-8 h-8 object-contain"
            />
          </Link>
          <NotificationBell />
        </div>
      </div>

      <main className="pt-16 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[#E6EBEF] px-4 py-2 z-50 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navItems.map(item => {
            const isActive = currentPageName === item.page;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="relative flex flex-col items-center py-2 px-4"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-12 h-1 bg-[#D9B878] rounded-full"
                  />
                )}
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-[#D9B878]' : 'text-[#0A1A2F]/40'
                  }`}
                />
                <span
                  className={`text-xs mt-1 transition-colors ${
                    isActive ? 'text-[#0A1A2F] font-semibold' : 'text-[#0A1A2F]/40'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </>
  );
}