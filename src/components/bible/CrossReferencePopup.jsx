import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link2, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Common cross-references database (simplified)
const CROSS_REFERENCES = {
  'John 3:16': ['Romans 5:8', 'John 1:12', '1 John 4:9-10'],
  'Genesis 1:1': ['John 1:1-3', 'Hebrews 11:3', 'Psalm 33:6'],
  'Matthew 28:19': ['Mark 16:15', 'Acts 1:8', 'Matthew 24:14'],
  'Romans 8:28': ['Jeremiah 29:11', 'Genesis 50:20', 'Philippians 1:6'],
  'Philippians 4:13': ['2 Corinthians 12:9-10', 'Psalm 18:32', 'Isaiah 40:29'],
  'Psalm 23:1': ['John 10:11', 'Ezekiel 34:11-12', 'Psalm 80:1']
};

export default function CrossReferencePopup({ verse, bookName, chapter, onClose, onNavigate }) {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verseRef = `${bookName} ${chapter}:${verse.verse}`;
    const refs = CROSS_REFERENCES[verseRef] || [];
    setReferences(refs);
  }, [bookName, chapter, verse]);

  const handleReferenceClick = (ref) => {
    const match = ref.match(/^([\w\s]+)\s+(\d+):(\d+)/);
    if (match) {
      const [, book, chap, vers] = match;
      onNavigate(book.trim(), parseInt(chap), parseInt(vers));
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#8fa68a]" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Cross References</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {bookName} {chapter}:{verse.verse}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">{verse.text}</p>
        </div>

        {references.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Related Verses
            </p>
            {references.map((ref, idx) => (
              <button
                key={idx}
                onClick={() => handleReferenceClick(ref)}
                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-[#8fa68a]/10 dark:hover:bg-[#8fa68a]/20 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors flex items-center justify-between group"
              >
                <span>{ref}</span>
                <Link2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No cross-references available for this verse
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}