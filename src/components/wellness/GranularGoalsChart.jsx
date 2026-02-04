import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, CheckCircle } from 'lucide-react';

export default function GranularGoalsChart({ goals = [] }) {
  const getGoalIcon = (type) => {
    switch (type) {
      case 'water_intake': return '💧';
      case 'screen_time': return '📱';
      case 'sleep_hours': return '😴';
      case 'meditation_minutes': return '🧘';
      case 'step_count': return '👟';
      default: return '🎯';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'from-green-500 to-emerald-500';
    if (percentage >= 75) return 'from-blue-500 to-cyan-500';
    if (percentage >= 50) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  const completedGoals = goals.filter(g => g.progress_percentage >= 100).length;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">Goal Progress</span>
          </div>
          <span className="text-sm text-gray-600">
            {completedGoals} / {goals.length} completed
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {goals.map((goal, index) => {
          const percentage = goal.progress_percentage || 0;
          const isCompleted = percentage >= 100;

          return (
            <div
              key={index}
              className={`bg-white rounded-xl p-4 border-2 transition-all ${
                isCompleted ? 'border-green-200 bg-green-50/50' : 'border-transparent'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{getGoalIcon(goal.type)}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{goal.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {goal.current_value} / {goal.target_value} {goal.unit}
                    </p>
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Progress</span>
                  <span className="font-semibold">{percentage.toFixed(0)}%</span>
                </div>
                <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(percentage)} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No granular goals set yet</p>
        </div>
      )}
    </div>
  );
}