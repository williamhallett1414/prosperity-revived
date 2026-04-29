import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  BookOpen, Heart, Dumbbell, Users, Utensils, Play, Sparkles,
  ChevronRight, Flame, Trophy, MessageCircle, CheckCircle2, Circle
} from 'lucide-react';

// ─── Ritual button ──────────────────────────────────────────────────
export function RitualButton({ isMorning, onStartDay, onEndDay }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      id="tour-ritual-btn"
      onClick={isMorning ? onStartDay : onEndDay}
      className="w-full rounded-3xl p-5 text-left shadow-lg dark:shadow-none overflow-hidden relative"
      style={{
        background: isMorning
          ? 'linear-gradient(135deg, #c9a227 0%, #FD9C2D 60%, #FAD98D 100%)'
          : 'linear-gradient(135deg, #0A1A2F 0%, #3C4E53 60%, #AFC7E3 100%)',
      }}
    >
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

// ─── Quick Nav ──────────────────────────────────────────────────────
const QUICK_NAV = [
  { label: 'Bible', icon: BookOpen, page: 'Bible', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
  { label: 'Fitness', icon: Dumbbell, page: 'Wellness', color: 'from-sky-500 to-sky-600', bg: 'bg-sky-50' },
  { label: 'Prayer', icon: Heart, page: 'Prayer', color: 'from-rose-400 to-rose-500', bg: 'bg-rose-50' },
  { label: 'Nutrition', icon: Utensils, page: 'Nutrition', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Community', icon: Users, page: 'Community', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
  { label: 'Couples', icon: Heart, page: 'CouplesMode', color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50' },
];

export function QuickNav() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-3">Explore</p>
      <div className="grid grid-cols-3 gap-3">
        {QUICK_NAV.map(({ label, icon: Icon, page, color, bg }) => (
          <Link key={page} to={createPageUrl(page)}>
            <motion.div whileTap={{ scale: 0.95 }}
              className={`${bg} rounded-2xl p-3.5 flex flex-col items-center gap-2 shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 dark:border-white/10/80`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm dark:shadow-none`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#0A1A2F]/70 dark:text-white/70">{label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Resume card ────────────────────────────────────────────────────
export function ResumeCard({ coachingPlan, readingPlan, readingProgress, navigate }) {
  if (coachingPlan) {
    const { plan, nextDay, pct, completed } = coachingPlan;
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <button
          onClick={() => navigate(createPageUrl(`CoachingPlanDetail?id=${plan.id}&day=${nextDay}`))}
          className="w-full text-left rounded-3xl overflow-hidden shadow-md dark:shadow-none"
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
          className="w-full text-left bg-white dark:bg-white/5 rounded-3xl shadow-sm dark:shadow-none border border-[#FAD98D]/30 overflow-hidden"
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
            <ChevronRight className="w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30 ml-2" />
          </div>
        </button>
      </motion.div>
    );
  }

  return null;
}

// ─── Active Challenges widget ────────────────────────────────────────
export function ActiveChallengesWidget({ user }) {
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

  const active = myParticipations.filter(p => {
    const challenge = allChallenges.find(c => c.id === p.challenge_id);
    if (!challenge) return false;
    return (p.completed_days?.length || 0) < challenge.duration_days;
  }).slice(0, 3);

  if (!active.length) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">Active Challenges</p>
        <button onClick={() => navigate(createPageUrl('Community'))}
          className="text-xs font-bold text-[#c9a227]">See all →</button>
      </div>
      <div className="space-y-2">
        {active.map((p) => {
          const challenge = allChallenges.find(c => c.id === p.challenge_id);
          if (!challenge) return null;
          const completedDays = p.completed_days?.length || 0;
          const progress = Math.min(100, Math.round((completedDays / challenge.duration_days) * 100));
          const checkedToday = p.last_check_in_date === today;
          const streak = p.current_streak || 0;

          const TYPE_VIS = {
            prayer: { emoji: '🙏', color: 'bg-violet-500' },
            reading: { emoji: '📖', color: 'bg-amber-500' },
            workouts: { emoji: '💪', color: 'bg-blue-600' },
            meditation: { emoji: '📵', color: 'bg-slate-600' },
            water_intake: { emoji: '🥗', color: 'bg-green-600' },
            custom: { emoji: '🤝', color: 'bg-emerald-600' },
          };
          const vis = TYPE_VIS[challenge.challenge_type || challenge.type] || TYPE_VIS.custom;

          return (
            <button key={p.id}
              onClick={() => navigate(createPageUrl('Community'))}
              className="w-full text-left bg-white dark:bg-white/5 rounded-2xl p-3.5 border border-[#FAD98D]/15 hover:border-[#c9a227]/30 transition-all shadow-sm dark:shadow-none flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${vis.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-lg">{vis.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-xs text-[#0A1A2F] dark:text-white truncate">{challenge.title}</p>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {streak > 0 && (
                      <span className="text-[10px] font-bold text-orange-500 flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />{streak}
                      </span>
                    )}
                    {checkedToday
                      ? <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">✓ Done</span>
                      : <span className="text-[9px] font-bold text-[#c9a227] bg-white dark:bg-white/5 px-1.5 py-0.5 rounded-full">Check in</span>
                    }
                  </div>
                </div>
                <div className="h-1.5 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${vis.color} transition-all`}
                    style={{ width: `${progress}%`, opacity: 0.7 }} />
                </div>
                <p className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35 mt-0.5">Day {completedDays} of {challenge.duration_days}</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Start Here card ────────────────────────────────────────────────
export function StartHereCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="bg-gradient-to-br from-[#FD9C2D]/10 to-[#FAD98D]/20 border border-[#FD9C2D]/30 rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#FD9C2D]" />
        <h2 className="font-bold text-[#0A1A2F] dark:text-white dark:text-white">Here's where to start</h2>
      </div>
      <div className="space-y-2">
        {[
          { emoji: '📖', title: 'Read today\'s verse', sub: 'Start your spiritual journey', page: 'Bible' },
          { emoji: '📅', title: 'Start a reading plan', sub: 'Build a daily Bible habit', page: 'Plans' },
          { emoji: '💪', title: 'Log your first workout', sub: 'Track your fitness progress', page: 'Workouts' },
        ].map(({ emoji, title, sub, page }) => (
          <Link key={page} to={createPageUrl(page)}>
            <div className="bg-white dark:bg-white/5 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm dark:shadow-none mb-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="font-semibold text-sm text-[#0A1A2F] dark:text-white dark:text-white">{title}</p>
                <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25 ml-auto" />
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}