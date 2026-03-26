import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Trophy, Flame, Sparkles,
  ChevronDown, ChevronUp, CheckCircle2, BookOpen,
  Heart, Target, Lightbulb, Star, ArrowRight, MessageCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';

// ── Reflection sections ────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'wins',
    icon: Trophy,
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
    label: "This Week's Wins",
    placeholder: 'What went well? What are you proud of — big or small?',
    hint: 'Even tiny wins count. Name at least one.',
  },
  {
    id: 'challenges',
    icon: Flame,
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#FECACA',
    label: 'Challenges I Faced',
    placeholder: 'What was hard this week? What tested you?',
    hint: 'Naming a struggle is the first step to growing through it.',
  },
  {
    id: 'gratitude',
    icon: Heart,
    color: '#EC4899',
    bg: '#FDF2F8',
    border: '#F9A8D4',
    label: 'Gratitude',
    placeholder: 'What or who are you grateful for this week?',
    hint: 'Gratitude rewires your brain toward abundance.',
  },
  {
    id: 'learned',
    icon: Lightbulb,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    label: 'What I Learned About Myself',
    placeholder: "What did this week reveal about who you are or who you're becoming?",
    hint: 'Self-awareness is the foundation of all growth.',
  },
  {
    id: 'intention',
    icon: Target,
    color: '#3C4E53',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    label: 'My Intention for Next Week',
    placeholder: 'What one thing will you do differently or focus on next week?',
    hint: 'One clear intention is more powerful than ten vague goals.',
  },
  {
    id: 'grace',
    icon: Heart,
    color: '#c9a227',
    bg: '#FFFBEB',
    border: '#FAD98D',
    label: 'Grace & Forgiveness',
    placeholder: 'Where did you need grace this week? Is there anyone — including yourself — you need to forgive?',
    hint: "His mercies are new every morning. You don't have to carry last week's weight into the next one.",
  },
];

// ── Weekly scripture ─────────────────────────────────────────────────────────
const SCRIPTURES = [
  { text: "Let us examine our ways and test them, and let us return to the Lord.", ref: 'Lamentations 3:40' },
  { text: "Search me, O God, and know my heart; test me and know my anxious thoughts.", ref: 'Psalm 139:23' },
  { text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", ref: 'Romans 12:2' },
  { text: "The heart of the discerning acquires knowledge, for the ears of the wise seek it out.", ref: 'Proverbs 18:15' },
  { text: "For I know the plans I have for you, plans to prosper you and not to harm you.", ref: 'Jeremiah 29:11' },
  { text: "Commit your works to the Lord, and your plans will be established.", ref: 'Proverbs 16:3' },
  { text: "Be still, and know that I am God.", ref: 'Psalm 46:10' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(new Date(now).setDate(diff)).toISOString().split('T')[0];
}

function getWeekLabel() {
  const start = new Date(getWeekStart());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getWeekNumber() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24 * 7));
}

