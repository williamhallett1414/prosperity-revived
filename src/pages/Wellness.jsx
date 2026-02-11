import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Dumbbell, UtensilsCrossed, Heart, Plus, TrendingUp, Droplets, ArrowLeft, Sparkles, Search, BookOpen, Brain, Target, Crown, Calendar, CheckCircle2, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import CreateWorkoutModal from '@/components/wellness/CreateWorkoutModal';
import StartWorkoutModal from '@/components/wellness/StartWorkoutModal';
import PullToRefresh from '@/components/ui/PullToRefresh';

import MealTracker from '@/components/wellness/MealTracker';
import MealSuggestions from '@/components/nutrition/MealSuggestions';
import TrendingNutritionArticles from '@/components/nutrition/TrendingNutritionArticles';
import MeditationGuide from '@/components/wellness/MeditationGuide';
import RecipeCollections from '@/components/wellness/RecipeCollections';
import CommunityRecipes from '@/components/wellness/CommunityRecipes';
import PersonalizedNutritionPlan from '@/components/wellness/PersonalizedNutritionPlan';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';
import AIMealPlanner from '@/components/wellness/AIMealPlanner';
import CustomPrayerBuilder from '@/components/wellness/CustomPrayerBuilder';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';
import AIWorkoutRecommendations from '@/components/wellness/AIWorkoutRecommendations';

import ContextualSuggestions from '@/components/ai/ContextualSuggestions';
import AIWellnessJourneyGenerator from '@/components/wellness/AIWellnessJourneyGenerator';
import WellnessJourneyCard from '@/components/wellness/WellnessJourneyCard';
import MoodEnergyChart from '@/components/wellness/MoodEnergyChart';
import SelfCareGuides from '@/components/wellness/SelfCareGuides';
import ReeVibeFitness from '@/components/wellness/ReeVibeFitness';
import CommunityRecipeFeed from '@/components/wellness/CommunityRecipeFeed';

import WellnessHubCard from '@/components/wellness/WellnessHubCard';
import WeeklyThemeBanner from '@/components/wellness/WeeklyThemeBanner';
import WorkoutCategoryFilter from '@/components/workouts/WorkoutCategoryFilter';
import NutritionDashboard from '@/components/nutrition/NutritionDashboard';

import CoachDavid from '@/components/wellness/CoachDavid';
import ChefDaniel from '@/components/wellness/ChefDaniel';
import Hannah from '@/components/wellness/Hannah.jsx';



import SelfCareChallenges from '@/components/selfcare/SelfCareChallenges';
import MeditationTracker from '@/components/wellness/MeditationTracker';
import PersonalizedWorkouts from '@/components/recommendations/PersonalizedWorkouts';
import { Input } from '@/components/ui/input';




