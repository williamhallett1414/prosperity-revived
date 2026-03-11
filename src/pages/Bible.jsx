import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  BookOpen, Sparkles, Heart, ChevronRight, PlayCircle,
  Bookmark, TrendingUp, Search, Compass, Flame, Target, Star
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { readingPlans, getBookByName, bibleBooks, getVerseOfDay } from '@/components/bible/BibleData';
import BibleStatsModal from '@/components/bible/BibleStatsModal';
import DevotionalContent from '@/components/bible/DevotionalContent';
import BibleStudyGuide from '@/components/bible/BibleStudyGuide';
import MoodTracker from '@/components/bible/MoodTracker';
import ChatButton from '@/components/chatbot/ChatButton';
import UnifiedBibleReader from '@/components/bible/UnifiedBibleReader';
import BibleSearchBar from '@/components/bible/BibleSearchBar';
import ReadingPlanCard from '@/components/home/ReadingPlanCard';
import KidsComicBible from '@/components/bible/KidsComicBible';

const LAST_READ_KEY = 'bible_last_read';

// ─── Compact active plan card ─────────────────────────────────────────────────
function ActivePlanCard({ progress, plan, navigate }) {
  if (!plan) return null;
  const pct = Math.round(((progress.completed_days?.length || 0) / progress.total_days) * 100);
  const streak = progress.current_streak || 0;
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(createPageUrl(`PlanDetail?id=${plan.id}`))}
      className="w-full text-left bg-white rounded-2xl border border-[#FAD98D]/30 overflow-hidden shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative h-14 overflow-hidden">
        <img src={plan.image} alt={plan.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A2F]/80 to-transparent" />
        <div className="absolute inset-0 flex items-center px-3 gap-3">
          <p className="text-white font-bold text-sm truncate flex-1">{plan.name}</p>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-[#c9a227]/80 rounded-full px-2 py-0.5">
              <Flame className="w-3 h-3 text-white" />
              <span className="text-white text-[10px] font-bold">{streak}</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-3 py-2 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#FAD98D]/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#c9a227] to-[#FAD98D] rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] font-bold text-[#c9a227] flex-shrink-0">{pct}%</span>
        <ChevronRight className="w-4 h-4 text-[#0A1A2F]/30 flex-shrink-0" />
      </div>
    </motion.button>
  );
}

