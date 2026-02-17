import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Users, User, Heart, BookOpen, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner.jsx';
import NotificationBell from '@/components/notifications/NotificationBell';
import PullToRefresh from '@/components/ui/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

// Scroll position cache per page
const scrollCache = {};

// Page component cache to prevent re-mounting
const pageCache = {};

const navItems = [
{ name: 'Home', icon: Home, page: 'Home' },
{ name: 'Wellness', icon: Heart, page: 'Wellness' },
{ name: 'Bible', icon: BookOpen, page: 'Bible' },
{ name: 'Groups', icon: Users, page: 'Groups' },
{ name: 'Profile', icon: User, page: 'Profile' }];


export default function Layout({ children, currentPageName }) {
  const contentRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [renderedPages, setRenderedPages] = useState({});

  // Primary navigation pages that should be kept mounted
  const primaryPages = ['Home', 'Wellness', 'Bible', 'Groups', 'Profile'];
  const isPrimaryPage = primaryPages.includes(currentPageName);

  // Determine if current page is a child route (not a primary nav page)
  const isChildRoute = !isPrimaryPage;

  // Cache page content for primary navigation
  useEffect(() => {
    if (isPrimaryPage && !renderedPages[currentPageName]) {
      setRenderedPages((prev) => ({
        ...prev,
        [currentPageName]: children
      }));
    }
  }, [currentPageName, isPrimaryPage, children]);

  // Save scroll position when navigating away
  useEffect(() => {
    return () => {
      if (contentRef.current && isPrimaryPage) {
        scrollCache[currentPageName] = window.scrollY;
      }
    };
  }, [currentPageName, isPrimaryPage]);

  // Restore scroll position when navigating back
  useEffect(() => {
    if (isPrimaryPage && scrollCache[currentPageName] !== undefined) {
      // Use setTimeout to ensure DOM is ready
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
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Imprint+MT+Shadow&display=swap');
        
        :root {
          --color-primary: #3C4E53;
          --color-secondary: #FD9C2D;
          --color-accent: #FAD98D;
          --color-background: #FFFFFF;
          --color-text: #000000;
        }
        
        @media (prefers-color-scheme: dark) {
          :root {
            --color-primary: #3C4E53;
            --color-secondary: #FD9C2D;
            --color-accent: #FAD98D;
            --color-background: #2d2d4a;
            --color-text: #FFFFFF;
          }
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--color-text);
          background-color: var(--color-background);
          overscroll-behavior-y: none;
          -webkit-overflow-scrolling: touch;
        }
        
        button, a, [role="button"], input[type="button"], input[type="submit"], 
        [class*="Button"], [class*="Tab"], [class*="Dialog"] button {
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        
        [class*="fixed"] {
          user-select: none;
          -webkit-user-select: none;
        }
        
        .font-serif {
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        
        .font-imprint {
          font-family: 'Imprint MT Shadow', serif;
        }
      `}</style>
      
      {/* Top Bar with Back Button or Logo */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-[#2d2d4a] border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-40 pt-[env(safe-area-inset-top)] select-none">
        


















      </div>

      <main className="pt-16 pb-20">
        <PullToRefresh onRefresh={async () => {
            await queryClient.invalidateQueries();
          }}>
          {isPrimaryPage ?
            // For primary pages, keep all mounted but show only active
            <>
              {primaryPages.map((pageName) =>
              <div
                key={pageName}
                style={{ display: pageName === currentPageName ? 'block' : 'none' }}>

                  {renderedPages[pageName] || (pageName === currentPageName ? children : null)}
                </div>
              )}
            </> :

            // For secondary pages, use animation
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPageName}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}>

                {children}
              </motion.div>
            </AnimatePresence>
            }
        </PullToRefresh>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2d2d4a] border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50 pb-[env(safe-area-inset-bottom)] select-none">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              const Icon = item.icon;

              const handleNavClick = (e) => {
                // If already on this tab, reset scroll to top
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
                  className="relative flex flex-col items-center py-2 px-4 min-h-[44px]">

                {isActive &&
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-12 h-1 bg-[#FD9C2D] rounded-full" />

                  }
                <Icon
                    className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-[#FD9C2D]' : 'text-gray-400'}`
                    } />

                <span
                    className={`text-xs mt-1 transition-colors ${
                    isActive ? 'text-[#3C4E53] font-medium' : 'text-gray-400'}`
                    }>

                  {item.name}
                </span>
              </Link>);

            })}
        </div>
      </nav>
    </div>
    </>);

}