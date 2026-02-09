import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Volume2, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const MEDITATION_SCRIPTS = {
  breathing: {
    title: "Breathing Meditation",
    instructions: [
      "Find a comfortable position, whether sitting or lying down.",
      "Close your eyes gently.",
      "Take a deep breath in through your nose for a count of 4.",
      "Hold this breath for a count of 4.",
      "Exhale slowly through your mouth for a count of 4.",
      "Pause for a count of 4 before the next breath.",
      "Continue this pattern, allowing your mind to focus only on your breath.",
      "If your mind wanders, gently bring your attention back to your breathing.",
      "Continue for the remainder of this session."
    ]
  },
  body_scan: {
    title: "Body Scan Meditation",
    instructions: [
      "Lie down on your back in a comfortable position.",
      "Close your eyes and take three deep, cleansing breaths.",
      "Begin at the top of your head and slowly scan down your body.",
      "Notice any tension, warmth, or sensations without judgment.",
      "As you scan, consciously relax each muscle group.",
      "Move from your head to your forehead, releasing any tension.",
      "Continue down through your face, jaw, and neck.",
      "Scan your shoulders, arms, and down to your fingertips.",
      "Move through your chest, abdomen, back, hips, and legs.",
      "Finally, bring awareness to your feet and toes.",
      "Take a moment to notice how your whole body feels now, relaxed and at peace."
    ]
  },
  loving_kindness: {
    title: "Loving Kindness Meditation",
    instructions: [
      "Sit comfortably and close your eyes.",
      "Take three deep breaths, allowing your body to relax.",
      "Bring to mind someone you love deeply, perhaps a family member or close friend.",
      "Silently repeat: 'May you be happy. May you be healthy. May you be safe. May you live with ease.'",
      "Feel the warmth and compassion flowing from your heart to this person.",
      "Now bring yourself to mind and repeat the same phrases for yourself.",
      "Extend this loving kindness to a neutral person, someone you neither love nor dislike.",
      "Then extend it to someone you find challenging, with compassion rather than judgment.",
      "Finally, expand this loving kindness to all beings everywhere.",
      "Hold this feeling of universal love and compassion as your meditation concludes."
    ]
  },
  mindfulness: {
    title: "Mindfulness Meditation",
    instructions: [
      "Sit in a comfortable position with your back supported.",
      "Close your eyes or maintain a soft downward gaze.",
      "Bring your attention to the present moment.",
      "Notice five things you can see without moving your head.",
      "Notice four things you can physically feel.",
      "Notice three things you can hear.",
      "Notice two things you can smell.",
      "Notice one thing you can taste.",
      "Return your focus to your breath and the present moment.",
      "Allow thoughts to pass like clouds in the sky without judgment.",
      "Rest in this peaceful, present awareness."
    ]
  },
  sleep: {
    title: "Sleep Preparation Meditation",
    instructions: [
      "Lie down in bed and get comfortable under your covers.",
      "Close your eyes and take a deep, slow breath.",
      "Release any tension from your day with each exhale.",
      "Visualize a peaceful place where you feel completely safe and relaxed.",
      "This might be a beach, forest, mountain, or any place that brings you peace.",
      "Imagine the sights, sounds, and sensations of this peaceful place.",
      "Feel your body becoming heavier with each breath, sinking into the bed.",
      "Your muscles are becoming loose and relaxed.",
      "Your mind is becoming calm and quiet.",
      "As you drift toward sleep, know that rest is a gift you deserve."
    ]
  },
  stress_relief: {
    title: "Stress Relief Meditation",
    instructions: [
      "Sit comfortably and place one hand on your heart.",
      "Take a slow breath in through your nose for 4 counts.",
      "Hold for 4 counts, then exhale through your mouth for 6 counts.",
      "This longer exhale activates your relaxation response.",
      "With each exhale, imagine releasing stress and tension from your body.",
      "Visualize stress as dark smoke leaving your body with each breath.",
      "See it replaced with calm, peaceful light.",
      "Continue this rhythmic breathing, allowing your nervous system to calm.",
      "Feel your shoulders relax, your jaw unclench, your breath deepen.",
      "You are safe, you are calm, and everything is going to be okay."
    ]
  }
};

const AMBIENT_SOUNDS = {
  breathing: "https://assets.mixkit.co/active_storage/sfx/2445/2445-preview.mp3",
  body_scan: "https://assets.mixkit.co/active_storage/sfx/2444/2444-preview.mp3",
  loving_kindness: "https://assets.mixkit.co/active_storage/sfx/2443/2443-preview.mp3",
  mindfulness: "https://assets.mixkit.co/active_storage/sfx/2441/2441-preview.mp3",
  sleep: "https://assets.mixkit.co/active_storage/sfx/2442/2442-preview.mp3",
  stress_relief: "https://assets.mixkit.co/active_storage/sfx/2440/2440-preview.mp3"
};

