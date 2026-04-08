import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import {
  Salad, Droplets, Flame, Clock, ShieldCheck,
  ChevronRight, Info, Apple, BarChart2, BookOpen, AlertTriangle, Target, Pencil, X, Check} from 'lucide-react';

// ── Label maps ────────────────────────────────────────────────────────────────
const DIET_LABELS = {
  no_restrictions: { label: 'No Restrictions',  emoji: '🍽️' },
  vegetarian:      { label: 'Vegetarian',        emoji: '🥦' },
  vegan:           { label: 'Vegan',             emoji: '🌱' },
  keto:            { label: 'Keto / Low-carb',   emoji: '🥑' },
  paleo:           { label: 'Paleo',             emoji: '🍖' },
  gluten_free:     { label: 'Gluten-free',       emoji: '🌾' },
  halal:           { label: 'Halal',             emoji: '☪️' },
  kosher:          { label: 'Kosher',            emoji: '✡️' },
};

const ALLERGY_LABELS = {
  nuts: '🥜 Tree nuts', peanuts: '🥜 Peanuts', dairy: '🥛 Dairy',
  eggs: '🥚 Eggs', soy: '🫘 Soy', shellfish: '🦐 Shellfish',
  fish: '🐟 Fish', gluten: '🌾 Gluten',
};

const MEAL_LABELS = {
  '2': '2 meals/day', '3': '3 meals/day',
  '3+': '3 meals + snacks', 'if': 'Intermittent fasting',
};

const COOK_LABELS = {
  quick:  { label: 'Quick & easy',  sub: 'Under 20 min',     emoji: '⚡' },
  medium: { label: 'Happy to cook', sub: '30–45 min',         emoji: '👨‍🍳' },
  love:   { label: 'Love cooking',  sub: 'Any amount of time', emoji: '❤️' },
};

// ── Diet-specific calorie/macro adjustments ───────────────────────────────────
const DIET_MACRO_NOTES = {
  keto:        { note: 'Very low carbs (under 50g/day). High fat fuels ketosis.', pAdj: 0, cAdj: -0.2, fAdj: 0.2 },
  vegan:       { note: 'Watch B12, iron, omega-3 and calcium — often low in plant diets.' },
  vegetarian:  { note: 'Dairy and eggs cover most gaps. Watch iron and B12.' },
  paleo:       { note: 'No grains or legumes. Higher protein and fat from whole foods.' },
  gluten_free: { note: 'Avoid wheat, barley, rye. Rice and quinoa are safe grains.' },
  halal:       { note: 'Avoid pork and alcohol-based ingredients. Emphasise lean halal meats.' },
  kosher:      { note: 'Separate meat and dairy meals. Shellfish excluded.' },
};

// ── Meal timing from meals_per_day ────────────────────────────────────────────
const MEAL_SCHEDULES = {
  '2':  ['8:00 AM — Breakfast/Brunch (50% of daily calories)', '6:00 PM — Dinner (50%)'],
  '3':  ['7:30 AM — Breakfast (25%)', '12:30 PM — Lunch (35%)', '7:00 PM — Dinner (40%)'],
  '3+': ['7:30 AM — Breakfast (25%)', '12:30 PM — Lunch (30%)', '3:30 PM — Snack (10%)', '7:00 PM — Dinner (35%)'],
  'if': ['12:00 PM — Break fast (40% of daily calories)', '4:00 PM — Mid meal (25%)', '7:30 PM — Dinner (35%)', '⏱️ 16-hour fasting window: 8 PM – 12 PM'],
};

