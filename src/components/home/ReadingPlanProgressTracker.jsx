import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle2, Flame } from 'lucide-react';

export default function ReadingPlanProgressTracker({ planProgress, plans }) {
  if (!planProgress || planProgress.length === 0) return null;

  const totalDaysRead = planProgress.reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...planProgress.map(p => p.longest_streak || 0), 0);
  const activePlans = planProgress.filter(p => (p.completed_days?.length || 0) < p.total_days);

  const recentPlan = planProgress[0];
  const plan = plans.find(p => p.id === recentPlan?.plan_id);

  const generateCalendar = (completionDates = []) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const completedSet = new Set(completionDates.map(d => new Date(d).toDateString()));
    const calendar = [];
    for (let i = 0; i < startingDayOfWeek; i++) calendar.push({ day: null });
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendar.push({
        day,
        isCompleted: completedSet.has(date.toDateString()),
        isToday: date.toDateString() === new Date().toDateString(),
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
      });
    }
    return calendar;
  };

  const calendarDays = generateCalendar(recentPlan?.completion_dates);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-[#0A1A2F] dark:text-white flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#c9a227]" />
          Reading Progress
        </h2>
      </div>

      {/* Most recent plan card */}
      {recentPlan && (
        <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-2xl border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 p-4 shadow-sm dark:shadow-none">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#0A1A2F] dark:text-white text-sm truncate">
                {plan?.name || recentPlan.plan_name}
              </h3>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 mt-0.5">
                Day {recentPlan.current_day || 1} of {recentPlan.total_days}
              </p>
            </div>
            {recentPlan.current_streak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-[#c9a227]/12 rounded-full flex-shrink-0 ml-2">
                <Flame className="w-3.5 h-3.5 text-[#c9a227]" />
                <span className="text-xs font-bold text-[#c9a227]">{recentPlan.current_streak}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-2 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] rounded-full transition-all"
                style={{ width: `${Math.round(((recentPlan.completed_days?.length || 0) / recentPlan.total_days) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-[#0A1A2F]/40 dark:text-white/40">
              <span>{recentPlan.completed_days?.length || 0} completed</span>
              <span>{recentPlan.total_days - (recentPlan.completed_days?.length || 0)} remaining</span>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <p className="text-xs font-semibold text-[#0A1A2F]/50 dark:text-white/50 mb-2">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-semibold text-[#0A1A2F]/30 dark:text-white/30">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((info, i) => (
                <div key={i}
                  className={`aspect-square flex items-center justify-center rounded-lg text-[11px] font-medium
                    ${!info.day ? 'invisible' : ''}
                    ${info.isCompleted
                      ? 'bg-gradient-to-br from-[#c9a227] to-[#FAD98D] text-white shadow-sm dark:shadow-none'
                      : info.isToday
                      ? 'border-2 border-[#c9a227] text-[#c9a227] font-bold'
                      : info.isPast
                      ? 'bg-[#FAD98D]/12 text-[#0A1A2F]/30 dark:text-white/30'
                      : 'text-[#0A1A2F]/35 dark:text-white/35'
                    }`}
                >
                  {info.day && (
                    info.isCompleted
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      : info.day
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#FAD98D]/15 dark:border-[#FAD98D]/8">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-[#c9a227] to-[#FAD98D]" />
              <span className="text-[10px] text-[#0A1A2F]/45 dark:text-white/45">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded border-2 border-[#c9a227]" />
              <span className="text-[10px] text-[#0A1A2F]/45 dark:text-white/45">Today</span>
            </div>
          </div>
        </div>
      )}

      {/* Other active plans */}
      {activePlans.length > 1 && (
        <div className="mt-3 space-y-2">
          {activePlans.slice(1, 3).map((progress) => {
            const planInfo = plans.find(p => p.id === progress.plan_id);
            const pct = Math.round(((progress.completed_days?.length || 0) / progress.total_days) * 100);
            return (
              <div key={progress.id} className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-xl border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white truncate">{planInfo?.name || progress.plan_name}</p>
                  <span className="text-xs text-[#c9a227] font-bold ml-2 flex-shrink-0">{pct}%</span>
                </div>
                <div className="h-1.5 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
