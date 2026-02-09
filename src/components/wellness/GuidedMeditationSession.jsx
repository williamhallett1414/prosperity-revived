import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Volume2, SkipBack, SkipForward, FastForward, Rewind, Upload, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  },
  mindfuleating: {
    title: "Mindful Eating Meditation",
    instructions: [
      "Sit with your food in front of you, pausing before you begin.",
      "Take three deep breaths and express gratitude for this nourishment.",
      "Look at your food carefully. Notice its colors, shapes, and textures.",
      "Bring your attention to the aroma. What scents do you notice?",
      "Pick up a small portion. Feel its weight and texture in your hand.",
      "Place it in your mouth, but don't chew yet. Notice the immediate taste.",
      "Now, chew slowly and deliberately. Notice how the flavors change and develop.",
      "Pay attention to the texture as you chew. How does it transform?",
      "Swallow mindfully, feeling the food travel down your throat.",
      "Pause between bites. Notice your body's hunger and fullness cues.",
      "Continue eating slowly, savoring each bite with full awareness.",
      "When finished, take a moment to appreciate the nourishment you've received."
    ]
  },
  sleepstory: {
    title: "Sleep Story Journey",
    instructions: [
      "Lie down comfortably and gently close your eyes.",
      "Take a deep breath in, and slowly release. Let your body sink into the bed.",
      "Imagine yourself walking on a peaceful forest path at twilight.",
      "The air is cool and fresh. You hear gentle rustling of leaves.",
      "Soft golden light filters through the trees, creating dancing shadows.",
      "You come upon a clearing with a small, serene pond.",
      "The water is perfectly still, reflecting the deepening sky.",
      "You sit on a smooth rock by the water's edge, feeling completely safe.",
      "Stars begin to appear, one by one, in the darkening sky.",
      "A gentle breeze carries the scent of pine and earth.",
      "You feel completely safe, peaceful, and ready for rest.",
      "Your breathing slows naturally. Your body grows heavier.",
      "Let yourself drift into peaceful, restful sleep."
    ]
  },
  focus: {
    title: "Focus Enhancement",
    instructions: [
      "Sit upright and alert with your spine straight.",
      "Take three energizing breaths. Breathe in clarity, breathe out distraction.",
      "Set your intention. What do you want to focus on today?",
      "Visualize your mind as a calm, clear lake. Still and reflective.",
      "Notice any distractions like ripples on the water. Let them settle.",
      "Bring your attention to a single point. Perhaps your breath or a mantra.",
      "When your mind wanders, and it will, gently guide it back without judgment.",
      "Feel your mental clarity sharpening, like bringing a camera into focus.",
      "Imagine a beam of light illuminating only your chosen task.",
      "Everything else fades into soft background. Only your focus remains.",
      "Take three more breaths, feeling energized and clear.",
      "When ready, open your eyes and bring this focused awareness to your work."
    ]
  },
  energizing: {
    title: "Energy Activation",
    instructions: [
      "Sit tall or stand with your spine straight and shoulders back.",
      "Take a sharp breath in through your nose. Exhale forcefully through your mouth.",
      "Do this three times, feeling energy awakening in your body.",
      "Visualize golden, energizing light entering through the top of your head.",
      "This light flows down through your body, revitalizing every cell.",
      "Imagine this energy pooling in your core, creating a warm, powerful center.",
      "With each inhale, draw in fresh vitality and clarity.",
      "With each exhale, release sluggishness and fatigue.",
      "Feel your mind becoming sharp, alert, and ready.",
      "Your body feels light, energized, prepared for action.",
      "Take three more powerful breaths, filling yourself with vibrant energy.",
      "Open your eyes feeling refreshed, alert, and ready to embrace your day."
    ]
  },
  gratitude: {
    title: "Gratitude Practice",
    instructions: [
      "Sit comfortably with your hands resting on your heart.",
      "Take three deep breaths, settling into this moment of reflection.",
      "Think of one thing you're grateful for today. It can be simple or profound.",
      "Visualize this blessing in your mind. Let yourself truly feel the gratitude.",
      "Notice where you feel gratitude in your body. Perhaps warmth in your chest.",
      "Now, think of a person you're grateful for. Picture their face.",
      "Send them silent thanks. Feel appreciation flowing from your heart.",
      "Think of a challenge that taught you something valuable. Find gratitude for the lesson.",
      "Bring to mind three small things: a kind word, warm sunshine, a comfortable bed.",
      "Feel your heart expanding with appreciation for life's abundance.",
      "Place your hand on your heart and whisper thank you.",
      "Carry this gratitude with you as you gently open your eyes."
    ]
  }
};

