import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LEADERBOARD_TYPES = [
  { id: 'points', label: 'Total Points', icon: Trophy, color: 'text-yellow-500', gradient: 'from-yellow-400 to-orange-500' },
  { id: 'workouts', label: 'Workouts', icon: Zap, color: 'text-emerald-500', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'streak', label: 'Current Streak', icon: Flame, color: 'text-red-500', gradient: 'from-red-400 to-pink-500' },
  { id: 'meditations', label: 'Meditations', icon: Target, color: 'text-purple-500', gradient: 'from-purple-400 to-indigo-500' }
];

export default function MultiActivityLeaderboard() {
  const [selectedBoard, setSelectedBoard] = useState('points');

  const { data: allProgress = [] } = useQuery({
    queryKey: ['allUserProgress'],
    queryFn: () => base44.entities.UserProgress.list(),
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const getRankedUsers = () => {
    const userMap = new Map(allUsers.map(u => [u.email, u]));

    const ranked = allProgress
      .map(p => {
        const user = userMap.get(p.created_by);
        return {
          ...p,
          userName: user?.full_name || 'Anonymous',
          userEmail: p.created_by
        };
      })
      .sort((a, b) => {
        switch(selectedBoard) {
          case 'points':
            return (b.total_points || 0) - (a.total_points || 0);
          case 'workouts':
            return (b.workouts_completed || 0) - (a.workouts_completed || 0);
          case 'streak':
            return (b.current_streak || 0) - (a.current_streak || 0);
          case 'meditations':
            return (b.meditations_completed || 0) - (a.meditations_completed || 0);
          default:
            return 0;
        }
      })
      .slice(0, 10);

    return ranked;
  };

  const getMedalEmoji = (rank) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `#${rank + 1}`;
  };

  const getValueForType = (user) => {
    switch(selectedBoard) {
      case 'points':
        return user.total_points || 0;
      case 'workouts':
        return user.workouts_completed || 0;
      case 'streak':
        return user.current_streak || 0;
      case 'meditations':
        return user.meditations_completed || 0;
      default:
        return 0;
    }
  };

  const rankedUsers = getRankedUsers();
  const currentBoardInfo = LEADERBOARD_TYPES.find(b => b.id === selectedBoard);
  const CurrentIcon = currentBoardInfo?.icon || Trophy;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-7 h-7" />
          <h2 className="text-xl font-bold">Leaderboards</h2>
        </div>
        <p className="text-white/90 text-sm">
          Compete with the community and climb the ranks!
        </p>
      </motion.div>

      {/* Leaderboard Tabs */}
      <Tabs value={selectedBoard} onValueChange={setSelectedBoard} className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-1 bg-white/50 backdrop-blur-sm p-1">
          {LEADERBOARD_TYPES.map(type => (
            <TabsTrigger 
              key={type.id} 
              value={type.id}
              className="text-xs flex items-center justify-center gap-1"
            >
              <type.icon className="w-3 h-3" />
            </TabsTrigger>
          ))}
        </TabsList>

        {LEADERBOARD_TYPES.map(boardType => (
          <TabsContent key={boardType.id} value={boardType.id} className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <boardType.icon className={`w-5 h-5 ${boardType.color}`} />
                  {boardType.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rankedUsers.map((user, index) => {
                    const value = getValueForType(user);
                    const maxValue = Math.max(...rankedUsers.map(u => getValueForType(u)), 1);
                    const percentage = (value / maxValue) * 100;

                    return (
                      <motion.div
                        key={user.userEmail}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative overflow-hidden rounded-lg p-4 ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30' :
                          index === 1 ? 'bg-gradient-to-r from-gray-100 to-zinc-100 dark:from-gray-800 dark:to-zinc-800' :
                          index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20' :
                          'bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        {/* Background bar */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${boardType.gradient} opacity-10`}
                          style={{ width: `${percentage}%` }}
                        />

                        {/* Content */}
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold w-8 text-center">
                              {getMedalEmoji(index)}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white truncate">
                                {user.userName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Level {user.level || 1}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {value}
                              </p>
                              {selectedBoard === 'points' && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {user.badges?.length || 0} badges
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {rankedUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No data available yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Leaderboard Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6 space-y-2 text-sm text-blue-900 dark:text-blue-200">
          <p>🏆 <strong>How to climb the ranks:</strong></p>
          <ul className="ml-4 space-y-1 list-disc">
            <li>Earn points by completing activities and challenges</li>
            <li>Maintain your streak for consistent engagement</li>
            <li>Complete workouts and meditation sessions regularly</li>
            <li>Leaderboards reset monthly to give everyone a fair chance</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}