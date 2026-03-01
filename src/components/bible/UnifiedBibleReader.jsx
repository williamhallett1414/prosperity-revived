import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Bookmark, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bibleBooks } from './BibleData';
import { base44 } from '@/api/base44Client';
import GideonAskAnything from '@/components/bible/GideonAskAnything';
import VerseActionMenu from '@/components/bible/VerseActionMenu';
import { toast } from 'sonner';
import { useQueryClient, useMutation } from '@tanstack/react-query';

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
  const [activeVerseMenu, setActiveVerseMenu] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const versesRef = useRef(null);
  const queryClient = useQueryClient();

  const books = testament === 'old' ? bibleBooks.oldTestament : bibleBooks.newTestament;
  const testamentName = testament === 'old' ? 'Old Testament' : 'New Testament';

  // Auto-fetch verses when initialBook and initialChapter are provided
  useEffect(() => {
    if (initialBook && initialChapter) {
      setSelectedBook(initialBook);
      setSelectedChapter(initialChapter);
      setLoading(true);
      base44.functions.invoke('fetchBibleVerse', {
        book: initialBook.name,
        chapter: initialChapter
      }).then(({ data }) => {
        const versesData = data?.verses || data || [];
        setVerses(versesData);
      }).catch(() => setVerses([])).finally(() => setLoading(false));
    }
  }, [initialBook?.name, initialChapter]);

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

    // Persist last-read position so Bible home can show "Continue Reading"
    try {
      const isOld = testament === 'old';
      localStorage.setItem('bible_last_read', JSON.stringify({
        bookName: selectedBook.name,
        chapter: chapterNum,
        isOld
      }));
    } catch {}

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

  const getBookmark = (verse) => {
    return bookmarks.find(b => 
      b.book === selectedBook?.name && 
      b.chapter === selectedChapter && 
      b.verse === verse.verse
    );
  };

  const createBookmark = useMutation({
    mutationFn: (data) => base44.entities.Bookmark.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookmarks']);
    }
  });

  const updateBookmark = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Bookmark.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookmarks']);
    }
  });

  const deleteBookmark = useMutation({
    mutationFn: (id) => base44.entities.Bookmark.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookmarks']);
    }
  });



  const handleVerseClick = (verse) => {
    setActiveVerseMenu(activeVerseMenu === verse.verse ? null : verse.verse);
  };

  const handleHighlight = (verse, color, note = '') => {
    const existing = getBookmark(verse);
    
    if (existing) {
      updateBookmark.mutate({
        id: existing.id,
        data: { highlight_color: color, note: note || existing.note }
      });
    } else {
      createBookmark.mutate({
        book: selectedBook.name,
        chapter: selectedChapter,
        verse: verse.verse,
        verse_text: verse.text,
        highlight_color: color,
        note: note
      });
    }
  };

  const handleAddNote = (verse, noteText) => {
    const existing = getBookmark(verse);
    
    if (existing) {
      updateBookmark.mutate({
        id: existing.id,
        data: { note: noteText }
      });
    } else {
      createBookmark.mutate({
        book: selectedBook.name,
        chapter: selectedChapter,
        verse: verse.verse,
        verse_text: verse.text,
        highlight_color: 'yellow',
        note: noteText
      });
    }
    setExpandedNotes({ ...expandedNotes, [verse.verse]: true });
  };

  const handleUpdateNote = (verse, noteText) => {
    const existing = getBookmark(verse);
    if (existing) {
      updateBookmark.mutate({
        id: existing.id,
        data: { note: noteText }
      });
    }
  };

  const handleRemoveHighlight = (verse) => {
    const existing = getBookmark(verse);
    if (existing) {
      if (existing.note) {
        // Keep the bookmark but remove highlight color
        updateBookmark.mutate({
          id: existing.id,
          data: { highlight_color: null }
        });
      } else {
        // Remove the entire bookmark if no note
        deleteBookmark.mutate(existing.id);
      }
    }
  };

  const handleSaveToJournal = async (verse) => {
    console.log('🔵 handleSaveToJournal called');
    console.log('🔵 verse:', verse);
    console.log('🔵 selectedBook:', selectedBook);
    console.log('🔵 selectedChapter:', selectedChapter);
    
    const bookmark = getBookmark(verse);
    console.log('🔵 bookmark found:', bookmark);
    
    if (!bookmark?.note) {
      console.error('❌ No note found in bookmark');
      toast.error('No note found to save');
      return;
    }

    const verseRef = `${selectedBook.name} ${selectedChapter}:${verse.verse}`;
    const journalContent = `📖 ${verseRef}\n\n"${verse.text}"\n\n💭 My Reflection:\n${bookmark.note}`;

    const journalData = {
      title: `Bible Note: ${verseRef}`,
      content: journalContent,
      entry_type: 'bible_notes',
      tags: ['Bible Notes', selectedBook.name]
    };
    
    console.log('🔵 Attempting to save journal data:', JSON.stringify(journalData, null, 2));

    try {
      console.log('🔵 Calling base44.entities.JournalEntry.create...');
      const result = await base44.entities.JournalEntry.create(journalData);
      console.log('✅ CREATE SUCCEEDED! Result:', result);
      console.log('✅ Entry ID:', result.id);
      console.log('✅ Entry Type in result:', result.entry_type);
      console.log('✅ Full result data:', JSON.stringify(result, null, 2));
      
      // Invalidate and refetch
      console.log('🔵 Invalidating queries...');
      await queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      console.log('✅ Queries invalidated');
      
      // Wait a bit and verify
      setTimeout(async () => {
        console.log('🔵 Fetching all entries to verify...');
        const allEntries = await base44.entities.JournalEntry.list();
        console.log('📋 Total entries in DB:', allEntries.length);
        const bibleNotes = allEntries.filter(e => e.entry_type === 'bible_notes');
        console.log('📖 Bible notes entries:', bibleNotes.length);
        console.log('📖 Bible notes data:', bibleNotes);
      }, 1000);
      
      toast.success('✅ Saved to My Journal!');
    } catch (error) {
      console.error('❌ CREATE FAILED!');
      console.error('❌ Error:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error stack:', error?.stack);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      toast.error(`Failed to save: ${error.message || 'Unknown error'}`);
    }
  };

  const toggleNoteExpansion = (verseNum) => {
    setExpandedNotes({
      ...expandedNotes,
      [verseNum]: !expandedNotes[verseNum]
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-[#FFFDF7]">
      {/* Left Sidebar - Books */}
      <div className="w-64 bg-[#FFFDF7] border-r border-[#D9B878]/20 overflow-y-auto">
        <div className="sticky top-0 bg-[#FFFDF7] border-b border-[#D9B878]/20 p-4 z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#0A1A2F]/60 hover:text-[#0A1A2F] mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Bible</span>
          </button>
          <h2 className="text-lg font-bold text-[#0A1A2F]">{testamentName}</h2>
          <p className="text-xs text-[#0A1A2F]/50">{books.length} books</p>
        </div>

        <div className="p-2">
          {books.map((book, idx) => (
            <button
              key={idx}
              onClick={() => handleBookSelect(book)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                selectedBook?.name === book.name
                  ? 'bg-gradient-to-r from-[#c9a227] to-[#D9B878] text-white font-medium'
                  : 'hover:bg-[#FAD98D]/15 text-[#0A1A2F]/70'
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
              <h3 className="text-xl font-semibold text-[#0A1A2F] mb-2">
                Select a Book
              </h3>
              <p className="text-[#0A1A2F]/50">Choose a book from the {testamentName}</p>
            </div>
          </div>
        )}

        {selectedBook && !selectedChapter && (
          <div className="p-6">
            <div className="mb-6">
              <button
                onClick={handleBackToBooks}
                className="flex items-center gap-2 text-[#0A1A2F]/60 hover:text-[#0A1A2F] mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Books</span>
              </button>
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-1">{selectedBook.name}</h2>
              <p className="text-[#0A1A2F]/50">{selectedBook.chapters} chapters</p>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(chapterNum => (
                <motion.button
                  key={chapterNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChapterSelect(chapterNum)}
                  className="aspect-square rounded-lg bg-[#FFFDF7] border-2 border-[#D9B878]/25 hover:border-[#c9a227] hover:bg-[#FAD98D]/15 flex items-center justify-center font-semibold text-[#0A1A2F]/75 hover:text-[#c9a227] transition-all"
                >
                  {chapterNum}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {selectedBook && selectedChapter && (
          <div className="p-6" ref={versesRef}>
            <div className="mb-6 sticky top-0 bg-[#FFFDF7] py-4 z-10 border-b border-[#D9B878]/20">
              <button
                onClick={handleBackToChapters}
                className="flex items-center gap-2 text-[#0A1A2F]/60 hover:text-[#0A1A2F] mb-4"
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c9a227]"></div>
              </div>
            )}

            {!loading && verses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#0A1A2F]/50">No verses available</p>
              </div>
            )}

            {!loading && verses.length > 0 && (
              <div className="max-w-3xl space-y-4">
                {verses.map((verse, idx) => {
                  const bookmark = getBookmark(verse);
                  const isHighlighted = highlightVerse === verse.verse;
                  const hasNote = bookmark?.note;
                  const noteExpanded = expandedNotes[verse.verse];
                  
                  return (
                    <motion.div
                      key={idx}
                      id={`verse-${verse.verse}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`group relative ${isHighlighted ? 'highlight-verse' : ''}`}
                    >
                      <div
                        onClick={() => handleVerseClick(verse)}
                        className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-[#FFFDF7] ${
                          bookmark?.highlight_color ? 'bg-opacity-30' : ''
                        }`}
                        style={{
                          backgroundColor: bookmark?.highlight_color
                            ? bookmark.highlight_color === 'yellow' ? '#FCD34D40'
                            : bookmark.highlight_color === 'blue' ? '#60A5FA40'
                            : bookmark.highlight_color === 'green' ? '#34D39940'
                            : bookmark.highlight_color === 'pink' ? '#F472B640'
                            : 'transparent'
                            : 'transparent'
                        }}
                      >
                        <span className="text-sm font-semibold text-[#c9a227] mt-1 flex-shrink-0 w-8">
                          {verse.verse}
                        </span>
                        <p className="text-[#0A1A2F] leading-relaxed flex-1">
                          {verse.text}
                        </p>
                        {(bookmark?.highlight_color || hasNote) && (
                          <div className="flex items-center gap-1 flex-shrink-0 mt-1">
                            {bookmark.highlight_color && (
                              <div
                                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                                style={{
                                  backgroundColor: bookmark.highlight_color === 'yellow' ? '#FCD34D'
                                    : bookmark.highlight_color === 'blue' ? '#60A5FA'
                                    : bookmark.highlight_color === 'green' ? '#34D399'
                                    : '#F472B6'
                                }}
                              />
                            )}
                            {hasNote && (
                              <Bookmark className="w-4 h-4 fill-[#D9B878] text-[#D9B878]" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Menu */}
                      {activeVerseMenu === verse.verse && (
                        <div className="relative">
                          <VerseActionMenu
                            verse={verse}
                            bookName={selectedBook.name}
                            chapter={selectedChapter}
                            existingBookmark={bookmark}
                            onHighlight={(color, note) => handleHighlight(verse, color, note)}
                            onAddNote={(note) => handleAddNote(verse, note)}
                            onUpdateNote={(note) => handleUpdateNote(verse, note)}
                            onRemoveHighlight={() => handleRemoveHighlight(verse)}
                            onSaveToJournal={() => handleSaveToJournal(verse)}
                            onClose={() => setActiveVerseMenu(null)}
                          />
                        </div>
                      )}

                      {/* Note Display */}
                      {hasNote && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-11 mt-2"
                          >
                            <div className="bg-[#FFFDF7] rounded-lg p-3 border-l-4 border-[#D9B878]">
                              <button
                                onClick={() => toggleNoteExpansion(verse.verse)}
                                className="flex items-center justify-between w-full text-left mb-2"
                              >
                                <span className="text-xs font-semibold text-[#D9B878]">My Note</span>
                                {noteExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-[#0A1A2F]/40" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-[#0A1A2F]/40" />
                                )}
                              </button>
                              {noteExpanded && (
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-sm text-[#0A1A2F] leading-relaxed whitespace-pre-wrap"
                                >
                                  {bookmark.note}
                                </motion.p>
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
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