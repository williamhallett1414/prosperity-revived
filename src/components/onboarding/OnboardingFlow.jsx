import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  ChevronRight, ChevronLeft, Sparkles, Check, X,
  Heart, Dumbbell, Utensils, BookOpen, Brain, Bell, User
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const WHY_OPTIONS = [
  { id: 'lose_weight',   label: '🔥 Lose weight' },
  { id: 'build_muscle',  label: '💪 Build muscle' },
  { id: 'eat_healthier', label: '🥗 Eat healthier' },
  { id: 'grow_spiritually', label: '🙏 Grow spiritually' },
  { id: 'manage_stress', label: '🧘 Manage stress / anxiety' },
  { id: 'better_habits', label: '✅ Build better habits' },
  { id: 'relationships', label: '💞 Improve relationships' },
  { id: 'find_purpose',  label: '🌟 Find purpose' },
  { id: 'just_exploring',label: '🔍 Just exploring' },
];

const LIFE_STAGES = [
  { id: 'student',       label: '🎓 Student' },
  { id: 'early_career',  label: '🚀 Early career' },
  { id: 'mid_career',    label: '💼 Mid-career' },
  { id: 'parent',        label: '👶 Parent' },
  { id: 'transition',    label: '🔄 In transition' },
  { id: 'other',         label: '✨ Other' },
];

const FITNESS_GOALS = [
  { id: 'lose_fat',      label: '🔥 Lose fat' },
  { id: 'build_muscle',  label: '💪 Build muscle' },
  { id: 'get_stronger',  label: '🏋️ Get stronger' },
  { id: 'more_endurance',label: '🏃 More endurance' },
  { id: 'stay_active',   label: '⚡ Stay active' },
  { id: 'sport_perf',    label: '🏅 Sport performance' },
];

const FITNESS_LEVELS = [
  { id: 'beginner',      label: 'Beginner',      desc: 'New to exercise or just getting back', emoji: '🌱' },
  { id: 'intermediate',  label: 'Intermediate',  desc: 'Regular exercise, 1–3 years',           emoji: '💪' },
  { id: 'advanced',      label: 'Advanced',       desc: 'Consistent & experienced, 3+ years',    emoji: '🏆' },
];

const EQUIPMENT = [
  { id: 'none',          label: '🙅 No equipment' },
  { id: 'dumbbells',     label: '🏋️ Dumbbells' },
  { id: 'bands',         label: '🪢 Resistance bands' },
  { id: 'home_gym',      label: '🏠 Full home gym' },
  { id: 'gym',           label: '🏢 Gym membership' },
];

const WORKOUT_TIMES = [
  { id: 'morning',   label: '🌅 Morning (5–9am)' },
  { id: 'midday',    label: '☀️ Midday' },
  { id: 'afternoon', label: '🌤️ Afternoon' },
  { id: 'evening',   label: '🌙 Evening' },
];

const DIET_TYPES = [
  { id: 'no_restrictions', label: '🍽️ No restrictions' },
  { id: 'vegetarian',      label: '🥦 Vegetarian' },
  { id: 'vegan',           label: '🌱 Vegan' },
  { id: 'keto',            label: '🥑 Keto / Low-carb' },
  { id: 'paleo',           label: '🍖 Paleo' },
  { id: 'gluten_free',     label: '🌾 Gluten-free' },
  { id: 'halal',           label: '☪️ Halal' },
  { id: 'kosher',          label: '✡️ Kosher' },
];

const ALLERGIES = [
  { id: 'nuts',      label: '🥜 Tree nuts' },
  { id: 'peanuts',   label: '🥜 Peanuts' },
  { id: 'dairy',     label: '🥛 Dairy' },
  { id: 'eggs',      label: '🥚 Eggs' },
  { id: 'soy',       label: '🫘 Soy' },
  { id: 'shellfish', label: '🦐 Shellfish' },
  { id: 'fish',      label: '🐟 Fish' },
  { id: 'gluten',    label: '🌾 Gluten' },
  { id: 'none',      label: '✅ None' },
];

const MEALS_PER_DAY = [
  { id: '2',  label: '2 meals' },
  { id: '3',  label: '3 meals' },
  { id: '3+', label: '3 + snacks' },
  { id: 'if', label: '⏱️ Intermittent fasting' },
];

