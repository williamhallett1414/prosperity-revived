/**
 * useAvatarAnimation v2 — Complete rewrite with conservative, realistic values.
 *
 * DESIGN PRINCIPLES:
 *   1. All movement stays subtle and human-like
 *   2. Idle gestures run ALWAYS (not just in idle state) — breathing never stops
 *   3. Blink is a fast, smooth close/open with natural timing
 *   4. Mouth movement is primarily vertical, within tight limits
 *   5. No value ever produces visible distortion of the 2D artwork
 *
 * Returns:
 *   blinkProgress  — 0.0 (eyes open) to 1.0 (eyes closed)
 *   mouthOpen      — 0.0 (closed) to 1.0 (max open, mapped to conservative pixel values)
 *   breathPhase    — 0.0 to 1.0 (continuous breathing cycle)
 *   floatY         — pixels, vertical idle drift (always active)
 *   tiltDeg        — degrees, micro head tilt (always active)
 *   shiftX         — pixels, horizontal micro drift (always active)
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Per-Character Profiles ────────────────────────────────────────────────────
// Conservative values only. Nothing here should produce visible distortion.
const PROFILES = {
  gideon: {
    blink: { minInterval: 3500, maxInterval: 6500, closeDur: 80, openDur: 160, doublePct: 0.06 },
    mouth: { speed: 0.22, depthScale: 0.65, pauseChance: 0.003, pauseDur: 500 },
    idle:  { breathDur: 5.2, floatDur: 7.0, floatAmp: 3, tiltDur: 14, tiltAmp: 0.4, shiftDur: 18, shiftAmp: 0.8 },
  },
  hannah: {
    blink: { minInterval: 2800, maxInterval: 5200, closeDur: 65, openDur: 140, doublePct: 0.10 },
    mouth: { speed: 0.26, depthScale: 0.75, pauseChance: 0.003, pauseDur: 400 },
    idle:  { breathDur: 4.4, floatDur: 5.6, floatAmp: 4, tiltDur: 9, tiltAmp: 0.8, shiftDur: 13, shiftAmp: 1.2 },
  },
  coach: {
    blink: { minInterval: 2000, maxInterval: 3800, closeDur: 50, openDur: 85, doublePct: 0.15 },
    mouth: { speed: 0.32, depthScale: 0.85, pauseChance: 0.002, pauseDur: 250 },
    idle:  { breathDur: 3.6, floatDur: 4.4, floatAmp: 2, tiltDur: 7, tiltAmp: 0.5, shiftDur: 10, shiftAmp: 1.0 },
  },
  chef: {
    blink: { minInterval: 2500, maxInterval: 4800, closeDur: 55, openDur: 110, doublePct: 0.12 },
    mouth: { speed: 0.28, depthScale: 0.80, pauseChance: 0.003, pauseDur: 350 },
    idle:  { breathDur: 4.0, floatDur: 5.0, floatAmp: 3.5, tiltDur: 8, tiltAmp: 1.0, shiftDur: 11, shiftAmp: 1.5 },
  },
  paul: {
    blink: { minInterval: 3200, maxInterval: 6000, closeDur: 70, openDur: 150, doublePct: 0.07 },
    mouth: { speed: 0.24, depthScale: 0.68, pauseChance: 0.003, pauseDur: 480 },
    idle:  { breathDur: 4.8, floatDur: 6.4, floatAmp: 3, tiltDur: 12, tiltAmp: 0.35, shiftDur: 16, shiftAmp: 0.7 },
  },
};

// Smooth ease-in-out for blink curve
function easeIO(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

export default function useAvatarAnimation(character = 'gideon', { isSpeaking = false, isListening = false, isThinking = false } = {}) {
  const P = PROFILES[character] || PROFILES.gideon;

  // ── State ──
  const [blinkProgress, setBlinkProgress] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [breathPhase, setBreathPhase] = useState(0);
  const [floatY, setFloatY] = useState(0);
  const [tiltDeg, setTiltDeg] = useState(0);
  const [shiftX, setShiftX] = useState(0);

  // ── Refs for timing ──
  const rafRef = useRef(null);
  const blinkState = useRef('waiting'); // 'waiting' | 'closing' | 'opening'
  const blinkTimer = useRef(Date.now() + P.blink.minInterval + Math.random() * (P.blink.maxInterval - P.blink.minInterval));
  const blinkStart = useRef(0);
  const doDouble = useRef(false);
  const mouthDecay = useRef(0);
  const wasSpeaking = useRef(false);
  const mouthPaused = useRef(false);
  const mouthPauseEnd = useRef(0);

  const tick = useCallback((ts) => {
    const t = ts / 1000;
    const now = Date.now();

    // ════════════════════════════════════════════
    // BLINK — simple 3-state machine
    // ════════════════════════════════════════════
    if (blinkState.current === 'waiting') {
      if (now >= blinkTimer.current) {
        blinkState.current = 'closing';
        blinkStart.current = now;
        doDouble.current = Math.random() < P.blink.doublePct;
      }
      setBlinkProgress(0);
    } else if (blinkState.current === 'closing') {
      const p = Math.min(1, (now - blinkStart.current) / P.blink.closeDur);
      setBlinkProgress(easeIO(p));
      if (p >= 1) {
        blinkState.current = 'opening';
        blinkStart.current = now;
      }
    } else if (blinkState.current === 'opening') {
      const p = Math.min(1, (now - blinkStart.current) / P.blink.openDur);
      setBlinkProgress(1 - easeIO(p));
      if (p >= 1) {
        if (doDouble.current) {
          doDouble.current = false;
          blinkState.current = 'closing';
          blinkStart.current = now + 50;
        } else {
          blinkState.current = 'waiting';
          const interval = P.blink.minInterval + Math.random() * (P.blink.maxInterval - P.blink.minInterval);
          blinkTimer.current = now + interval;
        }
      }
    }

    // ════════════════════════════════════════════
    // MOUTH — conservative, primarily vertical
    // ════════════════════════════════════════════
    if (isSpeaking) {
      wasSpeaking.current = true;

      if (mouthPaused.current) {
        if (now < mouthPauseEnd.current) {
          mouthDecay.current *= 0.90;
          setMouthOpen(Math.max(0, mouthDecay.current));
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        mouthPaused.current = false;
      }

      // Two overlapping sine waves for organic rhythm
      const wave1 = Math.sin(t * Math.PI * 2 * 3.2 * P.mouth.speed / 0.26) * 0.5 + 0.5;
      const wave2 = Math.sin(t * Math.PI * 2 * 1.1 * P.mouth.speed / 0.26) * 0.5 + 0.5;
      const raw = wave1 * wave2 * P.mouth.depthScale;
      const clamped = Math.max(0, Math.min(1, raw));

      // Random micro-pauses between phrases
      if (Math.random() < P.mouth.pauseChance) {
        mouthPaused.current = true;
        mouthPauseEnd.current = now + P.mouth.pauseDur * (0.7 + Math.random() * 0.6);
      }

      mouthDecay.current = clamped;
      setMouthOpen(clamped);
    } else {
      // Fade out when speech stops — never snap closed
      if (wasSpeaking.current && mouthDecay.current > 0.01) {
        mouthDecay.current *= 0.88;
        setMouthOpen(mouthDecay.current);
      } else if (wasSpeaking.current) {
        mouthDecay.current = 0;
        setMouthOpen(0);
        wasSpeaking.current = false;
      }
    }

    // ════════════════════════════════════════════
    // IDLE GESTURES — ALWAYS active (breathing never stops)
    // ════════════════════════════════════════════
    const I = P.idle;

    // Breathing: smooth sine, 0 to 1
    setBreathPhase((Math.sin(t * Math.PI * 2 / I.breathDur) + 1) / 2);

    // Float: gentle vertical drift
    setFloatY(Math.sin(t * Math.PI * 2 / I.floatDur) * I.floatAmp * -1);

    // Tilt: micro head rotation (phase-offset from float to avoid sync)
    setTiltDeg(Math.sin(t * Math.PI * 2 / I.tiltDur + 1.7) * I.tiltAmp);

    // Shift: horizontal micro drift (different phase)
    setShiftX(Math.sin(t * Math.PI * 2 / I.shiftDur + 3.3) * I.shiftAmp);

    rafRef.current = requestAnimationFrame(tick);
  }, [isSpeaking, P]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  return { blinkProgress, mouthOpen, breathPhase, floatY, tiltDeg, shiftX };
}

export { PROFILES };
