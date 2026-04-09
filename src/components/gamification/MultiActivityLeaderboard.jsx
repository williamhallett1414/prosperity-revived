import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Brain } from 'lucide-react';

const BOARDS = [
  { id: 'points',      label: 'Points',     icon: Trophy, gradient: 'from-amber-500 to-yellow-300',   color: '#c9a227',  unit: 'pts'  },
  { id: 'workouts',    label: 'Workouts',   icon: Zap,    gradient: 'from-blue-700 to-blue-500',      color: '#1d4ed8',  unit: 'done' },
  { id: 'streak',      label: 'Streak',     icon: Flame,  gradient: 'from-orange-500 to-red-400',     color: '#ea580c',  unit: 'days' },
  { id: 'meditations', label: 'Mind',       icon: Brain,  gradient: 'from-purple-600 to-violet-400',  color: '#7c3aed',  unit: 'done' },
];

const RANK_STYLES = [
  'bg-gradient-to-r from-[#FAD98D]/40 to-[#FAD98D]/20 border border-[#c9a227]/30',
  'bg-gradient-to-r from-[#F2F6FA] to-[#E8EEF4]',
  'bg-gradient-to-r from-[#FAD98D]/15 to-[#F2F6FA]',
  'bg-white',
];

function getMedal(rank) {
  if (rank === 0) return '🥇';
  if (rank === 1) return '🥈';
  if (rank === 2) return '🥉';
  return `#${rank + 1}`;
}

function getValue(user, board) {
  switch (board) {
    case 'points':      return user.total_points      || 0;
    case 'workouts':    return user.workouts_completed || 0;
    case 'streak':      return user.current_streak    || 0;
    case 'meditations': return user.meditations_completed || 0;
    default:            return 0;
  }
}

export default function MultiActivityLeaderboard() {
  const [selected, setSelected] = useState('points');

  const { data: allProgress = [] } = useQuery({
    queryKey: ['allUserProgress'],
    queryFn: () => base44.entities.UserProgress.list(),
  });
  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const userMap = new Map(allUsers.map(u => [u.email, u]));
  const ranked = allProgress
    .map(p => ({ ...p, userName: userMap.get(p.created_by)?.full_name || 'Anonymous' }))
    .sort((a, b) => getValue(b, selected) - getValue(a, selected))
    .slice(0, 10);

  const board = BOARDS.find(b => b.id === selected);
  const maxVal = Math.max(...ranked.map(u => getValue(u, selected)), 1);

  // Top 3 for podium
  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <div className="space-y-5">
      {/* Board selector */}
      <div className="grid grid-cols-4 gap-2">
        {BOARDS.map(({ id, label, icon: Icon, gradient, color }) => (
          <button key={id} onClick={() => setSelected(id)}
            className={`rounded-2xl py-3 flex flex-col items-center gap-1.5 text-[11px] font-bold transition-all border-2 ${
              selected === id
                ? `bg-gradient-to-br ${gradient} text-white shadow-lg border-transparent`
                : 'bg-white text-[#0A1A2F]/45 border-gray-100 hover:border-gray-200'
            }`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Podium — top 3 */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-3 pt-2">
          {[top3[1], top3[0], top3[2]].filter(Boolean).map((user, podiumIdx) => {
            // display order: 2nd, 1st, 3rd — so heights differ
            const realIdx = ranked.indexOf(user);
            const heights = top3.length === 1 ? [0, 80, 0] : [64, 96, 52];
            const medals  = ['🥇','🥈','🥉'];
            const barH    = podiumIdx === 1 ? heights[1] : podiumIdx === 0 ? heights[0] : heights[2];
            const val     = getValue(user, selected);
            return (
              <motion.div key={user.created_by}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: podiumIdx * 0.08 }}
                className="flex flex-col items-center gap-1 flex-1 min-w-0">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md bg-gradient-to-br ${board.gradient}`}>
                  {user.userName?.[0]?.toUpperCase() || '?'}
                </div>
                <p className="text-[10px] font-bold text-[#0A1A2F] truncate w-full text-center">{user.userName}</p>
                <p className="text-[9px] text-[#0A1A2F]/40">Lv {user.level || 1}</p>
                {/* Podium block */}
                <div className={`w-full rounded-t-xl flex flex-col items-center justify-start pt-2 gap-0.5 bg-gradient-to-b ${board.gradient} text-white`}
                  style={{ height: barH }}>
                  <span className="text-base leading-none">{medals[realIdx]}</span>
                  <span className="text-[11px] font-black">{val}</span>
                  <span className="text-[8px] opacity-70">{board.unit}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((user, i) => {
            const val = getValue(user, selected);
            const pct = (val / maxVal) * 100;
            const rank = i + 4;
            return (
              <motion.div key={user.created_by}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-3.5">
                <div className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${board.gradient} opacity-[0.07] rounded-2xl`}
                  style={{ width: `${pct}%` }} />
                <div className="relative flex items-center gap-3">
                  <span className="text-xs font-black text-[#0A1A2F]/30 w-6 text-center flex-shrink-0">#{rank}</span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${board.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {user.userName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0A1A2F] text-sm truncate">{user.userName}</p>
                    <p className="text-[10px] text-[#0A1A2F]/35">Level {user.level || 1}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-[#0A1A2F]">{val}</p>
                    <p className="text-[10px] text-[#0A1A2F]/35">{board.unit}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {ranked.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-[#FAD98D]" />
          <p className="text-sm text-[#0A1A2F]/40">No data yet — be the first!</p>
        </div>
      )}
    </div>
  );
}