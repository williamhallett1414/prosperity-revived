import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, BookOpen, Users, User, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Bible', icon: BookOpen, page: 'Bible' },
  { name: 'Groups', icon: Users, page: 'Groups' },
  { name: 'Wellness', icon: Heart, page: 'Wellness' },
  { name: 'Profile', icon: User, page: 'Profile' },
];

export default function Layout({ children, currentPageName }) {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#3C4E53]">
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
        }
        
        .font-serif {
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        
        .font-imprint {
          font-family: 'Imprint MT Shadow', serif;
        }
      `}</style>
      
      <main className="pt-20 pb-20">
        {children}
      </main>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 z-40">
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center gap-1">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6980ade9ca08df558ed28bdd/d9b97f241_ProsperityRevivedSymbol.jpeg" 
            alt="Prosperity Revived" 
            className="w-20 h-20 object-contain bg-transparent"
          />
          <h1 className="text-lg font-bold text-[#3C4E53] font-imprint italic">Prosperity Revived</h1>
          <p className="text-xs text-[#FD9C2D] font-medium italic">A Safe Space to Grow</p>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
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