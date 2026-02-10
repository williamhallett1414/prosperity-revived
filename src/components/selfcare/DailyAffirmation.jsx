import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DailyAffirmation() {
  const [favorites, setFavorites] = useState([]);

  const affirmations = [
    { text: "God's peace guards my heart and mind.", reference: "Philippians 4:7" },
    { text: "I walk in purpose and clarity today.", reference: "Proverbs 3:5-6" },
    { text: "Christ strengthens me in all things.", reference: "Philippians 4:13" },
    { text: "I am fearfully and wonderfully made.", reference: "Psalm 139:14" },
    { text: "His mercies are new every morning.", reference: "Lamentations 3:22-23" },
    { text: "I can do all things through Christ.", reference: "Philippians 4:13" },
    { text: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
    { text: "I am more than a conqueror through Him.", reference: "Romans 8:37" },
    { text: "God works all things for my good.", reference: "Romans 8:28" },
    { text: "I am chosen, loved, and deeply valued.", reference: "1 Peter 2:9" }
  ];

  // Get today's affirmation based on day of year
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todaysAffirmation = affirmations[dayOfYear % affirmations.length];
  const affirmationIndex = dayOfYear % affirmations.length;

  const toggleFavorite = () => {
    if (favorites.includes(affirmationIndex)) {
      setFavorites(favorites.filter(i => i !== affirmationIndex));
    } else {
      setFavorites([...favorites, affirmationIndex]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#c9a227]" />
          Daily Affirmation
        </h2>
      </div>

      <div className="bg-gradient-to-br from-[#c9a227]/20 to-[#d4af37]/20 backdrop-blur-sm rounded-2xl p-6 border border-[#c9a227]/30 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-white text-lg font-serif italic mb-3">
            "{todaysAffirmation.text}"
          </p>
          <p className="text-[#c9a227] text-sm font-semibold mb-4">
            {todaysAffirmation.reference}
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className="text-white hover:bg-white/10"
          >
            <Heart
              className={`w-5 h-5 ${
                favorites.includes(affirmationIndex)
                  ? 'fill-[#c9a227] text-[#c9a227]'
                  : 'text-gray-400'
              }`}
            />
          </Button>
        </motion.div>

        <p className="text-center text-xs text-gray-400 mt-4">
          New affirmation daily
        </p>
      </div>
    </motion.div>
  );
}