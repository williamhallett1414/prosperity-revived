import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Users, User, Heart, BookOpen, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner.jsx';
import NotificationBell from '@/components/notifications/NotificationBell';
import PullToRefresh from '@/components/ui/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

const scrollCache = {};
const pageCache = {};

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [renderedPages, setRenderedPages] = useState({});

  const primaryPages = ['Home', 'Wellness', 'Bible', 'Groups', 'Profile'];
  const isPrimaryPage = primaryPages.includes(currentPageName);
  const isChildRoute = !isPrimaryPage;

  useEffect(() => {
    if (isPrimaryPage && !renderedPages[currentPageName]) {
      setRenderedPages(prev => ({
        ...prev,
        [currentPageName]: children
      }));
    }
  }, [currentPageName, isPrimaryPage, children]);

  useEffect(() => {
    return () => {
      if (contentRef.current && isPrimaryPage) {
        scrollCache[currentPageName] = window.scrollY;
      }
    };
  }, [currentPageName, isPrimaryPage]);

  useEffect(() => {
    if (isPrimaryPage && scrollCache[currentPageName] !== undefined) {
      setTimeout(() => {
        window.scrollTo(0, scrollCache[currentPageName]);
      }, 0);
    } else if (isPrimaryPage) {
      window.scrollTo(0, 0);
    }
  }, [currentPageName, isPrimaryPage]);

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#3C4E53]" ref={contentRef}>

        {/* FIXED HEADER — NOW NON-BLOCKING */}
        <div className="fixed top-0 left-0 right-0 bg-white dark:bg-[#2d2d4a] 
                        border-b border-gray-200 dark:border-gray-700 px-4 py-3 
                        z-40 pt-[env(safe-area-inset-top)] select-none pointer-events-none">

          <div className="max-w-2xl mx-auto flex items-center justify-between">

            {isChildRoute ? (
              <button
                onClick={() => navigate(-1)}
                className="pointer-events-auto flex items-center gap-2 p-2 
                           hover:bg-gray-100 dark:hover:bg-[#3C4E53] rounded-full 
                           transition min-h-[44px] min-w-[44px] justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-[#0A1A2F] dark:text-white" />
              </button>
            ) : (
              <Link
                to={createPageUrl('Home')}
                className="pointer-events-auto flex items-center gap-2"
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6980ade9ca08df558ed28bdd/d9b97f241_ProsperityRevivedSymbol.jpeg"
                  alt="Prosperity Revived"
                  className="w-8 h-8 object-contain"
                />
              </Link>
            )}

            <div className="pointer-events-auto">
              <NotificationBell />
            </div>

          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="pt-16 pb-20">
          <PullToRefresh onRefresh={async () => {
            await queryClient.invalidateQueries();
          }}>
            {isPrimaryPage ? (
              <>
                {primaryPages.map(pageName => (
                  <div
                    key={pageName}
                    style={{ display: pageName === currentPageName ? 'block' : 'none' }}
                  >
                    {renderedPages[pageName] || (pageName === currentPageName ? children : null)}
                  </div>
                ))}
              </>
            ) : (
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
            )}
          </PullToRefresh>
        </main>

        {/* BOTTOM NAV */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2d2d4a] 
                        border-t border-gray-200 dark:border-gray-700 px-4 py-2 
                        z-50 pb-[env(safe-area-inset-bottom)] select-none">

          <div className="max-w-lg mx-auto flex items-center justify-around">
            {navItems.map(item => {
              const isActive = currentPageName === item.page;
              const Icon = item.icon;

              const handleNavClick = (e) => {
                if (isActive) {
                  e.preventDefault();
                  window.scrollTo(0, 0);
                  scrollCache[item.page] = 0;
                }
              };

              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={handleNavClick}
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