import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Zap, Wind, Flame, Target } from 'lucide-react';

const categories = [
  { id: 'strength', label: 'Strength', icon: Dumbbell, color: 'from-[#D9B878] to-[#FD9C2D]' },
  { id: 'cardio', label: 'Cardio', icon: Zap, color: 'from-[#FD9C2D] to-[#D9B878]' },
  { id: 'mobility', label: 'Mobility', icon: Wind, color: 'from-[#AFC7E3] to-[#D9B878]' },
  { id: 'beginner', label: 'Beginner', icon: Flame, color: 'from-[#D9B878] to-[#AFC7E3]' },
  { id: 'advanced', label: 'Advanced', icon: Target, color: 'from-[#0A1A2F] to-[#AFC7E3]' }
];

export default function WorkoutCategoryFilter({ onFilterChange }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleClick = (categoryId) => {
    const newCategory = activeCategory === categoryId ? null : categoryId;
    setActiveCategory(newCategory);
    onFilterChange(newCategory);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-3 px-4 snap-x snap-mandatory">
      {categories.map((cat, idx) => {
        const Icon = cat.icon;
        return (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleClick(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-fit snap-start transition-all ${
              activeCategory === cat.id
                ? `bg-gradient-to-r ${cat.color} text-[#0A1A2F] font-semibold shadow-md`
                : 'bg-[#E6EBEF] text-[#0A1A2F]/70 hover:bg-[#E6EBEF]/80'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{cat.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}