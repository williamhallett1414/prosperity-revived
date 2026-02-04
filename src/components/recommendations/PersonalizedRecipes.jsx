import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import RecipeCard from '@/components/wellness/RecipeCard';

export default function PersonalizedRecipes({ user, allRecipes }) {
  if (!user || !allRecipes) return null;

  const userPreferences = user.dietary_preferences || [];
  const userGoals = user.health_goals || [];

  // Score recipes based on user preferences
  const scoredRecipes = allRecipes.map(recipe => {
    let score = 0;

    // Match dietary preferences
    userPreferences.forEach(pref => {
      const prefLower = pref.toLowerCase();
      if (recipe.diet_type && recipe.diet_type.toLowerCase().includes(prefLower)) {
        score += 5;
      }
    });

    // Match health goals
    userGoals.forEach(goal => {
      const goalLower = goal.toLowerCase();
      const recipeLower = `${recipe.title} ${recipe.description}`.toLowerCase();
      
      if (goalLower.includes('weight loss') && recipe.calories && recipe.calories < 400) score += 3;
      if (goalLower.includes('muscle gain') && recipe.protein && recipe.protein > 20) score += 3;
      if (goalLower.includes('healthy eating') && recipe.diet_type !== 'any') score += 2;
      if (goalLower.includes('energy') && recipeLower.includes('protein')) score += 2;
    });

    // Prefer lower prep time
    const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
    if (totalTime < 20) score += 1;

    return { recipe, score };
  });

  // Get top recommendations
  const recommendations = scoredRecipes
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(s => s.recipe);

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-[#1a1a2e] dark:text-white">
          Recommended For You
        </h3>
      </div>
      <div className="space-y-3">
        {recommendations.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RecipeCard recipe={recipe} index={index} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}