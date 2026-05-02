import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain, Heart, Sparkles, Target, ChevronRight,
  Compass, Zap,
  AlertTriangle, Star, Briefcase, ArrowLeft
} from 'lucide-react';

// ── Label maps ─────────────────────────────────────────────────────────────────
const GROWTH_AREA_INFO = {
  emotional_intelligence: { label: 'Emotional Intelligence', emoji: '🧠',
    desc: 'Understanding and managing your emotions effectively.',
    tools: ['Emotional Check-in', 'Weekly Reflection', 'Hannah coaching'],
    pages: ['EmotionalCheckInPage', 'WeeklyReflectionPage'] },
  confidence:             { label: 'Confidence & Self-worth', emoji: '💪',
    desc: 'Building unshakeable belief in your own value.',
    tools: ['Daily Affirmations', 'Habit Builder', 'Hannah coaching'],
    pages: ['AffirmationsPage', 'HabitBuilderPage'] },
  stress_anxiety:         { label: 'Stress & Anxiety', emoji: '🌿',
    desc: 'Developing calm and resilience when life gets hard.',
    tools: ['Meditation', 'Emotional Check-in', 'Gratitude Journal'],
    pages: ['MeditationPage', 'EmotionalCheckInPage', 'GratitudeJournalPage'] },
  habits:                 { label: 'Habits & Consistency', emoji: '✅',
    desc: 'Building daily systems that compound over time.',
    tools: ['Habit Builder', 'Daily Streak', 'Weekly Reflection'],
    pages: ['HabitBuilderPage', 'WeeklyReflectionPage'] },
  relationships:          { label: 'Relationships', emoji: '💞',
    desc: 'Deepening connections with the people who matter most.',
    tools: ['Gratitude Journal', 'Weekly Reflection', 'Hannah coaching'],
    pages: ['GratitudeJournalPage', 'WeeklyReflectionPage'] },
  career_purpose:         { label: 'Career & Purpose', emoji: '🚀',
    desc: 'Clarifying your calling and showing up with intention.',
    tools: ['Values reflection', 'Hannah coaching', 'Mindset Reset'],
    pages: ['MindsetResetPage', 'WeeklyReflectionPage'] },
  money_mindset:          { label: 'Money Mindset', emoji: '💰',
    desc: 'Shifting your relationship with money from scarcity to abundance.',
    tools: ['Mindset Reset', 'Affirmations', 'Hannah coaching'],
    pages: ['AffirmationsPage', 'MindsetResetPage'] },
  leadership:             { label: 'Leadership', emoji: '🏅',
    desc: 'Growing your ability to influence and inspire others.',
    tools: ['Challenges', 'Habit Builder', 'Hannah coaching'],
    pages: ['HabitBuilderPage', 'SelfCareChallengesPage'] },
  identity:               { label: 'Identity', emoji: '✨',
    desc: 'Knowing deeply who you are and who you\'re becoming.',
    tools: ['Affirmations', 'Emotional Check-in', 'Hannah coaching'],
    pages: ['AffirmationsPage', 'EmotionalCheckInPage'] },
};

const CORE_VALUE_INFO = {
  family:       { label: 'Family',       emoji: '👨‍👩‍👧' },
  freedom:      { label: 'Freedom',      emoji: '🦋' },
  growth:       { label: 'Growth',       emoji: '🌱' },
  faith:        { label: 'Faith',        emoji: '🙏' },
  health:       { label: 'Health',       emoji: '❤️' },
  love:         { label: 'Love',         emoji: '💛' },
  authenticity: { label: 'Authenticity', emoji: '✨' },
  impact:       { label: 'Impact',       emoji: '🌍' },
  creativity:   { label: 'Creativity',   emoji: '🎨' },
  security:     { label: 'Security',     emoji: '🏡' },
  adventure:    { label: 'Adventure',    emoji: '🧭' },
  connection:   { label: 'Connection',   emoji: '🤝' },
};

const COACHING_STYLE_INFO = {
  gentle:      { label: 'Gentle & Supportive', emoji: '🌸', time: 'Warm, encouraging, at your pace',
    desc: 'Hannah leads with empathy — she celebrates wins, holds space for struggles, and never pushes faster than you\'re ready.',
    tip: 'Best for building emotional safety and processing difficult feelings.' },
  direct:      { label: 'Direct & Actionable', emoji: '⚡', time: 'Straight to the point, practical',
    desc: 'Hannah cuts through the noise — she gives you clear steps, accountability, and honest feedback without sugarcoating.',
    tip: 'Best for people who want results and don\'t need hand-holding.' },
  exploratory: { label: 'Exploratory', emoji: '🔍', time: 'Deep questions, self-discovery',
    desc: 'Hannah asks powerful questions that help you uncover your own answers — rooted in curiosity and self-awareness.',
    tip: 'Best for people who want to deeply understand themselves.' },
  structured:  { label: 'Structured', emoji: '📋', time: 'Frameworks, tools, exercises',
    desc: 'Hannah uses proven frameworks — she gives you structured exercises, models, and tools you can use immediately.',
    tip: 'Best for analytical thinkers who love systems and clarity.' },
};

