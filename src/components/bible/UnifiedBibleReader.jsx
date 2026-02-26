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

  const saveToJournal = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create(data),
    onSuccess: () => {
      toast.success('Saved to My Journal!');
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

  const handleSaveToJournal = (verse) => {
    const bookmark = getBookmark(verse);
    if (!bookmark?.note) return;

    const verseRef = `${selectedBook.name} ${selectedChapter}:${verse.verse}`;
    const journalContent = `📖 ${verseRef}\n\n"${verse.text}"\n\n💭 My Reflection:\n${bookmark.note}`;

    saveToJournal.mutate({
      title: `Bible Note: ${verseRef}`,
      content: journalContent,
      entry_type: 'scripture_reflection',
      tags: ['Bible Notes', selectedBook.name]
    });
  };

  const toggleNoteExpansion = (verseNum) => {
    setExpandedNotes({
      ...expandedNotes,
      [verseNum]: !expandedNotes[verseNum]
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-[#faf8f5]">
      {/* Left Sidebar - Books */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Bible</span>
          </button>
          <h2 className="text-lg font-bold text-[#0A1A2F]">{testamentName}</h2>
          <p className="text-xs text-gray-500">{books.length} books</p>
        </div>

        <div className="p-2">
          {books.map((book, idx) => (
            <button
              key={idx}
              onClick={() => handleBookSelect(book)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                selectedBook?.name === book.name
                  ? 'bg-[#8fa68a] text-white font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a Book
              </h3>
              <p className="text-gray-500">Choose a book from the {testamentName}</p>
            </div>
          </div>
        )}

        {selectedBook && !selectedChapter && (
          <div className="p-6">
            <div className="mb-6">
              <button
                onClick={handleBackToBooks}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Books</span>
              </button>
              <h2 className="text-2xl font-bold text-[#0A1A2F] mb-1">{selectedBook.name}</h2>
              <p className="text-gray-500">{selectedBook.chapters} chapters</p>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(chapterNum => (
                <motion.button
                  key={chapterNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChapterSelect(chapterNum)}
                  className="aspect-square rounded-lg bg-white border-2 border-gray-200 hover:border-[#8fa68a] hover:bg-[#8fa68a]/10 flex items-center justify-center font-semibold text-gray-700 hover:text-[#8fa68a] transition-all"
                >
                  {chapterNum}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {selectedBook && selectedChapter && (
          <div className="p-6" ref={versesRef}>
            <div className="mb-6 sticky top-0 bg-[#faf8f5] py-4 z-10 border-b border-gray-200">
              <button
                onClick={handleBackToChapters}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8fa68a]"></div>
              </div>
            )}

            {!loading && verses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No verses available</p>
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
                        className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
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
                        <span className="text-sm font-semibold text-[#8fa68a] mt-1 flex-shrink-0 w-8">
                          {verse.verse}
                        </span>
                        <p className="text-gray-800 leading-relaxed flex-1">
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
                            <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-[#D9B878]">
                              <button
                                onClick={() => toggleNoteExpansion(verse.verse)}
                                className="flex items-center justify-between w-full text-left mb-2"
                              >
                                <span className="text-xs font-semibold text-[#D9B878]">My Note</span>
                                {noteExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                              {noteExpanded && (
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-sm text-gray-700 whitespace-pre-wrap"
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