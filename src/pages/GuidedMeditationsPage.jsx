import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Pause, X, Loader2,
  Wind, Moon, Sun, Heart, BookOpen, Leaf, Flame, Star as StarIcon,
  Zap, Shield, Feather, Eye, Coffee, Cloud, Music, Sunrise,
  Waves, Anchor, Rainbow } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { MEDITATION_VOICE, findHannahVoice } from '@/utils/meditationVoice';

// ─── Meditation catalogue with categories ────────────────────────────────────
const MEDITATIONS = [
{ id: 'morning-gratitude', title: 'Morning Gratitude', duration: '5 min', durationSec: 300, theme: '🌅', icon: Sun, category: 'morning', gradient: 'from-amber-500 to-orange-400', accentColor: '#f59e0b', description: "Begin your day rooted in thankfulness and God's presence.", prompt: "A warm Christian morning gratitude meditation, 5 minutes. Focus on waking with thankfulness, naming three blessings, and setting an intention anchored in faith. Include gentle breathing cues and a short scripture reference (Psalm 118:24)." },
{ id: 'breathing-reset', title: 'Breathing Reset', duration: '3 min', durationSec: 180, theme: '🌬️', icon: Wind, category: 'calm', gradient: 'from-sky-500 to-cyan-400', accentColor: '#0ea5e9', description: 'Release anxiety and return to peace in just 3 minutes.', prompt: "A quick 3-minute breathing reset meditation. Guide box breathing (4-4-4-4 counts), include a centering affirmation, and end with one verse about peace (Philippians 4:7). Calm, reassuring tone." },
{ id: 'scripture-reflection', title: 'Scripture Reflection', duration: '7 min', durationSec: 420, theme: '📖', icon: BookOpen, category: 'faith', gradient: 'from-[#c9a227] to-amber-400', accentColor: '#c9a227', description: "Sit with God's Word and let it speak to your heart.", prompt: "A 7-minute scripture-based meditation using Psalm 23. Read the psalm slowly, pause for reflection on each verse, guide the user to visualize the imagery, and close with a prayer of surrender. Gentle, reverent tone." },
{ id: 'body-scan', title: 'Body Scan & Release', duration: '8 min', durationSec: 480, theme: '✨', icon: Leaf, category: 'heal', gradient: 'from-emerald-500 to-teal-400', accentColor: '#10b981', description: 'Scan your body from head to toe, releasing tension and worry.', prompt: "An 8-minute Christian body scan meditation. Guide awareness from the crown of the head to the feet, releasing tension with each exhale. Connect the physical with the spiritual — the body as temple (1 Corinthians 6:19). Slow, soothing tone with long pauses." },
{ id: 'forgiveness-peace', title: 'Forgiveness & Peace', duration: '6 min', durationSec: 360, theme: '🕊️', icon: Heart, category: 'heal', gradient: 'from-rose-400 to-pink-400', accentColor: '#fb7185', description: "Let go of burdens, extend grace, and receive God's peace.", prompt: "A 6-minute forgiveness meditation. Guide the user to release resentment, extend compassion to themselves and others, and receive God's forgiveness (Ephesians 4:32). Include visualization of releasing a burden and feeling lightness. Warm, gentle tone." },
{ id: 'evening-winddown', title: 'Evening Wind-Down', duration: '10 min', durationSec: 600, theme: '🌙', icon: Moon, category: 'sleep', gradient: 'from-indigo-600 to-violet-500', accentColor: '#6366f1', description: "Surrender the day and rest in God's faithful care.", prompt: "A 10-minute evening wind-down meditation. Review the day with gratitude, release what didn't go well, surrender tomorrow's worries to God (Matthew 6:34). Guide progressive muscle relaxation and close with a nighttime blessing. Hushed, sleepy tone." },
{ id: 'anxiety-relief', title: 'Anxiety Relief', duration: '6 min', durationSec: 360, theme: '🌊', icon: Waves, category: 'calm', gradient: 'from-blue-500 to-sky-400', accentColor: '#3b82f6', description: 'Calm racing thoughts and return to stillness through breath and faith.', prompt: "A 6-minute anxiety relief meditation. Acknowledge anxious feelings without judgment, use slow 4-7-8 breathing, visualize God's peace as a still lake, and anchor in Isaiah 41:10. Gentle, grounding tone with long pauses." },
{ id: 'confidence-courage', title: 'Confidence & Courage', duration: '5 min', durationSec: 300, theme: '🦁', icon: Flame, category: 'morning', gradient: 'from-amber-600 to-yellow-500', accentColor: '#d97706', description: "Step into the strength and boldness God has placed inside you.", prompt: "A 5-minute confidence and courage meditation. Remind the user of their God-given identity, use Joshua 1:9 as an anchor, visualize stepping forward with boldness, and close with a declaration of faith. Energizing yet peaceful tone." },
{ id: 'deep-sleep', title: 'Deep Sleep Preparation', duration: '12 min', durationSec: 720, theme: '💤', icon: Moon, category: 'sleep', gradient: 'from-slate-700 to-indigo-700', accentColor: '#475569', description: 'Quiet your mind and drift into peaceful, restorative sleep.', prompt: "A 12-minute sleep preparation meditation. Slow the breath progressively, guide a full body relaxation from toes to head, visualize resting in God's arms, reference Psalm 4:8. Very slow, drowsy narration with extended pauses of 8-12 seconds between segments." },
{ id: 'grief-comfort', title: 'Grief & Comfort', duration: '8 min', durationSec: 480, theme: '🫶', icon: Heart, category: 'heal', gradient: 'from-purple-500 to-violet-400', accentColor: '#a855f7', description: "Find comfort in God's presence when loss or sadness weighs heavy.", prompt: "An 8-minute grief and comfort meditation. Acknowledge pain with compassion, create space to feel and release sadness, remind the user they are not alone (Psalm 34:18), visualize God's arms around them. Deeply tender, unhurried tone." },
{ id: 'purpose-calling', title: 'Purpose & Calling', duration: '7 min', durationSec: 420, theme: '⭐', icon: StarIcon, category: 'faith', gradient: 'from-[#c9a227] to-orange-400', accentColor: '#c9a227', description: "Reconnect with your God-given purpose and the life you're called to.", prompt: "A 7-minute purpose and calling meditation. Guide reflection on God's unique design for the user, use Jeremiah 29:11, visualize a path lit ahead, invite surrender of self-doubt, close with a commissioning prayer. Inspiring, warm tone." },
{ id: 'midday-reset', title: 'Midday Reset', duration: '4 min', durationSec: 240, theme: '☀️', icon: Coffee, category: 'focus', gradient: 'from-lime-500 to-green-400', accentColor: '#84cc16', description: 'A quick recharge to clear mental fog and renew focus mid-day.', prompt: "A 4-minute midday reset meditation. Three deep cleansing breaths, release the morning's stress, set a fresh intention for the afternoon, end with a one-line prayer. Crisp, refreshing tone — like a cold glass of water." },
{ id: 'healing-prayer', title: 'Healing Prayer', duration: '9 min', durationSec: 540, theme: '✝️', icon: Shield, category: 'faith', gradient: 'from-[#FAD98D] to-yellow-400', accentColor: '#FAD98D', description: 'Bring physical, emotional or spiritual pain before God and receive His healing.', prompt: "A 9-minute healing prayer meditation. Invite the user to name what needs healing, lay it at the foot of the cross, visualize healing light flowing through the body, reference James 5:16 and Isaiah 53:5. Reverent, faith-filled tone." },
{ id: 'letting-go', title: 'Letting Go', duration: '6 min', durationSec: 360, theme: '🍂', icon: Feather, category: 'calm', gradient: 'from-orange-400 to-amber-400', accentColor: '#fb923c', description: "Release control, old wounds, and what no longer serves your growth.", prompt: "A 6-minute letting go meditation. Guide the user to identify what they're gripping tightly, visualize placing it in God's open hands, breathe out and release with each exhale, reference Philippians 4:6-7. Gentle, freeing tone." },
{ id: 'focus-clarity', title: 'Focus & Clarity', duration: '5 min', durationSec: 300, theme: '🎯', icon: Eye, category: 'focus', gradient: 'from-teal-500 to-cyan-500', accentColor: '#14b8a6', description: 'Cut through distraction and sharpen your mind for the task ahead.', prompt: "A 5-minute focus and clarity meditation. Clear mental clutter through breath, visualize a clear still pond, set one clear intention, reference Proverbs 4:25. Alert and grounded tone — not sleepy, but calm and sharp." },
{ id: 'self-compassion', title: 'Self-Compassion', duration: '7 min', durationSec: 420, theme: '💛', icon: Sun, category: 'heal', gradient: 'from-yellow-400 to-amber-400', accentColor: '#eab308', description: "Speak kindly to yourself the way God speaks over you.", prompt: "A 7-minute self-compassion meditation. Address harsh inner criticism with gentleness, remind the user they are fearfully and wonderfully made (Psalm 139:14), practice placing a hand on the heart and receiving God's love. Warm, motherly tone." },
{ id: 'overcoming-fear', title: 'Overcoming Fear', duration: '6 min', durationSec: 360, theme: '⚡', icon: Zap, category: 'calm', gradient: 'from-violet-600 to-purple-50 dark:to-purple-900/100', accentColor: '#8B5CF6', description: "Face what frightens you with faith, not with your own strength.", prompt: "A 6-minute overcoming fear meditation. Name the fear without shame, place it before God, declare 2 Timothy 1:7 over it, visualize walking through the fear with God beside you. Steady, courageous tone." },
{ id: 'relationships', title: 'Healthy Relationships', duration: '7 min', durationSec: 420, theme: '🤝', icon: Heart, category: 'heal', gradient: 'from-fuchsia-500 to-pink-400', accentColor: '#d946ef', description: "Open your heart to give and receive love as God intended.", prompt: "A 7-minute relationships meditation. Reflect on one key relationship, release any hurt or expectation, pray for the other person, visualize connection rooted in love (1 Corinthians 13). Warm, open tone." },
{ id: 'abundance-mindset', title: 'Abundance Mindset', duration: '5 min', durationSec: 300, theme: '🌿', icon: Leaf, category: 'focus', gradient: 'from-green-500 to-emerald-400', accentColor: '#22c55e', description: "Shift from scarcity thinking to God's overflowing provision.", prompt: "A 5-minute abundance mindset meditation. Name three ways God has provided, counter scarcity fears with truth, reference Philippians 4:19, visualize a table overflowing. Grateful, expectant tone." },
{ id: 'sabbath-rest', title: 'Sabbath Rest', duration: '10 min', durationSec: 600, theme: '☁️', icon: Cloud, category: 'sleep', gradient: 'from-blue-400 to-indigo-400', accentColor: '#60a5fa', description: "Enter true rest — ceasing striving and trusting in God's sufficiency.", prompt: "A 10-minute sabbath rest meditation. Invite the user to stop doing and simply be, release productivity pressure, rest in God's completed work, reference Psalm 46:10 and Hebrews 4:9-10. Deeply peaceful, unhurried tone with 8-second pauses." },
{ id: 'worship-presence', title: 'Worship & Presence', duration: '8 min', durationSec: 480, theme: '🙌', icon: Music, category: 'faith', gradient: 'from-[#c9a227] to-yellow-400', accentColor: '#c9a227', description: "Enter a posture of worship and experience God's nearness.", prompt: "An 8-minute worship and presence meditation. Begin in gratitude, move into adoration, use Psalm 100 as a framework, invite stillness in God's presence, close with a declaration of who God is. Reverent, joyful tone." },
{ id: 'new-beginnings', title: 'New Beginnings', duration: '6 min', durationSec: 360, theme: '🌱', icon: Sunrise, category: 'morning', gradient: 'from-teal-400 to-cyan-400', accentColor: '#2dd4bf', description: "Embrace fresh starts, new seasons, and the God who makes all things new.", prompt: "A 6-minute new beginnings meditation. Release the past season with gratitude, open hands to what is coming, reference Isaiah 43:19 and Lamentations 3:22-23, visualize a fresh sunrise. Hopeful, forward-looking tone." },
{ id: 'strength-exhaustion', title: 'Strength in Exhaustion', duration: '7 min', durationSec: 420, theme: '🌾', icon: Anchor, category: 'sleep', gradient: 'from-stone-500 to-slate-400', accentColor: '#78716c', description: "Find renewed strength when you're running on empty.", prompt: "A 7-minute meditation for exhaustion. Acknowledge tiredness without guilt, receive permission to rest, draw on Isaiah 40:31 — mounting up with wings like eagles. Guide slow energizing breaths and close with a gentle commissioning. Tender and restorative tone." },
{ id: 'temptation-resistance', title: 'Resisting Temptation', duration: '5 min', durationSec: 300, theme: '🛡️', icon: Shield, category: 'focus', gradient: 'from-red-500 to-rose-400', accentColor: '#ef4444', description: "Arm your mind and spirit before facing what pulls you away from God.", prompt: "A 5-minute temptation resistance meditation. Name the area of struggle, put on the armor of God (Ephesians 6:10-11), visualize a shield of faith, declare victory through Christ. Strong, resolute tone." },
{ id: 'joy-restoration', title: 'Joy Restoration', duration: '6 min', durationSec: 360, theme: '🌈', icon: Rainbow, category: 'heal', gradient: 'from-pink-500 to-purple-400', accentColor: '#ec4899', description: "Recover the joy that circumstances may have stolen from you.", prompt: "A 6-minute joy restoration meditation. Acknowledge the joy drain, recall a memory of pure delight, connect to Nehemiah 8:10 — the joy of the Lord is your strength, let joy rise from the belly. Playful, light, uplifting tone." },
{ id: 'decision-wisdom', title: 'Wisdom for Decisions', duration: '8 min', durationSec: 480, theme: '💡', icon: Eye, category: 'focus', gradient: 'from-amber-500 to-yellow-400', accentColor: '#f59e0b', description: "Quiet the noise and seek God's wisdom for a choice you're facing.", prompt: "An 8-minute decision-making meditation. Still the mind from all the voices, present the decision openly to God, reference James 1:5 and Proverbs 3:5-6, visualize a clear path illuminated ahead, trust the process. Discerning, peaceful tone with thoughtful pauses." }];


