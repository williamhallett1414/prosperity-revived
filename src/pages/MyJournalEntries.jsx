import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Save, X, Trash2, ChevronDown, ChevronUp, Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CATEGORIES = [
  { value: 'all', label: 'All Entries', emoji: '📝' },
  { value: 'mindset_reset', label: 'Mindset Reset', emoji: '🧠' },
  { value: 'emotional_checkin', label: 'Emotional Check-In', emoji: '❤️' },
  { value: 'affirmation', label: 'Affirmations', emoji: '✨' },
  { value: 'weekly_reflection', label: 'Weekly Reflections', emoji: '📅' },
  { value: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { value: 'habit_tracker', label: 'Habit Tracker', emoji: '✅' },
  { value: 'general', label: 'General', emoji: '📖' }
];

export default function MyJournalEntries() {
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [expandedDate, setExpandedDate] = useState(null);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: entries = [] } = useQuery({
    queryKey: ['journalEntries', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      try {
        return await base44.entities.JournalEntry.filter(
          { created_by: user.email },
          '-created_date',
          100
        );
      } catch {
        return [];
      }
    },
    enabled: !!user
  });

  const updateEntry = useMutation({
    mutationFn: ({ id, data }) => base44.entities.JournalEntry.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['journalEntries']);
      setEditingId(null);
      toast.success('Entry updated!');
    }
  });

  const deleteEntry = useMutation({
    mutationFn: (id) => base44.entities.JournalEntry.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['journalEntries']);
      toast.success('Entry deleted');
    }
  });

  const createEntry = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['journalEntries']);
      setShowNewEntryModal(false);
      setNewTitle('');
      setNewContent('');
      toast.success('Entry created!');
    }
  });

  const handleCreateEntry = () => {
    if (!newContent.trim()) {
      toast.error('Please write something in your entry');
      return;
    }
    createEntry.mutate({
      title: newTitle || 'Untitled Entry',
      content: newContent,
      entry_type: 'general'
    });
  };

  // Filter entries by category
  const filteredEntries = useMemo(() => {
    if (selectedCategory === 'all') return entries;
    return entries.filter(entry => entry.entry_type === selectedCategory);
  }, [entries, selectedCategory]);

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups = {};
    filteredEntries.forEach(entry => {
      const date = new Date(entry.created_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });
    return groups;
  }, [filteredEntries]);

  const getCategoryInfo = (entryType) => {
    const category = CATEGORIES.find(c => c.value === entryType);
    return category || CATEGORIES.find(c => c.value === 'general');
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditTitle(entry.title || '');
    setEditContent(entry.content || '');
  };

  const handleSave = (id) => {
    updateEntry.mutate({
      id,
      data: {
        title: editTitle,
        content: editContent
      }
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={createPageUrl('Wellness')}
              className="w-10 h-10 rounded-full bg-[#D9B878] hover:bg-[#D9B878]/90 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#0A1A2F]" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#0A1A2F]">My Journal Entries</h1>
              <p className="text-xs text-[#0A1A2F]/60">{entries.length} entries saved</p>
            </div>
          </div>
          <Button
            onClick={() => setShowNewEntryModal(true)}
            className="bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[#D9B878]" />
            <h3 className="text-sm font-semibold text-[#0A1A2F]">Filter by Category</h3>
          </div>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {CATEGORIES.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.value
                    ? 'bg-[#D9B878] text-[#0A1A2F]'
                    : 'bg-white text-[#0A1A2F]/70 border border-gray-200 hover:border-[#D9B878]'
                }`}
              >
                <span className="mr-1">{category.emoji}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-2xl"
          >
            <div className="text-5xl mb-3">📝</div>
            <p className="text-[#0A1A2F]/60">No journal entries yet</p>
            <p className="text-xs text-[#0A1A2F]/50 mt-2">Start journaling in End My Day or here</p>
          </motion.div>
        ) : filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-2xl"
          >
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-[#0A1A2F]/60">No entries found for this category</p>
            <p className="text-xs text-[#0A1A2F]/50 mt-2">Try selecting a different filter</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedEntries).map(([date, dateEntries], dateIdx) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dateIdx * 0.05 }}
              >
                {/* Date Header */}
                <button
                  onClick={() =>
                    setExpandedDate(expandedDate === date ? null : date)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#E6EBEF] rounded-xl hover:bg-[#E6EBEF]/80 transition-colors"
                >
                  <span className="font-semibold text-[#0A1A2F] text-sm">
                    {date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#D9B878] text-[#0A1A2F] rounded-full px-2 py-1">
                      {dateEntries.length}
                    </span>
                    {expandedDate === date ? (
                      <ChevronUp className="w-4 h-4 text-[#0A1A2F]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#0A1A2F]" />
                    )}
                  </div>
                </button>

                {/* Entries for this date */}
                {expandedDate === date && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 mt-3"
                  >
                    {dateEntries.map((entry, idx) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                      >
                        {editingId === entry.id ? (
                          // Edit Mode
                          <div className="space-y-3">
                            <Input
                              placeholder="Entry title"
                              value={editTitle}
                              onChange={(e) =>
                                setEditTitle(e.target.value)
                              }
                              className="bg-[#E6EBEF] border-[#E6EBEF] text-[#0A1A2F]"
                            />
                            <Textarea
                              placeholder="Entry content"
                              value={editContent}
                              onChange={(e) =>
                                setEditContent(e.target.value)
                              }
                              className="min-h-[150px] bg-[#E6EBEF] border-[#E6EBEF] text-[#0A1A2F]"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleSave(entry.id)}
                                className="flex-1 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
                                size="sm"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button
                                onClick={handleCancel}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">{getCategoryInfo(entry.entry_type).emoji}</span>
                                  <span className="text-xs bg-[#D9B878]/20 text-[#D9B878] px-2 py-1 rounded font-medium">
                                    {getCategoryInfo(entry.entry_type).label}
                                  </span>
                                </div>
                                {entry.title && (
                                  <h3 className="font-semibold text-[#0A1A2F] line-clamp-2">
                                    {entry.title}
                                  </h3>
                                )}
                                {entry.prompt && (
                                  <p className="text-xs text-[#0A1A2F]/60 italic mt-1">
                                    "{entry.prompt}"
                                  </p>
                                )}
                                <p className="text-xs text-[#0A1A2F]/50 mt-1">
                                  {new Date(
                                    entry.created_date
                                  ).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEdit(entry)}
                                  className="p-2 hover:bg-[#E6EBEF] rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4 text-[#D9B878]" />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteEntry.mutate(entry.id)
                                  }
                                  className="p-2 hover:bg-[#E6EBEF] rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-[#0A1A2F]/70 whitespace-pre-wrap">
                              {entry.content}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {entry.mood && (
                                <span className="text-xs bg-[#AFC7E3]/20 text-[#AFC7E3] px-2 py-1 rounded font-medium">
                                  Mood: {entry.mood}
                                </span>
                              )}
                              {entry.suggested_practice && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                                  {entry.suggested_practice}
                                </span>
                              )}
                              {entry.habits && entry.habits.length > 0 && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                                  {entry.habits.length} habits tracked
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New Entry Modal */}
      <Dialog open={showNewEntryModal} onOpenChange={setShowNewEntryModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Entry title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-[#E6EBEF] border-[#E6EBEF] text-[#0A1A2F]"
            />
            <Textarea
              placeholder="What's on your mind?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="min-h-[200px] bg-[#E6EBEF] border-[#E6EBEF] text-[#0A1A2F]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateEntry}
                className="flex-1 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
              <Button
                onClick={() => {
                  setShowNewEntryModal(false);
                  setNewTitle('');
                  setNewContent('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}