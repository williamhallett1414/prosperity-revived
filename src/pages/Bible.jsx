import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Compass, BookOpen, TrendingUp, CheckCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BookSelector from '@/components/bible/BookSelector';
import ChapterSelector from '@/components/bible/ChapterSelector';
import VerseReader from '@/components/bible/VerseReader';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import { readingPlans } from '@/components/bible/BibleData';
import BibleStatsModal from '@/components/bible/BibleStatsModal';
import DevotionalContent from '@/components/bible/DevotionalContent';
import BibleQA from '@/components/bible/BibleQA';
import BibleStudyGuide from '@/components/bible/BibleStudyGuide';
import MoodTracker from '@/components/bible/MoodTracker';
import PastoralChatbot from '@/components/bible/PastoralChatbot';

export default function Bible() {
  const [view, setView] = useState('books'); // books, chapters, reader
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);

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
  
  const totalDaysRead = planProgress.reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...planProgress.map(p => p.longest_streak || 0), 0);

  const handleStatClick = (statType) => {
    setSelectedStat(statType);
    setShowStatsModal(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1a2e] pb-24">
      {view === 'books' && (
        <div className="px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Link
                to={createPageUrl('Home')}
                className="w-10 h-10 rounded-full bg-white dark:bg-[#2d2d4a] shadow-sm flex items-center justify-center text-[#1a1a2e] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3d3d5a] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">Bible</h1>
            </div>
          </div>

          <Tabs defaultValue="read" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="read">
                <BookOpen className="w-4 h-4 mr-2" />
                Read
              </TabsTrigger>
              <TabsTrigger value="study">
                <BookOpen className="w-4 h-4 mr-2" />
                Study
              </TabsTrigger>
              <TabsTrigger value="devotional">
                <Heart className="w-4 h-4 mr-2" />
                Devotional
              </TabsTrigger>
              <TabsTrigger value="qa">
                <Compass className="w-4 h-4 mr-2" />
                Questions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="study">
              <BibleStudyGuide />
            </TabsContent>

            <TabsContent value="read">
              <div className="space-y-6">
                {/* Mood Tracker */}
                <MoodTracker />
                
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleStatClick('days_read')}
                    className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow text-left"
                  >
                    <BookOpen className="w-6 h-6 text-[#c9a227] mb-2" />
                    <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{totalDaysRead}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Days Read</p>
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => handleStatClick('streak')}
                    className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow text-left"
                  >
                    <TrendingUp className="w-6 h-6 text-[#8fa68a] mb-2" />
                    <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{longestStreak}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Longest Streak</p>
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => handleStatClick('bookmarks')}
                    className="bg-white dark:bg-[#2d2d4a] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow text-left"
                  >
                    <CheckCircle className="w-6 h-6 text-[#c9a227] mb-2" />
                    <p className="text-2xl font-bold text-[#1a1a2e] dark:text-white">{bookmarks.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Saved Verses</p>
                  </motion.button>
                </div>

                <div className="mb-8">
                  <BookSelector
                    onSelectBook={handleSelectBook}
                    selectedBook={selectedBook}
                  />
                </div>
                  
                {/* Reading Plans */}
                {suggestedPlans.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-[#1a1a2e] dark:text-white flex items-center gap-2">
                        <Compass className="w-5 h-5 text-[#c9a227]" />
                        Reading Plans
                      </h2>
                      <Link to={createPageUrl('Plans')} className="text-sm text-[#c9a227] font-medium hover:underline">
                        View All
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {suggestedPlans.slice(0, 3).map((plan, index) => (
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
              </div>
            </TabsContent>

            <TabsContent value="devotional">
              <DevotionalContent />
            </TabsContent>

            <TabsContent value="qa">
              <BibleQA />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {view === 'chapters' && selectedBook && (
        <div className="h-full pt-4">
          <ChapterSelector
            book={selectedBook}
            onSelectChapter={handleSelectChapter}
            onBack={handleBack}
            selectedChapter={selectedChapter}
          />
        </div>
      )}

      {view === 'reader' && selectedBook && selectedChapter && (
        <div className="h-full">
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
        </div>
      )}

      {/* Stats Modal */}
      <BibleStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        statType={selectedStat}
        progress={planProgress}
        bookmarks={bookmarks}
      />

      {/* Pastoral Chatbot */}
      <PastoralChatbot />
    </div>
  );
}