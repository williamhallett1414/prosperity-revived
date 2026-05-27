import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, ChefHat, Loader2, Clock, ChevronDown, ChevronUp, BookmarkPlus, Utensils, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const STARTER_CATEGORIES = [
  {
    label: '🥩 Proteins',
    items: ['Chicken', 'Ground Beef', 'Salmon', 'Tuna', 'Shrimp', 'Eggs', 'Tofu', 'Turkey', 'Bacon', 'Chickpeas', 'Black Beans', 'Lentils'],
  },
  {
    label: '🥦 Vegetables',
    items: ['Spinach', 'Broccoli', 'Tomatoes', 'Bell Pepper', 'Zucchini', 'Kale', 'Mushrooms', 'Cucumber', 'Carrots', 'Sweet Potato', 'Corn', 'Cauliflower', 'Asparagus', 'Green Beans'],
  },
  {
    label: '🌾 Grains & Carbs',
    items: ['Rice', 'Pasta', 'Quinoa', 'Oats', 'Bread', 'Tortillas', 'Potatoes', 'Couscous', 'Noodles'],
  },
  {
    label: '🧄 Pantry',
    items: ['Garlic', 'Onion', 'Olive Oil', 'Butter', 'Soy Sauce', 'Lemon', 'Lime', 'Coconut Milk', 'Canned Tomatoes', 'Cheese', 'Greek Yogurt', 'Heavy Cream', 'Honey', 'Mustard'],
  },
  {
    label: '🌿 Herbs & Spices',
    items: ['Basil', 'Oregano', 'Cumin', 'Paprika', 'Chili Flakes', 'Ginger', 'Turmeric', 'Rosemary', 'Thyme', 'Cilantro', 'Parsley'],
  },
];

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default function IngredientRecipeBuilder() {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState({});
  const [loggedRecipes, setLoggedRecipes] = useState({});

  const parseNum = (str) => parseFloat((str || '').toString().replace(/[^\d.]/g, '')) || 0;

  const handleLogToFoodLog = async (recipe) => {
    // The list-view recipe may not have nutrition yet (lazy-loaded). Fetch
    // detail first so we log real calories/macros, not zeros.
    const full = recipe._detailLoaded ? recipe : await fetchRecipeDetail(recipe);
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    const mealType = hour < 10 ? 'breakfast' : hour < 14 ? 'lunch' : hour < 18 ? 'snack' : 'dinner';
    await base44.entities.MealLog.create({
      date: today,
      meal_type: mealType,
      description: full.name,
      calories: parseNum(full.nutrition?.calories),
      protein: parseNum(full.nutrition?.protein),
      carbs: parseNum(full.nutrition?.carbs),
      fats: parseNum(full.nutrition?.fat),
      fiber: parseNum(full.nutrition?.fiber),
      notes: full.description,
    });
    setLoggedRecipes(p => ({ ...p, [full.name]: true }));
    toast.success(`"${full.name}" logged to Food Log!`);
  };

  const handleSaveRecipe = async (recipe) => {
    // Ensure full detail (steps, nutrition, times) is loaded before saving.
    const full = recipe._detailLoaded ? recipe : await fetchRecipeDetail(recipe);
    const allIngredients = [...(full.usedIngredients || []), ...(full.additionalIngredients || [])];
    await base44.entities.Recipe.create({
      title: full.name,
      description: full.description,
      ingredients: allIngredients,
      instructions: full.steps || [],
      prep_time_minutes: parseNum(full.prepTime),
      cook_time_minutes: parseNum(full.cookTime),
      servings: parseNum(full.servings) || 2,
      calories: parseNum(full.nutrition?.calories),
      category: 'lunch',
      diet_type: 'any',
      is_shared: false,
    });
    setSavedRecipes(p => ({ ...p, [full.name]: true }));
    toast.success(`"${full.name}" saved to My Recipes!`);
  };

  const addIngredient = (raw = inputValue) => {
    const trimmed = (raw || '').trim();
    if (trimmed && !ingredients.find(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients(prev => [...prev, capitalize(trimmed)]);
    }
    setInputValue('');
  };

  const toggleSuggestion = (item) => {
    setSelectedSuggestions(prev =>
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    );
  };

  const addSelectedSuggestions = () => {
    const toAdd = selectedSuggestions.filter(
      s => !ingredients.find(i => i.toLowerCase() === s.toLowerCase())
    );
    if (toAdd.length) setIngredients(prev => [...prev, ...toAdd]);
    setSelectedSuggestions([]);
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  // ── Phase 1: fast list generation ─────────────────────────────────────────
  // Generates only the lightweight fields needed to render the recipe cards
  // (name, description, ingredients, times, difficulty, servings). This is a
  // fraction of the old payload, so it returns much faster. The heavy detail
  // (steps, nutrition, benefits, tips, faith note) is fetched lazily per-recipe
  // when the user expands a card — see fetchRecipeDetail below.
  const generateRecipes = async () => {
    setIsGenerating(true);
    setError(null);
    setRecipes([]);
    setExpandedRecipe(null);

    const prompt = `You are Chef Daniel, a warm Christian nutrition coach. The user has these ingredients: ${ingredients.join(', ')}.

Suggest exactly 3 recipes that genuinely use most of these ingredients. Return ONLY a brief overview of each — do NOT include steps, nutrition, or tips (those are generated separately). Keep it concise so it returns fast.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            recipes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  usedIngredients: { type: 'array', items: { type: 'string' } },
                  additionalIngredients: { type: 'array', items: { type: 'string' } },
                  prepTime: { type: 'string' },
                  cookTime: { type: 'string' },
                  difficulty: { type: 'string' },
                  servings: { type: 'string' },
                },
                required: ['name', 'description', 'usedIngredients', 'difficulty'],
              },
            },
          },
          required: ['recipes'],
        },
      });

      // With response_json_schema, the SDK returns a parsed object (not a
      // string), so no fragile fence-stripping / JSON.parse is needed.
      const list = Array.isArray(response?.recipes) ? response.recipes : [];
      if (list.length === 0) {
        setError('No recipes came back. Try different ingredients.');
      } else {
        // Mark each recipe as not-yet-detailed; detail loads on expand.
        setRecipes(list.map(r => ({ ...r, _detailLoaded: false, _detailLoading: false })));
      }
    } catch (e) {
      setError('Could not generate recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Phase 2: lazy per-recipe detail ───────────────────────────────────────
  // Fetches the heavy fields for ONE recipe, only when needed (on expand, or
  // when saving/logging requires nutrition). Result is merged back into that
  // recipe and cached via the _detailLoaded flag so it never re-fetches.
  // Returns the fully-detailed recipe object.
  const fetchRecipeDetail = async (recipe) => {
    // Already detailed — return as-is.
    if (recipe._detailLoaded) return recipe;

    // Flag this recipe as loading so the UI can show a spinner.
    setRecipes(prev => prev.map(r =>
      r.name === recipe.name ? { ...r, _detailLoading: true } : r
    ));

    const prompt = `You are Chef Daniel, a warm Christian nutrition coach. Provide the full detailed recipe for "${recipe.name}" — ${recipe.description}. It uses these ingredients: ${[...(recipe.usedIngredients || []), ...(recipe.additionalIngredients || [])].join(', ')}.

Give detailed cooking steps (at least 5, each with quantities and technique), realistic per-serving nutrition, specific health benefits, practical chef tips, and a short faith note connecting nourishment to caring for the body God gave us.`;

    try {
      const detail = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            steps: { type: 'array', items: { type: 'string' } },
            nutrition: {
              type: 'object',
              properties: {
                calories: { type: 'string' },
                protein: { type: 'string' },
                carbs: { type: 'string' },
                fat: { type: 'string' },
                fiber: { type: 'string' },
              },
            },
            healthBenefits: { type: 'array', items: { type: 'string' } },
            chefTips: { type: 'array', items: { type: 'string' } },
            faithNote: { type: 'string' },
          },
          required: ['steps', 'nutrition'],
        },
      });

      const detailed = {
        ...recipe,
        steps: detail?.steps || [],
        nutrition: detail?.nutrition || null,
        healthBenefits: detail?.healthBenefits || [],
        chefTips: detail?.chefTips || [],
        faithNote: detail?.faithNote || '',
        _detailLoaded: true,
        _detailLoading: false,
      };
      setRecipes(prev => prev.map(r => (r.name === recipe.name ? detailed : r)));
      return detailed;
    } catch (e) {
      setRecipes(prev => prev.map(r =>
        r.name === recipe.name ? { ...r, _detailLoading: false } : r
      ));
      toast.error('Could not load full recipe. Please try again.');
      return recipe;
    }
  };

  const toggleExpand = (recipe) => {
    const name = recipe.name;
    if (expandedRecipe === name) {
      setExpandedRecipe(null);
      return;
    }
    setExpandedRecipe(name);
    // Lazily load the heavy detail the first time this recipe is opened.
    if (!recipe._detailLoaded && !recipe._detailLoading) {
      fetchRecipeDetail(recipe);
    }
  };

  const canGenerate = ingredients.length >= 2 && !isGenerating;

  return (
    <div className="space-y-4">

      {/* ── Hero banner ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg dark:shadow-none"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 55%, #22c55e 130%)' }}>
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/8" />
        <div className="absolute -bottom-12 -left-6 w-32 h-32 rounded-full bg-[#FAD98D]/10" />
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }} />

        <div className="relative px-5 pt-5 pb-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[#FAD98D] uppercase tracking-[0.2em] mb-0.5">Powered by Chef Daniel</p>
              <h3 className="font-black text-white text-xl leading-tight">What's in your kitchen?</h3>
              <p className="text-xs text-white/70 mt-0.5 leading-relaxed">Tell me what you have — I'll suggest 3 recipes you can make right now.</p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold uppercase tracking-widest">
            <span className={`px-2 py-1 rounded-full ${ingredients.length > 0 ? 'bg-white text-[#166534]' : 'bg-white/15 text-white/60'}`}>
              1 · Add
            </span>
            <span className="text-white/30">→</span>
            <span className={`px-2 py-1 rounded-full ${recipes.length > 0 ? 'bg-white text-[#166534]' : 'bg-white/15 text-white/60'}`}>
              2 · Cook
            </span>
            <span className="text-white/30">→</span>
            <span className={`px-2 py-1 rounded-full ${Object.keys(loggedRecipes).length > 0 || Object.keys(savedRecipes).length > 0 ? 'bg-white text-[#166534]' : 'bg-white/15 text-white/60'}`}>
              3 · Save
            </span>
          </div>
        </div>
      </div>

      {/* ── Ingredient input card ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#22c55e]/15 dark:border-white/10 p-4 space-y-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">Step 1</p>
          <p className="text-sm font-bold text-[#0A1A2F] dark:text-white">
            Your ingredients
            <span className="ml-1.5 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-black"
              style={{
                background: ingredients.length > 0 ? 'linear-gradient(135deg,#166534,#22c55e)' : '#E5E7EB',
                color: ingredients.length > 0 ? 'white' : '#6B7280',
              }}>
              {ingredients.length}
            </span>
          </p>
        </div>

        {/* Input row */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. chicken, rice, garlic..."
            className="flex-1 border-[#22c55e]/20 focus-visible:ring-[#22c55e]/40"
          />
          <Button
            onClick={() => addIngredient()}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-[#166534] to-[#22c55e] text-white px-3 disabled:opacity-40"
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Added ingredient pills */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence>
              {ingredients.map((ing) => (
                <motion.span
                  key={ing}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-[#22c55e]/15 to-[#166534]/10 dark:from-[#22c55e]/20 dark:to-[#166534]/15 text-[#0A1A2F] dark:text-white border border-[#22c55e]/30 dark:border-[#22c55e]/20 rounded-full pl-3 pr-1.5 py-1 text-xs font-semibold"
                >
                  {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    aria-label={`Remove ${ing}`}
                    className="text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#dc2626] hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Multi-select ingredient browser */}
        <div className="bg-[#F2F6FA] dark:bg-white/5 rounded-xl p-3 border border-dashed border-[#22c55e]/25 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">
              Pick ingredients — tap to select
            </p>
            {selectedSuggestions.length > 0 && (
              <button
                onClick={addSelectedSuggestions}
                className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-[#166534] to-[#22c55e] text-white shadow-sm"
              >
                Add {selectedSuggestions.length} selected
              </button>
            )}
          </div>
          {STARTER_CATEGORIES.map(cat => (
            <div key={cat.label}>
              <p className="text-[10px] font-bold text-[#0A1A2F]/50 dark:text-white/40 mb-1.5">{cat.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map(s => {
                  const alreadyAdded = ingredients.some(i => i.toLowerCase() === s.toLowerCase());
                  const isSelected = selectedSuggestions.includes(s);
                  return (
                    <button
                      key={s}
                      disabled={alreadyAdded}
                      onClick={() => toggleSuggestion(s)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                        alreadyAdded
                          ? 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#166534]/50 dark:text-[#86EFAC]/40 cursor-default'
                          : isSelected
                          ? 'bg-gradient-to-r from-[#166534] to-[#22c55e] text-white border-transparent shadow-sm'
                          : 'bg-white dark:bg-white/8 text-[#166534] dark:text-[#86EFAC] border-[#22c55e]/20 hover:bg-[#22c55e]/10 hover:border-[#22c55e]/40'
                      }`}
                    >
                      {alreadyAdded ? '✓ ' : isSelected ? '✓ ' : '+ '}{s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Generate button */}
        <Button
          onClick={generateRecipes}
          disabled={!canGenerate}
          className={`w-full text-white font-bold h-11 rounded-xl shadow-md dark:shadow-none transition-all ${
            !canGenerate
              ? 'opacity-40 cursor-not-allowed bg-gradient-to-r from-[#9CA3AF] to-[#6B7280]'
              : 'bg-gradient-to-r from-[#166534] to-[#22c55e] hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Chef Daniel is thinking…</>
          ) : ingredients.length < 2 ? (
            <>Add {2 - ingredients.length} more {ingredients.length === 1 ? 'ingredient' : 'ingredients'} to generate</>
          ) : recipes.length > 0 ? (
            <><Sparkles className="w-4 h-4 mr-2" />Regenerate recipes</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" />Generate 3 recipes</>
          )}
        </Button>

        {error && <p className="text-red-500 text-xs text-center pt-1">{error}</p>}
      </div>

      {/* ── Loading skeleton ──────────────────────────────────────────────────── */}
      {isGenerating && (
        <div className="space-y-2.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              className="h-32 rounded-2xl bg-gradient-to-r from-[#F2F6FA] via-[#22c55e]/5 to-[#F2F6FA] dark:from-white/5 dark:via-[#22c55e]/10 dark:to-white/5 border border-[#22c55e]/10"
            />
          ))}
        </div>
      )}

      {/* ── Recipe cards ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {recipes.length > 0 && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">Step 2 · Pick a recipe</p>
              <p className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30">{recipes.length} suggestions</p>
            </div>

            {recipes.map((recipe, idx) => {
              const isExpanded = expandedRecipe === recipe.name;
              const difficultyColor = recipe.difficulty === 'Easy'
                ? { bg: 'bg-[#22c55e]/15 dark:bg-[#22c55e]/20', text: 'text-[#166534] dark:text-[#86EFAC]', border: 'border-[#22c55e]/25' }
                : recipe.difficulty === 'Medium'
                  ? { bg: 'bg-[#FAD98D]/30 dark:bg-[#FAD98D]/15', text: 'text-[#c9a227]', border: 'border-[#FAD98D]/40 dark:border-[#FAD98D]/20' }
                  : { bg: 'bg-[#fecaca]/40 dark:bg-red-900/20', text: 'text-[#b91c1c] dark:text-red-300', border: 'border-red-200 dark:border-red-800/30' };

              return (
                <motion.div
                  key={recipe.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white dark:bg-white/5 rounded-2xl border border-[#22c55e]/15 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none"
                >
                  {/* Top color band — subtle visual identity per recipe */}
                  <div className="h-1 bg-gradient-to-r from-[#166534] via-[#22c55e] to-[#86EFAC]" />

                  <div className="p-4">
                    {/* Recipe header — number badge + name + difficulty */}
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#166534] to-[#22c55e] text-white flex items-center justify-center font-black text-sm shadow-md shadow-[#22c55e]/25">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-[#0A1A2F] dark:text-white text-base leading-tight mb-0.5">{recipe.name}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${difficultyColor.bg} ${difficultyColor.text} ${difficultyColor.border}`}>
                            {recipe.difficulty}
                          </span>
                          {(recipe.prepTime || recipe.cookTime) && (
                            <span className="text-[10px] text-[#0A1A2F]/50 dark:text-white/50 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {[recipe.prepTime && `${recipe.prepTime} prep`, recipe.cookTime && `${recipe.cookTime} cook`].filter(Boolean).join(' · ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-[#0A1A2F]/70 dark:text-white/70 leading-relaxed mb-3">{recipe.description}</p>

                    {/* Ingredients */}
                    <div className="mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40 mb-1.5">Ingredients</p>
                      <div className="flex flex-wrap gap-1">
                        {(recipe.usedIngredients || []).map((ing) => (
                          <span key={`u-${ing}`} className="text-[11px] font-semibold bg-[#22c55e]/10 dark:bg-[#22c55e]/15 border border-[#22c55e]/25 rounded-full px-2 py-0.5 text-[#166534] dark:text-[#86EFAC]">
                            {ing}
                          </span>
                        ))}
                        {(recipe.additionalIngredients || []).map((ing) => (
                          <span key={`a-${ing}`} className="text-[11px] bg-[#F2F6FA] dark:bg-white/5 border border-[#0A1A2F]/10 dark:border-white/10 rounded-full px-2 py-0.5 text-[#0A1A2F]/60 dark:text-white/60">
                            + {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <button
                      onClick={() => toggleExpand(recipe)}
                      className="flex items-center gap-1 text-[#166534] dark:text-[#86EFAC] text-xs font-bold hover:gap-1.5 transition-all"
                    >
                      {isExpanded ? (
                        <>Hide full recipe <ChevronUp className="w-3.5 h-3.5" /></>
                      ) : (
                        <>View full recipe <ChevronDown className="w-3.5 h-3.5" /></>
                      )}
                    </button>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4 pt-3 border-t border-[#22c55e]/10 dark:border-white/8">
                      <button
                        onClick={() => handleLogToFoodLog(recipe)}
                        disabled={!!loggedRecipes[recipe.name]}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs font-bold transition-all ${
                          loggedRecipes[recipe.name]
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30'
                            : 'bg-gradient-to-r from-[#166534] to-[#22c55e] text-white shadow-md shadow-[#22c55e]/25 active:scale-95 hover:opacity-90'
                        }`}
                      >
                        {loggedRecipes[recipe.name]
                          ? <><Check className="w-3.5 h-3.5" /> Logged today</>
                          : <><Utensils className="w-3.5 h-3.5" /> Log to food log</>}
                      </button>
                      <button
                        onClick={() => handleSaveRecipe(recipe)}
                        disabled={!!savedRecipes[recipe.name]}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs font-bold transition-all border-2 ${
                          savedRecipes[recipe.name]
                            ? 'bg-[#22c55e]/10 dark:bg-[#22c55e]/15 text-[#166534] dark:text-[#86EFAC] border-[#22c55e]/30'
                            : 'bg-white dark:bg-white/5 text-[#166534] dark:text-[#86EFAC] border-[#22c55e]/30 hover:bg-[#22c55e]/10 dark:hover:bg-[#22c55e]/15 active:scale-95'
                        }`}
                      >
                        {savedRecipes[recipe.name]
                          ? <><Check className="w-3.5 h-3.5" /> Saved</>
                          : <><BookmarkPlus className="w-3.5 h-3.5" /> Save recipe</>}
                      </button>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-4 overflow-hidden"
                        >
                          {/* Detail still loading (Phase 2) */}
                          {recipe._detailLoading && !recipe._detailLoaded && (
                            <div className="flex flex-col items-center justify-center py-8 gap-3">
                              <Loader2 className="w-6 h-6 text-[#22c55e] animate-spin" />
                              <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">
                                Chef Daniel is writing the full recipe…
                              </p>
                            </div>
                          )}

                          {/* Detail content (only once loaded) */}
                          {recipe._detailLoaded && (
                            <>
                          {/* Servings line */}
                          {recipe.servings && (
                            <p className="text-xs text-[#0A1A2F]/60 dark:text-white/60 font-medium flex items-center gap-1.5">
                              <span>🍽️</span> Makes {recipe.servings}
                            </p>
                          )}

                          {/* Instructions */}
                          <div>
                            <p className="text-[10px] font-black text-[#166534] dark:text-[#86EFAC] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <span className="w-1 h-3 bg-[#22c55e] rounded-full" />
                              Instructions
                            </p>
                            <ol className="space-y-2.5">
                              {(recipe.steps || []).map((step, i) => (
                                <li key={i} className="flex gap-2.5 text-sm text-[#0A1A2F]/85 dark:text-white/85 leading-relaxed">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-[#166534] to-[#22c55e] text-white text-xs flex items-center justify-center font-black shadow-sm shadow-[#22c55e]/25 mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Nutrition Facts */}
                          {recipe.nutrition && (
                            <div className="bg-gradient-to-br from-[#F2F6FA] to-[#22c55e]/5 dark:from-white/5 dark:to-[#22c55e]/10 rounded-xl p-3 border border-[#22c55e]/15">
                              <p className="text-[10px] font-black text-[#166534] dark:text-[#86EFAC] uppercase tracking-widest mb-2.5 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-1 h-3 bg-[#22c55e] rounded-full" />
                                  Nutrition
                                </span>
                                <span className="text-[9px] font-semibold text-[#0A1A2F]/40 dark:text-white/40 normal-case tracking-normal">per serving</span>
                              </p>
                              {/* Calories prominent on top */}
                              <div className="bg-white dark:bg-white/5 rounded-lg p-2 mb-2 flex items-center justify-between border border-[#22c55e]/15">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/50 dark:text-white/50">Calories</span>
                                <span className="text-base font-black text-[#166534] dark:text-[#86EFAC]">{recipe.nutrition.calories || '—'}</span>
                              </div>
                              {/* Macros below */}
                              <div className="grid grid-cols-4 gap-1.5">
                                {[
                                  { label: 'Protein', value: recipe.nutrition.protein },
                                  { label: 'Carbs', value: recipe.nutrition.carbs },
                                  { label: 'Fat', value: recipe.nutrition.fat },
                                  { label: 'Fiber', value: recipe.nutrition.fiber },
                                ].map(({ label, value }) => (
                                  <div key={label} className="bg-white dark:bg-white/5 rounded-lg p-2 text-center border border-[#22c55e]/10">
                                    <p className="text-sm font-black text-[#0A1A2F] dark:text-white leading-tight">{value || '—'}</p>
                                    <p className="text-[9px] uppercase tracking-wider text-[#0A1A2F]/40 dark:text-white/40 mt-0.5">{label}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Health Benefits */}
                          {recipe.healthBenefits?.length > 0 && (
                            <div>
                              <p className="text-[10px] font-black text-[#166534] dark:text-[#86EFAC] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <span className="w-1 h-3 bg-[#22c55e] rounded-full" />
                                Health Benefits
                              </p>
                              <ul className="space-y-1.5">
                                {recipe.healthBenefits.map((benefit, i) => (
                                  <li key={i} className="flex gap-2 text-sm text-[#0A1A2F]/80 dark:text-white/80 leading-snug">
                                    <span className="text-[#22c55e] flex-shrink-0 mt-0.5">✓</span>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Chef Tips */}
                          {recipe.chefTips?.length > 0 && (
                            <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#FAD98D]/8 dark:from-[#FAD98D]/12 dark:to-[#FAD98D]/4 rounded-xl p-3 border border-[#FAD98D]/30 dark:border-[#FAD98D]/15">
                              <p className="text-[10px] font-black text-[#c9a227] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <span>👨‍🍳</span>
                                Chef Daniel's Tips
                              </p>
                              <ul className="space-y-1.5">
                                {recipe.chefTips.map((tip, i) => (
                                  <li key={i} className="text-sm text-[#0A1A2F]/80 dark:text-white/80 flex gap-2 leading-snug">
                                    <span className="text-[#c9a227] flex-shrink-0 mt-0.5">•</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Faith Note */}
                          {recipe.faithNote && (
                            <div className="bg-gradient-to-br from-[#22c55e]/10 to-[#166534]/5 dark:from-[#22c55e]/15 dark:to-[#166534]/10 rounded-xl p-3 border border-[#22c55e]/20 flex gap-2.5">
                              <span className="text-lg flex-shrink-0 leading-none">🙏</span>
                              <p className="text-sm text-[#166534] dark:text-[#86EFAC] italic leading-relaxed">{recipe.faithNote}</p>
                            </div>
                          )}
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}