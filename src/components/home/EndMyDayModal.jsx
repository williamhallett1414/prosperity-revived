import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, Moon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import JournalEntryModal from './JournalEntryModal';

export default function EndMyDayModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [release, setRelease] = useState('');
  const [showJournalModal, setShowJournalModal] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setGratitude(['', '', '']);
      setRelease('');
    }
  }, [isOpen]);

  const updateGratitude = (idx, val) => {
    setGratitude(prev => { const next = [...prev]; next[idx] = val; return next; });
  };

  const handleComplete = async () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('end_my_day_done', today);

    // Save gratitude + release as journal entry
    const gratitudeText = gratitude.filter(g => g.trim()).map((g, i) => `${i + 1}. ${g.trim()}`).join('\n');
    const releaseText = release.trim();
    const content = [
      gratitudeText ? `Grateful for:\n${gratitudeText}` : '',
      releaseText ? `Releasing:\n${releaseText}` : '',
    ].filter(Boolean).join('\n\n');

    if (content) {
      try {
        await base44.entities.JournalEntry.create({
          title: 'Evening Reflection',
          content,
          entry_type: 'gratitude',
        });
      } catch (e) { console.warn('Could not save reflection:', e); }
    }

    toast.success('Evening ritual complete. Rest well tonight.');
    onClose();
  };

  const steps = [
    {
      title: 'Gratitude',
      emoji: '🙏',
      color: 'from-[#0A1A2F] to-[#AFC7E3]',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#0A1A2F]/70 text-center mb-3">
            Name three things you're grateful for today — big or small.
          </p>
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-lg">{['🌟', '💛', '✨'][i]}</span>
              <input
                value={gratitude[i]}
                onChange={(e) => updateGratitude(i, e.target.value)}
                placeholder={['Something that made you smile...', 'Someone you appreciate...', 'A small win today...'][i]}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0A1A2F] focus:outline-none focus:border-[#AFC7E3] transition-colors"
              />
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Evening Reflection',
      emoji: '🌙',
      color: 'from-[#AFC7E3] to-[#FAD98D]',
      content: (
        <div className="space-y-3 text-center">
          <p className="text-sm text-[#0A1A2F]/70">
            How did you live out your values today? What would you do differently?
          </p>
          <Button
            onClick={() => setShowJournalModal(true)}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Write in Journal
          </Button>
          <p className="text-[10px] text-[#0A1A2F]/30">
            Or simply reflect in your heart and continue.
          </p>
        </div>
      )
    },
    {
      title: 'Release & Receive',
      emoji: '🕊️',
      color: 'from-[#FAD98D] to-[#c9a227]',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#0A1A2F]/70 text-center">
            Is there anything you need to let go of from today?
          </p>
          <textarea
            value={release}
            onChange={(e) => setRelease(e.target.value)}
            placeholder="I'm releasing..."
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0A1A2F] resize-none focus:outline-none focus:border-[#c9a227] transition-colors"
            rows={2}
          />
          <div className="bg-[#FAD98D]/20 rounded-xl p-3">
            <p className="font-serif italic text-[#0A1A2F] text-xs leading-relaxed text-center">
              "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning."
            </p>
            <p className="text-[10px] text-[#c9a227] font-semibold mt-1 text-center">Lamentations 3:22-23</p>
          </div>
        </div>
      )
    },
    {
      title: 'Night Blessing',
      emoji: '🌜',
      color: 'from-[#0A1A2F] to-[#3C4E53]',
      content: (
        <div className="space-y-4 text-center">
          <p className="text-[#0A1A2F] text-sm leading-relaxed">
            Lord, thank You for this day — every moment of it. I lay down my worries, my unfinished tasks, and my tomorrow.
            Watch over me as I sleep. Restore my body, renew my mind, and prepare my spirit for a new day. Amen.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-2"
          >
            <Moon className="w-8 h-8 text-[#AFC7E3] mx-auto" />
            <p className="text-xs text-[#0A1A2F]/40 mt-2">You are loved. You are forgiven. Rest now.</p>
          </motion.div>
        </div>
      )
    },
  ];

  if (!isOpen) return null;
  const currentStep = steps[Math.min(step, steps.length - 1)];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-[#F2F6FA] border-0">
          <DialogHeader>
            <DialogTitle className="text-center text-xs text-[#0A1A2F]/40 uppercase tracking-widest">
              End My Day
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Progress dots */}
            <div className="flex gap-1.5 justify-center">
              {steps.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx < step ? 'w-6 bg-[#AFC7E3]' :
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
                className={`${step === 0 ? 'w-full' : 'flex-1'} bg-gradient-to-r ${currentStep.color} text-white font-bold`}
                size="sm"
              >
                {step === steps.length - 1 ? 'Complete My Evening' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <JournalEntryModal
        isOpen={showJournalModal}
        onClose={() => setShowJournalModal(false)}
      />
    </>
  );
}
