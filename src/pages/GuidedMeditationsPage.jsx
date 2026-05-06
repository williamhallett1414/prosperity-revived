import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, X, Loader2,
  Wind, Moon, Sun, Heart, BookOpen, Leaf, Flame, Star as StarIcon,
  Zap, Shield, Feather, Eye, Coffee, Cloud, Music, Sunrise,
  Waves, Anchor, Rainbow } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { MEDITATION_VOICE, findHannahVoice } from '@/utils/meditationVoice';
import { getMeditationScript } from '@/utils/meditationScripts';
import SerenityBackground, { BreathingCircle } from '@/components/meditations/SerenityBackground';
import MeditationPlayerBackground from '@/components/meditations/MeditationPlayerBackground';

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

/**
 * iOS / Capacitor WKWebView locks audio playback until a user gesture
 * fires. Once unlocked, both <audio> and SpeechSynthesis are free to play.
 * Call this from a click handler (the Begin button) to play a tiny silent
 * buffer that satisfies the gesture requirement. Subsequent audio plays
 * without further interaction. Idempotent — only runs once per session.
 */
let _audioUnlocked = false;
function unlockAudioContext() {
  if (_audioUnlocked) return;
  _audioUnlocked = true;
  try {
    // 1. Unlock <audio> via a silent data-URI MP3 (44 bytes, 0.001s)
    const silent = new Audio(
      'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID/////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAnE6f8VkAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxFqDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxLkDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxP+DwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
    );
    silent.volume = 0;
    const p = silent.play();
    if (p?.then) p.then(() => {}, () => {});
  } catch {}
  try {
    // 2. Unlock SpeechSynthesis: iOS requires a real utterance call
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
  } catch {}
}

/**
 * Voice prewarming. window.speechSynthesis.getVoices() is async on most
 * browsers — it returns [] on first call and populates later via the
 * 'voiceschanged' event. If we just call getVoices() at speak-time on a
 * fresh page, we'll find no voices and fall back to an arbitrary default
 * (often a male system voice that doesn't match Hannah).
 *
 * This module-level singleton kicks off the voice load early and caches
 * the result. By the time the first segment plays, voices are usually
 * populated.
 */
let _cachedVoices = [];
let _voicesPromise = null;
function ensureVoicesLoaded() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve([]);
  if (_voicesPromise) return _voicesPromise;
  _voicesPromise = new Promise((resolve) => {
    const got = window.speechSynthesis.getVoices();
    if (got && got.length > 0) {
      _cachedVoices = got;
      resolve(got);
      return;
    }
    // Listen for voiceschanged. Some browsers fire this immediately;
    // others take 100-500ms. Resolve at first non-empty result.
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        _cachedVoices = v;
        window.speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve(v);
      }
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    // Timeout fallback: never block forever, just give up after 1.5s
    setTimeout(() => {
      const v = window.speechSynthesis.getVoices() || [];
      _cachedVoices = v;
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(v);
    }, 1500);
  });
  return _voicesPromise;
}

/**
 * speakSegment — play one segment of the meditation script.
 * Tries Hannah's Google Cloud TTS first, falls back to browser
 * SpeechSynthesis with a Hannah-like voice. If both fail, signals
 * the caller via onAudioState so the player can show a degraded
 * "text-only mode" banner instead of going silent.
 *
 * Returns a Promise that resolves when the segment is done speaking
 * (or fails) so the run loop can move to the pause phase.
 *
 * @param {string} text
 * @param {React.MutableRefObject} audioRef - holds the live <audio> for pause/stop
 * @param {(state: 'cloud-ok'|'fallback-ok'|'all-failed') => void} [onAudioState]
 *        Called once per segment with the result so the UI can react.
 */
