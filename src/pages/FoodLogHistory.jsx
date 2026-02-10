import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DetailedFoodLogModal from '@/components/wellness/DetailedFoodLogModal';
import { toast } from 'sonner';

export default function FoodLogHistory() {
  const [showAddFood, setShowAddFood] = useState(false);
  const queryClient = useQueryClient();

  const { data: allMeals = [] } = useQuery({
    queryKey: ['allMeals'],
    queryFn: async () => {
      const all = await base44.entities.MealLog.list('-date');
      return all;
    }
  });

  const deleteMeal = useMutation({
    mutationFn: (id) => base44.entities.MealLog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['allMeals']);
      toast.success('Meal deleted');
    }
  });

  const logMeal = useMutation({
    mutationFn: (data) => base44.entities.MealLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['allMeals']);
      setShowAddFood(false);
      toast.success('Meal logged successfully!');
    }
  });

  const mealEmoji = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' };

  const groupedMeals = allMeals.reduce((acc, meal) => {
    const date = meal.date || new Date().toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedMeals).sort().reverse();

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('Wellness?tab=nutrition')}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Food Log History</h1>
            <p className="text-xs text-[#0A1A2F]/60">Track all your meals</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Add Food Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => setShowAddFood(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log New Food
          </Button>
        </motion.div>

        {/* Meals by Date */}
        {sortedDates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-[#0A1A2F]/60">No meals logged yet</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date, dateIdx) => {
              const dateMeals = groupedMeals[date];
              const dateTotal = dateMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
              const dateTotalProtein = dateMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
              const dateTotalCarbs = dateMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
              const dateTotalFats = dateMeals.reduce((sum, m) => sum + (m.fats || 0), 0);

              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dateIdx * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Date Header */}
                  <div className="bg-gradient-to-r from-[#E6EBEF] to-[#AFC7E3] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-[#0A1A2F]" />
                      <h2 className="font-semibold text-[#0A1A2F]">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </h2>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-emerald-600">{dateTotal}</p>
                        <p className="text-[#0A1A2F]/60">Calories</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-blue-600">{Math.round(dateTotalProtein)}g</p>
                        <p className="text-[#0A1A2F]/60">Protein</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-amber-600">{Math.round(dateTotalCarbs)}g</p>
                        <p className="text-[#0A1A2F]/60">Carbs</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-red-600">{Math.round(dateTotalFats)}g</p>
                        <p className="text-[#0A1A2F]/60">Fats</p>
                      </div>
                    </div>
                  </div>

                  {/* Meals List */}
                  <div className="p-4 space-y-3">
                    {dateMeals.map((meal) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-[#0A1A2F]">
                              {mealEmoji[meal.meal_type]} {meal.description}
                            </p>
                            <p className="text-xs text-[#0A1A2F]/60 mt-1">
                              P: {meal.protein || 0}g | C: {meal.carbs || 0}g | F: {meal.fats || 0}g
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <span className="text-sm font-semibold text-emerald-600">{meal.calories || 0} cal</span>
                            <button
                              onClick={() => deleteMeal.mutate(meal.id)}
                              disabled={deleteMeal.isPending}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      <DetailedFoodLogModal
        isOpen={showAddFood}
        onClose={() => setShowAddFood(false)}
        onSave={(mealData) => logMeal.mutate(mealData)}
      />
    </div>
  );
}