import React from 'react';
import { Search, X } from 'lucide-react';

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

function ChipRow({ options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5">
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 transition-colors ${
            value === opt.value
              ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
              : 'bg-white text-[#0A1A2F]/50 border-[#FAD98D]/30 hover:border-[#c9a227]/40'
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function RecipeFilters({ filters, onFilterChange }) {
  const hasActive = filters.search || filters.dietType !== 'all' || filters.category !== 'all' || filters.prepTime !== 'all';
  const clear = () => onFilterChange({ search: '', dietType: 'all', category: 'all', prepTime: 'all' });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A1A2F]/30" />
        <input
          placeholder="Search recipes or ingredients…"
          value={filters.search}
          onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-[#FAD98D]/25 text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/35 focus:outline-none focus:border-[#c9a227]/50"
        />
        {filters.search && (
          <button onClick={() => onFilterChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0A1A2F]/30 hover:text-[#0A1A2F]/60">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <ChipRow options={CATEGORIES} value={filters.category} onChange={v => onFilterChange({ ...filters, category: v })} />
      <ChipRow options={DIET_TYPES}  value={filters.dietType}  onChange={v => onFilterChange({ ...filters, dietType: v })} />
      <ChipRow options={PREP_TIMES}  value={filters.prepTime}  onChange={v => onFilterChange({ ...filters, prepTime: v })} />

      {hasActive && (
        <button onClick={clear}
          className="text-xs font-semibold text-[#c9a227] hover:opacity-70 transition-opacity">
          Clear all filters ×
        </button>
      )}
    </div>
  );
}
