import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { X, Check } from 'lucide-react';

const FITNESS_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const GOALS = [
  'Lose Weight', 'Lose Weight (Fast)', 'Build Muscle', 'Bulk Up',
  'Maintain Weight', 'Improve Endurance', 'Improve Flexibility', 'General Fitness'
];
const WORKOUT_DAYS = [1, 2, 3, 4, 5, 6, 7];

export default function FitnessProfileSetup({ user, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    weight_kg: user?.weight_kg || '',
    height_cm: user?.height_cm || '',
    age: user?.age || '',
    sex: user?.sex || 'male',
    fitness_level: user?.fitness_level || 'beginner',
    fitness_goal: user?.fitness_goal || 'general_fitness',
    workout_days_per_week: user?.workout_days_per_week || 3,
    goal_weight_kg: user?.goal_weight_kg || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe(data);
      onSave?.();
      onClose?.();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    {
      title: 'Physical Measurements',
      fields: ['weight_kg', 'height_cm', 'age', 'sex'],
    },
    {
      title: 'Fitness Experience',
      fields: ['fitness_level', 'fitness_goal'],
    },
    {
      title: 'Training Schedule',
      fields: ['workout_days_per_week', 'goal_weight_kg'],
    },
  ];

  const currentStep = steps[step - 1];
  const progress = (step / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0A1A2F]">Fitness Profile</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="max-w-lg mx-auto">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full bg-[#38BDF8]"
              />
            </div>
            <p className="text-xs text-[#0A1A2F]/40 mt-2">
              Step {step} of {steps.length}
            </p>
          </div>
        </div>

        <div className="px-4 py-6 max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h3 className="text-base font-bold text-[#0A1A2F] mb-5">
                {currentStep.title}
              </h3>

              {/* Weight */}
              {currentStep.fields.includes('weight_kg') && (
                <div>
                  <label className="text-xs font-bold text-[#0A1A2F]/60 block mb-2">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={data.weight_kg}
                    onChange={(e) =>
                      setData({ ...data, weight_kg: e.target.value })
                    }
                    placeholder="70"
                    className="w-full bg-[#F2F6FA] rounded-xl px-3.5 py-2.5 text-sm text-[#0A1A2F] outline-none border-2 border-transparent focus:border-[#38BDF8]"
                  />
                </div>
              )}

              {/* Height */}
              {currentStep.fields.includes('height_cm') && (
                <div>
                  <label className="text-xs font-bold text-[#0A1A2F]/60 block mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={data.height_cm}
                    onChange={(e) =>
                      setData({ ...data, height_cm: e.target.value })
                    }
                    placeholder="175"
                    className="w-full bg-[#F2F6FA] rounded-xl px-3.5 py-2.5 text-sm text-[#0A1A2F] outline-none border-2 border-transparent focus:border-[#38BDF8]"
                  />
                </div>
              )}

              {/* Age */}
              {currentStep.fields.includes('age') && (
                <div>
                  <label className="text-xs font-bold text-[#0A1A2F]/60 block mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                    placeholder="30"
                    className="w-full bg-[#F2F6FA] rounded-xl px-3.5 py-2.5 text-sm text-[#0A1A2F] outline-none border-2 border-transparent focus:border-[#38BDF8]"
                  />
                </div>
              )}

              {/* Sex */}
              {currentStep.fields.includes('sex') && (
                <div>
                  <label className="text-xs font-bold text-[#0A1A2F]/60 block mb-2">
                    Sex
                  </label>
                  <div className="flex gap-2">
                    {['male', 'female'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setData({ ...data, sex: option })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          data.sex === option
                            ? 'bg-[#38BDF8] text-white'
                            : 'bg-[#F2F6FA] text-[#0A1A2F]'
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fitness Level */}
              {currentStep.fields.includes('fitness_level') && (
                <div>
                  <label className="text-xs font-bold text-[#0A1A2F]/60 block mb-2">
                    Fitness Level
                  </label>
                  <div className="space-y-2">
                    {FITNESS_LEVELS.map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setData({
                            ...data,
                            fitness_level: level.toLowerCase(),
                          })
                        }
                        className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-all ${
                          data.fitness_level === level.toLowerCase()
                            ? 'border-[#38BDF8] bg-[#EFF9FF]'
                            : 'border-gray-100 bg-white'
                        }`}
                      >
                        <span className="text-sm font-bold text-[#0A1A2F]">
                          {level}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fitness Goal */}
              {currentStep.fields.includes('fitness_goal') && (
                <div>
                  <label className="text-xs font-bold text-[#0A1A2F]/60 block mb-2">
                    Fitness Goal
                  </label>
                  <div className="space-y-2">
                    {GOALS.map((goal) => (
                      <button
                        key={goal}
                        onClick={() =>
                          setData({
                            ...data,
                            fitness_goal: goal
                              .toLowerCase()
                              .replace(/\s+/g, '_'),
                          })
                        }
                        className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-all ${
                          data.fitness_goal ===
                          goal.toLowerCase().replace(/\s+/g, '_')
                            ? 'border-[#38BDF8] bg-[#EFF9FF]'
                            : 'border-gray-100 bg-white'
                        }`}
                      >
                        <span className="text-sm font-bold text-[#0A1A2F]">
                          {goal}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Workout Days */}
              {currentStep.fields.includes('workout_days_per_week') && (
                <div>
                  <label className="text-xs font-bold text-[#0A1A2F]/60 block mb-2">
                    Workouts per Week
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {WORKOUT_DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() =>
                          setData({ ...data, workout_days_per_week: day })
                        }
                        className={`py-2 rounded-lg text-sm font-bold transition-all ${
                          data.workout_days_per_week === day
                            ? 'bg-[#38BDF8] text-white'
                            : 'bg-[#F2F6FA] text-[#0A1A2F]'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Goal Weight */}
              {currentStep.fields.includes('goal_weight_kg') && (
                <div>
                  <label className="text-xs font-bold text-[#0A1A2F]/60 block mb-2">
                    Goal Weight (kg) (Optional)
                  </label>
                  <input
                    type="number"
                    value={data.goal_weight_kg}
                    onChange={(e) =>
                      setData({ ...data, goal_weight_kg: e.target.value })
                    }
                    placeholder="65"
                    className="w-full bg-[#F2F6FA] rounded-xl px-3.5 py-2.5 text-sm text-[#0A1A2F] outline-none border-2 border-transparent focus:border-[#38BDF8]"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-2 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-[#0A1A2F] font-bold text-sm"
              >
                Back
              </button>
            )}
            {step < steps.length ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-3 rounded-xl bg-[#38BDF8] text-white font-bold text-sm active:scale-95 transition-transform"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-[#22C55E] text-white font-bold text-sm active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}