export default function GuidedMeditationSession({ session, user, onComplete, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [moodAfter, setMoodAfter] = useState(null);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const audioRef = useRef(null);
  const voiceAudioRef = useRef(null);
  const instructionTimerRef = useRef(null);

  const script = MEDITATION_SCRIPTS[session?.type] || MEDITATION_SCRIPTS.mindfulness;
  const instructions = script?.instructions || [
    'Begin your meditation session.',
    'Focus on your breath and let your mind settle.',
    'Continue with your practice.',
    'You are doing great. Keep going.',
    'As we near the end, notice how you feel.',
    'Take a final deep breath.',
    'Begin to gently open your eyes.'
  ];
  const totalInstructions = instructions.length;
  const secondsPerInstruction = ((session?.duration || 5) * 60) / totalInstructions;

  // Generate AI voice for current instruction
  useEffect(() => {
    const generateVoiceInstruction = async () => {
      if (isPlaying && currentInstructionIndex < totalInstructions && instructions[currentInstructionIndex]) {
        setIsGeneratingVoice(true);
        try {
          const instructionText = String(instructions[currentInstructionIndex] || '');
          if (!instructionText) return;
          
          // Use browser's speech synthesis
          const utterance = new SpeechSynthesisUtterance(instructionText);
          utterance.rate = 0.8; // Slower, calming pace
          utterance.pitch = 1.0;
          utterance.volume = 0.7;
          
          // Try to use a calming voice
          const voices = window.speechSynthesis.getVoices();
          const calmVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha')) || voices[0];
          if (calmVoice) utterance.voice = calmVoice;
          
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Voice generation failed:', error);
        } finally {
          setIsGeneratingVoice(false);
        }
      }
    };

    generateVoiceInstruction();
  }, [currentInstructionIndex, isPlaying, instructions, totalInstructions]);

  // Start meditation session
  useEffect(() => {
    if (isPlaying && currentInstructionIndex < totalInstructions) {
      instructionTimerRef.current = setTimeout(() => {
        if (currentInstructionIndex < totalInstructions - 1) {
          setCurrentInstructionIndex(prev => prev + 1);
        }
      }, secondsPerInstruction * 1000);
    }
    return () => {
      if (instructionTimerRef.current) clearTimeout(instructionTimerRef.current);
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, currentInstructionIndex, totalInstructions, secondsPerInstruction]);

  // Track elapsed time
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const newTime = prev + 1;
          if (newTime >= (session?.duration || 5) * 60) {
            setIsPlaying(false);
            handleSessionComplete();
            return prev;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, session.duration]);

  const handleSessionComplete = async () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        window.speechSynthesis.cancel(); // Stop voice when pausing
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleFinish = async (mood) => {
    setIsPlaying(false);
    window.speechSynthesis.cancel(); // Stop any voice
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Save meditation session
    try {
      const today = new Date().toISOString().split('T')[0];
      await base44.entities.MeditationSession.create({
        date: today,
        duration_minutes: session.duration,
        meditation_type: session.type,
        mood_before: 'calm', // You might want to pass this
        mood_after: mood,
        guided_session_id: String(session.id)
      });

      toast.success('Session saved! Great work!');
      onComplete?.();
      onClose?.();
    } catch (error) {
      toast.error('Failed to save session');
    }
  };

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const progress = (elapsedSeconds / (session.duration * 60)) * 100;

  if (moodAfter) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white dark:bg-[#2d2d4a] rounded-3xl p-8 max-w-sm w-full">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            How do you feel?
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['stressed', 'anxious', 'calm', 'energetic', 'sad', 'neutral'].map(mood => (
              <button
                key={mood}
                onClick={() => handleFinish(mood)}
                className={`p-3 rounded-xl font-semibold capitalize transition-all ${
                  moodAfter === mood
                    ? 'bg-purple-500 text-white scale-105'
                    : 'bg-gray-100 dark:bg-[#1a1a2e] text-gray-700 dark:text-gray-300 hover:bg-purple-100'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Skip
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black flex flex-col items-center justify-center z-50 p-4"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center z-50 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Session info */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-2">{session.title}</h2>
        <p className="text-white/70">{session.duration} minute session</p>
      </div>

      {/* Timer and progress */}
      <div className="mb-12 text-center">
        <div className="text-6xl font-bold text-white mb-4 font-mono">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Current instruction */}
      <motion.div
        key={currentInstructionIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-xl mx-auto mb-12 text-center"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          {isGeneratingVoice && (
            <div className="mb-3 flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-purple-300 text-sm">Speaking...</span>
            </div>
          )}
          <p className="text-white text-lg leading-relaxed mb-3">
            {instructions[currentInstructionIndex]}
          </p>
          <p className="text-white/50 text-sm">
            Step {currentInstructionIndex + 1} of {totalInstructions}
          </p>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-4 mb-12">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentInstructionIndex(Math.max(0, currentInstructionIndex - 1))}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlayPause}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-shadow"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </motion.button>

        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
          <Volume2 className="w-5 h-5" />
        </div>
      </div>

      {/* Finish button */}
      <Button
        onClick={() => setMoodAfter('calm')}
        className="bg-white text-purple-900 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl"
      >
        Finish Session
      </Button>

      {/* Hidden audio element for ambient sounds */}
      {session?.type && AMBIENT_SOUNDS[session.type] && (
        <audio
          ref={audioRef}
          src={AMBIENT_SOUNDS[session.type]}
          loop
          style={{ display: 'none' }}
        />
      )}
    </motion.div>
  );
}