import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProgressTracker({ 
  book, 
  currentChapter, 
  totalChapters, 
  completedChapters = [],
  onMarkComplete 
}) {
  const progress = (completedChapters.length / totalChapters) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white">Reading Progress</h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {completedChapters.length} / {totalChapters} chapters
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="bg-[#8fa68a] h-2 rounded-full"
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Current Chapter Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {completedChapters.includes(currentChapter) ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {book} {currentChapter}
          </span>
        </div>
        
        {!completedChapters.includes(currentChapter) && (
          <Button
            onClick={() => onMarkComplete(currentChapter)}
            size="sm"
            className="bg-[#8fa68a] hover:bg-[#8fa68a]/90 text-white"
          >
            Mark Complete
          </Button>
        )}
      </div>

      {/* Chapter Grid (compact view) */}
      {totalChapters <= 50 && (
        <div className="mt-4 grid grid-cols-10 gap-1">
          {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chap) => (
            <div
              key={chap}
              className={`aspect-square rounded text-xs flex items-center justify-center font-medium ${
                completedChapters.includes(chap)
                  ? 'bg-[#8fa68a] text-white'
                  : chap === currentChapter
                  ? 'bg-[#D9B878] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {chap}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}