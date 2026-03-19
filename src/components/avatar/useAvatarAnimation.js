/**
 * useAvatarAnimation — Shared animation engine for all 5 chatbot avatars.
 * 
 * Provides personality-driven blinking, multi-layer mouth movement,
 * and layered idle gestures. All driven by requestAnimationFrame
 * for smooth 60fps performance.
 * 
 * Usage:
 *   const anim = useAvatarAnimation('gideon', { isSpeaking, isListening, isThinking });
 *   // anim.blinkProgress  — 0.0 (open) to 1.0 (closed)
 *   // anim.mouthOpen      — 0.0 (closed) to 1.0 (fully open)
 *   // anim.idleBreathing  — 0.0 to 1.0 (breathing cycle phase)
 *   // anim.idleFloat      — px offset for translateY
 *   // anim.idleTilt       — degrees for rotate()
 *   // anim.idleShift      — px offset for translateX
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Personality Profiles ──────────────────────────────────────────────────────
const PROFILES = {
  gideon: {
    // Blink: slow, thoughtful — ancient wisdom, unhurried
    blink: {
      intervalMin: 4000, intervalMax: 7000,
      closeDuration: 80, openDuration: 180,
      doubleBlink: 0.05, speakingRate: 1.2,
    },
    // Mouth: measured, deliberate — every word has weight
    mouth: {
      phrasePeriod: 1.4, syllableFreq: 4.2,
      pauseMin: 400, pauseMax: 700, pauseChance: 0.12,
      maxOpen: 0.75, widthVar: 0.08, noise: 0.10,
    },
    // Idle: ancient stillness — barely moves
    idle: {
      breathDur: 5.4, breathScale: 0.006,
      floatDur: 6.8, floatAmp: 4,
      tiltDur: 12, tiltDeg: 0.6,
      shiftDur: 16, shiftAmp: 1,
    },
  },
  hannah: {
    // Blink: soft, warm — comforting presence
    blink: {
      intervalMin: 3000, intervalMax: 5500,
      closeDuration: 70, openDuration: 160,
      doubleBlink: 0.12, speakingRate: 1.1,
    },
    // Mouth: soft, rounded — gentle speech
    mouth: {
      phrasePeriod: 1.2, syllableFreq: 5.0,
      pauseMin: 300, pauseMax: 500, pauseChance: 0.10,
      maxOpen: 0.85, widthVar: 0.12, noise: 0.12,
    },
    idle: {
      breathDur: 4.6, breathScale: 0.008,
      floatDur: 5.2, floatAmp: 6,
      tiltDur: 8, tiltDeg: 1.2,
      shiftDur: 11, shiftAmp: 2,
    },
  },
  coach: { // Coach David
    // Blink: sharp, energetic — alert and driven
    blink: {
      intervalMin: 2000, intervalMax: 4000,
      closeDuration: 45, openDuration: 90,
      doubleBlink: 0.18, speakingRate: 1.5,
    },
    // Mouth: crisp, punchy — fast-talking motivator
    mouth: {
      phrasePeriod: 0.8, syllableFreq: 6.5,
      pauseMin: 150, pauseMax: 300, pauseChance: 0.08,
      maxOpen: 1.0, widthVar: 0.10, noise: 0.08,
    },
    idle: {
      breathDur: 3.8, breathScale: 0.010,
      floatDur: 4.2, floatAmp: 3,
      tiltDur: 6, tiltDeg: 0.8,
      shiftDur: 8, shiftAmp: 1.5,
    },
  },
  chef: { // Chef Daniel
    // Blink: friendly, expressive — lively and warm
    blink: {
      intervalMin: 2500, intervalMax: 5000,
      closeDuration: 55, openDuration: 120,
      doubleBlink: 0.15, speakingRate: 1.3,
    },
    // Mouth: expressive, lively — food enthusiasm
    mouth: {
      phrasePeriod: 1.0, syllableFreq: 5.8,
      pauseMin: 200, pauseMax: 400, pauseChance: 0.10,
      maxOpen: 0.90, widthVar: 0.15, noise: 0.18,
    },
    idle: {
      breathDur: 4.2, breathScale: 0.009,
      floatDur: 4.8, floatAmp: 5,
      tiltDur: 7, tiltDeg: 1.5,
      shiftDur: 9, shiftAmp: 2.5,
    },
  },
  paul: { // Coach Paul
    // Blink: calm, steady — grounded authority
    blink: {
      intervalMin: 3500, intervalMax: 6500,
      closeDuration: 75, openDuration: 170,
      doubleBlink: 0.08, speakingRate: 1.0,
    },
    // Mouth: calm, steady — deliberate pastor
    mouth: {
      phrasePeriod: 1.3, syllableFreq: 4.5,
      pauseMin: 350, pauseMax: 600, pauseChance: 0.12,
      maxOpen: 0.72, widthVar: 0.06, noise: 0.08,
    },
    idle: {
      breathDur: 5.0, breathScale: 0.007,
      floatDur: 6.2, floatAmp: 4,
      tiltDur: 10, tiltDeg: 0.5,
      shiftDur: 14, shiftAmp: 1,
    },
  },
};

// ─── Easing Functions ──────────────────────────────────────────────────────────
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Simple seeded noise (deterministic per-frame variation)
function noise(t, seed) {
  const x = Math.sin(t * 12.9898 + seed * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1; // -1 to 1
}

// ─── The Hook ──────────────────────────────────────────────────────────────────
export default function useAvatarAnimation(character = 'gideon', { isSpeaking = false, isListening = false, isThinking = false } = {}) {
  const profile = PROFILES[character] || PROFILES.gideon;
  const { blink: B, mouth: M, idle: I } = profile;

  // ── Blink State ──
  const [blinkProgress, setBlinkProgress] = useState(0);
  const blinkPhaseRef = useRef('open'); // 'open' | 'closing' | 'opening' | 'waiting'
  const blinkStartRef = useRef(0);
  const blinkNextRef = useRef(0);
  const blinkDoubleRef = useRef(false);

  // ── Mouth State ──
  const [mouthOpen, setMouthOpen] = useState(0);
  const mouthDecayRef = useRef(0); // for fade-out when speech stops
  const mouthPauseRef = useRef(false);
  const mouthPauseEndRef = useRef(0);

  // ── Idle State ──
  const [idleFloat, setIdleFloat] = useState(0);
  const [idleTilt, setIdleTilt] = useState(0);
  const [idleShift, setIdleShift] = useState(0);
  const [idleBreathing, setIdleBreathing] = useState(0);

  // ── Previous speaking state (for fade-out detection) ──
  const wasSpeakingRef = useRef(false);
  const rafRef = useRef(null);

  const animate = useCallback((timestamp) => {
    const t = timestamp / 1000; // seconds
    const now = Date.now();

    // ════════════════════════════════════════════════════════════
    // BLINK SYSTEM
    // ════════════════════════════════════════════════════════════
    const blinkInterval = isSpeaking
      ? (B.intervalMin / B.speakingRate) + Math.random() * ((B.intervalMax - B.intervalMin) / B.speakingRate)
      : B.intervalMin + Math.random() * (B.intervalMax - B.intervalMin);

    if (blinkPhaseRef.current === 'open') {
      if (now >= blinkNextRef.current) {
        blinkPhaseRef.current = 'closing';
        blinkStartRef.current = now;
        blinkDoubleRef.current = Math.random() < B.doubleBlink;
      }
      setBlinkProgress(0);
    } else if (blinkPhaseRef.current === 'closing') {
      const elapsed = now - blinkStartRef.current;
      const progress = Math.min(1, elapsed / B.closeDuration);
      setBlinkProgress(easeInOutCubic(progress));
      if (progress >= 1) {
        blinkPhaseRef.current = 'opening';
        blinkStartRef.current = now;
      }
    } else if (blinkPhaseRef.current === 'opening') {
      const elapsed = now - blinkStartRef.current;
      const progress = Math.min(1, elapsed / B.openDuration);
      setBlinkProgress(1 - easeInOutCubic(progress));
      if (progress >= 1) {
        if (blinkDoubleRef.current) {
          // Double blink: go back to closing immediately
          blinkDoubleRef.current = false;
          blinkPhaseRef.current = 'closing';
          blinkStartRef.current = now + 60; // tiny gap between double blinks
        } else {
          blinkPhaseRef.current = 'open';
          blinkNextRef.current = now + blinkInterval;
        }
      }
    }

    // ════════════════════════════════════════════════════════════
    // MOUTH SYSTEM (3-layer)
    // ════════════════════════════════════════════════════════════
    if (isSpeaking) {
      wasSpeakingRef.current = true;

      // Check for phrase pauses
      if (mouthPauseRef.current) {
        if (now >= mouthPauseEndRef.current) {
          mouthPauseRef.current = false;
        } else {
          // During pause, decay mouth closed
          mouthDecayRef.current = Math.max(0, mouthDecayRef.current * 0.88);
          setMouthOpen(mouthDecayRef.current);
          rafRef.current = requestAnimationFrame(animate);
          return;
        }
      }

      // Layer 1: Phrase envelope (slow amplitude contour)
      const phraseEnv = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 / M.phrasePeriod);

      // Layer 2: Syllable rhythm (fast open-close)
      const syllable = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * M.syllableFreq);

      // Layer 3: Noise variation
      const n = noise(t, 42) * M.noise;

      // Combined
      const raw = phraseEnv * syllable * (1 + n) * M.maxOpen;
      const clamped = Math.max(0, Math.min(1, raw));

      // Random pause trigger
      if (Math.random() < M.pauseChance / 60) { // per-frame probability
        mouthPauseRef.current = true;
        mouthPauseEndRef.current = now + M.pauseMin + Math.random() * (M.pauseMax - M.pauseMin);
      }

      mouthDecayRef.current = clamped;
      setMouthOpen(clamped);
    } else {
      // Fade-out when speech stops
      if (wasSpeakingRef.current) {
        if (mouthDecayRef.current > 0.02) {
          mouthDecayRef.current *= 0.85;
          setMouthOpen(mouthDecayRef.current);
        } else {
          mouthDecayRef.current = 0;
          setMouthOpen(0);
          wasSpeakingRef.current = false;
        }
      }
    }

    // ════════════════════════════════════════════════════════════
    // IDLE SYSTEM (4 independent layers)
    // ════════════════════════════════════════════════════════════
    // Breathing: subtle scaleY pulse
    const breathPhase = Math.sin(t * Math.PI * 2 / I.breathDur);
    setIdleBreathing(breathPhase * 0.5 + 0.5); // 0 to 1

    // Float: vertical movement
    const floatPhase = Math.sin(t * Math.PI * 2 / I.floatDur);
    setIdleFloat(floatPhase * I.floatAmp * -1); // negative = upward

    // Head tilt: micro rotation (use different phase to prevent sync)
    const tiltPhase = Math.sin(t * Math.PI * 2 / I.tiltDur + 1.7);
    setIdleTilt(tiltPhase * I.tiltDeg);

    // Weight shift: horizontal drift
    const shiftPhase = Math.sin(t * Math.PI * 2 / I.shiftDur + 3.1);
    setIdleShift(shiftPhase * I.shiftAmp);

    rafRef.current = requestAnimationFrame(animate);
  }, [isSpeaking, isListening, isThinking, B, M, I]);

  // Start/stop animation loop
  useEffect(() => {
    // Initialize next blink time
    blinkNextRef.current = Date.now() + B.intervalMin + Math.random() * (B.intervalMax - B.intervalMin);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, B]);

  return {
    blinkProgress,  // 0.0 (open) → 1.0 (closed)
    mouthOpen,      // 0.0 (closed) → 1.0 (fully open)
    idleFloat,      // px offset for translateY
    idleTilt,       // degrees for rotate()
    idleShift,      // px offset for translateX
    idleBreathing,  // 0.0 → 1.0 cycle phase (use for scaleY)
  };
}

// Export profiles for use in avatar components
export { PROFILES };
