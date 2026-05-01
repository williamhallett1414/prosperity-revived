import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Utensils, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🌅', time: '7:00 AM' },
  { id: 'lunch', label: 'Lunch', emoji: '🍽️', time: '12:00 PM' },
  { id: 'dinner', emoji: '🍽️', label: 'Dinner', time: '7:00 PM' },
];

export default function MealLoggingSection({ nutritionPlan, mealLogs, onMealLogged, date = new Date() }) {
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [loggedMeals, setLoggedMeals] = useState({});
  const [isLogging, setIsLogging] = useState(false);
  // Optimistic set of meal types logged this session
  const [optimisticLogged, setOptimisticLogged] = useState(new Set());

  // Parse meal suggestions from nutrition plan
  const parseMeals = (planText) => {
    if (!planText) return {};
    const meals = {};
    const lines = planText.split('\n');
    
    MEAL_TYPES.forEach(mealType => {
      const line = lines.find(l => l.toLowerCase().startsWith(mealType.label.toLowerCase()));
      if (line) {
        meals[mealType.id] = line.replace(new RegExp(`^${mealType.label}:\\s*`), '');
      }
    });
    
    return meals;
  };

  const mealSuggestions = parseMeals(nutritionPlan);

  // Check if meal was logged today (server data OR optimistic)
  const isMealLogged = (mealType) => {
    if (optimisticLogged.has(mealType)) return true;
    const dateStr = date.toISOString().split('T')[0];
    return mealLogs?.some(log => 
      log.date === dateStr && log.meal_type === mealType
    );
  };

  const handleOpenMealLog = (mealType) => {
    setSelectedMealType(mealType);
    setShowLogModal(true);
    setLoggedMeals({});
  };

  const handleLogMeal = async (e) => {
    e.preventDefault();
    if (!selectedMealType || !loggedMeals.description) return;

    const mealTypeToLog = selectedMealType;

    // Optimistic update — mark as logged immediately
    setOptimisticLogged(prev => new Set([...prev, mealTypeToLog]));
    setShowLogModal(false);
    setSelectedMealType(null);
    setLoggedMeals({});

    setIsLogging(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      await base44.entities.MealLog.create({
        date: dateStr,
        meal_type: mealTypeToLog,
        description: loggedMeals.description,
        calories: loggedMeals.calories ? parseInt(loggedMeals.calories) : undefined,
        notes: loggedMeals.notes,
      });
      onMealLogged?.(mealTypeToLog);
    } catch {
      // Rollback optimistic update on failure
      setOptimisticLogged(prev => {
        const next = new Set(prev);
        next.delete(mealTypeToLog);
        return next;
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {MEAL_TYPES.map((meal, idx) => {
          const suggestion = mealSuggestions[meal.id];
          const isLogged = isMealLogged(meal.id);

          return (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-white/5 rounded-xl border border-[#3C4E53]/30/12 p-3 hover:border-[#3C4E53]/30/25 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FD9C2D] to-[#E89020] flex items-center justify-center text-lg flex-shrink-0">
                  {meal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">{meal.label}</p>
                    <span className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">{meal.time}</span>
                  </div>
                  {suggestion && (
                    <p className="text-xs text-[#0A1A2F]/65 dark:text-white/65 leading-relaxed">{suggestion}</p>
                  )}
                </div>
                <Button
                  onClick={() => handleOpenMealLog(meal.id)}
                  size="sm"
                  variant={isLogged ? 'default' : 'outline'}
                  className={`flex-shrink-0 text-xs font-bold py-1.5 px-2.5 rounded-lg transition-all ${
                    isLogged
                      ? 'bg-[#3C4E53] text-white border-[#3C4E53]/30'
                      : 'border border-[#3C4E53]/30/20 text-[#3C4E53] hover:border-[#3C4E53]/30/40'
                  }`}
                >
                  {isLogged ? (
                    <>
                      <Check className="w-3 h-3 mr-1" /> Logged
                    </>
                  ) : (
                    <>
                      <Utensils className="w-3 h-3 mr-1" /> Log
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Meal Log Modal */}
      <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Log {MEAL_TYPES.find(m => m.id === selectedMealType)?.label}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleLogMeal} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0A1A2F] dark:text-white block mb-2">
                What did you eat?
              </label>
              <Textarea
                placeholder="e.g., Grilled chicken, broccoli, brown rice"
                value={loggedMeals.description || ''}
                onChange={(e) => setLoggedMeals({...loggedMeals, description: e.target.value})}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#0A1A2F] dark:text-white block mb-2">
                  Calories (optional)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 450"
                  value={loggedMeals.calories || ''}
                  onChange={(e) => setLoggedMeals({...loggedMeals, calories: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0A1A2F] dark:text-white block mb-2">
                Notes (optional)
              </label>
              <Textarea
                placeholder="How did you feel? Any observations?"
                value={loggedMeals.notes || ''}
                onChange={(e) => setLoggedMeals({...loggedMeals, notes: e.target.value})}
                className="resize-none h-20"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={!loggedMeals.description || isLogging}
                className="flex-1 bg-[#3C4E53] hover:bg-[#3C4E53]/90 text-white font-bold"
              >
                {isLogging ? 'Logging...' : 'Log Meal'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLogModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}