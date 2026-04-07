import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { COACHING_PLANS } from '@/components/coaching/planData';
import {
  Dumbbell, Utensils, Brain, Trophy, ChevronRight,
  Crown, Play, Droplets, Apple, Moon, Wind, Heart
} from 'lucide-react';

// ─── Time-aware featured action ───────────────────────────────────────────────
function getTimeFeature() {
  const h = new Date().getHours();
  if (h < 5)  return { emoji: '😴', title: 'Rest is part of the plan', sub: 'Sleep is when your body rebuilds. Protect it.', badge: 'Recovery 🌙', page: 'PersonalGrowth', gradient: 'from-[#0A1A2F] to-[#3C4E53]', icon: Moon };
  if (h < 10) return { emoji: '⚡', title: 'Morning is the best time to move', sub: "Get your workout in before the day takes over. 15 minutes is enough.", badge: 'Morning Window 🌅', page: 'Workouts', gradient: 'from-[#c9a227] to-[#FD9C2D]', icon: Dumbbell };
  if (h < 13) return { emoji: '🥗', title: "Don't skip a real lunch", sub: "What you eat at noon sets your energy for the afternoon.", badge: 'Fuel Up ☀️', page: 'Nutrition', gradient: 'from-[#059669] to-[#34d399]', icon: Apple };
  if (h < 17) return { emoji: '💧', title: 'Afternoon energy dip?', sub: "Before you reach for coffee — drink a glass of water and take 5 deep breaths.", badge: 'Afternoon Reset 🌤️', page: 'Workouts', gradient: 'from-[#0369a1] to-[#38BDF8]', icon: Droplets };
  if (h < 20) return { emoji: '🧘', title: 'Wind down your body', sub: "An evening walk or stretch does more for tomorrow than you think.", badge: 'Evening Wind-Down 🌇', page: 'PersonalGrowth', gradient: 'from-[#3C4E53] to-[#AFC7E3]', icon: Wind };
  return       { emoji: '🌙', title: 'Prepare for deep rest', sub: "Cut screens, dim lights, journal for 3 minutes. Your tomorrow starts now.", badge: 'Sleep Prep 🌙', page: 'PersonalGrowth', gradient: 'from-[#0A1A2F] to-[#1a3a4a]', icon: Moon };
}

// ─── Category tiles ───────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: 'Workouts',
    sub: 'Train with purpose',
    page: 'Workouts',
    gradient: 'from-[#38BDF8] to-[#0284c7]',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop',
  },
  {
    label: 'Nutrition',
    sub: 'Fuel your mission',
    page: 'Nutrition',
    gradient: 'from-[#22c55e] to-[#16a34a]',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
  },
  {
    label: 'Prayer',
    sub: 'Talk with God',
    page: 'Prayer',
    gradient: 'from-[#f472b6] to-[#db2777]',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=500&h=300&fit=crop',
  },
  {
    label: 'Personal Growth',
    sub: 'Mind & spirit',
    page: 'PersonalGrowth',
    gradient: 'from-[#AFC7E3] to-[#3C4E53]',
    icon: Brain,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
  },
  {
    label: 'Meditations',
    sub: 'Guided peace',
    page: 'GuidedMeditationsPage',
    gradient: 'from-[#a78bfa] to-[#7c3aed]',
    icon: Wind,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=300&fit=crop',
  },
  {
    label: 'Challenges',
    sub: 'Push further',
    page: 'SelfCareChallengesPage',
    gradient: 'from-[#FD9C2D] to-[#c9a227]',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
  },
];

// ─── Coaching plan helpers ────────────────────────────────────────────────────
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
      return { plan, completedDays: completed.length };
    }
  } catch {}
  return null;
}

