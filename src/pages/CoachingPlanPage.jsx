import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, BookOpen, Dumbbell, Utensils, Brain,
  ChevronRight, ChevronLeft, CheckCircle2,
  Star,
  Play, ExternalLink, Quote,
  ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import { prosperityRevivedPlan, PLAN_ID } from '@/components/journey/CoachingPlanData';

const STORAGE_KEY = `coaching_progress_${PLAN_ID}`;

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

const PILLAR_CONFIG = {
  devotion: {
    icon: BookOpen, color: '#c9a227', bg: 'bg-[#c9a227]/10',
    border: 'border-[#c9a227]/20', label: 'Daily Devotion', emoji: '📖',
    gradient: 'from-[#c9a227] to-[#FAD98D]'
  },
  workout: {
    icon: Dumbbell, color: '#38BDF8', bg: 'bg-[#38BDF8]/10',
    border: 'border-[#38BDF8]/20', label: 'Workout', emoji: '💪',
    gradient: 'from-[#38BDF8] to-[#0EA5E9]'
  },
  nutrition: {
    icon: Utensils, color: '#22C55E', bg: 'bg-[#22C55E]/10',
    border: 'border-[#22C55E]/20', label: 'Nutrition', emoji: '🥗',
    gradient: 'from-[#22C55E] to-[#22c55e]'
  },
  growth: {
    icon: Brain, color: '#a78bfa', bg: 'bg-[#a78bfa]/10',
    border: 'border-[#a78bfa]/20', label: 'Personal Growth', emoji: '🧠',
    gradient: 'from-[#a78bfa] to-[#8B5CF6]'
  },
};

const WEEK_COLORS = [
  'from-[#0A1A2F] to-[#0A1A2F]',
  'from-[#0A1A2F] to-[#2d5a8e]',
  'from-[#2d5a8e] to-[#3C4E53]',
  'from-[#3C4E53] to-[#0A1A2F]',
  'from-[#c9a227] to-[#0A1A2F]',
  'from-[#0A1A2F] to-[#c9a227]',
  'from-[#FAD98D] to-[#0A1A2F]',
  'from-[#c9a227] to-[#FAD98D]',
];

