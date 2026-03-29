import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  X, ChevronRight, ChevronLeft, Sparkles,
  Home, Heart, BookOpen, Users, User, Brain, MessageCircle,
  Zap
} from 'lucide-react';

// ── Feature data ─────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'intro',
    navTarget: null,
    title: null, // dynamically filled with user name
    subtitle: "Prosperity Revived is your all-in-one coach for body, mind, and spirit. Here's a quick tour of everything that's waiting for you.",
    accent: '#FAD98D',
    icon: Sparkles,
    isIntro: true,
  },
  {
    id: 'home',
    navTarget: 'nav-home',
    title: 'Home — Your Daily HQ',
    subtitle: 'Everything important in one glance, every morning.',
    accent: '#FAD98D',
    icon: Home,
    features: [
      { icon: '☀️', title: 'Start My Day',       desc: 'Morning ritual: scripture, intentions, mood check-in' },
      { icon: '🌙', title: 'End My Day',          desc: 'Evening wind-down: gratitude, reflection, tomorrow prep' },
      { icon: '📊', title: 'Live Progress Ring',  desc: "See today's habits, workouts & meals at a glance" },
      { icon: '🤖', title: 'AI Guides Nudge You', desc: 'Hannah, Gideon, Coach David & Chef Daniel check in proactively' },
      { icon: '📖', title: 'Today's Scripture',    desc: "Personalized scripture based on what you're going through" },
    ],
  },
  {
    id: 'wellness',
    navTarget: 'nav-wellness',
    title: 'Wellness — Body & Mind Hub',
    subtitle: 'Your fitness, nutrition, and mental health in one place.',
    accent: '#38BDF8',
    icon: Heart,
    features: [
      { icon: '🏋️', title: 'Workouts',           desc: '33+ guided workouts across 6 categories — HIIT, strength, flexibility, yoga & more' },
      { icon: '📈', title: 'Workout Trends',      desc: 'Track streaks, session frequency, and exercise PRs over time' },
      { icon: '🍽️', title: 'Nutrition Tracking',  desc: 'Log meals, track macros, discover recipes built for your goals' },
      { icon: '💧', title: 'Water Tracker',       desc: 'Daily hydration goal with glass-by-glass logging' },
      { icon: '🏅', title: 'Challenges',          desc: 'Join 30-day wellness challenges with community leaderboards' },
      { icon: '👨‍🏫', title: 'Coaching Programs',  desc: '8-week transformation plans with daily guided sessions' },
    ],
  },
  {
    id: 'bible',
    navTarget: 'nav-bible',
    title: 'Bible — Your Study Companion',
    subtitle: 'More than reading — a full study environment.',
    accent: '#C9A227',
    icon: BookOpen,
    features: [
      { icon: '📖', title: 'Full Bible Reader',   desc: 'All 66 books, multiple translations, highlight & bookmark verses' },
      { icon: '🙏', title: 'Chat with Gideon',    desc: 'AI spiritual guide for questions, prayer, devotionals & study' },
      { icon: '📝', title: 'Study Guides',        desc: 'Topical guides on anxiety, purpose, relationships, faith & more' },
      { icon: '✨', title: 'Devotionals',          desc: 'Daily 2–3 min devotionals or deep 30-min studies — your choice' },
      { icon: '📌', title: 'Bookmarks & Notes',   desc: 'Save verses, write reflections, build your own study library' },
      { icon: '🔍', title: 'Scripture Search',    desc: 'Search by topic, keyword, or feeling — not just chapter:verse' },
    ],
  },
  {
    id: 'growth',
    navTarget: null,
    title: 'Personal Growth — Level Up Inside',
    subtitle: 'Tools to build the person God designed you to be.',
    accent: '#AFC7E3',
    icon: Brain,
    features: [
      { icon: '😊', title: 'Emotional Check-In',  desc: 'Daily mood tracking with pattern insights over weeks & months' },
      { icon: '✅', title: 'Habit Builder',        desc: 'Build habits with streaks, reminders, and visual progress' },
      { icon: '🙏', title: 'Gratitude Journal',   desc: 'Daily gratitude prompts with AI reflection questions' },
      { icon: '🪞', title: 'Identity in Christ',  desc: 'Scripture-based affirmations for your identity and purpose' },
      { icon: '🧘', title: 'Guided Meditations',  desc: 'Christian mindfulness sessions for anxiety, sleep & focus' },
      { icon: '💬', title: 'Chat with Hannah',    desc: 'Personal growth AI coach — journal, process emotions, grow' },
    ],
  },
  {
    id: 'community',
    navTarget: 'nav-community',
    title: 'Community — Grow Together',
    subtitle: "You're not on this journey alone.",
    accent: '#8B5CF6',
    icon: Users,
    features: [
      { icon: '👥', title: 'Groups',              desc: 'Join Bible study, workout, or prayer groups that match your goals' },
      { icon: '🏆', title: 'Leaderboards',        desc: "Friendly accountability — see who's crushing their goals this week" },
      { icon: '📣', title: 'Community Feed',      desc: 'Share wins, ask for prayer, post workouts & encourage others' },
      { icon: '🤝', title: 'Friends',             desc: 'Connect with friends, share progress, celebrate milestones together' },
      { icon: '📆', title: 'Group Plans',         desc: 'Follow the same coaching plan as your group, discuss daily lessons' },
    ],
  },
  {
    id: 'profile',
    navTarget: 'nav-profile',
    title: 'Profile — Your Journey Dashboard',
    subtitle: "See how far you've come.",
    accent: '#FD9C2D',
    icon: User,
    features: [
      { icon: '📊', title: 'Progress Dashboard',  desc: 'Holistic view: workouts, mood, habits, scripture all in one report' },
      { icon: '🏅', title: 'Achievements',        desc: 'Earn badges as you hit milestones — streaks, goals, and challenges' },
      { icon: '📓', title: 'My Journal',          desc: 'All your entries, reflections, and gratitude notes in one place' },
      { icon: '⚙️', title: 'Customize',           desc: 'Adjust reminders, coaching preferences, notification timing' },
    ],
  },
  {
    id: 'bots',
    navTarget: null,
    title: 'Your 4 AI Coaches',
    subtitle: 'Each one specializes in a different part of your journey.',
    accent: '#FAD98D',
    icon: MessageCircle,
    bots: [
      { initial: 'H', name: 'Hannah',      role: 'Personal Growth', desc: 'Emotions, journaling, identity, habits', grad: 'from-[#AFC7E3] to-[#3C4E53]', page: 'ChatScreen?bot=Hannah' },
      { initial: 'G', name: 'Gideon',      role: 'Spiritual Guide', desc: 'Bible, prayer, scripture, devotionals',  grad: 'from-[#C9A227] to-[#0A1A2F]', page: 'ChatScreen?bot=Gideon' },
      { initial: 'D', name: 'Coach David', role: 'Fitness Coach',   desc: 'Workouts, form, accountability',         grad: 'from-[#38BDF8] to-[#0A1A2F]', page: 'ChatScreen?bot=CoachDavid' },
      { initial: 'C', name: 'Chef Daniel', role: 'Nutrition Expert',desc: 'Meals, recipes, macros, meal prep',      grad: 'from-[#FD9C2D] to-[#C9A227]', page: 'ChatScreen?bot=ChefDaniel' },
    ],
  },
  {
    id: 'done',
    navTarget: null,
    title: "That's everything. Let's go. 🚀",
    subtitle: 'Your personalized plan is ready. Every feature is built around what you told us during setup.',
    accent: '#FD9C2D',
    icon: Zap,
    isDone: true,
  },
];

