import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Brain, Heart, Sparkles, Target, CheckCircle2,
  Crown, Calendar, Wind, Star, ArrowRight, Flower2,
  Flame, ChevronRight, Sun, Moon, Sunset, TrendingUp } from
'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { localDateKey, todayKey } from '@/utils/localDate';
import ChatButton from '@/components/chatbot/ChatButton';
const HabitBuilderTab = lazy(() => import('@/pages/HabitBuilderPage'));
const GratitudeJournalTab = lazy(() => import('@/pages/GratitudeJournalPage').catch(() => ({ default: () => <div>Unable to load</div> })));
const MindsetResetTab = lazy(() => import('@/pages/MindsetResetPage'));
const AffirmationsTab = lazy(() => import('@/pages/AffirmationsPage'));
const EmotionalCheckInTab = lazy(() => import('@/pages/EmotionalCheckInPage'));
const IdentityInChristTab = lazy(() => import('@/pages/IdentityInChristPage'));
const WeeklyReflectionTab = lazy(() => import('@/pages/WeeklyReflectionPage'));
const GrowthPathwaysTab = lazy(() => import('@/pages/GrowthPathwaysPage'));
const MyJournalEntriesTab = lazy(() => import('@/pages/MyJournalEntries'));

// ── Affirmations rotation ────────────────────────────────────────────────────
const DAILY_AFFIRMATIONS = [
{ text: "I am fearfully and wonderfully made", verse: "Psalm 139:14" },
{ text: "I can do all things through Christ who strengthens me", verse: "Philippians 4:13" },
{ text: "God has plans to prosper me and give me hope", verse: "Jeremiah 29:11" },
{ text: "I am more than a conqueror through Christ", verse: "Romans 8:37" },
{ text: "Nothing can separate me from the love of God", verse: "Romans 8:38-39" },
{ text: "I have not been given a spirit of fear, but of power", verse: "2 Timothy 1:7" },
{ text: "I am a new creation — the old has gone, the new is here", verse: "2 Corinthians 5:17" }];


// ── Mood config ──────────────────────────────────────────────────────────────
const MOOD_EMOJI = {
  joyful: "😊", grateful: "🙏", hopeful: "🌟", peaceful: "😌",
  struggling: "😔", seeking: "💭", anxious: "😟", tired: "😴"
};
const MOOD_COLOR = {
  joyful: "#F59E0B", grateful: "#22C55E", hopeful: "#3B82F6", peaceful: "#14B8A6",
  struggling: "#EF4444", seeking: "#A855F7", anxious: "#6366F1", tired: "#94A3B8"
};

// ── Time helpers ─────────────────────────────────────────────────────────────
function getGreeting(name) {
  const h = new Date().getHours();
  const first = name ? name.split(" ")[0] : null;
  const suffix = first ? `, ${first}` : "";
  if (h < 5) return { text: `Still up${suffix}?`, Icon: Moon, color: "#6366F1" };
  if (h < 12) return { text: `Good morning${suffix}`, Icon: Sun, color: "#F59E0B" };
  if (h < 17) return { text: `Good afternoon${suffix}`, Icon: Sunset, color: "#F97316" };
  if (h < 21) return { text: `Good evening${suffix}`, Icon: Moon, color: "#8B5CF6" };
  return { text: `Good night${suffix}`, Icon: Moon, color: "#6366F1" };
}

function getDayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 1)) / 86400000);
}

// ── Categorised tool cards ───────────────────────────────────────────────────
const DAILY_TOOLS = [
{
  page: "HabitBuilderPage",
  icon: CheckCircle2,
  grad: "from-emerald-500 to-teal-400",
  label: "Habit Builder",
  sub: "Track what you do daily",
  entryType: "habit_tracker"
},
{
  page: "EmotionalCheckInPage",
  icon: Heart,
  grad: "from-rose-500 to-pink-400",
  label: "Emotional Check-In",
  sub: "How are you feeling today?",
  entryType: "emotional_checkin"
},
{
  page: "GratitudeJournalPage",
  icon: Star,
  grad: "from-amber-500 to-yellow-400",
  label: "Gratitude Journal",
  sub: "Name three gifts from today",
  entryType: "gratitude"
},
{
  page: "AffirmationsPage",
  icon: Sparkles,
  grad: "from-sky-500 to-cyan-400",
  label: "Affirmations",
  sub: "Speak truth over yourself",
  entryType: null
},
{
  page: "MindsetResetPage",
  icon: Brain,
  grad: "from-violet-500 to-purple-400",
  label: "Mindset Reset",
  sub: "Rewire your thinking",
  entryType: "mindset_reset"
},
{
  page: "GuidedMeditationsPage",
  icon: Wind,
  grad: "from-[#AFC7E3] to-[#3C4E53]",
  label: "Guided Meditation",
  sub: "Stillness and presence",
  entryType: null
}];


