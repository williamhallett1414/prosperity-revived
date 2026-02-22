import React from 'react';
import { BookOpen } from 'lucide-react';

export default function VerseDisplay({ reference, text }) {
  return (
    <div className="my-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-l-4 border-purple-500">
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
            {reference}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
            "{text}"
          </p>
        </div>
      </div>
    </div>
  );
}