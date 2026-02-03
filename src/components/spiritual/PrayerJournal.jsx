import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Heart, Sparkles, Loader2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const prayerTypes = [
  { value: 'praise', label: '🙌 Praise', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'thanksgiving', label: '🙏 Thanksgiving', color: 'bg-green-100 text-green-800' },
  { value: 'confession', label: '💭 Confession', color: 'bg-purple-100 text-purple-800' },
  { value: 'petition', label: '🤲 Petition', color: 'bg-blue-100 text-blue-800' },
  { value: 'intercession', label: '❤️ Intercession', color: 'bg-red-100 text-red-800' }
];

export default function PrayerJournal() {
  const [showCreate, setShowCreate] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    prayer_type: 'petition',
    mood: 'hopeful'
  });

  const queryClient = useQueryClient();

  const { data: entries = [] } = useQuery({
    queryKey: ['prayerJournal'],
    queryFn: () => base44.entities.PrayerJournal.list('-created_date', 50)
  });

  const createEntry = useMutation({
    mutationFn: (data) => base44.entities.PrayerJournal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['prayerJournal']);
      setShowCreate(false);
      setNewEntry({ title: '', content: '', prayer_type: 'petition', mood: 'hopeful' });
    }
  });

  const updateEntry = useMutation({
    mutationFn: ({ id, answered }) => base44.entities.PrayerJournal.update(id, { answered }),
    onSuccess: () => queryClient.invalidateQueries(['prayerJournal'])
  });

  const handleGetAIPrompt = async () => {
    setLoadingAI(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a thoughtful spiritual reflection prompt to help someone deepen their prayer life. The prompt should be introspective, biblically grounded, and encourage authentic conversation with God.`,
        response_json_schema: {
          type: "object",
          properties: {
            prompt: { type: "string" },
            scripture_suggestion: { type: "string" }
          }
        }
      });
      setAIPrompt(result.prompt);
      setNewEntry({ ...newEntry, title: result.scripture_suggestion });
      setShowAIPrompt(true);
    } catch (error) {
      console.error('Failed to get AI prompt', error);
    }
    setLoadingAI(false);
  };

  const handleSubmit = () => {
    if (newEntry.content.trim()) {
      createEntry.mutate(newEntry);
    }
  };

  const getPrayerTypeStyle = (type) => {
    return prayerTypes.find(t => t.value === type) || prayerTypes[0];
  };

  return (
    <div className="space-y-4">
      {/* AI Prompt Button */}
      <div className="flex gap-2">
        <Button
          onClick={() => setShowCreate(true)}
          className="flex-1 bg-[#1a1a2e] hover:bg-[#2d2d4a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Journal Entry
        </Button>
        <Button
          onClick={handleGetAIPrompt}
          disabled={loadingAI}
          variant="outline"
          className="border-[#c9a227] text-[#c9a227] hover:bg-[#c9a227]/10"
        >
          {loadingAI ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Journal Entries */}
      {entries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <BookHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Start your prayer journal</p>
          <Button onClick={() => setShowCreate(true)}>
            Write First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const prayerStyle = getPrayerTypeStyle(entry.prayer_type);
            const isExpanded = expandedEntry === entry.id;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={prayerStyle.color}>
                        {prayerStyle.label}
                      </Badge>
                      {entry.answered && (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Answered
                        </Badge>
                      )}
                    </div>
                    {entry.title && (
                      <h3 className="font-semibold text-[#1a1a2e]">{entry.title}</h3>
                    )}
                    <p className="text-xs text-gray-400">
                      {format(new Date(entry.created_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>

                <p className={`text-gray-700 ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {entry.content}
                </p>

                {!entry.answered && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateEntry.mutate({ id: entry.id, answered: true })}
                    className="mt-2 text-green-600 hover:text-green-700"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark as Answered
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Entry Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Prayer Journal Entry</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title (Optional)</label>
              <Input
                placeholder="e.g., Prayer for family"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Prayer Type</label>
                <Select
                  value={newEntry.prayer_type}
                  onValueChange={(value) => setNewEntry({ ...newEntry, prayer_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {prayerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Mood</label>
                <Select
                  value={newEntry.mood}
                  onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joyful">😊 Joyful</SelectItem>
                    <SelectItem value="grateful">🙏 Grateful</SelectItem>
                    <SelectItem value="struggling">😔 Struggling</SelectItem>
                    <SelectItem value="hopeful">✨ Hopeful</SelectItem>
                    <SelectItem value="peaceful">😌 Peaceful</SelectItem>
                    <SelectItem value="seeking">🔍 Seeking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showAIPrompt && aiPrompt && (
              <div className="bg-[#faf8f5] border-l-4 border-[#c9a227] p-3 rounded">
                <p className="text-sm text-gray-700">
                  <Sparkles className="w-3 h-3 inline mr-1 text-[#c9a227]" />
                  {aiPrompt}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Your Prayer</label>
              <Textarea
                placeholder="Write your prayer or reflection here..."
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="min-h-[150px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowCreate(false);
                setShowAIPrompt(false);
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!newEntry.content.trim()}
                className="bg-[#1a1a2e] hover:bg-[#2d2d4a]"
              >
                Save Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}