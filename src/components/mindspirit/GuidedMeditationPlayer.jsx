import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, VolumeX, Loader2, Wind, Moon, Sun, Heart, BookOpen, Leaf } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const MEDITATIONS = [
  {
    id: 'morning-gratitude',
    title: 'Morning Gratitude',
    duration: '5 min',
    durationSec: 300,
    theme: '🌅',
    icon: Sun,
    gradient: 'from-[#AFC7E3]/30 to-[#AFC7E3]/10',
    accentColor: '#AFC7E3',
    description: 'Begin your day rooted in thankfulness and God\'s presence.',
    prompt: 'A warm Christian morning gratitude meditation, 5 minutes. Focus on waking with thankfulness, naming three blessings, and setting an intention anchored in faith. Include gentle breathing cues and a short scripture reference (Psalm 118:24).'
  },
  {
    id: 'breathing-reset',
    title: 'Breathing Reset',
    duration: '3 min',
    durationSec: 180,
    theme: '🌬️',
    icon: Wind,
    gradient: 'from-[#3C4E53]/20 to-[#AFC7E3]/20',
    accentColor: '#3C4E53',
    description: 'Release anxiety and return to peace in just 3 minutes.',
    prompt: 'A quick 3-minute breathing reset meditation. Guide box breathing (4-4-4-4 counts), include a centering affirmation, and end with one verse about peace (Philippians 4:7). Calm, reassuring tone.'
  },
  {
    id: 'scripture-reflection',
    title: 'Scripture Reflection',
    duration: '7 min',
    durationSec: 420,
    theme: '📖',
    icon: BookOpen,
    gradient: 'from-[#D9B878]/20 to-[#AFC7E3]/15',
    accentColor: '#D9B878',
    description: 'Sit with God\'s Word and let it speak to your heart.',
    prompt: 'A 7-minute scripture-based meditation using Psalm 23. Read the psalm slowly, pause for reflection on each verse, guide the user to visualize the imagery, and close with a prayer of surrender. Gentle, reverent tone.'
  },
  {
    id: 'body-scan',
    title: 'Body Scan & Release',
    duration: '8 min',
    durationSec: 480,
    theme: '✨',
    icon: Leaf,
    gradient: 'from-[#AFC7E3]/25 to-[#3C4E53]/15',
    accentColor: '#AFC7E3',
    description: 'Scan your body from head to toe, releasing tension and worry.',
    prompt: 'An 8-minute Christian body scan meditation. Guide awareness from the crown of the head to the feet, releasing tension with each exhale. Connect the physical with the spiritual — the body as temple (1 Corinthians 6:19). Slow, soothing tone with long pauses.'
  },
  {
    id: 'forgiveness-peace',
    title: 'Forgiveness & Peace',
    duration: '6 min',
    durationSec: 360,
    theme: '🕊️',
    icon: Heart,
    gradient: 'from-[#FAD98D]/20 to-[#AFC7E3]/20',
    accentColor: '#FAD98D',
    description: 'Let go of burdens, extend grace, and receive God\'s peace.',
    prompt: 'A 6-minute forgiveness meditation. Guide the user to release resentment, extend compassion to themselves and others, and receive God\'s forgiveness (Ephesians 4:32). Include visualization of releasing a burden and feeling lightness. Warm, gentle tone.'
  },
  {
    id: 'evening-winddown',
    title: 'Evening Wind-Down',
    duration: '10 min',
    durationSec: 600,
    theme: '🌙',
    icon: Moon,
    gradient: 'from-[#3C4E53]/25 to-[#AFC7E3]/10',
    accentColor: '#3C4E53',
    description: 'Surrender the day and rest in God\'s faithful care.',
    prompt: 'A 10-minute evening wind-down meditation. Review the day with gratitude, release what didn\'t go well, surrender tomorrow\'s worries to God (Matthew 6:34). Guide progressive muscle relaxation and close with a nighttime blessing. Hushed, sleepy tone.'
  }
];

