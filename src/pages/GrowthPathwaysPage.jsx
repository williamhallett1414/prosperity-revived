import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BookOpen, Brain,
  ArrowLeft, ChevronRight, CheckCircle2, Pencil, ExternalLink,
  Flame, Sparkles, Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

// ─── Pathway data ─────────────────────────────────────────────────────────────
const PATHWAYS = [
  {
    id: 'confidence',
    title: 'Confidence',
    subtitle: 'Stand firm in who God made you',
    emoji: '🎯',
    gradient: 'from-amber-600 to-yellow-400',
    category: 'Mind',
    steps: [
      { id: 1, label: 'Understand the Root', type: 'teaching', content: "True confidence doesn't come from talent, appearance, or approval from others. It comes from a settled identity — knowing you are deeply loved by God regardless of performance. Most confidence struggles trace back to believing a lie about your worth." },
      { id: 2, label: 'Scripture Foundation', type: 'scripture', verse: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.', context: "Paul wrote this from prison — not from a place of comfort. Confidence in Christ isn't circumstantial. It doesn't depend on things going well." },
      { id: 3, label: 'Honest Reflection', type: 'reflection', prompt: "Where does your lack of confidence actually come from? Is it a fear of failure, of judgment, of not being enough? Write it out honestly — naming it is the first step to dismantling it." },
      { id: 4, label: "This Week's Action", type: 'action', content: "Every morning this week, speak one Scripture-based truth about who you are out loud before you look at your phone. Use the Affirmations feature to get daily reminders.", linkPage: 'AffirmationsPage', linkLabel: 'Open Affirmations →' },
      { id: 5, label: 'Make It Stick', type: 'integration', content: "Confidence grows through repeated small acts of courage — doing the scary thing before you feel ready. Track one courageous act per day in your Habit Builder.", linkPage: 'HabitBuilderPage', linkLabel: 'Open Habit Builder →' },
    ],
  },
  {
    id: 'fear',
    title: 'Overcoming Fear',
    subtitle: 'Replace anxiety with anchored peace',
    emoji: '🛡️',
    gradient: 'from-sky-600 to-blue-400',
    category: 'Mind',
    steps: [
      { id: 1, label: 'Understand the Root', type: 'teaching', content: "Fear is not a character flaw — it's a signal. The problem isn't having fear; it's when fear becomes the thing making your decisions. God doesn't call you to be fearless. He calls you to act despite fear, anchored in His presence." },
      { id: 2, label: 'Scripture Foundation', type: 'scripture', verse: '2 Timothy 1:7', text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.', context: "The spirit of fear — the kind that paralyzes and controls — is not from God. Power, love, and soundness of mind are. You can identify fear's voice because it contradicts these." },
      { id: 3, label: 'Honest Reflection', type: 'reflection', prompt: "What decision are you avoiding because of fear right now? Write out the worst-case scenario — and then write what God's response to that scenario would be." },
      { id: 4, label: "This Week's Action", type: 'action', content: "Write your biggest fear and pray over it every day this week — literally surrendering it to God. Use the Prayer Wall to post it anonymously if it helps.", linkPage: 'Prayer', linkLabel: 'Open Prayer Wall →' },
      { id: 5, label: 'Make It Stick', type: 'integration', content: "Fear shrinks when you talk about it. Share what you're working through in community — not for sympathy, but for accountability.", linkPage: 'Community', linkLabel: 'Open Community →' },
    ],
  },
  {
    id: 'discipline',
    title: 'Discipline',
    subtitle: 'Build habits that outlast motivation',
    emoji: '⚡',
    gradient: 'from-violet-600 to-purple-400',
    category: 'Habits',
    steps: [
      { id: 1, label: 'Understand the Root', type: 'teaching', content: "Discipline isn't willpower. People who rely on willpower fail because willpower is a finite resource. Real discipline is about removing the need for willpower through environment design, identity, and systems. You don't rise to your goals — you fall to your systems." },
      { id: 2, label: 'Scripture Foundation', type: 'scripture', verse: '1 Corinthians 9:27', text: 'I discipline my body and keep it under control, lest after preaching to others I myself should be disqualified.', context: "Paul is describing intentional, active practice — not passive hoping. Discipline is something you do to yourself before life requires it of you." },
      { id: 3, label: 'Honest Reflection', type: 'reflection', prompt: "What one area of your life most needs structure right now? Why haven't you built that structure yet? Be honest — is it lack of knowledge, lack of accountability, or something else?" },
      { id: 4, label: "This Week's Action", type: 'action', content: "Pick one habit and commit to it for the next 7 days with zero exceptions. Not seven habits — one. Use the Habit Builder to track it daily.", linkPage: 'HabitBuilderPage', linkLabel: 'Open Habit Builder →' },
      { id: 5, label: 'Make It Stick', type: 'integration', content: "Join a community challenge to add accountability to your discipline. Knowing others are watching changes what you're willing to do.", linkPage: 'Community', linkLabel: 'Open Challenges →' },
    ],
  },
  {
    id: 'resilience',
    title: 'Emotional Resilience',
    subtitle: 'Feel deeply without being swept away',
    emoji: '🌊',
    gradient: 'from-emerald-600 to-teal-400',
    category: 'Emotions',
    steps: [
      { id: 1, label: 'Understand the Root', type: 'teaching', content: "Resilience is not emotional numbness — it's emotional agility. It's the difference between being tossed by waves and learning to swim in them. Resilient people feel everything. They just don't stay down." },
      { id: 2, label: 'Scripture Foundation', type: 'scripture', verse: 'James 1:2-4', text: 'Consider it pure joy whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.', context: "James doesn't say enjoy suffering. He says consider it joy — a deliberate reframe. The trial is not the problem. Your interpretation of the trial is where the power lies." },
      { id: 3, label: 'Honest Reflection', type: 'reflection', prompt: "Think of a time you didn't handle something well emotionally. Looking back — what were you actually feeling beneath the surface? What did you actually need in that moment?" },
      { id: 4, label: "This Week's Action", type: 'action', content: "Do an Emotional Check-In every day this week before you go to sleep. The goal isn't to fix everything — it's to build awareness of your inner life.", linkPage: 'EmotionalCheckInPage', linkLabel: 'Open Check-In →' },
      { id: 5, label: 'Make It Stick', type: 'integration', content: "Journal about one past challenge and exactly how you got through it. This creates an internal evidence base — proof you can draw on next time you face something hard.", linkPage: 'MyJournalEntries', linkLabel: 'Open Journal →' },
    ],
  },
  {
    id: 'faith_habits',
    title: 'Faith Habits',
    subtitle: 'Build the rhythms that sustain your spirit',
    emoji: '📖',
    gradient: 'from-[#c9a227] to-[#FAD98D]',
    category: 'Faith',
    steps: [
      { id: 1, label: 'Understand the Root', type: 'teaching', content: "Faith is not a feeling you wait for — it's a muscle you train. The great men and women of Scripture all had habits: Daniel prayed three times a day, David wrote psalms at night, Paul prayed without ceasing. Feeling close to God almost always follows practice, not the other way around." },
      { id: 2, label: 'Scripture Foundation', type: 'scripture', verse: 'Hebrews 10:25', text: 'Not giving up meeting together, as some are in the habit of doing, but encouraging one another — and all the more as you see the Day approaching.', context: "The early church met consistently — not because they always felt like it, but because they understood what community and rhythm do over time." },
      { id: 3, label: 'Honest Reflection', type: 'reflection', prompt: "What spiritual practice have you wanted to build but haven't? What has genuinely prevented you — and what would need to change about your environment, schedule, or mindset to make it happen?" },
      { id: 4, label: "This Week's Action", type: 'action', content: "Start with just 5 minutes of Bible reading at the same time each day. Use a reading plan to remove decision-making from the equation.", linkPage: 'Bible', linkLabel: 'Open Bible →' },
      { id: 5, label: 'Make It Stick', type: 'integration', content: "Track your daily prayer and Scripture habits side by side. Consistency compounds — even small deposits build a strong foundation over time.", linkPage: 'HabitBuilderPage', linkLabel: 'Open Habit Builder →' },
    ],
  },
  {
    id: 'identity',
    title: 'Identity in Christ',
    subtitle: 'Know who you are before the world tells you',
    emoji: '👑',
    gradient: 'from-rose-500 to-pink-400',
    category: 'Faith',
    steps: [
      { id: 1, label: 'Understand the Root', type: 'teaching', content: "Every destructive pattern — people-pleasing, addiction, self-sabotage, chronic comparison — traces back to a broken sense of identity. When you don't know who you are, you let everything around you tell you. Scripture gives you a fixed address: you are a child of God, chosen, loved, and called." },
      { id: 2, label: 'Scripture Foundation', type: 'scripture', verse: '1 John 3:1', text: 'See what great love the Father has lavished on us, that we should be called children of God! And that is what we are!', context: "John uses the word 'lavished' — extravagant, excessive, over-the-top. This is not a transactional love. It's a parental love that doesn't require you to earn it." },
      { id: 3, label: 'Honest Reflection', type: 'reflection', prompt: "What labels have other people put on you that you've believed? Write those things down and then write God's response to each one." },
      { id: 4, label: "This Week's Action", type: 'action', content: "Read through the 'Who I Am in Christ' declarations daily this week. Let truth interrupt the narrative running in your head.", linkPage: 'IdentityInChristPage', linkLabel: 'Open Identity in Christ →' },
      { id: 5, label: 'Make It Stick', type: 'integration', content: "Start an Affirmations practice — speaking truth over yourself daily until it becomes more natural than the lies.", linkPage: 'AffirmationsPage', linkLabel: 'Open Affirmations →' },
    ],
  },
  {
    id: 'purpose',
    title: 'Purpose & Calling',
    subtitle: 'Live for something larger than yourself',
    emoji: '🌟',
    gradient: 'from-orange-600 to-amber-400',
    category: 'Purpose',
    steps: [
      { id: 1, label: 'Understand the Root', type: 'teaching', content: "Purpose is not a destination you arrive at — it's a direction you walk in. Most people wait until they 'figure out their purpose' before they start living intentionally. But purpose is usually revealed through action, not contemplation. You find your calling by showing up." },
      { id: 2, label: 'Scripture Foundation', type: 'scripture', verse: 'Jeremiah 29:11', text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", context: "God spoke this to people in exile — people who felt completely off-track. Purpose doesn't require perfect circumstances. It only requires surrender." },
      { id: 3, label: 'Honest Reflection', type: 'reflection', prompt: "What problem in the world makes you angry or breaks your heart? What are you naturally good at that others often thank you for? Your purpose usually lives at the intersection of these two things." },
      { id: 4, label: "This Week's Action", type: 'action', content: "Write a one-paragraph life purpose statement this week. Don't wait until it's perfect. Write a draft. Purpose becomes clearer when you write it down.", linkPage: 'MyJournalEntries', linkLabel: 'Open Journal →' },
      { id: 5, label: 'Make It Stick', type: 'integration', content: "Join a growth or accountability group where you can share what you're building toward and have people hold you to it.", linkPage: 'Groups', linkLabel: 'Open Groups →' },
    ],
  },
  {
    id: 'relationships',
    title: 'Healthy Relationships',
    subtitle: 'Love others from a place of wholeness',
    emoji: '🤝',
    gradient: 'from-fuchsia-600 to-pink-400',
    category: 'Relationships',
    steps: [
      { id: 1, label: 'Understand the Root', type: 'teaching', content: "Most relational dysfunction is not really about the other person. It's about unhealed wounds showing up in present relationships. Healthy relating starts with self-awareness — knowing your triggers, your attachment patterns, and your non-negotiables." },
      { id: 2, label: 'Scripture Foundation', type: 'scripture', verse: 'Romans 12:18', text: 'If it is possible, as far as it depends on you, live at peace with everyone.', context: "'As far as it depends on you' — Paul acknowledges you can't control others. You are responsible for your half. Start there." },
      { id: 3, label: 'Honest Reflection', type: 'reflection', prompt: "What is one relationship in your life that needs repair or intentionality? What is one thing you could do differently that's within your control?" },
      { id: 4, label: "This Week's Action", type: 'action', content: "Do a Mindset Reset focused on a specific relationship you've been struggling with. Let the practice shift your perspective before you act.", linkPage: 'MindsetResetPage', linkLabel: 'Open Mindset Reset →' },
      { id: 5, label: 'Make It Stick', type: 'integration', content: "Connect with your friends list and intentionally reach out to someone you've been meaning to check on.", linkPage: 'Friends', linkLabel: 'Open Friends →' },
    ],
  },
];

const CATEGORIES = ['All', 'Faith', 'Mind', 'Emotions', 'Habits', 'Purpose', 'Relationships'];

const STEP_CONFIG = {
  teaching:    { icon: Brain,        color: 'text-purple-500',  bg: 'bg-purple-50',   label: 'Teaching'    },
  scripture:   { icon: BookOpen,     color: 'text-amber-600',   bg: 'bg-amber-50',    label: 'Scripture'   },
  reflection:  { icon: Pencil,       color: 'text-sky-500',     bg: 'bg-sky-50',      label: 'Reflection'  },
  action:      { icon: Zap,          color: 'text-orange-500',  bg: 'bg-orange-50',   label: 'Action Step' },
  integration: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50',  label: 'Make It Stick'},
};

const STORAGE_KEY = 'growth_pathway_progress_v2';
const ACTIVE_KEY  = 'growth_active_pathway_v2';
const QUIZ_KEY    = 'growth_quiz_done_v1';

function loadProgress()  { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; } }
function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

// ─── Assessment quiz ──────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: "What's weighing heaviest on you right now?",
    options: [
      { label: "I doubt myself or feel like I'm not enough", scores: { confidence: 3, identity: 2 } },
      { label: "Anxiety or fear is affecting my decisions",   scores: { fear: 3, resilience: 1 } },
      { label: "I keep starting things but can't follow through", scores: { discipline: 3, purpose: 1 } },
      { label: "My emotions feel overwhelming or out of control", scores: { resilience: 3, fear: 1 } },
    ],
  },
  {
    q: "What would you most like to strengthen?",
    options: [
      { label: "My relationship with God — more consistent, more real", scores: { faith_habits: 3, identity: 1 } },
      { label: "How I see myself — my worth and who I actually am",      scores: { identity: 3, confidence: 1 } },
      { label: "My ability to handle hard things and bounce back",        scores: { resilience: 3, fear: 1 } },
      { label: "My sense of direction — what I'm here for",              scores: { purpose: 3, identity: 1 } },
    ],
  },
  {
    q: "What would feel like a real win in 30 days?",
    options: [
      { label: "Feeling more at peace, less anxious",          scores: { fear: 2, resilience: 2 } },
      { label: "Having daily spiritual habits I actually keep", scores: { faith_habits: 3, discipline: 1 } },
      { label: "Showing up boldly and not holding back",        scores: { confidence: 3, identity: 1 } },
      { label: "Clarity on who I am and what I'm called to do", scores: { purpose: 2, identity: 2 } },
    ],
  },
];

