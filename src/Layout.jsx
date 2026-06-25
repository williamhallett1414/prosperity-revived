import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Home, User, Heart, BookOpen, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner.jsx';
import PullToRefresh from '@/components/ui/PullToRefresh';
import { requestNotificationPermission, initDefaultReminders } from '@/utils/notifications';
import { useQueryClient } from '@tanstack/react-query';
import AgeVerificationGate from '@/components/onboarding/AgeVerificationGate';
const OnboardingFlow = React.lazy(() => import('@/components/onboarding/OnboardingFlow'));

// Lazy-load optional components to prevent crash if any are broken
const GuidedTour = React.lazy(() => import('@/components/onboarding/GuidedTour'));
const HomeHamburger = React.lazy(() => import('@/components/navigation/HomeHamburger'));
const NotificationBell = React.lazy(() => import('@/components/notifications/NotificationBell'));
const UniversalHeader = React.lazy(() => import('@/components/navigation/UniversalHeader'));
const OfflineBanner = React.lazy(() => import('@/components/ui/OfflineBanner'));

// Scroll position cache per page
const scrollCache = {};

// Page component cache to prevent re-mounting
const pageCache = {};

const navItems = [
{ name: 'Home', icon: Home, page: 'Home' },
{ name: 'Wellness', icon: Heart, page: 'Wellness' },
{ name: 'Bible', icon: BookOpen, page: 'Bible' },
{ name: 'Community', icon: Users, page: 'Community' },
{ name: 'Profile', icon: User, page: 'Profile' },
];


