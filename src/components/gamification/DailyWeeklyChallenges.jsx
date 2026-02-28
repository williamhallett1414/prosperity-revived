import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Zap, Calendar, Target, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';

const DIFFICULTY_COLORS = {
  easy: 'from-green-500 to-emerald-600',
  medium: 'from-yellow-500 to-orange-600',
  hard: 'from-red-500 to-[#c9a227]'
};

export default function DailyWeeklyChallenges({ user }) {
  const [challenges, setChallenges] = useState([]);
  const queryClient = useQueryClient();

  const { data: dailyChallenges = [] } = useQuery({
    queryKey: ['dailyChallenges'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const all = await base44.entities.DailyChallenge.list('-created_date', 50);
      return all.filter(c => c.date === today && c.is_active);
    },
    enabled: !!user
  });

  const { data: weeklyChallenges = [] } = useQuery({
    queryKey: ['weeklyChallenges'],
    queryFn: async () => {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekStartStr = weekStart.toISOString().split('T')[0];
      
      const all = await base44.entities.DailyChallenge.list('-created_date', 50);
      return all.filter(c => c.is_weekly && c.week_start === weekStartStr && c.is_active);
    },
    enabled: !!user
  });

  const { data: completions = [] } = useQuery({
    queryKey: ['challengeCompletions', user?.email],
    queryFn: () => base44.entities.ChallengeCompletion.list(),
    enabled: !!user
  });

  const completionMutation = useMutation({
    mutationFn: async (challenge) => {
      const completion = await base44.entities.ChallengeCompletion.create({
        challenge_id: challenge.id,
        user_email: user?.email,
        completion_date: new Date().toISOString().split('T')[0],
        bonus_points_earned: challenge.bonus_points
      });

      // Award bonus points
      await awardPoints(user?.email, challenge.bonus_points, { 
        challenge_completed: 1 
      });
      await checkAndAwardBadges(user?.email);

      return completion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['challengeCompletions']);
      queryClient.invalidateQueries(['userProgress']);
    }
  });

  const isChallengeCompleted = (challengeId) => {
    const today = new Date().toISOString().split('T')[0];
    return completions.some(c => c.challenge_id === challengeId && c.completion_date === today);
  };

  const ChallengeCard = ({ challenge, isCompleted }) => {
    const Icon = challenge.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="relative"
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className={`h-1 bg-gradient-to-r ${DIFFICULTY_COLORS[challenge.difficulty]}`} />
          
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <CardTitle className="text-base">{challenge.title}</CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{challenge.description}</p>
              </div>
              <span className="text-2xl">{challenge.icon}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Difficulty Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                {challenge.difficulty} Challenge
              </span>
              <span className="text-sm font-bold text-emerald-600">+{challenge.bonus_points} pts</span>
            </div>

            {/* Target Info */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Target: <span className="font-bold text-gray-900 dark:text-white">{challenge.target_value}</span>
              </p>
              <Progress value={25} className="h-2" />
            </div>

            {/* Action Button */}
            {isCompleted ? (
              <Button disabled className="w-full bg-emerald-500 hover:bg-emerald-600">
                <Check className="w-4 h-4 mr-2" />
                Completed Today
              </Button>
            ) : (
              <Button
                onClick={() => completionMutation.mutate(challenge)}
                disabled={completionMutation.isPending}
                className="w-full bg-gradient-to-r from-[#b89320] to-[#c9a227] hover:from-[#b89320] hover:to-[#c9a227]"
              >
                {completionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Complete Challenge
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#b89320] to-[#c9a227] rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7" />
          <h2 className="text-xl font-bold">Daily & Weekly Challenges</h2>
        </div>
        <p className="text-white/90 text-sm">
          Complete challenges to earn bonus points and level up faster!
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Weekly
          </TabsTrigger>
        </TabsList>

        {/* Daily Challenges */}
        <TabsContent value="daily" className="space-y-4 mt-4">
          {dailyChallenges.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-gray-500">No daily challenges available today. Check back tomorrow!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {dailyChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isCompleted={isChallengeCompleted(challenge.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Weekly Challenges */}
        <TabsContent value="weekly" className="space-y-4 mt-4">
          {weeklyChallenges.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <p className="text-gray-500">No weekly challenges this week.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {weeklyChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isCompleted={isChallengeCompleted(challenge.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Challenge Info */}
      <Card className="bg-[#F2F6FA] dark:bg-[#0A1A2F]/20 border-[#AFC7E3]/40 dark:border-blue-800">
        <CardContent className="pt-6 space-y-2 text-sm text-blue-900 dark:text-blue-200">
          <p>💡 <strong>Tip:</strong> Daily challenges reset every 24 hours. Weekly challenges span a full week.</p>
          <p>⭐ <strong>Bonus:</strong> Complete all challenges this week for a special achievement!</p>
        </CardContent>
      </Card>
    </div>
  );
}