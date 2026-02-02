import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlightColors = {
  yellow: 'border-l-yellow-400 bg-yellow-50',
  green: 'border-l-green-400 bg-green-50',
  blue: 'border-l-blue-400 bg-blue-50',
  pink: 'border-l-pink-400 bg-pink-50',
  purple: 'border-l-purple-400 bg-purple-50'
};

export default function BookmarkCard({ bookmark, onDelete, onOpen, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border-l-4 p-4 ${highlightColors[bookmark.highlight_color] || 'border-l-gray-300 bg-gray-50'}`}
    >
      <p className="font-serif text-gray-800 mb-3 leading-relaxed">
        "{bookmark.verse_text}"
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          {bookmark.book} {bookmark.chapter}:{bookmark.verse}
        </span>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpen(bookmark)}
            className="text-gray-500 hover:text-[#1a1a2e]"
          >
            <BookOpen className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(bookmark.id)}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {bookmark.note && (
        <p className="mt-3 pt-3 border-t text-sm text-gray-500 italic">
          {bookmark.note}
        </p>
      )}
    </motion.div>
  );
}