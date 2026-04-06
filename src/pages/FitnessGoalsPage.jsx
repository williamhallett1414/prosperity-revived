import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scale, Target, Flame, Activity, Zap, Droplets,
  ChevronRight, Info, Edit2, Check, BarChart2, Clock
} from 'lucide-react';

// ── Calculations ──────────────────────────────────────────────────────────────
function calcBMI(w, h) { if (!w || !h) return null; return w / ((h / 100) ** 2); }
function bmiCat(bmi) {
  if (!bmi) return null;
  if (bmi < 18.5) return { label: 'Underweight', color: '#38BDF8', bg: '#EFF9FF' };
  if (bmi < 25)   return { label: 'Healthy',     color: '#22C55E', bg: '#F0FDF4' };
  if (bmi < 30)   return { label: 'Overweight',  color: '#FD9C2D', bg: '#FFF7ED' };
  return           { label: 'Obese',             color: '#F87171', bg: '#FEF2F2' };
}
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
function calcGoalCals(tdee, goal) {
  if (!tdee) return null;
  if (goal === 'lose_weight') return tdee - 500;
  if (goal === 'lose_weight_fast') return tdee - 750;
  if (goal === 'build_muscle') return tdee + 300;
  if (goal === 'bulk') return tdee + 500;
  return tdee;
}
function calcMacros(cals, goal) {
  if (!cals) return null;
  const loss = goal === 'lose_weight' || goal === 'lose_weight_fast';
  const gain = goal === 'build_muscle' || goal === 'bulk';
  const [p, c, f] = loss ? [0.40, 0.30, 0.30] : gain ? [0.35, 0.40, 0.25] : [0.30, 0.45, 0.25];
  return { protein: Math.round((cals * p) / 4), carbs: Math.round((cals * c) / 4), fat: Math.round((cals * f) / 9) };
}
function calcTimeline(cur, goal, rate = 0.45) {
  if (!cur || !goal) return null;
  const diff = Math.abs(cur - goal);
  if (diff < 0.5) return { weeks: 0, msg: "You're already at your goal weight!" };
  const weeks = Math.round(diff / rate);
  const d = new Date(); d.setDate(d.getDate() + weeks * 7);
  return {
    weeks, kg: diff.toFixed(1), direction: cur > goal ? 'lose' : 'gain',
    month: d.toLocaleString('default', { month: 'long' }), year: d.getFullYear()
  };
}
function calcIdeal(h, sex) {
  if (!h) return null;
  const hIn = h / 2.54;
  return sex === 'female' ? +(50 + 2.3 * (hIn - 60)).toFixed(1) : +(45.5 + 2.3 * (hIn - 60)).toFixed(1);
}

const GOAL_LABELS = {
  lose_weight: 'Lose Weight', lose_weight_fast: 'Lose Weight (Fast)',
  build_muscle: 'Build Muscle', bulk: 'Bulk Up', maintain: 'Maintain Weight',
  improve_endurance: 'Improve Endurance', improve_flexibility: 'Improve Flexibility',
  general_fitness: 'General Fitness',
};

