import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChapterSelector({ book, onSelectChapter, onBack, selectedChapter }) {
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold text-[#1a1a2e]">{book.name}</h2>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="grid grid-cols-5 gap-2 pb-4">
          {chapters.map(chapter => (
            <motion.button
              key={chapter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectChapter(chapter)}
              className={`aspect-square rounded-xl font-medium transition-all flex items-center justify-center ${
                selectedChapter === chapter
                  ? 'bg-[#1a1a2e] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {chapter}
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}