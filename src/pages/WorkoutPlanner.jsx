import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Dumbbell, Flame, Wind, Heart, Plus, X,
  Calendar, BarChart2, BookOpen, Search, Clock, CheckCircle2, Trash2, Zap, ChevronRight
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';

// ── Constants ────────────────────────────────────────────────────────────────
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAYS_FULL  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const PLANNER_KEY = 'pr_workout_planner_v2';

const VERSES = [
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "Do you not know that your bodies are temples of the Holy Spirit?", ref: "1 Corinthians 6:19" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged.", ref: "Joshua 1:9" },
  { text: "Physical training is of some value, but godliness has value for all things.", ref: "1 Timothy 4:8" },
  { text: "He gives strength to the weary and increases the power of the weak.", ref: "Isaiah 40:29" },
  { text: "Honor God with your bodies.", ref: "1 Corinthians 6:20" },
];

const CATEGORY_META = {
  cardio:      { label: 'Cardio',      icon: <Wind   className="w-3.5 h-3.5" />, color: 'bg-sky-100 text-sky-700 border-sky-200',      bar: 'bg-sky-500'    },
  strength:    { label: 'Strength',    icon: <Dumbbell className="w-3.5 h-3.5" />, color: 'bg-[#FD9C2D]/10 text-[#c97a1a] border-[#FD9C2D]/30', bar: 'bg-[#FD9C2D]' },
  core:        { label: 'Core',        icon: <Zap    className="w-3.5 h-3.5" />, color: 'bg-purple-100 text-purple-700 border-purple-200', bar: 'bg-purple-500'  },
  flexibility: { label: 'Flexibility', icon: <Heart  className="w-3.5 h-3.5" />, color: 'bg-green-100 text-green-700 border-green-200',  bar: 'bg-green-500'  },
  hiit:        { label: 'HIIT',        icon: <Flame  className="w-3.5 h-3.5" />, color: 'bg-red-100 text-red-700 border-red-200',        bar: 'bg-red-500'    },
  full_body:   { label: 'Full Body',   icon: <Dumbbell className="w-3.5 h-3.5" />, color: 'bg-[#FAD98D]/30 text-[#3C4E53] border-[#FAD98D]',  bar: 'bg-[#FAD98D]'  },
  rest:        { label: 'Rest',        icon: <Heart  className="w-3.5 h-3.5" />, color: 'bg-gray-100 text-gray-500 border-gray-200',     bar: 'bg-gray-400'   },
};

const DIFF_META = {
  beginner:     { label: 'Beginner',     color: 'text-green-600 bg-green-50'  },
  intermediate: { label: 'Intermediate', color: 'text-[#FD9C2D] bg-orange-50' },
  advanced:     { label: 'Advanced',     color: 'text-red-600 bg-red-50'      },
};

// ── Storage helpers ──────────────────────────────────────────────────────────
function loadSchedule() {
  try { return JSON.parse(localStorage.getItem(PLANNER_KEY) || '{}'); }
  catch { return {}; }
}
function saveSchedule(s) {
  localStorage.setItem(PLANNER_KEY, JSON.stringify(s));
}
function uid() { return Math.random().toString(36).slice(2); }

// ── getWeek ──────────────────────────────────────────────────────────────────
function getWeek() {
  const today = new Date();
  const sun = new Date(today);
  sun.setDate(today.getDate() - today.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sun);
    d.setDate(sun.getDate() + i);
    return { date: d, dayIdx: i };
  });
}

