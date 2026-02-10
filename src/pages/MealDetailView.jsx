import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function MealDetailView() {
  const [searchParams] = useSearchParams();
  const mealId = searchParams.get('id');
  const queryClient = useQueryClient();

  const { data: meal } = useQuery({
    queryKey: ['meal', mealId],
    queryFn: async () => {
      if (!mealId) return null;
      // Fetch the specific meal from MealLog
      const all = await base44.entities.MealLog.list();
      return all.find(m => m.id === mealId) || null;
    },
    enabled: !!mealId
  });

  const deleteMeal = useMutation({
    mutationFn: (id) => base44.entities.MealLog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['allMeals']);
      toast.success('Meal deleted');
      window.location.href = createPageUrl('FoodLogHistory');
    }
  });

  // Calculate meal grade based on nutritional profile
  const mealGrade = useMemo(() => {
    if (!meal) return null;

    let score = 0;
    const feedback = [];

    // Protein scoring (target: 20-40g per meal)
    const protein = meal.protein || 0;
    if (protein >= 20 && protein <= 40) {
      score += 25;
    } else if (protein > 10) {
      score += 15;
      if (protein < 20) feedback.push('Increase protein');
    } else {
      feedback.push('Increase protein');
    }

    // Carbs vs Protein ratio (balanced macro)
    const carbs = meal.carbs || 0;
    const caloriesFromCarbs = carbs * 4;
    const totalCalories = meal.calories || 0;
    const carbPercentage = totalCalories > 0 ? (caloriesFromCarbs / totalCalories) * 100 : 0;
    
    if (carbPercentage >= 40 && carbPercentage <= 60) {
      score += 25;
    } else if (carbPercentage < 75) {
      score += 15;
    } else {
      feedback.push('Balance carbs and protein');
    }

    // Fat scoring (target: 20-35% of calories)
    const fats = meal.fats || 0;
    const caloriesFromFats = fats * 9;
    const fatPercentage = totalCalories > 0 ? (caloriesFromFats / totalCalories) * 100 : 0;
    
    if (fatPercentage >= 20 && fatPercentage <= 35) {
      score += 25;
    } else if (fatPercentage > 0) {
      score += 15;
    }

    // Calorie balance (if suspicious values, penalize)
    if (totalCalories > 0 && totalCalories < 3000) {
      score += 25;
    } else if (totalCalories === 0) {
      score += 10;
    }

    return { score: Math.min(score, 100), feedback };
  }, [meal]);

  const getGradeLetter = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (score) => {
    if (score >= 90) return 'from-green-400 to-emerald-600';
    if (score >= 80) return 'from-blue-400 to-blue-600';
    if (score >= 70) return 'from-yellow-400 to-amber-600';
    if (score >= 60) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const mealEmoji = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' };

  if (!meal) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <p className="text-[#0A1A2F]/60">Meal not found</p>
          <Link to={createPageUrl('FoodLogHistory')} className="mt-4">
            <Button>Back to Food Log</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('FoodLogHistory')}
            className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Meal Details</h1>
            <p className="text-xs text-[#0A1A2F]/60">
              {new Date(meal.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Meal Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-4xl">{mealEmoji[meal.meal_type]}</span>
                <h2 className="text-2xl font-bold text-[#0A1A2F]">{meal.description}</h2>
              </div>
              <p className="text-sm text-[#0A1A2F]/60">{meal.meal_type?.charAt(0).toUpperCase() + meal.meal_type?.slice(1)}</p>
            </div>
            <button
              onClick={() => deleteMeal.mutate(meal.id)}
              disabled={deleteMeal.isPending}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>

          {/* Calorie Display */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 text-center">
            <p className="text-4xl font-bold text-emerald-600">{meal.calories || 0}</p>
            <p className="text-sm text-emerald-700 font-medium">Calories</p>
          </div>
        </motion.div>

        {/* Meal Grade */}
        {mealGrade && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 mb-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#0A1A2F] mb-4">Nutrition Grade</h3>
            <div className="flex items-center justify-center gap-6">
              <div className={`bg-gradient-to-br ${getGradeColor(mealGrade.score)} rounded-2xl p-8 text-white text-center`}>
                <p className="text-5xl font-bold">{getGradeLetter(mealGrade.score)}</p>
                <p className="text-sm font-medium mt-1">{mealGrade.score}/100</p>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  {mealGrade.score >= 80 ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#0A1A2F]">Great nutritional balance!</p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#0A1A2F]">Room for improvement</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Macronutrients */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-[#0A1A2F] mb-4">Macronutrients</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{meal.protein || 0}g</p>
              <p className="text-xs text-blue-700 mt-1">Protein</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{meal.carbs || 0}g</p>
              <p className="text-xs text-amber-700 mt-1">Carbs</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{meal.fats || 0}g</p>
              <p className="text-xs text-red-700 mt-1">Fats</p>
            </div>
          </div>

          {/* Additional macro fields if available */}
          {(meal.fiber || meal.sugar) && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {meal.fiber && (
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-green-600">{meal.fiber}g</p>
                  <p className="text-xs text-green-700 mt-1">Fiber</p>
                </div>
              )}
              {meal.sugar && (
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-pink-600">{meal.sugar}g</p>
                  <p className="text-xs text-pink-700 mt-1">Sugar</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Micronutrients */}
        {(meal.sodium || meal.potassium || meal.calcium || meal.iron) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 mb-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#0A1A2F] mb-4">Micronutrients</h3>
            <div className="grid grid-cols-2 gap-3">
              {meal.sodium && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#0A1A2F]">Sodium</p>
                  <p className="text-lg font-bold text-gray-600 mt-1">{meal.sodium}mg</p>
                </div>
              )}
              {meal.potassium && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#0A1A2F]">Potassium</p>
                  <p className="text-lg font-bold text-gray-600 mt-1">{meal.potassium}mg</p>
                </div>
              )}
              {meal.calcium && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#0A1A2F]">Calcium</p>
                  <p className="text-lg font-bold text-gray-600 mt-1">{meal.calcium}mg</p>
                </div>
              )}
              {meal.iron && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#0A1A2F]">Iron</p>
                  <p className="text-lg font-bold text-gray-600 mt-1">{meal.iron}mg</p>
                </div>
              )}
              {meal.magnesium && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#0A1A2F]">Magnesium</p>
                  <p className="text-lg font-bold text-gray-600 mt-1">{meal.magnesium}mg</p>
                </div>
              )}
              {meal.vitamin_a && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#0A1A2F]">Vitamin A</p>
                  <p className="text-lg font-bold text-gray-600 mt-1">{meal.vitamin_a}mcg</p>
                </div>
              )}
              {meal.vitamin_c && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#0A1A2F]">Vitamin C</p>
                  <p className="text-lg font-bold text-gray-600 mt-1">{meal.vitamin_c}mg</p>
                </div>
              )}
              {meal.vitamin_d && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#0A1A2F]">Vitamin D</p>
                  <p className="text-lg font-bold text-gray-600 mt-1">{meal.vitamin_d}mcg</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Improvement Tips */}
        {mealGrade && mealGrade.feedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 mb-6 shadow-sm border-l-4 border-amber-500"
          >
            <h3 className="text-lg font-semibold text-[#0A1A2F] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              How to Improve This Meal
            </h3>
            <ul className="space-y-3">
              {mealGrade.feedback.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span className="text-[#0A1A2F]">{tip}</span>
                </li>
              ))}
              {mealGrade.score < 80 && (
                <li className="flex items-start gap-3">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span className="text-[#0A1A2F]">Add vegetables for micronutrients</span>
                </li>
              )}
            </ul>
          </motion.div>
        )}

        {/* Delete Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => deleteMeal.mutate(meal.id)}
            disabled={deleteMeal.isPending}
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Meal
          </Button>
        </motion.div>
      </div>
    </div>
  );
}