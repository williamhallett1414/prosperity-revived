import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Target, Calendar, TrendingUp, Plus, Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CreateNutritionPlan from './CreateNutritionPlan';
import WeeklyMealPlan from './WeeklyMealPlan';

export default function PersonalizedNutritionPlan() {
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: plans = [] } = useQuery({
    queryKey: ['nutrition-plans'],
    queryFn: () => base44.entities.NutritionPlan.list('-created_date'),
    onSuccess: (data) => {
      const active = data.find(p => p.is_active);
      if (active) setActivePlan(active);
    }
  });

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: () => base44.entities.MealLog.list('-created_date', 100)
  });

  const { data: mealPlanDays = [] } = useQuery({
    queryKey: ['meal-plan-days', activePlan?.id],
    queryFn: () => base44.entities.MealPlanDay.filter({ nutrition_plan_id: activePlan.id }),
    enabled: !!activePlan
  });

  const generateWeeklyPlan = useMutation({
    mutationFn: async (planId) => {
      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      const allRecipes = await base44.entities.Recipe.list();
      const userRecipes = allRecipes.filter(r => r.created_by === user?.email);
      const communityRecipes = allRecipes.filter(r => r.is_shared);
      const availableRecipes = [...userRecipes, ...communityRecipes];

      // Filter recipes by dietary preferences
      let filteredRecipes = availableRecipes;
      if (plan.dietary_preferences?.length > 0) {
        filteredRecipes = availableRecipes.filter(r => 
          plan.dietary_preferences.includes(r.diet_type) || r.diet_type === 'any'
        );
      }

      // Generate 7 days of meal plans
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const dayMeals = [];
        let dayCalories = 0;
        let dayProtein = 0;
        let dayCarbs = 0;
        let dayFats = 0;

        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'].slice(0, plan.meals_per_day);
        
        for (const mealType of mealTypes) {
          const categoryRecipes = filteredRecipes.filter(r => r.category === mealType);
          if (categoryRecipes.length === 0) continue;

          const recipe = categoryRecipes[Math.floor(Math.random() * categoryRecipes.length)];
          const calories = recipe.calories || 0;
          const protein = (calories * 0.3) / 4; // Estimate
          const carbs = (calories * 0.4) / 4;
          const fats = (calories * 0.3) / 9;

          dayMeals.push({
            meal_type: mealType,
            recipe_id: recipe.id,
            recipe_title: recipe.title,
            calories,
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fats: Math.round(fats)
          });

          dayCalories += calories;
          dayProtein += protein;
          dayCarbs += carbs;
          dayFats += fats;
        }

        days.push({
          nutrition_plan_id: planId,
          date: dateStr,
          meals: dayMeals,
          total_calories: Math.round(dayCalories),
          total_protein: Math.round(dayProtein),
          total_carbs: Math.round(dayCarbs),
          total_fats: Math.round(dayFats),
          completed: false
        });
      }

      // Delete existing meal plans for this plan
      const existingDays = await base44.entities.MealPlanDay.filter({ nutrition_plan_id: planId });
      for (const day of existingDays) {
        await base44.entities.MealPlanDay.delete(day.id);
      }

      // Create new meal plan days
      for (const day of days) {
        await base44.entities.MealPlanDay.create(day);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['meal-plan-days']);
    }
  });

  // Calculate today's progress
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = mealLogs.filter(m => m.date === today);
  const todayCalories = todayLogs.reduce((sum, m) => sum + (m.calories || 0), 0);
  const todayProtein = todayLogs.reduce((sum, m) => sum + (m.protein || 0), 0);
  const todayCarbs = todayLogs.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const todayFats = todayLogs.reduce((sum, m) => sum + (m.fats || 0), 0);

  const goalLabels = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Maintenance',
    healthy_eating: 'Healthy Eating'
  };

  return (
    <div className="space-y-4">
      {!activePlan ? (
        <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl">
          <Target className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#1a1a2e] dark:text-white mb-2">
            Create Your Nutrition Plan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get personalized meal plans based on your goals
          </p>
          <Button
            onClick={() => setShowCreatePlan(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Plan Header */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{activePlan.name}</h3>
                <p className="text-white/80 text-sm">{goalLabels[activePlan.goal]}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateWeeklyPlan.mutate(activePlan.id)}
                  className="text-white hover:bg-white/20"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-white hover:bg-white/20"
                >
                  {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {!isCollapsed && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/80 text-xs mb-1">Daily Calories</p>
                  <p className="text-3xl font-bold">{activePlan.daily_calories}</p>
                </div>
                <div>
                  <p className="text-white/80 text-xs mb-1">Meals/Day</p>
                  <p className="text-3xl font-bold">{activePlan.meals_per_day}</p>
                </div>
              </div>
            )}
          </div>

          {/* Daily Macros */}
          <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
            <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-4">Daily Targets</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Protein</span>
                  <span className="font-medium">{todayProtein}g / {activePlan.protein_grams}g</span>
                </div>
                <Progress value={(todayProtein / activePlan.protein_grams) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Carbs</span>
                  <span className="font-medium">{todayCarbs}g / {activePlan.carbs_grams}g</span>
                </div>
                <Progress value={(todayCarbs / activePlan.carbs_grams) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Fats</span>
                  <span className="font-medium">{todayFats}g / {activePlan.fats_grams}g</span>
                </div>
                <Progress value={(todayFats / activePlan.fats_grams) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Calories</span>
                  <span className="font-medium">{todayCalories} / {activePlan.daily_calories}</span>
                </div>
                <Progress value={(todayCalories / activePlan.daily_calories) * 100} className="h-2" />
              </div>
            </div>
          </div>

          {/* Weekly Meal Plan */}
          {mealPlanDays.length > 0 ? (
            <WeeklyMealPlan mealPlanDays={mealPlanDays} activePlan={activePlan} />
          ) : (
            <div className="text-center py-8 bg-white dark:bg-[#2d2d4a] rounded-2xl">
              <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Generate your weekly meal plan
              </p>
              <Button
                onClick={() => generateWeeklyPlan.mutate(activePlan.id)}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={generateWeeklyPlan.isLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generateWeeklyPlan.isLoading ? 'Generating...' : 'Generate Plan'}
              </Button>
            </div>
          )}
        </div>
      )}

      <CreateNutritionPlan
        isOpen={showCreatePlan}
        onClose={() => setShowCreatePlan(false)}
        onPlanCreated={(plan) => {
          setActivePlan(plan);
          generateWeeklyPlan.mutate(plan.id);
        }}
      />
    </div>
  );
}