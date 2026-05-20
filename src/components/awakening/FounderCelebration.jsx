/**
 * FounderCelebration — one-time celebration shown when a user has just been
 * granted Founding Member status via the claimFoundingMember backend function
 * (called at end of onboarding).
 *
 * Renders ONLY when localStorage has `founder_celebration_pending` set with
 * shownAt === null. After being shown once, marks shownAt and won't re-render
 * even across reloads.
 *
 * Auto-dismisses after the user taps either CTA or the close button.
 * Brief, meaningful, not naggy. The brand voice is grace, not gamification —
 * so the copy is welcoming, not boastful.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import FoundingMemberBadge from '@/components/awakening/FoundingMemberBadge';

const STORAGE_KEY = 'founder_celebration_pending';

function readPending() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.shownAt) return null; // already shown
    return parsed;
  } catch {
    return null;
  }
}

function markShown(payload) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...payload, shownAt: new Date().toISOString() })
    );
  } catch {}
}

function clearPending() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function FounderCelebration() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(null);
  const [visible, setVisible] = useState(false);

  // Read once on mount. Don't re-poll — this is a one-time UI event.
  useEffect(() => {
    const p = readPending();
    if (p) {
      setPending(p);
      // Delay slightly so the page settles before the celebration rises.
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  if (!pending) return null;

  // When the celebration dismisses, fire the post-onboarding guided tour
  // — UNLESS already shown. Layout.jsx deferred the tour because we were
  // pending; now that we've been seen, the tour can take its turn.
  const launchTourIfNeeded = () => {
    try {
      if (!localStorage.getItem('full_tour_shown')) {
        // Small delay so our exit animation finishes before the tour
        // pops up. Mark shown immediately to prevent double-fire.
        localStorage.setItem('full_tour_shown', '1');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('launchGuidedTour'));
        }, 500);
      }
    } catch {
      // Best-effort. If localStorage is blocked the tour just won't fire.
    }
  };

  const handleViewAwakening = () => {
    markShown(pending);
    setVisible(false);
    // User chose Awakening — they're leaving Home, so skip the home tour
    // for now. Mark shown so it doesn't fire when they come back, but
    // skip dispatching the event since they aren't on Home anyway.
    try { localStorage.setItem('full_tour_shown', '1'); } catch {}
    navigate('/Awakening');
  };

  const handleClose = () => {
    markShown(pending);
    setVisible(false);
    // Defer clearing so the exit animation has time to play
    setTimeout(clearPending, 600);
    // Fire the deferred home tour
    launchTourIfNeeded();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={handleClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md mx-0 sm:mx-4 overflow-hidden rounded-t-3xl sm:rounded-3xl text-center"
            style={{
              background:
                'linear-gradient(160deg, #2A3A3F 0%, #1B262A 55%, #2A3A3F 100%)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            {/* Sunrise glow */}
            <div
              className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-50"
              style={{
                background:
                  'radial-gradient(circle, rgba(250,217,141,0.6) 0%, rgba(253,156,45,0.15) 40%, rgba(253,156,45,0) 70%)',
              }}
              aria-hidden="true"
            />

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative px-8 pt-12 pb-8">
              {/* Large seal */}
              <div className="flex justify-center mb-5">
                <FoundingMemberBadge variant="seal" />
              </div>

              {/* Eyebrow */}
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#FAD98D] font-semibold mb-3">
                Welcome to the
              </p>

              {/* Headline */}
              <h2
                className="text-white font-serif italic text-3xl leading-tight mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Revived 500.
              </h2>

              {/* Body */}
              <p className="text-white/80 text-sm leading-relaxed mb-2 max-w-sm mx-auto">
                You're one of the first to walk this with us. Your founding status is yours for life — no performance, no renewal, no fine print.
              </p>

              {/* Verse */}
              <p className="text-white/50 italic text-xs mt-6 mb-7 max-w-xs mx-auto leading-relaxed">
                "He who began a good work in you will carry it on to completion." — Philippians 1:6
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={handleViewAwakening}
                  className="w-full bg-[#FD9C2D] hover:bg-[#e88d1f] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors min-h-[52px]"
                >
                  See The Awakening
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-center text-sm text-white/55 hover:text-white/85 py-2.5 transition-colors"
                >
                  Continue to the app
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
