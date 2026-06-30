import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

/**
 * Floating action bar shown when the Bible reader is opened from a challenge
 * task (URL has ?challengeId=...). Lets the user signal "done reading" and
 * jump back to the challenge to do their reflection / journal entry.
 *
 * Important design choice — this does NOT mark the challenge day complete.
 * The challenge has a multi-step completion flow (read scripture + write
 * reflection + sometimes an extra writing task) and the actual "Complete
 * Day" button on the challenge page is the one that grants XP and advances
 * progress. This bar just handles navigation: "I'm done reading, take me
 * back to where I came from." That keeps the two completion concepts from
 * fighting each other.
 *
 * Visual treatment intentionally mirrors PlanReadingBar so the two surfaces
 * feel like siblings.
 */
export default function ChallengeReadingBar({ challengeId, challengeDay }) {
  const navigate = useNavigate();

  // Route back to the Community page where CuratedPrograms is mounted, with
  // the challenge identified so the page can re-open the right challenge.
  // CuratedPrograms reads ?challenge= to deep-link a specific challenge open.
  const handleDone = () => {
    navigate(createPageUrl(`Community?challenge=${challengeId}`));
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-[60] px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 bg-white dark:bg-[#0A1A2F] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] border-t border-[#FAD98D]/30 dark:border-white/10"
    >
      <div className="max-w-lg mx-auto flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-1.5 px-3 h-12 rounded-xl bg-[#0A1A2F]/8 dark:bg-white/10 text-[#0A1A2F] dark:text-white font-semibold text-sm flex-shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleDone}
          className="flex items-center justify-center gap-2 flex-1 h-12 rounded-xl font-bold text-sm bg-gradient-to-r from-[#c9a227] to-[#FAD98D] text-[#0A1A2F] transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          {challengeDay ? `Done — Back to Day ${challengeDay}` : 'Done — Back to Challenge'}
        </button>
      </div>
    </motion.div>
  );
}
