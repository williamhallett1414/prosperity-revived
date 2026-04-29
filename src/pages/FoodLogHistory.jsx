import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calendar, Flame, CalendarDays, ChefHat, Target, History } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DetailedFoodLogModal from '@/components/wellness/DetailedFoodLogModal';
import { toast } from 'sonner';

export default function FoodLogHistory() {
  const [showAddFood, setShowAddFood] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: allMeals = [] } = useQuery({
    queryKey: ['allMeals'],
    queryFn: async () => {
      try { return await base44.entities.MealLog.list('-date'); }
      catch { return []; }
    }
  });

  const deleteMeal = useMutation({
    mutationFn: (id) => base44.entities.MealLog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['allMeals']);
      toast.success('Meal deleted');
    },
    onError: () => toast.error('Failed to delete meal')
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

  const NAV_TABS = [
    { id: 'today',   label: 'Today',      icon: Flame,        page: 'Nutrition'             },
    { id: 'planner', label: 'Planner',     icon: CalendarDays, page: 'Nutrition?tab=planner' },
    { id: 'build',   label: 'Build',       icon: ChefHat,      page: 'Nutrition?tab=build'   },
    { id: 'goals',   label: 'Goals',       icon: Target,       page: 'NutritionGoalsPage'    },
    { id: 'history', label: 'Log History', icon: History,      page: null                    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 px-4 pt-3 pb-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-black text-[#0A1A2F] dark:text-white leading-tight">Nutrition</h1>
              <p className="text-[11px] text-[#0A1A2F]/40 dark:text-white/40 font-medium">Track · Plan · Nourish</p>
            </div>
            <button
              onClick={() => setShowAddFood(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white text-xs font-bold shadow-md active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Food
            </button>
          </div>
          <div className="flex gap-0 border-b border-transparent -mb-px overflow-x-auto">
            {NAV_TABS.map(({ id, label, icon: Icon, page }) => (
              <button key={id}
                onClick={() => page && navigate(createPageUrl(page))}
                className={`flex items-center gap-1 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  id === 'history'
                    ? 'border-[#c9a227] text-[#c9a227]'
                    : 'border-transparent text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#0A1A2F]/65'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Meals by Date */}
        {sortedDates.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-[#0A1A2F]/60 dark:text-white/60">No meals logged yet</p>
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
                  className="bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm">

                  {/* Date Header */}
                  <div className="bg-gradient-to-r from-[#F2F6FA] to-[#AFC7E3] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
                      <h2 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </h2>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-emerald-600">{dateTotal}</p>
                        <p className="text-[#0A1A2F]/60 dark:text-white/60">Calories</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-[#3C4E53]">{Math.round(dateTotalProtein)}g</p>
                        <p className="text-[#0A1A2F]/60 dark:text-white/60">Protein</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-amber-600">{Math.round(dateTotalCarbs)}g</p>
                        <p className="text-[#0A1A2F]/60 dark:text-white/60">Carbs</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-red-600">{Math.round(dateTotalFats)}g</p>
                        <p className="text-[#0A1A2F]/60 dark:text-white/60">Fats</p>
                      </div>
                    </div>
                  </div>

                  {/* Meals List */}
                  <div className="p-4 space-y-3">
                    {dateMeals.map((meal) => (
                      <motion.div key={meal.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to={createPageUrl(`MealDetailView?id=${meal.id}`)}>
                          <div className="bg-gray-50 dark:bg-white/5 hover:bg-gray-100 rounded-lg p-3 cursor-pointer transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-[#0A1A2F] dark:text-white dark:text-white">
                                  {mealEmoji[meal.meal_type]} {meal.description}
                                </p>
                                <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60 mt-1">
                                  P: {meal.protein || 0}g | C: {meal.carbs || 0}g | F: {meal.fats || 0}g
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-emerald-600 flex-shrink-0 ml-2">{meal.calories || 0} cal</span>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={(e) => { e.preventDefault(); deleteMeal.mutate(meal.id); }}
                          disabled={deleteMeal.isPending}
                          className="mt-2 w-full p-1 hover:bg-red-100 rounded transition-colors flex items-center justify-center gap-2">
                          <Trash2 className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-600">Delete</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <DetailedFoodLogModal
        isOpen={showAddFood}
        onClose={() => setShowAddFood(false)}
        onSave={(mealData) => logMeal.mutate(mealData)} />
    </div>
  );
}