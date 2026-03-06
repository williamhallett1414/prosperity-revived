import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ChevronRight, Check, Flame, Trophy,
  Calendar, Star, Flower2
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Challenge catalogue ───────────────────────────────────────────────────────
const CHALLENGES = [
  {
    id: 'gratitude-7',
    title: '7-Day Gratitude',
    emoji: '🙏',
    category: 'Faith',
    duration: 7,
    gradient: 'from-amber-500 to-yellow-400',
    color: '#f59e0b',
    tagline: 'Cultivate a thankful heart in one week',
    tasks: [
      { day: 1, title: 'Three blessings', content: 'Write down three things you\'re grateful for — no matter how small. Look for God\'s fingerprints in ordinary moments.' },
      { day: 2, title: 'Send encouragement', content: 'Text, call, or message someone to tell them you appreciate them. Gratitude multiplies when shared.' },
      { day: 3, title: 'Answered prayers', content: 'Recall 2–3 prayers God has answered in your life. Write them down and spend a moment in praise.' },
      { day: 4, title: 'Grateful for hardship', content: 'Name one difficulty that helped you grow. How did God use it? What would you have missed without it?' },
      { day: 5, title: 'Prayer of thanks only', content: 'Spend 5 minutes in prayer focused entirely on thanksgiving. No requests — just gratitude.' },
      { day: 6, title: 'Gratitude walk', content: 'Take a 10-minute walk outside. With every step, name something you\'re grateful for. Let it fill you.' },
      { day: 7, title: 'Share your gratitude', content: 'Post, write, or tell someone one thing you\'re grateful for. Let your testimony encourage someone else.' },
    ],
  },
  {
    id: 'stress-reset-5',
    title: '5-Day Stress Reset',
    emoji: '🕊️',
    category: 'Mindset',
    duration: 5,
    gradient: 'from-sky-500 to-blue-400',
    color: '#0ea5e9',
    tagline: 'Find peace through prayer and practice',
    tasks: [
      { day: 1, title: 'Box breathing', content: 'Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 10 times. Give God your anxiety with each exhale.' },
      { day: 2, title: 'Scripture anchor', content: 'Read Philippians 4:6–7 three times slowly. Write what it means to you today. Carry it as your mantra.' },
      { day: 3, title: 'Prayer walk', content: 'Walk for 10 minutes outside while praying aloud. Give God your specific stressors one by one.' },
      { day: 4, title: 'Digital sabbath hour', content: 'Spend one hour without any screens. Read, pray, sit in stillness, or journal. Let your nervous system rest.' },
      { day: 5, title: 'Surrender ritual', content: 'Write your top three worries. Pray over each one, giving them to God. Then — if you can — physically let them go.' },
    ],
  },
  {
    id: 'scripture-memory-7',
    title: '7-Day Scripture Memory',
    emoji: '📖',
    category: 'Faith',
    duration: 7,
    gradient: 'from-violet-500 to-purple-400',
    color: '#8b5cf6',
    tagline: 'Hide God\'s Word deep in your heart',
    tasks: [
      { day: 1, title: 'Philippians 4:13', content: '"I can do all things through Christ who strengthens me." Say it ten times aloud. Write it from memory.' },
      { day: 2, title: 'Psalm 46:10', content: '"Be still, and know that I am God." Sit in 2 minutes of silence first. Let it settle into you.' },
      { day: 3, title: 'Proverbs 3:5–6', content: '"Trust in the Lord with all your heart and lean not on your own understanding…" Where are you leaning on yourself today?' },
      { day: 4, title: 'Jeremiah 29:11', content: '"For I know the plans I have for you, declares the Lord, plans to prosper you…" Speak this over a specific worry.' },
      { day: 5, title: 'Isaiah 40:31', content: '"Those who hope in the Lord will renew their strength. They will soar on wings like eagles…" Say it when you feel tired today.' },
      { day: 6, title: 'Romans 8:28', content: '"And we know that in all things God works for the good of those who love him…" Name something this week God might be redeeming.' },
      { day: 7, title: 'Joshua 1:9', content: '"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go."' },
    ],
  },
  {
    id: 'morning-ritual-5',
    title: '5-Day Morning Ritual',
    emoji: '🌅',
    category: 'Mindset',
    duration: 5,
    gradient: 'from-orange-500 to-amber-400',
    color: '#f97316',
    tagline: 'Own the first hour, own the day',
    tasks: [
      { day: 1, title: 'Phone-free first 30', content: 'Don\'t check your phone for the first 30 minutes after waking. Use that time to pray, breathe, and set your intention.' },
      { day: 2, title: 'Three intentions', content: 'Before anything else, write three intentions for today — not tasks, but how you want to show up. Ask God to help you live them.' },
      { day: 3, title: 'Move your body first', content: 'Do 10 minutes of movement before checking any screen. Stretching, walking, or exercise — get the blood flowing and the mind clear.' },
      { day: 4, title: 'Scripture before social', content: 'Read one chapter of Scripture before opening any social media. Let God\'s voice be louder than the feed.' },
      { day: 5, title: 'The full ritual', content: 'Combine everything: no phone for 30 min, 3 intentions, movement, Scripture. This is what your mornings could look like every day.' },
    ],
  },
  {
    id: 'rest-7',
    title: '7-Day Rest Challenge',
    emoji: '😴',
    category: 'Body',
    duration: 7,
    gradient: 'from-indigo-500 to-blue-400',
    color: '#6366f1',
    tagline: 'Honor your body with real rest',
    tasks: [
      { day: 1, title: 'Bedtime by 10:30pm', content: 'Commit to being in bed by 10:30pm. Sleep is not laziness — it\'s stewardship of the body God gave you.' },
      { day: 2, title: 'No screens after 9pm', content: 'Put devices down by 9pm. Read, pray, or talk instead. Let your brain wind down naturally.' },
      { day: 3, title: 'Afternoon reset', content: 'Take a 10–20 minute rest after lunch — a short nap or eyes closed in stillness. Let your nervous system recover.' },
      { day: 4, title: 'Sabbath hour', content: 'Carve out one hour today for something completely restful and joyful — a walk, a bath, a hobby. Guard it fiercely.' },
      { day: 5, title: 'No alarm', content: 'If possible, let yourself wake naturally. Notice what your body actually needs when it\'s not forced awake.' },
      { day: 6, title: 'Wind-down ritual', content: 'Create a 15-minute bedtime routine: dim lights, prayer, light reading. Do it tonight and notice how it feels.' },
      { day: 7, title: 'Reflect on rest', content: 'Write about this week. How did intentional rest change your mood, energy, and faith? What will you keep?' },
    ],
  },
  {
    id: 'kindness-5',
    title: '5-Day Kindness Challenge',
    emoji: '💛',
    category: 'Relationships',
    duration: 5,
    gradient: 'from-rose-500 to-pink-400',
    color: '#f43f5e',
    tagline: 'Love your neighbour in concrete ways',
    tasks: [
      { day: 1, title: 'Compliment three people', content: 'Give a genuine, specific compliment to three different people today. Make eye contact. Mean it.' },
      { day: 2, title: 'Anonymous service', content: 'Do something kind for someone who won\'t know it was you — pay it forward, leave an encouraging note, help someone quietly.' },
      { day: 3, title: 'Reconnect with someone', content: 'Reach out to someone you haven\'t spoken to in a while. A text, a call, a card. Let them know you\'re thinking of them.' },
      { day: 4, title: 'Listen deeply', content: 'In your next conversation, practice listening to understand — not to respond. Ask one thoughtful follow-up question.' },
      { day: 5, title: 'Pray for five people', content: 'Write down five people and pray specifically for each one. Then consider telling one of them you prayed for them today.' },
    ],
  },
  {
    id: 'fasting-3',
    title: '3-Day Fasting Practice',
    emoji: '⚡',
    category: 'Faith',
    duration: 3,
    gradient: 'from-emerald-500 to-teal-400',
    color: '#10b981',
    tagline: 'Deny the flesh to strengthen the spirit',
    tasks: [
      { day: 1, title: 'Choose your fast', content: 'Decide what you\'re fasting from today — food, social media, entertainment, or something with a hold on you. It should cost you something.' },
      { day: 2, title: 'Replace with prayer', content: 'Every time you would have done the thing you\'re fasting from, pray instead. Use the urge as a prayer prompt.' },
      { day: 3, title: 'Break and reflect', content: 'Break your fast with prayer and thanksgiving. Journal: What did you learn about yourself? What did God say in the quiet?' },
    ],
  },
  {
    id: 'movement-7',
    title: '7-Day Movement Challenge',
    emoji: '🏃',
    category: 'Body',
    duration: 7,
    gradient: 'from-lime-500 to-green-400',
    color: '#84cc16',
    tagline: 'Move your body, lift your spirit',
    tasks: [
      { day: 1, title: '10-minute walk', content: 'Go for a 10-minute walk — outside if possible. Pray while you walk. Movement and prayer together are powerful.' },
      { day: 2, title: 'Stretch for 10 minutes', content: 'Spend 10 minutes stretching. As you hold each stretch, breathe and release tension you\'ve been carrying.' },
      { day: 3, title: 'Push to 20 minutes', content: 'Extend your walk or movement to 20 minutes. Notice what your mind does when your body moves.' },
      { day: 4, title: 'Try something new', content: 'Do a movement you don\'t normally do — dance, swim, cycle, jump rope. Your body was made to move in more ways than one.' },
      { day: 5, title: 'Move with someone', content: 'Walk, run, or work out with another person today. Movement builds community too.' },
      { day: 6, title: 'Active recovery', content: 'Take a gentle rest day — a slow walk or light stretching. Let your body recover. Rest is part of the rhythm.' },
      { day: 7, title: 'Reflect and commit', content: 'Write down how 7 days of intentional movement changed your mood or energy. What will you continue?' },
    ],
  },
];

