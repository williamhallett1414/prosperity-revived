import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Bookmark, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getVerseOfDay } from '../bible/BibleData';
import { toast } from 'sonner';

export default function VerseOfDay({ onBookmark }) {
  const verse = getVerseOfDay();
  
  const handleShare = async () => {
    const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Verse copied to clipboard!');
    } catch (error) {
      toast.error('Could not copy verse');
    }
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(verse);
      toast.success('Verse saved!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a] p-6 md:p-8"
    >
      <div className="absolute top-4 right-4 opacity-10">
        <Sparkles className="w-24 h-24 text-[#c9a227]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[#c9a227] rounded-full" />
          <span className="text-[#c9a227] text-sm font-medium tracking-wider uppercase">
            Verse of the Day
          </span>
        </div>
        
        <p className="text-white/90 text-xl md:text-2xl font-serif leading-relaxed mb-4">
          "{verse.text}"
        </p>
        
        <p className="text-white/60 font-medium mb-6">
          {verse.book} {verse.chapter}:{verse.verse}
        </p>
        
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </motion.div>
  );
}