import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TakeTimeWithGod({ onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Take a Deep Breath',
      subtitle: 'Breathe in... Hold... Breathe out...',
      content: (
        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl mb-6"
          >
            🌬️
          </motion.div>
          <p className="text-gray-600 text-lg">
            Breathe deeply and slowly. Let peace wash over you.
          </p>
        </div>
      )
    },
    {
      title: 'A Word From Scripture',
      subtitle: 'God speaks to your heart',
      content: (
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-gray-800 font-serif italic text-xl mb-4">
            "Come to me, all who are weary and burdened, and I will give you rest."
          </p>
          <p className="text-[#c9a227] font-semibold">Matthew 11:28</p>
        </div>
      )
    },
    {
      title: 'A Moment of Prayer',
      subtitle: 'Talk to God',
      content: (
        <div className="text-center">
          <div className="text-6xl mb-4">🙏</div>
          <p className="text-gray-800 font-serif text-lg leading-relaxed">
            Lord, thank You for this sacred pause.
            <br />
            Fill me with Your presence.
            <br />
            Renew my spirit and guide my steps.
            <br />
            <br />
            <span className="font-bold">Amen.</span>
          </p>
        </div>
      )
    },
    {
      title: 'You Are Loved',
      subtitle: 'Remember who you are in Christ',
      content: (
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-gray-800 text-lg leading-relaxed mb-4">
            You are <span className="font-bold text-[#c9a227]">chosen</span>.
            <br />
            You are <span className="font-bold text-[#c9a227]">loved</span>.
            <br />
            You are <span className="font-bold text-[#c9a227]">strengthened</span> by Him.
          </p>
          <p className="text-gray-600 text-sm italic">
            Go forth in peace and confidence.
          </p>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (step < steps.length - 1) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2 text-center">
              {steps[step].title}
            </h2>
            <p className="text-gray-500 text-sm mb-6 text-center">
              {steps[step].subtitle}
            </p>
            <div className="mb-8">
              {steps[step].content}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-[#c9a227]' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {step === steps.length - 1 && (
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#c9a227] to-[#d4af37] hover:from-[#d4af37] hover:to-[#e5c158] text-white"
          >
            Complete
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}