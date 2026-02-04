import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Award, TrendingUp, Flame, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BadgeCard from '@/components/gamification/BadgeCard';
import Leaderboard from '@/components/gamification/Leaderboard';

const BADGES = [
  { id: 'first_plan', name: 'First Steps', description: 'Complete your first reading plan', icon: '📖', points: 100, requirement: 'reading_plans_completed', value: 1 },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Make 10 community posts', icon: '🦋', points: 150, requirement: 'community_posts', value: 10 },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', points: 200, requirement: 'current_streak', value: 7 },
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '⭐', points: 500, requirement: 'current_streak', value: 30 },
  { id: 'fitness_fan', name: 'Fitness Fan', description: 'Complete 20 workouts', icon: '💪', points: 250, requirement: 'workouts_completed', value: 20 },
  { id: 'meditation_master', name: 'Meditation Master', description: 'Complete 15 meditation sessions', icon: '🧘', points: 200, requirement: 'meditations_completed', value: 15 },
  { id: 'friend_maker', name: 'Friend Maker', description: 'Connect with 5 friends', icon: '👥', points: 100, requirement: 'friends_count', value: 5 },
  { id: 'commentator', name: 'Commentator', description: 'Leave 25 comments', icon: '💬', points: 150, requirement: 'comments_count', value: 25 },
  { id: 'messenger', name: 'Messenger', description: 'Send 50 messages', icon: '✉️', points: 100, requirement: 'messages_sent', value: 50 },
  { id: 'photographer', name: 'Photographer', description: 'Upload 10 photos', icon: '📸', points: 100, requirement: 'photos_uploaded', value: 10 },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '🌟', points: 250, requirement: 'level', value: 5 },
  { id: 'level_10', name: 'Community Leader', description: 'Reach level 10', icon: '👑', points: 500, requirement: 'level', value: 10 }
];

export default function Achievements() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const all = await base44.entities.UserProgress.list();
      return all.find(p => p.created_by === user?.email);
    },
    enabled: !!user
  });

  const earnedBadges = BADGES.filter(b => progress?.badges?.includes(b.id));
  const availableBadges = BADGES.filter(b => !progress?.badges?.includes(b.id));

  const pointsToNextLevel = ((progress?.level || 1) * 100) - (progress?.total_points || 0) % ((progress?.level || 1) * 100);

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white px-4 py-6">
        <Link
          to={createPageUrl('Profile')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 inline-flex"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold mb-2">Achievements</h1>
        <p className="text-white/80 text-sm">Track your journey and progress</p>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Level</span>
            </div>
            <p className="text-3xl font-bold text-[#1a1a2e] dark:text-white">{progress?.level || 1}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{pointsToNextLevel} pts to next</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Points</span>
            </div>
            <p className="text-3xl font-bold text-[#1a1a2e] dark:text-white">{progress?.total_points || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{earnedBadges.length} badges</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm text-white/80">Current Streak</span>
            </div>
            <p className="text-3xl font-bold">{progress?.current_streak || 0}</p>
            <p className="text-xs text-white/80">days</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Best Streak</span>
            </div>
            <p className="text-3xl font-bold text-[#1a1a2e] dark:text-white">{progress?.longest_streak || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4">
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/50 dark:bg-[#2d2d4a]/50 backdrop-blur-sm p-1 rounded-xl">
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-6">
            {earnedBadges.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white mb-3">Earned ({earnedBadges.length})</h2>
                <div className="grid grid-cols-2 gap-3">
                  {earnedBadges.map((badge, i) => (
                    <BadgeCard key={badge.id} badge={badge} earned={true} index={i} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white mb-3">Available</h2>
              <div className="grid grid-cols-2 gap-3">
                {availableBadges.map((badge, i) => {
                  const currentValue = progress?.[badge.requirement] || 0;
                  const progressPercent = Math.min((currentValue / badge.value) * 100, 100);
                  return (
                    <BadgeCard 
                      key={badge.id} 
                      badge={badge} 
                      earned={false} 
                      progress={progressPercent}
                      index={i} 
                    />
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}