import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, Loader2, ShoppingCart, X, Plus, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Search, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_INITIAL = { Monday: 'M', Tuesday: 'T', Wednesday: 'W', Thursday: 'T', Friday: 'F', Saturday: 'S', Sunday: 'S' };
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const MEAL_ICON  = { Breakfast: '🍳', Lunch: '🥗', Dinner: '🍽️' };

// Today's day-of-week as a string from our DAYS array (Monday-first)
function getTodayName() {
  // Date.getDay(): Sun=0..Sat=6 → remap so Monday=0..Sunday=6
  const d = new Date().getDay();
  const idx = (d + 6) % 7;
  return DAYS[idx];
}

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

  const todayName = getTodayName();

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
    <div className="space-y-4">

      {/* ── Hero banner ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg dark:shadow-none"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 55%, #22c55e 130%)' }}>
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/8" />
        <div className="absolute -bottom-12 -left-6 w-32 h-32 rounded-full bg-[#FAD98D]/10" />
        {/* Subtle pattern dots */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }} />

        <div className="relative px-5 pt-5 pb-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[#FAD98D] uppercase tracking-[0.2em] mb-0.5">Powered by Chef Daniel</p>
              <h3 className="font-black text-white text-xl leading-tight">Weekly Meal Planner</h3>
              <p className="text-xs text-white/70 mt-0.5 leading-relaxed">Pick your recipes — get a 7-day plan + grocery list in seconds.</p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold uppercase tracking-widest">
            <span className={`px-2 py-1 rounded-full ${selectedRecipes.length > 0 ? 'bg-white text-[#166534]' : 'bg-white/15 text-white/60'}`}>
              1 · Pick
            </span>
            <span className="text-white/30">→</span>
            <span className={`px-2 py-1 rounded-full ${weekPlan ? 'bg-white text-[#166534]' : 'bg-white/15 text-white/60'}`}>
              2 · Plan
            </span>
            <span className="text-white/30">→</span>
            <span className={`px-2 py-1 rounded-full ${shoppingList ? 'bg-white text-[#166534]' : 'bg-white/15 text-white/60'}`}>
              3 · Shop
            </span>
          </div>
        </div>
      </div>

      {/* ── Recipe selection ──────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#22c55e]/15 dark:border-white/10 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">Step 1</p>
            <p className="text-sm font-bold text-[#0A1A2F] dark:text-white">
              Recipes selected
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-black"
                style={{
                  background: selectedRecipes.length > 0 ? 'linear-gradient(135deg,#166534,#22c55e)' : '#E5E7EB',
                  color: selectedRecipes.length > 0 ? 'white' : '#6B7280',
                }}>
                {selectedRecipes.length}
              </span>
            </p>
          </div>
          <button
            onClick={() => setShowRecipePicker(!showRecipePicker)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              showRecipePicker
                ? 'bg-[#0A1A2F] text-white'
                : 'bg-[#22c55e]/10 dark:bg-[#22c55e]/15 text-[#166534] dark:text-[#86EFAC] hover:bg-[#22c55e]/20'
            }`}
          >
            {showRecipePicker ? <><X className="w-3.5 h-3.5" /> Done</> : <><Plus className="w-3.5 h-3.5" /> Pick recipes</>}
          </button>
        </div>

        {/* Selected recipe pills */}
        {selectedRecipes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedRecipes.map(r => (
              <span
                key={r.id}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#22c55e]/15 to-[#166534]/10 dark:from-[#22c55e]/20 dark:to-[#166534]/15 text-[#0A1A2F] dark:text-white border border-[#22c55e]/30 dark:border-[#22c55e]/20 rounded-full pl-3 pr-1.5 py-1 text-xs font-semibold"
              >
                {r.title}
                <button onClick={() => toggleRecipe(r)} className="text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#dc2626] hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full w-4 h-4 flex items-center justify-center transition-colors">
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
                <div className="text-center py-6 px-4 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl">
                  <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60 mb-1">No saved recipes yet</p>
                  <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40">Create some in Discover Recipes or the Recipe Builder.</p>
                </div>
              ) : (
                <div className="space-y-2.5 mt-1">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1A2F]/30 dark:text-white/30" />
                    <input
                      type="text"
                      placeholder="Search recipes..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-[#22c55e]/20 dark:border-white/10 bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/35 focus:outline-none focus:border-[#22c55e]/50"
                    />
                  </div>
                  {/* Category filter */}
                  {categories.length > 1 && (
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => setFilterCat('all')}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${filterCat === 'all' ? 'bg-[#166534] text-white' : 'bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F]/50 dark:text-white/50'}`}
                      >All</button>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterCat(cat)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all ${filterCat === cat ? 'bg-[#166534] text-white' : 'bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F]/50 dark:text-white/50'}`}
                        >{cat}</button>
                      ))}
                    </div>
                  )}
                  {/* Recipe list */}
                  <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
                    {filteredRecipes.length === 0 ? (
                      <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40 text-center py-3">No recipes match your search.</p>
                    ) : filteredRecipes.map(recipe => {
                      const isSelected = selectedRecipes.find(r => r.id === recipe.id);
                      return (
                        <button
                          key={recipe.id}
                          onClick={() => toggleRecipe(recipe)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#22c55e]/10 dark:bg-[#22c55e]/15 border-[#22c55e]/40'
                              : 'bg-[#F2F6FA] dark:bg-[#0A1A2F] border-[#22c55e]/15 dark:border-white/10 hover:border-[#22c55e]/30'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white truncate">{recipe.title}</p>
                            <div className="flex gap-2 mt-0.5 flex-wrap">
                              {recipe.category && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22c55e]/15 text-[#166534] capitalize">{recipe.category}</span>
                              )}
                              {recipe.diet_type && recipe.diet_type !== 'any' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAD98D]/30 text-[#c9a227] capitalize">{recipe.diet_type.replace('_', ' ')}</span>
                              )}
                              {recipe.calories && (
                                <span className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35">{recipe.calories} cal</span>
                              )}
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30 text-center">{filteredRecipes.length} of {savedRecipes.length} recipes shown</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <Button
          onClick={generateWeekPlan}
          disabled={selectedRecipes.length === 0 || isGenerating}
          className={`w-full text-white font-bold h-11 rounded-xl shadow-md dark:shadow-none transition-all ${
            selectedRecipes.length === 0
              ? 'opacity-40 cursor-not-allowed bg-gradient-to-r from-[#9CA3AF] to-[#6B7280]'
              : 'bg-gradient-to-r from-[#166534] to-[#22c55e] hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Chef Daniel is planning your week…</>
          ) : selectedRecipes.length === 0 ? (
            <>Pick at least one recipe to generate</>
          ) : weekPlan ? (
            <><Sparkles className="w-4 h-4 mr-2" />Regenerate plan</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" />Generate weekly plan</>
          )}
        </Button>

        {error && <p className="text-red-500 text-xs text-center pt-1">{error}</p>}
      </div>

      {/* ── Empty state preview (before plan exists) ─────────────────────────── */}
      {!weekPlan && !isGenerating && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-[#22c55e]/30 dark:border-[#22c55e]/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">Step 2 · Preview</p>
              <p className="text-sm font-bold text-[#0A1A2F]/50 dark:text-white/50">Your week appears here</p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map(day => {
              const isToday = day === todayName;
              return (
                <div key={day}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 ${
                    isToday
                      ? 'bg-[#22c55e]/10 dark:bg-[#22c55e]/15 border border-[#22c55e]/30'
                      : 'bg-[#F2F6FA] dark:bg-white/5 border border-transparent'
                  }`}>
                  <span className={`text-sm font-black ${isToday ? 'text-[#166534] dark:text-[#86EFAC]' : 'text-[#0A1A2F]/25 dark:text-white/25'}`}>
                    {DAY_INITIAL[day]}
                  </span>
                  <div className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Loading skeleton (during generation) ─────────────────────────────── */}
      {isGenerating && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#22c55e]/15 dark:border-white/10 p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Loader2 className="w-4 h-4 text-[#22c55e] animate-spin" />
            <p className="text-xs font-bold text-[#0A1A2F]/60 dark:text-white/60">Chef Daniel is planning…</p>
          </div>
          {DAYS.map((day, i) => (
            <motion.div key={day}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
              className="h-14 rounded-xl bg-gradient-to-r from-[#F2F6FA] via-[#22c55e]/5 to-[#F2F6FA] dark:from-white/5 dark:via-[#22c55e]/10 dark:to-white/5"
            />
          ))}
        </div>
      )}

      {/* ── Week Plan ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {weekPlan && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#22c55e]/15 dark:border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">Step 2</p>
                  <p className="text-sm font-bold text-[#0A1A2F] dark:text-white">Your week</p>
                </div>
                <button onClick={() => setShowPlan(!showPlan)}
                  className="w-8 h-8 rounded-full bg-[#F2F6FA] dark:bg-white/8 flex items-center justify-center text-[#0A1A2F]/50 dark:text-white/50 hover:bg-[#22c55e]/10 hover:text-[#166534] transition-colors">
                  {showPlan ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence>
                {showPlan && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                    {weekPlan.map((day, i) => {
                      const isToday = day.day === todayName;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className={`relative rounded-xl overflow-hidden border ${
                            isToday
                              ? 'border-[#22c55e]/40 bg-gradient-to-br from-[#22c55e]/8 to-transparent dark:from-[#22c55e]/15'
                              : 'border-[#22c55e]/15 dark:border-white/8 bg-[#F2F6FA] dark:bg-white/5'
                          }`}>
                          {/* Left accent stripe */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${isToday ? 'bg-gradient-to-b from-[#22c55e] to-[#166534]' : 'bg-[#22c55e]/20 dark:bg-[#22c55e]/15'}`} />

                          <div className="p-3 pl-4">
                            <div className="flex items-center gap-2.5 mb-2">
                              {/* Day badge */}
                              <div className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                                isToday
                                  ? 'bg-gradient-to-br from-[#166534] to-[#22c55e] text-white shadow-md shadow-[#22c55e]/30'
                                  : 'bg-white dark:bg-white/10 text-[#0A1A2F] dark:text-white border border-[#22c55e]/15 dark:border-white/10'
                              }`}>
                                <span className="text-sm font-black leading-none">{DAY_INITIAL[day.day]}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold ${isToday ? 'text-[#166534] dark:text-[#86EFAC]' : 'text-[#0A1A2F] dark:text-white'}`}>
                                  {day.day}
                                  {isToday && (
                                    <span className="ml-2 text-[9px] font-black uppercase tracking-widest bg-[#22c55e] text-white px-1.5 py-0.5 rounded">Today</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Meal rows */}
                            <div className="space-y-1 pl-11">
                              {MEAL_TYPES.map(type => (
                                <div key={type} className="flex items-start gap-2 text-sm">
                                  <span className="text-base leading-tight flex-shrink-0" aria-hidden>{MEAL_ICON[type]}</span>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40 block leading-tight">{type}</span>
                                    <span className="text-[#0A1A2F]/85 dark:text-white/85 leading-snug">{day[type.toLowerCase()]}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shopping List Button */}
              <Button
                onClick={generateShoppingList}
                disabled={isGeneratingList}
                variant="outline"
                className="w-full border-2 border-[#22c55e]/30 text-[#166534] dark:text-[#86EFAC] hover:bg-[#22c55e]/10 dark:hover:bg-[#22c55e]/15 font-semibold h-11 rounded-xl"
              >
                {isGeneratingList ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Building your list…</>
                ) : shoppingList ? (
                  <><ShoppingCart className="w-4 h-4 mr-2" />Regenerate shopping list</>
                ) : (
                  <><ShoppingCart className="w-4 h-4 mr-2" />Generate shopping list</>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Shopping List ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {shoppingList && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#22c55e]/15 dark:border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">Step 3</p>
                  <p className="text-sm font-bold text-[#0A1A2F] dark:text-white flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-[#166534] dark:text-[#86EFAC]" />
                    Shopping list
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={async () => {
                      const text = shoppingList.map(cat =>
                        `${cat.name}:\n${cat.items.map(i => `• ${i}`).join('\n')}`
                      ).join('\n\n');
                      if (navigator.share) {
                        try {
                          await navigator.share({ title: 'My Grocery List', text });
                        } catch (err) {
                          if (err.name !== 'AbortError') {
                            navigator.clipboard.writeText(text);
                            toast.success('Shopping list copied to clipboard!');
                          }
                        }
                      } else {
                        navigator.clipboard.writeText(text);
                        toast.success('Shopping list copied to clipboard!');
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#166534] dark:text-[#86EFAC] hover:bg-[#22c55e]/10 dark:hover:bg-[#22c55e]/15 px-2.5 py-1.5 rounded-full transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </button>
                  <button onClick={() => setShowList(!showList)}
                    className="w-8 h-8 rounded-full bg-[#F2F6FA] dark:bg-white/8 flex items-center justify-center text-[#0A1A2F]/50 dark:text-white/50 hover:bg-[#22c55e]/10 hover:text-[#166534] transition-colors">
                    {showList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showList && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                    {shoppingList.map((cat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-[#F2F6FA] dark:bg-white/5 rounded-xl p-3 border border-[#22c55e]/15 dark:border-white/8">
                        <p className="text-[10px] font-black text-[#166534] dark:text-[#86EFAC] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-[#22c55e] rounded-full" />
                          {cat.name}
                          <span className="ml-auto text-[#0A1A2F]/30 dark:text-white/30 font-bold">{cat.items.length}</span>
                        </p>
                        <ul className="space-y-1">
                          {cat.items.map((item, j) => (
                            <li key={j} className="flex gap-2 text-sm text-[#0A1A2F]/85 dark:text-white/85">
                              <span className="text-[#22c55e] flex-shrink-0">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
