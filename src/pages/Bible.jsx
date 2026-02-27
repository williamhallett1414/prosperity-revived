import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Compass, BookOpen, TrendingUp, CheckCircle, Heart, Sparkles, Book } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import BookSelector from '@/components/bible/BookSelector';
import ChapterSelector from '@/components/bible/ChapterSelector';
import VerseReader from '@/components/bible/VerseReader';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import ReadingPlanProgressTracker from '@/components/home/ReadingPlanProgressTracker';
import { readingPlans, getBookByName, bibleBooks } from '@/components/bible/BibleData';
import BibleStatsModal from '@/components/bible/BibleStatsModal';
import DevotionalContent from '@/components/bible/DevotionalContent';
import BibleQA from '@/components/bible/BibleQA';
import BibleStudyGuide from '@/components/bible/BibleStudyGuide';
import MoodTracker from '@/components/bible/MoodTracker';
import PastoralChatbot from '@/components/bible/PastoralChatbot';
import GideonAskAnything from '@/components/bible/GideonAskAnything';
import UnifiedBibleReader from '@/components/bible/UnifiedBibleReader';
import BibleSearchBar from '@/components/bible/BibleSearchBar';

export default function Bible() {
  const [view, setView] = useState('home'); // home, oldTestament, newTestament
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [initialBook, setInitialBook] = useState(null);
  const [initialChapter, setInitialChapter] = useState(null);
  const [searchData, setSearchData] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      const book = getBookByName(bookName);
      if (book) {
        setInitialBook(book);
        setInitialChapter(parseInt(chapter));
        
        // Determine testament
        const isOldTestament = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 
          'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', 
          '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 
          'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 
          'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 
          'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'].includes(book.name);
        
        setView(isOldTestament ? 'oldTestament' : 'newTestament');
      }
    }
  }, []);

  const handleBackToHome = () => {
    setView('home');
    setInitialBook(null);
    setInitialChapter(null);
    setSearchData(null);
  };

  const handleSearchNavigate = (data) => {
    // Determine which testament the book belongs to
    const isOldTestament = bibleBooks.oldTestament.some(b => b.name === data.book.name);
    const testament = isOldTestament ? 'oldTestament' : 'newTestament';
    
    setSearchData(data);
    setInitialBook(data.book);
    setInitialChapter(data.chapter || null);
    setView(testament);
  };

  const handleBookmark = (verse, color, note = '') => {
    const bookName = verse.book || initialBook?.name;
    const chapterNum = verse.chapter || initialChapter;
    
    const existing = bookmarks.find(b => 
      b.book === bookName && 
      b.chapter === chapterNum && 
      b.verse === verse.verse
    );

    if (existing) {
      deleteBookmark.mutate(existing.id);
      return;
    }
    
    createBookmark.mutate({
      book: bookName,
      chapter: chapterNum,
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
  
  const totalDaysRead = (planProgress || []).reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...(planProgress || []).map(p => p.longest_streak || 0), 0);

  const handleStatClick = (statType) => {
    setSelectedStat(statType);
    setShowStatsModal(true);
  };

  // Render testament readers
  if (view === 'oldTestament') {
    return (
      <UnifiedBibleReader
        testament="old"
        onBack={handleBackToHome}
        initialBook={initialBook}
        initialChapter={initialChapter}
        bookmarks={bookmarks}
        onBookmark={handleBookmark}
        searchData={searchData}
      />
    );
  }

  if (view === 'newTestament') {
    return (
      <UnifiedBibleReader
        testament="new"
        onBack={handleBackToHome}
        initialBook={initialBook}
        initialChapter={initialChapter}
        bookmarks={bookmarks}
        onBookmark={handleBookmark}
        searchData={searchData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {view === 'home' && (
        <div className="px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Link
                to={createPageUrl('Home')}
                className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 shadow-sm flex items-center justify-center text-[#0A1A2F] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-[#0A1A2F]">Bible</h1>
            </div>
          </div>

          <Tabs defaultValue="read" className="w-full" onValueChange={(value) => {
            if (value === 'prayer') {
              navigate(createPageUrl('Prayer'));
            }
          }}>
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
              <TabsTrigger value="prayer">
                <Heart className="w-4 h-4 mr-2" />
                Prayer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="study">
              <BibleStudyGuide />
            </TabsContent>

            <TabsContent value="read">
              <div className="space-y-6">
                {/* Start Reading CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-2xl p-5 text-white"
                >
                  <h2 className="text-xl font-bold mb-1">📖 Read the Bible</h2>
                  <p className="text-white/80 text-sm mb-4">
                    Start with the New Testament or explore the full Scripture
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setInitialBook(bibleBooks.newTestament[0]);
                        setInitialChapter(1);
                        setView('newTestament');
                      }}
                      className="bg-white text-[#3C4E53] hover:bg-white/90 font-semibold flex-1"
                    >
                      Start in Matthew
                    </Button>
                    <Button
                      onClick={() => setView('oldTestament')}
                      variant="outline"
                      className="border-white/50 text-white hover:bg-white/10 flex-1"
                    >
                      Old Testament
                    </Button>
                  </div>
                </motion.div>

                {/* Search Bar */}
                <BibleSearchBar onNavigate={handleSearchNavigate} />
                
                {/* Testament Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setView('oldTestament')}
                    className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-amber-200"
                  >
                    <Book className="w-8 h-8 text-amber-700 mb-3 mx-auto" />
                    <h3 className="font-bold text-amber-900 text-lg mb-1">Old Testament</h3>
                    <p className="text-xs text-amber-700">39 books</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setView('newTestament')}
                    className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-sky-200"
                  >
                    <Book className="w-8 h-8 text-sky-700 mb-3 mx-auto" />
                    <h3 className="font-bold text-sky-900 text-lg mb-1">New Testament</h3>
                    <p className="text-xs text-sky-700">27 books</p>
                  </motion.button>
                </div>

                {/* Mood Tracker */}
                <MoodTracker />

                {/* Spiritual Insights Link */}
                <Link 
                  to={createPageUrl('SpiritualInsights')}
                  className="block mb-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6" />
                        <div>
                          <h3 className="font-semibold">Your Spiritual Insights</h3>
                          <p className="text-xs text-white/80">See how Gideon understands your journey</p>
                        </div>
                      </div>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  </motion.div>
                </Link>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleStatClick('days_read')}
                    className="bg-[#E6EBEF] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow text-left"
                  >
                    <BookOpen className="w-6 h-6 text-[#D9B878] mb-2" />
                    <p className="text-2xl font-bold text-[#0A1A2F]">{totalDaysRead}</p>
                    <p className="text-xs text-[#0A1A2F]/60">Days Read</p>
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => handleStatClick('streak')}
                    className="bg-[#E6EBEF] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow text-left"
                  >
                    <TrendingUp className="w-6 h-6 text-[#AFC7E3] mb-2" />
                    <p className="text-2xl font-bold text-[#0A1A2F]">{longestStreak}</p>
                    <p className="text-xs text-[#0A1A2F]/60">Longest Streak</p>
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => handleStatClick('bookmarks')}
                    className="bg-[#E6EBEF] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow text-left"
                  >
                    <CheckCircle className="w-6 h-6 text-[#D9B878] mb-2" />
                    <p className="text-2xl font-bold text-[#0A1A2F]">{bookmarks.length}</p>
                    <p className="text-xs text-[#0A1A2F]/60">Saved Verses</p>
                  </motion.button>
                </div>
                  
                {/* Reading Plan Progress Tracker */}
                <ReadingPlanProgressTracker planProgress={planProgress} plans={readingPlans} />

                {/* Reading Plans */}
                {suggestedPlans.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-[#0A1A2F] flex items-center gap-2">
                        <Compass className="w-5 h-5 text-[#D9B878]" />
                        Reading Plans
                      </h2>
                      <Link to={createPageUrl('Plans')} className="text-sm text-[#D9B878] font-medium hover:underline">
                        View All
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {suggestedPlans.slice(0, 3).map((plan, index) => (
                        <ReadingPlanCard
                          key={plan.id}
                          plan={plan}
                          progress={null}
                          onClick={() => navigate(createPageUrl(`PlanDetail?id=${plan.id}`))}
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
          </Tabs>
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

      {/* Gideon Ask Anything */}
      <GideonAskAnything />
    </div>
  );
}