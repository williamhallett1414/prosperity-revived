import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Dumbbell, UtensilsCrossed, Heart, Plus, TrendingUp, Droplets, ArrowLeft, Sparkles, BookOpen, Brain } from 'lucide-react';
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
import DailyAffirmation from '@/components/selfcare/DailyAffirmation';
import SelfCareChallenges from '@/components/selfcare/SelfCareChallenges';
import ProgressSnapshot from '@/components/selfcare/ProgressSnapshot';
import TakeTimeWithGod from '@/components/selfcare/TakeTimeWithGod';
import DailyPrayer from '@/components/selfcare/DailyPrayer';
import WellnessHubCard from '@/components/wellness/WellnessHubCard';
import WeeklyThemeBanner from '@/components/wellness/WeeklyThemeBanner';
import WorkoutCategoryFilter from '@/components/workouts/WorkoutCategoryFilter';
import NutritionDashboard from '@/components/nutrition/NutritionDashboard';

import CoachDavid from '@/components/wellness/CoachDavid';
import ChefDaniel from '@/components/wellness/ChefDaniel';
import Hannah from '@/components/wellness/Hannah.jsx';

import MeditationTracker from '@/components/wellness/MeditationTracker';
import PrayForMeFeed from '@/components/wellness/PrayForMeFeed';


export default function Wellness() {
  const [user, setUser] = useState(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [activeTab, setActiveTab] = useState('hub');
  const [workoutCategory, setWorkoutCategory] = useState(null);
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
    queryFn: async () => {
      try {
        return await base44.entities.Meditation.filter({});
      } catch (error) {
        return [];
      }
    },
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

  const totalWorkoutsCompleted = myWorkouts.reduce((sum, w) => sum + (w.completed_dates?.length || 0), 0);
  const thisWeekWorkouts = myWorkouts.filter(w => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return (w.completed_dates || []).some(d => new Date(d) >= weekAgo);
  }).length;

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Back Button */}
      <div className="px-4 pt-4 mb-4">
        <Link
          to={createPageUrl('Home')}
          className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
        </Link>
      </div>

      <div className="px-4 pt-2 pb-6">
        {/* Weekly Theme */}
        <WeeklyThemeBanner />

        {activeTab === 'hub' && (
          <div className="max-w-2xl mx-auto px-2 mb-8">
            <h2 className="text-xl font-bold text-[#0A1A2F] mb-4">Wellness Hub</h2>
            <div className="space-y-3">
              <WellnessHubCard
                icon={Brain}
                title="Self-Care"
                description="Daily routines, meditation & affirmations"
                color="from-[#AFC7E3] to-[#D9B878]"
                page="SelfCare"
                index={0}
              />
              <WellnessHubCard
                icon={Sparkles}
                title="Meditations"
                description="Guided sessions for peace & healing"
                color="from-[#D9B878] to-[#FD9C2D]"
                page="DiscoverMeditations"
                index={1}
              />
              <WellnessHubCard
                icon={Heart}
                title="Challenges"
                description="Community challenges & accountability"
                color="from-[#FD9C2D] to-[#D9B878]"
                page="Wellness"
                index={2}
              />
              <WellnessHubCard
                icon={BookOpen}
                title="Journaling"
                description="Track thoughts, gratitude & growth"
                color="from-[#D9B878] to-[#AFC7E3]"
                page="Wellness"
                index={3}
              />
              <WellnessHubCard
                icon={TrendingUp}
                title="Scripture"
                description="Daily verses & spiritual growth"
                color="from-[#AFC7E3] to-[#D9B878]"
                page="Bible"
                index={4}
              />
            </div>
          </div>
        )}

        <Tabs defaultValue="hub" value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6 p-1 rounded-xl bg-[#E6EBEF] max-w-2xl mx-auto">
            <TabsTrigger value="hub" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Hub</TabsTrigger>
            <TabsTrigger value="workouts" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Nutrition</TabsTrigger>
            <TabsTrigger value="meditation" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Meditation</TabsTrigger>
            <TabsTrigger value="selfcare" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Self-Care</TabsTrigger>
          </TabsList>

          {/* Hub Tab */}
          <TabsContent value="hub" className="hidden" />

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-4 max-w-2xl mx-auto">
            <WorkoutCategoryFilter onFilterChange={setWorkoutCategory} />
            {/* Progress Link */}
            <Link to={createPageUrl('WorkoutProgress')}>
              <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-xl p-4 text-[#0A1A2F] flex items-center justify-between shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <h3 className="font-semibold text-lg">View Your Progress</h3>
                  <p className="text-[#0A1A2F]/70 text-sm">Charts, PRs & workout stats</p>
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
              <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-2xl p-5 text-[#0A1A2F] cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Discover Workouts</h3>
                </div>
                <p className="text-[#0A1A2F]/70 text-sm">Browse and create custom workouts</p>
              </div>
            </Link>

            {/* My Workouts */}
            {myWorkouts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#0A1A2F] mb-2">Your Workouts</h3>
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
          <TabsContent value="nutrition" className="space-y-6 max-w-2xl mx-auto">
            <NutritionDashboard mealLogs={mealLogs} waterLogs={waterLogs} />
            <MealTracker />
            
            <PersonalizedNutritionPlan />
            <NutritionAdvice />

            {/* Discover Recipes */}
            <Link to={createPageUrl('DiscoverRecipes')}>
              <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-2xl p-5 text-[#0A1A2F] cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <UtensilsCrossed className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Discover Recipes</h3>
                </div>
                <p className="text-[#0A1A2F]/70 text-sm">Browse and create delicious recipes</p>
              </div>
            </Link>

            {/* Community Feed */}
            <CommunityRecipeFeed user={user} />
          </TabsContent>

          {/* Meditation Tab */}
          <TabsContent value="meditation" className="space-y-4 max-w-2xl mx-auto">
            {/* Discover All Meditations */}
            <Link to={createPageUrl('DiscoverMeditations')}>
              <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-2xl p-5 text-[#0A1A2F] cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Discover All Meditations</h3>
                </div>
                <p className="text-[#0A1A2F]/70 text-sm">Browse our full library of guided sessions</p>
              </div>
            </Link>

            {journeys.filter(j => j.is_active).length > 0 && (
              <div className="bg-[#E6EBEF] rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-[#0A1A2F] mb-4">Mood & Energy Insights</h3>
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
          <TabsContent value="selfcare" className="space-y-4 max-w-2xl mx-auto">
            <DailyRoutineCards meditations={meditations} />
            <DailyPrayer />
            <QuickTools />
            <MoodTracker />
            <DailyAffirmation />
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