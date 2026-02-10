import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Dumbbell, UtensilsCrossed, Heart, Plus, TrendingUp, Droplets, ArrowLeft, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import CreateWorkoutModal from '@/components/wellness/CreateWorkoutModal';
import NutritionAdvice from '@/components/wellness/NutritionAdvice';
import MealTracker from '@/components/wellness/MealTracker';
import WaterTracker from '@/components/wellness/WaterTracker';
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

import DailyRoutineCards from '@/components/selfcare/DailyRoutineCards';
import QuickTools from '@/components/selfcare/QuickTools';
import MoodTracker from '@/components/selfcare/MoodTracker';
import AffirmationsCarousel from '@/components/selfcare/AffirmationsCarousel';
import SelfCareChallenges from '@/components/selfcare/SelfCareChallenges';
import ProgressSnapshot from '@/components/selfcare/ProgressSnapshot';
import TakeTimeWithGod from '@/components/selfcare/TakeTimeWithGod';

import CoachDavid from '@/components/wellness/CoachDavid';
import ChefDaniel from '@/components/wellness/ChefDaniel';
import Hannah from '@/components/wellness/Hannah.jsx';

import MeditationTracker from '@/components/wellness/MeditationTracker';
import PrayForMeFeed from '@/components/wellness/PrayForMeFeed';


