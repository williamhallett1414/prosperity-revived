import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Flame, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { updateStreak } from './ProgressManager';

export default function GamificationBanner() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      await updateStreak(u.email);
    });
  }, []);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const all = await base44.entities.UserProgress.list();
      return all.find(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  if (!progress) return null;

  return (
    <Link to={createPageUrl('Achievements')}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#FAD98D]/30 to-[#AFC7E3]/30 border border-[#D9B878]/40 rounded-2xl p-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#D9B878]/30 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-[#c9a227]" />
            </div>
            <div>
              <p className="font-semibold text-[#0A1A2F]">Level {progress.level || 1}</p>
              <p className="text-sm text-[#0A1A2F]/60">{progress.total_points || 0} points</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <Flame className="w-4 h-4" />
                <span className="font-bold text-lg">{progress.current_streak || 0}</span>
              </div>
              <p className="text-xs text-white/80">streak</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="font-bold text-lg">{progress.badges?.length || 0}</span>
              </div>
              <p className="text-xs text-white/80">badges</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}