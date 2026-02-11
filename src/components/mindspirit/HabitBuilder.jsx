import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const habits = [
  { id: 'prayer', label: 'Prayer', emoji: '🙏' },
  { id: 'bible', label: 'Bible Reading', emoji: '📖' },
  { id: 'gratitude', label: 'Gratitude', emoji: '✨' },
  { id: 'movement', label: 'Movement', emoji: '🏃' },
  { id: 'water', label: 'Water Intake', emoji: '💧' },
  { id: 'rest', label: 'Rest', emoji: '😴' }
];

export default function HabitBuilder() {
  const [completedHabits, setCompletedHabits] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
    loadTodaysHabits();
  }, []);

  const loadTodaysHabits = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const entries = await base44.entities.JournalEntry.filter({
        entry_type: 'habit_tracker',
        created_date: today
      });
      if (entries.length > 0) {
        setCompletedHabits(entries[0].habits || []);
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  };

  const toggleHabit = async (habitId) => {
    const isCompleted = completedHabits.includes(habitId);
    const newCompletedHabits = isCompleted
      ? completedHabits.filter(h => h !== habitId)
      : [...completedHabits, habitId];

    setCompletedHabits(newCompletedHabits);

    try {
      const today = new Date().toISOString().split('T')[0];
      const entries = await base44.entities.JournalEntry.filter({
        entry_type: 'habit_tracker',
        created_date: today
      });

      if (entries.length > 0) {
        await base44.entities.JournalEntry.update(entries[0].id, {
          habits: newCompletedHabits
        });
      } else {
        await base44.entities.JournalEntry.create({
          entry_type: 'habit_tracker',
          habits: newCompletedHabits,
          content: `Habits tracked: ${newCompletedHabits.join(', ')}`
        });
      }

      if (!isCompleted) {
        toast.success(`${habits.find(h => h.id === habitId).label} completed! 🎉`);
      }
    } catch (error) {
      toast.error('Failed to update habit');
      setCompletedHabits(completedHabits);
    }
  };

  const completionRate = Math.round((completedHabits.length / habits.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#D9B878]" />
          <h3 className="text-lg font-bold text-[#0A1A2F]">Habit Builder</h3>
        </div>
        <div className="text-sm font-semibold text-[#D9B878]">
          {completedHabits.length}/{habits.length}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#0A1A2F]/60">Daily Progress</span>
          <span className="text-xs font-semibold text-[#D9B878]">{completionRate}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            className="h-full bg-[#D9B878]"
          />
        </div>
      </div>

      <div className="space-y-2">
        {habits.map((habit, index) => {
          const isCompleted = completedHabits.includes(habit.id);
          return (
            <motion.button
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleHabit(habit.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                isCompleted
                  ? 'border-[#D9B878] bg-[#D9B878]/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{habit.emoji}</span>
                <span className={`font-medium ${isCompleted ? 'text-[#0A1A2F]' : 'text-[#0A1A2F]/70'}`}>
                  {habit.label}
                </span>
              </div>
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-[#D9B878]" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}