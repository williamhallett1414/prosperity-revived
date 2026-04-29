import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Target, TrendingUp, Trophy, CheckCircle2,
  Sparkles, ChevronRight,
  Flame, Crown, Calendar
} from 'lucide-react';
import { format } from 'date-fns';

import HolisticProgressReport from '@/components/journey/HolisticProgressReport';
import HannahBookmarksSection from '@/components/journey/HannahBookmarksSection';
import CoachingSection from '@/components/journey/CoachingSection';

// ─── Chatbot config ────────────────────────────────────────────────────────────
const CHATBOTS = [
  { key: 'Hannah',    name: 'Hannah',       icon: '🧠', label: 'Mind & Growth',  gradient: 'from-[#AFC7E3] to-[#AFC7E3]' },
  { key: 'CoachDavid', name: 'Coach David', icon: '💪', label: 'Fitness',        gradient: 'from-[#0A1A2F] to-[#38BDF8]' },
  { key: 'ChefDaniel', name: 'Chef Daniel', icon: '🍽️', label: 'Nutrition',      gradient: 'from-[#22C55E]/80 to-[#22c55e]' },
  { key: 'Gideon',   name: 'Gideon',       icon: '📖', label: 'Scripture',      gradient: 'from-[#c9a227] to-[#FAD98D]' },
];

const MEMORY_ICONS = {
  goal:        { icon: Target,       color: 'text-[#AFC7E3]',  bg: 'bg-[#AFC7E3]/15' },
  milestone:   { icon: TrendingUp,   color: 'text-[#c9a227]',  bg: 'bg-[#FAD98D]/20' },
  achievement: { icon: Trophy,       color: 'text-yellow-500', bg: 'bg-yellow-50'      },
  success:     { icon: CheckCircle2, color: 'text-green-500',  bg: 'bg-green-50'       },
};

