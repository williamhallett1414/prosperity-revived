import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function AIMealPlanner() {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    diet_type: 'any',
    goal: 'maintenance',
    calories: 2000,
    meals_per_day: 3,
    allergies: ''
  });
  const [mealPlan, setMealPlan] = useState(null);

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const prompt = `Create a detailed daily meal plan with the following requirements:
- Diet Type: ${preferences.diet_type}
- Goal: ${preferences.goal}
- Target Calories: ${preferences.calories} per day
- Number of Meals: ${preferences.meals_per_day}
${preferences.allergies ? `- Allergies/Restrictions: ${preferences.allergies}` : ''}

For each meal, provide:
- Meal name and time
- List of ingredients
- Preparation instructions
- Approximate calories
- Macros (protein, carbs, fats)

Make it practical, delicious, and easy to prepare.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            total_calories: { type: 'number' },
            total_protein: { type: 'number' },
            total_carbs: { type: 'number' },
            total_fats: { type: 'number' },
            meals: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  time: { type: 'string' },
                  ingredients: { type: 'array', items: { type: 'string' } },
                  instructions: { type: 'array', items: { type: 'string' } },
                  calories: { type: 'number' },
                  protein: { type: 'number' },
                  carbs: { type: 'number' },
                  fats: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setMealPlan(response);
    } catch (error) {
      console.error('Failed to generate meal plan', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white">AI Meal Planner</h3>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Select value={preferences.diet_type} onValueChange={(v) => setPreferences({ ...preferences, diet_type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Diet</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="gluten_free">Gluten Free</SelectItem>
              </SelectContent>
            </Select>

            <Select value={preferences.goal} onValueChange={(v) => setPreferences({ ...preferences, goal: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Calories/day"
              value={preferences.calories}
              onChange={(e) => setPreferences({ ...preferences, calories: parseInt(e.target.value) || 2000 })}
            />
            <Input
              type="number"
              placeholder="Meals/day"
              value={preferences.meals_per_day}
              onChange={(e) => setPreferences({ ...preferences, meals_per_day: parseInt(e.target.value) || 3 })}
            />
          </div>

          <Textarea
            placeholder="Allergies or restrictions (optional)"
            value={preferences.allergies}
            onChange={(e) => setPreferences({ ...preferences, allergies: e.target.value })}
            className="h-20"
          />

          <Button
            onClick={generateMealPlan}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Meal Plan
              </>
            )}
          </Button>
        </div>
      </div>

      {mealPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4"
        >
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white mb-3">Your Meal Plan</h3>
          
          <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
              <p className="font-bold text-purple-600 dark:text-purple-400">{mealPlan.total_calories}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Protein</p>
              <p className="font-bold text-purple-600 dark:text-purple-400">{mealPlan.total_protein}g</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Carbs</p>
              <p className="font-bold text-purple-600 dark:text-purple-400">{mealPlan.total_carbs}g</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Fats</p>
              <p className="font-bold text-purple-600 dark:text-purple-400">{mealPlan.total_fats}g</p>
            </div>
          </div>

          <div className="space-y-3">
            {mealPlan.meals?.map((meal, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-[#1a1a2e] dark:text-white">{meal.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{meal.time}</p>
                  </div>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{meal.calories} cal</span>
                </div>
                
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ingredients:</p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                    {meal.ingredients?.map((ing, i) => (
                      <li key={i}>• {ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}