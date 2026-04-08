import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, Loader2, ShoppingCart, X, Plus, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Search } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

export default function MealPlannerCard() {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [weekPlan, setWeekPlan] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingList, setIsGeneratingList] = useState(false);
  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [showPlan, setShowPlan] = useState(true);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const { data: savedRecipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list('-created_date', 200),
  });

  const filteredRecipes = useMemo(() => {
    return savedRecipes.filter(r => {
      const matchesSearch = !search || r.title?.toLowerCase().includes(search.toLowerCase());
      const matchesCat = filterCat === 'all' || r.category === filterCat;
      return matchesSearch && matchesCat;
    });
  }, [savedRecipes, search, filterCat]);

  const categories = useMemo(() => {
    const cats = [...new Set(savedRecipes.map(r => r.category).filter(Boolean))];
    return cats;
  }, [savedRecipes]);

  const toggleRecipe = (recipe) => {
    setSelectedRecipes(prev =>
      prev.find(r => r.id === recipe.id)
        ? prev.filter(r => r.id !== recipe.id)
        : [...prev, recipe]
    );
  };

  const generateWeekPlan = async () => {
    if (selectedRecipes.length === 0) return;
    setIsGenerating(true);
    setError(null);
    setWeekPlan(null);
    setShoppingList(null);

    const recipeNames = selectedRecipes.map(r => r.title).join(', ');
    const prompt = `You are Chef Daniel, a warm Christian nutrition coach. The user has selected these recipes: ${recipeNames}.

Create a practical 7-day meal plan using these recipes (repeat as needed across days). Respond ONLY with a valid JSON object, no markdown, no explanation.

{
  "weekPlan": [
    {
      "day": "Monday",
      "breakfast": "Recipe name or simple suggestion",
      "lunch": "Recipe name or simple suggestion",
      "dinner": "Recipe name or simple suggestion"
    }
  ]
}

Rules:
- Use the selected recipes strategically, rotating them across the week
- For meal slots that don't match a recipe, suggest a simple healthy complement (e.g. "Greek yogurt with berries", "Green salad")
- Spread recipes so no single recipe appears more than 3 times
- Include all 7 days: Monday through Sunday`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      const cleaned = response.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setWeekPlan(parsed.weekPlan);
      setShowPlan(true);
    } catch (e) {
      setError('Could not generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateShoppingList = async () => {
    if (!weekPlan) return;
    setIsGeneratingList(true);

    const allMeals = weekPlan.flatMap(d => [d.breakfast, d.lunch, d.dinner]).join(', ');
    const recipeIngredients = selectedRecipes
      .map(r => `${r.title}: ${(r.ingredients || []).join(', ')}`)
      .join('\n');

    const prompt = `You are Chef Daniel. Based on this week's meal plan: ${allMeals}

And these recipe ingredients:
${recipeIngredients}

Generate a consolidated grocery shopping list. Respond ONLY with a valid JSON object:

{
  "categories": [
    {
      "name": "Produce",
      "items": ["item 1", "item 2"]
    },
    {
      "name": "Proteins",
      "items": ["item 1"]
    },
    {
      "name": "Grains & Pantry",
      "items": ["item 1"]
    },
    {
      "name": "Dairy & Eggs",
      "items": ["item 1"]
    },
    {
      "name": "Spices & Condiments",
      "items": ["item 1"]
    }
  ]
}

Consolidate duplicates, include realistic quantities (e.g. "2 lbs chicken breast"), and only include what's actually needed.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      const cleaned = response.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setShoppingList(parsed.categories);
      setShowList(true);
    } catch (e) {
      setError('Could not generate shopping list. Please try again.');
    } finally {
      setIsGeneratingList(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center flex-shrink-0">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-[#0A1A2F] text-lg">Weekly Meal Planner</h3>
          <p className="text-sm text-[#0A1A2F]/60">Select recipes and generate your week's plan.</p>
        </div>
      </div>

      {/* Recipe Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[#0A1A2F]">Selected Recipes ({selectedRecipes.length})</p>
          <button
            onClick={() => setShowRecipePicker(!showRecipePicker)}
            className="flex items-center gap-1 text-[#c9a227] text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            {showRecipePicker ? 'Done' : 'Pick Recipes'}
          </button>
        </div>

        {/* Selected recipe pills */}
        {selectedRecipes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedRecipes.map(r => (
              <span
                key={r.id}
                className="flex items-center gap-1.5 bg-[#FAD98D]/30 text-[#0A1A2F] border border-[#FAD98D]/40 rounded-full px-3 py-1 text-sm"
              >
                {r.title}
                <button onClick={() => toggleRecipe(r)} className="text-[#0A1A2F]/50 hover:text-[#0A1A2F]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Recipe Picker */}
        <AnimatePresence>
          {showRecipePicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {savedRecipes.length === 0 ? (
                <p className="text-sm text-[#0A1A2F]/50 py-3 text-center">No saved recipes yet. Create some in Discover Recipes or the Recipe Builder!</p>
              ) : (
                <div className="space-y-2 mt-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1A2F]/30" />
                    <input
                      type="text"
                      placeholder="Search recipes..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-[#FAD98D]/25 bg-[#F2F6FA] text-[#0A1A2F] placeholder-[#0A1A2F]/35 focus:outline-none focus:border-[#c9a227]/50"
                    />
                  </div>
                  {/* Category filter */}
                  {categories.length > 1 && (
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => setFilterCat('all')}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${filterCat === 'all' ? 'bg-[#c9a227] text-white' : 'bg-[#F2F6FA] text-[#0A1A2F]/50'}`}
                      >All</button>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterCat(cat)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all ${filterCat === cat ? 'bg-[#c9a227] text-white' : 'bg-[#F2F6FA] text-[#0A1A2F]/50'}`}
                        >{cat}</button>
                      ))}
                    </div>
                  )}
                  {/* Recipe list */}
                  <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
                    {filteredRecipes.length === 0 ? (
                      <p className="text-xs text-[#0A1A2F]/40 text-center py-3">No recipes match your search.</p>
                    ) : filteredRecipes.map(recipe => {
                      const isSelected = selectedRecipes.find(r => r.id === recipe.id);
                      return (
                        <button
                          key={recipe.id}
                          onClick={() => toggleRecipe(recipe)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#FAD98D]/15 border-[#c9a227]/30'
                              : 'bg-[#F2F6FA] border-[#FAD98D]/20 hover:border-[#c9a227]/25'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#0A1A2F] truncate">{recipe.title}</p>
                            <div className="flex gap-2 mt-0.5 flex-wrap">
                              {recipe.category && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAD98D]/30 text-[#c9a227] capitalize">{recipe.category}</span>
                              )}
                              {recipe.diet_type && recipe.diet_type !== 'any' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22c55e]/15 text-[#16a34a] capitalize">{recipe.diet_type.replace('_', ' ')}</span>
                              )}
                              {recipe.calories && (
                                <span className="text-[10px] text-[#0A1A2F]/35">{recipe.calories} cal</span>
                              )}
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#c9a227] flex-shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[#0A1A2F]/30 text-center">{filteredRecipes.length} of {savedRecipes.length} recipes shown</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Generate Button */}
      <Button
        onClick={generateWeekPlan}
        disabled={selectedRecipes.length === 0 || isGenerating}
        className={`w-full text-white font-semibold ${
          selectedRecipes.length === 0 ? 'opacity-50 cursor-not-allowed bg-[#FAD98D]' : 'bg-gradient-to-r from-[#c9a227] to-[#FAD98D]'
        }`}
      >
        {isGenerating ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating plan...</>
        ) : (
          <><Sparkles className="w-4 h-4 mr-2" />Generate Weekly Plan</>
        )}
      </Button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Week Plan */}
      <AnimatePresence>
        {weekPlan && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#0A1A2F] uppercase tracking-wide">Your Week</p>
              <button onClick={() => setShowPlan(!showPlan)} className="text-[#0A1A2F]/40 hover:text-[#0A1A2F]">
                {showPlan ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {showPlan && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                  {weekPlan.map((day, i) => (
                    <div key={i} className="bg-[#F2F6FA] rounded-xl p-4 border border-[#FAD98D]/20">
                      <p className="text-xs font-bold text-[#c9a227] uppercase tracking-wide mb-2">{day.day}</p>
                      <div className="space-y-1.5">
                        {MEAL_TYPES.map(type => (
                          <div key={type} className="flex gap-2 text-sm">
                            <span className="text-xs text-[#0A1A2F]/40 w-16 flex-shrink-0 pt-0.5 font-medium">{type}</span>
                            <span className="text-[#0A1A2F]/80">{day[type.toLowerCase()]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shopping List Button */}
            <Button
              onClick={generateShoppingList}
              disabled={isGeneratingList}
              variant="outline"
              className="w-full border-[#FAD98D]/50 text-[#0A1A2F] hover:bg-[#FAD98D]/10"
            >
              {isGeneratingList ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Building list...</>
              ) : (
                <><ShoppingCart className="w-4 h-4 mr-2" />Generate Shopping List</>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping List */}
      <AnimatePresence>
        {shoppingList && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#0A1A2F] uppercase tracking-wide">🛒 Shopping List</p>
              <button onClick={() => setShowList(!showList)} className="text-[#0A1A2F]/40 hover:text-[#0A1A2F]">
                {showList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {showList && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                  {shoppingList.map((cat, i) => (
                    <div key={i} className="bg-[#F2F6FA] rounded-xl p-4 border border-[#FAD98D]/20">
                      <p className="text-xs font-bold text-[#C9A227] uppercase tracking-wide mb-2">{cat.name}</p>
                      <ul className="space-y-1">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex gap-2 text-sm text-[#0A1A2F]/80">
                            <span className="text-[#c9a227] flex-shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}