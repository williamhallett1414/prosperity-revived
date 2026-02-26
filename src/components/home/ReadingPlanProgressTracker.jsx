import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Flame, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ReadingPlanProgressTracker({ planProgress, plans }) {
  if (!planProgress || planProgress.length === 0) return null;

  // Calculate overall stats
  const totalDaysRead = planProgress.reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...(planProgress || []).map(p => p.longest_streak || 0), 0);
  const activePlans = planProgress.filter(p => (p.completed_days?.length || 0) < p.total_days);

  // Get the most recent plan for detailed view
  const recentPlan = planProgress[0];
  const plan = plans.find(p => p.id === recentPlan?.plan_id);
  
  // Generate calendar view for current month
  const generateCalendar = (completionDates = []) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    const completedDaysSet = new Set(
      completionDates.map(d => new Date(d).toDateString())
    );
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push({ day: null, isCompleted: false });
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isCompleted = completedDaysSet.has(date.toDateString());
      const isPast = date < now.setHours(0, 0, 0, 0);
      const isToday = date.toDateString() === new Date().toDateString();
      
      calendar.push({ 
        day, 
        isCompleted,
        isPast,
        isToday,
        date: date.toDateString()
      });
    }
    
    return calendar;
  };

  const calendarDays = generateCalendar(recentPlan?.completion_dates);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-[#0A1A2F]">Reading Progress</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <div className="flex flex-col items-center">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1" />
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalDaysRead}</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center">Days Read</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <div className="flex flex-col items-center">
            <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-1" />
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{longestStreak}</p>
            <p className="text-xs text-orange-700 dark:text-orange-300 text-center">Day Streak</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <div className="flex flex-col items-center">
            <CalendarIcon className="w-6 h-6 text-green-600 dark:text-green-400 mb-1" />
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{activePlans.length}</p>
            <p className="text-xs text-green-700 dark:text-green-300 text-center">Active Plans</p>
          </div>
        </Card>
      </div>

      {/* Most Recent Plan Progress */}
      {recentPlan && (
        <Card className="p-5 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {plan?.name || recentPlan.plan_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Day {recentPlan.current_day || 1} of {recentPlan.total_days}
              </p>
            </div>
            {recentPlan.current_streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                  {recentPlan.current_streak}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <Progress 
              value={Math.round(((recentPlan.completed_days?.length || 0) / recentPlan.total_days) * 100)} 
              className="h-2.5"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{recentPlan.completed_days?.length || 0} days completed</span>
              <span>{recentPlan.total_days - (recentPlan.completed_days?.length || 0)} remaining</span>
            </div>
          </div>

          {/* Calendar View */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
            
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayInfo, i) => (
                <div
                  key={i}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-xs
                    ${!dayInfo.day ? 'invisible' : ''}
                    ${dayInfo.isCompleted 
                      ? 'bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D] text-white font-bold shadow-sm' 
                      : dayInfo.isToday
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border-2 border-blue-400'
                      : dayInfo.isPast
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  {dayInfo.day && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      {dayInfo.isCompleted && (
                        <CheckCircle2 className="absolute w-3 h-3 text-white opacity-80" />
                      )}
                      <span className={dayInfo.isCompleted ? 'opacity-0' : ''}>{dayInfo.day}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D]" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
            </div>
          </div>
        </Card>
      )}

      {/* Other Active Plans Summary */}
      {activePlans.length > 1 && (
        <div className="mt-3 space-y-2">
          {activePlans.slice(1, 3).map((progress, index) => {
            const planInfo = plans.find(p => p.id === progress.plan_id);
            const completionPercent = Math.round(((progress.completed_days?.length || 0) / progress.total_days) * 100);
            
            return (
              <Card key={progress.id} className="p-3 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {planInfo?.name || progress.plan_name}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {completionPercent}%
                  </span>
                </div>
                <Progress value={completionPercent} className="h-1.5" />
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}