import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';
import { getVerseOfDay } from '@/components/bible/BibleData';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const AFFIRMATIONS = [
  "I am worthy of God's love and grace",
  "Today I will choose faith over fear",
  "My potential is limitless with God",
  "I am stronger than my challenges",
  "God's purpose is working through me",
  "I radiate peace and positivity",
  "My dreams are valid and achievable",
  "I am exactly where I need to be",
  "The Lord is my strength and my shield",
  "I walk in confidence because God goes before me",
];

export default function StartMyDayModal({ isOpen, onClose, user }) {
  const [step, setStep] = useState(0);
  const [intention, setIntention] = useState('');
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathActive, setBreathActive] = useState(false);
  const [completing, setCompleting] = useState(false);
  const breathTimerRef = useRef(null);

  const verse = getVerseOfDay();
  const affirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      const lastDone = localStorage.getItem('start_my_day_done');
      if (lastDone === today) {
        // Already completed today — still allow reopening but start at 0
      }
      setStep(0);
      setIntention('');
      setBreathCount(0);
      setBreathPhase('inhale');
      setBreathActive(false);
    }
    return () => { clearInterval(breathTimerRef.current); };
  }, [isOpen]);

  // Breathwork timer — only runs when active AND on breathwork step (step 2)
  useEffect(() => {
    if (!breathActive || step !== 2) { 
      clearInterval(breathTimerRef.current); 
      if (step !== 2) setBreathActive(false); // auto-stop when leaving step
      return; 
    }
    let count = 0;
    const phases = ['inhale', 'hold', 'exhale', 'hold'];
    let phaseIdx = 0;
    breathTimerRef.current = setInterval(() => {
      count++;
      setBreathCount(c => c + 1);
      if (count % 4 === 0) {
        phaseIdx = (phaseIdx + 1) % 4;
        setBreathPhase(phases[phaseIdx]);
      }
    }, 1000);
    return () => clearInterval(breathTimerRef.current);
  }, [breathActive, step]);

  const handleComplete = async () => {
    if (completing) return;
    setCompleting(true);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('start_my_day_done', today);

    // Save intention as journal entry
    if (intention.trim() && user?.email) {
      try {
        await base44.entities.JournalEntry.create({
          title: 'Morning Intention',
          content: intention.trim(),
          entry_type: 'spiritual',
        });
      } catch (e) { console.warn('Could not save intention:', e); }
    }

    toast.success('Morning ritual complete! Have a blessed day.');
    setCompleting(false);
    onClose();
  };

  const steps = [
    {
      title: "Today's Scripture",
      emoji: '📖',
      color: 'from-[#c9a227] to-[#FAD98D]',
      content: (
        <div className="space-y-3">
          <p className="font-serif italic text-[#0A1A2F] text-lg leading-relaxed text-center">
            "{verse.text}"
          </p>
          <p className="text-sm text-[#0A1A2F]/50 font-semibold text-center">
            {verse.book} {verse.chapter}:{verse.verse}
          </p>
          <p className="text-xs text-[#0A1A2F]/40 text-center mt-2">
            Sit with this verse for a moment. Let it speak to you.
          </p>
        </div>
      )
    },
    {
      title: 'Morning Prayer',
      emoji: '🙏',
      color: 'from-[#FAD98D] to-[#AFC7E3]',
      content: (
        <div className="space-y-4 text-center">
          <p className="text-[#0A1A2F] leading-relaxed text-sm">
            Lord, thank You for this new day. I surrender my plans, my worries, and my desires to You.
            Fill me with Your Spirit. Give me wisdom for every decision, patience in every trial,
            and courage to live boldly for You. Let my words bring life and my actions bring glory to Your name. Amen.
          </p>
          <p className="text-xs text-[#0A1A2F]/40">Close your eyes and pray from your heart.</p>
        </div>
      )
    },
    {
      title: 'Box Breathing',
      emoji: '🌬️',
      color: 'from-[#AFC7E3] to-[#0A1A2F]',
      content: (
        <div className="space-y-4 text-center">
          {!breathActive ? (
            <div>
              <p className="text-sm text-[#0A1A2F]/70 mb-4">
                4 seconds in · 4 seconds hold · 4 seconds out · 4 seconds hold
              </p>
              <button
                onClick={() => { setBreathCount(0); setBreathPhase('inhale'); setBreathActive(true); }}
                className="px-6 py-3 bg-gradient-to-r from-[#AFC7E3] to-[#0A1A2F] text-white rounded-full text-sm font-bold shadow-lg"
              >
                Start Breathing
              </button>
            </div>
          ) : (
            <div>
              {/* Animated breathing circle */}
              <motion.div
                className="w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #AFC7E3, #0A1A2F)' }}
                animate={{
                  scale: breathPhase === 'inhale' ? [0.7, 1.2] :
                         breathPhase === 'exhale' ? [1.2, 0.7] : 1.0,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
              >
                <span className="text-white text-sm font-bold capitalize">{breathPhase}</span>
              </motion.div>
              <p className="text-xs text-[#0A1A2F]/50">
                {breathCount < 48 ? `${Math.ceil((48 - breathCount) / 4)} cycles remaining` : 'Well done!'}
              </p>
              {breathCount >= 48 && (
                <p className="text-xs text-emerald-600 font-bold mt-2">3 rounds complete!</p>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Set Your Intention',
      emoji: '🎯',
      color: 'from-[#FD9C2D] to-[#FAD98D]',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#0A1A2F]/70 text-center">
            What is the ONE thing you want to focus on today?
          </p>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Today I will..."
            maxLength={500}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0A1A2F] resize-none focus:outline-none focus:border-[#c9a227] transition-colors"
            rows={3}
          />
          <p className="text-[10px] text-[#0A1A2F]/30 text-center">
            This will be saved to your journal.
          </p>
        </div>
      )
    },
    {
      title: 'Daily Affirmation',
      emoji: '✨',
      color: 'from-[#FAD98D] to-[#c9a227]',
      content: (
        <div className="space-y-4 text-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[#0A1A2F] text-xl font-bold leading-relaxed"
          >
            "{affirmation}"
          </motion.p>
          <p className="text-xs text-[#0A1A2F]/50">Say this out loud. Repeat it 3 times.</p>
          <div className="pt-2">
            <Sparkles className="w-6 h-6 text-[#c9a227] mx-auto" />
          </div>
        </div>
      )
    },
  ];

  if (!isOpen) return <></>;
  const currentStep = steps[Math.min(step, steps.length - 1)];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-[#F2F6FA] border-0">
        <DialogHeader>
          <DialogTitle className="text-center text-xs text-[#0A1A2F]/40 uppercase tracking-widest">
            Start My Day
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Progress dots */}
          <div className="flex gap-1.5 justify-center">
            {steps.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx < step ? 'w-6 bg-[#c9a227]' :
                  idx === step ? `w-8 bg-gradient-to-r ${currentStep.color}` :
                  'w-4 bg-gray-200'
                }`}
                layout
              />
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="text-5xl mb-2">{currentStep.emoji}</div>
                <h2 className="text-xl font-bold text-[#0A1A2F]">{currentStep.title}</h2>
                <p className="text-[10px] text-[#0A1A2F]/30 mt-1">Step {step + 1} of {steps.length}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 min-h-[180px] flex items-center justify-center shadow-sm">
                <div className="w-full">{currentStep.content}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-2">
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  handleComplete();
                }
              }}
              className={`${step === 0 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-[#c9a227] to-[#FD9C2D] text-white font-bold shadow-sm`}
              size="sm"
            >
              {step === steps.length - 1 ? 'Complete My Morning' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