const AMBIENT_SOUNDS = {
  breathing: "https://assets.mixkit.co/active_storage/sfx/2445/2445-preview.mp3",
  body_scan: "https://assets.mixkit.co/active_storage/sfx/2444/2444-preview.mp3",
  loving_kindness: "https://assets.mixkit.co/active_storage/sfx/2443/2443-preview.mp3",
  mindfulness: "https://assets.mixkit.co/active_storage/sfx/2441/2441-preview.mp3",
  sleep: "https://assets.mixkit.co/active_storage/sfx/2442/2442-preview.mp3",
  stress_relief: "https://assets.mixkit.co/active_storage/sfx/2440/2440-preview.mp3",
  mindfuleating: "https://assets.mixkit.co/active_storage/sfx/2443/2443-preview.mp3",
  sleepstory: "https://assets.mixkit.co/active_storage/sfx/2442/2442-preview.mp3",
  focus: "https://assets.mixkit.co/active_storage/sfx/2441/2441-preview.mp3",
  energizing: "https://assets.mixkit.co/active_storage/sfx/2445/2445-preview.mp3",
  gratitude: "https://assets.mixkit.co/active_storage/sfx/2443/2443-preview.mp3"
};

// Ambient sound options users can select
export const AMBIENT_SOUND_OPTIONS = [
  { id: 'default', name: 'Session Default', url: null },
  { id: 'rain', name: 'Gentle Rain', url: 'https://assets.mixkit.co/active_storage/sfx/2444/2444-preview.mp3' },
  { id: 'ocean', name: 'Ocean Waves', url: 'https://assets.mixkit.co/active_storage/sfx/2441/2441-preview.mp3' },
  { id: 'forest', name: 'Forest Ambience', url: 'https://assets.mixkit.co/active_storage/sfx/2440/2440-preview.mp3' },
  { id: 'wind', name: 'Gentle Wind', url: 'https://assets.mixkit.co/active_storage/sfx/2445/2445-preview.mp3' },
  { id: 'piano', name: 'Peaceful Piano', url: 'https://assets.mixkit.co/active_storage/sfx/2443/2443-preview.mp3' },
  { id: 'birds', name: 'Birds Chirping', url: 'https://assets.mixkit.co/active_storage/sfx/2442/2442-preview.mp3' },
  { id: 'stream', name: 'Flowing Stream', url: 'https://assets.mixkit.co/active_storage/sfx/2441/2441-preview.mp3' },
  { id: 'thunder', name: 'Distant Thunder', url: 'https://assets.mixkit.co/active_storage/sfx/2444/2444-preview.mp3' },
  { id: 'fireplace', name: 'Crackling Fire', url: 'https://assets.mixkit.co/active_storage/sfx/2440/2440-preview.mp3' },
  { id: 'none', name: 'No Sound', url: 'silent' }
];

