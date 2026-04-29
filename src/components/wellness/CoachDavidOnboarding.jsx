import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Dumbbell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const FITNESS_GOALS = [
  { id: 'build_muscle', label: '💪 Build Muscle', desc: 'Strength & hypertrophy' },
  { id: 'lose_fat', label: '🔥 Lose Fat', desc: 'Cut & lean out' },
  { id: 'improve_endurance', label: '🏃 Endurance', desc: 'Cardio & stamina' },
  { id: 'get_stronger', label: '🏋️ Get Stronger', desc: 'Powerlifting focus' },
  { id: 'stay_active', label: '⚡ Stay Active', desc: 'General fitness' },
  { id: 'sport_performance', label: '🏅 Sport Perf.', desc: 'Athletic edge' },
];

const FITNESS_LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: '0–1 yr', emoji: '🌱' },
  { id: 'intermediate', label: 'Intermediate', desc: '1–3 yrs', emoji: '💪' },
  { id: 'advanced', label: 'Advanced', desc: '3+ yrs', emoji: '🏆' },
];

const TRACKERS = [
  { id: 'apple_health', label: 'Apple Health', icon: '🍎' },
  { id: 'google_fit', label: 'Google Fit', icon: '🤖' },
  { id: 'garmin', label: 'Garmin', icon: '⌚' },
  { id: 'fitbit', label: 'Fitbit', icon: '📊' },
  { id: 'whoop', label: 'WHOOP', icon: '💜' },
  { id: 'none', label: 'No tracker', icon: '🙅' },
];

const WEEKLY_DAYS = [1, 2, 3, 4, 5, 6, 7];

export default function CoachDavidOnboarding({ onComplete, user }) {
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [selectedTracker, setSelectedTracker] = useState('');
  const [workoutDays, setWorkoutDays] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 5;

  const toggleGoal = (id) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      // Save preferences to ChatbotMemory
      setIsSaving(true);
      try {
        const goalLabels = selectedGoals.map(g => FITNESS_GOALS.find(f => f.id === g)?.label || g);
        await base44.entities.ChatbotMemory.create({
          chatbot_name: 'CoachDavid',
          memory_type: 'preference',
          content: `Fitness goals: ${goalLabels.join(', ')}. Level: ${fitnessLevel}. Tracker: ${selectedTracker}. Trains ${workoutDays}x/week.`,
          context: 'Onboarding setup',
          importance: 9,
          conversation_date: new Date().toISOString().split('T')[0],
          last_referenced: new Date().toISOString(),
        });
      } catch (e) { /* silent */ }
      setIsSaving(false);
      onComplete({ goals: selectedGoals, level: fitnessLevel, tracker: selectedTracker, workoutDays });
    }
  };

  const canAdvance = () => {
    if (step === 1) return selectedGoals.length > 0;
    if (step === 2) return !!fitnessLevel;
    if (step === 3) return !!selectedTracker;
    return true;
  };

  const gradientFrom = 'from-[#AFC7E3]';
  const gradientTo = 'to-[#6B7280]';

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
          <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white p-5 relative`}>
            <button onClick={() => onComplete({})} className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">
                  {step === 0 && 'Welcome, Athlete! 💪'}
                  {step === 1 && 'Your Fitness Goals'}
                  {step === 2 && 'Your Level'}
                  {step === 3 && 'Connect Your Tracker'}
                  {step === 4 && 'Training Frequency'}
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
              className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
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
                    <div className="text-5xl mb-4">💪</div>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                      I'm <strong>Coach David</strong> — your elite fitness coach. In the next 4 quick steps, I'll set up a personalized training experience just for you.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-3">Takes less than 2 minutes.</p>
                  </div>
                )}

                {/* Step 1: Goals */}
                {step === 1 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Select all that apply:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {FITNESS_GOALS.map(goal => (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={`rounded-xl border-2 p-3 text-left transition-all ${
                            selectedGoals.includes(goal.id)
                              ? 'border-[#AFC7E3] bg-[#AFC7E3]/10'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-white/15'
                          }`}
                        >
                          <div className="font-semibold text-xs text-gray-800 dark:text-gray-100">{goal.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">{goal.desc}</div>
                          {selectedGoals.includes(goal.id) && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#AFC7E3] mt-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Fitness level */}
                {step === 2 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">How long have you been training consistently?</p>
                    <div className="space-y-2">
                      {FITNESS_LEVELS.map(lvl => (
                        <button
                          key={lvl.id}
                          onClick={() => setFitnessLevel(lvl.id)}
                          className={`w-full flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                            fitnessLevel === lvl.id
                              ? 'border-[#AFC7E3] bg-[#AFC7E3]/10'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-white/15'
                          }`}
                        >
                          <span className="text-2xl">{lvl.emoji}</span>
                          <div>
                            <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">{lvl.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-300">{lvl.desc}</div>
                          </div>
                          {fitnessLevel === lvl.id && (
                            <CheckCircle2 className="w-4 h-4 text-[#AFC7E3] ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Fitness tracker */}
                {step === 3 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Do you use a fitness tracker?</p>
                    <p className="text-xs text-gray-400 dark:text-gray-300 mb-3">I'll tailor advice based on your data sources.</p>
                    <div className="grid grid-cols-3 gap-2">
                      {TRACKERS.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTracker(t.id)}
                          className={`rounded-xl border-2 p-3 flex flex-col items-center gap-1 transition-all ${
                            selectedTracker === t.id
                              ? 'border-[#AFC7E3] bg-[#AFC7E3]/10'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:border-white/15'
                          }`}
                        >
                          <span className="text-xl">{t.icon}</span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">{t.label}</span>
                        </button>
                      ))}
                    </div>
                    {selectedTracker && selectedTracker !== 'none' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-[#6B7280] mt-3 bg-[#AFC7E3]/10 rounded-lg p-2"
                      >
                        ✅ I'll factor in your {TRACKERS.find(t => t.id === selectedTracker)?.label} data for smarter recovery and intensity recommendations.
                      </motion.p>
                    )}
                  </div>
                )}

                {/* Step 4: Workout frequency */}
                {step === 4 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">How many days per week can you train?</p>
                    <div className="flex justify-center gap-2 flex-wrap mb-4">
                      {WEEKLY_DAYS.map(d => (
                        <button
                          key={d}
                          onClick={() => setWorkoutDays(d)}
                          className={`w-10 h-10 rounded-full border-2 font-bold text-sm transition-all ${
                            workoutDays === d
                              ? 'border-[#AFC7E3] bg-[#AFC7E3] text-white'
                              : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#AFC7E3]'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-300">
                      {workoutDays <= 2 && '2 days is enough to make real progress!'}
                      {workoutDays === 3 && '3 days — the sweet spot for most goals 🎯'}
                      {workoutDays === 4 && '4 days — solid commitment, great results 💪'}
                      {workoutDays >= 5 && `${workoutDays} days — beast mode! Recovery matters too 🏆`}
                    </p>
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                      🔥 You're all set! I'll build your personalized plan around <strong>{workoutDays}x/week</strong> training with your goals in mind.
                    </div>
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
                className={`flex-1 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white flex items-center justify-center gap-2 text-sm`}
              >
                {isSaving ? 'Saving...' : step === totalSteps - 1 ? "Let's Train!" : 'Next'}
                {!isSaving && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}