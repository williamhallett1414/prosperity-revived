import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, Play } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function EndMyDayModal({ isOpen, onClose, meditations = [] }) {
  const [step, setStep] = useState(0);
  const [reflection, setReflection] = useState('');
  const [gratitude, setGratitude] = useState('');
  const queryClient = useQueryClient();
  const sleepMeditation = meditations.find(m => m.category === 'sleep');

  const saveJournal = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create(data),
    onSuccess: () => {
      toast.success('Saved to journal!');
      queryClient.invalidateQueries(['journalEntries']);
    }
  });

  const steps = [
    {
      title: 'Evening Reflection',
      emoji: '🌙',
      color: 'from-[#0A1A2F] to-[#AFC7E3]',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#0A1A2F]/70">What was the highlight of your day?</p>
          <Textarea
            placeholder="Write your thoughts..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[120px] bg-[#E6EBEF] border-[#E6EBEF]"
          />
        </div>
      )
    },
    {
      title: 'Gratitude',
      emoji: '💝',
      color: 'from-[#D9B878] to-[#AFC7E3]',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-[#0A1A2F]/70">Name 3 things you're grateful for:</p>
          <Textarea
            placeholder="1. \n2. \n3. "
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            className="min-h-[120px] bg-[#E6EBEF] border-[#E6EBEF]"
          />
        </div>
      )
    },
    {
      title: 'Journaling Prompt',
      emoji: '📝',
      color: 'from-[#AFC7E3] to-[#D9B878]',
      content: (
        <div className="space-y-3 text-center">
          <p className="text-[#0A1A2F] font-semibold">
            How did you live out your values today?
          </p>
          <p className="text-xs text-[#0A1A2F]/60">
            Take a moment to reflect on your actions and intentions.
          </p>
        </div>
      )
    },
    ...(sleepMeditation ? [{
      title: 'Sleep Meditation',
      emoji: '😴',
      color: 'from-[#0A1A2F] to-[#D9B878]',
      content: (
        <div className="space-y-3 text-center">
          <p className="text-[#0A1A2F]/70 text-sm mb-4">
            {sleepMeditation.description}
          </p>
          <Button
            onClick={() => window.location.href = `/meditation-player?id=${sleepMeditation.id}`}
            disabled={!sleepMeditation.tts_audio_url}
            className="w-full bg-white hover:bg-white/90 text-[#0A1A2F]"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Play Sleep Meditation
          </Button>
        </div>
      )
    }] : [])
  ];

  const currentStep = steps[step];

  const handleComplete = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      if (reflection || gratitude) {
        await saveJournal.mutateAsync({
          title: 'Evening Reflection',
          content: `Reflection: ${reflection}\n\nGratitude: ${gratitude}`,
          entry_type: 'reflection',
          mood: 'peaceful'
        });
      }
      onClose();
      setReflection('');
      setGratitude('');
      setStep(0);
    }
  };

  return (
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
              onClick={handleComplete}
              className="flex-1 bg-gradient-to-r from-[#0A1A2F] to-[#AFC7E3] hover:from-[#0A1A2F]/90 hover:to-[#AFC7E3]/90 text-white"
              size="sm"
              disabled={saveJournal.isPending}
            >
              {step === steps.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}