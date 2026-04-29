import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { ThumbsUp, Star } from 'lucide-react';

const FEEDBACK_OPTIONS = [
  { value: 'helpful', label: '✅ Helpful' },
  { value: 'perfect', label: '🌟 Perfect' },
  { value: 'needs_more_depth', label: '🔍 Needs more depth' },
  { value: 'too_generic', label: '🎯 Too generic' },
  { value: 'not_relevant', label: '❌ Not relevant' },
];

export default function HannahFeedbackRating({ messageContent, userEmail, sessionId, onDone }) {
  const [step, setStep] = useState('rating'); // 'rating' | 'type' | 'done'
  const [rating, setRating] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);

  const submitFeedback = async (type) => {
    setFeedbackType(type);
    try {
      await base44.entities.HannahFeedback.create({
        user_email: userEmail,
        message_content: messageContent?.substring(0, 500),
        rating,
        feedback_type: type,
        conversation_session_id: sessionId,
        was_exercise_suggestion: messageContent?.toLowerCase().includes('exercise') || messageContent?.toLowerCase().includes('try this'),
      });
    } catch (e) {
      // silent
    }
    setStep('done');
    setTimeout(() => onDone?.(), 1500);
  };

  const handleRating = (r) => {
    setRating(r);
    if (r >= 4) {
      // Positive — just quick-submit as helpful
      submitFeedback('helpful');
    } else {
      setStep('type');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-2 ml-1"
      >
        {step === 'rating' && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40 mr-1">Rate this:</span>
            {[1, 2, 3, 4, 5].map(r => (
              <button
                key={r}
                onClick={() => handleRating(r)}
                className="w-5 h-5 flex items-center justify-center hover:scale-125 transition-transform"
              >
                <Star
                  className={`w-4 h-4 ${rating >= r ? 'fill-[#FD9C2D] text-[#FD9C2D]' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
        )}

        {step === 'type' && (
          <div className="space-y-1 mt-1">
            <p className="text-[10px] text-[#0A1A2F]/50 dark:text-white/50 mb-1">What could be better?</p>
            <div className="flex flex-wrap gap-1.5">
              {FEEDBACK_OPTIONS.filter(f => f.value !== 'helpful' && f.value !== 'perfect').map(opt => (
                <button
                  key={opt.value}
                  onClick={() => submitFeedback(opt.value)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-[#AFC7E3]/20 text-[#3C4E53] hover:bg-[#AFC7E3]/40 transition-colors border border-[#AFC7E3]/30"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'done' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-[#AFC7E3] flex items-center gap-1"
          >
            <ThumbsUp className="w-3 h-3" /> Thanks for the feedback!
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}