function getRecommendation(answers) {
  const totals = {};
  answers.forEach(optionIdx => {
    // answers is array of selected option indices per question
  });
  return null;
}

function AssessmentQuiz({ onComplete, onSkip }) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen]   = useState(null);

  const question = QUESTIONS[step];
  const isLast   = step === QUESTIONS.length - 1;

  const handleNext = () => {
    if (chosen === null) return;
    const newAnswers = [...answers, chosen];
    if (isLast) {
      // Score it
      const totals = {};
      newAnswers.forEach((optIdx, qIdx) => {
        const scores = QUESTIONS[qIdx].options[optIdx].scores;
        Object.entries(scores).forEach(([id, pts]) => {
          totals[id] = (totals[id] || 0) + pts;
        });
      });
      const topId = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
      const recommended = PATHWAYS.find(p => p.id === topId) || PATHWAYS[0];
      onComplete(recommended);
    } else {
      setAnswers(newAnswers);
      setChosen(null);
      setStep(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-white/5 border-b border-[#F2F6FA] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#c9a227]" />
            <span className="font-bold text-[#0A1A2F] dark:text-white text-sm">Find Your Pathway</span>
          </div>
          <button onClick={onSkip} className="text-xs text-[#0A1A2F]/40 dark:text-white/40 hover:text-[#0A1A2F]/60 dark:text-white/60 transition-colors">
            Skip →
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-300 ${
              i === step ? 'w-6 h-2 bg-[#c9a227]' : i < step ? 'w-2 h-2 bg-[#FAD98D]' : 'w-2 h-2 bg-[#F2F6FA] dark:bg-[#0A1A2F]'
            }`} />
          ))}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white mb-6 leading-snug">{question.q}</h2>

            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setChosen(i)}
                  className={`w-full text-left px-4 py-4 rounded-2xl border-2 text-sm font-medium transition-all leading-snug ${
                    chosen === i
                      ? 'border-[#c9a227] bg-white dark:bg-white/5 text-[#0A1A2F] dark:text-white dark:text-white'
                      : 'border-[#F2F6FA] bg-white dark:bg-white/5 text-[#0A1A2F]/70 dark:text-white/70 hover:border-[#FAD98D]/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      chosen === i ? 'border-[#c9a227] bg-[#c9a227]' : 'border-[#F2F6FA]'
                    }`}>
                      {chosen === i && <div className="w-2 h-2 bg-white dark:bg-white/5 rounded-full" />}
                    </div>
                    {opt.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-auto pt-8">
          <button onClick={handleNext} disabled={chosen === null}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white font-bold text-sm disabled:opacity-30 hover:opacity-90 transition-opacity">
            {isLast ? 'Find My Pathway →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Recommendation screen ────────────────────────────────────────────────────
function RecommendationScreen({ pathway, onStart, onBrowse }) {
  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center px-4 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
          className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${pathway.gradient} flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg`}
        >
          {pathway.emoji}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <p className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-2">Recommended for You</p>
          <h2 className="text-2xl font-bold text-[#0A1A2F] dark:text-white mb-2">{pathway.title}</h2>
          <p className="text-[#0A1A2F]/55 dark:text-white/55 text-sm mb-1 leading-relaxed">{pathway.subtitle}</p>
          <p className="text-xs text-[#0A1A2F]/35 dark:text-white/35 mb-8">{pathway.steps.length} steps · {pathway.category}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
          <button onClick={onStart}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r ${pathway.gradient} text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md`}>
            Start This Pathway →
          </button>
          <button onClick={onBrowse}
            className="w-full py-3 rounded-2xl border border-[#F2F6FA] bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 font-semibold text-sm hover:bg-[#F2F6FA] dark:bg-[#0A1A2F] transition-colors">
            Browse All Pathways
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Completion celebration ───────────────────────────────────────────────────
function CompletionModal({ pathway, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="w-full max-w-xs"
        onClick={e => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-br ${pathway.gradient} rounded-3xl p-8 text-white text-center shadow-2xl`}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}
            transition={{ delay: 0.15, duration: 0.6, times: [0, 0.65, 1] }}
            className="text-6xl mb-3"
          >🏆</motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Pathway Complete</p>
            <h2 className="font-bold text-xl mb-2">{pathway.title}</h2>
            <p className="text-white/75 text-sm mb-6 leading-relaxed">
              You worked through every step. That's not nothing — that's growth.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="flex justify-center gap-3 mb-5">
            {[
              { value: pathway.steps.length, label: 'steps' },
              { value: pathway.category, label: 'focus area' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/20 rounded-2xl px-5 py-3">
                <p className="font-bold text-lg">{value}</p>
                <p className="text-white/60 text-[10px]">{label}</p>
              </div>
            ))}
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-white/25 hover:bg-white/35 transition-colors font-bold text-sm"
          >
            Keep Growing 🌱
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Step row ─────────────────────────────────────────────────────────────────
function StepRow({ step, pathwayId, completedIds, isLocked, onToggle, reflection, onReflectionChange, onSaveReflection }) {
  const navigate  = useNavigate();
  const conf      = STEP_CONFIG[step.type];
  const Icon      = conf.icon;
  const isDone    = completedIds.includes(step.id);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (isLocked) { toast('Complete the previous step first', { icon: '🔒' }); return; }
    setOpen(o => !o);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: step.id * 0.06 }}
      className={`rounded-2xl border overflow-hidden transition-all ${
        isLocked ? 'border-[#F2F6FA] bg-[#F2F6FA] dark:bg-[#0A1A2F] opacity-60' :
        isDone   ? 'border-emerald-200 bg-emerald-50/40' : 'border-[#F2F6FA] bg-white dark:bg-white/5'
      }`}
    >
      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={handleOpen}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isLocked ? 'bg-[#F2F6FA] dark:bg-[#0A1A2F]' : isDone ? 'bg-emerald-500' : conf.bg
        }`}>
          {isLocked
            ? <Lock className="w-3.5 h-3.5 text-[#0A1A2F]/25 dark:text-white/25" />
            : isDone
            ? <CheckCircle2 className="w-4 h-4 text-white" />
            : <Icon className={`w-4 h-4 ${conf.color}`} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${
            isLocked ? 'text-[#0A1A2F]/20 dark:text-white/20' : isDone ? 'text-emerald-500' : 'text-[#0A1A2F]/35 dark:text-white/35'
          }`}>
            Step {step.id} · {conf.label}
          </p>
          <p className={`text-sm font-bold leading-snug ${
            isLocked ? 'text-[#0A1A2F]/30 dark:text-white/30' : isDone ? 'text-[#0A1A2F]/50 dark:text-white/50 line-through' : 'text-[#0A1A2F] dark:text-white dark:text-white'
          }`}>
            {step.label}
          </p>
        </div>
        {!isLocked && (
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 dark:text-white/20 flex-shrink-0" />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {open && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 space-y-3 border-t border-[#F2F6FA]">

              {step.type === 'teaching' && (
                <p className="text-sm text-[#0A1A2F]/70 dark:text-white/70 leading-relaxed">{step.content}</p>
              )}

              {step.type === 'scripture' && (
                <div className="space-y-3">
                  <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-[#FAD98D]/20">
                    <p className="text-xs font-bold text-[#c9a227] mb-1.5">{step.verse}</p>
                    <p className="text-sm text-[#0A1A2F] dark:text-white italic leading-relaxed font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                      "{step.text}"
                    </p>
                  </div>
                  <p className="text-xs text-[#0A1A2F]/55 dark:text-white/55 leading-relaxed">{step.context}</p>
                  <button onClick={() => {
                    const match = step.verse.match(/^(\d*\s*\w+(?:\s+\w+)?)\s+(\d+):(\d+)/);
                    if (match) {
                      const book = match[1].trim();
                      const chapter = match[2];
                      navigate(createPageUrl(`Bible?book=${encodeURIComponent(book)}&chapter=${chapter}`));
                    }
                  }}
                    className="flex items-center gap-2 text-xs font-bold text-[#c9a227] hover:text-[#FAD98D] transition-colors px-3 py-2 rounded-lg hover:bg-[#FAD98D]/10">
                    Read more →
                  </button>
                </div>
              )}

              {step.type === 'reflection' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#0A1A2F]/55 dark:text-white/55 italic leading-relaxed">"{step.prompt}"</p>
                  <textarea
                    maxLength={1000}
                    value={reflection}
                    onChange={e => onReflectionChange(e.target.value)}
                    placeholder="Write your reflection here…"
                    rows={4}
                    className="w-full resize-none text-sm px-3 py-3 rounded-xl border border-[#F2F6FA] bg-white dark:bg-white/5 text-[#0A1A2F] dark:text-white placeholder-[#0A1A2F]/25 focus:outline-none focus:border-[#FAD98D]/60 leading-relaxed"
                  />
                  {reflection?.trim() && (
                    <button onClick={onSaveReflection} className="text-xs font-bold text-[#c9a227] hover:text-[#C9A227] transition-colors">
                      Save reflection →
                    </button>
                  )}
                </div>
              )}

              {(step.type === 'action' || step.type === 'integration') && (
                <div className="space-y-3">
                  <p className="text-sm text-[#0A1A2F]/70 dark:text-white/70 leading-relaxed">{step.content}</p>
                  {step.linkPage && (
                    <button onClick={() => navigate(createPageUrl(step.linkPage))}
                      className="flex items-center gap-2 text-xs font-bold text-[#0A1A2F] dark:text-white bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-white dark:bg-white/5 transition-colors px-3 py-2.5 rounded-xl w-full">
                      <ExternalLink className="w-3.5 h-3.5 text-[#c9a227] flex-shrink-0" />
                      {step.linkLabel}
                    </button>
                  )}
                </div>
              )}

              <button onClick={() => onToggle(step.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isDone
                    ? 'bg-[#F2F6FA] dark:bg-[#0A1A2F] text-[#0A1A2F]/40 dark:text-white/40 hover:bg-red-50 hover:text-red-400'
                    : 'bg-gradient-to-r from-[#FAD98D] to-[#c9a227] text-[#0A1A2F] dark:text-white hover:opacity-90'
                }`}>
                {isDone ? 'Mark incomplete' : 'Mark complete ✓'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Detail view ──────────────────────────────────────────────────────────────
function PathwayDetail({ pathway, onBack }) {
  const [progress, setProgress]     = useState(loadProgress);
  const [activeId, setActiveId]     = useState(() => localStorage.getItem(ACTIVE_KEY));
  const [celebrating, setCelebrating] = useState(false);
  const [reflections, setReflections] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`reflections_${pathway.id}`) || '{}'); } catch { return {}; }
  });

  const completedIds = progress[pathway.id] || [];
  const totalSteps   = pathway.steps.length;
  const pct          = Math.round((completedIds.length / totalSteps) * 100);
  const isActive     = activeId === pathway.id;
  const isComplete   = completedIds.length >= totalSteps;

  const toggleStep = (stepId) => {
    const current  = progress[pathway.id] || [];
    const wasEmpty = !current.includes(stepId);
    const next     = wasEmpty ? [...current, stepId] : current.filter(s => s !== stepId);
    const updated  = { ...progress, [pathway.id]: next };
    setProgress(updated);
    saveProgress(updated);

    const justFinished = wasEmpty && next.length >= totalSteps;
    if (justFinished) {
      setCelebrating(true);
    } else if (wasEmpty) {
      toast.success('Step complete ✓');
    }
  };

  const setAsActive = () => {
    localStorage.setItem(ACTIVE_KEY, pathway.id);
    setActiveId(pathway.id);
    toast.success(`"${pathway.title}" set as your focus pathway`);
  };

  const saveReflection = (stepId) => {
    const updated = { ...reflections };
    localStorage.setItem(`reflections_${pathway.id}`, JSON.stringify(updated));
    toast.success('Reflection saved');
  };

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#F2F6FA] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-white dark:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white leading-tight">{pathway.title}</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">{completedIds.length}/{totalSteps} steps complete</p>
          </div>
          {pct > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 h-1.5 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${pathway.gradient} rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[10px] font-bold text-[#c9a227]">{pct}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${pathway.gradient} rounded-3xl p-6 text-white shadow-lg`}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-5xl">{pathway.emoji}</span>
            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${isActive ? 'bg-white/30' : 'bg-white/15'}`}>
              {isActive ? '⚡ Your Focus' : pathway.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">{pathway.title}</h2>
          <p className="text-white/70 text-sm mb-4">{pathway.subtitle}</p>
          {isComplete ? (
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="font-bold text-sm">🏆 Pathway Complete!</p>
              <p className="text-white/70 text-xs mt-0.5">You've finished all {totalSteps} steps</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/60">Progress</span>
                <span className="font-bold">{completedIds.length}/{totalSteps} steps</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-white/80 rounded-full" />
              </div>
            </div>
          )}
        </motion.div>

        {/* Focus button */}
        {!isActive && !isComplete && (
          <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onClick={setAsActive}
            className="w-full flex items-center gap-3 bg-white dark:bg-white/5 border border-[#FAD98D]/30 rounded-2xl p-4 hover:border-[#c9a227] hover:bg-white dark:bg-white/5 transition-all text-left">
            <div className="w-9 h-9 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
              <Flame className="w-4 h-4 text-[#c9a227]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#0A1A2F] dark:text-white dark:text-white">Make this my focus</p>
              <p className="text-xs text-[#0A1A2F]/40 dark:text-white/40">Pin this pathway as your current area of growth</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25" />
          </motion.button>
        )}

        {/* Steps — sequential unlock */}
        <div>
          <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">Your Steps</p>
          <div className="space-y-2">
            {pathway.steps.map((step) => {
              const isLocked = step.id > 1 && !completedIds.includes(step.id - 1);
              return (
                <StepRow
                  key={step.id}
                  step={step}
                  pathwayId={pathway.id}
                  completedIds={completedIds}
                  isLocked={isLocked}
                  onToggle={toggleStep}
                  reflection={reflections[step.id] || ''}
                  onReflectionChange={(v) => setReflections(r => ({ ...r, [step.id]: v }))}
                  onSaveReflection={() => saveReflection(step.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion celebration */}
      <AnimatePresence>
        {celebrating && (
          <CompletionModal pathway={pathway} onClose={() => setCelebrating(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Pathway card (list) ──────────────────────────────────────────────────────
function PathwayCard({ pathway, progress, activeId, index, onClick }) {
  const completed = (progress[pathway.id] || []).length;
  const total     = pathway.steps.length;
  const pct       = Math.round((completed / total) * 100);
  const isActive  = activeId === pathway.id;
  const isDone    = completed >= total;

  // Next unlocked step label for the pull text
  const nextStep = !isDone && pathway.steps.find(s => !((progress[pathway.id] || []).includes(s.id)));
  const nextStepConf = nextStep ? STEP_CONFIG[nextStep.type] : null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`w-full text-left bg-white dark:bg-white/5 rounded-2xl border overflow-hidden hover:shadow-md transition-all group ${
        isActive ? 'border-[#c9a227] shadow-sm' : isDone ? 'border-emerald-200' : 'border-[#F2F6FA] hover:border-[#FAD98D]/50'
      }`}
    >
      <div className={`h-1 bg-gradient-to-r ${pathway.gradient}`} />
      <div className="p-4 flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pathway.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
          <span className="text-2xl">{pathway.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-sm text-[#0A1A2F] dark:text-white truncate">{pathway.title}</h3>
            {isActive && <span className="text-[9px] font-bold bg-white dark:bg-white/5 text-[#c9a227] border border-[#FAD98D]/30 px-1.5 py-0.5 rounded-full flex-shrink-0">Focus</span>}
            {isDone  && <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full flex-shrink-0">Done ✓</span>}
          </div>
          <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 truncate mb-2">{pathway.subtitle}</p>

          {completed > 0 && !isDone ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${pathway.gradient}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35">{completed}/{total}</span>
              </div>
              {nextStep && nextStepConf && (
                <p className="text-[10px] text-[#c9a227] font-semibold">
                  Next: {nextStep.label} →
                </p>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30">{total} steps · {pathway.category}</span>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-[#0A1A2F]/20 dark:text-white/20 flex-shrink-0 group-hover:text-[#0A1A2F]/40 dark:text-white/40 transition-colors" />
      </div>
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GrowthPathwaysPage() {
  const [view,      setView]      = useState('loading'); // loading | quiz | recommendation | list | detail
  const [selected,  setSelected]  = useState(null);
  const [recommended, setRecommended] = useState(null);
  const [category,  setCategory]  = useState('All');
  const [progress,  setProgress]  = useState(loadProgress);
  const [activeId,  setActiveId]  = useState(() => localStorage.getItem(ACTIVE_KEY));

  useEffect(() => {
    const quizDone   = localStorage.getItem(QUIZ_KEY);
    const hasProgress = Object.values(loadProgress()).some(arr => arr.length > 0);
    // Skip quiz if they've already used the app
    if (quizDone || hasProgress) {
      setView('list');
    } else {
      setView('quiz');
    }
  }, []);

  const handleQuizComplete = (pathway) => {
    localStorage.setItem(QUIZ_KEY, '1');
    setRecommended(pathway);
    setView('recommendation');
  };

  const handleSkipQuiz = () => {
    localStorage.setItem(QUIZ_KEY, '1');
    setView('list');
  };

  const handleStartRecommended = () => {
    localStorage.setItem(ACTIVE_KEY, recommended.id);
    setActiveId(recommended.id);
    setSelected(recommended);
    setView('detail');
  };

  const handleBack = () => {
    setSelected(null);
    setProgress(loadProgress());
    setActiveId(localStorage.getItem(ACTIVE_KEY));
    setView('list');
  };

  if (view === 'loading') return null;
  if (view === 'quiz') return <AssessmentQuiz onComplete={handleQuizComplete} onSkip={handleSkipQuiz} />;
  if (view === 'recommendation') return (
    <RecommendationScreen
      pathway={recommended}
      onStart={handleStartRecommended}
      onBrowse={() => setView('list')}
    />
  );
  if (view === 'detail' && selected) return <PathwayDetail pathway={selected} onBack={handleBack} />;

  // List view
  const filtered      = category === 'All' ? PATHWAYS : PATHWAYS.filter(p => p.category === category);
  const activePathway = PATHWAYS.find(p => p.id === activeId);
  const totalDone     = PATHWAYS.filter(p => (progress[p.id] || []).length >= p.steps.length).length;
  const totalSteps    = PATHWAYS.reduce((acc, p) => acc + (progress[p.id] || []).length, 0);

  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#F2F6FA] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to={createPageUrl('PersonalGrowth')}
            className="w-9 h-9 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-white dark:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Growth Pathways</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">{totalSteps} steps completed · {totalDone} pathways done</p>
          </div>
          {/* Retake quiz */}
          <button onClick={() => { localStorage.removeItem(QUIZ_KEY); setView('quiz'); }}
            className="text-xs text-[#0A1A2F]/35 dark:text-white/35 hover:text-[#c9a227] transition-colors font-medium">
            Retake quiz
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

        {/* Active pathway spotlight */}
        {activePathway && (progress[activePathway.id] || []).length < activePathway.steps.length && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-2">Your Current Focus</p>
            <button onClick={() => { setSelected(activePathway); setView('detail'); }}
              className={`w-full text-left bg-gradient-to-br ${activePathway.gradient} rounded-2xl p-5 text-white hover:opacity-95 transition-opacity shadow-md`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{activePathway.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base">{activePathway.title}</p>
                  <p className="text-white/65 text-xs">{activePathway.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0" />
              </div>
              {(() => {
                const done  = (progress[activePathway.id] || []).length;
                const total = activePathway.steps.length;
                const pct   = Math.round((done / total) * 100);
                const nextStep = activePathway.steps.find(s => !(progress[activePathway.id] || []).includes(s.id));
                return (
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/60">{nextStep ? `Next: ${nextStep.label}` : 'Almost done!'}</span>
                      <span className="font-bold">{done}/{total}</span>
                    </div>
                    <div className="h-1.5 bg-white/25 rounded-full overflow-hidden">
                      <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })()}
            </button>
          </motion.div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 scrollbar-none pb-0.5">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-[#0A1A2F] text-white border-[#0A1A2F]'
                  : 'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA] hover:border-[#FAD98D]/40'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Pathway list */}
        <div className="space-y-3">
          {filtered.map((pathway, i) => (
            <PathwayCard
              key={pathway.id}
              pathway={pathway}
              progress={progress}
              activeId={activeId}
              index={i}
              onClick={() => { setSelected(pathway); setView('detail'); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}