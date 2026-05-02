import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { todayKey } from '@/utils/localDate';
import { UtensilsCrossed, CalendarDays, ChefHat, History, Plus, Droplets, Flame, Target, Trash2 } from 'lucide-react';
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
          <span className="text-[10px] font-bold text-[#0A1A2F] dark:text-white dark:text-white">{value}</span>
        </div>
      </div>
      <p className="text-[9px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-wide">{label}</p>
      <p className="text-[9px] text-[#0A1A2F]/30 dark:text-white/30">{target}{unit}</p>
    </div>);

}


class PageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6 text-center">
          <p className="text-lg font-bold text-[#0A1A2F] dark:text-white mb-2">Something went wrong</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This page encountered an error.</p>
          <button onClick={() => this.setState({ error: null })} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function NutritionInner() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const navigate = useNavigate();
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const queryClient = useQueryClient();
  const today = todayKey();

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
    mutationFn: (data) => {
      if (editingMeal?.id) return base44.entities.MealLog.update(editingMeal.id, data);
      return base44.entities.MealLog.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['meals']);
      queryClient.invalidateQueries(['mealLogs']);
      toast.success(editingMeal?.id ? 'Meal updated!' : 'Meal logged!');
      setEditingMeal(null);
    },
    onError: () => toast.error('Failed to save meal')
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
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* Health Disclaimer — required for App Store approval */}
      <div className="mx-3 sm:mx-4 mb-3 bg-amber-50 dark:bg-amber-900/20 dark:bg-amber-900/15 rounded-xl px-3 py-2 border border-amber-100 dark:border-amber-800/30 dark:border-amber-800/20">
        <p className="text-[10px] text-amber-700 dark:text-amber-300 text-center">Not medical advice. Consult a healthcare professional before starting any new exercise or nutrition program.</p>
      </div>


      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A1A2F]/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
        <div className="max-w-lg mx-auto px-4 pt-3 pb-0">

          {/* Title row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-black text-[#0A1A2F] dark:text-white leading-tight">Nutrition</h1>
              <p className="text-[11px] text-[#0A1A2F]/40 dark:text-white/40 font-medium">Track · Plan · Nourish</p>
            </div>
            <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white text-xs font-bold shadow-md dark:shadow-none shadow-[#c9a227]/25 active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Food
            </button>
          </div>

          {/* Nav tabs — only the navigation ones, no Log Food here */}
          <div id="tour-nutrition-goals-entry" className="flex gap-0 border-b border-transparent -mb-px">
            {TABS.filter(t => t.id !== 'log').map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id && id !== 'goals' && id !== 'history';
              return (
                <button key={id} onClick={() => {
                  if (id === 'goals') navigate(createPageUrl('NutritionGoalsPage'));
                  else if (id === 'history') navigate(createPageUrl('FoodLogHistory'));
                  else setActiveTab(id);
                }}
                className={`flex items-center gap-1 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#c9a227] text-[#c9a227]'
                    : 'border-transparent text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#0A1A2F]/65 dark:text-white/65'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">

        {/* ══ TODAY TAB ══ */}
        {activeTab === 'today' && (
          <div className="space-y-5">

            {/* ── Scripture banner ── */}
            <div className="bg-gradient-to-br from-[#14532d] to-[#166534] rounded-2xl p-4 flex items-start gap-3 shadow-sm dark:shadow-none">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-base">✝️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Nourish Your Spirit</p>
                <p className="text-white text-sm leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
                  "Whatever you eat or drink, do it all for the glory of God."
                </p>
                <p className="text-white/40 text-[10px] mt-1.5 font-semibold">1 Corinthians 10:31</p>
              </div>
            </div>

            {/* ── Today's Progress ── */}
            <div id="tour-nutrition-macros" className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-gray-50 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">Today's Progress</p>
                  <span className="text-[10px] font-bold text-[#0A1A2F]/30 dark:text-white/30 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="p-4">
                {/* Calorie bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <span className="text-2xl font-black text-[#0A1A2F] dark:text-white dark:text-white">{Math.round(totals.calories)}</span>
                      <span className="text-xs text-[#0A1A2F]/40 dark:text-white/40 ml-1">/ {calGoal} kcal</span>
                    </div>
                    <span className={`text-xs font-bold ${totals.calories > calGoal ? 'text-red-500' : 'text-[#16a34a]'}`}>
                      {totals.calories > calGoal ? `${Math.round(totals.calories - calGoal)} over` : `${Math.max(0, calGoal - Math.round(totals.calories))} left`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(totals.calories / calGoal * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${totals.calories > calGoal ? 'bg-red-400' : 'bg-gradient-to-r from-[#16a34a] to-[#22c55e]'}`}
                    />
                  </div>
                </div>
                {/* Macro rings */}
                <div className="grid grid-cols-4 gap-2">
                  {getMacroConfig(user).map(({ key, label, unit, target }) => (
                    <MacroRing key={key} value={Math.round(totals[key])} target={target} label={label} unit={unit} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Water tracker ── */}
            <div id="tour-water-tracker" className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Water Intake</p>
                    <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40">{glasses} of {waterGoal} glasses today</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => updateWater.mutate(Math.max(0, glasses - 1))}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 font-bold text-[#0A1A2F]/50 dark:text-white/50 flex items-center justify-center hover:bg-gray-200 transition-colors text-base leading-none">−</button>
                  <span className="font-bold text-[#16a34a] text-base w-5 text-center">{glasses}</span>
                  <button onClick={() => updateWater.mutate(Math.min(20, glasses + 1))}
                    className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/25 font-bold text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors text-base leading-none">+</button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: waterGoal }).map((_, i) => (
                  <button key={i} onClick={() => updateWater.mutate(i + 1)}
                    className={`w-7 h-7 rounded-full text-sm transition-all active:scale-90 ${i < glasses ? 'bg-blue-50 dark:bg-blue-900/200 shadow-sm dark:shadow-none' : 'bg-gray-100 dark:bg-white/5'}`}>
                    {i < glasses ? '💧' : '○'}
                  </button>
                ))}
              </div>
              {glasses >= waterGoal && (
                <div className="mt-3 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2">
                  <span className="text-sm">🎉</span>
                  <p className="text-xs font-bold text-blue-600">Hydration goal reached!</p>
                </div>
              )}
            </div>

            {/* ── Today's Meals ── */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-50 dark:border-white/5">
                <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">Meals Logged Today</p>
                <span className="text-xs font-bold text-[#0A1A2F]/30 dark:text-white/30 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{todayMeals.length}</span>
              </div>
              <div className="p-3">
                {todayMeals.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-2xl mb-2">🍽️</p>
                    <p className="text-sm font-semibold text-[#0A1A2F]/40 dark:text-white/40">Nothing logged yet</p>
                    <p className="text-xs text-[#0A1A2F]/25 dark:text-white/25 mt-1">Tap a suggestion below or use Log Food</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {todayMeals.map((m, i) => (
                      <motion.button key={m.id || i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => { if (m.id) { setEditingMeal(m); setShowLogModal(true); } }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:bg-white/5 group transition-colors text-left">
                        <div className="w-8 h-8 rounded-lg bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 flex items-center justify-center flex-shrink-0 text-base">
                          {MEAL_EMOJI[m.meal_type] || '🍴'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#0A1A2F] dark:text-white text-sm leading-tight truncate">{m.description}</p>
                          <p className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35 mt-0.5 capitalize">{m.meal_type}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-[#c9a227] text-sm">{m.calories || 0} <span className="text-[10px] font-normal text-[#0A1A2F]/30 dark:text-white/30">kcal</span></p>
                        </div>
                        {m.id && (
                          <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Remove this meal?')) deleteMeal.mutate(m.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:bg-red-900/20 text-gray-300 dark:text-gray-400 dark:text-gray-300 hover:text-red-400 transition-all flex-shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
                <button onClick={() => setShowLogModal(true)}
                  className="w-full mt-3 py-2.5 rounded-xl border-2 border-dashed border-[#FAD98D]/50 dark:border-[#FAD98D]/20 text-xs font-bold text-[#c9a227] hover:border-[#c9a227]/50 hover:bg-[#FAD98D]/5 transition-all flex items-center justify-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Meal
                </button>
              </div>
            </div>

            {/* ── Quick Log ── */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-gray-50 dark:border-white/5">
                <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">Quick Log <span className="text-[#16a34a] capitalize">· {suggestType}</span></p>
              </div>
              <div className="p-3 space-y-1.5">
                {suggestions.length === 0 ? (
                  <p className="text-xs text-[#0A1A2F]/35 dark:text-white/35 text-center py-3">No suggestions right now. Use Log Food above.</p>
                ) : suggestions.map((meal, i) => {
                  const alreadyLogged = todayMeals.some((m) => m.description === meal.name);
                  return (
                    <motion.div key={meal.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:bg-white/5 transition-colors">
                      <span className="text-xl flex-shrink-0">{meal.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0A1A2F] dark:text-white text-sm leading-tight">{meal.name}</p>
                        <div className="flex gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-[#c9a227] bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 px-1.5 py-0.5 rounded">{meal.cal} cal</span>
                          <span className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35">{meal.protein}g P · {meal.carbs}g C · {meal.fats}g F</span>
                        </div>
                      </div>
                      {alreadyLogged ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg flex-shrink-0">✓ Logged</span>
                      ) : (
                        <button onClick={() => quickLog(meal)} disabled={logMeal.isPending}
                          className="px-3 py-1.5 rounded-xl bg-[#22c55e]/15 text-[#16a34a] text-xs font-bold hover:bg-[#22c55e]/25 transition-colors flex-shrink-0 active:scale-95">
                          + Log
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── Discover + Chef Daniel row ── */}
            <div className="grid grid-cols-2 gap-3">
              <Link to={createPageUrl('DiscoverRecipes')}>
                <div className="bg-gradient-to-br from-[#16a34a] to-[#22c55e] rounded-2xl p-4 h-full flex flex-col gap-2 shadow-sm dark:shadow-none active:scale-[0.97] transition-transform">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">Discover Recipes</p>
                    <p className="text-white/65 text-[10px] mt-0.5">Browse & log instantly</p>
                  </div>
                </div>
              </Link>
              <Link to={createPageUrl('ChatScreen?bot=ChefDaniel')}>
                <div className="bg-gradient-to-br from-[#c9a227] to-[#FAD98D] rounded-2xl p-4 h-full flex flex-col gap-2 shadow-sm dark:shadow-none active:scale-[0.97] transition-transform">
                  <div className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">Ask Chef Daniel</p>
                    <p className="text-white/70 text-[10px] mt-0.5">Meal ideas & advice</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* ── Articles ── */}
            <TrendingNutritionArticles />
          </div>
        )}

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
        initialData={editingMeal}
        onClose={() => { setShowLogModal(false); setEditingMeal(null); }}
        onSave={(data) => {
          logMeal.mutate(data, {
            onSuccess: () => setShowLogModal(false)
          });
        }} />
      

      {/* Eating Disorder Resources */}
      <div className="max-w-lg mx-auto px-4 pb-4">
        <div className="bg-white dark:bg-white/5 rounded-xl px-4 py-3 border border-gray-100 dark:border-white/10 flex items-start gap-3">
          <span className="text-base flex-shrink-0 mt-0.5">💙</span>
          <div>
            <p className="text-[10px] text-[#0A1A2F]/50 dark:text-white/50 leading-relaxed">
              If you or someone you know is struggling with disordered eating, help is available.
              <a href="tel:18666621235" className="text-[#1e40af] font-semibold ml-1">Alliance for Eating Disorders: 1-866-662-1235</a>
            </p>
          </div>
        </div>
      </div>

      <ChatButton bot="ChefDaniel" id="tour-chef-daniel-btn" />
    </div>);

}

export default function Nutrition(props) {
  return <PageErrorBoundary><NutritionInner {...props} /></PageErrorBoundary>;
}