import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowLeft, BookOpen, Dumbbell, Utensils, Brain, ChevronRight, ChevronLeft,
  CheckCircle2, Circle, ExternalLink, Play, ChevronDown, ChevronUp,
  Calendar, Sparkles, Star, Trophy, List, X, Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COACHING_PLANS } from '@/components/coaching/planData';
import { PREMADE_WORKOUTS } from '@/components/wellness/WorkoutLibrary';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import StartWorkoutModal from '@/components/wellness/StartWorkoutModal';
import MealLoggingSection from '@/components/coaching/MealLoggingSection';
import ChatButton from '@/components/chatbot/ChatButton';
import GuidedMeditationPlayer from '@/components/mindspirit/GuidedMeditationPlayer';
import { useQuery } from '@tanstack/react-query';
import { MoreVertical } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getProgress(planId) {
  try {
    const raw = localStorage.getItem(`coaching_progress_${planId}`);
    return raw ? JSON.parse(raw) : { completed_days: [], task_completions: {} };
  } catch { return { completed_days: [], task_completions: {} }; }
}

function saveProgress(planId, progress) {
  try { localStorage.setItem(`coaching_progress_${planId}`, JSON.stringify(progress)); } catch {}
}

function getDayStatus(planId, dayNumber) {
  const p = getProgress(planId);
  return (p.completed_days || []).includes(dayNumber);
}

function getTaskStatus(planId, dayNumber, taskKey) {
  const p = getProgress(planId);
  return !!(p.task_completions?.[`${dayNumber}_${taskKey}`]);
}

function toggleTask(planId, dayNumber, taskKey) {
  const p = getProgress(planId);
  const key = `${dayNumber}_${taskKey}`;
  if (!p.task_completions) p.task_completions = {};
  p.task_completions[key] = !p.task_completions[key];
  saveProgress(planId, p);
  return p.task_completions[key];
}

