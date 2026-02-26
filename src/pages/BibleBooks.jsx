import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { bibleBooks } from '@/components/bible/BibleData';
import { ScrollArea } from '@/components/ui/scroll-area';
import GideonAskAnything from '@/components/bible/GideonAskAnything';

export default function BibleBooks() {
  const navigate = useNavigate();
  const [testament, setTestament] = useState('old');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testamentParam = params.get('testament');
    if (testamentParam === 'new' || testamentParam === 'old') {
      setTestament(testamentParam);
    }
  }, []);

  const books = testament === 'old' ? bibleBooks.oldTestament : bibleBooks.newTestament;
  const title = testament === 'old' ? 'Old Testament' : 'New Testament';

  const handleSelectBook = (book) => {
    navigate(createPageUrl(`Bible?book=${book.name}&chapter=1`));
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#2d2d4a] shadow-sm flex items-center justify-center text-[#1a1a2e] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3d3d5a] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{books.length} books</p>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-2">
            {books.map((book, index) => (
              <motion.button
                key={book.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectBook(book)}
                className="w-full text-left px-5 py-4 rounded-xl transition-all bg-white dark:bg-[#2d2d4a] hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#1a1a2e] dark:text-white">{book.name}</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    {book.abbr}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Gideon Ask Anything */}
      <GideonAskAnything />
    </div>
  );
}