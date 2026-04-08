import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  BookOpen, Heart, Dumbbell, Users, TrendingUp, ChevronRight,
  Flame, Trophy, Utensils, Play, Sparkles, MessageCircle,
  CheckCircle2, Circle
} from 'lucide-react';
import { readingPlans, getVerseOfDay } from '@/components/bible/BibleData';
import { COACHING_PLANS } from '@/components/coaching/planData';
import { toast } from 'sonner';
import TermsUpdateGate, { needsTermsUpdate } from '@/components/onboarding/TermsUpdateGate';
import StartMyDayModal from '@/components/home/StartMyDayModal';
import EndMyDayModal from '@/components/home/EndMyDayModal';

// Lazy-load heavy components (only needed conditionally)
const OnboardingFlow = lazy(() => import('@/components/onboarding/OnboardingFlow'));
const AppTour = lazy(() => import('@/components/onboarding/AppTour'));
const CreatePostModal = lazy(() => import('@/components/community/CreatePostModal'));
const HelpChatbot = lazy(() => import('@/components/home/HelpChatbot'));

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return { text: 'Good Night',    emoji: '🌙', isMorning: false };
  if (h < 12) return { text: 'Good Morning',  emoji: '🌅', isMorning: true  };
  if (h < 17) return { text: 'Good Afternoon',emoji: '☀️', isMorning: false };
  if (h < 21) return { text: 'Good Evening',  emoji: '🌇', isMorning: false };
  return       { text: 'Good Night',    emoji: '🌙', isMorning: false };
}

function getFirstName(user) {
  return user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'friend';
}

function getTodayFormatted() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// Load coaching progress from localStorage
function getActiveCoachingPlan() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith('coaching_progress_')) continue;
      const progress = JSON.parse(localStorage.getItem(key));
      const completed = progress?.completed_days || [];
      if (completed.length === 0) continue;
      const planId = key.replace('coaching_progress_', '');
      const plan = COACHING_PLANS.find(p => p.id === planId);
      if (!plan) continue;
      const nextDay = Math.max(...completed) + 1;
      const pct = Math.round((completed.length / plan.days_total) * 100);
      return { plan, completed, nextDay: Math.min(nextDay, plan.days_total), pct };
    }
  } catch {}
  return null;
}

// ─── Quick Nav tiles ──────────────────────────────────────────────────────────
const QUICK_NAV = [
  { label: 'Bible',      icon: BookOpen,  page: 'Bible',           color: 'from-amber-500 to-amber-600',    bg: 'bg-amber-50' },
  { label: 'Fitness',    icon: Dumbbell,  page: 'Wellness',        color: 'from-sky-500 to-sky-600',        bg: 'bg-sky-50'   },
  { label: 'Prayer',     icon: Heart,     page: 'Prayer',          color: 'from-rose-400 to-rose-500',      bg: 'bg-rose-50'  },
  { label: 'Nutrition',  icon: Utensils,  page: 'Nutrition',       color: 'from-emerald-500 to-emerald-600',bg: 'bg-emerald-50'},
  { label: 'Community',  icon: Users,     page: 'Community',       color: 'from-purple-500 to-purple-600',  bg: 'bg-purple-50'},
  { label: 'Couples',    icon: Heart,     page: 'CouplesMode',     color: 'from-pink-400 to-rose-500',      bg: 'bg-pink-50'  },
];

