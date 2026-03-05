import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Flame, ChevronDown, ChevronUp, ShoppingCart, Check, Lightbulb, Utensils, BarChart3, Plus, Minus } from 'lucide-react';
import AddToCollectionButton from './AddToCollectionButton';
import CommentSection from './CommentSection';
import { useGroceryList } from '@/hooks/useGroceryList';

const CATEGORY_EMOJI  = { breakfast:'🍳', lunch:'🥗', dinner:'🍽️', snack:'🍎', dessert:'🍰' };
const DIFFICULTY_STYLE = {
  easy:   'bg-[#AFC7E3]/25 text-[#3C4E53]',
  medium: 'bg-[#FAD98D]/30 text-[#c9a227]',
  hard:   'bg-[#0A1A2F]/8 text-[#0A1A2F]/70',
};
const DIET_STYLE = {
  keto:        'bg-[#FAD98D]/30 text-[#c9a227]',
  vegan:       'bg-[#AFC7E3]/25 text-[#3C4E53]',
  vegetarian:  'bg-[#AFC7E3]/20 text-[#3C4E53]',
  paleo:       'bg-[#D9B878]/25 text-[#0A1A2F]/70',
  gluten_free: 'bg-[#FAD98D]/20 text-[#c9a227]',
};

function NutritionPill({ label, value, unit, color }) {
  if (!value) return null;
  return (
    <div className={`flex flex-col items-center px-3 py-2 rounded-xl ${color}`}>
      <p className="text-sm font-bold text-[#0A1A2F]">{value}<span className="text-[10px] font-normal">{unit}</span></p>
      <p className="text-[9px] font-bold text-[#0A1A2F]/45 uppercase tracking-wide">{label}</p>
    </div>
  );
}

