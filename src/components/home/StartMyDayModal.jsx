import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { getVerseOfDay } from '@/components/bible/BibleData';
import { Play, ChevronRight } from 'lucide-react';
import StartWorkoutModal from '@/components/wellness/StartWorkoutModal';

const affirmations = [
  "I am worthy of God's love and grace",
  "Today I will choose faith over fear",
  "My potential is limitless with God",
  "I am stronger than my challenges",
  "God's purpose is working through me",
  "I radiate peace and positivity",
  "My dreams are valid and achievable",
  "I am exactly where I need to be"
];

const getAffirmation = () => affirmations[new Date().getDate() % affirmations.length];

export default function StartMyDayModal({ isOpen, onClose, meditations = [], workoutPlans = [], user }) {
  const [step, setStep] = useState(0);
  const [breathCycle, setBreathCycle] = useState('inhale');
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const verse = getVerseOfDay();
  const affirmation = getAffirmation();
  const suggestedMeditation = meditations.find(m => m.category === 'breathing' || m.category === 'mindfulness');
  const suggestedWorkout = workoutPlans?.[0];

  const steps = [
    {
      title: 'Scripture of the Day',
      emoji: '📖',
      color: 'from-[#AFC7E3] to-[#D9B878]',
      duration: 5,
      content: (
        <div className="space-y-3">
          <p className="font-serif italic text-[#0A1A2F] text-lg leading-relaxed">
            "{verse.text}"
          </p>
          <p className="text-sm text-[#0A1A2F]/60 font-semibold">
            {verse.book} {verse.chapter}:{verse.verse}
          </p>
        </div>
      )
    },
    {
      title: '2-Minute Prayer',
      emoji: '🙏',
      color: 'from-[#D9B878] to-[#AFC7E3]',
      duration: 2,
      content: (
        <div className="space-y-3 text-center">
          <p className="text-[#0A1A2F] leading-relaxed">
            "Lord, guide my steps today. Fill me with wisdom, courage, and compassion. Help me live with purpose and faith. Amen."
          </p>
        </div>
      )
    },
    {
      title: 'Breathwork',
      emoji: '🌬️',
      color: 'from-[#AFC7E3] to-[#0A1A2F]',
      duration: 2,
      content: (
        <div className="space-y-4 text-center">
          <div className="text-6xl mb-4">
            {breathCycle === 'inhale' && '↗️'}
            {breathCycle === 'hold' && '➡️'}
            {breathCycle === 'exhale' && '↙️'}
          </div>
          <p className="text-[#0A1A2F] font-semibold text-lg capitalize">
            {breathCycle} (4 counts)
          </p>
          <p className="text-xs text-[#0A1A2F]/60">Breathe deeply and center yourself</p>
        </div>
      )
    },
    {
      title: 'Daily Affirmation',
      emoji: '✨',
      color: 'from-[#D9B878] to-[#FD9C2D]',
      duration: 3,
      content: (
        <div className="space-y-3 text-center">
          <p className="text-[#0A1A2F] text-xl font-semibold leading-relaxed">
            {affirmation}
          </p>
          <p className="text-xs text-[#0A1A2F]/60">Repeat this throughout your day</p>
        </div>
      )
    },
    ...(suggestedMeditation ? [{
      title: 'Suggested Meditation',
      emoji: '🧘',
      color: 'from-[#AFC7E3] to-[#D9B878]',
      duration: 2,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#0A1A2F]/70">{suggestedMeditation.description}</p>
          <p className="text-xs text-[#0A1A2F]/60"><strong>Duration:</strong> {suggestedMeditation.duration_minutes} min</p>
          <Button
            onClick={() => window.location.href = `${createPageUrl('DiscoverMeditations')}?id=${suggestedMeditation.id}`}
            disabled={!suggestedMeditation.tts_audio_url}
            className="w-full bg-white hover:bg-white/90 text-[#0A1A2F]"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Meditation
          </Button>
        </div>
      )
    }] : []),
    ...(suggestedWorkout ? [{
       title: "Today's Workout",
       emoji: '💪',
       color: 'from-[#D9B878] to-[#AFC7E3]',
       duration: 2,
       content: (
         <div className="space-y-3">
           <p className="text-sm text-[#0A1A2F]/70">{suggestedWorkout.description}</p>
           <p className="text-xs text-[#0A1A2F]/60"><strong>Duration:</strong> {suggestedWorkout.duration_minutes} min</p>
           <Button
             onClick={() => setShowWorkoutModal(true)}
             className="w-full bg-white hover:bg-white/90 text-[#0A1A2F]"
             size="sm"
           >
             Start Workout
           </Button>
         </div>
       )
     }] : []),
    {
      title: 'Nutrition Reminder',
      emoji: '🥗',
      color: 'from-[#AFC7E3] to-[#D9B878]',
      duration: 2,
      content: (
        <div className="space-y-3 text-center">
          <p className="text-[#0A1A2F]">
            Remember to hydrate and nourish your body throughout the day.
          </p>
          <p className="text-xs text-[#0A1A2F]/60">
            Start with a glass of water and a nutritious breakfast.
          </p>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setBreathCycle(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-skip removed - users must manually progress through steps

  const currentStep = steps[step];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-[#F2F6FA] border-0">
        <DialogHeader>
          <DialogTitle className="text-center"></DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress */}
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-1 flex-1 rounded-full ${
                  idx <= step ? `bg-gradient-to-r ${currentStep.color}` : 'bg-[#E6EBEF]'
                }`}
                layoutId={`progress-${idx}`}
              />
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="text-5xl mb-3">{currentStep.emoji}</div>
                <h2 className="text-2xl font-bold text-[#0A1A2F]">{currentStep.title}</h2>
              </div>

              <div className="bg-white rounded-xl p-5 min-h-[200px] flex items-center justify-center">
                {currentStep.content}
              </div>

              {/* Timer */}
              <div className="text-center">
                <div className="inline-block">
                  <div className="text-3xl font-bold text-[#D9B878]">
                    {currentStep.duration}s
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  onClose();
                }
              }}
              className="flex-1 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
              size="sm"
            >
              {step === steps.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <StartWorkoutModal
      isOpen={showWorkoutModal}
      onClose={() => setShowWorkoutModal(false)}
      workout={suggestedWorkout}
      user={user}
    />
    </>
  );
}