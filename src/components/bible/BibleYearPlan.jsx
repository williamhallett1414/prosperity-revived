import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BIBLE_YEAR_PLAN } from './BibleYearPlanData';
import { BookOpen, CheckCircle2, Circle, ChevronRight, Loader2, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

function DayDetailModal({ day, progress, onClose, onMarkComplete }) {
  const [devotional, setDevotional] = useState(null);
  const [loading, setLoading] = useState(false);
  const isComplete = progress?.completed_days?.includes(day.day);

  useEffect(() => {
    loadDevotional();
  }, [day]);

  const loadDevotional = async () => {
    setLoading(true);
    const records = await base44.entities.BibleYearPlanDay.filter({ day_number: day.day });
    const record = records[0];
    if (record?.devotional_generated) {
      setDevotional(record);
      setLoading(false);
      return;
    }
    // Generate via AI
    const result = await base44.functions.invoke('generateDayDevotional', {
      day_id: record?.id,
      day_number: day.day,
      title: day.title,
      ot_readings: day.ot,
      nt_reading: day.nt,
      psalm_proverb: day.ps
    });
    setDevotional({ ...record, ...result.data });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-[#2d2d4a] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#3C4E53] text-white p-4 rounded-t-2xl sm:rounded-t-2xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[#FD9C2D] text-xs font-semibold uppercase tracking-wider mb-1">Bible in a Year</p>
              <h2 className="text-lg font-bold">{day.title}</h2>
            </div>
            {isComplete && <Badge className="bg-green-500 text-white shrink-0">Completed</Badge>}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Instructions */}
          <p className="text-gray-600 dark:text-gray-300 text-sm italic">{day.instructions}</p>

          {/* Readings */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
            <h3 className="font-bold text-[#3C4E53] dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#FD9C2D]" /> Today's Readings
            </h3>
            <div className="space-y-2">
              {day.ot.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#FD9C2D] shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">{r} <span className="text-gray-400 text-xs">(OT)</span></span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-200">{day.nt} <span className="text-gray-400 text-xs">(NT)</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-200">{day.ps}</span>
              </div>
            </div>
          </div>

          {/* Devotional */}
          {loading ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <Loader2 className="w-8 h-8 text-[#FD9C2D] animate-spin" />
              <p className="text-gray-500 text-sm">Preparing your devotional...</p>
            </div>
          ) : devotional ? (
            <div className="space-y-4">
              <div className="bg-[#3C4E53]/5 dark:bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#FD9C2D]" />
                  <h3 className="font-bold text-[#3C4E53] dark:text-white">{devotional.devotional_theme}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{devotional.devotional_text}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-blue-800 dark:text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">Reflection</p>
                <p className="text-gray-700 dark:text-gray-200 text-sm italic">{devotional.reflection_question}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
                <p className="text-amber-800 dark:text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">Prayer</p>
                <p className="text-gray-700 dark:text-gray-200 text-sm italic">"{devotional.prayer}"</p>
              </div>
            </div>
          ) : null}

          {/* Mark Complete Button */}
          <Button
            onClick={() => onMarkComplete(day.day)}
            disabled={isComplete}
            className={`w-full h-12 text-base font-semibold rounded-xl ${
              isComplete
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-[#FD9C2D] hover:bg-[#e8891a] text-white'
            }`}
          >
            {isComplete ? (
              <><CheckCircle2 className="w-5 h-5 mr-2" /> Day Completed!</>
            ) : (
              <><Circle className="w-5 h-5 mr-2" /> Mark as Complete</>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function BibleYearPlan() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: progressRecords = [] } = useQuery({
    queryKey: ['bible-year-progress', user?.email],
    queryFn: () => base44.entities.ReadingPlanProgress.filter({ plan_id: 'bible-in-a-year' }),
    enabled: !!user
  });

  const progress = progressRecords[0];
  const completedDays = progress?.completed_days || [];
  const totalCompleted = completedDays.length;
  const currentDay = progress?.current_day || 1;

  const startPlanMutation = useMutation({
    mutationFn: () => base44.entities.ReadingPlanProgress.create({
      plan_id: 'bible-in-a-year',
      plan_name: 'Bible in a Year',
      total_days: 365,
      current_day: 1,
      completed_days: [],
      started_date: new Date().toISOString().split('T')[0],
      current_streak: 0,
      longest_streak: 0,
      completion_dates: []
    }),
    onSuccess: () => queryClient.invalidateQueries(['bible-year-progress'])
  });

  const markCompleteMutation = useMutation({
    mutationFn: async (dayNum) => {
      const newCompleted = [...new Set([...completedDays, dayNum])];
      const today = new Date().toISOString().split('T')[0];
      const newDates = [...(progress.completion_dates || []), today];
      const newDay = Math.min(dayNum + 1, 365);
      await base44.entities.ReadingPlanProgress.update(progress.id, {
        completed_days: newCompleted,
        current_day: Math.max(progress.current_day, newDay),
        completion_dates: newDates
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bible-year-progress']);
      setSelectedDay(null);
    }
  });

  const pct = Math.round((totalCompleted / 365) * 100);

  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < 365; i += 7) {
    weeks.push(BIBLE_YEAR_PLAN.slice(i, i + 7));
  }

  if (!user) return null;

  return (
    <div className="px-4 py-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#3C4E53] to-[#2a3840] rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Bible in a Year</h2>
            <p className="text-white/70 text-sm mt-1">365-Day Journey Through Scripture</p>
          </div>
          <div className="bg-[#FD9C2D] rounded-full w-14 h-14 flex flex-col items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg leading-none">{pct}%</span>
            <span className="text-white/80 text-[9px]">done</span>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-3">
          <div className="bg-[#FD9C2D] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between text-sm text-white/80">
          <span>{totalCompleted} of 365 days</span>
          {progress && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Day {currentDay}</span>}
        </div>

        {!progress && (
          <Button
            onClick={() => startPlanMutation.mutate()}
            disabled={startPlanMutation.isPending}
            className="mt-4 w-full bg-[#FD9C2D] hover:bg-[#e8891a] text-white font-bold"
          >
            {startPlanMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Start the Journey
          </Button>
        )}
      </div>

      {/* Today's Reading Quick-Access */}
      {progress && (
        <button
          onClick={() => setSelectedDay(BIBLE_YEAR_PLAN[currentDay - 1])}
          className="w-full bg-[#FD9C2D]/10 border border-[#FD9C2D]/30 rounded-2xl p-4 mb-6 flex items-center justify-between text-left"
        >
          <div>
            <p className="text-[#FD9C2D] text-xs font-bold uppercase tracking-wider mb-1">Today</p>
            <p className="font-bold text-[#3C4E53] dark:text-white text-sm">{BIBLE_YEAR_PLAN[currentDay - 1]?.title}</p>
            <p className="text-gray-500 text-xs mt-1">{BIBLE_YEAR_PLAN[currentDay - 1]?.ot.join(', ')} · {BIBLE_YEAR_PLAN[currentDay - 1]?.nt}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#FD9C2D] shrink-0" />
        </button>
      )}

      {/* All Days Grid */}
      <h3 className="font-bold text-[#3C4E53] dark:text-white mb-3">All 365 Days</h3>
      <div className="space-y-4">
        {weeks.map((week, wi) => (
          <div key={wi}>
            <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Week {wi + 1}</p>
            <div className="grid grid-cols-7 gap-1">
              {week.map(day => {
                const done = completedDays.includes(day.day);
                const isCurrent = day.day === currentDay;
                return (
                  <button
                    key={day.day}
                    onClick={() => progress ? setSelectedDay(day) : null}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      done
                        ? 'bg-[#FD9C2D] text-white'
                        : isCurrent
                        ? 'bg-[#3C4E53] text-white ring-2 ring-[#FD9C2D]'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    } ${!progress ? 'opacity-50 cursor-default' : 'hover:scale-110 active:scale-95'}`}
                    title={day.title}
                  >
                    {done ? '✓' : day.day}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <DayDetailModal
            day={selectedDay}
            progress={progress}
            onClose={() => setSelectedDay(null)}
            onMarkComplete={(dayNum) => markCompleteMutation.mutate(dayNum)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}