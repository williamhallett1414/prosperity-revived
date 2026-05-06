/**
 * ChatbotPreferencesTab
 * ─────────────────────────────────────────────────────────────────────
 * Per-coach preference panels for the Profile page.
 *
 * Two redesign principles applied here:
 *
 *   1. CONVERSATIONAL REFRAME. Each coach speaks to the user in their
 *      own voice. Sub-section labels were ALL-CAPS form labels
 *      ("SPIRITUAL TOPICS", "FITNESS GOALS"); now they're first-person
 *      questions from the coach ("What's on your heart spiritually?",
 *      "What are you training for?"). The page reads like meeting each
 *      coach, not filling a form.
 *
 *   2. AUTO-SAVE. The five "Save X Preferences" buttons are gone. As the
 *      user taps chips, a debounced effect (600ms after the last tap)
 *      writes the preference to base44. A small "Saved" pulse confirms
 *      the write. If the write fails, a toast surfaces the error.
 *
 *      The previous flow required users to remember to hit Save in
 *      five separate places. If they tapped chips for one coach but
 *      navigated away, those chips were lost silently. Auto-save makes
 *      preferences persist as the user expects.
 *
 * Section headers also gained a one-line status summary —
 * "5 topics · Story-Driven · Growing Deeper" or "Tap to personalize"
 * so users see at a glance which coaches they've tuned.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

// ── Shared data (mirrors onboarding constants) ──────────────────────────────
const FITNESS_GOALS = [
  { id: 'build_muscle', label: '💪 Build Muscle' },
  { id: 'lose_fat', label: '🔥 Lose Fat' },
  { id: 'improve_endurance', label: '🏃 Endurance' },
  { id: 'get_stronger', label: '🏋️ Get Stronger' },
  { id: 'stay_active', label: '⚡ Stay Active' },
  { id: 'sport_performance', label: '🏅 Sport Perf.' },
];
const FITNESS_LEVELS = [
  { id: 'beginner', label: '🌱 Beginner', desc: '0–1 yr' },
  { id: 'intermediate', label: '💪 Intermediate', desc: '1–3 yrs' },
  { id: 'advanced', label: '🏆 Advanced', desc: '3+ yrs' },
];
const TRACKERS = [
  { id: 'apple_health', label: 'Apple Health', icon: '🍎' },
  { id: 'google_fit', label: 'Google Fit', icon: '🤖' },
  { id: 'garmin', label: 'Garmin', icon: '⌚' },
  { id: 'fitbit', label: 'Fitbit', icon: '📊' },
  { id: 'whoop', label: 'WHOOP', icon: '💜' },
  { id: 'none', label: 'No tracker', icon: '🙅' },
];
const DIET_TYPES = [
  { id: 'any', label: '🍽️ No restrictions' },
  { id: 'vegetarian', label: '🥦 Vegetarian' },
  { id: 'vegan', label: '🌱 Vegan' },
  { id: 'keto', label: '🥑 Keto' },
  { id: 'paleo', label: '🍖 Paleo' },
  { id: 'gluten_free', label: '🌾 Gluten-Free' },
  { id: 'halal', label: '☪️ Halal' },
  { id: 'kosher', label: '✡️ Kosher' },
];
const NUTRITION_GOALS = [
  { id: 'muscle_gain', label: '💪 Build Muscle' },
  { id: 'weight_loss', label: '🔥 Lose Weight' },
  { id: 'maintenance', label: '⚖️ Maintain Weight' },
  { id: 'performance', label: '🏅 Performance' },
  { id: 'gut_health', label: '🌿 Gut Health' },
  { id: 'energy', label: '⚡ More Energy' },
];
const ALLERGIES = [
  { id: 'nuts', label: '🥜 Tree Nuts' },
  { id: 'peanuts', label: '🥜 Peanuts' },
  { id: 'dairy', label: '🥛 Dairy' },
  { id: 'eggs', label: '🥚 Eggs' },
  { id: 'soy', label: '🫘 Soy' },
  { id: 'shellfish', label: '🦐 Shellfish' },
  { id: 'fish', label: '🐟 Fish' },
  { id: 'none', label: '✅ None' },
];
const PANTRY_STAPLES = [
  'Chicken breast', 'Rice', 'Eggs', 'Olive oil', 'Oats',
  'Greek yogurt', 'Pasta', 'Sweet potato', 'Canned tuna', 'Quinoa',
  'Broccoli', 'Spinach', 'Black beans', 'Almonds', 'Avocado',
];
const GROWTH_AREAS = [
  { id: 'emotional_intelligence', label: '🧠 Emotional Intelligence' },
  { id: 'habits', label: '✅ Habit Building' },
  { id: 'relationships', label: '💞 Relationships' },
  { id: 'career', label: '🚀 Career & Purpose' },
  { id: 'financial_mindset', label: '💰 Money Mindset' },
  { id: 'confidence', label: '💪 Confidence' },
  { id: 'stress_anxiety', label: '🌿 Stress & Anxiety' },
  { id: 'leadership', label: '🏅 Leadership' },
];
const CORE_VALUES = [
  { id: 'family', label: '👨‍👩‍👧 Family' },
  { id: 'freedom', label: '🦋 Freedom' },
  { id: 'growth', label: '🌱 Growth' },
  { id: 'faith', label: '🙏 Faith' },
  { id: 'health', label: '❤️‍🔥 Health' },
  { id: 'love', label: '💛 Love' },
  { id: 'authenticity', label: '✨ Authenticity' },
  { id: 'impact', label: '🌍 Impact' },
  { id: 'creativity', label: '🎨 Creativity' },
  { id: 'security', label: '🏡 Security' },
  { id: 'adventure', label: '🧭 Adventure' },
  { id: 'connection', label: '🤝 Connection' },
];
const COACHING_STYLES = [
  { id: 'gentle_supportive', label: '🌸 Gentle & Supportive' },
  { id: 'direct_actionable', label: '⚡ Direct & Actionable' },
  { id: 'exploratory_curious', label: '🔍 Exploratory' },
  { id: 'structured_practical', label: '📋 Structured & Practical' },
];

// ── Coach color tokens ──────────────────────────────────────────────────────
const COACH_COLORS = {
  amber:  { fill: '#fef3c7', text: '#92400e', border: '#fbbf24', dot: '#c9a227' },
  purple: { fill: '#f3e8ff', text: '#6b21a8', border: '#a78bfa', dot: '#7c3aed' },
  green:  { fill: '#d1fae5', text: '#065f46', border: '#34d399', dot: '#10b981' },
  orange: { fill: '#ffedd5', text: '#9a3412', border: '#fb923c', dot: '#ea580c' },
  violet: { fill: '#ede9fe', text: '#4c1d95', border: '#a78bfa', dot: '#7c3aed' },
};

// ── Auto-save hook ──────────────────────────────────────────────────────────
function useDebouncedAutoSave(versionKey, mutate, opts = {}) {
  const { delay = 600, enabled = true } = opts;
  const [saveState, setSaveState] = useState('idle');
  const firstRun = useRef(true);
  const savedTimer = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSaveState('pending');
    const t = setTimeout(() => {
      mutate(undefined, {
        onSuccess: () => {
          setSaveState('saved');
          if (savedTimer.current) clearTimeout(savedTimer.current);
          savedTimer.current = setTimeout(() => setSaveState('idle'), 1500);
        },
        onError: () => setSaveState('error'),
      });
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionKey, enabled]);

  return { saveState };
}

// ── Tiny status pill ────────────────────────────────────────────────────────
function SaveDot({ state, color = '#10b981' }) {
  return (
    <AnimatePresence mode="wait">
      {state === 'pending' && (
        <motion.span
          key="pending"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" />
          Saving…
        </motion.span>
      )}
      {state === 'saved' && (
        <motion.span
          key="saved"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="inline-flex items-center gap-1 text-[10px] font-semibold"
          style={{ color }}
        >
          <Check className="w-3 h-3" /> Saved
        </motion.span>
      )}
      {state === 'error' && (
        <motion.span
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500"
        >
          ⚠ Retry?
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ── Conversational prompt ────────────────────────────────────────────────────
function Prompt({ children, hint }) {
  return (
    <p className="text-sm text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">
      {children}
      {hint && <span className="text-xs text-gray-400 dark:text-gray-400 ml-1.5">· {hint}</span>}
    </p>
  );
}

// ── Chip primitive ───────────────────────────────────────────────────────────
function Chip({ label, selected, disabled, onClick, colors, full = false }) {
  return (
    <button
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      className={`text-xs px-3 py-2 rounded-full border-2 font-medium transition-all ${
        full ? 'w-full text-left' : ''
      } ${
        disabled && !selected
          ? 'border-gray-100 dark:border-white/10 text-gray-300 dark:text-gray-500 cursor-not-allowed'
          : 'cursor-pointer'
      }`}
      style={
        selected
          ? {
              borderColor: colors.border,
              backgroundColor: colors.fill,
              color: colors.text,
            }
          : disabled
            ? {}
            : {
                borderColor: 'rgba(0,0,0,0.1)',
                backgroundColor: 'transparent',
                color: 'rgb(75, 85, 99)',
              }
      }
    >
      {selected && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
      {label}
    </button>
  );
}

// ── Group of multi-select chips ──────────────────────────────────────────────
function MultiChips({ items, selected, onToggle, max, colors }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => {
        const isSelected = selected.includes(item.id);
        const disabled = max && !isSelected && selected.length >= max;
        return (
          <Chip
            key={item.id}
            label={item.label}
            selected={isSelected}
            disabled={disabled}
            onClick={() => onToggle(item.id)}
            colors={colors}
          />
        );
      })}
    </div>
  );
}

// ── Group of single-select chips ─────────────────────────────────────────────
function SingleChips({ items, selected, onSelect, colors, layout = 'wrap' }) {
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {items.map(item => (
          <Chip
            key={item.id}
            label={item.label}
            selected={selected === item.id}
            onClick={() => onSelect(item.id)}
            colors={colors}
            full
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <Chip
          key={item.id}
          label={item.label}
          selected={selected === item.id}
          onClick={() => onSelect(item.id)}
          colors={colors}
        />
      ))}
    </div>
  );
}

// ── Coach section wrapper ───────────────────────────────────────────────────
function Section({
  title,
  emoji,
  status,
  saveState,
  accentColor,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden mb-4 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <span className="text-xl flex-shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 dark:text-gray-100">{title}</span>
            <SaveDot state={saveState} color={accentColor} />
          </div>
          <p className={`text-xs mt-0.5 truncate ${status ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 italic'}`}>
            {status || 'Tap to personalize'}
          </p>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-300 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-300 flex-shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pt-4 pb-6 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/10 space-y-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Coach David panel ───────────────────────────────────────────────────────
function CoachDavidPrefs({ user }) {
  const qc = useQueryClient();
  const colors = COACH_COLORS.green;

  const { data: memory } = useQuery({
    queryKey: ['coachDavidMemory', user?.email],
    queryFn: () => base44.entities.ChatbotMemory.filter({ chatbot_name: 'CoachDavid', created_by: user.email }),
    enabled: !!user?.email,
  });

  const parseMemory = (mems) => {
    const onb = mems?.find(m => m.context === 'Onboarding setup');
    if (!onb) return {};
    const c = onb.content || '';
    const goals = (c.match(/Fitness goals: ([^.]+)/) || [])[1]?.split(', ').map(l => FITNESS_GOALS.find(g => g.label === l)?.id).filter(Boolean) || [];
    const level = (c.match(/Level: (\w+)/) || [])[1] || '';
    const tracker = (c.match(/Tracker: (\w+)/) || [])[1] || '';
    const days = (c.match(/(\d+)x\/week/) || [])[1];
    return { goals, level, tracker, workoutDays: days ? parseInt(days) : 3 };
  };

  const parsed = parseMemory(memory);
  const [goals, setGoals] = useState(parsed.goals || []);
  const [level, setLevel] = useState(parsed.level || '');
  const [tracker, setTracker] = useState(parsed.tracker || '');
  const [workoutDays, setWorkoutDays] = useState(parsed.workoutDays || 3);

  useEffect(() => {
    const p = parseMemory(memory);
    if (p.goals?.length) setGoals(p.goals);
    if (p.level) setLevel(p.level);
    if (p.tracker) setTracker(p.tracker);
    if (p.workoutDays) setWorkoutDays(p.workoutDays);
  }, [memory]);

  const mutation = useMutation({
    mutationFn: async () => {
      const goalLabels = goals.map(g => FITNESS_GOALS.find(f => f.id === g)?.label || g);
      const content = `Fitness goals: ${goalLabels.join(', ')}. Level: ${level}. Tracker: ${tracker}. Trains ${workoutDays}x/week.`;
      const existing = memory?.find(m => m.context === 'Onboarding setup');
      if (existing) {
        await base44.entities.ChatbotMemory.update(existing.id, { content, last_referenced: new Date().toISOString() });
      } else {
        await base44.entities.ChatbotMemory.create({
          chatbot_name: 'CoachDavid', memory_type: 'preference', content,
          context: 'Onboarding setup', importance: 9,
          conversation_date: new Date().toISOString().split('T')[0],
          last_referenced: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coachDavidMemory'] }),
    onError: () => toast.error("Couldn't save Coach David preferences"),
  });

  const versionKey = JSON.stringify({ goals, level, tracker, workoutDays });
  const { saveState } = useDebouncedAutoSave(versionKey, mutation.mutate, { enabled: !!user?.email });

  const status = (() => {
    const parts = [];
    if (goals.length) parts.push(`${goals.length} goal${goals.length === 1 ? '' : 's'}`);
    if (level) parts.push(FITNESS_LEVELS.find(l => l.id === level)?.label?.replace(/^[^\s]+\s/, '') || level);
    if (workoutDays) parts.push(`${workoutDays}×/week`);
    return parts.length ? parts.join(' · ') : '';
  })();

  return (
    <Section
      title="Coach David"
      emoji="💪"
      status={status}
      saveState={saveState}
      accentColor={colors.dot}
    >
      <div>
        <Prompt>What are you training for?</Prompt>
        <MultiChips
          items={FITNESS_GOALS}
          selected={goals}
          onToggle={(id) => setGoals(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          colors={colors}
        />
      </div>
      <div>
        <Prompt>Where are you in your training journey?</Prompt>
        <div className="flex gap-2">
          {FITNESS_LEVELS.map(l => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className="flex-1 text-xs px-2 py-3 rounded-xl border-2 font-medium transition-all text-center"
              style={
                level === l.id
                  ? { borderColor: colors.border, backgroundColor: colors.fill, color: colors.text }
                  : { borderColor: 'rgba(0,0,0,0.1)', color: 'rgb(75,85,99)' }
              }
            >
              <div>{l.label}</div>
              <div className="text-[10px] opacity-60 mt-0.5">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Prompt>Are you tracking your workouts anywhere?</Prompt>
        <div className="grid grid-cols-3 gap-2">
          {TRACKERS.map(t => (
            <button
              key={t.id}
              onClick={() => setTracker(t.id)}
              className="rounded-xl border-2 p-2.5 flex flex-col items-center gap-1 transition-all"
              style={
                tracker === t.id
                  ? { borderColor: colors.border, backgroundColor: colors.fill }
                  : { borderColor: 'rgba(0,0,0,0.1)' }
              }
            >
              <span className="text-lg">{t.icon}</span>
              <span className="text-[11px] font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Prompt hint={`${workoutDays}×/week`}>How many days a week do you want to train?</Prompt>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map(d => (
            <button
              key={d}
              onClick={() => setWorkoutDays(d)}
              className="w-10 h-10 rounded-full border-2 font-bold text-xs transition-all"
              style={
                workoutDays === d
                  ? { borderColor: colors.border, backgroundColor: colors.fill, color: colors.text }
                  : { borderColor: 'rgba(0,0,0,0.1)', color: 'rgb(75,85,99)' }
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Chef Daniel panel ───────────────────────────────────────────────────────
function ChefDanielPrefs({ user }) {
  const qc = useQueryClient();
  const colors = COACH_COLORS.orange;

  const { data: memory } = useQuery({
    queryKey: ['chefDanielMemory', user?.email],
    queryFn: () => base44.entities.ChatbotMemory.filter({ chatbot_name: 'ChefDaniel', created_by: user.email }),
    enabled: !!user?.email,
  });

  const [diet, setDiet] = useState('');
  const [nutritionGoal, setNutritionGoal] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [pantry, setPantry] = useState([]);

  useEffect(() => {
    const onb = memory?.find(m => m.context === 'Onboarding dietary setup');
    if (!onb) return;
    const content = onb.content || '';
    const dietMatch = DIET_TYPES.find(d => content.includes(d.label));
    if (dietMatch) setDiet(dietMatch.id);
    const goalMatch = NUTRITION_GOALS.find(g => content.includes(g.label));
    if (goalMatch) setNutritionGoal(goalMatch.id);
    const allergyMatches = ALLERGIES.filter(a => content.toLowerCase().includes(a.label.toLowerCase().replace(/^[^\s]+\s/, ''))).map(a => a.id);
    if (allergyMatches.length) setAllergies(allergyMatches);
    const pantryMatches = PANTRY_STAPLES.filter(p => content.includes(p));
    if (pantryMatches.length) setPantry(pantryMatches);
  }, [memory]);

  const toggleAllergy = (id) => {
    if (id === 'none') { setAllergies(['none']); return; }
    setAllergies(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev.filter(a => a !== 'none'), id]);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const allergyList = allergies.filter(a => a !== 'none');
      const content = [
        `Diet type: ${DIET_TYPES.find(d => d.id === diet)?.label || diet}`,
        `Nutrition goal: ${NUTRITION_GOALS.find(g => g.id === nutritionGoal)?.label || nutritionGoal}`,
        allergyList.length > 0 ? `Allergies: ${allergyList.join(', ')}` : 'No allergies',
        pantry.length > 0 ? `Pantry staples: ${pantry.join(', ')}` : '',
      ].filter(Boolean).join('. ');
      const existing = memory?.find(m => m.context === 'Onboarding dietary setup');
      if (existing) {
        await base44.entities.ChatbotMemory.update(existing.id, { content, last_referenced: new Date().toISOString() });
      } else {
        await base44.entities.ChatbotMemory.create({
          chatbot_name: 'ChefDaniel', memory_type: 'preference', content,
          context: 'Onboarding dietary setup', importance: 9,
          conversation_date: new Date().toISOString().split('T')[0],
          last_referenced: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chefDanielMemory'] }),
    onError: () => toast.error("Couldn't save Chef Daniel preferences"),
  });

  const versionKey = JSON.stringify({ diet, nutritionGoal, allergies, pantry });
  const { saveState } = useDebouncedAutoSave(versionKey, mutation.mutate, { enabled: !!user?.email });

  const status = (() => {
    const parts = [];
    if (diet) parts.push(DIET_TYPES.find(d => d.id === diet)?.label?.replace(/^[^\s]+\s/, '') || diet);
    if (nutritionGoal) parts.push(NUTRITION_GOALS.find(g => g.id === nutritionGoal)?.label?.replace(/^[^\s]+\s/, '') || nutritionGoal);
    if (pantry.length) parts.push(`${pantry.length} pantry`);
    return parts.length ? parts.join(' · ') : '';
  })();

  return (
    <Section
      title="Chef Daniel"
      emoji="👨‍🍳"
      status={status}
      saveState={saveState}
      accentColor={colors.dot}
    >
      <div>
        <Prompt>How do you eat?</Prompt>
        <SingleChips items={DIET_TYPES} selected={diet} onSelect={setDiet} colors={colors} />
      </div>
      <div>
        <Prompt>What's your goal with food right now?</Prompt>
        <SingleChips items={NUTRITION_GOALS} selected={nutritionGoal} onSelect={setNutritionGoal} colors={colors} />
      </div>
      <div>
        <Prompt>Anything I should avoid in your meals?</Prompt>
        <MultiChips items={ALLERGIES} selected={allergies} onToggle={toggleAllergy} colors={colors} />
      </div>
      <div>
        <Prompt hint={`${pantry.length} selected`}>What do you usually keep on hand?</Prompt>
        <div className="flex flex-wrap gap-2">
          {PANTRY_STAPLES.map(item => (
            <Chip
              key={item}
              label={item}
              selected={pantry.includes(item)}
              onClick={() => setPantry(prev => prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item])}
              colors={colors}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Hannah panel ────────────────────────────────────────────────────────────
function HannahPrefs({ user }) {
  const qc = useQueryClient();
  const colors = COACH_COLORS.purple;

  const { data: profiles } = useQuery({
    queryKey: ['hannahProfile', user?.email],
    queryFn: () => base44.entities.HannahUserProfile.filter({ user_email: user.email }),
    enabled: !!user?.email,
  });

  const profile = profiles?.[0];

  const [growthAreas, setGrowthAreas] = useState(profile?.growth_areas || []);
  const [coreValues, setCoreValues] = useState(profile?.core_values || []);
  const [coachingStyle, setCoachingStyle] = useState(profile?.preferred_coaching_style || '');
  const [goalText, setGoalText] = useState(profile?.long_term_goals?.[0] || '');

  useEffect(() => {
    if (profile) {
      setGrowthAreas(profile.growth_areas || []);
      setCoreValues(profile.core_values || []);
      setCoachingStyle(profile.preferred_coaching_style || '');
      setGoalText(profile.long_term_goals?.[0] || '');
    }
  }, [profile]);

  const toggleArea = (id) => setGrowthAreas(prev => prev.includes(id) ? prev.filter(a => a !== id) : prev.length < 4 ? [...prev, id] : prev);
  const toggleValue = (id) => setCoreValues(prev => prev.includes(id) ? prev.filter(v => v !== id) : prev.length < 5 ? [...prev, id] : prev);

  const mutation = useMutation({
    mutationFn: async () => {
      const profileData = {
        user_email: user.email,
        growth_areas: growthAreas,
        core_values: coreValues,
        preferred_coaching_style: coachingStyle,
        long_term_goals: goalText ? [goalText] : [],
        profile_completed: true,
        last_updated: new Date().toISOString(),
      };
      if (profile) {
        await base44.entities.HannahUserProfile.update(profile.id, profileData);
      } else {
        await base44.entities.HannahUserProfile.create(profileData);
      }
      const mems = await base44.entities.ChatbotMemory.filter({ chatbot_name: 'Hannah', created_by: user.email });
      const onbMem = mems.find(m => m.context === 'Onboarding setup');
      const areaLabels = growthAreas.map(a => GROWTH_AREAS.find(g => g.id === a)?.label || a);
      const valueLabels = coreValues.map(v => CORE_VALUES.find(c => c.id === v)?.label || v);
      const styleLabel = COACHING_STYLES.find(s => s.id === coachingStyle)?.label || coachingStyle;
      const content = `Growth focus areas: ${areaLabels.join(', ')}. Core values: ${valueLabels.join(', ')}. Coaching style: ${styleLabel}.${goalText ? ` Key goal: ${goalText}` : ''}`;
      if (onbMem) {
        await base44.entities.ChatbotMemory.update(onbMem.id, { content, last_referenced: new Date().toISOString() });
      } else {
        await base44.entities.ChatbotMemory.create({
          chatbot_name: 'Hannah', memory_type: 'preference', content,
          context: 'Onboarding setup', importance: 10,
          conversation_date: new Date().toISOString().split('T')[0],
          last_referenced: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hannahProfile'] }),
    onError: () => toast.error("Couldn't save Hannah preferences"),
  });

  const versionKey = JSON.stringify({ growthAreas, coreValues, coachingStyle, goalText });
  const { saveState } = useDebouncedAutoSave(versionKey, mutation.mutate, { enabled: !!user?.email });

  const status = (() => {
    const parts = [];
    if (growthAreas.length) parts.push(`${growthAreas.length} focus area${growthAreas.length === 1 ? '' : 's'}`);
    if (coreValues.length) parts.push(`${coreValues.length} value${coreValues.length === 1 ? '' : 's'}`);
    if (coachingStyle) parts.push(COACHING_STYLES.find(s => s.id === coachingStyle)?.label?.replace(/^[^\s]+\s/, '') || '');
    return parts.filter(Boolean).join(' · ');
  })();

  return (
    <Section
      title="Hannah"
      emoji="💛"
      status={status}
      saveState={saveState}
      accentColor={colors.dot}
    >
      <div>
        <Prompt hint={`${growthAreas.length}/4`}>Where do you most want to grow right now?</Prompt>
        <MultiChips items={GROWTH_AREAS} selected={growthAreas} onToggle={toggleArea} max={4} colors={colors} />
      </div>
      <div>
        <Prompt hint={`${coreValues.length}/5`}>What matters most to you?</Prompt>
        <MultiChips items={CORE_VALUES} selected={coreValues} onToggle={toggleValue} max={5} colors={colors} />
      </div>
      <div>
        <Prompt>How do you like to be coached?</Prompt>
        <SingleChips items={COACHING_STYLES} selected={coachingStyle} onSelect={setCoachingStyle} colors={colors} layout="grid" />
      </div>
      <div>
        <Prompt>What's the one thing you most want to change?</Prompt>
        <textarea
          value={goalText}
          onChange={e => setGoalText(e.target.value)}
          placeholder="In your own words…"
          maxLength={500}
          rows={3}
          className="w-full rounded-xl border-2 outline-none p-3 text-sm text-gray-700 dark:text-gray-200 resize-none transition-colors bg-white dark:bg-white/5"
          style={{ borderColor: 'rgba(0,0,0,0.1)' }}
        />
      </div>
    </Section>
  );
}

// ─── Gideon panel ────────────────────────────────────────────────────────────
const SPIRITUAL_TOPICS = [
  { id: 'prayer_life', label: '🙏 Prayer Life' },
  { id: 'scripture_study', label: '📖 Scripture Study' },
  { id: 'purpose_calling', label: '🎯 Purpose & Calling' },
  { id: 'faith_challenges', label: '⛰️ Faith Challenges' },
  { id: 'relationships', label: '💞 Relationships' },
  { id: 'forgiveness', label: '🕊️ Forgiveness & Healing' },
  { id: 'gratitude', label: '🌅 Gratitude' },
  { id: 'anxiety_worry', label: '🌿 Anxiety & Worry' },
  { id: 'identity_in_christ', label: '👑 Identity in Christ' },
  { id: 'spiritual_warfare', label: '🛡️ Spiritual Warfare' },
];
const TEACHING_STYLES = [
  { id: 'deep_exegesis', label: '📚 Deep Verse Study' },
  { id: 'practical', label: '🔧 Practical Application' },
  { id: 'story_driven', label: '📜 Story-Driven' },
  { id: 'encouragement', label: '💛 Encouragement-Focused' },
];
const SPIRITUAL_SEASONS = [
  { id: 'new_believer', label: '🌱 New Believer' },
  { id: 'growing', label: '📈 Growing Deeper' },
  { id: 'in_valley', label: '🌧️ In a Valley' },
  { id: 'on_fire', label: '🔥 On Fire' },
  { id: 'questioning', label: '❓ Questioning' },
  { id: 'returning', label: '🏠 Returning to Faith' },
];

function GideonPrefs({ user }) {
  const qc = useQueryClient();
  const colors = COACH_COLORS.amber;

  const { data: memory } = useQuery({
    queryKey: ['gideonMemory', user?.email],
    queryFn: () => base44.entities.ChatbotMemory.filter({ chatbot_name: 'Gideon', created_by: user.email }),
    enabled: !!user?.email,
  });

  const parseMem = (mems) => {
    const onb = mems?.find(m => m.context === 'Onboarding setup' || m.context === 'Profile preferences');
    if (!onb) return {};
    const content = onb.content || '';
    const topics = (content.match(/Topics: ([^.]+)/) || [])[1]?.split(', ').map(l => SPIRITUAL_TOPICS.find(t => t.label === l)?.id).filter(Boolean) || [];
    const styleLbl = (content.match(/Style: ([^.]+)/) || [])[1]?.trim() || '';
    const styleId = TEACHING_STYLES.find(s => s.label === styleLbl)?.id || '';
    const seasonLbl = (content.match(/Season: ([^.]+)/) || [])[1]?.trim() || '';
    const seasonId = SPIRITUAL_SEASONS.find(s => s.label === seasonLbl)?.id || '';
    return { topics, style: styleId, season: seasonId };
  };

  const parsed = parseMem(memory);
  const [topics, setTopics] = useState(parsed.topics || []);
  const [style, setStyle] = useState(parsed.style || '');
  const [season, setSeason] = useState(parsed.season || '');

  useEffect(() => {
    const p = parseMem(memory);
    if (p.topics?.length) setTopics(p.topics);
    if (p.style) setStyle(p.style);
    if (p.season) setSeason(p.season);
  }, [memory]);

  const toggleTopic = (id) => setTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : prev.length < 5 ? [...prev, id] : prev);

  const mutation = useMutation({
    mutationFn: async () => {
      const topicLabels = topics.map(t => SPIRITUAL_TOPICS.find(s => s.id === t)?.label || t);
      const styleLabel = TEACHING_STYLES.find(s => s.id === style)?.label || '';
      const seasonLabel = SPIRITUAL_SEASONS.find(s => s.id === season)?.label || '';
      const content = `Topics: ${topicLabels.join(', ')}. Style: ${styleLabel}. Season: ${seasonLabel}.`;
      const existing = memory?.find(m => m.context === 'Onboarding setup' || m.context === 'Profile preferences');
      if (existing) {
        await base44.entities.ChatbotMemory.update(existing.id, { content, last_referenced: new Date().toISOString() });
      } else {
        await base44.entities.ChatbotMemory.create({
          chatbot_name: 'Gideon', memory_type: 'preference', content,
          context: 'Profile preferences', importance: 10,
          conversation_date: new Date().toISOString().split('T')[0],
          last_referenced: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gideonMemory'] }),
    onError: () => toast.error("Couldn't save Gideon preferences"),
  });

  const versionKey = JSON.stringify({ topics, style, season });
  const { saveState } = useDebouncedAutoSave(versionKey, mutation.mutate, { enabled: !!user?.email });

  const status = (() => {
    const parts = [];
    if (topics.length) parts.push(`${topics.length} topic${topics.length === 1 ? '' : 's'}`);
    if (style) parts.push(TEACHING_STYLES.find(s => s.id === style)?.label?.replace(/^[^\s]+\s/, '') || '');
    if (season) parts.push(SPIRITUAL_SEASONS.find(s => s.id === season)?.label?.replace(/^[^\s]+\s/, '') || '');
    return parts.filter(Boolean).join(' · ');
  })();

  return (
    <Section
      title="Gideon"
      emoji="📖"
      status={status}
      saveState={saveState}
      accentColor={colors.dot}
      defaultOpen
    >
      <div>
        <Prompt hint={`${topics.length}/5`}>What's on your heart spiritually right now?</Prompt>
        <MultiChips items={SPIRITUAL_TOPICS} selected={topics} onToggle={toggleTopic} max={5} colors={colors} />
      </div>
      <div>
        <Prompt>How do you like Scripture taught?</Prompt>
        <SingleChips items={TEACHING_STYLES} selected={style} onSelect={setStyle} colors={colors} layout="grid" />
      </div>
      <div>
        <Prompt>What season are you in?</Prompt>
        <SingleChips items={SPIRITUAL_SEASONS} selected={season} onSelect={setSeason} colors={colors} />
      </div>
    </Section>
  );
}

// ─── Coach Paul panel ────────────────────────────────────────────────────────
const TRANSFORMATION_AREAS = [
  { id: 'discipline', label: '⏰ Daily Discipline' },
  { id: 'leadership', label: '🏅 Leadership' },
  { id: 'identity', label: '👑 Identity & Purpose' },
  { id: 'time_management', label: '📋 Time Management' },
  { id: 'relationships', label: '💞 Relationships' },
  { id: 'financial', label: '💰 Financial Stewardship' },
  { id: 'spiritual_depth', label: '🙏 Spiritual Depth' },
  { id: 'health_fitness', label: '💪 Health & Fitness' },
  { id: 'career', label: '🚀 Career & Calling' },
  { id: 'emotional', label: '🧠 Emotional Resilience' },
];
const CHALLENGE_LEVELS = [
  { id: 'gentle', label: '🌸 Gentle' },
  { id: 'moderate', label: '⚡ Moderate' },
  { id: 'intense', label: '🔥 Intense' },
];
const ACCOUNTABILITY_STYLES = [
  { id: 'encouraging', label: '💛 Encouraging' },
  { id: 'direct', label: '🎯 Direct & Honest' },
  { id: 'structured', label: '📋 Structured Steps' },
  { id: 'flexible', label: '🌊 Flexible & Adaptive' },
];

function CoachPaulPrefs({ user }) {
  const qc = useQueryClient();
  const colors = COACH_COLORS.violet;

  const { data: mems } = useQuery({
    queryKey: ['coachPaulMemory', user?.email],
    queryFn: () => base44.entities.ChatbotMemory.filter({ chatbot_name: 'CoachPaul', created_by: user.email }),
    enabled: !!user?.email,
  });

  const parseMem = (mems) => {
    const onb = mems?.find(m => m.context === 'Onboarding setup' || m.context === 'Profile preferences');
    if (!onb) return {};
    const c = onb.content || '';
    const areas = (c.match(/Areas: ([^.]+)/) || [])[1]?.split(', ').map(l => TRANSFORMATION_AREAS.find(a => a.label === l)?.id).filter(Boolean) || [];
    const challenge = (c.match(/Challenge: (\w+)/) || [])[1] || '';
    const acct = (c.match(/Accountability: ([^.]+)/) || [])[1]?.trim() || '';
    const acctId = ACCOUNTABILITY_STYLES.find(s => s.label === acct)?.id || '';
    return { areas, challenge, accountability: acctId };
  };

  const parsed = parseMem(mems);
  const [areas, setAreas] = useState(parsed.areas || []);
  const [challenge, setChallenge] = useState(parsed.challenge || '');
  const [accountability, setAccountability] = useState(parsed.accountability || '');

  useEffect(() => {
    const p = parseMem(mems);
    if (p.areas?.length) setAreas(p.areas);
    if (p.challenge) setChallenge(p.challenge);
    if (p.accountability) setAccountability(p.accountability);
  }, [mems]);

  const toggleArea = (id) => setAreas(prev => prev.includes(id) ? prev.filter(a => a !== id) : prev.length < 4 ? [...prev, id] : prev);

  const mutation = useMutation({
    mutationFn: async () => {
      const areaLabels = areas.map(a => TRANSFORMATION_AREAS.find(t => t.id === a)?.label || a);
      const acctLabel = ACCOUNTABILITY_STYLES.find(s => s.id === accountability)?.label || '';
      const content = `Areas: ${areaLabels.join(', ')}. Challenge: ${challenge}. Accountability: ${acctLabel}.`;
      const existing = mems?.find(m => m.context === 'Onboarding setup' || m.context === 'Profile preferences');
      if (existing) {
        await base44.entities.ChatbotMemory.update(existing.id, { content, last_referenced: new Date().toISOString() });
      } else {
        await base44.entities.ChatbotMemory.create({
          chatbot_name: 'CoachPaul', memory_type: 'preference', content,
          context: 'Profile preferences', importance: 10,
          conversation_date: new Date().toISOString().split('T')[0],
          last_referenced: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coachPaulMemory'] }),
    onError: () => toast.error("Couldn't save Coach Paul preferences"),
  });

  const versionKey = JSON.stringify({ areas, challenge, accountability });
  const { saveState } = useDebouncedAutoSave(versionKey, mutation.mutate, { enabled: !!user?.email });

  const status = (() => {
    const parts = [];
    if (areas.length) parts.push(`${areas.length} area${areas.length === 1 ? '' : 's'}`);
    if (challenge) parts.push(CHALLENGE_LEVELS.find(c => c.id === challenge)?.label?.replace(/^[^\s]+\s/, '') || '');
    if (accountability) parts.push(ACCOUNTABILITY_STYLES.find(s => s.id === accountability)?.label?.replace(/^[^\s]+\s/, '') || '');
    return parts.filter(Boolean).join(' · ');
  })();

  return (
    <Section
      title="Coach Paul"
      emoji="🏛️"
      status={status}
      saveState={saveState}
      accentColor={colors.dot}
    >
      <div>
        <Prompt hint={`${areas.length}/4`}>Where do you most want me to push you?</Prompt>
        <MultiChips items={TRANSFORMATION_AREAS} selected={areas} onToggle={toggleArea} max={4} colors={colors} />
      </div>
      <div>
        <Prompt>How hard should I push?</Prompt>
        <div className="flex gap-2">
          {CHALLENGE_LEVELS.map(l => (
            <button
              key={l.id}
              onClick={() => setChallenge(l.id)}
              className="flex-1 text-xs px-3 py-3 rounded-xl border-2 font-medium text-center transition-all"
              style={
                challenge === l.id
                  ? { borderColor: colors.border, backgroundColor: colors.fill, color: colors.text }
                  : { borderColor: 'rgba(0,0,0,0.1)', color: 'rgb(75,85,99)' }
              }
            >
              {challenge === l.id && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Prompt>How should I hold you accountable?</Prompt>
        <SingleChips items={ACCOUNTABILITY_STYLES} selected={accountability} onSelect={setAccountability} colors={colors} layout="grid" />
      </div>
    </Section>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────
export default function ChatbotPreferencesTab({ user }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 pt-2">
      <div className="mb-5">
        <h2 className="text-base font-bold text-[#0A1A2F] dark:text-white mb-1">
          Personalize your guides
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          The better each coach knows you, the more they can meet you where you are.
          Changes save automatically.
        </p>
      </div>
      <GideonPrefs user={user} />
      <HannahPrefs user={user} />
      <CoachDavidPrefs user={user} />
      <ChefDanielPrefs user={user} />
      <CoachPaulPrefs user={user} />
    </motion.div>
  );
}
