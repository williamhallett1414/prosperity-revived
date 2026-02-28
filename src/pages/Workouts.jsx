import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Dumbbell, Heart, Plus, TrendingUp, Droplets, ArrowLeft, Sparkles, Target, Trophy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import StartWorkoutModal from '@/components/wellness/StartWorkoutModal';
import PullToRefresh from '@/components/ui/PullToRefresh';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';
import ReeVibeFitness from '@/components/wellness/ReeVibeFitness';
import CoachDavid from '@/components/wellness/CoachDavid';
import WeeklyThemeBanner from '@/components/wellness/WeeklyThemeBanner';

export default function Workouts() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('workouts_welcomed');
  });
  const dismissWelcome = () => {
    localStorage.setItem('workouts_welcomed', 'true');
    setShowWelcome(false);
  };
  const [user, setUser] = useState(null);
  const [showStartWorkout, setShowStartWorkout] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);

    base44.functions.invoke('ensureChallengesExist', {}).catch((err) => {
      console.error('Failed to ensure challenges exist:', err);
    });

    base44.functions.invoke('ensureCategoryWorkouts', {}).catch((err) => {
      console.error('Failed to ensure category workouts exist:', err);
    });

    const hasPopulated = localStorage.getItem('workouts_populated');
    if (!hasPopulated) {
      base44.functions.invoke('populateMissingWorkoutExercises', {}).then(() => {
        localStorage.setItem('workouts_populated', 'true');
        queryClient.invalidateQueries(['workoutPlans']);
      }).catch((err) => {
        console.error('Failed to populate workout exercises:', err);
      });
    }
  }, []);

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date')
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      try {
        return await base44.entities.Challenge.filter({});
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: challengeParticipants = [] } = useQuery({
    queryKey: ['challengeParticipants'],
    queryFn: async () => {
      try {
        return await base44.entities.ChallengeParticipant.filter({ user_email: user?.email });
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const completeWorkout = useMutation({
    mutationFn: async ({ id, workout }) => {
      const dates = workout.completed_dates || [];
      const today = new Date().toISOString().split('T')[0];
      if (!dates.includes(today)) {
        dates.push(today);

        const allProgress = await base44.entities.UserProgress.list();
        const userProgress = allProgress.find((p) => p.created_by === user?.email);
        const workoutCount = (userProgress?.workouts_completed || 0) + 1;

        await awardPoints(user?.email, 15, { workouts_completed: workoutCount });
        await checkAndAwardBadges(user?.email);
      }
      return base44.entities.WorkoutPlan.update(id, { completed_dates: dates });
    },
    onSuccess: () => queryClient.invalidateQueries(['workouts'])
  });

  const myWorkouts = workouts.filter((w) => w.created_by === user?.email);
  const allWorkouts = [...PREMADE_WORKOUTS, ...myWorkouts];

  const recommendedWorkout = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const notCompletedToday = allWorkouts.filter((w) =>
    !w.completed_dates?.includes(today)
    );
    return notCompletedToday[0] || allWorkouts[Math.floor(Math.random() * allWorkouts.length)] || null;
  }, [allWorkouts]);

  const totalWorkoutsCompleted = myWorkouts.reduce((sum, w) => sum + (w.completed_dates?.length || 0), 0);

  const { data: sharedWorkouts = [] } = useQuery({
    queryKey: ['sharedWorkouts'],
    queryFn: async () => {
      const all = await base44.entities.WorkoutPlan.list('-created_date', 50);
      return all.filter((w) => w.is_shared && w.created_by !== user?.email);
    },
    enabled: !!user
  });

  const copyWorkout = useMutation({
    mutationFn: async (workout) => {
      const workoutCopy = {
        title: `${workout.title} (Copy)`,
        description: workout.description,
        difficulty: workout.difficulty,
        duration_minutes: workout.duration_minutes,
        exercises: workout.exercises,
        category: workout.category,
        completed_dates: []
      };

      await base44.entities.WorkoutPlan.create(workoutCopy);

      if (workout.id) {
        await base44.entities.WorkoutPlan.update(workout.id, {
          times_copied: (workout.times_copied || 0) + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['sharedWorkouts']);
      toast.success('Workout added to your library!');
    }
  });

  const handleRefresh = async () => {
    await Promise.all([
    queryClient.invalidateQueries(['workouts']),
    queryClient.invalidateQueries(['workoutSessions']),
    queryClient.invalidateQueries(['challenges'])]
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] pb-24">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#BAE6FD]/40 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          





          <h1 className="text-lg font-bold text-[#0A1A2F]">Workouts</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 pt-6 pb-6">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="max-w-2xl mx-auto">
            {/* Welcome Banner */}
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-gradient-to-br from-[#38BDF8]/10 to-[#FD9C2D]/10 border border-[#38BDF8]/30 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0A1A2F] mb-1">💪 Welcome to Workouts!</h3>
                    <p className="text-sm text-[#0A1A2F]/70 mb-3">
                      Browse workout categories, try a premade plan, or start one of our quick workouts below. Log a session to start tracking your progress.
                    </p>
                    <div className="flex gap-2">
                      <Link to={createPageUrl('WorkoutCategoryPage')}>
                        <Button size="sm" className="bg-[#FD9C2D] hover:bg-[#FD9C2D]/90 text-white text-xs">
                          Browse Categories
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={dismissWelcome} className="text-xs">
                        Got it
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Weekly Theme */}
            <WeeklyThemeBanner />

            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">Workouts</h2>
              <p className="text-sm text-[#0A1A2F]/60">Build strength, energy, and consistency.</p>
            </div>

            {/* Today's Recommended Workout */}
            {recommendedWorkout &&
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#0A0A0A] to-[#1a2535] rounded-xl p-5 text-white shadow-md mb-6">

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-slate-50 mb-1 text-lg font-bold">Today's Recommended Workout</h3>
                    <p className="text-sm text-white/70">Based on your goals and activity</p>
                  </div>
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 mb-3">
                  <p className="text-slate-50 font-semibold">{recommendedWorkout.title}</p>
                  <p className="text-slate-50 text-sm">
                    {recommendedWorkout.duration_minutes} min • {recommendedWorkout.difficulty || 'All Levels'}
                  </p>
                </div>
                <Button
                className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white hover:opacity-90 font-bold"
                onClick={() => {
                  setSelectedWorkout(recommendedWorkout);
                  setShowStartWorkout(true);
                }}>

                  Start Workout
                </Button>
              </motion.div>
            }

            {/* Workout Streaks & Wins */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Your Stats at a Glance</h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 border border-[#BAE6FD]/40 shadow-sm">

                  <div className="text-2xl font-bold text-[#FD9C2D] mb-1">
                    {workoutSessions.filter((s) => {
                      const today = new Date();
                      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                      return new Date(s.date) >= weekAgo;
                    }).length}
                  </div>
                  <p className="text-xs text-[#0A1A2F]/60">This week</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white rounded-xl p-4 border border-[#BAE6FD]/40 shadow-sm">

                  <div className="text-2xl font-bold text-[#38BDF8] mb-1">
                    {totalWorkoutsCompleted}
                  </div>
                  <p className="text-xs text-[#0A1A2F]/60">Total completed</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-4 border border-[#BAE6FD]/40 shadow-sm">

                  <div className="text-2xl font-bold text-[#0EA5E9] mb-1">
                    {workoutSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)}
                  </div>
                  <p className="text-xs text-[#0A1A2F]/60">Total minutes</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-xl p-4 border border-[#BAE6FD]/40 shadow-sm">

                  <div className="text-2xl font-bold text-[#0A0A0A] mb-1">
                    {(() => {
                      const uniqueDays = [...new Set(workoutSessions.map(s => s.date).filter(Boolean))].sort();
                      let streak = 0, maxStreak = 0;
                      for (let i = 0; i < uniqueDays.length; i++) {
                        if (i === 0) { streak = 1; }
                        else {
                          const diff = (new Date(uniqueDays[i]) - new Date(uniqueDays[i - 1])) / 86400000;
                          streak = diff <= 1 ? streak + 1 : 1;
                        }
                        maxStreak = Math.max(maxStreak, streak);
                      }
                      return maxStreak;
                    })()}
                  </div>
                  <p className="text-xs text-[#0A1A2F]/60">Day streak</p>
                </motion.div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Quick Actions</h3>
              <Link to={createPageUrl('WorkoutProgress')} className="block">
                <Button variant="outline" className="w-full py-4">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">View Progress</span>
                  </div>
                </Button>
              </Link>
            </div>

            {/* Quick Workouts (5-15 Minutes) */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Quick Workouts (5–15 Minutes)</h3>
              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const quickWorkouts = [
                  {
                    icon: Dumbbell,
                    iconColor: 'text-[#FD9C2D]',
                    bgColor: 'bg-[#FD9C2D]/20',
                    label: 'Quick Burn', // keep orange
                    workout: allWorkouts.find((w) => w.category === 'cardio' && w.duration_minutes <= 15) || allWorkouts[0]
                  },
                  {
                    icon: Target,
                    iconColor: 'text-[#0EA5E9]',
                    bgColor: 'bg-[#38BDF8]/10',
                    label: 'Core Reset',
                    workout: allWorkouts.find((w) => w.category === 'strength' && w.duration_minutes <= 15) || allWorkouts[1]
                  },
                  {
                    icon: Heart,
                    iconColor: 'text-[#38BDF8]',
                    bgColor: 'bg-[#38BDF8]/15',
                    label: 'Stretch & Mobility',
                    workout: allWorkouts.find((w) => w.category === 'flexibility' && w.duration_minutes <= 15) || allWorkouts[2]
                  },
                  {
                    icon: Droplets,
                    iconColor: 'text-[#0EA5E9]',
                    bgColor: 'bg-[#38BDF8]/10',
                    label: 'Low-Impact Cardio',
                    workout: allWorkouts.find((w) => w.category === 'cardio' && w.duration_minutes >= 10 && w.duration_minutes <= 20) || allWorkouts[3]
                  }];


                  return quickWorkouts.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl p-4 border border-[#BAE6FD]/40 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() => {
                          if (item.workout) {
                            setSelectedWorkout(item.workout);
                            setShowStartWorkout(true);
                          }
                        }}>

                        <div className="flex flex-col items-center text-center gap-2">
                          <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${item.iconColor}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#0A1A2F]">{item.workout?.title || item.label}</h4>
                            <p className="text-xs text-[#0A1A2F]/60">{item.workout?.duration_minutes || 10} min</p>
                          </div>
                        </div>
                      </motion.div>);

                  });
                })()}
              </div>
            </div>

            {/* Workout Challenges */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Workout Challenges</h3>
              <div className="grid grid-cols-2 gap-3">
                {challenges.slice(0, 4).map((challenge, index) => {
                  const userParticipation = challengeParticipants.find((p) => p.challenge_id === challenge.id);
                  const isParticipating = !!userParticipation;
                  const progress = userParticipation?.progress || 0;

                  const iconColors = [
                  { bg: 'bg-[#FD9C2D]/20', icon: 'text-[#FD9C2D]', Icon: Trophy },
                  { bg: 'bg-[#38BDF8]/15', icon: 'text-[#0EA5E9]', Icon: Dumbbell },
                  { bg: 'bg-[#0A0A0A]/10', icon: 'text-[#0A0A0A]', Icon: Heart },
                  { bg: 'bg-[#FD9C2D]/20', icon: 'text-[#FD9C2D]', Icon: Target }];

                  const colorSet = iconColors[index % iconColors.length];
                  const Icon = colorSet.Icon;

                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl p-3 border border-[#BAE6FD]/40 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(createPageUrl(`ChallengeDetailPage?id=${challenge.id}`))}>

                      <div className="flex flex-col items-center text-center gap-2">
                        <div className={`w-10 h-10 ${colorSet.bg} rounded-full flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${colorSet.icon}`} />
                        </div>
                        <div className="w-full">
                          <h4 className="font-bold text-[#0A1A2F] text-xs mb-1 line-clamp-2">{challenge.title}</h4>
                          <p className="text-[10px] text-[#0A1A2F]/60 mb-2">{challenge.duration_days} Days</p>
                          {isParticipating ?
                          <div className="w-full">
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] rounded-full transition-all" style={{ width: `${progress}%` }} />
                              </div>
                              <p className="text-[10px] text-[#0A1A2F]/60 mt-1">{progress}%</p>
                            </div> :

                          <div className="text-[10px] text-[#0EA5E9] font-semibold">
                              Join Now
                            </div>
                          }
                        </div>
                      </div>
                    </motion.div>);

                })}
              </div>
            </div>

            {/* Workout Library */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Workout Library</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                { name: 'Cardio', icon: '❤️', color: 'from-[#FD9C2D] to-[#E89020]', description: 'Get your heart pumping' },
                { name: 'Strength', icon: '💪', color: 'from-[#0A0A0A] to-[#1a2535]', description: 'Build muscle & power' },
                { name: 'HIIT', icon: '⚡', color: 'from-[#FD9C2D] to-[#38BDF8]', description: 'High intensity intervals' },
                { name: 'Home', icon: '🏠', color: 'from-[#38BDF8] to-[#0EA5E9]', description: 'No equipment needed' }].
                map((category, index) =>
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gradient-to-br ${category.color} rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all`}
                  onClick={() => {
                    navigate(`/WorkoutCategoryPage?category=${category.name}`);
                  }}>

                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h4 className="font-bold text-white text-sm mb-1">{category.name}</h4>
                    <p className="text-white/90 text-xs">{category.description}</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* New Workouts to Try */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">New Workouts to Try</h3>
              <div className="space-y-3">
                {PREMADE_WORKOUTS.slice(0, 3).map((workout, index) =>
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onComplete={() => {}}
                  index={index}
                  isPremade
                  user={user} />

                )}
              </div>
            </div>

            {/* My Workouts */}
            {myWorkouts.length > 0 &&
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Your Custom Workouts</h3>
                <div className="space-y-3">
                  {myWorkouts.map((workout, index) =>
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onComplete={() => completeWorkout.mutate({ id: workout.id, workout })}
                  index={index}
                  user={user} />

                )}
                </div>
              </div>
            }

            {/* Community Feed */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Community Workouts</h3>
              <ReeVibeFitness user={user} />
            </div>
          </div>
        </PullToRefresh>
      </div>

      {/* Modals */}
      {selectedWorkout &&
      <StartWorkoutModal
        isOpen={showStartWorkout}
        onClose={() => {
          setShowStartWorkout(false);
          setSelectedWorkout(null);
        }}
        workout={selectedWorkout}
        user={user} />

      }

      {/* Coach David */}
      <CoachDavid
        user={user}
        userWorkouts={myWorkouts}
        workoutSessions={workoutSessions} />

    </div>);

}