import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flame, Plus, X,
  ChevronRight, Sparkles, Settings2, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { localDateKey, todayKey } from '@/utils/localDate';
import { toast } from 'sonner';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';

// ─── Habit catalogue ──────────────────────────────────────────────────────────
const PRESET_HABITS = [
  // Faith
  { id: 'prayer',       label: 'Prayer',          emoji: '🙏', category: 'Faith',         gradient: 'from-violet-500 to-purple-400',  color: '#8B5CF6', description: 'Intentional time with God' },
  { id: 'bible',        label: 'Bible Reading',   emoji: '📖', category: 'Faith',         gradient: 'from-amber-500 to-yellow-400',   color: '#c9a227', description: "Sit with God's Word" },
  { id: 'gratitude',    label: 'Gratitude',       emoji: '✨', category: 'Faith',         gradient: 'from-[#c9a227] to-amber-400',    color: '#c9a227', description: 'Name three genuine gifts' },
  { id: 'worship',      label: 'Worship',         emoji: '🎵', category: 'Faith',         gradient: 'from-rose-500 to-pink-400',      color: '#f43f5e', description: 'Music, prayer, presence' },
  // Mindset
  { id: 'affirmations', label: 'Affirmations',    emoji: '💬', category: 'Mindset',       gradient: 'from-sky-500 to-cyan-400',       color: '#0ea5e9', description: 'Speak truth over yourself' },
  { id: 'journaling',   label: 'Journaling',      emoji: '📝', category: 'Mindset',       gradient: 'from-emerald-500 to-teal-400',   color: '#10b981', description: 'Reflect and process' },
  { id: 'meditation',   label: 'Meditation',      emoji: '🧘', category: 'Mindset',       gradient: 'from-indigo-500 to-violet-400',  color: '#6366f1', description: 'Stillness and breath' },
  { id: 'reading',      label: 'Reading',         emoji: '📚', category: 'Mindset',       gradient: 'from-blue-500 to-sky-400',       color: '#3b82f6', description: 'Feed your mind daily' },
  // Body
  { id: 'movement',     label: 'Movement',        emoji: '🏃', category: 'Body',          gradient: 'from-orange-500 to-amber-400',   color: '#f97316', description: 'Move your body' },
  { id: 'water',        label: 'Hydration',       emoji: '💧', category: 'Body',          gradient: 'from-cyan-500 to-sky-400',       color: '#06b6d4', description: '8 glasses of water' },
  { id: 'nutrition',    label: 'Clean Eating',    emoji: '🥗', category: 'Body',          gradient: 'from-lime-500 to-green-400',     color: '#84cc16', description: 'Nourish your body' },
  { id: 'rest',         label: 'Rest',            emoji: '😴', category: 'Body',          gradient: 'from-slate-500 to-gray-400',     color: '#64748b', description: 'Quality sleep' },
  // Relationships
  { id: 'connection',   label: 'Connection',      emoji: '🤝', category: 'Relationships', gradient: 'from-fuchsia-500 to-pink-400',   color: '#d946ef', description: 'Reach out to someone' },
  { id: 'service',      label: 'Acts of Service', emoji: '🫶', category: 'Relationships', gradient: 'from-red-400 to-rose-400',       color: '#f87171', description: 'One intentional act' },
];

const CUSTOM_EMOJI_OPTIONS = ['⭐','🎯','🌱','🏋️','🍎','☕','🎨','🎸','💡','🌍','🔑','📿','🕯️','🌊','🦋'];
const CATEGORY_COLORS = { Faith: '#8B5CF6', Mindset: '#0ea5e9', Body: '#f97316', Relationships: '#d946ef', Custom: '#10b981' };

const CATEGORIES    = ['All', 'Faith', 'Mindset', 'Body', 'Relationships'];
const DEFAULT_ACTIVE = ['prayer', 'bible', 'gratitude', 'movement', 'water', 'rest'];
const MILESTONES     = [7, 14, 21, 30, 60, 100];

const ACTIVE_KEY  = 'habit_active_v1';
const HISTORY_KEY = 'habit_history_v1';
const CUSTOM_KEY  = 'habit_custom_v1';
const MILESTONE_KEY = 'habit_milestones_seen_v1';

