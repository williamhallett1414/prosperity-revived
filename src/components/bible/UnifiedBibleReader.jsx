import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bibleBooks } from './BibleData';
import { base44 } from '@/api/base44Client';
import GideonAskAnything from '@/components/bible/GideonAskAnything';

export default function UnifiedBibleReader({ 
  testament = 'old', // 'old' or 'new'
  onBack,
  initialBook = null,
  initialChapter = null,
  bookmarks = [],
  onBookmark,
  searchData = null
}) {
  const [selectedBook, setSelectedBook] = useState(initialBook);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightVerse, setHighlightVerse] = useState(null);
  const versesRef = useRef(null);

  const books = testament === 'old' ? bibleBooks.oldTestament : bibleBooks.newTestament;
  const testamentName = testament === 'old' ? 'Old Testament' : 'New Testament';

  // Handle search navigation
  useEffect(() => {
    if (searchData) {
      setSelectedBook(searchData.book);
      
      if (searchData.chapter) {
        setSelectedChapter(searchData.chapter);
        
        if (searchData.verse) {
          setHighlightVerse(searchData.verse);
          // Clear highlight after 3 seconds
          setTimeout(() => setHighlightVerse(null), 3000);
        }
      }
    }
  }, [searchData]);

  // Auto-scroll to specific verse
  useEffect(() => {
    if (highlightVerse && verses.length > 0) {
      setTimeout(() => {
        const verseEl = document.getElementById(`verse-${highlightVerse}`);
        if (verseEl) {
          verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          verseEl.classList.add('highlight-verse');
        }
      }, 300);
    }
  }, [verses, highlightVerse]);

  // Also handle URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verseNum = params.get('verse');
    if (verseNum && versesRef.current && verses.length > 0) {
      setTimeout(() => {
        const verseEl = document.getElementById(`verse-${verseNum}`);
        if (verseEl) {
          verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          verseEl.classList.add('highlight-verse');
        }
      }, 300);
    }
  }, [verses]);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setVerses([]);
  };

  const handleChapterSelect = async (chapterNum) => {
    setSelectedChapter(chapterNum);
    setLoading(true);

    try {
      const { data } = await base44.functions.invoke('fetchBibleVerse', {
        book: selectedBook.name,
        chapter: chapterNum
      });
      
      // Handle different response formats
      const versesData = data?.verses || data || [];
      setVerses(versesData);
    } catch (error) {
      console.error('Error fetching verses:', error);
      setVerses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setSelectedChapter(null);
    setVerses([]);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setVerses([]);
  };

  const isBookmarked = (verse) => {
    return bookmarks.some(b => 
      b.book === selectedBook?.name && 
      b.chapter === selectedChapter && 
      b.verse === verse.verse
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-[#faf8f5]">
      {/* Left Sidebar - Books */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Bible</span>
          </button>
          <h2 className="text-lg font-bold text-[#0A1A2F]">{testamentName}</h2>
          <p className="text-xs text-gray-500">{books.length} books</p>
        </div>

        <div className="p-2">
          {books.map((book, idx) => (
            <button
              key={idx}
              onClick={() => handleBookSelect(book)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                selectedBook?.name === book.name
                  ? 'bg-[#8fa68a] text-white font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{book.name}</span>
                <span className="text-xs opacity-70">{book.chapters}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto">
        {!selectedBook && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a Book
              </h3>
              <p className="text-gray-500">Choose a book from the {testamentName}</p>
            </div>
          </div>
        )}

        {selectedBook && !selectedChapter && (
          <div className="p-6">
            <div className="mb-6">
              <button
                onClick={handleBackToBooks}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Books</span>
              </button>
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-1">{selectedBook.name}</h2>
              <p className="text-gray-500">{selectedBook.chapters} chapters</p>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(chapterNum => (
                <motion.button
                  key={chapterNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChapterSelect(chapterNum)}
                  className="aspect-square rounded-lg bg-white border-2 border-gray-200 hover:border-[#8fa68a] hover:bg-[#8fa68a]/10 flex items-center justify-center font-semibold text-gray-700 hover:text-[#8fa68a] transition-all"
                >
                  {chapterNum}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {selectedBook && selectedChapter && (
          <div className="p-6" ref={versesRef}>
            <div className="mb-6 sticky top-0 bg-[#faf8f5] py-4 z-10 border-b border-gray-200">
              <button
                onClick={handleBackToChapters}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Chapters</span>
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A1A2F]">
                    {selectedBook.name} {selectedChapter}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {selectedChapter > 1 && (
                    <Button
                      onClick={() => handleChapterSelect(selectedChapter - 1)}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                  )}
                  {selectedChapter < selectedBook.chapters && (
                    <Button
                      onClick={() => handleChapterSelect(selectedChapter + 1)}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8fa68a]"></div>
              </div>
            )}

            {!loading && verses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No verses available</p>
              </div>
            )}

            {!loading && verses.length > 0 && (
              <div className="max-w-3xl space-y-4">
                {verses.map((verse, idx) => {
                  const bookmarked = isBookmarked(verse);
                  const isHighlighted = highlightVerse === verse.verse;
                  return (
                    <motion.div
                      key={idx}
                      id={`verse-${verse.verse}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`group relative ${isHighlighted ? 'highlight-verse' : ''}`}
                    >
                      <div className="flex gap-3">
                        <span className="text-sm font-semibold text-[#8fa68a] mt-1 flex-shrink-0 w-8">
                          {verse.verse}
                        </span>
                        <p className="text-gray-800 leading-relaxed flex-1">
                          {verse.text}
                        </p>
                        <button
                          onClick={() => onBookmark?.(verse, 'yellow')}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1 ${
                            bookmarked ? 'opacity-100' : ''
                          }`}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              bookmarked ? 'fill-[#D9B878] text-[#D9B878]' : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .highlight-verse {
          background: rgba(217, 184, 120, 0.2);
          border-radius: 8px;
          padding: 8px;
          animation: highlight-pulse 2s ease-in-out;
        }
        
        @keyframes highlight-pulse {
          0%, 100% { background: rgba(217, 184, 120, 0.2); }
          50% { background: rgba(217, 184, 120, 0.4); }
        }
      `}</style>

      {/* Gideon Ask Anything */}
      <GideonAskAnything />
    </div>
  );
}