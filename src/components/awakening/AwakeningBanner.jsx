/**
 * AwakeningBanner — home-screen promotional banner for The 7-Day Awakening.
 *
 * Lifecycle:
 *   - Hidden by default outside the event-visibility window.
 *   - From July 27: shows countdown to August 10.
 *   - For Founding Members on August 9: shows "Your Day 0 is unlocked."
 *   - During event (Aug 10-16): shows "Day N of 7 — [today's coach]".
 *   - After August 16: hides.
 *
 * Tap navigates to /Awakening. Dismissible per-session via localStorage.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  AWAKENING_DAYS,
  daysUntilStart,
  getCurrentDay,
  isBannerVisible,
} from '@/lib/awakeningEvent';
import FoundingMemberBadge from '@/components/awakening/FoundingMemberBadge';

const DISMISS_KEY = 'awakening_banner_dismissed_session';

export default function AwakeningBanner() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  // Refresh time-derived state once a minute so the banner transitions
  // crisply across midnight without a page reload.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const visible = useMemo(() => isBannerVisible(now), [now]);
  const currentDay = useMemo(() => getCurrentDay(user, now), [user, now]);
  const isFounder = !!user?.founding_member;

  if (!visible || dismissed) return null;

  // Banner state machine
  // -------------------------------------------------------------
  let eyebrow;
  let headline;
  let body;
  if (currentDay === -1) {
    const d = daysUntilStart(now);
    eyebrow = 'Coming August 10';
    headline = 'The 7-Day Awakening';
    body =
      d === 1
        ? 'Begins tomorrow — five coaches, seven days, one transformation.'
        : `Begins in ${d} days — five coaches, seven days, one transformation.`;
  } else if (currentDay === 0) {
    eyebrow = 'Founding Member · Day 0';
    headline = 'Your early access is open.';
    body = "Tomorrow we begin. Today, Gideon has a welcome waiting for you.";
  } else if (currentDay >= 1 && currentDay <= 7) {
    const today = AWAKENING_DAYS[currentDay - 1];
    eyebrow = `Day ${currentDay} of 7`;
    headline = today.title;
    body = `${today.coach} · ${today.practice}`;
  } else {
    // Should not render (visible=false above), but defensive default
    return null;
  }

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {}
    setDismissed(true);
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
          to="/Awakening"
          className="block relative overflow-hidden rounded-3xl p-5 shadow-sm dark:shadow-none"
          style={{
            background:
              'linear-gradient(135deg, #2A3A3F 0%, #1B262A 60%, #2A3A3F 100%)',
          }}
          aria-label="Open The 7-Day Awakening"
        >
          {/* Warm dawn glow */}
          <div
            className="pointer-events-none absolute -bottom-12 -right-8 w-48 h-48 rounded-full opacity-40"
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
            aria-label="Dismiss banner"
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FAD98D]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAD98D] font-semibold">
                {eyebrow}
              </span>
              {isFounder && <FoundingMemberBadge variant="pill" />}
            </div>

            <h3
              className="text-white font-serif italic text-xl leading-tight mb-1"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {headline}
            </h3>
            <p className="text-white/70 text-sm pr-6">{body}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 text-[#FAD98D] text-xs tracking-wider font-medium">
              <span>Tap to enter</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
