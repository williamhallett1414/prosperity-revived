import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const DIET_TYPES = [
  { value: 'all',         label: 'Any Diet'    },
  { value: 'keto',        label: 'Keto'        },
  { value: 'vegan',       label: 'Vegan'       },
  { value: 'vegetarian',  label: 'Vegetarian'  },
  { value: 'paleo',       label: 'Paleo'       },
  { value: 'gluten_free', label: 'Gluten Free' },
];

const CATEGORIES = [
  { value: 'all',       label: 'All Meals'  },
  { value: 'breakfast', label: '🍳 Breakfast'},
  { value: 'lunch',     label: '🥗 Lunch'   },
  { value: 'dinner',    label: '🍽️ Dinner'  },
  { value: 'snack',     label: '🍎 Snack'   },
  { value: 'dessert',   label: '🍰 Dessert' },
];

const PREP_TIMES = [
  { value: 'all',    label: 'Any Time'       },
  { value: 'quick',  label: '⚡ Under 15 min' },
  { value: 'medium', label: '⏱ 15–30 min'    },
  { value: 'long',   label: '🕐 30+ min'      },
];

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#0A1A2F]/70 dark:text-white/70 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              value === opt.value
                ? 'bg-[#FD9C2D] text-white shadow-sm'
                : 'bg-white dark:bg-white/5 text-[#0A1A2F]/60 dark:text-white/60 border border-[#FAD98D]/20 dark:border-white/10 hover:bg-[#FAD98D]/10 dark:hover:bg-white/10'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RecipeFilters({ filters, onFilterChange }) {
  const [expandedGroups, setExpandedGroups] = useState({ category: true, diet: true, prep: false });
  const hasActive = filters.search || filters.dietType !== 'all' || filters.category !== 'all' || filters.prepTime !== 'all';
  const clear = () => onFilterChange({ search: '', dietType: 'all', category: 'all', prepTime: 'all' });

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30" />
        <input
          placeholder="Search recipes or ingredients…"
          value={filters.search}
          onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-white dark:bg-white/5 border border-[#FAD98D]/25 dark:border-white/10 text-sm text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/35 focus:outline-none focus:border-[#c9a227]/50"
        />
        {filters.search && (
          <button onClick={() => onFilterChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0A1A2F]/30 dark:text-white/30 hover:text-[#0A1A2F]/60">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Expandable Filter Sections */}
      <div className="space-y-3">
        {/* Categories */}
        <div className="bg-white dark:bg-white/5 rounded-lg p-3 border border-[#FAD98D]/10 dark:border-white/10">
          <button
            onClick={() => toggleGroup('category')}
            className="w-full flex items-center justify-between hover:opacity-70 transition-opacity"
          >
            <span className="text-sm font-semibold text-[#0A1A2F] dark:text-white">Meal Type</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedGroups.category ? 'rotate-180' : ''}`} />
          </button>
          {expandedGroups.category && <div className="mt-3"><FilterGroup options={CATEGORIES} value={filters.category} onChange={v => onFilterChange({ ...filters, category: v })} /></div>}
        </div>

        {/* Diet Types */}
        <div className="bg-white dark:bg-white/5 rounded-lg p-3 border border-[#FAD98D]/10 dark:border-white/10">
          <button
            onClick={() => toggleGroup('diet')}
            className="w-full flex items-center justify-between hover:opacity-70 transition-opacity"
          >
            <span className="text-sm font-semibold text-[#0A1A2F] dark:text-white">Diet Type</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedGroups.diet ? 'rotate-180' : ''}`} />
          </button>
          {expandedGroups.diet && <div className="mt-3"><FilterGroup options={DIET_TYPES} value={filters.dietType} onChange={v => onFilterChange({ ...filters, dietType: v })} /></div>}
        </div>

        {/* Prep Time */}
        <div className="bg-white dark:bg-white/5 rounded-lg p-3 border border-[#FAD98D]/10 dark:border-white/10">
          <button
            onClick={() => toggleGroup('prep')}
            className="w-full flex items-center justify-between hover:opacity-70 transition-opacity"
          >
            <span className="text-sm font-semibold text-[#0A1A2F] dark:text-white">Prep Time</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedGroups.prep ? 'rotate-180' : ''}`} />
          </button>
          {expandedGroups.prep && <div className="mt-3"><FilterGroup options={PREP_TIMES} value={filters.prepTime} onChange={v => onFilterChange({ ...filters, prepTime: v })} /></div>}
        </div>
      </div>

      {hasActive && (
        <button onClick={clear}
          className="w-full py-2 text-xs font-semibold text-[#c9a227] hover:opacity-70 transition-opacity bg-[#c9a227]/5 dark:bg-[#c9a227]/10 rounded-lg">
          Clear all filters
        </button>
      )}
    </div>
  );
}