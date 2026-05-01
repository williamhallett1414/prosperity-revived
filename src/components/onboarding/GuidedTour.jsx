import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { X, ChevronRight, Lightbulb, Hand } from 'lucide-react';

// ── Step definitions ──────────────────────────────────────────────────────────
export const TOUR_STEPS = [
  {
    id: 'intro',
    targetId: null,
    title: "Welcome to Prosperity Revived! 🎉",
    body: "You're all set up! Let me give you a quick tour of everything — your AI coaches, workouts, Bible study, and more. Takes about 2 minutes, or skip anytime.",
    tip: null,
    tapToAdvance: false,
    navigateTo: 'Home',
    showArrow: false,
  },
  {
    id: 'home_ritual',
    targetId: 'tour-ritual-btn',
    title: 'Start Your Day 🌅',
    body: 'Every morning, tap this button to begin your daily ritual — scripture reading, a personal affirmation, and your intention for the day.',
    tip: "At night it becomes 'End My Day' — gratitude, reflection & rest",
    tapToAdvance: true,
    navigateTo: null,
    showArrow: true,
    tapLabel: 'Tap to experience it',
  },
  {
    id: 'home_verse',
    targetId: 'tour-verse-card',
    title: 'Your Daily Scripture 📖',
    body: "Each day you get a personalized verse based on your faith profile. Tap 'Read →' to open the full passage in the Bible reader.",
    tip: null,
    tapToAdvance: false,
    navigateTo: null,
    showArrow: true,
  },
  {
    id: 'nav_wellness',
    targetId: 'nav-wellness',
    title: 'Wellness Hub 💪',
    body: 'Tap the Wellness tab below to explore your full fitness, nutrition, and health toolkit.',
    tip: null,
    tapToAdvance: true,
    navigateTo: 'Wellness',
    showArrow: true,
    tapLabel: 'Tap to open Wellness',
    arrowDown: true,
  },
  {
    id: 'wellness_workouts',
    targetId: 'tour-workouts-card',
    title: '33+ Guided Workouts 🏋️',
    body: 'Tap Workouts to browse sessions by category and start training. Coach David has already built a plan based on your fitness profile.',
    tip: 'HIIT · Strength · Cardio · Flexibility · Yoga · Recovery',
    tapToAdvance: true,
    navigateTo: 'Workouts',
    showArrow: true,
    tapLabel: 'Tap to open Workouts',
  },
  {
    id: 'workouts_quickstart',
    targetId: 'tour-quick-start',
    title: 'Start in 1 Tap ⚡',
    body: 'These workouts are ready to go right now. Tap any card to log a completed session — it automatically tracks in your Workout Trends.',
    tip: null,
    tapToAdvance: false,
    navigateTo: null,
    showArrow: true,
  },
  {
    id: 'workouts_categories',
    targetId: 'tour-categories',
    title: 'Browse by Category 📋',
    body: 'Filter workouts by type. Tap any category to see its full library, with difficulty filters built in.',
    tip: null,
    tapToAdvance: false,
    navigateTo: null,
    showArrow: true,
  },
  {
    id: 'nav_bible',
    targetId: 'nav-bible',
    title: 'Bible Study 📖',
    body: 'Tap the Bible tab to open your study companion — full reader, study guides, and daily devotionals.',
    tip: null,
    tapToAdvance: true,
    navigateTo: 'Bible',
    showArrow: true,
    tapLabel: 'Tap to open Bible',
    arrowDown: true,
  },
  {
    id: 'bible_tabs',
    targetId: 'tour-bible-tabs',
    title: 'Three Ways to Study',
    body: 'Read opens the full 66-book Bible. Study gives topical guides on anxiety, purpose, relationships & more. Devotional gives daily meditations.',
    tip: 'Your devotional depth preference from setup is already saved',
    tapToAdvance: false,
    navigateTo: null,
    showArrow: true,
  },
  {
    id: 'bible_gideon',
    targetId: 'tour-gideon-btn',
    title: 'Chat with Gideon 🙏',
    body: "This floating button opens Gideon, your AI spiritual guide. Ask him anything — scripture questions, prayer requests, or a word of encouragement.",
    tip: 'Gideon remembers your faith profile and previous conversations',
    tapToAdvance: false,
    navigateTo: null,
    showArrow: true,
  },
  {
    id: 'home_guides',
    targetId: null,
    title: 'Your AI Coaching Team \u{1F916}',
    body: "You have 5 AI coaches with video avatars who learn about you over time. Gideon for Scripture, Hannah for mindset, Coach David for fitness, Chef Daniel for nutrition, and Coach Paul for life wisdom.",
    tip: 'Each coach remembers your conversations and shares insights with the others',
    tapToAdvance: false,
    navigateTo: 'Home',
    showArrow: false,
  },
  {
    id: 'nav_community',
    targetId: 'nav-community',
    title: 'Community \u{1F91D}',
    body: 'Connect with others on the same journey. Share milestones, join groups, take on challenges like the 40 Days in the Wilderness, and find accountability partners.',
    tip: null,
    tapToAdvance: true,
    navigateTo: 'Community',
    showArrow: true,
    tapLabel: 'Tap to open Community',
    arrowDown: true,
  },
  {
    id: 'community_features',
    targetId: 'tour-community-groups',
    title: 'Groups & Challenges \u{1F3C6}',
    body: 'Join Bible study groups, workout crews, or prayer circles. Take on spiritual challenges that push your faith to the next level.',
    tip: 'Try the 40 Days in the Wilderness \u2014 our most intense spiritual challenge',
    tapToAdvance: false,
    navigateTo: null,
    showArrow: true,
  },
  {
    id: 'nav_profile',
    targetId: 'nav-profile',
    title: 'Your Profile \u{1F464}',
    body: 'Track your progress, view achievements, and manage your account. Everything you do in the app earns XP toward your journey.',
    tip: null,
    tapToAdvance: true,
    navigateTo: 'Profile',
    showArrow: true,
    tapLabel: 'Tap to open Profile',
    arrowDown: true,
  },
  {
    id: 'done',
    targetId: null,
    title: "You're ready to go! \u{1F680}",
    body: "Your 5 AI coaches learn and adapt to you over time. The more you use the app, the more personalized your experience becomes. Start with your daily ritual or chat with one of your guides!",
    tip: 'Need help anytime? Tap the \u2753 button on the Home page for a guided tour of any feature',
    tapToAdvance: false,
    navigateTo: 'Home',
    showArrow: false,
    isDone: true,
  },
];

