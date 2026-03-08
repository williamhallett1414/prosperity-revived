import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  ChevronRight, ChevronLeft, Check, Sparkles,
  User, Heart, Dumbbell, Utensils, BookOpen, Brain, Bell
} from 'lucide-react';

const STEPS = [
  { id: 'welcome',   label: 'Welcome',    icon: User,      accent: '#FAD98D' },
  { id: 'why',       label: 'Your Why',   icon: Heart,     accent: '#AFC7E3' },
  { id: 'fitness',   label: 'Fitness',    icon: Dumbbell,  accent: '#38BDF8' },
  { id: 'nutrition', label: 'Nutrition',  icon: Utensils,  accent: '#22C55E' },
  { id: 'faith',     label: 'Faith',      icon: BookOpen,  accent: '#C9A227' },
  { id: 'growth',    label: 'Growth',     icon: Brain,     accent: '#AFC7E3' },
  { id: 'routine',   label: 'Routine',    icon: Bell,      accent: '#FD9C2D' },
];

function SL({ children }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">{children}</p>;
}

function Pill({ label, selected, onSelect, accent }) {
  return (
    <button onPointerDown={onSelect}
      style={selected ? { background: accent, borderColor: accent, color: '#0A1A2F' } : {}}
      className={`px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all select-none
        ${selected ? 'shadow-sm scale-105' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
      {selected && <Check className="inline w-3 h-3 mr-1 -mt-0.5" />}{label}
    </button>
  );
}

function OptionCard({ emoji, label, desc, selected, onSelect, accent }) {
  return (
    <button onPointerDown={onSelect}
      style={selected ? { borderColor: accent, background: accent + '18' } : {}}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all
        ${selected ? 'shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#0A1A2F] text-sm">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5 truncate">{desc}</p>}
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

function ToggleRow({ label, sub, enabled, onToggle, time, onTimeChange, accent }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border-2 border-gray-100">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#0A1A2F] text-sm">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      {enabled && onTimeChange && (
        <input type="time" value={time} onChange={e => onTimeChange(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 mr-2" />
      )}
      <button onPointerDown={onToggle}
        style={enabled ? { background: accent } : {}}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? '' : 'bg-gray-200'}`}>
        <motion.div animate={{ x: enabled ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}

// ── Step 0: Welcome ──────────────────────────────────────────────────────────
function StepWelcome({ data, update, accent }) {
  return (
    <div className="space-y-4">
      <div>
        <SL>What should we call you?</SL>
        <input type="text" value={data.full_name} onChange={e => update('full_name', e.target.value)}
          placeholder="Your first name" autoFocus
          className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#FAD98D] bg-white text-[#0A1A2F] font-bold text-lg outline-none transition-colors placeholder:font-normal placeholder:text-base placeholder:text-gray-400" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <SL>Age</SL>
          <div className="relative">
            <input type="number" value={data.age} onChange={e => update('age', e.target.value)}
              placeholder="25"
              className="w-full px-4 py-3 pr-14 rounded-xl border-2 border-gray-200 focus:border-[#FAD98D] bg-white text-[#0A1A2F] font-medium text-base outline-none transition-colors" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold pointer-events-none">yrs</span>
          </div>
        </div>
        <div>
          <SL>Biological sex</SL>
          <div className="flex gap-1.5">
            {['Male', 'Female', 'Other'].map(s => (
              <button key={s} onPointerDown={() => update('sex', s)}
                className={`flex-1 py-3 rounded-xl border-2 text-xs font-bold transition-all
                  ${data.sex === s ? 'border-[#FAD98D] bg-[#FAD98D]/20 text-[#0A1A2F]' : 'border-gray-200 bg-white text-gray-500'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <SL>In 90 days, I want to…</SL>
        <textarea value={data.main_goal_text} onChange={e => update('main_goal_text', e.target.value)}
          placeholder="e.g. lose 15 lbs, read the whole Bible, build a morning routine…"
          rows={2}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FAD98D] bg-white text-[#0A1A2F] text-sm outline-none transition-colors resize-none placeholder:text-gray-400" />
      </div>
    </div>
  );
}

// ── Step 1: Why ──────────────────────────────────────────────────────────────
function StepWhy({ data, update, accent }) {
  const REASONS = [
    { v: 'lose_weight',     l: '🔥 Lose weight' },
    { v: 'build_muscle',    l: '💪 Build muscle' },
    { v: 'eat_healthier',   l: '🥗 Eat healthier' },
    { v: 'grow_spiritually',l: '✝️ Grow spiritually' },
    { v: 'manage_stress',   l: '🌿 Manage stress' },
    { v: 'better_habits',   l: '✅ Build habits' },
    { v: 'relationships',   l: '💞 Relationships' },
    { v: 'find_purpose',    l: '🧭 Find purpose' },
    { v: 'mental_clarity',  l: '🧠 Mental clarity' },
    { v: 'just_exploring',  l: '✨ Just exploring' },
  ];
  const STAGES = [
    { v: 'student', l: '🎓 Student' }, { v: 'early_career', l: '🚀 Early career' },
    { v: 'mid_career', l: '💼 Mid-career' }, { v: 'parent', l: '👶 Parent' },
    { v: 'in_transition', l: '🔄 In transition' }, { v: 'retired', l: '🏡 Retired/Semi' },
  ];
  const toggle = v => {
    const cur = data.reasons || [];
    update('reasons', cur.includes(v) ? cur.filter(r => r !== v) : [...cur, v]);
  };
  return (
    <div className="space-y-4">
      <div>
        <SL>What brought you here? (pick all that apply)</SL>
        <div className="flex flex-wrap gap-2">
          {REASONS.map(r => <Pill key={r.v} label={r.l} accent={accent} selected={(data.reasons||[]).includes(r.v)} onSelect={() => toggle(r.v)} />)}
        </div>
      </div>
      <div>
        <SL>Life stage</SL>
        <div className="grid grid-cols-3 gap-2">
          {STAGES.map(s => (
            <button key={s.v} onPointerDown={() => update('life_stage', s.v)}
              className={`py-2.5 px-2 rounded-xl border-2 text-xs font-semibold text-center transition-all
                ${data.life_stage === s.v ? 'border-[#AFC7E3] bg-[#AFC7E3]/20 text-[#0A1A2F]' : 'border-gray-200 bg-white text-gray-500'}`}>
              {s.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Fitness ──────────────────────────────────────────────────────────
function StepFitness({ data, update, accent }) {
  const GOALS = [
    { v: 'lose_fat',     e: '🔥', l: 'Lose fat',       d: 'Cut & lean out' },
    { v: 'build_muscle', e: '💪', l: 'Build muscle',   d: 'Strength & size' },
    { v: 'endurance',    e: '🏃', l: 'Endurance',      d: 'Cardio & stamina' },
    { v: 'get_stronger', e: '🏋️', l: 'Get stronger',   d: 'Powerlifting' },
    { v: 'stay_active',  e: '⚡', l: 'Stay active',    d: 'General fitness' },
    { v: 'sport',        e: '🏅', l: 'Sport perf.',    d: 'Athletic edge' },
  ];
  const EQUIP = [
    { v: 'none', l: '🙌 Bodyweight only' }, { v: 'dumbbells', l: '🏋️ Dumbbells' },
    { v: 'bands', l: '💪 Resistance bands' }, { v: 'home_gym', l: '🏠 Home gym' },
    { v: 'gym', l: '🏢 Gym membership' },
  ];
  const toggleEquip = v => {
    const cur = data.equipment || [];
    update('equipment', cur.includes(v) ? cur.filter(e => e !== v) : [...cur, v]);
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <SL>Height</SL>
          <div className="relative">
            <input type="number" value={data.height_cm} onChange={e => update('height_cm', e.target.value)} placeholder="170"
              className="w-full px-4 py-3 pr-14 rounded-xl border-2 border-gray-200 focus:border-[#38BDF8] bg-white text-[#0A1A2F] font-medium outline-none transition-colors" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold pointer-events-none">cm</span>
          </div>
        </div>
        <div>
          <SL>Current weight</SL>
          <div className="relative">
            <input type="number" value={data.weight_kg} onChange={e => update('weight_kg', e.target.value)} placeholder="70"
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#38BDF8] bg-white text-[#0A1A2F] font-medium outline-none transition-colors" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold pointer-events-none">kg</span>
          </div>
        </div>
      </div>
      <div>
        <SL>Goal weight (optional)</SL>
        <div className="relative">
          <input type="number" value={data.goal_weight_kg} onChange={e => update('goal_weight_kg', e.target.value)} placeholder="65"
            className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-[#38BDF8] bg-white text-[#0A1A2F] font-medium outline-none transition-colors" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold pointer-events-none">kg</span>
        </div>
      </div>
      <div>
        <SL>Primary fitness goal</SL>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map(g => <OptionCard key={g.v} emoji={g.e} label={g.l} desc={g.d} accent={accent} selected={data.fitness_goal === g.v} onSelect={() => update('fitness_goal', g.v)} />)}
        </div>
      </div>
      <div>
        <SL>Experience level</SL>
        <div className="flex gap-2">
          {[{ v:'beginner',e:'🌱',l:'Beginner',d:'0–1 yr'},{v:'intermediate',e:'💪',l:'Intermediate',d:'1–3 yrs'},{v:'advanced',e:'🏆',l:'Advanced',d:'3+ yrs'}].map(lv => (
            <button key={lv.v} onPointerDown={() => update('fitness_level', lv.v)}
              className={`flex-1 py-3 px-1 rounded-xl border-2 text-center transition-all
                ${data.fitness_level === lv.v ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#0A1A2F]' : 'border-gray-200 bg-white text-gray-500'}`}>
              <div className="text-lg">{lv.e}</div>
              <div className="text-[11px] font-bold mt-0.5">{lv.l}</div>
              <div className="text-[9px] text-gray-400">{lv.d}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <SL>Days / week</SL>
          <div className="flex gap-1">
            {[2,3,4,5,6].map(d => (
              <button key={d} onPointerDown={() => update('workout_days_per_week', d)}
                style={data.workout_days_per_week === d ? { background: accent, color: '#0A1A2F' } : {}}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all ${data.workout_days_per_week === d ? 'border-transparent' : 'border-gray-200 bg-white text-gray-500'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <SL>Session length</SL>
          <div className="flex gap-1">
            {[{v:20,l:'20m'},{v:30,l:'30m'},{v:45,l:'45m'},{v:60,l:'1hr+'}].map(d => (
              <button key={d.v} onPointerDown={() => update('workout_duration_mins', d.v)}
                style={data.workout_duration_mins === d.v ? { background: accent, color: '#0A1A2F' } : {}}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${data.workout_duration_mins === d.v ? 'border-transparent' : 'border-gray-200 bg-white text-gray-500'}`}>
                {d.l}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <SL>Equipment available</SL>
        <div className="flex flex-wrap gap-2">
          {EQUIP.map(e => <Pill key={e.v} label={e.l} accent={accent} selected={(data.equipment||[]).includes(e.v)} onSelect={() => toggleEquip(e.v)} />)}
        </div>
      </div>
      <div>
        <SL>Injuries or limitations (optional)</SL>
        <input type="text" value={data.injuries||''} onChange={e => update('injuries', e.target.value)}
          placeholder="e.g. bad knees, lower back pain…"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#38BDF8] bg-white text-sm text-[#0A1A2F] outline-none transition-colors placeholder:text-gray-400" />
      </div>
    </div>
  );
}

// ── Step 3: Nutrition ────────────────────────────────────────────────────────
function StepNutrition({ data, update, accent }) {
  const DIETS = [
    { v: 'no_restrictions', e: '🍽️', l: 'No restrictions', d: 'I eat everything' },
    { v: 'vegetarian', e: '🥦', l: 'Vegetarian', d: 'No meat' },
    { v: 'vegan', e: '🌱', l: 'Vegan', d: 'Plant-based only' },
    { v: 'keto', e: '🥑', l: 'Keto', d: 'Low-carb, high-fat' },
    { v: 'paleo', e: '🍖', l: 'Paleo', d: 'Whole foods' },
    { v: 'gluten_free', e: '🌾', l: 'Gluten-free', d: 'No gluten' },
    { v: 'halal', e: '☪️', l: 'Halal', d: 'Halal certified' },
    { v: 'kosher', e: '✡️', l: 'Kosher', d: 'Kosher certified' },
  ];
  const ALLERGIES = ['Tree nuts','Peanuts','Dairy','Eggs','Soy','Shellfish','Fish','Gluten','None'];
  const COOKING = [
    { v: 'quick', e: '⚡', l: 'Quick & easy', d: 'Under 20 min' },
    { v: 'moderate', e: '🍳', l: 'Happy to cook', d: '30–45 min' },
    { v: 'love_cooking', e: '👨‍🍳', l: 'Love cooking', d: 'Any time' },
  ];
  const toggleAllergy = v => {
    const cur = data.allergies || [];
    if (v === 'None') { update('allergies', ['None']); return; }
    update('allergies', cur.includes(v) ? cur.filter(a => a !== v) : [...cur.filter(a => a !== 'None'), v]);
  };
  return (
    <div className="space-y-4">
      <div>
        <SL>Dietary style</SL>
        <div className="grid grid-cols-2 gap-2">
          {DIETS.map(d => <OptionCard key={d.v} emoji={d.e} label={d.l} desc={d.d} accent={accent} selected={data.diet_type === d.v} onSelect={() => update('diet_type', d.v)} />)}
        </div>
      </div>
      <div>
        <SL>Food allergies</SL>
        <div className="flex flex-wrap gap-2">
          {ALLERGIES.map(a => <Pill key={a} label={a} accent={accent} selected={(data.allergies||[]).includes(a)} onSelect={() => toggleAllergy(a)} />)}
        </div>
      </div>
      <div>
        <SL>Meals per day</SL>
        <div className="flex flex-wrap gap-2">
          {[{v:'2',l:'2 meals'},{v:'3',l:'3 meals'},{v:'3_snacks',l:'3 + snacks'},{v:'if',l:'Intermittent fasting'}].map(m => (
            <button key={m.v} onPointerDown={() => update('meals_per_day', m.v)}
              style={data.meals_per_day === m.v ? { background: accent, borderColor: accent } : {}}
              className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${data.meals_per_day === m.v ? 'text-[#0A1A2F]' : 'border-gray-200 bg-white text-gray-600'}`}>
              {m.l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <SL>Cooking time & skill</SL>
        <div className="space-y-2">
          {COOKING.map(c => <OptionCard key={c.v} emoji={c.e} label={c.l} desc={c.d} accent={accent} selected={data.cooking_level === c.v} onSelect={() => update('cooking_level', c.v)} />)}
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Faith ────────────────────────────────────────────────────────────
function StepFaith({ data, update, accent }) {
  const TRANSLATIONS = ['NIV','ESV','KJV','NKJV','NLT','The Message','Not sure'];
  const TOPICS = [
    'Prayer','Identity in Christ','Anxiety & Fear','Relationships',
    'Purpose & Calling','Grief & Loss','Financial wisdom','Family',
    'Marriage','Forgiveness','General growth','Evangelism',
  ];
  const DEPTH = [
    { v: 'short', e: '☕', l: 'Short & encouraging', d: '2–3 min daily' },
    { v: 'study', e: '📖', l: 'Study + reflection',  d: '10–15 min' },
    { v: 'deep',  e: '🔬', l: 'Deep dive',           d: '30+ min' },
  ];
  const EXPERIENCE = [
    { v: 'new',      e: '🌱', l: 'New to the Bible', d: 'Just getting started' },
    { v: 'familiar', e: '📖', l: 'Some familiarity',  d: 'I know the basics' },
    { v: 'regular',  e: '✝️', l: 'Regular reader',    d: 'I read consistently' },
    { v: 'student',  e: '🎓', l: 'Deep student',      d: 'I study seriously' },
  ];
  const toggleTopic = v => {
    const cur = data.bible_topics || [];
    update('bible_topics', cur.includes(v) ? cur.filter(t => t !== v) : [...cur, v]);
  };
  return (
    <div className="space-y-4">
      <div>
        <SL>Bible reading experience</SL>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE.map(r => <OptionCard key={r.v} emoji={r.e} label={r.l} desc={r.d} accent={accent} selected={data.bible_experience === r.v} onSelect={() => update('bible_experience', r.v)} />)}
        </div>
      </div>
      <div>
        <SL>Preferred Bible translation</SL>
        <div className="flex flex-wrap gap-2">
          {TRANSLATIONS.map(t => <Pill key={t} label={t} accent={accent} selected={data.bible_translation === t} onSelect={() => update('bible_translation', t)} />)}
        </div>
      </div>
      <div>
        <SL>Topics drawing you to scripture now</SL>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(t => <Pill key={t} label={t} accent={accent} selected={(data.bible_topics||[]).includes(t)} onSelect={() => toggleTopic(t)} />)}
        </div>
      </div>
      <div>
        <SL>Devotional depth preference</SL>
        <div className="space-y-2">
          {DEPTH.map(d => <OptionCard key={d.v} emoji={d.e} label={d.l} desc={d.d} accent={accent} selected={data.devotional_depth === d.v} onSelect={() => update('devotional_depth', d.v)} />)}
        </div>
      </div>
      <div>
        <SL>Currently in a church community?</SL>
        <div className="flex gap-2">
          {['Yes','No','Looking'].map(v => (
            <button key={v} onPointerDown={() => update('has_church', v)}
              style={data.has_church === v ? { background: accent, borderColor: accent } : {}}
              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${data.has_church === v ? 'text-[#0A1A2F]' : 'border-gray-200 bg-white text-gray-500'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 5: Growth ────────────────────────────────────────────────────────────
function StepGrowth({ data, update, accent }) {
  const AREAS = [
    { v: 'emotional_intelligence', l: '🧠 Emotional Intelligence' },
    { v: 'confidence',             l: '✨ Confidence' },
    { v: 'stress_anxiety',         l: '🌿 Stress & Anxiety' },
    { v: 'habits',                 l: '✅ Habit Building' },
    { v: 'relationships',          l: '💞 Relationships' },
    { v: 'career_purpose',         l: '🧭 Career & Purpose' },
    { v: 'money_mindset',          l: '💰 Money Mindset' },
    { v: 'leadership',             l: '🏅 Leadership' },
    { v: 'identity',               l: '🪞 Identity' },
  ];
  const VALUES = ['👨‍👩‍👧 Family','🦋 Freedom','🌱 Growth','🙏 Faith','❤️‍🔥 Health','💛 Love','✨ Authenticity','🌍 Impact','🎨 Creativity','🏡 Security','🧭 Adventure','🤝 Connection'];
  const STYLES = [
    { v: 'gentle',      e: '🌸', l: 'Gentle & Supportive',    d: 'Warm, at my pace' },
    { v: 'direct',      e: '⚡', l: 'Direct & Actionable',    d: 'Straight to the point' },
    { v: 'exploratory', e: '🔍', l: 'Exploratory',            d: 'Deep self-discovery' },
    { v: 'structured',  e: '📋', l: 'Structured & Practical', d: 'Frameworks & tools' },
  ];
  const toggleArea = v => {
    const cur = data.growth_areas || [];
    if (!cur.includes(v) && cur.length >= 3) return;
    update('growth_areas', cur.includes(v) ? cur.filter(a => a !== v) : [...cur, v]);
  };
  const toggleValue = v => {
    const cur = data.core_values || [];
    if (!cur.includes(v) && cur.length >= 5) return;
    update('core_values', cur.includes(v) ? cur.filter(a => a !== v) : [...cur, v]);
  };
  return (
    <div className="space-y-4">
      <div>
        <SL>Top growth areas (pick up to 3)</SL>
        <div className="flex flex-wrap gap-2">
          {AREAS.map(a => {
            const maxed = (data.growth_areas||[]).length >= 3 && !(data.growth_areas||[]).includes(a.v);
            return <Pill key={a.v} label={a.l} accent={accent} selected={(data.growth_areas||[]).includes(a.v)} onSelect={maxed ? () => {} : () => toggleArea(a.v)} />;
          })}
        </div>
        {(data.growth_areas||[]).length >= 3 && <p className="text-xs text-gray-400 mt-1">Max 3 — tap to deselect</p>}
      </div>
      <div>
        <SL>Core values (pick up to 5)</SL>
        <div className="flex flex-wrap gap-2">
          {VALUES.map(v => {
            const maxed = (data.core_values||[]).length >= 5 && !(data.core_values||[]).includes(v);
            return <Pill key={v} label={v} accent={accent} selected={(data.core_values||[]).includes(v)} onSelect={maxed ? () => {} : () => toggleValue(v)} />;
          })}
        </div>
      </div>
      <div>
        <SL>Coaching style preference</SL>
        <div className="space-y-2">
          {STYLES.map(s => <OptionCard key={s.v} emoji={s.e} label={s.l} desc={s.d} accent={accent} selected={data.coaching_style === s.v} onSelect={() => update('coaching_style', s.v)} />)}
        </div>
      </div>
    </div>
  );
}

// ── Step 6: Routine ───────────────────────────────────────────────────────────
function StepRoutine({ data, update, accent }) {
  const JOBS = [
    { v: 'desk', e: '💻', l: 'Desk job', d: 'Mostly sitting' },
    { v: 'mixed', e: '🚶', l: 'Mixed', d: 'Sitting + moving' },
    { v: 'active', e: '⚡', l: 'On my feet', d: 'Active all day' },
    { v: 'physical', e: '🏗️', l: 'Physical labor', d: 'Heavy activity' },
  ];
  const REMINDERS = [
    { key: 'devotional', label: 'Morning devotional', sub: 'Daily scripture & prayer', default: '07:00' },
    { key: 'workout',    label: 'Workout reminder',   sub: 'Time to move',            default: '06:00' },
    { key: 'meal_log',   label: 'Meal logging',       sub: 'Track your nutrition',    default: '12:00' },
    { key: 'reflection', label: 'Evening reflection', sub: 'Journal & wind down',     default: '21:00' },
  ];
  const reminders = data.reminders || {};
  const toggleR = key => update('reminders', { ...reminders, [key]: { ...reminders[key], enabled: !reminders[key]?.enabled } });
  const setTime = (key, t) => update('reminders', { ...reminders, [key]: { ...reminders[key], time: t } });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <SL>Wake up time</SL>
          <input type="time" value={data.wake_time||'06:30'} onChange={e => update('wake_time', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FD9C2D] bg-white text-[#0A1A2F] font-medium outline-none transition-colors" />
        </div>
        <div>
          <SL>Bedtime</SL>
          <input type="time" value={data.sleep_time||'22:30'} onChange={e => update('sleep_time', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FD9C2D] bg-white text-[#0A1A2F] font-medium outline-none transition-colors" />
        </div>
      </div>
      <div>
        <SL>Daily activity level</SL>
        <div className="grid grid-cols-2 gap-2">
          {JOBS.map(j => <OptionCard key={j.v} emoji={j.e} label={j.l} desc={j.d} accent={accent} selected={data.job_type === j.v} onSelect={() => update('job_type', j.v)} />)}
        </div>
      </div>
      <div>
        <SL>Daily reminders</SL>
        <div className="space-y-2">
          {REMINDERS.map(r => (
            <ToggleRow key={r.key} label={r.label} sub={r.sub} accent={accent}
              enabled={!!(reminders[r.key]?.enabled)}
              onToggle={() => toggleR(r.key)}
              time={reminders[r.key]?.time || r.default}
              onTimeChange={t => setTime(r.key, t)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
const STEP_COMPS = [StepWelcome, StepWhy, StepFitness, StepNutrition, StepFaith, StepGrowth, StepRoutine];
const STEP_TITLES = [
  "Let's get to know you",
  "What's your why?",
  "Your fitness profile",
  "Fuel your mission",
  "Your faith & scripture",
  "Your growth journey",
  "Build your daily rhythm",
];
const STEP_SUBS = [
  "This personalizes everything from day one",
  "Your motivation shapes all our guidance",
  "Coach David will use this to build your plan",
  "Chef Daniel will tailor every meal & recipe",
  "Gideon will guide your Bible study with this",
  "Hannah will use this in every conversation",
  "We'll remind you at exactly the right moments",
];

const INIT = {
  full_name: '', age: '', sex: '', main_goal_text: '',
  reasons: [], life_stage: '',
  height_cm: '', weight_kg: '', goal_weight_kg: '', fitness_goal: '',
  fitness_level: '', workout_days_per_week: 3, workout_duration_mins: 30,
  equipment: [], injuries: '',
  diet_type: '', allergies: [], meals_per_day: '', cooking_level: '',
  bible_experience: '', bible_translation: '', bible_topics: [],
  devotional_depth: '', has_church: '',
  growth_areas: [], core_values: [], coaching_style: '',
  wake_time: '06:30', sleep_time: '22:30', job_type: '',
  reminders: {
    devotional: { enabled: true,  time: '07:00' },
    workout:    { enabled: false, time: '06:00' },
    meal_log:   { enabled: false, time: '12:00' },
    reflection: { enabled: false, time: '21:00' },
  },
};

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INIT);
  const [saving, setSaving] = useState(false);
  const [dir, setDir] = useState(1);

  const meta = STEPS[step];
  const StepComp = STEP_COMPS[step];
  const accent = meta.accent;

  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const canAdvance = step === 0 ? data.full_name.trim().length > 0 : true;

  const goNext = async () => {
    if (step < STEPS.length - 1) { setDir(1); setStep(s => s + 1); }
    else await finish();
  };
  const goPrev = () => { if (step > 0) { setDir(-1); setStep(s => s - 1); } };

  const finish = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ ...data, onboarding_completed: true, onboarding_version: 2, reminder_settings: data.reminders });
      onComplete();
    } catch { onComplete(); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#0A1A2F' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
      </div>

      {/* Top bar */}
      <div className="relative z-10 px-5 pt-safe pt-4 pb-3 flex-shrink-0">
        <div className="flex gap-1 mb-3">
          {STEPS.map((s, i) => (
            <motion.div key={s.id} animate={{ width: i === step ? 28 : 6 }} transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full flex-shrink-0"
              style={{ background: i <= step ? accent : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: accent + '25' }}>
              <meta.icon className="w-3.5 h-3.5" style={{ color: accent }} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{meta.label}</p>
              <p className="text-white/40 text-[10px]">Step {step + 1} of {STEPS.length}</p>
            </div>
          </div>
          <button onPointerDown={finish} className="text-white/40 text-xs hover:text-white/70 transition-colors py-1 px-2">
            Skip setup
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 overflow-hidden px-4 pb-4 min-h-0">
        <div className="h-full bg-white rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          {/* Card header */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: accent }}>{meta.label}</p>
                <h2 className="text-xl font-black text-[#0A1A2F]">{STEP_TITLES[step]}</h2>
                <p className="text-gray-500 text-xs mt-0.5">{STEP_SUBS[step]}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, x: dir * 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -24 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
                <StepComp data={data} update={update} accent={accent} />
                <div className="h-6" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-3">
              {step > 0 && (
                <button onPointerDown={goPrev}
                  className="w-12 h-12 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <button onPointerDown={goNext} disabled={!canAdvance || saving}
                style={canAdvance ? { background: `linear-gradient(135deg, ${meta.accent}CC, ${meta.accent})` } : {}}
                className={`flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                  ${canAdvance ? 'text-[#0A1A2F] shadow-lg active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                {saving
                  ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles className="w-4 h-4" /></motion.div>
                  : step === STEPS.length - 1
                    ? <><Sparkles className="w-4 h-4" />Start my journey</>
                    : <>Continue <ChevronRight className="w-4 h-4" /></>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