export default function Wellness() {
  const [user, setUser] = useState(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [activeTab, setActiveTab] = useState('workouts');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
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
    queryFn: () => base44.entities.Meditation.filter({})
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => base44.entities.Challenge.filter({})
  });

  const { data: challengeParticipants = [] } = useQuery({
    queryKey: ['challengeParticipants'],
    queryFn: () => base44.entities.ChallengeParticipant.filter({ user_email: user?.email }),
    enabled: !!user
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

  const totalWorkoutsCompleted = myWorkouts.reduce((sum, w) => sum + (w.completed_dates?.length || 0), 0);
  const thisWeekWorkouts = myWorkouts.filter(w => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return (w.completed_dates || []).some(d => new Date(d) >= weekAgo);
  }).length;

  return (
    <div className={`min-h-screen pb-24 ${activeTab === 'nutrition' ? 'bg-[#f6ebe0]' : 'bg-[#000000]'}`}>
      {/* Header with Banner - Show ReeVibe on workouts, Good Pantry on nutrition, none on meditation */}
      {activeTab !== 'meditation' && (
        <div className="relative bg-black -mx-4">
          <img 
            src={activeTab === 'nutrition' 
              ? "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6980ade9ca08df558ed28bdd/0079a599f_TheGoodPantry.png"
              : "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6980ade9ca08df558ed28bdd/171d02df6_ReeVibeLogonew.jpg"
            }
            alt={activeTab === 'nutrition' ? "The Good Pantry" : "ReeVibe Fitness"}
            className="w-full h-64 object-cover"
          />
          <Link
            to={createPageUrl('Home')}
            className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${activeTab === 'nutrition' ? 'bg-green-500 hover:bg-green-600' : 'bg-[#FD9C2D] hover:bg-[#C4E3FD]'}`}
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </Link>
        </div>
      )}

      {/* Back button for meditation tab */}
      {activeTab === 'meditation' && (
        <div className="px-4 pt-4 mb-4">
          <Link
            to={createPageUrl('Home')}
            className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        </div>
      )}

      {/* Moments of Revival Banner for Meditation Tab */}
      {activeTab === 'meditation' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 p-8 text-white text-center shadow-lg -mx-4"
        >
          <h2 className="text-4xl font-bold mb-2">Moments of Revival</h2>
          <p className="text-white/90">Find peace, prayer, and spiritual renewal</p>
        </motion.div>
      )}

      <div className="px-4 pt-6">

        <Tabs defaultValue="workouts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className={`grid w-full grid-cols-4 mb-6 p-1 rounded-xl ${activeTab === 'nutrition' ? 'bg-[#90EE90]' : activeTab === 'meditation' ? 'bg-purple-500' : 'bg-[#FD9C2D]'}`}>
            <TabsTrigger value="workouts" className={`text-xs sm:text-sm ${activeTab === 'nutrition' ? 'data-[state=active]:bg-[#FFFF00]' : activeTab === 'meditation' ? 'data-[state=active]:bg-pink-300' : 'data-[state=active]:bg-[#C4E3FD]'} ${activeTab === 'meditation' ? 'text-white data-[state=active]:text-white' : 'data-[state=active]:text-black'}`}>Workouts</TabsTrigger>
            <TabsTrigger value="nutrition" className={`text-xs sm:text-sm ${activeTab === 'nutrition' ? 'data-[state=active]:bg-[#FFFF00]' : activeTab === 'meditation' ? 'data-[state=active]:bg-pink-300' : 'data-[state=active]:bg-[#C4E3FD]'} ${activeTab === 'meditation' ? 'text-white data-[state=active]:text-white' : 'data-[state=active]:text-black'}`}>Nutrition</TabsTrigger>
            <TabsTrigger value="meditation" className={`text-xs sm:text-sm ${activeTab === 'nutrition' ? 'data-[state=active]:bg-[#FFFF00]' : activeTab === 'meditation' ? 'data-[state=active]:bg-pink-300' : 'data-[state=active]:bg-[#C4E3FD]'} ${activeTab === 'meditation' ? 'text-white data-[state=active]:text-white' : 'data-[state=active]:text-black'}`}>Meditation</TabsTrigger>
            <TabsTrigger value="selfcare" className={`text-xs sm:text-sm ${activeTab === 'nutrition' ? 'data-[state=active]:bg-[#FFFF00]' : activeTab === 'meditation' ? 'data-[state=active]:bg-pink-300' : 'data-[state=active]:bg-[#C4E3FD]'} ${activeTab === 'meditation' ? 'text-white data-[state=active]:text-white' : 'data-[state=active]:text-black'}`}>Self-Care</TabsTrigger>
          </TabsList>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-4">
            {/* Progress Link */}
            <Link to={createPageUrl('WorkoutProgress')}>
              <div className="bg-gradient-to-br from-[#FD9C2D] via-[#000000] to-[#C4E3FD] rounded-xl p-4 text-white flex items-center justify-between shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <h3 className="font-semibold text-lg">View Your Progress</h3>
                  <p className="text-white/90 text-sm">Charts, PRs & workout stats</p>
                </div>
                <TrendingUp className="w-8 h-8" />
              </div>
            </Link>

            {/* 1. My Workout Journey */}
            <div className="mb-4">
              <AIWellnessJourneyGenerator 
                user={user} 
                onJourneyCreated={() => queryClient.invalidateQueries(['journeys'])}
              />
            </div>

            {journeys.filter(j => j.is_active).length > 0 && (
              <div className="mb-4 space-y-3">
                {journeys.filter(j => j.is_active).map(journey => (
                  <WellnessJourneyCard
                    key={journey.id}
                    journey={journey}
                    onClick={() => window.location.href = createPageUrl(`WellnessJourney?id=${journey.id}`)}
                  />
                ))}
              </div>
            )}

            {/* 2. Discover Workouts */}
            <Link to={createPageUrl('DiscoverWorkouts')}>
              <div className="bg-gradient-to-br from-[#FD9C2D] via-[#000000] to-[#C4E3FD] rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Discover Workouts</h3>
                </div>
                <p className="text-white/90 text-sm">Browse and create custom workouts</p>
              </div>
            </Link>

            {/* My Workouts */}
            {myWorkouts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#C4E3FD] mb-2">Your Workouts</h3>
                <div className="space-y-3 mb-6">
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

            {/* ReeVibe Fitness Feed */}
            <ReeVibeFitness user={user} />
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6 bg-[#f6ebe0] -mx-4 px-4 py-6 rounded-t-2xl">
            <MealTracker />
            
            <PersonalizedNutritionPlan />
            <NutritionAdvice />

            {/* Discover Recipes */}
            <Link to={createPageUrl('DiscoverRecipes')}>
              <div className="bg-gradient-to-br from-[#90EE90] via-[#FFFF00] to-[#f6ebe0] rounded-2xl p-5 text-black cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <UtensilsCrossed className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Discover Recipes</h3>
                </div>
                <p className="text-black text-sm">Browse and create delicious recipes</p>
              </div>
            </Link>

            {/* Community Feed */}
            <CommunityRecipeFeed user={user} />
          </TabsContent>

          {/* Meditation Tab */}
          <TabsContent value="meditation" className="space-y-4">
            {/* Discover All Meditations */}
            <Link to={createPageUrl('DiscoverMeditations')}>
              <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Discover All Meditations</h3>
                </div>
                <p className="text-white/90 text-sm">Browse our full library of guided sessions</p>
              </div>
            </Link>

            {journeys.filter(j => j.is_active).length > 0 && (
              <div className="bg-gradient-to-br from-[#FD9C2D] via-[#000000] to-[#C4E3FD] rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-white mb-4">Mood & Energy Insights</h3>
                <MoodEnergyChart 
                  moodEnergyData={journeys.find(j => j.is_active)?.mood_energy_tracking || []} 
                />
              </div>
            )}
            

            
            <MeditationTracker user={user} />

            <MeditationGuide />

            <PrayForMeFeed user={user} />
          </TabsContent>

          {/* Self-Care Tab */}
          <TabsContent value="selfcare" className="space-y-4 bg-gradient-to-br from-[#1a1a2e] via-[#2d3142] to-[#1a1a2e] -mx-4 px-4 py-6 rounded-t-2xl">
            <DailyRoutineCards meditations={meditations} />
            <QuickTools />
            <MoodTracker />
            <AffirmationsCarousel />
            <SelfCareChallenges challenges={challenges} participations={challengeParticipants} />
            <ProgressSnapshot 
              meditationSessions={meditationSessions}
              challengeParticipants={challengeParticipants}
            />
            <TakeTimeWithGod />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateWorkoutModal
        isOpen={showCreateWorkout}
        onClose={() => setShowCreateWorkout(false)}
      />

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
      {activeTab === 'meditation' && (
        <Hannah user={user} meditationSessions={meditationSessions} />
      )}
    </div>
  );
}