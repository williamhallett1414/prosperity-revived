import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JournalEntryModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }
    
    setLoading(true);
    try {
      await base44.entities.JournalEntry.create({
        title: title || 'Untitled',
        content,
        entry_type: 'general'
      });
      
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      setTitle('');
      setContent('');
      onClose();
      toast.success('Entry created!');
    } catch {
      toast.error('Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Write your entry..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="bg-[#FAD98D] hover:bg-[#FAD98D]/90 text-[#0A1A2F] dark:text-white dark:text-white"
                >
                  {loading ? 'Creating...' : 'Create Entry'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}