import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AffirmationsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const affirmations = [
    {
      text: "God's peace guards my heart and mind.",
      reference: "Philippians 4:7"
    },
    {
      text: "I walk in purpose and clarity today.",
      reference: "Proverbs 3:5-6"
    },
    {
      text: "Christ strengthens me in all things.",
      reference: "Philippians 4:13"
    },
    {
      text: "I am fearfully and wonderfully made.",
      reference: "Psalm 139:14"
    },
    {
      text: "His mercies are new every morning.",
      reference: "Lamentations 3:22-23"
    },
    {
      text: "I can do all things through Christ.",
      reference: "Philippians 4:13"
    },
    {
      text: "The Lord is my shepherd; I shall not want.",
      reference: "Psalm 23:1"
    },
    {
      text: "I am more than a conqueror through Him.",
      reference: "Romans 8:37"
    },
    {
      text: "God works all things for my good.",
      reference: "Romans 8:28"
    },
    {
      text: "I am chosen, loved, and deeply valued.",
      reference: "1 Peter 2:9"
    }
  ];

  const current = affirmations[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % affirmations.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
  };

  const toggleFavorite = () => {
    if (favorites.includes(currentIndex)) {
      setFavorites(favorites.filter(i => i !== currentIndex));
    } else {
      setFavorites([...favorites, currentIndex]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-xl font-bold text-white mb-4">Daily Affirmations</h2>
      <div className="bg-gradient-to-br from-[#c9a227]/20 to-[#d4af37]/20 backdrop-blur-sm rounded-2xl p-6 border border-[#c9a227]/30 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center min-h-[120px] flex flex-col justify-center"
          >
            <p className="text-white text-lg font-serif italic mb-3">
              "{current.text}"
            </p>
            <p className="text-[#c9a227] text-sm font-semibold">
              {current.reference}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <button
            onClick={toggleFavorite}
            className="transition"
          >
            <Heart
              className={`w-6 h-6 ${
                favorites.includes(currentIndex)
                  ? 'fill-[#c9a227] text-[#c9a227]'
                  : 'text-gray-400'
              }`}
            />
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="text-white hover:bg-white/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex justify-center gap-1 mt-3">
          {affirmations.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === currentIndex ? 'bg-[#c9a227] w-6' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}