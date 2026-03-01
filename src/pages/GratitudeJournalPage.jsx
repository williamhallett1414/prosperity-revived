import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, ArrowLeft, Sparkles, BarChart2, BookOpen, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GratitudeAIPrompt from '@/components/mindspirit/GratitudeAIPrompt';
import GratitudeMoodChart from '@/components/mindspirit/GratitudeMoodChart';
import GratitudePatternInsights from '@/components/mindspirit/GratitudePatternInsights';

const TABS = [
  { id: 'write', label: 'Write', icon: Heart },
  { id: 'insights', label: 'Insights', icon: BarChart2 },
  { id: 'history', label: 'History', icon: BookOpen },
];

const MOOD_COLORS = {
  joyful: 'text-yellow-500 bg-yellow-50',
  grateful: 'text-green-500 bg-green-50',
  hopeful: 'text-blue-500 bg-blue-50',
  peaceful: 'text-teal-500 bg-teal-50',
  struggling: 'text-red-400 bg-red-50',
  seeking: 'text-purple-500 bg-purple-50',
};

export default function GratitudeJournalPage() {
  const [activeTab, setActiveTab] = useState('write');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(null);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null);
  const [analyzingMood, setAnalyzingMood] = useState(false);

  const queryClient = useQueryClient();

  const { data: entries = [] } = useQuery({
    queryKey: ['gratitude-entries'],
    queryFn: () => base44.entities.JournalEntry.filter({ entry_type: 'gratitude' }, '-created_date', 30),
  });

  // Fetch AI prompt on mount
  useEffect(() => {
    fetchAIPrompt();
  }, []);

  const fetchAIPrompt = async () => {
    setLoadingPrompt(true);
    try {
      const recentContent = entries.slice(0, 5).map(e => e.content).join(' | ');
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a compassionate gratitude coach. Generate a single, thoughtful, spiritually-grounded reflection prompt to encourage deeper gratitude journaling. ${recentContent ? `The user has recently written about: "${recentContent}". Identify a theme or pattern and build on it.` : 'This may be their first entry.'} Return ONLY the prompt sentence, no intro, no quotes, no labels. Make it warm, personal, and 1-2 sentences max.`,
      });
      setAiPrompt(res);
    } catch (e) {
      setAiPrompt("What small moment today made you feel truly seen or cared for?");
    }
    setLoadingPrompt(false);
  };

  const analyzeSentiment = async (text) => {
    if (!text.trim() || text.trim().length < 10) return;
    setAnalyzingMood(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze the emotional tone of this gratitude journal entry and return a JSON object. Entry: "${text}". Return JSON with: { "mood": one of [joyful, grateful, hopeful, peaceful, struggling, seeking], "sentiment_score": number from 1 (very negative) to 10 (very positive), "emotion_summary": a 1-sentence summary of the emotional tone }`,
        response_json_schema: {
          type: 'object',
          properties: {
            mood: { type: 'string' },
            sentiment_score: { type: 'number' },
            emotion_summary: { type: 'string' },
          },
        },
      });
      setSentimentResult(res);
    } catch (e) {
      setSentimentResult(null);
    }
    setAnalyzingMood(false);
  };

  // Debounce sentiment analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim().length > 20) {
        analyzeSentiment(content);
      } else {
        setSentimentResult(null);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [content]);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please write something you're grateful for");
      return;
    }
    setSaving(true);
    try {
      await base44.entities.JournalEntry.create({
        entry_type: 'gratitude',
        content: content.trim(),
        mood: sentimentResult?.mood || 'grateful',
        tags: sentimentResult ? [`score:${sentimentResult.sentiment_score}`] : [],
      });
      toast.success('Gratitude saved! 🙏');
      setContent('');
      setSentimentResult(null);
      queryClient.invalidateQueries({ queryKey: ['gratitude-entries'] });
      fetchAIPrompt();
    } catch (e) {
      toast.error('Failed to save');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#AFC7E3]/20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('PersonalGrowth')}
            className="w-9 h-9 rounded-full bg-[#AFC7E3]/20 hover:bg-[#AFC7E3]/30 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#0A1A2F]">Gratitude Journal</h1>
            <p className="text-xs text-[#0A1A2F]/60">AI-powered reflection</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-[#FD9C2D] to-[#D9B878] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[61px] z-30 bg-white border-b border-gray-100 px-4">
        <div className="max-w-2xl mx-auto flex">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#FD9C2D] text-[#FD9C2D]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'write' && (
            <motion.div key="write" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* AI Prompt */}
              <GratitudeAIPrompt prompt={aiPrompt} loading={loadingPrompt} onRefresh={fetchAIPrompt} />

              {/* Journal Input */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-[#FD9C2D]" />
                  <h3 className="font-semibold text-[#0A1A2F]">Today's Gratitude</h3>
                </div>
                <Textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write freely about what you're grateful for today..."
                  className="min-h-[160px] resize-none border-gray-200 focus:border-[#FD9C2D] text-base leading-relaxed"
                />

                {/* Live Sentiment Feedback */}
                <AnimatePresence>
                  {analyzingMood && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      Analyzing mood...
                    </motion.div>
                  )}
                  {sentimentResult && !analyzingMood && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-3 flex items-center gap-3 flex-wrap">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${MOOD_COLORS[sentimentResult.mood] || 'text-gray-500 bg-gray-100'}`}>
                        {sentimentResult.mood}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i < sentimentResult.sentiment_score ? 'bg-[#FD9C2D]' : 'bg-gray-200'}`} />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">{sentimentResult.sentiment_score}/10</span>
                      </div>
                      <p className="text-xs text-gray-500 w-full">{sentimentResult.emotion_summary}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={handleSave}
                  disabled={saving || !content.trim()}
                  className="w-full mt-4 bg-gradient-to-r from-[#FD9C2D] to-[#D9B878] hover:opacity-90 text-white h-12 text-base font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : 'Save to My Journal'}
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div key="insights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4">
              <GratitudeMoodChart entries={entries} />
              <GratitudePatternInsights entries={entries} />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-3">
              {entries.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No entries yet</p>
                  <p className="text-sm">Start writing to build your gratitude history</p>
                </div>
              ) : (
                entries.map((entry, i) => (
                  <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">
                        {new Date(entry.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {entry.mood && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${MOOD_COLORS[entry.mood] || 'text-gray-400 bg-gray-100'}`}>
                          {entry.mood}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#0A1A2F]/80 leading-relaxed line-clamp-4">{entry.content}</p>
                    {entry.tags?.some(t => t.startsWith('score:')) && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(10)].map((_, i) => {
                          const score = parseInt(entry.tags.find(t => t.startsWith('score:'))?.split(':')[1] || 0);
                          return <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < score ? 'bg-[#FD9C2D]' : 'bg-gray-200'}`} />;
                        })}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}