// ─── Quick tools row ──────────────────────────────────────────────────────────
function QuickTools({ bookmarkCount, onStatsClick }) {
  const tools = [
    { label: 'Saved Verses', icon: Bookmark, value: bookmarkCount > 0 ? bookmarkCount : null, page: 'Bookmarks', color: 'text-[#c9a227]', bg: 'bg-[#FAD98D]/20' },
    { label: 'Spiritual Insights', icon: Sparkles, value: null, page: 'SpiritualInsights', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];
  return (
    <div className="flex gap-3">
      {tools.map(({ label, icon: Icon, value, page, color, bg }) => (
        <Link key={page} to={createPageUrl(page)} className="flex-1">
          <div className={`${bg} rounded-2xl p-3.5 flex items-center gap-2.5 border border-transparent hover:border-[#FAD98D]/40 transition-all`}>
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0A1A2F]">{label}</p>
              {value != null && <p className={`text-xs font-bold ${color}`}>{value} saved</p>}
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#0A1A2F]/25 ml-auto" />
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Study Guide with search ──────────────────────────────────────────────────
function StudyTabContent() {
  const [query, setQuery] = useState('');
  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1A2F]/35" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search study guides…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FAD98D]/15 border border-[#FAD98D]/25 text-sm text-[#0A1A2F] placeholder:text-[#0A1A2F]/40 focus:outline-none focus:border-[#c9a227]/50"
        />
      </div>
      <BibleStudyGuide filterQuery={query} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
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
  const [searchParams] = useSearchParams();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LAST_READ_KEY);
      if (stored) setLastRead(JSON.parse(stored));
    } catch {}
  }, []);

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list(),
  });

  const { data: planProgress = [] } = useQuery({
    queryKey: ['planProgress'],
    queryFn: () => base44.entities.ReadingPlanProgress.list(),
  });

  const createBookmark = useMutation({
    mutationFn: (data) => base44.entities.Bookmark.create(data),
    onSuccess: () => queryClient.invalidateQueries(['bookmarks']),
  });
  const deleteBookmark = useMutation({
    mutationFn: (id) => base44.entities.Bookmark.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['bookmarks']),
  });

  // Deep-link: ?book=John&chapter=3
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
    const isOld = bibleBooks.oldTestament.some(b => b.name === data.book.name);
    setSearchData(data);
    openReading(data.book, data.chapter || 1, isOld);
  };

  const handleBookmark = (verse, color, note = '') => {
    const bookName = verse.book || initialBook?.name;
    const chapterNum = verse.chapter || initialChapter;
    const existing = bookmarks.find(b => b.book === bookName && b.chapter === chapterNum && b.verse === verse.verse);
    if (existing) { deleteBookmark.mutate(existing.id); return; }
    createBookmark.mutate({ book: bookName, chapter: chapterNum, verse: verse.verse, verse_text: verse.text, highlight_color: color, note });
  };

  const getProgressForPlan = (planId) => planProgress.find(p => p.plan_id === planId);
  const activePlanProgress = planProgress[0] || null;
  const activePlan = activePlanProgress ? readingPlans.find(p => p.id === activePlanProgress.plan_id) : null;
  const suggestedPlans = readingPlans.filter(p => !getProgressForPlan(p.id)).slice(0, 3);
  const continueBook = lastRead ? getBookByName(lastRead.bookName) : null;
  const verse = getVerseOfDay();

  // ── Reader views ──────────────────────────────────────────────────────────
  if (view === 'oldTestament') {
    return <UnifiedBibleReader testament="old" onBack={handleBackToHome} initialBook={initialBook} initialChapter={initialChapter} bookmarks={bookmarks} onBookmark={handleBookmark} searchData={searchData} />;
  }
  if (view === 'newTestament') {
    return <UnifiedBibleReader testament="new" onBack={handleBackToHome} initialBook={initialBook} initialChapter={initialChapter} bookmarks={bookmarks} onBookmark={handleBookmark} searchData={searchData} />;
  }

  // ── Hub ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-28">
      <div className="px-4 pt-4 pb-6 max-w-lg mx-auto">

        {/* Page header — no back arrow (Bible is a primary tab) */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0A1A2F]">Bible</h1>
            <p className="text-sm text-[#0A1A2F]/50 mt-0.5">Read · Study · Reflect</p>
          </div>
          <Link to={createPageUrl('BibleGoalsPage')}>
            <button className="flex items-center gap-1.5 bg-[#FAD98D]/25 border border-[#FAD98D]/40 text-[#C9A227] text-xs font-bold px-3 py-2 rounded-xl">
              <Target className="w-3.5 h-3.5" /> Goals
            </button>
          </Link>
        </motion.div>

        <Tabs defaultValue="read" className="w-full">
          <TabsList id="tour-bible-tabs" className="grid w-full grid-cols-3 mb-5 bg-[#FAD98D]/15 rounded-xl p-1 border border-[#FAD98D]/20">
            {[
              { value: 'read',       icon: BookOpen, label: 'Read'       },
              { value: 'study',      icon: TrendingUp, label: 'Study'    },
              { value: 'devotional', icon: Heart,    label: 'Devotional' },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger key={value} value={value}
                className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#c9a227] data-[state=active]:to-[#FAD98D] data-[state=active]:text-white data-[state=active]:shadow-sm">
                <Icon className="w-3.5 h-3.5 mr-1" />{label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── READ TAB ── */}
          <TabsContent value="read">
            <div className="space-y-4">

              {/* Bible Goals entry card */}
              <Link to={createPageUrl('BibleGoalsPage')}>
                <motion.div id="tour-bible-goals-entry" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 flex items-center gap-3 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #1a3050 60%, #C9A227 220%)' }}>
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📖</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm leading-tight">My Bible Study Goals</p>
                    <p className="text-white/55 text-xs mt-0.5">Translation · Topics · Reading plans · Tips</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                </motion.div>
              </Link>

              {/* 1. Verse of the Day */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-gradient-to-br from-[#FAD98D]/25 to-[#FAD98D]/15 rounded-2xl p-4 border border-[#FAD98D]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-[#c9a227] rounded-full" />
                    <span className="text-[10px] font-bold text-[#c9a227] uppercase tracking-widest">Verse of the Day</span>
                  </div>
                  <p className="text-[#0A1A2F] text-sm leading-relaxed font-medium mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    "{verse.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#0A1A2F]/50">{verse.book} {verse.chapter}:{verse.verse}</p>
                    <button
                      onClick={() => {
                        const book = getBookByName(verse.book);
                        if (book) {
                          const isOld = bibleBooks.oldTestament.some(b => b.name === book.name);
                          openReading(book, verse.chapter, isOld);
                        }
                      }}
                      className="text-xs font-semibold text-[#c9a227] flex items-center gap-1">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* 2. Continue Reading (if exists) */}
              {continueBook && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  onClick={() => openReading(continueBook, lastRead.chapter, lastRead.isOld)}
                  className="w-full bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] rounded-2xl p-4 text-left hover:opacity-90 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="w-5 h-5 text-[#FAD98D]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wide mb-0.5">Continue Reading</p>
                      <p className="text-white font-bold text-sm">{lastRead.bookName} · Chapter {lastRead.chapter}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </div>
                </motion.button>
              )}

              {/* 3. Open the Word */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-white rounded-2xl border border-[#FAD98D]/25 p-4 shadow-sm">
                <p className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-3">Open the Bible</p>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => { setInitialBook(null); setView('newTestament'); }}
                    className="flex-1 bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm hover:opacity-90 transition-all">
                    New Testament
                  </button>
                  <button
                    onClick={() => { setInitialBook(null); setView('oldTestament'); }}
                    className="flex-1 bg-[#0A1A2F]/8 text-[#0A1A2F] font-semibold text-sm py-2.5 rounded-xl border border-[#0A1A2F]/12 hover:bg-[#0A1A2F]/12 transition-all">
                    Old Testament
                  </button>
                </div>
                <BibleSearchBar onNavigate={handleSearchNavigate} />
              </motion.div>

              {/* 4. Active reading plan */}
              {activePlan && activePlanProgress && (
                <div>
                  <p className="text-[10px] font-bold text-[#0A1A2F]/40 uppercase tracking-widest mb-2">Your Plan</p>
                  <ActivePlanCard progress={activePlanProgress} plan={activePlan} navigate={navigate} />
                </div>
              )}

              {/* 5. Quick tools — Saved Verses + Spiritual Insights */}
              <QuickTools bookmarkCount={bookmarks.length} onStatsClick={(s) => { setSelectedStat(s); setShowStatsModal(true); }} />

              {/* 6. Discover plans (only if no active plan) */}
              {!activePlan && suggestedPlans.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-[#0A1A2F]/40 uppercase tracking-widest flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#c9a227]" /> Reading Plans
                    </p>
                    <Link to={createPageUrl('Plans')} className="text-xs text-[#c9a227] font-semibold">View All</Link>
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
            <StudyTabContent />
          </TabsContent>

          {/* ── DEVOTIONAL TAB ── */}
          <TabsContent value="devotional">
            <div className="space-y-6">
              {/* MoodTracker lives here — intent matches: "I want scripture for how I feel" */}
              <MoodTracker />
              <DevotionalContent />
            </div>
          </TabsContent>

        </Tabs>
      </div>

      <BibleStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        statType={selectedStat}
        progress={planProgress}
        bookmarks={bookmarks}
      />
      <ChatButton bot="Gideon" id="tour-gideon-btn" />
    </div>
  );
}