// ── Spotlight overlay ─────────────────────────────────────────────────────────
function Spotlight({ targetId }) {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!targetId) { setRect(null); return; }
    const measure = () => {
      const el = document.getElementById(targetId);
      if (el) setRect(el.getBoundingClientRect());
    };
    measure();
    const t = setTimeout(measure, 150);
    return () => clearTimeout(t);
  }, [targetId]);
  if (!rect) return null;
  const pad = 8;
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 51 }}>
      <defs>
        <mask id="spotlight-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect x={rect.left - pad} y={rect.top - pad}
            width={rect.width + pad * 2} height={rect.height + pad * 2}
            rx="14" fill="black" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask="url(#spotlight-mask)" />
      <rect x={rect.left - pad} y={rect.top - pad}
        width={rect.width + pad * 2} height={rect.height + pad * 2}
        rx="14" fill="none" stroke="#FAD98D" strokeWidth="2.5"
        style={{ animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
    </svg>
  );
}

function FeatureCard({ icon, title, desc, index, accent }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="flex items-start gap-3 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: accent + '20' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#0A1A2F] text-sm leading-tight">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function BotCard({ bot, index }) {
  return (
    <motion.button initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07 }}
      onPointerDown={() => { window.location.href = createPageUrl(bot.page); }}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${bot.grad} text-white text-left active:scale-95 transition-transform`}>
      <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-black text-lg flex-shrink-0">
        {bot.initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-black text-sm">{bot.name}</p>
          <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5 font-semibold">{bot.role}</span>
        </div>
        <p className="text-white/75 text-xs mt-0.5">{bot.desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/50 flex-shrink-0" />
    </motion.button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function AppTour({ onComplete, userName }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const total = SECTIONS.length;
  const sec = SECTIONS[step];
  const Icon = sec.icon;

  const goNext = () => {
    if (step < total - 1) { setDir(1); setStep(s => s + 1); }
    else finish();
  };
  const goPrev = () => {
    if (step > 0) { setDir(-1); setStep(s => s - 1); }
  };
  const finish = async () => {
    try { await base44.auth.updateMe({ app_tour_completed: true }); } catch {}
    onComplete();
  };

  const displayTitle = sec.isIntro
    ? (userName ? `Welcome, ${userName}! Here's what you've unlocked. 🎉` : "You're in. Here's what you've unlocked. 🎉")
    : sec.title;

  return (
    <>
      {sec.navTarget && <Spotlight targetId={sec.navTarget} />}
      {!sec.navTarget && <div className="fixed inset-0 bg-black/65" style={{ zIndex: 51 }} />}

      <div className="fixed inset-x-0 bottom-0 z-[52] px-3"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <motion.div key={step}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-[#F2F6FA] rounded-3xl overflow-hidden shadow-2xl max-w-lg mx-auto flex flex-col"
          style={{ maxHeight: '80vh' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
            <div className="flex gap-1 flex-wrap">
              {SECTIONS.map((_, i) => (
                <motion.div key={i} animate={{ width: i === step ? 20 : 5 }} transition={{ duration: 0.3 }}
                  className="h-1 rounded-full flex-shrink-0"
                  style={{ background: i <= step ? sec.accent : '#D1D5DB' }} />
              ))}
            </div>
            <button onPointerDown={finish}
              className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0 ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 pb-2 min-h-0">
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, x: dir * 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -20 }} transition={{ duration: 0.2 }}>

                {/* Icon + title */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: sec.accent + '30' }}>
                    <Icon className="w-5 h-5" style={{ color: sec.accent === '#FAD98D' ? '#C9A227' : sec.accent }} />
                  </div>
                  <div>
                    <h2 className="font-black text-[#0A1A2F] text-base leading-tight">{displayTitle}</h2>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{sec.subtitle}</p>
                  </div>
                </div>

                {/* Intro icon grid */}
                {sec.isIntro && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {[
                      { icon: '🏋️', label: 'Fitness' },
                      { icon: '🍽️', label: 'Nutrition' },
                      { icon: '📖', label: 'Bible Study' },
                      { icon: '🧠', label: 'Personal Growth' },
                      { icon: '👥', label: 'Community' },
                      { icon: '🤖', label: '4 AI Coaches' },
                    ].map((item, i) => (
                      <motion.div key={item.label}
                        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-white rounded-2xl p-3 flex items-center gap-2.5 border border-gray-100 shadow-sm">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-bold text-[#0A1A2F]">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Feature list */}
                {sec.features && (
                  <div className="space-y-2 mb-2">
                    {sec.features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} accent={sec.accent} />)}
                  </div>
                )}

                {/* Bots */}
                {sec.bots && (
                  <div className="space-y-2 mb-2">
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                      Tap any coach below to start a conversation — they already know your goals from setup.
                    </p>
                    {sec.bots.map((b, i) => <BotCard key={b.name} bot={b} index={i} />)}
                  </div>
                )}

                {/* Done CTA */}
                {sec.isDone && (
                  <div className="space-y-2 mb-2">
                    {[
                      { icon: '📖', text: "Open your Bible and read today's verse", page: 'Bible' },
                      { icon: '🏋️', text: 'Start a workout right now', page: 'Workouts' },
                      { icon: '✅', text: 'Set up your first habit', page: 'HabitBuilderPage' },
                      { icon: '💬', text: 'Say hi to Gideon', page: 'ChatScreen?bot=Gideon' },
                    ].map((a, i) => (
                      <motion.button key={a.page}
                        initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        onPointerDown={() => { finish(); setTimeout(() => { window.location.href = createPageUrl(a.page); }, 200); }}
                        className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border-2 border-gray-100 text-left active:scale-95 transition-transform shadow-sm">
                        <span className="text-xl">{a.icon}</span>
                        <p className="font-semibold text-[#0A1A2F] text-sm flex-1">{a.text}</p>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </motion.button>
                    ))}
                    <button onPointerDown={finish}
                      className="w-full py-3 rounded-2xl text-sm font-semibold text-gray-400">
                      Explore on my own →
                    </button>
                  </div>
                )}

                <div className="h-2" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer nav */}
          {!sec.isDone && (
            <div className="px-5 pb-4 pt-3 border-t border-gray-100 flex gap-3 flex-shrink-0">
              {step > 0 && (
                <button onPointerDown={goPrev}
                  className="w-11 h-11 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button onPointerDown={goNext}
                style={{ background: `linear-gradient(135deg, #0A1A2FCC, ${sec.accent})` }}
                className="flex-1 h-11 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md">
                {step === total - 2
                  ? <><Sparkles className="w-4 h-4" />Almost done</>
                  : <>Next <ChevronRight className="w-4 h-4" /></>
                }
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
