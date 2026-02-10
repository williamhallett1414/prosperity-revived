import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function EndMyDayModal({ isOpen, onClose, meditations = [] }) {
  const [step, setStep] = useState(0);
  const [reflection, setReflection] = useState('');
  const [gratitude, setGratitude] = useState('');
  const queryClient = useQueryClient();

  const sleepMeditation = meditations.find(m => m.category === 'sleep') || meditations[0];

  const saveJournal = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.JournalEntry.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journalEntries']);
      toast.success('Journal saved!');
    }
  });

  const steps = [
    {
      title: 'Evening Reflection',
      emoji: '🌅',
      content: (
        <div className="space-y-4">
          <div className="bg-[#E6EBEF] rounded-2xl p-6">
            <label className="text-sm font-semibold text-[#0A1A2F] mb-3 block">
              How was your day?
            </label>
            <Textarea
              placeholder="Reflect on what went well, what you learned, and how you felt..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-[120px] bg-white border-[#E6EBEF]"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Gratitude',
      emoji: '🙏',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#D9B878] to-[#AFC7E3] rounded-2xl p-6">
            <label className="text-sm font-semibold text-[#0A1A2F] mb-3 block">
              What are you grateful for today?
            </label>
            <Textarea
              placeholder="Name 3 things you're thankful for..."
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              className="min-h-[120px] bg-white border-[#E6EBEF]"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Journaling Prompt',
      emoji: '📝',
      content: (
        <div className="space-y-4">
          <div className="bg-[#E6EBEF] rounded-2xl p-6">
            <p className="text-[#0A1A2F] font-semibold mb-4">
              Prompt: Where did you see God's hand in your day?
            </p>
            <Textarea
              placeholder="Write your response..."
              className="min-h-[120px] bg-white border-[#E6EBEF]"
            />
          </div>
          <Button
            onClick={() => {
              if (reflection || gratitude) {
                saveJournal.mutate({
                  title: 'Evening Reflection',
                  content: `Reflection: ${reflection}\n\nGratitude: ${gratitude}`,
                  entry_type: 'reflection',
                  mood: 'peaceful'
                });
              }
            }}
            className="w-full bg-gradient-to-r from-[#D9B878] to-[#AFC7E3] text-[#0A1A2F]"
            disabled={!reflection && !gratitude}
          >
            Save Journal Entry
          </Button>
        </div>
      )
    },
    {
      title: 'Sleep Meditation',
      emoji: '🌙',
      content: (
        <div className="space-y-4">
          {sleepMeditation ? (
            <div className="bg-gradient-to-br from-[#0A1A2F] to-[#AFC7E3] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">{sleepMeditation.title}</h3>
              <p className="text-sm text-white/80 mb-4">{sleepMeditation.description || 'Peaceful sleep meditation'}</p>
              <Button 
                onClick={() => window.location.href = `/DiscoverMeditations`}
                className="w-full bg-white hover:bg-white/90 text-[#0A1A2F]"
              >
                Start Sleep Meditation
              </Button>
            </div>
          ) : (
            <div className="bg-[#E6EBEF] rounded-2xl p-6 text-center">
              <p className="text-[#0A1A2F]/70 mb-4">Rest well tonight</p>
              <Button 
                onClick={() => window.location.href = `/DiscoverMeditations`}
                className="bg-gradient-to-r from-[#AFC7E3] to-[#D9B878] text-[#0A1A2F]"
              >
                Browse Sleep Meditations
              </Button>
            </div>
          )}
          <div className="bg-[#E6EBEF] rounded-2xl p-4">
            <p className="text-sm text-[#0A1A2F]/70 text-center">
              "In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety." - Psalm 4:8
            </p>
          </div>
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
        <div className="sticky top-0 bg-gradient-to-r from-[#0A1A2F] to-[#AFC7E3] p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">End My Day With God</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Step {step + 1} of {steps.length}</span>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-6 rounded-full transition-all ${
                    i <= step ? 'bg-white' : 'bg-white/20'
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
              className="flex-1 bg-gradient-to-r from-[#0A1A2F] to-[#AFC7E3] hover:from-[#0A1A2F]/90 hover:to-[#AFC7E3]/90 text-white"
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