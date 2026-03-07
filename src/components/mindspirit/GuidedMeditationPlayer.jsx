import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, VolumeX, Loader2, Wind, Moon, Sun, Heart, BookOpen, Leaf, Flame, Star, Zap, Shield, Feather, Eye, Coffee, Cloud, Music, Sunrise, Waves, Anchor, Rainbow } from 'lucide-react';
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
    gradient: 'from-[#FAD98D]/20 to-[#AFC7E3]/15',
    accentColor: '#FAD98D',
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
  },
  {
    id: 'anxiety-relief',
    title: 'Anxiety Relief',
    duration: '6 min',
    durationSec: 360,
    theme: '🌊',
    icon: Waves,
    gradient: 'from-[#AFC7E3]/30 to-[#3C4E53]/15',
    accentColor: '#AFC7E3',
    description: 'Calm racing thoughts and return to stillness through breath and faith.',
    prompt: 'A 6-minute anxiety relief meditation. Acknowledge anxious feelings without judgment, use slow 4-7-8 breathing, visualize God\'s peace as a still lake, and anchor in Isaiah 41:10. Gentle, grounding tone with long pauses.'
  },
  {
    id: 'confidence-courage',
    title: 'Confidence & Courage',
    duration: '5 min',
    durationSec: 300,
    theme: '🦁',
    icon: Flame,
    gradient: 'from-[#FAD98D]/25 to-[#AFC7E3]/15',
    accentColor: '#FAD98D',
    description: 'Step into the strength and boldness God has placed inside you.',
    prompt: 'A 5-minute confidence and courage meditation. Remind the user of their God-given identity, use Joshua 1:9 as an anchor, visualize stepping forward with boldness, and close with a declaration of faith. Energizing yet peaceful tone.'
  },
  {
    id: 'deep-sleep',
    title: 'Deep Sleep Preparation',
    duration: '12 min',
    durationSec: 720,
    theme: '💤',
    icon: Moon,
    gradient: 'from-[#3C4E53]/30 to-[#AFC7E3]/10',
    accentColor: '#3C4E53',
    description: 'Quiet your mind and drift into peaceful, restorative sleep.',
    prompt: 'A 12-minute sleep preparation meditation. Slow the breath progressively, guide a full body relaxation from toes to head, visualize resting in God\'s arms, reference Psalm 4:8. Very slow, drowsy narration with extended pauses of 8-12 seconds between segments.'
  },
  {
    id: 'grief-comfort',
    title: 'Grief & Comfort',
    duration: '8 min',
    durationSec: 480,
    theme: '🫶',
    icon: Heart,
    gradient: 'from-[#AFC7E3]/25 to-[#FAD98D]/15',
    accentColor: '#AFC7E3',
    description: 'Find comfort in God\'s presence when loss or sadness weighs heavy.',
    prompt: 'An 8-minute grief and comfort meditation. Acknowledge pain with compassion, create space to feel and release sadness, remind the user they are not alone (Psalm 34:18), visualize God\'s arms around them. Deeply tender, unhurried tone.'
  },
  {
    id: 'purpose-calling',
    title: 'Purpose & Calling',
    duration: '7 min',
    durationSec: 420,
    theme: '⭐',
    icon: Star,
    gradient: 'from-[#FAD98D]/20 to-[#3C4E53]/15',
    accentColor: '#FAD98D',
    description: 'Reconnect with your God-given purpose and the life you\'re called to.',
    prompt: 'A 7-minute purpose and calling meditation. Guide reflection on God\'s unique design for the user, use Jeremiah 29:11, visualize a path lit ahead, invite surrender of self-doubt, close with a commissioning prayer. Inspiring, warm tone.'
  },
  {
    id: 'midday-reset',
    title: 'Midday Reset',
    duration: '4 min',
    durationSec: 240,
    theme: '☀️',
    icon: Coffee,
    gradient: 'from-[#AFC7E3]/20 to-[#FAD98D]/15',
    accentColor: '#AFC7E3',
    description: 'A quick recharge to clear mental fog and renew focus mid-day.',
    prompt: 'A 4-minute midday reset meditation. Three deep cleansing breaths, release the morning\'s stress, set a fresh intention for the afternoon, end with a one-line prayer. Crisp, refreshing tone — like a cold glass of water.'
  },
  {
    id: 'healing-prayer',
    title: 'Healing Prayer',
    duration: '9 min',
    durationSec: 540,
    theme: '✝️',
    icon: Shield,
    gradient: 'from-[#FAD98D]/25 to-[#AFC7E3]/20',
    accentColor: '#FAD98D',
    description: 'Bring physical, emotional or spiritual pain before God and receive His healing.',
    prompt: 'A 9-minute healing prayer meditation. Invite the user to name what needs healing, lay it at the foot of the cross, visualize healing light flowing through the body, reference James 5:16 and Isaiah 53:5. Reverent, faith-filled tone.'
  },
  {
    id: 'letting-go',
    title: 'Letting Go',
    duration: '6 min',
    durationSec: 360,
    theme: '🍂',
    icon: Feather,
    gradient: 'from-[#AFC7E3]/25 to-[#3C4E53]/10',
    accentColor: '#AFC7E3',
    description: 'Release control, old wounds, and what no longer serves your growth.',
    prompt: 'A 6-minute letting go meditation. Guide the user to identify what they\'re gripping tightly, visualize placing it in God\'s open hands, breathe out and release with each exhale, reference Philippians 4:6-7. Gentle, freeing tone.'
  },
  {
    id: 'focus-clarity',
    title: 'Focus & Clarity',
    duration: '5 min',
    durationSec: 300,
    theme: '🎯',
    icon: Eye,
    gradient: 'from-[#3C4E53]/20 to-[#FAD98D]/15',
    accentColor: '#3C4E53',
    description: 'Cut through distraction and sharpen your mind for the task ahead.',
    prompt: 'A 5-minute focus and clarity meditation. Clear mental clutter through breath, visualize a clear still pond, set one clear intention, reference Proverbs 4:25. Alert and grounded tone — not sleepy, but calm and sharp.'
  },
  {
    id: 'self-compassion',
    title: 'Self-Compassion',
    duration: '7 min',
    durationSec: 420,
    theme: '💛',
    icon: Sun,
    gradient: 'from-[#FAD98D]/20 to-[#AFC7E3]/20',
    accentColor: '#FAD98D',
    description: 'Speak kindly to yourself the way God speaks over you.',
    prompt: 'A 7-minute self-compassion meditation. Address harsh inner criticism with gentleness, remind the user they are fearfully and wonderfully made (Psalm 139:14), practice placing a hand on the heart and receiving God\'s love. Warm, motherly tone.'
  },
  {
    id: 'overcoming-fear',
    title: 'Overcoming Fear',
    duration: '6 min',
    durationSec: 360,
    theme: '⚡',
    icon: Zap,
    gradient: 'from-[#3C4E53]/25 to-[#AFC7E3]/15',
    accentColor: '#3C4E53',
    description: 'Face what frightens you with faith, not with your own strength.',
    prompt: 'A 6-minute overcoming fear meditation. Name the fear without shame, place it before God, declare 2 Timothy 1:7 over it, visualize walking through the fear with God beside you. Steady, courageous tone.'
  },
  {
    id: 'relationships',
    title: 'Healthy Relationships',
    duration: '7 min',
    durationSec: 420,
    theme: '🤝',
    icon: Heart,
    gradient: 'from-[#AFC7E3]/25 to-[#FAD98D]/15',
    accentColor: '#AFC7E3',
    description: 'Open your heart to give and receive love as God intended.',
    prompt: 'A 7-minute relationships meditation. Reflect on one key relationship, release any hurt or expectation, pray for the other person, visualize connection rooted in love (1 Corinthians 13). Warm, open tone.'
  },
  {
    id: 'abundance-mindset',
    title: 'Abundance Mindset',
    duration: '5 min',
    durationSec: 300,
    theme: '🌿',
    icon: Leaf,
    gradient: 'from-[#FAD98D]/20 to-[#3C4E53]/15',
    accentColor: '#FAD98D',
    description: 'Shift from scarcity thinking to God\'s overflowing provision.',
    prompt: 'A 5-minute abundance mindset meditation. Name three ways God has provided, counter scarcity fears with truth, reference Philippians 4:19, visualize a table overflowing. Grateful, expectant tone.'
  },
  {
    id: 'sabbath-rest',
    title: 'Sabbath Rest',
    duration: '10 min',
    durationSec: 600,
    theme: '☁️',
    icon: Cloud,
    gradient: 'from-[#AFC7E3]/30 to-[#3C4E53]/20',
    accentColor: '#AFC7E3',
    description: 'Enter true rest — ceasing striving and trusting in God\'s sufficiency.',
    prompt: 'A 10-minute sabbath rest meditation. Invite the user to stop doing and simply be, release productivity pressure, rest in God\'s completed work, reference Psalm 46:10 and Hebrews 4:9-10. Deeply peaceful, unhurried tone with 8-second pauses.'
  },
  {
    id: 'worship-presence',
    title: 'Worship & Presence',
    duration: '8 min',
    durationSec: 480,
    theme: '🙌',
    icon: Music,
    gradient: 'from-[#FAD98D]/25 to-[#AFC7E3]/15',
    accentColor: '#FAD98D',
    description: 'Enter a posture of worship and experience God\'s nearness.',
    prompt: 'An 8-minute worship and presence meditation. Begin in gratitude, move into adoration, use Psalm 100 as a framework, invite stillness in God\'s presence, close with a declaration of who God is. Reverent, joyful tone.'
  },
  {
    id: 'new-beginnings',
    title: 'New Beginnings',
    duration: '6 min',
    durationSec: 360,
    theme: '🌱',
    icon: Sunrise,
    gradient: 'from-[#AFC7E3]/20 to-[#FAD98D]/20',
    accentColor: '#AFC7E3',
    description: 'Embrace fresh starts, new seasons, and the God who makes all things new.',
    prompt: 'A 6-minute new beginnings meditation. Release the past season with gratitude, open hands to what is coming, reference Isaiah 43:19 and Lamentations 3:22-23, visualize a fresh sunrise. Hopeful, forward-looking tone.'
  },
  {
    id: 'strength-exhaustion',
    title: 'Strength in Exhaustion',
    duration: '7 min',
    durationSec: 420,
    theme: '🌾',
    icon: Anchor,
    gradient: 'from-[#3C4E53]/20 to-[#FAD98D]/15',
    accentColor: '#3C4E53',
    description: 'Find renewed strength when you\'re running on empty.',
    prompt: 'A 7-minute meditation for exhaustion. Acknowledge tiredness without guilt, receive permission to rest, draw on Isaiah 40:31 — mounting up with wings like eagles. Guide slow energizing breaths and close with a gentle commissioning. Tender and restorative tone.'
  },
  {
    id: 'temptation-resistance',
    title: 'Resisting Temptation',
    duration: '5 min',
    durationSec: 300,
    theme: '🛡️',
    icon: Shield,
    gradient: 'from-[#FAD98D]/20 to-[#3C4E53]/20',
    accentColor: '#FAD98D',
    description: 'Arm your mind and spirit before facing what pulls you away from God.',
    prompt: 'A 5-minute temptation resistance meditation. Name the area of struggle, put on the armor of God (Ephesians 6:10-11), visualize a shield of faith, declare victory through Christ. Strong, resolute tone.'
  },
  {
    id: 'joy-restoration',
    title: 'Joy Restoration',
    duration: '6 min',
    durationSec: 360,
    theme: '🌈',
    icon: Rainbow,
    gradient: 'from-[#AFC7E3]/25 to-[#FAD98D]/20',
    accentColor: '#AFC7E3',
    description: 'Recover the joy that circumstances may have stolen from you.',
    prompt: 'A 6-minute joy restoration meditation. Acknowledge the joy drain, recall a memory of pure delight, connect to Nehemiah 8:10 — the joy of the Lord is your strength, let joy rise from the belly. Playful, light, uplifting tone.'
  },
  {
    id: 'decision-wisdom',
    title: 'Wisdom for Decisions',
    duration: '8 min',
    durationSec: 480,
    theme: '💡',
    icon: Eye,
    gradient: 'from-[#FAD98D]/25 to-[#AFC7E3]/20',
    accentColor: '#FAD98D',
    description: 'Quiet the noise and seek God\'s wisdom for a choice you\'re facing.',
    prompt: 'An 8-minute decision-making meditation. Still the mind from all the voices, present the decision openly to God, reference James 1:5 and Proverbs 3:5-6, visualize a clear path illuminated ahead, trust the process. Discerning, peaceful tone with thoughtful pauses.'
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
export default function GuidedMeditationPlayer({ hideHeader = false }) {
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
      {!hideHeader && (
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#AFC7E3] to-[#3C4E53] flex items-center justify-center">
          <Wind className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-[#0A1A2F] text-base">Guided Meditations</h3>
          <p className="text-xs text-[#0A1A2F]/60">AI voice + ambient music</p>
        </div>
      </div>
      )}

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
              background: 'linear-gradient(160deg, #0A1A2F 0%, #0A1A2F 40%, #2a4a6c 70%, #3C4E53 100%)'
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
