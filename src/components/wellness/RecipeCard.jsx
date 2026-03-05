import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Users, Flame, ChevronDown, ChevronUp,
  ShoppingCart, Check, Lightbulb, Utensils, BarChart3,
  UtensilsCrossed, Sparkles, Loader2, ThermometerSun, Timer
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AddToCollectionButton from './AddToCollectionButton';
import CommentSection from './CommentSection';
import LogMealModal from './LogMealModal';
import { useGroceryList } from '@/components/wellness/useGroceryList';

const CATEGORY_EMOJI  = { breakfast:'🍳', lunch:'🥗', dinner:'🍽️', snack:'🍎', dessert:'🍰' };
const DIFFICULTY_STYLE = {
  easy:   'bg-[#AFC7E3]/25 text-[#3C4E53]',
  medium: 'bg-[#FAD98D]/30 text-[#c9a227]',
  hard:   'bg-[#0A1A2F]/10 text-[#0A1A2F]/70',
};
const DIET_STYLE = {
  keto:        'bg-[#FAD98D]/30 text-[#c9a227]',
  vegan:       'bg-[#AFC7E3]/25 text-[#3C4E53]',
  vegetarian:  'bg-[#AFC7E3]/20 text-[#3C4E53]',
  paleo:       'bg-[#D9B878]/25 text-[#0A1A2F]/70',
  gluten_free: 'bg-[#FAD98D]/20 text-[#c9a227]',
};

// Parse inline cues from an instruction string for rich display
// Highlights: temperatures (°F/°C), times (X min/hours), techniques (CAPS phrases)
function RichStep({ text, stepNum }) {
  // Segment the text into plain / temperature / time parts
  const parts = [];
  const re = /(\d+[\s–-]*(?:to\s*)?\d*\s*°[FC]|\d+[\s–-]*(?:to\s*)?\d*\s*(?:minutes?|hours?|hrs?|seconds?|mins?))/gi;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', val: text.slice(last, m.index) });
    const isTemp = /°[FC]/i.test(m[0]);
    parts.push({ type: isTemp ? 'temp' : 'time', val: m[0] });
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ type: 'text', val: text.slice(last) });

  return (
    <li className="flex gap-3">
      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a227] to-[#D9B878] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
        {stepNum}
      </span>
      <p className="text-sm text-[#0A1A2F]/80 leading-relaxed flex-1 pt-0.5">
        {parts.map((p, i) => {
          if (p.type === 'temp') return (
            <span key={i} className="inline-flex items-center gap-0.5 bg-red-50 text-red-600 font-semibold px-1.5 py-0.5 rounded-md text-xs mx-0.5">
              <ThermometerSun className="w-3 h-3" />{p.val}
            </span>
          );
          if (p.type === 'time') return (
            <span key={i} className="inline-flex items-center gap-0.5 bg-[#AFC7E3]/20 text-[#3C4E53] font-semibold px-1.5 py-0.5 rounded-md text-xs mx-0.5">
              <Timer className="w-3 h-3" />{p.val}
            </span>
          );
          return <span key={i}>{p.val}</span>;
        })}
      </p>
    </li>
  );
}

