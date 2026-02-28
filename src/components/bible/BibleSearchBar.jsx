import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { getAllBooks, getBookByName } from '@/components/bible/BibleData';
import { motion, AnimatePresence } from 'framer-motion';
import AdvancedBibleSearch from './AdvancedBibleSearch';

export default function BibleSearchBar({ onNavigate }) {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parseSearchQuery = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return null;

    // Pattern: Book Chapter:Verse (e.g., "John 3:16")
    const versePattern = /^(.+?)\s+(\d+):(\d+)$/i;
    const verseMatch = trimmed.match(versePattern);
    if (verseMatch) {
      const book = getBookByName(verseMatch[1].trim());
      if (book) {
        return {
          type: 'verse',
          book: book,
          chapter: parseInt(verseMatch[2]),
          verse: parseInt(verseMatch[3])
        };
      }
    }

    // Pattern: Book Chapter (e.g., "John 3")
    const chapterPattern = /^(.+?)\s+(\d+)$/i;
    const chapterMatch = trimmed.match(chapterPattern);
    if (chapterMatch) {
      const book = getBookByName(chapterMatch[1].trim());
      if (book) {
        return {
          type: 'chapter',
          book: book,
          chapter: parseInt(chapterMatch[2])
        };
      }
    }

    // Pattern: Book only (e.g., "John")
    const book = getBookByName(trimmed);
    if (book) {
      return {
        type: 'book',
        book: book
      };
    }

    return null;
  };

  const generateSuggestions = (query) => {
    if (!query.trim()) return [];

    const allBooks = getAllBooks();
    const suggestions = [];
    const lowerQuery = query.toLowerCase();

    // Check if user is typing a book name
    const matchingBooks = allBooks.filter(book => 
      book.name.toLowerCase().includes(lowerQuery) ||
      book.abbr?.toLowerCase().includes(lowerQuery)
    );

    // Try to parse current input
    const parsed = parseSearchQuery(query);

    if (parsed) {
      // If we have a valid parse, suggest the exact match first
      if (parsed.type === 'verse') {
        if (parsed.chapter <= parsed.book.chapters) {
          suggestions.push({
            text: `${parsed.book.name} ${parsed.chapter}:${parsed.verse}`,
            type: 'verse',
            data: parsed
          });
        }
      } else if (parsed.type === 'chapter') {
        if (parsed.chapter <= parsed.book.chapters) {
          suggestions.push({
            text: `${parsed.book.name} ${parsed.chapter}`,
            type: 'chapter',
            data: parsed
          });
          
          // Also suggest a few verses
          for (let v = 1; v <= Math.min(5, 20); v++) {
            suggestions.push({
              text: `${parsed.book.name} ${parsed.chapter}:${v}`,
              type: 'verse',
              data: { ...parsed, type: 'verse', verse: v }
            });
          }
        }
      } else if (parsed.type === 'book') {
        suggestions.push({
          text: parsed.book.name,
          type: 'book',
          data: parsed
        });
        
        // Suggest first few chapters
        for (let ch = 1; ch <= Math.min(5, parsed.book.chapters); ch++) {
          suggestions.push({
            text: `${parsed.book.name} ${ch}`,
            type: 'chapter',
            data: { type: 'chapter', book: parsed.book, chapter: ch }
          });
        }
      }
    } else {
      // Suggest matching books
      matchingBooks.slice(0, 5).forEach(book => {
        suggestions.push({
          text: book.name,
          type: 'book',
          data: { type: 'book', book: book }
        });
      });
    }

    return suggestions.slice(0, 8);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (searchData = null) => {
    const data = searchData || parseSearchQuery(searchQuery);
    
    if (!data) return;

    setShowSuggestions(false);
    setSearchQuery('');
    
    onNavigate(data);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion.data);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <div ref={containerRef} className="relative mb-4">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              placeholder="Quick navigation: books, chapters, verses…"
              className="w-full pl-12 pr-12 py-3.5 bg-white rounded-2xl border-2 border-gray-200 focus:border-[#D9B878] focus:outline-none text-[#0A1A2F] placeholder:text-gray-400 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowAdvancedSearch(true)}
            className="px-4 py-3.5 bg-gradient-to-r from-[#c9a227] to-[#D9B878] hover:from-[#b89320] hover:to-[#c9a227] text-white rounded-2xl font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
            <span className="hidden sm:inline">Advanced Search</span>
          </button>
        </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden z-50"
          >
            <div className="py-2 max-h-80 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-[#F2F6FA] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    {suggestion.type === 'book' && (
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Search className="w-4 h-4 text-amber-700" />
                      </div>
                    )}
                    {suggestion.type === 'chapter' && (
                      <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-sky-700">Ch</span>
                      </div>
                    )}
                    {suggestion.type === 'verse' && (
                      <div className="w-8 h-8 rounded-lg bg-[#FAD98D]/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#3C4E53]">V</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#0A1A2F]">{suggestion.text}</p>
                      <p className="text-xs text-gray-500">
                        {suggestion.type === 'book' && 'Open book'}
                        {suggestion.type === 'chapter' && 'Read chapter'}
                        {suggestion.type === 'verse' && 'Go to verse'}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-[#D9B878] flex items-center justify-center">
                      <span className="text-white text-xs">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      <AdvancedBibleSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onNavigateToVerse={onNavigate}
      />
    </>
  );
}