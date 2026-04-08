import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { UtensilsCrossed, CalendarDays, ChefHat, History, Plus, Droplets, Flame, TrendingUp, Target, ChevronRight, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import DetailedFoodLogModal from '@/components/wellness/DetailedFoodLogModal';
import MealPlannerCard from '@/components/nutrition/MealPlannerCard';
import IngredientRecipeBuilder from '@/components/nutrition/IngredientRecipeBuilder';
import TrendingNutritionArticles from '@/components/nutrition/TrendingNutritionArticles';
import ChatButton from '@/components/chatbot/ChatButton';

// ─── Quick-log suggestions ────────────────────────────────────────────────────
const QUICK_MEALS = [
{ id: 1, emoji: '🍳', name: 'Scrambled Eggs & Toast', meal: 'breakfast', cal: 320, protein: 18, carbs: 28, fats: 14 },
{ id: 2, emoji: '🥗', name: 'Grilled Chicken Salad', meal: 'lunch', cal: 420, protein: 38, carbs: 22, fats: 16 },
{ id: 3, emoji: '🐟', name: 'Salmon & Broccoli', meal: 'dinner', cal: 480, protein: 40, carbs: 20, fats: 22 },
{ id: 4, emoji: '🥛', name: 'Greek Yogurt & Berries', meal: 'snack', cal: 180, protein: 15, carbs: 22, fats: 3 },
{ id: 5, emoji: '🥗', name: 'Quinoa Buddha Bowl', meal: 'lunch', cal: 520, protein: 18, carbs: 65, fats: 12 },
{ id: 6, emoji: '🍗', name: 'Chicken & Sweet Potato', meal: 'dinner', cal: 560, protein: 44, carbs: 52, fats: 14 },
{ id: 7, emoji: '🍲', name: 'Lentil Soup', meal: 'lunch', cal: 360, protein: 20, carbs: 48, fats: 4 },
{ id: 8, emoji: '🫐', name: 'Oatmeal with Blueberries', meal: 'breakfast', cal: 290, protein: 9, carbs: 54, fats: 6 },
{ id: 9, emoji: '🥜', name: 'Almond Butter on Rice Cake', meal: 'snack', cal: 160, protein: 5, carbs: 18, fats: 9 },
{ id: 10, emoji: '🍠', name: 'Turkey & Veggie Wrap', meal: 'lunch', cal: 440, protein: 32, carbs: 42, fats: 12 }];


const TABS = [
{ id: 'today', label: 'Today', icon: Flame },
{ id: 'planner', label: 'Planner', icon: CalendarDays },
{ id: 'build', label: 'Build', icon: ChefHat },
{ id: 'goals', label: 'Goals', icon: Target },
{ id: 'log', label: 'Log Food', icon: Plus },
{ id: 'history', label: 'Log History', icon: History }];


const DEFAULT_MACROS = { calories: 2000, protein: 150, carbs: 250, fats: 65 };

function getMacroConfig(user) {
  const cal = user?.calorie_goal || user?.daily_calories || DEFAULT_MACROS.calories;
  const p = user?.protein_goal || DEFAULT_MACROS.protein;
  const c = user?.carbs_goal || DEFAULT_MACROS.carbs;
  const f = user?.fat_goal || DEFAULT_MACROS.fats;
  return [
  { key: 'calories', label: 'Calories', unit: '', target: cal, color: 'bg-[#FAD98D]' },
  { key: 'protein', label: 'Protein', unit: 'g', target: p, color: 'bg-[#AFC7E3]' },
  { key: 'carbs', label: 'Carbs', unit: 'g', target: c, color: 'bg-[#FAD98D]' },
  { key: 'fats', label: 'Fat', unit: 'g', target: f, color: 'bg-[#FAD98D]/60' }];

}

const MEAL_EMOJI = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

function MacroRing({ value, target, label, unit, color }) {
  const safeTarget = target || 1;
  const pct = Math.min(value / safeTarget * 100, 100);
  const over = value > safeTarget;
  return (
    <div className="text-center">
      <div className="relative w-14 h-14 mx-auto mb-1">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F2F6FA" strokeWidth="3.5" />
          <circle cx="18" cy="18" r="15.9" fill="none"
          stroke={over ? '#ef4444' : '#c9a227'} strokeWidth="3.5"
          strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#0A1A2F]">{value}</span>
        </div>
      </div>
      <p className="text-[9px] font-bold text-[#0A1A2F]/40 uppercase tracking-wide">{label}</p>
      <p className="text-[9px] text-[#0A1A2F]/30">{target}{unit}</p>
    </div>);

}

export default function Nutrition() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const navigate = useNavigate();
  const [showLogModal, setShowLogModal] = useState(false);
  const queryClient = useQueryClient();
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  useEffect(() => {base44.auth.me().then(setUser).catch(() => {});}, []);

  // ── Single unified query for all meal data ──
  const { data: meals = [], isLoading: mealsLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      try {return await base44.entities.MealLog.list('-date', 200);}
      catch {return [];}
    },
    enabled: !!user
  });

  const { data: waterLogs = [] } = useQuery({
    queryKey: ['water'],
    queryFn: async () => {try {return await base44.entities.WaterLog.list();} catch {return [];}},
    enabled: !!user
  });

  const todayMeals = meals.filter((m) => (m.date || '').startsWith(today));
  const totals = todayMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fats: acc.fats + (m.fats || 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  // water
  const todayWater = waterLogs.find((w) => (w.date || '').startsWith(today));
  const glasses = todayWater?.glasses || 0;
  const waterGoal = todayWater?.goal || 8;

  const logMeal = useMutation({
    mutationFn: (data) => base44.entities.MealLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['meals']);
      queryClient.invalidateQueries(['mealLogs']);
      toast.success('Meal logged!');
    },
    onError: () => toast.error('Failed to log meal')
  });

  const deleteMeal = useMutation({
    mutationFn: (id) => base44.entities.MealLog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['meals']);
      toast.success('Meal removed');
    },
    onError: () => toast.error('Failed to remove meal')
  });

  const updateWater = useMutation({
    mutationFn: async (n) => {
      if (todayWater) return base44.entities.WaterLog.update(todayWater.id, { glasses: n });
      return base44.entities.WaterLog.create({ date: today, glasses: n, goal: 8 });
    },
    onSuccess: () => queryClient.invalidateQueries(['water']),
    onError: () => toast.error('Failed to update water intake')
  });

  const quickLog = (meal) => {
    logMeal.mutate({
      date: today, meal_type: meal.meal,
      description: meal.name,
      calories: meal.cal, protein: meal.protein,
      carbs: meal.carbs, fats: meal.fats
    });
  };

  // suggest by time of day
  const hour = new Date().getHours();
  const suggestType = hour < 10 ? 'breakfast' : hour < 14 ? 'lunch' : hour < 18 ? 'snack' : 'dinner';
  const suggestions = QUICK_MEALS.filter((m) => m.meal === suggestType);
  const calGoal = user?.calorie_goal || user?.daily_calories || DEFAULT_MACROS.calories || 2000;

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-28">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            









            
            <div />
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {TABS.map(({ id, label, icon: Icon }) => {
              const isLog = id === 'log';
              const isActive = activeTab === id;
              return (
                <button key={id} onClick={() => {
                  if (id === 'goals') navigate(createPageUrl('NutritionGoalsPage'));
                  else if (id === 'log') setShowLogModal(true);
                  else if (id === 'history') navigate(createPageUrl('FoodLogHistory'));
                  else setActiveTab(id);
                }}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${
                  isLog
                    ? 'bg-gradient-to-b from-[#c9a227] to-[#FAD98D] text-white shadow-md shadow-[#c9a227]/20 scale-105'
                    : isActive
                    ? 'bg-[#FAD98D]/25 text-[#c9a227]'
                    : 'text-[#0A1A2F]/40 hover:text-[#0A1A2F]/65 hover:bg-[#F2F6FA]'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="leading-none">{label}</span>
                  {isActive && !isLog && (
                    <div className="w-1 h-1 rounded-full bg-[#c9a227]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">

        {/* ══ TODAY TAB ══ */}
        {activeTab === 'today' &&
        <>
            {/* Nutrition Goals entry card */}
            <Link to={createPageUrl('NutritionGoalsPage')}>
              <motion.div id="tour-nutrition-goals-entry" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 flex items-center gap-3 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #22C55E 180%)' }}>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🥗</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm leading-tight">My Nutrition Goals</p>
                  <p className="text-white/55 text-xs mt-0.5">Diet · Calories · Macros · Meal schedule</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
              </motion.div>
            </Link>
            {/* Macro summary card */}
            <div id="tour-nutrition-macros" className="bg-white rounded-2xl border border-[#FAD98D]/20 p-4">
              <p className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-3">Today's Progress</p>
              <div className="grid grid-cols-4 gap-2">
                {getMacroConfig(user).map(({ key, label, unit, target }) =>
              <MacroRing key={key} value={Math.round(totals[key])} target={target} label={label} unit={unit} />
              )}
              </div>
              {/* Calorie bar */}
              <div className="mt-4 pt-3 border-t border-[#FAD98D]/15">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#0A1A2F]/50 font-semibold">{Math.round(totals.calories)} kcal eaten</span>
                  <span className="text-[#0A1A2F]/35">{Math.max(0, calGoal - Math.round(totals.calories))} remaining</span>
                </div>
                <div className="w-full bg-[#F2F6FA] rounded-full h-2 overflow-hidden">
                  <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(totals.calories / calGoal * 100, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`h-full rounded-full ${totals.calories > calGoal ? 'bg-red-400' : 'bg-gradient-to-r from-[#c9a227] to-[#FAD98D]'}`} />
                
                </div>
              </div>
            </div>

            {/* Water tracker */}
            <div id="tour-water-tracker" className="bg-white rounded-2xl border border-[#FAD98D]/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#AFC7E3]/20 flex items-center justify-center">
                    <Droplets className="w-4.5 h-4.5 text-[#3C4E53]" style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <p className="font-bold text-[#0A1A2F] text-sm">Water Intake</p>
                    <p className="text-xs text-[#0A1A2F]/40">{glasses} / {waterGoal} glasses</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateWater.mutate(Math.max(0, glasses - 1))}
                className="w-11 h-11 rounded-full bg-[#F2F6FA] font-bold text-[#0A1A2F]/50 flex items-center justify-center hover:bg-[#FAD98D]/20 text-lg">−</button>
                  <span className="font-bold text-[#3C4E53] text-lg w-6 text-center">{glasses}</span>
                  <button onClick={() => updateWater.mutate(Math.min(20, glasses + 1))}
                className="w-11 h-11 rounded-full bg-[#AFC7E3]/20 font-bold text-[#3C4E53] flex items-center justify-center hover:bg-[#AFC7E3]/35 text-lg">+</button>
                </div>
              </div>
              {/* Water dots — tap to fill up to that point */}
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {Array.from({ length: waterGoal }).map((_, i) =>
              <button key={i} onClick={() => updateWater.mutate(i + 1)}
              className={`w-7 h-7 rounded-full transition-all text-sm ${i < glasses ? 'bg-[#AFC7E3] text-white' : 'bg-[#F2F6FA] text-[#0A1A2F]/20'}`}>
                    💧
                  </button>
              )}
              </div>
              {/* Water goal celebration */}
              {glasses >= waterGoal &&
            <div className="mt-3 text-center">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    💧 Hydration goal reached!
                  </span>
                </div>
            }
            </div>

            {/* Today's meals */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest">Meals Logged Today · {todayMeals.length}</p>
              </div>
              {todayMeals.length === 0 ?
            <div className="bg-white rounded-2xl border border-[#FAD98D]/20 p-6 text-center">
                  <p className="text-sm text-[#0A1A2F]/40 font-semibold">Nothing logged yet</p>
                  <p className="text-xs text-[#0A1A2F]/25 mt-1">Tap a suggestion below or use Log Food</p>
                </div> :

            <div className="space-y-2">
                  {todayMeals.map((m, i) =>
              <motion.div key={m.id || i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-xl border border-[#FAD98D]/15 p-3 flex items-center gap-3 group">
                      <span className="text-xl flex-shrink-0">{MEAL_EMOJI[m.meal_type] || '🍴'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0A1A2F] text-sm leading-tight truncate">{m.description}</p>
                        <p className="text-[10px] text-[#0A1A2F]/35 mt-0.5 capitalize">{m.meal_type}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-[#c9a227] text-sm">{m.calories || 0}</p>
                        <p className="text-[9px] text-[#0A1A2F]/30">kcal</p>
                      </div>
                      {m.id &&
                <button onClick={() => {if (window.confirm('Remove this meal?')) deleteMeal.mutate(m.id);}}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                }
                    </motion.div>
              )}
                </div>
            }
            </div>

            {/* Quick log suggestions */}
            <div>
              <p className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-2.5 capitalize">
                Quick Log · {suggestType}
              </p>
              <div className="space-y-2">
                {suggestions.length === 0 ?
              <div className="bg-white rounded-xl border border-[#FAD98D]/15 p-4 text-center">
                    <p className="text-xs text-[#0A1A2F]/35">No quick suggestions for {suggestType} right now. Use Log Food above.</p>
                  </div> :
              suggestions.map((meal, i) => {
                const alreadyLogged = todayMeals.some((m) => m.description === meal.name);
                return (
                  <motion.div key={meal.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-xl border border-[#FAD98D]/15 p-3 flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{meal.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0A1A2F] text-sm leading-tight">{meal.name}</p>
                      <div className="flex gap-3 mt-0.5 text-[10px] text-[#0A1A2F]/40">
                        <span>{meal.cal} cal</span>
                        <span>{meal.protein}g P</span>
                        <span>{meal.carbs}g C</span>
                        <span>{meal.fats}g F</span>
                      </div>
                    </div>
                    {alreadyLogged ?
                    <span className="text-xs font-bold text-emerald-500 flex-shrink-0">✓ Logged</span> :

                    <button onClick={() => quickLog(meal)}
                    disabled={logMeal.isPending}
                    className="px-3 py-1.5 rounded-xl bg-[#FAD98D]/25 text-[#c9a227] text-xs font-bold hover:bg-[#FAD98D]/40 transition-colors flex-shrink-0">
                        + Log
                      </button>
                    }
                  </motion.div>);

              })}
              </div>
            </div>

            {/* Quick nav cards */}
            <div className="grid grid-cols-2 gap-3">
              <Link to={createPageUrl('DiscoverRecipes')}>
                <div className="bg-white border border-[#FAD98D]/20 rounded-2xl p-4 hover:border-[#c9a227]/30 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center mb-2">
                    <UtensilsCrossed className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                  </div>
                  <p className="font-bold text-[#0A1A2F] text-sm">Discover Recipes</p>
                  <p className="text-xs text-[#0A1A2F]/40 mt-0.5">Browse & log recipes</p>
                </div>
              </Link>
              <Link to={createPageUrl('FoodLogHistory')}>
                <div className="bg-white border border-[#FAD98D]/20 rounded-2xl p-4 hover:border-[#c9a227]/30 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#AFC7E3]/20 flex items-center justify-center mb-2">
                    <TrendingUp className="w-4.5 h-4.5 text-[#3C4E53]" style={{ width: 18, height: 18 }} />
                  </div>
                  <p className="font-bold text-[#0A1A2F] text-sm">Food Log History</p>
                  <p className="text-xs text-[#0A1A2F]/40 mt-0.5">View trends & history</p>
                </div>
              </Link>
            </div>

            {/* Ask Chef Daniel */}
            <Link to={createPageUrl('ChatScreen?bot=ChefDaniel')}>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 flex items-center gap-3 border border-[#FAD98D]/30">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FD9C2D] to-[#E89020] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0A1A2F] text-sm">Ask Chef Daniel</p>
                  <p className="text-xs text-[#0A1A2F]/50">Meal ideas, macros, diet questions — ask anything.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#FD9C2D] flex-shrink-0" />
              </div>
            </Link>

            {/* Scripture for nourishment */}
            <div className="bg-gradient-to-br from-[#FAD98D]/15 to-[#FAD98D]/5 rounded-2xl p-4 border border-[#FAD98D]/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-[#c9a227] rounded-full" />
                <span className="text-[10px] font-bold text-[#c9a227] uppercase tracking-widest">Nourish Your Spirit</span>
              </div>
              <p className="text-[#0A1A2F] text-sm leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
                "Whether you eat or drink, or whatever you do, do it all for the glory of God."
              </p>
              <p className="text-xs text-[#0A1A2F]/40 mt-1">1 Corinthians 10:31 (WEB)</p>
            </div>

            {/* Articles */}
            <TrendingNutritionArticles />
          </>
        }

        {/* ══ PLANNER TAB ══ */}
        {activeTab === 'planner' && <MealPlannerCard />}

        {/* ══ BUILD TAB ══ */}
        {activeTab === 'build' && <IngredientRecipeBuilder />}

        {/* ══ GOALS TAB ══ */}
        {activeTab === 'goals' && null}

      </div>

      {/* Log Food Modal */}
      <DetailedFoodLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSave={(data) => {
          logMeal.mutate(data, {
            onSuccess: () => setShowLogModal(false)
          });
        }} />
      

      {/* Eating Disorder Resources */}
      <div className="max-w-lg mx-auto px-4 pb-4">
        <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-start gap-3">
          <span className="text-base flex-shrink-0 mt-0.5">💙</span>
          <div>
            <p className="text-[10px] text-[#0A1A2F]/50 leading-relaxed">
              If you or someone you know is struggling with disordered eating, help is available.
              <a href="tel:18666621235" className="text-[#1e40af] font-semibold ml-1">Alliance for Eating Disorders: 1-866-662-1235</a>
            </p>
          </div>
        </div>
      </div>

      <ChatButton bot="ChefDaniel" id="tour-chef-daniel-btn" />
    </div>);

}