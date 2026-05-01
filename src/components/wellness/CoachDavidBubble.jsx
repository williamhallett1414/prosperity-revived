/**
 * CoachDavidBubble — Motivational popup during live workouts
 * 
 * Shows Coach David's talking video in a circular bubble with
 * a motivational message. Pops up at key workout moments:
 * - Start of workout
 * - Halfway through exercises
 * - Last exercise
 * - After a rest period
 * - When resuming from pause
 * 
 * Uses Cloud TTS to speak the message, auto-dismisses after.
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import coachDavidTalking from '@/assets/coach-david-talking.mp4';

// Motivational messages by trigger type
const MESSAGES = {
  start: [
    "Let's go! Time to show up for yourself today!",
    "You showed up — that's half the battle. Now let's finish strong!",
    "This is YOUR time. Let's make every rep count!",
    "Champions don't skip workouts. Let's get it!",
    "God gave you this body — let's honor it today!",
  ],
  halfway: [
    "Halfway there! Don't stop now — push through!",
    "You're stronger than you think. Keep going!",
    "This is where champions are made. Stay with it!",
    "Feel that burn? That's growth happening. Keep pushing!",
    "You didn't come this far to only come this far!",
  ],
  lastExercise: [
    "Last one! Give me everything you've got!",
    "Final exercise — leave it all on the floor!",
    "Almost done! Finish stronger than you started!",
    "One more to go — make it your BEST one!",
    "The last rep is where the magic happens. Let's GO!",
  ],
  afterRest: [
    "Rest is over — time to get back to work!",
    "Recharged? Good. Let's attack this next set!",
    "Back at it! You're building something great!",
    "Shake it off and let's GO!",
  ],
  resume: [
    "Welcome back! Let's finish what we started!",
    "Glad you came back. Now let's CRUSH this!",
    "No quitting — let's get this done!",
  ],
  complete: [
    "YOU DID IT! That's what I'm talking about!",
    "Workout COMPLETE! You showed up and showed out!",
    "Amazing work! God is proud of you today!",
    "Champion! You finished every single rep!",
  ],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function CoachDavidBubble({ trigger, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const primedRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastTriggerRef = useRef(null);

  // Prime an audio element on mount (inherits user gesture from workout start tap)
  useEffect(() => {
    try {
      const a = new Audio();
      a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
      a.load();
      const p = a.play();
      if (p?.then) p.then(() => { try { a.pause(); } catch {} }).catch(() => {});
      primedRef.current = a;
    } catch {}
  }, []);

  useEffect(() => {
    if (!trigger || trigger === lastTriggerRef.current) return;
    lastTriggerRef.current = trigger;

    const messages = MESSAGES[trigger];
    if (!messages) return;

    const msg = pickRandom(messages);
    setMessage(msg);
    setVisible(true);
    setSpeaking(true);

    // Play Coach David's talking video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    // Speak via Cloud TTS — reuse primed audio element for iOS compatibility
    (async () => {
      try {
        const result = await base44.functions.invoke('coachDavidTTS', { text: msg });
        const audioContent = result?.audioContent ?? result?.data?.audioContent;
        if (audioContent) {
          const binary = atob(audioContent);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          const blob = new Blob([bytes], { type: 'audio/mpeg' });
          const url = URL.createObjectURL(blob);

          // Reuse the primed audio element (iOS won't play a new Audio() without gesture)
          const audio = primedRef.current || new Audio();
          audio.src = url;
          audioRef.current = audio;
          audio.onended = () => {
            URL.revokeObjectURL(url);
            setSpeaking(false);
            timeoutRef.current = setTimeout(() => {
              setVisible(false);
              onDismiss?.();
            }, 1500);
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            setSpeaking(false);
            timeoutRef.current = setTimeout(() => {
              setVisible(false);
              onDismiss?.();
            }, 3000);
          };
          await audio.play();
        } else {
          // No audio — just show message for 4s
          timeoutRef.current = setTimeout(() => {
            setSpeaking(false);
            setVisible(false);
            onDismiss?.();
          }, 4000);
        }
      } catch {
        // TTS failed — show message for 4s
        timeoutRef.current = setTimeout(() => {
          setSpeaking(false);
          setVisible(false);
          onDismiss?.();
        }, 4000);
      }
    })();

    return () => {
      clearTimeout(timeoutRef.current);
      if (audioRef.current) { try { audioRef.current.pause(); } catch {} }
    };
  }, [trigger]);

  // Pause video when not speaking
  useEffect(() => {
    if (!videoRef.current) return;
    if (speaking) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [speaking]);

  const handleDismiss = () => {
    clearTimeout(timeoutRef.current);
    if (audioRef.current) { try { audioRef.current.pause(); } catch {} }
    setSpeaking(false);
    setVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 40 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed z-50 flex items-end gap-3"
          style={{ bottom: 140, left: 16, right: 16 }}
        >
          {/* Avatar bubble */}
          <div className="relative flex-shrink-0">
            <motion.div
              animate={speaking ? { boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 12px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0.4)'] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#3B82F6] shadow-lg"
            >
              <video
                ref={videoRef}
                src={coachDavidTalking}
                muted
                playsInline
                loop
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
            {/* Speaking indicator */}
            {speaking && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-black flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </motion.div>
            )}
          </div>

          {/* Message bubble */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 bg-gradient-to-r from-[#1E3A5F] to-[#1E40AF] rounded-2xl rounded-bl-sm px-4 py-3 shadow-xl relative"
          >
            <button
              onClick={handleDismiss}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white/50" />
            </button>
            <p className="text-white text-sm font-semibold leading-relaxed pr-5">
              {message}
            </p>
            <p className="text-white/30 text-[10px] mt-1 font-medium">Coach David</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