const CATEGORIES = [
{ id: 'all', label: 'All', emoji: '✦', desc: 'Browse everything' },
{ id: 'morning', label: 'Morning', emoji: '🌅', desc: 'Start your day with intention' },
{ id: 'calm', label: 'Calm Down', emoji: '🌊', desc: 'For anxiety & overwhelm' },
{ id: 'sleep', label: 'Sleep', emoji: '🌙', desc: 'Wind down & rest' },
{ id: 'faith', label: 'Faith', emoji: '📖', desc: 'Go deeper with God' },
{ id: 'heal', label: 'Heal', emoji: '🫶', desc: 'Grief, pain, forgiveness' },
{ id: 'focus', label: 'Focus', emoji: '🎯', desc: 'Clarity & direction' }];


const FAVS_KEY = 'meditation_favorites_v1';
const HISTORY_KEY = 'meditation_history_v1';
const COUNT_KEY = 'meditation_count_v1';

const loadFavs = () => {try {return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');} catch {return [];}};
const loadHistory = () => {try {return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');} catch {return [];}};
const loadCount = () => parseInt(localStorage.getItem(COUNT_KEY) || '0', 10);

// Time-of-day recommendation
function getRecommended() {
  const h = new Date().getHours();
  if (h < 9) return MEDITATIONS.find((m) => m.id === 'morning-gratitude');
  if (h < 12) return MEDITATIONS.find((m) => m.id === 'focus-clarity');
  if (h < 14) return MEDITATIONS.find((m) => m.id === 'midday-reset');
  if (h < 17) return MEDITATIONS.find((m) => m.id === 'breathing-reset');
  if (h < 20) return MEDITATIONS.find((m) => m.id === 'forgiveness-peace');
  if (h < 22) return MEDITATIONS.find((m) => m.id === 'evening-winddown');
  return MEDITATIONS.find((m) => m.id === 'deep-sleep');
}

function getTimeLabel() {
  const h = new Date().getHours();
  if (h < 9) return { label: 'Good morning', sub: 'Start with intention' };
  if (h < 12) return { label: 'Morning focus', sub: 'Sharpen your mind' };
  if (h < 14) return { label: 'Midday reset', sub: 'Clear the fog' };
  if (h < 17) return { label: 'Afternoon calm', sub: 'Breathe and release' };
  if (h < 20) return { label: 'Evening reflection', sub: 'Process the day' };
  if (h < 22) return { label: 'Wind down', sub: 'Let go of the day' };
  return { label: 'Sleep well', sub: 'Rest in His peace' };
}

// ─── Audio engine ─────────────────────────────────────────────────────────────

// ─── Speak using Google Cloud TTS (Hannah's voice) ──────────────────────────
// Falls back to browser speechSynthesis if cloud TTS fails
// NOTE: audioRef is passed as closure so pause can stop playback
const speakSegment = (text, audioRef) => new Promise(async (resolve) => {
  const cleaned = text.
  replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').
  replace(/#{1,6}\s+/g, '').replace(/`{1,3}[^`]*`{1,3}/g, '').
  replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim().slice(0, 4500);

  if (!cleaned) {resolve();return;}

  // Try Google Cloud TTS first (same as ChatScreen Hannah voice)
  try {
    const result = await base44.functions.invoke('hannahTTS', { text: cleaned });
    const audioContent = result?.audioContent ?? result?.data?.audioContent;
    if (audioContent) {
      const binary = atob(audioContent);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {URL.revokeObjectURL(url);audioRef.current = null;resolve();};
      audio.onerror = () => {URL.revokeObjectURL(url);audioRef.current = null;resolve();};
      await audio.play();
      return;
    }
  } catch (err) {
    console.warn('[Meditation TTS] Cloud TTS failed, trying browser:', err);
  }

  // Fallback: browser speechSynthesis
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(cleaned);
    utter.rate = MEDITATION_VOICE.rate;
    utter.pitch = MEDITATION_VOICE.pitch;
    utter.volume = MEDITATION_VOICE.volume;
    const voices = window.speechSynthesis.getVoices();
    const preferred = findHannahVoice(voices);
    if (preferred) utter.voice = preferred;
    utter.onend = resolve;
    utter.onerror = resolve;
    window.speechSynthesis.speak(utter);
  } else {
    resolve();
  }
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Full-screen player overlay ───────────────────────────────────────────────
function MeditationPlayer({ meditation, onClose }) {
  const [phase, setPhase] = useState('loading');
  const [script, setScript] = useState([]);
  const [currentSegment, setCurrentSeg] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [breathState, setBreathState] = useState('in');

  const pausedRef = useRef(false);
  const stoppedRef = useRef(false);
  const timerRef = useRef(null);
  const breathRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    run();
    return () => {
      stoppedRef.current = true;
      // Stop any playing audio
      if (audioRef.current) {try {audioRef.current.pause();audioRef.current.src = '';} catch {}}
      window.speechSynthesis?.cancel();
      clearInterval(timerRef.current);
      clearInterval(breathRef.current);
    };
  }, []);

  const run = async () => {
    stoppedRef.current = false;pausedRef.current = false;
    let segments = [];
    try {
      const raw = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional guided meditation narrator. Create a script for: ${meditation.prompt}\n\nReturn ONLY a valid JSON array. Each element: {"text": "spoken words", "pause": seconds_of_silence_after}\nRequirements:\n- 15-25 segments total\n- pause values: 2-4 for normal, 6-10 for breathing exercises, 3-5 for visualization\n- Include breathing cues like "Breathe in... and breathe out..."\n- Warm, peaceful, unhurried language\n- No markdown, no explanation, just the JSON array`
      });
      const cleaned = (raw?.data || raw)?.replace(/```json\n?|```\n?/g, '').trim() || '';
      const s = cleaned.indexOf('['),e = cleaned.lastIndexOf(']');
      if (s !== -1 && e !== -1) {
        const parsed = JSON.parse(cleaned.substring(s, e + 1));
        if (Array.isArray(parsed) && parsed.length > 0) segments = parsed;
      }
    } catch (err) {
      console.warn('[Meditation] LLM script generation failed:', err);
      segments = [
      { text: "Welcome. Find a comfortable position and gently close your eyes.", pause: 4 },
      { text: "Take a slow, deep breath in through your nose.", pause: 3 },
      { text: "And release it slowly through your mouth.", pause: 4 },
      { text: "Let your body begin to soften and relax.", pause: 5 },
      { text: "You are held. You are safe. You are loved.", pause: 6 },
      { text: `This is your time for ${meditation.title}. Simply be present.`, pause: 8 },
      { text: "Breathe in peace... and breathe out tension.", pause: 6 },
      { text: "Let every exhale carry away what you no longer need.", pause: 8 },
      { text: "Rest here for a moment. Simply breathe.", pause: 10 },
      { text: "As you prepare to return, carry this peace with you.", pause: 4 },
      { text: "Gently wiggle your fingers and toes.", pause: 3 },
      { text: "When you are ready, slowly open your eyes. Amen.", pause: 3 }];

    }

    setScript(segments);setPhase('playing');

    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    breathRef.current = setInterval(() => setBreathState((s) => s === 'in' ? 'out' : 'in'), 4000);

    for (let i = 0; i < segments.length; i++) {
      if (stoppedRef.current) break;
      while (pausedRef.current && !stoppedRef.current) await sleep(200);
      if (stoppedRef.current) break;
      setCurrentSeg(i);setCurrentText(segments[i].text);
      await speakSegment(segments[i].text, audioRef);
      if (stoppedRef.current) break;
      const pauseMs = (segments[i].pause || 3) * 1000;
      const t0 = Date.now();
      while (Date.now() - t0 < pauseMs) {
        if (stoppedRef.current) break;
        while (pausedRef.current && !stoppedRef.current) await sleep(200);
        await sleep(100);
      }
    }
    if (!stoppedRef.current) {
      setPhase('done');
      clearInterval(timerRef.current);clearInterval(breathRef.current);

      // Record completion
      const count = loadCount() + 1;
      localStorage.setItem(COUNT_KEY, count);
      const history = [{ id: meditation.id, ts: Date.now() }, ...loadHistory().filter((h) => h.id !== meditation.id)].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  };

  const handleClose = () => {
    stoppedRef.current = true;
    if (audioRef.current) {try {audioRef.current.pause();audioRef.current.src = '';} catch {}}
    window.speechSynthesis?.cancel();
    clearInterval(timerRef.current);clearInterval(breathRef.current);
    onClose();
  };

  const togglePause = () => {
    if (phase === 'playing') {
      pausedRef.current = true;
      // Pause active Cloud TTS audio
      if (_activeAudio && !_activeAudio.paused) {
        try { _activeAudio.pause(); } catch {}
      }
      // Pause browser speechSynthesis
      try { window.speechSynthesis?.pause(); } catch {}
      // Stop timers while paused
      clearInterval(timerRef.current);
      clearInterval(breathRef.current);
      setPhase('paused');
    } else if (phase === 'paused') {
      pausedRef.current = false;
      // Resume Cloud TTS audio
      if (_activeAudio && _activeAudio.paused) {
        _activeAudio.play().catch(() => {});
      }
      // Resume browser speechSynthesis
      try { window.speechSynthesis?.resume(); } catch {}
      // Restart timers
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      breathRef.current = setInterval(() => setBreathState(s => s === 'in' ? 'out' : 'in'), 4000);
      setPhase('playing');
    }
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const prog = Math.min(elapsed / meditation.durationSec * 100, 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex flex-col"
    style={{ background: 'linear-gradient(160deg, #0A1A2F 0%, #0A1A2F 40%, #2a4a6c 70%, #3C4E53 100%)' }}>
      
      {/* Breathing bg orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: breathState === 'in' ? 1.15 : 0.9, opacity: breathState === 'in' ? 0.12 : 0.06 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className="w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, ${meditation.accentColor}88 0%, transparent 70%)` }} />
        
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4">

      {/* Crisis Resources — required for App Store approval */}
      




        

        <button onClick={handleClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Guided Meditation</p>
          <p className="text-white font-bold text-sm mt-0.5">{meditation.title}</p>
        </div>
      </div>

      {/* Center */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          animate={{ scale: breathState === 'in' ? 1.1 : 1, y: breathState === 'in' ? -6 : 4 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className="text-7xl mb-10">
          {meditation.theme}</motion.div>

        <div className="min-h-28 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            {phase === 'loading' &&
            <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                <p className="text-white/50 text-sm">Preparing your session…</p>
              </motion.div>
            }
            {phase === 'done' &&
            <motion.div key="d" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <p className="text-4xl mb-3">🙏</p>
                <p className="text-white font-bold text-xl mb-1">Session complete</p>
                <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                  May you carry this peace throughout your day.
                </p>
              </motion.div>
            }
            {(phase === 'playing' || phase === 'paused') &&
            <motion.p key={currentText}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center text-lg font-light leading-relaxed max-w-xs">
              {currentText}</motion.p>
            }
          </AnimatePresence>
        </div>

        {/* Breath guide */}
        {(phase === 'playing' || phase === 'paused') &&
        <div className="flex items-center gap-3">
            <motion.div
            animate={{ scale: breathState === 'in' ? 1 : 0.7, opacity: breathState === 'in' ? 1 : 0.3 }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: meditation.accentColor }} />
          
            <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: `${meditation.accentColor}cc` }}>
              {breathState === 'in' ? 'Breathe in' : 'Breathe out'}
            </p>
            <motion.div
            animate={{ scale: breathState === 'out' ? 1 : 0.7, opacity: breathState === 'out' ? 1 : 0.3 }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: meditation.accentColor }} />
          
          </div>
        }
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-8 pb-12">
        <div className="mb-6">
          <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div className="h-full rounded-full" style={{ width: `${prog}%`, background: meditation.accentColor }} transition={{ duration: 1 }} />
          </div>
          <div className="flex justify-between text-xs text-white/30">
            <span>{fmt(elapsed)}</span><span>{meditation.duration}</span>
          </div>
        </div>

        {phase !== 'loading' && phase !== 'done' &&
        <div className="flex justify-center">
            <button onClick={togglePause}
          className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all">
              {phase === 'playing' ?
            <Pause className="w-7 h-7 text-white fill-white" /> :
            <Play className="w-7 h-7 text-white fill-white ml-1" />}
            </button>
          </div>
        }

        {phase === 'done' &&
        <button onClick={handleClose}
        className="w-full py-3.5 rounded-2xl bg-white/15 border border-white/20 text-white font-bold hover:bg-white/25 transition-colors">
            Close
          </button>
        }

        {script.length > 0 && phase !== 'done' &&
        <div className="flex justify-center gap-1 mt-5 flex-wrap">
            {script.map((_, i) =>
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i < currentSegment ? 'opacity-60' : i === currentSegment ? 'scale-125 opacity-100' : 'opacity-20'}`}
          style={{ background: i <= currentSegment ? meditation.accentColor : 'white' }} />
          )}
          </div>
        }
      </div>
    </motion.div>);

}

// ─── Meditation card ──────────────────────────────────────────────────────────
function MeditationCard({ med, isFav, isRecent, onPlay, onToggleFav, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] overflow-hidden group hover:shadow-md dark:shadow-none hover:border-[#FAD98D]/40 dark:border-[#FAD98D]/15 dark:border-[#FAD98D]/8 transition-all cursor-pointer"
      onClick={() => onPlay(med)}>
      
      {/* Gradient accent bar */}
      <div className={`h-1 bg-gradient-to-r ${med.gradient}`} />

      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{med.theme}</span>
            {isRecent &&
            <span className="text-[9px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-full">Played</span>
            }
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {e.stopPropagation();onToggleFav(med.id);}}
              className={`p-1 rounded-full transition-colors ${isFav ? 'text-amber-500' : 'text-[#0A1A2F]/20 dark:text-white/20 hover:text-amber-400'}`}>
              
              <StarIcon className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500' : ''}`} />
            </button>
            <span className="text-[10px] font-bold text-[#0A1A2F]/40 dark:text-white/40 bg-[#F2F6FA] dark:bg-[#0A1A2F] rounded-full px-2 py-0.5">
              {med.duration}
            </span>
          </div>
        </div>

        <h4 className="font-bold text-[#0A1A2F] dark:text-white text-sm leading-snug mb-1">{med.title}</h4>
        <p className="text-xs text-[#0A1A2F]/50 dark:text-white/50 leading-relaxed line-clamp-2 mb-3">{med.description}</p>

        {/* Play button */}
        <div className={`flex items-center gap-1.5 bg-gradient-to-r ${med.gradient} rounded-xl px-3 py-1.5 w-fit opacity-90 group-hover:opacity-100 transition-opacity`}>
          <Play className="w-3 h-3 text-white fill-white" />
          <span className="text-[11px] font-bold text-white">Begin</span>
        </div>
      </div>
    </motion.div>);

}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GuidedMeditationsPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [playing, setPlaying] = useState(null);
  const [favs, setFavs] = useState(loadFavs);
  const [history, setHistory] = useState(loadHistory);
  const [count, setCount] = useState(loadCount);

  const recommended = getRecommended();
  const timeLabel = getTimeLabel();

  // Refresh count/history after a session closes
  const handleClose = () => {
    setPlaying(null);
    setHistory(loadHistory());
    setCount(loadCount());
  };

  const toggleFav = (id) => {
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    setFavs(next);
    localStorage.setItem(FAVS_KEY, JSON.stringify(next));
  };

  const filtered = category === 'all' ?
  MEDITATIONS :
  MEDITATIONS.filter((m) => m.category === category);

  const recentIds = history.slice(0, 5).map((h) => h.id);
  const favMeds = MEDITATIONS.filter((m) => favs.includes(m.id));

  return (
    <>
      <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] pb-28">

        {/* ── Sticky header ─────────────────────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-white dark:bg-white/5 border-b border-[#F2F6FA] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-[#F2F6FA] dark:bg-[#0A1A2F] hover:bg-white dark:bg-white/5 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#0A1A2F] dark:text-white dark:text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-bold text-[#0A1A2F] dark:text-white dark:text-white">Guided Meditations</h1>
              <p className="text-xs text-[#0A1A2F]/45 dark:text-white/45">
                {count > 0 ? `${count} session${count !== 1 ? 's' : ''} completed · ` : ''}{MEDITATIONS.length} sessions available
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-[#FAD98D]/30 dark:border-[#FAD98D]/10 dark:border-[#FAD98D]/5 rounded-full px-2.5 py-1">
              <span className="text-[10px]">🎧</span>
              <span className="text-[10px] font-bold text-[#c9a227]">Use headphones</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-5 space-y-6">

          {/* ── Time-aware featured ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest">
                {timeLabel.label}
              </p>
              <p className="text-xs text-[#0A1A2F]/35 dark:text-white/35">{timeLabel.sub}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPlaying(recommended)}
              className={`w-full text-left bg-gradient-to-br ${recommended.gradient} rounded-3xl p-5 shadow-lg dark:shadow-none hover:opacity-95 transition-opacity`}>
              
              <div className="flex items-start gap-4">
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-5xl flex-shrink-0">
                  {recommended.theme}</motion.span>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-0.5">Recommended now</p>
                  <h2 className="text-white font-bold text-lg leading-snug mb-1">{recommended.title}</h2>
                  <p className="text-white/70 text-xs leading-relaxed mb-3">{recommended.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white/25 rounded-xl px-3 py-1.5">
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                      <span className="text-xs font-bold text-white">Begin · {recommended.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>

          {/* ── Favorites row ────────────────────────────────────────────── */}
          {favMeds.length > 0 &&
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">
                ⭐ Favorites
              </p>
              <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
                {favMeds.map((med) =>
              <motion.button
                key={med.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPlaying(med)}
                className={`flex-shrink-0 bg-gradient-to-br ${med.gradient} rounded-2xl p-3.5 w-36 text-left shadow-sm dark:shadow-none hover:shadow-md dark:shadow-none transition-shadow`}>
                
                    <span className="text-2xl block mb-2">{med.theme}</span>
                    <p className="text-white font-bold text-xs leading-snug truncate">{med.title}</p>
                    <p className="text-white/60 text-[10px] mt-0.5">{med.duration}</p>
                  </motion.button>
              )}
              </div>
            </motion.div>
          }

          {/* ── Category filter ───────────────────────────────────────────── */}
          <div>
            <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
              {CATEGORIES.map((cat, i) =>
              <motion.button 
               key={cat.id} 
               onClick={() => setCategory(cat.id)}
               whileHover={{ scale: 1.05, y: -2 }}
               whileTap={{ scale: 0.98 }}
               initial={{ opacity: 0, y: 8 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05, duration: 0.3 }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
              category === cat.id ?
              'bg-[#0A1A2F] text-white border-[#0A1A2F] shadow-md dark:shadow-lg dark:shadow-[#FAD98D]/20' :
              'bg-white dark:bg-white/5 text-[#0A1A2F]/50 dark:text-white/50 border-[#F2F6FA] dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:border-[#FAD98D]/40 dark:hover:border-[#FAD98D]/30 hover:shadow-sm'}`
              }>
                 <span className="transition-transform duration-300">{cat.emoji}</span>
                 {cat.label}
                 <motion.span 
                   initial={false}
                   animate={{ scale: category === cat.id ? 1.1 : 1 }}
                   className={`text-[9px] font-bold rounded-full px-1.5 py-0.5 transition-all duration-300 ${
                   category === cat.id ? 'bg-white/20' : 'bg-[#F2F6FA] dark:bg-[#0A1A2F]'}`
                   }>
                   {cat.id === 'all' ? MEDITATIONS.length : MEDITATIONS.filter((m) => m.category === cat.id).length}
                 </motion.span>
               </motion.button>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={category !== 'all' ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden">
              {category !== 'all' && (
                <p className="text-xs text-[#0A1A2F]/35 dark:text-white/35 mt-2 px-1">
                  {CATEGORIES.find((c) => c.id === category)?.desc}
                </p>
              )}
            </motion.div>
          </div>

          {/* ── Meditation grid ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((med, i) =>
            <MeditationCard
              key={med.id}
              med={med}
              isFav={favs.includes(med.id)}
              isRecent={recentIds.includes(med.id)}
              onPlay={setPlaying}
              onToggleFav={toggleFav}
              index={i} />

            )}
          </div>

          {/* ── Tips footer ───────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#F2F6FA] p-4">
            <p className="text-xs font-bold text-[#0A1A2F]/35 dark:text-white/35 uppercase tracking-widest mb-3">Getting the most from each session</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              {[
              { emoji: '🎧', label: 'Headphones', sub: 'Blocks ambient noise' },
              { emoji: '🪑', label: 'Still posture', sub: 'Sitting or lying down' },
              { emoji: '📵', label: 'Do Not Disturb', sub: 'No interruptions' }].
              map((t) =>
              <div key={t.label}>
                  <p className="text-xl mb-1">{t.emoji}</p>
                  <p className="text-[11px] font-bold text-[#0A1A2F] dark:text-white dark:text-white">{t.label}</p>
                  <p className="text-[10px] text-[#0A1A2F]/40 dark:text-white/40">{t.sub}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Player overlay ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {playing && <MeditationPlayer key={playing.id} meditation={playing} onClose={handleClose} />}
      </AnimatePresence>
    </>);

}