const MOTIVATION_INFO = {
  lose_weight:      { label: 'Lose weight',           emoji: '🔥' },
  build_muscle:     { label: 'Build muscle',           emoji: '💪' },
  eat_healthier:    { label: 'Eat healthier',          emoji: '🥗' },
  grow_spiritually: { label: 'Grow spiritually',       emoji: '🙏' },
  manage_stress:    { label: 'Manage stress / anxiety',emoji: '🧘' },
  better_habits:    { label: 'Build better habits',    emoji: '✅' },
  relationships:    { label: 'Improve relationships',  emoji: '💞' },
  find_purpose:     { label: 'Find purpose',           emoji: '🌟' },
  just_exploring:   { label: 'Just exploring',         emoji: '🔍' },
};

const LIFE_STAGE_INFO = {
  student:      { label: 'Student',        emoji: '🎓', focus: 'Identity, habits, and academic/social resilience.' },
  early_career: { label: 'Early career',   emoji: '🚀', focus: 'Purpose, confidence, and professional momentum.' },
  mid_career:   { label: 'Mid-career',     emoji: '💼', focus: 'Leadership, balance, and reigniting your vision.' },
  parent:       { label: 'Parent',         emoji: '👶', focus: 'Patience, boundaries, and modelling growth for your kids.' },
  transition:   { label: 'In transition',  emoji: '🔄', focus: 'Clarity, resilience, and building a new foundation.' },
  other:        { label: 'Other',          emoji: '✨', focus: 'Your growth journey is unique — Hannah meets you where you are.' },
};

// ── Tools each growth area maps to ────────────────────────────────────────────
const DAILY_TOOLS = [
  { id: 'emotional_checkin', label: 'Emotional Check-in', emoji: '💙', page: 'EmotionalCheckInPage' },
  { id: 'habit_tracker',     label: 'Habit Builder',       emoji: '✅', page: 'HabitBuilderPage'    },
  { id: 'gratitude',         label: 'Gratitude Journal',   emoji: '⭐', page: 'GratitudeJournalPage' },
  { id: 'affirmations',      label: 'Affirmations',        emoji: '🌟', page: 'AffirmationsPage'    },
  { id: 'meditation',        label: 'Meditation',           emoji: '🌿', page: 'MeditationPage'      },
  { id: 'mindset_reset',     label: 'Mindset Reset',        emoji: '🔁', page: 'MindsetResetPage'    },
  { id: 'weekly_reflection', label: 'Weekly Reflection',   emoji: '📝', page: 'WeeklyReflectionPage' },
];

// Value-based affirmations
const VALUE_AFFIRMATIONS = {
  family:       'My relationships are rooted in love, presence, and intentionality.',
  freedom:      'I live and move in the freedom God has given me.',
  growth:       'Every day I become a slightly better version of myself.',
  faith:        'My faith is the foundation everything else is built on.',
  health:       'I honour my body as a gift — I steward it well.',
  love:         'I give and receive love freely and without fear.',
  authenticity: 'I am enough exactly as I am — no mask required.',
  impact:       'My life makes a difference in the lives of others.',
  creativity:   'I bring something unique into the world that only I can.',
  security:     'I am grounded, stable, and at peace in who I am.',
  adventure:    'I say yes to growth, newness, and the unexpected.',
  connection:   'Deep relationships are worth the risk of vulnerability.',
};

// ── Mini chip ──────────────────────────────────────────────────────────────────
function Chip({ emoji, label, color = '#AFC7E3', bg = '#EFF9FF' }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-full"
      style={{ background: bg, color }}>
      {emoji} {label}
    </span>
  );
}

