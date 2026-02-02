import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bibleBooks } from './BibleData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BookSelector({ onSelectBook, selectedBook }) {
  const [activeTab, setActiveTab] = useState('old');

  const BookButton = ({ book }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectBook(book)}
      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
        selectedBook?.name === book.name
          ? 'bg-[#1a1a2e] text-white'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      <span className="font-medium">{book.name}</span>
      <span className={`ml-2 text-sm ${
        selectedBook?.name === book.name ? 'text-white/60' : 'text-gray-400'
      }`}>
        {book.chapters} chapters
      </span>
    </motion.button>
  );

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mb-4">
          <TabsTrigger value="old" className="text-sm">Old Testament</TabsTrigger>
          <TabsTrigger value="new" className="text-sm">New Testament</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1 px-4">
          <TabsContent value="old" className="mt-0 space-y-1">
            {bibleBooks.oldTestament.map(book => (
              <BookButton key={book.name} book={book} />
            ))}
          </TabsContent>
          
          <TabsContent value="new" className="mt-0 space-y-1">
            {bibleBooks.newTestament.map(book => (
              <BookButton key={book.name} book={book} />
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}