// ── BMI gauge ─────────────────────────────────────────────────────────────────
function BMIGauge({ bmi }) {
  const cat = bmiCat(bmi);
  const pct = Math.min(Math.max(((bmi - 15) / 25) * 100, 2), 98);
  return (
    <div className="mt-3">
      <div className="relative h-3 rounded-full overflow-visible"
        style={{ background: 'linear-gradient(to right, #38BDF8 0%, #22C55E 30%, #FD9C2D 62%, #F87171 100%)' }}>
        <motion.div
          initial={{ left: '0%' }} animate={{ left: `calc(${pct}% - 6px)` }}
          transition={{ duration: 0.9, delay: 0.3, type: 'spring' }}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-5 rounded-sm bg-white shadow-md border-2 border-gray-200"
          style={{ zIndex: 2 }} />
      </div>
      <div className="flex justify-between mt-1.5">
        {['Under', 'Healthy', 'Over', 'Obese'].map(l => (
          <span key={l} className="text-[9px] text-[#0A1A2F]/35 font-semibold">{l}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-3xl font-black" style={{ color: cat.color }}>{bmi.toFixed(1)}</span>
        <span className="text-sm font-bold px-2.5 py-1 rounded-full" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
      </div>
    </div>
  );
}

// ── Macro bar ─────────────────────────────────────────────────────────────────
function MacroBar({ label, grams, cals, color, pct }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-[#0A1A2F]">{label}</span>
        <span className="text-xs text-[#0A1A2F]/50">{grams}g · {cals} kcal</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="h-full rounded-full" style={{ background: color }} />
      </div>
    </div>
  );
}

// ── Weight log ────────────────────────────────────────────────────────────────
function WeightLog({ onLog, latest }) {
  const [val, setVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const save = async () => {
    const kg = parseFloat(val);
    if (!kg || kg < 20 || kg > 400) return;
    setSaving(true);
    try {
      await base44.auth.updateMe({ weight_kg: kg });
      setDone(true); onLog(kg);
      setTimeout(() => { setDone(false); setVal(''); }, 2000);
    } finally { setSaving(false); }
  };
  return (
    <div className="flex items-center gap-2 mt-3">
      <input type="number" value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && save()}
        placeholder={latest ? `Current: ${latest} kg — update` : "Log today's weight (kg)"}
        className="flex-1 bg-[#F2F6FA] rounded-xl px-3.5 py-2.5 text-sm text-[#0A1A2F] outline-none border-2 border-transparent focus:border-[#38BDF8] transition-colors placeholder:text-[#0A1A2F]/30" />
      <button onClick={save} disabled={!val || saving}
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 active:scale-90 transition-all"
        style={{ background: done ? '#22C55E' : 'linear-gradient(135deg,#38BDF8,#0284c7)' }}>
        {done ? <Check className="w-4 h-4 text-white" /> : <Edit2 className="w-4 h-4 text-white" />}
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FitnessGoalsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [liveWeight, setLiveWeight] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => { base44.auth.me().then(u => { setUser(u); setLiveWeight(u?.weight_kg || null); }).catch(() => {}); }, []);

  const weight  = liveWeight || user?.weight_kg;
  const height  = user?.height_cm;
  const age     = user?.age;
  const sex     = user?.sex;
  const goal    = user?.fitness_goal || 'general_fitness';
  const goalWt  = user?.goal_weight_kg;
  const days    = user?.workout_days_per_week || 3;
  const level   = user?.fitness_level || 'beginner';

  const bmi     = calcBMI(weight, height);
  const bmr     = calcBMR(weight, height, age, sex);
  const tdee    = calcTDEE(bmr, days);
  const gCals   = calcGoalCals(tdee, goal);
  const macros  = calcMacros(gCals, goal);
  const tl      = calcTimeline(weight, goalWt);
  const ideal   = calcIdeal(height, sex);
  const isLoss  = goal === 'lose_weight' || goal === 'lose_weight_fast';
  const isGain  = goal === 'build_muscle' || goal === 'bulk';
  const wDiff   = weight && goalWt ? Math.abs(weight - goalWt).toFixed(1) : null;
  const cat     = bmiCat(bmi);

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F2F6FA' }}>

      {/* ── Standard Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#FAD98D]/20 px-4 pt-4 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0A1A2F]">Fitness Goals</h1>
            <p className="text-xs text-[#0A1A2F]/45">Your fitness profile</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-3xl p-5 relative overflow-hidden shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #1A3050 60%, #38BDF8 180%)' }}>
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
            <div className="relative">
              <p className="text-[10px] font-bold text-white/45 uppercase tracking-widest mb-1">Your Fitness Profile</p>
              <h1 id="tour-fitness-goal-title" className="text-2xl font-black text-white leading-tight">
                {GOAL_LABELS[goal] || 'Fitness Goals'}
              </h1>
              <p className="text-white/50 text-xs mt-1">
                {height ? `${height} cm · ` : ''}{weight ? `${weight} kg · ` : ''}
                {level.charAt(0).toUpperCase() + level.slice(1)} · {days}×/week
              </p>
              {wDiff && goalWt && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="h-full w-[8%] rounded-full bg-[#38BDF8]" />
                  </div>
                  <span className="text-xs font-bold text-white/70 flex-shrink-0">{wDiff} kg to go</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile incomplete nudge */}
        {user && (!height || !weight || !age) && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
            className="flex items-center gap-3 bg-[#FAD98D]/20 border border-[#FAD98D]/30 rounded-2xl px-4 py-3">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#C9A227]">Profile incomplete</p>
              <p className="text-[11px] text-[#0A1A2F]/55">
                Add your {!height ? 'height, ' : ''}{!weight ? 'weight, ' : ''}{!age ? 'age' : ''} in Settings for full calculations.
              </p>
            </div>
            <Link to={createPageUrl('Settings')} className="text-[11px] font-bold text-[#C9A227] flex-shrink-0">Update →</Link>
          </motion.div>
        )}

        {/* BMI */}
        <motion.div id="tour-bmi-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#EFF9FF]">
                <Scale className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <p className="font-bold text-[#0A1A2F] text-sm">Body Mass Index</p>
            </div>
            {cat && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>}
          </div>
          {bmi ? <BMIGauge bmi={bmi} /> : (
            <p className="text-sm text-[#0A1A2F]/40 mt-2">Add height and weight in your profile to see BMI.</p>
          )}
          {ideal && (
            <p className="text-[10px] text-[#0A1A2F]/40 mt-3 border-t border-gray-50 pt-3">
              Ideal weight for your height: <strong className="text-[#0A1A2F]/60">{(ideal - 5).toFixed(0)}–{(ideal + 5).toFixed(0)} kg</strong>
            </p>
          )}
          <WeightLog onLog={setLiveWeight} latest={weight} />
        </motion.div>

        {/* Calories */}
        <motion.div id="tour-calories-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
          className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF7ED]">
                <Flame className="w-4 h-4 text-[#FD9C2D]" />
              </div>
              <p className="font-bold text-[#0A1A2F] text-sm">Daily Calorie Target</p>
            </div>
            <button onClick={() => setShowInfo(v => !v)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <Info className="w-3.5 h-3.5 text-[#0A1A2F]/40" />
            </button>
          </div>
          <AnimatePresence>
            {showInfo && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="text-[11px] text-[#0A1A2F]/50 bg-[#F8FAFB] rounded-xl px-3 py-2 mb-3 leading-relaxed overflow-hidden">
                Uses the <strong>Mifflin-St Jeor</strong> BMR equation × an activity factor for {days}×/week workouts.
                {goal !== 'maintain' && ` Goal adjustment: ${isLoss ? '-500 kcal deficit' : '+300 kcal surplus'}/day.`}
              </motion.div>
            )}
          </AnimatePresence>
          {tdee ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-3.5 text-center" style={{ background: 'linear-gradient(135deg,#FFF7ED,#FEF3C7)' }}>
                  <p className="text-[10px] font-bold text-[#FD9C2D]/70 uppercase tracking-widest">Maintenance</p>
                  <p className="text-2xl font-black text-[#FD9C2D] mt-1">{tdee.toLocaleString()}</p>
                  <p className="text-[10px] text-[#FD9C2D]/55">kcal/day</p>
                </div>
                <div className="rounded-2xl p-3.5 text-center"
                  style={{ background: isLoss ? 'linear-gradient(135deg,#F0FDF4,#DCFCE7)' : 'linear-gradient(135deg,#EFF9FF,#E0F2FE)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isLoss ? '#22C55E' : '#38BDF8' }}>
                    {GOAL_LABELS[goal] || 'Goal'}
                  </p>
                  <p className="text-2xl font-black mt-1" style={{ color: isLoss ? '#22C55E' : '#38BDF8' }}>{gCals?.toLocaleString()}</p>
                  <p className="text-[10px] opacity-55" style={{ color: isLoss ? '#22C55E' : '#38BDF8' }}>kcal/day</p>
                </div>
              </div>
              {isLoss && <p className="text-[11px] text-[#0A1A2F]/40 text-center">~500 kcal deficit → ~0.5 kg/week loss</p>}
            </div>
          ) : (
            <p className="text-sm text-[#0A1A2F]/40">Complete your profile to see calorie targets.</p>
          )}
        </motion.div>

        {/* Macros */}
        {macros && (
          <motion.div id="tour-macros-split" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
            className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#F0FDF4]">
                <BarChart2 className="w-4 h-4 text-[#22C55E]" />
              </div>
              <p className="font-bold text-[#0A1A2F] text-sm">Macro Split</p>
            </div>
            <div className="space-y-3">
              <MacroBar label="Protein" grams={macros.protein} cals={macros.protein * 4} color="#38BDF8" pct={isLoss ? 40 : isGain ? 35 : 30} />
              <MacroBar label="Carbohydrates" grams={macros.carbs} cals={macros.carbs * 4} color="#FD9C2D" pct={isLoss ? 30 : isGain ? 40 : 45} />
              <MacroBar label="Fat" grams={macros.fat} cals={macros.fat * 9} color="#C9A227" pct={isLoss ? 30 : 25} />
            </div>
            <p className="text-[10px] text-[#0A1A2F]/35 mt-3 pt-3 border-t border-gray-50">
              Optimised for {GOAL_LABELS[goal]}. Log meals in Nutrition to track against these.
            </p>
            <Link to={createPageUrl('Nutrition')} className="flex items-center gap-1 mt-2 text-xs font-semibold text-[#22C55E]">
              Open Nutrition <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}

        {/* Timeline */}
        {tl && goalWt && (
          <motion.div id="tour-timeline-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
            className="rounded-3xl p-5 shadow-sm relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0A1A2F, #1A3050)' }}>
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <p className="font-bold text-white text-sm">Goal Timeline</p>
            </div>
            {tl.weeks === 0 ? (
              <p className="text-white font-bold text-lg">{tl.msg}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Target by</p>
                    <p className="text-3xl font-black text-white">{tl.month}</p>
                    <p className="text-lg font-bold text-white/55">{tl.year}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">To {tl.direction}</p>
                    <p className="text-3xl font-black text-[#38BDF8]">{tl.kg} kg</p>
                    <p className="text-xs text-white/35">{tl.weeks} weeks</p>
                  </div>
                </div>
                <div className="bg-white/8 rounded-2xl p-3 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#FAD98D] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60 leading-relaxed">
                    At ~0.45 kg/week ({isLoss ? '500 kcal/day deficit' : '300 kcal/day surplus'}).
                    {days >= 3 ? ` Your ${days}×/week training keeps you on track.` : ''}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Insight row */}
        {bmr && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Activity, color: '#AFC7E3', bg: '#EFF3FF', title: 'Resting BMR', value: `${Math.round(bmr).toLocaleString()} kcal`, sub: 'Calories burned at rest' },
              { icon: Target,   color: '#FD9C2D', bg: '#FFF7ED', title: 'Weekly burn',  value: `${(tdee * 7 / 1000).toFixed(1)}k kcal`, sub: `Across ${days} workouts + life` },
            ].map(({ icon: Icon, color, bg, title, value, sub }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.03 }}
                className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <p className="text-[10px] font-bold text-[#0A1A2F]/40 uppercase tracking-widest">{title}</p>
                </div>
                <p className="text-xl font-black text-[#0A1A2F]">{value}</p>
                <p className="text-[10px] text-[#0A1A2F]/40 mt-0.5">{sub}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Hydration */}
        {weight && (
          <motion.div id="tour-hydration-tip" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
            className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#EFF9FF] flex-shrink-0">
              <Droplets style={{ width: 18, height: 18, color: '#38BDF8' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#0A1A2F] text-sm">Daily Water Goal</p>
              <p className="text-xs text-[#0A1A2F]/45">
                {(weight * 0.033).toFixed(1)}L · {Math.ceil(weight * 0.033 / 0.25)} glasses
                {days >= 4 ? ' (+0.5L on training days)' : ''}
              </p>
            </div>
            <Link to={createPageUrl('Nutrition')} className="w-8 h-8 rounded-full bg-[#EFF9FF] flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-[#38BDF8]" />
            </Link>
          </motion.div>
        )}

        {/* Coach David CTA */}
        <motion.div id="tour-coach-david-cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-98 transition-transform"
          style={{ background: 'linear-gradient(135deg,#1e40af,#38BDF8)' }}
          onClick={() => navigate(createPageUrl('ChatScreen?bot=CoachDavid'))}>
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💪</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">Ask Coach David</p>
            <p className="text-xs text-white/60">Get a personalised plan based on your goal</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/45" />
        </motion.div>

        {/* Quick links */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
          <p className="text-[10px] font-bold text-[#0A1A2F]/35 uppercase tracking-widest mb-2.5">Related Tools</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: '📊', label: 'Workout Trends',   page: 'WorkoutTrends'   },
              { icon: '🍽️', label: 'Nutrition Log',     page: 'Nutrition'       },
              { icon: '🏆', label: 'Workout Progress',  page: 'WorkoutProgress' },
              { icon: '📅', label: 'Workout Planner',   page: 'WorkoutPlanner'  },
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
  );
}
