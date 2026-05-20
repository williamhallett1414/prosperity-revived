/**
 * Your First Week — the permanent 7-day welcome experience.
 *
 * URL: /FirstWeek
 *
 * Different from /Awakening (the launch event):
 *   - Tied to each user's signup date, not a calendar date
 *   - Personalized by quiz answers (priorities, coaching_style)
 *   - Warm cream palette (vs Awakening's dark dawn palette) to signal
 *     "ongoing onboarding" rather than "special event"
 *
 * Progress lives on the User entity as `first_week_progress: Array<Int>`.
 * Started state lives in localStorage (transient, per-device).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getFirstName } from '@/lib/userName';
import {
  buildFirstWeekPlan,
  currentFirstWeekDay,
  daysSinceSignup,
} from '@/lib/firstWeekPlan';
import { toast } from 'sonner';

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

// localStorage-backed "started" state, identical pattern to Awakening but
// keyed separately so the two flows don't interfere.
const STARTED_KEY = 'first_week_started_days';

function getStartedDays() {
  try {
    const raw = localStorage.getItem(STARTED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => Number.isInteger(n)) : [];
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
    localStorage.setItem(STARTED_KEY, JSON.stringify(current.filter((n) => n !== dayNumber)));
  } catch {}
}

export default function FirstWeek() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [now, setNow] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(() => getStartedDays());

  // Fresh user fetch to ensure first_week_progress is current.
  useEffect(() => {
    let cancelled = false;
    base44.auth.me().then((u) => {
      if (!cancelled) setUser(u);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Clock tick for midnight day transitions
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Re-read started state when page becomes visible (user returns)
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') {
        setStarted(getStartedDays());
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const currentDay = useMemo(() => currentFirstWeekDay(user, now), [user, now]);
  const elapsed = useMemo(() => daysSinceSignup(user, now), [user, now]);
  const progress = user?.first_week_progress || [];
  const plan = useMemo(() => (user ? buildFirstWeekPlan(user) : []), [user]);
  const firstName = getFirstName(user);
  const complete = progress.length >= 7;

  const markComplete = async (dayNumber) => {
    if (!user || progress.includes(dayNumber) || saving) return;
    const next = [...progress, dayNumber].sort((a, b) => a - b);
    setUser({ ...user, first_week_progress: next });
    removeStartedDay(dayNumber);
    setStarted(getStartedDays());
    setSaving(true);
    try {
      await base44.auth.updateMe({ first_week_progress: next });
      toast.success(`Day ${dayNumber} complete.`);
    } catch (e) {
      setUser((u) => ({ ...u, first_week_progress: progress }));
      addStartedDay(dayNumber);
      setStarted(getStartedDays());
      toast.error('Could not save your progress. Try again in a moment.');
      console.error('Failed to save first_week_progress', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDayCta = (dayConfig) => {
    if (!progress.includes(dayConfig.day)) {
      addStartedDay(dayConfig.day);
      setStarted(getStartedDays());
    }
    navigate(dayConfig.route);
  };

  // If user has no signup date (unlikely but possible in dev), gracefully
  // show a non-time-bound view that just walks through the plan.
  const noSignupDate = !user?.created_date;

  return (
    <div
      className="min-h-screen text-[#2A3A3F] relative"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(250,217,141,0.45) 0%, rgba(251,246,236,0) 60%), linear-gradient(180deg, #FBF6EC 0%, #FFFFFF 100%)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#2A3A3F]/60 text-xs tracking-widest hover:text-[#2A3A3F] transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>
        <div className="text-[#2A3A3F]/45 text-[10px] tracking-[0.3em]">
          YOUR FIRST WEEK
        </div>
      </header>

      <section className="px-6 pt-6 pb-8 text-center">
        <div className="text-[#FD9C2D] italic text-xs tracking-[0.4em] mb-3">
          — VII —
        </div>
        <h1
          className="text-[#2A3A3F]"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(40px, 10vw, 68px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            fontStyle: 'italic',
          }}
        >
          Your First Week
        </h1>
        <p className="mt-4 text-[#2A3A3F]/60 tracking-[0.25em] text-[11px] uppercase">
          Seven days to settle in
        </p>

        {!noSignupDate && currentDay && !complete && (
          <p className="mt-7 text-[#2A3A3F]/85">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FD9C2D]/40 bg-[#FAD98D]/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FD9C2D]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#FD9C2D] font-semibold">
                Week one complete
              </span>
            </div>
            <p className="text-[#2A3A3F] text-lg font-serif italic leading-snug mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              {firstName !== 'friend' ? `${firstName}, you showed up.` : 'You showed up.'}
            </p>
            <p className="text-[#2A3A3F]/75 text-sm leading-relaxed">
              You've met every guide. The path widens from here.
            </p>
          </div>
        )}

        {!noSignupDate && elapsed >= 7 && !complete && (
          <p className="mt-7 text-[#2A3A3F]/65 italic text-sm max-w-md mx-auto leading-relaxed">
            Your first week has passed, but the plan is still here. Pick up any day — grace doesn't keep a calendar.
          </p>
        )}

        {noSignupDate && (
          <p className="mt-7 text-[#2A3A3F]/65 italic text-sm max-w-md mx-auto">
            Walk through any of the days below in any order.
          </p>
        )}
      </section>

      {/* Progress dots */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {plan.map((d) => {
            const done = progress.includes(d.day);
            const isToday = d.day === currentDay;
            return (
              <div key={d.day} className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    'w-9 h-9 rounded-full flex items-center justify-center text-xs font-serif transition-all',
                    done
                      ? 'bg-[#FD9C2D] text-white'
                      : isToday
                        ? 'border-2 border-[#FD9C2D] text-[#FD9C2D]'
                        : 'border border-[#2A3A3F]/20 text-[#2A3A3F]/45',
                  ].join(' ')}
                  aria-label={`Day ${d.day}${done ? ' complete' : isToday ? ' (today)' : ''}`}
                >
                  {done ? <Check className="w-4 h-4" /> : d.day}
                </div>
                <span className="text-[9px] tracking-widest text-[#2A3A3F]/35">
                  D{d.day}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Day cards */}
      <section className="px-5 pb-24 max-w-xl mx-auto space-y-3">
        {plan.map((d, idx) => {
          const done = progress.includes(d.day);
          const inProgress = started.includes(d.day);
          const isToday = d.day === currentDay;
          // Unlock policy: every day is always unlocked once user reaches it
          // by calendar day OR week is over OR no signup date (defensive)
          const isUnlocked = noSignupDate || elapsed >= 7 || d.day <= (currentDay || 0);
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

        <div className="pt-8 pb-4 text-center text-[#2A3A3F]/30 text-[10px] tracking-[0.3em]">
          PROSPERITY REVIVED
        </div>
      </section>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function DayCard({ day, done, inProgress, isToday, isUnlocked, saving, onBegin, onMarkComplete, animationDelay }) {
  const avatarSrc = day.coach !== 'All Five' ? AVATAR_MAP[day.coach] : null;

  let ctaBlock;
  if (!isUnlocked) {
    ctaBlock = (
      <div className="inline-flex items-center gap-1.5 text-[#2A3A3F]/35 text-[10px] tracking-widest uppercase">
        <Lock className="w-3 h-3" />
        <span>Unlocks Day {day.day}</span>
      </div>
    );
  } else if (done) {
    ctaBlock = (
      <button
        onClick={onBegin}
        disabled={saving}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#2A3A3F]/20 text-[#2A3A3F]/75 hover:bg-[#2A3A3F]/5 transition-colors"
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
            'bg-[#FD9C2D] text-white hover:bg-[#FD9C2D]/85',
            saving && 'opacity-70 cursor-wait',
          ].join(' ')}
        >
          <Check className="w-3.5 h-3.5" />
          <span>I completed this day</span>
        </button>
        <button
          onClick={onBegin}
          disabled={saving}
          className="inline-flex items-center gap-1 text-[#2A3A3F]/60 text-[11px] hover:text-[#2A3A3F]/85 transition-colors underline-offset-2 hover:underline"
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
          'bg-[#FD9C2D] text-white hover:bg-[#FD9C2D]/85',
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
        'relative overflow-hidden rounded-2xl border p-4 transition-all bg-white',
        isToday
          ? 'border-[#FD9C2D]/60 shadow-[0_0_40px_-16px_rgba(253,156,45,0.4)]'
          : inProgress
            ? 'border-[#FAD98D]/60'
            : 'border-[#2A3A3F]/10',
        !isUnlocked && 'opacity-55',
      ].join(' ')}
    >
      {isToday && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#FAD98D]/20 to-transparent"
          aria-hidden="true"
        />
      )}

      <div className="relative flex items-start gap-3">
        <div className="flex-shrink-0">
          {avatarSrc ? (
            <div
              className={[
                'w-14 h-14 rounded-full overflow-hidden bg-[#FBF6EC] border-2',
                isToday ? 'border-[#FD9C2D]' : done ? 'border-[#FD9C2D]/60' : inProgress ? 'border-[#FAD98D]' : 'border-[#2A3A3F]/15',
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
            <div className="w-14 h-14 rounded-full bg-[#FBF6EC] border-2 border-[#FD9C2D]/60 flex items-center justify-center">
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
          <div className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] text-[#2A3A3F]/45 mb-1 flex-wrap">
            <span>DAY {day.day}</span>
            <span>·</span>
            <span>{day.coach.toUpperCase()}</span>
            {inProgress && !done && (
              <>
                <span>·</span>
                <span className="text-[#FD9C2D]">IN PROGRESS</span>
              </>
            )}
          </div>
          <h3
            className="font-serif text-[#2A3A3F] text-lg mb-1 leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {day.title}
          </h3>
          <p className="text-[#2A3A3F]/70 text-[13px] leading-relaxed mb-3">
            {day.description}
          </p>

          {ctaBlock}
        </div>

        {done && !isToday && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FD9C2D] flex items-center justify-center"
            aria-hidden="true"
          >
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}

        {isToday && (
          <div className="absolute top-2 right-2">
            <Sparkles className="w-4 h-4 text-[#FD9C2D]" />
          </div>
        )}
      </div>
    </motion.article>
  );
}