export default function GuidedMeditationSession({ session, user, onComplete, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [moodAfter, setMoodAfter] = useState(null);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [selectedAmbientSound, setSelectedAmbientSound] = useState('default');
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [backgroundVolume, setBackgroundVolume] = useState(0.25);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [customSoundUrl, setCustomSoundUrl] = useState(null);
  const [uploadingSound, setUploadingSound] = useState(false);
  const audioRef = useRef(null);
  const voiceAudioRef = useRef(null);
  const instructionTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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
    if (!voicesLoaded || !isPlaying || currentInstructionIndex >= totalInstructions) {
      return;
    }

    const instructionText = instructions[currentInstructionIndex];
    if (!instructionText || typeof instructionText !== 'string') return;

    setIsGeneratingVoice(true);
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Small delay to ensure clean speech
    const timer = setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(instructionText);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = voiceVolume;
        
        const voices = window.speechSynthesis.getVoices();
        const calmVoice = voices.find(v => 
          v.lang && v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha'))
        ) || voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
        
        if (calmVoice) utterance.voice = calmVoice;
        
        utterance.onstart = () => setIsGeneratingVoice(true);
        utterance.onend = () => setIsGeneratingVoice(false);
        utterance.onerror = (e) => {
          console.error('Voice error:', e);
          setIsGeneratingVoice(false);
        };
        
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Voice generation failed:', error);
        setIsGeneratingVoice(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentInstructionIndex, isPlaying, instructions, totalInstructions, voicesLoaded, voiceVolume]);

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
  }, [isPlaying, session?.duration]);

  // Start ambient sound when playing
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying && selectedAmbientSound !== 'none') {
      let soundUrl;
      if (selectedAmbientSound === 'custom' && customSoundUrl) {
        soundUrl = customSoundUrl;
      } else if (selectedAmbientSound === 'default') {
        soundUrl = AMBIENT_SOUNDS[session?.type];
      } else {
        soundUrl = AMBIENT_SOUND_OPTIONS.find(s => s.id === selectedAmbientSound)?.url;
      }
      
      if (soundUrl && soundUrl !== 'silent') {
        audioRef.current.src = soundUrl;
        audioRef.current.volume = backgroundVolume;
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, selectedAmbientSound, session?.type, customSoundUrl, backgroundVolume]);

  // Update background volume dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = backgroundVolume;
    }
  }, [backgroundVolume]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }

    setUploadingSound(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setCustomSoundUrl(file_url);
      setSelectedAmbientSound('custom');
      toast.success('Custom sound uploaded!');
    } catch (error) {
      toast.error('Failed to upload sound');
    } finally {
      setUploadingSound(false);
    }
  };

  const handleSessionComplete = async () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        window.speechSynthesis.cancel();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const skipForward = () => {
    setElapsedSeconds(prev => Math.min(prev + 15, (session?.duration || 5) * 60));
    // Skip to next instruction if needed
    const newIndex = Math.min(currentInstructionIndex + 1, totalInstructions - 1);
    setCurrentInstructionIndex(newIndex);
    window.speechSynthesis.cancel();
  };

  const skipBackward = () => {
    setElapsedSeconds(prev => Math.max(prev - 15, 0));
    // Go back to previous instruction if needed
    const newIndex = Math.max(currentInstructionIndex - 1, 0);
    setCurrentInstructionIndex(newIndex);
    window.speechSynthesis.cancel();
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
        duration_minutes: session?.duration || 5,
        meditation_type: session?.type || 'mindfulness',
        mood_before: 'calm', // You might want to pass this
        mood_after: mood,
        guided_session_id: String(session?.id || 'unknown')
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
  const progress = (elapsedSeconds / ((session?.duration || 5) * 60)) * 100;

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
        <h2 className="text-4xl font-bold text-white mb-2">{session?.title || 'Meditation'}</h2>
        <p className="text-white/70">{session?.duration || 5} minute session</p>
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
        className="max-w-2xl mx-auto mb-12 text-center"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          {isGeneratingVoice && (
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="flex gap-1">
                <motion.div
                  animate={{ height: [12, 20, 12] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                  className="w-1 bg-purple-400 rounded-full"
                />
                <motion.div
                  animate={{ height: [12, 20, 12] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }}
                  className="w-1 bg-purple-400 rounded-full"
                />
                <motion.div
                  animate={{ height: [12, 20, 12] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                  className="w-1 bg-purple-400 rounded-full"
                />
              </div>
              <span className="text-purple-300 text-sm font-medium">Voice guidance playing...</span>
            </div>
          )}
          <p className="text-white text-xl leading-relaxed mb-4 font-light">
            {instructions[currentInstructionIndex]}
          </p>
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Step {currentInstructionIndex + 1} of {totalInstructions}</span>
          </div>
        </div>
      </motion.div>

      {/* Audio Player Controls */}
      <div className="mb-8">
        {/* Main playback controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Rewind 15s */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={skipBackward}
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/20"
            title="Rewind 15 seconds"
          >
            <Rewind className="w-5 h-5" />
          </motion.button>

          {/* Previous instruction */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentInstructionIndex(Math.max(0, currentInstructionIndex - 1))}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/20"
            disabled={currentInstructionIndex === 0}
            title="Previous instruction"
          >
            <SkipBack className="w-4 h-4" />
          </motion.button>

          {/* Play/Pause - Main button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayPause}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-2xl hover:shadow-purple-500/50 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </motion.button>

          {/* Next instruction */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentInstructionIndex(Math.min(totalInstructions - 1, currentInstructionIndex + 1))}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/20"
            disabled={currentInstructionIndex >= totalInstructions - 1}
            title="Next instruction"
          >
            <SkipForward className="w-4 h-4" />
          </motion.button>

          {/* Fast forward 15s */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={skipForward}
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/20"
            title="Fast forward 15 seconds"
          >
            <FastForward className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Sound picker button - below controls */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSoundPicker(!showSoundPicker)}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-2 text-white text-sm transition-all backdrop-blur-sm border border-white/20"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ambient Sound</span>
          </motion.button>
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
      {selectedAmbientSound !== 'none' && (
        <audio
          ref={audioRef}
          loop
          style={{ display: 'none' }}
        />
      )}

      {/* Audio Controls Modal */}
      {showSoundPicker && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#2d2d4a] rounded-2xl shadow-2xl p-5 w-80 z-50 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio Settings
            </h4>
            <button
              onClick={() => setShowSoundPicker(false)}
              className="w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Volume Controls */}
          <div className="space-y-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  Voice Volume
                </label>
                <span className="text-xs text-gray-500">{Math.round(voiceVolume * 100)}%</span>
              </div>
              <Slider
                value={[voiceVolume]}
                onValueChange={([val]) => setVoiceVolume(val)}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  Background Volume
                </label>
                <span className="text-xs text-gray-500">{Math.round(backgroundVolume * 100)}%</span>
              </div>
              <Slider
                value={[backgroundVolume]}
                onValueChange={([val]) => setBackgroundVolume(val)}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>

          {/* Sound Selection */}
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Sound</h5>
          <div className="space-y-1.5 max-h-48 overflow-y-auto mb-3">
            {AMBIENT_SOUND_OPTIONS.map(sound => (
              <button
                key={sound.id}
                onClick={() => {
                  setSelectedAmbientSound(sound.id);
                  if (audioRef.current && isPlaying) {
                    if (sound.id === 'none') {
                      audioRef.current.pause();
                    } else {
                      const soundUrl = sound.id === 'default' ? AMBIENT_SOUNDS[session?.type] : sound.url;
                      if (soundUrl) {
                        audioRef.current.src = soundUrl;
                        audioRef.current.volume = backgroundVolume;
                        audioRef.current.play().catch(() => {});
                      }
                    }
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                  selectedAmbientSound === sound.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-[#1a1a2e] text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                {sound.name}
              </button>
            ))}
            {customSoundUrl && (
              <button
                onClick={() => setSelectedAmbientSound('custom')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                  selectedAmbientSound === 'custom'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-[#1a1a2e] text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                Custom Sound
              </button>
            )}
          </div>

          {/* Upload Custom Sound */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingSound}
            className="w-full px-3 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploadingSound ? 'Uploading...' : 'Upload Custom Sound'}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}