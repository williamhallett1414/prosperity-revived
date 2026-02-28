import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Lightbulb, Heart, BookOpen, Zap, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HannahOnboarding({ onComplete, onRevisit }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Hannah 💛",
      description: "Your personal growth guide is here to support your journey. I combine therapy-informed coaching, habit science, and emotional intelligence to help you grow.",
      icon: Heart,
      highlight: null,
      position: 'center'
    },
    {
      title: "Personalized Coaching Insights",
      description: "Based on your journal entries, I detect emotional patterns and key themes in your life. I then proactively offer tailored coaching interventions—not generic suggestions, but insights uniquely designed for you.",
      icon: Lightbulb,
      highlight: null,
      position: 'center',
      tip: "You'll see a personalized insight panel when patterns emerge from your reflections. This appears after you've written a few entries."
    },
    {
      title: "Journal Analysis & Sentiment Tracking",
      description: "Every time you journal, I analyze the emotional sentiment, detect emotions, and identify key themes. This gives you visual insights into your emotional trends over time.",
      icon: BookOpen,
      highlight: null,
      position: 'center',
      tip: "Use the journal analysis feature in your reflection page to see charts of your emotional patterns and explore specific themes."
    },
    {
      title: "Proactive Suggestions",
      description: "I remember your emotional patterns from past conversations and upcoming insights. Instead of waiting for you to ask, I proactively suggest exercises, frameworks, and perspectives tailored to what you're working through.",
      icon: Zap,
      highlight: null,
      position: 'center',
      tip: "The more you engage—journaling, chatting, tracking your mood—the better my suggestions become."
    },
    {
      title: "Mood Tracking",
      description: "Check in with your mood anytime using the mood slider. I use this to calibrate my support and understand your emotional state in real-time.",
      icon: Heart,
      highlight: 'mood-tracker',
      position: 'bottom',
      tip: "Your mood data helps me provide more emotionally attuned responses and identify patterns."
    },
    {
      title: "Quick Topic Access",
      description: "Jump straight into conversations about habits, boundaries, finances, relationships, and more. These are personalized shortcuts designed to get you to what matters most.",
      icon: Zap,
      highlight: 'quick-actions',
      position: 'bottom',
      tip: "Start with any topic that feels relevant right now. You can explore anything—there's no wrong way to engage."
    },
    {
      title: "Journal Mode",
      description: "Write freely in journal mode. Your reflections are saved as journal entries, analyzed for sentiment and themes, and used to generate personalized insights. It's like journaling with a therapist listening.",
      icon: BookOpen,
      highlight: null,
      position: 'center',
      tip: "Toggle journal mode to save full conversations—both your thoughts and my responses—as journal entries."
    },
    {
      title: "You're Ready to Begin!",
      description: "There's no rush to figure everything out. I'm here whenever you need support, guidance, reflection, or just someone to listen. Let's grow together.",
      icon: Heart,
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

  const handleRevisit = () => {
    if (onRevisit) {
      onRevisit();
    }
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
            <div className="bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53] text-white p-6 relative">
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
                className="h-full bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53]"
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
                  className="flex-1 bg-gradient-to-r from-[#AFC7E3] to-[#3C4E53] hover:from-[#9ab5d4] hover:to-[#2d3d41] text-white flex items-center justify-center gap-2"
                >
                  {step === steps.length - 1 ? 'Get Started' : 'Next'}
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