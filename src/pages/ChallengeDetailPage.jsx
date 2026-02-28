import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Users, CheckCircle2, Circle, Calendar, Target, Flame, Clock, TrendingUp, Award, Dumbbell, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';

const MOTIVATING_TIPS = [
"Consistency beats intensity. Show up every day.",
"Small wins compound over time. Keep going.",
"Focus on form, not speed. Quality matters.",
"Your only competition is yesterday's you.",
"Rest is part of the process. Don't skip it.",
"Progress isn't always linear. Trust the journey.",
"You're stronger than you think. Prove it.",
"Celebrate small victories along the way.",
"The hardest part is showing up. You've got this.",
"Build habits, not streaks. Make it sustainable."];


export default function ChallengeDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);

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
        challenge_id: challengeId
      }, '-current_streak');
    },
    enabled: !!challengeId
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date'),
    enabled: !!user
  });

  const joinChallenge = useMutation({
    mutationFn: async () => {
      return await base44.entities.ChallengeParticipant.create({
        challenge_id: challengeId,
        user_email: user?.email,
        user_name: user?.full_name || user?.email,
        progress: 0,
        status: 'active',
        completed_days: [],
        current_streak: 0,
        longest_streak: 0,
        total_check_ins: 0,
        daily_workouts_completed: [],
        total_minutes_trained: 0,
        calories_burned: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userParticipation']);
      queryClient.invalidateQueries(['challengeParticipants']);
      toast.success('Challenge joined successfully!');
    }
  });

  const checkInToday = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const lastCheckIn = userParticipation?.last_check_in_date;
      const completedDays = userParticipation?.completed_days || [];

      if (lastCheckIn === today) {
        throw new Error('Already checked in today');
      }

      if (!completedDays.includes(selectedDay)) {
        completedDays.push(selectedDay);
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let currentStreak = userParticipation?.current_streak || 0;
      if (lastCheckIn === yesterdayStr) {
        currentStreak += 1;
      } else if (lastCheckIn !== today) {
        currentStreak = 1;
      }

      const longestStreak = Math.max(userParticipation?.longest_streak || 0, currentStreak);
      const totalCheckIns = (userParticipation?.total_check_ins || 0) + 1;
      const progress = Math.round(completedDays.length / challenge.duration_days * 100);

      const isCompleted = completedDays.length >= challenge.duration_days;

      return await base44.entities.ChallengeParticipant.update(userParticipation.id, {
        completed_days: completedDays,
        progress,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_check_in_date: today,
        total_check_ins: totalCheckIns,
        is_completed: isCompleted,
        status: isCompleted ? 'completed' : 'active'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userParticipation']);
      queryClient.invalidateQueries(['challengeParticipants']);
      toast.success('Daily check-in complete! 🎉');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const completeWorkout = useMutation({
    mutationFn: async ({ workoutId, duration }) => {
      const dailyWorkoutsCompleted = userParticipation?.daily_workouts_completed || [];
      if (!dailyWorkoutsCompleted.includes(selectedDay)) {
        dailyWorkoutsCompleted.push(selectedDay);
      }

      const totalMinutes = (userParticipation?.total_minutes_trained || 0) + duration;
      const caloriesBurned = (userParticipation?.calories_burned || 0) + Math.round(duration * 5);

      return await base44.entities.ChallengeParticipant.update(userParticipation.id, {
        daily_workouts_completed: dailyWorkoutsCompleted,
        total_minutes_trained: totalMinutes,
        calories_burned: caloriesBurned
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userParticipation']);
      toast.success('Workout tracked!');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D9B878] border-t-transparent rounded-full animate-spin" />
      </div>);

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
      </div>);

  }

  const isParticipating = !!userParticipation;
  const userProgress = userParticipation?.progress || 0;
  const completedDays = userParticipation?.completed_days || [];
  const currentStreak = userParticipation?.current_streak || 0;
  const longestStreak = userParticipation?.longest_streak || 0;
  const totalCheckIns = userParticipation?.total_check_ins || 0;
  const dailyWorkoutsCompleted = userParticipation?.daily_workouts_completed || [];

  const today = new Date().toISOString().split('T')[0];
  const lastCheckIn = userParticipation?.last_check_in_date;
  const hasCheckedInToday = lastCheckIn === today;

  const allWorkouts = [...PREMADE_WORKOUTS, ...workouts];
  const selectedDayTask = challenge.tasks?.find((t) => t.day === selectedDay);
  const recommendedWorkout = allWorkouts[selectedDay % allWorkouts.length];

  const leaderboard = [...participants].sort((a, b) => {
    if (b.current_streak !== a.current_streak) return b.current_streak - a.current_streak;
    if (b.total_check_ins !== a.total_check_ins) return b.total_check_ins - a.total_check_ins;
    return b.progress - a.progress;
  });

  const dailyTip = MOTIVATING_TIPS[selectedDay % MOTIVATING_TIPS.length];

  const encouragementMessage = userProgress === 0 ? "Let's get started on your journey!" :
  userProgress < 25 ? "You're off to a strong start!" :
  userProgress < 50 ? "You're making great progress!" :
  userProgress < 75 ? "You're over halfway there!" :
  userProgress < 100 ? "Almost there! Finish strong!" :
  "Amazing! You completed the challenge!";

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="bg-white my-10 px-4 sticky top-16 z-10 border-b border-gray-200">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors">

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
          className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">

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

          {isParticipating &&
          <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Your Progress</span>
                <span className="font-bold">{userProgress}%</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${userProgress}%` }} />

              </div>
            </div>
          }
        </motion.div>

        {/* Join/Continue Button */}
        {!isParticipating ?
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Button
            onClick={() => joinChallenge.mutate()}
            disabled={joinChallenge.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-semibold">

              <Trophy className="w-5 h-5 mr-2" />
              Join Challenge
            </Button>
          </motion.div> :
        null}

        {/* Encouragement Message */}
        {isParticipating &&
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="bg-gradient-to-r from-[#FAD98D]/10 to-[#F2F6FA] border border-[#D9B878]/40 rounded-xl p-4">
              <p className="text-[#0A1A2F] font-semibold text-center">{encouragementMessage}</p>
            </div>
          </motion.div>
        }

        {/* Day Selector */}
        {isParticipating &&
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Select Day</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {Array.from({ length: challenge.duration_days }).map((_, idx) => {
                const day = idx + 1;
                const isCompleted = completedDays.includes(day);
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all ${
                    isSelected ?
                    'bg-[#D9B878] text-white shadow-md' :
                    isCompleted ?
                    'bg-emerald-500 text-white' :
                    'bg-gray-100 text-[#0A1A2F]/60 hover:bg-gray-200'}`
                    }>

                      {isCompleted && !isSelected ?
                    <CheckCircle2 className="w-5 h-5" /> :

                    <>
                          <span className="text-[10px]">Day</span>
                          <span className="text-lg">{day}</span>
                        </>
                    }
                    </button>);

              })}
              </div>
            </div>
          </motion.div>
        }

        {/* Daily Recommended Workout */}
        {isParticipating &&
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-[#0A1A2F] mb-4">Day {selectedDay} Workout</h3>
              
              {recommendedWorkout ?
            <div>
                  <div className="bg-gradient-to-r from-emerald-50 to-[#F2F6FA] rounded-xl p-4 mb-4">
                    <h4 className="font-bold text-[#0A1A2F] mb-2">{recommendedWorkout.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-[#0A1A2F]/70">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{recommendedWorkout.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="w-4 h-4" />
                        <span>{recommendedWorkout.category || 'Full Body'}</span>
                      </div>
                      {recommendedWorkout.difficulty &&
                  <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{recommendedWorkout.difficulty}</span>
                        </div>
                  }
                    </div>
                    {selectedDayTask &&
                <p className="text-sm text-[#0A1A2F]/60 mt-2">{selectedDayTask.description}</p>
                }
                  </div>
                  <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  navigate(createPageUrl(`WorkoutProgress?workout=${recommendedWorkout.id}`));
                  completeWorkout.mutate({ workoutId: recommendedWorkout.id, duration: recommendedWorkout.duration_minutes });
                }}>

                    <Zap className="w-5 h-5 mr-2" />
                    Start Workout
                  </Button>
                </div> :

            <p className="text-[#0A1A2F]/60 text-sm">No workout assigned for this day.</p>
            }
            </div>
          </motion.div>
        }

        {/* Daily Check-In */}
        {isParticipating &&
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-[#0A1A2F] mb-4">Daily Check-In</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#D9B878]">{currentStreak}</div>
                  <div className="text-xs text-[#0A1A2F]/60">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{totalCheckIns}</div>
                  <div className="text-xs text-[#0A1A2F]/60">Total Check-ins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8a6e1a]">{longestStreak}</div>
                  <div className="text-xs text-[#0A1A2F]/60">Longest Streak</div>
                </div>
              </div>

              {hasCheckedInToday ?
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-emerald-900 font-semibold">Checked in today!</p>
                </div> :

            <Button
              onClick={() => checkInToday.mutate()}
              disabled={checkInToday.isPending}
              className="w-full bg-[#D9B878] hover:bg-[#D9B878]/90">

                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Check In for Today
                </Button>
            }
            </div>
          </motion.div>
        }

        {/* Motivating Tip */}
        {isParticipating &&
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Daily Tip</h4>
                  <p className="text-yellow-800 text-sm">{dailyTip}</p>
                </div>
              </div>
            </div>
          </motion.div>
        }

        {/* Progress Stats */}
        {isParticipating &&
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-[#0A1A2F] mb-4">Your Stats</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-[#0A1A2F]/60">Days Completed</span>
                  </div>
                  <div className="text-2xl font-bold text-[#0A1A2F]">{completedDays.length}</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#D9B878]" />
                    <span className="text-sm text-[#0A1A2F]/60">Completion %</span>
                  </div>
                  <div className="text-2xl font-bold text-[#0A1A2F]">{userProgress}%</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-[#3C4E53]" />
                    <span className="text-sm text-[#0A1A2F]/60">Total Minutes</span>
                  </div>
                  <div className="text-2xl font-bold text-[#0A1A2F]">{userParticipation?.total_minutes_trained || 0}</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-[#0A1A2F]/60">Calories Burned</span>
                  </div>
                  <div className="text-2xl font-bold text-[#0A1A2F]">{userParticipation?.calories_burned || 0}</div>
                </div>
              </div>
            </div>
          </motion.div>
        }

        {/* Leaderboard */}
        {isParticipating &&
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-[#0A1A2F] mb-4">Leaderboard</h3>
              
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((participant, idx) =>
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                participant.user_email === user?.email ? 'bg-[#D9B878]/10 border border-[#D9B878]' : 'bg-gray-50'}`
                }>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                idx === 1 ? 'bg-gray-300 text-gray-700' :
                idx === 2 ? 'bg-orange-400 text-orange-900' :
                'bg-gray-200 text-gray-600'}`
                }>
                      {idx + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] flex items-center justify-center text-white font-bold shrink-0">
                      {participant.user_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#0A1A2F] text-sm">
                        {participant.user_name || 'Anonymous'}
                        {participant.user_email === user?.email && <span className="text-[#D9B878] ml-1">(You)</span>}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-[#0A1A2F]/60">
                        <span>🔥 {participant.current_streak || 0} streak</span>
                        <span>✓ {participant.total_check_ins || 0} check-ins</span>
                        <span>{participant.progress || 0}%</span>
                      </div>
                    </div>
                  </motion.div>
              )}
              </div>
            </div>
          </motion.div>
        }

        {/* Badge Preview */}
        {isParticipating &&
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <div className={`rounded-xl p-6 shadow-sm border ${
          userParticipation?.is_completed ?
          'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-600' :
          'bg-white border-gray-200'}`
          }>
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 ${
              userParticipation?.is_completed ? 'bg-white/20' : 'bg-gray-100'}`
              }>
                  <Award className={`w-10 h-10 ${
                userParticipation?.is_completed ? 'text-white' : 'text-gray-400'}`
                } />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold mb-1 ${
                userParticipation?.is_completed ? 'text-white' : 'text-[#0A1A2F]'}`
                }>
                    {challenge.title} Badge
                  </h4>
                  <p className={`text-sm ${
                userParticipation?.is_completed ? 'text-white/90' : 'text-[#0A1A2F]/60'}`
                }>
                    {userParticipation?.is_completed ?
                  "🎉 You earned this badge!" :
                  "Complete this challenge to earn this badge."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        }

        {/* Participants */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0A1A2F]">All Participants</h3>
              <div className="flex items-center gap-2 text-sm text-[#0A1A2F]/60">
                <Users className="w-4 h-4" />
                <span>{participants.length}</span>
              </div>
            </div>

            {participants.length === 0 ?
            <div className="text-center py-8">
                <Users className="w-12 h-12 text-[#0A1A2F]/30 mx-auto mb-3" />
                <p className="text-[#0A1A2F]/60 text-sm">No participants yet. Be the first to join!</p>
              </div> :

            <div className="space-y-3">
                {participants.slice(0, 20).map((participant, idx) =>
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">

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
                        style={{ width: `${participant.progress || 0}%` }} />

                        </div>
                        <span className="text-xs text-[#0A1A2F]/60">{participant.progress || 0}%</span>
                      </div>
                    </div>
                  </motion.div>
              )}
              </div>
            }
          </div>
        </motion.div>
      </div>
    </div>);

}