// ─── Featured hero card ───────────────────────────────────────────────────────
function FeaturedCard({ feature }) {
  const IconComp = feature.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
      <Link to={createPageUrl(feature.page)}>
        <div className={`rounded-3xl p-5 bg-gradient-to-br ${feature.gradient} shadow-lg relative overflow-hidden`}>
          {/* Decorative circle */}
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
          <div className="absolute -right-2 top-10 w-16 h-16 rounded-full bg-white/8" />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">{feature.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{feature.badge}</span>
              <p className="font-bold text-white text-[15px] leading-snug mt-0.5">{feature.title}</p>
              <p className="text-white/70 text-xs mt-1 leading-relaxed">{feature.sub}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Today's stats (only rendered when non-zero) ──────────────────────────────
function TodayStats({ meals, workouts, waterMl }) {
  const stats = [
    meals > 0    && { icon: '🍽️', value: meals,    label: 'meals',    color: 'text-emerald-600', page: 'Nutrition'   },
    workouts > 0 && { icon: '💪', value: workouts, label: 'workouts', color: 'text-sky-600',     page: 'Workouts'   },
    waterMl > 0  && { icon: '💧', value: `${Math.round(waterMl / 250)}`, label: 'glasses', color: 'text-blue-500', page: 'Nutrition' },
  ].filter(Boolean);

  if (stats.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
      <p className="text-[10px] font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">Today's activity</p>
      <div className="flex gap-3">
        {stats.map(({ icon, value, label, color, page }) => (
          <Link key={label} to={createPageUrl(page)}
            className="flex-1 bg-white rounded-2xl px-3 py-3 flex items-center gap-2 shadow-sm border border-gray-100">
            <span className="text-xl">{icon}</span>
            <div>
              <p className={`font-bold text-lg leading-none ${color}`}>{value}</p>
              <p className="text-[10px] text-[#0A1A2F]/45 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Category grid ────────────────────────────────────────────────────────────
function CategoryGrid() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
      <p className="text-[10px] font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-3">Explore</p>
      <div id="tour-wellness-categories" className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(({ label, sub, page, gradient, icon: Icon, image }, i) => (
          <motion.div key={page} id={i === 0 ? 'tour-workouts-card' : undefined} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05 }}>
            <Link to={createPageUrl(page)}>
              <div className="relative rounded-2xl overflow-hidden h-36 shadow-md group">
                {/* Background image */}
                <img src={image} alt={label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-75`} />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">{label}</p>
                    <p className="text-white/70 text-[10px]">{sub}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Coaching programs preview ────────────────────────────────────────────────
function CoachingSection({ active }) {
  const withProgress = COACHING_PLANS.map(plan => {
    let progress = {};
    try { progress = JSON.parse(localStorage.getItem(`coaching_progress_${plan.id}`)) || {}; } catch {}
    const completedDays = (progress.completed_days || []).length;
    return { plan, completedDays, isStarted: completedDays > 0 };
  });
  const started  = withProgress.filter(p => p.isStarted);
  const featured = withProgress.filter(p => !p.isStarted).slice(0, Math.max(0, 3 - started.length));
  const toShow   = [...started, ...featured].slice(0, 3);

  return (
    <motion.div id="tour-coaching-section" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3C4E53] to-[#FD9C2D] flex items-center justify-center shadow-sm">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-[#0A1A2F] text-sm">Coaching Programs</p>
            <p className="text-[10px] text-[#0A1A2F]/45">8-week transformation plans</p>
          </div>
        </div>
        <Link to={createPageUrl('CoachingPlans')}
          className="flex items-center gap-0.5 text-xs font-semibold text-[#3C4E53] hover:opacity-75">
          Browse All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {toShow.map(({ plan, completedDays, isStarted }) => {
          const pct = Math.round((completedDays / plan.days_total) * 100);
          const nextDay = isStarted ? completedDays + 1 : 1;
          return (
            <Link key={plan.id} to={createPageUrl(`CoachingPlanDetail?id=${plan.id}&day=${nextDay}`)}>
              <motion.div whileHover={{ y: -1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`bg-gradient-to-r ${plan.gradient} px-4 py-3 flex items-center gap-3`}>
                  <span className="text-2xl">{plan.cover_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm leading-tight">{plan.title}</p>
                    <p className="text-white/65 text-xs truncate">{plan.subtitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/50 flex-shrink-0" />
                </div>
                {isStarted ? (
                  <div className="px-4 py-2.5">
                    <div className="flex items-center justify-between text-[10px] text-[#0A1A2F]/45 mb-1.5">
                      <span>Day {completedDays} of {plan.days_total}</span>
                      <span className="font-semibold text-[#3C4E53]">{pct}% complete</span>
                    </div>
                    <div className="h-1.5 bg-[#F2F6FA] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3C4E53] to-[#c9a227] rounded-full transition-all"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2.5 flex items-center gap-2">
                    <div className="flex gap-1 flex-wrap">
                      {plan.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-[#F2F6FA] text-[#3C4E53] rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                    <span className="ml-auto text-[10px] font-semibold text-[#3C4E53] whitespace-nowrap">Start →</span>
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Wellness() {
  const [user, setUser] = useState(null);
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();
  const feature = getTimeFeature();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  // ── 3 queries (deduped — mealLogs no longer double-fetched) ──────────────
  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 100),
    enabled: !!user,
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 100),
    enabled: !!user,
  });

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['waterLogs'],
    queryFn: () => base44.entities.WaterLog.list('-date', 100),
    enabled: !!user,
  });

  // Today's stats
  const todayMeals    = mealLogs.filter(m => m.date === today).length;
  const todayWorkouts = workoutSessions.filter(w => w.date === today).length;
  const todayWaterMl  = waterLogs.filter(w => w.date === today).reduce((s, w) => s + (w.amount_ml || 0), 0);

  const activeCoaching = getActiveCoachingPlan();

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-28">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-6 space-y-5">

        {/* 1. Page header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-[#0A1A2F]">Wellness</h1>
          <p className="text-sm text-[#0A1A2F]/50 mt-0.5">Body · Mind · Spirit</p>
        </motion.div>

        {/* 2. Time-aware featured action */}
        <FeaturedCard feature={feature} />

        {/* 3. Today's stats (only when there's something to show) */}
        <TodayStats meals={todayMeals} workouts={todayWorkouts} waterMl={todayWaterMl} />

        {/* 4. Category navigation */}
        <CategoryGrid />

        {/* 5. Coaching Programs */}
        <CoachingSection active={activeCoaching} />

      </div>
    </div>
  );
}
