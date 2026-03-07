import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, Sparkles, Heart, Target, User } from 'lucide-react';
import { toast } from 'sonner';

const GOALS = [
  'Build financial independence', 'Improve relationships', 'Career advancement',
  'Emotional healing', 'Build confidence', 'Find my purpose', 'Reduce stress & anxiety',
  'Better work-life balance', 'Develop leadership skills', 'Overcome self-sabotage'
];

const VALUES = [
  'Family', 'Freedom', 'Growth', 'Faith', 'Integrity', 'Connection',
  'Health', 'Success', 'Creativity', 'Service', 'Adventure', 'Security'
];

const TRAITS = [
  'Perfectionist', 'People-pleaser', 'Introvert', 'Extrovert',
  'Overthinker', 'Highly sensitive', 'Natural leader', 'Creative thinker',
  'Empath', 'Driven achiever', 'Avoidant', 'Resilient'
];

const CHALLENGES = [
  'Setting boundaries', 'Managing anxiety', 'Procrastination', 'Low self-worth',
  'Relationship patterns', 'Burnout', 'Fear of failure', 'Financial stress',
  'Lack of direction', 'Emotional regulation', 'Imposter syndrome'
];

const COACHING_STYLES = [
  { value: 'gentle_supportive', label: 'Gentle & Supportive', desc: 'Warm, empathetic, hold space first' },
  { value: 'direct_actionable', label: 'Direct & Actionable', desc: 'Cut to the point, give clear steps' },
  { value: 'exploratory_curious', label: 'Exploratory', desc: 'Ask questions, help me discover' },
  { value: 'structured_practical', label: 'Structured', desc: 'Frameworks, exercises, structured plans' },
];

const STEPS = [
  { id: 'goals', title: 'Your Long-Term Goals', icon: Target, subtitle: 'Select up to 4 that resonate most', multi: true, options: GOALS, key: 'long_term_goals', max: 4 },
  { id: 'values', title: 'Your Core Values', icon: Heart, subtitle: 'What matters most to you?', multi: true, options: VALUES, key: 'core_values', max: 4 },
  { id: 'traits', title: 'Your Personality', icon: User, subtitle: 'How would you describe yourself?', multi: true, options: TRAITS, key: 'personality_traits', max: 4 },
  { id: 'challenges', title: 'Current Challenges', icon: Sparkles, subtitle: 'What are you working through?', multi: true, options: CHALLENGES, key: 'primary_challenges', max: 3 },
  { id: 'style', title: 'How Should Hannah Coach You?', icon: Heart, subtitle: 'Pick the style that fits best', multi: false, options: COACHING_STYLES, key: 'preferred_coaching_style' },
];

export default function HannahProfileSetup({ user, onComplete, onClose }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    long_term_goals: [],
    core_values: [],
    personality_traits: [],
    primary_challenges: [],
    preferred_coaching_style: null,
  });
  const [saving, setSaving] = useState(false);

  const current = STEPS[step];

  const toggle = (key, value, max) => {
    setProfile(prev => {
      const arr = prev[key] || [];
      if (arr.includes(value)) return { ...prev, [key]: arr.filter(v => v !== value) };
      if (max && arr.length >= max) return prev;
      return { ...prev, [key]: [...arr, value] };
    });
  };

  const selectSingle = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const canNext = () => {
    const val = profile[current.key];
    if (current.multi) return Array.isArray(val) && val.length > 0;
    return !!val;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const existing = await base44.entities.HannahUserProfile.filter({ user_email: user.email });
      const data = {
        ...profile,
        user_email: user.email,
        profile_completed: true,
        last_updated: new Date().toISOString(),
      };
      if (existing.length > 0) {
        await base44.entities.HannahUserProfile.update(existing[0].id, data);
      } else {
        await base44.entities.HannahUserProfile.create(data);
      }
      toast.success('Profile saved! Hannah will now personalize everything for you. 💛');
      onComplete(data);
    } catch (e) {
      toast.error('Could not save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53] p-5 rounded-t-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/70">Step {step + 1} of {STEPS.length}</span>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">{current.title}</h3>
              <p className="text-white/70 text-xs">{current.subtitle}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {/* Options */}
        <div className="flex-1 overflow-y-auto p-5">
          {current.multi ? (
            <div className="flex flex-wrap gap-2">
              {current.options.map(opt => {
                const selected = (profile[current.key] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggle(current.key, opt, current.max)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${
                      selected
                        ? 'bg-[#3C4E53] text-white border-[#3C4E53]'
                        : 'bg-white text-[#3C4E53] border-[#AFC7E3]/50 hover:border-[#3C4E53]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {current.options.map(opt => {
                const selected = profile[current.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectSingle(current.key, opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-[#3C4E53] bg-[#3C4E53]/5'
                        : 'border-[#AFC7E3]/40 bg-white hover:border-[#3C4E53]/40'
                    }`}
                  >
                    <div className="font-semibold text-[#0A1A2F] text-sm">{opt.label}</div>
                    <div className="text-xs text-[#0A1A2F]/60 mt-0.5">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#AFC7E3]/30 flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex-1 bg-[#3C4E53] hover:bg-[#3C4E53] text-white"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!canNext() || saving}
              className="flex-1 bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53] text-white"
            >
              {saving ? 'Saving...' : 'Save My Profile 💛'}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}