import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function CompletionTracker({ sections, completedSections, onToggleSection, overallProgress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#1a1a2e] dark:text-white">Study Progress</h3>
              <span className="text-sm font-bold text-green-600">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Sections</p>
            <div className="grid grid-cols-1 gap-2">
              {sections.map((section, index) => {
                const isCompleted = completedSections.includes(section);
                return (
                  <motion.button
                    key={section}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onToggleSection(section)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-200 text-left group"
                  >
                    <div className="relative">
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-green-600"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-all ${
                      isCompleted
                        ? 'text-green-700 dark:text-green-300 line-through'
                        : 'text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300'
                    }`}>
                      {section}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}