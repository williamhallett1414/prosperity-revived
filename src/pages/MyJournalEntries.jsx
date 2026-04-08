import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Save, X, Trash2, ChevronDown, ChevronUp, Plus, Filter, Sparkles, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import JournalEntryModal from '@/components/home/JournalEntryModal';

const CATEGORIES = [
  { value: 'all', label: 'All Entries', emoji: '📝' },
  { value: 'video_journal', label: 'Video Journals', emoji: '🎥' },
  { value: 'bible_notes', label: 'Bible Notes', emoji: '📖' },
  { value: 'scripture_reflection', label: 'Scripture', emoji: '✝️' },
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
  const [expandedWeeklySummary, setExpandedWeeklySummary] = useState(true);
  const [expandedMonthlySummary, setExpandedMonthlySummary] = useState(true);
  const [generatingSummaryType, setGeneratingSummaryType] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: entries = [] } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      try {
        const result = await base44.entities.JournalEntry.list('-created_date', 100);
        console.log('Fetched journal entries:', result);
        console.log('Bible notes entries:', result.filter(e => e.entry_type === 'bible_notes'));
        return result;
      } catch (error) {
        console.error('Failed to fetch entries:', error);
        return [];
      }
    },
    enabled: !!user
  });

  const { data: summaries = [], refetch: refetchSummaries } = useQuery({
    queryKey: ['journalSummaries', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      try {
        return await base44.entities.JournalSummary.filter(
          { created_by: user.email },
          '-created_date',
          10
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
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      setEditingId(null);
      toast.success('Entry updated!');
    },
    onError: () => toast.error('Failed to update entry'),
  });

  const deleteEntry = useMutation({
    mutationFn: (id) => base44.entities.JournalEntry.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      toast.success('Entry deleted');
    },
    onError: () => toast.error('Failed to delete entry'),
  });

  const createEntry = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
      setShowNewEntryModal(false);
      setNewTitle('');
      setNewContent('');
      toast.success('Entry created!');
    },
    onError: () => toast.error('Failed to create entry'),
  });

  const generateSummary = useMutation({
    mutationFn: async (summaryType) => {
      setGeneratingSummaryType(summaryType);
      return await base44.functions.invoke('generateJournalSummary', { 
        summary_type: summaryType 
      });
    },
    onSuccess: () => {
      refetchSummaries();
      setGeneratingSummaryType(null);
      toast.success('Summary generated!');
    },
    onError: () => {
      setGeneratingSummaryType(null);
      toast.error('Failed to generate summary');
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
    console.log('Filtering - selectedCategory:', selectedCategory);
    console.log('All entries:', entries);
    if (selectedCategory === 'all') return entries;
    const filtered = entries.filter(entry => {
      console.log(`Entry ${entry.id} type:`, entry.entry_type, 'matches:', entry.entry_type === selectedCategory);
      return entry.entry_type === selectedCategory;
    });
    console.log('Filtered entries:', filtered);
    return filtered;
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

  const weeklySummary = summaries.find(s => s.summary_type === 'weekly');
  const monthlySummary = summaries.find(s => s.summary_type === 'monthly');

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
      <div className="sticky top-0 z-40 bg-white border-b border-[#F2F6FA] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={createPageUrl('PersonalGrowth')}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#0A1A2F]">My Journal Entries</h1>
              <p className="text-xs text-[#0A1A2F]/60">{entries.length} entries saved</p>
            </div>
          </div>
          <Button
            onClick={() => setShowNewEntryModal(true)}
            className="bg-gradient-to-r from-[#FAD98D] to-[#AFC7E3] hover:from-[#FAD98D]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* AI Summaries Section */}
        {entries.length > 0 && (
          <div className="mb-6 space-y-4">
            <h2 className="text-xl font-bold text-[#0A1A2F] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FAD98D]" />
              Your Journey Insights
            </h2>

            <div className="grid gap-4">
              {/* Weekly Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#FAD98D]/10 to-[#F2F6FA] rounded-2xl p-5 border border-[#FAD98D]/40"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0A1A2F] flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      Weekly Summary
                    </h3>
                    {weeklySummary && (
                      <p className="text-xs text-[#0A1A2F]/50 mt-1">
                        {new Date(weeklySummary.created_date).toLocaleDateString()} • {weeklySummary.entries_analyzed} entries
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {weeklySummary && (
                      <Button
                        onClick={() => setExpandedWeeklySummary(!expandedWeeklySummary)}
                        size="sm"
                        variant="ghost"
                        className="text-xs h-8 w-8 p-0"
                      >
                        {expandedWeeklySummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    )}
                    <Button
                      onClick={() => generateSummary.mutate('weekly')}
                      disabled={generateSummary.isPending}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      {generateSummary.isPending && generatingSummaryType === 'weekly' ? 'Generating...' : 'Regenerate'}
                    </Button>
                  </div>
                </div>
                {weeklySummary ? (
                  expandedWeeklySummary && (
                    <p className="text-sm text-[#0A1A2F]/80 leading-relaxed whitespace-pre-wrap">
                      {weeklySummary.summary_text}
                    </p>
                  )
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#0A1A2F]/60 mb-3">No weekly summary yet</p>
                    <Button
                      onClick={() => generateSummary.mutate('weekly')}
                      disabled={generateSummary.isPending}
                      size="sm"
                      className="bg-[#FAD98D] hover:bg-[#FAD98D]/90 text-[#0A1A2F]"
                    >
                      Generate Weekly Summary
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Monthly Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0A1A2F] flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      Monthly Summary
                    </h3>
                    {monthlySummary && (
                      <p className="text-xs text-[#0A1A2F]/50 mt-1">
                        {new Date(monthlySummary.created_date).toLocaleDateString()} • {monthlySummary.entries_analyzed} entries
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {monthlySummary && (
                      <Button
                        onClick={() => setExpandedMonthlySummary(!expandedMonthlySummary)}
                        size="sm"
                        variant="ghost"
                        className="text-xs h-8 w-8 p-0"
                      >
                        {expandedMonthlySummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    )}
                    <Button
                      onClick={() => generateSummary.mutate('monthly')}
                      disabled={generateSummary.isPending}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      {generateSummary.isPending && generatingSummaryType === 'monthly' ? 'Generating...' : 'Regenerate'}
                    </Button>
                  </div>
                </div>
                {monthlySummary ? (
                  expandedMonthlySummary && (
                    <p className="text-sm text-[#0A1A2F]/80 leading-relaxed whitespace-pre-wrap">
                      {monthlySummary.summary_text}
                    </p>
                  )
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-[#0A1A2F]/60 mb-3">No monthly summary yet</p>
                    <Button
                      onClick={() => generateSummary.mutate('monthly')}
                      disabled={generateSummary.isPending}
                      size="sm"
                      className="bg-[#FAD98D] hover:bg-[#FAD98D]/90 text-[#0A1A2F]"
                    >
                      Generate Monthly Summary
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[#FAD98D]" />
            <h3 className="text-sm font-semibold text-[#0A1A2F]">Filter by Category</h3>
          </div>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {CATEGORIES.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.value
                    ? 'bg-[#FAD98D] text-[#0A1A2F]'
                    : 'bg-white text-[#0A1A2F]/70 border border-gray-200 hover:border-[#FAD98D]'
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
            <Button
              className="mt-4 bg-[#FD9C2D] hover:bg-[#FD9C2D]/90 text-white"
              onClick={() => setShowNewEntryModal(true)}
            >
              ✍️ Write Your First Entry
            </Button>
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
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-100/80 transition-colors"
                >
                  <span className="font-semibold text-[#0A1A2F] text-sm">
                    {date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#FAD98D] text-[#0A1A2F] rounded-full px-2 py-1">
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
                              className="bg-gray-100 border-[#F2F6FA] text-black"
                            />
                            <Textarea
                              maxLength={1000}
                              placeholder="Entry content"
                              value={editContent}
                              onChange={(e) =>
                                setEditContent(e.target.value)
                              }
                              className="min-h-[150px] bg-gray-100 border-[#F2F6FA] text-black"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleSave(entry.id)}
                                className="flex-1 bg-gradient-to-r from-[#FAD98D] to-[#AFC7E3] hover:from-[#FAD98D]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
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
                                  <span className="text-xs bg-[#FAD98D]/20 text-[#FAD98D] px-2 py-1 rounded font-medium">
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
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4 text-[#FAD98D]" />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteEntry.mutate(entry.id)
                                  }
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-[#0A1A2F]/70 whitespace-pre-wrap">
                              {entry.content}
                            </p>

                            {/* Video playback for video journal entries */}
                            {entry.entry_type === 'video_journal' && entry.video_url && (
                              <div className="mt-3 rounded-2xl overflow-hidden bg-black">
                                <video
                                  src={entry.video_url}
                                  controls
                                  playsInline
                                  preload="metadata"
                                  className="w-full"
                                  style={{ maxHeight: 280 }}
                                />
                                {entry.video_duration > 0 && (
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0A1A2F]">
                                    <span className="text-[10px] text-white/40">🎥 Video Journal</span>
                                    <span className="text-[10px] text-white/25">·</span>
                                    <span className="text-[10px] text-white/40">{Math.floor(entry.video_duration / 60)}:{(entry.video_duration % 60).toString().padStart(2, '0')}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Video badge for video entries without video_url (transcript only) */}
                            {entry.entry_type === 'video_journal' && !entry.video_url && (
                              <div className="mt-2 flex items-center gap-2 bg-[#0A1A2F]/5 rounded-xl px-3 py-2">
                                <span className="text-base">🎥</span>
                                <span className="text-xs text-[#0A1A2F]/50">Video journal — transcript saved</span>
                              </div>
                            )}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {entry.mood && (
                                <span className="text-xs bg-[#AFC7E3]/20 text-[#AFC7E3] px-2 py-1 rounded font-medium">
                                  Mood: {entry.mood}
                                </span>
                              )}
                              {entry.suggested_practice && (
                                <span className="text-xs bg-[#FAD98D]/20 text-[#3C4E53] px-2 py-1 rounded font-medium">
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
      <JournalEntryModal isOpen={showNewEntryModal} onClose={() => setShowNewEntryModal(false)} />
    </div>
  );
}