function markDayComplete(planId, dayNumber) {
  const p = getProgress(planId);
  if (!p.completed_days.includes(dayNumber)) {
    p.completed_days = [...p.completed_days, dayNumber];
    saveProgress(planId, p);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, color, accentColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#3C4E53]/30/8 shadow-sm dark:shadow-none overflow-hidden mb-3">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-4.5 h-4.5" style={{ color: accentColor }} />
          </div>
          <span className="font-bold text-[#0A1A2F] dark:text-white text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#0A1A2F]/40 dark:text-white/40" /> : <ChevronDown className="w-4 h-4 text-[#0A1A2F]/40 dark:text-white/40" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}>
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskRow({ label, done, onToggle, linkTo, linkLabel }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${done ? 'bg-[#F2F6FA] dark:bg-[#0A1A2F] border-[#3C4E53]/30/20' : 'bg-white dark:bg-white/5 border-[#3C4E53]/30/8'}`}>
      <button onClick={onToggle} className="flex-shrink-0">
        {done
          ? <CheckCircle2 className="w-5 h-5 text-[#3C4E53]" />
          : <Circle className="w-5 h-5 text-[#0A1A2F]/25 dark:text-white/25 hover:text-[#3C4E53] transition-colors" />}
      </button>
      <span className={`flex-1 text-sm ${done ? 'line-through text-[#0A1A2F]/40 dark:text-white/40' : 'text-[#0A1A2F] dark:text-white dark:text-white'}`}>{label}</span>
      {linkTo && (
        <Link to={linkTo} className="flex items-center gap-1 text-xs text-[#3C4E53] font-semibold hover:underline flex-shrink-0">
          {linkLabel || 'Open'} <ExternalLink className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

function WeekNav({ currentWeek, weeks, onSelectWeek, planId, weekThemes }) {
  const themes = weekThemes && weekThemes.length > 0
    ? weekThemes
    : Array.from({ length: weeks }, (_, i) => ({
        week: i + 1, emoji: '📅', theme: `Week ${i + 1}`, title: ''
      }));
  return (
    <div className="overflow-x-auto -mx-4 px-4 pb-1">
      <div className="flex gap-2 min-w-max">
        {themes.map(wt => {
          const progress = getProgress(planId);
          const weekDaysCompleted = (progress.completed_days || []).filter(d => {
            return d >= (wt.week - 1) * 7 + 1 && d <= wt.week * 7;
          }).length;
          const isActive = wt.week === currentWeek;
          return (
            <button key={wt.week} onClick={() => onSelectWeek(wt.week)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-[#3C4E53] text-white border-[#3C4E53]/30 shadow-md dark:shadow-none'
                  : weekDaysCompleted === 7
                  ? 'bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#3C4E53] border-[#3C4E53]/30/20'
                  : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#0A1A2F]/10'
              }`}>
              <span>{wt.emoji}</span>
              <span>Wk {wt.week}</span>
              {weekDaysCompleted === 7 && <CheckCircle2 className="w-3 h-3 text-[#3C4E53]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function CoachingPlanDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('id') || 'renewed-strength';
  const initialDay = (() => {
    const urlDay = searchParams.get('day');
    if (urlDay) return parseInt(urlDay, 10);
    try {
      const saved = localStorage.getItem(`coaching_progress_${planId}`);
      if (saved) {
        const p = JSON.parse(saved);
        const completedCount = p.completed_days?.length || 0;
        if (completedCount > 0) return completedCount + 1;
      }
    } catch {}
    return 1;
  })();

  const [user, setUser] = useState(null);
  const [currentDay, setCurrentDay] = useState(initialDay);
  const [taskState, setTaskState] = useState({});
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutForModal, setWorkoutForModal] = useState(null);
  const [dayComplete, setDayComplete] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [currentWeekView, setCurrentWeekView] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [showMeditationPlayer, setShowMeditationPlayer] = useState(false);

  const { data: mealLogs = [] } = useQuery({
    queryKey: ['mealLogs', currentDay],
    queryFn: () => base44.entities.MealLog.list('-created_date', 50) || [],
    enabled: !!user
  });

  const handleAbandonPlan = () => {
    if (window.confirm('Are you sure you want to abandon this plan? Your progress will be reset.')) {
      localStorage.removeItem(`coaching_progress_${planId}`);
      window.location.reload();
    }
  };

  const plan = COACHING_PLANS.find(p => p.id === planId) || COACHING_PLANS[0];
  const dayData = plan.days.find(d => d.day === currentDay || d.number === currentDay) || plan.days[currentDay - 1];
  const weekTheme = (plan.week_themes || []).find(w => w.week === dayData?.week) || {
    week: dayData?.week || 1,
    theme: 'Week',
    title: 'Growth',
    color: 'from-[#3C4E53] to-[#FD9C2D]',
    emoji: '✨'
  };

  // Progress state
  const [progress, setProgress] = useState(() => getProgress(planId));

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    const p = getProgress(planId);
    setProgress(p);
    setDayComplete(p.completed_days?.includes(currentDay) || false);
    // Build task state from stored progress
    const tasks = {};
    ['bible', 'workout', 'nutrition', 'meditation', 'journal', 'affirmation', 'growth'].forEach(key => {
      tasks[key] = !!p.task_completions?.[`${currentDay}_${key}`];
    });
    setTaskState(tasks);
    setCurrentWeekView(dayData?.week || 1);
  }, [currentDay, planId]);

  const handleToggleTask = (key) => {
    const newVal = toggleTask(planId, currentDay, key);
    setTaskState(prev => ({ ...prev, [key]: newVal }));
    const updatedProgress = getProgress(planId);
    setProgress(updatedProgress);
  };

  const completedTaskCount = Object.values(taskState).filter(Boolean).length;
  const totalTasks = dayData?.meditation ? 7 : 6;
  const allTasksDone = completedTaskCount === totalTasks;

  const handleCompleteDay = () => {
    markDayComplete(planId, currentDay);
    const updated = getProgress(planId);
    setProgress(updated);
    setDayComplete(true);
    setCelebrating(true);
    toast.success(`Day ${currentDay} complete! 🎉 Well done.`);
    setTimeout(() => {
      setCelebrating(false);
      if (currentDay < plan.days_total) {
        setCurrentDay(currentDay + 1);
      }
    }, 2200);
  };

  const handleWeekSelect = (week) => {
    setCurrentWeekView(week);
    const firstDayOfWeek = (week - 1) * 7 + 1;
    setCurrentDay(firstDayOfWeek);
  };

  const handleStartWorkout = () => {
    const workout = PREMADE_WORKOUTS.find(w => w.id === dayData.workout?.premade_id);
    if (workout) {
      setWorkoutForModal(workout);
      setShowWorkoutModal(true);
    } else {
      navigate(createPageUrl('Workouts'));
    }
  };

  if (!dayData) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
        <p className="text-[#0A1A2F]/50 dark:text-white/50">Day not found.</p>
      </div>
    );
  }

  const bibleUrl = createPageUrl(`Bible?book=${encodeURIComponent(dayData.bible.book)}&chapter=${dayData.bible.chapter}`);
  const journalUrl = createPageUrl('GratitudeJournalPage');
  const nutritionUrl = createPageUrl('Nutrition');
  const growthUrl = dayData.personal_growth_page ? createPageUrl(dayData.personal_growth_page) : createPageUrl('PersonalGrowth');

  const completedDays = progress.completed_days?.length || 0;

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* Coach Paul */}
      {user && <ChatButton bot="CoachPaul" />}

       {/* Workout Modal */}
        {showWorkoutModal && workoutForModal && user && (
          <StartWorkoutModal
            isOpen={showWorkoutModal}
            onClose={() => setShowWorkoutModal(false)}
            workout={workoutForModal}
            user={user}
            onComplete={() => {
              setShowWorkoutModal(false);
              handleToggleTask('workout');
            }}
          />
        )}

        {/* Meditation Player Modal */}
        {showMeditationPlayer && dayData?.meditation && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-white/5 rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto">
              <GuidedMeditationPlayer
                meditation={dayData.meditation}
                onClose={() => {
                  setShowMeditationPlayer(false);
                  handleToggleTask('meditation');
                }}
              />
            </div>
          </div>
        )}

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#3C4E53]/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white dark:bg-white/5 rounded-3xl p-8 mx-6 text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-[#3C4E53] mb-2">Day {currentDay} Complete!</h2>
              <p className="text-[#0A1A2F]/60 dark:text-white/60 text-sm">
                {completedDays + 1} days down. {plan.days_total - completedDays - 1} to go.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day picker overlay */}
      <AnimatePresence>
        {showDayPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0A1A2F]/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowDayPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full bg-white dark:bg-white/5 rounded-t-3xl max-h-[75vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
                <h3 className="font-bold text-[#0A1A2F] dark:text-white dark:text-white">Choose a Day</h3>
                <button onClick={() => setShowDayPicker(false)}
                  className="w-8 h-8 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
                  <X className="w-4 h-4 text-[#0A1A2F]/60 dark:text-white/60" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-4">
                {(plan.week_themes && plan.week_themes.length > 0
                  ? plan.week_themes
                  : Array.from({ length: Math.ceil(plan.days_total / 7) }, (_, i) => ({
                      week: i + 1, emoji: '📅', title: `Week ${i + 1}`
                    }))
                ).map(wt => (
                  <div key={wt.week}>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${wt.week === dayData.week ? 'text-[#3C4E53]' : 'text-[#0A1A2F]/40 dark:text-white/40'}`}>
                      {wt.emoji} Week {wt.week} — {wt.title}
                    </p>
                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: 7 }, (_, i) => {
                        const dayNum = (wt.week - 1) * 7 + i + 1;
                        const isDone = progress.completed_days?.includes(dayNum);
                        const isActive = dayNum === currentDay;
                        const isSabbath = i === 6;
                        return (
                          <button
                            key={dayNum}
                            onClick={() => { setCurrentDay(dayNum); setShowDayPicker(false); }}
                            className={`aspect-square rounded-xl text-sm font-bold flex items-center justify-center transition-all border ${
                              isActive ? 'bg-[#3C4E53] text-white border-[#3C4E53]/30 shadow-md dark:shadow-none' :
                              isDone ? 'bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#3C4E53] border-[#3C4E53]/30/20' :
                              isSabbath ? 'bg-[#FFF9EC] text-[#c9a227] border-[#c9a227]/20' :
                              'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#0A1A2F]/8 hover:border-[#3C4E53]/30/30'
                            }`}
                          >
                            {isDone ? '✓' : dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky header */}
       <div className="sticky top-0 z-30 bg-white dark:bg-white/5 border-b border-gray-100 dark:border-white/10 px-4 py-3">
         <div className="max-w-2xl mx-auto flex items-center gap-3">
           <Link to={createPageUrl('CoachingPlans')}
             className="w-9 h-9 rounded-full bg-white dark:bg-white/5 hover:bg-white dark:bg-white/5 flex items-center justify-center transition-colors flex-shrink-0">
             <ArrowLeft className="w-4 h-4 text-[#3C4E53]" />
           </Link>
           <div className="flex-1 min-w-0">
             <h1 className="text-sm font-bold text-[#0A1A2F] dark:text-white truncate">{plan.title}</h1>
             <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">Day {currentDay} of {plan.days_total}</p>
           </div>
           <button onClick={() => setShowDayPicker(true)}
             className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] border border-[#3C4E53]/30/15 text-xs font-bold text-[#3C4E53] hover:bg-white dark:bg-white/5 transition-colors">
             <List className="w-3.5 h-3.5" />
             Day {currentDay}
           </button>
           <div className="relative">
             <button 
               onClick={() => setShowMenu(!showMenu)}
               className="w-9 h-9 rounded-full bg-white dark:bg-white/5 hover:bg-white dark:bg-white/5 flex items-center justify-center transition-colors">
               <MoreVertical className="w-4 h-4 text-[#3C4E53]" />
             </button>
             {showMenu && (
               <button
                 onClick={() => {
                   handleAbandonPlan();
                   setShowMenu(false);
                 }}
                 className="absolute top-full right-0 mt-2 bg-white dark:bg-white/5 border border-red-200 rounded-lg shadow-lg dark:shadow-none px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:bg-red-900/20 whitespace-nowrap"
               >
                 ✕ Abandon Plan
               </button>
             )}
           </div>
         </div>
       </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-4">

        {/* Legal disclaimer banner for plans with disclaimers */}
        {plan.disclaimer && (
          <div className="mb-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl px-4 py-2.5">
            <p className="text-[10px] text-amber-800 leading-relaxed"><strong>Disclaimer:</strong> {plan.disclaimer}</p>
          </div>
        )}

        {/* Week navigation */}
        <div className="mb-4">
          <WeekNav currentWeek={dayData.week} weeks={8} onSelectWeek={handleWeekSelect} planId={planId} weekThemes={plan.week_themes} />
        </div>

        {/* Day header card */}
        <motion.div
          key={`day-header-${currentDay}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${weekTheme.color} rounded-2xl p-5 mb-4 relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                    Week {dayData.week} · Day {currentDay}
                  </span>
                  {dayComplete && (
                    <span className="flex items-center gap-1 text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>
                <h2 className="text-white font-bold text-xl leading-tight">{dayData.title}</h2>
                <p className="text-white/70 text-sm mt-1">{weekTheme.emoji} {weekTheme.theme}: {weekTheme.title}</p>
              </div>
              <span className="text-4xl ml-2 flex-shrink-0">{weekTheme.emoji}</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3">
              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-white/70 rounded-full transition-all"
                  style={{ width: `${(completedTaskCount / totalTasks) * 100}%` }} />
              </div>
              <p className="text-white/50 text-[10px] mt-1">{completedTaskCount}/{totalTasks} tasks complete</p>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <motion.div
          key={`day-sections-${currentDay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >

          {/* 1. Bible Reading */}
          <SectionCard title="Scripture & Devotion" icon={BookOpen} color="bg-[#FFF9EC]" accentColor="#c9a227">
            <div className="space-y-3">
              <div className="p-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl border border-[#c9a227]/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a227] mb-1">Today's Reading</p>
                <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">
                  {dayData.bible.book} {dayData.bible.chapter}:{dayData.bible.verse_range}
                </p>
              </div>
              <div className="p-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl border border-[#c9a227]/15">
                <p className="text-xs font-semibold text-[#c9a227] mb-2 italic leading-relaxed">
                  {dayData.bible.key_verse}
                </p>
              </div>
              <p className="text-sm text-[#0A1A2F]/70 dark:text-white/70 leading-relaxed">{dayData.bible.devotion}</p>
              <div className="p-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#3C4E53] mb-1">Reflection Question</p>
                <p className="text-sm text-[#0A1A2F]/75 dark:text-white/75 italic">{dayData.bible.reflection_q}</p>
              </div>
              <TaskRow
                label={`Read ${dayData.bible.book} ${dayData.bible.chapter}`}
                done={taskState.bible}
                onToggle={() => handleToggleTask('bible')}
                linkTo={bibleUrl}
                linkLabel="Open Bible"
              />
            </div>
          </SectionCard>

          {/* 2. Workout */}
          <SectionCard title="Today's Workout" icon={Dumbbell} color="bg-[#F2F6FA] dark:bg-[#0A1A2F]" accentColor="#0EA5E9">
            <div className="space-y-3">
              {(() => {
                const workout = PREMADE_WORKOUTS.find(w => w.id === dayData.workout.premade_id);
                  if (!user) {
                    return (
                      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
                      </div>
                    );
                  }

                return (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl border border-[#BAE6FD]/40">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FD9C2D] to-[#38BDF8] flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">{workout?.title || dayData.workout.workout_title}</p>
                        <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">{workout?.duration_minutes} min · {workout?.difficulty}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-[#FD9C2D]/8 rounded-xl border border-[#FD9C2D]/15">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#FD9C2D] mb-1">Coach's Motivation</p>
                      <p className="text-sm text-[#0A1A2F]/75 dark:text-white/75 italic">{dayData.workout.motivational_tip}</p>
                    </div>
                    {dayData.workout.coach_note && (
                      <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 leading-relaxed px-1">💡 {dayData.workout.coach_note}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={handleStartWorkout}
                        className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white font-bold rounded-xl"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-1.5" /> Start Workout
                      </Button>
                      <button
                        onClick={() => handleToggleTask('workout')}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                          taskState.workout
                            ? 'bg-[#3C4E53] text-white border-[#3C4E53]/30'
                            : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#0A1A2F]/15 hover:border-[#3C4E53]/30/40'
                        }`}
                      >
                        {taskState.workout ? '✓ Done' : 'Mark Done'}
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </SectionCard>

          {/* 3. Nutrition / Financial Habit */}
          <SectionCard
            title={plan.category === 'financial' ? 'Financial Habit' : 'Nutrition Focus'}
            icon={plan.category === 'financial' ? Star : Utensils}
            color={plan.category === 'financial' ? 'bg-[#FFF9EC]' : 'bg-white dark:bg-white/5'}
            accentColor={plan.category === 'financial' ? '#c9a227' : '#22856A'}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white bg-[#3C4E53] px-2.5 py-1 rounded-full">{dayData.nutrition.focus}</span>
                <span className="text-xs font-semibold text-[#3C4E53] bg-[#3C4E53]/10 px-2.5 py-1 rounded-full">{dayData.nutrition.meal_theme}</span>
              </div>
              <div className="p-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl border border-[#3C4E53]/30/12">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#3C4E53] mb-1.5">
                  {plan.category === 'financial' ? "Today's Practice" : "Today's Meal Plan"}
                </p>
                <p className="text-sm text-[#0A1A2F]/70 dark:text-white/70 leading-relaxed">{dayData.nutrition.plan}</p>
              </div>
              <div className="flex items-start gap-2 p-3 bg-[#c9a227]/8 rounded-xl border border-[#c9a227]/15">
                <span className="text-base flex-shrink-0">💡</span>
                <p className="text-xs text-[#0A1A2F]/70 dark:text-white/70 leading-relaxed">{dayData.nutrition.tip}</p>
              </div>

              {/* Meal Logging — only show for non-financial plans */}
              {plan.category !== 'financial' && (
                <div className="pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#3C4E53] mb-2">Log Your Meals</p>
                  <MealLoggingSection
                    nutritionPlan={dayData.nutrition.plan}
                    mealLogs={mealLogs}
                    date={new Date()}
                    onMealLogged={() => {
                      toast.success('Meal logged! Great job tracking your nutrition.');
                    }}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <TaskRow
                  label={plan.category === 'financial' ? 'Complete today\'s financial habit' : 'Log your meals today'}
                  done={taskState.nutrition}
                  onToggle={() => handleToggleTask('nutrition')}
                  linkTo={plan.category === 'financial' ? createPageUrl('PersonalGrowth') : nutritionUrl}
                  linkLabel={plan.category === 'financial' ? 'Open' : 'Log Food'}
                />
              </div>
              {plan.category !== 'financial' && dayData.nutrition.recipe_search && (
                <Link
                  to={createPageUrl('DiscoverRecipes')}
                  className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-xl border border-[#3C4E53]/30/12 hover:border-[#3C4E53]/30/30 transition-colors"
                >
                  <span className="text-xs font-semibold text-[#3C4E53]">Find recipes for today</span>
                  <ChevronRight className="w-4 h-4 text-[#3C4E53]" />
                </Link>
              )}
            </div>
          </SectionCard>

          {/* 4. Meditation */}
          {dayData.meditation && (
            <SectionCard title="Guided Meditation" icon={Wind} color="bg-[#F2F6FA] dark:bg-[#0A1A2F]" accentColor="#AFC7E3">
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-[#AFC7E3]/15 to-[#3C4E53]/5 rounded-xl border border-[#AFC7E3]/25">
                  <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white mb-1">{dayData.meditation.title}</p>
                  <p className="text-xs text-[#0A1A2F]/70 dark:text-white/70">{dayData.meditation.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMeditationPlayer(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#AFC7E3] to-[#AFC7E3] text-white font-bold rounded-xl hover:shadow-md dark:shadow-none transition-shadow text-sm"
                  >
                    <Play className="w-4 h-4" /> Start Meditation
                  </button>
                  <button
                    onClick={() => handleToggleTask('meditation')}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      taskState.meditation
                        ? 'bg-[#3C4E53] text-white border-[#3C4E53]/30'
                        : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#0A1A2F]/15 hover:border-[#3C4E53]/30/40'
                    }`}
                  >
                    {taskState.meditation ? '✓ Done' : 'Mark Done'}
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

          {/* 5. Journal */}
           <SectionCard title="Journal Prompt" icon={Brain} color="bg-white dark:bg-white/5" accentColor="#AFC7E3">
             <div className="space-y-3">
               <div className="p-4 bg-gradient-to-br from-[#AFC7E3]/15 to-[#3C4E53]/5 rounded-xl border border-[#AFC7E3]/25">
                 <p className="text-sm text-[#0A1A2F]/80 dark:text-white/80 leading-relaxed italic">
                   "{dayData.journal.prompt}"
                 </p>
               </div>
               <TaskRow
                 label="Write your journal entry"
                 done={taskState.journal}
                 onToggle={() => handleToggleTask('journal')}
                 linkTo={journalUrl}
                 linkLabel="Open Journal"
               />
               <Link to={createPageUrl('MyJournalEntries')}
                 className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-xl border border-[#AFC7E3]/25 hover:border-[#AFC7E3]/50 transition-colors">
                 <span className="text-xs font-semibold text-[#3C4E53]">View past entries</span>
                 <ChevronRight className="w-4 h-4 text-[#3C4E53]" />
               </Link>
             </div>
           </SectionCard>

          {/* 5. Affirmation */}
          <SectionCard title="Today's Affirmation" icon={Sparkles} color="bg-[#FFF9EC]" accentColor="#c9a227">
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-[#c9a227]/10 to-[#FAD98D]/5 rounded-xl border border-[#c9a227]/20 text-center">
                <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white leading-relaxed italic">
                  "{dayData.affirmation}"
                </p>
              </div>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 text-center px-2">
                Speak this aloud 3 times — once when you read it, once before your workout, once before bed.
              </p>
              <TaskRow
                label="Speak today's affirmation"
                done={taskState.affirmation}
                onToggle={() => handleToggleTask('affirmation')}
                linkTo={createPageUrl('AffirmationsPage')}
                linkLabel="All Affirmations"
              />
            </div>
          </SectionCard>

          {/* 6. Personal Growth */}
          <SectionCard title="Personal Growth" icon={Star} color="bg-[#F2F6FA] dark:bg-[#0A1A2F]" accentColor="#AFC7E3" defaultOpen={false}>
            <div className="space-y-3">
              <p className="text-sm text-[#0A1A2F]/65 dark:text-white/65 leading-relaxed">
                Continue your growth work today with a connected exercise from the Personal Growth section.
              </p>
              <TaskRow
                label={`Open: ${dayData.personal_growth_label || 'Personal Growth'}`}
                done={taskState.growth}
                onToggle={() => handleToggleTask('growth')}
                linkTo={growthUrl}
                linkLabel="Open"
              />
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Guided Meditation', page: 'GuidedMeditationsPage', emoji: '🧘' },
                  { label: 'Habit Builder', page: 'HabitBuilderPage', emoji: '✅' },
                  { label: 'Emotional Check-In', page: 'EmotionalCheckInPage', emoji: '❤️' },
                  { label: 'Mindset Reset', page: 'MindsetResetPage', emoji: '🧠' },
                ].map(({ label, page, emoji }) => (
                  <Link key={page} to={createPageUrl(page)}
                    className="flex items-center gap-2 p-2.5 bg-white dark:bg-white/5 rounded-xl border border-[#AFC7E3]/20 hover:border-[#AFC7E3]/40 transition-colors">
                    <span className="text-base">{emoji}</span>
                    <span className="text-xs font-semibold text-[#0A1A2F]/70 dark:text-white/70">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </SectionCard>

        </motion.div>

        {/* Day navigation */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => currentDay > 1 && setCurrentDay(currentDay - 1)}
            disabled={currentDay <= 1}
            className="w-11 h-11 rounded-full bg-white dark:bg-white/5 border border-[#3C4E53]/30/15 flex items-center justify-center disabled:opacity-30 hover:border-[#3C4E53]/30/40 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#3C4E53]" />
          </button>

          <div className="flex-1">
            {dayComplete ? (
              <button
                onClick={() => currentDay < plan.days_total && setCurrentDay(currentDay + 1)}
                disabled={currentDay >= plan.days_total}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3C4E53] to-[#FD9C2D] text-white font-bold text-sm disabled:opacity-50 shadow-md dark:shadow-none"
              >
                {currentDay < plan.days_total ? `→ Day ${currentDay + 1}` : '🎉 Plan Complete!'}
              </button>
            ) : (
              <button
                onClick={handleCompleteDay}
                className={`w-full py-3 rounded-xl font-bold text-sm shadow-md dark:shadow-none transition-all ${
                  allTasksDone
                    ? 'bg-gradient-to-r from-[#3C4E53] to-[#c9a227] text-white shadow-[#3C4E53]/30'
                    : 'bg-white dark:bg-white/5 border border-[#3C4E53]/30/20 text-[#3C4E53]'
                }`}
              >
                {allTasksDone
                  ? '✓ Complete Day ' + currentDay
                  : `Complete Day (${completedTaskCount}/${totalTasks} tasks)`}
              </button>
            )}
          </div>

          <button
            onClick={() => currentDay < plan.days_total && setCurrentDay(currentDay + 1)}
            disabled={currentDay >= plan.days_total}
            className="w-11 h-11 rounded-full bg-white dark:bg-white/5 border border-[#3C4E53]/30/15 flex items-center justify-center disabled:opacity-30 hover:border-[#3C4E53]/30/40 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#3C4E53]" />
          </button>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Days Done', value: completedDays, icon: CheckCircle2, color: 'text-[#3C4E53]', bg: 'bg-[#F2F6FA] dark:bg-[#0A1A2F]' },
            { label: 'Streak', value: (() => {
              const completed = progress.completed_days || [];
              if (completed.length === 0) return 0;
              const maxCompleted = Math.max(...completed);
              let streak = 0;
              for (let d = maxCompleted; d >= 1; d--) {
                if (completed.includes(d)) streak++;
                else break;
              }
              return streak;
            })(), icon: Trophy, color: 'text-[#c9a227]', bg: 'bg-[#FFF9EC]' },
            { label: 'Remaining', value: plan.days_total - completedDays, icon: Calendar, color: 'text-[#0EA5E9]', bg: 'bg-[#F2F6FA] dark:bg-[#0A1A2F]' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
              <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-[#0A1A2F]/45 dark:text-white/45">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}