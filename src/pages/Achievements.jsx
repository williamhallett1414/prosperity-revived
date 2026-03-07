import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Flame, Crown, TrendingUp, Sparkles } from 'lucide-react';
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
      <p className="text-2xl font-bold text-[#0A1A2F]">{value}</p>
      <p className="text-xs font-semibold text-[#0A1A2F]/60 leading-tight">{label}</p>
      {sub && <p className="text-[10px] text-[#0A1A2F]/35 mt-0.5">{sub}</p>}
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
              ? 'bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white shadow-sm'
              : 'bg-white text-[#0A1A2F]/50 border border-[#FAD98D]/25'
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

  useEffect(() => { base44.auth.me().then(setUser); }, []);

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
    <div className="min-h-screen bg-[#F2F6FA] pb-28">

      {/* ── Hero header ── */}
      <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] px-4 pt-5 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Achievements</h1>
              <p className="text-white/50 text-xs">Badges · Challenges · Leaderboard</p>
            </div>
          </div>

          {/* Level + XP bar */}
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#FAD98D]" />
                <span className="font-bold text-white text-sm">Level {xp.level}</span>
              </div>
              <span className="text-[#FAD98D] text-xs font-semibold">{xp.toNext} pts to next level</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${xpPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] rounded-full"
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-white/35">{xp.inLevel} / {xp.span} XP</span>
              <span className="text-[10px] text-white/35">{xp.total} total pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* ── Stat grid (overlaps header) ── */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatChip icon={Sparkles}   label="Badges Earned"   value={earned.length}
            sub={`${available.length} remaining`}
            bg="bg-gradient-to-br from-[#FAD98D]/30 to-[#FAD98D]/15" accent="text-[#c9a227]" />
          <StatChip icon={TrendingUp} label="Total Points"    value={xp.total}
            sub={`Level ${xp.level}`}
            bg="bg-white" accent="text-[#c9a227]" />
          <StatChip icon={Flame}      label="Current Streak"  value={progress?.current_streak || 0}
            sub="days"
            bg="bg-gradient-to-br from-[#0A1A2F]/8 to-[#0A1A2F]/4" accent="text-[#0A1A2F]" />
          <StatChip icon={Trophy}     label="Best Streak"     value={progress?.longest_streak || 0}
            sub="days"
            bg="bg-white" accent="text-[#c9a227]" />
        </div>

        {/* ── Tabs ── */}
        <TabBar active={tab} onChange={setTab} />

        {/* BADGES */}
        {tab === 'badges' && (
          <div className="space-y-5">
            {earned.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-3">
                  Earned ({earned.length})
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {earned.map((b, i) => <BadgeCard key={b.id} badge={b} earned index={i} />)}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-3">
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
