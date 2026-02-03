import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, BookOpen, Compass, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Bible', icon: BookOpen, page: 'Bible' },
  { name: 'Community', icon: Users, page: 'Community' },
  { name: 'Groups', icon: Compass, page: 'Groups' },
  { name: 'Profile', icon: User, page: 'Profile' },
];

export default function Layout({ children, currentPageName }) {
  const hideNav = currentPageName === 'PlanDetail' || currentPageName === 'GroupDetail' || currentPageName === 'Bible' || currentPageName === 'Search' || currentPageName === 'Plans' || currentPageName === 'Bookmarks' || currentPageName === 'Profile';

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e]">
      <style>{`
        :root {
          --color-primary: #1a1a2e;
          --color-secondary: #c9a227;
          --color-accent: #8fa68a;
          --color-background: #faf8f5;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .font-serif {
          font-family: 'Georgia', 'Times New Roman', serif;
        }
      `}</style>
      
      <main className={hideNav ? '' : 'pb-20'}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50">
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
                      className="absolute -top-2 w-12 h-1 bg-[#c9a227] rounded-full"
                    />
                  )}
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-[#1a1a2e]' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs mt-1 transition-colors ${
                      isActive ? 'text-[#1a1a2e] font-medium' : 'text-gray-400'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}