// ── Pulsing ring animation ─────────────────────────────────────────────────────
const RING_STYLE = `
  @keyframes tour-ring {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(253, 156, 45, 0.5); }
    50% { opacity: 0.85; box-shadow: 0 0 0 8px rgba(253, 156, 45, 0); }
  }
  @keyframes tour-tap-hint {
    0%, 100% { transform: scale(1) translateY(0); opacity: 0.9; }
    40% { transform: scale(0.92) translateY(2px); opacity: 1; }
  }
`;

// ── Spotlight SVG mask ─────────────────────────────────────────────────────────
function SpotlightMask({ rect, borderRadius = 16 }) {
  if (!rect) return <div className="fixed inset-0 bg-black/75" style={{ zIndex: 60 }} />;
  const pad = 6;
  const x = rect.left - pad;
  const y = rect.top - pad;
  const w = rect.width + pad * 2;
  const h = rect.height + pad * 2;
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 60 }}>
      <defs>
        <mask id="tour-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect x={x} y={y} width={w} height={h} rx={borderRadius} fill="black" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.78)" mask="url(#tour-mask)" />
    </svg>
  );
}

// ── Tap interceptor + pulsing ring ─────────────────────────────────────────────
function TapTarget({ rect, onTap, tapLabel }) {
  if (!rect) return null;
  const pad = 6;
  return (
    <div
      onPointerDown={onTap}
      style={{
        position: 'fixed',
        left: rect.left - pad,
        top: rect.top - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
        borderRadius: 16,
        zIndex: 63,
        cursor: 'pointer',
        animation: 'tour-ring 2s ease-in-out infinite',
        border: '2.5px solid #FD9C2D',
        boxSizing: 'border-box',
      }}
    >
      {/* Tap hint */}
      {tapLabel && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            background: '#FD9C2D',
            color: '#0A1A2F',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            animation: 'tour-tap-hint 1.6s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        >
          <Hand style={{ width: 12, height: 12 }} />
          {tapLabel}
        </div>
      )}
    </div>
  );
}

