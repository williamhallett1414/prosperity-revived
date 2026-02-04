import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function WellnessJourneyCard({ journey, onClick }) {
  const completedWeeks = journey.weeks?.filter(w => w.completed).length || 0;
  const progressPercent = (completedWeeks / journey.duration_weeks) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-[#1a1a2e] mb-1">{journey.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{journey.description}</p>
        </div>
        {journey.is_active && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            Active
          </span>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Week {journey.current_week} of {journey.duration_weeks}</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {journey.goals && journey.goals.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Journey Goals:</p>
          <div className="space-y-1">
            {journey.goals.slice(0, 2).map((goal, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                <Target className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{goal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Continue Journey
        </Button>
      </div>
    </motion.div>
  );
}