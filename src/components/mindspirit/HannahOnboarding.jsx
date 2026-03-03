import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Heart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const GROWTH_AREAS = [
  { id: 'emotional_intelligence', label: '🧠 Emotional Intelligence', desc: 'Self-awareness & regulation' },
  { id: 'habits', label: '✅ Habit Building', desc: 'Systems & consistency' },
  { id: 'relationships', label: '💞 Relationships', desc: 'Love, boundaries, attachment' },
  { id: 'career', label: '🚀 Career & Purpose', desc: 'Meaning & direction' },
  { id: 'financial_mindset', label: '💰 Money Mindset', desc: 'Abundance & financial freedom' },
  { id: 'confidence', label: '💪 Confidence', desc: 'Self-worth & identity' },
  { id: 'stress_anxiety', label: '🌿 Stress & Anxiety', desc: 'Nervous system & calm' },
  { id: 'leadership', label: '🏅 Leadership', desc: 'Influence & communication' },
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
  { id: 'gentle_supportive', label: '🌸 Gentle & Supportive', desc: 'Warm, encouraging, at your pace' },
  { id: 'direct_actionable', label: '⚡ Direct & Actionable', desc: 'Straight to the point, practical steps' },
  { id: 'exploratory_curious', label: '🔍 Exploratory', desc: 'Deep questions, self-discovery' },
  { id: 'structured_practical', label: '📋 Structured & Practical', desc: 'Frameworks, tools, exercises' },
];

const LIFE_STAGES = [
  { id: 'student', label: '🎓 Student' },
  { id: 'early_career', label: '🚀 Early Career' },
  { id: 'mid_career', label: '💼 Mid-Career' },
  { id: 'parent', label: '👶 Parent' },
  { id: 'transition', label: '🔄 In Transition' },
  { id: 'other', label: '✨ Other' },
];