function countFilled(answers) {
  return SECTIONS.filter(s => (answers[s.id] || '').trim().length > 0).length;
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ filled, total }) {
  const pct = Math.round((filled / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,#AFC7E3,#3C4E53)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-semibold text-[#0A1A2F]/50 w-10 text-right">{filled}/{total}</span>
    </div>
  );
}

// ── Previous week peek ────────────────────────────────────────────────────────
function PreviousWeekCard({ entry }) {
  const [open, setOpen] = useState(false);
  if (!entry) return null;
  let parsed = {};
  try { parsed = JSON.parse(entry.content); } catch { parsed = { wins: entry.content }; }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#AFC7E3]" />
          <span className="text-sm font-semibold text-[#0A1A2F]">Last Week's Reflection</span>
          <span className="text-xs text-[#0A1A2F]/40 bg-gray-50 px-2 py-0.5 rounded-full">{entry.created_date}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#0A1A2F]/40" /> : <ChevronDown className="w-4 h-4 text-[#0A1A2F]/40" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-4">
              {SECTIONS.map(s => {
                const val = parsed[s.id];
                if (!val) return null;
                const Icon = s.icon;
                return (
                  <div key={s.id}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3 h-3" style={{ color: s.color }} />
                      <span className="text-xs font-semibold text-[#0A1A2F]/60">{s.label}</span>
                    </div>
                    <p className="text-sm text-[#0A1A2F]/80 leading-relaxed pl-5">{val}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Completed celebration state ───────────────────────────────────────────────
function CompletedState({ weekLabel, onEdit, navigate, user }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"
      >
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </motion.div>
      <h3 className="text-xl font-bold text-[#0A1A2F] mb-1">Reflection Complete</h3>
      <p className="text-sm text-[#0A1A2F]/50 mb-2">{weekLabel}</p>
      <p className="text-sm text-[#0A1A2F]/65 leading-relaxed mb-5 max-w-xs mx-auto">
        Taking time to reflect is one of the most powerful habits of people who keep growing. Well done.
      </p>
      <div className="flex justify-center mb-5">
        <ShareToFeedButton
          type="growth_win"
          title={`Weekly reflection complete — ${weekLabel}`}
          content={`Just finished my weekly reflection on Prosperity Revived. Taking time to pause, look back, and grow forward. Grateful for this practice. 🙏`}
          source="Hannah"
          label="Share this win"
          color="#AFC7E3"
          user={user}
        />
      </div>
      <div className="space-y-3">
        <button
          onClick={() => navigate(createPageUrl('ChatScreen?bot=Hannah'))}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-semibold shadow-sm"
          style={{ background: 'linear-gradient(135deg,#AFC7E3,#3C4E53)' }}
        >
          <MessageCircle className="w-4 h-4" />
          Go deeper with Hannah
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(createPageUrl('AffirmationsPage'))}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#0A1A2F] text-sm font-semibold bg-[#AFC7E3]/10 border border-[#AFC7E3]/25"
        >
          <Sparkles className="w-4 h-4 text-[#AFC7E3]" />
          Speak an affirmation over your week
        </button>
        <button
          onClick={() => navigate(createPageUrl('GrowthPathwaysPage'))}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#0A1A2F] text-sm font-semibold bg-gray-50 border border-gray-100"
        >
          <Target className="w-4 h-4 text-[#0A1A2F]/45" />
          Review my growth pathway
        </button>
      </div>
      <button onClick={onEdit} className="mt-5 text-xs text-[#0A1A2F]/35 hover:text-[#0A1A2F]/55 transition-colors">
        Edit this reflection
      </button>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function WeeklyReflectionPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [previousEntry, setPreviousEntry] = useState(null);
  const [entryId, setEntryId] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const scripture = SCRIPTURES[getWeekNumber() % SCRIPTURES.length];
  const weekLabel = getWeekLabel();
  const filled = countFilled(answers);
  const total = SECTIONS.length;

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const weekStart = getWeekStart();
      const entries = await base44.entities.JournalEntry.filter({ entry_type: 'weekly_reflection' });
      entries.sort((a, b) => (b.created_date || '').localeCompare(a.created_date || ''));

      const thisWeek = entries.find(e => e.created_date === weekStart);
      if (thisWeek) {
        setEntryId(thisWeek.id);
        setLastSaved(thisWeek.updated_date);
        try {
          const parsed = JSON.parse(thisWeek.content);
          setAnswers(parsed);
          if (countFilled(parsed) >= 3) setCompleted(true);
        } catch { setAnswers({ wins: thisWeek.content }); }
      }

      const prev = entries.find(e => e.created_date !== weekStart);
      if (prev) setPreviousEntry(prev);

      // Count consecutive weekly streak
      const weekStarts = new Set(entries.map(e => e.created_date));
      let s = 0;
      for (let i = 0; i < 52; i++) {
        const d = new Date(weekStart);
        d.setDate(d.getDate() - i * 7);
        const key = d.toISOString().split('T')[0];
        if (weekStarts.has(key)) s++;
        else if (i > 0) break;
      }
      setStreak(s);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  function setAnswer(id, val) {
    setAnswers(prev => ({ ...prev, [id]: val }));
    setCompleted(false);
  }

  async function handleSave() {
    if (filled === 0) { toast.error('Write at least one section to save'); return; }
    setSaving(true);
    try {
      const weekStart = getWeekStart();
      const content = JSON.stringify(answers);
      if (entryId) {
        await base44.entities.JournalEntry.update(entryId, { content, prompt: 'weekly_structured' });
      } else {
        const created = await base44.entities.JournalEntry.create({
          entry_type: 'weekly_reflection',
          content,
          prompt: 'weekly_structured',
          created_date: weekStart,
        });
        setEntryId(created.id);
      }
      setLastSaved(new Date().toISOString());
      setCompleted(true);
      toast.success('Reflection saved to your journal!');
    } catch { toast.error('Failed to save — please try again'); }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#AFC7E3] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-28">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#AFC7E3]/20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            to={createPageUrl('PersonalGrowth')}
            className="w-9 h-9 rounded-full bg-[#AFC7E3]/15 hover:bg-[#AFC7E3]/25 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[#0A1A2F] leading-tight">Weekly Reflection</h1>
            <p className="text-xs text-[#0A1A2F]/50 truncate">{weekLabel}</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 px-2.5 py-1.5 rounded-full">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-bold text-orange-600">{streak}w streak</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Scripture banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 border border-[#AFC7E3]/20"
          style={{ background: 'linear-gradient(135deg,#0A1A2F,#1E3050)' }}
        >
          <div className="flex items-start gap-3">
            <Star className="w-4 h-4 text-[#FAD98D] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-white/85 leading-relaxed italic mb-1.5">"{scripture.text}"</p>
              <p className="text-xs text-[#FAD98D] font-semibold">{scripture.ref}</p>
            </div>
          </div>
        </motion.div>

        {/* Previous week peek */}
        <PreviousWeekCard entry={previousEntry} />

        {/* Editor or completed state */}
        <AnimatePresence mode="wait">
          {completed ? (
            <CompletedState key="done" weekLabel={weekLabel} navigate={navigate} onEdit={() => setCompleted(false)} user={user} />
          ) : (
            <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

              {/* Progress tracker */}
              <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#0A1A2F]">Your reflection</span>
                  <span className="text-xs text-[#0A1A2F]/45">
                    {filled === 0 ? 'Get started below' : filled === total ? 'All complete ✓' : `${total - filled} section${total - filled > 1 ? 's' : ''} left`}
                  </span>
                </div>
                <ProgressBar filled={filled} total={total} />
              </div>

              {/* Sections */}
              {SECTIONS.map((section, i) => {
                const Icon = section.icon;
                const val = answers[section.id] || '';
                const hasContent = val.trim().length > 0;
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden border"
                    style={{ borderColor: hasContent ? section.border : '#F3F4F6' }}
                  >
                    <div
                      className="flex items-center gap-3 px-5 py-4 border-b"
                      style={{ borderColor: hasContent ? section.border : '#F9FAFB', background: hasContent ? section.bg : 'white' }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: section.color + '1A' }}>
                        <Icon className="w-4 h-4" style={{ color: section.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#0A1A2F]">{section.label}</p>
                        <p className="text-xs text-[#0A1A2F]/45">{section.hint}</p>
                      </div>
                      {hasContent && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: section.color }} />}
                    </div>
                    <div className="px-5 py-4">
                      <textarea
                        value={val}
                        onChange={e => setAnswer(section.id, e.target.value)}
                        placeholder={section.placeholder}
                        rows={3}
                        className="w-full text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/30 bg-transparent border-none outline-none resize-none leading-relaxed"
                      />
                      {val.length > 0 && (
                        <p className="text-right text-xs text-[#0A1A2F]/25 mt-1">{val.length} chars</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Save button */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <button
                  onClick={handleSave}
                  disabled={saving || filled === 0}
                  className="w-full py-4 rounded-2xl text-white text-base font-bold shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: filled > 0 ? 'linear-gradient(135deg,#AFC7E3,#3C4E53)' : '#D1D5DB' }}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Save Reflection
                      {filled > 0 && <span className="text-white/65 text-sm font-normal">({filled}/{total})</span>}
                    </span>
                  )}
                </button>
                {lastSaved && (
                  <p className="text-center text-xs text-[#0A1A2F]/30 mt-2">
                    Last saved {new Date(lastSaved).toLocaleDateString()} at {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </motion.div>

              {/* Hannah nudge */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => navigate(createPageUrl('ChatScreen?bot=Hannah'))}
                className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-2xl border border-[#AFC7E3]/25 shadow-sm hover:border-[#AFC7E3]/55 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg,#AFC7E3,#3C4E53)' }}>H</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#0A1A2F]">Need to talk it through?</p>
                    <p className="text-xs text-[#0A1A2F]/50">Hannah can help you process your week</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#0A1A2F]/30" />
              </motion.button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
