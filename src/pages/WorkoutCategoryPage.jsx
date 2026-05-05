import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Dumbbell, Calendar, TrendingUp, Target } from 'lucide-react';
import { createPageUrl } from '@/utils';
import WorkoutCard from '@/components/wellness/WorkoutCard';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';

// ── Category config (muscle_group based) ─────────────────────────────────────
export const MUSCLE_GROUP_META = {
  all:          { emoji: '🏋️', grad: 'from-[#FD9C2D] to-[#38BDF8]',     label: 'All Workouts' },
  chest:        { emoji: '💪', grad: 'from-slate-700 to-slate-500',      label: 'Chest' },
  back:         { emoji: '🔙', grad: 'from-indigo-600 to-blue-500',      label: 'Back' },
  legs:         { emoji: '🦵', grad: 'from-violet-600 to-purple-500',    label: 'Legs' },
  shoulders:    { emoji: '🏋️', grad: 'from-cyan-600 to-sky-400',         label: 'Shoulders' },
  arms:         { emoji: '💪', grad: 'from-orange-600 to-amber-500',     label: 'Arms' },
  core:         { emoji: '🎯', grad: 'from-teal-600 to-emerald-500',     label: 'Core & Abs' },
  glutes:       { emoji: '🍑', grad: 'from-pink-600 to-rose-400',        label: 'Glutes' },
  push:         { emoji: '⬆️', grad: 'from-slate-600 to-slate-400',      label: 'Push (Chest/Shoulders/Tris)' },
  pull:         { emoji: '⬇️', grad: 'from-blue-700 to-blue-500',        label: 'Pull (Back/Biceps)' },
  upper_body:   { emoji: '🤸', grad: 'from-sky-600 to-cyan-400',         label: 'Upper Body' },
  lower_body:   { emoji: '🦶', grad: 'from-purple-600 to-violet-400',    label: 'Lower Body' },
  full_body:    { emoji: '🏋️', grad: 'from-violet-500 to-purple-400',    label: 'Full Body' },
  cardio:       { emoji: '❤️', grad: 'from-rose-500 to-pink-400',        label: 'Cardio' },
  flexibility:  { emoji: '🧘', grad: 'from-teal-500 to-emerald-400',     label: 'Flexibility & Yoga' },
  hiit:         { emoji: '⚡', grad: 'from-orange-500 to-amber-400',     label: 'HIIT' },
  strength:     { emoji: '💪', grad: 'from-slate-700 to-slate-500',      label: 'Strength' },
  yoga:         { emoji: '🌸', grad: 'from-pink-400 to-rose-300',        label: 'Yoga' },
};

const STYLE_FILTERS = [
  { key: 'all',          label: 'All Styles' },
  { key: 'strength',     label: 'Strength' },
  { key: 'hypertrophy',  label: 'Hypertrophy' },
  { key: 'powerlifting', label: 'Powerlifting' },
  { key: 'cardio',       label: 'Cardio' },
  { key: 'hiit',         label: 'HIIT' },
  { key: 'flexibility',  label: 'Flexibility' },
  { key: 'yoga',         label: 'Yoga' },
  { key: 'full_body',    label: 'Full Body' },
];

function getMeta(param) {
  if (!param) return MUSCLE_GROUP_META['all'];
  const key = String(param).toLowerCase().trim();
  return MUSCLE_GROUP_META[key] || { emoji: '🏋️', grad: 'from-gray-400 to-gray-500', label: param };
}

function matchesMuscleGroup(workout, param) {
  if (!param || param === 'all') return true;
  const key = String(param).toLowerCase().trim();
  const mg  = (workout?.muscle_group || '').toLowerCase();
  const cat = (workout?.category || '').toLowerCase();
  return mg === key || cat === key;
}

const DIFF_ORDER = { beginner: 0, intermediate: 1, advanced: 2 };

class PageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('WorkoutCategoryPage error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="bg-white dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6 text-center min-h-[60vh]">
          <p className="text-lg font-bold text-[#0A1A2F] dark:text-white mb-2">Something went wrong</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This page encountered an error.</p>
          <button onClick={() => this.setState({ error: null })} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function WorkoutCategoryPageInner() {
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');
  const meta = getMeta(categoryParam);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: dbWorkouts = [], isLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => base44.entities.WorkoutPlan.list('-created_date').catch(() => []),
    enabled: !!user
  });

  const safeDb = Array.isArray(dbWorkouts) ? dbWorkouts : [];
  const safePremade = Array.isArray(PREMADE_WORKOUTS) ? PREMADE_WORKOUTS : [];

  const myWorkouts = safeDb.filter((w) => w?.created_by === user?.email);
  const allWorkouts = [...safePremade, ...myWorkouts];

  const filtered = allWorkouts.filter((w) => matchesMuscleGroup(w, categoryParam));
  const sorted = [...filtered].sort((a, b) =>
    (DIFF_ORDER[a?.difficulty] ?? 1) - (DIFF_ORDER[b?.difficulty] ?? 1)
  );

  const NAV_TABS = [
    { id: 'today',   label: 'Today',   icon: Dumbbell,    page: 'Workouts'         },
    { id: 'planner', label: 'Planner', icon: Calendar,    page: 'WorkoutPlanner'   },
    { id: 'trends',  label: 'Trends',  icon: TrendingUp,  page: 'WorkoutTrends'    },
    { id: 'goals',   label: 'Goals',   icon: Target,      page: 'FitnessGoalsPage' },
  ];

  return (
    <div className="bg-white dark:bg-[#0A1A2F] pb-28">

      {/* ── Sub-nav (page title is in Layout's UniversalHeader) ── */}
      <div className="sticky z-30 bg-white dark:bg-[#0A1A2F] border-b border-[#BAE6FD]/40 dark:border-white/10"
        style={{ top: 'calc(env(safe-area-inset-top) + 3.75rem)' }}>
        <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-2 flex gap-0 overflow-x-auto scrollbar-hide">
          {NAV_TABS.map(({ id, label, icon: Icon, page }) => (
            <button
              key={id}
              onClick={() => navigate(createPageUrl(page))}
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold flex-shrink-0 relative transition-colors text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#0A1A2F]/60 dark:text-white/60"
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] min-h-[calc(100vh-200px)]">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-4 pb-4">

          {/* Health Disclaimer */}
          <div className="mb-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 border border-amber-100 dark:border-amber-800/30">
            <p className="text-[10px] text-amber-700 dark:text-amber-300 text-center">Not medical advice. Consult a healthcare professional before starting any new exercise program.</p>
          </div>

          {/* Category header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-gradient-to-br ${meta.grad} rounded-2xl p-6 text-white shadow-md dark:shadow-none mb-5 relative overflow-hidden`}>
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="relative flex items-center gap-4">
              <span className="text-5xl drop-shadow-sm" aria-hidden>{meta.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Category</p>
                <h2 className="text-2xl font-black leading-tight">{meta.label}</h2>
                <p className="text-white/80 text-sm mt-1">
                  {isLoading
                    ? 'Loading workouts…'
                    : `${sorted.length} workout${sorted.length !== 1 ? 's' : ''} available`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Workout list */}
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                  className="h-40 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-100 dark:border-white/10"
                />
              ))}
            </div>
          ) : sorted.length > 0 ? (
            <FilteredWorkoutList workouts={sorted} user={user} />
          ) : (
            <div className="text-center py-16 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
              <span className="text-4xl mb-3 block">{meta.emoji}</span>
              <p className="text-[#0A1A2F]/60 dark:text-white/60 font-medium">No workouts found in this category yet.</p>
              <p className="text-[#0A1A2F]/40 dark:text-white/40 text-sm mt-1">More coming soon!</p>
              <button
                onClick={() => navigate(createPageUrl('Workouts'))}
                className="mt-4 px-5 py-2 rounded-xl bg-[#0A1A2F] dark:bg-white text-white dark:text-[#0A1A2F] text-sm font-bold active:scale-95 transition-transform"
              >
                Browse all workouts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inner component with difficulty + style filter tabs
function FilteredWorkoutList({ workouts, user }) {
  const [difficulty, setDifficulty] = useState('all');
  const [style, setStyle] = useState('all');

  const availableStyles = ['all', ...new Set(workouts.map((w) => w?.category).filter(Boolean))];
  const availableDifficulties = ['all', ...new Set(workouts.map((w) => w?.difficulty).filter(Boolean))];

  const visible = workouts.filter((w) => {
    const diffMatch  = difficulty === 'all' || w?.difficulty === difficulty;
    const styleMatch = style === 'all'      || w?.category === style;
    return diffMatch && styleMatch;
  });

  const INACTIVE = 'bg-white dark:bg-white/5 text-[#0A1A2F]/55 dark:text-white/55 border border-gray-200 dark:border-white/10';
  const ACTIVE_DIFF = {
    all:          'bg-[#38BDF8] text-white',
    beginner:     'bg-emerald-500 text-white',
    intermediate: 'bg-amber-500 text-white',
    advanced:     'bg-rose-500 text-white',
  };
  const ACTIVE_STYLE = 'bg-[#0A1A2F] dark:bg-white text-white dark:text-[#0A1A2F]';

  const showStyleFilter = availableStyles.length > 2;

  return (
    <>
      <div className="mb-3">
        <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 mb-2 uppercase tracking-wide">Difficulty</p>
        <div className="flex gap-2 flex-wrap">
          {availableDifficulties.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${difficulty === lvl ? (ACTIVE_DIFF[lvl] || 'bg-[#38BDF8] text-white') : INACTIVE}`}>
              {lvl === 'all' ? 'All Levels' : lvl}
            </button>
          ))}
        </div>
      </div>

      {showStyleFilter && (
        <div className="mb-5">
          <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 mb-2 uppercase tracking-wide">Training Style</p>
          <div className="flex gap-2 flex-wrap">
            {availableStyles.map((s) => {
              const label = STYLE_FILTERS.find((f) => f.key === s)?.label || s;
              return (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${style === s ? ACTIVE_STYLE : INACTIVE}`}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40 mb-4">{visible.length} workout{visible.length !== 1 ? 's' : ''}</p>

      <div className="space-y-3">
        {visible.map((workout, i) => (
          <motion.div
            key={workout?.id || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}>
            <WorkoutCard
              workout={workout}
              onComplete={() => {}}
              index={i}
              isPremade={true}
              user={user} />
          </motion.div>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
          <p className="text-[#0A1A2F]/50 dark:text-white/50">No workouts match these filters.</p>
        </div>
      )}
    </>
  );
}

export default function WorkoutCategoryPage(props) {
  return <PageErrorBoundary><WorkoutCategoryPageInner {...props} /></PageErrorBoundary>;
}