export default function HannahOnboarding({ onComplete, onRevisit, user }) {
  const [step, setStep] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [coachingStyle, setCoachingStyle] = useState('');
  const [lifeStage, setLifeStage] = useState('');
  const [goalText, setGoalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 6;

  const toggleArea = (id) => {
    setSelectedAreas(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const toggleValue = (id) => {
    if (selectedValues.length >= 5 && !selectedValues.includes(id)) return;
    setSelectedValues(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const canAdvance = () => {
    if (step === 1) return selectedAreas.length > 0;
    if (step === 2) return selectedValues.length > 0;
    if (step === 3) return !!coachingStyle;
    if (step === 4) return !!lifeStage;
    return true;
  };

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      setIsSaving(true);
      try {
        const areaLabels = selectedAreas.map(a => GROWTH_AREAS.find(g => g.id === a)?.label || a);
        const valueLabels = selectedValues.map(v => CORE_VALUES.find(c => c.id === v)?.label || v);
        const styleLabel = COACHING_STYLES.find(s => s.id === coachingStyle)?.label || coachingStyle;

        // Save as HannahUserProfile
        const existingProfiles = await base44.entities.HannahUserProfile.filter({ user_email: user?.email || '' });

        const profileData = {
          user_email: user?.email || '',
          growth_areas: selectedAreas,
          core_values: selectedValues,
          preferred_coaching_style: coachingStyle,
          life_stage: lifeStage,
          long_term_goals: goalText ? [goalText] : [],
          profile_completed: true,
          last_updated: new Date().toISOString(),
        };

        if (existingProfiles.length > 0) {
          await base44.entities.HannahUserProfile.update(existingProfiles[0].id, profileData);
        } else {
          await base44.entities.HannahUserProfile.create(profileData);
        }

        // Also save as a memory
        await base44.entities.ChatbotMemory.create({
          chatbot_name: 'Hannah',
          memory_type: 'preference',
          content: `Growth focus areas: ${areaLabels.join(', ')}. Core values: ${valueLabels.join(', ')}. Coaching style: ${styleLabel}. Life stage: ${lifeStage}.${goalText ? ` Key goal: ${goalText}` : ''}`,
          context: 'Onboarding setup',
          importance: 10,
          conversation_date: new Date().toISOString().split('T')[0],
          last_referenced: new Date().toISOString(),
        });
      } catch (e) { /* silent */ }
      setIsSaving(false);
      onComplete();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53] text-white p-5 relative">
            <button onClick={onComplete} className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">
                  {step === 0 && "Welcome — I'm Hannah 💛"}
                  {step === 1 && 'Your Growth Focus'}
                  {step === 2 && 'Your Core Values'}
                  {step === 3 && 'Your Coaching Style'}
                  {step === 4 && 'Your Life Stage'}
                  {step === 5 && 'One Big Goal'}
                </h2>
                <p className="text-xs text-white/70">Step {step + 1} of {totalSteps}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="h-1 bg-gray-100">
            <motion.div
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53]"
            />
          </div>

          {/* Content */}
          <div className="p-5 min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step 0: Welcome */}
                {step === 0 && (
                  <div className="text-center py-2">
                    <div className="text-5xl mb-4">💛</div>
                    <p className="text-gray-700 leading-relaxed">
                      I'm your <strong>personal growth guide</strong> — combining therapy-informed coaching, habit science, and emotional intelligence.
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                      Let me learn about you so every conversation feels like it was made just for you.
                    </p>
                  </div>
                )}

                {/* Step 1: Growth focus areas */}
                {step === 1 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">What areas do you most want to grow in? (Pick up to 4)</p>
                    <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                      {GROWTH_AREAS.map(area => {
                        const selected = selectedAreas.includes(area.id);
                        const disabled = !selected && selectedAreas.length >= 4;
                        return (
                          <button
                            key={area.id}
                            onClick={() => !disabled && toggleArea(area.id)}
                            className={`rounded-xl border-2 p-2.5 text-left transition-all ${
                              selected ? 'border-[#AFC7E3] bg-[#AFC7E3]/15' :
                              disabled ? 'border-gray-100 opacity-40 cursor-not-allowed' :
                              'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-xs font-semibold text-gray-800">{area.label}</div>
                            <div className="text-xs text-gray-500">{area.desc}</div>
                            {selected && <CheckCircle2 className="w-3.5 h-3.5 text-[#AFC7E3] mt-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Core values */}
                {step === 2 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">What are your top core values? (Choose up to 5)</p>
                    <p className="text-xs text-gray-400 mb-3">I'll use these to make my guidance feel truly yours.</p>
                    <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
                      {CORE_VALUES.map(val => {
                        const selected = selectedValues.includes(val.id);
                        const disabled = !selected && selectedValues.length >= 5;
                        return (
                          <button
                            key={val.id}
                            onClick={() => !disabled && toggleValue(val.id)}
                            className={`text-xs px-3 py-2 rounded-full border-2 transition-all font-medium ${
                              selected ? 'border-[#AFC7E3] bg-[#AFC7E3]/20 text-[#3C4E53]' :
                              disabled ? 'border-gray-100 text-gray-300 cursor-not-allowed' :
                              'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {val.label}
                          </button>
                        );
                      })}
                    </div>
                    {selectedValues.length > 0 && (
                      <p className="text-xs text-[#3C4E53] mt-2">{selectedValues.length}/5 selected</p>
                    )}
                  </div>
                )}

                {/* Step 3: Coaching style */}
                {step === 3 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">How do you prefer to be coached?</p>
                    <div className="space-y-2">
                      {COACHING_STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => setCoachingStyle(style.id)}
                          className={`w-full flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                            coachingStyle === style.id
                              ? 'border-[#AFC7E3] bg-[#AFC7E3]/15'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-800">{style.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{style.desc}</div>
                          </div>
                          {coachingStyle === style.id && <CheckCircle2 className="w-4 h-4 text-[#AFC7E3] flex-shrink-0 mt-0.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Life stage */}
                {step === 4 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">What stage of life are you in right now?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {LIFE_STAGES.map(stage => (
                        <button
                          key={stage.id}
                          onClick={() => setLifeStage(stage.id)}
                          className={`rounded-xl border-2 p-3.5 font-semibold text-sm transition-all flex items-center justify-between ${
                            lifeStage === stage.id
                              ? 'border-[#AFC7E3] bg-[#AFC7E3]/15 text-[#3C4E53]'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {stage.label}
                          {lifeStage === stage.id && <CheckCircle2 className="w-4 h-4 text-[#AFC7E3]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: One big goal */}
                {step === 5 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">What's one thing you most want to change or achieve?</p>
                    <p className="text-xs text-gray-400 mb-3">Be as honest as you feel comfortable. This is just for you.</p>
                    <textarea
                      value={goalText}
                      onChange={e => setGoalText(e.target.value)}
                      placeholder="e.g. I want to stop self-sabotaging and start trusting myself more…"
                      rows={4}
                      className="w-full rounded-xl border-2 border-gray-200 focus:border-[#AFC7E3] outline-none p-3 text-sm text-gray-700 resize-none transition-colors"
                    />
                    <div className="mt-3 bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-700">
                      💛 This becomes the foundation of our work together. I'll come back to it when you need a reminder of why you started.
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-5 bg-gray-50 border-t border-gray-100">
            <div className="flex gap-3">
              <Button onClick={onComplete} variant="outline" className="flex-1 text-gray-600 text-sm">
                Skip
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canAdvance() || isSaving}
                className="flex-1 bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53] text-white flex items-center justify-center gap-2 text-sm"
              >
                {isSaving ? 'Saving...' : step === totalSteps - 1 ? "Let's Grow! 💛" : 'Next'}
                {!isSaving && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}