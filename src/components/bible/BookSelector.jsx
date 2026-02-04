import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bibleBooks } from './BibleData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, BookOpen } from 'lucide-react';

export default function BookSelector({ onSelectBook, selectedBook }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const BookButton = ({ book }) => (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectBook(book)}
      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
        selectedBook?.name === book.name
          ? 'bg-[#1a1a2e] text-white'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      <span className="font-medium">{book.name}</span>
      <span className={`ml-2 text-sm ${
        selectedBook?.name === book.name ? 'text-white/60' : 'text-gray-400'
      }`}>
        {book.chapters} chapters
      </span>
    </motion.button>
  );

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-2">
        {/* Old Testament */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('old')}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[#c9a227]" />
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">Old Testament</h3>
                <p className="text-xs text-gray-500">{bibleBooks.oldTestament.length} books</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSection === 'old' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expandedSection === 'old' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-2 pb-2 space-y-1">
                  {bibleBooks.oldTestament.map(book => (
                    <BookButton key={book.name} book={book} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New Testament */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('new')}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[#8fa68a]" />
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">New Testament</h3>
                <p className="text-xs text-gray-500">{bibleBooks.newTestament.length} books</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSection === 'new' ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {expandedSection === 'new' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-2 pb-2 space-y-1">
                  {bibleBooks.newTestament.map(book => (
                    <BookButton key={book.name} book={book} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ScrollArea>
  );
}