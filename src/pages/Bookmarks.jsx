import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, BookOpen, Search, Heart, X } from 'lucide-react';

// ── Highlight colours matching VerseActionMenu exactly ──────────────────────
const COLORS = {
  yellow: { bg: 'rgba(250,217,141,0.30)', border: 'rgba(201,162,39,0.40)',  dot: 'rgba(250,217,141,0.85)', label: 'Gold'   },
  blue:   { bg: 'rgba(175,199,227,0.30)', border: 'rgba(60,78,83,0.30)',    dot: 'rgba(175,199,227,0.85)', label: 'Blue'   },
  green:  { bg: 'rgba(120,195,130,0.25)', border: 'rgba(120,195,130,0.40)', dot: 'rgba(120,195,130,0.85)', label: 'Green'  },
  pink:   { bg: 'rgba(242,176,176,0.25)', border: 'rgba(242,176,176,0.50)', dot: 'rgba(242,176,176,0.85)', label: 'Pink'   },
};

function BookmarkItem({ bookmark, onDelete, onOpen, index }) {
  const isAffirmation = bookmark.book === 'Affirmation';
  const col = COLORS[bookmark.highlight_color];

  const ref = isAffirmation
    ? null
    : `${bookmark.book} ${bookmark.chapter}:${bookmark.verse}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-[#FAD98D]/25 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 overflow-hidden shadow-sm dark:shadow-none"
    >
      {/* Colour accent bar */}
      {col && (
        <div className="h-1 w-full" style={{ backgroundColor: col.dot }} />
      )}

      <div className="p-4">
        {/* Verse / affirmation text */}
        <p
          className="font-serif text-[#0A1A2F] dark:text-white leading-relaxed mb-3 text-sm"
          style={col ? { backgroundColor: col.bg, borderRadius: '6px', padding: '8px 10px' } : undefined}
        >
          "{bookmark.verse_text}"
        </p>

        {/* Reference row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAffirmation ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-[#c9a227]">
                <Heart className="w-3 h-3 fill-[#c9a227]" /> Affirmation
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#0A1A2F]/60 dark:text-white/60">{ref}</span>
            )}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => onOpen(bookmark)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#0A1A2F] dark:text-white hover:bg-[#F2F6FA] dark:bg-[#0A1A2F] transition-colors"
              title={isAffirmation ? 'Open affirmations' : 'Open in Bible'}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(bookmark.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0A1A2F]/40 dark:text-white/40 hover:text-red-400 hover:bg-red-50 dark:bg-red-900/20 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Note */}
        {bookmark.note && bookmark.book !== 'Affirmation' && (
          <p className="mt-3 pt-3 border-t border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 text-xs text-[#0A1A2F]/55 dark:text-white/55 italic leading-relaxed">
            {bookmark.note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Filter chip ──────────────────────────────────────────────────────────────
function Chip({ active, onClick, children, dot }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex-shrink-0 ${
        active
          ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
          : 'bg-white dark:bg-white/5 text-[#0A1A2F]/60 dark:text-white/60 border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 hover:border-[#c9a227]/50'
      }`}
    >
      {dot && (
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
      )}
      {children}
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Bookmarks() {
  const [user, setUser]       = useState(null);
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const queryClient           = useQueryClient();
  const navigate              = useNavigate();

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  // Fixed: filter by user, not list() which returns everyone's bookmarks
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks', user?.email],
    queryFn:  () => base44.entities.Bookmark.filter({ created_by: user.email }, '-created_date'),
    enabled:  !!user?.email,
  });

  const deleteBookmark = useMutation({
    mutationFn: (id) => base44.entities.Bookmark.delete(id),
    onSuccess:  () => queryClient.invalidateQueries(['bookmarks']),
  });

  const handleOpen = (bookmark) => {
    if (bookmark.book === 'Affirmation') {
      navigate(createPageUrl('AffirmationsPage'));
    } else {
      navigate(createPageUrl(`Bible?book=${bookmark.book}&chapter=${bookmark.chapter}`));
    }
  };

  // Build filter counts
  const bibleCount       = bookmarks.filter(b => b.book !== 'Affirmation').length;
  const affirmationCount = bookmarks.filter(b => b.book === 'Affirmation').length;

  // Apply filter then search
  const afterFilter = filter === 'all'
    ? bookmarks
    : filter === 'affirmations'
      ? bookmarks.filter(b => b.book === 'Affirmation')
      : filter === 'bible'
        ? bookmarks.filter(b => b.book !== 'Affirmation')
        : bookmarks.filter(b => b.highlight_color === filter);

  const filtered = search.trim()
    ? afterFilter.filter(b =>
        b.verse_text?.toLowerCase().includes(search.toLowerCase()) ||
        b.book?.toLowerCase().includes(search.toLowerCase()) ||
        b.note?.toLowerCase().includes(search.toLowerCase())
      )
    : afterFilter;

  const FILTERS = [
    { id: 'all',          label: `All (${bookmarks.length})`,          dot: null },
    { id: 'bible',        label: `Bible (${bibleCount})`,              dot: null },
    { id: 'affirmations', label: `Affirmations (${affirmationCount})`, dot: null },
    ...Object.entries(COLORS).map(([id, c]) => ({ id, label: c.label, dot: c.dot })),
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Saved Verses</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Your highlights & notes</p>
          </div>
        </div>
      </div>

        <div className="w-8 h-8 border-4 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-white/5 border-b border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 px-4 pt-5 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#FAD98D] flex items-center justify-center flex-shrink-0">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0A1A2F] dark:text-white dark:text-white">Saved Verses</h1>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">
                {bookmarks.length === 0
                  ? 'No bookmarks yet'
                  : `${bibleCount} Bible · ${affirmationCount} Affirmation`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search verses, books, notes…"
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#F2F6FA] dark:bg-[#0A1A2F] text-sm text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/35 border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 focus:outline-none focus:border-[#c9a227]/50"
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

      {/* ── Filter chips ── */}
      {bookmarks.length > 0 && (
        <div className="border-b border-[#FAD98D]/15 dark:border-[#FAD98D]/8 bg-white dark:bg-white/5">
          <div className="max-w-lg mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto">
            {FILTERS.map(({ id, label, dot }) => (
              <Chip key={id} active={filter === id} onClick={() => setFilter(id)} dot={dot}>
                {label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-white/5 rounded-2xl p-4 animate-pulse border border-[#FAD98D]/20 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5">
                <div className="h-3 bg-[#FAD98D]/30 rounded w-3/4 mb-3" />
                <div className="h-3 bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          /* Empty state */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-[#c9a227]" />
            </div>
            <h3 className="text-base font-bold text-[#0A1A2F] dark:text-white mb-1">No saved verses yet</h3>
            <p className="text-sm text-[#0A1A2F]/50 dark:text-white/50 mb-5 max-w-xs mx-auto">
              Tap any verse while reading to highlight and save it here
            </p>
            <button
              onClick={() => navigate(createPageUrl('Bible'))}
              className="bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Open Bible
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          /* No results for filter/search */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-12">
            <p className="text-[#0A1A2F]/40 dark:text-white/40 text-sm">No verses match this filter</p>
            <button onClick={() => { setFilter('all'); setSearch(''); }}
              className="mt-3 text-xs font-semibold text-[#c9a227] hover:opacity-75">
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((bookmark, i) => (
                <BookmarkItem
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={deleteBookmark.mutate}
                  onOpen={handleOpen}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

