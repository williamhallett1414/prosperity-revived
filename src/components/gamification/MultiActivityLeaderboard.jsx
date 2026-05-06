import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Target } from 'lucide-react';
import { getDisplayName } from '@/lib/userName';

const BOARDS = [
  { id: 'points',      label: 'Points',     icon: Trophy, gradient: 'from-[#c9a227] to-[#FAD98D]'  },
  { id: 'workouts',    label: 'Workouts',   icon: Zap,    gradient: 'from-[#0A1A2F] to-[#0A1A2F]'  },
  { id: 'streak',      label: 'Streak',     icon: Flame,  gradient: 'from-[#AFC7E3] to-[#3C4E53]'  },
  { id: 'meditations', label: 'Mind',       icon: Target, gradient: 'from-[#FAD98D] to-[#c9a227]'  },
];

const RANK_STYLES = [
  'bg-gradient-to-r from-[#FAD98D]/40 to-[#FAD98D]/20 border border-[#c9a227]/30',
  'bg-gradient-to-r from-[#F2F6FA] to-[#E8EEF4]',
  'bg-gradient-to-r from-[#FAD98D]/15 to-[#F2F6FA]',
  'bg-white dark:bg-white/5',
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
    .map(p => ({ ...p, userName: getDisplayName(userMap.get(p.created_by), 'Anonymous') }))
    .sort((a, b) => getValue(b, selected) - getValue(a, selected))
    .slice(0, 10);

  const board = BOARDS.find(b => b.id === selected);
  const maxVal = Math.max(...ranked.map(u => getValue(u, selected)), 1);

  return (
    <div className="space-y-4">
      {/* Board selector */}
      <div className="grid grid-cols-4 gap-2">
        {BOARDS.map(({ id, label, icon: Icon, gradient }) => (
          <button key={id} onClick={() => setSelected(id)}
            className={`rounded-xl py-2.5 flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
              selected === id
                ? `bg-gradient-to-br ${gradient} text-white shadow-sm dark:shadow-none`
                : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5'
            }`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Rankings */}
      <div className="space-y-2">
        {ranked.map((user, i) => {
          const val = getValue(user, selected);
          const pct = (val / maxVal) * 100;
          return (
            <motion.div key={user.created_by}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className={`relative overflow-hidden rounded-2xl p-3.5 ${RANK_STYLES[Math.min(i, 3)]}`}>
              {/* Background progress fill */}
              <div className={`absolute inset-0 bg-gradient-to-r ${board.gradient} opacity-[0.06] rounded-2xl`}
                style={{ width: `${pct}%` }} />
              <div className="relative flex items-center gap-3">
                <span className="text-lg font-bold w-8 text-center flex-shrink-0">{getMedal(i)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0A1A2F] dark:text-white text-sm truncate">{user.userName}</p>
                  <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">Level {user.level || 1}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[#0A1A2F] dark:text-white dark:text-white">{val}</p>
                  {selected === 'points' && (
                    <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">{user.badges?.length || 0} badges</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {ranked.length === 0 && (
          <p className="text-center text-[#0A1A2F]/40 dark:text-white/40 text-sm py-8">No data yet — be the first!</p>
        )}
      </div>

      {/* Tips */}
      <div className="bg-[#FAD98D]/15 dark:bg-[#FAD98D]/8 border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 rounded-2xl p-4 text-sm text-[#0A1A2F]/70 dark:text-white/70 space-y-1">
        <p className="font-semibold text-[#0A1A2F] dark:text-white text-xs uppercase tracking-wide mb-2">How to climb the ranks</p>
        <p>🏆 Complete activities and challenges to earn points</p>
        <p>🔥 Maintain your daily streak for consistent gains</p>
        <p>💪 Log workouts and meditation sessions regularly</p>
      </div>
    </div>
  );
}
