import React, { lazy, Suspense, useState, useEffect } from 'react';
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

// Lazy-load heavy components
const OnboardingFlow = lazy(() => import('@/components/onboarding/OnboardingFlow'));
const AppTour = lazy(() => import('@/components/onboarding/AppTour'));
const CreatePostModal = lazy(() => import('@/components/community/CreatePostModal'));
const HelpChatbot = lazy(() => import('@/components/home/HelpChatbot'));

// Always loaded
import TermsUpdateGate, { needsTermsUpdate } from '@/components/onboarding/TermsUpdateGate';
import StartMyDayModal from '@/components/home/StartMyDayModal';
import EndMyDayModal from '@/components/home/EndMyDayModal';
import { toast } from 'sonner';

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return { text: 'Good Night', emoji: '🌙', isMorning: false };
  if (h < 12) return { text: 'Good Morning', emoji: '🌅', isMorning: true };
  if (h < 17) return { text: 'Good Afternoon', emoji: '☀️', isMorning: false };
  if (h < 21) return { text: 'Good Evening', emoji: '🌇', isMorning: false };
  return { text: 'Good Night', emoji: '🌙', isMorning: false };
}

function getFirstName(user) {
  return user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'friend';
}

function getTodayFormatted() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

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

// ─── Components ────────────────────────────────────────────────────────────────
const QUICK_NAV = [
  { label: 'Bible', icon: BookOpen, page: 'Bible', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
  { label: 'Fitness', icon: Dumbbell, page: 'Wellness', color: 'from-sky-500 to-sky-600', bg: 'bg-sky-50' },
  { label: 'Prayer', icon: Heart, page: 'Prayer', color: 'from-rose-400 to-rose-500', bg: 'bg-rose-50' },
  { label: 'Nutrition', icon: Utensils, page: 'Nutrition', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Community', icon: Users, page: 'Community', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
];

function QuickNav() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-3">Explore</p>
      <div className="grid grid-cols-3 gap-3">
        {QUICK_NAV.map(({ label, icon: Icon, page, color, bg }) => (
          <Link key={page} to={createPageUrl(page)}>
            <motion.div whileTap={{ scale: 0.95 }} className={`${bg} rounded-2xl p-3.5 flex flex-col items-center gap-2 shadow-sm border border-gray-100/80`}>
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

const AI_GUIDES_ENHANCED = [
  { name: 'Gideon', role: 'Biblical Wisdom', tagline: 'Dive deep into Scripture with me', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', bot: 'Gideon' },
  { name: 'Hannah', role: 'Mindset & Prayer', tagline: "Let's work on your inner world", color: 'from-sky-400 to-sky-500', bg: 'bg-sky-50', bot: 'Hannah' },
  { name: 'Coach David', role: 'Fitness Coach', tagline: 'Ready to get stronger today?', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', bot: 'CoachDavid' },
  { name: 'Chef Daniel', role: 'Nutrition Guide', tagline: "Let's fuel your body right", color: 'from-orange-400 to-orange-500', bg: 'bg-orange-50', bot: 'ChefDaniel' },
  { name: 'Coach Paul', role: 'Discipline Mentor', tagline: 'Discipline is freedom. Let me show you', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', bot: 'CoachPaul' },
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
            <motion.div whileTap={{ scale: 0.95 }} className={`${bg} rounded-2xl p-3 shadow-sm border border-gray-100/80 h-full`}>
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

const GRACE_MOMENTS = [
  { text: "Who do you need to forgive today — including yourself?", verse: "Bearing with one another, and forgiving each other.", ref: "Colossians 3:13", page: "Prayer" },
  { text: "You are not defined by yesterday's failures. His mercies are new this morning.", verse: "Because of the Lord's great love we are not consumed, for his compassions never fail.", ref: "Lamentations 3:22", page: "ChatScreen?bot=Gideon" },
];

function DailyInspirationCard() {
  const verse = getVerseOfDay();
  const hour = new Date().getHours();
  const showScripture = hour < 14;
  const graceIdx = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 12)) % GRACE_MOMENTS.length;
  const gm = GRACE_MOMENTS[graceIdx];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      {showScripture ? (
        <Link to={createPageUrl(`Bible?book=${verse.book}&chapter=${verse.chapter}&verse=${verse.verse}`)}>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#FAD98D]/30 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#c9a227] rounded-full" />
              <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Today's Scripture</span>
            </div>
            <p className="text-[#0A1A2F] text-base leading-relaxed font-medium mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              "{verse.text}"
            </p>
            <p className="text-sm text-[#0A1A2F]/50 font-medium">{verse.book} {verse.chapter}:{verse.verse}</p>
          </div>
        </Link>
      ) : (
        <Link to={createPageUrl(gm.page)}>
          <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/20 rounded-3xl p-5 shadow-sm border border-[#FAD98D]/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🕊️</span>
              <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-widest">Grace Moment</span>
            </div>
            <p className="text-[#0A1A2F] text-[15px] leading-relaxed font-semibold mb-2">{gm.text}</p>
          </div>
        </Link>
      )}
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAppTour, setShowAppTour] = useState(false);
  const [showStartDay, setShowStartDay] = useState(false);
  const [showEndDay, setShowEndDay] = useState(false);

  const greeting = getGreeting();
  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const ritualKey = greeting.isMorning ? `ritual_morning_${today}` : `ritual_evening_${today}`;
  const [ritualDone, setRitualDone] = useState(() => !!localStorage.getItem(ritualKey));
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

  useEffect(() => {
    if (user?.theme) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = user.theme === 'dark' || (user.theme === 'auto' && systemDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [user?.theme]);

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: async () => {
      try {
        return await base44.entities.ReadingPlanProgress.filter({ created_by: user?.email });
      } catch {
        return [];
      }
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
      } catch {
        return null;
      }
    },
    enabled: !!user,
    retry: false,
  });

  const activeCoaching = getActiveCoachingPlan();

  const activeReadingPlan = (() => {
    if (activeCoaching) return null;
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

      <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-4">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium text-[#0A1A2F]/40 uppercase tracking-widest mb-0.5">
            {getTodayFormatted()}
          </p>
          <h1 className="text-2xl font-bold text-[#0A1A2F]">
            {greeting.text}, {getFirstName(user)} {greeting.emoji}
          </h1>
        </motion.div>

        <DailyInspirationCard />
        <EnhancedGuidesSection />
        <QuickNav />
      </div>

      <Suspense fallback={null}>
        <CreatePostModal isOpen={false} onClose={() => {}} onSubmit={() => {}} />
        <HelpChatbot />
      </Suspense>

      <StartMyDayModal isOpen={showStartDay} onClose={(completed) => {
        setShowStartDay(false);
        if (completed) {
          localStorage.setItem(ritualKey, '1');
          setRitualDone(true);
        }
      }} user={user} />
      <EndMyDayModal isOpen={showEndDay} onClose={(completed) => {
        setShowEndDay(false);
        if (completed) {
          localStorage.setItem(ritualKey, '1');
          setRitualDone(true);
        }
      }} />
    </div>
  );
}