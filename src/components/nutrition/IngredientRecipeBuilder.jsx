import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, ChefHat, Loader2, Clock, ChevronDown, ChevronUp, BookmarkPlus, Utensils, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function IngredientRecipeBuilder() {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState({});
  const [loggedRecipes, setLoggedRecipes] = useState({});

  const parseNum = (str) => parseFloat((str || '').toString().replace(/[^\d.]/g, '')) || 0;

  const handleLogToFoodLog = async (recipe) => {
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    const mealType = hour < 10 ? 'breakfast' : hour < 14 ? 'lunch' : hour < 18 ? 'snack' : 'dinner';
    await base44.entities.MealLog.create({
      date: today,
      meal_type: mealType,
      description: recipe.name,
      calories: parseNum(recipe.nutrition?.calories),
      protein: parseNum(recipe.nutrition?.protein),
      carbs: parseNum(recipe.nutrition?.carbs),
      fats: parseNum(recipe.nutrition?.fat),
      fiber: parseNum(recipe.nutrition?.fiber),
      notes: recipe.description,
    });
    setLoggedRecipes(p => ({ ...p, [recipe.name]: true }));
    toast.success(`"${recipe.name}" logged to Food Log!`);
  };

  const handleSaveRecipe = async (recipe) => {
    const allIngredients = [...(recipe.usedIngredients || []), ...(recipe.additionalIngredients || [])];
    await base44.entities.Recipe.create({
      title: recipe.name,
      description: recipe.description,
      ingredients: allIngredients,
      instructions: recipe.steps || [],
      prep_time_minutes: parseNum(recipe.prepTime),
      cook_time_minutes: parseNum(recipe.cookTime),
      servings: parseNum(recipe.servings) || 2,
      calories: parseNum(recipe.nutrition?.calories),
      category: 'lunch',
      diet_type: 'any',
      is_shared: false,
    });
    setSavedRecipes(p => ({ ...p, [recipe.name]: true }));
    toast.success(`"${recipe.name}" saved to My Recipes!`);
  };

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInputValue('');
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

  const generateRecipes = async () => {
    setIsGenerating(true);
    setError(null);
    setRecipes([]);
    setExpandedRecipe(null);

    const prompt = `You are Chef Daniel, a warm and encouraging Christian nutrition coach. The user has these ingredients available: ${ingredients.join(', ')}.

Generate exactly 3 recipe suggestions. Respond ONLY with a valid JSON array — no markdown, no explanation, no code fences. Use this exact format:

[
  {
    "name": "Recipe Name",
    "description": "One appetizing sentence describing the dish",
    "usedIngredients": ["ingredient1", "ingredient2"],
    "additionalIngredients": ["salt", "olive oil"],
    "prepTime": "10 mins",
    "cookTime": "20 mins",
    "difficulty": "Easy",
    "servings": "2 servings",
    "steps": [
      "Detailed step 1 with exact quantities and technique (e.g. Heat 2 tbsp olive oil in a large skillet over medium-high heat)",
      "Detailed step 2",
      "Detailed step 3",
      "Detailed step 4",
      "Detailed step 5"
    ],
    "nutrition": {
      "calories": "420 kcal",
      "protein": "32g",
      "carbs": "28g",
      "fat": "18g",
      "fiber": "5g"
    },
    "healthBenefits": [
      "One specific health benefit of this meal",
      "A second specific health benefit",
      "A third health benefit"
    ],
    "chefTips": [
      "A practical cooking tip to make this dish better",
      "A storage or meal prep tip"
    ],
    "faithNote": "A short encouraging sentence connecting this nourishing meal to caring for the body God gave us"
  }
]

Requirements:
- Steps must be detailed and specific with quantities and techniques — at least 5 steps per recipe
- Nutrition values should be realistic estimates per serving
- Health benefits should be specific (e.g. 'High in omega-3s which support heart health' not just 'healthy')
- Chef tips should be genuinely useful practical advice
- Only include recipes that genuinely use most of the provided ingredients
- Make all recipes practical, wholesome, and encouraging`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      const cleaned = response.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setRecipes(parsed);
    } catch (e) {
      setError('Could not parse recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleExpand = (name) => {
    setExpandedRecipe(expandedRecipe === name ? null : name);
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm dark:shadow-none p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#AFC7E3] to-[#6B7280] flex items-center justify-center flex-shrink-0">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-[#0A1A2F] dark:text-white text-lg">What's in your kitchen?</h3>
          <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60">Add ingredients you have and we'll suggest recipes you can make right now.</p>
        </div>
      </div>

      {/* Input Row */}
      <div className="flex gap-2 mt-4">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. chicken, rice, garlic..."
          className="flex-1"
        />
        <Button
          onClick={addIngredient}
          disabled={!inputValue.trim()}
          className="bg-gradient-to-r from-[#AFC7E3] to-[#6B7280] text-white px-3"
          size="sm"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Ingredient Pills */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          <AnimatePresence>
            {ingredients.map((ing) => (
              <motion.span
                key={ing}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 bg-[#FAD98D]/30 text-[#0A1A2F] dark:text-white border border-[#FAD98D]/40 rounded-full px-3 py-1 text-sm"
              >
                {ing}
                <button
                  onClick={() => removeIngredient(ing)}
                  className="text-[#0A1A2F]/50 dark:text-white/50 hover:text-[#0A1A2F] dark:text-white leading-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={generateRecipes}
        disabled={ingredients.length < 2 || isGenerating}
        className={`w-full mt-4 text-white font-semibold ${
          ingredients.length < 2 ? 'opacity-50 cursor-not-allowed bg-[#AFC7E3]' : 'bg-gradient-to-r from-[#AFC7E3] to-[#6B7280]'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Finding recipes...
          </>
        ) : (
          <>
            <ChefHat className="w-4 h-4 mr-2" />
            Generate Recipes {ingredients.length < 2 && '(add 2+ ingredients)'}
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      {/* Recipe Cards */}
      <AnimatePresence>
        {recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 space-y-3"
          >
            {recipes.map((recipe, idx) => {
              const isExpanded = expandedRecipe === recipe.name;
              const difficultyClass = recipe.difficulty === 'Easy'
                ? 'bg-[#AFC7E3]/20 text-[#3C4E53]'
                : 'bg-[#FAD98D]/30 text-[#C9A227]';

              return (
                <motion.div
                  key={recipe.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl p-4 border border-[#FAD98D]/20"
                >
                  {/* Recipe Header */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-[#0A1A2F] dark:text-white text-base leading-tight">{recipe.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${difficultyClass}`}>
                      {recipe.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-[#0A1A2F]/70 dark:text-white/70 mb-3">{recipe.description}</p>

                  {/* Time & Ingredients */}
                  <div className="flex items-center gap-4 text-xs text-[#0A1A2F]/60 dark:text-white/60 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Prep: {recipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Cook: {recipe.cookTime}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-[#0A1A2F]/60 dark:text-white/60 mb-1">Ingredients needed:</p>
                    <div className="flex flex-wrap gap-1">
                      {[...(recipe.usedIngredients || []), ...(recipe.additionalIngredients || [])].map((ing) => (
                        <span key={ing} className="text-xs bg-white dark:bg-white/5 border border-[#FAD98D]/30 rounded-full px-2 py-0.5 text-[#0A1A2F]/80 dark:text-white/80">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View Full Recipe Toggle */}
                  <button
                    onClick={() => toggleExpand(recipe.name)}
                    className="flex items-center gap-1 text-[#3C4E53] text-sm font-semibold"
                  >
                    {isExpanded ? (
                      <>Hide Recipe <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>View Full Recipe <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-[#FAD98D]/20">
                    <button
                      onClick={() => handleLogToFoodLog(recipe)}
                      disabled={!!loggedRecipes[recipe.name]}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm dark:shadow-none ${
                        loggedRecipes[recipe.name]
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-none'
                          : 'bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white shadow-[#c9a227]/25 active:scale-95 hover:opacity-90'
                      }`}
                    >
                      {loggedRecipes[recipe.name]
                        ? <><Check className="w-3.5 h-3.5" /> Logged!</>
                        : <><Utensils className="w-3.5 h-3.5" /> Log to Food Log</>}
                    </button>
                    <button
                      onClick={() => handleSaveRecipe(recipe)}
                      disabled={!!savedRecipes[recipe.name]}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm dark:shadow-none ${
                        savedRecipes[recipe.name]
                          ? 'bg-[#AFC7E3]/20 text-[#3C4E53] border border-[#AFC7E3]/40 shadow-none'
                          : 'bg-[#3C4E53] text-white shadow-[#3C4E53]/20 active:scale-95 hover:opacity-90'
                      }`}
                    >
                      {savedRecipes[recipe.name]
                        ? <><Check className="w-3.5 h-3.5" /> Saved!</>
                        : <><BookmarkPlus className="w-3.5 h-3.5" /> Save Recipe</>}
                    </button>
                  </div>

                  {/* Expanded Full Recipe */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4 overflow-hidden"
                      >
                        {/* Servings */}
                        {recipe.servings && (
                          <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 font-medium">🍽️ {recipe.servings}</p>
                        )}

                        {/* Step-by-step instructions */}
                        <div>
                          <p className="text-xs font-bold text-[#0A1A2F] dark:text-white uppercase tracking-wide mb-2">Instructions</p>
                          <ol className="space-y-2">
                            {(recipe.steps || []).map((step, i) => (
                              <li key={i} className="flex gap-2 text-sm text-[#0A1A2F]/80 dark:text-white/80 leading-relaxed">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#AFC7E3] to-[#6B7280] text-white text-xs flex items-center justify-center font-bold mt-0.5">
                                  {i + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Nutrition Facts */}
                        {recipe.nutrition && (
                          <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-[#FAD98D]/20">
                            <p className="text-xs font-bold text-[#0A1A2F] dark:text-white uppercase tracking-wide mb-3">Nutrition Facts <span className="font-normal normal-case text-[#0A1A2F]/50 dark:text-white/50">(per serving)</span></p>
                            <div className="grid grid-cols-5 gap-2 text-center">
                              {[
                                { label: 'Calories', value: recipe.nutrition.calories },
                                { label: 'Protein', value: recipe.nutrition.protein },
                                { label: 'Carbs', value: recipe.nutrition.carbs },
                                { label: 'Fat', value: recipe.nutrition.fat },
                                { label: 'Fiber', value: recipe.nutrition.fiber },
                              ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col items-center">
                                  <p className="text-sm font-bold text-[#3C4E53]">{value || '—'}</p>
                                  <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mt-0.5">{label}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Health Benefits */}
                        {recipe.healthBenefits?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-[#0A1A2F] dark:text-white uppercase tracking-wide mb-2">Health Benefits</p>
                            <ul className="space-y-1">
                              {recipe.healthBenefits.map((benefit, i) => (
                                <li key={i} className="flex gap-2 text-sm text-[#0A1A2F]/75 dark:text-white/75">
                                  <span className="text-[#AFC7E3] flex-shrink-0">✓</span>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Chef Tips */}
                        {recipe.chefTips?.length > 0 && (
                          <div className="bg-[#FAD98D]/15 rounded-xl p-4 border border-[#FAD98D]/30">
                            <p className="text-xs font-bold text-[#C9A227] uppercase tracking-wide mb-2">👨‍🍳 Chef Daniel's Tips</p>
                            <ul className="space-y-1">
                              {recipe.chefTips.map((tip, i) => (
                                <li key={i} className="text-sm text-[#0A1A2F]/75 dark:text-white/75 flex gap-2">
                                  <span className="text-[#3C4E53] flex-shrink-0">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Faith Note */}
                        {recipe.faithNote && (
                          <div className="bg-[#AFC7E3]/15 rounded-xl p-4 border border-[#AFC7E3]/30 flex gap-3">
                            <span className="text-lg flex-shrink-0">🙏</span>
                            <p className="text-sm text-[#3C4E53] italic leading-relaxed">{recipe.faithNote}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}