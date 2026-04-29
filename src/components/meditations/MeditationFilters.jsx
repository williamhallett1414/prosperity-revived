import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

const categories = [
  'breathing', 'stress_relief', 'sleep', 'mindfulness', 'compassion', 'gratitude', 'healing', 'focus', 'confidence', 'reflection'
];

export default function MeditationFilters({ onFilterChange, onSearch }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = (category) => {
    const newCategory = activeCategory === category ? null : category;
    setActiveCategory(newCategory);
    onFilterChange(newCategory);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-4 mb-6 px-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1A2F]/40 dark:text-white/40" />
        <input
          type="text"
          placeholder="Search meditations..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border-0 rounded-lg text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/40 focus:ring-2 focus:ring-[#FAD98D]"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02 }}
            onClick={() => handleCategoryClick(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-[#FAD98D] to-[#AFC7E3] text-[#0A1A2F] dark:text-white shadow-md dark:shadow-none'
                : 'bg-gray-100 dark:bg-white/5 text-[#0A1A2F]/70 dark:text-white/70 hover:bg-gray-100/80'
            }`}
          >
            {cat.replace(/_/g, ' ')}
          </motion.button>
        ))}
      </div>

      {activeCategory && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setActiveCategory(null);
            onFilterChange(null);
          }}
          className="text-xs text-[#FAD98D] hover:text-[#FAD98D]/70 flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Clear filter
        </motion.button>
      )}
    </div>
  );
}