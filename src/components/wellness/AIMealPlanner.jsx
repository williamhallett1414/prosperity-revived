import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, UtensilsCrossed, ShoppingCart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

export default function AIMealPlanner() {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    diet_type: 'any',
    goal: 'maintenance',
    calories: 2000,
    meals_per_day: 3,
    days: 7,
    allergies: ''
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list('-created_date')
  });

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      // Filter recipes based on diet preference
      const filteredRecipes = recipes.filter(r => 
        preferences.diet_type === 'any' || r.diet_type === preferences.diet_type || r.diet_type === 'any'
      );

      const recipeList = filteredRecipes.map(r => ({
        title: r.title,
        category: r.category,
        calories: r.calories,
        ingredients: r.ingredients,
        prep_time: r.prep_time_minutes,
        cook_time: r.cook_time_minutes
      }));

      const prompt = `Create a ${preferences.days}-day meal plan with the following requirements:
- Diet Type: ${preferences.diet_type}
- Goal: ${preferences.goal}
- Target Calories: ${preferences.calories} per day
- Number of Meals per Day: ${preferences.meals_per_day}
${preferences.allergies ? `- Allergies/Restrictions: ${preferences.allergies}` : ''}

Available Recipes:
${JSON.stringify(recipeList, null, 2)}

IMPORTANT: Use ONLY the recipes from the list above. Match recipes by their exact title. For each day, select ${preferences.meals_per_day} recipes that fit the calorie target and dietary preferences. Distribute breakfast, lunch, dinner, and snacks appropriately.

Also generate a complete shopping list by combining all unique ingredients from the selected recipes for the entire week.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            weekly_plan: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day: { type: 'string' },
                  total_calories: { type: 'number' },
                  meals: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        recipe_title: { type: 'string' },
                        meal_type: { type: 'string' },
                        calories: { type: 'number' }
                      }
                    }
                  }
                }
              }
            },
            shopping_list: {
              type: 'object',
              properties: {
                produce: { type: 'array', items: { type: 'string' } },
                proteins: { type: 'array', items: { type: 'string' } },
                dairy: { type: 'array', items: { type: 'string' } },
                pantry: { type: 'array', items: { type: 'string' } },
                other: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      });

      setMealPlan(response.weekly_plan);
      setShoppingList(response.shopping_list);
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

          <div className="grid grid-cols-3 gap-3">
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
            <Input
              type="number"
              placeholder="Days"
              value={preferences.days}
              onChange={(e) => setPreferences({ ...preferences, days: parseInt(e.target.value) || 7 })}
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
          className="space-y-4"
        >
          {/* Weekly Meal Plan */}
          <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white">{preferences.days}-Day Meal Plan</h3>
            </div>

            <div className="space-y-4">
              {mealPlan?.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-[#1a1a2e] dark:text-white">{day.day}</h4>
                    <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                      {day.total_calories} cal
                    </span>
                  </div>

                  <div className="space-y-2">
                    {day.meals?.map((meal, mealIndex) => {
                      const recipe = recipes.find(r => r.title === meal.recipe_title);
                      return (
                        <div key={mealIndex} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                          <UtensilsCrossed className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-[#1a1a2e] dark:text-white">
                                {meal.recipe_title}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {meal.calories} cal
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {meal.meal_type}
                            </p>
                            {recipe && (
                              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                {recipe.prep_time_minutes + recipe.cook_time_minutes} min total
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shopping List */}
          {shoppingList && (
            <div className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Shopping List</h3>
              </div>

              <div className="space-y-3">
                {shoppingList.produce?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">🥬 Produce</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {shoppingList.produce.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {shoppingList.proteins?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">🍖 Proteins</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {shoppingList.proteins.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {shoppingList.dairy?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">🥛 Dairy</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {shoppingList.dairy.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {shoppingList.pantry?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">🏺 Pantry</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {shoppingList.pantry.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {shoppingList.other?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">🛒 Other</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {shoppingList.other.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}