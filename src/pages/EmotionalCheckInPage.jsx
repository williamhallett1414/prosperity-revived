import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ArrowLeft, Flame, ChevronRight,
  BookOpen, Sparkles, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ShareToFeedButton from '@/components/community/ShareToFeedButton';
import { useQuery } from '@tanstack/react-query';

const MOODS = [
  {
    emoji: '😊', label: 'Joyful', value: 'joyful',
    color: 'from-amber-400 to-yellow-300', bg: 'bg-amber-50', border: 'border-amber-300', dot: '#f59e0b',
    scripture: { text: 'Rejoice in the Lord always. I will say it again: Rejoice!', ref: 'Philippians 4:4' },
    practice: 'Gratitude Prayer', practiceIcon: '🙏', practicePage: 'Prayer',
    prompt: 'What are you grateful for right now?',
  },
  {
    emoji: '🙏', label: 'Grateful', value: 'grateful',
    color: 'from-green-400 to-emerald-300', bg: 'bg-green-50', border: 'border-green-300', dot: '#22c55e',
    scripture: { text: 'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.', ref: '1 Thessalonians 5:18' },
    practice: 'Scripture Meditation', practiceIcon: '📖', practicePage: 'Bible',
    prompt: 'Name three specific blessings from today.',
  },
  {
    emoji: '🌟', label: 'Hopeful', value: 'hopeful',
    color: 'from-sky-400 to-blue-300', bg: 'bg-sky-50', border: 'border-sky-300', dot: '#3b82f6',
    scripture: { text: 'For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future.', ref: 'Jeremiah 29:11' },
    practice: 'Affirmations', practiceIcon: '✨', practicePage: 'AffirmationsPage',
    prompt: 'What are you looking forward to?',
  },
  {
    emoji: '😌', label: 'Peaceful', value: 'peaceful',
    color: 'from-teal-400 to-cyan-300', bg: 'bg-teal-50', border: 'border-teal-300', dot: '#14b8a6',
    scripture: { text: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', ref: 'Philippians 4:7' },
    practice: 'Guided Meditation', practiceIcon: '🧘', practicePage: 'GuidedMeditationsPage',
    prompt: 'What is bringing you peace right now?',
  },
  {
    emoji: '😔', label: 'Sad', value: 'sad',
    color: 'from-blue-400 to-indigo-300', bg: 'bg-blue-50', border: 'border-blue-300', dot: '#6366f1',
    scripture: { text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.', ref: 'Psalm 34:18' },
    practice: 'Comforting Verses', practiceIcon: '📖', practicePage: 'Bible',
    prompt: 'What is weighing on your heart today?',
  },
  {
    emoji: '😰', label: 'Anxious', value: 'anxious',
    color: 'from-purple-400 to-violet-300', bg: 'bg-purple-50', border: 'border-purple-300', dot: '#a855f7',
    scripture: { text: 'Cast all your anxiety on him because he cares for you.', ref: '1 Peter 5:7' },
    practice: 'Breathing Exercise', practiceIcon: '🌬️', practicePage: 'GuidedMeditationsPage',
    prompt: 'What is making you feel anxious? Try to name it.',
  },
  {
    emoji: '😤', label: 'Frustrated', value: 'frustrated',
    color: 'from-orange-400 to-red-300', bg: 'bg-orange-50', border: 'border-orange-300', dot: '#f97316',
    scripture: { text: 'A gentle answer turns away wrath, but a harsh word stirs up anger.', ref: 'Proverbs 15:1' },
    practice: 'Grounding Practice', practiceIcon: '🌿', practicePage: 'MindsetResetPage',
    prompt: 'What triggered this feeling? What do you need right now?',
  },
  {
    emoji: '😐', label: 'Neutral', value: 'neutral',
    color: 'from-slate-400 to-gray-300', bg: 'bg-slate-50', border: 'border-slate-300', dot: '#94a3b8',
    scripture: { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
    practice: 'Reflection', practiceIcon: '💭', practicePage: 'MyJournalEntries',
    prompt: 'Even in stillness, what is your heart saying?',
  },
  {
    emoji: '😩', label: 'Overwhelmed', value: 'overwhelmed',
    color: 'from-rose-400 to-pink-300', bg: 'bg-rose-50', border: 'border-rose-300', dot: '#f43f5e',
    scripture: { text: 'Come to me, all you who are weary and burdened, and I will give you rest.', ref: 'Matthew 11:28' },
    practice: 'Mindset Reset', practiceIcon: '🔄', practicePage: 'MindsetResetPage',
    prompt: 'What feels like too much right now? What can you set down?',
  },
  {
    emoji: '😞', label: 'Guilty', value: 'guilty',
    color: 'from-stone-400 to-zinc-300', bg: 'bg-stone-50', border: 'border-stone-300', dot: '#78716c',
    scripture: { text: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.', ref: '1 John 1:9' },
    practice: 'Talk to Gideon', practiceIcon: '🕊️', practicePage: 'ChatScreen?bot=Gideon',
    prompt: 'What is weighing on your conscience? God\'s grace is bigger than any mistake.',
  },
  {
    emoji: '🥀', label: 'Struggling', value: 'struggling',
    color: 'from-amber-600 to-amber-400', bg: 'bg-amber-50', border: 'border-amber-400', dot: '#d97706',
    scripture: { text: 'My grace is sufficient for you, for my power is made perfect in weakness.', ref: '2 Corinthians 12:9' },
    practice: 'Forgiveness Meditation', practiceIcon: '🤍', practicePage: 'GuidedMeditationsPage',
    prompt: 'You don\'t have to carry this alone. What do you need God to hold for you right now?',
  },
];

const INTENSITY_LABELS = ['Barely', 'Slightly', 'Moderately', 'Strongly', 'Intensely'];

const DAILY_PROMPTS = [
  'What is God placing on your heart today?',
  'Where did you feel His presence today?',
  'What challenged you today — and what did it reveal?',
  'How is your soul doing right now, honestly?',
  'What do you need to release today?',
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getMoodDot(moodValue) {
  return MOODS.find(m => m.value === moodValue)?.dot || '#cbd5e1';
}

function buildWeekHistory(entries) {
  const map = {};
  entries.forEach(e => {
    if (e.entry_type === 'emotional_checkin' && e.mood) {
      const day = (e.created_date || '').slice(0, 10);
      if (!map[day]) map[day] = e.mood;
    }
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
  const checkinDays = new Set(
    entries.filter(e => e.entry_type === 'emotional_checkin').map(e => (e.created_date || '').slice(0, 10))
  );
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (checkinDays.has(key)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

export default function EmotionalCheckInPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [weekDays, setWeekDays] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: recentEntries = [] } = useQuery({
    queryKey: ['journalEntries_checkin'],
    queryFn: () => base44.entities.JournalEntry.list('-created_date', 60),
  });

  useEffect(() => {
    setWeekDays(buildWeekHistory(recentEntries));
    setStreak(calcStreak(recentEntries));
  }, [recentEntries]);

  const moodObj = MOODS.find(m => m.value === selectedMood?.value);
  const dailyPrompt = DAILY_PROMPTS[new Date().getDay() % DAILY_PROMPTS.length];

  const handleSave = async () => {
    if (!selectedMood) { toast.error('Please select a mood'); return; }
    setSaving(true);
    try {
      await base44.entities.JournalEntry.create({
        entry_type: 'emotional_checkin',
        mood: selectedMood.value,
        content: reflection,
        suggested_practice: selectedMood.practice,
        tags: [`intensity:${intensity}`],
      });
      const todayChecked = weekDays.find(d => d.label === 'Today')?.mood;
      if (!todayChecked) setStreak(s => s + 1);
      setDone(true);
    } catch {
      toast.error('Failed to save check-in');
    }
    setSaving(false);
  };

  const handleReset = () => {
    setDone(false);
    setSelectedMood(null);
    setIntensity(3);
    setReflection('');
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] pb-28">

      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#AFC7E3]/20 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-[#AFC7E3]/20 hover:bg-[#AFC7E3]/30 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-[#0A1A2F]">Emotional Check-In</h1>
            <p className="text-xs text-[#0A1A2F]/50">
              {getGreeting()} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-bold text-orange-500">{streak}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* ── 7-day strip ── */}
        {weekDays.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#AFC7E3]/20 p-4">
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
              {weekDays.map(d => (
                <div key={d.key} className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all"
                    style={d.mood
                      ? { backgroundColor: getMoodDot(d.mood) + '22', borderColor: getMoodDot(d.mood) }
                      : { backgroundColor: '#F2F6FA', borderColor: '#F2F6FA' }}>
                    {d.mood
                      ? <span className="text-sm">{MOODS.find(m => m.value === d.mood)?.emoji}</span>
                      : <span className="text-[9px] text-[#0A1A2F]/20">–</span>}
                  </div>
                  <span className="text-[9px] font-semibold text-[#0A1A2F]/40">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── Completion screen ── */}
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

              {/* Celebration */}
              <div className={`rounded-2xl p-6 text-center bg-gradient-to-br ${moodObj.color} shadow-md`}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  className="text-5xl mb-3">{moodObj.emoji}</motion.div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-white/80" />
                  <p className="text-sm font-bold text-white">Check-in saved!</p>
                </div>
                <p className="text-white/70 text-xs">Feeling {moodObj.label} · {INTENSITY_LABELS[intensity - 1]}</p>
                {streak > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="mt-4 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                    <Flame className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-bold">{streak} day streak 🔥</span>
                  </motion.div>
                )}
              </div>

              {/* Scripture */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-[#FAD98D]/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-[#FAD98D]" />
                  <span className="text-xs font-bold text-[#0A1A2F]/40 uppercase tracking-widest">A word for you</span>
                </div>
                <p className="text-sm text-[#0A1A2F]/80 leading-relaxed italic mb-2">"{moodObj.scripture.text}"</p>
                <p className="text-xs font-bold text-[#FAD98D]">{moodObj.scripture.ref}</p>
              </motion.div>

              {/* Practice CTA */}
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                onClick={() => navigate(createPageUrl(moodObj.practicePage))}
                className="w-full bg-[#0A1A2F] text-white rounded-2xl p-4 flex items-center justify-between hover:bg-[#0A1A2F]/85 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{moodObj.practiceIcon}</span>
                  <div className="text-left">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-0.5">Suggested Practice</p>
                    <p className="text-sm font-bold text-white">{moodObj.practice}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </motion.button>

              <button onClick={handleReset}
                className="w-full text-xs text-[#0A1A2F]/30 hover:text-[#0A1A2F]/60 transition-colors py-2">
                Check in again
              </button>

              <div className="flex justify-center pb-2">
                <ShareToFeedButton
                  type="emotional_breakthrough"
                  title={`Emotional check-in complete${streak > 1 ? ` — ${streak} day streak 🔥` : ''}`}
                  content={`Just completed my daily emotional check-in on Prosperity Revived. Taking a moment to be honest with myself and with God about how I'm really doing. 💙`}
                  source="Hannah"
                  label="Share to Community"
                  color="#AFC7E3"
                  user={user}
                />
              </div>
            </motion.div>

          ) : (

          /* ── Form ── */
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

            {/* Greeting */}
            <div className="bg-gradient-to-br from-[#0A1A2F] to-[#0A1A2F] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-[#FAD98D]" />
                <span className="text-[10px] font-bold text-[#FAD98D] uppercase tracking-widest">Daily Check-In</span>
              </div>
              <h2 className="text-white font-bold text-lg mb-1">How is your soul today?</h2>
              <p className="text-white/45 text-xs leading-relaxed">{dailyPrompt}</p>
            </div>

            {/* Mood grid */}
            <div className="bg-white rounded-2xl border border-[#AFC7E3]/20 p-4">
              <p className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-3">Select your mood</p>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map(mood => (
                  <motion.button key={mood.value} whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedMood(mood); setIntensity(3); setReflection(''); }}
                    className={`py-3.5 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                      selectedMood?.value === mood.value
                        ? `${mood.border} ${mood.bg} shadow-sm`
                        : 'border-[#F2F6FA] bg-[#F2F6FA] hover:border-[#AFC7E3]/50'
                    }`}>
                    <span className="text-2xl leading-none">{mood.emoji}</span>
                    <span className={`text-[11px] font-semibold ${selectedMood?.value === mood.value ? 'text-[#0A1A2F]' : 'text-[#0A1A2F]/45'}`}>
                      {mood.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* After mood selected */}
            <AnimatePresence>
              {selectedMood && moodObj && (
                <motion.div key="expanded" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

                  {/* Intensity */}
                  <div className="bg-white rounded-2xl border border-[#AFC7E3]/20 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest">How intense?</p>
                      <span className="text-xs font-semibold text-[#0A1A2F]/55">{INTENSITY_LABELS[intensity - 1]}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setIntensity(n)}
                          className="flex-1 h-2.5 rounded-full transition-all"
                          style={{ backgroundColor: n <= intensity ? moodObj.dot : '#F2F6FA' }} />
                      ))}
                    </div>
                  </div>

                  {/* Reflection */}
                  <div className="bg-white rounded-2xl border border-[#AFC7E3]/20 p-4">
                    <p className="text-xs font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-1.5">Reflect</p>
                    <p className="text-xs text-[#0A1A2F]/45 italic mb-3">{moodObj.prompt}</p>
                    <textarea value={reflection} onChange={e => setReflection(e.target.value)}
                      placeholder="Write freely — this is just for you…"
                      rows={4}
                      className="w-full resize-none rounded-xl border border-[#F2F6FA] bg-[#F2F6FA] px-3 py-2.5 text-sm text-[#0A1A2F] placeholder-[#0A1A2F]/25 focus:outline-none focus:border-[#FAD98D]/60 transition-colors leading-relaxed" />
                  </div>

                  {/* Scripture */}
                  <div className={`rounded-2xl border p-4 ${moodObj.bg} ${moodObj.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-[#0A1A2F]/40" />
                      <span className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest">Scripture for you</span>
                    </div>
                    <p className="text-sm text-[#0A1A2F]/75 leading-relaxed italic mb-1.5">"{moodObj.scripture.text}"</p>
                    <p className="text-xs font-bold" style={{ color: moodObj.dot }}>{moodObj.scripture.ref}</p>
                  </div>

                  {/* Practice link */}
                  <button onClick={() => navigate(createPageUrl(moodObj.practicePage))}
                    className="w-full bg-white rounded-2xl border border-[#AFC7E3]/20 p-4 flex items-center justify-between hover:border-[#FAD98D]/40 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{moodObj.practiceIcon}</span>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-[#0A1A2F]/30 uppercase tracking-widest">Suggested Practice</p>
                        <p className="text-sm font-bold text-[#0A1A2F]">{moodObj.practice}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25" />
                  </button>

                  {/* Save */}
                  <motion.button whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] font-bold text-sm shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2">
                    {saving
                      ? <><Sparkles className="w-4 h-4 animate-spin" /> Saving…</>
                      : <><CheckCircle2 className="w-4 h-4" /> Save Check-In</>}
                  </motion.button>

                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