const TODAY = () => todayKey();
const STORAGE_TODAY = () => `habits_${TODAY()}`;

function loadActive()    { try { return JSON.parse(localStorage.getItem(ACTIVE_KEY)  || JSON.stringify(DEFAULT_ACTIVE)); } catch { return DEFAULT_ACTIVE; } }
function loadHistory()   { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}'); } catch { return {}; } }
function loadCustom()    { try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)  || '[]'); } catch { return []; } }
function saveHistory(h)  { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }
function loadSeenMilestones() { try { return JSON.parse(localStorage.getItem(MILESTONE_KEY) || '{}'); } catch { return {}; } }

function getAllHabits()  { return [...PRESET_HABITS, ...loadCustom()]; }

function computeStreaks(history, habitIds) {
  const streaks = {};
  habitIds.forEach(id => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = localDateKey(d);
      if ((history[key] || []).includes(id)) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    streaks[id] = streak;
  });
  return streaks;
}

function getWeekData(habitId, history) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = localDateKey(d);
    const isToday = key === TODAY();
    return { key, label: isToday ? '·' : ['S','M','T','W','T','F','S'][d.getDay()], done: (history[key] || []).includes(habitId), isToday };
  });
}

// 30-day heatmap data: each day → fraction of active habits done
function getHeatmapData(activeIds, history) {
  return Array.from({ length: 35 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (34 - i));
    const key = localDateKey(d);
    const isToday = key === TODAY();
    const isFuture = key > TODAY();
    const done = (history[key] || []).filter(id => activeIds.includes(id)).length;
    const total = activeIds.length;
    return { key, done, total, frac: total > 0 && !isFuture ? done / total : 0, isToday, isFuture, dayOfWeek: d.getDay() };
  });
}

