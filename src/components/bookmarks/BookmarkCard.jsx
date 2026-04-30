import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlightColors = {
  yellow: 'border-l-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
  green: 'border-l-green-400 bg-green-50 dark:bg-green-900/20',
  blue: 'border-l-blue-400 bg-[#F2F6FA] dark:bg-[#0A1A2F]',
  pink: 'border-l-pink-400 bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5',
  purple: 'border-l-purple-400 bg-[#FAD98D]/10 dark:bg-[#FAD98D]/5'
};

export default function BookmarkCard({ bookmark, onDelete, onOpen, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border-l-4 p-4 ${highlightColors[bookmark.highlight_color] || 'border-l-gray-300 bg-gray-50 dark:bg-white/5 dark:bg-white/5'}`}
    >
      <p className="font-serif text-gray-800 dark:text-gray-100 mb-3 leading-relaxed">
        "{bookmark.verse_text}"
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {bookmark.book} {bookmark.chapter}:{bookmark.verse}
        </span>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpen(bookmark)}
            className="text-gray-500 dark:text-gray-300 hover:text-[#0A1A2F] dark:text-white dark:text-white"
          >
            <BookOpen className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(bookmark.id)}
            className="text-gray-500 dark:text-gray-300 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {bookmark.note && (
        <p className="mt-3 pt-3 border-t text-sm text-gray-500 dark:text-gray-300 italic">
          {bookmark.note}
        </p>
      )}
    </motion.div>
  );
}