const WEEKLY_TOOLS = [
{
  page: "WeeklyReflectionPage",
  icon: Calendar,
  grad: "from-[#3C4E53] to-[#AFC7E3]",
  label: "Weekly Reflection",
  sub: "Process the week that was",
  entryType: "weekly_reflection"
},
{
  page: "GrowthPathwaysPage",
  icon: Target,
  grad: "from-orange-500 to-amber-400",
  label: "Growth Pathways",
  sub: "Choose your next step",
  entryType: null
},
{
  page: "SelfCareChallengesPage",
  icon: Flower2,
  grad: "from-[#FAD98D] to-[#c9a227]",
  label: "Self-Care Challenges",
  sub: "8 challenges, your pace",
  entryType: null
}];


const DEEP_TOOLS = [
{
  page: "IdentityInChristPage",
  icon: Crown,
  grad: "from-[#c9a227] to-amber-500",
  label: "Identity in Christ",
  sub: "Remember who you really are"
},
{
  page: "MyJournalEntries",
  icon: BookOpen,
  grad: "from-[#AFC7E3] to-[#3C4E53]",
  label: "My Journal",
  sub: "Read past reflections"
}];


// ── Habit streak calc ────────────────────────────────────────────────────────
function calcHabitStreak(entries) {
  const days = new Set(
    entries.
    filter((e) => e.entry_type === "habit_tracker" && e.habits?.length > 0).
    map((e) => (e.created_date || "").slice(0, 10))
  );
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (days.has(localDateKey(d))) streak++;else
    if (i > 0) break;
  }
  return streak;
}

// ── Small components ─────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <span className="text-xs font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest">{children}</span>
      <div className="flex-1 h-px bg-[#0A1A2F]/8" />
    </div>);

}

