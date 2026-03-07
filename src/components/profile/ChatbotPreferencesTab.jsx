import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, ChevronDown, ChevronUp, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

// ── Small helpers ──────────────────────────────────────────────────────────
function Toggle({ items, selected, onToggle, max, color }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => {
        const isSelected = Array.isArray(selected) ? selected.includes(item.id) : selected === item.id;
        const disabled = max && !isSelected && Array.isArray(selected) && selected.length >= max;
        return (
          <button
            key={item.id}
            onClick={() => !disabled && onToggle(item.id)}
            className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all ${
              isSelected ? `border-${color}-400 bg-${color}-50 text-${color}-700` :
              disabled ? 'border-gray-100 text-gray-300 cursor-not-allowed' :
              'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
            style={isSelected ? { borderColor: 'currentColor' } : {}}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function Section({ title, emoji, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-2xl overflow-hidden mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
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
            <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Coach David panel ────────────────────────────────────────────────────────
function CoachDavidPrefs({ user }) {
  const qc = useQueryClient();

  const { data: memory } = useQuery({
    queryKey: ['coachDavidMemory', user?.email],
    queryFn: () => base44.entities.ChatbotMemory.filter({ chatbot_name: 'CoachDavid', created_by: user.email }),
    enabled: !!user?.email,
  });

  // Parse saved memory content into structured state
  const parseMemory = (mems) => {
    const onboardingMem = mems?.find(m => m.context === 'Onboarding setup');
    if (!onboardingMem) return {};
    const content = onboardingMem.content || '';
    const goals = (content.match(/Fitness goals: ([^.]+)/) || [])[1]?.split(', ').map(l => FITNESS_GOALS.find(g => g.label === l)?.id).filter(Boolean) || [];
    const level = (content.match(/Level: (\w+)/) || [])[1] || '';
    const tracker = (content.match(/Tracker: (\w+)/) || [])[1] || '';
    const daysMatch = (content.match(/(\d+)x\/week/) || [])[1];
    return { goals, level, tracker, workoutDays: daysMatch ? parseInt(daysMatch) : 3, memId: onboardingMem.id };
  };

  const parsed = parseMemory(memory);
  const [goals, setGoals] = useState(parsed.goals || []);
  const [level, setLevel] = useState(parsed.level || '');
  const [tracker, setTracker] = useState(parsed.tracker || '');
  const [workoutDays, setWorkoutDays] = useState(parsed.workoutDays || 3);

  // Re-init when memory loads
  React.useEffect(() => {
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['coachDavidMemory'] }); toast.success('Coach David preferences saved!'); },
  });

  return (
    <Section title="Coach David" emoji="💪" color="green" defaultOpen>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">FITNESS GOALS</p>
        <div className="flex flex-wrap gap-2">
          {FITNESS_GOALS.map(g => (
            <button key={g.id} onClick={() => setGoals(prev => prev.includes(g.id) ? prev.filter(x => x !== g.id) : [...prev, g.id])}
              className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all ${goals.includes(g.id) ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">FITNESS LEVEL</p>
        <div className="flex gap-2">
          {FITNESS_LEVELS.map(l => (
            <button key={l.id} onClick={() => setLevel(l.id)}
              className={`flex-1 text-xs px-2 py-2 rounded-xl border-2 font-medium transition-all text-center ${level === l.id ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600'}`}>
              {l.label}<br /><span className="text-gray-400">{l.desc}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">FITNESS TRACKER</p>
        <div className="grid grid-cols-3 gap-2">
          {TRACKERS.map(t => (
            <button key={t.id} onClick={() => setTracker(t.id)}
              className={`rounded-xl border-2 p-2.5 flex flex-col items-center gap-1 transition-all ${tracker === t.id ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <span className="text-lg">{t.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">WEEKLY TRAINING DAYS: <span className="text-green-600">{workoutDays}x</span></p>
        <div className="flex gap-2">
          {[1,2,3,4,5,6,7].map(d => (
            <button key={d} onClick={() => setWorkoutDays(d)}
              className={`w-9 h-9 rounded-full border-2 font-bold text-xs transition-all ${workoutDays === d ? 'border-green-400 bg-green-500 text-white' : 'border-gray-200 text-gray-600'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}
        className="w-full bg-gradient-to-r from-[#AFC7E3] to-[#6B7280] text-white">
        {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Coach David Preferences
      </Button>
    </Section>
  );
}

// ── Chef Daniel panel ────────────────────────────────────────────────────────
function ChefDanielPrefs({ user }) {
  const qc = useQueryClient();

  const { data: memory } = useQuery({
    queryKey: ['chefDanielMemory', user?.email],
    queryFn: () => base44.entities.ChatbotMemory.filter({ chatbot_name: 'ChefDaniel', created_by: user.email }),
    enabled: !!user?.email,
  });

  const [diet, setDiet] = useState('');
  const [nutritionGoal, setNutritionGoal] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [pantry, setPantry] = useState([]);

  React.useEffect(() => {
    const onboardingMem = memory?.find(m => m.context === 'Onboarding dietary setup');
    if (!onboardingMem) return;
    const content = onboardingMem.content || '';
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['chefDanielMemory'] }); toast.success('Chef Daniel preferences saved!'); },
  });

  return (
    <Section title="Chef Daniel" emoji="👨‍🍳" color="orange" defaultOpen>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">DIET STYLE</p>
        <div className="flex flex-wrap gap-2">
          {DIET_TYPES.map(d => (
            <button key={d.id} onClick={() => setDiet(d.id)}
              className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all ${diet === d.id ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">NUTRITION GOAL</p>
        <div className="flex flex-wrap gap-2">
          {NUTRITION_GOALS.map(g => (
            <button key={g.id} onClick={() => setNutritionGoal(g.id)}
              className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all ${nutritionGoal === g.id ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">ALLERGIES & INTOLERANCES</p>
        <div className="flex flex-wrap gap-2">
          {ALLERGIES.map(a => (
            <button key={a.id} onClick={() => toggleAllergy(a.id)}
              className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all ${allergies.includes(a.id) ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">PANTRY STAPLES <span className="text-gray-400">({pantry.length} selected)</span></p>
        <div className="flex flex-wrap gap-2">
          {PANTRY_STAPLES.map(item => (
            <button key={item} onClick={() => setPantry(prev => prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item])}
              className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all ${pantry.includes(item) ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}
        className="w-full bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white">
        {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Chef Daniel Preferences
      </Button>
    </Section>
  );
}

// ── Hannah panel ─────────────────────────────────────────────────────────────
function HannahPrefs({ user }) {
  const qc = useQueryClient();

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

  React.useEffect(() => {
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
      // Update memory too
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hannahProfile'] }); toast.success('Hannah preferences saved!'); },
  });

  return (
    <Section title="Hannah" emoji="💛" color="purple" defaultOpen>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">GROWTH FOCUS AREAS <span className="text-gray-400">(up to 4)</span></p>
        <div className="flex flex-wrap gap-2">
          {GROWTH_AREAS.map(a => {
            const sel = growthAreas.includes(a.id);
            const disabled = !sel && growthAreas.length >= 4;
            return (
              <button key={a.id} onClick={() => !disabled && toggleArea(a.id)}
                className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all ${sel ? 'border-purple-400 bg-purple-50 text-purple-700' : disabled ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {a.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">CORE VALUES <span className="text-gray-400">(up to 5)</span></p>
        <div className="flex flex-wrap gap-2">
          {CORE_VALUES.map(v => {
            const sel = coreValues.includes(v.id);
            const disabled = !sel && coreValues.length >= 5;
            return (
              <button key={v.id} onClick={() => !disabled && toggleValue(v.id)}
                className={`text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all ${sel ? 'border-purple-400 bg-purple-50 text-purple-700' : disabled ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {v.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">COACHING STYLE</p>
        <div className="grid grid-cols-2 gap-2">
          {COACHING_STYLES.map(s => (
            <button key={s.id} onClick={() => setCoachingStyle(s.id)}
              className={`text-xs px-3 py-2.5 rounded-xl border-2 font-medium text-left transition-all ${coachingStyle === s.id ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {coachingStyle === s.id && <CheckCircle2 className="w-3 h-3 inline mr-1" />}{s.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">MY MAIN GROWTH GOAL</p>
        <textarea
          value={goalText}
          onChange={e => setGoalText(e.target.value)}
          placeholder="What do you most want to change or achieve?"
          rows={3}
          className="w-full rounded-xl border-2 border-gray-200 focus:border-purple-300 outline-none p-3 text-sm text-gray-700 resize-none transition-colors bg-white"
        />
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}
        className="w-full bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53] text-white">
        {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Hannah Preferences
      </Button>
    </Section>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ChatbotPreferencesTab({ user }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 pt-2">
      <p className="text-sm text-gray-500 mb-4">
        Update your preferences anytime — changes are reflected immediately in each chatbot's conversations.
      </p>
      <CoachDavidPrefs user={user} />
      <ChefDanielPrefs user={user} />
      <HannahPrefs user={user} />
    </motion.div>
  );
}