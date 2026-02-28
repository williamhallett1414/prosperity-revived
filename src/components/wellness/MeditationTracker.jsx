import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Clock } from 'lucide-react';

export default function MeditationTracker({ user }) {
  const { data: sessions = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: () => base44.entities.MeditationSession.list('-date', 100),
    enabled: !!user
  });

  const stats = useMemo(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = sessions.filter(s => new Date(s.date) >= weekAgo);
    const thisMonth = sessions.filter(s => new Date(s.date) >= monthAgo);

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const weekMinutes = thisWeek.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

    // Calculate streak
    let streak = 0;
    let checkDate = new Date(today);
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sessions.some(s => s.date === dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      totalSessions: sessions.length,
      totalMinutes,
      weekMinutes,
      weekSessions: thisWeek.length,
      monthSessions: thisMonth.length,
      currentStreak: streak
    };
  }, [sessions]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Your Progress</h3>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <p className="text-xs text-white/80">Streak</p>
          </div>
          <p className="text-2xl font-bold">{stats.currentStreak}</p>
          <p className="text-xs text-white/70">days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#AFC7E3] to-[#7ab3d4] rounded-xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <p className="text-xs text-white/80">This Week</p>
          </div>
          <p className="text-2xl font-bold">{stats.weekMinutes}</p>
          <p className="text-xs text-white/70">minutes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <p className="text-xs text-white/80">Total</p>
          </div>
          <p className="text-2xl font-bold">{stats.totalSessions}</p>
          <p className="text-xs text-white/70">sessions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#c9a227] to-[#D9B878] rounded-xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <p className="text-xs text-white/80">Total Time</p>
          </div>
          <p className="text-2xl font-bold">{stats.totalMinutes}</p>
          <p className="text-xs text-white/70">minutes</p>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-white/80 mb-3">Recent Sessions</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {sessions.slice(0, 5).map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-900/50 rounded-lg p-3 text-sm text-white/80"
              >
                <div className="flex justify-between items-center">
                  <span className="capitalize">{session.meditation_type}</span>
                  <span className="text-xs font-semibold">{session.duration_minutes}min</span>
                </div>
                <p className="text-xs text-white/50 mt-1">
                  {new Date(session.date).toLocaleDateString()} • {session.mood_before} → {session.mood_after}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}