import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, ArrowLeft, Flame, Plus, X,
  ChevronRight, Trophy, Sparkles, Settings2, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// ─── Habit catalogue ──────────────────────────────────────────────────────────
const ALL_HABITS = [
  // Faith
  { id: 'prayer',       label: 'Prayer',           emoji: '🙏', category: 'Faith',    gradient: 'from-violet-500 to-purple-400',   color: '#7c3aed', description: 'Intentional time with God' },
  { id: 'bible',        label: 'Bible Reading',    emoji: '📖', category: 'Faith',    gradient: 'from-amber-500 to-yellow-400',    color: '#c9a227', description: "Sit with God's Word" },
  { id: 'gratitude',    label: 'Gratitude',        emoji: '✨', category: 'Faith',    gradient: 'from-[#c9a227] to-amber-400',     color: '#c9a227', description: 'Name three genuine gifts' },
  { id: 'worship',      label: 'Worship',          emoji: '🎵', category: 'Faith',    gradient: 'from-rose-500 to-pink-400',       color: '#f43f5e', description: 'Music, prayer, presence' },
  // Mindset
  { id: 'affirmations', label: 'Affirmations',     emoji: '💬', category: 'Mindset',  gradient: 'from-sky-500 to-cyan-400',        color: '#0ea5e9', description: 'Speak truth over yourself' },
  { id: 'journaling',   label: 'Journaling',       emoji: '📝', category: 'Mindset',  gradient: 'from-emerald-500 to-teal-400',    color: '#10b981', description: 'Reflect and process' },
  { id: 'meditation',   label: 'Meditation',       emoji: '🧘', category: 'Mindset',  gradient: 'from-indigo-500 to-violet-400',   color: '#6366f1', description: 'Stillness and breath' },
  { id: 'reading',      label: 'Reading',          emoji: '📚', category: 'Mindset',  gradient: 'from-blue-500 to-sky-400',        color: '#3b82f6', description: 'Feed your mind daily' },
  // Body
  { id: 'movement',     label: 'Movement',         emoji: '🏃', category: 'Body',     gradient: 'from-orange-500 to-amber-400',    color: '#f97316', description: 'Move your body' },
  { id: 'water',        label: 'Hydration',        emoji: '💧', category: 'Body',     gradient: 'from-cyan-500 to-sky-400',        color: '#06b6d4', description: '8 glasses of water' },
  { id: 'nutrition',    label: 'Clean Eating',     emoji: '🥗', category: 'Body',     gradient: 'from-lime-500 to-green-400',      color: '#84cc16', description: 'Nourish your body' },
  { id: 'rest',         label: 'Rest',             emoji: '😴', category: 'Body',     gradient: 'from-slate-500 to-gray-500',      color: '#64748b', description: 'Quality sleep' },
  // Relationships
  { id: 'connection',   label: 'Connection',       emoji: '🤝', category: 'Relationships', gradient: 'from-fuchsia-500 to-pink-400', color: '#d946ef', description: 'Reach out to someone' },
  { id: 'service',      label: 'Acts of Service',  emoji: '🫶', category: 'Relationships', gradient: 'from-red-400 to-rose-400',     color: '#f87171', description: 'One intentional act' },
];

const CATEGORIES = ['Faith', 'Mindset', 'Body', 'Relationships'];
const DEFAULT_ACTIVE = ['prayer', 'bible', 'gratitude', 'movement', 'water', 'rest'];

const ACTIVE_KEY  = 'habit_active_v1';
const HISTORY_KEY = 'habit_history_v1'; // { [date]: [habitIds] }

const TODAY = () => new Date().toISOString().split('T')[0];
const STORAGE_TODAY = () => `habits_${TODAY()}`;

function loadActive()  { try { return JSON.parse(localStorage.getItem(ACTIVE_KEY)  || JSON.stringify(DEFAULT_ACTIVE)); } catch { return DEFAULT_ACTIVE; } }
function loadHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}'); } catch { return {}; } }
function saveHistory(h) { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }

// Compute per-habit current streak from history map
function computeStreaks(history) {
  const streaks = {};
  ALL_HABITS.forEach(h => {
    let streak = 0;
    const d = new Date();
    // Start from yesterday if today not done, or today if done
    while (true) {
      const key = d.toISOString().split('T')[0];
      if ((history[key] || []).includes(h.id)) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    streaks[h.id] = streak;
  });
  return streaks;
}

// Last 7 days array for a specific habit
function getWeekData(habitId, history) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const isToday = key === TODAY();
    return {
      key,
      label: isToday ? 'Today' : ['S','M','T','W','T','F','S'][d.getDay()],
      done: (history[key] || []).includes(habitId),
      isToday,
    };
  });
}

