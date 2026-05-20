/**
 * The 7-Day Awakening — event landing page.
 *
 * URL: /Awakening (auto-registered via pages.config.js)
 * Deep link target from App Store In-App Event card.
 *
 * Behavior:
 *   - Pre-event (before July 7): countdown hero + locked day cards.
 *   - Founding Members on July 6: Day 0 unlock with welcome from Gideon.
 *   - During event (July 7-13): today's card highlighted, prior days
 *     marked complete, future days locked.
 *   - Post-event: completion summary + invitation to revisit any day.
 *
 * Progress is stored on the User entity as `awakening_progress: Array<Int>`.
 * Completing all 7 days triggers the Day 7 Founders Blessing state for
 * Founding Members (lifetime founding pricing lock-in per landing page).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getFirstName } from '@/lib/userName';
import {
  AWAKENING_DAYS,
  EVENT_START,
  EVENT_END,
  daysUntilStart,
  getCurrentDay,
  isAwakeningComplete,
} from '@/lib/awakeningEvent';
import FoundingMemberBadge from '@/components/awakening/FoundingMemberBadge';
import { toast } from 'sonner';

// Avatar imports — these files already exist in src/assets per the
// project's existing Home page conventions.
import gideonImg from '@/assets/gideon-avatar.png';
import hannahImg from '@/assets/hannah-avatar.png';
import coachDavidImg from '@/assets/coach-david-avatar.png';
import chefDanielImg from '@/assets/chef-daniel-avatar.png';
import coachPaulImg from '@/assets/coach-paul-avatar.png';
import allCoachesImg from '@/assets/all-coaches-avatar.png';

const AVATAR_MAP = {
  Gideon: gideonImg,
  Hannah: hannahImg,
  'Coach David': coachDavidImg,
  'Chef Daniel': chefDanielImg,
  'Coach Paul': coachPaulImg,
};

// ── Started-day localStorage helpers ──────────────────────────────────────
// "Started" means the user tapped a day's CTA but hasn't yet self-attested
// completion. Lives in localStorage (not on the User entity) because it's
// a transient client-side concept — if a user reinstalls or switches devices
// mid-week, they just see all unlocked days as Begin/Revisit, which is fine.
const STARTED_KEY = 'awakening_started_days';

function getStartedDays() {
  try {
    const raw = localStorage.getItem(STARTED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(n => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

function addStartedDay(dayNumber) {
  try {
    const current = getStartedDays();
    if (current.includes(dayNumber)) return;
    localStorage.setItem(STARTED_KEY, JSON.stringify([...current, dayNumber]));
  } catch {}
}

function removeStartedDay(dayNumber) {
  try {
    const current = getStartedDays();
    localStorage.setItem(STARTED_KEY, JSON.stringify(current.filter(n => n !== dayNumber)));
  } catch {}
}

export default function Awakening() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [now, setNow] = useState(new Date());
  const [saving, setSaving] = useState(false);
  // started: array of day numbers user has tapped into but not yet completed
  const [started, setStarted] = useState(() => getStartedDays());

  // Re-fetch user to make sure awakening_progress and founding_member are
  // fresh (AuthContext may cache an older snapshot).
  useEffect(() => {
    let cancelled = false;
    base44.auth
      .me()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Tick clock every minute so day transitions reflect crisply.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const currentDay = useMemo(() => getCurrentDay(user, now), [user, now]);
  const progress = user?.awakening_progress || [];
  const isFounder = !!user?.founding_member;
  const complete = useMemo(() => isAwakeningComplete(user), [user]);
  const firstName = getFirstName(user);

  // markComplete: the user has self-attested they completed the day.
  // Called from the "I completed this day" button on a started day card,
  // not automatically on navigation.
  const markComplete = async (dayNumber) => {
    if (!user || progress.includes(dayNumber) || saving) return;
    const next = [...progress, dayNumber].sort((a, b) => a - b);
    // Optimistic update
    setUser({ ...user, awakening_progress: next });
    // Day is no longer "in progress" — it's complete.
    removeStartedDay(dayNumber);
    setStarted(getStartedDays());
    setSaving(true);
    try {
      await base44.auth.updateMe({ awakening_progress: next });
      toast.success(`Day ${dayNumber} complete. Grace meets you here.`);
      // If this completion finished the week and the user is a founder,
      // mark founding price as locked. Field is reserved server-side.
      if (
        next.length === 7 &&
        isFounder &&
        !user.founding_pricing_locked
      ) {
        try {
          await base44.auth.updateMe({ founding_pricing_locked: true });
          setUser((u) => ({ ...u, founding_pricing_locked: true }));
        } catch {
          // Non-fatal — the badge still shows; backend reconciles later.
        }
      }
    } catch (e) {
      // Rollback on failure
      setUser((u) => ({ ...u, awakening_progress: progress }));
      // Restore the "started" state so they can try completion again.
      addStartedDay(dayNumber);
      setStarted(getStartedDays());
      toast.error('Could not save your progress. Try again in a moment.');
      console.error('Failed to save awakening progress', e);
    } finally {
      setSaving(false);
    }
  };

  // handleDayCta: user tapped into a day's practice. Mark "started" (NOT
  // complete) so we know to show the completion button when they return.
  // Then navigate to the underlying practice page.
  const handleDayCta = (dayConfig) => {
    if (!progress.includes(dayConfig.day)) {
      addStartedDay(dayConfig.day);
      setStarted(getStartedDays());
    }
    navigate(dayConfig.route);
  };

  // Re-read started state when the page becomes visible again (user
  // returns from the practice page). Page visibility API fires on tab
  // changes and on iOS when the app comes back from background.
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') {
        setStarted(getStartedDays());
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        background:
          'radial-gradient(ellipse at 50% 85%, rgba(253,156,45,0.22) 0%, rgba(42,58,63,0) 60%), linear-gradient(180deg, #1B262A 0%, #2A3A3F 100%)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/70 text-xs tracking-widest hover:text-white transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>
        <div className="text-white/50 text-[10px] tracking-[0.3em]">
          JUL 7 — 13
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-6 pb-10 text-center">
        <div className="text-[#FAD98D]/80 italic text-xs tracking-[0.4em] mb-3">
          — VII —
        </div>
        <h1
          className="font-serif italic text-white"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(44px, 11vw, 80px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          The Awakening
        </h1>
        <p className="mt-4 text-white/75 tracking-[0.25em] text-[11px] uppercase">
          A Seven-Day Journey
        </p>

        {isFounder && (
          <div className="mt-5 flex justify-center">
            <FoundingMemberBadge variant="pill" />
          </div>
        )}

        {/* State-dependent subheading */}
        {currentDay === -1 && (
          <div className="mt-7 inline-flex items-baseline gap-3 px-5 py-3 rounded-full border border-white/25">
            <span className="text-3xl font-serif">{daysUntilStart(now)}</span>
            <span className="text-white/70 text-[11px] tracking-widest uppercase">
              {daysUntilStart(now) === 1
                ? 'day until we begin'
                : 'days until we begin'}
            </span>
          </div>
        )}

        {currentDay === 0 && (
          <div className="mt-7 max-w-md mx-auto px-4">
            <p className="text-white/85 italic">
              {firstName !== 'friend'
                ? `${firstName}, you're in early.`
                : 'You\'re in early.'}{' '}
              Tomorrow we begin together.
            </p>
            <p className="mt-2 text-[#FAD98D]/80 text-sm">
              Gideon has a Day 0 welcome waiting for you below.
            </p>
          </div>
        )}

        {currentDay >= 1 && currentDay <= 7 && !complete && (
          <p className="mt-7 text-white/85">
            {firstName !== 'friend' && (
              <span className="text-[#FD9C2D] font-serif italic">
                {firstName},{' '}
              </span>
            )}
            you are on <span className="font-semibold">Day {currentDay}</span>{' '}
            of 7.
          </p>
        )}

        {complete && (
          <div className="mt-7 max-w-md mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FAD98D]/40 bg-[#FAD98D]/5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FAD98D]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAD98D] font-semibold">
                Awakening complete
              </span>
            </div>
            <p className="text-white text-lg font-serif italic leading-snug mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              {firstName !== 'friend' ? `${firstName}, you showed up.` : 'You showed up.'}
            </p>
            <p className="text-white/75 text-sm leading-relaxed mb-4">
              Seven days. Five coaches. Your spirit, your body, your mind — all in the same week. That's not small. Carry this forward.
            </p>
            {isFounder && (
              <div className="mt-4 p-4 rounded-2xl border border-[#FAD98D]/30 bg-gradient-to-br from-[#FAD98D]/10 to-transparent">
                <p className="text-[#FAD98D] text-xs font-bold uppercase tracking-widest mb-1">
                  Founding Member · Locked in
                </p>
                <p className="text-white/85 text-sm">
                  Founding pricing is yours for life. The Revived 500 are now 500.
                </p>
              </div>
            )}
            <p className="mt-5 text-white/55 text-xs italic leading-relaxed">
              "He who began a good work in you will carry it on to completion." — Philippians 1:6
            </p>
          </div>
        )}

        {currentDay === 8 && !complete && (
          <div className="mt-7 max-w-md mx-auto">
            <p className="text-white/85 font-serif italic text-lg leading-snug mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              The week has passed.
            </p>
            <p className="text-white/70 text-sm leading-relaxed mb-3">
              {progress.length === 0
                ? "You watched from the edge this time. That's okay — grace doesn't keep score. Every day is still open below if you want to walk it now."
                : `You showed up for ${progress.length} ${progress.length === 1 ? 'day' : 'days'}. That counts. Pick up any of the others below whenever you're ready.`}
            </p>
            <p className="mt-4 text-white/45 text-xs italic">
              "He who began a good work in you will carry it on to completion." — Philippians 1:6
            </p>
          </div>
        )}
      </section>

      {/* Progress dots */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {AWAKENING_DAYS.map((d) => {
            const done = progress.includes(d.day);
            const isToday = d.day === currentDay;
            return (
              <div key={d.day} className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    'w-9 h-9 rounded-full flex items-center justify-center text-xs font-serif transition-all',
                    done
                      ? 'bg-[#FD9C2D] text-[#2A3A3F]'
                      : isToday
                        ? 'border-2 border-[#FD9C2D] text-[#FD9C2D]'
                        : 'border border-white/25 text-white/45',
                  ].join(' ')}
                  aria-label={`Day ${d.day}${done ? ' complete' : isToday ? ' (today)' : ''}`}
                >
                  {done ? <Check className="w-4 h-4" /> : d.day}
                </div>
                <span className="text-[9px] tracking-widest text-white/35">
                  {d.label.split(' ')[1]}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Day cards */}
      <section className="px-5 pb-24 max-w-xl mx-auto space-y-3">
        {/* Founder-only Day 0 welcome card. Appears only on July 6 (currentDay===0)
            when user is a Founding Member. Fulfills the hero copy promise that
            "Gideon has a Day 0 welcome waiting for you below." Routes to /Bible
            so they can open a real conversation with Gideon. */}
        {currentDay === 0 && isFounder && (
          <motion.article
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-[#FAD98D]/40 p-4 transition-all"
            style={{
              background:
                'linear-gradient(135deg, rgba(250,217,141,0.10) 0%, rgba(253,156,45,0.06) 100%)',
            }}
          >
            <div
              className="pointer-events-none absolute -top-12 -right-8 w-40 h-40 rounded-full opacity-30"
              style={{
                background:
                  'radial-gradient(circle, #FD9C2D 0%, rgba(253,156,45,0) 65%)',
              }}
              aria-hidden="true"
            />
            <div className="relative flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/5 border-2 border-[#FAD98D]">
                  <img
                    src={gideonImg}
                    alt="Gideon"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] text-[#FAD98D] mb-1 flex-wrap">
                  <span>DAY 0</span>
                  <span>·</span>
                  <span>FOUNDING MEMBER</span>
                  <span>·</span>
                  <span>GIDEON</span>
                </div>
                <h3
                  className="font-serif text-white text-lg mb-1 leading-tight"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Welcome, founder.
                </h3>
                <p className="text-white/75 text-[13px] leading-relaxed mb-3">
                  {firstName !== 'friend' ? `${firstName}, you're` : "You're"} part of the first 500 walking this with us. Open a conversation with Gideon today — whatever's on your heart as we begin tomorrow. He's been waiting.
                </p>
                <button
                  onClick={() => navigate('/Bible')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors bg-[#FAD98D] text-[#2A3A3F] hover:bg-[#FD9C2D] hover:text-white"
                >
                  <span>Talk with Gideon</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <Sparkles className="w-4 h-4 text-[#FAD98D]" />
              </div>
            </div>
          </motion.article>
        )}

        {/* Missed-a-day grace message — only shown if user has at least one
            past day still incomplete (e.g., today is Day 4 but Days 2 or 3
            were skipped). Frames the catch-up in the Prosperity Revived
            grace voice rather than as a checkmark guilt-trip. */}
        {currentDay >= 2 && currentDay <= 7 && (() => {
          const missed = [];
          for (let d = 1; d < currentDay; d++) {
            if (!progress.includes(d)) missed.push(d);
          }
          if (missed.length === 0) return null;
          return (
            <div className="mb-2 rounded-2xl border border-[#FAD98D]/30 bg-[#FAD98D]/5 p-4">
              <p className="text-[#FAD98D] text-sm font-serif italic mb-1">
                {missed.length === 1
                  ? `You missed Day ${missed[0]}.`
                  : `You missed ${missed.length} days.`}
              </p>
              <p className="text-white/70 text-xs leading-relaxed">
                That's okay. Grace meets you here. Pick up where you can — no day is locked once today has arrived.
              </p>
            </div>
          );
        })()}
        {AWAKENING_DAYS.map((d, idx) => {
          const done = progress.includes(d.day);
          const inProgress = started.includes(d.day);
          const isToday = d.day === currentDay;
          // Unlocked if event is over OR day has arrived
          const isUnlocked = currentDay === 8 || d.day <= currentDay;
          return (
            <DayCard
              key={d.day}
              day={d}
              done={done}
              inProgress={inProgress}
              isToday={isToday}
              isUnlocked={isUnlocked}
              saving={saving}
              onBegin={() => handleDayCta(d)}
              onMarkComplete={() => markComplete(d.day)}
              animationDelay={idx * 0.04}
            />
          );
        })}

        {/* Footer mark */}
        <div className="pt-8 pb-4 text-center text-white/35 text-[10px] tracking-[0.3em]">
          PROSPERITY REVIVED · JULY 2026
        </div>
      </section>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function DayCard({ day, done, inProgress, isToday, isUnlocked, saving, onBegin, onMarkComplete, animationDelay }) {
  const avatarSrc = day.coach !== 'All Five' ? AVATAR_MAP[day.coach] : null;

  // Determine which CTA pattern to render:
  //  done            → "Revisit" link only (already completed)
  //  inProgress      → "I completed this day" primary + "Open again" secondary
  //  isUnlocked      → "Begin" primary CTA
  //  else            → locked notice
  let ctaBlock;
  if (!isUnlocked) {
    ctaBlock = (
      <div className="inline-flex items-center gap-1.5 text-white/40 text-[10px] tracking-widest uppercase">
        <Lock className="w-3 h-3" />
        <span>Unlocks {day.label}</span>
      </div>
    );
  } else if (done) {
    ctaBlock = (
      <button
        onClick={onBegin}
        disabled={saving}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/25 text-white/75 hover:bg-white/5 transition-colors"
      >
        <span>Revisit</span>
        <span aria-hidden="true">→</span>
      </button>
    );
  } else if (inProgress) {
    ctaBlock = (
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onMarkComplete}
          disabled={saving}
          className={[
            'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors',
            'bg-[#FD9C2D] text-[#2A3A3F] hover:bg-[#FAD98D]',
            saving && 'opacity-70 cursor-wait',
          ].join(' ')}
        >
          <Check className="w-3.5 h-3.5" />
          <span>I completed this day</span>
        </button>
        <button
          onClick={onBegin}
          disabled={saving}
          className="inline-flex items-center gap-1 text-white/60 text-[11px] hover:text-white/85 transition-colors underline-offset-2 hover:underline"
        >
          <span>Open again</span>
        </button>
      </div>
    );
  } else {
    ctaBlock = (
      <button
        onClick={onBegin}
        disabled={saving}
        className={[
          'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors',
          'bg-[#FD9C2D] text-[#2A3A3F] hover:bg-[#FAD98D]',
          saving && 'opacity-70 cursor-wait',
        ].join(' ')}
      >
        <span>{day.cta}</span>
        <span aria-hidden="true">→</span>
      </button>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      className={[
        'relative overflow-hidden rounded-2xl border p-4 transition-all',
        isToday
          ? 'border-[#FD9C2D]/60 bg-white/[0.04] shadow-[0_0_40px_-12px_rgba(253,156,45,0.4)]'
          : inProgress
            ? 'border-[#FAD98D]/40 bg-white/[0.03]'
            : 'border-white/12 bg-white/[0.02]',
        !isUnlocked && 'opacity-55',
      ].join(' ')}
    >
      {/* "Today" accent wash */}
      {isToday && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#FD9C2D]/15 to-transparent"
          aria-hidden="true"
        />
      )}

      <div className="relative flex items-start gap-3">
        {/* Avatar or all-five row */}
        <div className="flex-shrink-0">
          {avatarSrc ? (
            <div
              className={[
                'w-14 h-14 rounded-full overflow-hidden bg-white/5 border-2',
                isToday ? 'border-[#FD9C2D]' : done ? 'border-[#FD9C2D]/60' : inProgress ? 'border-[#FAD98D]/60' : 'border-white/15',
              ].join(' ')}
            >
              <img
                src={avatarSrc}
                alt={day.coach}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            // Day 7: a single composite of all five coaches together, framed
            // identically to other day avatars. Replaces an earlier 5-mini-
            // avatars grid that read as cluttered and had an empty cell.
            <div
              className={[
                'w-14 h-14 rounded-full overflow-hidden bg-white/5 border-2',
                isToday ? 'border-[#FD9C2D]' : done ? 'border-[#FD9C2D]/60' : inProgress ? 'border-[#FAD98D]/60' : 'border-white/15',
              ].join(' ')}
            >
              <img
                src={allCoachesImg}
                alt="All five coaches"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] text-white/45 mb-1 flex-wrap">
            <span>DAY {day.day}</span>
            <span>·</span>
            <span>{day.label.toUpperCase()}</span>
            <span>·</span>
            <span>{day.coach.toUpperCase()}</span>
            {inProgress && !done && (
              <>
                <span>·</span>
                <span className="text-[#FAD98D]">IN PROGRESS</span>
              </>
            )}
          </div>
          <h3
            className="font-serif text-white text-lg mb-1 leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {day.title}
          </h3>
          <p className="text-white/70 text-[13px] leading-relaxed mb-3">
            {day.description}
          </p>

          {ctaBlock}
        </div>

        {/* Completion checkmark in corner */}
        {done && !isToday && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FD9C2D] flex items-center justify-center"
            aria-hidden="true"
          >
            <Check className="w-3.5 h-3.5 text-[#2A3A3F]" />
          </div>
        )}

        {/* Today sparkle */}
        {isToday && (
          <div className="absolute top-2 right-2">
            <Sparkles className="w-4 h-4 text-[#FAD98D]" />
          </div>
        )}
      </div>
    </motion.article>
  );
}
