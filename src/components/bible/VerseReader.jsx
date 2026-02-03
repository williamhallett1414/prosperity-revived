import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Settings2, Loader2, Share2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import VerseAnnotationModal from '@/components/bible/VerseAnnotationModal';

const highlightColors = {
  yellow: 'bg-yellow-200/60',
  green: 'bg-green-200/60',
  blue: 'bg-blue-200/60',
  pink: 'bg-pink-200/60',
  purple: 'bg-purple-200/60'
};

export default function VerseReader({ book, chapter, onBack, onNavigate, bookmarks, onBookmark, planDay, planId }) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('text-lg');
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [annotatingVerse, setAnnotatingVerse] = useState(null);

  useEffect(() => {
    fetchVerses();
  }, [book.name, chapter]);

  const fetchVerses = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate Bible verses for ${book.name} Chapter ${chapter}. Return each verse with its number and text. Make sure the text is accurate to the NIV translation style. Include all verses in the chapter.`,
        response_json_schema: {
          type: "object",
          properties: {
            verses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  number: { type: "number" },
                  text: { type: "string" }
                }
              }
            }
          }
        }
      });
      setVerses(response.verses || []);
    } catch (error) {
      console.error('Error fetching verses:', error);
    }
    setLoading(false);
  };

  const isBookmarked = (verseNum) => {
    return bookmarks?.some(b => 
      b.book === book.name && 
      b.chapter === chapter && 
      b.verse === verseNum
    );
  };

  const getBookmarkColor = (verseNum) => {
    const bookmark = bookmarks?.find(b => 
      b.book === book.name && 
      b.chapter === chapter && 
      b.verse === verseNum
    );
    return bookmark?.highlight_color || null;
  };

  const handleVerseClick = (verse) => {
    setSelectedVerse(selectedVerse === verse.number ? null : verse.number);
  };

  const handleHighlight = (verse, color) => {
    onBookmark({
      book: book.name,
      chapter,
      verse: verse.number,
      text: verse.text
    }, color);
    setSelectedVerse(null);
  };

  const handleAnnotate = (verse) => {
    setAnnotatingVerse({
      book: book.name,
      chapter,
      verse: verse.number,
      text: verse.text
    });
    setShowAnnotationModal(true);
    setSelectedVerse(null);
  };

  const handleSaveAnnotation = ({ note, color }) => {
    if (annotatingVerse) {
      onBookmark(annotatingVerse, color, note);
    }
  };

  const getBookmarkForVerse = (verseNum) => {
    return bookmarks?.find(b => 
      b.book === book.name && 
      b.chapter === chapter && 
      b.verse === verseNum
    );
  };

  const handleShare = (verse) => {
    // Navigate to community with verse pre-filled
    const verseData = {
      book: book.name,
      chapter,
      verse: verse.number,
      text: verse.text
    };
    localStorage.setItem('shareVerse', JSON.stringify(verseData));
    window.location.href = createPageUrl('Community');
  };

  const canGoNext = chapter < book.chapters;
  const canGoPrev = chapter > 1;

  return (
    <div className="h-full flex flex-col bg-[#faf8f5]">
      {/* Plan Badge */}
      {planDay && planId && (
        <div className="bg-[#c9a227] text-white px-4 py-2 text-sm text-center">
          📖 Reading Plan - Day {planDay}
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-semibold text-[#1a1a2e]">{book.name}</h2>
            <p className="text-sm text-gray-500">Chapter {chapter}</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings2 className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFontSize('text-base')}>
              Small Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize('text-lg')}>
              Medium Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFontSize('text-xl')}>
              Large Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-2xl mx-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#c9a227]" />
            </div>
          ) : (
            <div className="space-y-1">
              {verses.map((verse) => {
                const bookmarkColor = getBookmarkColor(verse.number);
                const bookmark = getBookmarkForVerse(verse.number);
                const hasNote = bookmark?.note;
                
                return (
                  <div key={verse.number} className="relative inline">
                    <motion.span
                      className={`inline cursor-pointer transition-colors rounded px-0.5 ${
                        bookmarkColor ? highlightColors[bookmarkColor] : ''
                      } ${selectedVerse === verse.number ? 'ring-2 ring-[#c9a227]' : ''} ${
                        hasNote ? 'border-b-2 border-dashed border-[#c9a227]' : ''
                      }`}
                      onClick={() => handleVerseClick(verse)}
                    >
                      <sup className="text-[#c9a227] font-semibold mr-1 text-xs relative">
                        {verse.number}
                        {hasNote && (
                          <FileText className="w-2 h-2 text-[#c9a227] absolute -top-1 -right-2" />
                        )}
                      </sup>
                      <span className={`font-serif ${fontSize} text-gray-800 leading-relaxed`}>
                        {verse.text}{' '}
                      </span>
                    </motion.span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Verse Action Menu */}
          <AnimatePresence>
            {selectedVerse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-4 z-50 min-w-[300px]"
              >
                <p className="text-sm text-gray-500 mb-3">Actions:</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Highlight:</p>
                    <div className="flex gap-2">
                      {Object.keys(highlightColors).map(color => (
                        <button
                          key={color}
                          onClick={() => handleHighlight(
                            verses.find(v => v.number === selectedVerse),
                            color
                          )}
                          className={`w-8 h-8 rounded-full ${highlightColors[color]} border-2 border-white shadow-md hover:scale-110 transition-transform`}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAnnotate(verses.find(v => v.number === selectedVerse))}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border-2 border-[#c9a227] text-[#1a1a2e] rounded-lg hover:bg-[#faf8f5] transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Add Note & Highlight
                  </button>
                  <button
                    onClick={() => handleShare(verses.find(v => v.number === selectedVerse))}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d4a] transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share to Community
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Annotation Modal */}
          <VerseAnnotationModal
            isOpen={showAnnotationModal}
            onClose={() => setShowAnnotationModal(false)}
            verse={annotatingVerse}
            bookmark={annotatingVerse ? getBookmarkForVerse(annotatingVerse.verse) : null}
            onSave={handleSaveAnnotation}
          />
        </div>
      </ScrollArea>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <Button
          variant="ghost"
          disabled={!canGoPrev}
          onClick={() => onNavigate(chapter - 1)}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <span className="text-sm text-gray-500">
          {chapter} of {book.chapters}
        </span>
        
        <Button
          variant="ghost"
          disabled={!canGoNext}
          onClick={() => onNavigate(chapter + 1)}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}