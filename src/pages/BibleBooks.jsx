import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { bibleBooks } from '@/components/bible/BibleData';
import { ScrollArea } from '@/components/ui/scroll-area';


function ChatFAB({ bot, gradFrom, gradTo }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/ChatScreen?bot=' + bot)}
      style={{
        position: 'fixed', bottom: '6rem', right: '1rem', zIndex: 40,
        background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
        color: 'white', borderRadius: '9999px', padding: '1rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '56px', height: '56px',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      title="Chat with Gideon"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  );
}

export default function BibleBooks() {
  const navigate = useNavigate();
  const [testament, setTestament] = useState('old');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testamentParam = params.get('testament');
    if (testamentParam === 'new' || testamentParam === 'old') {
      setTestament(testamentParam);
    }
  }, []);

  const books = testament === 'old' ? bibleBooks.oldTestament : bibleBooks.newTestament;
  const title = testament === 'old' ? 'Old Testament' : 'New Testament';

  const handleSelectBook = (book) => {
    navigate(createPageUrl(`Bible?book=${book.name}&chapter=1`));
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24">
      <div className="sticky top-0 z-40 bg-[#FFFDF7] border-b border-[#D9B878]/25 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-9 h-9 rounded-full bg-[#FAD98D]/20 hover:bg-[#FAD98D]/35 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#0A1A2F]">{title}</h1>
            <p className="text-xs text-[#0A1A2F]/60">{books.length} books</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-2">
            {testament === 'old' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 bg-gradient-to-br from-[#FAD98D]/30 to-[#D9B878]/15 border border-[#D9B878]/25 rounded-2xl p-4 flex items-center gap-3"
              >
                <span className="text-2xl">📜</span>
                <div>
                  <p className="text-sm font-semibold text-[#0A1A2F]">Not sure where to start?</p>
                  <p className="text-xs text-[#0A1A2F]/60">
                    Try <span
                      className="text-[#c9a227] font-semibold cursor-pointer underline"
                      onClick={() => window.location.href = createPageUrl('Bible?book=Psalms&chapter=1')}
                    >Psalms</span> for worship and reflection, or{' '}
                    <span
                      className="text-[#c9a227] font-semibold cursor-pointer underline"
                      onClick={() => window.location.href = createPageUrl('Bible?book=Proverbs&chapter=1')}
                    >Proverbs</span> for daily wisdom.
                  </p>
                </div>
              </motion.div>
            )}
            {books.map((book, index) => (
              <motion.button
                key={book.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectBook(book)}
                className="w-full text-left px-5 py-4 rounded-xl transition-all bg-[#FFFDF7] border border-[#D9B878]/20 hover:shadow-md hover:border-[#c9a227]/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#0A1A2F]">{book.name}</span>
                    <p className="text-sm text-[#0A1A2F]/50 mt-0.5">
                      {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
                    </p>
                  </div>
                  <div className="text-sm text-[#0A1A2F]/40">
                    {book.abbr}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Gideon Ask Anything */}
      <ChatFAB bot="Gideon" gradFrom="#7c5a00" gradTo="#D9B878" />
</div>
  );
}