// ── Tool row ──────────────────────────────────────────────────────────────────
function ToolRow({ tool, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
      <Link to={createPageUrl(tool.page)}>
        <div className="flex items-center gap-3 bg-[#F8FAFB] rounded-xl px-3.5 py-2.5 hover:bg-[#AFC7E3]/10 transition-colors">
          <span className="text-base flex-shrink-0">{tool.emoji}</span>
          <span className="text-xs font-bold text-[#0A1A2F] dark:text-white flex-1">{tool.label}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#AFC7E3]" />
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PersonalGrowthGoalsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [expandedArea, setExpandedArea] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const growthAreas   = user?.growth_areas   || [];
  const coreValues    = user?.core_values    || [];
  const coachingStyle = user?.coaching_style || 'gentle';
  const motivations   = user?.motivations    || [];
  const lifeStage     = user?.life_stage     || null;
  const goalText      = user?.main_goal_text || user?.goal_90_day || null;

  const styleInfo    = COACHING_STYLE_INFO[coachingStyle] || COACHING_STYLE_INFO.gentle;
  const stageInfo    = lifeStage ? (LIFE_STAGE_INFO[lifeStage] || null) : null;
  const profileComplete = growthAreas.length > 0 || coreValues.length > 0;

  // Primary value affirmation (first core value, or generic)
  const primaryValue = coreValues[0];
  const affirmation  = primaryValue ? VALUE_AFFIRMATIONS[primaryValue] : 'Every day I become a slightly better version of myself.';

  // Deduplicate recommended daily tools from all growth areas
  const toolsSeen = new Set();
  const recommendedTools = growthAreas
    .flatMap(a => {
      const pages = GROWTH_AREA_INFO[a]?.pages || [];
      return pages.map(p => DAILY_TOOLS.find(t => t.page === p)).filter(Boolean);
    })
    .filter(t => { if (toolsSeen.has(t.id)) return false; toolsSeen.add(t.id); return true; })
    .slice(0, 5);

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F2F6FA' }}>

      {/* ── Standard Header with Tabs ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#AFC7E3]/25">
        <div className="px-4 pt-4 pb-3 max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#AFC7E3] to-[#3C4E53] flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Growth Goals</h1>
            <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">Your growth profile</p>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 flex gap-1.5 overflow-x-auto items-center pb-3">
          {[
            { id: 'overview', label: 'Overview', icon: <Target className="w-3.5 h-3.5" /> },
            { id: 'areas', label: 'Growth Areas', icon: <Brain className="w-3.5 h-3.5" /> },
            { id: 'values', label: 'Values', icon: <Star className="w-3.5 h-3.5" /> },
            { id: 'tools', label: 'Tools', icon: <Zap className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold flex-shrink-0 rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#3C4E53] text-white shadow-sm dark:shadow-none' 
                  : 'text-[#0A1A2F]/50 dark:text-white/50 hover:bg-[#AFC7E3]/15 hover:text-[#3C4E53]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
        <div>

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-3xl p-5 relative overflow-hidden shadow-lg dark:shadow-none"
            style={{ background: 'linear-gradient(135deg, #3C4E53 0%, #2a3840 60%, #AFC7E3 260%)' }}>
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5" />
            <div className="absolute right-4 bottom-2 w-20 h-20 rounded-full bg-[#AFC7E3]/8" />
            <div className="relative">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Your Growth Profile</p>
              <div className="flex items-start gap-3">
                <span className="text-3xl mt-0.5">
                  {growthAreas.length > 0 ? (GROWTH_AREA_INFO[growthAreas[0]]?.emoji || '🧠') : '🌱'}
                </span>
                <div>
                  <h1 id="tour-growth-goal-title" className="text-2xl font-black text-white leading-tight">
                    {growthAreas.length > 0
                      ? GROWTH_AREA_INFO[growthAreas[0]]?.label || 'Personal Growth'
                      : 'Personal Growth'}
                  </h1>
                  <p className="text-white/50 text-xs mt-0.5">
                    {styleInfo.emoji} {styleInfo.label} · {stageInfo ? `${stageInfo.emoji} ${stageInfo.label}` : 'Your journey'}
                  </p>
                </div>
              </div>
              {growthAreas.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {growthAreas.map(a => (
                    <span key={a} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white/80">
                      {GROWTH_AREA_INFO[a]?.emoji} {GROWTH_AREA_INFO[a]?.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Incomplete nudge ── */}
        {!profileComplete && user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}
            className="flex items-center gap-3 bg-[#AFC7E3]/20 border border-[#AFC7E3]/30 rounded-2xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-[#3C4E53] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-[#3C4E53]">Growth profile incomplete</p>
              <p className="text-[11px] text-[#0A1A2F]/55 dark:text-white/55">Complete onboarding to get personalised tools, affirmations, and coaching.</p>
            </div>
            <Link to={createPageUrl('Settings')} className="text-[11px] font-bold text-[#3C4E53] flex-shrink-0">Update →</Link>
          </motion.div>
        )}

        {/* ── 90-day goal ── */}
        {goalText && (
          <motion.div id="tour-growth-goal-text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
            className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
                <Target className="w-4 h-4 text-[#AFC7E3]" />
              </div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Your 90-Day Goal</p>
            </div>
            <div className="bg-[#EFF9FF] rounded-2xl px-4 py-3 border border-[#AFC7E3]/20">
              <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white leading-relaxed italic">"{goalText}"</p>
            </div>
            <p className="text-[11px] text-[#0A1A2F]/35 dark:text-white/35 mt-2">Hannah keeps this in mind in every coaching session.</p>
          </motion.div>
        )}

        {/* ── Your Why / Motivations ── */}
        {motivations.length > 0 && (
          <motion.div id="tour-growth-motivations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
                <Heart className="w-4 h-4 text-[#AFC7E3]" />
              </div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Why You're Here</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {motivations.map(m => {
                const info = MOTIVATION_INFO[m];
                if (!info) return null;
                return (
                  <span key={m} className="flex items-center gap-1.5 bg-[#EFF9FF] border border-[#AFC7E3]/25 text-[#3C4E53] text-xs font-bold px-3 py-1.5 rounded-full">
                    {info.emoji} {info.label}
                  </span>
                );
              })}
            </div>
            <p className="text-[11px] text-[#0A1A2F]/35 dark:text-white/35 mt-3">Your motivations shape how Hannah frames her advice — always bringing it back to your why.</p>
          </motion.div>
        )}

        {/* ── Life stage ── */}
        {stageInfo && (
          <motion.div id="tour-life-stage" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}
            className="flex items-center gap-4 bg-white dark:bg-white/5 rounded-2xl px-5 py-4 shadow-sm dark:shadow-none">
            <span className="text-3xl">{stageInfo.emoji}</span>
            <div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">{stageInfo.label}</p>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45 mt-0.5">{stageInfo.focus}</p>
            </div>
          </motion.div>
        )}

        {/* ── Growth areas (expandable) ── */}
        {growthAreas.length > 0 && (
          <motion.div id="tour-growth-areas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
                <Brain className="w-4 h-4 text-[#AFC7E3]" />
              </div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Areas You're Working On</p>
              <span className="ml-auto text-[10px] text-[#0A1A2F]/35 dark:text-white/35 font-semibold">Tap to expand</span>
            </div>
            <div className="space-y-2">
              {growthAreas.map((a, i) => {
                const info = GROWTH_AREA_INFO[a];
                if (!info) return null;
                const isOpen = expandedArea === a;
                return (
                  <motion.div key={a} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 + i * 0.05 }}>
                    <button onClick={() => setExpandedArea(isOpen ? null : a)} className="w-full text-left">
                      <div className={`rounded-2xl px-4 py-3 transition-colors ${isOpen ? 'bg-[#EFF9FF] border border-[#AFC7E3]/30' : 'bg-[#F8FAFB]'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{info.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#0A1A2F] dark:text-white dark:text-white">{info.label}</p>
                            {!isOpen && <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 mt-0.5 line-clamp-1">{info.desc}</p>}
                          </div>
                          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronRight className="w-4 h-4 text-[#AFC7E3]" />
                          </motion.div>
                        </div>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden">
                              <p className="text-[11px] text-[#0A1A2F]/55 dark:text-white/55 mt-2 mb-3 leading-relaxed">{info.desc}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {info.tools.map(t => (
                                  <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#AFC7E3]/20 text-[#3C4E53]">{t}</span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
            </motion.div>
            )}

        </div>
        )}

        {/* ── Values Tab ── */}
        {activeTab === 'values' && (
        <div>

        {/* ── Core values ── */}
        {coreValues.length > 0 && (
          <motion.div id="tour-core-values" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
            className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
                <Star className="w-4 h-4 text-[#AFC7E3]" />
              </div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Your Core Values</p>
              <span className="ml-auto text-[10px] text-[#0A1A2F]/35 dark:text-white/35 font-semibold">{coreValues.length} of 5</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {coreValues.map((v, i) => {
                const info = CORE_VALUE_INFO[v];
                if (!info) return null;

                return (
                  <motion.div key={v} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 + i * 0.04 }}
                    className="flex items-center gap-2.5 bg-[#EFF9FF] border border-[#AFC7E3]/25 rounded-xl px-3 py-2.5">
                    <span className="text-base">{info.emoji}</span>
                    <span className="text-xs font-bold text-[#0A1A2F] dark:text-white dark:text-white">{info.label}</span>
                  </motion.div>
                );
              })}
            </div>
            {/* Value-based affirmation */}
            <div className="bg-[#F8FAFB] rounded-xl px-3.5 py-3 border-l-4 border-[#AFC7E3]">
              <p className="text-[10px] font-bold text-[#AFC7E3] uppercase tracking-widest mb-1">Affirmation rooted in {CORE_VALUE_INFO[primaryValue]?.label || 'your values'}</p>
              <p className="text-xs font-semibold text-[#0A1A2F] dark:text-white leading-relaxed italic">"{affirmation}"</p>
            </div>
            </motion.div>
            )}

        </div>
        )}

        {/* ── Coaching style (on Overview tab) ── */}
        {activeTab === 'overview' && (
        <div>

        {/* ── Coaching style ── */}
        <motion.div id="tour-coaching-style" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}
          className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
              <Compass className="w-4 h-4 text-[#AFC7E3]" />
            </div>
            <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Hannah's Coaching Style</p>
          </div>
          <div className="flex items-start gap-4 bg-[#EFF9FF] rounded-2xl px-4 py-3.5">
            <span className="text-3xl flex-shrink-0">{styleInfo.emoji}</span>
            <div>
              <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">{styleInfo.label}</p>
              <p className="text-[#3C4E53] text-xs font-semibold mt-0.5">{styleInfo.time}</p>
              <p className="text-[11px] text-[#0A1A2F]/55 dark:text-white/55 mt-2 leading-snug">{styleInfo.desc}</p>
              <p className="text-[11px] font-semibold text-[#AFC7E3] mt-2">💡 {styleInfo.tip}</p>
            </div>
          </div>
        </motion.div>

        </div>
        )}

        {/* ── Tools Tab ── */}
        {activeTab === 'tools' && (
        <div>

        {/* ── Recommended daily tools ── */}
        {recommendedTools.length > 0 && (
          <motion.div id="tour-growth-tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
            className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
                <Zap className="w-4 h-4 text-[#AFC7E3]" />
              </div>
              <div>
                <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">Tools for Your Growth</p>
                <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">Matched to your areas</p>
              </div>
            </div>
            <div className="space-y-2">
              {recommendedTools.map((t, i) => <ToolRow key={t.id} tool={t} delay={0.26 + i * 0.04} />)}
            </div>
          </motion.div>
        )}

        {/* ── All daily tools shortcut ── */}
        <motion.div id="tour-all-tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
              <Sparkles className="w-4 h-4 text-[#AFC7E3]" />
            </div>
            <p className="font-bold text-[#0A1A2F] dark:text-white text-sm">All Daily Tools</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DAILY_TOOLS.filter(t => !recommendedTools.find(r => r.id === t.id)).slice(0, 4).map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30 + i * 0.04 }}>
                <Link to={createPageUrl(t.page)}
                  className="flex items-center gap-2 bg-[#F8FAFB] rounded-xl px-3 py-2.5 hover:bg-[#EFF9FF] transition-colors">
                  <span className="text-base">{t.emoji}</span>
                  <span className="text-[11px] font-bold text-[#0A1A2F] dark:text-white leading-tight">{t.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Hannah CTA ── */}
        <motion.div id="tour-hannah-goals-cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
          className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-98 transition-transform"
          style={{ background: 'linear-gradient(135deg, #3C4E53, #5a7078)' }}
          onClick={() => navigate(createPageUrl('ChatScreen?bot=Hannah'))}>
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🧠</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">Talk to Hannah</p>
            <p className="text-xs text-white/60">{styleInfo.emoji} {styleInfo.label} coaching</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </motion.div>

        {/* ── Quick links ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
          <p className="text-[10px] font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-2.5">Related Tools</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: '🌱', label: 'Personal Growth',    page: 'PersonalGrowth'           },
              { icon: '📝', label: 'Weekly Reflection',  page: 'WeeklyReflectionPage'      },
              { icon: '🏆', label: 'Challenges',         page: 'SelfCareChallengesPage'    },
              { icon: '💬', label: 'Chat w/ Hannah',     page: 'ChatScreen?bot=Hannah'     },
            ].map(({ icon, label, page }) => (
              <Link key={page} to={createPageUrl(page)}
                className="flex items-center gap-2.5 bg-white dark:bg-white/5 rounded-2xl p-3.5 shadow-sm dark:shadow-none border border-gray-50 dark:border-white/5 active:scale-97 transition-all">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-bold text-[#0A1A2F] dark:text-white leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        </div>
        )}
      </div>
    </div>
  );
}