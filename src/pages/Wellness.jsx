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

import CoachDavid from '@/components/wellness/CoachDavid';
import ChefDaniel from '@/components/wellness/ChefDaniel';


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

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list('-created_date')
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
  const myRecipes = recipes.filter(r => r.created_by === user?.email);
  const allRecipes = recipes;
  const allWorkouts = [...PREMADE_WORKOUTS, ...myWorkouts];

  // Filter recipes
  const filteredRecipes = allRecipes.filter(recipe => {
    // Search filter
    if (recipeFilters.search) {
      const searchLower = recipeFilters.search.toLowerCase();
      const matchesTitle = recipe.title?.toLowerCase().includes(searchLower);
      const matchesIngredients = recipe.ingredients?.some(ing => 
        ing.toLowerCase().includes(searchLower)
      );
      if (!matchesTitle && !matchesIngredients) return false;
    }

    // Diet type filter
    if (recipeFilters.dietType !== 'all' && recipe.diet_type !== recipeFilters.dietType) {
      return false;
    }

    // Category filter
    if (recipeFilters.category !== 'all' && recipe.category !== recipeFilters.category) {
      return false;
    }

    // Prep time filter
    if (recipeFilters.prepTime !== 'all') {
      const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
      if (recipeFilters.prepTime === 'quick' && totalTime >= 15) return false;
      if (recipeFilters.prepTime === 'medium' && (totalTime < 15 || totalTime > 30)) return false;
      if (recipeFilters.prepTime === 'long' && totalTime < 30) return false;
    }

    return true;
  });

  // Popular recipes (sample data based on created_date - can be enhanced with actual tracking)
  const popularRecipes = [...allRecipes]
    .filter(r => !r.created_by || r.created_by !== user?.email) // Pre-made recipes
    .slice(0, 6);

  const totalWorkoutsCompleted = myWorkouts.reduce((sum, w) => sum + (w.completed_dates?.length || 0), 0);
  const thisWeekWorkouts = myWorkouts.filter(w => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return (w.completed_dates || []).some(d => new Date(d) >= weekAgo);
  }).length;

  return (
    <div className="min-h-screen bg-[#000000] pb-24">
      {/* Header with Banner */}
      <div className="relative bg-black -mx-4">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6980ade9ca08df558ed28bdd/171d02df6_ReeVibeLogonew.jpg"
          alt="ReeVibe Fitness"
          className="w-full h-64 object-cover"
        />
        <Link
          to={createPageUrl('Home')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#FD9C2D] flex items-center justify-center hover:bg-[#C4E3FD] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </Link>
      </div>

      <div className="px-4 pt-6">
        <Tabs defaultValue="workouts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-[#FD9C2D] p-1 rounded-xl">
            <TabsTrigger value="workouts" className="text-xs sm:text-sm data-[state=active]:bg-[#C4E3FD] data-[state=active]:text-black">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition" className="text-xs sm:text-sm data-[state=active]:bg-[#C4E3FD] data-[state=active]:text-black">Nutrition</TabsTrigger>
            <TabsTrigger value="meditation" className="text-xs sm:text-sm data-[state=active]:bg-[#C4E3FD] data-[state=active]:text-black">Meditation</TabsTrigger>
            <TabsTrigger value="selfcare" className="text-xs sm:text-sm data-[state=active]:bg-[#C4E3FD] data-[state=active]:text-black">Self-Care</TabsTrigger>
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
          <TabsContent value="nutrition" className="space-y-4">
            <MealTracker />
            
            <PersonalizedNutritionPlan />
            <NutritionAdvice />

            {/* Discover Recipes */}
            <Link to={createPageUrl('DiscoverRecipes')}>
              <div className="bg-gradient-to-br from-[#FD9C2D] via-[#000000] to-[#C4E3FD] rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <UtensilsCrossed className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Discover Recipes</h3>
                </div>
                <p className="text-white/90 text-sm">Browse and create delicious recipes</p>
              </div>
            </Link>
            

          </TabsContent>

          {/* Meditation Tab */}
          <TabsContent value="meditation" className="space-y-4">
            <div className="bg-gradient-to-br from-[#FD9C2D] via-[#000000] to-[#C4E3FD] rounded-2xl p-6 text-white mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Mindfulness & Prayer</h3>
              </div>
              <p className="text-white/90 text-sm">Find peace through meditation and prayer</p>
            </div>

            {journeys.filter(j => j.is_active).length > 0 && (
              <div className="bg-gradient-to-br from-[#FD9C2D] via-[#000000] to-[#C4E3FD] rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-white mb-4">Mood & Energy Insights</h3>
                <MoodEnergyChart 
                  moodEnergyData={journeys.find(j => j.is_active)?.mood_energy_tracking || []} 
                />
              </div>
            )}
            
            <ContextualSuggestions 
              user={user} 
              currentContext={{ activity: 'meditation_practice' }}
            />
            
            <CustomPrayerBuilder />
            <MeditationGuide />
          </TabsContent>

          {/* Self-Care Tab */}
          <TabsContent value="selfcare" className="space-y-4">
            <SelfCareGuides user={user} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateWorkoutModal
        isOpen={showCreateWorkout}
        onClose={() => setShowCreateWorkout(false)}
      />
      <CreateRecipeModal
        isOpen={showCreateRecipe}
        onClose={() => setShowCreateRecipe(false)}
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
          userRecipes={myRecipes}
          mealLogs={mealLogs}
        />
      )}
    </div>
  );
}