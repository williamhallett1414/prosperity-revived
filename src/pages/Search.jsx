import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Loader2, BookOpen, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Search the Bible for verses containing keywords: "${query}". Return up to 15 relevant verses with their book name, chapter number, verse number, and the actual verse text. Make sure the verses are from the NIV translation style and are accurate.`,
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
                  text: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setResults(response.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }

    setLoading(false);
  };

  const handleResultClick = (result) => {
    window.location.href = createPageUrl(`Bible?book=${result.book}&chapter=${result.chapter}`);
  };

  const highlightKeywords = (text) => {
    if (!query.trim()) return text;
    
    const keywords = query.toLowerCase().split(' ').filter(k => k.length > 2);
    let highlightedText = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-0.5">$1</mark>');
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link
              to={createPageUrl('Home')}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a1a2e] hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Search Bible</h1>
          </div>
          <p className="text-gray-500 ml-[52px]">Find verses by keywords</p>
        </motion.div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Enter keywords (e.g., love, faith, hope)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-24 bg-white border-gray-200 rounded-xl h-14 text-base"
            />
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1a1a2e] hover:bg-[#2d2d4a] h-10"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-8 h-8 animate-spin text-[#c9a227] mb-4" />
              <p className="text-gray-500">Searching the Bible...</p>
            </motion.div>
          ) : searched && results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <SearchIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">No results found</h3>
              <p className="text-gray-500">Try different keywords</p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-gray-500 mb-4">
                Found {results.length} verse{results.length !== 1 ? 's' : ''}
              </p>
              
              <div className="space-y-3">
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleResultClick(result)}
                    className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-md transition-all border border-gray-100 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1a1a2e]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a227]/10 transition-colors">
                        <BookOpen className="w-5 h-5 text-[#1a1a2e] group-hover:text-[#c9a227] transition-colors" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-[#1a1a2e] group-hover:text-[#c9a227] transition-colors">
                            {result.book} {result.chapter}:{result.verse}
                          </span>
                        </div>
                        
                        <p className="font-serif text-gray-700 leading-relaxed">
                          {highlightKeywords(result.text)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#c9a227]/10 flex items-center justify-center">
                <SearchIcon className="w-10 h-10 text-[#c9a227]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">Search the Bible</h3>
              <p className="text-gray-500 mb-6">
                Enter keywords to find relevant verses
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['love', 'faith', 'hope', 'peace', 'joy'].map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => {
                      setQuery(keyword);
                      setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                    }}
                    className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}