export default function Wellness() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showStartWorkout, setShowStartWorkout] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [activeTab, setActiveTab] = useState('workouts');
  const [workoutCategory, setWorkoutCategory] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
    
    // Ensure default challenges exist
    base44.functions.invoke('ensureChallengesExist', {}).catch(err => {
      console.error('Failed to ensure challenges exist:', err);
    });
    
    // Ensure category workouts exist
    base44.functions.invoke('ensureCategoryWorkouts', {}).catch(err => {
      console.error('Failed to ensure category workouts exist:', err);
    });
    
    // Generate default workouts if needed
    base44.functions.invoke('generateDefaultWorkouts', {}).catch(err => {
      console.error('Failed to generate default workouts:', err);
    });
    
    // Read URL parameter for tab
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['workouts', 'nutrition', 'mind'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date')
  });

  const { data: journeys = [] } = useQuery({
    queryKey: ['journeys'],
    queryFn: async () => {
      const all = await base44.entities.WellnessJourney.list('-created_date');
      return all.filter(j => j.created_by === user?.email);
    },
    enabled: !!user
  });

  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workoutSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: () => base44.entities.MealLog.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['waterLogs'],
    queryFn: () => base44.entities.WaterLog.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const { data: meditationSessions = [] } = useQuery({
    queryKey: ['meditationSessions'],
    queryFn: () => base44.entities.MeditationSession.list('-date', 100),
    initialData: [],
    enabled: !!user
  });

  const { data: meditations = [] } = useQuery({
    queryKey: ['meditations'],
    queryFn: async () => {
      try {
        return await base44.entities.Meditation.filter({});
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      try {
        return await base44.entities.Recipe.filter({}, '-created_date', 50);
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const allPosts = await base44.entities.Post.filter({}, '-created_date', 100);
        return allPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      try {
        return await base44.entities.Comment.filter({}, '-created_date', 200);
      } catch (error) {
        return [];
      }
    },
    retry: false
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      try {
        return await base44.entities.JournalEntry.filter({ created_by: user?.email }, '-created_date');
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: prayerJournals = [] } = useQuery({
    queryKey: ['prayerJournals'],
    queryFn: async () => {
      try {
        return await base44.entities.PrayerJournal.filter({ created_by: user?.email }, '-created_date');
      } catch (error) {
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      try {
        const list = await base44.entities.UserProgress.filter({ created_by: user?.email });
        return list[0] || null;
      } catch (error) {
        return null;
      }
    },
    enabled: !!user,
    retry: false
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
        
        // Award points and update progress
        const allProgress = await base44.entities.UserProgress.list();
        const userProgress = allProgress.find(p => p.created_by === user?.email);
        const workoutCount = (userProgress?.workouts_completed || 0) + 1;
        
        await awardPoints(user?.email, 15, { workouts_completed: workoutCount });
        await checkAndAwardBadges(user?.email);
      }
      return base44.entities.WorkoutPlan.update(id, { completed_dates: dates });
    },
    onSuccess: () => queryClient.invalidateQueries(['workouts'])
  });

  const myWorkouts = workouts.filter(w => w.created_by === user?.email);
  const allWorkouts = [...PREMADE_WORKOUTS, ...myWorkouts];

  // Select recommended workout - prioritize user's workouts, then premade
  const recommendedWorkout = React.useMemo(() => {
    // Get workouts not completed today
    const today = new Date().toISOString().split('T')[0];
    const notCompletedToday = allWorkouts.filter(w => 
      !w.completed_dates?.includes(today)
    );

    // Pick first available, or random if none completed today
    return notCompletedToday[0] || allWorkouts[Math.floor(Math.random() * allWorkouts.length)] || null;
  }, [allWorkouts]);

  const totalWorkoutsCompleted = myWorkouts.reduce((sum, w) => sum + (w.completed_dates?.length || 0), 0);
   const thisWeekWorkouts = myWorkouts.filter(w => {
     const today = new Date();
     const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
     return (w.completed_dates || []).some(d => new Date(d) >= weekAgo);
   }).length;

   const { data: sharedWorkouts = [] } = useQuery({
     queryKey: ['sharedWorkouts'],
     queryFn: async () => {
       const all = await base44.entities.WorkoutPlan.list('-created_date', 50);
       return all.filter(w => w.is_shared && w.created_by !== user?.email);
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
       queryClient.invalidateQueries(['recipes']),
       queryClient.invalidateQueries(['meditations'])
       ]);
       };

       return (
       <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-3">
          <Link
            to={createPageUrl('Home')}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <h1 className="text-lg font-bold text-[#0A1A2F]">Wellness</h1>
          <div className="w-10" />
        </div>
        
        <Tabs defaultValue="workouts" value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 p-1 rounded-xl bg-[#E6EBEF]">
            <TabsTrigger value="workouts" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Nutrition</TabsTrigger>
            <TabsTrigger value="mind" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Personal Growth</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-4 pt-6 pb-6">
        <PullToRefresh onRefresh={handleRefresh}>
        {/* Weekly Theme */}
        <WeeklyThemeBanner />

        <Tabs defaultValue="workouts" value={activeTab} className="w-full" onValueChange={setActiveTab}>
          {/* Workouts Tab */}
          <TabsContent value="workouts" className="max-w-2xl mx-auto pb-8">
            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">Workouts</h2>
              <p className="text-sm text-[#0A1A2F]/60">Build strength, energy, and consistency.</p>
            </div>

            {/* Today's Recommended Workout */}
            {recommendedWorkout && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-md mb-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Today's Recommended Workout</h3>
                    <p className="text-sm text-white/80">Based on your goals and activity</p>
                  </div>
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div className="bg-white/20 rounded-lg p-3 mb-3">
                  <p className="font-semibold">{recommendedWorkout.title}</p>
                  <p className="text-sm text-white/90">
                    {recommendedWorkout.duration_minutes} min • {recommendedWorkout.difficulty || 'All Levels'}
                  </p>
                </div>
                <Button 
                  className="w-full bg-white text-emerald-600 hover:bg-white/90"
                  onClick={() => {
                    setSelectedWorkout(recommendedWorkout);
                    setShowStartWorkout(true);
                  }}
                >
                  Start Workout
                </Button>
              </motion.div>
            )}

            {/* Workout Streaks & Wins */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Your Stats at a Glance</h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="text-2xl font-bold text-emerald-600 mb-1">
                    {workoutSessions.filter(s => {
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
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="text-2xl font-bold text-[#D9B878] mb-1">
                    {totalWorkoutsCompleted}
                  </div>
                  <p className="text-xs text-[#0A1A2F]/60">Total completed</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="text-2xl font-bold text-[#AFC7E3] mb-1">
                    {workoutSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)}
                  </div>
                  <p className="text-xs text-[#0A1A2F]/60">Total minutes</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="text-2xl font-bold text-pink-500 mb-1">
                    {Math.max(...workoutSessions.map(s => {
                      const dates = s.date ? [s.date] : [];
                      let streak = 0;
                      for (let i = 0; i < dates.length; i++) {
                        if (i === 0 || new Date(dates[i]).getTime() - new Date(dates[i-1]).getTime() <= 86400000) {
                          streak++;
                        } else {
                          break;
                        }
                      }
                      return streak;
                    }), 0)}
                  </div>
                  <p className="text-xs text-[#0A1A2F]/60">Day streak</p>
                </motion.div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowCreateWorkout(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Plus className="w-5 h-5" />
                    <span className="text-xs">Create Workout</span>
                  </div>
                </Button>

                <Link to={createPageUrl('WorkoutProgress')} className="block">
                  <Button variant="outline" className="w-full h-full py-4">
                    <div className="flex flex-col items-center gap-1">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-xs">View Progress</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Workouts (5-15 Minutes) */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Quick Workouts (5–15 Minutes)</h3>
              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  // Map quick workout cards to real workouts from library
                  const quickWorkouts = [
                    {
                      icon: Dumbbell,
                      iconColor: 'text-orange-500',
                      bgColor: 'bg-orange-100',
                      label: 'Quick Burn',
                      workout: allWorkouts.find(w => w.category === 'cardio' && w.duration_minutes <= 15) || allWorkouts[0]
                    },
                    {
                      icon: Target,
                      iconColor: 'text-purple-500',
                      bgColor: 'bg-purple-100',
                      label: 'Core Reset',
                      workout: allWorkouts.find(w => w.category === 'strength' && w.duration_minutes <= 15) || allWorkouts[1]
                    },
                    {
                      icon: Heart,
                      iconColor: 'text-blue-500',
                      bgColor: 'bg-blue-100',
                      label: 'Stretch & Mobility',
                      workout: allWorkouts.find(w => w.category === 'flexibility' && w.duration_minutes <= 15) || allWorkouts[2]
                    },
                    {
                      icon: Droplets,
                      iconColor: 'text-green-500',
                      bgColor: 'bg-green-100',
                      label: 'Low-Impact Cardio',
                      workout: allWorkouts.find(w => w.category === 'cardio' && w.duration_minutes >= 10 && w.duration_minutes <= 20) || allWorkouts[3]
                    }
                  ];

                  return quickWorkouts.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() => {
                          if (item.workout) {
                            setSelectedWorkout(item.workout);
                            setShowStartWorkout(true);
                          }
                        }}
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${item.iconColor}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#0A1A2F]">{item.workout?.title || item.label}</h4>
                            <p className="text-xs text-[#0A1A2F]/60">{item.workout?.duration_minutes || 10} min</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Workout Challenges */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Workout Challenges</h3>
              <div className="grid grid-cols-2 gap-3">
                {challenges.slice(0, 4).map((challenge, index) => {
                  const userParticipation = challengeParticipants.find(p => p.challenge_id === challenge.id);
                  const isParticipating = !!userParticipation;
                  const progress = userParticipation?.progress || 0;

                  const iconColors = [
                    { bg: 'bg-yellow-100', icon: 'text-yellow-600', Icon: Trophy },
                    { bg: 'bg-red-100', icon: 'text-red-600', Icon: Dumbbell },
                    { bg: 'bg-blue-100', icon: 'text-blue-600', Icon: Heart },
                    { bg: 'bg-purple-100', icon: 'text-purple-600', Icon: Target }
                  ];
                  const colorSet = iconColors[index % iconColors.length];
                  const Icon = colorSet.Icon;

                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(createPageUrl(`ChallengeDetailPage?id=${challenge.id}`))}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className={`w-10 h-10 ${colorSet.bg} rounded-full flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${colorSet.icon}`} />
                        </div>
                        <div className="w-full">
                          <h4 className="font-bold text-[#0A1A2F] text-xs mb-1 line-clamp-2">{challenge.title}</h4>
                          <p className="text-[10px] text-[#0A1A2F]/60 mb-2">{challenge.duration_days} Days</p>
                          {isParticipating ? (
                            <div className="w-full">
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#D9B878] rounded-full transition-all" style={{ width: `${progress}%` }} />
                              </div>
                              <p className="text-[10px] text-[#0A1A2F]/60 mt-1">{progress}%</p>
                            </div>
                          ) : (
                            <div className="text-[10px] text-emerald-600 font-semibold">
                              Join Now
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* My Fitness Journey */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">My Fitness Journey</h3>
              {journeys.filter(j => j.is_active).length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate(createPageUrl('MyFitnessJourneyPage'))}
                >
                  {journeys.filter(j => j.is_active).map(journey => {
                    const completedCount = journey.completed_workouts?.length || 0;
                    const totalWorkouts = journey.weekly_plans?.reduce((sum, week) => sum + week.workouts.length, 0) || 0;
                    const progress = totalWorkouts > 0 ? (completedCount / totalWorkouts) * 100 : 0;
                    
                    return (
                      <div key={journey.id}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-full flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#0A1A2F]">{journey.title}</h4>
                            <p className="text-xs text-[#0A1A2F]/60">Week {journey.current_week} of {journey.duration_weeks}</p>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-[#0A1A2F]/60 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#D9B878] transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <Button className="w-full bg-[#D9B878] hover:bg-[#D9B878]/90 mt-3">
                          Continue Journey
                        </Button>
                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white shadow-md cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate(createPageUrl('FitnessJourneyBuilderPage'))}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">Create Your Journey</h4>
                      <p className="text-sm text-white/90">Build a personalized fitness plan</p>
                    </div>
                  </div>
                  <Button className="w-full bg-white text-purple-600 hover:bg-white/90">
                    Get Started
                  </Button>
                </motion.div>
              )}
            </div>



            {/* Workout Library */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Workout Library</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Cardio', icon: '❤️', color: 'from-red-400 to-pink-500', description: 'Get your heart pumping' },
                  { name: 'Strength', icon: '💪', color: 'from-blue-400 to-cyan-500', description: 'Build muscle & power' },
                  { name: 'HIIT', icon: '⚡', color: 'from-yellow-400 to-orange-500', description: 'High intensity intervals' },
                  { name: 'Home', icon: '🏠', color: 'from-green-400 to-emerald-500', description: 'No equipment needed' }
                ].map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-gradient-to-br ${category.color} rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all`}
                    onClick={() => navigate(createPageUrl(`WorkoutCategoryPage?category=${category.name}`))}
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h4 className="font-bold text-white text-sm mb-1">{category.name}</h4>
                    <p className="text-white/90 text-xs">{category.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* New Workouts to Try */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">New Workouts to Try</h3>
              <div className="space-y-3">
                {PREMADE_WORKOUTS.slice(0, 3).map((workout, index) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onComplete={() => {}}
                    index={index}
                    isPremade
                    user={user}
                  />
                ))}
              </div>
            </div>

            {/* My Workouts */}
            {myWorkouts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Your Custom Workouts</h3>
                <div className="space-y-3">
                  {myWorkouts.map((workout, index) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      onComplete={() => completeWorkout.mutate({ id: workout.id, workout })}
                      index={index}
                      user={user}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Community Feed */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Community Workouts</h3>
              <ReeVibeFitness user={user} />
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
           <TabsContent value="nutrition" className="space-y-8 max-w-2xl mx-auto">
             {/* Today's Nutrition Section */}
             <div className="pt-2">
               <NutritionDashboard mealLogs={mealLogs} />
             </div>

             {/* Suggested Meals Section */}
             <div className="pt-2">
               <MealSuggestions />
             </div>

             {/* Discover Recipes Section */}
             <div className="pt-2">
               <Link to={createPageUrl('DiscoverRecipes')}>
                 <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-2xl p-5 text-[#0A1A2F] cursor-pointer hover:shadow-lg transition-shadow">
                   <div className="flex items-center gap-3 mb-2">
                     <UtensilsCrossed className="w-6 h-6" />
                     <h3 className="text-lg font-semibold">Discover Recipes</h3>
                   </div>
                   <p className="text-[#0A1A2F]/70 text-sm">Browse and create delicious recipes</p>
                 </div>
               </Link>
             </div>

             {/* Trending Nutrition Articles Section */}
             <div className="pt-2">
               <TrendingNutritionArticles />
             </div>

             {/* Meal Tracker Section */}
             <div className="pt-2">
               <MealTracker />
             </div>

             {/* Personalized Nutrition Plan Section */}
             <div className="pt-2">
               <PersonalizedNutritionPlan />
             </div>

             {/* Community Feed Section */}
             <div className="pt-2">
               <CommunityRecipeFeed user={user} />
             </div>
            </TabsContent>



            {/* Personal Growth Tab */}
            <TabsContent value="mind" className="max-w-2xl mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2">Personal Growth</h2>
                <p className="text-sm text-[#0A1A2F]/60">Tools to strengthen your mind, emotions, and spiritual life.</p>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* My Journal */}
                <Link to={createPageUrl('MyJournalEntries')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">My Journal</h3>
                        <p className="text-xs text-[#0A1A2F]/60">View reflections</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Daily Mindset Reset */}
                <Link to={createPageUrl('MindsetResetPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#D9B878]/20 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Mindset Reset</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Daily prompts</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Emotional Check-In */}
                <Link to={createPageUrl('EmotionalCheckInPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Emotional Check-In</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Track feelings</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Scripture Affirmations */}
                <Link to={createPageUrl('AffirmationsPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#AFC7E3]/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#AFC7E3]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Affirmations</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Daily truths</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Growth Pathways */}
                <Link to={createPageUrl('GrowthPathwaysPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-[#AFC7E3]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Growth Pathways</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Personal development</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Habit Builder */}
                <Link to={createPageUrl('HabitBuilderPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Habit Builder</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Daily tracking</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Identity in Christ */}
                <Link to={createPageUrl('IdentityInChristPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#D9B878]/20 rounded-full flex items-center justify-center">
                        <Crown className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Identity in Christ</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Know who you are</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Weekly Reflection */}
                <Link to={createPageUrl('WeeklyReflectionPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#AFC7E3]/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#AFC7E3]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Weekly Reflection</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Review your week</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Self-Care Challenges */}
                <Link to={createPageUrl('SelfCareChallengesPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-[#D9B878]/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-[#D9B878]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Self-Care Challenges</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Build habits</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Gratitude Journal */}
                <Link to={createPageUrl('GratitudeJournalPage')}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1A2F]">Gratitude Journal</h3>
                        <p className="text-xs text-[#0A1A2F]/60">Count blessings</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </TabsContent>

            </Tabs>
        </PullToRefresh>
      </div>

      {/* Modals */}
      <CreateWorkoutModal
        isOpen={showCreateWorkout}
        onClose={() => setShowCreateWorkout(false)}
      />
      
      {selectedWorkout && (
        <StartWorkoutModal
          isOpen={showStartWorkout}
          onClose={() => {
            setShowStartWorkout(false);
            setSelectedWorkout(null);
          }}
          workout={selectedWorkout}
          user={user}
        />
      )}

      {/* Conditional Chatbots based on active tab */}
      {activeTab === 'workouts' && (
        <CoachDavid 
          user={user} 
          userWorkouts={myWorkouts}
          workoutSessions={workoutSessions}
        />
      )}
      {activeTab === 'nutrition' && (
       <ChefDaniel 
         user={user} 
         userRecipes={[]}
         mealLogs={mealLogs}
       />
      )}
      </div>
      );
      }