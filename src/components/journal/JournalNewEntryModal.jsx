import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JournalNewEntryModal({
  isOpen,
  onClose,
  newTitle,
  setNewTitle,
  newContent,
  setNewContent,
  onCreateEntry,
  isLoading,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-white/5 rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0A1A2F] dark:text-white dark:text-white">New Journal Entry</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Entry title (optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="Write your entry..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={onCreateEntry}
                  disabled={isLoading}
                  className="bg-[#FAD98D] hover:bg-[#FAD98D]/90 text-[#0A1A2F] dark:text-white dark:text-white"
                >
                  {isLoading ? 'Creating...' : 'Create Entry'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}