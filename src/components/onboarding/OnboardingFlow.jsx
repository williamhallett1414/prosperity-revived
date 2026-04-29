import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  ChevronRight, ChevronLeft, Sparkles, Check,
  Heart, Dumbbell, Utensils, BookOpen, Brain, Bell, User, Shield, AlertTriangle
} from 'lucide-react';
import LegalDocModal from './LegalDocModal';

import gideonImg  from '@/assets/gideon-avatar.png';
import hannahImg  from '@/assets/hannah-avatar.png';
import davidImg   from '@/assets/coach-david-avatar.png';
import danielImg  from '@/assets/chef-daniel-avatar.png';
import paulImg    from '@/assets/coach-paul-avatar.png';

const WHY_OPTIONS = [
  { id: 'lose_weight',      label: '🔥 Lose weight' },
  { id: 'build_muscle',     label: '💪 Build muscle' },
  { id: 'eat_healthier',    label: '🥗 Eat healthier' },
  { id: 'grow_spiritually', label: '🙏 Grow spiritually' },
  { id: 'manage_stress',    label: '🧘 Manage stress' },
  { id: 'better_habits',    label: '✅ Build better habits' },
  { id: 'relationships',    label: '💞 Improve relationships' },
  { id: 'find_purpose',     label: '🌟 Find purpose' },
  { id: 'just_exploring',   label: '🔍 Just exploring' },
];
const LIFE_STAGES = [
  { id: 'student',      label: '🎓 Student' },
  { id: 'early_career', label: '🚀 Early career' },
  { id: 'mid_career',   label: '💼 Mid-career' },
  { id: 'parent',       label: '👶 Parent' },
  { id: 'transition',   label: '🔄 In transition' },
  { id: 'other',        label: '✨ Other' },
];
const FITNESS_GOALS = [
  { id: 'lose_fat',       label: '🔥 Lose fat' },
  { id: 'build_muscle',   label: '💪 Build muscle' },
  { id: 'get_stronger',   label: '🏋️ Get stronger' },
  { id: 'more_endurance', label: '🏃 More endurance' },
  { id: 'stay_active',    label: '⚡ Stay active' },
  { id: 'sport_perf',     label: '🏅 Sport performance' },
];
const FITNESS_LEVELS = [
  { id: 'beginner',     label: 'Beginner',    desc: 'New to exercise or just getting back', emoji: '🌱' },
  { id: 'intermediate', label: 'Intermediate',desc: 'Regular exercise, 1–3 years',          emoji: '💪' },
  { id: 'advanced',     label: 'Advanced',    desc: 'Consistent & experienced, 3+ years',   emoji: '🏆' },
];
const EQUIPMENT = [
  { id: 'none',        label: '🙅 No equipment' },
  { id: 'dumbbells',   label: '🏋️ Dumbbells' },
  { id: 'barbell',     label: '🏋️ Barbell & plates' },
  { id: 'bands',       label: '🔁 Resistance bands' },
  { id: 'gym',         label: '🏢 Full gym' },
  { id: 'pull_up_bar', label: '🚪 Pull-up bar' },
  { id: 'yoga_mat',    label: '🧘 Yoga mat' },
  { id: 'kettle',      label: '⚙️ Kettlebell' },
];
const WORKOUT_DURATIONS = [
  { id: '20', label: '20 min' },
  { id: '30', label: '30 min' },
  { id: '45', label: '45 min' },
  { id: '60', label: '60 min' },
  { id: '90', label: '90+ min' },
];
const DIET_TYPES = [
  { id: 'balanced',      label: '⚖️ Balanced' },
  { id: 'high_protein',  label: '🥩 High protein' },
  { id: 'low_carb',      label: '🥑 Low carb / Keto' },
  { id: 'vegetarian',    label: '🥦 Vegetarian' },
  { id: 'vegan',         label: '🌱 Vegan' },
  { id: 'mediterranean', label: '🫒 Mediterranean' },
  { id: 'intermittent',  label: '⏰ Intermittent fasting' },
  { id: 'no_preference', label: '✨ No preference' },
];
const ALLERGENS = [
  { id: 'none',     label: '✅ None' },
  { id: 'gluten',   label: '🌾 Gluten' },
  { id: 'dairy',    label: '🥛 Dairy' },
  { id: 'nuts',     label: '🥜 Tree nuts' },
  { id: 'peanuts',  label: '🥜 Peanuts' },
  { id: 'shellfish',label: '🦞 Shellfish' },
  { id: 'eggs',     label: '🥚 Eggs' },
  { id: 'soy',      label: '🫘 Soy' },
];
const MEALS_PER_DAY = [
  { id: '2', label: '2 meals' },
  { id: '3', label: '3 meals' },
  { id: '4', label: '4 meals' },
  { id: '5', label: '5+ meals' },
];
const COOKING_TIMES = [
  { id: 'minimal', label: '⚡ Under 15 min' },
  { id: 'quick',   label: '🕐 15–30 min' },
  { id: 'medium',  label: '🕑 30–60 min' },
  { id: 'love_it', label: '👨‍🍳 I love cooking' },
];
const BIBLE_LEVELS = [
  { id: 'new',          label: 'New to the Bible',  emoji: '🌱' },
  { id: 'familiar',     label: 'Know the basics',   emoji: '📖' },
  { id: 'experienced',  label: 'Regular reader',    emoji: '✝️' },
  { id: 'deep_student', label: 'Deep student',      emoji: '🏛️' },
];
const BIBLE_TRANSLATIONS = [
  { id: 'NIV',  label: 'NIV' },
  { id: 'ESV',  label: 'ESV' },
  { id: 'KJV',  label: 'KJV' },
  { id: 'NLT',  label: 'NLT' },
  { id: 'NKJV', label: 'NKJV' },
  { id: 'MSG',  label: 'The Message' },
  { id: 'WEB',  label: 'WEB' },
  { id: 'any',  label: 'No preference' },
];
const BIBLE_TOPICS = [
  { id: 'prayer',        label: '🙏 Prayer' },
  { id: 'faith',         label: '✝️ Faith & trust' },
  { id: 'wisdom',        label: '📖 Wisdom' },
  { id: 'relationships', label: '💞 Relationships' },
  { id: 'identity',      label: '🌟 Identity in Christ' },
  { id: 'purpose',       label: '🎯 Purpose & calling' },
  { id: 'healing',       label: '💚 Healing' },
  { id: 'finances',      label: '💰 Biblical finances' },
  { id: 'anxiety',       label: '🧘 Peace & anxiety' },
  { id: 'leadership',    label: '👑 Leadership' },
];
const DEVOTIONAL_DEPTHS = [
  { id: 'short',  label: '⚡ Quick & focused (5 min)' },
  { id: 'medium', label: '📖 Moderate depth (10–15 min)' },
  { id: 'deep',   label: '🏛️ Deep dive (20+ min)' },
];
const GROWTH_AREAS = [
  { id: 'mindset',       label: '🧠 Mindset & beliefs' },
  { id: 'emotional',     label: '💙 Emotional intelligence' },
  { id: 'habits',        label: '✅ Habits & discipline' },
  { id: 'relationships', label: '💞 Relationships' },
  { id: 'purpose',       label: '🌟 Purpose & calling' },
  { id: 'productivity',  label: '⚡ Productivity' },
  { id: 'finances',      label: '💰 Financial stewardship' },
  { id: 'leadership',    label: '👑 Leadership' },
  { id: 'confidence',    label: '🦁 Confidence' },
];
const CORE_VALUES = [
  { id: 'faith',      label: '✝️ Faith' },
  { id: 'family',     label: '👨‍👩‍👧 Family' },
  { id: 'integrity',  label: '🛡️ Integrity' },
  { id: 'excellence', label: '🏆 Excellence' },
  { id: 'service',    label: '🤝 Service' },
  { id: 'freedom',    label: '🦅 Freedom' },
  { id: 'growth',     label: '🌱 Growth' },
  { id: 'love',       label: '❤️ Love' },
  { id: 'impact',     label: '💫 Impact' },
  { id: 'peace',      label: '☮️ Peace' },
];
const COACHING_STYLES = [
  { id: 'direct',     label: '⚡ Direct & challenging',    emoji: '💪' },
  { id: 'warm',       label: '☀️ Warm & encouraging',      emoji: '🌟' },
  { id: 'structured', label: '📋 Structured & data-driven', emoji: '📊' },
  { id: 'spiritual',  label: '🙏 Spiritually grounded',    emoji: '✝️' },
];
const JOB_TYPES = [
  { id: 'office',    label: '🏢 Office / remote' },
  { id: 'physical',  label: '⚒️ Physical / outdoor' },
  { id: 'student',   label: '🎓 Student' },
  { id: 'homemaker', label: '🏠 Homemaker' },
  { id: 'shift',     label: '🔄 Shift work' },
  { id: 'flexible',  label: '🎯 Flexible schedule' },
];

