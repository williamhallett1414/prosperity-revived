import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BookSelector from '@/components/bible/BookSelector';
import ChapterSelector from '@/components/bible/ChapterSelector';
import VerseReader from '@/components/bible/VerseReader';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import { readingPlans } from '@/components/bible/BibleData';

export default function Bible() {
  const [view, setView] = useState('books'); // books, chapters, reader
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const queryClient = useQueryClient();

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list()
  });

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list()
  });

  const createBookmark = useMutation({
    mutationFn: (data) => base44.entities.Bookmark.create(data),
    onSuccess: () => queryClient.invalidateQueries(['bookmarks'])
  });

  const deleteBookmark = useMutation({
    mutationFn: (id) => base44.entities.Bookmark.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['bookmarks'])
  });

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookName = params.get('book');
    const chapter = params.get('chapter');
    
    if (bookName && chapter) {
      import('@/components/bible/BibleData').then(({ getBookByName }) => {
        const book = getBookByName(bookName);
        if (book) {
          setSelectedBook(book);
          setSelectedChapter(parseInt(chapter));
          setView('reader');
        }
      });
    }
  }, []);

  const planDay = new URLSearchParams(window.location.search).get('planDay');
  const planId = new URLSearchParams(window.location.search).get('planId');

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setView('chapters');
  };

  const handleSelectChapter = (chapter) => {
    setSelectedChapter(chapter);
    setView('reader');
  };

  const handleBack = () => {
    if (view === 'reader') {
      setView('chapters');
      setSelectedChapter(null);
    } else if (view === 'chapters') {
      setView('books');
      setSelectedBook(null);
    }
  };

  const handleNavigateChapter = (chapter) => {
    setSelectedChapter(chapter);
  };

  const handleBookmark = (verse, color, note = '') => {
    const existing = bookmarks.find(b => 
      b.book === verse.book && 
      b.chapter === verse.chapter && 
      b.verse === verse.verse
    );

    if (existing) {
      deleteBookmark.mutate(existing.id);
    }
    
    createBookmark.mutate({
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      verse_text: verse.text,
      highlight_color: color,
      note: note
    });
  };

  const getProgressForPlan = (planId) => {
    return planProgress.find(p => p.plan_id === planId);
  };

  const suggestedPlans = readingPlans.filter(plan => !getProgressForPlan(plan.id)).slice(0, 4);

  return (
    <div className="h-[calc(100vh-80px)] bg-[#faf8f5]">
      <AnimatePresence mode="wait">
        {view === 'books' && (
          <motion.div
            key="books"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full pt-4"
          >
            <div className="px-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  to={createPageUrl('Home')}
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a1a2e] hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-[#1a1a2e]">Bible</h1>
              </div>
              <p className="text-gray-500 ml-[52px]">Select a book to read</p>
            </div>
            <BookSelector
              onSelectBook={handleSelectBook}
              selectedBook={selectedBook}
            />
            
            {/* Suggested Plans */}
            {suggestedPlans.length > 0 && (
              <div className="px-4 mt-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#c9a227]" />
                    Reading Plans for You
                  </h2>
                  <Link to={createPageUrl('Plans')} className="text-sm text-[#c9a227] font-medium">
                    View All
                  </Link>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {suggestedPlans.map((plan, index) => (
                    <ReadingPlanCard
                      key={plan.id}
                      plan={plan}
                      progress={null}
                      onClick={() => window.location.href = createPageUrl(`PlanDetail?id=${plan.id}`)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {view === 'chapters' && selectedBook && (
          <motion.div
            key="chapters"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full pt-4"
          >
            <ChapterSelector
              book={selectedBook}
              onSelectChapter={handleSelectChapter}
              onBack={handleBack}
              selectedChapter={selectedChapter}
            />
          </motion.div>
        )}

        {view === 'reader' && selectedBook && selectedChapter && (
          <motion.div
            key="reader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <VerseReader
              book={selectedBook}
              chapter={selectedChapter}
              onBack={handleBack}
              onNavigate={handleNavigateChapter}
              bookmarks={bookmarks}
              onBookmark={handleBookmark}
              planDay={planDay}
              planId={planId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}