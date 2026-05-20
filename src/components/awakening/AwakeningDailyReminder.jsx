/**
 * AwakeningDailyReminder — once-per-day reminder shown on home during the
 * 7-Day Awakening event window.
 *
 * Behavior:
 *   - Only renders during currentDay 1..7 (the active event days)
 *   - Only shows ONCE per calendar day per user — tracks last-shown date
 *     in localStorage. Same-day re-renders don't re-fire the overlay.
 *   - Auto-hides if user has already completed today's day
 *   - Auto-hides if user has dismissed the banner globally (respects the
 *     existing AwakeningBanner dismissal preference)
 *   - Includes a "Begin" CTA that routes to /Awakening so the user lands
 *     in the full event UI to choose their day
 *   - Includes a "Maybe later" dismiss button that closes the sheet for
 *     today (won't reshow until tomorrow)
 *
 * Notes on what this is NOT:
 *   - This is NOT a push notification. No APNs, no permission prompts, no
 *     server-side scheduling. It's an in-app overlay that appears when the
 *     user opens the app during the event window. Intentional design
 *     choice for v1 — push notifications would have been a 3-5 day build.
 *   - This is NOT the AwakeningBanner. That's a smaller persistent card
 *     in the home feed. This is a one-time-per-day full overlay.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  AWAKENING_DAYS,
  getCurrentDay,
} from '@/lib/awakeningEvent';
import FoundingMemberBadge from '@/components/awakening/FoundingMemberBadge';

// Banner-dismiss key shared with AwakeningBanner.jsx — respect global
// dismissal so a user who dismissed the banner doesn't get this overlay
// either. (If they hard-dismissed the event entirely, don't override.)
const BANNER_DISMISS_KEY = 'awakening_banner_dismissed_session';

// Per-day-shown key — separate from banner dismissal. Tracks the YYYY-MM-DD
// of the last time the overlay was shown to this user on this device.
const LAST_SHOWN_KEY = 'awakening_daily_reminder_last_shown';

// Per-day-dismissed key — when the user taps "Maybe later" today, don't
// re-show today even if they reload the home page.
const TODAY_DISMISSED_KEY = 'awakening_daily_reminder_today_dismissed';

function todayDateKey(now = new Date()) {
  // YYYY-MM-DD in LOCAL time — same calendar bucket as the event dates,
  // which are LOCAL too (defined in awakeningEvent.js).
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shouldShowToday(now = new Date()) {
  try {
    const today = todayDateKey(now);
    const dismissedToday = localStorage.getItem(TODAY_DISMISSED_KEY) === today;
    if (dismissedToday) return false;
    const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
    if (lastShown === today) return false; // already shown today
    // Also respect the banner-dismissed flag (per session). If the user
    // dismissed the banner, they don't want event reminders right now.
    const bannerDismissed = sessionStorage.getItem(BANNER_DISMISS_KEY) === '1';
    if (bannerDismissed) return false;
    return true;
  } catch {
    return false;
  }
}

function markShownToday(now = new Date()) {
  try {
    localStorage.setItem(LAST_SHOWN_KEY, todayDateKey(now));
  } catch {}
}

function markDismissedToday(now = new Date()) {
  try {
    localStorage.setItem(TODAY_DISMISSED_KEY, todayDateKey(now));
  } catch {}
}

export default function AwakeningDailyReminder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [now] = useState(() => new Date());
  const [visible, setVisible] = useState(false);

  const currentDay = useMemo(() => getCurrentDay(user, now), [user, now]);
  const isFounder = !!user?.founding_member;
  const progress = user?.awakening_progress || [];

  // Decide on mount whether to show. We compute once on mount, not on every
  // render, so dismissing it within the same mount doesn't re-trigger.
  useEffect(() => {
    // Gate 1: event must be in active-day window (1..7)
    if (currentDay < 1 || currentDay > 7) return;
    // Gate 2: today's day must not already be marked complete
    if (progress.includes(currentDay)) return;
    // Gate 3: per-day localStorage gates
    if (!shouldShowToday(now)) return;
    // All gates passed — show, and mark as shown so subsequent renders
    // today don't refire.
    setVisible(true);
    markShownToday(now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;
  if (currentDay < 1 || currentDay > 7) return null;

  const today = AWAKENING_DAYS[currentDay - 1];
  if (!today) return null;

  const handleBegin = () => {
    setVisible(false);
    navigate('/Awakening');
  };

  const handleMaybeLater = () => {
    markDismissedToday(now);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm"
        onClick={handleMaybeLater}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          // Stop click propagation so taps inside the card don't trigger
          // the backdrop's handleMaybeLater
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-md mx-0 sm:mx-4 overflow-hidden rounded-t-3xl sm:rounded-3xl"
          style={{
            background:
              'linear-gradient(160deg, #2A3A3F 0%, #1B262A 60%, #2A3A3F 100%)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Warm sunrise wash */}
          <div
            className="pointer-events-none absolute -top-16 -right-12 w-56 h-56 rounded-full opacity-40"
            style={{
              background:
                'radial-gradient(circle, #FD9C2D 0%, rgba(253,156,45,0) 65%)',
            }}
            aria-hidden="true"
          />

          {/* Top close (X) button */}
          <button
            type="button"
            onClick={handleMaybeLater}
            aria-label="Dismiss until tomorrow"
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative p-7 sm:p-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FAD98D]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAD98D] font-semibold">
                Day {currentDay} of 7
              </span>
              {isFounder && <FoundingMemberBadge variant="pill" />}
            </div>

            {/* Title */}
            <h2
              className="text-white font-serif italic text-2xl leading-tight mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {today.title}
            </h2>

            {/* Coach + practice */}
            <p className="text-[#FAD98D]/85 text-sm font-semibold mb-3">
              {today.coach} · {today.practice}
            </p>

            {/* Description */}
            <p className="text-white/75 text-sm leading-relaxed mb-7 pr-2">
              {today.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleBegin}
                className="w-full bg-[#FD9C2D] hover:bg-[#e88d1f] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors min-h-[52px]"
              >
                {today.cta}
              </button>
              <button
                type="button"
                onClick={handleMaybeLater}
                className="w-full text-center text-sm text-white/55 hover:text-white/85 py-2.5 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
