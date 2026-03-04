import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, BookOpen, TrendingUp, CheckCircle, Heart, Sparkles, ChevronRight, PlayCircle } from 'lucide-react';
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
  const [searchParams] = useSearchParams(); // ← Fix #16: reactive, not window.location.search

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

  // Fix #16: use searchParams hook
  useEffect(() => {
    const bookName = searchParams.get('book');
    const chapter = searchParams.get('chapter');
    if (bookName && chapter) {
      const book = getBookByName(bookName);
      if (book) {
        setInitialBook(book);
        setInitialChapter(parseInt(chapter));
        const isOld = bibleBooks.oldTestament.some(b => b.name === book.name);
        setView(isOld ? 'oldTestament' : 'newTestament');
      }
    }
  }, [searchParams]);

  const handleBackToHome = () => {
    setView('home');
    setInitialBook(null);
    setInitialChapter(null);
    setSearchData(null);
  };

  const openReading = (book, chapter, isOld) => {
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

  // Fix #3: stats only used for modal, not duplicated in UI
  const totalDaysRead = (planProgress || []).reduce((sum, p) => sum + (p.completed_days?.length || 0), 0);
  const longestStreak = Math.max(...(planProgress || []).map((p) => p.longest_streak || 0), 0);
  const handleStatClick = (statType) => { setSelectedStat(statType); setShowStatsModal(true); };

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
            <div className="space-y-4">

              {/* Fix #8: Continue Reading — softer gold card so two dark navys don't stack */}
              {continueBook && (
                <motion.button
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => openReading(continueBook, lastRead.chapter, lastRead.isOld)}
                  className="w-full bg-gradient-to-br from-[#FAD98D]/30 to-[#D9B878]/20 border border-[#c9a227]/30 rounded-2xl p-4 text-left hover:shadow-md hover:border-[#c9a227]/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <PlayCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#0A1A2F]/45 font-semibold uppercase tracking-wide mb-0.5">Continue Reading</p>
                        <p className="text-[#0A1A2F] font-bold text-sm">{lastRead.bookName} · Chapter {lastRead.chapter}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#c9a227]" />
                  </div>
                </motion.button>
              )}

              {/* Fix #7+8: Hero CTA — always dark navy, not dependent on continueBook state */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#0A1A2F] to-[#0f2a4a] rounded-2xl p-5 text-white">
                <h2 className="text-lg font-bold mb-1">📖 Open the Word</h2>
                <p className="text-white/65 text-sm mb-4">Choose your testament to begin reading</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => { setInitialBook(null); setView('newTestament'); }}
                    className="bg-[#D9B878] hover:bg-[#c9a227] text-[#0A1A2F] font-semibold flex-1 text-sm shadow-sm">
                    New Testament
                  </Button>
                  <Button
                    onClick={() => { setInitialBook(null); setView('oldTestament'); }}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/25 flex-1 text-sm">
                    Old Testament
                  </Button>
                </div>
              </motion.div>

              <BibleSearchBar onNavigate={handleSearchNavigate} />

              {/* Fix #3+13: Stats cards — removed duplicate (ReadingPlanProgressTracker has its own stats section)
                  Mobile tap affordance: permanent small dot indicator instead of hover-only text */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Days Read',    value: totalDaysRead,    icon: BookOpen,    stat: 'days_read', accent: 'text-[#c9a227]', bg: 'from-[#FAD98D]/25 to-[#D9B878]/12' },
                  { label: 'Best Streak',  value: longestStreak,    icon: TrendingUp,  stat: 'streak',    accent: 'text-[#0A1A2F]', bg: 'from-[#0A1A2F]/8 to-[#0A1A2F]/4' },
                  { label: 'Saved Verses', value: bookmarks.length, icon: CheckCircle, stat: 'bookmarks', accent: 'text-[#c9a227]', bg: 'from-[#FAD98D]/25 to-[#D9B878]/12' },
                ].map(({ label, value, icon: Icon, stat, accent, bg }, i) => (
                  <motion.button key={stat}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    onClick={() => handleStatClick(stat)}
                    className={`bg-gradient-to-br ${bg} rounded-2xl p-4 border border-[#D9B878]/25 hover:border-[#c9a227]/50 active:scale-95 transition-all text-left relative overflow-hidden`}>
                    <Icon className={`w-4 h-4 ${accent} mb-2`} />
                    <p className="text-xl font-bold text-[#0A1A2F]">{value}</p>
                    <p className="text-[10px] text-[#0A1A2F]/50 leading-tight">{label}</p>
                    {/* Fix #13: always-visible affordance for mobile */}
                    <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#D9B878]/60" />
                  </motion.button>
                ))}
              </div>

              {/* Spiritual Insights */}
              <Link to={createPageUrl('SpiritualInsights')} className="block">
                <div className="bg-gradient-to-r from-[#0A1A2F] to-[#c9a227] rounded-2xl p-4 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Your Spiritual Insights</h3>
                        <p className="text-xs text-white/65">See how Gideon understands your journey</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/60" />
                  </div>
                </div>
              </Link>

              {/* Prayer */}
              <Link to={createPageUrl('Prayer')} className="block">
                <div className="bg-gradient-to-br from-[#FAD98D]/20 to-[#D9B878]/12 rounded-2xl p-4 border border-[#D9B878]/25 hover:border-[#c9a227]/40 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center text-lg shadow-sm">
                        🙏
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-[#0A1A2F]">Prayer</h3>
                        <p className="text-xs text-[#0A1A2F]/50">Journal your prayers and requests</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#0A1A2F]/35" />
                  </div>
                </div>
              </Link>

              {/* Mood Tracker */}
              <MoodTracker />

              {/* Reading Plan Progress (has its own heading+stats) */}
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
                  <div className="space-y-3">
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
      <GideonAskAnything />
    </div>
  );
}
