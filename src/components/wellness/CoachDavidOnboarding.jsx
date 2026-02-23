import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Dumbbell, Zap, Target, BookOpen, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CoachDavidOnboarding({ onComplete, onRevisit }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Coach David 💪",
      description: "Your elite fitness coach is here to transform your discipline, build unstoppable strength, and reshape your mindset. Drawing from champion bodybuilders, elite fitness trainers, and military training protocols.",
      icon: Dumbbell,
      highlight: null,
      position: 'center'
    },
    {
      title: "Personalized Workout Plans",
      description: "Tell me your goals, fitness level, available time, and equipment. I'll generate a tailored workout plan with progressive overload, proper form cues, and recovery protocols—not generic routines.",
      icon: Target,
      highlight: null,
      position: 'center',
      tip: "Use 'Build me a workout plan' quick action to get started instantly."
    },
    {
      title: "Exercise Form Analysis",
      description: "Upload a video of your exercise and I'll analyze your form in detail: identify what you're doing well, what needs correction, and provide visual diagrams showing proper biomechanics.",
      icon: Zap,
      highlight: null,
      position: 'center',
      tip: "Click 'Analyze Form' button to upload exercise videos for real-time feedback."
    },
    {
      title: "Intensity & Recovery Coaching",
      description: "I adapt intensity based on your fitness level and past workouts. I also provide specific recovery advice—sleep protocols, nutrition timing, active recovery—because gains happen during rest, not just in the gym.",
      icon: Dumbbell,
      highlight: null,
      position: 'center',
      tip: "Tell me how you're feeling and I'll adjust recommendations accordingly."
    },
    {
      title: "Discipline & Accountability",
      description: "We're building identity here—you're not just working out, you're becoming someone unstoppable. I'll keep you accountable, push through mental barriers, and remind you that consistency compounds.",
      icon: Zap,
      highlight: null,
      position: 'center',
      tip: "Use quick actions like 'Hold me accountable' for daily commitments."
    },
    {
      title: "Quick Fitness Actions",
      description: "Access fast help with buttons for workout plans, form fixes, consistency help, plateau breakthroughs, and motivation—all pre-formatted to get you answers instantly.",
      icon: Zap,
      highlight: 'quick-menu',
      position: 'bottom',
      tip: "Collapse the menu if you want more space, but it's your shortcut to what matters most."
    },
    {
      title: "Psychology Meets Fitness",
      description: "I'm not just about reps and sets. I analyze limiting beliefs, help you overcome self-sabotage, build mental toughness, and remind you that your mindset determines your body.",
      icon: BookOpen,
      highlight: null,
      position: 'center',
      tip: "Share what's really stopping you—the mental blocks often matter more than physical ones."
    },
    {
      title: "Let's Build Champions 💪",
      description: "There's no judgment here. Whether you're a beginner or advanced, we're starting where you are and building unstoppable discipline. Your consistency is your superpower.",
      icon: Dumbbell,
      highlight: null,
      position: 'center'
    }
  ];

  const currentStep = steps[step];
  const CurrentIcon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (step >= steps.length) {
    onComplete();
    return null;
  }

  return (
    <AnimatePresence>
      {step < steps.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 relative">
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                title="Skip tour"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mt-1">
                  <CurrentIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentStep.title}</h2>
                  <p className="text-xs text-white/80 mt-1">
                    Step {step + 1} of {steps.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-600"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                {currentStep.description}
              </p>

              {/* Tip Box */}
              {currentStep.tip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex gap-2"
                >
                  <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{currentStep.tip}</p>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 text-gray-700"
                >
                  Skip Tour
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white flex items-center justify-center gap-2"
                >
                  {step === steps.length - 1 ? 'Start Training' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}