// ── CategoryBadge ────────────────────────────────────────────────────────────
function CategoryBadge({ category }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.full_body;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${meta.color}`}>
      {meta.icon} {meta.label}
    </span>
  );
}

// ── WorkoutMiniCard ──────────────────────────────────────────────────────────
function WorkoutMiniCard({ workout, onRemove }) {
  const meta = CATEGORY_META[workout.category] || CATEGORY_META.full_body;
  return (
    <div className={`flex items-center gap-2.5 p-2.5 rounded-xl bg-white border-l-4 shadow-sm group`}
      style={{ borderLeftColor: meta.bar.replace('bg-','').startsWith('#') ? meta.bar.replace('bg-','') : undefined }}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#3C4E53] truncate">{workout.title}</p>
        <p className="text-[10px] text-gray-400">{workout.duration_minutes} min · {workout.exercises?.length || 0} exercises</p>
      </div>
      {onRemove && (
        <button onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ── Add Workout Sheet ─────────────────────────────────────────────────────────
function AddWorkoutSheet({ dayIdx, onClose, onAdd }) {
  const [tab, setTab] = useState('templates');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const categories = ['all', ...Object.keys(CATEGORY_META)];
  const filtered = PREMADE_WORKOUTS.filter(w => {
    const matchCat = catFilter === 'all' || w.category === catFilter;
    const matchQ = w.title.toLowerCase().includes(search.toLowerCase()) ||
                   (w.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  function handleAdd() {
    if (!selected) return;
    onAdd({ ...selected, wid: uid() });
    toast.success(`✅ ${selected.title} added to ${DAYS_FULL[dayIdx]}!`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-50 rounded-t-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#3C4E53] px-5 pt-5 pb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-[#FD9C2D]/10" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[#FAD98D] text-xs font-bold tracking-widest uppercase mb-1">Add Workout</p>
              <h3 className="text-white font-black text-xl leading-tight">{DAYS_FULL[dayIdx]}</h3>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search workouts..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#FD9C2D] focus:ring-2 focus:ring-[#FD9C2D]/20"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.slice(0, 7).map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                ${catFilter === cat ? 'bg-[#FD9C2D] text-white border-[#FD9C2D]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#FD9C2D]/50'}`}
            >
              {cat === 'all' ? 'All' : CATEGORY_META[cat]?.label || cat}
            </button>
          ))}
        </div>

        {/* Workout List */}
        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No workouts found</p>
            </div>
          )}
          {filtered.map(w => {
            const meta = CATEGORY_META[w.category] || CATEGORY_META.full_body;
            const diff = DIFF_META[w.difficulty] || DIFF_META.beginner;
            const isSelected = selected?.id === w.id;
            const isExpanded = expanded === w.id;
            return (
              <div key={w.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all cursor-pointer
                  ${isSelected ? 'border-[#FD9C2D] shadow-md shadow-[#FD9C2D]/10' : 'border-transparent hover:border-gray-200'}`}
                onClick={() => { setSelected(isSelected ? null : w); setExpanded(isExpanded ? null : w.id); }}
              >
                <div className="flex items-center gap-3 p-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#3C4E53] text-sm leading-tight">{w.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${diff.color}`}>{diff.label}</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {w.duration_minutes}m
                      </span>
                    </div>
                  </div>
                  {isSelected
                    ? <CheckCircle2 className="w-5 h-5 text-[#FD9C2D] flex-shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  }
                </div>

                {/* Expanded exercise list */}
                {isExpanded && (
                  <div className="px-4 pb-3 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide my-2">Exercises</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(w.exercises || []).map((ex, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg px-2 py-1.5">
                          <p className="text-xs font-semibold text-[#3C4E53] leading-tight">{ex.name}</p>
                          <p className="text-[10px] text-gray-400">
                            {ex.duration_seconds ? `${ex.duration_seconds}s` : `${ex.sets}×${ex.reps}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button onClick={handleAdd} disabled={!selected}
            className={`w-full py-4 rounded-2xl font-black text-base transition-all
              ${selected
                ? 'bg-[#FD9C2D] text-white shadow-lg shadow-[#FD9C2D]/30 active:scale-98'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {selected ? `Add "${selected.title}" to ${DAYS_SHORT[dayIdx]}` : 'Select a workout above'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Day Column View ───────────────────────────────────────────────────────────
function DayView({ dayIdx, week, schedule, setSchedule, onAddWorkout }) {
  const dayWorkouts = schedule[dayIdx] || [];
  const isToday = dayIdx === new Date().getDay();
  const date = week[dayIdx]?.date;

  function removeWorkout(wid) {
    setSchedule(prev => {
      const next = { ...prev, [dayIdx]: (prev[dayIdx] || []).filter(w => w.wid !== wid) };
      saveSchedule(next);
      return next;
    });
    toast.success('Workout removed');
  }

  return (
    <div className="flex-1">
      {/* Day header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#3C4E53]">{DAYS_FULL[dayIdx]}</h3>
            {isToday && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FD9C2D] text-white">Today</span>
            )}
          </div>
          {date && (
            <p className="text-xs text-gray-400 mt-0.5">
              {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
        <button onClick={onAddWorkout}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FD9C2D] text-white font-bold text-sm hover:bg-[#e58a1f] transition-colors shadow-sm shadow-[#FD9C2D]/30"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Workouts */}
      {dayWorkouts.length === 0 ? (
        <button onClick={onAddWorkout}
          className="w-full py-10 rounded-2xl border-2 border-dashed border-gray-200 text-gray-300 hover:border-[#FD9C2D]/40 hover:text-[#FD9C2D]/50 transition-all flex flex-col items-center gap-2"
        >
          <Dumbbell className="w-6 h-6" />
          <span className="text-sm font-semibold">No workouts yet — tap to add</span>
        </button>
      ) : (
        <div className="space-y-2.5">
          {dayWorkouts.map(w => (
            <WorkoutMiniCard key={w.wid} workout={w} onRemove={() => removeWorkout(w.wid)} />
          ))}
          <button onClick={onAddWorkout}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-semibold hover:border-[#FD9C2D]/40 hover:text-[#FD9C2D]/60 transition-all"
          >
            + Add another workout
          </button>
        </div>
      )}
    </div>
  );
}

// ── Weekly Overview ───────────────────────────────────────────────────────────
function WeeklyOverview({ schedule, week, setSelectedDay, setView }) {
  const allWorkouts = Object.values(schedule).flat();
  const totalMins  = allWorkouts.reduce((s, w) => s + (w.duration_minutes || 0), 0);
  const activeDays = Object.keys(schedule).filter(k => (schedule[k] || []).length > 0).length;
  const restDays   = 7 - activeDays;

  const stats = [
    { label: 'Workouts',   value: allWorkouts.length, icon: <Dumbbell className="w-4 h-4" />, color: 'text-[#FD9C2D]' },
    { label: 'Minutes',    value: totalMins,           icon: <Clock    className="w-4 h-4" />, color: 'text-[#3C4E53]' },
    { label: 'Active Days',value: activeDays,          icon: <Calendar className="w-4 h-4" />, color: 'text-green-600'  },
    { label: 'Rest Days',  value: restDays,            icon: <Heart    className="w-4 h-4" />, color: 'text-sky-500'   },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-black text-[#3C4E53]">{s.value}</div>
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mini calendar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-black text-[#3C4E53] mb-4 text-base">📅 Week at a Glance</p>
        <div className="grid grid-cols-7 gap-1.5">
          {week.map(({ dayIdx }) => {
            const dayWorkouts = schedule[dayIdx] || [];
            const isToday = dayIdx === new Date().getDay();
            return (
              <button key={dayIdx}
                onClick={() => { setSelectedDay(dayIdx); setView('planner'); }}
                className={`rounded-xl p-2 text-center transition-colors hover:bg-gray-50 ${isToday ? 'ring-2 ring-[#FD9C2D]' : ''}`}
              >
                <p className="text-[9px] text-gray-400 font-bold uppercase mb-1.5">{DAYS_SHORT[dayIdx]}</p>
                {dayWorkouts.length === 0 ? (
                  <div className="h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 text-[10px]">—</span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {dayWorkouts.slice(0, 2).map(w => {
                      const meta = CATEGORY_META[w.category] || CATEGORY_META.full_body;
                      return (
                        <div key={w.wid} className={`h-3.5 rounded ${meta.bar} opacity-80`} />
                      );
                    })}
                    {dayWorkouts.length > 2 && (
                      <p className="text-[8px] text-gray-400 text-center">+{dayWorkouts.length - 2}</p>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(CATEGORY_META).slice(0, 5).map(([key, meta]) => (
            <span key={key} className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className={`w-2 h-2 rounded-sm inline-block ${meta.bar}`} />
              {meta.label}
            </span>
          ))}
        </div>
      </div>

      {/* All scheduled workouts */}
      {allWorkouts.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="font-black text-[#3C4E53] mb-3 text-base">Scheduled This Week</p>
          <div className="space-y-1.5">
            {DAYS_FULL.map((day, idx) => {
              const ws = schedule[idx] || [];
              if (!ws.length) return null;
              return (
                <div key={idx}>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">{day}</p>
                  {ws.map(w => <WorkoutMiniCard key={w.wid} workout={w} />)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Exercise Library ──────────────────────────────────────────────────────────
function ExerciseLibraryView() {
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = PREMADE_WORKOUTS.filter(w => {
    const matchCat = catFilter === 'all' || w.category === catFilter;
    const matchQ = w.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search workouts..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#FD9C2D]"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', ...Object.keys(CATEGORY_META)].slice(0, 7).map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${catFilter === cat ? 'bg-[#FD9C2D] text-white border-[#FD9C2D]' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            {cat === 'all' ? 'All' : CATEGORY_META[cat]?.label || cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(w => {
          const meta = CATEGORY_META[w.category] || CATEGORY_META.full_body;
          const diff = DIFF_META[w.difficulty] || DIFF_META.beginner;
          return (
            <div key={w.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                  {meta.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#3C4E53] text-sm">{w.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${diff.color}`}>{diff.label}</span>
                    <span className="text-[10px] text-gray-400"><Clock className="inline w-2.5 h-2.5" /> {w.duration_minutes}m</span>
                  </div>
                </div>
              </div>
              {w.description && <p className="text-xs text-gray-500 mb-3 leading-relaxed">{w.description}</p>}
              <div className="grid grid-cols-2 gap-1.5">
                {(w.exercises || []).map((ex, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg px-2.5 py-2">
                    <p className="text-xs font-semibold text-[#3C4E53] leading-tight">{ex.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {ex.duration_seconds ? `${ex.sets} × ${ex.duration_seconds}s` : `${ex.sets} × ${ex.reps} reps`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PLANNER_KEY_LEGACY = 'workout_planner_v1';

export default function WorkoutPlanner() {
  const week = getWeek();
  const todayIdx = new Date().getDay();

  const navigate = useNavigate();
  const [view, setView]               = useState('planner');
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [schedule, setSchedule]       = useState(loadSchedule);
  const [verse]                       = useState(() => VERSES[Math.floor(Math.random() * VERSES.length)]);

  useEffect(() => { saveSchedule(schedule); }, [schedule]);

  function handleAddWorkout(workout) {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), workout],
    }));
    setShowAddSheet(false);
  }

  function clearAll() {
    if (!confirm('Clear all workouts for the entire week?')) return;
    setSchedule({});
    toast.success('Week cleared');
  }

  const NAV = [
    { key: 'planner',  label: 'Planner',   icon: <Calendar className="w-4 h-4" />  },
    { key: 'overview', label: 'Overview',  icon: <BarChart2 className="w-4 h-4" /> },
    { key: 'library',  label: 'Workouts',  icon: <BookOpen className="w-4 h-4" />  },
  ];

  const weekTotalWorkouts = Object.values(schedule).flat().length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-[#3C4E53] px-5 pt-7 pb-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#FD9C2D]/10" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FD9C2D] via-[#FAD98D] to-transparent" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-[#FAD98D] text-xs font-bold tracking-widest uppercase mb-2">Prosperity Revived</p>
          <h1 className="text-white text-2xl font-black mb-1">Workout Planner 🏋️</h1>
          <p className="text-white/60 text-sm">Train your body. Strengthen your faith.</p>
        </div>
      </div>

      {/* ── Daily Verse ── */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="bg-[#3C4E53]/90 rounded-2xl px-4 py-3 flex items-start gap-3 mb-4">
          <span className="text-[#FAD98D] text-lg mt-0.5">✝</span>
          <div>
            <p className="text-white/90 text-xs italic leading-relaxed">"{verse.text}"</p>
            <p className="text-[#FAD98D] text-[10px] font-bold mt-1">— {verse.ref}</p>
          </div>
        </div>
      </div>

      {/* ── Nav Tabs ── */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-1 flex gap-1 shadow-sm mb-5">
          {NAV.map(n => (
            <button key={n.key} onClick={() => setView(n.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all
                ${view === n.key ? 'bg-[#FD9C2D] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {n.icon} {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 pb-24">

        {/* PLANNER VIEW */}
        {view === 'planner' && (
          <div>
            {/* Week strip */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-5">
              {week.map(({ date, dayIdx }) => {
                const isToday   = dayIdx === todayIdx;
                const isSelected = dayIdx === selectedDay;
                const hasWork   = (schedule[dayIdx] || []).length > 0;
                return (
                  <button key={dayIdx} onClick={() => setSelectedDay(dayIdx)}
                    className={`flex-shrink-0 w-14 py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all border-2
                      ${isSelected
                        ? 'bg-[#FD9C2D] border-[#FD9C2D] shadow-md shadow-[#FD9C2D]/30'
                        : isToday
                          ? 'bg-[#FAD98D]/20 border-[#FAD98D]'
                          : 'bg-white border-transparent hover:border-gray-200'
                      }`}
                  >
                    <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                      {DAYS_SHORT[dayIdx]}
                    </span>
                    <span className={`text-lg font-black ${isSelected ? 'text-white' : 'text-[#3C4E53]'}`}>
                      {date.getDate()}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full ${hasWork ? (isSelected ? 'bg-white' : 'bg-[#FD9C2D]') : 'bg-transparent'}`} />
                  </button>
                );
              })}
            </div>

            <DayView
              dayIdx={selectedDay}
              week={week}
              schedule={schedule}
              setSchedule={setSchedule}
              onAddWorkout={() => setShowAddSheet(true)}
            />

            {/* Clear week button */}
            {weekTotalWorkouts > 0 && (
              <div className="mt-6 flex justify-center">
                <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Clear entire week
                </button>
              </div>
            )}
          </div>
        )}

        {/* OVERVIEW VIEW */}
        {view === 'overview' && (
          <WeeklyOverview
            schedule={schedule}
            week={week}
            setSelectedDay={setSelectedDay}
            setView={setView}
          />
        )}

        {/* LIBRARY VIEW */}
        {view === 'library' && <ExerciseLibraryView />}
      </div>

      {/* ── Add Workout Sheet ── */}
      {showAddSheet && (
        <AddWorkoutSheet
          dayIdx={selectedDay}
          onClose={() => setShowAddSheet(false)}
          onAdd={handleAddWorkout}
        />
      )}
    </div>
  );
}
