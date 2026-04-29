import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Flame, Crown, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BadgeCard from '@/components/gamification/BadgeCard';
import MultiActivityLeaderboard from '@/components/gamification/MultiActivityLeaderboard';
import DailyWeeklyChallenges from '@/components/gamification/DailyWeeklyChallenges';
import { BADGES } from '@/components/gamification/ProgressManager';

// Level formula matches ProgressManager: level = floor(total / 500) + 1
// So points needed for level N = (N - 1) * 500, next level at N * 500
function getXp(progress) {
  const total   = progress?.total_points || 0;
  const level   = progress?.level || 1;
  const floor   = (level - 1) * 500;  // points at start of current level
  const ceiling = level * 500;         // points needed to reach next level
  const inLevel = total - floor;
  const span    = ceiling - floor;     // always 500
  return { total, level, inLevel, span, toNext: span - inLevel };
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
function StatChip({ icon: Icon, label, value, sub, bg, accent }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={`${bg} rounded-2xl p-4 border border-[#FAD98D]/25`}>
      <Icon className={`w-4 h-4 ${accent} mb-2`} />
      <p className="text-2xl font-bold text-[#0A1A2F] dark:text-white dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-[#0A1A2F]/60 dark:text-white/60 leading-tight">{label}</p>
      {sub && <p className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'badges',      label: 'Badges'      },
  { id: 'challenges',  label: 'Challenges'  },
  { id: 'leaderboard', label: 'Leaderboard' },
];

function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-2 mb-5">
      {TABS.map(({ id, label }) => (
        <button key={id} onClick={() => onChange(id)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            active === id
              ? 'bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white shadow-sm dark:shadow-none'
              : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border border-[#FAD98D]/25'
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Achievements() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('badges');
  const navigate = useNavigate();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  // Fixed: filter by email instead of list() + find()
  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      const list = await base44.entities.UserProgress.filter({ created_by: user.email });
      return list[0] || null;
    },
    enabled: !!user?.email,
  });

  const earned    = BADGES.filter(b =>  progress?.badges?.includes(b.id));
  const available = BADGES.filter(b => !progress?.badges?.includes(b.id));
  const xp        = getXp(progress);
  const xpPct     = Math.round((xp.inLevel / xp.span) * 100);

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ── Hero header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 px-4 pt-0 pb-2">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center flex-shrink-0">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Achievements</h1>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Your badges & milestones</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* ── Stat grid (overlaps header) ── */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatChip icon={Sparkles}   label="Badges Earned"   value={earned.length}
            sub={`${available.length} remaining`}
            bg="bg-gradient-to-br from-[#FAD98D]/30 to-[#FAD98D]/15" accent="text-[#c9a227]" />
          <StatChip icon={TrendingUp} label="Total Points"    value={xp.total}
            sub={`Level ${xp.level}`}
            bg="bg-white dark:bg-white/5" accent="text-[#c9a227]" />
          <StatChip icon={Flame}      label="Current Streak"  value={progress?.current_streak || 0}
            sub="days"
            bg="bg-gradient-to-br from-[#0A1A2F]/8 to-[#0A1A2F]/4" accent="text-[#0A1A2F] dark:text-white dark:text-white" />
          <StatChip icon={Trophy}     label="Best Streak"     value={progress?.longest_streak || 0}
            sub="days"
            bg="bg-white dark:bg-white/5" accent="text-[#c9a227]" />
        </div>

        {/* ── Tabs ── */}
        <TabBar active={tab} onChange={setTab} />

        {/* BADGES */}
        {tab === 'badges' && (
          <div className="space-y-5">
            {earned.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-3">
                  Earned ({earned.length})
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {earned.map((b, i) => <BadgeCard key={b.id} badge={b} earned index={i} />)}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-3">
                Available ({available.length})
              </p>
              <div className="grid grid-cols-2 gap-3">
                {available.map((b, i) => {
                  const field = b.requirement.field || b.requirement.external;
                  const cur   = progress?.[field] || 0;
                  const pct   = Math.min((cur / b.requirement.value) * 100, 100);
                  return <BadgeCard key={b.id} badge={b} earned={false} progress={pct} index={i} />;
                })}
              </div>
            </div>
          </div>
        )}

        {/* CHALLENGES */}
        {tab === 'challenges' && <DailyWeeklyChallenges user={user} />}

        {/* LEADERBOARD */}
        {tab === 'leaderboard' && <MultiActivityLeaderboard />}
      </div>
    </div>
  );
}