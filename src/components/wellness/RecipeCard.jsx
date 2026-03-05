import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import AddToCollectionButton from './AddToCollectionButton';
import CommentSection from './CommentSection';

const CATEGORY_EMOJI = {
  breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎', dessert: '🍰',
};

const DIET_COLORS = {
  keto:        'bg-[#FAD98D]/30 text-[#c9a227]',
  vegan:       'bg-[#AFC7E3]/25 text-[#3C4E53]',
  vegetarian:  'bg-[#AFC7E3]/20 text-[#3C4E53]',
  paleo:       'bg-[#D9B878]/25 text-[#0A1A2F]/70',
  gluten_free: 'bg-[#FAD98D]/20 text-[#c9a227]',
};

export default function RecipeCard({ recipe, index }) {
  const [expanded, setExpanded] = useState(false);
  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
  const emoji     = CATEGORY_EMOJI[recipe.category] || '🍴';
  const dietStyle = recipe.diet_type && recipe.diet_type !== 'any' ? DIET_COLORS[recipe.diet_type] : null;

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
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-[#0A1A2F] text-base leading-snug flex-1">
            {emoji} {recipe.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {recipe.id && <AddToCollectionButton recipeId={recipe.id} />}
            {dietStyle && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dietStyle}`}>
                {recipe.diet_type}
              </span>
            )}
          </div>
        </div>

        {recipe.description && (
          <p className="text-sm text-[#0A1A2F]/55 mb-3 leading-relaxed line-clamp-2">{recipe.description}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-[#0A1A2F]/40 mb-3">
          {totalTime > 0 && (
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{totalTime} min</span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{recipe.servings} srv</span>
          )}
          {recipe.calories && (
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" />{recipe.calories} cal</span>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#F2F6FA] text-xs font-semibold text-[#0A1A2F]/60 hover:bg-[#FAD98D]/20 transition-colors"
        >
          {expanded
            ? <><ChevronUp className="w-3.5 h-3.5" /> Hide Recipe</>
            : <><ChevronDown className="w-3.5 h-3.5" /> View Recipe</>}
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {recipe.ingredients?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">Ingredients</p>
                    <ul className="space-y-1">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm text-[#0A1A2F]/70 flex gap-2">
                          <span className="text-[#c9a227] flex-shrink-0">·</span>{ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.instructions?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">Instructions</p>
                    <ol className="space-y-2">
                      {recipe.instructions.map((step, i) => (
                        <li key={i} className="text-sm text-[#0A1A2F]/70 flex gap-2">
                          <span className="font-bold text-[#c9a227] flex-shrink-0">{i + 1}.</span>{step}
                        </li>
                      ))}
                    </ol>
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
