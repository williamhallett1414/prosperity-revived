import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, UtensilsCrossed, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MEAL_TYPES = [
  { value: 'breakfast', label: '🌅 Breakfast' },
  { value: 'lunch',     label: '☀️ Lunch'     },
  { value: 'dinner',    label: '🌙 Dinner'    },
  { value: 'snack',     label: '🍎 Snack'     },
];

export default function LogMealModal({ recipe, isOpen, onClose }) {
  const today     = new Date().toISOString().split('T')[0];
  const suggested = (() => {
    const h = new Date().getHours();
    if (h < 10) return 'breakfast';
    if (h < 14) return 'lunch';
    if (h < 18) return 'snack';
    return 'dinner';
  })();

  const [mealType,  setMealType]  = useState(suggested);
  const [servings,  setServings]  = useState(1);
  const [notes,     setNotes]     = useState('');
  const queryClient = useQueryClient();

  const scale = (val) => val ? Math.round(val * servings) : undefined;

  const logMeal = useMutation({
    mutationFn: (data) => base44.entities.MealLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mealLogs']);
      queryClient.invalidateQueries(['meals']);
      toast.success(`${recipe.title} logged to ${mealType}!`);
      onClose();
    },
    onError: () => toast.error('Failed to log meal'),
  });

  const handleLog = () => {
    logMeal.mutate({
      date:        today,
      meal_type:   mealType,
      description: recipe.title,
      calories:    scale(recipe.calories),
      protein:     scale(recipe.protein),
      carbs:       scale(recipe.carbs),
      fats:        scale(recipe.fat),
      fiber:       scale(recipe.fiber),
      sodium:      scale(recipe.sodium),
      serving_size: recipe.serving_size || `${servings} serving${servings !== 1 ? 's' : ''}`,
      notes:       notes || `From recipe: ${recipe.title}`,
    });
  };

  if (!recipe) return null;

  const macros = [
    { label: 'Cal',     value: scale(recipe.calories), unit: ''   },
    { label: 'Protein', value: scale(recipe.protein),  unit: 'g'  },
    { label: 'Carbs',   value: scale(recipe.carbs),    unit: 'g'  },
    { label: 'Fat',     value: scale(recipe.fat),      unit: 'g'  },
  ].filter(m => m.value);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 z-50" />

          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-w-lg mx-auto"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#D9B878]/40" />
            </div>

            <div className="px-5 py-4 space-y-5 pb-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0A1A2F] text-base">Log to Food Diary</p>
                  <p className="text-xs text-[#0A1A2F]/45 mt-0.5 line-clamp-1">{recipe.title}</p>
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#F2F6FA] flex items-center justify-center text-[#0A1A2F]/40 hover:bg-[#FAD98D]/20">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Meal type */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">Meal Type</p>
                <div className="grid grid-cols-4 gap-2">
                  {MEAL_TYPES.map(({ value, label }) => (
                    <button key={value} onClick={() => setMealType(value)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        mealType === value
                          ? 'bg-gradient-to-b from-[#c9a227] to-[#D9B878] text-white shadow-sm'
                          : 'bg-[#F2F6FA] text-[#0A1A2F]/50 hover:bg-[#FAD98D]/15'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Servings */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">Servings</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setServings(s => Math.max(0.5, s - 0.5))}
                    className="w-9 h-9 rounded-full bg-[#F2F6FA] font-bold text-[#0A1A2F]/60 hover:bg-[#FAD98D]/20 text-lg flex items-center justify-center">−</button>
                  <span className="flex-1 text-center font-bold text-[#0A1A2F] text-lg">
                    {servings}{recipe.serving_size ? ` × ${recipe.serving_size}` : ` serving${servings !== 1 ? 's' : ''}`}
                  </span>
                  <button onClick={() => setServings(s => s + 0.5)}
                    className="w-9 h-9 rounded-full bg-[#F2F6FA] font-bold text-[#0A1A2F]/60 hover:bg-[#FAD98D]/20 text-lg flex items-center justify-center">+</button>
                </div>
              </div>

              {/* Macro preview */}
              {macros.length > 0 && (
                <div className="bg-[#F2F6FA] rounded-2xl p-3 flex gap-2">
                  {macros.map(({ label, value, unit }) => (
                    <div key={label} className="flex-1 text-center">
                      <p className="font-bold text-[#0A1A2F] text-sm">{value}{unit}</p>
                      <p className="text-[9px] font-bold text-[#0A1A2F]/35 uppercase">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div>
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-1.5">Notes (optional)</p>
                <input value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="How did it taste?"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D9B878]/25 bg-[#F2F6FA] text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/30 focus:outline-none focus:border-[#c9a227]/50" />
              </div>

              {/* Submit */}
              <button onClick={handleLog} disabled={logMeal.isPending}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2">
                {logMeal.isPending
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Logging…</>
                  : <><UtensilsCrossed className="w-4 h-4" /> Log to {MEAL_TYPES.find(m => m.value === mealType)?.label}</>
                }
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
