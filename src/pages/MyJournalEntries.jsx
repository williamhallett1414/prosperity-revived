import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Save, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function MyJournalEntries() {
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [expandedDate, setExpandedDate] = useState(null);
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

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups = {};
    entries.forEach(entry => {
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
  }, [entries]);

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
        <div className="max-w-2xl mx-auto flex items-center gap-3">
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
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
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
                                {entry.title && (
                                  <h3 className="font-semibold text-[#0A1A2F] line-clamp-2">
                                    {entry.title}
                                  </h3>
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
                            <p className="text-sm text-[#0A1A2F]/70 whitespace-pre-wrap line-clamp-3">
                              {entry.content}
                            </p>
                            {entry.mood && (
                              <div className="mt-3 text-xs">
                                <span className="inline-block bg-[#E6EBEF] text-[#0A1A2F] px-2 py-1 rounded">
                                  Mood: {entry.mood}
                                </span>
                              </div>
                            )}
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
    </div>
  );
}