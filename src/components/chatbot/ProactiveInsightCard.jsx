import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, ChevronRight } from 'lucide-react';

const typeColors = {
  missed_workout:  { bg: 'from-sky-50 dark:from-sky-900/15 to-blue-50',   border: 'border-sky-200',   icon: 'from-sky-400 to-blue-500' },
  no_workouts:     { bg: 'from-sky-50 dark:from-sky-900/15 to-indigo-50',  border: 'border-sky-200',   icon: 'from-sky-400 to-indigo-500' },
  plateau:         { bg: 'from-orange-50 dark:from-orange-900/15 to-amber-50',border: 'border-orange-200',icon: 'from-orange-400 to-amber-500' },
  overtraining:    { bg: 'from-teal-50 to-cyan-50',   border: 'border-teal-200',  icon: 'from-teal-400 to-cyan-500' },
  no_meals:        { bg: 'from-green-50 dark:from-green-900/15 to-emerald-50',border: 'border-green-200 dark:border-green-800/30',icon: 'from-green-400 to-emerald-500' },
  low_protein:     { bg: 'from-lime-50 to-green-50',  border: 'border-lime-200',  icon: 'from-lime-400 to-green-500' },
  high_calories:   { bg: 'from-yellow-50 to-amber-50',border: 'border-yellow-200',icon: 'from-yellow-400 to-amber-500' },
  meal_prep:       { bg: 'from-green-50 dark:from-green-900/15 to-teal-50',  border: 'border-green-200 dark:border-green-800/30', icon: 'from-green-400 to-teal-500' },
  low_mood:        { bg: 'from-purple-50 dark:from-purple-900/15 to-violet-50',border: 'border-purple-200 dark:border-purple-800/30',icon: 'from-purple-400 to-violet-500' },
  anxiety_pattern: { bg: 'from-blue-50 dark:from-blue-900/15 to-indigo-50', border: 'border-blue-200 dark:border-blue-800/30',  icon: 'from-blue-400 to-indigo-500' },
  burnout:         { bg: 'from-rose-50 to-pink-50 dark:to-pink-900/10',   border: 'border-rose-200',  icon: 'from-rose-400 to-pink-50 dark:to-pink-900/100' },
  no_conversations:{ bg: 'from-violet-50 to-purple-50 dark:to-purple-900/10',border: 'border-violet-200',icon: 'from-violet-400 to-purple-50 dark:to-purple-900/100' },
};

const defaultColors = { bg: 'from-amber-50 dark:from-amber-900/15 to-yellow-50', border: 'border-amber-200 dark:border-amber-800/30', icon: 'from-amber-400 to-yellow-500' };

export default function ProactiveInsightCard({ insight, onAccept, onDismiss }) {
  if (!insight) return null;

  const colors = typeColors[insight.type] || defaultColors;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`mx-4 mt-3 rounded-2xl border bg-gradient-to-br ${colors.bg} ${colors.border} p-4 shadow-sm dark:shadow-none`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-1">{insight.title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{insight.message}</p>

          {insight.prompt_action && (
            <button
              onClick={() => onAccept(insight.prompt_action)}
              className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:text-white transition-colors group"
            >
              {insight.prompt_action.length > 40
                ? insight.prompt_action.slice(0, 40) + '…'
                : insight.prompt_action}
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:text-gray-300 transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}