export default function Layout({ children, currentPageName }) {
  const contentRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showGuidedTour, setShowGuidedTour] = useState(false);

  // Age verification + onboarding gate
  // IMPORTANT: Don't trust localStorage alone — iOS WebView persists it after uninstall.
  // Always verify against the database when the user object loads.
  const [ageVerified, setAgeVerified] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [needsAgeCheck, setNeedsAgeCheck] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      // Age check — verify from DB, not localStorage
      if (u?.age_group && u.age_group !== 'under13') {
        localStorage.setItem('age_verified', '1');
        setAgeVerified(true);
      } else {
        // Clear stale localStorage if DB says not verified
        localStorage.removeItem('age_verified');
        setNeedsAgeCheck(true);
        setUserLoaded(true);
        return;
      }

      // Onboarding check — DB is the source of truth
      if (u?.onboarding_completed === true) {
        localStorage.setItem('onboarding_done', '1');
        setOnboardingDone(true);
      } else {
        // Clear stale localStorage — DB says not completed
        localStorage.removeItem('onboarding_done');
        localStorage.removeItem('full_tour_shown');
        setNeedsOnboarding(true);
      }
      setUserLoaded(true);
    }).catch(() => {
      // Auth failed — user not logged in yet. 
      // Don't trust localStorage alone — wait for auth to resolve.
      // Base44 will show its login/signup screen.
      setUserLoaded(true);
    });
  }, []);

  const handleAgeVerified = async (ageGroup) => {
    localStorage.setItem('age_verified', '1');
    setAgeVerified(true);
    setNeedsAgeCheck(false);
    try { await base44.auth.updateMe({ age_group: ageGroup }); } catch {}
    // After age verification, check if onboarding is needed
    try {
      const u = await base44.auth.me();
      if (!u?.onboarding_completed) setNeedsOnboarding(true);
    } catch {}
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_done', '1');
    setOnboardingDone(true);
    setNeedsOnboarding(false);
    // Auto-launch the full guided tour after onboarding — UNLESS a founder
    // celebration is pending. If the user just became a founder, the
    // celebration overlay needs the stage to itself; the tour will fire
    // when the celebration is dismissed (FounderCelebration dispatches
    // the 'launchGuidedTour' event we listen for below).
    if (!localStorage.getItem('full_tour_shown')) {
      let founderCelebrationPending = false;
      try {
        const raw = localStorage.getItem('founder_celebration_pending');
        if (raw) {
          const parsed = JSON.parse(raw);
          // shownAt === null means the celebration hasn't been shown yet
          founderCelebrationPending = parsed && parsed.shownAt == null;
        }
      } catch {
        // Ignore — fall back to firing the tour normally
      }
      if (!founderCelebrationPending) {
        setTimeout(() => {
          setShowGuidedTour(true);
          localStorage.setItem('full_tour_shown', '1');
        }, 800); // Short delay to let Home page render
      }
      // If celebration IS pending, we do nothing here. FounderCelebration
      // will dispatch 'launchGuidedTour' when the user dismisses it,
      // which the listener below picks up.
    }
  };

  // Apply dark mode on app load 
  useEffect(() => {
    try {
      base44.auth.me().then(u => {
        const theme = u?.theme || 'auto';
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = theme === 'dark' || (theme === 'auto' && systemDark);
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }).catch(() => {
        // Not logged in — use system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        }
      });
    } catch {}
  }, []);

  // Initialize notifications (request permission + schedule defaults)
  useEffect(() => {
    requestNotificationPermission().then(perm => {
      if (perm === 'granted') initDefaultReminders();
    });
  }, []);

  // Expose startGuidedTour globally so Home.jsx (and Settings) can trigger it
  useEffect(() => {
    // Method 1: window global (for direct calls)
    window.__startGuidedTour = () => setShowGuidedTour(true);
    window.__startMiniTour   = (steps) => {
      window.__pendingMiniTourSteps = steps;
      setShowGuidedTour(true);
    };
    // Method 2: CustomEvent listener (more reliable across contexts)
    const handleTourEvent = (e) => {
      const steps = e.detail?.steps || null;
      window.__pendingMiniTourSteps = steps;
      setShowGuidedTour(true);
    };
    window.addEventListener('launchGuidedTour', handleTourEvent);
    return () => {
      delete window.__startGuidedTour;
      delete window.__startMiniTour;
      window.removeEventListener('launchGuidedTour', handleTourEvent);
    };
  }, []);

  // Method 3: Check URL for ?tour= parameter on every route change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tourKey = params.get('tour');
    if (tourKey) {
      // Remove the tour param from URL so it doesn't re-trigger
      params.delete('tour');
      const cleanUrl = location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', cleanUrl);

      // Store tour key and show tour after page has rendered
      window.__pendingTourKey = tourKey;
      setTimeout(() => setShowGuidedTour(true), 1200);
    }
  }, [location.pathname, location.search]);


  // Primary navigation pages that should be kept mounted
  const primaryPages = ['Home', 'Bible', 'Wellness', 'Community', 'ProgressDashboard', 'Profile'];
  const isPrimaryPage = primaryPages.includes(currentPageName);

  // Determine if current page is a child route (not a primary nav page)
  const isChildRoute = !isPrimaryPage;

  // Page title mapping
  const pageTitles = {
    Home: 'Home',
    Wellness: 'Wellness',
    ProgressDashboard: 'Your Journey',
    Groups: 'Groups',
    Profile: 'Profile',
    Settings: 'Settings',
    Workouts: 'Fitness',
    Nutrition: 'Nutrition',
    Prayer: 'Prayer',
    Community: 'Community',
    Plans: 'Reading Plans',
    PlanDetail: 'Plan Details',
    GrowthPathwaysPage: 'Growth Pathways',
    HabitBuilderPage: 'Habit Builder',
    EmotionalCheckInPage: 'Emotional Check-In',
    MindsetResetPage: 'Mindset Reset',
    ChallengeDetailPage: 'Challenge Details',
    AffirmationsPage: 'Affirmations',
    GratitudeJournalPage: 'Gratitude Journal',
    IdentityInChristPage: 'Identity in Christ',
    WeeklyReflectionPage: 'Weekly Reflection',
    FoodLogHistory: 'Food Log History',
    MealDetailView: 'Meal Details',
    NutritionArticle: 'Article',
    NutritionGuidance: 'Nutrition Guidance',
    DiscoverRecipes: 'Discover Recipes',
    WorkoutCategoryPage: 'Workouts',
    WorkoutProgress: 'Workout Progress',
    WorkoutTrends: 'Workout Trends',
    WorkoutPlanner: 'Workout Planner',
    FitnessGoalsPage: 'Fitness Goals',
    NutritionGoalsPage: 'Nutrition Goals',
    BibleGoalsPage: 'Bible Study Goals',
    PersonalGrowthGoalsPage: 'Growth Goals',
    SpiritualGrowth: 'Spiritual Growth',
    SpiritualInsights: 'Spiritual Insights',
    PersonalGrowth: 'Personal Growth',
    PhotoGallery: 'Photo Gallery',
    Bookmarks: 'Bookmarks',
    Achievements: 'Achievements',
    Notifications: 'Notifications',
    NotificationSettings: 'Notification Settings',
    MyJournalEntries: 'My Journal',
    UserProfile: 'Profile',
    BibleBooks: 'Bible',
    GroupDetail: 'Group',
    GroupPlanDetail: 'Group Plan',
    Messages: 'Messages',
    Friends: 'Friends',
    Search: 'Search',
    CouplesMode: 'Couples Mode',
    CoachingPlans: 'Coaching Plans',
    HealthWellnessWaiver: 'Health Waiver',
    PrivacyPolicy: 'Privacy Policy',
    SubscriptionTerms: 'Subscription Terms',
    GuidedMeditationsPage: 'Meditations',
    FastingTracker: 'Fasting',
    SpiritualAssessment: 'Spiritual Assessment',
    CoachedWorkout: 'Coach Led Workouts',
    CoachedWorkouts: 'Coach Led',
  };

  // Dynamic title for ChatScreen based on bot parameter
  if (currentPageName === 'ChatScreen') {
    const params = new URLSearchParams(location.search);
    const bot = params.get('bot');
    const botNames = {
      'Gideon': 'Gideon',
      'Hannah': 'Hannah',
      'CoachDavid': 'Coach David',
      'ChefDaniel': 'Chef Daniel',
      'CoachPaul': 'Coach Paul',
    };
    pageTitles['ChatScreen'] = botNames[bot] || 'Chat';
  }

  const currentPageTitle = pageTitles[currentPageName] || currentPageName;

  // Back destinations for child pages
  const pageBackTo = {
    WorkoutCategoryPage: 'Workouts',
    WorkoutProgress:     'Workouts',
    WorkoutTrends:       'Workouts',
    WorkoutPlanner:      'Workouts',
    FitnessGoalsPage:    'Workouts',
    NutritionGoalsPage:  'Nutrition',
    BibleGoalsPage:      'Bible',
    PersonalGrowthGoalsPage: 'PersonalGrowth',
    CoachingPlanDetail:  'Workouts',
    ChallengeDetailPage: 'Workouts',
    PersonalGrowth:      'Home',
    WeeklyReflectionPage:'PersonalGrowth',
    GrowthPathwaysPage:  'PersonalGrowth',
    HabitBuilderPage:    'PersonalGrowth',
    EmotionalCheckInPage:'PersonalGrowth',
    AffirmationsPage:    'PersonalGrowth',
    GratitudeJournalPage:'PersonalGrowth',
    IdentityInChristPage:'PersonalGrowth',
    MindsetResetPage:    'PersonalGrowth',
    MyJournalEntries:    'PersonalGrowth',
    FoodLogHistory:      'Nutrition',
    MealDetailView:      'Nutrition',
    NutritionArticle:    'Nutrition',
    NutritionGuidance:   'Nutrition',
    DiscoverRecipes:     'Nutrition',
    CoachedWorkout:      'CoachedWorkouts',
    CoachedWorkouts:     'Workouts',
  };
  const currentPageBack = pageBackTo[currentPageName] || null;



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

  // Show age gate before anything else for new users
  if (userLoaded && needsAgeCheck && !ageVerified) {
    return <AgeVerificationGate onVerified={handleAgeVerified} />;
  }

  // Show full onboarding flow for users who haven't completed it
  if (userLoaded && ageVerified && needsOnboarding && !onboardingDone) {
    return (
      <React.Suspense fallback={null}>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </React.Suspense>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <React.Suspense fallback={null}><OfflineBanner /></React.Suspense>
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
            --color-background: #0A1A2F;
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
      
      {/* Top Bar with Universal Header */}
      {isChildRoute ? (
        <React.Suspense fallback={null}><UniversalHeader title={currentPageTitle} backTo={currentPageBack} /></React.Suspense>
      ) : (
        <div
          className="fixed top-0 left-0 right-0 bg-white dark:bg-white/5 dark:bg-[#0A1A2F] border-b border-gray-200 dark:border-white/10 dark:border-gray-700 px-4 pb-2 z-40 select-none"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}
        >
          <div className="max-w-lg mx-auto flex items-center justify-between relative">
            <div className="w-9" />
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <img
                src="/prosperity-revived-logo.png"
                alt="Prosperity Revived"
                className="w-7 h-7 flex-shrink-0 object-contain dark:invert"
              />
              <h1 className={`text-base font-bold text-[#3C4E53] dark:text-white text-center whitespace-nowrap ${currentPageName === 'Home' ? 'font-imprint' : ''}`}>
                {currentPageName === 'Home' ? 'Prosperity Revived' : (pageTitles[currentPageName] || currentPageName)}
              </h1>
            </div>
            <React.Suspense fallback={null}><HomeHamburger /></React.Suspense>
          </div>
        </div>
      )}

      <main
        className="pb-20"
        style={isPrimaryPage ? { paddingTop: 'calc(env(safe-area-inset-top) + 4rem)' } : undefined}
      >
        <PullToRefresh onRefresh={async () => {
            await queryClient.invalidateQueries();
          }}>
          {isPrimaryPage ?
            // For primary pages, keep all mounted but show only active
            <>
              {primaryPages.map((pageName) => (
                <div key={pageName} style={{ display: pageName === currentPageName ? 'block' : 'none' }}>
                  {pageName === currentPageName ? children : null}
                </div>
              ))}
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-white/5 dark:bg-[#0A1A2F] border-t border-gray-200 dark:border-white/10 dark:border-gray-700 px-4 py-2 z-50 pb-[env(safe-area-inset-bottom)] select-none">
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
                  id={`nav-${item.page.toLowerCase()}`}
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
                    isActive ? 'text-[#FD9C2D]' : 'text-gray-400 dark:text-gray-300'}`
                    } />

                <span
                    className={`text-xs mt-1 transition-colors ${
                    isActive ? 'text-[#3C4E53] font-medium' : 'text-gray-400 dark:text-gray-300'}`
                    }>

                  {item.name}
                </span>
              </Link>);

            })}
        </div>
      </nav>
      </div>

      {/* Guided Tour — persists across route changes */}
    {showGuidedTour && (
      <React.Suspense fallback={null}>
        <GuidedTour
          customSteps={window.__pendingMiniTourSteps || null}
          tourKey={window.__pendingTourKey || null}
          onComplete={() => {
            window.__pendingMiniTourSteps = null;
            window.__pendingTourKey = null;
            setShowGuidedTour(false);
          }}
        />
      </React.Suspense>
    )}
    </>);

}