// === Ambient Soundscape using Web Audio API ===
class AmbientSoundscape {
  constructor() {
    this.ctx = null;
    this.nodes = [];
    this.masterGain = null;
  }

  start() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 4);
      this.masterGain.connect(this.ctx.destination);

      // Layered solfeggio tones for calming effect
      const layers = [
        { freq: 174, type: 'sine', vol: 0.4 },
        { freq: 285, type: 'sine', vol: 0.3 },
        { freq: 396, type: 'sine', vol: 0.2 },
        { freq: 528, type: 'sine', vol: 0.15 },
      ];

      layers.forEach(({ freq, type, vol }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        // Slight tremolo
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.2 + Math.random() * 0.2;
        lfoGain.gain.value = 1;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        filter.type = 'lowpass';
        filter.frequency.value = 600;
        filter.Q.value = 0.5;

        gain.gain.value = vol;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start();

        this.nodes.push({ osc, gain, lfo });
      });
    } catch (e) {
      console.warn('Web Audio not available:', e);
    }
  }

  setVolume(vol) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.5);
    }
  }

  stop() {
    if (!this.ctx) return;
    try {
      if (this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
      }
      setTimeout(() => {
        this.nodes.forEach(({ osc, lfo }) => {
          try { osc.stop(); } catch (e) {}
          try { lfo.stop(); } catch (e) {}
        });
        this.nodes = [];
        try { this.ctx.close(); } catch (e) {}
        this.ctx = null;
      }, 2500);
    } catch (e) {}
  }
}

