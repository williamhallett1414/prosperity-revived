import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Clock, Flame, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RecipeCard from './RecipeCard';
import GroceryListGenerator from './GroceryListGenerator';

export default function WeeklyMealPlan({ mealPlanDays, activePlan }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [showGroceryList, setShowGroceryList] = useState(false);

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list()
  });

  const getDayName = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const sortedDays = [...mealPlanDays].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[#1a1a2e] dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          Your Weekly Meal Plan
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGroceryList(true)}
          className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Grocery List
        </Button>
      </div>

      {sortedDays.map((day, index) => (
        <motion.div
          key={day.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-[#2d2d4a] rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedDay(day)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h5 className="font-semibold text-[#1a1a2e] dark:text-white mb-1">
                {getDayName(day.date)}
              </h5>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  <span>{day.total_calories} cal</span>
                </div>
                <span>P: {day.total_protein}g</span>
                <span>C: {day.total_carbs}g</span>
                <span>F: {day.total_fats}g</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {day.meals?.length || 0} meals planned
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>
      ))}

      {/* Day Detail Modal */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDay && getDayName(selectedDay.date)}</DialogTitle>
          </DialogHeader>

          {selectedDay && (
            <div className="space-y-4">
              {/* Daily Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Calories</p>
                    <p className="font-bold text-emerald-600">{selectedDay.total_calories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Protein</p>
                    <p className="font-bold text-blue-600">{selectedDay.total_protein}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Carbs</p>
                    <p className="font-bold text-orange-600">{selectedDay.total_carbs}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fats</p>
                    <p className="font-bold text-purple-600">{selectedDay.total_fats}g</p>
                  </div>
                </div>
              </div>

              {/* Meals */}
              <div className="space-y-3">
                {selectedDay.meals?.map((meal, idx) => {
                  const recipe = recipes.find(r => r.id === meal.recipe_id);
                  
                  return (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-emerald-600 uppercase">
                          {meal.meal_type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {meal.calories} cal
                        </span>
                      </div>
                      <h6 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">
                        {meal.recipe_title}
                      </h6>
                      <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fats}g</span>
                      </div>
                      {recipe && (
                        <div className="mt-3">
                          <RecipeCard recipe={recipe} index={idx} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Grocery List Modal */}
      <GroceryListGenerator
        isOpen={showGroceryList}
        onClose={() => setShowGroceryList(false)}
        mealPlanDays={mealPlanDays}
      />
    </div>
  );
}