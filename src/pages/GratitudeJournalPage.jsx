import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ArrowLeft, Sparkles, RefreshCw, Flame,
  ChevronDown, ChevronUp, BookOpen, TrendingUp,
  CheckCircle2, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import GratitudeMoodChart from '@/components/mindspirit/GratitudeMoodChart.jsx';
import GratitudePatternInsights from '@/components/mindspirit/GratitudePatternInsights.jsx';

// ─── Constants ─────────────────────────────────────────────────────────────
const GRATITUDE_SCRIPTURES = [
  { text: 'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.', ref: '1 Thessalonians 5:18' },
  { text: 'Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.', ref: 'Psalm 100:4' },
  { text: 'Every good and perfect gift is from above, coming down from the Father of the heavenly lights.', ref: 'James 1:17' },
  { text: 'I will give thanks to you, Lord, with all my heart; I will tell of all your wonderful deeds.', ref: 'Psalm 9:1' },
  { text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', ref: 'Philippians 4:6' },
  { text: 'Let the peace of Christ rule in your hearts... and be thankful.', ref: 'Colossians 3:15' },
  { text: 'Oh give thanks to the Lord, for he is good; for his steadfast love endures forever!', ref: 'Psalm 107:1' },
];

const MOOD_CONFIG = {
  joyful:    { color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  dot: '#f59e0b', emoji: '😊' },
  grateful:  { color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  dot: '#22c55e', emoji: '🙏' },
  hopeful:   { color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: '#3b82f6', emoji: '🌟' },
  peaceful:  { color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200',   dot: '#14b8a6', emoji: '😌' },
  struggling:{ color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-200',    dot: '#f87171', emoji: '😔' },
  seeking:   { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', dot: '#a855f7', emoji: '💭' },
};

function getMoodStyle(mood) {
  return MOOD_CONFIG[mood] || { color: 'text-[#FAD98D]', bg: 'bg-white', border: 'border-[#FAD98D]/30', dot: '#FAD98D', emoji: '✨' };
}

// ─── Streak helpers ─────────────────────────────────────────────────────────
function buildWeekHistory(entries) {
  const map = {};
  entries.forEach(e => {
    const day = (e.created_date || '').slice(0, 10);
    if (!map[day]) map[day] = e.mood || 'grateful';
  });
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({ key, label, mood: map[key] || null });
  }
  return days;
}

function calcStreak(entries) {
  const days = new Set(entries.map(e => (e.created_date || '').slice(0, 10)));
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

// ─── Week strip ─────────────────────────────────────────────────────────────
function WeekStrip({ days, streak }) {
  return (
    <div className="bg-white rounded-2xl border border-[#FAD98D]/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-bold text-[#0A1A2F]">
            {streak > 0 ? `${streak}-day streak` : 'Start your streak'}
          </span>
        </div>
        <span className="text-[10px] text-[#0A1A2F]/35 uppercase tracking-widest font-semibold">Last 7 days</span>
      </div>
      <div className="flex justify-between">
        {days.map(d => {
          const style = d.mood ? getMoodStyle(d.mood) : null;
          return (
            <div key={d.key} className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all"
                style={style
                  ? { backgroundColor: style.dot + '22', borderColor: style.dot }
                  : { backgroundColor: '#F2F6FA', borderColor: '#F2F6FA' }}>
                {d.mood
                  ? <span className="text-sm">{getMoodStyle(d.mood).emoji}</span>
                  : <span className="text-[9px] text-[#0A1A2F]/20">–</span>}
              </div>
              <span className="text-[9px] font-semibold text-[#0A1A2F]/40">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Entry card ─────────────────────────────────────────────────────────────
function EntryCard({ entry, index }) {
  const [expanded, setExpanded] = useState(false);
  const style = getMoodStyle(entry.mood);
  const scoreTag = entry.tags?.find(t => t.startsWith('score:'));
  const score = scoreTag ? parseInt(scoreTag.split(':')[1]) : null;
  const isLong = entry.content?.length > 180;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className={`bg-white rounded-2xl border p-4 ${style.border}`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          {entry.mood && (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${style.bg} ${style.color}`}>
              {getMoodStyle(entry.mood).emoji} {entry.mood}
            </span>
          )}
          {score !== null && (
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(n => (
                <div key={n} className="w-2 h-2 rounded-full" style={{ backgroundColor: n <= Math.round(score / 2) ? style.dot : '#F2F6FA' }} />
              ))}
            </div>
          )}
        </div>
        <span className="text-[10px] text-[#0A1A2F]/30 font-medium">
          {new Date(entry.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <p className={`text-sm text-[#0A1A2F]/75 leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
        {entry.content}
      </p>
      {isLong && (
        <button onClick={() => setExpanded(e => !e)}
          className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#FAD98D] hover:text-[#c9a227] transition-colors">
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
        </button>
      )}
    </motion.div>
  );
}

// ─── Completion screen ───────────────────────────────────────────────────────
function CompletionScreen({ entry, streak, aiReflection, loadingReflection, onReset, user }) {
  const style = getMoodStyle(entry.mood);
  const scripture = GRATITUDE_SCRIPTURES[new Date().getDay() % GRATITUDE_SCRIPTURES.length];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

      {/* Celebration */}
      <div className={`rounded-2xl p-6 text-center bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D] shadow-md`}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="text-5xl mb-3">🙏</motion.div>
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <CheckCircle2 className="w-4 h-4 text-white/80" />
          <p className="text-sm font-bold text-white">Gratitude saved!</p>
        </div>
        <p className="text-white/70 text-xs">
          {entry.mood ? `Feeling ${entry.mood} today` : 'Your heart is seen'}
        </p>
        {streak > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-4 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-bold">{streak} day streak 🔥</span>
          </motion.div>
        )}
      </div>

      {/* AI Reflection */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-[#FAD98D]/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#FAD98D]" />
          <span className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">AI Reflection</span>
        </div>
        {loadingReflection ? (
          <div className="space-y-2">
            <div className="h-3 bg-[#FAD98D]/15 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-[#FAD98D]/15 rounded-full w-3/4 animate-pulse" />
          </div>
        ) : (
          <p className="text-sm text-[#0A1A2F]/75 leading-relaxed italic">"{aiReflection}"</p>
        )}
      </motion.div>

      {/* Scripture */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-[#FAD98D]/20 p-5">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-[#FAD98D]" />
          <span className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest">Today's Word</span>
        </div>
        <p className="text-sm text-[#0A1A2F]/75 leading-relaxed italic mb-1.5">"{scripture.text}"</p>
        <p className="text-xs font-bold text-[#FAD98D]">{scripture.ref}</p>
      </motion.div>

      <div className="flex justify-center">
        <ShareToFeedButton
          type="general_win"
          title={`Gratitude practice complete${streak > 1 ? ` — ${streak} day streak! 🔥` : ''}`}
          content={`Just completed my daily gratitude journal on Prosperity Revived. Taking a moment to count my blessings. "Give thanks in all circumstances." — 1 Thess 5:18 🙏`}
          source="Hannah"
          label="Share to Community"
          color="#FD9C2D"
          user={user}
        />
      </div>
      <button onClick={onReset}
        className="w-full text-xs text-[#0A1A2F]/30 hover:text-[#0A1A2F]/60 transition-colors py-2">
        Write another entry
      </button>
    </motion.div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function GratitudeJournalPage() {
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [savedEntry, setSavedEntry] = useState(null);
  const [aiPrompt, setAiPrompt] = useState(null);
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [aiReflection, setAiReflection] = useState(null);
  const [loadingReflection, setLoadingReflection] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null);
  const [analyzingMood, setAnalyzingMood] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [streak, setStreak] = useState(0);
  const [weekDays, setWeekDays] = useState([]);
  const queryClient = useQueryClient();
  const sentimentTimer = useRef(null);

  const scripture = GRATITUDE_SCRIPTURES[new Date().getDay() % GRATITUDE_SCRIPTURES.length];

  const { data: entries = [] } = useQuery({
    queryKey: ['gratitude-entries'],
    queryFn: () => base44.entities.JournalEntry.filter({ entry_type: 'gratitude' }, '-created_date', 60),
  });

  useEffect(() => {
    setWeekDays(buildWeekHistory(entries));
    setStreak(calcStreak(entries));
  }, [entries]);

  useEffect(() => { fetchAIPrompt(); }, []);

  const fetchAIPrompt = async () => {
    setLoadingPrompt(true);
    try {
      const recentContent = entries.slice(0, 5).map(e => e.content).join(' | ');
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a compassionate gratitude coach. Generate a single, thoughtful, spiritually-grounded reflection prompt to encourage deeper gratitude journaling. ${recentContent ? `The user has recently written about: "${recentContent}". Build on a theme.` : 'This may be their first entry.'} Return ONLY the prompt sentence, 1-2 sentences, warm and personal, no quotes, no labels.`,
      });
      setAiPrompt(res);
    } catch {
      setAiPrompt("What small moment today made you feel truly seen or cared for?");
    }
    setLoadingPrompt(false);
  };

  // Debounced sentiment analysis
  useEffect(() => {
    if (sentimentTimer.current) clearTimeout(sentimentTimer.current);
    if (content.trim().length < 20) { setSentimentResult(null); return; }
    sentimentTimer.current = setTimeout(async () => {
      setAnalyzingMood(true);
      try {
        const res = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze the emotional tone of this gratitude journal entry. Entry: "${content}". Return JSON: { "mood": one of [joyful, grateful, hopeful, peaceful, struggling, seeking], "sentiment_score": number 1-10, "emotion_summary": "1-sentence summary" }`,
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
      } catch { setSentimentResult(null); }
      setAnalyzingMood(false);
    }, 1400);
  }, [content]);

  const handleSave = async () => {
    if (!content.trim()) { toast.error("Write something you're grateful for first"); return; }
    setSaving(true);
    try {
      const mood = sentimentResult?.mood || 'grateful';
      await base44.entities.JournalEntry.create({
        entry_type: 'gratitude',
        content: content.trim(),
        mood,
        tags: sentimentResult ? [`score:${sentimentResult.sentiment_score}`] : [],
      });
      setSavedEntry({ content: content.trim(), mood, created_date: new Date().toISOString() });
      queryClient.invalidateQueries({ queryKey: ['gratitude-entries'] });
      setStreak(s => s + 1);
      setDone(true);
      setContent('');
      setSentimentResult(null);
      // Generate post-save AI reflection
      setLoadingReflection(true);
      try {
        const ref = await base44.integrations.Core.InvokeLLM({
          prompt: `A user just wrote this gratitude journal entry: "${content.trim()}". Write a warm, 1-2 sentence personal reflection or affirmation responding to what they shared. Be encouraging and spiritually grounded. No labels, no quotes.`,
        });
        setAiReflection(ref);
      } catch { setAiReflection("Your gratitude is a seed — keep planting it daily and watch it grow."); }
      setLoadingReflection(false);
    } catch { toast.error('Failed to save — please try again'); }
    setSaving(false);
  };

  const visibleHistory = showAllHistory ? entries : entries.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-28">

      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#FAD98D]/20 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to={createPageUrl('PersonalGrowth')}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#FFF9EC] flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-[#0A1A2F]">Gratitude Journal</h1>
            <p className="text-xs text-[#0A1A2F]/40">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D] rounded-full flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* ── 7-day streak strip ── */}
        {weekDays.length > 0 && <WeekStrip days={weekDays} streak={streak} />}

        <AnimatePresence mode="wait">

          {/* ── Completion screen ── */}
          {done ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CompletionScreen
                entry={savedEntry}
                streak={streak}
                aiReflection={aiReflection}
                loadingReflection={loadingReflection}
                onReset={() => { setDone(false); setSavedEntry(null); setAiReflection(null); fetchAIPrompt(); }}
                user={user}
              />
            </motion.div>

          ) : (

          /* ── Write form ── */
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

            {/* Scripture banner */}
            <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-[#FAD98D]" />
                <span className="text-[10px] font-bold text-[#FAD98D] uppercase tracking-widest">Today's Word</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed italic mb-1.5">"{scripture.text}"</p>
              <p className="text-[#FAD98D] text-xs font-bold">{scripture.ref}</p>
            </div>

            {/* AI Prompt */}
            <div className="bg-white rounded-2xl border border-[#FAD98D]/25 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#FD9C2D] to-[#FAD98D] rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-[#0A1A2F]/50 uppercase tracking-widest">Today's Prompt</span>
                </div>
                <button onClick={fetchAIPrompt} disabled={loadingPrompt}
                  className="w-7 h-7 rounded-full hover:bg-[#FAD98D]/20 flex items-center justify-center transition-colors">
                  <RefreshCw className={`w-3.5 h-3.5 text-[#FAD98D] ${loadingPrompt ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {loadingPrompt ? (
                <div className="space-y-1.5 mt-2">
                  <div className="h-3 bg-[#FAD98D]/15 rounded-full w-full animate-pulse" />
                  <div className="h-3 bg-[#FAD98D]/15 rounded-full w-2/3 animate-pulse" />
                </div>
              ) : (
                <p className="text-sm text-[#0A1A2F]/70 leading-relaxed italic">{aiPrompt}</p>
              )}
            </div>

            {/* Journal input */}
            <div className="bg-white rounded-2xl border border-[#FAD98D]/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-[#FD9C2D]" />
                <h3 className="text-sm font-bold text-[#0A1A2F]">Today's Gratitude</h3>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write freely about what you're grateful for today…"
                rows={6}
                className="w-full resize-none rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] px-3 py-2.5 text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/25 focus:outline-none focus:border-[#FAD98D]/60 transition-colors leading-relaxed"
              />

              {/* Live sentiment feedback */}
              <AnimatePresence>
                {analyzingMood && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-2 text-xs text-[#0A1A2F]/35">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Reading your mood…
                  </motion.div>
                )}
                {sentimentResult && !analyzingMood && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${getMoodStyle(sentimentResult.mood).bg} ${getMoodStyle(sentimentResult.mood).color}`}>
                        {getMoodStyle(sentimentResult.mood).emoji} {sentimentResult.mood}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className="w-2.5 h-2.5 rounded-full transition-all"
                            style={{ backgroundColor: n <= Math.round(sentimentResult.sentiment_score / 2) ? getMoodStyle(sentimentResult.mood).dot : '#F2F6FA' }} />
                        ))}
                        <span className="text-[10px] text-[#0A1A2F]/35 ml-0.5">{sentimentResult.sentiment_score}/10</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#0A1A2F]/45 italic">{sentimentResult.emotion_summary}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-[#FD9C2D] to-[#FAD98D] text-white font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  : <><Heart className="w-4 h-4" /> Save to My Journal</>}
              </motion.button>
            </div>

          </motion.div>
          )}
        </AnimatePresence>

        {/* ── Recent entries (always visible) ── */}
        {entries.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#FAD98D]" />
                <h2 className="text-sm font-bold text-[#0A1A2F]">
                  Journal History <span className="text-[#0A1A2F]/30 font-normal">({entries.length})</span>
                </h2>
              </div>
            </div>

            <div className="space-y-2">
              {visibleHistory.map((entry, i) => (
                <EntryCard key={entry.id} entry={entry} index={i} />
              ))}
            </div>

            {entries.length > 3 && (
              <button onClick={() => setShowAllHistory(s => !s)}
                className="w-full mt-3 py-2.5 rounded-xl bg-white border border-[#FAD98D]/20 text-xs font-bold text-[#0A1A2F]/40 hover:text-[#0A1A2F]/70 hover:border-[#FAD98D]/40 transition-all flex items-center justify-center gap-1.5">
                {showAllHistory
                  ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                  : <><ChevronDown className="w-3.5 h-3.5" /> Show all {entries.length} entries</>}
              </button>
            )}
          </div>
        )}

        {/* ── Insights (collapsible) ── */}
        {entries.length >= 3 && (
          <div>
            <button onClick={() => setShowInsights(s => !s)}
              className="w-full flex items-center gap-2 py-2 text-left">
              <TrendingUp className="w-4 h-4 text-[#FD9C2D]" />
              <span className="text-sm font-bold text-[#0A1A2F]">Gratitude Insights</span>
              {showInsights
                ? <ChevronUp className="w-4 h-4 text-[#0A1A2F]/30 ml-auto" />
                : <ChevronDown className="w-4 h-4 text-[#0A1A2F]/30 ml-auto" />}
            </button>
            <AnimatePresence>
              {showInsights && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-4 mt-2">
                  <GratitudeMoodChart entries={entries} />
                  <GratitudePatternInsights entries={entries} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Empty state ── */}
        {entries.length === 0 && !done && (
          <div className="bg-white rounded-2xl border border-[#FAD98D]/15 p-8 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FD9C2D]/15 to-[#FAD98D]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-[#FAD98D]" />
            </div>
            <h3 className="font-bold text-[#0A1A2F] mb-1">Your journal awaits</h3>
            <p className="text-sm text-[#0A1A2F]/40 leading-relaxed">
              Write your first entry above to start building a daily gratitude practice.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
