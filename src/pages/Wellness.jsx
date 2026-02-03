import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Dumbbell, UtensilsCrossed, Heart, Plus, TrendingUp, Droplets } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import RecipeCard from '@/components/wellness/RecipeCard';
import CreateWorkoutModal from '@/components/wellness/CreateWorkoutModal';
import CreateRecipeModal from '@/components/wellness/CreateRecipeModal';
import NutritionAdvice from '@/components/wellness/NutritionAdvice';
import MealTracker from '@/components/wellness/MealTracker';
import WaterTracker from '@/components/wellness/WaterTracker';
import MeditationGuide from '@/components/wellness/MeditationGuide';
import { awardPoints, checkAndAwardBadges } from '@/components/gamification/ProgressManager';
import AIMealPlanner from '@/components/wellness/AIMealPlanner';
import CustomPrayerBuilder from '@/components/wellness/CustomPrayerBuilder';
import ProgressCharts from '@/components/wellness/ProgressCharts';

export default function Wellness() {
  const [user, setUser] = useState(null);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
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
          <TabsList className="grid w-full grid-cols-5 mb-6 text-xs">
            <TabsTrigger value="tracker">Track</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
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
            <Button
              onClick={() => setShowCreateWorkout(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 mb-4"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Workout Plan
            </Button>

            {myWorkouts.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
                <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No workout plans yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myWorkouts.map((workout, index) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onComplete={() => completeWorkout.mutate({ id: workout.id, workout })}
                    index={index}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition">
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
              className="w-full bg-orange-500 hover:bg-orange-600 mb-4"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Recipe
            </Button>

            {myRecipes.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#2d2d4a] rounded-2xl">
                <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recipes yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {myRecipes.map((recipe, index) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                ))}
              </div>
            )}
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
    </div>
  );
}