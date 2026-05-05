import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { bibleBooks } from '@/components/bible/BibleData';

// ── Section groupings ────────────────────────────────────────────────────────
const OT_SECTIONS = [
  { label: 'Pentateuch',       emoji: '📜', books: ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy'] },
  { label: 'History',          emoji: '⚔️', books: ['Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther'] },
  { label: 'Poetry & Wisdom',  emoji: '🎶', books: ['Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon'] },
  { label: 'Major Prophets',   emoji: '🔥', books: ['Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel'] },
  { label: 'Minor Prophets',   emoji: '📣', books: ['Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'] },
];

const NT_SECTIONS = [
  { label: 'Gospels',          emoji: '✝️', books: ['Matthew','Mark','Luke','John'] },
  { label: 'Acts',             emoji: '🌍', books: ['Acts'] },
  { label: "Paul's Letters",   emoji: '✉️', books: ['Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon'] },
  { label: 'General Letters',  emoji: '📖', books: ['Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude'] },
  { label: 'Prophecy',         emoji: '🌟', books: ['Revelation'] },
];

// Start-here suggestions per testament
const START_HERE = {
  old: [
    { book: 'Psalms',    ch: 1,  desc: 'Worship & reflection' },
    { book: 'Proverbs',  ch: 1,  desc: 'Daily wisdom' },
    { book: 'Genesis',   ch: 1,  desc: 'The beginning' },
  ],
  new: [
    { book: 'John',      ch: 1,  desc: 'The life of Jesus' },
    { book: 'Romans',    ch: 1,  desc: 'The gospel explained' },
    { book: 'Matthew',   ch: 1,  desc: 'Jesus through Jewish eyes' },
  ] };

export default function BibleBooks() {
  const navigate   = useNavigate();
  const [testament, setTestament] = useState('old');
  const [search,    setSearch]    = useState('');

  // Read URL param on mount
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('testament');
    if (p === 'new' || p === 'old') setTestament(p);
  }, []);

  const allBooks  = testament === 'old' ? bibleBooks.oldTestament : bibleBooks.newTestament;
  const sections  = testament === 'old' ? OT_SECTIONS : NT_SECTIONS;
  const bookMap   = useMemo(() => new Map(allBooks.map(b => [b.name, b])), [allBooks]);

  const openBook  = (name) => navigate(createPageUrl(`Bible?book=${name}&chapter=1`));

  // Search — flat filtered list when active
  const query = search.trim().toLowerCase();
  const searchResults = query
    ? allBooks.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.abbr.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ── Sub-header (page title is in Layout's UniversalHeader) ── */}
      <div className="sticky top-14 z-30 bg-white dark:bg-white/5 border-b border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 py-3">
        <div className="max-w-lg mx-auto space-y-3">

          {/* OT / NT toggle */}
          <div className="flex justify-end">
            <div className="flex rounded-xl overflow-hidden border border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 bg-[#F2F6FA] dark:bg-[#0A1A2F]">
              {[['old','OT'],['new','NT']].map(([val, label]) => (
                <button key={val} onClick={() => { setTestament(val); setSearch(''); }}
                  className={`px-4 py-1.5 text-xs font-bold transition-colors ${
                    testament === val
                      ? 'bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white'
                      : 'text-[#0A1A2F]/50 dark:text-white/50 hover:text-[#0A1A2F]/70 dark:text-white/70'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${testament === 'old' ? 'Old' : 'New'} Testament books…`}
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] text-sm text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/35 border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 focus:outline-none focus:border-[#c9a227]/50"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0A1A2F]/30 dark:text-white/30 hover:text-[#0A1A2F]/60 dark:text-white/60">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">

        {/* ── Search results ── */}
        {query ? (
          searchResults.length === 0 ? (
            <p className="text-center text-[#0A1A2F]/40 dark:text-white/40 text-sm py-8">No books match "{query}"</p>
          ) : (
            <div className="space-y-2">
              {searchResults.map((book, i) => (
                <BookRow key={book.name} book={book} index={i} onOpen={openBook} />
              ))}
            </div>
          )
        ) : (
          <>
            {/* ── Start here card ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#FAD98D]/25 to-[#FAD98D]/15 border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 rounded-2xl p-4">
              <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-3">Good places to start</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {START_HERE[testament].map(({ book, ch, desc }) => (
                  <button key={book} onClick={() => navigate(createPageUrl(`Bible?book=${book}&chapter=${ch}`))}
                    className="bg-white dark:bg-white/5 rounded-xl p-3 text-left border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 hover:border-[#c9a227]/40 hover:shadow-sm dark:shadow-none transition-all">
                    <p className="font-bold text-[#0A1A2F] dark:text-white text-sm leading-tight">{book}</p>
                    <p className="text-[10px] text-[#0A1A2F]/45 dark:text-white/45 mt-0.5 leading-tight">{desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── Grouped sections ── */}
            {sections.map((section, si) => {
              const sectionBooks = section.books.map(n => bookMap.get(n)).filter(Boolean);
              return (
                <motion.div key={section.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.04 }}>
                  {/* Section header */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-base leading-none">{section.emoji}</span>
                    <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">{section.label}</p>
                    <span className="text-[10px] text-[#0A1A2F]/25 dark:text-white/25">· {sectionBooks.length} books</span>
                  </div>

                  <div className="space-y-1.5">
                    {sectionBooks.map((book, bi) => (
                      <BookRow key={book.name} book={book} index={si * 10 + bi} onOpen={openBook} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ── Shared book row ───────────────────────────────────────────────────────────
function BookRow({ book, index, onOpen }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.015 }}
      onClick={() => onOpen(book.name)}
      className="w-full text-left flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 hover:border-[#c9a227]/40 hover:bg-[#FAD98D]/8 active:bg-[#FAD98D]/15 dark:bg-[#FAD98D]/8 transition-colors"
    >
      <div>
        <span className="font-semibold text-[#0A1A2F] dark:text-white text-sm">{book.name}</span>
        <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40 mt-0.5">
          {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-[#0A1A2F]/30 dark:text-white/30 font-mono">{book.abbr}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#0A1A2F]/20 dark:text-white/20" />
      </div>
    </motion.button>
  );
}
