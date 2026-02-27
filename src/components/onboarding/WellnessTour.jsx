import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, Heart, Dumbbell, Users, MessageCircle, LayoutDashboard, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Wellness! 🌿',
    description: 'Your all-in-one hub for body, mind, and spirit. Let\'s take a quick tour of the key features.',
    icon: Sparkles,
    position: 'center',
    targetId: null,
  },
  {
    id: 'wellness_tab',
    title: 'Wellness Dashboard',
    description: 'This is your Wellness home — track meals, workouts, water intake, and get personalized recommendations all in one place.',
    icon: LayoutDashboard,
    position: 'bottom',
    targetId: 'nav-wellness',
    navPage: 'Wellness',
  },
  {
    id: 'workouts',
    title: 'Workouts',
    description: 'Browse workout plans, start a session, track your progress, and even share your routines with the community.',
    icon: Dumbbell,
    position: 'bottom',
    targetId: 'nav-wellness',
    navPage: 'Wellness',
  },
  {
    id: 'gideon',
    title: 'Chat with Gideon',
    description: 'Gideon is your AI spiritual guide. Ask him anything — scripture, life advice, or a word of encouragement. He remembers your journey.',
    icon: MessageCircle,
    position: 'center',
    targetId: null,
  },
  {
    id: 'groups',
    title: 'Join a Group',
    description: 'Find study and wellness groups to stay accountable. Join a Bible study, workout circle, or prayer group with others on the same path.',
    icon: Users,
    position: 'center',
    targetId: null,
  },
  {
    id: 'done',
    title: 'You\'re all set! 🎉',
    description: 'Explore at your own pace. Tap any section to dive in, and remember — Gideon is always here if you need guidance.',
    icon: Heart,
    position: 'center',
    targetId: null,
  },
];

export default function WellnessTour({ onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const currentStep = TOUR_STEPS[step];
  const Icon = currentStep.icon;

  useEffect(() => {
    if (currentStep.targetId) {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [step, currentStep.targetId]);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleFinish = async () => {
    try {
      await base44.auth.updateMe({ wellness_tour_completed: true });
    } catch (_) {}
    onComplete();
  };

  const handleSkip = async () => {
    try {
      await base44.auth.updateMe({ wellness_tour_completed: true });
    } catch (_) {}
    onSkip();
  };

  const isLast = step === TOUR_STEPS.length - 1;
  const progress = ((step + 1) / TOUR_STEPS.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        key="tour-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-end justify-center pb-8 px-4"
        style={{ background: 'rgba(10,26,47,0.65)', backdropFilter: 'blur(2px)' }}
      >
        {/* Spotlight highlight around target element */}
        {targetRect && (
          <motion.div
            key={currentStep.id + '-spotlight'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute rounded-2xl ring-4 ring-[#FD9C2D] ring-offset-2 pointer-events-none"
            style={{
              top: targetRect.top - 6,
              left: targetRect.left - 6,
              width: targetRect.width + 12,
              height: targetRect.height + 12,
              boxShadow: '0 0 0 9999px rgba(10,26,47,0.65)',
            }}
          />
        )}

        {/* Tour Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3C4E53] to-[#FD9C2D] p-5 relative">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">{currentStep.title}</h2>
                <p className="text-white/70 text-xs mt-0.5">Step {step + 1} of {TOUR_STEPS.length}</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FD9C2D] to-[#D9B878]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-1.5 pt-4 px-6">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-[#FD9C2D]' : i < step ? 'w-2 bg-[#FD9C2D]/40' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="p-6 pt-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            {step > 0 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 border-gray-200"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-[#FD9C2D] to-[#D9B878] hover:opacity-90 text-white font-semibold"
            >
              {isLast ? (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Let's Go!
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          {!isLast && (
            <button
              onClick={handleSkip}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 pb-4 transition-colors"
            >
              Skip tour
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}