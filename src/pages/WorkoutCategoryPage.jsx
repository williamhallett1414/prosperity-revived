import React, { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';

// Maps every possible URL label → data category value(s)
const LABEL_TO_CATEGORY = {
  'all':         null,           // null = show everything
  'cardio':      ['cardio'],
  'strength':    ['strength'],
  'hiit':        ['cardio', 'hiit'],   // HIIT workouts live in cardio
  'home':        ['full_body', 'flexibility', 'yoga'],  // home = no-equipment
  'flex':        ['flexibility', 'yoga'],
  'flexibility': ['flexibility', 'yoga'],
  'full body':   ['full_body'],
  'full_body':   ['full_body'],
  'yoga':        ['yoga'],
};

const CATEGORY_META = {
  'all':         { emoji: '🏋️', grad: 'from-[#FD9C2D] to-[#38BDF8]', label: 'All Workouts' },
  'cardio':      { emoji: '❤️',  grad: 'from-rose-500 to-pink-400',    label: 'Cardio' },
  'strength':    { emoji: '💪',  grad: 'from-slate-700 to-slate-500',  label: 'Strength' },
  'hiit':        { emoji: '⚡',  grad: 'from-orange-500 to-amber-400', label: 'HIIT' },
  'home':        { emoji: '🏠',  grad: 'from-sky-500 to-cyan-400',     label: 'Home Workouts' },
  'flex':        { emoji: '🧘',  grad: 'from-teal-500 to-emerald-400', label: 'Flexibility' },
  'flexibility': { emoji: '🧘',  grad: 'from-teal-500 to-emerald-400', label: 'Flexibility' },
  'full body':   { emoji: '🏋️',  grad: 'from-violet-500 to-purple-400', label: 'Full Body' },
  'full_body':   { emoji: '🏋️',  grad: 'from-violet-500 to-purple-400', label: 'Full Body' },
  'yoga':        { emoji: '🌸',  grad: 'from-pink-400 to-rose-300',    label: 'Yoga' },
};

function getCategories(rawParam) {
  if (!rawParam) return null; // all
  const key = rawParam.toLowerCase().trim();
  return LABEL_TO_CATEGORY[key] ?? [key]; // fallback: try the raw value
}

function getMeta(rawParam) {
  if (!rawParam) return CATEGORY_META['all'];
  const key = rawParam.toLowerCase().trim();
  return CATEGORY_META[key] || { emoji: '🏋️', grad: 'from-gray-400 to-gray-500', label: rawParam };
}

export default function WorkoutCategoryPage() {
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();

  const categoryParam = searchParams.get('category');
  const filterCategories = getCategories(categoryParam);
  const meta = getMeta(categoryParam);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: dbWorkouts = [] } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date'),
    enabled: !!user,
  });

  const myWorkouts = dbWorkouts.filter(w => w.created_by === user?.email);
  const allWorkouts = [...PREMADE_WORKOUTS, ...myWorkouts];

  const filtered = filterCategories === null
    ? allWorkouts
    : allWorkouts.filter(w => filterCategories.includes(w.category?.toLowerCase()));

  // Secondary sort: beginner → intermediate → advanced
  const DIFF_ORDER = { beginner: 0, intermediate: 1, advanced: 2 };
  const sorted = [...filtered].sort((a, b) =>
    (DIFF_ORDER[a.difficulty] ?? 1) - (DIFF_ORDER[b.difficulty] ?? 1)
  );

  return (
    <div className="min-h-screen bg-[#F2F6FA]">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F]">Workout Category</h1>
            <p className="text-xs text-[#0A1A2F]/45">Find your workout</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">

        {/* Category header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${meta.grad} rounded-2xl p-6 text-white shadow-md mb-6`}
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">{meta.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold mb-1">{meta.label}</h2>
              <p className="text-white/80 text-sm">{sorted.length} workout{sorted.length !== 1 ? 's' : ''} available</p>
            </div>
          </div>
        </motion.div>

        {/* Difficulty filter pills */}
        {sorted.length > 0 && (
          <div className="mb-5">
            <DifficultyFiltered workouts={sorted} user={user} />
          </div>
        )}

        {/* Empty state */}
        {sorted.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <span className="text-4xl mb-3 block">{meta.emoji}</span>
            <p className="text-[#0A1A2F]/60 font-medium">No workouts found in this category yet.</p>
            <p className="text-[#0A1A2F]/40 text-sm mt-1">More coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Inner component with difficulty filter tabs
function DifficultyFiltered({ workouts, user }) {
  const [filter, setFilter] = useState('all');

  const levels = ['all', ...new Set(workouts.map(w => w.difficulty).filter(Boolean))];
  const visible = filter === 'all' ? workouts : workouts.filter(w => w.difficulty === filter);

  const LEVEL_COLORS = {
    all:          'bg-[#38BDF8] text-white',
    beginner:     'bg-emerald-500 text-white',
    intermediate: 'bg-amber-500 text-white',
    advanced:     'bg-rose-500 text-white',
  };
  const LEVEL_INACTIVE = 'bg-white text-[#0A1A2F]/55 border border-gray-200';

  return (
    <>
      {/* Filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {levels.map(lvl => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${filter === lvl ? (LEVEL_COLORS[lvl] || 'bg-[#38BDF8] text-white') : LEVEL_INACTIVE}`}
          >
            {lvl === 'all' ? 'All levels' : lvl}
          </button>
        ))}
      </div>

      {/* Workout list */}
      <div className="space-y-3">
        {visible.map((workout, i) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <WorkoutCard
              workout={workout}
              onComplete={() => {}}
              index={i}
              isPremade={true}
              user={user}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}

