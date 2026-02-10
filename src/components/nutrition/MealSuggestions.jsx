import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mealSuggestions = [
  { name: 'Grilled Salmon & Broccoli', time: 'Breakfast', cals: 450, protein: 35, image: '🐟' },
  { name: 'Quinoa Buddha Bowl', time: 'Lunch', cals: 520, protein: 18, image: '🥗' },
  { name: 'Chicken & Sweet Potato', time: 'Dinner', cals: 580, protein: 45, image: '🍗' },
  { name: 'Greek Yogurt & Berries', time: 'Snack', cals: 200, protein: 20, image: '🥛' },
  { name: 'Lentil Soup', time: 'Lunch', cals: 380, protein: 22, image: '🍲' }
];

export default function MealSuggestions() {
  const timeOfDay = new Date().getHours();
  
  const suggestedMeals = useMemo(() => {
    if (timeOfDay < 12) return mealSuggestions.filter(m => m.time === 'Breakfast');
    if (timeOfDay < 17) return mealSuggestions.filter(m => m.time === 'Lunch');
    return mealSuggestions.filter(m => m.time === 'Dinner');
  }, [timeOfDay]);

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
            key={meal.name}
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
                  <Flame className="w-3 h-3" /> {meal.cals} cal
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {meal.protein}g protein
                </span>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] h-8"
            >
              Log
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}