import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const affirmations = [
  {
    text: "I am fearfully and wonderfully made",
    verse: "Psalm 139:14",
    fullVerse: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well."
  },
  {
    text: "I can do all things through Christ who strengthens me",
    verse: "Philippians 4:13",
    fullVerse: "I can do all this through him who gives me strength."
  },
  {
    text: "God has plans to prosper me and give me hope",
    verse: "Jeremiah 29:11",
    fullVerse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."
  },
  {
    text: "I am more than a conqueror through Christ",
    verse: "Romans 8:37",
    fullVerse: "No, in all these things we are more than conquerors through him who loved us."
  },
  {
    text: "The Lord is my strength and my shield",
    verse: "Psalm 28:7",
    fullVerse: "The Lord is my strength and my shield; my heart trusts in him, and he helps me."
  },
  {
    text: "I am chosen, holy, and dearly loved",
    verse: "Colossians 3:12",
    fullVerse: "Therefore, as God's chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience."
  },
  {
    text: "Perfect love casts out all fear",
    verse: "1 John 4:18",
    fullVerse: "There is no fear in love. But perfect love drives out fear."
  }
];

export default function ScriptureAffirmations() {
  const [todaysAffirmation, setTodaysAffirmation] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setTodaysAffirmation(affirmations[dayOfYear % affirmations.length]);
  }, []);

  const handleSaveToFavorites = async () => {
    try {
      await base44.entities.Bookmark.create({
        book: 'Affirmation',
        chapter: 1,
        verse: 1,
        verse_text: `${todaysAffirmation.text} - ${todaysAffirmation.verse}`,
        note: todaysAffirmation.fullVerse,
        highlight_color: 'yellow'
      });
      setIsFavorited(true);
      toast.success('Saved to favorites!');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  if (!todaysAffirmation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#AFC7E3]/20 to-[#D9B878]/20 rounded-2xl p-6 border border-[#AFC7E3]/30 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#AFC7E3]" />
          <h3 className="text-lg font-bold text-[#0A1A2F]">Scripture-Based Affirmation</h3>
        </div>
        <RefreshCw className="w-4 h-4 text-[#0A1A2F]/40" />
      </div>

      <div className="bg-white rounded-xl p-6 mb-4">
        <p className="text-xl font-semibold text-[#0A1A2F] mb-4 text-center italic">
          "{todaysAffirmation.text}"
        </p>
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-[#D9B878]">{todaysAffirmation.verse}</p>
          <p className="text-xs text-[#0A1A2F]/60 mt-2 italic">{todaysAffirmation.fullVerse}</p>
        </div>
      </div>

      <Button
        onClick={handleSaveToFavorites}
        disabled={isFavorited}
        variant="outline"
        className="w-full border-[#D9B878] hover:bg-[#D9B878]/10"
      >
        <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-[#D9B878] text-[#D9B878]' : 'text-[#D9B878]'}`} />
        {isFavorited ? 'Saved to Favorites' : 'Save to Favorites'}
      </Button>
    </motion.div>
  );
}