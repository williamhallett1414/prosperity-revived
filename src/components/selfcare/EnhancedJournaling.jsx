import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BookOpen, Flame, Plus } from 'lucide-react';
import { toast } from 'sonner';

const journalingPrompts = [
  "What are you grateful for today?",
  "What challenged you today and what did you learn?",
  "How did you show compassion today?",
  "What is one thing you did well today?",
  "What are you hoping for tomorrow?",
  "What brought you joy today?",
  "How have you grown recently?",
  "What are you worried about and why?"
];

export default function EnhancedJournaling() {
  const [showEntry, setShowEntry] = useState(false);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const queryClient = useQueryClient();

  const prompt = journalingPrompts[new Date().getDate() % journalingPrompts.length];

  const { data: entries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      try {
        return await base44.entities.JournalEntry.filter({}, '-created_date', 20);
      } catch {
        return [];
      }
    },
    retry: false
  });

  const saveEntry = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create(data),
    onSuccess: () => {
      toast.success('Journal entry saved!');
      setContent('');
      setSelectedTags([]);
      setShowEntry(false);
      queryClient.invalidateQueries(['journalEntries']);
    }
  });

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    const sortedDates = entries
      .map(e => new Date(e.created_date))
      .sort((a, b) => b - a);

    for (const date of sortedDates) {
      const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const tags = ['gratitude', 'prayer', 'reflection', 'struggle', 'joy'];
  const streak = calculateStreak();

  return (
    <div className="space-y-4 px-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#D9B878]" />
          <h2 className="text-lg font-bold text-[#0A1A2F]">Journaling</h2>
        </div>
        <motion.div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#FD9C2D] to-[#D9B878] text-white rounded-full text-xs font-semibold">
          <Flame className="w-3 h-3" />
          {streak} days
        </motion.div>
      </div>

      {/* Today's Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-xl p-4 text-[#0A1A2F]"
      >
        <p className="text-sm font-semibold mb-1">Today's Prompt:</p>
        <p className="text-base font-serif italic">{prompt}</p>
      </motion.div>

      {/* New Entry Button */}
      <Button
        onClick={() => setShowEntry(!showEntry)}
        className="w-full bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F] font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Entry
      </Button>

      {/* Entry Form */}
      {showEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 space-y-3 border border-[#E6EBEF]"
        >
          <Textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] bg-[#F2F6FA] border-[#E6EBEF]"
          />

          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedTags(t => 
                  t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag]
                )}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-[#D9B878] text-white'
                    : 'bg-[#E6EBEF] text-[#0A1A2F]/70'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowEntry(false);
                setContent('');
                setSelectedTags([]);
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveEntry.mutate({
                title: prompt,
                content,
                tags: selectedTags,
                entry_type: 'general',
                mood: 'peaceful'
              })}
              disabled={!content.trim() || saveEntry.isPending}
              className="flex-1 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
            >
              Save Entry
            </Button>
          </div>
        </motion.div>
      )}

      {/* Past Entries */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h3 className="text-sm font-semibold text-[#0A1A2F]">Recent Entries</h3>
          {entries.slice(0, 3).map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#E6EBEF] rounded-lg p-3 text-sm"
            >
              <p className="font-semibold text-[#0A1A2F] truncate">{entry.title}</p>
              <p className="text-[#0A1A2F]/60 text-xs line-clamp-1 mt-1">{entry.content}</p>
              <p className="text-[#0A1A2F]/40 text-xs mt-1">
                {new Date(entry.created_date).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}