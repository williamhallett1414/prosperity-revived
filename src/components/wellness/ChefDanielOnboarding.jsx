import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, UtensilsCrossed, Zap, Target, BookOpen, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChefDanielOnboarding({ onComplete, onRevisit }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Chef Daniel 👨‍🍳",
      description: "Your elite nutrition coach is here to fuel your fitness goals with delicious, practical meals. Drawing from sports nutrition science, athletic performance protocols, and professional culinary expertise.",
      icon: UtensilsCrossed,
      highlight: null,
      position: 'center'
    },
    {
      title: "Smart Meal Recommendations",
      description: "Tell me your fitness goals, dietary preferences, and what's in your kitchen. I'll create practical meal plans that fuel your body, taste amazing, and fit your lifestyle—no bland chicken and rice unless that's what you want.",
      icon: Target,
      highlight: null,
      position: 'center',
      tip: "Use 'Create a meal plan' to get personalized recipes tailored to your goals."
    },
    {
      title: "Macro & Nutrient Guidance",
      description: "I'll help you understand macros (protein, carbs, fats) and how to structure meals for your specific goals: muscle building, fat loss, endurance, or general health. Education + execution.",
      icon: Zap,
      highlight: null,
      position: 'center',
      tip: "Ask about macro targets and I'll explain exactly why they matter for YOUR goals."
    },
    {
      title: "Recipe Creation & Swaps",
      description: "Get recipes for breakfast, lunch, dinner, snacks, and desserts. Want healthier versions? Allergies? Budget constraints? I'll adapt recipes and suggest ingredient swaps without sacrificing taste.",
      icon: UtensilsCrossed,
      highlight: null,
      position: 'center',
      tip: "Tell me about restrictions or preferences and I'll create perfect alternatives."
    },
    {
      title: "Grocery Lists & Prep",
      description: "I'll generate grocery lists based on meal plans, organize by store section, and give you meal prep strategies to save time. Smart shopping = sustainable habits.",
      icon: BookOpen,
      highlight: null,
      position: 'center',
      tip: "Get organized grocery lists to make shopping fast and efficient."
    },
    {
      title: "Nutrition Timing for Performance",
      description: "Not just WHAT you eat matters—WHEN you eat matters too. Pre-workout fuel, post-workout recovery nutrition, hydration protocols—optimized for your training.",
      icon: Zap,
      highlight: null,
      position: 'center',
      tip: "Ask about pre/post workout nutrition for your specific workouts."
    },
    {
      title: "Daily Nutrition Notifications",
      description: "Get personalized tips throughout your day: morning hydration reminders, midday nutrition boosts, post-workout recovery fuel suggestions, and evening prep advice—because consistency compounds.",
      icon: Zap,
      highlight: null,
      position: 'center',
      tip: "Customize notification times and topics in settings for your routine."
    },
    {
      title: "Let's Fuel Your Goals 👨‍🍳",
      description: "Nutrition isn't about restriction—it's about fueling your body to crush your goals while enjoying delicious food. Let's make this sustainable and enjoyable.",
      icon: UtensilsCrossed,
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
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 relative">
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
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
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
                  className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 flex gap-2"
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex items-center justify-center gap-2"
                >
                  {step === steps.length - 1 ? 'Start Cooking' : 'Next'}
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