const CATS = ['All', 'Faith', 'Mindset', 'Body', 'Relationships'];
const CAT_PILL = {
  Faith:         'bg-amber-100 text-amber-700 border-amber-200',
  Mindset:       'bg-sky-100 text-sky-700 border-sky-200',
  Body:          'bg-emerald-100 text-emerald-700 border-emerald-200',
  Relationships: 'bg-rose-100 text-rose-700 border-rose-200',
};

// ─── persistence ──────────────────────────────────────────────────────────────
const LOCAL_KEY = 'selfcare_challenges_v1';
function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); } catch { return {}; }
}
function saveLocal(d) { localStorage.setItem(LOCAL_KEY, JSON.stringify(d)); }

// ─── Challenge detail (full-screen overlay) ───────────────────────────────────
function ChallengeDetail({ challenge, localData, onClose, onStart, onComplete }) {
  const cData = localData[challenge.id] || null;
  const completedDays = cData?.completedDays || [];
  const isStarted = !!cData;
  const isDone = completedDays.length >= challenge.duration;
  const nextDay = completedDays.length + 1;
  const currentTask = !isDone ? challenge.tasks[completedDays.length] : null;
  const pct = Math.round((completedDays.length / challenge.duration) * 100);

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-[#F2F6FA] flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0] flex-shrink-0">
        <button onClick={onClose}
          className="w-9 h-9 rounded-full bg-[#F2F6FA] hover:bg-[#E8EFF6] flex items-center justify-center transition-colors">
          <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#0A1A2F] truncate">{challenge.title}</p>
          <p className="text-[10px] text-[#0A1A2F]/40 uppercase tracking-widest font-semibold">{challenge.duration} days · {challenge.category}</p>
        </div>
        <span className="text-2xl">{challenge.emoji}</span>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">

        {/* Hero */}
        <div className={`mx-4 mt-4 rounded-2xl p-5 bg-gradient-to-br ${challenge.gradient}`}>
          <p className="text-white font-bold text-xl leading-snug mb-1">{challenge.title}</p>
          <p className="text-white/75 text-sm mb-5">{challenge.tagline}</p>

          {isStarted && !isDone && (
            <div className="bg-white/15 rounded-xl p-3">
              <div className="flex justify-between text-white text-xs font-semibold mb-2">
                <span>Progress</span>
                <span>{completedDays.length} / {challenge.duration} days · {pct}%</span>
              </div>
              <div className="h-2 bg-white/25 rounded-full overflow-hidden">
                <motion.div className="h-full bg-white rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
              </div>
            </div>
          )}

          {isDone && (
            <div className="bg-white/20 rounded-xl p-3 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-white flex-shrink-0" />
              <div>
                <p className="text-white font-bold text-sm">Challenge complete!</p>
                <p className="text-white/70 text-xs">You finished all {challenge.duration} days.</p>
              </div>
            </div>
          )}
        </div>

        {/* Today's task */}
        {isStarted && !isDone && currentTask && (
          <div className="mx-4 mt-4">
            <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-2">Today — Day {nextDay}</p>
            <motion.div key={nextDay} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border-2 p-4 shadow-sm" style={{ borderColor: challenge.color + '40' }}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: challenge.color }}>{nextDay}</div>
                <p className="font-bold text-sm text-[#0A1A2F]">{currentTask.title}</p>
              </div>
              <p className="text-sm text-[#0A1A2F]/60 leading-relaxed mb-4">{currentTask.content}</p>
              <button onClick={() => onComplete(challenge.id, nextDay)}
                className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${challenge.color}, ${challenge.color}bb)` }}>
                <Check className="w-4 h-4" /> Mark Day {nextDay} Complete
              </button>
            </motion.div>
          </div>
        )}

        {/* All task steps */}
        <div className="mx-4 mt-5">
          <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-3">All {challenge.duration} Days</p>
          <div className="space-y-2">
            {challenge.tasks.map((task) => {
              const done = completedDays.includes(task.day);
              const isToday = isStarted && task.day === nextDay && !isDone;
              return (
                <div key={task.day}
                  className={`rounded-xl p-3.5 flex items-start gap-3 border transition-colors ${
                    done ? 'bg-emerald-50 border-emerald-200'
                    : isToday ? 'bg-white shadow-sm'
                    : 'bg-white border-[#E2E8F0]'
                  }`}
                  style={isToday ? { borderColor: challenge.color + '50' } : {}}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}
                    style={{
                      background: done ? '#10b981' : isToday ? challenge.color : '#E2E8F0',
                      color: done || isToday ? 'white' : '#94a3b8',
                    }}>
                    {done ? <Check className="w-3.5 h-3.5" /> : task.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-snug ${done ? 'text-emerald-700' : 'text-[#0A1A2F]'}`}>
                      {task.title}
                    </p>
                    <p className={`text-xs leading-relaxed mt-0.5 ${done ? 'text-emerald-600/70' : 'text-[#0A1A2F]/45'}`}>
                      {task.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Start CTA */}
      {!isStarted && (
        <div className="px-4 py-4 bg-white border-t border-[#E2E8F0] flex-shrink-0">
          <button onClick={() => onStart(challenge.id)}
            className="w-full py-3.5 rounded-2xl text-[#0A1A2F] font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #D9B878, #c9a227)' }}>
            <Star className="w-4 h-4" /> Start This Challenge
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Challenge card ───────────────────────────────────────────────────────────
function ChallengeCard({ challenge, localData, onOpen, index }) {
  const cData = localData[challenge.id] || null;
  const completedDays = cData?.completedDays || [];
  const isStarted = !!cData;
  const isDone = completedDays.length >= challenge.duration;
  const pct = (completedDays.length / challenge.duration) * 100;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      onClick={() => onOpen(challenge)}
      className="w-full bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#D9B878]/50 hover:shadow-sm transition-all text-left overflow-hidden group">

      {/* Accent top bar */}
      <div className={`h-1 bg-gradient-to-r ${challenge.gradient}`} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${challenge.gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
            {challenge.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1 mb-1">
              <p className="font-bold text-sm text-[#0A1A2F] leading-snug">{challenge.title}</p>
              <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 group-hover:text-[#0A1A2F]/40 flex-shrink-0 mt-0.5 transition-colors" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${CAT_PILL[challenge.category]}`}>
                {challenge.category}
              </span>
              <span className="text-[10px] text-[#0A1A2F]/35">{challenge.duration} days</span>
              {isStarted && !isDone && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                  <Flame className="w-3 h-3" />{completedDays.length} done
                </span>
              )}
              {isDone && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                  <Trophy className="w-3 h-3" /> Complete
                </span>
              )}
            </div>
            <p className="text-xs text-[#0A1A2F]/40 leading-snug line-clamp-1">{challenge.tagline}</p>
          </div>
        </div>

        {isStarted && (
          <div className="mt-3 pt-3 border-t border-[#F2F6FA]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#0A1A2F]/40">
                {isDone ? 'Completed!' : `Day ${completedDays.length + 1} of ${challenge.duration}`}
              </span>
              <span className="text-[10px] font-bold" style={{ color: challenge.color }}>{Math.round(pct)}%</span>
            </div>
            <div className="h-1.5 bg-[#F2F6FA] rounded-full overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${challenge.gradient} transition-all duration-500`}
                style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SelfCareChallengesPage() {
  const [localData, setLocalData] = useState(loadLocal);
  const [selectedId, setSelectedId] = useState(null);
  const [activeCat, setActiveCat]   = useState('All');

  const selected = selectedId ? CHALLENGES.find(c => c.id === selectedId) : null;

  const activeCount    = CHALLENGES.filter(c => localData[c.id] && (localData[c.id].completedDays || []).length < c.duration).length;
  const completedCount = CHALLENGES.filter(c => localData[c.id] && (localData[c.id].completedDays || []).length >= c.duration).length;

  const filtered = (activeCat === 'All' ? CHALLENGES : CHALLENGES.filter(c => c.category === activeCat))
    .sort((a, b) => {
      const aActive = localData[a.id] && (localData[a.id].completedDays || []).length < a.duration;
      const bActive = localData[b.id] && (localData[b.id].completedDays || []).length < b.duration;
      const aDone   = localData[a.id] && (localData[a.id].completedDays || []).length >= a.duration;
      const bDone   = localData[b.id] && (localData[b.id].completedDays || []).length >= b.duration;
      if (aActive && !bActive) return -1;
      if (bActive && !aActive) return 1;
      if (aDone && !bDone) return 1;
      if (bDone && !aDone) return -1;
      return 0;
    });

  const handleStart = (id) => {
    const updated = { ...localData, [id]: { startedAt: Date.now(), completedDays: [] } };
    setLocalData(updated);
    saveLocal(updated);
    toast.success('Challenge started! 💪');
  };

  const handleComplete = (id, dayNum) => {
    const existing = localData[id] || { startedAt: Date.now(), completedDays: [] };
    if ((existing.completedDays || []).includes(dayNum)) return;
    const completedDays = [...(existing.completedDays || []), dayNum];
    const updated = { ...localData, [id]: { ...existing, completedDays } };
    setLocalData(updated);
    saveLocal(updated);
    const challenge = CHALLENGES.find(c => c.id === id);
    if (completedDays.length >= (challenge?.duration || 0)) {
      toast.success('🏆 Challenge complete! You did it!');
    } else {
      toast.success(`Day ${dayNum} done! Keep going 🔥`);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F2F6FA] pb-28">

        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Link to={createPageUrl('PersonalGrowth')}
              className="w-9 h-9 rounded-full bg-[#F2F6FA] hover:bg-[#E8EFF6] flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F]" />
            </Link>
            <div className="flex-1">
              <h1 className="text-base font-bold text-[#0A1A2F]">Self-Care Challenges</h1>
              <p className="text-xs text-[#0A1A2F]/45">
                {activeCount > 0 ? `${activeCount} active` : 'Build healthy habits one day at a time'}
                {completedCount > 0 ? ` · ${completedCount} completed` : ''}
              </p>
            </div>
            <Flower2 className="w-5 h-5 text-[#D9B878]" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

          {/* Stats row */}
          {(activeCount > 0 || completedCount > 0) && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Active',     value: activeCount,                                  color: '#c9a227', Icon: Flame   },
                { label: 'Completed',  value: completedCount,                               color: '#10b981', Icon: Trophy  },
                { label: 'Remaining',  value: CHALLENGES.length - activeCount - completedCount, color: '#6366f1', Icon: Star    },
              ].map(({ label, value, color, Icon }) => (
                <div key={label} className="bg-white rounded-2xl border border-[#E2E8F0] p-3 text-center">
                  <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                  <p className="text-lg font-bold text-[#0A1A2F]">{value}</p>
                  <p className="text-[10px] text-[#0A1A2F]/40 font-semibold uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                  activeCat === cat
                    ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                    : 'bg-white text-[#0A1A2F]/50 border-[#E2E8F0] hover:border-[#0A1A2F]/20'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {filtered.map((challenge, i) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                localData={localData}
                onOpen={c => setSelectedId(c.id)}
                index={i}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Detail overlay — slide in from right */}
      <AnimatePresence>
        {selected && (
          <ChallengeDetail
            key={selected.id}
            challenge={selected}
            localData={localData}
            onClose={() => setSelectedId(null)}
            onStart={handleStart}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
