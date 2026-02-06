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
import RecipeCard from '@/components/wellness/RecipeCard';
import RecipeFilters from '@/components/wellness/RecipeFilters';
import CreateWorkoutModal from '@/components/wellness/CreateWorkoutModal';
import CreateRecipeModal from '@/components/wellness/CreateRecipeModal';
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
import PersonalizedWorkouts from '@/components/recommendations/PersonalizedWorkouts';
import PersonalizedRecipes from '@/components/recommendations/PersonalizedRecipes';
import ContextualSuggestions from '@/components/ai/ContextualSuggestions';
import AIWellnessJourneyGenerator from '@/components/wellness/AIWellnessJourneyGenerator';
import WellnessJourneyCard from '@/components/wellness/WellnessJourneyCard';
import MoodEnergyChart from '@/components/wellness/MoodEnergyChart';
import SelfCareGuides from '@/components/wellness/SelfCareGuides';
import DiscoverWorkouts from '@/components/wellness/DiscoverWorkouts';
import CoachDavid from '@/components/wellness/CoachDavid';

export default function Wellness() {
  const [user, setUser] = useState(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [recipeFilters, setRecipeFilters] = useState({
    search: '',
    dietType: 'all',
    category: 'all',
    prepTime: 'all'
  });
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
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white px-4 py-6">
        <Link
          to={createPageUrl('Home')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 inline-flex"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold mb-2">Health & Wellness</h1>
        <p className="text-white/80 text-sm">Nourish your body, strengthen your spirit</p>
      </div>

      <div className="px-4 pt-6">
        <Tabs defaultValue="workouts" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-xl">
            <TabsTrigger value="workouts" className="text-xs sm:text-sm">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition" className="text-xs sm:text-sm">Nutrition</TabsTrigger>
            <TabsTrigger value="meditation" className="text-xs sm:text-sm">Meditation</TabsTrigger>
            <TabsTrigger value="selfcare" className="text-xs sm:text-sm">Self-Care</TabsTrigger>
          </TabsList>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-4">
            {/* AI Journey Generator */}
            <AIWellnessJourneyGenerator 
              user={user} 
              onJourneyCreated={() => queryClient.invalidateQueries(['journeys'])}
            />

            {/* Active Journeys */}
            {journeys.filter(j => j.is_active).map(journey => (
              <WellnessJourneyCard
                key={journey.id}
                journey={journey}
                onClick={() => window.location.href = createPageUrl(`WellnessJourney?id=${journey.id}`)}
              />
            ))}

            <Button
              onClick={() => setShowCreateWorkout(true)}
              className="bg-emerald-600 hover:bg-emerald-700 w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Workout
            </Button>

            <DiscoverWorkouts user={user} />
            
            <PersonalizedWorkouts 
              user={user} 
              userWorkouts={myWorkouts}
              onComplete={(workout) => completeWorkout.mutate({ id: workout.id, workout })}
            />

            {myWorkouts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Workouts</h3>
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

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pre-Made Workouts</h3>
              <div className="space-y-3">
                {PREMADE_WORKOUTS.map((workout, index) => (
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
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-4">
            <WaterTracker />
            <MealTracker />
            
            <PersonalizedNutritionPlan />
            <AIMealPlanner />
            <NutritionAdvice />
            
            {/* Recipes Section */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Recipes</h3>
                <Button
                  onClick={() => setShowCreateRecipe(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recipe
                </Button>
              </div>

              <RecipeFilters filters={recipeFilters} onFilterChange={setRecipeFilters} />

              {/* Personalized Recipes */}
              {recipeFilters.search === '' && recipeFilters.dietType === 'all' && recipeFilters.category === 'all' && recipeFilters.prepTime === 'all' && (
                <PersonalizedRecipes user={user} allRecipes={recipes} />
              )}

              {/* Popular Recipes */}
              {popularRecipes.length > 0 && recipeFilters.search === '' && recipeFilters.dietType === 'all' && recipeFilters.category === 'all' && recipeFilters.prepTime === 'all' && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Popular Recipes</h4>
                  </div>
                  <div className="grid gap-4">
                    {popularRecipes.map((recipe, index) => (
                      <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* My Recipes */}
              {myRecipes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Recipes</h4>
                  <div className="grid gap-4">
                    {myRecipes.map((recipe, index) => (
                      <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {/* Filtered Results */}
              {(recipeFilters.search || recipeFilters.dietType !== 'all' || recipeFilters.category !== 'all' || recipeFilters.prepTime !== 'all') && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Search Results ({filteredRecipes.length})
                  </h4>
                  {filteredRecipes.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
                      <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No recipes match your filters</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredRecipes.map((recipe, index) => (
                        <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Collections */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Collections</h4>
                <RecipeCollections allRecipes={recipes} />
              </div>
              
              {/* Community Recipes */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Community Recipes</h4>
                <CommunityRecipes />
              </div>
            </div>
          </TabsContent>

          {/* Meditation Tab */}
          <TabsContent value="meditation" className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Mindfulness & Prayer</h3>
              </div>
              <p className="text-white/80 text-sm">Find peace through meditation and prayer</p>
            </div>

            {journeys.filter(j => j.is_active).length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Mood & Energy Insights</h3>
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

      {/* Coach David Chatbot */}
      <CoachDavid 
        user={user} 
        userWorkouts={myWorkouts}
        workoutSessions={workoutSessions}
      />
    </div>
  );
}