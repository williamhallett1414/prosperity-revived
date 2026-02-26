import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, BookOpen, Brain, Heart, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GideonOnboarding({ onComplete, onRevisit }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Meet Gideon 📖",
      description: "Gideon is your personal spiritual guide. Ask him anything — scripture questions, life advice, prayer guidance, or daily encouragement. He remembers your journey and adapts to you over time.",
      icon: BookOpen,
      tip: "Try asking: 'What does the Bible say about anxiety?' or 'Give me a verse for today.'"
    }
  ];

  const currentStep = steps[step];
  const CurrentIcon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('gideon_onboarding_complete', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('gideon_onboarding_complete', 'true');
    onComplete();
  };

  if (step >= steps.length) {
    localStorage.setItem('gideon_onboarding_complete', 'true');
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
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 relative">
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
                className="h-full bg-gradient-to-r from-purple-500 to-blue-600"
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
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 flex gap-2"
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
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white flex items-center justify-center gap-2"
                >
                  {step === steps.length - 1 ? 'Start Journey' : 'Next'}
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