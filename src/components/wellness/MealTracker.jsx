import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedFoodLogModal from './DetailedFoodLogModal';
import NutritionBreakdown from './NutritionBreakdown';

export default function MealTracker() {
  const [showDetailedLog, setShowDetailedLog] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const queryClient = useQueryClient();

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const all = await base44.entities.MealLog.list('-date');
      return all.slice(0, 10);
    }
  });

  const logMeal = useMutation({
    mutationFn: (data) => base44.entities.MealLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['meals']);
    }
  });

  const todaysMeals = meals.filter(m => m.date === new Date().toISOString().split('T')[0]);
  const totalCalories = todaysMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = todaysMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = todaysMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFats = todaysMeals.reduce((sum, m) => sum + (m.fats || 0), 0);

  const mealEmoji = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Today's Nutrition</h3>
          <Button
            onClick={() => setShowBreakdown(!showBreakdown)}
            variant="ghost"
            size="sm"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
            <p className="text-lg font-bold text-emerald-600">{totalCalories}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
          </div>
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-lg font-bold text-blue-600">{Math.round(totalProtein)}g</p>
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