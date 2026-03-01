import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, BookOpen, TrendingUp, CheckCircle, Heart, Sparkles, Book, ChevronRight, PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import ReadingPlanProgressTracker from '@/components/home/ReadingPlanProgressTracker';
import { readingPlans, getBookByName, bibleBooks } from '@/components/bible/BibleData';
import BibleStatsModal from '@/components/bible/BibleStatsModal';
import DevotionalContent from '@/components/bible/DevotionalContent';
import BibleStudyGuide from '@/components/bible/BibleStudyGuide';
import MoodTracker from '@/components/bible/MoodTracker';
import GideonAskAnything from '@/components/bible/GideonAskAnything';
import UnifiedBibleReader from '@/components/bible/UnifiedBibleReader';
import BibleSearchBar from '@/components/bible/BibleSearchBar';

const LAST_READ_KEY = 'bible_last_read';

export default function Bible() {
  const [view, setView] = useState('home');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [initialBook, setInitialBook] = useState(null);
  const [initialChapter, setInitialChapter] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [lastRead, setLastRead] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Load last-read position on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LAST_READ_KEY);
      if (stored) setLastRead(JSON.parse(stored));
    } catch {}
  }, []);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookName = params.get('book');
    const chapter = params.get('chapter');
    if (bookName && chapter) {
      const book = getBookByName(bookName);
      if (book) {
        setInitialBook(book);
        setInitialChapter(parseInt(chapter));
        const isOld = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'].includes(book.name);
        setView(isOld ? 'oldTestament' : 'newTestament');
      }
    }
  }, [window.location.search]);

  const handleBackToHome = () => {
    setView('home');
    setInitialBook(null);
    setInitialChapter(null);
    setSearchData(null);
  };

  const openReading = (book, chapter, isOld) => {
    // Save last read position
    const position = { bookName: book.name, chapter, isOld };
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(position));
    setLastRead(position);
    setInitialBook(book);
    setInitialChapter(chapter);
    setView(isOld ? 'oldTestament' : 'newTestament');
  };

  const handleSearchNavigate = (data) => {
    const isOld = bibleBooks.oldTestament.some((b) => b.name === data.book.name);
    setSearchData(data);
    openReading(data.book, data.chapter || 1, isOld);
  };

  const handleBookmark = (verse, color, note = '') => {
    const bookName = verse.book || initialBook?.name;
    const chapterNum = verse.chapter || initialChapter;
    const existing = bookmarks.find((b) => b.book === bookName && b.chapter === chapterNum && b.verse === verse.verse);
    if (existing) { deleteBookmark.mutate(existing.id); return; }
    createBookmark.mutate({ book: bookName, chapter: chapterNum, verse: verse.verse, verse_text: verse.text, highlight_color: color, note });
  };

  const getProgressForPlan = (planId) => planProgress.find((p) => p.plan_id === planId);
  const suggestedPlans = readingPlans.filter((plan) => !getProgressForPlan(plan.id)).slice(0, 3);
  const totalDaysRead = (planProgress || []).reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...(planProgress || []).map((p) => p.longest_streak || 0), 0);
  const handleStatClick = (statType) => { setSelectedStat(statType); setShowStatsModal(true); };

  // Resolve continue-reading book object
  const continueBook = lastRead ? getBookByName(lastRead.bookName) : null;

  if (view === 'oldTestament') {
    return <UnifiedBibleReader testament="old" onBack={handleBackToHome} initialBook={initialBook} initialChapter={initialChapter} bookmarks={bookmarks} onBookmark={handleBookmark} searchData={searchData} />;
  }
  if (view === 'newTestament') {
    return <UnifiedBibleReader testament="new" onBack={handleBackToHome} initialBook={initialBook} initialChapter={initialChapter} bookmarks={bookmarks} onBookmark={handleBookmark} searchData={searchData} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#FFFDF7] border-b border-[#D9B878]/25 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to={createPageUrl('Home')} className="w-9 h-9 rounded-full bg-[#FAD98D]/20 hover:bg-[#FAD98D]/35 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">Bible</h1>
            <p className="text-xs text-[#0A1A2F]/60">Read · Study · Reflect</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto">
        {/* Tab Bar — Gideon gold, Prayer is now just a link not a tab */}
        <Tabs defaultValue="read" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#FAD98D]/15 rounded-xl p-1 border border-[#D9B878]/20">
            <TabsTrigger value="read" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#c9a227] data-[state=active]:to-[#D9B878] data-[state=active]:text-white data-[state=active]:shadow-sm">
              <BookOpen className="w-3.5 h-3.5 mr-1" />Read
            </TabsTrigger>
            <TabsTrigger value="study" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#c9a227] data-[state=active]:to-[#D9B878] data-[state=active]:text-white data-[state=active]:shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1" />Study
            </TabsTrigger>
            <TabsTrigger value="devotional" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#c9a227] data-[state=active]:to-[#D9B878] data-[state=active]:text-white data-[state=active]:shadow-sm">
              <Heart className="w-3.5 h-3.5 mr-1" />Devotional
            </TabsTrigger>
          </TabsList>

          {/* ── READ TAB ── */}
          <TabsContent value="read">
            <div className="space-y-5">

              {/* Continue Reading — only shows if user has read before */}
              {continueBook && (
                <motion.button
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => openReading(continueBook, lastRead.chapter, lastRead.isOld)}
                  className="w-full bg-gradient-to-br from-[#0A1A2F] to-[#1a3a5c] rounded-2xl p-4 text-left hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#c9a227] flex items-center justify-center flex-shrink-0">
                        <PlayCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-0.5">Continue Reading</p>
                        <p className="text-white font-bold text-sm">{lastRead.bookName} · Chapter {lastRead.chapter}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/50" />
                  </div>
                </motion.button>
              )}

              {/* Hero CTA */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#0A1A2F] to-[#c9a227] rounded-2xl p-5 text-white">
                <h2 className="text-lg font-bold mb-1">📖 {continueBook ? 'Open the Word' : 'Start Reading Today'}</h2>
                <p className="text-white/75 text-sm mb-4">
                  {continueBook ? 'Dive into a new book or testament' : 'Dive into Scripture — Old or New Testament'}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const matthew = bibleBooks.newTestament[0];
                      openReading(matthew, 1, false);
                    }}
                    className="bg-[#D9B878] hover:bg-[#c9a227] text-[#0A1A2F] font-semibold flex-1 text-sm">
                    New Testament
                  </Button>
                  <Button
                    onClick={() => { setInitialBook(null); setView('oldTestament'); }}
                    className="bg-white/15 hover:bg-white/25 text-white border border-white/30 flex-1 text-sm">
                    Old Testament
                  </Button>
                </div>
              </motion.div>

              {/* Search Bar */}
              <BibleSearchBar onNavigate={handleSearchNavigate} />

              {/* Stats Cards — with tap hint */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Days Read', value: totalDaysRead, icon: BookOpen, stat: 'days_read', color: 'text-[#c9a227]' },
                  { label: 'Best Streak', value: longestStreak, icon: TrendingUp, stat: 'streak', color: 'text-[#0A1A2F]' },
                  { label: 'Saved Verses', value: bookmarks.length, icon: CheckCircle, stat: 'bookmarks', color: 'text-[#c9a227]' },
                ].map(({ label, value, icon: Icon, stat, color }, i) => (
                  <motion.button key={stat}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    onClick={() => handleStatClick(stat)}
                    className="bg-gradient-to-br from-[#FAD98D]/20 to-[#D9B878]/10 rounded-2xl p-4 border border-[#D9B878]/25 hover:shadow-md hover:border-[#c9a227]/40 active:scale-95 transition-all text-left group">
                    <Icon className={`w-5 h-5 ${color} mb-2`} />
                    <p className="text-xl font-bold text-[#0A1A2F]">{value}</p>
                    <p className="text-xs text-[#0A1A2F]/55">{label}</p>
                    <p className="text-[10px] text-[#c9a227] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Tap to view →</p>
                  </motion.button>
                ))}
              </div>

              {/* Spiritual Insights Link */}
              <Link to={createPageUrl('SpiritualInsights')} className="block">
                <div className="bg-gradient-to-r from-[#0A1A2F] to-[#c9a227] rounded-2xl p-4 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Your Spiritual Insights</h3>
                        <p className="text-xs text-white/70">See how Gideon understands your journey</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/70" />
                  </div>
                </div>
              </Link>

              {/* Prayer — card link, not a tab */}
              <Link to={createPageUrl('Prayer')} className="block">
                <div className="bg-gradient-to-br from-[#FAD98D]/25 to-[#D9B878]/15 rounded-2xl p-4 border border-[#D9B878]/25 hover:shadow-md hover:border-[#c9a227]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center text-lg">
                        🙏
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-[#0A1A2F]">Prayer</h3>
                        <p className="text-xs text-[#0A1A2F]/55">Journal your prayers and requests</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#0A1A2F]/40" />
                  </div>
                </div>
              </Link>

              {/* Mood Tracker — after navigation cards */}
              <MoodTracker />

              {/* Reading Plan Tracker */}
              <ReadingPlanProgressTracker planProgress={planProgress} plans={readingPlans} />

              {/* Suggested Plans */}
              {suggestedPlans.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-[#0A1A2F] flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#c9a227]" />Reading Plans
                    </h2>
                    <Link to={createPageUrl('Plans')} className="text-xs text-[#c9a227] font-semibold hover:underline">View All</Link>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {suggestedPlans.map((plan, index) => (
                      <ReadingPlanCard key={plan.id} plan={plan} progress={null}
                        onClick={() => navigate(createPageUrl(`PlanDetail?id=${plan.id}`))} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── STUDY TAB ── */}
          <TabsContent value="study">
            <BibleStudyGuide />
          </TabsContent>

          {/* ── DEVOTIONAL TAB ── */}
          <TabsContent value="devotional">
            <DevotionalContent />
          </TabsContent>
        </Tabs>
      </div>

      <BibleStatsModal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} statType={selectedStat} progress={planProgress} bookmarks={bookmarks} />
      {/* Only GideonAskAnything — PastoralChatbot removed (duplicate) */}
      <GideonAskAnything />
    </div>
  );
}