export default function RecipeCard({ recipe, index }) {
  const [expanded, setExpanded] = useState(false);
  const { addRecipe, removeRecipe, isRecipeAdded } = useGroceryList();

  const totalTime  = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
  const emoji      = CATEGORY_EMOJI[recipe.category] || '🍴';
  const dietStyle  = recipe.diet_type && recipe.diet_type !== 'any' ? DIET_STYLE[recipe.diet_type] : null;
  const inCart     = isRecipeAdded(recipe.id);

  const hasNutrition = recipe.calories || recipe.protein || recipe.carbs || recipe.fat || recipe.fiber;
  const hasTips      = recipe.cooking_tips?.length > 0;
  const hasSuggestion = recipe.serving_suggestions;

  const handleCart = () => {
    if (inCart) removeRecipe(recipe.id);
    else addRecipe(recipe);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#D9B878]/20 shadow-sm"
    >
      {recipe.image_url && (
        <img src={recipe.image_url} alt={recipe.title} className="w-full h-44 object-cover" />
      )}

      <div className="p-4">
        {/* Title + badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-[#0A1A2F] text-base leading-snug flex-1">
            {emoji} {recipe.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {recipe.id && <AddToCollectionButton recipeId={recipe.id} />}
          </div>
        </div>

        {/* Tag row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {dietStyle && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dietStyle}`}>{recipe.diet_type}</span>
          )}
          {recipe.difficulty && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${DIFFICULTY_STYLE[recipe.difficulty] || DIFFICULTY_STYLE.easy}`}>
              {recipe.difficulty}
            </span>
          )}
        </div>

        {recipe.description && (
          <p className="text-sm text-[#0A1A2F]/55 mb-3 leading-relaxed">{recipe.description}</p>
        )}

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-xs text-[#0A1A2F]/40 mb-3">
          {recipe.prep_time_minutes > 0 && (
            <span className="flex items-center gap-1" title="Prep time">
              <Clock className="w-3.5 h-3.5" />{recipe.prep_time_minutes}m prep
            </span>
          )}
          {recipe.cook_time_minutes > 0 && (
            <span className="flex items-center gap-1" title="Cook time">
              <Flame className="w-3.5 h-3.5" />{recipe.cook_time_minutes}m cook
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1" title="Servings">
              <Users className="w-3.5 h-3.5" />{recipe.servings} srv
              {recipe.serving_size ? ` · ${recipe.serving_size}` : ''}
            </span>
          )}
        </div>

        {/* Nutrition bar (collapsed preview) */}
        {hasNutrition && !expanded && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-0.5">
            <NutritionPill label="Cal" value={recipe.calories} unit=""   color="bg-[#FAD98D]/20" />
            <NutritionPill label="Protein" value={recipe.protein} unit="g" color="bg-[#AFC7E3]/20" />
            <NutritionPill label="Carbs"  value={recipe.carbs}   unit="g" color="bg-[#D9B878]/15" />
            <NutritionPill label="Fat"    value={recipe.fat}     unit="g" color="bg-[#FAD98D]/15" />
            {recipe.fiber && <NutritionPill label="Fiber" value={recipe.fiber} unit="g" color="bg-[#AFC7E3]/15" />}
          </div>
        )}

        {/* Action row */}
        <div className="flex gap-2">
          {/* Grocery list button */}
          <button onClick={handleCart}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              inCart
                ? 'bg-[#c9a227] text-white shadow-sm'
                : 'bg-[#FAD98D]/20 text-[#c9a227] hover:bg-[#FAD98D]/35'
            }`}>
            {inCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {inCart ? 'In list' : 'Add to list'}
          </button>

          {/* Expand toggle */}
          <button onClick={() => setExpanded(e => !e)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#F2F6FA] text-xs font-semibold text-[#0A1A2F]/60 hover:bg-[#FAD98D]/20 transition-colors">
            {expanded ? <><ChevronUp className="w-3.5 h-3.5" />Hide</> : <><ChevronDown className="w-3.5 h-3.5" />Full Recipe</>}
          </button>
        </div>

        {/* ── Expanded ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-5">

                {/* Full nutrition facts */}
                {hasNutrition && (
                  <div className="bg-[#F2F6FA] rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-[#c9a227]" />
                      <p className="text-xs font-bold text-[#0A1A2F]/50 uppercase tracking-widest">
                        Nutrition per serving{recipe.serving_size ? ` (${recipe.serving_size})` : ''}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <NutritionPill label="Calories"  value={recipe.calories} unit=""   color="bg-white" />
                      <NutritionPill label="Protein"   value={recipe.protein}  unit="g"  color="bg-white" />
                      <NutritionPill label="Carbs"     value={recipe.carbs}    unit="g"  color="bg-white" />
                      <NutritionPill label="Fat"       value={recipe.fat}      unit="g"  color="bg-white" />
                      <NutritionPill label="Fiber"     value={recipe.fiber}    unit="g"  color="bg-white" />
                      <NutritionPill label="Sodium"    value={recipe.sodium}   unit="mg" color="bg-white" />
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                {recipe.ingredients?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">
                      Ingredients · {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
                    </p>
                    <ul className="space-y-1.5">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#0A1A2F]/70">
                          <span className="text-[#c9a227] mt-0.5 flex-shrink-0">·</span>
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions */}
                {recipe.instructions?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-3">
                      Instructions
                    </p>
                    <ol className="space-y-3">
                      {recipe.instructions.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#c9a227] to-[#D9B878] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-[#0A1A2F]/75 leading-relaxed flex-1">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Cooking tips */}
                {hasTips && (
                  <div className="bg-[#FAD98D]/15 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Lightbulb className="w-4 h-4 text-[#c9a227]" />
                      <p className="text-xs font-bold text-[#0A1A2F]/50 uppercase tracking-widest">Chef's Tips</p>
                    </div>
                    <ul className="space-y-1.5">
                      {recipe.cooking_tips.map((tip, i) => (
                        <li key={i} className="text-sm text-[#0A1A2F]/70 leading-relaxed flex gap-2">
                          <span className="text-[#c9a227] flex-shrink-0">💡</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Serving suggestions */}
                {hasSuggestion && (
                  <div className="bg-[#AFC7E3]/15 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="w-4 h-4 text-[#3C4E53]" />
                      <p className="text-xs font-bold text-[#0A1A2F]/50 uppercase tracking-widest">Serving Suggestions</p>
                    </div>
                    <p className="text-sm text-[#0A1A2F]/70 leading-relaxed">{recipe.serving_suggestions}</p>
                  </div>
                )}

                {recipe.id && <CommentSection contentId={recipe.id} contentType="recipe" />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