// ── Recipe ideas per diet ─────────────────────────────────────────────────────
const DIET_RECIPES = {
  no_restrictions: ['Grilled chicken & sweet potato', 'Salmon with roasted veg', 'Oatmeal with banana & honey'],
  vegetarian:      ['Lentil soup', 'Veggie stir-fry with tofu', 'Greek yogurt parfait'],
  vegan:           ['Chickpea curry', 'Buddha bowl with tahini', 'Overnight oats with berries'],
  keto:            ['Avocado egg bake', 'Bacon-wrapped salmon', 'Zucchini noodles & meatballs'],
  paleo:           ['Bison burger (no bun)', 'Egg & veggie frittata', 'Almond-crusted chicken'],
  gluten_free:     ['Rice bowl with teriyaki chicken', 'Quinoa salad', 'Sweet potato tacos'],
  halal:           ['Lamb kofta with rice', 'Chicken shawarma bowl', 'Lentil dhal'],
  kosher:          ['Brisket with roasted carrots', 'Matzo ball soup', 'Falafel salad'],
};

// ── Scripture + food ──────────────────────────────────────────────────────────
const FOOD_VERSES = [
  { ref: '1 Cor 10:31', text: '"Whatever you eat or drink, do it all for the glory of God."' },
  { ref: 'Dan 1:12',    text: '"Give us nothing but vegetables to eat and water to drink for ten days."' },
  { ref: 'Prov 17:22',  text: '"A cheerful heart is good medicine."' },
  { ref: '3 John 1:2',  text: '"I pray that you may enjoy good health and that all may go well with you."' },
];

// ── Calorie helpers (reuse FitnessGoalsPage logic) ────────────────────────────
function calcBMR(w, h, age, sex) {
  if (!w || !h || !age) return null;
  const b = 10 * w + 6.25 * h - 5 * age;
  return sex === 'female' ? b - 161 : b + 5;
}
function actMult(days) {
  const d = days || 3;
  if (d <= 1) return 1.2; if (d <= 2) return 1.375;
  if (d <= 4) return 1.55; if (d <= 5) return 1.725; return 1.9;
}
function calcTDEE(bmr, days) { return bmr ? Math.round(bmr * actMult(days)) : null; }
function goalCals(tdee, goal) {
  if (!tdee) return null;
  if (goal === 'lose_weight') return tdee - 500;
  if (goal === 'lose_weight_fast') return tdee - 750;
  if (goal === 'build_muscle') return tdee + 300;
  if (goal === 'bulk') return tdee + 500;
  return tdee;
}
function macroSplit(cals, fitnessGoal, diet) {
  if (!cals) return null;
  const loss = fitnessGoal === 'lose_weight' || fitnessGoal === 'lose_weight_fast';
  const gain = fitnessGoal === 'build_muscle' || fitnessGoal === 'bulk';
  let [p, c, f] = loss ? [0.40, 0.30, 0.30] : gain ? [0.35, 0.40, 0.25] : [0.30, 0.45, 0.25];
  // Keto override
  if (diet === 'keto') { p = 0.30; c = 0.05; f = 0.65; }
  return { protein: Math.round((cals * p) / 4), carbs: Math.round((cals * c) / 4), fat: Math.round((cals * f) / 9) };
}

// ── Water calc ────────────────────────────────────────────────────────────────
function waterGoal(weight, workoutDays) {
  if (!weight) return null;
  const base = +(weight * 0.033).toFixed(1);
  const extra = workoutDays >= 4 ? 0.5 : 0;
  return { base, total: +(base + extra).toFixed(1), glasses: Math.ceil((base + extra) / 0.25) };
}

// ── Animated bar ──────────────────────────────────────────────────────────────
function Bar({ label, grams, cals, color, pct, delay = 0 }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-[#0A1A2F]">{label}</span>
        <span className="text-xs text-[#0A1A2F]/50">{grams}g · {cals} kcal</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay }}
          className="h-full rounded-full" style={{ background: color }} />
      </div>
    </div>
  );
}

// ── Stat mini-card ────────────────────────────────────────────────────────────
function StatCard({ emoji, label, value, sub, color = '#0A1A2F', bg = '#F2F6FA', delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-lg mb-1">{emoji}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: `${color}80` }}>{label}</p>
      <p className="text-base font-black leading-tight" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px] mt-0.5 leading-snug" style={{ color: `${color}70` }}>{sub}</p>}
    </motion.div>
  );
}

