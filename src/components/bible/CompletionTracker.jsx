import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function CompletionTracker({ sections, completedSections, onToggleSection, overallProgress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="p-6 bg-gradient-to-br from-[#FAD98D]/15 to-[#FAD98D]/10 border-l-4 border-[#c9a227]">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#0A1A2F] dark:text-white dark:text-white">Study Progress</h3>
              <span className="text-sm font-bold text-[#c9a227]">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#0A1A2F]/60 dark:text-white/60 uppercase">Sections</p>
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
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F2F6FA] dark:bg-[#0A1A2F]/40 transition-all duration-200 text-left group"
                  >
                    <div className="relative">
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="w-5 h-5 rounded-full bg-[#c9a227] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </motion.div>
                      ) : (
                        <Circle className="w-5 h-5 text-[#0A1A2F]/40 dark:text-white/40 group-hover:text-[#c9a227] transition-colors" />
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-all ${
                      isCompleted
                        ? 'text-[#c9a227] line-through'
                        : 'text-[#0A1A2F]/75 dark:text-white/75 group-hover:text-[#c9a227]'
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