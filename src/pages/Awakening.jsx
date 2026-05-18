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

const AVATAR_MAP = {
  Gideon: gideonImg,
  Hannah: hannahImg,
  'Coach David': coachDavidImg,
  'Chef Daniel': chefDanielImg,
  'Coach Paul': coachPaulImg,
};

export default function Awakening() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [now, setNow] = useState(new Date());
  const [saving, setSaving] = useState(false);

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

  const markComplete = async (dayNumber) => {
    if (!user || progress.includes(dayNumber) || saving) return;
    const next = [...progress, dayNumber].sort((a, b) => a - b);
    // Optimistic update
    setUser({ ...user, awakening_progress: next });
    setSaving(true);
    try {
      await base44.auth.updateMe({ awakening_progress: next });
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
      toast.error('Could not save your progress. Try again in a moment.');
      console.error('Failed to save awakening progress', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDayCta = (dayConfig) => {
    markComplete(dayConfig.day); // optimistic — they have begun
    navigate(dayConfig.route);
  };

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
            <p className="text-white/90 italic">
              The Awakening is complete. Your journey continues.
            </p>
            {isFounder && (
              <p className="mt-2 text-[#FAD98D] text-sm">
                Founding pricing is yours for life.
              </p>
            )}
          </div>
        )}

        {currentDay === 8 && !complete && (
          <p className="mt-7 text-white/75 italic">
            The Awakening has ended. Revisit any day below.
          </p>
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
        {AWAKENING_DAYS.map((d, idx) => {
          const done = progress.includes(d.day);
          const isToday = d.day === currentDay;
          // Unlocked if event is over OR day has arrived
          const isUnlocked = currentDay === 8 || d.day <= currentDay;
          return (
            <DayCard
              key={d.day}
              day={d}
              done={done}
              isToday={isToday}
              isUnlocked={isUnlocked}
              saving={saving}
              onBegin={() => handleDayCta(d)}
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
function DayCard({ day, done, isToday, isUnlocked, saving, onBegin, animationDelay }) {
  const avatarSrc = day.coach !== 'All Five' ? AVATAR_MAP[day.coach] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      className={[
        'relative overflow-hidden rounded-2xl border p-4 transition-all',
        isToday
          ? 'border-[#FD9C2D]/60 bg-white/[0.04] shadow-[0_0_40px_-12px_rgba(253,156,45,0.4)]'
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
                isToday ? 'border-[#FD9C2D]' : done ? 'border-[#FD9C2D]/60' : 'border-white/15',
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
            // Day 7: five mini avatars
            <div className="w-14 h-14 rounded-full relative bg-white/5 border-2 border-[#FD9C2D]/60 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-0.5 w-11 h-11">
                {[gideonImg, hannahImg, coachPaulImg, coachDavidImg, chefDanielImg].map((src, i) => (
                  <div key={i} className="rounded-full overflow-hidden w-3.5 h-3.5">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
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

          {isUnlocked ? (
            <button
              onClick={onBegin}
              disabled={saving}
              className={[
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors',
                done
                  ? 'border border-white/25 text-white/75 hover:bg-white/5'
                  : 'bg-[#FD9C2D] text-[#2A3A3F] hover:bg-[#FAD98D]',
                saving && 'opacity-70 cursor-wait',
              ].join(' ')}
            >
              <span>{done ? 'Revisit' : day.cta}</span>
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-white/40 text-[10px] tracking-widest uppercase">
              <Lock className="w-3 h-3" />
              <span>Unlocks {day.label}</span>
            </div>
          )}
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