export default function CoachingPlanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [progress, setProgress] = useState(loadProgress);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [expandedPillar, setExpandedPillar] = useState(null);
  const [view, setView] = useState('plan'); // 'plan' | 'day'

  const plan = prosperityRevivedPlan;

  // Calculate current day from progress
  const completedDays = Object.keys(progress).filter(k => k.startsWith('day_') && progress[k]?.completed).length;
  const currentDay = Math.min(completedDays + 1, plan.totalDays);

  // Handle ?day= param
  useEffect(() => {
    const dayParam = parseInt(searchParams.get('day'));
    if (dayParam && dayParam >= 1 && dayParam <= plan.totalDays) {
      const weekIdx = Math.floor((dayParam - 1) / 7);
      setSelectedWeek(weekIdx);
      openDay(dayParam);
    } else {
      // Default to current week
      setSelectedWeek(Math.floor((currentDay - 1) / 7));
    }
  }, [searchParams]);

  function openDay(dayNum) {
    // Find day data across all weeks
    for (const week of plan.weeks) {
      const d = week.days.find(d => d.day === dayNum);
      if (d) {
        setSelectedDay(d);
        setView('day');
        setExpandedPillar('devotion');
        return;
      }
    }
  }

  function togglePillar(dayNum, pillar) {
    setProgress(prev => {
      const key = `day_${dayNum}`;
      const existing = prev[key] || {};
      const pillars = existing.pillars || {};
      const newPillars = { ...pillars, [pillar]: !pillars[pillar] };
      const allDone = ['devotion', 'workout', 'nutrition', 'growth'].every(p => newPillars[p]);
      const updated = { ...prev, [key]: { ...existing, pillars: newPillars, completed: allDone } };
      saveProgress(updated);
      return updated;
    });
  }

  function markDayComplete(dayNum) {
    setProgress(prev => {
      const key = `day_${dayNum}`;
      const existing = prev[key] || {};
      const allPillars = { devotion: true, workout: true, nutrition: true, growth: true };
      const updated = { ...prev, [key]: { ...existing, pillars: allPillars, completed: true } };
      saveProgress(updated);
      return updated;
    });
  }

  const overallPct = Math.round((completedDays / plan.totalDays) * 100);

  // ── Day View ──────────────────────────────────────────────────────────────
  if (view === 'day' && selectedDay) {
    const dayKey = `day_${selectedDay.day}`;
    const dayProgress = progress[dayKey] || {};
    const todayPillars = dayProgress.pillars || {};
    const pillarsCompleted = Object.values(todayPillars).filter(Boolean).length;
    const weekIdx = Math.floor((selectedDay.day - 1) / 7);
    const week = plan.weeks[weekIdx];
    const isCurrentDay = selectedDay.day === currentDay;
    const isPastDay = selectedDay.day < currentDay;
    const isFutureDay = selectedDay.day > currentDay;

    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[#0A1A2F] border-b border-white/10">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <button onClick={() => setView('plan')} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div className="text-center">
              <p className="text-white font-bold text-sm">Day {selectedDay.day}</p>
              <p className="text-white/40 text-xs">{week?.theme}</p>
            </div>
            <div className="text-right">
              <p className="text-[#c9a227] font-bold text-sm">{pillarsCompleted}/4</p>
              <p className="text-white/30 text-[10px]">done</p>
            </div>
          </div>
          {/* Progress strip */}
          <div className="h-0.5 bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D]"
              animate={{ width: `${(pillarsCompleted / 4) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

          {/* Future day lock notice */}
          {isFutureDay && (
            <div className="bg-white/50 border border-[#FAD98D]/30 rounded-2xl p-4 text-center">
              <Lock className="w-6 h-6 text-[#c9a227]/50 mx-auto mb-1" />
              <p className="text-[#0A1A2F]/50 dark:text-white/50 text-sm">This day unlocks when you reach it — complete Day {selectedDay.day - 1} first</p>
            </div>
          )}

          {/* Hero card with verse */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${WEEK_COLORS[weekIdx]} rounded-2xl p-5 relative overflow-hidden`}
          >
            <div className="absolute top-4 right-4 opacity-5">
              <Quote className="w-20 h-20 text-white" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#c9a227] uppercase tracking-widest">Day {selectedDay.day}</span>
              <span className="text-white/20">·</span>
              <span className="text-white/50 text-xs">Week {weekIdx + 1}: {week?.theme}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3 leading-tight">{selectedDay.devotion.title}</h1>
            <p className="text-[#c9a227]/90 text-sm italic leading-relaxed mb-2">"{selectedDay.devotion.verse}"</p>
            <p className="text-white/50 text-xs">— {selectedDay.devotion.ref}</p>

            {/* Day progress bar */}
            <div className="flex gap-1 mt-4">
              {[0,1,2,3].map(i => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < pillarsCompleted ? 'bg-[#c9a227]' : 'bg-white/15'}`} />
              ))}
            </div>
          </motion.div>

          {/* Devotion */}
          <PillarCard
            pillarKey="devotion"
            data={selectedDay.devotion}
            done={!!todayPillars.devotion}
            expanded={expandedPillar === 'devotion'}
            onToggleExpand={() => setExpandedPillar(p => p === 'devotion' ? null : 'devotion')}
            onToggleDone={() => togglePillar(selectedDay.day, 'devotion')}
            locked={isFutureDay}
          >
            <div className="space-y-3">
              <p className="text-[#0A1A2F]/80 dark:text-white/80 text-sm leading-relaxed">{selectedDay.devotion.body}</p>
              <div className="bg-[#c9a227]/8 border border-[#c9a227]/15 rounded-xl p-3">
                <p className="text-[10px] font-bold text-[#c9a227] uppercase tracking-wider mb-1.5">Prayer</p>
                <p className="text-[#0A1A2F]/70 dark:text-white/70 text-sm italic leading-relaxed">{selectedDay.devotion.prayer}</p>
              </div>
              <Link to={createPageUrl('Bible') + `?book=${encodeURIComponent(selectedDay.devotion.book)}&chapter=${selectedDay.devotion.ch}`}>
                <Button size="sm" className="w-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white">
                  <BookOpen className="w-3.5 h-3.5 mr-2" />
                  Read {selectedDay.devotion.book} {selectedDay.devotion.ch} in Bible
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </Button>
              </Link>
              <Link to={createPageUrl('Plans')}>
                <button className="w-full text-xs text-[#c9a227] flex items-center justify-center gap-1 py-1 hover:opacity-80">
                  <span>Browse Reading Plans</span><ChevronRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </PillarCard>

          {/* Workout */}
          <PillarCard
            pillarKey="workout"
            data={selectedDay.workout}
            done={!!todayPillars.workout}
            expanded={expandedPillar === 'workout'}
            onToggleExpand={() => setExpandedPillar(p => p === 'workout' ? null : 'workout')}
            onToggleDone={() => togglePillar(selectedDay.day, 'workout')}
            locked={isFutureDay}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#38BDF8]/8 border border-[#38BDF8]/15 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">{selectedDay.workout.title}</p>
                  <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">{selectedDay.workout.duration} min · {selectedDay.workout.category}</p>
                </div>
              </div>
              <div className="bg-[#38BDF8]/5 rounded-xl p-3 border border-[#38BDF8]/10">
                <p className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider mb-1">Coach's Tip</p>
                <p className="text-[#0A1A2F]/70 dark:text-white/70 text-sm leading-relaxed">{selectedDay.workout.tip}</p>
              </div>
              <Link to={createPageUrl('Workouts')}>
                <Button size="sm" className="w-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white">
                  <Dumbbell className="w-3.5 h-3.5 mr-2" />
                  Start Workout
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link to={createPageUrl('WorkoutProgress')} className="flex-1">
                  <button className="w-full text-xs text-[#38BDF8] flex items-center justify-center gap-1 py-1 border border-[#38BDF8]/20 rounded-lg hover:bg-[#38BDF8]/5">
                    Progress <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
                <Link to={createPageUrl('WorkoutTrends')} className="flex-1">
                  <button className="w-full text-xs text-[#38BDF8] flex items-center justify-center gap-1 py-1 border border-[#38BDF8]/20 rounded-lg hover:bg-[#38BDF8]/5">
                    Trends <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          </PillarCard>

          {/* Nutrition */}
          <PillarCard
            pillarKey="nutrition"
            data={selectedDay.nutrition}
            done={!!todayPillars.nutrition}
            expanded={expandedPillar === 'nutrition'}
            onToggleExpand={() => setExpandedPillar(p => p === 'nutrition' ? null : 'nutrition')}
            onToggleDone={() => togglePillar(selectedDay.day, 'nutrition')}
            locked={isFutureDay}
          >
            <div className="space-y-3">
              <div className="p-3 bg-[#22C55E]/8 border border-[#22C55E]/15 rounded-xl">
                <p className="text-[10px] font-bold text-[#22c55e] uppercase tracking-wider mb-1">Today's Focus</p>
                <p className="text-[#0A1A2F] dark:text-white font-semibold text-sm">{selectedDay.nutrition.focus}</p>
              </div>
              <div className="p-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl">
                <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-wider mb-1">Recommended Meal</p>
                <p className="text-[#0A1A2F]/80 dark:text-white/80 text-sm leading-relaxed">{selectedDay.nutrition.meal}</p>
              </div>
              <div className="p-3 bg-[#22C55E]/5 rounded-xl border border-[#22C55E]/10">
                <p className="text-[10px] font-bold text-[#22c55e] uppercase tracking-wider mb-1">Food Log Tip</p>
                <p className="text-[#0A1A2F]/70 dark:text-white/70 text-sm leading-relaxed">{selectedDay.nutrition.logTip}</p>
              </div>
              <div className="p-3 bg-white dark:bg-white/5 border border-[#22C55E]/15 rounded-xl">
                <p className="text-[10px] font-bold text-[#22c55e] uppercase tracking-wider mb-1">Nutrition Insight</p>
                <p className="text-[#0A1A2F]/70 dark:text-white/70 text-sm leading-relaxed">{selectedDay.nutrition.tip}</p>
              </div>
              <div className="flex gap-2">
                <Link to={createPageUrl('Nutrition')} className="flex-1">
                  <Button size="sm" className="w-full bg-gradient-to-r from-[#22C55E] to-[#22c55e] text-white text-xs">
                    <Utensils className="w-3 h-3 mr-1.5" /> Log Food
                  </Button>
                </Link>
                <Link to={createPageUrl('DiscoverRecipes')} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full border-[#22C55E]/30 text-[#22c55e] text-xs hover:bg-[#22C55E]/5">
                    Find Recipes
                  </Button>
                </Link>
              </div>
              <Link to={createPageUrl('NutritionGuidance')}>
                <button className="w-full text-xs text-[#22c55e] flex items-center justify-center gap-1 py-1 hover:opacity-80">
                  Nutrition Guidance <ChevronRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </PillarCard>

          {/* Growth */}
          <PillarCard
            pillarKey="growth"
            data={selectedDay.growth}
            done={!!todayPillars.growth}
            expanded={expandedPillar === 'growth'}
            onToggleExpand={() => setExpandedPillar(p => p === 'growth' ? null : 'growth')}
            onToggleDone={() => togglePillar(selectedDay.day, 'growth')}
            locked={isFutureDay}
          >
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-[#a78bfa]/10 to-[#8B5CF6]/5 border border-[#a78bfa]/20 rounded-xl">
                <p className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-wider mb-2">Journal Prompt</p>
                <p className="text-[#0A1A2F]/80 dark:text-white/80 text-sm leading-relaxed font-medium italic">"{selectedDay.growth.journalPrompt}"</p>
              </div>
              <div className="p-3 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl">
                <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-wider mb-1">Today's Reflection</p>
                <p className="text-[#0A1A2F]/70 dark:text-white/70 text-sm leading-relaxed">{selectedDay.growth.reflection}</p>
              </div>
              <div className="p-3 bg-[#a78bfa]/5 border border-[#a78bfa]/10 rounded-xl">
                <p className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-wider mb-1">Habit Action</p>
                <p className="text-[#0A1A2F]/70 dark:text-white/70 text-sm leading-relaxed">{selectedDay.growth.habit}</p>
              </div>
              <Link to={createPageUrl(selectedDay.growth.appLink)}>
                <Button size="sm" className="w-full bg-gradient-to-r from-[#a78bfa] to-[#8B5CF6] text-white">
                  <Brain className="w-3.5 h-3.5 mr-2" />
                  {selectedDay.growth.appLabel}
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link to={createPageUrl('MyJournalEntries')} className="flex-1">
                  <button className="w-full text-xs text-[#a78bfa] flex items-center justify-center gap-1 py-1 border border-[#a78bfa]/20 rounded-lg hover:bg-[#a78bfa]/5">
                    My Journal <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
                <Link to={createPageUrl('HabitBuilderPage')} className="flex-1">
                  <button className="w-full text-xs text-[#a78bfa] flex items-center justify-center gap-1 py-1 border border-[#a78bfa]/20 rounded-lg hover:bg-[#a78bfa]/5">
                    Habits <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          </PillarCard>

          {/* Complete Day Button */}
          {!isFutureDay && !dayProgress.completed && (
            <button
              onClick={() => markDayComplete(selectedDay.day)}
              className="w-full bg-gradient-to-r from-[#0A1A2F] to-[#0A1A2F] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg dark:shadow-none"
            >
              <CheckCircle2 className="w-5 h-5 text-[#c9a227]" />
              Mark Day {selectedDay.day} Complete
            </button>
          )}

          {dayProgress.completed && (
            <div className="bg-gradient-to-r from-[#c9a227]/15 to-[#FAD98D]/10 border border-[#c9a227]/30 rounded-2xl p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-[#c9a227] mx-auto mb-2" />
              <p className="text-[#0A1A2F] dark:text-white font-bold">Day {selectedDay.day} Complete!</p>
              <p className="text-[#0A1A2F]/50 dark:text-white/50 text-sm mt-0.5">Well done, faithful servant. 🏆</p>
              {selectedDay.day < plan.totalDays && (
                <button
                  onClick={() => openDay(selectedDay.day + 1)}
                  className="mt-3 text-[#c9a227] text-sm font-semibold flex items-center gap-1 mx-auto hover:opacity-80"
                >
                  Day {selectedDay.day + 1} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Day Navigation */}
          <div className="flex gap-2 pt-2">
            {selectedDay.day > 1 && (
              <button onClick={() => openDay(selectedDay.day - 1)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-white/5 border border-[#F2F6FA] rounded-xl text-sm text-[#0A1A2F]/60 dark:text-white/60 hover:bg-[#F2F6FA] dark:bg-[#0A1A2F]">
                <ChevronLeft className="w-4 h-4" /> Day {selectedDay.day - 1}
              </button>
            )}
            {selectedDay.day < plan.totalDays && (
              <button onClick={() => openDay(selectedDay.day + 1)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-white/5 border border-[#F2F6FA] rounded-xl text-sm text-[#0A1A2F]/60 dark:text-white/60 hover:bg-[#F2F6FA] dark:bg-[#0A1A2F]">
                Day {selectedDay.day + 1} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Plan Overview ─────────────────────────────────────────────────────────
  const activeWeek = plan.weeks[selectedWeek];

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#F2F6FA]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 flex items-center justify-center flex-shrink-0">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </button>
          <div className="flex-1">
            <p className="font-bold text-[#0A1A2F] dark:text-white text-sm leading-tight">Prosperity Revived</p>
            <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">8-Week Coaching Plan</p>
          </div>
          <div className="text-right">
            <p className="text-[#c9a227] font-bold text-sm">{overallPct}%</p>
            <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">complete</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0A1A2F] via-[#0A1A2F] to-[#c9a227] rounded-2xl p-6 mt-4 mb-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-[#c9a227] blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white dark:bg-white/5 blur-2xl" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-[#c9a227]" />
              <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest">Virtual Coaching Plan</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{plan.title}</h1>
            <p className="text-white/60 text-sm mb-4">{plan.subtitle}</p>
            <p className="text-white/50 text-xs leading-relaxed mb-5">{plan.description}</p>

            {/* Overall progress */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/50">Overall Progress</span>
                <span className="text-[#c9a227] font-bold">{completedDays}/{plan.totalDays} days</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPct}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            <button
              onClick={() => openDay(currentDay)}
              className="w-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4" />
              Continue — Day {currentDay}
            </button>
          </div>
        </motion.div>

        {/* What's Included */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {Object.entries(PILLAR_CONFIG).map(([key, cfg]) => (
            <div key={key} className={`${cfg.bg} border ${cfg.border} rounded-xl p-3 flex items-center gap-2.5`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${cfg.color}33, ${cfg.color}22)` }}>
                <span className="text-lg">{cfg.emoji}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1A2F] dark:text-white dark:text-white">{cfg.label}</p>
                <p className="text-[10px] text-[#0A1A2F]/50 dark:text-white/50">Daily · All 56 days</p>
              </div>
            </div>
          ))}
        </div>

        {/* Week Selector */}
        <div className="mb-4">
          <p className="text-xs font-bold text-[#0A1A2F]/50 dark:text-white/50 uppercase tracking-wider mb-3">Weeks</p>
          <div className="grid grid-cols-4 gap-2">
            {plan.weeks.map((week, i) => {
              const weekDays = week.days;
              const completedInWeek = weekDays.filter(d => progress[`day_${d.day}`]?.completed).length;
              const isCurrentWeek = Math.floor((currentDay - 1) / 7) === i;
              return (
                <button key={i} onClick={() => setSelectedWeek(i)}
                  className={`rounded-xl p-3 text-left transition-all border ${
                    selectedWeek === i
                      ? 'bg-[#0A1A2F] border-[#0A1A2F] shadow-md dark:shadow-none'
                      : 'bg-white dark:bg-white/5 border-[#F2F6FA] hover:border-[#FAD98D]/50'
                  }`}>
                  <p className={`text-[10px] font-bold mb-1 ${selectedWeek === i ? 'text-[#c9a227]' : 'text-[#0A1A2F]/40 dark:text-white/40'}`}>
                    Week {i + 1}
                  </p>
                  <p className={`text-xs font-bold leading-tight ${selectedWeek === i ? 'text-white' : 'text-[#0A1A2F] dark:text-white dark:text-white'}`}>
                    {week.theme}
                  </p>
                  <div className="mt-2 h-1 rounded-full overflow-hidden bg-white/10">
                    <div
                      className="h-full bg-[#c9a227] rounded-full transition-all"
                      style={{ width: `${(completedInWeek / weekDays.length) * 100}%` }}
                    />
                  </div>
                  <p className={`text-[9px] mt-1 ${selectedWeek === i ? 'text-white/40' : 'text-[#0A1A2F]/30 dark:text-white/30'}`}>
                    {completedInWeek}/{weekDays.length}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Week Detail */}
        {activeWeek && (
          <motion.div
            key={selectedWeek}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            {/* Week Header */}
            <div className={`bg-gradient-to-br ${WEEK_COLORS[selectedWeek]} rounded-2xl p-5 mb-3`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#c9a227] text-xs font-bold uppercase tracking-widest">Week {selectedWeek + 1}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{activeWeek.theme}</h2>
              <p className="text-white/60 text-sm mt-0.5">{activeWeek.subtitle}</p>
              <p className="text-white/40 text-xs mt-2 italic">"{activeWeek.tagline}"</p>
            </div>

            {/* Day Grid */}
            <div className="space-y-2">
              {activeWeek.days.map((d, i) => {
                const k = `day_${d.day}`;
                const done = progress[k]?.completed;
                const pillars = progress[k]?.pillars || {};
                const pillarsCount = Object.values(pillars).filter(Boolean).length;
                const isToday = d.day === currentDay;
                const isPast = d.day < currentDay;
                const isFuture = d.day > currentDay;

                return (
                  <motion.button
                    key={d.day}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => openDay(d.day)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all border ${
                      done ? 'bg-[#c9a227]/8 border-[#c9a227]/20' :
                      isToday ? 'bg-white dark:bg-white/5 border-[#c9a227]/40 shadow-sm dark:shadow-none' :
                      isPast ? 'bg-white/60 border-[#F2F6FA]' :
                      'bg-white dark:bg-white/5 border-[#F2F6FA] opacity-60'
                    }`}
                  >
                    {/* Day number */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-[#c9a227]' :
                      isToday ? 'bg-[#c9a227]/15 border-2 border-[#c9a227]' :
                      'bg-[#F2F6FA] dark:bg-[#0A1A2F]'
                    }`}>
                      {done
                        ? <CheckCircle2 className="w-5 h-5 text-white" />
                        : <span className={`text-sm font-bold ${isToday ? 'text-[#c9a227]' : 'text-[#0A1A2F]/50 dark:text-white/50'}`}>{d.day}</span>
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {isToday && <span className="text-[9px] font-bold text-[#c9a227] bg-[#c9a227]/15 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Today</span>}
                        <p className={`text-xs font-bold truncate ${done ? 'text-[#0A1A2F]/60 dark:text-white/60 line-through' : 'text-[#0A1A2F] dark:text-white dark:text-white'}`}>
                          {d.devotion.title}
                        </p>
                      </div>
                      <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 truncate">{d.devotion.ref} · {d.workout.duration}min {d.workout.category}</p>
                      {/* Pillar progress dots */}
                      {(isPast || isToday) && (
                        <div className="flex gap-1 mt-1.5">
                          {Object.keys(PILLAR_CONFIG).map(pk => (
                            <div key={pk} className={`w-2 h-2 rounded-full ${pillars[pk] ? 'bg-[#c9a227]' : 'bg-gray-100 dark:bg-white/5'}`} />
                          ))}
                        </div>
                      )}
                    </div>

                    {isFuture && !isPast
                      ? <Lock className="w-4 h-4 text-[#0A1A2F]/20 dark:text-white/20 flex-shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25 flex-shrink-0" />
                    }
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Pillar Card Component ──────────────────────────────────────────────────
function PillarCard({ pillarKey, data, done, expanded, onToggleExpand, onToggleDone, locked, children }) {
  const cfg = PILLAR_CONFIG[pillarKey];
  const Icon = cfg.icon;

  return (
    <div className={`bg-white dark:bg-white/5 rounded-2xl border transition-all shadow-sm dark:shadow-none overflow-hidden ${
      done ? `border-[${cfg.color}]/30` : 'border-[#F2F6FA]'
    }`}>
      <button
        onClick={onToggleExpand}
        disabled={locked}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          done ? `bg-gradient-to-br ${cfg.gradient}` : cfg.bg
        }`}>
          {done
            ? <CheckCircle2 className="w-5 h-5 text-white" />
            : <Icon className="w-5 h-5" style={{ color: locked ? '#ccc' : cfg.color }} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#0A1A2F] dark:text-white dark:text-white">{cfg.label}</p>
          <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 mt-0.5 truncate">
            {pillarKey === 'devotion' && data.ref}
            {pillarKey === 'workout' && `${data.duration} min · ${data.category}`}
            {pillarKey === 'nutrition' && data.focus}
            {pillarKey === 'growth' && 'Journaling + reflection'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!locked && (
            <button
              onClick={e => { e.stopPropagation(); onToggleDone(); }}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                done
                  ? 'border-transparent bg-gradient-to-br ' + cfg.gradient
                  : 'border-[#F2F6FA] hover:border-[#c9a227]/50'
              }`}
            >
              {done && <CheckCircle2 className="w-4 h-4 text-white" />}
            </button>
          )}
          {expanded
            ? <ChevronUp className="w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30" />
            : <ChevronDown className="w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30" />
          }
        </div>
      </button>

      <AnimatePresence>
        {expanded && !locked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[#F2F6FA]">
              <div className="pt-3">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
