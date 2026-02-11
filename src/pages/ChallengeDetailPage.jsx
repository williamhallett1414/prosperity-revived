import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Users, CheckCircle2, Circle, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function ChallengeDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  
  // Get challengeId from URL
  const urlParams = new URLSearchParams(window.location.search);
  const challengeId = urlParams.get('id');

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: async () => {
      const challenges = await base44.entities.Challenge.filter({ id: challengeId });
      return challenges[0] || null;
    },
    enabled: !!challengeId
  });

  const { data: userParticipation } = useQuery({
    queryKey: ['userParticipation', challengeId, user?.email],
    queryFn: async () => {
      const participation = await base44.entities.ChallengeParticipant.filter({
        challenge_id: challengeId,
        user_email: user?.email
      });
      return participation[0] || null;
    },
    enabled: !!challengeId && !!user
  });

  const { data: participants = [] } = useQuery({
    queryKey: ['challengeParticipants', challengeId],
    queryFn: async () => {
      return await base44.entities.ChallengeParticipant.filter({
        challenge_id: challengeId,
        status: 'active'
      }, '-created_date');
    },
    enabled: !!challengeId
  });

  const joinChallenge = useMutation({
    mutationFn: async () => {
      return await base44.entities.ChallengeParticipant.create({
        challenge_id: challengeId,
        user_email: user?.email,
        user_name: user?.full_name || user?.email,
        progress: 0,
        status: 'active',
        completed_days: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userParticipation']);
      queryClient.invalidateQueries(['challengeParticipants']);
      toast.success('Challenge joined successfully!');
    }
  });

  const markDayComplete = useMutation({
    mutationFn: async (day) => {
      const completedDays = userParticipation?.completed_days || [];
      if (!completedDays.includes(day)) {
        completedDays.push(day);
      }
      const progress = Math.round((completedDays.length / challenge.duration_days) * 100);
      
      return await base44.entities.ChallengeParticipant.update(userParticipation.id, {
        completed_days: completedDays,
        progress
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userParticipation']);
      toast.success('Day marked complete!');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D9B878] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#0A1A2F]/60 mb-4">Challenge not found</p>
          <Button onClick={() => navigate(createPageUrl('Wellness'))}>
            Back to Wellness
          </Button>
        </div>
      </div>
    );
  }

  const isParticipating = !!userParticipation;
  const userProgress = userParticipation?.progress || 0;
  const completedDays = userParticipation?.completed_days || [];

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(createPageUrl('Wellness'))}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </button>
          <h1 className="text-lg font-bold text-[#0A1A2F]">Challenge</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Challenge Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{challenge.title}</h2>
              <p className="text-white/90 text-sm">{challenge.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{challenge.duration_days} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{participants.length} Participating</span>
            </div>
          </div>

          {isParticipating && (
            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Your Progress</span>
                <span className="font-bold">{userProgress}%</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${userProgress}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Join/Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {!isParticipating ? (
            <Button
              onClick={() => joinChallenge.mutate()}
              disabled={joinChallenge.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-semibold"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Join Challenge
            </Button>
          ) : (
            <Button
              className="w-full bg-[#D9B878] hover:bg-[#D9B878]/90 h-12 text-lg font-semibold"
            >
              <Target className="w-5 h-5 mr-2" />
              Continue Challenge
            </Button>
          )}
        </motion.div>

        {/* Challenge Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-bold text-[#0A1A2F] mb-4">Challenge Overview</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#0A1A2F] mb-2">What's Included</h4>
              <ul className="space-y-2 text-sm text-[#0A1A2F]/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Daily workout recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Progress tracking and motivation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Community support from other participants</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Achievement badges upon completion</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A1A2F] mb-2">Requirements</h4>
              <ul className="space-y-2 text-sm text-[#0A1A2F]/70">
                <li>• Commit to daily movement for {challenge.duration_days} days</li>
                <li>• Track your progress each day</li>
                <li>• Stay consistent and motivated</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0A1A2F] mb-2">Benefits</h4>
              <ul className="space-y-2 text-sm text-[#0A1A2F]/70">
                <li>• Build healthy exercise habits</li>
                <li>• Increase strength and endurance</li>
                <li>• Join a supportive community</li>
                <li>• Earn points and achievements</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Daily Tasks (for participating users) */}
        {isParticipating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-bold text-[#0A1A2F] mb-4">Daily Progress</h3>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: challenge.duration_days }).map((_, idx) => {
                const day = idx + 1;
                const isCompleted = completedDays.includes(day);
                
                return (
                  <button
                    key={day}
                    onClick={() => !isCompleted && markDayComplete.mutate(day)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-[#0A1A2F]/60 hover:bg-gray-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Participants Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0A1A2F]">People Participating</h3>
            <div className="flex items-center gap-2 text-sm text-[#0A1A2F]/60">
              <Users className="w-4 h-4" />
              <span>{participants.length}</span>
            </div>
          </div>

          {participants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-[#0A1A2F]/30 mx-auto mb-3" />
              <p className="text-[#0A1A2F]/60 text-sm">No participants yet. Be the first to join!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {participants.map((participant, idx) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] flex items-center justify-center text-white font-bold shrink-0">
                    {participant.user_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#0A1A2F] text-sm">
                      {participant.user_name || 'Anonymous'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#D9B878] transition-all"
                          style={{ width: `${participant.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#0A1A2F]/60">{participant.progress || 0}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}