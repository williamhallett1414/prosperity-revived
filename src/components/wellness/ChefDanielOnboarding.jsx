import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const DIET_TYPES = [
  { id: 'any', label: '🍽️ No restrictions', desc: 'I eat everything' },
  { id: 'vegetarian', label: '🥦 Vegetarian', desc: 'No meat' },
  { id: 'vegan', label: '🌱 Vegan', desc: 'Plant-based only' },
  { id: 'keto', label: '🥑 Keto', desc: 'Low-carb, high-fat' },
  { id: 'paleo', label: '🍖 Paleo', desc: 'Whole foods' },
  { id: 'gluten_free', label: '🌾 Gluten-Free', desc: 'No gluten' },
  { id: 'halal', label: '☪️ Halal', desc: 'Halal certified' },
  { id: 'kosher', label: '✡️ Kosher', desc: 'Kosher certified' },
];

const NUTRITION_GOALS = [
  { id: 'muscle_gain', label: '💪 Build Muscle', emoji: '💪' },
  { id: 'weight_loss', label: '🔥 Lose Weight', emoji: '🔥' },
  { id: 'maintenance', label: '⚖️ Maintain Weight', emoji: '⚖️' },
  { id: 'performance', label: '🏅 Performance', emoji: '🏅' },
  { id: 'gut_health', label: '🌿 Gut Health', emoji: '🌿' },
  { id: 'energy', label: '⚡ More Energy', emoji: '⚡' },
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

export default function ChefDanielOnboarding({ onComplete, user }) {
  const [step, setStep] = useState(0);
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedPantry, setSelectedPantry] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 5;

  const toggleAllergy = (id) => {
    if (id === 'none') { setSelectedAllergies(['none']); return; }
    setSelectedAllergies(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev.filter(a => a !== 'none'), id]
    );
  };

  const togglePantry = (item) => {
    setSelectedPantry(prev =>
      prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]
    );
  };

  const canAdvance = () => {
    if (step === 1) return !!selectedDiet;
    if (step === 2) return !!selectedGoal;
    return true;
  };

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      setIsSaving(true);
      try {
        const allergyList = selectedAllergies.filter(a => a !== 'none');
        const summary = [
          `Diet type: ${DIET_TYPES.find(d => d.id === selectedDiet)?.label || selectedDiet}`,
          `Nutrition goal: ${NUTRITION_GOALS.find(g => g.id === selectedGoal)?.label || selectedGoal}`,
          allergyList.length > 0 ? `Allergies: ${allergyList.join(', ')}` : 'No allergies',
          selectedPantry.length > 0 ? `Pantry staples: ${selectedPantry.join(', ')}` : '',
        ].filter(Boolean).join('. ');

        await base44.entities.ChatbotMemory.create({
          chatbot_name: 'ChefDaniel',
          memory_type: 'preference',
          content: summary,
          context: 'Onboarding dietary setup',
          importance: 9,
          conversation_date: new Date().toISOString().split('T')[0],
          last_referenced: new Date().toISOString(),
        });
      } catch (e) { /* silent */ }
      setIsSaving(false);
      onComplete({ diet: selectedDiet, goal: selectedGoal, allergies: selectedAllergies, pantry: selectedPantry });
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
          className="bg-white dark:bg-white/5 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white p-5 relative">
            <button onClick={() => onComplete({})} className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">
                  {step === 0 && 'Welcome to Chef Daniel! 👨‍🍳'}
                  {step === 1 && 'Your Diet Style'}
                  {step === 2 && 'Your Nutrition Goal'}
                  {step === 3 && 'Allergies & Restrictions'}
                  {step === 4 && 'Your Pantry Staples'}
                </h2>
                <p className="text-xs text-white/70">Step {step + 1} of {totalSteps}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="h-1 bg-gray-100 dark:bg-white/5">
            <motion.div
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-[#FD9C2D] to-[#E89020]"
            />
          </div>

          {/* Content */}
          <div className="p-5 min-h-[260px]">
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
                    <div className="text-5xl mb-4">👨‍🍳</div>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                      I'm <strong>Chef Daniel</strong> — your nutrition expert. Let me learn your preferences so every recipe, meal plan, and tip I give you is perfectly tailored.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-3">4 quick questions. Let's cook up something great.</p>
                  </div>
                )}

                {/* Step 1: Diet type */}
                {step === 1 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Which best describes your eating style?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {DIET_TYPES.map(diet => (
                        <button
                          key={diet.id}
                          onClick={() => setSelectedDiet(diet.id)}
                          className={`rounded-xl border-2 p-3 text-left transition-all ${
                            selectedDiet === diet.id
                              ? 'border-[#FD9C2D] bg-[#FD9C2D]/10'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-white/15'
                          }`}
                        >
                          <div className="text-xs font-semibold text-gray-800 dark:text-gray-100">{diet.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">{diet.desc}</div>
                          {selectedDiet === diet.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#FD9C2D] mt-1" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Nutrition goal */}
                {step === 2 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">What's your primary nutrition goal right now?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {NUTRITION_GOALS.map(goal => (
                        <button
                          key={goal.id}
                          onClick={() => setSelectedGoal(goal.id)}
                          className={`rounded-xl border-2 p-3.5 text-left transition-all ${
                            selectedGoal === goal.id
                              ? 'border-[#FD9C2D] bg-[#FD9C2D]/10'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-white/15'
                          }`}
                        >
                          <div className="text-lg mb-1">{goal.emoji}</div>
                          <div className="text-xs font-semibold text-gray-800 dark:text-gray-100">{goal.label}</div>
                          {selectedGoal === goal.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#FD9C2D] mt-1" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Allergies */}
                {step === 3 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Any food allergies or intolerances? (Select all that apply)</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ALLERGIES.map(a => (
                        <button
                          key={a.id}
                          onClick={() => toggleAllergy(a.id)}
                          className={`rounded-xl border-2 p-3 text-xs font-semibold transition-all flex items-center gap-2 ${
                            selectedAllergies.includes(a.id)
                              ? 'border-[#FD9C2D] bg-[#FD9C2D]/10 text-[#FD9C2D]'
                              : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:border-white/15'
                          }`}
                        >
                          {a.label}
                          {selectedAllergies.includes(a.id) && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-[#FD9C2D]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Pantry staples */}
                {step === 4 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">What do you usually have at home?</p>
                    <p className="text-xs text-gray-400 dark:text-gray-300 mb-3">I'll suggest recipes using what you already have.</p>
                    <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto">
                      {PANTRY_STAPLES.map(item => (
                        <button
                          key={item}
                          onClick={() => togglePantry(item)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            selectedPantry.includes(item)
                              ? 'border-[#FD9C2D] bg-[#FD9C2D]/10 text-[#FD9C2D] font-semibold'
                              : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:border-white/15'
                          }`}
                        >
                          {selectedPantry.includes(item) ? '✓ ' : ''}{item}
                        </button>
                      ))}
                    </div>
                    {selectedPantry.length > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-[#FD9C2D] mt-2"
                      >
                        {selectedPantry.length} items selected — I'll use these to suggest easy meals!
                      </motion.p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-5 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 dark:border-white/10">
            <div className="flex gap-3">
              <Button onClick={() => onComplete({})} variant="outline" className="flex-1 text-gray-600 dark:text-gray-300 text-sm">
                Skip
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canAdvance() || isSaving}
                className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#E89020] text-white flex items-center justify-center gap-2 text-sm"
              >
                {isSaving ? 'Saving...' : step === totalSteps - 1 ? "Let's Cook!" : 'Next'}
                {!isSaving && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}