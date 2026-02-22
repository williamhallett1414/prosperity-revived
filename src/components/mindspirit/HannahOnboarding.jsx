import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HannahOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Hannah 💛",
      description: "Your personal growth guide is here to support your journey. Let me show you what I can help with.",
      highlight: null,
      position: 'center'
    },
    {
      title: "Mood Tracking",
      description: "I track your emotional state to understand patterns and provide personalized support. Check in with your mood anytime—it helps me know how best to guide you.",
      highlight: 'mood-tracker',
      position: 'bottom'
    },
    {
      title: "Quick Topic Access",
      description: "Quickly jump into conversations about habits, boundaries, finances, relationships, and more. These shortcuts save time and get you straight to what matters.",
      highlight: 'quick-actions',
      position: 'bottom'
    },
    {
      title: "Personalized Insights",
      description: "I remember your emotional patterns from past conversations. Over time, I notice what you struggle with most and proactively suggest exercises tailored to you.",
      highlight: null,
      position: 'center'
    },
    {
      title: "Knowledge Base Integration",
      description: "When relevant, I share insights from curated research, books, and evidence-based resources. Every recommendation is grounded in psychology and personal development science.",
      highlight: null,
      position: 'center'
    },
    {
      title: "Coaching Framework",
      description: "I ask powerful coaching questions designed to deepen your self-awareness. My goal isn't to tell you what to do—it's to help you discover your own wisdom.",
      highlight: null,
      position: 'center'
    },
    {
      title: "You're Ready!",
      description: "Take your time exploring. There's no rush. I'm here whenever you need support, guidance, or just someone to listen. What's alive for you today?",
      highlight: null,
      position: 'center'
    }
  ];

  const currentStep = steps[step];

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
            <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white p-6 relative">
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mt-1">
                  <Lightbulb className="w-6 h-6 text-white" />
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
                className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                {currentStep.description}
              </p>

              {/* Feature Highlight Info */}
              {step === 1 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
                  👆 You can adjust the mood slider at the top of our chat. I use this to calibrate my support.
                </div>
              )}

              {step === 2 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
                  👆 Click any quick topic button to instantly start a conversation about it. These are personalized to common growth areas.
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 text-gray-700"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white flex items-center justify-center gap-2"
              >
                {step === steps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}