// ─── Milestone modal ──────────────────────────────────────────────────────────
function MilestoneModal({ habitLabel, days, onClose, user }) {
  useEffect(() => { const t = setTimeout(onClose, 6000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="w-full max-w-xs" onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] rounded-3xl p-8 text-white text-center border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 shadow-2xl">
          <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ delay: 0.15, duration: 0.7, times: [0, 0.6, 1] }}
            className="text-6xl mb-4">🔥</motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-[#FAD98D] text-[10px] font-bold uppercase tracking-widest mb-1">{days}-Day Streak</p>
            <h2 className="text-xl font-bold mb-2">{habitLabel}</h2>
            <p className="text-white/55 text-sm leading-relaxed mb-6">
              {days} days in a row. Small daily actions become the person you're becoming.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex justify-center mb-3">
            <ShareToFeedButton
              type="habit_streak"
              title={`${days}-day streak — ${habitLabel}! 🔥`}
              content={`Just hit a ${days}-day streak on my ${habitLabel} habit on Prosperity Revived. Small daily actions compound into who you're becoming. Keep going! 🙏`}
              source="Hannah"
              label="Share to Community"
              color="#FD9C2D"
              user={user}
            />
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm">
            Keep the streak alive 💪
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── All-done celebration ─────────────────────────────────────────────────────
function AllDoneOverlay({ habits, onClose, user }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="w-full max-w-xs" onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] rounded-3xl p-8 text-white text-center border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 shadow-2xl">
          <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.15, duration: 0.6, times: [0, 0.65, 1] }}
            className="text-6xl mb-4">🏅</motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-[#FAD98D] text-[10px] font-bold uppercase tracking-widest mb-1">Perfect Day</p>
            <h2 className="text-xl font-bold mb-2">Every habit complete</h2>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              {habits.length} habits today. That's not nothing — that's who you're becoming.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex justify-center gap-2 mb-5 flex-wrap">
            {habits.map(h => (
              <div key={h.id} className={`w-10 h-10 rounded-xl bg-gradient-to-br ${h.gradient} flex items-center justify-center`}>
                <span className="text-lg">{h.emoji}</span>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="flex justify-center mb-3">
            <ShareToFeedButton
              type="habit_streak"
              title={`Perfect habit day — all ${habits.length} habits complete! 🏅`}
              content={`Just finished every single habit for today on Prosperity Revived. ${habits.length} habits, done. That's not nothing — that's who I'm becoming. 🌱`}
              source="Hannah"
              label="Share this win"
              color="#c9a227"
              user={user}
            />
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm">
            Keep building 🌱
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Custom habit creator inside picker ──────────────────────────────────────
function CustomHabitForm({ onAdd }) {
  const [name, setName]   = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [cat, setCat]     = useState('Custom');
  const [open, setOpen]   = useState(false);

  const handle = () => {
    if (!name.trim()) return;
    const id = `custom_${Date.now()}`;
    onAdd({ id, label: name.trim(), emoji, category: cat, gradient: 'from-emerald-500 to-teal-400', color: '#10b981', description: 'Custom habit', custom: true });
    setName(''); setEmoji('⭐'); setCat('Custom'); setOpen(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="w-full flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-[#F2F6FA] hover:border-[#FAD98D]/50 dark:border-[#FAD98D]/20 text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#c9a227] transition-all">
      <Plus className="w-4 h-4" />
      <span className="text-sm font-semibold">Create custom habit</span>
    </button>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="border-2 border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 rounded-xl p-4 bg-white dark:bg-white/5 space-y-3">
      <p className="text-xs font-bold text-[#c9a227] uppercase tracking-widest">New Custom Habit</p>

      {/* Emoji picker */}
      <div className="flex flex-wrap gap-2">
        {CUSTOM_EMOJI_OPTIONS.map(e => (
          <button key={e} onClick={() => setEmoji(e)}
            className={`w-9 h-9 rounded-xl text-xl transition-all ${emoji === e ? 'bg-[#FAD98D] scale-110' : 'bg-white dark:bg-white/5 hover:bg-[#F2F6FA] dark:bg-[#0A1A2F]'}`}>
            {e}
          </button>
        ))}
      </div>

      {/* Name */}
      <input
        value={name} onChange={e => setName(e.target.value)}
        placeholder="e.g. Cold shower, Walk outside…"
        className="w-full px-3 py-2.5 rounded-xl border border-[#F2F6FA] text-sm text-[#0A1A2F] dark:text-white bg-white dark:bg-white/5 focus:outline-none focus:border-[#FAD98D]/60"
        onKeyDown={e => e.key === 'Enter' && handle()}
      />

      {/* Category */}
      <div className="flex gap-2 flex-wrap">
        {['Faith','Mindset','Body','Relationships','Custom'].map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${cat === c ? 'bg-[#0A1A2F] text-white' : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border border-[#F2F6FA]'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setOpen(false)} className="flex-1 py-2 rounded-xl text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 bg-white dark:bg-white/5 border border-[#F2F6FA]">Cancel</button>
        <button onClick={handle} disabled={!name.trim()}
          className="flex-1 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white disabled:opacity-40">
          Add Habit →
        </button>
      </div>
    </motion.div>
  );
}

// ─── Habit picker modal ───────────────────────────────────────────────────────
function HabitPickerModal({ activeIds, onSave, onClose }) {
  const [selected, setSelected] = useState(new Set(activeIds));
  const [customs, setCustoms]   = useState(loadCustom);

  const allHabits = [...PRESET_HABITS, ...customs];

  const toggle = id => {
    const next = new Set(selected);
    if (next.has(id)) { if (next.size > 1) next.delete(id); }
    else next.add(id);
    setSelected(next);
  };

  const addCustom = habit => {
    const updated = [...customs, habit];
    setCustoms(updated);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(updated));
    setSelected(prev => new Set([...prev, habit.id]));
  };

  const removeCustom = id => {
    const updated = customs.filter(c => c.id !== id);
    setCustoms(updated);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(updated));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const cats = [...CATEGORIES.slice(1), ...(customs.length > 0 ? ['Custom'] : [])];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="bg-white dark:bg-white/5 w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1A2F] to-[#0A1A2F] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
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
          {cats.map(cat => {
            const habits = allHabits.filter(h => h.category === cat);
            if (habits.length === 0 && cat !== 'Custom') return null;
            return (
              <div key={cat}>
                <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-2">{cat}</p>
                <div className="space-y-2">
                  {habits.map(habit => {
                    const on = selected.has(habit.id);
                    return (
                      <div key={habit.id} className="relative">
                        <button onClick={() => toggle(habit.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${on ? 'border-[#c9a227] bg-white dark:bg-white/5' : 'border-[#F2F6FA] bg-white dark:bg-white/5 hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8'}`}>
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${habit.gradient} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-lg">{habit.emoji}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#0A1A2F] dark:text-white dark:text-white">{habit.label}</p>
                            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 truncate">{habit.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${on ? 'bg-[#c9a227] border-[#c9a227]' : 'border-[#F2F6FA]'}`}>
                            {on && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </button>
                        {habit.custom && (
                          <button onClick={() => removeCustom(habit.id)}
                            className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/25 flex items-center justify-center text-red-400 hover:bg-red-200 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Custom creator */}
          <div>
            <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-2">Create Your Own</p>
            <CustomHabitForm onAdd={addCustom} />
          </div>
        </div>

        <div className="border-t border-[#F2F6FA] px-5 py-4 flex-shrink-0">
          <button onClick={() => onSave([...selected])}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm hover:opacity-90 transition-opacity">
            Save {selected.size} Habit{selected.size !== 1 ? 's' : ''}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── 30-day heatmap ───────────────────────────────────────────────────────────
function MonthHeatmap({ activeIds, history }) {
  const cells = getHeatmapData(activeIds, history);
  // day-of-week header
  const dayLabels = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const colorForFrac = (frac, isToday, isFuture) => {
    if (isFuture) return 'bg-transparent';
    if (frac === 0) return 'bg-white dark:bg-white/5';
    if (frac <= 0.33) return 'bg-[#AFC7E3]';
    if (frac <= 0.66) return 'bg-[#FAD98D]';
    return 'bg-[#c9a227]';
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest">35-Day History</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-white dark:bg-white/5" />
            <span className="text-[9px] text-[#0A1A2F]/35 dark:text-white/35">None</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#AFC7E3]" />
            <span className="text-[9px] text-[#0A1A2F]/35 dark:text-white/35">Some</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#c9a227]" />
            <span className="text-[9px] text-[#0A1A2F]/35 dark:text-white/35">All</span>
          </div>
        </div>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map(d => (
          <div key={d} className="text-center text-[9px] font-bold text-[#0A1A2F]/25 dark:text-white/25">{d}</div>
        ))}
      </div>

      {/* Grid — 5 weeks × 7 days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Pad start so week starts on correct day */}
        {Array.from({ length: cells[0].dayOfWeek }, (_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        {cells.map(cell => (
          <motion.div
            key={cell.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.01 }}
            title={`${cell.key}: ${cell.done}/${cell.total} habits`}
            className={`aspect-square rounded-md transition-all ${colorForFrac(cell.frac, cell.isToday, cell.isFuture)} ${cell.isToday ? 'ring-2 ring-[#c9a227] ring-offset-1' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Single habit card ────────────────────────────────────────────────────────
function HabitCard({ habit, isDone, streak, history, onToggle, index, user }) {
  const week = getWeekData(habit.id, history);

  // milestone label
  const nextMilestone = MILESTONES.find(m => m > streak);
  const daysToNext = nextMilestone ? nextMilestone - streak : null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onToggle(habit.id)}
      className={`w-full text-left rounded-2xl overflow-hidden transition-all group ${
        isDone
          ? 'shadow-sm dark:shadow-none'
          : 'bg-white dark:bg-white/5 border border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 hover:shadow-sm dark:shadow-none'
      }`}
      style={isDone ? { background: `linear-gradient(135deg, ${habit.color}22 0%, ${habit.color}0d 100%)`, border: `2px solid ${habit.color}35` } : {}}
    >
      {/* Colored top accent when done */}
      <div className={`h-0.5 w-full transition-all ${isDone ? '' : 'opacity-0'}`}
        style={isDone ? { background: `linear-gradient(90deg, ${habit.color}90, transparent)` } : {}} />

      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Emoji icon */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
            isDone ? `bg-gradient-to-br ${habit.gradient} shadow-sm dark:shadow-none` : 'bg-[#F2F6FA] dark:bg-[#0A1A2F] group-hover:bg-white dark:bg-white/5'
          }`}>
            <span className="text-xl">{habit.emoji}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className={`font-bold text-sm leading-tight ${isDone ? 'text-[#0A1A2F] dark:text-white dark:text-white' : 'text-[#0A1A2F]/80 dark:text-white/80'}`}>
                {habit.label}
              </span>
              {/* Checkmark */}
              <motion.div
                animate={isDone ? { scale: [1.2, 1] } : { scale: 1 }}
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isDone ? '' : 'border-2 border-[#F2F6FA]'
                }`}
                style={isDone ? { background: habit.color } : {}}
              >
                {isDone && <Check className="w-3.5 h-3.5 text-white" />}
              </motion.div>
            </div>

            {/* Streak + description row */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40 truncate">{habit.description}</p>
              {streak > 0 ? (
                <span className="text-[10px] font-bold flex items-center gap-0.5 flex-shrink-0 ml-2" style={{ color: habit.color }}>
                  <Flame className="w-3 h-3" />{streak}
                </span>
              ) : !isDone && Object.values(history).some(arr => arr?.includes(habit.id)) ? (
                <span className="text-[10px] font-medium text-[#c9a227] flex-shrink-0 ml-2">
                  🕊️ Grace day
                </span>
              ) : null}
            </div>

            {/* Week dots */}
            <div className="flex items-center gap-1.5">
              {week.map(day => (
                <div key={day.key} className="flex flex-col items-center gap-0.5">
                  <div className={`w-4 h-4 rounded-full transition-all ${day.isToday ? 'ring-2 ring-offset-1' : ''}`}
                    style={{
                      background: day.done ? habit.color : '#E8EFF6',
                      ...(day.isToday ? { '--tw-ring-color': habit.color } : {}),
                    }} />
                </div>
              ))}
              {daysToNext && daysToNext <= 5 && (
                <span className="text-[9px] font-bold ml-1" style={{ color: habit.color }}>
                  {daysToNext}d to {nextMilestone}🔥
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

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

function HabitBuilderPageInner() {
  const [activeIds, setActiveIds]   = useState(loadActive);
  const [done, setDone]             = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_TODAY()) || '[]'); } catch { return []; }
  });
  const [history, setHistory]       = useState(loadHistory);
  const [entryId, setEntryId]       = useState(null);
  const [loaded, setLoaded]         = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const [showCelebration, setShowCelebration] = useState(false);
  const [milestone, setMilestone]   = useState(null); // { habitLabel, days }
  const [category, setCategory]     = useState('All');
  const prevDoneRef                 = useRef(done.length);

  const allHabits = getAllHabits();

  useEffect(() => {
    (async () => {
      try {
        const today   = TODAY();
        const entries = await base44.entities.JournalEntry.filter({ entry_type: 'habit_tracker' }, '-created_date', 60);
        const map = { ...loadHistory() };
        entries.forEach(e => { const d = (e.created_date || '').slice(0,10); if (d && e.habits?.length) map[d] = e.habits; });
        saveHistory(map); setHistory(map);
        const todayEntry = entries.find(e => (e.created_date || '').startsWith(today));
        if (todayEntry) { const h = todayEntry.habits || []; setDone(h); setEntryId(todayEntry.id); localStorage.setItem(STORAGE_TODAY(), JSON.stringify(h)); }
      } catch { /* use localStorage */ }
      setLoaded(true);
    })();
  }, []);

  // Celebrations + milestone checks
  useEffect(() => {
    const active = allHabits.filter(h => activeIds.includes(h.id));
    const allDoneNow = active.length > 0 && active.every(h => done.includes(h.id));
    if (allDoneNow && prevDoneRef.current < active.length) setShowCelebration(true);
    prevDoneRef.current = done.length;
  }, [done]);

  const toggleHabit = useCallback(async (habitId) => {
    const wasDone = done.includes(habitId);
    const updated = wasDone ? done.filter(id => id !== habitId) : [...done, habitId];
    setDone(updated); localStorage.setItem(STORAGE_TODAY(), JSON.stringify(updated));
    const today = TODAY(); const newMap = { ...history, [today]: updated };
    setHistory(newMap); saveHistory(newMap);

    // Milestone check on completion
    if (!wasDone) {
      const streaks = computeStreaks({ ...newMap }, [habitId]);
      const newStreak = streaks[habitId];
      if (MILESTONES.includes(newStreak)) {
        const seen = loadSeenMilestones();
        const key = `${habitId}_${newStreak}`;
        if (!seen[key]) {
          seen[key] = true;
          localStorage.setItem(MILESTONE_KEY, JSON.stringify(seen));
          const habit = allHabits.find(h => h.id === habitId);
          setTimeout(() => setMilestone({ habitLabel: habit?.label || 'Habit', days: newStreak }), 600);
        }
      }
    }

    try {
      const payload = { entry_type: 'habit_tracker', habits: updated, content: `Habits: ${updated.join(', ')}` };
      if (entryId) {
        await base44.entities.JournalEntry.update(entryId, payload);
      } else {
        const created = await base44.entities.JournalEntry.create(payload);
        setEntryId(created.id);
      }
      if (!wasDone) {
        const h = allHabits.find(h => h.id === habitId);
        toast.success(`${h?.emoji || ''} ${h?.label || 'Habit'} done ✓`, { duration: 1500 });
      }
    } catch {
      setDone(done); localStorage.setItem(STORAGE_TODAY(), JSON.stringify(done));
      toast.error('Failed to save — try again');
    }
  }, [done, history, entryId, allHabits]);

  const savePicker = ids => {
    setActiveIds(ids); localStorage.setItem(ACTIVE_KEY, JSON.stringify(ids));
    setShowPicker(false); toast.success(`Tracking ${ids.length} habits`);
  };

  const activeHabits   = allHabits.filter(h => activeIds.includes(h.id));
  const streaks        = computeStreaks(history, activeIds);
  const completedCount = activeHabits.filter(h => done.includes(h.id)).length;
  const totalCount     = activeHabits.length;
  const pct            = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDoneNow     = completedCount === totalCount && totalCount > 0;
  const bestStreak     = Math.max(0, ...activeHabits.map(h => streaks[h.id] || 0));
  const overallStreak  = (() => {
    let s = 0; const d = new Date();
    while (true) { const key = localDateKey(d); if ((history[key]||[]).length > 0) { s++; d.setDate(d.getDate()-1); } else break; }
    return s;
  })();

  const filteredHabits = category === 'All' ? activeHabits : activeHabits.filter(h => h.category === category);
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Category tabs (only categories that have active habits)
  const activeCats = ['All', ...Array.from(new Set(activeHabits.map(h => h.category)))];

  return (
    <>
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#F2F6FA] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Link to={createPageUrl('PersonalGrowth')}
              className="w-9 h-9 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-white dark:bg-white/5 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
            </Link>
            <div className="flex-1">
              <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Habit Builder</h1>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">{dateLabel}</p>
            </div>
            <button onClick={() => setShowPicker(true)}
              className="flex items-center gap-1.5 bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-white dark:bg-white/5 border border-[#F2F6FA] rounded-xl px-3 py-1.5 transition-colors">
              <Settings2 className="w-3.5 h-3.5 text-[#0A1A2F]/50 dark:text-white/50" />
              <span className="text-xs font-semibold text-[#0A1A2F]/60 dark:text-white/60">Edit</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-5 space-y-5">

          {/* ── Stats row ──────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: `${completedCount}/${totalCount}`, label: 'Today', sub: pct === 100 ? '🎉 All done!' : `${pct}% complete`, color: '#c9a227', highlight: pct === 100 },
              { value: overallStreak,  label: 'Day Streak', sub: overallStreak > 0 ? '🔥 keep going' : 'Start today',    color: '#f97316', highlight: overallStreak > 0 },
              { value: bestStreak,     label: 'Best Streak', sub: bestStreak > 0 ? `${bestStreak}d in a row` : 'Keep tracking', color: '#8B5CF6', highlight: bestStreak > 0 },
            ].map(({ value, label, sub, color, highlight }) => (
              <motion.div key={label}
                animate={highlight ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={`rounded-2xl border p-3.5 text-center transition-all ${highlight ? 'bg-white dark:bg-white/5 shadow-sm dark:shadow-none border-[#F2F6FA]' : 'bg-white dark:bg-white/5 border-[#F2F6FA]'}`}>
                <p className="font-bold text-xl text-[#0A1A2F] dark:text-white dark:text-white" style={highlight ? { color } : {}}>{value}</p>
                <p className="text-xs font-bold text-[#0A1A2F] dark:text-white mt-0.5">{label}</p>
                <p className="text-[10px] text-[#0A1A2F]/35 dark:text-white/35">{sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Progress bar ───────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#0A1A2F]/50 dark:text-white/50">Today's progress</p>
              <p className="text-xs font-bold" style={{ color: allDoneNow ? '#10b981' : '#c9a227' }}>{pct}%</p>
            </div>
            <div className="h-2.5 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`h-full rounded-full ${allDoneNow ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-[#FAD98D] to-[#c9a227]'}`}
              />
            </div>
            <AnimatePresence>
              {allDoneNow && (
                <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-xs font-bold text-emerald-500 mt-2 text-center">
                  All {totalCount} habits complete today 🎉
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Category filter ────────────────────────────────────────────── */}
          {activeCats.length > 2 && (
            <div className="flex gap-2 overflow-x-auto -mx-4 px-4 scrollbar-none pb-0.5">
              {activeCats.map(cat => {
                const catHabits = cat === 'All' ? activeHabits : activeHabits.filter(h => h.category === cat);
                const catDone   = catHabits.filter(h => done.includes(h.id)).length;

                return (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
                      category === cat
                        ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                        : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8'
                    }`}>
                    {cat}
                    <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 ${category === cat ? 'bg-white/20' : catDone === catHabits.length && catHabits.length > 0 ? 'bg-emerald-100 dark:bg-emerald-900/25 text-emerald-600' : 'bg-[#F2F6FA] dark:bg-[#0A1A2F]'}`}>
                      {catDone}/{catHabits.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Habit cards ─────────────────────────────────────────────────── */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest">
                {category === 'All' ? `${activeHabits.length} Habits` : category}
              </p>
              <button onClick={() => setShowPicker(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#c9a227] hover:text-[#C9A227] transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add habit
              </button>
            </div>
            <AnimatePresence mode="popLayout">
              {filteredHabits.map((habit, i) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isDone={done.includes(habit.id)}
                  streak={streaks[habit.id] || 0}
                  history={history}
                  onToggle={toggleHabit}
                  user={user}
                  index={i}
                />
              ))}
            </AnimatePresence>

            {filteredHabits.length === 0 && (
              <div className="text-center py-8 text-[#0A1A2F]/30 dark:text-white/30">
                <p className="text-2xl mb-2">🌱</p>
                <p className="text-sm">No habits in this category yet</p>
                <button onClick={() => setShowPicker(true)} className="text-xs text-[#c9a227] font-bold mt-1">Add one →</button>
              </div>
            )}
          </div>

          {/* ── 35-day heatmap ──────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <MonthHeatmap activeIds={activeIds} history={history} />
          </motion.div>

          {/* ── Growth pathway link ─────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to={createPageUrl('GrowthPathwaysPage')}
              className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 p-4 transition-all group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FAD98D] to-[#c9a227] rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#0A1A2F] dark:text-white dark:text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-[#0A1A2F] dark:text-white dark:text-white">Connect to a Growth Pathway</p>
                <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Link your habits to your discipline or faith journey</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 dark:text-white/20 group-hover:text-[#0A1A2F]/40 dark:text-white/40 transition-colors" />
            </Link>
          </motion.div>

        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPicker    && <HabitPickerModal activeIds={activeIds} onSave={savePicker} onClose={() => setShowPicker(false)} />}
        {showCelebration && <AllDoneOverlay habits={activeHabits} onClose={() => setShowCelebration(false)} user={user} />}
        {milestone     && <MilestoneModal habitLabel={milestone.habitLabel} days={milestone.days} onClose={() => setMilestone(null)} user={user} />}
      </AnimatePresence>
    </>
  );
}


export default function HabitBuilderPage(props) {
  return <PageErrorBoundary><HabitBuilderPageInner {...props} /></PageErrorBoundary>;
}