import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, TrendingUp, Users, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChallengeLeaderboard from '@/components/challenges/ChallengeLeaderboard';
import LogProgressModal from '@/components/challenges/LogProgressModal';
import { awardPoints } from '@/components/gamification/ProgressManager';

export default function ChallengeDetail() {
  const params = new URLSearchParams(window.location.search);
  const challengeId = params.get('id');
  const [user, setUser] = useState(null);
  const [showLogProgress, setShowLogProgress] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: challenge } = useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: async () => {
      const all = await base44.entities.Challenge.list();
      return all.find(c => c.id === challengeId);
    }
  });

  const { data: participants = [] } = useQuery({
    queryKey: ['challengeParticipants', challengeId],
    queryFn: async () => {
      const all = await base44.entities.ChallengeParticipant.list();
      return all.filter(p => p.challenge_id === challengeId);
    }
  });

  const myParticipation = participants.find(p => p.user_email === user?.email);

  const logProgress = useMutation({
    mutationFn: async ({ value, note }) => {
      const newProgress = (myParticipation.current_progress || 0) + value;
      const percentage = (newProgress / challenge.goal_value) * 100;
      const completed = percentage >= 100;

      const logs = myParticipation.progress_logs || [];
      logs.push({ date: new Date().toISOString(), value, note });

      await base44.entities.ChallengeParticipant.update(myParticipation.id, {
        current_progress: newProgress,
        progress_percentage: percentage,
        progress_logs: logs,
        completed,
        completion_date: completed ? new Date().toISOString().split('T')[0] : null
      });

      if (completed && challenge.reward_points > 0) {
        await awardPoints(user.email, challenge.reward_points);
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['challengeParticipants'])
  });

  if (!challenge) {
    return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">Loading...</div>;
  }

  const daysRemaining = Math.ceil((new Date(challenge.end_date) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white px-4 py-6">
        <Link
          to={createPageUrl('Groups')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 inline-flex"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
        <p className="text-white/80">{challenge.description}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 text-center">
            <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{challenge.goal_value}</p>
            <p className="text-xs text-gray-500">{challenge.goal_unit}</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{daysRemaining}</p>
            <p className="text-xs text-gray-500">days left</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{challenge.participant_count}</p>
            <p className="text-xs text-gray-500">joined</p>
          </div>
        </div>

        {myParticipation && (
          <Button
            onClick={() => setShowLogProgress(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 mb-6"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Log Today's Progress
          </Button>
        )}

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            <div className="bg-white rounded-2xl p-4">
              <ChallengeLeaderboard participants={participants} challenge={challenge} />
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="bg-white rounded-2xl p-4">
              {myParticipation ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Your Progress</p>
                    <p className="text-3xl font-bold text-purple-600 mb-2">
                      {myParticipation.current_progress} / {challenge.goal_value}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
                        style={{ width: `${myParticipation.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Progress Log</h3>
                    <div className="space-y-2">
                      {myParticipation.progress_logs?.slice().reverse().map((log, index) => (
                        <div key={index} className="border-l-4 border-purple-600 pl-3 py-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900">+{log.value} {challenge.goal_unit}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.date).toLocaleDateString()}
                            </span>
                          </div>
                          {log.note && <p className="text-sm text-gray-600">{log.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Join the challenge to track your progress</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {myParticipation && (
        <LogProgressModal
          isOpen={showLogProgress}
          onClose={() => setShowLogProgress(false)}
          onSubmit={(data) => logProgress.mutate(data)}
          challenge={challenge}
          currentProgress={myParticipation.current_progress || 0}
        />
      )}
    </div>
  );
}