const speakSegment = (text, audioRef, onAudioState) => new Promise(async (resolve) => {
  const cleaned = text
    .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '').replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim().slice(0, 4500);

  if (!cleaned) { resolve(); return; }

  // Path 1: Hannah's Google Cloud TTS
  let cloudFailed = false;
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
      // Apply MEDITATION_VOICE.volume — Blob audio doesn't read it otherwise.
      // 0.93 (intimate, not loud) matches the rest of Hannah's voice profile.
      audio.volume = MEDITATION_VOICE.volume;
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve(); };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        console.warn('[Meditation] Cloud audio playback error');
        resolve();
      };
      try {
        await audio.play();
        // Diagnostic so we can verify Hannah TTS is reaching the device
        if (typeof console !== 'undefined') console.info('[Meditation] Hannah cloud TTS ▶');
        onAudioState?.('cloud-ok');
        return;
      } catch (playErr) {
        // play() can reject on iOS without a prior user gesture, or if the
        // tab is backgrounded. Fall through to the SpeechSynthesis path.
        console.warn('[Meditation] Cloud audio.play() rejected:', playErr?.message || playErr);
        URL.revokeObjectURL(url);
        audioRef.current = null;
        cloudFailed = true;
      }
    } else {
      // Cloud function returned no audio (server-side issue, quota, etc.)
      console.warn('[Meditation] hannahTTS returned no audioContent');
      cloudFailed = true;
    }
  } catch (err) {
    console.warn('[Meditation] hannahTTS invoke failed:', err?.message || err);
    cloudFailed = true;
  }

  // Path 2: Browser SpeechSynthesis fallback
  if (!window.speechSynthesis) {
    console.warn('[Meditation] No speechSynthesis available — text only');
    onAudioState?.('all-failed');
    resolve();
    return;
  }

  try {
    const voices = await ensureVoicesLoaded();
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(cleaned);
    utter.rate = MEDITATION_VOICE.rate;
    utter.pitch = MEDITATION_VOICE.pitch;
    utter.volume = MEDITATION_VOICE.volume;
    const preferred = findHannahVoice(voices);
    if (preferred) {
      utter.voice = preferred;
      console.info(`[Meditation] Fallback voice: ${preferred.name}`);
    } else {
      console.warn('[Meditation] No suitable fallback voice found');
    }
    let resolved = false;
    const finish = () => { if (!resolved) { resolved = true; resolve(); } };
    utter.onend = finish;
    utter.onerror = (e) => {
      console.warn('[Meditation] SpeechSynthesis error:', e?.error || e);
      finish();
    };
    window.speechSynthesis.speak(utter);
    onAudioState?.(cloudFailed ? 'fallback-ok' : 'fallback-ok');
    // Safety timeout — if speechSynthesis silently drops the utterance
    // (a known iOS/Chrome issue), don't hang the player forever.
    setTimeout(finish, Math.max(3000, cleaned.length * 90));
  } catch (e) {
    console.warn('[Meditation] Fallback speak threw:', e);
    onAudioState?.('all-failed');
    resolve();
  }
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Full-screen player overlay ───────────────────────────────────────────────
function MeditationPlayer({ meditation, onClose }) {
  // 'loading' is now nearly instant — just one render cycle while the
  // static script is fetched. Kept for code clarity and the brief
  // moment of transition into 'playing'.
  const [phase, setPhase] = useState('loading');
  const [script, setScript] = useState([]);
  const [currentSegment, setCurrentSeg] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [breathState, setBreathState] = useState('in');
  // 'cloud-ok' = Hannah cloud TTS playing; 'fallback-ok' = browser
  // SpeechSynthesis playing; 'all-failed' = both audio paths failed,
  // user is in text-only mode.
  const [audioState, setAudioState] = useState(null);

  const pausedRef = useRef(false);
  const stoppedRef = useRef(false);
  const timerRef = useRef(null);
  const breathRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Prewarm the speech synthesis voice list early. On most browsers
    // getVoices() returns [] until 'voiceschanged' fires — kicking it off
    // here means by the time the first segment plays, voices are populated.
    ensureVoicesLoaded();
    // Unlock audio playback. The user clicked the meditation card to get
    // here — that's a valid gesture for iOS audio. Calling unlock NOW
    // (still inside the gesture's microtask chain in some browsers, but
    // also valid from the mount handler in WKWebView) means the silent
    // primer plays before the first cloud TTS request.
    unlockAudioContext();

    run();
    return () => {
      stoppedRef.current = true;
      if (audioRef.current) { try { audioRef.current.pause(); audioRef.current.src = ''; } catch {} }
      window.speechSynthesis?.cancel();
      clearInterval(timerRef.current);
      clearInterval(breathRef.current);
    };
  }, []);

  const run = async () => {
    stoppedRef.current = false; pausedRef.current = false;

    // Pre-authored script per meditation id — instant load, zero LLM
    // latency, consistent spiritual quality. The previous implementation
    // sent meditation.prompt to InvokeLLM and waited 5-15s for a JSON
    // response, blocking the user behind a "Preparing your session…"
    // spinner. Static scripts eliminate that wait entirely.
    const segments = getMeditationScript(meditation.id);

    setScript(segments); setPhase('playing');

    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    breathRef.current = setInterval(() => setBreathState((s) => s === 'in' ? 'out' : 'in'), 4000);

    // Track the most recent audio-state result so the UI can surface
    // a "text-only" banner if both Hannah TTS and the browser fallback
    // fail. Only the most recent state matters; we don't need history.
    const onAudioState = (state) => setAudioState(state);

    for (let i = 0; i < segments.length; i++) {
      if (stoppedRef.current) break;
      while (pausedRef.current && !stoppedRef.current) await sleep(200);
      if (stoppedRef.current) break;
      setCurrentSeg(i); setCurrentText(segments[i].text);
      await speakSegment(segments[i].text, audioRef, onAudioState);
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
      clearInterval(timerRef.current); clearInterval(breathRef.current);

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
      if (audioRef.current && !audioRef.current.paused) {
        try { audioRef.current.pause(); } catch {}
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
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
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
    style={{ background: '#0a1024' }}>
      {/* Nature-themed ambient layer. Themed by meditation.category:
          morning -> sunrise + rays + golden particles
          calm    -> ocean waves + drifting leaves
          faith   -> warm dawn glow + slow particles
          heal    -> soft rose with falling petals
          focus   -> clear sky with drifting clouds
          sleep   -> deep night with twinkling stars
          The breathing orb (below) sits in front of this layer so it
          remains the visual focal point during the session. */}
      <MeditationPlayerBackground category={meditation.category} />

      {/* Breathing bg orb — stays in front of the nature scene as the
          main focal point, tinted by the meditation's accentColor. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
        <motion.div
          animate={{ scale: breathState === 'in' ? 1.15 : 0.9, opacity: breathState === 'in' ? 0.18 : 0.10 }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className="w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(circle, ${meditation.accentColor}aa 0%, transparent 70%)` }} />
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-5 pt-12 pb-4" style={{ zIndex: 10 }}>

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
                <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
                <p className="text-white/50 text-sm">Settling in…</p>
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

        {/* Text-only-mode banner.
            Surfaces only when both Hannah cloud TTS AND the browser
            SpeechSynthesis fallback have failed. Without this banner,
            audio failure was completely silent — the user saw text
            appear and disappear with no indication that audio was
            supposed to be playing. */}
        {audioState === 'all-failed' && (phase === 'playing' || phase === 'paused') && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 mx-6 px-4 py-2.5 rounded-2xl text-center"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <p className="text-white/70 text-[11px] leading-relaxed">
              Audio is unavailable on this device — read along at your own pace.
            </p>
          </motion.div>
        )}

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
      {/* Bottom padding clears the Layout's fixed bottom tab bar
          (Home/Wellness/Bible/Community/Profile, ~75px tall on iPhone +
          safe-area-inset-bottom for the home indicator). The progress
          bar and play/pause button sit above the nav, not behind it. */}
      <div
        className="relative z-10 px-8"
        style={{ paddingBottom: 'calc(8rem + env(safe-area-inset-bottom))' }}
      >
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
      onClick={() => onPlay(med)}
      className="rounded-2xl overflow-hidden cursor-pointer transition-all active:scale-[0.99]"
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        border: '1px solid rgba(132, 169, 140, 0.18)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="p-4">
        {/* Top row — emoji + favorite + duration. No colored stripe; the
            visual is unified rather than each card screaming a different
            gradient color. */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl leading-none">{med.theme}</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFav(med.id); }}
              className={`p-1 rounded-full transition-colors ${
                isFav ? 'text-amber-500' : 'text-[#0A1A2F]/15 hover:text-amber-400'
              }`}
              aria-label={isFav ? 'Unfavorite' : 'Favorite'}
            >
              <StarIcon className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500' : ''}`} />
            </button>
            <span
              className="text-[10px] font-semibold rounded-full px-2 py-0.5 tabular-nums"
              style={{ background: 'rgba(132, 169, 140, 0.10)', color: '#3a5443' }}
            >
              {med.duration}
            </span>
          </div>
        </div>

        <h4
          className="text-[15px] leading-snug mb-1"
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontWeight: 600,
            color: '#0A1A2F',
          }}
        >
          {med.title}
        </h4>
        <p
          className="text-[12px] leading-relaxed line-clamp-2 mb-3"
          style={{ color: 'rgba(10, 26, 47, 0.60)' }}
        >
          {med.description}
        </p>

        {/* Quiet Begin row — small chip rather than a gradient button.
            The gradient Begin felt too loud for a meditation card. */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{
              background: 'rgba(132, 169, 140, 0.12)',
              border: '1px solid rgba(132, 169, 140, 0.20)',
            }}
          >
            <Play className="w-2.5 h-2.5 fill-current" style={{ color: '#3a5443' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#3a5443' }}>Begin</span>
          </div>
          {isRecent && (
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(132, 169, 140, 0.10)', color: '#3a5443' }}
            >
              ✓ Played
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

class PageErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0A1A2F] flex flex-col items-center justify-center p-6 text-center">
          <p className="text-lg font-bold text-[#0A1A2F] dark:text-white mb-2">Something went wrong</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This page encountered an error.</p>
          <button onClick={() => this.setState({ error: null })} className="px-4 py-2 bg-[#c9a227] text-white rounded-xl text-sm font-bold">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function GuidedMeditationsPageInner() {
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
      {/* Outer page bg is white so any peek-through above the inner gray
          card area is invisible (matches the FoodLogHistory gray-gap fix
          from commit 38b2c561 and the same surgery applied to several
          other pages). */}
      <div className="min-h-screen relative pb-28" style={{ background: '#f7faf6' }}>
        {/* Soft serenity ambient layer — distinct from RadiantBackground
            (Affirmations) and SanctuaryBackground (Prayer). Sage/cream
            base wash + slow ripple lines. The breathing circle on the
            hero is rendered separately so it can sit inside the card. */}
        <SerenityBackground />

        <div className="relative" style={{ zIndex: 1 }}>

          {/* ── Top bar — minimal, scrolls with content (no sticky).
              Sticky headers fight a meditation page for focus. */}
          <div className="max-w-2xl mx-auto px-4 pt-3 pb-2 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'rgba(58, 84, 67, 0.85)' }}>
                {timeLabel.label}
              </p>
              <h1
                className="text-base"
                style={{
                  fontFamily: '\"Cormorant Garamond\", Georgia, serif',
                  fontWeight: 600,
                  color: '#0A1A2F',
                  letterSpacing: '-0.005em',
                }}
              >
                {timeLabel.sub}
              </h1>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(132, 169, 140, 0.25)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <span className="text-[10px]">🎧</span>
              <span className="text-[10px] font-semibold" style={{ color: '#3a5443' }}>Use headphones</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">

            {/* ── Hero — recommended session with breathing circle.
                The circle slowly inhales/exhales at a 16s pace (4-4-4-4
                box-breath). User naturally syncs while reading. The
                emoji and title are layered above the circle. */}
            <motion.button
              onClick={() => setPlaying(recommended)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="block w-full rounded-[28px] overflow-hidden relative active:scale-[0.99] transition-transform"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(238,244,238,0.65) 100%)',
                border: '1px solid rgba(132, 169, 140, 0.22)',
                backdropFilter: 'blur(8px)',
                minHeight: 240,
              }}
            >
              {/* Breathing circle, centered, behind the text. Sized large
                  enough to feel like the hero's centerpiece. */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <BreathingCircle size={260} />
              </div>

              <div className="relative px-6 pt-8 pb-6 text-center">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3"
                  style={{ color: 'rgba(58, 84, 67, 0.85)' }}
                >
                  Recommended now
                </p>
                <p className="text-4xl mb-3 leading-none">
                  {recommended.theme}
                </p>
                <h2
                  className="mb-3 leading-tight"
                  style={{
                    fontFamily: '\"Cormorant Garamond\", Georgia, serif',
                    fontSize: 'clamp(22px, 5.5vw, 28px)',
                    fontWeight: 500,
                    color: '#0A1A2F',
                    letterSpacing: '-0.005em',
                  }}
                >
                  {recommended.title}
                </h2>
                <p
                  className="text-[13px] leading-relaxed mb-5 max-w-sm mx-auto"
                  style={{ color: 'rgba(10, 26, 47, 0.65)' }}
                >
                  {recommended.description}
                </p>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(132,169,140,0.95), rgba(106,143,116,0.95))',
                    boxShadow: '0 4px 14px -4px rgba(132,169,140,0.4)',
                  }}
                >
                  <Play className="w-3.5 h-3.5 text-white fill-white" />
                  <span className="text-xs font-semibold text-white">
                    Begin · {recommended.duration}
                  </span>
                </div>
              </div>
            </motion.button>

            {/* ── Favorites row (only when present) ── */}
            {favMeds.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3 px-1"
                  style={{ color: 'rgba(58, 84, 67, 0.75)' }}
                >
                  ⭐ Your favorites
                </p>
                <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
                  {favMeds.map((med) => (
                    <button
                      key={med.id}
                      onClick={() => setPlaying(med)}
                      className="flex-shrink-0 rounded-2xl p-3.5 w-36 text-left transition-all active:scale-95"
                      style={{
                        background: 'rgba(255,255,255,0.75)',
                        border: '1px solid rgba(132, 169, 140, 0.22)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl leading-none">{med.theme}</span>
                        <span
                          className="text-[10px] font-semibold rounded-full px-1.5 py-0.5"
                          style={{ background: 'rgba(132,169,140,0.10)', color: '#3a5443' }}
                        >
                          {med.duration}
                        </span>
                      </div>
                      <p
                        className="leading-snug"
                        style={{
                          fontFamily: '\"Cormorant Garamond\", Georgia, serif',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#0A1A2F',
                        }}
                      >
                        {med.title}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Category pills + count ── */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: 'rgba(58, 84, 67, 0.75)' }}
                >
                  Browse all
                </p>
                <p className="text-[10px]" style={{ color: 'rgba(10, 26, 47, 0.40)' }}>
                  {count > 0 ? `${count} completed · ` : ''}{MEDITATIONS.length} sessions
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold flex-shrink-0 transition-all min-h-[44px]"
                      style={
                        isActive
                          ? {
                              background: 'linear-gradient(135deg, rgba(132,169,140,0.95), rgba(106,143,116,0.95))',
                              color: 'white',
                              border: '1px solid transparent',
                            }
                          : {
                              background: 'rgba(255,255,255,0.75)',
                              color: '#3a5443',
                              border: '1px solid rgba(132, 169, 140, 0.22)',
                            }
                      }
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                      <span
                        className="text-[9px] font-bold rounded-full px-1.5 py-0.5"
                        style={
                          isActive
                            ? { background: 'rgba(255,255,255,0.20)' }
                            : { background: 'rgba(132,169,140,0.12)', color: '#3a5443' }
                        }
                      >
                        {cat.id === 'all' ? MEDITATIONS.length : MEDITATIONS.filter((m) => m.category === cat.id).length}
                      </span>
                    </button>
                  );
                })}
              </div>
              {category !== 'all' && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[11px] italic mt-2 px-1"
                  style={{ color: 'rgba(10, 26, 47, 0.55)', fontFamily: '\"Cormorant Garamond\", Georgia, serif' }}
                >
                  {CATEGORIES.find((c) => c.id === category)?.desc}
                </motion.p>
              )}
            </div>

            {/* ── Meditation grid ── */}
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((med, i) => (
                <MeditationCard
                  key={med.id}
                  med={med}
                  isFav={favs.includes(med.id)}
                  isRecent={recentIds.includes(med.id)}
                  onPlay={setPlaying}
                  onToggleFav={toggleFav}
                  index={i}
                />
              ))}
            </div>

            {/* ── Tips footer — quieter than before ── */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(132, 169, 140, 0.18)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3"
                style={{ color: 'rgba(58, 84, 67, 0.70)' }}
              >
                For the deepest stillness
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { emoji: '🎧', label: 'Headphones',   sub: 'Blocks noise' },
                  { emoji: '🪑', label: 'Still posture', sub: 'Sit or lie' },
                  { emoji: '📵', label: 'Do Not Disturb', sub: 'No interruptions' },
                ].map((t) => (
                  <div key={t.label}>
                    <p className="text-xl mb-1">{t.emoji}</p>
                    <p
                      className="text-[11px] font-semibold"
                      style={{ color: '#0A1A2F' }}
                    >{t.label}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(10, 26, 47, 0.45)' }}>{t.sub}</p>
                  </div>
                ))}
              </div>
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

export default function GuidedMeditationsPage(props) {
  return <PageErrorBoundary><GuidedMeditationsPageInner {...props} /></PageErrorBoundary>;
}
