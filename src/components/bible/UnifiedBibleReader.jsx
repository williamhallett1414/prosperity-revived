import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronLeft, Bookmark, ChevronDown, ChevronUp, Search, Menu, X } from 'lucide-react';
import { bibleBooks } from './BibleData';
import { base44 } from '@/api/base44Client';
import GideonAskAnything from '@/components/bible/GideonAskAnything';
import VerseActionMenu from '@/components/bible/VerseActionMenu';
import { toast } from 'sonner';
import { useQueryClient, useMutation } from '@tanstack/react-query';

// ─── Constants (defined outside component so they never cause re-renders) ───────

const OLD_GROUPS = [
  { label: 'Torah',          emoji: '📜', books: ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy'] },
  { label: 'History',        emoji: '⚔️', books: ['Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther'] },
  { label: 'Poetry',         emoji: '🎵', books: ['Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon'] },
  { label: 'Major Prophets', emoji: '🔥', books: ['Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel'] },
  { label: 'Minor Prophets', emoji: '📣', books: ['Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'] },
];
const NEW_GROUPS = [
  { label: 'Gospels',         emoji: '✨', books: ['Matthew','Mark','Luke','John'] },
  { label: 'History',         emoji: '🕊️', books: ['Acts'] },
  { label: "Paul's Letters",  emoji: '✉️', books: ['Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon'] },
  { label: 'General Letters', emoji: '📝', books: ['Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude'] },
  { label: 'Prophecy',        emoji: '🌟', books: ['Revelation'] },
];

const FONT_SIZES = [
  { label: 'S', prose: 'text-base',   lineH: '1.9' },
  { label: 'M', prose: 'text-[17px]', lineH: '2.1' },
  { label: 'L', prose: 'text-xl',     lineH: '2.2' },
];

const HL = {
  yellow: { bg: 'rgba(250,217,141,0.4)', dot: '#c9a227' },
  blue:   { bg: 'rgba(175,199,227,0.4)', dot: '#3c7dd4' },
  green:  { bg: 'rgba(120,195,130,0.4)', dot: '#3a8a50' },
  pink:   { bg: 'rgba(242,176,176,0.4)', dot: '#c9607a' },
};

// ─── Sub-components (outside main to prevent remount on every render) ────────

function BookRow({ book, isActive, onSelect }) {
  return (
    <button
      onClick={() => onSelect(book)}
      className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all flex items-center justify-between group ${
        isActive
          ? 'bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white shadow-sm'
          : 'hover:bg-[#FAD98D]/20 text-[#0A1A2F]/65 hover:text-[#0A1A2F]'
      }`}
    >
      <span className="text-sm font-medium">{book.name}</span>
      <span className={`text-xs tabular-nums ${isActive ? 'text-white/60' : 'text-[#0A1A2F]/30'}`}>{book.chapters}</span>
    </button>
  );
}

function GroupRow({ group, books, isOpen, hasActive, onToggle, selectedBookName, onBookSelect }) {
  return (
    <div>
      <button
        onClick={() => onToggle(group.label)}
        className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors ${
          hasActive ? 'text-[#c9a227]' : 'text-[#0A1A2F]/40 hover:text-[#0A1A2F]'
        }`}
      >
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em]">
          <span>{group.emoji}</span>
          {group.label}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-1.5">
              {books.map((book, i) => (
                <BookRow key={i} book={book} isActive={selectedBookName === book.name} onSelect={onBookSelect} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function UnifiedBibleReader({
  testament = 'old',
  onBack,
  initialBook = null,
  initialChapter = null,
  bookmarks = [],
  onBookmark,
  searchData = null,
}) {
  const [selectedBook, setSelectedBook]       = useState(initialBook);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [verses, setVerses]                   = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [highlightVerse, setHighlightVerse]   = useState(null);
  const [activeVerseMenu, setActiveVerseMenu] = useState(null);
  const [expandedNotes, setExpandedNotes]     = useState({});
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [bookSearch, setBookSearch]           = useState('');
  const [openGroups, setOpenGroups]           = useState({});
  const [fontIdx, setFontIdx]                 = useState(1);
  const contentRef = useRef(null);
  const queryClient = useQueryClient();

  const allBooks = testament === 'old' ? bibleBooks.oldTestament : bibleBooks.newTestament;
  const groups   = testament === 'old' ? OLD_GROUPS : NEW_GROUPS;
  const testName = testament === 'old' ? 'Old Testament' : 'New Testament';

  // Open the group that contains the active book on first load
  useEffect(() => {
    const init = {};
    groups.forEach(g => {
      init[g.label] = initialBook ? g.books.includes(initialBook.name) : g.label === groups[0].label;
    });
    setOpenGroups(init);
  }, [testament]);

  useEffect(() => {
    if (initialBook && initialChapter) {
      setSelectedBook(initialBook);
      setSelectedChapter(initialChapter);
      fetchVerses(initialBook.name, initialChapter);
    }
  }, [initialBook?.name, initialChapter]);

  useEffect(() => {
    if (searchData) {
      setSelectedBook(searchData.book);
      if (searchData.chapter) {
        setSelectedChapter(searchData.chapter);
        if (searchData.verse) {
          setHighlightVerse(searchData.verse);
          setTimeout(() => setHighlightVerse(null), 3500);
        }
      }
    }
  }, [searchData]);

  useEffect(() => {
    if (highlightVerse && verses.length > 0) {
      setTimeout(() => {
        document.getElementById(`v-${highlightVerse}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [verses, highlightVerse]);

  const fetchVerses = async (bookName, chapterNum) => {
    setLoading(true);
    setVerses([]);
    try {
      const { data } = await base44.functions.invoke('fetchBibleVerse', { book: bookName, chapter: chapterNum });
      setVerses(data?.verses || data || []);
    } catch {
      setVerses([]);
    }
    setLoading(false);
  };

  const handleBookSelect = useCallback((book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setVerses([]);
    setSidebarOpen(false);
  }, []);

  const handleChapterSelect = async (num) => {
    setSelectedChapter(num);
    try {
      localStorage.setItem('bible_last_read', JSON.stringify({ bookName: selectedBook.name, chapter: num, isOld: testament === 'old' }));
    } catch {}
    await fetchVerses(selectedBook.name, num);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBooks    = () => { setSelectedBook(null); setSelectedChapter(null); setVerses([]); };
  const handleBackToChapters = () => { setSelectedChapter(null); setVerses([]); };
  const toggleGroup = useCallback((label) => setOpenGroups(prev => ({ ...prev, [label]: !prev[label] })), []);
  const toggleNote  = (verseNum) => setExpandedNotes(prev => ({ ...prev, [verseNum]: !prev[verseNum] }));

  const getBookmark = (verse) =>
    bookmarks.find(b => b.book === selectedBook?.name && b.chapter === selectedChapter && b.verse === verse.verse);

  const createBM = useMutation({ mutationFn: d => base44.entities.Bookmark.create(d),                  onSuccess: () => queryClient.invalidateQueries(['bookmarks']) });
  const updateBM = useMutation({ mutationFn: ({ id, data }) => base44.entities.Bookmark.update(id, data), onSuccess: () => queryClient.invalidateQueries(['bookmarks']) });
  const deleteBM = useMutation({ mutationFn: id => base44.entities.Bookmark.delete(id),                  onSuccess: () => queryClient.invalidateQueries(['bookmarks']) });

  const handleHighlight = (verse, color, note = '') => {
    const e = getBookmark(verse);
    if (e) updateBM.mutate({ id: e.id, data: { highlight_color: color, note: note || e.note } });
    else   createBM.mutate({ book: selectedBook.name, chapter: selectedChapter, verse: verse.verse, verse_text: verse.text, highlight_color: color, note });
  };
  const handleAddNote = (verse, noteText) => {
    const e = getBookmark(verse);
    if (e) updateBM.mutate({ id: e.id, data: { note: noteText } });
    else   createBM.mutate({ book: selectedBook.name, chapter: selectedChapter, verse: verse.verse, verse_text: verse.text, highlight_color: 'yellow', note: noteText });
    setExpandedNotes(prev => ({ ...prev, [verse.verse]: true }));
  };
  const handleUpdateNote     = (verse, noteText) => { const e = getBookmark(verse); if (e) updateBM.mutate({ id: e.id, data: { note: noteText } }); };
  const handleRemoveHighlight = (verse) => {
    const e = getBookmark(verse);
    if (!e) return;
    if (e.note) updateBM.mutate({ id: e.id, data: { highlight_color: null } });
    else        deleteBM.mutate(e.id);
  };
  const handleSaveToJournal = async (verse) => {
    const bm = getBookmark(verse);
    if (!bm?.note) { toast.error('Add a note first to save to journal'); return; }
    const ref = `${selectedBook.name} ${selectedChapter}:${verse.verse}`;
    try {
      await base44.entities.JournalEntry.create({ title: `Bible Note: ${ref}`, content: `📖 ${ref}\n\n"${verse.text}"\n\n💭 My Reflection:\n${bm.note}`, entry_type: 'bible_notes', tags: ['Bible Notes', selectedBook.name] });
      await queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      toast.success('Saved to My Journal!');
    } catch (err) { toast.error(`Failed: ${err.message || 'Unknown error'}`); }
  };

  const filteredBooks = bookSearch.trim()
    ? allBooks.filter(b => b.name.toLowerCase().includes(bookSearch.toLowerCase()))
    : null;

  const crumbs = [
    { label: testName,       onClick: handleBackToBooks },
    selectedBook && { label: selectedBook.name, onClick: selectedChapter ? handleBackToChapters : null },
    selectedBook && selectedChapter && { label: `Chapter ${selectedChapter}`, onClick: null },
  ].filter(Boolean);

  // ─── Sidebar JSX (stable reference via extracted components above) ─────────
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-5 pb-4 border-b border-[#D9B878]/20">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#0A1A2F]/40 hover:text-[#c9a227] mb-4 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
          Back to Bible
        </button>
        <p className="text-xs font-bold text-[#0A1A2F] tracking-wide uppercase mb-3">{testName}</p>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A1A2F]/30 pointer-events-none" />
          <input
            value={bookSearch}
            onChange={e => setBookSearch(e.target.value)}
            placeholder="Search books…"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-[#FAD98D]/15 border border-[#D9B878]/25 focus:outline-none focus:border-[#c9a227]/60 text-[#0A1A2F] placeholder:text-[#0A1A2F]/30"
          />
        </div>
      </div>

      {/* Book list */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredBooks ? (
          <div className="px-2">
            {filteredBooks.length === 0 && (
              <p className="text-xs text-center text-[#0A1A2F]/35 py-5">No books found</p>
            )}
            {filteredBooks.map((book, i) => (
              <BookRow key={i} book={book} isActive={selectedBook?.name === book.name} onSelect={handleBookSelect} />
            ))}
          </div>
        ) : (
          groups.map(group => {
            const gBooks   = allBooks.filter(b => group.books.includes(b.name));
            const isOpen   = !!openGroups[group.label];
            const hasActive = !!(selectedBook && group.books.includes(selectedBook.name));
            return (
              <GroupRow
                key={group.label}
                group={group}
                books={gBooks}
                isOpen={isOpen}
                hasActive={hasActive}
                onToggle={toggleGroup}
                selectedBookName={selectedBook?.name}
                onBookSelect={handleBookSelect}
              />
            );
          })
        )}
      </div>
    </div>
  );

  const fs = FONT_SIZES[fontIdx];

  return (
    // Account for global fixed header (~56px = 3.5rem) + fixed bottom nav (~60px = 3.75rem)
    <div
      className="flex bg-[#FFFDF7]"
      style={{ height: 'calc(100vh - 7.25rem)' }}
    >
      {/* ── Desktop sidebar ── */}
      <div className="hidden md:flex flex-col w-56 flex-shrink-0 border-r border-[#D9B878]/20 bg-[#FFFDF7]">
        {sidebarContent}
      </div>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0A1A2F]/25 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#FFFDF7] z-50 shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#D9B878]/20 flex-shrink-0">
                <span className="text-sm font-bold text-[#0A1A2F]">{testName}</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAD98D]/20 hover:bg-[#FAD98D]/35 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-[#0A1A2F]" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                {sidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main panel ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <div className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-[#D9B878]/20 bg-[#FFFDF7]">
          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex-shrink-0 w-8 h-8 rounded-full bg-[#FAD98D]/20 hover:bg-[#FAD98D]/35 flex items-center justify-center transition-colors"
            >
              <Menu className="w-4 h-4 text-[#0A1A2F]" />
            </button>
            <button
              onClick={onBack}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-full hover:bg-[#FAD98D]/20 flex-shrink-0 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#0A1A2F]/50" />
            </button>
            <div className="flex items-center gap-1 min-w-0 overflow-hidden">
              {crumbs.map((c, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="w-3 h-3 text-[#0A1A2F]/20 flex-shrink-0" />}
                  {c.onClick
                    ? <button onClick={c.onClick} className="text-xs text-[#c9a227] hover:text-[#b89320] font-semibold whitespace-nowrap transition-colors">{c.label}</button>
                    : <span className="text-xs font-bold text-[#0A1A2F] truncate">{c.label}</span>
                  }
                </React.Fragment>
              ))}
            </div>
          </div>
          {/* Right: font size toggle (only when reading) */}
          {selectedBook && selectedChapter && (
            <div className="flex items-center gap-0.5 flex-shrink-0 bg-[#FAD98D]/15 rounded-lg p-1">
              {FONT_SIZES.map((fs, i) => (
                <button
                  key={i}
                  onClick={() => setFontIdx(i)}
                  className={`w-7 h-6 rounded text-[11px] font-bold transition-all ${
                    fontIdx === i ? 'bg-[#c9a227] text-white shadow-sm' : 'text-[#0A1A2F]/40 hover:text-[#0A1A2F]'
                  }`}
                >
                  {fs.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" ref={contentRef}>

          {/* ── Empty state ── */}
          {!selectedBook && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#D9B878] flex items-center justify-center mb-5 text-3xl shadow-lg">
                📖
              </div>
              <h3 className="text-xl font-bold text-[#0A1A2F] mb-2">Choose a Book</h3>
              <p className="text-sm text-[#0A1A2F]/45 mb-8 leading-relaxed">Browse the {testName}<br />to begin reading</p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden px-7 py-3 bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white rounded-xl font-semibold text-sm shadow-md"
              >
                Browse Books
              </button>
            </div>
          )}

          {/* ── Chapter picker ── */}
          {selectedBook && !selectedChapter && (
            <div className="p-5 pb-16 max-w-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0A1A2F] mb-1">{selectedBook.name}</h2>
                <p className="text-sm text-[#0A1A2F]/45">{selectedBook.chapters} chapters</p>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 gap-3">
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(n => (
                  <motion.button
                    key={n}
                    whileHover={{ scale: 1.07, y: -1 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleChapterSelect(n)}
                    className="aspect-square rounded-xl border-2 border-[#D9B878]/25 bg-[#FAD98D]/10 flex items-center justify-center font-semibold text-sm text-[#0A1A2F]/60 hover:border-[#c9a227] hover:bg-[#c9a227] hover:text-white hover:shadow-md transition-all"
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* ── Verse reader ── */}
          {selectedBook && selectedChapter && (
            <div className="pb-28">
              {/* Chapter heading + inline prev/next */}
              <div className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-[#D9B878]/15">
                <div>
                  <h2 className="text-xl font-bold text-[#0A1A2F] leading-tight">{selectedBook.name}</h2>
                  <p className="text-xs text-[#0A1A2F]/40 mt-0.5 font-medium">
                    Chapter {selectedChapter} <span className="text-[#D9B878]">·</span> {selectedBook.chapters} total
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectedChapter > 1 && handleChapterSelect(selectedChapter - 1)}
                    disabled={selectedChapter <= 1}
                    className="w-9 h-9 rounded-full bg-[#FAD98D]/20 hover:bg-[#FAD98D]/40 disabled:opacity-25 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#0A1A2F]" />
                  </button>
                  <button
                    onClick={() => selectedChapter < selectedBook.chapters && handleChapterSelect(selectedChapter + 1)}
                    disabled={selectedChapter >= selectedBook.chapters}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c9a227] to-[#D9B878] hover:opacity-90 disabled:opacity-25 flex items-center justify-center shadow-sm transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-[#D9B878]/30 border-t-[#c9a227] animate-spin" />
                  <p className="text-sm text-[#0A1A2F]/35">Loading scripture…</p>
                </div>
              )}

              {/* Empty */}
              {!loading && verses.length === 0 && (
                <div className="text-center py-20 px-6">
                  <p className="text-[#0A1A2F]/35 text-sm">Unable to load verses. Please try again.</p>
                </div>
              )}

              {/* Verses */}
              {!loading && verses.length > 0 && (
                <div className="px-4 sm:px-6 max-w-2xl pt-2">
                  {verses.map((verse, idx) => {
                    const bm      = getBookmark(verse);
                    const hlColor = HL[bm?.highlight_color];
                    const hasNote = !!bm?.note;
                    const noteOpen = !!expandedNotes[verse.verse];
                    const isActive = activeVerseMenu === verse.verse;

                    return (
                      <div key={idx} id={`v-${verse.verse}`} className="group">
                        {/* Verse row */}
                        <div
                          onClick={() => setActiveVerseMenu(isActive ? null : verse.verse)}
                          className="flex gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors"
                          style={{
                            backgroundColor: isActive
                              ? 'rgba(201,162,39,0.08)'
                              : hlColor
                                ? hlColor.bg
                                : undefined,
                          }}
                        >
                          {/* Verse number — superscript style */}
                          <span
                            className="flex-shrink-0 text-[11px] font-bold text-[#c9a227] select-none tabular-nums"
                            style={{ paddingTop: '0.35em', minWidth: '1.5rem', textAlign: 'right' }}
                          >
                            {verse.verse}
                          </span>

                          {/* Scripture text */}
                          <p
                            className={`font-serif ${fs.prose} text-[#0A1A2F] flex-1`}
                            style={{ lineHeight: fs.lineH }}
                          >
                            {verse.text}
                          </p>

                          {/* Bookmark/highlight indicators */}
                          {(hlColor || hasNote) && (
                            <div className="flex flex-col items-center gap-1.5 flex-shrink-0" style={{ paddingTop: '0.4em' }}>
                              {hlColor && (
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hlColor.dot }} />
                              )}
                              {hasNote && (
                                <Bookmark className="w-3 h-3" style={{ fill: '#D9B878', color: '#D9B878' }} />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Verse action menu */}
                        {isActive && (
                          <div className="relative z-10 ml-10 mb-1">
                            <VerseActionMenu
                              verse={verse}
                              bookName={selectedBook.name}
                              chapter={selectedChapter}
                              existingBookmark={bm}
                              onHighlight={(color, note) => handleHighlight(verse, color, note)}
                              onAddNote={note => handleAddNote(verse, note)}
                              onUpdateNote={note => handleUpdateNote(verse, note)}
                              onRemoveHighlight={() => handleRemoveHighlight(verse)}
                              onSaveToJournal={() => handleSaveToJournal(verse)}
                              onClose={() => setActiveVerseMenu(null)}
                            />
                          </div>
                        )}

                        {/* Inline note */}
                        {hasNote && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-10 mr-2 mb-1"
                            >
                              <div
                                className="rounded-r-lg px-3 py-2.5"
                                style={{ borderLeft: '3px solid #D9B878', backgroundColor: 'rgba(250,217,141,0.1)' }}
                              >
                                <button
                                  onClick={() => toggleNote(verse.verse)}
                                  className="flex items-center justify-between w-full text-left mb-1"
                                >
                                  <span className="text-[11px] font-bold text-[#8a6e1a]">My Note</span>
                                  {noteOpen
                                    ? <ChevronUp className="w-3.5 h-3.5 text-[#0A1A2F]/35" />
                                    : <ChevronDown className="w-3.5 h-3.5 text-[#0A1A2F]/35" />
                                  }
                                </button>
                                {noteOpen && (
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-[#0A1A2F]/75 leading-relaxed whitespace-pre-wrap"
                                  >
                                    {bm.note}
                                  </motion.p>
                                )}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                    );
                  })}

                  {/* Footer navigation */}
                  <div className="mt-10 pt-6 border-t border-[#D9B878]/20 flex items-center justify-between gap-4">
                    <button
                      onClick={() => selectedChapter > 1 && handleChapterSelect(selectedChapter - 1)}
                      disabled={selectedChapter <= 1}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#D9B878]/30 text-sm font-medium text-[#0A1A2F]/55 hover:text-[#0A1A2F] hover:border-[#c9a227]/40 disabled:opacity-25 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="text-xs text-[#0A1A2F]/30 text-center hidden sm:block">
                      {selectedBook.name} · Ch {selectedChapter}
                    </span>
                    <button
                      onClick={() => selectedChapter < selectedBook.chapters && handleChapterSelect(selectedChapter + 1)}
                      disabled={selectedChapter >= selectedBook.chapters}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-25 shadow-md transition-all"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        .highlight-verse { animation: hl-pulse 2.5s ease-in-out; }
        @keyframes hl-pulse {
          0%, 100% { background: transparent; }
          30%, 70%  { background: rgba(217,184,120,0.22); border-radius: 10px; }
        }
      `}</style>

      <GideonAskAnything />
    </div>
  );
}
