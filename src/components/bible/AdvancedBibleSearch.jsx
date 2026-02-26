import React, { useState } from 'react';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { getAllBooks } from '@/components/bible/BibleData';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdvancedBibleSearch({ isOpen, onClose, onNavigateToVerse }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    testament: 'all', // 'all', 'old', 'new'
    books: [],
    searchType: 'keywords' // 'keywords', 'phrase', 'thematic'
  });

  const oldTestamentBooks = getAllBooks().filter(b => b.testament === 'old').map(b => b.name);
  const newTestamentBooks = getAllBooks().filter(b => b.testament === 'new').map(b => b.name);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setSearching(true);
    setSearchResults([]);

    try {
      // Build search prompt based on filters
      let booksToSearch = [];
      if (filters.testament === 'old') {
        booksToSearch = oldTestamentBooks;
      } else if (filters.testament === 'new') {
        booksToSearch = newTestamentBooks;
      } else if (filters.books.length > 0) {
        booksToSearch = filters.books;
      } else {
        booksToSearch = [...oldTestamentBooks, ...newTestamentBooks];
      }

      const searchTypeInstructions = {
        keywords: 'Find verses containing these keywords or related concepts',
        phrase: 'Find verses containing this exact phrase or very similar wording',
        thematic: 'Find verses related to this theme, topic, or spiritual concept'
      };

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a Bible search assistant. ${searchTypeInstructions[filters.searchType]}: "${searchQuery}"

Search scope: ${booksToSearch.length === 66 ? 'Entire Bible' : booksToSearch.join(', ')}

Return your response as a JSON array of verse results. Each result should have:
- book: The book name (e.g., "John", "Genesis")
- chapter: Chapter number
- verse: Verse number  
- text: The verse text from KJV
- relevance: Brief explanation of why this verse matches (1-2 sentences)

Find the top 15 most relevant verses. Return ONLY the JSON array, no other text.

Example format:
[
  {
    "book": "John",
    "chapter": 3,
    "verse": 16,
    "text": "For God so loved the world...",
    "relevance": "Speaks directly about God's love"
  }
]`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  book: { type: "string" },
                  chapter: { type: "number" },
                  verse: { type: "number" },
                  text: { type: "string" },
                  relevance: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSearchResults(response.results || []);
      
      if (response.results?.length === 0) {
        toast.info('No results found. Try different keywords or filters.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const toggleBookFilter = (bookName) => {
    setFilters(prev => ({
      ...prev,
      books: prev.books.includes(bookName)
        ? prev.books.filter(b => b !== bookName)
        : [...prev.books, bookName]
    }));
  };

  const clearFilters = () => {
    setFilters({
      testament: 'all',
      books: [],
      searchType: 'keywords'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0A1A2F] flex items-center gap-2">
            <Search className="w-6 h-6 text-[#D9B878]" />
            Advanced Bible Search
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Input */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for keywords, phrases, or themes..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#D9B878] focus:outline-none text-[#0A1A2F]"
                autoFocus
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={searching || !searchQuery.trim()}
              className="w-full bg-[#D9B878] hover:bg-[#D9B878]/90 text-[#0A1A2F]"
            >
              {searching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching Bible...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="font-semibold text-gray-700">Filters</span>
              </div>
              {(filters.testament !== 'all' || filters.books.length > 0 || filters.searchType !== 'keywords') && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#D9B878] hover:text-[#D9B878]/80 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search Type */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Search Type</label>
              <div className="flex gap-2">
                {['keywords', 'phrase', 'thematic'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilters(prev => ({ ...prev, searchType: type }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.searchType === type
                        ? 'bg-[#D9B878] text-[#0A1A2F]'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'keywords' && '🔤 Keywords'}
                    {type === 'phrase' && '💬 Exact Phrase'}
                    {type === 'thematic' && '🎯 Thematic'}
                  </button>
                ))}
              </div>
            </div>

            {/* Testament Filter */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Testament</label>
              <div className="flex gap-2">
                {['all', 'old', 'new'].map((testament) => (
                  <button
                    key={testament}
                    onClick={() => setFilters(prev => ({ ...prev, testament, books: [] }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.testament === testament
                        ? 'bg-[#D9B878] text-[#0A1A2F]'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {testament === 'all' && 'All'}
                    {testament === 'old' && 'Old Testament'}
                    {testament === 'new' && 'New Testament'}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Books (Optional) */}
            {filters.testament !== 'all' && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">
                  Specific Books (Optional)
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {(filters.testament === 'old' ? oldTestamentBooks : newTestamentBooks).map((book) => (
                    <button
                      key={book}
                      onClick={() => toggleBookFilter(book)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filters.books.includes(book)
                          ? 'bg-[#D9B878] text-[#0A1A2F]'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {book}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searching && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#D9B878]" />
              <p className="text-gray-500 mt-4">Searching the Bible for "{searchQuery}"...</p>
            </div>
          )}

          {!searching && searchResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">
                  {searchResults.length} Results Found
                </h3>
                <span className="text-xs text-gray-500">
                  Searching for: "{searchQuery}"
                </span>
              </div>

              <AnimatePresence>
                {searchResults.map((result, index) => (
                  <motion.div
                    key={`${result.book}-${result.chapter}-${result.verse}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-[#D9B878] transition-colors cursor-pointer"
                    onClick={() => {
                      onNavigateToVerse({
                        type: 'verse',
                        book: getAllBooks().find(b => b.name === result.book),
                        chapter: result.chapter,
                        verse: result.verse
                      });
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-700">V</span>
                        </div>
                        <span className="font-bold text-[#0A1A2F]">
                          {result.book} {result.chapter}:{result.verse}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 italic mb-2 leading-relaxed">
                      "{result.text}"
                    </p>
                    
                    <div className="bg-amber-50 rounded-lg p-2">
                      <p className="text-xs text-amber-800">
                        <span className="font-semibold">Why this matches:</span> {result.relevance}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!searching && searchResults.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-2">Try different keywords or adjust your filters</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}