function ToolRow({ page, icon: Icon, grad, label, sub, done, onTabSwitch }) {
  const tabMap = {
    HabitBuilderPage: 'habits',
    EmotionalCheckInPage: 'habits-emotional',
    GratitudeJournalPage: 'journal-gratitude',
    AffirmationsPage: 'mindset-affirm',
    MindsetResetPage: 'mindset',
    GuidedMeditationsPage: null, // stays as separate page
    WeeklyReflectionPage: 'journal-weekly',
    GrowthPathwaysPage: 'pathways',
    SelfCareChallengesPage: null // stays as separate page
  };
  const tabId = tabMap[page];

  const content =
  <motion.div
    whileTap={{ scale: 0.98 }}
    className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-2xl px-4 py-3.5 border shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-all mb-2.5"
    style={{ borderColor: done ? "#BBF7D0" : "#F3F4F6" }}>
    
      <div className={`w-10 h-10 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#0A1A2F] dark:text-white leading-tight">{label}</p>
        <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mt-0.5">{sub}</p>
      </div>
      {done ?
    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> :
    <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25 flex-shrink-0" />
    }
    </motion.div>;


  if (tabId && onTabSwitch) {
    return <button className="w-full text-left" onClick={() => onTabSwitch(tabId)}>{content}</button>;
  }
  return <Link to={createPageUrl(page)}>{content}</Link>;
}

function DeepRow({ page, icon: Icon, grad, label, sub, onTabSwitch }) {
  const tabMap = { IdentityInChristPage: 'mindset-identity', MyJournalEntries: 'journal' };
  const tabId = tabMap[page];

  const content =
  <motion.div
    whileTap={{ scale: 0.98 }}
    className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-2xl px-4 py-3.5 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-all mb-2.5">
    
      <div className={`w-10 h-10 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#0A1A2F] dark:text-white leading-tight">{label}</p>
        <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 mt-0.5">{sub}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#0A1A2F]/25 dark:text-white/25 flex-shrink-0" />
    </motion.div>;


  if (tabId && onTabSwitch) {
    return <button className="w-full text-left" onClick={() => onTabSwitch(tabId)}>{content}</button>;
  }
  return <Link to={createPageUrl(page)}>{content}</Link>;
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PersonalGrowth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [habitStreak, setHabitStreak] = useState(0);
  const [todayDone, setTodayDone] = useState({}); // entryType → bool
  const [lastMood, setLastMood] = useState(null); // { value, emoji }
  const [lastJournal, setLastJournal] = useState(null); // { preview, date }
  const [weeklyDone, setWeeklyDone] = useState(false);

  const affirmation = DAILY_AFFIRMATIONS[getDayOfYear() % DAILY_AFFIRMATIONS.length];
  const greeting = getGreeting(user?.full_name);
  const GreetIcon = greeting.Icon;
  const today = todayKey();

  useEffect(() => {
    async function load() {
      try {
        const [me, entries] = await Promise.all([
        base44.auth.me(),
        base44.entities.JournalEntry.list("-created_date", 120)]
        );
        setUser(me);

        // Habit streak
        setHabitStreak(calcHabitStreak(entries));

        // Today's completions
        const todayEntries = entries.filter((e) => (e.created_date || "").startsWith(today));
        const done = {};
        todayEntries.forEach((e) => {if (e.entry_type) done[e.entry_type] = true;});
        setTodayDone(done);

        // Weekly reflection this week
        const mon = (() => {
          const d = new Date();const day = d.getDay();
          d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
          return localDateKey(d);
        })();
        setWeeklyDone(entries.some((e) => e.entry_type === "weekly_reflection" && e.created_date === mon));

        // Last mood
        const moodEntry = entries.find((e) => e.entry_type === "emotional_checkin" && e.mood);
        if (moodEntry) setLastMood({ value: moodEntry.mood, emoji: MOOD_EMOJI[moodEntry.mood] || "💭" });

        // Last journal preview
        const journalEntry = entries.find((e) =>
        e.entry_type === "weekly_reflection" || e.entry_type === "mindset_reset"
        );
        if (journalEntry) {
          let preview = journalEntry.content || "";
          try {
            const p = JSON.parse(preview);
            preview = p.wins || p.learned || p.intention || Object.values(p)[0] || preview;
          } catch {}
          setLastJournal({
            preview: preview.slice(0, 90) + (preview.length > 90 ? "…" : ""),
            date: journalEntry.created_date
          });
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Smart "do this next" card
  const h = new Date().getHours();
  const nextCard = (() => {
    if (!todayDone["emotional_checkin"])
    return { page: "EmotionalCheckInPage", icon: Heart, grad: "from-rose-500 to-pink-400", label: "Check in emotionally", sub: "Takes 30 seconds — sets the tone for your whole day" };
    if (!todayDone["habit_tracker"])
    return { page: "HabitBuilderPage", icon: CheckCircle2, grad: "from-emerald-500 to-teal-400", label: "Log your habits", sub: "Keep the streak going — mark what you've done today" };
    if (!todayDone["gratitude"])
    return { page: "GratitudeJournalPage", icon: Star, grad: "from-amber-500 to-yellow-400", label: "Write your gratitude", sub: "Three things — it only takes a minute" };
    if (!weeklyDone && h >= 17)
    return { page: "WeeklyReflectionPage", icon: Calendar, grad: "from-[#3C4E53] to-[#AFC7E3]", label: "Complete your weekly reflection", sub: "You haven't reflected this week yet — perfect time now" };
    return { page: "AffirmationsPage", icon: Sparkles, grad: "from-sky-500 to-cyan-400", label: "Read today's affirmation", sub: "Speak one truth over yourself before you move on" };
  })();
  const NextIcon = nextCard.icon;

  // Daily completions count
  const dailyDoneCount = DAILY_TOOLS.filter((t) => t.entryType && todayDone[t.entryType]).length;
  const dailyTotal = DAILY_TOOLS.filter((t) => t.entryType).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#AFC7E3] border-t-transparent animate-spin" />
      </div>);

  }

  const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: <Star className="w-3.5 h-3.5" /> },
  { id: 'journal', label: 'Journal', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'mindset', label: 'Mindset', icon: <Brain className="w-3.5 h-3.5" /> },
  { id: 'habits', label: 'Habits', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { id: 'pathways', label: 'Pathways', icon: <Target className="w-3.5 h-3.5" /> }];


  const TabSpinner = () =>
  <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#AFC7E3] border-t-transparent rounded-full" />
    </div>;


  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

      {/* Crisis Resources — required for App Store approval */}
      <div className="mx-3 sm:mx-4 mb-3 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 border border-blue-100 dark:border-blue-800/30">
        <span className="text-[10px] text-blue-600 dark:text-blue-300">If you or someone you know is in crisis:</span>
        <a href="tel:988" className="text-[10px] font-bold text-blue-700 dark:text-blue-200 underline">Call/Text 988</a>
        <span className="text-[10px] text-blue-400">|</span>
        <a href="sms:741741&body=HELLO" className="text-[10px] font-bold text-blue-700 dark:text-blue-200 underline">Text 741741</a>
      </div>


      {/* ── Sticky Header + Tab Bar ── */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A1A2F]/95 backdrop-blur-sm border-b border-[#AFC7E3]/25">
        <div className="px-4 py-3 max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white leading-tight">Personal Growth</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Strengthen your mind, emotions, and spirit</p>
          </div>
          {habitStreak > 0 &&
          <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 px-2.5 py-1.5 rounded-full">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-bold text-orange-600">{habitStreak}d</span>
            </div>
          }
        </div>

        <div className="max-w-2xl mx-auto px-3 sm:px-4 flex gap-1.5 overflow-x-auto items-center">
          {TABS.map((tab) =>
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold flex-shrink-0 rounded-lg transition-all ${
          activeTab === tab.id ?
          'bg-[#3C4E53] text-white shadow-sm dark:shadow-none' :
          'text-[#0A1A2F]/50 dark:text-white/50 hover:bg-[#AFC7E3]/15 hover:text-[#3C4E53]'}`
          }>
            
              {tab.icon} {tab.label}
            </button>
          )}
          <div className="flex-1" />
          <Link to={createPageUrl('PersonalGrowthGoalsPage')} className="flex-shrink-0 px-2">
            <button className="flex items-center gap-1.5 bg-[#EFF9FF] border border-[#AFC7E3]/40 text-[#3C4E53] text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap">
              <Target className="w-3.5 h-3.5" /> Goals
            </button>
          </Link>
        </div>
      </div>

      {/* ── Journal Tab ── */}
      {activeTab === 'journal' &&
      <Suspense fallback={<TabSpinner />}>
          <div className="px-4 pt-4 max-w-2xl mx-auto space-y-3">
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {[
            { id: 'journal-entries', label: 'My Journal' },
            { id: 'journal-gratitude', label: 'Gratitude' },
            { id: 'journal-weekly', label: 'Weekly Reflection' }].
            map((sub) =>
            <button key={sub.id}
            onClick={() => setActiveTab(sub.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border flex-shrink-0 transition-all ${
            activeTab === sub.id ? 'bg-[#3C4E53] text-white border-[#3C4E53]' : 'bg-[#AFC7E3]/15 text-[#3C4E53] border-[#AFC7E3]/25'}`
            }>
              
                  {sub.label}
                </button>
            )}
            </div>
          </div>
        </Suspense>
      }
      {activeTab === 'journal-entries' &&
      <Suspense fallback={<TabSpinner />}>
          <MyJournalEntriesTab />
        </Suspense>
      }
      {activeTab === 'journal-gratitude' &&
      <Suspense fallback={<TabSpinner />}><GratitudeJournalTab /></Suspense>
      }
      {activeTab === 'journal-weekly' &&
      <Suspense fallback={<TabSpinner />}><WeeklyReflectionTab /></Suspense>
      }

      {/* ── Mindset Tab ── */}
      {activeTab === 'mindset' &&
      <Suspense fallback={<TabSpinner />}>
          <div className="px-4 pt-4 max-w-2xl mx-auto space-y-3">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {[
            { id: 'mindset', label: 'Mindset Reset' },
            { id: 'mindset-affirm', label: 'Affirmations' },
            { id: 'mindset-identity', label: 'Identity in Christ' }].
            map((sub) =>
            <button key={sub.id}
            onClick={() => setActiveTab(sub.id)}
            className={`text-xs font-semibold px-3 py-2 rounded-lg border-2 flex-shrink-0 transition-all ${
            activeTab === sub.id ? 'bg-gradient-to-r from-[#3C4E53] to-[#AFC7E3] text-white border-[#3C4E53] shadow-sm dark:shadow-none' : 'bg-white dark:bg-white/5 text-[#3C4E53] border-[#AFC7E3]/25 hover:border-[#AFC7E3]/50 hover:bg-[#AFC7E3]/10'}`
            }>
              {sub.label}
                </button>
            )}
            </div>
            <MindsetResetTab />
          </div>
        </Suspense>
      }
      {activeTab === 'mindset-affirm' &&
      <Suspense fallback={<TabSpinner />}><AffirmationsTab /></Suspense>
      }
      {activeTab === 'mindset-identity' &&
      <Suspense fallback={<TabSpinner />}><IdentityInChristTab /></Suspense>
      }

      {/* ── Habits Tab ── */}
      {activeTab === 'habits' &&
      <Suspense fallback={<TabSpinner />}>
          <div className="px-4 pt-4 max-w-2xl mx-auto space-y-3">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {[
            { id: 'habits', label: 'Habit Builder' },
            { id: 'habits-emotional', label: 'Emotional Check-In' }].
            map((sub) =>
            <button key={sub.id}
            onClick={() => setActiveTab(sub.id)}
            className={`text-xs font-semibold px-3 py-2 rounded-lg border-2 flex-shrink-0 transition-all ${
            activeTab === sub.id ? 'bg-gradient-to-r from-[#3C4E53] to-[#AFC7E3] text-white border-[#3C4E53] shadow-sm dark:shadow-none' : 'bg-white dark:bg-white/5 text-[#3C4E53] border-[#AFC7E3]/25 hover:border-[#AFC7E3]/50 hover:bg-[#AFC7E3]/10'}`
            }>
              {sub.label}
                </button>
            )}
            </div>
            <HabitBuilderTab />
          </div>
        </Suspense>
      }
      {activeTab === 'habits-emotional' &&
      <Suspense fallback={<TabSpinner />}><EmotionalCheckInTab /></Suspense>
      }

      {/* ── Pathways Tab ── */}
      {activeTab === 'pathways' &&
      <Suspense fallback={<TabSpinner />}><GrowthPathwaysTab /></Suspense>
      }

      {/* ── Dashboard Tab (original content) ── */}
      {activeTab === 'dashboard' &&
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* ── Greeting ── */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <GreetIcon className="w-5 h-5" style={{ color: greeting.color }} />
              <h2 className="text-xl font-bold text-[#0A1A2F] dark:text-white dark:text-white">{greeting.text}</h2>
            </div>
          </motion.div>

          {/* ── Growth Goals entry card ── */}
          <Link to={createPageUrl('PersonalGrowthGoalsPage')}>
            <div id="tour-growth-goals-entry" className="flex items-center justify-between px-4 py-3.5 bg-white dark:bg-white/5 rounded-2xl border border-[#AFC7E3]/20 dark:border-[#AFC7E3]/10 shadow-sm dark:shadow-none hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#AFC7E3] to-[#7BA3C9] rounded-xl flex items-center justify-center">
                  <span className="text-lg">🌱</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A1A2F] dark:text-white">My Growth Profile</p>
                  <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50">Goals, values & growth areas</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0A1A2F]/30 dark:text-white/30" />
            </div>
          </Link>






            
          </Link>

          {/* ── Daily Affirmation banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="rounded-2xl p-5 border border-[#AFC7E3]/20"
            style={{ background: "linear-gradient(135deg,#0A1A2F,#1E3050)" }}>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAD98D]/20 dark:bg-[#FAD98D]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star className="w-4 h-4 text-[#FAD98D]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#FAD98D] uppercase tracking-widest mb-1.5">Today's Affirmation</p>
                <p className="text-base font-bold text-white leading-snug mb-1">"{affirmation.text}"</p>
                <p className="text-xs text-white/45">{affirmation.verse}</p>
              </div>
              <button onClick={() => setActiveTab('mindset-affirm')} className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-white/60" />
                </div>
              </button>
            </div>
          </motion.div>

          {/* ── Last mood + journal row ── */}
          {(lastMood || lastJournal) &&
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="grid grid-cols-2 gap-3">
            
              {lastMood &&
            <button onClick={() => setActiveTab('habits-emotional')} className="text-left">
                  <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none h-full hover:shadow-md dark:shadow-none transition-all">
                    <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-2">Last check-in</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lastMood.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-[#0A1A2F] dark:text-white capitalize">{lastMood.value}</p>
                        <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Tap to check in today</p>
                      </div>
                    </div>
                  </div>
                </button>
            }
              {lastJournal &&
            <button onClick={() => setActiveTab('journal')} className="text-left">
                  <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none h-full hover:shadow-md dark:shadow-none transition-all">
                    <p className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 uppercase tracking-widest mb-2">Last reflection</p>
                    <p className="text-xs text-[#0A1A2F]/70 dark:text-white/70 leading-relaxed line-clamp-3">{lastJournal.preview}</p>
                    {lastJournal.date && <p className="text-[10px] text-[#0A1A2F]/30 dark:text-white/30 mt-1.5">{lastJournal.date}</p>}
                  </div>
                </button>
            }
            </motion.div>
          }

          {/* ── Do This Next ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <button className="w-full text-left" onClick={() => {
              const tabMap = { HabitBuilderPage: 'habits', EmotionalCheckInPage: 'habits-emotional', GratitudeJournalPage: 'journal-gratitude', AffirmationsPage: 'mindset-affirm', WeeklyReflectionPage: 'journal-weekly' };
              setActiveTab(tabMap[nextCard.page] || 'dashboard');
            }}>
              <div
                className="rounded-2xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-all"
                style={{ background: "linear-gradient(135deg,#AFC7E3,#3C4E53)" }}>
                
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <NextIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-0.5">Do This Next</p>
                  <p className="text-base font-bold text-white leading-tight">{nextCard.label}</p>
                  <p className="text-xs text-white/70 mt-0.5 leading-snug">{nextCard.sub}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/70 flex-shrink-0" />
              </div>
            </button>
          </motion.div>

          {/* ── Daily Practices ── */}
          <motion.div id="tour-daily-tools" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
            <SectionLabel>
              Daily Practices
              {dailyDoneCount > 0 &&
              <span className="ml-1 text-emerald-500 font-bold">· {dailyDoneCount}/{dailyTotal} done today</span>
              }
            </SectionLabel>
            {DAILY_TOOLS.map((tool, i) =>
            <motion.div key={tool.page} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16 + i * 0.04 }}>
                <ToolRow onTabSwitch={setActiveTab}
              page={tool.page}
              icon={tool.icon}
              grad={tool.grad}
              label={tool.label}
              sub={tool.sub}
              done={tool.entryType ? !!todayDone[tool.entryType] : false} />
              
              </motion.div>
            )}
          </motion.div>

          {/* ── Weekly Rhythm ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <SectionLabel>
              Weekly Rhythm
              {weeklyDone && <span className="ml-1 text-emerald-500 font-bold">· reflected this week ✓</span>}
            </SectionLabel>
            {WEEKLY_TOOLS.map((tool, i) =>
            <motion.div key={tool.page} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 + i * 0.04 }}>
                <ToolRow onTabSwitch={setActiveTab}
              page={tool.page}
              icon={tool.icon}
              grad={tool.grad}
              label={tool.label}
              sub={tool.sub}
              done={tool.entryType === "weekly_reflection" ? weeklyDone : false} />
              
              </motion.div>
            )}
          </motion.div>

          {/* ── Deep Work ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
            <SectionLabel>Deep Work</SectionLabel>
            {DEEP_TOOLS.map((tool, i) =>
            <motion.div key={tool.page} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.44 + i * 0.04 }}>
                <DeepRow page={tool.page} icon={tool.icon} grad={tool.grad} label={tool.label} sub={tool.sub} onTabSwitch={setActiveTab} />
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
      }

      {/* Floating ChatButton — same style as Gideon on Bible page */}
      <ChatButton bot="Hannah" id="tour-hannah-btn" />
    </div>);

}