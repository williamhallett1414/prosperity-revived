import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReadingCalendarView({ 
  plan, 
  progress, 
  notes = [],
  onToggleDay,
  onAddNote,
  onOpenReading,
  getReadingForDay
}) {
  if (!progress) return null;

  const completedDays = progress.completed_days || [];
  const daysPerWeek = 7;
  const totalWeeks = Math.ceil(plan.duration / daysPerWeek);
  const weeks = Array.from({ length: totalWeeks }, (_, weekIdx) => {
    const weekStart = weekIdx * daysPerWeek;
    return Array.from({ length: daysPerWeek }, (_, dayIdx) => {
      const day = weekStart + dayIdx + 1;
      return day <= plan.duration ? day : null;
    });
  });

  const getNoteForDay = (day) => notes.find(n => n.day_number === day);

  const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'][
    new Date(progress.started_date).getMonth()
  ];

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Circle className="w-5 h-5 text-gray-300" />
          <span className="text-gray-600">Not Started</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#8fa68a]" />
          <span className="text-gray-600">Completed</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-4">
        {weeks.map((week, weekIdx) => (
          <motion.div
            key={weekIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: weekIdx * 0.05 }}
            className="space-y-2"
          >
            {/* Week Header */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Week {weekIdx + 1}
            </p>
            
            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {week.map((day, dayIdx) => {
                if (!day) {
                  return <div key={`empty-${dayIdx}`} />;
                }

                const isCompleted = completedDays.includes(day);
                const hasNote = getNoteForDay(day);
                const reading = getReadingForDay(day);

                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <button
                      onClick={() => onToggleDay(day)}
                      className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center font-semibold text-sm transition-all border-2 ${
                        isCompleted
                          ? 'bg-[#8fa68a] border-[#8fa68a] text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-[#c9a227]'
                      }`}
                      title={reading ? `${reading.book} ${reading.chapter}` : `Day ${day}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        day
                      )}
                    </button>

                    {/* Note Indicator */}
                    {hasNote && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#c9a227] rounded-full" />
                    )}

                    {/* Quick Actions */}
                    <div className="absolute -bottom-10 left-0 right-0 flex gap-1 justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none hover:pointer-events-auto">
                      {reading && (
                        <Button
                          onClick={() => onOpenReading(day)}
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 text-blue-600 hover:text-blue-700"
                          title="Read"
                        >
                          <span className="text-xs font-bold">R</span>
                        </Button>
                      )}
                      <Button
                        onClick={() => onAddNote(day)}
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 text-amber-600 hover:text-amber-700"
                        title="Add Note"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-[#8fa68a]/10 to-[#c9a227]/10 rounded-lg p-4 border border-[#8fa68a]/20">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Completed</p>
            <p className="text-xl font-bold text-[#8fa68a]">
              {completedDays.length}/{plan.duration}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Current Streak</p>
            <p className="text-xl font-bold text-[#c9a227]">
              {progress.current_streak || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Best Streak</p>
            <p className="text-xl font-bold text-[#1a1a2e]">
              {progress.longest_streak || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}