const BIBLE_LEVELS = [
  { id: 'new',       label: '🌱 New to the Bible', desc: 'Just starting out' },
  { id: 'some',      label: '📖 Some familiarity',  desc: 'Know the basics' },
  { id: 'regular',   label: '✝️ Regular reader',    desc: 'Read often' },
  { id: 'deep',      label: '🎓 Deep student',      desc: 'In-depth study' },
];

const BIBLE_TRANSLATIONS = [
  { id: 'NIV',  label: 'NIV' },
  { id: 'ESV',  label: 'ESV' },
  { id: 'NLT',  label: 'NLT' },
  { id: 'KJV',  label: 'KJV' },
  { id: 'NKJV', label: 'NKJV' },
  { id: 'MSG',  label: 'The Message' },
  { id: 'any',  label: 'No preference' },
];

const BIBLE_TOPICS = [
  { id: 'prayer',       label: '🙏 Prayer' },
  { id: 'identity',     label: '✨ Identity in Christ' },
  { id: 'anxiety',      label: '🕊️ Anxiety / Fear' },
  { id: 'purpose',      label: '🌟 Purpose / Calling' },
  { id: 'relationships',label: '💞 Relationships' },
  { id: 'grief',        label: '💔 Grief / Loss' },
  { id: 'finances',     label: '💰 Financial wisdom' },
  { id: 'family',       label: '👨‍👩‍👧 Family' },
  { id: 'marriage',     label: '💍 Marriage' },
  { id: 'general',      label: '📚 General growth' },
];

const DEVOTIONAL_DEPTH = [
  { id: 'short',   label: '⚡ Short & encouraging', desc: '2–3 min' },
  { id: 'medium',  label: '📖 Study + reflection',   desc: '10–15 min' },
  { id: 'deep',    label: '🎓 Deep dive',            desc: '30+ min' },
];

const GROWTH_AREAS = [
  { id: 'emotional_intelligence', label: '🧠 Emotional intelligence' },
  { id: 'confidence',             label: '💪 Confidence & self-worth' },
  { id: 'stress_anxiety',         label: '🌿 Stress & anxiety' },
  { id: 'habits',                 label: '✅ Habits & consistency' },
  { id: 'relationships',          label: '💞 Relationships' },
  { id: 'career_purpose',         label: '🚀 Career & purpose' },
  { id: 'money_mindset',          label: '💰 Money mindset' },
  { id: 'leadership',             label: '🏅 Leadership' },
  { id: 'identity',               label: '✨ Identity' },
];

const CORE_VALUES = [
  { id: 'family',        label: '👨‍👩‍👧 Family' },
  { id: 'freedom',       label: '🦋 Freedom' },
  { id: 'growth',        label: '🌱 Growth' },
  { id: 'faith',         label: '🙏 Faith' },
  { id: 'health',        label: '❤️ Health' },
  { id: 'love',          label: '💛 Love' },
  { id: 'authenticity',  label: '✨ Authenticity' },
  { id: 'impact',        label: '🌍 Impact' },
  { id: 'creativity',    label: '🎨 Creativity' },
  { id: 'security',      label: '🏡 Security' },
  { id: 'adventure',     label: '🧭 Adventure' },
  { id: 'connection',    label: '🤝 Connection' },
];

const COACHING_STYLES = [
  { id: 'gentle',     label: '🌸 Gentle & supportive',  desc: 'Warm, encouraging, at your pace' },
  { id: 'direct',     label: '⚡ Direct & actionable',   desc: 'Straight to the point, practical' },
  { id: 'exploratory',label: '🔍 Exploratory',           desc: 'Deep questions, self-discovery' },
  { id: 'structured', label: '📋 Structured',            desc: 'Frameworks, tools, exercises' },
];

