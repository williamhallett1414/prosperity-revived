import React, { useMemo } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Flame, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const mealSuggestions = [
  { id: 1, name: 'Grilled Salmon & Broccoli', time: 'Breakfast', calories: 450, protein: 35, carbs: 20, fat: 18, image: '🐟' },
  { id: 2, name: 'Quinoa Buddha Bowl', time: 'Lunch', calories: 520, protein: 18, carbs: 65, fat: 12, image: '🥗' },
  { id: 3, name: 'Chicken & Sweet Potato', time: 'Dinner', calories: 580, protein: 45, carbs: 55, fat: 15, image: '🍗' },
  { id: 4, name: 'Greek Yogurt & Berries', time: 'Snack', calories: 200, protein: 20, carbs: 25, fat: 3, image: '🥛' },
  { id: 5, name: 'Lentil Soup', time: 'Lunch', calories: 380, protein: 22, carbs: 48, fat: 4, image: '🍲' }
];

export default function MealSuggestions() {
  const timeOfDay = new Date().getHours();
  const today = new Date().toISOString().split('T')[0];
  const queryClient = useQueryClient();

  const suggestedMeals = useMemo(() => {
    if (timeOfDay < 12) return mealSuggestions.filter(m => m.time === 'Breakfast');
    if (timeOfDay < 17) return mealSuggestions.filter(m => m.time === 'Lunch');
    return mealSuggestions.filter(m => m.time === 'Dinner');
  }, [timeOfDay]);

  const logMeal = useMutation({
    mutationFn: (mealData) => base44.entities.MealLog.create(mealData),
    onSuccess: () => {
      queryClient.invalidateQueries(['meals']);
      toast.success('Meal logged successfully!');
    },
    onError: () => {
      toast.error('Failed to log meal');
    }
  });

  const handleLogMeal = (meal) => {
    logMeal.mutate({
      mealId: meal.id,
      description: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fat,
      date: today,
      meal_type: meal.time.toLowerCase()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 mb-6"
    >
      <h2 className="text-lg font-bold text-[#0A1A2F] mb-3">Suggested Meals</h2>
      <div className="space-y-2">
        {suggestedMeals.map((meal, idx) => (
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-lg p-4 flex gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-3xl">{meal.image}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#0A1A2F] truncate">{meal.name}</h3>
              <div className="flex gap-3 mt-1 text-xs text-[#0A1A2F]/60">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {meal.calories} cal
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {meal.protein}g protein
                </span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleLogMeal(meal)}
              disabled={logMeal.isPending}
              className="bg-gradient-to-r from-[#FD9C2D] to-[#E89020] hover:opacity-90 text-white h-8"
            >
              {logMeal.isPending ? 'Logging...' : 'Log'}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}