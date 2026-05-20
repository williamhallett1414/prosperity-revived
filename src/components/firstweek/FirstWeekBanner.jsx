/**
 * FirstWeekBanner — home-screen card for users in their first 7 days.
 *
 * Replaces the old "popup right after onboarding" idea with a persistent
 * but non-blocking surface that the user sees on every home visit.
 *
 * Auto-hides if:
 *   - User is outside their first 7 days
 *   - User has dismissed it
 *   - User has marked all 7 days complete
 *   - The Awakening event banner is currently visible (priority deferral)
 *
 * Tap navigates to /FirstWeek. Dismissable.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  shouldShowFirstWeek,
  currentFirstWeekDay,
  buildFirstWeekPlan,
  dismissFirstWeek,
} from '@/lib/firstWeekPlan';

export default function FirstWeekBanner() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());
  // Local re-render trigger so dismiss reflects immediately
  const [dismissTick, setDismissTick] = useState(0);

  // Refresh time-derived state once a minute (cheap, ensures clean day
  // transitions at midnight without a reload).
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const show = useMemo(
    () => shouldShowFirstWeek(user, now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, now, dismissTick]
  );

  const day = useMemo(() => currentFirstWeekDay(user, now), [user, now]);
  const plan = useMemo(() => (user ? buildFirstWeekPlan(user) : []), [user]);

  if (!show || !day) return null;

  const todayConfig = plan[day - 1];
  if (!todayConfig) return null;

  const progress = user?.first_week_progress || [];
  const completedCount = progress.length;

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dismissFirstWeek();
    setDismissTick((t) => t + 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Link
          to="/FirstWeek"
          className="block relative overflow-hidden rounded-3xl p-5 shadow-sm dark:shadow-none"
          style={{
            background:
              'linear-gradient(135deg, #FBF6EC 0%, #FAD98D 100%)',
          }}
          aria-label={`Your First Week — Day ${day} of 7`}
        >
          {/* Warm sunrise wash */}
          <div
            className="pointer-events-none absolute -bottom-12 -right-8 w-48 h-48 rounded-full opacity-30"
            style={{
              background:
                'radial-gradient(circle, #FD9C2D 0%, rgba(253,156,45,0) 65%)',
            }}
            aria-hidden="true"
          />

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss First Week banner"
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-[#2A3A3F]/10 hover:bg-[#2A3A3F]/20 text-[#2A3A3F]/70 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FD9C2D]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FD9C2D] font-semibold">
                Your First Week · Day {day} of 7
              </span>
            </div>

            <h3
              className="text-[#2A3A3F] font-serif italic text-xl leading-tight mb-1"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {todayConfig.title}
            </h3>
            <p className="text-[#2A3A3F]/75 text-sm pr-6">
              {todayConfig.coach} · {todayConfig.practice}
            </p>

            {/* Progress dots */}
            <div className="mt-3 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <div
                  key={d}
                  className={[
                    'w-1.5 h-1.5 rounded-full transition-colors',
                    progress.includes(d)
                      ? 'bg-[#FD9C2D]'
                      : d === day
                        ? 'bg-[#FD9C2D]/40 ring-2 ring-[#FD9C2D]/30 ring-offset-1 ring-offset-transparent'
                        : 'bg-[#2A3A3F]/15',
                  ].join(' ')}
                  aria-label={`Day ${d}${progress.includes(d) ? ' complete' : d === day ? ' (today)' : ''}`}
                />
              ))}
              <span className="ml-2 text-[10px] text-[#2A3A3F]/55 font-semibold">
                {completedCount} of 7 complete
              </span>
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 text-[#2A3A3F] text-xs tracking-wider font-semibold">
              <span>Tap to enter</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