// ── Update Goals Modal ────────────────────────────────────────────────────────
function UpdateGoalsModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    diet_type:           user?.diet_type || 'no_restrictions',
    meals_per_day:       user?.meals_per_day || '3',
    cooking_time:        user?.cooking_time || 'medium',
    allergies:           user?.allergies || [],
    fitness_goal:        user?.fitness_goal || 'general_fitness',
    weight_kg:           user?.weight_kg || '',
    height_cm:           user?.height_cm || '',
    age:                 user?.age || '',
    sex:                 user?.sex || '',
    workout_days_per_week: user?.workout_days_per_week || 3,
  });
  const [saving, setSaving] = useState(false);

  const toggle = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val]
    }));
  };

  const save = async () => {
    setSaving(true);
    await base44.auth.updateMe(form);
    onSave({ ...user, ...form });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className="w-full max-w-lg bg-white rounded-t-3xl flex flex-col" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        {/* Fixed header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0">
          <h2 className="font-black text-[#0A1A2F] text-lg">Update Nutrition Goals</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-[#0A1A2F]/50" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5">
        <div className="space-y-5">
          {/* Diet type */}
          <div>
            <p className="text-xs font-bold text-[#0A1A2F]/60 uppercase tracking-widest mb-2">Diet Type</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(DIET_LABELS).map(([key, { label, emoji }]) => (
                <button key={key} onClick={() => setForm(f => ({ ...f, diet_type: key }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.diet_type === key ? 'border-[#22C55E] bg-[#F0FDF4] text-[#166534]' : 'border-gray-100 bg-gray-50 text-[#0A1A2F]/60'}`}>
                  <span>{emoji}</span>{label}
                </button>
              ))}
            </div>
          </div>

          {/* Meals per day */}
          <div>
            <p className="text-xs font-bold text-[#0A1A2F]/60 uppercase tracking-widest mb-2">Meals Per Day</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(MEAL_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => setForm(f => ({ ...f, meals_per_day: key }))}
                  className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.meals_per_day === key ? 'border-[#22C55E] bg-[#F0FDF4] text-[#166534]' : 'border-gray-100 bg-gray-50 text-[#0A1A2F]/60'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cooking time */}
          <div>
            <p className="text-xs font-bold text-[#0A1A2F]/60 uppercase tracking-widest mb-2">Cooking Preference</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(COOK_LABELS).map(([key, { label, emoji }]) => (
                <button key={key} onClick={() => setForm(f => ({ ...f, cooking_time: key }))}
                  className={`flex flex-col items-center px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${form.cooking_time === key ? 'border-[#22C55E] bg-[#F0FDF4] text-[#166534]' : 'border-gray-100 bg-gray-50 text-[#0A1A2F]/60'}`}>
                  <span className="text-lg mb-1">{emoji}</span>{label}
                </button>
              ))}
            </div>
          </div>

          {/* Fitness goal */}
          <div>
            <p className="text-xs font-bold text-[#0A1A2F]/60 uppercase tracking-widest mb-2">Fitness Goal</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'lose_weight', label: '⬇️ Lose weight' },
                { key: 'lose_weight_fast', label: '⚡ Lose weight fast' },
                { key: 'maintain', label: '⚖️ Maintain weight' },
                { key: 'build_muscle', label: '💪 Build muscle' },
                { key: 'bulk', label: '🏋️ Bulk' },
                { key: 'general_fitness', label: '🏃 General fitness' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setForm(f => ({ ...f, fitness_goal: key }))}
                  className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all text-left ${form.fitness_goal === key ? 'border-[#22C55E] bg-[#F0FDF4] text-[#166534]' : 'border-gray-100 bg-gray-50 text-[#0A1A2F]/60'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <p className="text-xs font-bold text-[#0A1A2F]/60 uppercase tracking-widest mb-2">Allergies / Avoid</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ALLERGY_LABELS).map(([key, label]) => {
                const active = form.allergies.includes(key);
                return (
                  <button key={key} onClick={() => toggle('allergies', key)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${active ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-100 bg-gray-50 text-[#0A1A2F]/55'}`}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Physical stats */}
          <div>
            <p className="text-xs font-bold text-[#0A1A2F]/60 uppercase tracking-widest mb-2">Physical Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'weight_kg', label: 'Weight (kg)', type: 'number' },
                { key: 'height_cm', label: 'Height (cm)', type: 'number' },
                { key: 'age', label: 'Age', type: 'number' },
                { key: 'workout_days_per_week', label: 'Workout days/week', type: 'number' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <p className="text-[10px] text-[#0A1A2F]/45 mb-1">{label}</p>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#0A1A2F] bg-gray-50 focus:outline-none focus:border-[#22C55E]" />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <p className="text-[10px] text-[#0A1A2F]/45 mb-1">Sex (for calorie calc)</p>
              <div className="flex gap-2">
                {['male', 'female'].map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, sex: s }))}
                    className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all capitalize ${form.sex === s ? 'border-[#22C55E] bg-[#F0FDF4] text-[#166534]' : 'border-gray-100 bg-gray-50 text-[#0A1A2F]/60'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Fixed footer button */}
        <div className="px-5 pt-3 pb-6 flex-shrink-0 border-t border-gray-100" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          <button onClick={save} disabled={saving}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            style={{ background: 'linear-gradient(135deg,#166534,#22C55E)' }}>
            {saving ? 'Saving…' : <><Check className="w-4 h-4" /> Save Goals</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function NutritionGoalsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showCalcInfo, setShowCalcInfo] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const verseIdx = new Date().getDay() % FOOD_VERSES.length;
  const verse = FOOD_VERSES[verseIdx];

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const diet       = user?.diet_type || 'no_restrictions';
  const allergies  = (user?.allergies || []).filter(a => a !== 'none');
  const meals      = user?.meals_per_day || '3';
  const cookTime   = user?.cooking_time || 'medium';
  const weight     = user?.weight_kg;
  const height     = user?.height_cm;
  const age        = user?.age;
  const sex        = user?.sex;
  const fitnessGoal= user?.fitness_goal || 'general_fitness';
  const days       = user?.workout_days_per_week || 3;

  const dietInfo   = DIET_LABELS[diet] || DIET_LABELS.no_restrictions;
  const cookInfo   = COOK_LABELS[cookTime] || COOK_LABELS.medium;
  const dietNote   = DIET_MACRO_NOTES[diet];
  const schedule   = MEAL_SCHEDULES[meals] || MEAL_SCHEDULES['3'];
  const recipes    = DIET_RECIPES[diet] || DIET_RECIPES.no_restrictions;

  const bmr        = calcBMR(weight, height, age, sex);
  const tdee       = calcTDEE(bmr, days);
  const daily      = goalCals(tdee, fitnessGoal);
  const macros     = macroSplit(daily, fitnessGoal, diet);
  const water      = waterGoal(weight, days);
  const incomplete = !weight || !height || !age;

  // Per-meal calorie guide
  const mealCals = daily ? {
    '2':  [Math.round(daily * 0.5), Math.round(daily * 0.5)],
    '3':  [Math.round(daily * 0.25), Math.round(daily * 0.35), Math.round(daily * 0.40)],
    '3+': [Math.round(daily * 0.25), Math.round(daily * 0.30), Math.round(daily * 0.10), Math.round(daily * 0.35)],
    'if': [Math.round(daily * 0.40), Math.round(daily * 0.25), Math.round(daily * 0.35)],
  }[meals] : null;

  return (
    <>
    <div className="min-h-screen pb-28" style={{ background: '#F2F6FA' }}>

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-bold text-[#0A1A2F]">Nutrition Goals</h1>
            <p className="text-xs text-[#0A1A2F]/45">Your nutrition profile</p>
          </div>
          <button onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#166534,#22C55E)' }}>
            <Pencil className="w-3.5 h-3.5" /> Update Goals
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-3xl p-5 relative overflow-hidden shadow-lg"
            style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #22C55E 200%)' }}>
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5" />
            <div className="absolute right-4 bottom-2 w-20 h-20 rounded-full bg-white/5" />
            <div className="relative">
              <p className="text-[10px] font-bold text-white/45 uppercase tracking-widest mb-1">Your Nutrition Profile</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{dietInfo.emoji}</span>
                <div>
                  <h1 id="tour-nutrition-goal-title" className="text-2xl font-black text-white leading-tight">{dietInfo.label}</h1>
                  <p className="text-white/55 text-xs mt-0.5">{MEAL_LABELS[meals]} · {cookInfo.emoji} {cookInfo.label}</p>
                </div>
              </div>
              {allergies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {allergies.map(a => (
                    <span key={a} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white/75">
                      {ALLERGY_LABELS[a]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Incomplete nudge */}
        {incomplete && user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 }}
            className="flex items-center gap-3 bg-[#FAD98D]/20 border border-[#FAD98D]/30 rounded-2xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-[#C9A227]">Profile incomplete</p>
              <p className="text-[11px] text-[#0A1A2F]/55">
                Add {!weight ? 'weight, ' : ''}{!height ? 'height, ' : ''}{!age ? 'age ' : ''}for personalised calorie targets.
              </p>
            </div>
            <Link to={createPageUrl('Settings')} className="text-[11px] font-bold text-[#C9A227] flex-shrink-0">Update →</Link>
          </motion.div>
        )}

        {/* Daily calories */}
        <motion.div id="tour-nutrition-calories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF7ED]">
                <Flame className="w-4 h-4 text-[#FD9C2D]" />
              </div>
              <p className="font-bold text-[#0A1A2F] text-sm">Daily Calorie Target</p>
            </div>
            <button onClick={() => setShowCalcInfo(v => !v)}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <Info className="w-3.5 h-3.5 text-[#0A1A2F]/40" />
            </button>
          </div>
          <AnimatePresence>
            {showCalcInfo && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="text-[11px] text-[#0A1A2F]/50 bg-[#F8FAFB] rounded-xl px-3 py-2 mb-3 leading-relaxed overflow-hidden">
                Mifflin-St Jeor BMR × activity factor ({days}×/week workouts) = TDEE of {tdee?.toLocaleString()} kcal.
                {fitnessGoal !== 'maintain' && ` Your ${fitnessGoal.replace('_', ' ')} goal applies a ${daily && tdee ? (daily - tdee > 0 ? '+' : '') + (daily - tdee) : ''} kcal/day adjustment.`}
                {diet === 'keto' && ' Keto macro split applied: 5% carbs, 65% fat, 30% protein.'}
              </motion.div>
            )}
          </AnimatePresence>
          {daily ? (
            <div className="text-center py-2">
              <p className="text-5xl font-black text-[#22C55E]">{daily.toLocaleString()}</p>
              <p className="text-sm text-[#0A1A2F]/45 mt-1">kcal per day</p>
            </div>
          ) : (
            <p className="text-sm text-[#0A1A2F]/40 py-2">Complete your profile to see calorie targets.</p>
          )}
          {dietNote && (
            <div className="flex items-start gap-2 bg-[#F0FDF4] rounded-xl px-3 py-2.5 mt-2">
              <Salad className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#166534]/70 leading-relaxed">{dietNote.note}</p>
            </div>
          )}
        </motion.div>

        {/* Macro split */}
        {macros && (
          <motion.div id="tour-nutrition-macros-goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}
            className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
                <BarChart2 className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <p className="font-bold text-[#0A1A2F] text-sm">Macro Targets</p>
              {diet === 'keto' && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Keto adjusted</span>
              )}
            </div>
            <div className="space-y-3">
              <Bar label="Protein" grams={macros.protein} cals={macros.protein * 4} color="#38BDF8" pct={diet === 'keto' ? 30 : (fitnessGoal === 'lose_weight' ? 40 : 35)} delay={0.1} />
              <Bar label="Carbohydrates" grams={macros.carbs} cals={macros.carbs * 4} color="#22C55E" pct={diet === 'keto' ? 5 : (fitnessGoal === 'lose_weight' ? 30 : 40)} delay={0.15} />
              <Bar label="Fat" grams={macros.fat} cals={macros.fat * 9} color="#C9A227" pct={diet === 'keto' ? 65 : 25} delay={0.2} />
            </div>
            <Link to={createPageUrl('Nutrition')} className="flex items-center gap-1 mt-4 text-xs font-semibold text-[#22C55E]">
              Track macros in Nutrition <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}

        {/* Meal timing */}
        <motion.div id="tour-meal-timing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F0FDF4]">
              <Clock className="w-4 h-4 text-[#22C55E]" />
            </div>
            <p className="font-bold text-[#0A1A2F] text-sm">Meal Schedule</p>
            <span className="ml-auto text-[10px] text-[#0A1A2F]/40 font-semibold">{MEAL_LABELS[meals]}</span>
          </div>
          <div className="space-y-2">
            {schedule.map((item, i) => {
              const calsForMeal = mealCals?.[i];
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16 + i * 0.04 }}
                  className="flex items-center gap-3 bg-[#F8FAFB] rounded-xl px-3.5 py-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                    style={{ background: item.startsWith('⏱️') ? '#94a3b8' : 'linear-gradient(135deg,#22C55E,#16a34a)' }}>
                    {item.startsWith('⏱️') ? '⏱' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0A1A2F] leading-snug">{item}</p>
                  </div>
                  {calsForMeal && (
                    <span className="text-[10px] font-bold text-[#22C55E] flex-shrink-0">{calsForMeal} kcal</span>
                  )}
                </motion.div>
              );
            })}
          </div>
          {meals === 'if' && (
            <p className="text-[11px] text-[#0A1A2F]/40 mt-3 leading-relaxed">
              Intermittent fasting: eat all meals within an 8-hour window. Stay hydrated with water, black coffee, or tea during the fasting window.
            </p>
          )}
        </motion.div>

        {/* Allergies / avoid card */}
        <motion.div id="tour-allergens" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50">
              <ShieldCheck className="w-4 h-4 text-red-400" />
            </div>
            <p className="font-bold text-[#0A1A2F] text-sm">Foods to Avoid</p>
          </div>
          {allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allergies.map(a => (
                <span key={a} className="flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />{ALLERGY_LABELS[a]}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#0A1A2F]/40">No allergens or restrictions set.</p>
          )}
          <p className="text-[11px] text-[#0A1A2F]/35 mt-3">
            Chef Daniel always checks these when suggesting meals. Update them in Settings if they change.
          </p>
        </motion.div>

        {/* Water goal */}
        {water && (
          <motion.div id="tour-nutrition-water" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
                <Droplets className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <p className="font-bold text-[#0A1A2F] text-sm">Daily Water Goal</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#EFF9FF] rounded-2xl py-3">
                <p className="text-2xl font-black text-[#38BDF8]">{water.total}L</p>
                <p className="text-[10px] text-[#38BDF8]/60 mt-0.5">total/day</p>
              </div>
              <div className="bg-[#F0FDF4] rounded-2xl py-3">
                <p className="text-2xl font-black text-[#22C55E]">{water.glasses}</p>
                <p className="text-[10px] text-[#22C55E]/60 mt-0.5">glasses</p>
              </div>
              <div className="bg-[#F8FAFB] rounded-2xl py-3">
                <p className="text-2xl font-black text-[#0A1A2F]/50">{Math.round(water.total * 34)}</p>
                <p className="text-[10px] text-[#0A1A2F]/30 mt-0.5">fl oz</p>
              </div>
            </div>
            {days >= 4 && (
              <p className="text-[11px] text-[#38BDF8]/60 mt-3">
                +0.5L added for your {days}×/week training schedule.
              </p>
            )}
            <Link to={createPageUrl('Nutrition')} className="flex items-center gap-1 mt-2 text-xs font-semibold text-[#38BDF8]">
              Track in Nutrition <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}

        {/* Recipe ideas */}
        <motion.div id="tour-recipe-ideas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
          className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F0FDF4]">
                <Apple className="w-4 h-4 text-[#22C55E]" />
              </div>
              <p className="font-bold text-[#0A1A2F] text-sm">Meal Ideas for You</p>
            </div>
            <span className="text-[10px] text-[#0A1A2F]/35 font-semibold">{dietInfo.label}</span>
          </div>
          <div className="space-y-2">
            {recipes.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 + i * 0.05 }}
                className="flex items-center gap-3 bg-[#F8FAFB] rounded-xl px-3.5 py-2.5">
                <span className="text-base flex-shrink-0">🍴</span>
                <p className="text-xs font-semibold text-[#0A1A2F]">{r}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-[11px] text-[#0A1A2F]/35 mt-3">Ask Chef Daniel to build any of these into your meal plan.</p>
        </motion.div>

        {/* Cooking time card */}
        <motion.div id="tour-cooking-style" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30 }}
          className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm">
          <span className="text-3xl">{cookInfo.emoji}</span>
          <div className="flex-1">
            <p className="font-bold text-[#0A1A2F] text-sm">{cookInfo.label}</p>
            <p className="text-xs text-[#0A1A2F]/45">{cookInfo.sub} · Chef Daniel tailors recipes to this</p>
          </div>
        </motion.div>

        {/* Scripture card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: 'linear-gradient(135deg,#0A1A2F,#1a3050)' }}>
          <BookOpen className="w-5 h-5 text-[#FAD98D] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-semibold leading-relaxed">{verse.text}</p>
            <p className="text-[#FAD98D] text-[10px] font-bold mt-1.5">{verse.ref}</p>
          </div>
        </motion.div>

        {/* Chef Daniel CTA */}
        <motion.div id="tour-chef-daniel-goals-cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-98 transition-transform"
          style={{ background: 'linear-gradient(135deg,#166534,#22C55E)' }}
          onClick={() => navigate(createPageUrl('ChatScreen?bot=ChefDaniel'))}>
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🍳</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">Ask Chef Daniel</p>
            <p className="text-xs text-white/65">Build a meal plan around your {dietInfo.label} diet</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/45" />
        </motion.div>

        {/* Quick links */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
          <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-2.5">Related Tools</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: '📋', label: 'Meal Planner',     page: 'Nutrition'         },
              { icon: '📊', label: 'Food Log History', page: 'FoodLogHistory'    },
              { icon: '🎯', label: 'Fitness Goals',    page: 'FitnessGoalsPage'  },
              { icon: '💬', label: 'Chat w/ Chef Daniel', page: 'ChatScreen?bot=ChefDaniel' },
            ].map(({ icon, label, page }) => (
              <Link key={page} to={createPageUrl(page)}
                className="flex items-center gap-2.5 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-50 active:scale-97 transition-all">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-bold text-[#0A1A2F] leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </div>

    <AnimatePresence>
      {showUpdateModal && (
        <UpdateGoalsModal
          user={user}
          onClose={() => setShowUpdateModal(false)}
          onSave={(updated) => setUser(updated)}
        />
      )}
    </AnimatePresence>
    </>
  );
}