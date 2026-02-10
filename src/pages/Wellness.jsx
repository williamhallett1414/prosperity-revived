import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Dumbbell, UtensilsCrossed, Heart, Plus, TrendingUp, Droplets, ArrowLeft, Sparkles, BookOpen, Brain, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import CreateWorkoutModal from '@/components/wellness/CreateWorkoutModal';
import NutritionAdvice from '@/components/wellness/NutritionAdvice';
import MealTracker from '@/components/wellness/MealTracker';
import MealSuggestions from '@/components/nutrition/MealSuggestions';
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

import DailyRoutineCards from '@/components/selfcare/DailyRoutineCards';
import QuickTools from '@/components/selfcare/QuickTools';
import DailyAffirmation from '@/components/selfcare/DailyAffirmation';
import SelfCareChallenges from '@/components/selfcare/SelfCareChallenges';
import ProgressSnapshot from '@/components/selfcare/ProgressSnapshot';
import TakeTimeWithGod from '@/components/selfcare/TakeTimeWithGod';
import DailyPrayer from '@/components/selfcare/DailyPrayer';
import MeditationTracker from '@/components/wellness/MeditationTracker';
import PrayForMeFeed from '@/components/wellness/PrayForMeFeed';

import AIWellnessRecommendations from '@/components/wellness/AIWellnessRecommendations';
import WellnessMetricsOverview from '@/components/wellness/WellnessMetricsOverview';
import WellnessCommunityFeed from '@/components/wellness/WellnessCommunityFeed';
import PersonalizedWorkouts from '@/components/recommendations/PersonalizedWorkouts';
import { Input } from '@/components/ui/input';


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
        
        <Tabs defaultValue="hub" value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 p-1 rounded-xl bg-[#E6EBEF]">
            <TabsTrigger value="hub" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Hub</TabsTrigger>
            <TabsTrigger value="workouts" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Nutrition</TabsTrigger>
            <TabsTrigger value="mind" className="text-xs data-[state=active]:bg-[#D9B878] data-[state=active]:text-[#0A1A2F]">Mind & Spirit</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-4 pt-6 pb-6">
        {/* Weekly Theme */}
        <WeeklyThemeBanner />

        {activeTab === 'hub' && (
          <div className="max-w-2xl mx-auto mb-8 space-y-8">
            <AIWellnessRecommendations 
              user={user}
              signupAnswers={user?.signup_answers}
            />
            
            <WellnessCommunityFeed
              posts={posts}
              meditations={meditations}
              recipes={recipes}
              workouts={myWorkouts}
              comments={comments}
            />
            
            <WellnessMetricsOverview
              meditationSessions={meditationSessions}
              workoutSessions={workoutSessions}
              mealLogs={mealLogs}
              waterLogs={waterLogs}
              journalEntries={journalEntries}
              prayerJournals={prayerJournals}
              userProgress={userProgress}
              challengeParticipants={challengeParticipants}
            />
          </div>
        )}

        <Tabs defaultValue="hub" value={activeTab} className="w-full" onValueChange={setActiveTab}>
          {/* Hub Tab */}
          <TabsContent value="hub" className="block" />

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-4 max-w-2xl mx-auto">
            {/* Search & Discovery */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search workouts..."
                value={workoutCategory}
                onChange={(e) => setWorkoutCategory(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Create Workout Button */}
            <Button
              onClick={() => setShowCreateWorkout(true)}
              className="bg-emerald-600 hover:bg-emerald-700 w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Custom Workout
            </Button>

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

            {/* My Workout Journey */}
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

            {/* Personalized Recommendations */}
            <PersonalizedWorkouts 
              user={user} 
              userWorkouts={myWorkouts}
              onComplete={(workout) => completeWorkout.mutate({ id: workout.id, workout })}
            />

            {/* Pre-Made Workouts */}
            <div>
              <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Pre-Made Workouts</h3>
              <div className="space-y-3">
                {PREMADE_WORKOUTS.slice(0, 5).map((workout, index) => (
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
                <h3 className="text-sm font-semibold text-[#0A1A2F] mb-3">Your Workouts</h3>
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

            {/* ReeVibe Fitness Feed */}
            <ReeVibeFitness user={user} />
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6 max-w-2xl mx-auto">
            <NutritionDashboard mealLogs={mealLogs} waterLogs={waterLogs} />
            <MealSuggestions />
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

            {/* Mind & Spirit Tab */}
            <TabsContent value="mind" className="space-y-4 max-w-2xl mx-auto">
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

              <DailyRoutineCards meditations={meditations} />
              <DailyPrayer />
              <QuickTools />
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
    </div>
  );
}