// ─── Streak pill ──────────────────────────────────────────────────────────────
function StreakPill({ progress }) {
  if (!progress) return null;
  const streak = progress.current_streak || 0;
  const level  = progress.level || 1;
  const points = progress.total_points || 0;
  return (
    <Link to={createPageUrl('Achievements')}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-[#FAD98D]/40">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-bold text-[#0A1A2F] text-sm">{streak}</span>
          <span className="text-xs text-[#0A1A2F]/50">day streak</span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[#c9a227]" />
          <span className="font-bold text-[#0A1A2F] text-sm">Lvl {level}</span>
          <span className="text-xs text-[#0A1A2F]/50">{points.toLocaleString()} pts</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-[#0A1A2F]/30 ml-auto" />
      </motion.div>
    </Link>
  );
}

// ─── Daily Ritual button ──────────────────────────────────────────────────────
function RitualButton({ isMorning, onStartDay, onEndDay }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      id="tour-ritual-btn"
      onClick={isMorning ? onStartDay : onEndDay}
      className="w-full rounded-3xl p-5 text-left shadow-lg overflow-hidden relative"
      style={{
        background: isMorning
          ? 'linear-gradient(135deg, #c9a227 0%, #FD9C2D 60%, #FAD98D 100%)'
          : 'linear-gradient(135deg, #0A1A2F 0%, #3C4E53 60%, #AFC7E3 100%)',
      }}
    >
      {/* Decorative circle */}
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-15"
        style={{ background: isMorning ? '#fff' : '#AFC7E3' }} />
      <div className="absolute -right-2 top-6 w-16 h-16 rounded-full opacity-10"
        style={{ background: isMorning ? '#fff' : '#FAD98D' }} />

      <div className="relative flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">{isMorning ? '🌅' : '🌙'}</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-xl leading-tight">
            {isMorning ? 'Start My Day' : 'End My Day'}
          </p>
          <p className="text-white/70 text-sm mt-0.5">
            {isMorning
              ? 'Scripture · Affirmation · Intention'
              : 'Gratitude · Reflection · Rest'}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
      </div>
    </motion.button>
  );
}

// ─── Today's Scripture card ────────────────────────────────────────────────────
function VerseCard({ onBookmark }) {
  const verse = getVerseOfDay();
  return (
    <motion.div id="tour-verse-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Link to={createPageUrl(`Bible?book=${verse.book}&chapter=${verse.chapter}&verse=${verse.verse}`)}>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FAD98D]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
            <BookOpen className="w-full h-full text-[#c9a227]" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-[#c9a227] rounded-full" />
            <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Today's Scripture</span>
          </div>
          <p className="text-[#0A1A2F] text-base leading-relaxed font-medium mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            "{verse.text}"
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#0A1A2F]/50 font-medium">
              {verse.book} {verse.chapter}:{verse.verse}
            </p>
            <span className="text-xs text-[#c9a227] font-semibold flex items-center gap-1">
              Read more <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Grace Moment card ───────────────────────────────────────────────────────
const GRACE_MOMENTS = [
  { text: "Who do you need to forgive today — including yourself?", verse: "Bearing with one another, and forgiving each other.", ref: "Colossians 3:13", page: "Prayer" },
  { text: "You are not defined by yesterday's failures. His mercies are new this morning.", verse: "Because of the Lord's great love we are not consumed, for his compassions never fail.", ref: "Lamentations 3:22", page: "ChatScreen?bot=Gideon" },
  { text: "Grace means you don't have to earn God's love. You already have it.", verse: "For by grace you have been saved through faith, and that not of yourselves; it is the gift of God.", ref: "Ephesians 2:8", page: "AffirmationsPage" },
  { text: "What burden are you carrying that was never yours to hold?", verse: "Cast your burden on Yahweh and he will sustain you.", ref: "Psalm 55:22", page: "GuidedMeditationsPage" },
  { text: "Today, choose compassion — for others and for yourself.", verse: "Be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.", ref: "Ephesians 4:32", page: "Prayer" },
  { text: "God's grace doesn't run out. Not today, not ever.", verse: "My grace is sufficient for you, for my power is made perfect in weakness.", ref: "2 Corinthians 12:9", page: "IdentityInChristPage" },
  { text: "Stumbling is part of the journey. Getting back up is where faith lives.", verse: "For a righteous man falls seven times and rises up again.", ref: "Proverbs 24:16", page: "ChatScreen?bot=CoachPaul" },
];
function GraceMomentCard() {
  const idx = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 12)) % GRACE_MOMENTS.length;
  const gm = GRACE_MOMENTS[idx];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <Link to={createPageUrl(gm.page)}>
        <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/20 rounded-3xl p-5 shadow-sm border border-[#FAD98D]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
            <Heart className="w-full h-full text-[#c9a227]" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🕊️</span>
            <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Grace Moment</span>
          </div>
          <p className="text-[#0A1A2F] text-[15px] leading-relaxed font-semibold mb-2">
            {gm.text}
          </p>
          <p className="text-[#0A1A2F]/60 text-xs leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
            "{gm.verse}" — {gm.ref}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Resume card (coaching plan or reading plan) ──────────────────────────────
function ResumeCard({ coachingPlan, readingPlan, readingProgress, navigate }) {
  // Priority: active coaching plan > active reading plan
  if (coachingPlan) {
    const { plan, nextDay, pct, completed } = coachingPlan;
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <button
          onClick={() => navigate(createPageUrl(`CoachingPlanDetail?id=${plan.id}&day=${nextDay}`))}
          className="w-full text-left rounded-3xl overflow-hidden shadow-md"
        >
          <div className={`bg-gradient-to-br ${plan.gradient || 'from-[#3C4E53] to-[#c9a227]'} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Continue Plan</span>
              <span className="text-xs font-bold text-white/80">{pct}% complete</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{plan.cover_emoji || '👑'}</span>
              <div>
                <p className="font-bold text-white text-base">{plan.title}</p>
                <p className="text-white/70 text-xs">Day {nextDay} of {plan.days_total}</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs">{completed.length} days done</span>
              <span className="flex items-center gap-1 text-white text-xs font-bold">
                <Play className="w-3.5 h-3.5 fill-white" /> Start Day {nextDay}
              </span>
            </div>
          </div>
        </button>
      </motion.div>
    );
  }

  if (readingPlan && readingProgress) {
    const pct = Math.round((readingProgress.completed_days?.length || 0) / readingPlan.duration * 100);
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <button
          onClick={() => navigate(createPageUrl(`PlanDetail?id=${readingPlan.id}`))}
          className="w-full text-left bg-white rounded-3xl shadow-sm border border-[#FAD98D]/30 overflow-hidden"
        >
          <div className="relative h-20 overflow-hidden">
            <img src={readingPlan.image} alt={readingPlan.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A2F]/80 to-transparent" />
            <div className="absolute inset-0 flex items-center px-4 gap-3">
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-0.5">Continue Reading</p>
                <p className="font-bold text-white text-sm">{readingPlan.name}</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="h-1.5 bg-[#FAD98D]/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <span className="text-xs font-bold text-[#c9a227]">{pct}%</span>
            <ChevronRight className="w-4 h-4 text-[#0A1A2F]/30 ml-2" />
          </div>
        </button>
      </motion.div>
    );
  }

  return null;
}

// ─── Quick Nav grid ───────────────────────────────────────────────────────────
function QuickNav() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-3">Explore</p>
      <div className="grid grid-cols-3 gap-3">
        {QUICK_NAV.map(({ label, icon: Icon, page, color, bg }) => (
          <Link key={page} to={createPageUrl(page)}>
            <motion.div whileTap={{ scale: 0.95 }}
              className={`${bg} rounded-2xl p-3.5 flex flex-col items-center gap-2 shadow-sm border border-gray-100/80`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#0A1A2F]/70">{label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Meet Your Guides ──────────────────────────────────────────────────────
const AI_GUIDES = [
  { name: 'Gideon',  emoji: '📖', sub: 'Biblical wisdom',   color: 'bg-amber-100',   bot: 'Gideon' },
  { name: 'Hannah',  emoji: '💛', sub: 'Mindset coach',     color: 'bg-sky-100',     bot: 'Hannah' },
  { name: 'David',   emoji: '💪', sub: 'Fitness guide',     color: 'bg-blue-100',    bot: 'CoachDavid' },
  { name: 'Daniel',  emoji: '🍽️', sub: 'Nutrition expert',  color: 'bg-orange-100',  bot: 'ChefDaniel' },
  { name: 'Paul',    emoji: '👑', sub: 'Discipline mentor', color: 'bg-violet-100',  bot: 'CoachPaul' },
];

function MeetYourGuidesCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#c9a227]" />
          <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">Your Guides</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {AI_GUIDES.map(({ name, emoji, sub, color, bot }) => (
          <Link key={bot} to={createPageUrl(`ChatScreen?bot=${bot}`)}>
            <motion.div whileTap={{ scale: 0.93 }}
              className={`${color} rounded-2xl p-2.5 flex flex-col items-center gap-1 shadow-sm border border-gray-100/80`}>
              <span className="text-xl">{emoji}</span>
              <span className="text-[10px] font-bold text-[#0A1A2F]/70 leading-tight text-center">{name}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── New user Start Here ──────────────────────────────────────────────────────
function StartHereCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="bg-gradient-to-br from-[#FD9C2D]/10 to-[#FAD98D]/20 border border-[#FD9C2D]/30 rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#FD9C2D]" />
        <h2 className="font-bold text-[#0A1A2F]">Here's where to start</h2>
      </div>
      <div className="space-y-2">
        {[
          { emoji: '📖', title: 'Read today\'s verse', sub: 'Start your spiritual journey', page: 'Bible' },
          { emoji: '📅', title: 'Start a reading plan', sub: 'Build a daily Bible habit', page: 'Plans' },
          { emoji: '💪', title: 'Log your first workout', sub: 'Track your fitness progress', page: 'Workouts' },
        ].map(({ emoji, title, sub, page }) => (
          <Link key={page} to={createPageUrl(page)}>
            <div className="bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm mb-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="font-semibold text-sm text-[#0A1A2F]">{title}</p>
                <p className="text-xs text-[#0A1A2F]/50">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25 ml-auto" />
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}


// ─── Daily Progress Ring — visual today's activity tracker ────────────────────
function DailyProgressRing({ user }) {
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();

  const { data: todayWorkouts = [] } = useQuery({
    queryKey: ['todayWorkouts', user?.email, today],
    queryFn: async () => {
      try {
        const all = await base44.entities.WorkoutSession.filter({ created_by: user?.email });
        return all.filter(w => w.created_date?.startsWith(today));
      } catch { return []; }
    },
    enabled: !!user?.email,
  });

  const { data: todayJournals = [] } = useQuery({
    queryKey: ['todayJournals', user?.email, today],
    queryFn: async () => {
      try {
        const all = await base44.entities.JournalEntry.filter({ created_by: user?.email });
        return all.filter(j => j.created_date?.startsWith(today));
      } catch { return []; }
    },
    enabled: !!user?.email,
  });

  const items = [
    { label: 'Devotion', icon: BookOpen, done: todayJournals.some(j => ['scripture_reflection', 'bible_notes', 'spiritual'].includes(j.entry_type)), page: 'Bible', color: '#c9a227' },
    { label: 'Workout', icon: Dumbbell, done: todayWorkouts.length > 0, page: 'Workouts', color: '#38BDF8' },
    { label: 'Journal', icon: Heart, done: todayJournals.length > 0, page: 'MyJournalEntries', color: '#F472B6' },
    { label: 'Nutrition', icon: Utensils, done: false, page: 'Nutrition', color: '#22C55E' },
  ];

  const doneCount = items.filter(i => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  // SVG ring
  const size = 72, stroke = 5, radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
      className="bg-white rounded-3xl p-4 shadow-sm border border-[#FAD98D]/30">
      <div className="flex items-center gap-4">
        {/* Ring */}
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F2F6FA" strokeWidth={stroke} />
            <motion.circle
              cx={size/2} cy={size/2} r={radius} fill="none"
              stroke={doneCount === items.length ? '#22C55E' : '#c9a227'}
              strokeWidth={stroke} strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold text-[#0A1A2F]">{doneCount}/{items.length}</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1.5">
          {items.map(({ label, icon: Icon, done, page, color }) => (
            <Link key={label} to={createPageUrl(page)}>
              <div className="flex items-center gap-2">
                {done
                  ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                }
                <span className={`text-xs font-medium ${done ? 'text-[#0A1A2F] line-through opacity-50' : 'text-[#0A1A2F]/70'}`}>
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {doneCount === items.length && (
        <div className="mt-3 text-center">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            ✨ All daily goals complete!
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Personalized AI Nudge Banner ─────────────────────────────────────────────
const NUDGE_POOL = [
  { text: "Hannah noticed you haven't journaled today. Even one sentence counts.", bot: 'Hannah', icon: '💛', page: 'ChatScreen?bot=Hannah' },
  { text: "Coach David has a quick 15-minute workout ready for you.", bot: 'CoachDavid', icon: '💪', page: 'ChatScreen?bot=CoachDavid' },
  { text: "Chef Daniel wants to help with your next meal. What sounds good?", bot: 'ChefDaniel', icon: '🍽️', page: 'ChatScreen?bot=ChefDaniel' },
  { text: "Gideon has a verse that speaks to what you're going through.", bot: 'Gideon', icon: '📖', page: 'ChatScreen?bot=Gideon' },
  { text: "Coach Paul wants to check in on your growth this week.", bot: 'CoachPaul', icon: '👑', page: 'ChatScreen?bot=CoachPaul' },
  { text: "Your body is a temple. Have you moved it today?", bot: 'CoachDavid', icon: '🏃', page: 'Workouts' },
  { text: "Take 2 minutes for prayer. Your spirit will thank you.", bot: 'Hannah', icon: '🙏', page: 'Prayer' },
];

function NudgeBanner() {
  const idx = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 4)) % NUDGE_POOL.length; // rotates every 4 hours
  const nudge = NUDGE_POOL[idx];

  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>
      <Link to={createPageUrl(nudge.page)}>
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#0A1A2F] to-[#1a3a5c] rounded-2xl px-4 py-3 shadow-md">
          <span className="text-xl flex-shrink-0">{nudge.icon}</span>
          <p className="text-xs text-white/80 leading-relaxed flex-1">{nudge.text}</p>
          <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Enhanced AI Guides — larger cards with avatar + tagline ──────────────────
const AI_GUIDES_ENHANCED = [
  { name: 'Gideon',      role: 'Biblical Wisdom',   tagline: 'Dive deep into Scripture with me', color: 'from-amber-500 to-amber-600',   bg: 'bg-amber-50',  bot: 'Gideon' },
  { name: 'Hannah',      role: 'Mindset & Prayer',  tagline: "Let's work on your inner world",   color: 'from-sky-400 to-sky-500',       bg: 'bg-sky-50',    bot: 'Hannah' },
  { name: 'Coach David', role: 'Fitness Coach',     tagline: 'Ready to get stronger today?',     color: 'from-blue-500 to-blue-600',     bg: 'bg-blue-50',   bot: 'CoachDavid' },
  { name: 'Chef Daniel', role: 'Nutrition Guide',   tagline: "Let's fuel your body right",       color: 'from-orange-400 to-orange-500', bg: 'bg-orange-50', bot: 'ChefDaniel' },
  { name: 'Coach Paul',  role: 'Discipline Mentor', tagline: 'Discipline is freedom. Let me show you', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', bot: 'CoachPaul' },
];

function EnhancedGuidesSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4 text-[#c9a227]" />
        <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">Talk to Your Guides</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {AI_GUIDES_ENHANCED.map(({ name, role, tagline, color, bg, bot }) => (
          <Link key={bot} to={createPageUrl(`ChatScreen?bot=${bot}`)} className="flex-shrink-0" style={{ width: 140 }}>
            <motion.div whileTap={{ scale: 0.95 }}
              className={`${bg} rounded-2xl p-3 shadow-sm border border-gray-100/80 h-full`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} mx-auto mb-2 overflow-hidden shadow-sm flex items-center justify-center`}>
                <span className="text-xl text-white font-bold">{name[0]}</span>
              </div>
              <p className="text-xs font-bold text-[#0A1A2F] text-center leading-tight">{name}</p>
              <p className="text-[9px] text-[#0A1A2F]/40 text-center font-medium">{role}</p>
              <p className="text-[9px] text-[#0A1A2F]/50 text-center mt-1 italic leading-snug">"{tagline}"</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Combined Scripture + Grace card (alternates) ─────────────────────────────
function DailyInspirationCard() {
  const verse = getVerseOfDay();
  const hour = new Date().getHours();
  // Show scripture in the morning, grace moment in the afternoon/evening
  const showScripture = hour < 14;

  const graceIdx = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 12)) % GRACE_MOMENTS.length;
  const gm = GRACE_MOMENTS[graceIdx];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      {showScripture ? (
        <Link to={createPageUrl(`Bible?book=${verse.book}&chapter=${verse.chapter}&verse=${verse.verse}`)}>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FAD98D]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
              <BookOpen className="w-full h-full text-[#c9a227]" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#c9a227] rounded-full" />
              <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Today's Scripture</span>
            </div>
            <p className="text-[#0A1A2F] text-base leading-relaxed font-medium mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              "{verse.text}"
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#0A1A2F]/50 font-medium">{verse.book} {verse.chapter}:{verse.verse}</p>
              <span className="text-xs text-[#c9a227] font-semibold flex items-center gap-1">
                Read more <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <Link to={createPageUrl(gm.page)}>
          <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/20 rounded-3xl p-5 shadow-sm border border-[#FAD98D]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
              <Heart className="w-full h-full text-[#c9a227]" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🕊️</span>
              <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Grace Moment</span>
            </div>
            <p className="text-[#0A1A2F] text-[15px] leading-relaxed font-semibold mb-2">{gm.text}</p>
            <p className="text-[#0A1A2F]/60 text-xs leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
              "{gm.verse}" — {gm.ref}
            </p>
          </div>
        </Link>
      )}
    </motion.div>
  );
}


// ─── Active Challenges widget ─────────────────────────────────────────────────
function ActiveChallengesWidget({ user }) {
  const navigate = useNavigate();

  const { data: myParticipations = [] } = useQuery({
    queryKey: ['myParticipations', user?.email],
    queryFn: () => base44.entities.ChallengeParticipation.filter({ user_email: user.email }),
    enabled: !!user?.email,
  });

  const { data: allChallenges = [] } = useQuery({
    queryKey: ['activeChallenges'],
    queryFn: () => base44.entities.GroupChallenge.filter({ is_active: true }, '-created_date', 20),
    enabled: myParticipations.length > 0,
  });

  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();

  // Only show in-progress (not completed) participations
  const active = myParticipations.filter(p => {
    const challenge = allChallenges.find(c => c.id === p.challenge_id);
    if (!challenge) return false;
    return (p.completed_days?.length || 0) < challenge.duration_days;
  }).slice(0, 3);

  if (!active.length) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">Active Challenges</p>
        <button onClick={() => navigate(createPageUrl('Community'))}
          className="text-xs font-bold text-[#c9a227]">See all →</button>
      </div>
      <div className="space-y-2">
        {active.map((p) => {
          const challenge = allChallenges.find(c => c.id === p.challenge_id);
          if (!challenge) return null;
          const completedDays = p.completed_days?.length || 0;
          const progress      = Math.min(100, Math.round((completedDays / challenge.duration_days) * 100));
          const checkedToday  = p.last_check_in_date === today;
          const streak        = p.current_streak || 0;

          // Type → visual
          const TYPE_VIS = {
            prayer:      { emoji: '🙏', color: 'bg-violet-500' },
            reading:     { emoji: '📖', color: 'bg-amber-500'  },
            workouts:    { emoji: '💪', color: 'bg-blue-600'   },
            meditation:  { emoji: '📵', color: 'bg-slate-600'  },
            water_intake:{ emoji: '🥗', color: 'bg-green-600' },
            custom:      { emoji: '🤝', color: 'bg-emerald-600'},
          };
          const vis = TYPE_VIS[challenge.challenge_type || challenge.type] || TYPE_VIS.custom;

          return (
            <button key={p.id}
              onClick={() => navigate(createPageUrl('Community'))}
              className="w-full text-left bg-white rounded-2xl p-3.5 border border-[#FAD98D]/15 hover:border-[#c9a227]/30 transition-all shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${vis.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-lg">{vis.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-xs text-[#0A1A2F] truncate">{challenge.title}</p>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {streak > 0 && (
                      <span className="text-[10px] font-bold text-orange-500 flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />{streak}
                      </span>
                    )}
                    {checkedToday
                      ? <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">✓ Done</span>
                      : <span className="text-[9px] font-bold text-[#c9a227] bg-white px-1.5 py-0.5 rounded-full">Check in</span>
                    }
                  </div>
                </div>
                <div className="h-1.5 bg-[#F2F6FA] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${vis.color} transition-all`}
                    style={{ width: `${progress}%`, opacity: 0.7 }} />
                </div>
                <p className="text-[10px] text-[#0A1A2F]/35 mt-0.5">Day {completedDays} of {challenge.duration_days}</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAppTour, setShowAppTour] = useState(false);
  const [showStartDay, setShowStartDay] = useState(false);
  const [showEndDay, setShowEndDay] = useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);

  const greeting = getGreeting();
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();
  const ritualKey = greeting.isMorning ? `ritual_morning_${today}` : `ritual_evening_${today}`;
  const [ritualDone, setRitualDone] = useState(() => !!localStorage.getItem(ritualKey));
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showTermsGate, setShowTermsGate] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      if (!u.onboarding_completed) {
        setShowOnboarding(true);
      } else if (needsTermsUpdate(u)) {
        setShowTermsGate(true);
      } else if (!u.app_tour_completed) {
        setShowAppTour(true);
      }
    }).catch(() => {});
  }, []);

  // Apply theme
  useEffect(() => {
    if (user?.theme) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = user.theme === 'dark' || (user.theme === 'auto' && systemDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [user?.theme]);

  // ── Queries: only 3 (vs old 10) ──────────────────────────────────────────
  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: async () => {
      try { return await base44.entities.ReadingPlanProgress.filter({ created_by: user?.email }); }
      catch { return []; }
    },
    enabled: !!user,
    retry: false,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      try {
        const list = await base44.entities.UserProgress.filter({ created_by: user?.email });
        return list[0] || null;
      } catch { return null; }
    },
    enabled: !!user,
    retry: false,
  });

  // Community post creation (only kept because CreatePostModal is already here)
  const createPost = useMutation({
    mutationFn: (data) => base44.entities.Post.create({
      ...data,
      user_name: user?.full_name || user?.email || 'Anonymous',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      toast.success('Post shared to community!');
    },
  });

  // ── Active plan detection ─────────────────────────────────────────────────
  const activeCoaching = getActiveCoachingPlan();

  const activeReadingPlan = (() => {
    if (activeCoaching) return null; // coaching takes priority
    if (!planProgress.length) return null;
    const prog = planProgress[0];
    const plan = readingPlans.find(p => p.id === prog.plan_id);
    return plan ? { plan, progress: prog } : null;
  })();

  const isNewUser = !activeCoaching && planProgress.length === 0;

  return (
    <div className="min-h-screen bg-[#F2F6FA]">
      <Suspense fallback={null}>
        {showOnboarding && (
          <OnboardingFlow onComplete={() => {
            setShowOnboarding(false);
            base44.auth.me().then(setUser).catch(() => {});
            setTimeout(() => setShowAppTour(true), 600);
          }} />
        )}
        {showTermsGate && (
          <TermsUpdateGate
            user={user}
            onAccepted={() => {
              setShowTermsGate(false);
              base44.auth.me().then(u => {
                setUser(u);
                if (!u.app_tour_completed) setTimeout(() => setShowAppTour(true), 400);
              }).catch(() => {});
            }}
          />
        )}
        {showAppTour && (
          <AppTour
            userName={user?.full_name?.split(' ')[0]}
            onComplete={() => {
              setShowAppTour(false);
              base44.auth.me().then(setUser).catch(() => {});
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('launchGuidedTour', { detail: { steps: null } }));
              }, 800);
            }}
          />
        )}
      </Suspense>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-4">

        {/* 1. Greeting + Streak inline */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium text-[#0A1A2F]/40 uppercase tracking-widest mb-0.5">
            {getTodayFormatted()}
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#0A1A2F]">
              {greeting.text}, {getFirstName(user)} {greeting.emoji}
            </h1>
            {userProgress && (
              <Link to={createPageUrl('Achievements')}>
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm border border-[#FAD98D]/40">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-bold text-[#0A1A2F] text-xs">{userProgress.current_streak || 0}</span>
                </div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* 2. AI Nudge Banner — personalized prompt to engage */}
        <NudgeBanner />

        {/* 3. Daily ritual hero button — hidden once completed */}
        {!ritualDone && (
          <RitualButton
            isMorning={greeting.isMorning}
            onStartDay={() => setShowStartDay(true)}
            onEndDay={() => setShowEndDay(true)}
          />
        )}

        {/* 4. Daily Progress Ring — today's activity tracker */}
        {user && <DailyProgressRing user={user} />}

        {/* 5. Combined Scripture / Grace Moment (alternates by time of day) */}
        <DailyInspirationCard />

        {/* 6. Resume card — active plan, if any */}
        {(activeCoaching || activeReadingPlan) && (
          <ResumeCard
            coachingPlan={activeCoaching}
            readingPlan={activeReadingPlan?.plan}
            readingProgress={activeReadingPlan?.progress}
            navigate={navigate}
          />
        )}

        {/* 7. Active challenges (only shown if user has joined any) */}
        {user && <ActiveChallengesWidget user={user} />}

        {/* 8. Talk to Your Guides — enhanced scrollable cards */}
        <EnhancedGuidesSection />

        {/* 9. Quick navigation */}
        <QuickNav />

        {/* 10. Coaching plan discovery — if no active coaching plan */}
        {!activeCoaching && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Link to={createPageUrl('CoachingPlans')}>
              <div className="bg-gradient-to-br from-[#0D4F3C] to-[#1a8a6a] rounded-3xl p-5 shadow-md relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-white/10" />
                <div className="absolute -right-1 top-8 w-14 h-14 rounded-full bg-white/5" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-base leading-tight">Coaching Plans</p>
                    <p className="text-white/70 text-xs mt-0.5">8-week guided programs for body, mind & spirit</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/50" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* 11. New user Start Here (conditional) */}
        {isNewUser && <StartHereCard />}

      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <StartMyDayModal isOpen={showStartDay} onClose={(completed) => { setShowStartDay(false); if (completed) { localStorage.setItem(ritualKey, '1'); setRitualDone(true); } }} user={user} />
      <EndMyDayModal   isOpen={showEndDay}   onClose={(completed) => { setShowEndDay(false); if (completed) { localStorage.setItem(ritualKey, '1'); setRitualDone(true); } }} />
      <Suspense fallback={null}>
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSubmit={(data) => createPost.mutate(data)}
        />
      </Suspense>

      {/* Notification prompt */}
      {showNotifPrompt && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="text-xl font-bold text-[#0A1A2F] mb-2">Stay on track daily</h3>
              <p className="text-sm text-[#0A1A2F]/60">
                Get your morning verse, daily guidance, workout reminders, and evening reflections.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={async () => { await Notification.requestPermission(); setShowNotifPrompt(false); }}
                className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#FAD98D] text-[#3C4E53] font-semibold h-12 rounded-xl">
                Enable Daily Reminders
              </button>
              <button onClick={() => setShowNotifPrompt(false)}
                className="w-full text-[#0A1A2F]/40 text-sm py-2">
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Suspense fallback={null}>
        <HelpChatbot />
      </Suspense>
    </div>
  );
}

export default Home;