const JOB_TYPES = [
  { id: 'desk',     label: '💻 Desk job / mostly sitting' },
  { id: 'mixed',    label: '🚶 Mix of sitting & moving' },
  { id: 'active',   label: '🏃 On my feet all day' },
  { id: 'physical', label: '🔧 Physical labor' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function PillButton({ selected, onClick, children, className = '' }) {
  return (
    <button
      onPointerDown={onClick}
      className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all select-none ${
        selected
          ? 'bg-[#0A1A2F] border-[#0A1A2F] text-white'
          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
      } ${className}`}
    >
      {children}
    </button>
  );
}

function RadioCard({ selected, onClick, emoji, label, desc }) {
  return (
    <button
      onPointerDown={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${
        selected ? 'border-[#FD9C2D] bg-[#FD9C2D]/8' : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      {emoji && <span className="text-xl flex-shrink-0">{emoji}</span>}
      <div>
        <p className={`font-semibold text-sm ${selected ? 'text-[#0A1A2F]' : 'text-gray-800'}`}>{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      {selected && <div className="ml-auto w-5 h-5 rounded-full bg-[#FD9C2D] flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" /></div>}
    </button>
  );
}

function SectionLabel({ children }) {
  return <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{children}</p>;
}

function NumberInput({ label, value, onChange, min, max, unit }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button onPointerDown={() => onChange(Math.max(min, (value || min) - 1))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">−</button>
        <span className="text-base font-bold text-[#0A1A2F] w-12 text-center">{value || '—'}</span>
        <button onPointerDown={() => onChange(Math.min(max, (value || min) + 1))} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">+</button>
        {unit && <span className="text-xs text-gray-400 w-6">{unit}</span>}
      </div>
    </div>
  );
}

// ─── Step definitions (content is rendered inline in main component) ──────────

const STEPS = [
  { id: 'welcome',   icon: User,      label: 'You',       color: '#0A1A2F' },
  { id: 'why',       icon: Sparkles,  label: 'Your Why',  color: '#FD9C2D' },
  { id: 'fitness',   icon: Dumbbell,  label: 'Fitness',   color: '#38BDF8' },
  { id: 'nutrition', icon: Utensils,  label: 'Nutrition', color: '#22C55E' },
  { id: 'faith',     icon: BookOpen,  label: 'Faith',     color: '#C9A227' },
  { id: 'growth',    icon: Brain,     label: 'Growth',    color: '#AFC7E3' },
  { id: 'routine',   icon: Bell,      label: 'Routine',   color: '#8B5CF6' },
];

// ─── Main component ─────────────────────────────────────────────────────────

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [d, setD] = useState({
    // Step 0 — You
    full_name: '',
    dob: '',
    biological_sex: '',
    // Step 1 — Why
    motivations: [],
    life_stage: '',
    // Step 2 — Fitness
    fitness_goals: [],
    fitness_level: '',
    height_ft: '',
    height_in: '',
    weight_lbs: '',
    goal_weight_lbs: '',
    workout_days: 3,
    workout_duration: '',
    equipment: [],
    preferred_workout_time: '',
    injuries: '',
    // Step 3 — Nutrition
    diet_type: '',
    allergies: [],
    meals_per_day: '',
    cooking_time: '',
    // Step 4 — Faith
    bible_level: '',
    bible_translation: '',
    bible_topics: [],
    devotional_depth: '',
    in_church: '',
    // Step 5 — Growth
    growth_areas: [],
    core_values: [],
    coaching_style: '',
    goal_90_day: '',
    // Step 6 — Routine
    wake_time: '06:30',
    sleep_time: '22:30',
    job_type: '',
    notif_devotional: true,
    notif_workout: true,
    notif_meals: true,
    notif_reflection: true,
  });

  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const toggle = (k, v) => setD(prev => ({
    ...prev,
    [k]: prev[k].includes(v) ? prev[k].filter(i => i !== v) : [...prev[k], v]
  }));
  const toggleAllergy = (v) => {
    if (v === 'none') { set('allergies', ['none']); return; }
    setD(prev => ({
      ...prev,
      allergies: prev.allergies.includes(v)
        ? prev.allergies.filter(i => i !== v)
        : [...prev.allergies.filter(i => i !== 'none'), v]
    }));
  };

  const canAdvance = () => {
    if (step === 0) return d.full_name.trim().length > 0;
    return true;
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        full_name: d.full_name.trim(),
        dob: d.dob,
        biological_sex: d.biological_sex,
        motivations: d.motivations,
        life_stage: d.life_stage,
        fitness_goals: d.fitness_goals,
        fitness_level: d.fitness_level,
        height_ft: d.height_ft,
        height_in: d.height_in,
        weight_lbs: d.weight_lbs,
        goal_weight_lbs: d.goal_weight_lbs,
        workout_days: d.workout_days,
        workout_duration: d.workout_duration,
        equipment: d.equipment,
        preferred_workout_time: d.preferred_workout_time,
        injuries: d.injuries,
        diet_type: d.diet_type,
        allergies: d.allergies,
        meals_per_day: d.meals_per_day,
        cooking_time: d.cooking_time,
        bible_level: d.bible_level,
        bible_translation: d.bible_translation,
        bible_topics: d.bible_topics,
        devotional_depth: d.devotional_depth,
        in_church: d.in_church,
        growth_areas: d.growth_areas,
        core_values: d.core_values,
        coaching_style: d.coaching_style,
        goal_90_day: d.goal_90_day,
        wake_time: d.wake_time,
        sleep_time: d.sleep_time,
        job_type: d.job_type,
        reminder_settings: {
          devotional: { enabled: d.notif_devotional, time: '07:00' },
          workout:    { enabled: d.notif_workout,    time: '06:00' },
          meals:      { enabled: d.notif_meals,      time: '12:00' },
          reflection: { enabled: d.notif_reflection, time: '21:00' },
        },
        onboarding_completed: true,
        onboarding_version: 3,
        // Legacy fields for components that read them
        spiritual_interests: d.bible_topics,
        health_goals: d.fitness_goals,
        dietary_preferences: d.allergies,
      });
      onComplete();
    } catch { onComplete(); }
    finally { setSaving(false); }
  };

  const cfg = STEPS[step];
  const IconComp = cfg.icon;
  const pct = Math.round(((step) / STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A1A2F] overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-start py-6 px-4">
        <div className="w-full max-w-md">

          {/* ── Header ── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: cfg.color + '30' }}>
                  <IconComp className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">{cfg.label}</span>
              </div>
              <span className="text-white/40 text-xs">{step + 1} of {STEPS.length}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, #C9A227, ${cfg.color})` }}
                animate={{ width: `${pct + (100 / STEPS.length)}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* ── Step card ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Card header */}
              <div className="px-6 pt-6 pb-4" style={{ background: `linear-gradient(135deg, ${cfg.color}18, ${cfg.color}05)` }}>
                <h2 className="text-xl font-black text-[#0A1A2F] leading-tight">
                  {step === 0 && 'Welcome to Prosperity Revived 🙏'}
                  {step === 1 && "What's bringing you here?"}
                  {step === 2 && 'Fitness & body'}
                  {step === 3 && 'Nutrition & eating'}
                  {step === 4 && 'Faith & Bible study'}
                  {step === 5 && 'Personal growth'}
                  {step === 6 && 'Your daily routine'}
                </h2>
                <p className="text-gray-500 text-xs mt-1">
                  {step === 0 && "A few quick questions so everything feels personal from day one."}
                  {step === 1 && "Pick everything that resonates — no right answers."}
                  {step === 2 && "This helps Coach David personalise your workouts."}
                  {step === 3 && "Helps Chef Daniel plan meals you'll actually enjoy."}
                  {step === 4 && "So Gideon can meet you exactly where you are."}
                  {step === 5 && "Hannah will use this to guide your growth journey."}
                  {step === 6 && "We'll send reminders that fit your actual schedule."}
                </p>
              </div>

              {/* Card content */}
              <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">

                {/* ─── STEP 0: You ─────────────────────────────────────────── */}
                {step === 0 && (
                  <div className="space-y-3">
                    <div>
                      <SectionLabel>First name *</SectionLabel>
                      <input
                        autoFocus
                        type="text"
                        value={d.full_name}
                        onChange={e => set('full_name', e.target.value)}
                        placeholder="What should we call you?"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-[#0A1A2F] font-semibold text-sm focus:outline-none focus:border-[#FD9C2D] transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <SectionLabel>Date of birth</SectionLabel>
                        <input
                          type="date"
                          value={d.dob}
                          onChange={e => set('dob', e.target.value)}
                          className="w-full px-3 py-3 rounded-2xl border-2 border-gray-100 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#FD9C2D]"
                        />
                      </div>
                      <div>
                        <SectionLabel>Biological sex</SectionLabel>
                        <div className="flex gap-2">
                          {['Male','Female'].map(s => (
                            <button key={s} onPointerDown={() => set('biological_sex', s)}
                              className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all ${d.biological_sex === s ? 'bg-[#0A1A2F] border-[#0A1A2F] text-white' : 'bg-white border-gray-100 text-gray-700'}`}
                            >{s}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#FFF9EC] rounded-2xl p-3 flex gap-2">
                      <span className="text-lg">🔒</span>
                      <p className="text-xs text-gray-600 leading-relaxed">Your information is private and only used to personalise your experience.</p>
                    </div>
                  </div>
                )}

                {/* ─── STEP 1: Why ─────────────────────────────────────────── */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>What's bringing you here? (pick all that apply)</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {WHY_OPTIONS.map(o => (
                          <PillButton key={o.id} selected={d.motivations.includes(o.id)} onClick={() => toggle('motivations', o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Life stage</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {LIFE_STAGES.map(o => (
                          <PillButton key={o.id} selected={d.life_stage === o.id} onClick={() => set('life_stage', o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── STEP 2: Fitness ─────────────────────────────────────── */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>Primary fitness goal</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {FITNESS_GOALS.map(o => (
                          <PillButton key={o.id} selected={d.fitness_goals.includes(o.id)} onClick={() => toggle('fitness_goals', o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Experience level</SectionLabel>
                      <div className="space-y-2">
                        {FITNESS_LEVELS.map(o => (
                          <RadioCard key={o.id} selected={d.fitness_level === o.id} onClick={() => set('fitness_level', o.id)} emoji={o.emoji} label={o.label} desc={o.desc} />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <SectionLabel>Height</SectionLabel>
                        <div className="flex gap-1.5">
                          <input type="number" placeholder="ft" value={d.height_ft} onChange={e => set('height_ft', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 text-sm font-semibold text-center focus:outline-none focus:border-[#FD9C2D]" />
                          <input type="number" placeholder="in" value={d.height_in} onChange={e => set('height_in', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 text-sm font-semibold text-center focus:outline-none focus:border-[#FD9C2D]" />
                        </div>
                      </div>
                      <div>
                        <SectionLabel>Current weight</SectionLabel>
                        <div className="relative">
                          <input type="number" placeholder="lbs" value={d.weight_lbs} onChange={e => set('weight_lbs', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 text-sm font-semibold text-center focus:outline-none focus:border-[#FD9C2D]" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <SectionLabel>Goal weight (optional)</SectionLabel>
                        <input type="number" placeholder="lbs" value={d.goal_weight_lbs} onChange={e => set('goal_weight_lbs', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-100 text-sm font-semibold text-center focus:outline-none focus:border-[#FD9C2D]" />
                      </div>
                      <div>
                        <SectionLabel>Days/week to train</SectionLabel>
                        <div className="flex gap-1 flex-wrap">
                          {[2,3,4,5,6].map(n => (
                            <button key={n} onPointerDown={() => set('workout_days', n)}
                              className={`w-9 h-9 rounded-xl text-sm font-bold border-2 transition-all ${d.workout_days === n ? 'bg-[#38BDF8] border-[#38BDF8] text-white' : 'bg-white border-gray-100 text-gray-600'}`}
                            >{n}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Session length</SectionLabel>
                      <div className="flex gap-2 flex-wrap">
                        {[{id:'15',l:'15 min'},{id:'30',l:'30 min'},{id:'45',l:'45 min'},{id:'60',l:'60+ min'}].map(o => (
                          <PillButton key={o.id} selected={d.workout_duration === o.id} onClick={() => set('workout_duration', o.id)}>{o.l}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Equipment available</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {EQUIPMENT.map(o => (
                          <PillButton key={o.id} selected={d.equipment.includes(o.id)} onClick={() => toggle('equipment', o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Preferred workout time</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {WORKOUT_TIMES.map(o => (
                          <PillButton key={o.id} selected={d.preferred_workout_time === o.id} onClick={() => set('preferred_workout_time', o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Any injuries or limitations? (optional)</SectionLabel>
                      <input type="text" placeholder="e.g. bad lower back, knee pain..." value={d.injuries} onChange={e => set('injuries', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 text-sm text-gray-700 focus:outline-none focus:border-[#38BDF8]" />
                    </div>
                  </div>
                )}

                {/* ─── STEP 3: Nutrition ──────────────────────────────────── */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>Dietary style</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {DIET_TYPES.map(o => (
                          <PillButton key={o.id} selected={d.diet_type === o.id} onClick={() => set('diet_type', o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Allergies or intolerances</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {ALLERGIES.map(o => (
                          <PillButton key={o.id} selected={d.allergies.includes(o.id)} onClick={() => toggleAllergy(o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>How many meals per day?</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {MEALS_PER_DAY.map(o => (
                          <PillButton key={o.id} selected={d.meals_per_day === o.id} onClick={() => set('meals_per_day', o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Cooking time you're comfortable with</SectionLabel>
                      <div className="space-y-2">
                        {[
                          { id: 'quick',  label: '⚡ Quick & easy', desc: 'Under 20 min' },
                          { id: 'medium', label: '👨‍🍳 Happy to cook', desc: '30–45 min' },
                          { id: 'love',   label: '❤️ Love cooking',  desc: 'Any amount of time' },
                        ].map(o => (
                          <RadioCard key={o.id} selected={d.cooking_time === o.id} onClick={() => set('cooking_time', o.id)} label={o.label} desc={o.desc} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── STEP 4: Faith ──────────────────────────────────────── */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>Bible reading experience</SectionLabel>
                      <div className="space-y-2">
                        {BIBLE_LEVELS.map(o => (
                          <RadioCard key={o.id} selected={d.bible_level === o.id} onClick={() => set('bible_level', o.id)} label={o.label} desc={o.desc} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Preferred translation</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {BIBLE_TRANSLATIONS.map(o => (
                          <PillButton key={o.id} selected={d.bible_translation === o.id} onClick={() => set('bible_translation', o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Topics drawing you to scripture right now</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {BIBLE_TOPICS.map(o => (
                          <PillButton key={o.id} selected={d.bible_topics.includes(o.id)} onClick={() => toggle('bible_topics', o.id)}>{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Preferred devotional depth</SectionLabel>
                      <div className="space-y-2">
                        {DEVOTIONAL_DEPTH.map(o => (
                          <RadioCard key={o.id} selected={d.devotional_depth === o.id} onClick={() => set('devotional_depth', o.id)} label={o.label} desc={o.desc} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Are you part of a church community?</SectionLabel>
                      <div className="flex gap-2">
                        {[{id:'yes',l:'Yes, actively'},{id:'sometimes',l:'Sometimes'},{id:'looking',l:'Looking'},{id:'no',l:'Not currently'}].map(o => (
                          <PillButton key={o.id} selected={d.in_church === o.id} onClick={() => set('in_church', o.id)} className="text-xs">{o.l}</PillButton>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── STEP 5: Growth ─────────────────────────────────────── */}
                {step === 5 && (
                  <div className="space-y-4">
                    <div>
                      <SectionLabel>Top areas to work on (pick up to 3)</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {GROWTH_AREAS.map(o => (
                          <PillButton key={o.id}
                            selected={d.growth_areas.includes(o.id)}
                            onClick={() => {
                              if (d.growth_areas.includes(o.id)) toggle('growth_areas', o.id);
                              else if (d.growth_areas.length < 3) toggle('growth_areas', o.id);
                            }}
                          >{o.label}</PillButton>
                        ))}
                      </div>
                      {d.growth_areas.length === 3 && <p className="text-[10px] text-gray-400 mt-1">Max 3 selected</p>}
                    </div>
                    <div>
                      <SectionLabel>Core values (pick up to 5)</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {CORE_VALUES.map(o => (
                          <PillButton key={o.id}
                            selected={d.core_values.includes(o.id)}
                            onClick={() => {
                              if (d.core_values.includes(o.id)) toggle('core_values', o.id);
                              else if (d.core_values.length < 5) toggle('core_values', o.id);
                            }}
                          >{o.label}</PillButton>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Preferred coaching style</SectionLabel>
                      <div className="space-y-2">
                        {COACHING_STYLES.map(o => (
                          <RadioCard key={o.id} selected={d.coaching_style === o.id} onClick={() => set('coaching_style', o.id)} label={o.label} desc={o.desc} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>In 90 days, I want to…</SectionLabel>
                      <input
                        type="text"
                        placeholder="e.g. feel confident in my body and consistent in my faith"
                        value={d.goal_90_day}
                        onChange={e => set('goal_90_day', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 text-sm text-gray-700 focus:outline-none focus:border-[#AFC7E3] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* ─── STEP 6: Routine ─────────────────────────────────────── */}
                {step === 6 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <SectionLabel>Wake time</SectionLabel>
                        <input type="time" value={d.wake_time} onChange={e => set('wake_time', e.target.value)}
                          className="w-full px-3 py-3 rounded-2xl border-2 border-gray-100 text-sm font-semibold text-center focus:outline-none focus:border-[#8B5CF6]" />
                      </div>
                      <div>
                        <SectionLabel>Sleep time</SectionLabel>
                        <input type="time" value={d.sleep_time} onChange={e => set('sleep_time', e.target.value)}
                          className="w-full px-3 py-3 rounded-2xl border-2 border-gray-100 text-sm font-semibold text-center focus:outline-none focus:border-[#8B5CF6]" />
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Job / activity type</SectionLabel>
                      <div className="space-y-2">
                        {JOB_TYPES.map(o => (
                          <RadioCard key={o.id} selected={d.job_type === o.id} onClick={() => set('job_type', o.id)} label={o.label} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Daily reminders</SectionLabel>
                      <div className="space-y-2">
                        {[
                          { key: 'notif_devotional', label: '📖 Morning devotional', time: '7:00 AM' },
                          { key: 'notif_workout',    label: '💪 Workout reminder',   time: '6:00 AM' },
                          { key: 'notif_meals',      label: '🍽️ Meal logging',       time: '12:00 PM' },
                          { key: 'notif_reflection', label: '🌙 Evening reflection', time: '9:00 PM' },
                        ].map(({ key, label, time }) => (
                          <div key={key} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-[#0A1A2F]">{label}</p>
                              <p className="text-xs text-gray-400">{time}</p>
                            </div>
                            <button
                              onPointerDown={() => set(key, !d[key])}
                              className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${d[key] ? 'bg-[#8B5CF6]' : 'bg-gray-200'}`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${d[key] ? 'left-5.5 left-[22px]' : 'left-0.5'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ── Navigation ── */}
              <div className="px-5 py-4 border-t border-gray-50 flex gap-3">
                {step > 0 && (
                  <button onPointerDown={() => setStep(s => s - 1)}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-gray-100 text-gray-600 font-semibold text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <button
                  onPointerDown={() => {
                    if (!canAdvance()) return;
                    if (step === STEPS.length - 1) handleComplete();
                    else setStep(s => s + 1);
                  }}
                  disabled={!canAdvance() || saving}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${
                    canAdvance() && !saving
                      ? 'text-white shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  style={canAdvance() && !saving ? { background: `linear-gradient(135deg, ${cfg.color}, #FD9C2D)` } : {}}
                >
                  {saving ? (
                    <><span className="animate-spin">⏳</span> Saving…</>
                  ) : step === STEPS.length - 1 ? (
                    <><Sparkles className="w-4 h-4" /> Start My Journey</>
                  ) : (
                    <>Continue <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              {/* ── Skip ── */}
              {step < STEPS.length - 1 && (
                <button onPointerDown={handleComplete}
                  className="w-full text-center text-xs text-gray-400 hover:text-gray-600 pb-4 transition-colors"
                >
                  Skip for now — I'll fill this in later
                </button>
              )}

            </motion.div>
          </AnimatePresence>

          {/* ── Step dots ── */}
          <div className="flex justify-center gap-2 mt-5">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-[#FD9C2D]' : i < step ? 'w-3 bg-white/40' : 'w-3 bg-white/15'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