// ─── Streak / level banner ─────────────────────────────────────────────────────
function ProgressBanner({ progress }) {
  if (!progress) return null;
  const level   = progress.level || 1;
  const streak  = progress.current_streak || 0;
  const badges  = progress.badges?.length || 0;
  const points  = progress.total_points || 0;

  return (
    <Link to={createPageUrl('Achievements')}>
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#0A1A2F] to-[#AFC7E3] rounded-2xl p-4 flex items-center gap-4 shadow-md dark:shadow-none hover:opacity-90 transition-opacity"
      >
        <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm">Level {level}</p>
          <p className="text-white/60 text-xs">{points} total points</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {streak > 0 && (
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Flame className="w-4 h-4 text-white" />
                <span className="font-bold text-white">{streak}</span>
              </div>
              <p className="text-[10px] text-white/60">streak</p>
            </div>
          )}
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Trophy className="w-4 h-4 text-white" />
              <span className="font-bold text-white">{badges}</span>
            </div>
            <p className="text-[10px] text-white/60">badges</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Guides grid ───────────────────────────────────────────────────────────────
function GuidesGrid({ onOpen }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-3">Chat with Your Guides</p>
      <div className="grid grid-cols-2 gap-3">
        {CHATBOTS.map(({ key, name, icon, label, gradient }) => (
          <button key={key} onClick={() => onOpen(key)}
            className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 flex flex-col items-start gap-2 text-left hover:opacity-90 active:scale-95 transition-all shadow-sm dark:shadow-none`}>
            <span className="text-2xl leading-none">{icon}</span>
            <div>
              <p className="font-bold text-white text-sm leading-tight">{name}</p>
              <p className="text-white/65 text-[11px]">{label}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Recent milestones ─────────────────────────────────────────────────────────
function RecentMilestones({ memories }) {
  const recent = memories.slice(0, 6);
  if (recent.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">Recent Milestones</p>
        <span className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30">{memories.length} total</span>
      </div>
      <div className="space-y-2">
        {recent.map((memory) => {
          const cfg  = MEMORY_ICONS[memory.memory_type] || MEMORY_ICONS.goal;
          const Icon = cfg.icon;
          return (
            <div key={memory.id}
              className="bg-white dark:bg-white/5 rounded-2xl p-3.5 flex items-start gap-3 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-wide capitalize">{memory.memory_type}</span>
                  <span className="text-[10px] text-[#0A1A2F]/25 dark:text-white/25 flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5" />{format(new Date(memory.created_date), 'MMM d')}
                  </span>
                </div>
                <p className="text-sm text-[#0A1A2F] dark:text-white leading-snug line-clamp-2">{memory.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── New user onboarding nudge ─────────────────────────────────────────────────
function StartHereCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#FAD98D]/20 to-[#AFC7E3]/15 rounded-2xl p-5 border border-[#FAD98D]/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Your journey starts here</p>
          <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">Insights appear as you log activity</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { page: 'Bible',    emoji: '📖', label: 'Read Bible'   },
          { page: 'Workouts', emoji: '💪', label: 'Log Workout'  },
          { page: 'Prayer',   emoji: '🙏', label: 'Pray'         },
        ].map(({ page, emoji, label }) => (
          <Link key={page} to={createPageUrl(page)}>
            <div className="bg-white dark:bg-white/5 rounded-xl p-3 text-center hover:shadow-sm dark:shadow-none transition-shadow min-h-[64px] flex flex-col items-center justify-center gap-1">
              <p className="text-xl">{emoji}</p>
              <p className="text-xs font-medium text-[#0A1A2F]/70 dark:text-white/70 leading-tight">{label}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function ProgressDashboard() {
  const navigate = useNavigate();

  const openBot = (key) => navigate(createPageUrl(`ChatScreen?bot=${key}`));

  // ── 3 queries (chatbot context is now lazy — fetched only when that chatbot opens) ──
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => { try { return await base44.auth.me(); } catch { return null; } },
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      try { const list = await base44.entities.UserProgress.filter({ created_by: user.email }); return list[0] || null; }
      catch { return null; }
    },
    enabled: !!user?.email,
  });

  const { data: allMemories = [], isLoading } = useQuery({
    queryKey: ['allChatbotMemories', user?.email],
    queryFn: async () => {
      try {
        const m = await base44.entities.ChatbotMemory.filter({
          created_by: user.email,
          memory_type: ['goal', 'milestone', 'achievement', 'success'],
        });
        return m.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      } catch { return []; }
    },
    enabled: !!user?.email,
    initialData: [],
  });

  const hasActivity = allMemories.length > 0 || userProgress?.workouts_completed || userProgress?.prayers_logged;

  const hasActivePlan = Object.keys(localStorage).some(k =>
    k.startsWith('coaching_progress_') &&
    (() => { try { return (JSON.parse(localStorage.getItem(k))?.completed_days?.length || 0) > 0; } catch { return false; } })()
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#0A1A2F]/50 dark:text-white/50 text-sm">Loading your journey…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#AFC7E3] to-[#3C4E53] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">My Progress</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Your growth journey</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 pb-6 space-y-5">

        {/* 1. Page header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-[#0A1A2F] dark:text-white dark:text-white">Your Journey</h1>
          <p className="text-sm text-[#0A1A2F]/50 dark:text-white/50 mt-0.5">Progress across all areas of growth</p>
        </motion.div>

        {/* 2. Streak / level banner (taps to Achievements) */}
        <ProgressBanner progress={userProgress} />

        {/* 3. New user nudge — only shown with no activity */}
        {!hasActivity && <StartHereCard />}

        {/* 4. Active coaching plan */}
        {hasActivePlan && <CoachingSection />}

        {/* 5. Holistic progress report (only when there are memories to analyse) */}
        {allMemories.length > 0 && <HolisticProgressReport user={user} />}

        {/* 6. Chat with Guides */}
        <GuidesGrid onOpen={openBot} />

        {/* 7. Recent milestones */}
        <RecentMilestones memories={allMemories} />

        {/* 8. Hannah bookmarks */}
        {user?.email && <HannahBookmarksSection userEmail={user.email} />}

      </div>
    </div>
  );
}

