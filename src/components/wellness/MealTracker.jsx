import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Plus, BarChart3, Droplets, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DetailedFoodLogModal from './DetailedFoodLogModal';
import NutritionBreakdown from './NutritionBreakdown';

export default function MealTracker() {
  const [showDetailedLog, setShowDetailedLog] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const all = await base44.entities.MealLog.list('-date');
      return all.slice(0, 10);
    }
  });

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['water'],
    queryFn: () => base44.entities.WaterLog.list()
  });

  const logMeal = useMutation({
    mutationFn: (data) => base44.entities.MealLog.create(data),
    onMutate: async (newMeal) => {
      await queryClient.cancelQueries(['meals']);
      const previousMeals = queryClient.getQueryData(['meals']);
      
      // Optimistically add the new meal
      queryClient.setQueryData(['meals'], (old) => {
        const optimisticMeal = {
          ...newMeal,
          id: 'temp-' + Date.now(),
          created_date: new Date().toISOString()
        };
        return [optimisticMeal, ...(old || [])];
      });
      
      return { previousMeals };
    },
    onError: (err, newMeal, context) => {
      queryClient.setQueryData(['meals'], context.previousMeals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['meals']);
    }
  });

  const updateWater = useMutation({
    mutationFn: async (newGlasses) => {
      const todayLog = waterLogs.find(w => w.date === today);
      if (todayLog) {
        return base44.entities.WaterLog.update(todayLog.id, { glasses: newGlasses });
      } else {
        return base44.entities.WaterLog.create({ date: today, glasses: newGlasses, goal: 8 });
      }
    },
    onMutate: async (newGlasses) => {
      await queryClient.cancelQueries(['water']);
      const previousWater = queryClient.getQueryData(['water']);
      
      // Optimistically update water intake
      queryClient.setQueryData(['water'], (old) => {
        const todayLog = old?.find(w => w.date === today);
        if (todayLog) {
          return old.map(w => w.date === today ? { ...w, glasses: newGlasses } : w);
        } else {
          return [...(old || []), { date: today, glasses: newGlasses, goal: 8, id: 'temp-' + Date.now() }];
        }
      });
      
      return { previousWater };
    },
    onError: (err, newGlasses, context) => {
      queryClient.setQueryData(['water'], context.previousWater);
    },
    onSuccess: () => queryClient.invalidateQueries(['water'])
  });

  const todaysMeals = meals.filter(m => m.date === today);
  const totalCalories = todaysMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = todaysMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = todaysMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFats = todaysMeals.reduce((sum, m) => sum + (m.fats || 0), 0);

  const todayLog = waterLogs.find(w => w.date === today);
  const glasses = todayLog?.glasses || 0;
  const waterGoal = todayLog?.goal || 8;
  const waterPercentage = Math.min((glasses / waterGoal) * 100, 100);

  const addGlass = () => updateWater.mutate(Math.min(glasses + 1, 20));
  const removeGlass = () => updateWater.mutate(Math.max(glasses - 1, 0));

  const mealEmoji = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Today's Nutrition</h3>
          <Link to={createPageUrl('FoodLogHistory')}>
            <Button
              variant="ghost"
              size="sm"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
            <p className="text-lg font-bold text-emerald-600">{totalCalories}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
          </div>
          <div className="text-center p-2 bg-[#F2F6FA] dark:bg-[#0A1A2F]/20 rounded">
            <p className="text-lg font-bold text-[#3C4E53]">{Math.round(totalProtein)}g</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
          </div>
          <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
            <p className="text-lg font-bold text-amber-600">{Math.round(totalCarbs)}g</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
          </div>
          <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
            <p className="text-lg font-bold text-red-600">{Math.round(totalFats)}g</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fats</p>
          </div>
        </div>

        {todaysMeals.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No meals logged today</p>
        ) : (
          <div className="space-y-2 mb-4">
            {todaysMeals.map((m, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm text-[#1a1a2e] dark:text-white">
                    {mealEmoji[m.meal_type]} {m.description}
                  </p>
                  <span className="text-sm font-medium text-emerald-600">{m.calories || 0} cal</span>
                </div>
                {(m.protein || m.carbs || m.fats) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    P: {m.protein || 0}g | C: {m.carbs || 0}g | F: {m.fats || 0}g
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button onClick={() => setShowDetailedLog(true)} className="w-full bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Log Food
        </Button>

        {/* Water Intake Section */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="w-6 h-6 text-[#AFC7E3]" />
            <div className="flex-1">
              <h4 className="font-semibold text-[#1a1a2e] dark:text-white">Water Intake</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Goal: {waterGoal} glasses</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{glasses} / {waterGoal} glasses</span>
              <span className="text-sm font-medium text-[#AFC7E3]">{Math.round(waterPercentage)}%</span>
            </div>
            <Progress value={waterPercentage} className="h-3" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={removeGlass}
              disabled={glasses === 0}
              className="h-12 w-12 rounded-full"
            >
              <Minus className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-[#AFC7E3]">{glasses}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">glasses</div>
            </div>

            <Button
              size="icon"
              onClick={addGlass}
              className="h-12 w-12 rounded-full bg-[#F2F6FA]0 hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {showBreakdown && <NutritionBreakdown />}

      <DetailedFoodLogModal
        isOpen={showDetailedLog}
        onClose={() => setShowDetailedLog(false)}
        onSave={(mealData) => logMeal.mutate(mealData)}
      />
    </div>
  );
}