const STEPS = [
  { id: 'legal',          type: 'card', icon: Shield,   label: 'Legal',       color: '#C9A227', showInDots: true  },
  { id: 'guides',         type: 'full', icon: Sparkles, label: 'Your Team',   color: '#C9A227', showInDots: false },
  { id: 'you',            type: 'card', icon: User,     label: 'You',         color: '#0A1A2F', showInDots: true  },
  { id: 'why',            type: 'card', icon: Sparkles, label: 'Your Why',    color: '#FD9C2D', showInDots: true  },
  { id: 'fitness',        type: 'card', icon: Dumbbell, label: 'Fitness',     color: '#38BDF8', showInDots: true  },
  { id: 'nutrition',      type: 'card', icon: Utensils, label: 'Nutrition',   color: '#22C55E', showInDots: true  },
  { id: 'faith',          type: 'card', icon: BookOpen, label: 'Faith',       color: '#C9A227', showInDots: true  },
  { id: 'routine',        type: 'card', icon: Bell,     label: 'Routine',     color: '#8B5CF6', showInDots: true  },
];

// ── Shared UI atoms ──────────────────────────────────────────────────────────
function PillButton({ selected, onClick, children, color = '#FD9C2D' }) {
  return (
    <button onPointerDown={onClick}
      className={`px-3 py-2 rounded-2xl text-sm font-semibold border-2 transition-all ${selected ? 'text-white border-transparent shadow-sm dark:shadow-none' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-white/10 hover:border-gray-200 dark:border-white/10'}`}
      style={selected ? { background: color, borderColor: color } : {}}>
      {children}
    </button>
  );
}
function RadioCard({ selected, onClick, label, desc, emoji }) {
  return (
    <button onPointerDown={onClick}
      className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${selected ? 'border-[#FD9C2D] bg-[#FD9C2D]/8' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-200 dark:border-white/10'}`}>
      {emoji && <span className="text-xl flex-shrink-0">{emoji}</span>}
      <div className="flex-1">
        <p className={`text-sm font-semibold ${selected ? 'text-[#0A1A2F] dark:text-white dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>{label}</p>
        {desc && <p className="text-xs text-gray-400 dark:text-gray-300 mt-0.5">{desc}</p>}
      </div>
      {selected && <div className="w-5 h-5 rounded-full bg-[#FD9C2D] flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" /></div>}
    </button>
  );
}
function SectionLabel({ children }) {
  return <p className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">{children}</p>;
}
function NumberInput({ label, value, onChange, min, max, unit }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-2 flex items-center justify-between gap-1.5">
      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-300 leading-tight truncate flex-1">{label}</span>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onPointerDown={() => onChange(Math.max(min, (value||min)-1))}
          className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-300 active:scale-95">−</button>
        <div className="w-10 text-center">
          <span className="text-sm font-black text-[#0A1A2F] dark:text-white">{value || min}</span>
          {unit && <span className="text-[10px] text-gray-400 dark:text-gray-300 ml-0.5">{unit}</span>}
        </div>
        <button onPointerDown={() => onChange(Math.min(max, (value||min)+1))}
          className="w-7 h-7 rounded-lg bg-[#FD9C2D]/15 flex items-center justify-center text-sm font-bold text-[#FD9C2D] active:scale-95">+</button>
      </div>
    </div>
  );
}

// ── Hook Screen ──────────────────────────────────────────────────────────────
function HookScreen({ value, onChange, onNext, onBack }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0A1A2F 0%, #0f2744 50%, #0A1A2F 100%)' }}>
      {/* Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FD9C2D, transparent)' }} />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #C9A227, transparent)' }} />
        {[...Array(22)].map((_,i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-white dark:bg-white/5"
            style={{ left:`${5+(i*17)%90}%`, top:`${3+(i*23)%85}%`, opacity: 0.1+(i%5)*0.08 }}
            animate={{ opacity:[0.08,0.35,0.08] }}
            transition={{ duration:2+(i%4), repeat:Infinity, delay:i*0.25 }} />
        ))}
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 py-8 relative z-10">
        <motion.div initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.1 }}
          className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'#FD9C2D22' }}>
            <Heart className="w-4 h-4 text-[#FD9C2D]" />
          </div>
          <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Before we dive in</span>
        </motion.div>
        <motion.p initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.2 }}
          className="text-white/50 text-sm font-medium mb-3">Be honest with yourself for a moment.</motion.p>
        <motion.h1 initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.3 }}
          className="text-3xl font-black text-white leading-tight mb-4" style={{ fontFamily:'Georgia, serif' }}>
          What's the one area of your life you've been meaning to change — but keep putting off?
        </motion.h1>
        <motion.p initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.4 }}
          className="text-white/40 text-sm leading-relaxed mb-6">There's no right answer. This is just between you and God.</motion.p>
        <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.5 }}>
          <textarea value={value} onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Write it here…" rows={4}
            className="w-full rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/25 resize-none outline-none transition-all"
            style={{ background:'rgba(255,255,255,0.07)', border:`2px solid ${focused?'#C9A227':'rgba(255,255,255,0.10)'}` }} />
          <p className="text-white/25 text-xs mt-2">Optional — but the more honest you are, the more powerful this journey becomes.</p>
        </motion.div>
      </div>
      <motion.div initial={{ y:30, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.6 }}
        className="px-6 pb-8 relative z-10 flex gap-3">
        <button onPointerDown={onBack} className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl font-semibold text-sm text-white/50" style={{ background:'rgba(255,255,255,0.07)' }}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button onPointerDown={onNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm" style={{ background:'linear-gradient(135deg, #C9A227, #FD9C2D)' }}>
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Guides Screen ────────────────────────────────────────────────────────────
const GUIDES = [
  { img: gideonImg,  name: 'Gideon',       role: 'Spiritual Mentor',  color: '#C9A227', quote: '"Your Word is a lamp to my feet. Let\'s walk in it together."',        emoji: '✝️' },
  { img: hannahImg,  name: 'Hannah',        role: 'Mindset Coach',     color: '#AFC7E3', quote: '"Whatever you\'re carrying — I\'m here. Let\'s talk."',                emoji: '💙' },
  { img: davidImg,   name: 'Coach David',   role: 'Fitness Guide',     color: '#38BDF8', quote: '"Your body is capable of more than you think. Let\'s prove it."',     emoji: '💪' },
  { img: danielImg,  name: 'Chef Daniel',   role: 'Nutrition Expert',  color: '#22c55e', quote: '"Good food isn\'t a reward. It\'s how you honor your body."',          emoji: '🥗' },
  { img: paulImg,    name: 'Coach Paul',    role: 'Life Coach',        color: '#A78BFA', quote: '"Clarity comes before change. Let\'s find yours."',                   emoji: '🎯' },
];

function GuidesScreen({ onNext, onBack }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef(null);
  const CARD_W = 200;
  const GAP = 14;

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollTo({ left: activeIdx*(CARD_W+GAP) - el.clientWidth/2 + CARD_W/2, behavior:'smooth' });
  }, [activeIdx]);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background:'linear-gradient(160deg, #0A1A2F 0%, #060f1d 60%, #0A1A2F 100%)' }}>
      {/* Bg glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute w-96 h-80 rounded-full"
          style={{ top:-80, left:'50%', transform:'translateX(-50%)', background:`radial-gradient(circle, ${GUIDES[activeIdx].color}22, transparent 70%)` }}
          animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:3, repeat:Infinity }} />
        {[...Array(18)].map((_,i) => (
          <div key={i} className="absolute rounded-full bg-white dark:bg-white/5"
            style={{ width:2, height:2, left:`${6+(i*13)%86}%`, top:`${4+(i*19)%82}%`, opacity:0.06+(i%5)*0.05 }} />
        ))}
      </div>
      {/* Header */}
      <div className="relative z-10 pt-10 pb-3 px-6 text-center">
        <motion.div initial={{ y:-16, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
          style={{ background:'rgba(201,162,39,0.15)', border:'1px solid rgba(201,162,39,0.3)' }}>
          <Sparkles className="w-3 h-3 text-[#C9A227]" />
          <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest">Your Personal Team</span>
        </motion.div>
        <motion.h1 initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.2 }}
          className="text-3xl font-black text-white leading-tight" style={{ fontFamily:'Georgia, serif' }}>
          Meet Your Guides
        </motion.h1>
        <motion.p initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.3 }}
          className="text-white/45 text-sm mt-2 leading-relaxed">
          Five AI coaches, each an expert in their own lane.
          <br />We're here to help.
        </motion.p>
      </div>
      {/* Scrollable cards */}
      <div className="relative z-10 flex-1 flex flex-col justify-center min-h-0 overflow-hidden">
        <div ref={scrollRef}
          className="flex gap-3.5 overflow-x-auto pb-4 px-8"
          style={{ scrollbarWidth:'none', msOverflowStyle:'none', scrollSnapType:'x mandatory' }}>
          {GUIDES.map((g, i) => (
            <motion.button key={g.name}
              initial={{ y:30, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.12+i*0.07 }}
              onPointerDown={() => setActiveIdx(i)}
              className="flex-shrink-0 flex flex-col rounded-3xl overflow-hidden text-left transition-all"
              style={{
                width: CARD_W, scrollSnapAlign:'center',
                border:`2px solid ${activeIdx===i ? g.color : 'rgba(255,255,255,0.08)'}`,
                background: activeIdx===i ? `linear-gradient(160deg, ${g.color}20, rgba(255,255,255,0.03))` : 'rgba(255,255,255,0.04)',
                transform: activeIdx===i ? 'scale(1.02)' : 'scale(0.97)',
                transition: 'all 0.2s',
              }}>
              <div className="relative overflow-hidden" style={{ height:190, background:`${g.color}15` }}>
                <img src={g.img} alt={g.name} className="w-full h-full object-cover object-top" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ background:`${g.color}CC`, color:'#fff' }}>{g.role}</div>
              </div>
              <div className="p-3.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm">{g.emoji}</span>
                  <p className="text-white font-black text-sm">{g.name}</p>
                </div>
                <p className="text-white/45 text-[11px] leading-relaxed italic">{g.quote}</p>
              </div>
            </motion.button>
          ))}
        </div>
        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-1">
          {GUIDES.map((g,i) => (
            <motion.div key={i} className="rounded-full transition-all"
              style={{ height:5, width: activeIdx===i?18:5, background: activeIdx===i ? GUIDES[activeIdx].color : 'rgba(255,255,255,0.2)', transition:'all 0.25s' }} />
          ))}
        </div>
      </div>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
        className="relative z-10 text-center text-white/25 text-[10px] px-6 mt-2">
        All five are AI-powered — here to guide, not replace, professional advice.
      </motion.p>
      <motion.div initial={{ y:30, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.9 }}
        className="relative z-10 px-6 pb-8 pt-3 flex gap-3">
        <button onPointerDown={onBack} className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl font-semibold text-sm text-white/50" style={{ background:'rgba(255,255,255,0.07)' }}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button onPointerDown={onNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm" style={{ background:'linear-gradient(135deg, #C9A227, #FD9C2D)' }}>
          Let's build your profile <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Fact Screens ─────────────────────────────────────────────────────────────
const FACTS = {
  fact_fitness: {
    emoji:'💪', color:'#38BDF8', gradFrom:'#0a2540', gradTo:'#0d3560',
    stat:'3×', statLabel:'more likely to reach their goals',
    headline:'People who track their workouts are 3 times more likely to hit their targets.',
    body:'Consistency beats intensity every time. It\'s not about the perfect workout — it\'s about showing up again and again. Coach David is here to make that easier.',
    verse:'"I can do all things through Christ who strengthens me." — Philippians 4:13',
    cta:'Set up your fitness profile',
  },
  fact_nutrition: {
    emoji:'🥗', color:'#22c55e', gradFrom:'#052e16', gradTo:'#0a3d1e',
    stat:'80%', statLabel:'of body transformation happens in the kitchen',
    headline:'Nutrition is the foundation of everything — your energy, focus, mood, and recovery.',
    body:'You don\'t need to eat perfectly. You need to eat intentionally. Chef Daniel will help you build a relationship with food that honors your body and your goals.',
    verse:'"Do you not know that your body is a temple of the Holy Spirit?" — 1 Corinthians 6:19',
    cta:'Set up your nutrition profile',
  },
  fact_faith: {
    emoji:'📖', color:'#C9A227', gradFrom:'#1a1100', gradTo:'#261900',
    stat:'5 min', statLabel:'of daily scripture can reshape your entire outlook',
    headline:'People who read scripture daily report significantly lower anxiety and higher life satisfaction.',
    body:'The Bible isn\'t just a book — it\'s a living conversation. Gideon is here to make God\'s Word feel personal, practical, and powerful in your everyday life.',
    verse:'"Your word is a lamp to my feet and a light to my path." — Psalm 119:105',
    cta:'Tell us where you are in your faith journey',
  },
  fact_growth: {
    emoji:'🌱', color:'#AFC7E3', gradFrom:'#0f1e30', gradTo:'#162a42',
    stat:'5 min', statLabel:'of daily journaling reduces stress by up to 28%',
    headline:'The most successful people share one habit: they actively invest in knowing themselves.',
    body:'Growth isn\'t an accident. It\'s the result of intentional reflection, honest questions, and the courage to change. Hannah and Coach Paul are here to guide that process.',
    verse:'"As iron sharpens iron, so one person sharpens another." — Proverbs 27:17',
    cta:'Tell us about your growth goals',
  },
};

function FactScreen({ factId, onNext, onBack }) {
  const f = FACTS[factId];
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background:`linear-gradient(160deg, ${f.gradFrom} 0%, ${f.gradTo} 100%)` }}
      onPointerDown={onNext}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-15" style={{ background:`radial-gradient(ellipse, ${f.color}, transparent 70%)` }} />
        {[...Array(14)].map((_,i) => (
          <div key={i} className="absolute rounded-full bg-white dark:bg-white/5" style={{ width:2, height:2, left:`${6+(i*15)%88}%`, top:`${4+(i*21)%82}%`, opacity:0.05+(i%5)*0.05 }} />
        ))}
      </div>
      <div className="flex-1 flex flex-col justify-center px-7 py-8 relative z-10 max-w-md mx-auto w-full">
        <motion.div initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', damping:12, stiffness:200, delay:0.05 }}
          className="text-6xl mb-7">{f.emoji}</motion.div>
        <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.15 }}>
          <p className="font-black leading-none mb-1" style={{ fontSize:'4.5rem', color:f.color, fontFamily:'Georgia, serif' }}>{f.stat}</p>
          <p className="text-white/50 text-sm font-semibold mb-6">{f.statLabel}</p>
        </motion.div>
        <motion.p initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.25 }}
          className="text-white font-bold text-xl leading-snug mb-4" style={{ fontFamily:'Georgia, serif' }}>{f.headline}</motion.p>
        <motion.p initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.35 }}
          className="text-white/50 text-sm leading-relaxed mb-6">{f.body}</motion.p>
        <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.45 }}
          className="flex gap-3 rounded-2xl px-4 py-3" style={{ background:`${f.color}18`, border:`1px solid ${f.color}30` }}>
          <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color:f.color }} />
          <p className="text-xs italic leading-relaxed" style={{ color:f.color }}>{f.verse}</p>
        </motion.div>
      </div>
      <motion.div initial={{ y:30, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.55 }}
        className="relative z-10 px-6 pb-8 flex gap-3" onPointerDown={e => e.stopPropagation()}>
        <button onPointerDown={onBack} className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl font-semibold text-sm text-white/50" style={{ background:'rgba(255,255,255,0.07)' }}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button onPointerDown={onNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm" style={{ background:`linear-gradient(135deg, ${f.color}BB, ${f.color})` }}>
          {f.cta} <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
        className="relative z-10 text-center text-white/25 text-[10px] pb-3">Tap anywhere to continue</motion.p>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OnboardingFlow({ onComplete }) {
  const [step, setStep]   = useState(0);
  const [saving, setSaving] = useState(false);

  const [ageGroup, setAgeGroup]         = useState('');
  const [openDoc, setOpenDoc]           = useState(null);
  const [acceptedDocs, setAcceptedDocs] = useState({ terms:false, privacy:false, waiver:false, subscription:false });
  const [masterChecked, setMasterChecked] = useState(false);
  const [hookAnswer, setHookAnswer]     = useState('');

  const allDocsAccepted = Object.values(acceptedDocs).every(Boolean);
  const legalComplete   = ageGroup === '18plus' || ageGroup === '13to17';
  const legalCanAdvance = legalComplete && allDocsAccepted && masterChecked;

  const [d, setD] = useState({
    full_name:'', dob:'', biological_sex:'',
    motivations:[], life_stage:'',
    fitness_goals:[], fitness_level:'', height_ft:'', height_in:'', weight_lbs:'', goal_weight_lbs:'',
    workout_days:3, workout_duration:'', equipment:[], preferred_workout_time:'', injuries:'',
    diet_type:'', allergies:[], meals_per_day:'', cooking_time:'',
    bible_level:'', bible_translation:'', bible_topics:[], devotional_depth:'', in_church:'',
    growth_areas:[], core_values:[], coaching_style:'', goal_90_day:'',
    wake_time:'06:30', sleep_time:'22:30', job_type:'',
    notif_devotional:true, notif_workout:true, notif_meals:true, notif_reflection:true,
  });

  const set    = (k,v) => setD(p => ({ ...p, [k]:v }));
  const toggle = (k,v) => setD(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(i=>i!==v) : [...p[k],v] }));
  const toggleAllergy = v => {
    if (v==='none') { set('allergies',['none']); return; }
    setD(p => ({ ...p, allergies: p.allergies.includes(v) ? p.allergies.filter(i=>i!==v) : [...p.allergies.filter(i=>i!=='none'),v] }));
  };

  const canAdvance = () => {
    const id = STEPS[step].id;
    if (id==='legal') return legalCanAdvance;
    if (id==='you')   return d.full_name.trim().length > 0;
    return true;
  };
  const next = () => { if (step===STEPS.length-1) handleComplete(); else setStep(s=>s+1); };
  const back = () => { if (step>0) setStep(s=>s-1); };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        terms_accepted_at:new Date().toISOString(), terms_version:'2026-03-12',
        age_group:ageGroup,
        main_goal_text: hookAnswer.trim()||undefined,
        full_name:d.full_name.trim(), dob:d.dob, biological_sex:d.biological_sex,
        motivations:d.motivations, life_stage:d.life_stage,
        fitness_goals:d.fitness_goals, fitness_level:d.fitness_level,
        height_ft:d.height_ft, height_in:d.height_in, weight_lbs:d.weight_lbs, goal_weight_lbs:d.goal_weight_lbs,
        workout_days:d.workout_days, workout_duration:d.workout_duration,
        equipment:d.equipment, preferred_workout_time:d.preferred_workout_time, injuries:d.injuries,
        diet_type:d.diet_type, allergies:d.allergies, meals_per_day:d.meals_per_day, cooking_time:d.cooking_time,
        bible_level:d.bible_level, bible_translation:d.bible_translation, bible_topics:d.bible_topics,
        devotional_depth:d.devotional_depth, in_church:d.in_church,
        growth_areas:d.growth_areas, core_values:d.core_values, coaching_style:d.coaching_style, goal_90_day:d.goal_90_day,
        wake_time:d.wake_time, sleep_time:d.sleep_time, job_type:d.job_type,
        reminder_settings:{
          devotional:{enabled:d.notif_devotional,time:'07:00'},
          workout:{enabled:d.notif_workout,time:'06:00'},
          meals:{enabled:d.notif_meals,time:'12:00'},
          reflection:{enabled:d.notif_reflection,time:'21:00'},
        },
        onboarding_completed:true, onboarding_version:4,
        spiritual_interests:d.bible_topics, health_goals:d.fitness_goals, dietary_preferences:d.allergies,
      });
      onComplete();
    } catch { onComplete(); }
    finally { setSaving(false); }
  };

  // Route full-bleed screens
  const cfg = STEPS[step];
  if (cfg.id === 'hook')           return <AnimatePresence mode="wait"><HookScreen   key="hook"   value={hookAnswer} onChange={setHookAnswer} onNext={next} onBack={back} /></AnimatePresence>;
  if (cfg.id === 'guides')         return <AnimatePresence mode="wait"><GuidesScreen key="guides" onNext={next} onBack={back} /></AnimatePresence>;
  if (cfg.id.startsWith('fact_'))  return <AnimatePresence mode="wait"><FactScreen   key={cfg.id} factId={cfg.id} onNext={next} onBack={back} /></AnimatePresence>;

  // Card screens
  const IconComp  = cfg.icon;
  const dotSteps  = STEPS.filter(s => s.showInDots);
  const dotIndex  = dotSteps.findIndex(s => s.id === cfg.id);
  const pct       = Math.round((dotIndex / dotSteps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A1A2F] overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-start py-6 px-4">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:cfg.color+'30' }}>
                  <IconComp className="w-4 h-4" style={{ color:cfg.color }} />
                </div>
                <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">{cfg.label}</span>
              </div>
              <span className="text-white/40 text-xs">{dotIndex+1} of {dotSteps.length}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
              <motion.div className="h-full rounded-full" style={{ background:`linear-gradient(90deg, #C9A227, ${cfg.color})` }}
                animate={{ width:`${pct+(100/dotSteps.length)}%` }} transition={{ duration:0.4 }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }} transition={{ duration:0.22 }}
              className="bg-white dark:bg-white/5 rounded-3xl shadow-2xl overflow-hidden">

              {/* Card header */}
              <div className="px-6 pt-6 pb-4" style={{ background:`linear-gradient(135deg, ${cfg.color}18, ${cfg.color}05)` }}>
                <h2 className="text-xl font-black text-[#0A1A2F] dark:text-white leading-tight">
                  {cfg.id==='legal'     && 'Before you begin 📋'}
                  {cfg.id==='you'       && 'Welcome to Prosperity Revived 🙏'}
                  {cfg.id==='why'       && "What's bringing you here?"}
                  {cfg.id==='fitness'   && 'Fitness & Body'}
                  {cfg.id==='nutrition' && 'Nutrition & eating'}
                  {cfg.id==='faith'     && 'Faith & Bible study'}
                  {cfg.id==='growth'    && 'Personal growth'}
                  {cfg.id==='routine'   && 'Your daily routine'}
                </h2>
                <p className="text-gray-500 dark:text-gray-300 text-xs mt-1">
                  {cfg.id==='legal'     && 'Please review and accept our legal documents to continue.'}
                  {cfg.id==='you'       && 'A few quick questions so everything feels personal from day one.'}
                  {cfg.id==='why'       && 'Pick everything that resonates — no right answers.'}
                  {cfg.id==='fitness'   && 'This helps Coach David personalise your workouts.'}
                  {cfg.id==='nutrition' && "Helps Chef Daniel plan meals you'll actually enjoy."}
                  {cfg.id==='faith'     && 'So Gideon can meet you exactly where you are.'}
                  {cfg.id==='growth'    && 'Hannah will use this to guide your growth journey.'}
                  {cfg.id==='routine'   && "We'll send reminders that fit your actual schedule."}
                </p>
              </div>

              {/* Content */}
              <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">

                {/* LEGAL */}
                {cfg.id==='legal' && (() => {
                  const DOCS_LIST = [
                    { key:'terms',        icon:'📄', label:'Terms & Conditions',      sub:'Usage rules, AI disclosure, liability' },
                    { key:'privacy',      icon:'🔒', label:'Privacy Policy',           sub:'How we collect & protect your data' },
                    { key:'waiver',       icon:'❤️', label:'Health & Wellness Waiver', sub:'Exercise risks, AI chatbot limits' },
                    { key:'subscription', icon:'💳', label:'Subscription Terms',       sub:'Billing, auto-renewal, cancellation' },
                  ];
                  return (
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">Age Confirmation *</p>
                        <div className="space-y-2">
                          {[
                            { id:'18plus',  label:'I am 18 years of age or older' },
                            { id:'13to17',  label:'I am 13–17 and have parental consent' },
                            { id:'under13', label:'I am under 13', red:true },
                          ].map(opt => (
                            <button key={opt.id} onPointerDown={() => setAgeGroup(opt.id)}
                              className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${ageGroup===opt.id ? (opt.red?'border-red-400 bg-red-50':'border-[#FD9C2D] bg-[#FD9C2D]/8') : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-200 dark:border-white/10'}`}>
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${ageGroup===opt.id ? (opt.red?'border-red-400 bg-red-400':'border-[#FD9C2D] bg-[#FD9C2D]') : 'border-gray-300 dark:border-white/15'}`}>
                                {ageGroup===opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-white/5" />}
                              </div>
                              <span className={`text-sm font-semibold ${ageGroup===opt.id ? (opt.red?'text-red-600':'text-[#0A1A2F] dark:text-white dark:text-white') : 'text-gray-700 dark:text-gray-200'}`}>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                        {ageGroup==='under13' && (
                          <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} className="mt-3 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-red-700">Sorry — you must be at least 13 to use this app</p>
                              <p className="text-xs text-red-600 mt-1 leading-relaxed">Prosperity Revived is not available to users under 13 in compliance with COPPA.</p>
                            </div>
                          </motion.div>
                        )}
                        {ageGroup==='13to17' && (
                          <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                            <p className="text-xs text-amber-800 leading-relaxed"><strong>Parental consent required.</strong> A parent or guardian must review and approve your use of this app.</p>
                          </motion.div>
                        )}
                      </div>
                      {(ageGroup==='18plus'||ageGroup==='13to17') && (
                        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">Review & Accept Documents *</p>
                          {DOCS_LIST.map(({ key, icon, label, sub }) => (
                            <div key={key} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${acceptedDocs[key]?'border-green-300 bg-green-50':'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5'}`}>
                              <span className="text-xl flex-shrink-0">{icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white leading-tight">{label}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-300 mt-0.5">{sub}</p>
                              </div>
                              {acceptedDocs[key] ? (
                                <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-white" /></div>
                              ) : (
                                <button onPointerDown={() => setOpenDoc(key)} className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-all flex-shrink-0">Review</button>
                              )}
                            </div>
                          ))}
                          <p className="text-xs text-center text-gray-400 dark:text-gray-300 pt-1">{Object.values(acceptedDocs).filter(Boolean).length} of 4 reviewed</p>
                        </motion.div>
                      )}
                      {allDocsAccepted && (
                        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                          <button onPointerDown={() => setMasterChecked(v=>!v)}
                            className={`w-full flex items-start gap-3 px-4 py-4 rounded-2xl border-2 text-left transition-all ${masterChecked?'border-[#0A1A2F] bg-[#0A1A2F]':'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-gray-300 dark:border-white/15'}`}>
                            <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${masterChecked?'bg-[#FD9C2D] border-[#FD9C2D]':'border-gray-400 bg-white dark:bg-white/5'}`}>
                              {masterChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                            <p className={`text-sm leading-relaxed font-medium ${masterChecked?'text-white':'text-gray-700 dark:text-gray-200'}`}>
                              I have read and agree to all of the documents above. I understand the AI Disclosure, Health & Wellness Waiver, Privacy Policy, and Subscription Terms.
                            </p>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  );
                })()}

                {/* YOU */}
                {cfg.id==='you' && (
                  <div className="space-y-3">
                    <div>
                      <SectionLabel>First name *</SectionLabel>
                      <input autoFocus type="text" value={d.full_name} onChange={e=>set('full_name',e.target.value)}
                        placeholder="What should we call you?"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-[#0A1A2F] dark:text-white font-semibold text-sm focus:outline-none focus:border-[#FD9C2D] transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <SectionLabel>Date of birth</SectionLabel>
                        <input type="date" value={d.dob} onChange={e=>set('dob',e.target.value)}
                          className="w-full px-3 py-3 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#FD9C2D]" />
                      </div>
                      <div>
                        <SectionLabel>Biological sex</SectionLabel>
                        <div className="flex gap-2">
                          {['Male','Female'].map(s => (
                            <button key={s} onPointerDown={() => set('biological_sex',s)}
                              className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all ${d.biological_sex===s?'bg-[#0A1A2F] border-[#0A1A2F] text-white':'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-200'}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {hookAnswer.trim() && (
                      <div className="bg-[#FFF9EC] rounded-2xl p-3 flex gap-2 border border-[#FAD98D]/40">
                        <span className="text-lg">🎯</span>
                        <div>
                          <p className="text-xs font-bold text-[#0A1A2F] dark:text-white mb-0.5">Your north star</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">"{hookAnswer.trim()}"</p>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-2xl p-3 flex gap-2">
                      <span className="text-lg">🔒</span>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">Your information is private and only used to personalise your experience.</p>
                    </div>
                  </div>
                )}

                {/* WHY */}
                {cfg.id==='why' && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>What's bringing you here? (pick all that apply)</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {WHY_OPTIONS.map(o => <PillButton key={o.id} selected={d.motivations.includes(o.id)} onClick={() => toggle('motivations',o.id)}>{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Life stage</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {LIFE_STAGES.map(o => <PillButton key={o.id} selected={d.life_stage===o.id} onClick={() => set('life_stage',o.id)}>{o.label}</PillButton>)}
                      </div>
                    </div>
                  </div>
                )}

                {/* FITNESS */}
                {cfg.id==='fitness' && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>Fitness goals</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {FITNESS_GOALS.map(o => <PillButton key={o.id} selected={d.fitness_goals.includes(o.id)} onClick={() => toggle('fitness_goals',o.id)} color="#38BDF8">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Current fitness level</SectionLabel>
                      <div className="space-y-2">
                        {FITNESS_LEVELS.map(o => <RadioCard key={o.id} selected={d.fitness_level===o.id} onClick={() => set('fitness_level',o.id)} label={o.label} desc={o.desc} emoji={o.emoji} />)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <NumberInput label="Height ft" value={d.height_ft} onChange={v=>set('height_ft',v)} min={3} max={8} unit="ft" />
                      <NumberInput label="In" value={d.height_in} onChange={v=>set('height_in',v)} min={0} max={11} unit="in" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <NumberInput label="Weight" value={d.weight_lbs} onChange={v=>set('weight_lbs',v)} min={80} max={500} unit="lbs" />
                      <NumberInput label="Goal wt" value={d.goal_weight_lbs} onChange={v=>set('goal_weight_lbs',v)} min={80} max={500} unit="lbs" />
                    </div>
                    <NumberInput label="Workout days / week" value={d.workout_days} onChange={v=>set('workout_days',v)} min={1} max={7} unit="days" />
                    <div>
                      <SectionLabel>Workout duration</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {WORKOUT_DURATIONS.map(o => <PillButton key={o.id} selected={d.workout_duration===o.id} onClick={() => set('workout_duration',o.id)} color="#38BDF8">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Equipment available</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {EQUIPMENT.map(o => <PillButton key={o.id} selected={d.equipment.includes(o.id)} onClick={() => toggle('equipment',o.id)} color="#38BDF8">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Injuries or limitations (optional)</SectionLabel>
                      <textarea value={d.injuries} onChange={e=>set('injuries',e.target.value)} placeholder="e.g. bad knees, lower back pain…" rows={2}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#38BDF8] resize-none" />
                    </div>
                  </div>
                )}

                {/* NUTRITION */}
                {cfg.id==='nutrition' && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>Diet type</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {DIET_TYPES.map(o => <PillButton key={o.id} selected={d.diet_type===o.id} onClick={() => set('diet_type',o.id)} color="#22C55E">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Allergies or dietary restrictions</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {ALLERGENS.map(o => <PillButton key={o.id} selected={d.allergies.includes(o.id)} onClick={() => toggleAllergy(o.id)} color="#22C55E">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Meals per day</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {MEALS_PER_DAY.map(o => <PillButton key={o.id} selected={d.meals_per_day===o.id} onClick={() => set('meals_per_day',o.id)} color="#22C55E">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>How much time to cook?</SectionLabel>
                      <div className="space-y-2">
                        {COOKING_TIMES.map(o => <RadioCard key={o.id} selected={d.cooking_time===o.id} onClick={() => set('cooking_time',o.id)} label={o.label} />)}
                      </div>
                    </div>
                  </div>
                )}

                {/* FAITH */}
                {cfg.id==='faith' && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>Where are you in your Bible journey?</SectionLabel>
                      <div className="space-y-2">
                        {BIBLE_LEVELS.map(o => <RadioCard key={o.id} selected={d.bible_level===o.id} onClick={() => set('bible_level',o.id)} label={o.label} emoji={o.emoji} />)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Preferred translation</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {BIBLE_TRANSLATIONS.map(o => <PillButton key={o.id} selected={d.bible_translation===o.id} onClick={() => set('bible_translation',o.id)} color="#C9A227">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Topics you want to explore</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {BIBLE_TOPICS.map(o => <PillButton key={o.id} selected={d.bible_topics.includes(o.id)} onClick={() => toggle('bible_topics',o.id)} color="#C9A227">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Devotional depth</SectionLabel>
                      <div className="space-y-2">
                        {DEVOTIONAL_DEPTHS.map(o => <RadioCard key={o.id} selected={d.devotional_depth===o.id} onClick={() => set('devotional_depth',o.id)} label={o.label} />)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Are you currently in a church community?</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {[{id:'yes',label:'✅ Yes'},{id:'no',label:'🚶 Not currently'},{id:'looking',label:'🔍 Looking for one'}].map(o => (
                          <PillButton key={o.id} selected={d.in_church===o.id} onClick={() => set('in_church',o.id)} color="#C9A227">{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* GROWTH */}
                {cfg.id==='growth' && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>Areas you want to grow in</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {GROWTH_AREAS.map(o => <PillButton key={o.id} selected={d.growth_areas.includes(o.id)} onClick={() => toggle('growth_areas',o.id)} color="#AFC7E3">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Your core values (pick up to 4)</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {CORE_VALUES.map(o => (
                          <PillButton key={o.id} selected={d.core_values.includes(o.id)} color="#AFC7E3"
                            onClick={() => { if (d.core_values.includes(o.id)||d.core_values.length<4) toggle('core_values',o.id); }}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Coaching style that works best for you</SectionLabel>
                      <div className="space-y-2">
                        {COACHING_STYLES.map(o => <RadioCard key={o.id} selected={d.coaching_style===o.id} onClick={() => set('coaching_style',o.id)} label={o.label} emoji={o.emoji} />)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>What do you want to achieve in 90 days? (optional)</SectionLabel>
                      <textarea value={d.goal_90_day} onChange={e=>set('goal_90_day',e.target.value)}
                        placeholder="e.g. Feel more confident in my faith and drop 10 lbs."
                        rows={3} className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#AFC7E3] resize-none" />
                    </div>
                  </div>
                )}

                {/* ROUTINE */}
                {cfg.id==='routine' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <SectionLabel>Wake time</SectionLabel>
                        <input type="time" value={d.wake_time} onChange={e=>set('wake_time',e.target.value)}
                          className="w-full px-3 py-3 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#8B5CF6]" />
                      </div>
                      <div>
                        <SectionLabel>Sleep time</SectionLabel>
                        <input type="time" value={d.sleep_time} onChange={e=>set('sleep_time',e.target.value)}
                          className="w-full px-3 py-3 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#8B5CF6]" />
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Work schedule</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {JOB_TYPES.map(o => <PillButton key={o.id} selected={d.job_type===o.id} onClick={() => set('job_type',o.id)} color="#8B5CF6">{o.label}</PillButton>)}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Daily reminders</SectionLabel>
                      <div className="space-y-2">
                        {[
                          { key:'notif_devotional', label:'📖 Morning devotional', time:'7:00 AM' },
                          { key:'notif_workout',    label:'💪 Workout reminder',   time:'6:00 AM' },
                          { key:'notif_meals',      label:'🍽️ Meal logging',       time:'12:00 PM' },
                          { key:'notif_reflection', label:'🌙 Evening reflection', time:'9:00 PM' },
                        ].map(({ key, label, time }) => (
                          <div key={key} className="flex items-center justify-between bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-[#0A1A2F] dark:text-white dark:text-white">{label}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-300">{time}</p>
                            </div>
                            <button onPointerDown={() => set(key,!d[key])}
                              className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${d[key]?'bg-[#8B5CF6]':'bg-gray-200'}`}>
                              <div className={`absolute top-0.5 w-5 h-5 bg-white dark:bg-white/5 rounded-full shadow transition-all ${d[key]?'left-[22px]':'left-0.5'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Nav */}
              <div className="px-5 py-4 border-t border-gray-50 dark:border-white/5 flex gap-3">
                {step > 0 && (
                  <button onPointerDown={back} className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <button onPointerDown={() => { if (!canAdvance()) return; next(); }}
                  disabled={!canAdvance()||saving}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${canAdvance()&&!saving?'text-white shadow-lg dark:shadow-none':'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-300 cursor-not-allowed'}`}
                  style={canAdvance()&&!saving?{background:`linear-gradient(135deg, ${cfg.color}, #FD9C2D)`}:{}}>
                  {saving ? <>⏳ Saving…</> : step===STEPS.length-1 ? <><Sparkles className="w-4 h-4" /> Start My Journey</> : <>Continue <ChevronRight className="w-4 h-4" /></>}
                </button>
              </div>

              {step > 0 && step < STEPS.length-1 && cfg.id !== 'legal' && (
                <button onPointerDown={handleComplete} className="w-full text-center text-xs text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:text-gray-300 pb-4 transition-colors">
                  Skip for now — I'll fill this in later
                </button>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {dotSteps.map((s,i) => (
              <div key={s.id} className={`h-1.5 rounded-full transition-all ${i===dotIndex?'w-6 bg-[#FD9C2D]':i<dotIndex?'w-3 bg-white/40':'w-3 bg-white/15'}`} />
            ))}
          </div>
        </div>
      </div>

      {openDoc && (
        <LegalDocModal doc={openDoc}
          onAccept={() => { setAcceptedDocs(p => ({ ...p, [openDoc]:true })); setOpenDoc(null); }}
          onClose={() => setOpenDoc(null)} />
      )}
    </div>
  );
}