// ─── Habit picker modal ───────────────────────────────────────────────────────
function HabitPickerModal({ activeIds, onSave, onClose }) {
  const [selected, setSelected] = useState(new Set(activeIds));

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) { if (next.size > 1) next.delete(id); }
    else next.add(id);
    setSelected(next);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[88dvh] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1A2F] to-[#1a3a5c] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-base">Choose Your Habits</h2>
            <p className="text-white/50 text-xs">{selected.size} selected · tap to toggle</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {CATEGORIES.map(cat => (
            <div key={cat}>
              <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-2">{cat}</p>
              <div className="space-y-2">
                {ALL_HABITS.filter(h => h.category === cat).map(habit => {
                  const on = selected.has(habit.id);
                  return (
                    <button key={habit.id} onClick={() => toggle(habit.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        on ? 'border-[#c9a227] bg-[#FFF9ED]' : 'border-[#E2E8F0] bg-white hover:border-[#D9B878]/40'
                      }`}>
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${habit.gradient} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-lg">{habit.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[#0A1A2F]">{habit.label}</p>
                        <p className="text-xs text-[#0A1A2F]/45 truncate">{habit.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        on ? 'bg-[#c9a227] border-[#c9a227]' : 'border-[#E2E8F0]'
                      }`}>
                        {on && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E2E8F0] px-5 py-4 flex-shrink-0">
          <button onClick={() => onSave([...selected])}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D9B878] to-[#c9a227] text-[#0A1A2F] font-bold text-sm hover:opacity-90 transition-opacity">
            Save {selected.size} Habit{selected.size !== 1 ? 's' : ''}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Week strip for a single habit ───────────────────────────────────────────
function WeekDots({ habitId, history, color }) {
  const week = getWeekData(habitId, history);
  return (
    <div className="flex items-center gap-1.5">
      {week.map(day => (
        <div key={day.key} className="flex flex-col items-center gap-0.5">
          <div
            className={`w-4 h-4 rounded-full transition-all ${day.isToday ? 'ring-2 ring-offset-1' : ''}`}
            style={{
              background: day.done ? color : '#E2E8F0',
              ringColor: color,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Single habit card ────────────────────────────────────────────────────────
function HabitCard({ habit, isDone, streak, history, onToggle, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onToggle(habit.id)}
      className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all group ${
        isDone
          ? 'border-transparent shadow-sm'
          : 'border-[#E2E8F0] bg-white hover:border-[#D9B878]/40 hover:shadow-sm'
      }`}
      style={isDone ? { background: `linear-gradient(135deg, ${habit.color}18 0%, ${habit.color}08 100%)`, borderColor: `${habit.color}40` } : {}}
    >
      {/* Color accent bar */}
      <div className="h-0.5 w-full" style={{ background: isDone ? `linear-gradient(90deg, ${habit.color}, transparent)` : 'transparent' }} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Emoji badge */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
            isDone ? `bg-gradient-to-br ${habit.gradient}` : 'bg-[#F2F6FA] group-hover:bg-[#EDF2F7]'
          }`}>
            <span className="text-xl">{habit.emoji}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className={`font-bold text-sm ${isDone ? 'text-[#0A1A2F]' : 'text-[#0A1A2F]/80'}`}>
                {habit.label}
              </span>
              {/* Check / circle */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                isDone ? '' : 'border-2 border-[#E2E8F0]'
              }`} style={isDone ? { background: habit.color } : {}}>
                {isDone && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
            <p className="text-xs text-[#0A1A2F]/40 mb-2">{habit.description}</p>

            {/* Bottom row: week dots + streak */}
            <div className="flex items-center justify-between">
              <WeekDots habitId={habit.id} history={history} color={habit.color} />
              {streak > 0 && (
                <span className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: habit.color }}>
                  <Flame className="w-3 h-3" />{streak}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Celebration overlay ──────────────────────────────────────────────────────
function AllDoneOverlay({ habits, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="w-full max-w-xs"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[#0A1A2F] to-[#1a3a5c] rounded-3xl p-8 text-white text-center shadow-2xl border border-[#D9B878]/20">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}
            transition={{ delay: 0.15, duration: 0.6, times: [0, 0.65, 1] }}
            className="text-6xl mb-4"
          >🏅</motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-[#D9B878] text-[10px] font-bold uppercase tracking-widest mb-1">All Done</p>
            <h2 className="text-xl font-bold mb-2">Every habit complete</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {habits.length} habits today. That's not nothing — that's who you're becoming.
            </p>
          </motion.div>

          {/* Habit emoji row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex justify-center gap-2 mb-6 flex-wrap">
            {habits.map(h => (
              <div key={h.id} className={`w-10 h-10 rounded-xl bg-gradient-to-br ${h.gradient} flex items-center justify-center`}>
                <span className="text-lg">{h.emoji}</span>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D9B878] to-[#c9a227] text-[#0A1A2F] font-bold text-sm"
          >
            Keep building 🌱
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HabitBuilderPage() {
  const [activeIds, setActiveIds]     = useState(loadActive);
  const [done, setDone]               = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_TODAY()) || '[]'); } catch { return []; }
  });
  const [history, setHistory]         = useState(loadHistory);
  const [entryId, setEntryId]         = useState(null);
  const [loaded, setLoaded]           = useState(false);
  const [showPicker, setShowPicker]   = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevDone, setPrevDone]       = useState(done.length);

  // Load today's + past history from API
  useEffect(() => {
    (async () => {
      try {
        const today   = TODAY();
        const entries = await base44.entities.JournalEntry.filter({ entry_type: 'habit_tracker' }, '-created_date', 60);

        // Rebuild history map from all returned entries
        const map = { ...loadHistory() };
        entries.forEach(e => {
          const d = (e.created_date || '').slice(0, 10);
          if (d && e.habits?.length) map[d] = e.habits;
        });
        saveHistory(map);
        setHistory(map);

        // Today's entry
        const todayEntry = entries.find(e => (e.created_date || '').startsWith(today));
        if (todayEntry) {
          const h = todayEntry.habits || [];
          setDone(h);
          setEntryId(todayEntry.id);
          localStorage.setItem(STORAGE_TODAY(), JSON.stringify(h));
        }
      } catch (err) {
        console.warn('Failed to sync habits:', err);
      }
      setLoaded(true);
    })();
  }, []);

  // Fire celebration when all habits done for first time
  useEffect(() => {
    const active = ALL_HABITS.filter(h => activeIds.includes(h.id));
    const allDone = active.length > 0 && active.every(h => done.includes(h.id));
    if (allDone && prevDone < active.length) {
      setShowCelebration(true);
    }
    setPrevDone(done.length);
  }, [done]);

  const toggleHabit = useCallback(async (habitId) => {
    const wasDone  = done.includes(habitId);
    const updated  = wasDone ? done.filter(id => id !== habitId) : [...done, habitId];

    setDone(updated);
    localStorage.setItem(STORAGE_TODAY(), JSON.stringify(updated));

    // Update history map
    const today  = TODAY();
    const newMap = { ...history, [today]: updated };
    setHistory(newMap);
    saveHistory(newMap);

    try {
      const payload = { entry_type: 'habit_tracker', habits: updated, content: `Habits: ${updated.join(', ')}` };
      if (entryId) {
        await base44.entities.JournalEntry.update(entryId, payload);
      } else {
        const created = await base44.entities.JournalEntry.create(payload);
        setEntryId(created.id);
      }
      if (!wasDone) {
        const habit = ALL_HABITS.find(h => h.id === habitId);
        toast.success(`${habit?.label} done ✓`, { duration: 1500 });
      }
    } catch {
      // Rollback
      setDone(done);
      localStorage.setItem(STORAGE_TODAY(), JSON.stringify(done));
      toast.error('Failed to save — try again');
    }
  }, [done, history, entryId]);

  const savePicker = (ids) => {
    setActiveIds(ids);
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(ids));
    setShowPicker(false);
    toast.success(`Tracking ${ids.length} habits`);
  };

  const activeHabits  = ALL_HABITS.filter(h => activeIds.includes(h.id));
  const streaks        = computeStreaks(history);
  const completedCount = activeHabits.filter(h => done.includes(h.id)).length;
  const totalCount     = activeHabits.length;
  const pct            = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone        = completedCount === totalCount && totalCount > 0;

  // Best overall streak (highest individual habit streak)
  const bestStreak = Math.max(0, ...activeHabits.map(h => streaks[h.id] || 0));

  // Days with at least one habit done (for overall streak)
  const overallStreak = (() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split('T')[0];
      if ((history[key] || []).length > 0) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="min-h-screen bg-[#F2F6FA] pb-28">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Link to={createPageUrl('PersonalGrowth')}
              className="w-9 h-9 rounded-full bg-[#F2F6FA] hover:bg-[#E8EFF6] flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
            </Link>
            <div className="flex-1">
              <h1 className="text-base font-bold text-[#0A1A2F]">Habit Builder</h1>
              <p className="text-xs text-[#0A1A2F]/45">{dateLabel}</p>
            </div>
            <button onClick={() => setShowPicker(true)}
              className="flex items-center gap-1.5 bg-[#F2F6FA] hover:bg-[#E8EFF6] border border-[#E2E8F0] rounded-xl px-3 py-1.5 transition-colors">
              <Settings2 className="w-3.5 h-3.5 text-[#0A1A2F]/50" />
              <span className="text-xs font-semibold text-[#0A1A2F]/60">Edit</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

          {/* ── Stats row ───────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3">
            {[
              { value: `${completedCount}/${totalCount}`, label: 'Today', sub: `${pct}% done`, color: '#c9a227' },
              { value: overallStreak, label: 'Day Streak', sub: overallStreak > 0 ? '🔥 keep going' : 'Start today', color: '#f97316' },
              { value: bestStreak, label: 'Best Habit', sub: `${bestStreak}d in a row`, color: '#7c3aed' },
            ].map(({ value, label, sub, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 text-center">
                <p className="font-bold text-xl text-[#0A1A2F]" style={typeof value === 'number' && value > 0 ? { color } : {}}>{value}</p>
                <p className="text-xs font-bold text-[#0A1A2F] mt-0.5">{label}</p>
                <p className="text-[10px] text-[#0A1A2F]/35">{sub}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Overall progress bar ─────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#0A1A2F]/50">Today's progress</p>
              <p className="text-xs font-bold text-[#c9a227]">{pct}%</p>
            </div>
            <div className="h-2 bg-[#F2F6FA] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${allDone
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                  : 'bg-gradient-to-r from-[#D9B878] to-[#c9a227]'
                }`}
              />
            </div>
            {allDone && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-xs font-bold text-emerald-500 mt-2 text-center">
                All {totalCount} habits complete today 🎉
              </motion.p>
            )}
          </motion.div>

          {/* ── Habit cards ──────────────────────────────────────────────────── */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest">
                {activeHabits.length} Habits
              </p>
              <button onClick={() => setShowPicker(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#c9a227] hover:text-[#b89320] transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add habit
              </button>
            </div>
            {activeHabits.map((habit, i) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isDone={done.includes(habit.id)}
                streak={streaks[habit.id] || 0}
                history={history}
                onToggle={toggleHabit}
                index={i}
              />
            ))}
          </div>

          {/* ── Week calendar ────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <p className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-3">Last 7 Days</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <td className="pb-2 pr-2" />
                    {getWeekData('prayer', history).map(day => (
                      <td key={day.key} className="pb-2 text-center">
                        <span className={`text-[10px] font-bold ${day.isToday ? 'text-[#c9a227]' : 'text-[#0A1A2F]/30'}`}>
                          {day.label}
                        </span>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeHabits.map(habit => (
                    <tr key={habit.id}>
                      <td className="py-1 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{habit.emoji}</span>
                          <span className="text-[11px] font-semibold text-[#0A1A2F]/60 whitespace-nowrap">{habit.label}</span>
                        </div>
                      </td>
                      {getWeekData(habit.id, history).map(day => (
                        <td key={day.key} className="py-1 text-center">
                          <div className="flex justify-center">
                            <div className={`w-5 h-5 rounded-full transition-all ${day.isToday ? 'ring-1 ring-offset-1' : ''}`}
                              style={{
                                background: day.done ? habit.color : '#F2F6FA',
                                ringColor: habit.color,
                              }} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ── Growth link ──────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to={createPageUrl('GrowthPathwaysPage')}
              className="flex items-center gap-3 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#D9B878]/40 p-4 transition-all group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D9B878] to-[#c9a227] rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#0A1A2F]" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-[#0A1A2F]">Connect to a Growth Pathway</p>
                <p className="text-xs text-[#0A1A2F]/45">Link your habits to your discipline or faith journey</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 group-hover:text-[#0A1A2F]/40 transition-colors" />
            </Link>
          </motion.div>

        </div>
      </div>

      {/* ── Picker modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPicker && (
          <HabitPickerModal activeIds={activeIds} onSave={savePicker} onClose={() => setShowPicker(false)} />
        )}
      </AnimatePresence>

      {/* ── Celebration overlay ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCelebration && (
          <AllDoneOverlay habits={activeHabits} onClose={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
