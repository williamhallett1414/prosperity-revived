import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddToCollectionButton from './AddToCollectionButton';
import RecipeLikeButton from './RecipeLikeButton';
import CommentSection from './CommentSection';

export default function RecipeCard({ recipe, index, showCommunityFeatures }) {
  const [expanded, setExpanded] = useState(false);

  const categoryEmoji = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🍎',
    dessert: '🍰'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-[#2d2d4a] rounded-2xl overflow-hidden shadow-sm"
    >
      {recipe.image_url && (
        <img src={recipe.image_url} alt={recipe.title} className="w-full h-48 object-cover" />
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-[#1a1a2e] dark:text-white text-lg flex-1">
            {categoryEmoji[recipe.category]} {recipe.title}
          </h3>
          <div className="flex items-center gap-2">
            {recipe.id && <AddToCollectionButton recipeId={recipe.id} />}
            {recipe.diet_type !== 'any' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs">
                {recipe.diet_type}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{recipe.description}</p>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
          {recipe.calories && (
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              <span>{recipe.calories} cal</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              View Recipe
            </>
          )}
        </Button>

        {expanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Ingredients</h4>
              <ul className="space-y-1">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {ing}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#1a1a2e] dark:text-white mb-2">Instructions</h4>
              <ol className="space-y-2">
                {recipe.instructions?.map((step, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>

            {recipe.id && (
              <CommentSection contentId={recipe.id} contentType="recipe" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}