// ── Info ring (no tap interception) ───────────────────────────────────────────
function InfoRing({ rect }) {
  if (!rect) return null;
  const pad = 6;
  return (
    <div
      style={{
        position: 'fixed',
        left: rect.left - pad,
        top: rect.top - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
        borderRadius: 16,
        zIndex: 62,
        border: '2px solid rgba(201, 162, 39, 0.9)',
        boxSizing: 'border-box',
        animation: 'tour-ring 2.5s ease-in-out infinite',
        pointerEvents: 'none',
      }}
    />
  );
}

// ── Connecting arrow between ring and tooltip ──────────────────────────────────
function ConnectArrow({ rect, arrowDown }) {
  if (!rect) return null;
  const centerX = rect.left + rect.width / 2;
  if (arrowDown) {
    // Arrow pointing down from bottom of element toward nav / bottom area
    return null; // handled by tooltip pointing up naturally
  }
  // Arrow pointing up from tooltip toward element
  return (
    <div
      style={{
        position: 'fixed',
        left: Math.min(Math.max(centerX - 6, 16), window.innerWidth - 28),
        top: rect.bottom + 8,
        width: 12,
        height: 12,
        zIndex: 65,
        pointerEvents: 'none',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M6 0 L12 12 L0 12 Z" fill="#0A1A2F" />
      </svg>
    </div>
  );
}

// ── Bottom tooltip card ────────────────────────────────────────────────────────
function TooltipCard({ step, current, total, onNext, onSkip, targetRect, isLastStep }) {
  const isNearBottom = targetRect && targetRect.top > window.innerHeight * 0.65;
  const centerX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth / 2;
  const arrowLeft = Math.min(Math.max(centerX - 10, 24), window.innerWidth - 44);

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: isNearBottom ? 'calc(env(safe-area-inset-bottom) + 88px)' : 'calc(env(safe-area-inset-bottom) + 16px)',
        zIndex: 66,
        padding: '0 12px',
      }}
    >
      {/* Arrow notch pointing up toward target (when target is above card) */}
      {targetRect && !isNearBottom && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: arrowLeft,
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '10px solid #0A1A2F',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Arrow notch pointing DOWN toward target (when target is nav bar below) */}
      {targetRect && isNearBottom && (
        <div
          style={{
            position: 'absolute',
            bottom: -8,
            left: arrowLeft,
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid #0A1A2F',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        className="max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: '#0A1A2F' }}
      >
        {/* Step dots + skip */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === step ? 20 : 5, opacity: i <= step ? 1 : 0.25 }}
                transition={{ duration: 0.25 }}
                className="h-1 rounded-full flex-shrink-0"
                style={{ background: '#FD9C2D' }}
              />
            ))}
          </div>
          <button
            onPointerDown={onSkip}
            className="text-white/40 text-xs hover:text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-5">
          <h3 className="text-white font-black text-[15px] leading-tight mb-1.5">
            {current.title}
          </h3>
          <p className="text-white/65 text-xs leading-relaxed mb-3">
            {current.body}
          </p>

          {/* Tip */}
          {current.tip && (
            <div className="flex items-start gap-2 bg-white/8 rounded-xl px-3 py-2.5 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-[#FAD98D] flex-shrink-0 mt-0.5" />
              <p className="text-white/55 text-[11px] leading-relaxed">{current.tip}</p>
            </div>
          )}

          {/* CTA */}
          {current.isDone ? (
            <div className="space-y-2">
              {[
                { icon: '📖', label: 'Open Bible', page: 'Bible' },
                { icon: '🏋️', label: 'Start a workout', page: 'Workouts' },
                { icon: '💬', label: 'Chat with Gideon', page: 'ChatScreen?bot=Gideon' },
              ].map((a) => (
                <button
                  key={a.page}
                  onPointerDown={() => {
                    onSkip();
                    setTimeout(() => { window.location.href = createPageUrl(a.page); }, 200);
                  }}
                  className="w-full flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 text-left active:scale-95 transition-transform"
                >
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-white text-sm font-semibold flex-1">{a.label}</span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </button>
              ))}
              <button onPointerDown={onSkip} className="w-full text-white/35 text-xs py-2">
                Explore on my own →
              </button>
            </div>
          ) : isLastStep ? (
            <button
              onPointerDown={onSkip}
              className="w-full h-11 rounded-2xl text-[#0A1A2F] dark:text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FAD98D, #FD9C2D)' }}
            >
              ✓ Done
            </button>
          ) : current.tapToAdvance ? (
            <p className="text-[#FD9C2D] text-xs font-bold text-center py-1">
              ↑ Tap the highlighted element above to continue
            </p>
          ) : (
            <button
              onPointerDown={onNext}
              className="w-full h-11 rounded-2xl text-[#0A1A2F] dark:text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FAD98D, #FD9C2D)' }}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function GuidedTour({ onComplete, customSteps, tourKey }) {
  const navigate = useNavigate();
  const [resolvedSteps, setResolvedSteps] = useState(customSteps || null);

  // If tourKey is provided, dynamically load MINI_TOURS to get steps
  useEffect(() => {
    if (tourKey && !customSteps) {
      import('@/components/home/HelpChatbot').then(mod => {
        const tours = mod.MINI_TOURS || {};
        if (tours[tourKey]) {
          setResolvedSteps(tours[tourKey]);
        }
      }).catch(() => {});
    }
  }, [tourKey, customSteps]);

  const steps = resolvedSteps || TOUR_STEPS;
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const rafRef = useRef(null);

  const current = steps[step];
  const total = steps.length;

  // ── Navigate to the current step's page if needed ─────────────────────────
  useEffect(() => {
    if (current?.navigateTo) {
      const targetUrl = createPageUrl(current.navigateTo);
      const currentPath = window.location.pathname + window.location.search;
      // Only navigate if we're not already on the right page
      if (!currentPath.includes(current.navigateTo)) {
        navigate(targetUrl);
      }
    }
  }, [step, current?.navigateTo, navigate]);

  // ── Measure target element (retry until found) ────────────────────────────
  useEffect(() => {
    setTargetRect(null);
    if (!current?.targetId) return;

    let attempts = 0;
    const measure = () => {
      const el = document.getElementById(current.targetId);
      if (el) {
        // Scroll element into view first
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Wait for scroll to settle then measure
        setTimeout(() => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
          }
        }, 350);
        return;
      }
      if (attempts++ < 30) {
        setTimeout(measure, 300);
      }
    };
    // Initial delay to allow page navigation + lazy load
    setTimeout(measure, 500);

    // Live-update on scroll / resize
    const update = () => {
      const el = document.getElementById(current.targetId);
      if (el) {
        const r = el.getBoundingClientRect();
        setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [step, current?.targetId]);

  // ── Advance step ──────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    if (step >= total - 1) {
      finish();
      return;
    }
    setStep(s => s + 1);
  }, [step, total]);

  // ── Handle tap on highlighted element ─────────────────────────────────────
  const handleTap = useCallback(() => {
    if (current.targetId && !current.navigateTo) {
      // Fire the underlying element's own click
      const el = document.getElementById(current.targetId);
      if (el) {
        const actualEl = el.tagName === 'A' || el.tagName === 'BUTTON' ? el : el.querySelector('a,button');
        if (actualEl) actualEl.click();
      }
    }
    // Advance to next step (useEffect will handle navigation)
    setTimeout(() => setStep(s => s + 1), current.navigateTo ? 100 : 0);
  }, [current, step]);

  const finish = async () => {
    // Only save completion flag for the full guided tour, not mini-tours
    if (!customSteps) {
      try { await base44.auth.updateMe({ guided_tour_completed: true }); } catch {}
    }
    onComplete();
  };

  return (
    <>
      <style>{RING_STYLE}</style>

      {/* Backdrop with spotlight cutout */}
      <SpotlightMask rect={targetRect} />

      {/* Ring around target */}
      {current.tapToAdvance
        ? <TapTarget rect={targetRect} onTap={handleTap} tapLabel={current.tapLabel} />
        : <InfoRing rect={targetRect} />
      }

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <TooltipCard
          key={step}
          step={step}
          current={current}
          total={total}
          onNext={advance}
          onSkip={finish}
          targetRect={targetRect}
          isLastStep={step === total - 1}
        />
      </AnimatePresence>
    </>
  );
}

