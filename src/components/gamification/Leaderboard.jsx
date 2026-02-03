import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function Leaderboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: allProgress = [] } = useQuery({
    queryKey: ['allProgress'],
    queryFn: () => base44.entities.UserProgress.list()
  });

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list()
  });

  const leaderboard = allProgress
    .map(p => ({
      ...p,
      user: users.find(u => u.email === p.created_by)
    }))
    .filter(p => p.user)
    .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
    .slice(0, 20);

  const rankIcons = {
    0: <Crown className="w-5 h-5 text-yellow-500" />,
    1: <Medal className="w-5 h-5 text-gray-400" />,
    2: <Medal className="w-5 h-5 text-amber-700" />
  };

  return (
    <div className="space-y-2">
      {leaderboard.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No rankings yet</p>
        </div>
      ) : (
        leaderboard.map((entry, index) => {
          const isCurrentUser = entry.created_by === user?.email;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                isCurrentUser 
                  ? 'bg-amber-100 dark:bg-amber-900 border-2 border-amber-500' 
                  : 'bg-white dark:bg-[#2d2d4a]'
              }`}
            >
              <div className="w-8 text-center font-bold text-gray-600 dark:text-gray-400">
                {rankIcons[index] || `#${index + 1}`}
              </div>
              
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#c9a227] to-[#8fa68a] flex items-center justify-center text-white font-semibold">
                {entry.user.profile_image_url ? (
                  <img src={entry.user.profile_image_url} alt={entry.user.full_name} className="w-full h-full object-cover" />
                ) : (
                  entry.user.full_name?.charAt(0) || entry.user.email.charAt(0)
                )}
              </div>
              
              <div className="flex-1">
                <p className={`font-semibold ${isCurrentUser ? 'text-amber-900 dark:text-amber-100' : 'text-[#1a1a2e] dark:text-white'}`}>
                  {entry.user.full_name || 'User'} {isCurrentUser && '(You)'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Level {entry.level || 1}</p>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-amber-600 dark:text-amber-400">{entry.total_points || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}