function NutritionPill({ label, value, unit, color }) {
  if (!value) return null;
  return (
    <div className={`flex flex-col items-center px-2.5 py-2 rounded-xl ${color}`}>
      <p className="text-sm font-bold text-[#0A1A2F] leading-none">{value}<span className="text-[10px] font-normal">{unit}</span></p>
      <p className="text-[9px] font-bold text-[#0A1A2F]/40 uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  );
}

export default function RecipeCard({ recipe, index }) {
  const [expanded,     setExpanded]     = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [enriching,    setEnriching]    = useState(false);
  const [enriched,     setEnriched]     = useState(null); // AI-enriched overlay data
  const { addRecipe, removeRecipe, isRecipeAdded } = useGroceryList();

  const emoji     = CATEGORY_EMOJI[recipe.category] || '🍴';
  const dietStyle = recipe.diet_type && recipe.diet_type !== 'any' ? DIET_STYLE[recipe.diet_type] : null;
  const inCart    = isRecipeAdded(recipe.id);

  const displayed       = enriched || recipe;
  const hasNutrition    = displayed.calories || displayed.protein || displayed.carbs || displayed.fat || displayed.fiber;
  const visibleTips     = (displayed.cooking_tips || []).filter(t => !t.startsWith('__hc:'));
  const hasTips         = visibleTips.length > 0;
  const hasSuggestion   = displayed.serving_suggestions;
  const instructions    = displayed.instructions || [];
  const ingredients     = displayed.ingredients   || [];

  const handleCart = () => inCart ? removeRecipe(recipe.id) : addRecipe(recipe);

  const handleEnrich = async () => {
    if (enriched || enriching) return;
    setEnriching(true);
    try {
      const text = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional chef and recipe writer. Enrich this recipe with detailed, clear cooking instructions and helpful tips.

Recipe: ${recipe.title}
Category: ${recipe.category}
Ingredients: ${(recipe.ingredients || []).join(', ')}
Current instructions: ${(recipe.instructions || []).join(' | ')}

Return ONLY a valid JSON object (no markdown, no code fences) with these exact fields:
{
  "instructions": ["detailed step 1 with exact temperatures in °F and exact cook times", "step 2", ...],
  "cooking_tips": ["practical tip 1", "tip 2", "tip 3"],
  "serving_suggestions": "how to plate and serve this dish"
}

Rules:
- 6 to 10 instruction steps
- Include exact temperatures (e.g. 375°F), exact times (e.g. 20 minutes), and visual doneness cues (e.g. until golden brown)
- Tips should be practical and specific to this recipe`,
      });
      const clean = (text || '{}').replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setEnriched({ ...recipe, ...parsed });
    } catch (e) {
      console.error('Enrich failed', e);
    }
    setEnriching(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.04, 0.4) }}
        className="bg-white rounded-2xl overflow-hidden border border-[#D9B878]/20 shadow-sm"
      >
        {recipe.image_url && (
          <img src={recipe.image_url} alt={recipe.title} className="w-full h-44 object-cover" />
        )}

        <div className="p-4">
          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-[#0A1A2F] text-base leading-snug flex-1">
              {emoji} {recipe.title}
            </h3>
            {recipe.id && (
              <div className="flex-shrink-0">
                <AddToCollectionButton recipeId={recipe.id} />
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {dietStyle && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dietStyle}`}>{recipe.diet_type}</span>
            )}
            {recipe.difficulty && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${DIFFICULTY_STYLE[recipe.difficulty] || DIFFICULTY_STYLE.easy}`}>
                {recipe.difficulty}
              </span>
            )}
            {enriched && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAD98D]/30 text-[#c9a227]">✨ AI-enriched</span>
            )}
          </div>

          {recipe.description && (
            <p className="text-sm text-[#0A1A2F]/55 mb-3 leading-relaxed">{recipe.description}</p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-[#0A1A2F]/40 mb-3 flex-wrap">
            {recipe.prep_time_minutes > 0 && (
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{recipe.prep_time_minutes}m prep</span>
            )}
            {recipe.cook_time_minutes > 0 && (
              <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" />{recipe.cook_time_minutes}m cook</span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
                {recipe.serving_size ? ` · ${recipe.serving_size}` : ''}
              </span>
            )}
          </div>

          {/* Collapsed nutrition preview */}
          {hasNutrition && !expanded && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-0.5">
              <NutritionPill label="Cal"     value={displayed.calories} unit=""   color="bg-[#FAD98D]/20" />
              <NutritionPill label="Protein" value={displayed.protein}  unit="g"  color="bg-[#AFC7E3]/20" />
              <NutritionPill label="Carbs"   value={displayed.carbs}    unit="g"  color="bg-[#D9B878]/15" />
              <NutritionPill label="Fat"     value={displayed.fat}      unit="g"  color="bg-[#FAD98D]/15" />
              {displayed.fiber && <NutritionPill label="Fiber" value={displayed.fiber} unit="g" color="bg-[#AFC7E3]/15" />}
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            {/* Log meal */}
            <button onClick={() => setShowLogModal(true)}
              className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-[#AFC7E3]/15 text-[#3C4E53] hover:bg-[#AFC7E3]/25 transition-colors">
              <UtensilsCrossed className="w-4 h-4" />
              <span className="text-[10px] font-bold">Log Meal</span>
            </button>

            {/* Grocery list */}
            <button onClick={handleCart}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all ${
                inCart ? 'bg-[#c9a227] text-white shadow-sm' : 'bg-[#FAD98D]/20 text-[#c9a227] hover:bg-[#FAD98D]/35'
              }`}>
              {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              <span className="text-[10px] font-bold">{inCart ? 'In List' : 'Add List'}</span>
            </button>

            {/* Expand / enrich */}
            <button onClick={() => { setExpanded(e => !e); if (!expanded && !enriched) handleEnrich(); }}
              className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-[#F2F6FA] text-[#0A1A2F]/55 hover:bg-[#FAD98D]/15 transition-colors">
              {enriching
                ? <Loader2 className="w-4 h-4 animate-spin text-[#c9a227]" />
                : expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span className="text-[10px] font-bold">{expanded ? 'Hide' : 'Recipe'}</span>
            </button>
          </div>

          {/* ── Expanded content ── */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-5 space-y-6">

                  {/* Nutrition facts */}
                  {hasNutrition && (
                    <div className="bg-[#F2F6FA] rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-[#c9a227]" />
                        <p className="text-xs font-bold text-[#0A1A2F]/50 uppercase tracking-widest">
                          Nutrition per serving{displayed.serving_size ? ` (${displayed.serving_size})` : ''}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <NutritionPill label="Calories"  value={displayed.calories} unit=""   color="bg-white" />
                        <NutritionPill label="Protein"   value={displayed.protein}  unit="g"  color="bg-white" />
                        <NutritionPill label="Carbs"     value={displayed.carbs}    unit="g"  color="bg-white" />
                        <NutritionPill label="Fat"       value={displayed.fat}      unit="g"  color="bg-white" />
                        <NutritionPill label="Fiber"     value={displayed.fiber}    unit="g"  color="bg-white" />
                        <NutritionPill label="Sodium"    value={displayed.sodium}   unit="mg" color="bg-white" />
                      </div>
                    </div>
                  )}

                  {/* Ingredients */}
                  {ingredients.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-3">
                        Ingredients — {recipe.servings || 1} serving{(recipe.servings || 1) !== 1 ? 's' : ''}
                      </p>
                      <ul className="space-y-2">
                        {ingredients.map((ing, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#0A1A2F]/75">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] flex-shrink-0 mt-2" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Instructions — rich render */}
                  {instructions.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest flex-1">
                          Instructions
                        </p>
                        {enriching && (
                          <span className="text-[10px] text-[#c9a227] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Enhancing…
                          </span>
                        )}
                        {!enriched && !enriching && (
                          <button onClick={handleEnrich}
                            className="text-[10px] font-bold text-[#c9a227] flex items-center gap-1 hover:opacity-70">
                            <Sparkles className="w-3 h-3" /> Enhance with AI
                          </button>
                        )}
                      </div>
                      <ol className="space-y-4">
                        {instructions.map((step, i) => (
                          <RichStep key={i} text={step} stepNum={i + 1} />
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Chef's Tips */}
                  {hasTips && (
                    <div className="bg-[#FAD98D]/15 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Lightbulb className="w-4 h-4 text-[#c9a227]" />
                        <p className="text-xs font-bold text-[#0A1A2F]/50 uppercase tracking-widest">Chef's Tips</p>
                      </div>
                      <ul className="space-y-2">
                        {visibleTips.map((tip, i) => (
                          <li key={i} className="text-sm text-[#0A1A2F]/70 leading-relaxed flex gap-2">
                            <span className="flex-shrink-0">💡</span>{tip}
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
                      <p className="text-sm text-[#0A1A2F]/70 leading-relaxed">{displayed.serving_suggestions}</p>
                    </div>
                  )}

                  {recipe.id && <CommentSection contentId={recipe.id} contentType="recipe" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <LogMealModal recipe={recipe} isOpen={showLogModal} onClose={() => setShowLogModal(false)} />
    </>
  );
}