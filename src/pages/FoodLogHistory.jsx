import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Flame, CalendarDays, ChefHat, Target, History, ChevronRight, Utensils } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DetailedFoodLogModal from '@/components/wellness/DetailedFoodLogModal';
import { toast } from 'sonner';

const MEAL_EMOJI = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' };
const MEAL_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

// Today / Yesterday / weekday formatting for the date header
function formatDateHeader(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayCopy = new Date(d);
  dayCopy.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - dayCopy) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'long' });
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateSub(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function FoodLogHistory() {
  const [showAddFood, setShowAddFood] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: allMeals = [], isLoading } = useQuery({
    queryKey: ['allMeals'],
    queryFn: async () => {
      try { return await base44.entities.MealLog.list('-date'); }
      catch { return []; }
    }
  });

  const deleteMeal = useMutation({
    mutationFn: (id) => base44.entities.MealLog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['allMeals']);
      setPendingDelete(null);
      toast.success('Meal deleted');
    },
    onError: () => {
      setPendingDelete(null);
      toast.error('Failed to delete meal');
    }
  });

  const logMeal = useMutation({
    mutationFn: (data) => base44.entities.MealLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['allMeals']);
      setShowAddFood(false);
      toast.success('Meal logged successfully!');
    },
    onError: () => toast.error('Failed to log meal')
  });

  const groupedMeals = allMeals.reduce((acc, meal) => {
    const date = meal.date || new Date().toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedMeals).sort().reverse();

  const NAV_TABS = [
    { id: 'today',   label: 'Today',      icon: Flame,        page: 'Nutrition'             },
    { id: 'planner', label: 'Planner',     icon: CalendarDays, page: 'Nutrition?tab=planner' },
    { id: 'build',   label: 'Build',       icon: ChefHat,      page: 'Nutrition?tab=build'   },
    { id: 'goals',   label: 'Goals',       icon: Target,       page: 'NutritionGoalsPage'    },
    { id: 'history', label: 'Log History', icon: History,      page: null                    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">

      {/* ── Sub-nav (page title is in Layout's UniversalHeader) ── */}
      <div className="sticky top-14 z-30 bg-white/95 dark:bg-[#0A1A2F]/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
        <div className="max-w-2xl mx-auto px-4 pt-2 pb-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 flex gap-0 border-b border-transparent -mb-px overflow-x-auto">
              {NAV_TABS.map(({ id, label, icon: Icon, page }) => (
                <button key={id}
                  onClick={() => page && navigate(createPageUrl(page))}
                  className={`flex items-center gap-1 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                    id === 'history'
                      ? 'border-[#22c55e] text-[#22c55e]'
                      : 'border-transparent text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#0A1A2F]/65 dark:text-white/65'
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
            {/* Log Food — compact icon on the right, aligned with tabs */}
            <button
              onClick={() => setShowAddFood(true)}
              aria-label="Log Food"
              className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-[#166534] to-[#22c55e] text-white flex items-center justify-center shadow-md dark:shadow-none shadow-[#22c55e]/25 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-4">
        {isLoading ? (
          /* Loading skeleton — three shimmering day cards */
          <div className="space-y-3">
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
        ) : sortedDates.length === 0 ? (
          /* Empty state — friendly illustration, copy, and a primary CTA */
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 rounded-3xl border border-[#22c55e]/15 dark:border-white/10 p-8 text-center"
          >
            {/* Stacked emoji "illustration" */}
            <div className="relative w-24 h-24 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#22c55e]/15 to-[#166534]/8 dark:from-[#22c55e]/20 dark:to-[#166534]/15" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl" aria-hidden>🍽️</span>
              </div>
              {/* Floating chip emojis */}
              <span className="absolute -top-1 -right-1 text-2xl bg-white dark:bg-white/10 rounded-full w-9 h-9 flex items-center justify-center shadow-sm border border-[#22c55e]/15" aria-hidden>🍳</span>
              <span className="absolute -bottom-1 -left-1 text-xl bg-white dark:bg-white/10 rounded-full w-9 h-9 flex items-center justify-center shadow-sm border border-[#22c55e]/15" aria-hidden>🥗</span>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#166534] dark:text-[#86EFAC] mb-2">No meals yet</p>
            <h2 className="text-xl font-black text-[#0A1A2F] dark:text-white mb-1.5">Log your first meal</h2>
            <p className="text-sm text-[#0A1A2F]/60 dark:text-white/60 max-w-xs mx-auto mb-5 leading-relaxed">
              Track what you eat to see your patterns over time. Every meal you log shows up here grouped by day.
            </p>
            <button
              onClick={() => setShowAddFood(true)}
              className="inline-flex items-center gap-1.5 px-5 h-11 rounded-xl bg-gradient-to-r from-[#166534] to-[#22c55e] text-white text-sm font-bold shadow-md dark:shadow-none shadow-[#22c55e]/25 active:scale-[0.98] hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Log a meal
            </button>

            <p className="text-[11px] text-[#0A1A2F]/40 dark:text-white/40 mt-5 leading-relaxed">
              You can also generate recipes in <Link to={createPageUrl('Nutrition?tab=build')} className="text-[#166534] dark:text-[#86EFAC] font-semibold hover:underline">Build</Link> and log them straight from there.
            </p>
          </motion.div>
        ) : (
          /* Day cards */
          <div className="space-y-3">
            {sortedDates.map((date, dateIdx) => {
              const dateMeals = groupedMeals[date];
              const dateTotal        = dateMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
              const dateTotalProtein = dateMeals.reduce((sum, m) => sum + (m.protein  || 0), 0);
              const dateTotalCarbs   = dateMeals.reduce((sum, m) => sum + (m.carbs    || 0), 0);
              const dateTotalFats    = dateMeals.reduce((sum, m) => sum + (m.fats     || 0), 0);
              const isToday = formatDateHeader(date) === 'Today';

              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(dateIdx * 0.04, 0.3) }}
                  className="bg-white dark:bg-white/5 rounded-2xl border border-[#22c55e]/15 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none"
                >

                  {/* Date header */}
                  <div className={`p-4 ${
                    isToday
                      ? 'bg-gradient-to-br from-[#166534] to-[#22c55e] text-white'
                      : 'bg-gradient-to-br from-[#F2F6FA] to-[#22c55e]/8 dark:from-white/5 dark:to-[#22c55e]/15'
                  }`}>
                    <div className="flex items-baseline justify-between mb-3">
                      <div className="min-w-0">
                        <h2 className={`font-black text-lg leading-tight ${isToday ? 'text-white' : 'text-[#0A1A2F] dark:text-white'}`}>
                          {formatDateHeader(date)}
                          {isToday && <span className="ml-2 text-[9px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded">Today</span>}
                        </h2>
                        <p className={`text-[11px] font-medium mt-0.5 ${isToday ? 'text-white/70' : 'text-[#0A1A2F]/50 dark:text-white/50'}`}>
                          {formatDateSub(date)} · {dateMeals.length} {dateMeals.length === 1 ? 'meal' : 'meals'}
                        </p>
                      </div>
                      <div className={`text-right ${isToday ? 'text-white' : 'text-[#0A1A2F] dark:text-white'}`}>
                        <p className="text-2xl font-black leading-none">{dateTotal}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isToday ? 'text-white/70' : 'text-[#0A1A2F]/50 dark:text-white/50'}`}>kcal total</p>
                      </div>
                    </div>

                    {/* Macro chips */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: 'P', full: 'Protein', value: Math.round(dateTotalProtein) },
                        { label: 'C', full: 'Carbs',   value: Math.round(dateTotalCarbs)   },
                        { label: 'F', full: 'Fat',     value: Math.round(dateTotalFats)    },
                      ].map(({ label, full, value }) => (
                        <div key={label} className={`rounded-lg px-2 py-1.5 flex items-center justify-between ${
                          isToday ? 'bg-white/15 backdrop-blur-sm' : 'bg-white dark:bg-white/8 border border-[#22c55e]/10'
                        }`}>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-white/70' : 'text-[#0A1A2F]/50 dark:text-white/50'}`}>{full}</span>
                          <span className={`text-sm font-black ${isToday ? 'text-white' : 'text-[#0A1A2F] dark:text-white'}`}>{value}<span className={`text-[10px] font-bold ml-0.5 ${isToday ? 'text-white/60' : 'text-[#0A1A2F]/40 dark:text-white/40'}`}>g</span></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meals list */}
                  <ul className="divide-y divide-[#22c55e]/10 dark:divide-white/8">
                    {dateMeals.map((meal) => {
                      const isPendingDelete = pendingDelete === meal.id;
                      return (
                        <li key={meal.id} className="relative">
                          <Link
                            to={createPageUrl(`MealDetailView?id=${meal.id}`)}
                            className="flex items-center gap-3 p-3 hover:bg-[#22c55e]/5 dark:hover:bg-[#22c55e]/10 transition-colors"
                          >
                            {/* Meal-type icon badge */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e]/15 to-[#166534]/8 dark:from-[#22c55e]/20 dark:to-[#166534]/15 flex items-center justify-center text-lg" aria-hidden>
                              {MEAL_EMOJI[meal.meal_type] || '🍽️'}
                            </div>

                            {/* Meal copy */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#166534]/70 dark:text-[#86EFAC]/70 leading-tight">
                                {MEAL_LABEL[meal.meal_type] || 'Meal'}
                              </p>
                              <p className="font-semibold text-sm text-[#0A1A2F] dark:text-white truncate leading-tight mt-0.5">{meal.description}</p>
                              <p className="text-[11px] text-[#0A1A2F]/50 dark:text-white/50 mt-0.5">
                                P {meal.protein || 0}g · C {meal.carbs || 0}g · F {meal.fats || 0}g
                              </p>
                            </div>

                            {/* Calories + chevron */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <div className="text-right">
                                <p className="text-base font-black text-[#166534] dark:text-[#86EFAC] leading-tight">{meal.calories || 0}</p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-[#0A1A2F]/40 dark:text-white/40">kcal</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25" />
                            </div>
                          </Link>

                          {/* Soft delete affordance — small icon button on right edge */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (isPendingDelete) {
                                deleteMeal.mutate(meal.id);
                              } else {
                                setPendingDelete(meal.id);
                                // Auto-cancel after 3s if user doesn't confirm
                                setTimeout(() => {
                                  setPendingDelete(prev => prev === meal.id ? null : prev);
                                }, 3000);
                              }
                            }}
                            disabled={deleteMeal.isPending}
                            aria-label={isPendingDelete ? `Confirm delete ${meal.description}` : `Delete ${meal.description}`}
                            className={`absolute top-1/2 -translate-y-1/2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                              isPendingDelete
                                ? 'bg-red-500 text-white scale-110 shadow-md'
                                : 'opacity-0 hover:opacity-100 focus:opacity-100 bg-red-50 dark:bg-red-900/20 text-red-500'
                            }`}
                            style={isPendingDelete ? { opacity: 1 } : undefined}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Footer hint when delete is pending */}
                  <AnimatePresence>
                    {dateMeals.some(m => m.id === pendingDelete) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 dark:bg-red-900/15 border-t border-red-200 dark:border-red-800/30 px-4 py-2 text-[11px] font-semibold text-red-600 dark:text-red-300 text-center"
                      >
                        Tap the red trash again to confirm delete
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Footer hint to add more */}
            <button
              onClick={() => setShowAddFood(true)}
              className="w-full bg-white/60 dark:bg-white/5 border-2 border-dashed border-[#22c55e]/30 hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5 dark:hover:bg-[#22c55e]/10 rounded-2xl p-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#166534] dark:text-[#86EFAC] transition-all active:scale-[0.99]"
            >
              <Utensils className="w-4 h-4" />
              Log another meal
            </button>
          </div>
        )}
      </div>

      <DetailedFoodLogModal
        isOpen={showAddFood}
        onClose={() => setShowAddFood(false)}
        onSave={(mealData) => logMeal.mutate(mealData)} />
    </div>
  );
}
