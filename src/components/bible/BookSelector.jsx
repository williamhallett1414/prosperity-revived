import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { bibleBooks } from './BibleData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, BookOpen } from 'lucide-react';

export default function BookSelector({ onSelectBook, selectedBook }) {
  const navigate = useNavigate();
  const handleNavigateToTestament = (testament) => {
    navigate(createPageUrl(`BibleBooks?testament=${testament}`));
  };

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Old Testament */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigateToTestament('old')}
          className="bg-white dark:bg-[#2d2d4a] rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
        >
          <div className="relative h-32 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=400&h=300&fit=crop" 
              alt="Old Testament"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-bold text-[#3C4E53] dark:text-white text-lg mb-1">Old Testament</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{bibleBooks.oldTestament.length} books</p>
          </div>
        </motion.button>

        {/* New Testament */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigateToTestament('new')}
          className="bg-white dark:bg-[#2d2d4a] rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
        >
          <div className="relative h-32 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=300&fit=crop" 
              alt="New Testament"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-bold text-[#3C4E53] dark:text-white text-lg mb-1">New Testament</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{bibleBooks.newTestament.length} books</p>
          </div>
        </motion.button>
      </div>
    </ScrollArea>
  );
}