import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const habits = [
  { id: 'prayer',    label: 'Prayer',        emoji: '🙏', description: 'Spend time in prayer' },
  { id: 'bible',     label: 'Bible Reading',  emoji: '📖', description: "Read God's Word" },
  { id: 'gratitude', label: 'Gratitude',      emoji: '✨', description: 'Count your blessings' },
  { id: 'movement',  label: 'Movement',       emoji: '🏃', description: 'Physical activity' },
  { id: 'water',     label: 'Water Intake',   emoji: '💧', description: 'Stay hydrated' },
  { id: 'rest',      label: 'Rest',           emoji: '😴', description: 'Get quality sleep' },
];

const TODAY_KEY = () => `habits_${new Date().toISOString().split('T')[0]}`;

export default function HabitBuilderPage() {
  const [completedHabits, setCompletedHabits] = useState([]);
  const [entryId, setEntryId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { loadTodaysHabits(); }, []);

  const loadTodaysHabits = async () => {
    // 1. Try localStorage first for instant load
    const cached = localStorage.getItem(TODAY_KEY());
    if (cached) {
      try { setCompletedHabits(JSON.parse(cached)); } catch {}
    }
    // 2. Load all habit entries and find today's
    try {
      const today = new Date().toISOString().split('T')[0];
      const entries = await base44.entities.JournalEntry.filter({ entry_type: 'habit_tracker' }, '-created_date', 50);
      const todayEntry = entries.find(e => (e.created_date || '').startsWith(today));
      if (todayEntry) {
        const h = todayEntry.habits || [];
        setCompletedHabits(h);
        setEntryId(todayEntry.id);
        localStorage.setItem(TODAY_KEY(), JSON.stringify(h));
      }
    } catch (err) {
      console.error('Failed to load habits:', err);
    }
    setLoaded(true);
  };

  const toggleHabit = async (habitId) => {
    const isCompleted = completedHabits.includes(habitId);
    const updated = isCompleted
      ? completedHabits.filter(h => h !== habitId)
      : [...completedHabits, habitId];

    setCompletedHabits(updated);
    localStorage.setItem(TODAY_KEY(), JSON.stringify(updated));

    try {
      if (entryId) {
        await base44.entities.JournalEntry.update(entryId, {
          habits: updated,
          content: `Habits tracked: ${updated.join(', ')}`
        });
      } else {
        const created = await base44.entities.JournalEntry.create({
          entry_type: 'habit_tracker',
          habits: updated,
          content: `Habits tracked: ${updated.join(', ')}`
        });
        setEntryId(created.id);
      }
      if (!isCompleted) {
        toast.success(`${habits.find(h => h.id === habitId)?.label} completed! 🎉`);
      }
    } catch {
      toast.error('Failed to update habit');
      setCompletedHabits(completedHabits);
      localStorage.setItem(TODAY_KEY(), JSON.stringify(completedHabits));
    }
  };

  const completionRate = Math.round((completedHabits.length / habits.length) * 100);
  const allDone = completedHabits.length === habits.length;

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      <div className="sticky top-0 z-40 bg-white border-b border-[#AFC7E3]/20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('PersonalGrowth')}
            className="w-9 h-9 rounded-full bg-[#AFC7E3]/20 hover:bg-[#AFC7E3]/30 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Habit Builder</h1>
            <p className="text-xs text-[#0A1A2F]/60">Small steps, lasting change</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#AFC7E3]/20 to-[#3C4E53]/10 rounded-2xl p-5 border border-[#AFC7E3]/25 mb-5"
        >
          <p className="text-sm text-[#0A1A2F]/75 leading-relaxed">
            Consistency is the seed of transformation. Check off each habit as you complete it — your streak builds character. 🌱
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-[#AFC7E3]/20 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-[#AFC7E3]" />
              <div>
                <h3 className="text-lg font-bold text-[#0A1A2F]">Today's Habits</h3>
                <p className="text-xs text-[#0A1A2F]/60">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className={`text-xl font-bold ${allDone ? 'text-[#AFC7E3]' : 'text-[#0A1A2F]/60'}`}>
              {completedHabits.length}/{habits.length}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#0A1A2F]/50 mb-2">
              <span>Daily progress</span>
              <span className="font-semibold text-[#AFC7E3]">{completionRate}%</span>
            </div>
            <div className="h-2.5 bg-[#AFC7E3]/15 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53] rounded-full"
              />
            </div>
          </div>

          {/* All done banner */}
          {allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-[#AFC7E3]/20 to-[#3C4E53]/10 rounded-xl p-4 mb-5 text-center border border-[#AFC7E3]/30"
            >
              <p className="text-lg">🎉</p>
              <p className="font-bold text-[#0A1A2F] text-sm">All habits complete today!</p>
              <p className="text-xs text-[#0A1A2F]/60 mt-0.5">You're building something lasting. Keep going.</p>
            </motion.div>
          )}

          {/* Habit list */}
          <div className="space-y-3">
            {habits.map((habit, index) => {
              const isCompleted = completedHabits.includes(habit.id);
              return (
                <motion.button
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: loaded ? 0 : index * 0.05 }}
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                    isCompleted
                      ? 'border-[#AFC7E3] bg-[#AFC7E3]/10'
                      : 'border-[#AFC7E3]/20 hover:border-[#AFC7E3]/50 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.emoji}</span>
                    <div>
                      <span className={`font-semibold block text-sm ${isCompleted ? 'text-[#0A1A2F]' : 'text-[#0A1A2F]/70'}`}>
                        {habit.label}
                      </span>
                      <span className="text-xs text-[#0A1A2F]/50">{habit.description}</span>
                    </div>
                  </div>
                  {isCompleted
                    ? <CheckCircle2 className="w-6 h-6 text-[#AFC7E3] flex-shrink-0" />
                    : <Circle className="w-6 h-6 text-[#AFC7E3]/30 flex-shrink-0" />
                  }
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
