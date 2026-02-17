import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import WellnessTabBar from '@/components/wellness/WellnessTabBar';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const habits = [
  { id: 'prayer', label: 'Prayer', emoji: '🙏', description: 'Spend time in prayer' },
  { id: 'bible', label: 'Bible Reading', emoji: '📖', description: 'Read God\'s Word' },
  { id: 'gratitude', label: 'Gratitude', emoji: '✨', description: 'Count your blessings' },
  { id: 'movement', label: 'Movement', emoji: '🏃', description: 'Physical activity' },
  { id: 'water', label: 'Water Intake', emoji: '💧', description: 'Stay hydrated' },
  { id: 'rest', label: 'Rest', emoji: '😴', description: 'Get quality sleep' }
];

export default function HabitBuilderPage() {
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
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <WellnessTabBar activeTab="mind" />

      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-bold text-[#0A1A2F]">Habit Builder</h1>
          <p className="text-xs text-[#0A1A2F]/60">Track your daily habits</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-[#D9B878]" />
              <div>
                <h3 className="text-xl font-bold text-[#0A1A2F]">Today's Progress</h3>
                <p className="text-xs text-[#0A1A2F]/60">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="text-2xl font-semibold text-[#D9B878]">
              {completedHabits.length}/{habits.length}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#0A1A2F]/60">Daily Progress</span>
              <span className="text-sm font-semibold text-[#D9B878]">{completionRate}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-[#D9B878] to-[#AFC7E3]"
              />
            </div>
          </div>

          <div className="space-y-3">
            {habits.map((habit, index) => {
              const isCompleted = completedHabits.includes(habit.id);
              return (
                <motion.button
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                    isCompleted
                      ? 'border-[#D9B878] bg-[#D9B878]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{habit.emoji}</span>
                    <div className="text-left">
                      <span className={`font-semibold block ${isCompleted ? 'text-[#0A1A2F]' : 'text-[#0A1A2F]/70'}`}>
                        {habit.label}
                      </span>
                      <span className="text-xs text-[#0A1A2F]/50">{habit.description}</span>
                    </div>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7 text-[#D9B878]" />
                  ) : (
                    <Circle className="w-7 h-7 text-gray-300" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}