import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  BookOpen, Heart, Dumbbell, Users, TrendingUp, ChevronRight,
  Flame, Trophy, Utensils, Play, Sparkles, MessageCircle
} from 'lucide-react';
import { readingPlans, getVerseOfDay } from '@/components/bible/BibleData';
import { COACHING_PLANS } from '@/components/coaching/planData';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import TermsUpdateGate, { needsTermsUpdate } from '@/components/onboarding/TermsUpdateGate';
import AppTour from '@/components/onboarding/AppTour';
import StartMyDayModal from '@/components/home/StartMyDayModal';
import EndMyDayModal from '@/components/home/EndMyDayModal';
import CreatePostModal from '@/components/community/CreatePostModal';
import { toast } from 'sonner';
import HelpChatbot from '@/components/home/HelpChatbot';

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
  { label: 'Wellness',   icon: Dumbbell,  page: 'Wellness',        color: 'from-sky-500 to-sky-600',        bg: 'bg-sky-50'   },
  { label: 'Prayer',     icon: Heart,     page: 'Prayer',          color: 'from-rose-400 to-rose-500',      bg: 'bg-rose-50'  },
  { label: 'Nutrition',  icon: Utensils,  page: 'Nutrition',       color: 'from-emerald-500 to-emerald-600',bg: 'bg-emerald-50'},
  { label: 'Community',  icon: Users,     page: 'Community',       color: 'from-purple-500 to-purple-600',  bg: 'bg-purple-50'},
  { label: 'Journey',    icon: TrendingUp,page: 'ProgressDashboard',color:'from-[#3C4E53] to-[#AFC7E3]',   bg: 'bg-slate-50' },
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

// ─── Verse of the Day card ────────────────────────────────────────────────────
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
            <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Verse of the Day</span>
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

// ─── Meet Your AI Guides ──────────────────────────────────────────────────────
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
          <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">Your AI Guides</p>
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
            <div className="bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
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

  const today = new Date().toISOString().split('T')[0];

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
export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAppTour, setShowAppTour] = useState(false);
  const [showStartDay, setShowStartDay] = useState(false);
  const [showEndDay, setShowEndDay] = useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showTermsGate, setShowTermsGate] = useState(false);

  const greeting = getGreeting();

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
    });
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

      {/* ── Onboarding flows ──────────────────────────────────────────────── */}
      {showOnboarding && (
        <OnboardingFlow onComplete={() => {
          setShowOnboarding(false);
          base44.auth.me().then(setUser);
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
            });
          }}
        />
      )}
      {showAppTour && (
        <AppTour
          userName={user?.full_name?.split(' ')[0]}
          onComplete={() => {
          setShowAppTour(false);
          base44.auth.me().then(setUser);
          // Launch interactive guided tour after a short pause
          setTimeout(() => {
            if (window.__startGuidedTour) window.__startGuidedTour();
          }, 800);
        }} />
      )}
      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-4">

        {/* 1. Greeting */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium text-[#0A1A2F]/40 uppercase tracking-widest mb-0.5">
            {getTodayFormatted()}
          </p>
          <h1 className="text-2xl font-bold text-[#0A1A2F]">
            {greeting.text}, {getFirstName(user)} {greeting.emoji}
          </h1>
        </motion.div>

        {/* 2. Streak / Level pill (only if they have progress) */}
        {userProgress && <StreakPill progress={userProgress} />}

        {/* 3. Daily ritual hero button */}
        <RitualButton
          isMorning={greeting.isMorning}
          onStartDay={() => setShowStartDay(true)}
          onEndDay={() => setShowEndDay(true)}
        />

        {/* 4. Verse of the Day */}
        <VerseCard />

        {/* 4b. Active challenges (only shown if user has joined any) */}
        {user && <ActiveChallengesWidget user={user} />}

        {/* 5. Resume card — active plan, if any */}
        {(activeCoaching || activeReadingPlan) && (
          <ResumeCard
            coachingPlan={activeCoaching}
            readingPlan={activeReadingPlan?.plan}
            readingProgress={activeReadingPlan?.progress}
            navigate={navigate}
          />
        )}

        {/* 5b. Coaching plan discovery — if no active coaching plan */}
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

        {/* 6. Quick navigation */}
        <QuickNav />

        {/* 7. Meet Your AI Guides */}
        <MeetYourGuidesCard />

        {/* 8. New user Start Here (conditional) */}
        {isNewUser && <StartHereCard />}

      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <StartMyDayModal isOpen={showStartDay} onClose={() => setShowStartDay(false)} user={user} />
      <EndMyDayModal   isOpen={showEndDay}   onClose={() => setShowEndDay(false)} />
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={(data) => createPost.mutate(data)}
      />

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

      <HelpChatbot />
    </div>
  );
}
