import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bibleBooks } from './BibleData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, BookOpen } from 'lucide-react';

export default function BookSelector({ onSelectBook, selectedBook }) {
  const handleNavigateToTestament = (testament) => {
    window.location.href = `/BibleBooks?testament=${testament}`;
  };

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-3">
        {/* Old Testament */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigateToTestament('old')}
          className="w-full bg-white dark:bg-[#2d2d4a] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=200&h=200&fit=crop" 
                  alt="Old Testament"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white text-lg">Old Testament</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{bibleBooks.oldTestament.length} books</p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
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
          className="w-full bg-white dark:bg-[#2d2d4a] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=200&h=200&fit=crop" 
                  alt="New Testament"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-[#1a1a2e] dark:text-white text-lg">New Testament</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{bibleBooks.newTestament.length} books</p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
          </div>
        </motion.button>
      </div>
    </ScrollArea>
  );
}