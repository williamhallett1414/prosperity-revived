import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MealTracker() {
  const [showForm, setShowForm] = useState(false);
  const [meal, setMeal] = useState({
    date: new Date().toISOString().split('T')[0],
    meal_type: 'lunch',
    description: '',
    calories: 0,
    notes: ''
  });
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
      setShowForm(false);
      setMeal({ date: new Date().toISOString().split('T')[0], meal_type: 'lunch', description: '', calories: 0, notes: '' });
    }
  });

  const todaysMeals = meals.filter(m => m.date === new Date().toISOString().split('T')[0]);
  const totalCalories = todaysMeals.reduce((sum, m) => sum + (m.calories || 0), 0);

  const mealEmoji = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Today's Meals</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">{totalCalories}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">calories</p>
          </div>
        </div>

        {todaysMeals.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No meals logged today</p>
        ) : (
          <div className="space-y-2 mb-4">
            {todaysMeals.map((m, i) => (
              <div key={i} className="flex items-start justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex-1">
                  <p className="font-medium text-sm text-[#1a1a2e] dark:text-white">
                    {mealEmoji[m.meal_type]} {m.meal_type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{m.description}</p>
                </div>
                {m.calories > 0 && (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{m.calories} cal</span>
                )}
              </div>
            ))}
          </div>
        )}

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Log Meal
          </Button>
        ) : (
          <div className="space-y-3 border-t pt-4">
            <Select value={meal.meal_type} onValueChange={(v) => setMeal({ ...meal, meal_type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
                <SelectItem value="lunch">🥗 Lunch</SelectItem>
                <SelectItem value="dinner">🍽️ Dinner</SelectItem>
                <SelectItem value="snack">🍎 Snack</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="What did you eat?"
              value={meal.description}
              onChange={(e) => setMeal({ ...meal, description: e.target.value })}
            />

            <Input
              type="number"
              placeholder="Calories (optional)"
              value={meal.calories || ''}
              onChange={(e) => setMeal({ ...meal, calories: parseInt(e.target.value) || 0 })}
            />

            <div className="flex gap-2">
              <Button onClick={() => logMeal.mutate(meal)} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Save
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}