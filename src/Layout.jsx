import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Home, User, Heart, BookOpen, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';

const navItems = [
{ name: 'Home', icon: Home, page: 'Home' },
{ name: 'Wellness', icon: Heart, page: 'Wellness' },
{ name: 'Bible', icon: BookOpen, page: 'Bible' },
{ name: 'Community', icon: Users, page: 'Community' },
{ name: 'Profile', icon: User, page: 'Profile' },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white dark:bg-[#3C4E53]">
      <Toaster position="top-center" richColors />

      <main className="pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0A1A2F] border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50 pb-[env(safe-area-inset-bottom)] select-none">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            const Icon = item.icon;
            return (
              <Link
                key={item.page}
                id={`nav-${item.page.toLowerCase()}`}
                to={createPageUrl(item.page)}
                className="relative flex flex-col items-center py-2 px-4 min-h-[44px]">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-12 h-1 bg-[#FD9C2D] rounded-full" />
                )}
                <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-[#FD9C2D]' : 'text-gray-400'}`} />
                <span className={`text-xs mt-1 transition-colors ${isActive ? 'text-[#3C4E53] font-medium' : 'text-gray-400'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
