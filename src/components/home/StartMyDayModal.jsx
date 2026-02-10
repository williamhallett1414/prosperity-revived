import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getVerseOfDay } from '@/components/bible/BibleData';

export default function StartMyDayModal({ isOpen, onClose, meditations = [], workoutPlans = [] }) {
  const [step, setStep] = useState(0);
  const verse = getVerseOfDay();

  const affirmations = [
    "God's peace guards my heart and mind.",
    "I walk in purpose and clarity today.",
    "Christ strengthens me in all things."
  ];
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todaysAffirmation = affirmations[dayOfYear % affirmations.length];

  const suggestedMeditation = meditations.find(m => m.status === 'ready') || meditations[0];
  const suggestedWorkout = workoutPlans[0];

  const steps = [
    {
      title: 'Scripture of the Day',
      emoji: '📖',
      content: (
        <div className="space-y-4">
          <div className="bg-[#E6EBEF] rounded-2xl p-6">
            <p className="font-serif italic text-[#0A1A2F] text-lg mb-4">
              "{verse.text}"
            </p>
            <p className="text-sm text-[#0A1A2F]/60 font-semibold">
              {verse.book} {verse.chapter}:{verse.verse}
            </p>
          </div>
          <p className="text-sm text-[#0A1A2F]/70 text-center">
            Take a moment to meditate on these words
          </p>
        </div>
      )
    },
    {
      title: '2-Minute Prayer',
      emoji: '🙏',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-2xl p-6">
            <p className="text-[#0A1A2F] leading-relaxed">
              Heavenly Father,<br/><br/>
              Thank you for this new day. Guide my steps, guard my heart, and fill me with your peace. 
              Help me to love others well and glorify you in all I do.<br/><br/>
              In Jesus' name, Amen.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Breathwork',
      emoji: '🌬️',
      content: (
        <div className="space-y-4">
          <div className="bg-[#E6EBEF] rounded-2xl p-6 space-y-3">
            <p className="text-[#0A1A2F] font-semibold">Box Breathing (4-4-4-4)</p>
            <ul className="space-y-2 text-[#0A1A2F]/80 text-sm">
              <li>• Breathe in for 4 counts</li>
              <li>• Hold for 4 counts</li>
              <li>• Breathe out for 4 counts</li>
              <li>• Hold for 4 counts</li>
            </ul>
            <p className="text-xs text-[#0A1A2F]/60 pt-2">Repeat 5 times</p>
          </div>
        </div>
      )
    },
    {
      title: 'Daily Affirmation',
      emoji: '✨',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-2xl p-8 text-center">
            <p className="text-2xl text-[#0A1A2F] font-bold leading-relaxed">
              {todaysAffirmation}
            </p>
          </div>
          <p className="text-sm text-[#0A1A2F]/70 text-center">
            Speak this over your life today
          </p>
        </div>
      )
    },
    {
      title: 'Suggested Meditation',
      emoji: '🧘',
      content: (
        <div className="space-y-4">
          {suggestedMeditation ? (
            <>
              <div className="bg-[#E6EBEF] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-[#0A1A2F] mb-2">{suggestedMeditation.title}</h3>
                <p className="text-sm text-[#0A1A2F]/70 mb-4">{suggestedMeditation.description}</p>
                <Button 
                  onClick={() => window.location.href = `/DiscoverMeditations`}
                  className="w-full bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] hover:from-[#AFC7E3]/90 hover:to-[#D9B878]/90 text-[#0A1A2F]"
                >
                  Start Meditation
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-[#E6EBEF] rounded-2xl p-6 text-center">
              <p className="text-[#0A1A2F]/70">Browse our meditation library</p>
              <Button 
                onClick={() => window.location.href = `/DiscoverMeditations`}
                className="mt-4 bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] text-[#0A1A2F]"
              >
                View Meditations
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Today's Workout",
      emoji: '💪',
      content: (
        <div className="space-y-4">
          {suggestedWorkout ? (
            <div className="bg-[#E6EBEF] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#0A1A2F] mb-2">{suggestedWorkout.title}</h3>
              <p className="text-sm text-[#0A1A2F]/70 mb-4">{suggestedWorkout.description}</p>
              <Button 
                onClick={() => window.location.href = `/DiscoverWorkouts`}
                className="w-full bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
              >
                View Workout
              </Button>
            </div>
          ) : (
            <div className="bg-[#E6EBEF] rounded-2xl p-6 text-center">
              <p className="text-[#0A1A2F]/70">Choose a workout for today</p>
              <Button 
                onClick={() => window.location.href = `/DiscoverWorkouts`}
                className="mt-4 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] text-[#0A1A2F]"
              >
                Browse Workouts
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Nutrition Reminder',
      emoji: '🥗',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#AFC7E3] to-[#D9B878] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[#0A1A2F] mb-3">Fuel Your Body Well</h3>
            <ul className="space-y-2 text-[#0A1A2F]/80 text-sm">
              <li>• Stay hydrated (8 glasses of water)</li>
              <li>• Eat protein with every meal</li>
              <li>• Include colorful vegetables</li>
              <li>• Choose whole foods over processed</li>
            </ul>
          </div>
          <Button 
            onClick={() => window.location.href = `/NutritionGuidance`}
            className="w-full bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] text-[#0A1A2F]"
          >
            Log Today's Meals
          </Button>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-[#0A1A2F]">Start My Day</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#0A1A2F]/10 hover:bg-[#0A1A2F]/20 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-[#0A1A2F]" />
            </button>
          </div>
          <div className="flex items-center justify-between text-sm text-[#0A1A2F]/70">
            <span>Step {step + 1} of {steps.length}</span>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-6 rounded-full transition-all ${
                    i <= step ? 'bg-[#0A1A2F]' : 'bg-[#0A1A2F]/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{currentStep.emoji}</div>
                <h3 className="text-2xl font-bold text-[#0A1A2F]">{currentStep.title}</h3>
              </div>
              {currentStep.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-[#E6EBEF] rounded-b-3xl">
          <div className="flex gap-3">
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1 border-[#E6EBEF]"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={() => step < steps.length - 1 ? setStep(step + 1) : onClose()}
              className="flex-1 bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] hover:from-[#D9B878]/90 hover:to-[#AFC7E3]/90 text-[#0A1A2F]"
            >
              {step < steps.length - 1 ? (
                <>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                'Complete'
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}