// === Voice Narration using Web Speech API ===
const speakSegment = (text, rate = 0.85, pitch = 0.9) => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = 0.95;

    // Prefer a calm, warm voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('moira') ||
      v.name.toLowerCase().includes('tessa') ||
      v.name.toLowerCase().includes('female') ||
      (v.lang === 'en-US' && v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferred) utter.voice = preferred;
    utter.onend = resolve;
    utter.onerror = resolve;
    window.speechSynthesis.speak(utter);
  });
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// === Main Component ===
export default function GuidedMeditationPlayer() {
  const [activeMeditation, setActiveMeditation] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | loading | playing | paused | done
  const [script, setScript] = useState([]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [musicMuted, setMusicMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [breathState, setBreathState] = useState('in'); // in | out

  const soundscapeRef = useRef(null);
  const pausedRef = useRef(false);
  const stoppedRef = useRef(false);
  const timerRef = useRef(null);
  const breathRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      window.speechSynthesis?.cancel();
      soundscapeRef.current?.stop();
      clearInterval(timerRef.current);
      clearInterval(breathRef.current);
    };
  }, []);

  const startMeditation = async (med) => {
    setActiveMeditation(med);
    setPhase('loading');
    setElapsed(0);
    setCurrentSegment(0);
    setCurrentText('');
    stoppedRef.current = false;
    pausedRef.current = false;

    // Generate script
    let segments = [];
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional guided meditation narrator. Create a script for: ${med.prompt}

Return ONLY a valid JSON array. Each element: {"text": "spoken words", "pause": seconds_of_silence_after}
Requirements:
- 15-25 segments total
- pause values: 2-4 for normal, 6-10 for breathing exercises, 3-5 for visualization
- Include breathing cues like "Breathe in... and breathe out..."
- Warm, peaceful, unhurried language
- No markdown, no explanation, just the JSON array`
      });
      const cleaned = response.replace(/```json\n?|```\n?/g, '').trim();
      const startIdx = cleaned.indexOf('[');
      const endIdx = cleaned.lastIndexOf(']');
      if (startIdx !== -1 && endIdx !== -1) {
        segments = JSON.parse(cleaned.substring(startIdx, endIdx + 1));
      }
    } catch (e) {
      // Fallback script
      segments = [
        { text: "Welcome. Find a comfortable position and gently close your eyes.", pause: 4 },
        { text: "Take a slow, deep breath in through your nose.", pause: 3 },
        { text: "And release it slowly through your mouth.", pause: 4 },
        { text: "Let your body begin to soften and relax.", pause: 5 },
        { text: "You are held. You are safe. You are loved.", pause: 6 },
        { text: `This is your time for ${med.title}. Simply be present.`, pause: 8 },
        { text: "Breathe in peace... and breathe out tension.", pause: 6 },
        { text: "Let every exhale carry away what you no longer need.", pause: 8 },
        { text: "Rest here for a moment. Simply breathe.", pause: 10 },
        { text: "As you prepare to return, carry this peace with you.", pause: 4 },
        { text: "Gently wiggle your fingers and toes.", pause: 3 },
        { text: "When you are ready, slowly open your eyes. Amen.", pause: 3 },
      ];
    }

    setScript(segments);
    setPhase('playing');

    // Start ambient sound
    soundscapeRef.current = new AmbientSoundscape();
    soundscapeRef.current.start();

    // Start timer
    timerRef.current = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);

    // Breathing animation
    breathRef.current = setInterval(() => {
      setBreathState(s => s === 'in' ? 'out' : 'in');
    }, 4000);

    // Narrate segments
    for (let i = 0; i < segments.length; i++) {
      if (stoppedRef.current) break;

      // Wait while paused
      while (pausedRef.current && !stoppedRef.current) {
        await sleep(200);
      }
      if (stoppedRef.current) break;

      setCurrentSegment(i);
      setCurrentText(segments[i].text);
      await speakSegment(segments[i].text);

      if (stoppedRef.current) break;

      // Pause between segments
      const pauseMs = (segments[i].pause || 3) * 1000;
      const start = Date.now();
      while (Date.now() - start < pauseMs) {
        if (stoppedRef.current) break;
        while (pausedRef.current && !stoppedRef.current) await sleep(200);
        await sleep(100);
      }
    }

    if (!stoppedRef.current) {
      setPhase('done');
      clearInterval(timerRef.current);
      clearInterval(breathRef.current);
      soundscapeRef.current?.stop();
    }
  };

  const handleClose = () => {
    stoppedRef.current = true;
    window.speechSynthesis?.cancel();
    soundscapeRef.current?.stop();
    clearInterval(timerRef.current);
    clearInterval(breathRef.current);
    setActiveMeditation(null);
    setPhase('idle');
    setScript([]);
    setCurrentText('');
    setElapsed(0);
  };

  const togglePause = () => {
    if (phase === 'playing') {
      pausedRef.current = true;
      window.speechSynthesis?.pause();
      setPhase('paused');
    } else if (phase === 'paused') {
      pausedRef.current = false;
      window.speechSynthesis?.resume();
      setPhase('playing');
    }
  };

  const toggleMusic = () => {
    const newMuted = !musicMuted;
    setMusicMuted(newMuted);
    soundscapeRef.current?.setVolume(newMuted ? 0 : 0.18);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const progress = activeMeditation ? Math.min((elapsed / activeMeditation.durationSec) * 100, 100) : 0;

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#AFC7E3] to-[#3C4E53] flex items-center justify-center">
          <Wind className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-[#0A1A2F] text-base">Guided Meditations</h3>
          <p className="text-xs text-[#0A1A2F]/60">AI voice + ambient music</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {MEDITATIONS.map((med, idx) => {
          const Icon = med.icon;
          return (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`bg-gradient-to-br ${med.gradient} rounded-2xl p-4 border border-[#AFC7E3]/25 cursor-pointer hover:shadow-md transition-all`}
              onClick={() => startMeditation(med)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{med.theme}</span>
                <span className="text-xs font-semibold text-[#0A1A2F]/50 bg-white/60 rounded-full px-2 py-0.5">
                  {med.duration}
                </span>
              </div>
              <h4 className="font-bold text-[#0A1A2F] text-sm mb-1 leading-tight">{med.title}</h4>
              <p className="text-xs text-[#0A1A2F]/65 leading-relaxed mb-3">{med.description}</p>
              <div className="flex items-center gap-1.5 bg-white/70 rounded-full px-3 py-1.5 w-fit">
                <Play className="w-3 h-3 text-[#3C4E53] fill-[#3C4E53]" />
                <span className="text-xs font-semibold text-[#3C4E53]">Begin</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* === Full-Screen Player === */}
      <AnimatePresence>
        {activeMeditation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{
              background: 'linear-gradient(160deg, #0A1A2F 0%, #1a3a5c 40%, #2a4a6c 70%, #3C4E53 100%)'
            }}
          >
            {/* Breathing circle background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{
                  scale: breathState === 'in' ? 1.15 : 0.9,
                  opacity: breathState === 'in' ? 0.12 : 0.06,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="w-96 h-96 rounded-full bg-[#AFC7E3]"
              />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">
              <button onClick={handleClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="text-center">
                <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Guided Meditation</p>
                <p className="text-white font-bold text-base">{activeMeditation.title}</p>
              </div>
              <button onClick={toggleMusic} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                {musicMuted
                  ? <VolumeX className="w-5 h-5 text-white/60" />
                  : <Volume2 className="w-5 h-5 text-white" />}
              </button>
            </div>

            {/* Center Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
              {/* Theme emoji */}
              <motion.div
                animate={{ scale: breathState === 'in' ? 1.1 : 1, y: breathState === 'in' ? -4 : 4 }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="text-6xl mb-8"
              >
                {activeMeditation.theme}
              </motion.div>

              {/* Current narration text */}
              <div className="min-h-24 flex items-center justify-center mb-8">
                <AnimatePresence mode="wait">
                  {phase === 'loading' ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-[#AFC7E3] animate-spin" />
                      <p className="text-white/60 text-sm">Preparing your meditation...</p>
                    </motion.div>
                  ) : phase === 'done' ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                      <p className="text-2xl mb-2">🙏</p>
                      <p className="text-white font-semibold text-lg">Meditation complete</p>
                      <p className="text-white/60 text-sm mt-1">May you carry this peace throughout your day.</p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key={currentText}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.5 }}
                      className="text-white text-center text-lg font-light leading-relaxed max-w-xs"
                    >
                      {currentText}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Breath guide */}
              {(phase === 'playing' || phase === 'paused') && (
                <div className="flex items-center gap-3 mb-8">
                  <motion.div
                    animate={{ scale: breathState === 'in' ? 1 : 0.85, opacity: breathState === 'in' ? 1 : 0.4 }}
                    transition={{ duration: 4, ease: 'easeInOut' }}
                    className="w-2.5 h-2.5 rounded-full bg-[#AFC7E3]"
                  />
                  <p className="text-[#AFC7E3]/80 text-xs font-medium tracking-widest uppercase">
                    {breathState === 'in' ? 'Breathe in' : 'Breathe out'}
                  </p>
                  <motion.div
                    animate={{ scale: breathState === 'out' ? 1 : 0.85, opacity: breathState === 'out' ? 1 : 0.4 }}
                    transition={{ duration: 4, ease: 'easeInOut' }}
                    className="w-2.5 h-2.5 rounded-full bg-[#AFC7E3]"
                  />
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="relative z-10 px-8 pb-12">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-[#AFC7E3] rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>{formatTime(elapsed)}</span>
                  <span>{activeMeditation.duration}</span>
                </div>
              </div>

              {/* Play/Pause Button */}
              {phase !== 'loading' && phase !== 'done' && (
                <div className="flex justify-center">
                  <button
                    onClick={togglePause}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    {phase === 'playing'
                      ? <Pause className="w-7 h-7 text-white fill-white" />
                      : <Play className="w-7 h-7 text-white fill-white ml-1" />}
                  </button>
                </div>
              )}

              {phase === 'done' && (
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-full bg-[#AFC7E3]/30 border border-[#AFC7E3]/40 text-white font-semibold"
                >
                  Close
                </button>
              )}

              {/* Segment progress dots */}
              {script.length > 0 && phase !== 'done' && (
                <div className="flex justify-center gap-1 mt-5 flex-wrap">
                  {script.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i < currentSegment ? 'bg-[#AFC7E3]' :
                        i === currentSegment ? 'bg-white scale-125' :
                        'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
