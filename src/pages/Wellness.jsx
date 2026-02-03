import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Dumbbell, UtensilsCrossed, Heart, Plus, TrendingUp, Droplets } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';
import AIMealPlanner from '@/components/wellness/AIMealPlanner';
import CustomPrayerBuilder from '@/components/wellness/CustomPrayerBuilder';
import ProgressCharts from '@/components/wellness/ProgressCharts';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';
import WorkoutProgressCharts from '@/components/wellness/WorkoutProgressCharts';
import AIWorkoutRecommendations from '@/components/wellness/AIWorkoutRecommendations';

export default function Wellness() {
  const [user, setUser] = useState(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [showProgressCharts, setShowProgressCharts] = useState(false);
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
        <h1 className="text-2xl font-bold mb-2">Health & Wellness</h1>
        <p className="text-white/80 text-sm">Nourish your body, strengthen your spirit</p>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg text-center"
          >
            <Dumbbell className="w-6 h-6 text-emerald-600 mb-2 mx-auto" />
            <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{totalWorkoutsCompleted}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg text-center"
          >
            <TrendingUp className="w-6 h-6 text-teal-600 mb-2 mx-auto" />
            <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{thisWeekWorkouts}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg text-center"
          >
            <UtensilsCrossed className="w-6 h-6 text-orange-500 mb-2 mx-auto" />
            <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{myRecipes.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Recipes</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4">
        <Tabs defaultValue="tracker" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 text-xs">
            <TabsTrigger value="tracker">Track</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="meditation">Mindful</TabsTrigger>
          </TabsList>

          {/* Tracker Tab */}
          <TabsContent value="tracker" className="space-y-4">
            <ProgressCharts />
            <WaterTracker />
            <MealTracker />
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowCreateWorkout(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Workout
              </Button>
              <Button
                onClick={() => setShowProgressCharts(true)}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View Progress
              </Button>
            </div>

            <AIWorkoutRecommendations />

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
            <AIMealPlanner />
            <NutritionAdvice />
          </TabsContent>

          {/* Meditation Tab */}
          <TabsContent value="meditation" className="space-y-4">
            <CustomPrayerBuilder />
            <MeditationGuide />
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes" className="space-y-4">
            <Button
              onClick={() => setShowCreateRecipe(true)}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Recipe
            </Button>

            <RecipeFilters filters={recipeFilters} onFilterChange={setRecipeFilters} />

            {/* Popular Recipes */}
            {popularRecipes.length > 0 && recipeFilters.search === '' && recipeFilters.dietType === 'all' && recipeFilters.category === 'all' && recipeFilters.prepTime === 'all' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Popular Recipes</h3>
                </div>
                <div className="grid gap-4 mb-6">
                  {popularRecipes.map((recipe, index) => (
                    <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* My Recipes */}
            {myRecipes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Recipes</h3>
                <div className="grid gap-4 mb-6">
                  {myRecipes.map((recipe, index) => (
                    <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Results */}
            {(recipeFilters.search || recipeFilters.dietType !== 'all' || recipeFilters.category !== 'all' || recipeFilters.prepTime !== 'all') && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Search Results ({filteredRecipes.length})
                </h3>
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
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-4">
            <RecipeCollections allRecipes={recipes} />
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
      <WorkoutProgressCharts
        isOpen={showProgressCharts}
        onClose={() => setShowProgressCharts(false)}
      />
    </div>
  );
}