import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Users, User, Heart, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner.jsx';
import NotificationBell from '@/components/notifications/NotificationBell';

// Scroll position cache
const scrollCache = {};

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Wellness', icon: Heart, page: 'Wellness' },
  { name: 'Bible', icon: BookOpen, page: 'Bible' },
  { name: 'Groups', icon: Users, page: 'Groups' },
  { name: 'Profile', icon: User, page: 'Profile' },
];

export default function Layout({ children, currentPageName }) {
  const contentRef = useRef(null);
  const location = useLocation();

  // Save scroll position when navigating away
  useEffect(() => {
    return () => {
      if (contentRef.current) {
        scrollCache[currentPageName] = window.scrollY;
      }
    };
  }, [currentPageName]);

  // Restore scroll position when navigating back
  useEffect(() => {
    if (scrollCache[currentPageName] !== undefined) {
      window.scrollTo(0, scrollCache[currentPageName]);
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentPageName]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#3C4E53]" ref={contentRef}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Imprint+MT+Shadow&display=swap');
        
        :root {
          --color-primary: #3C4E53;
          --color-secondary: #FD9C2D;
          --color-accent: #FAD98D;
          --color-background: #FFFFFF;
          --color-text: #000000;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #3C4E53;
          overscroll-behavior-y: none;
          -webkit-overflow-scrolling: touch;
        }
        
        button, a, [role="button"] {
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        .font-serif {
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        
        .font-imprint {
          font-family: 'Imprint MT Shadow', serif;
        }
      `}</style>
      
      {/* Top Bar with Notification Bell */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-[#2d2d4a] border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-40 pt-[env(safe-area-inset-top)]">
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPageName}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navItems.map(item => {
            const isActive = currentPageName === item.page;
            const Icon = item.icon;
            
            return (
              <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className="relative flex flex-col items-center py-2 px-4 min-h-[44px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-12 h-1 bg-[#FD9C2D] rounded-full"
                  />
                )}
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-[#FD9C2D]' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs mt-1 transition-colors ${
                    isActive ? 'text-[#3C4E53] font-medium' : 'text-gray-400'
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