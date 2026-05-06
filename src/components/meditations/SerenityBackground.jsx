import React from 'react';

/**
 * SerenityBackground
 * ──────────────────────────────────────────────────────────────────────────
 * Soft ambient backdrop for the Meditations page. Visual metaphor: dawn fog
 * over still water — sage-greens and pale blues with a low, hushed feel.
 * The third member of the spiritual-practice background trilogy:
 *   - SanctuaryBackground (Prayer)        — deep indigo, contemplative night
 *   - RadiantBackground   (Affirmations)  — warm gold/cream, morning radiance
 *   - SerenityBackground  (Meditation)    — soft sage/cream, still serenity
 *
 * Why three different aesthetics: prayer, affirmation, and meditation
 * occupy different psychological territory. Prayer is active contemplation
 * (turning toward God). Affirmation is outward declaration. Meditation is
 * receptive stillness. The visual languages should reflect that — using
 * one common aesthetic across all three would dilute each one.
 *
 * Implementation:
 *   - Pure CSS keyframes + SVG. No JS animation loop.
 *   - Three motion layers: a static sage→cream gradient, a slow-breathing
 *     circle behind the hero (16s cycle ≈ real breath pace, 4s in / 4s
 *     hold / 4s out / 4s rest), and three horizontal ripple lines drifting
 *     slowly upward (suggesting water surface or mist).
 *   - 16s breathing cycle is intentional: many guided meditations use
 *     4-7-8 or 4-4-4-4 breath patterns. Synced with the natural rhythm,
 *     the hero invites the user to breathe along while reading.
 *   - Loads Cormorant Garamond from Google Fonts (already loaded by
 *     SanctuaryBackground, but kept here for standalone use).
 *   - pointer-events: none, aria-hidden, prefers-reduced-motion respected.
 */
export default function SerenityBackground() {
  return (
    <>
      <style>{CSS}</style>
      <div className="serenity-bg" aria-hidden="true">
        {/* Static base wash — sage → cream horizon */}
        <div className="serenity-base" />
        {/* Soft warm vignette at the bottom — like dawn light on water */}
        <div className="serenity-warm" />
        {/* Cool glaze at the top — keeps the eye drawn downward */}
        <div className="serenity-cool" />
        {/* Three horizontal ripple lines — slow, hypnotic */}
        <div className="ripple ripple-1" />
        <div className="ripple ripple-2" />
        <div className="ripple ripple-3" />
      </div>
    </>
  );
}

/**
 * BreathingCircle — exported separately so the page can mount it inside
 * the hero card rather than as a fixed background element. Hosts the slow
 * 16-second breath cycle. Render at any size; the circle itself is sized
 * relative to its container via 100%/100%.
 *
 * Two concentric circles to give it depth:
 *   - Outer "halo" circle (sage, 30% opacity) — breathes more dramatically
 *   - Inner "core" circle (pale blue, 50% opacity) — breathes subtly
 * Both share the same animation timing so they expand and contract
 * together, but the halo's larger amplitude creates the sense of the
 * breath "reaching outward."
 */
export function BreathingCircle({ size = 220 }) {
  return (
    <div
      className="breathing-circle"
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <div className="breath-halo" />
      <div className="breath-core" />
    </div>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

  .serenity-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }

  /* Sage-cream base. Lower-saturation than RadiantBackground so the page
     feels hushed rather than uplifting. */
  .serenity-base {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      #f7faf6 0%,
      #eef4ee 30%,
      #e6efe9 60%,
      #dde8e2 100%
    );
  }

  /* Warm cream wash at bottom — like dawn light on still water */
  .serenity-warm {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 35%;
    background: linear-gradient(
      0deg,
      rgba(254, 243, 220, 0.45) 0%,
      rgba(254, 243, 220, 0.18) 50%,
      transparent 100%
    );
  }

  /* Cool blue-green glaze at top — keeps eye downward */
  .serenity-cool {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(
      180deg,
      rgba(206, 224, 218, 0.30) 0%,
      transparent 100%
    );
  }

  /* Slow horizontal ripples — suggest water surface or drifting mist.
     Each ripple is a thin gradient line that drifts upward over ~30s.
     Three of them, staggered, create a continuous gentle motion. */
  .ripple {
    position: absolute;
    left: -10%;
    width: 120%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(132, 169, 140, 0.25) 30%,
      rgba(132, 169, 140, 0.40) 50%,
      rgba(132, 169, 140, 0.25) 70%,
      transparent 100%
    );
    will-change: transform, opacity;
  }
  .ripple-1 { animation: ripple-rise 32s ease-in-out  0s infinite; }
  .ripple-2 { animation: ripple-rise 38s ease-in-out 12s infinite; }
  .ripple-3 { animation: ripple-rise 28s ease-in-out 22s infinite; }

  @keyframes ripple-rise {
    0%   { transform: translateY(110vh); opacity: 0; }
    15%  { opacity: 1; }
    50%  { opacity: 1; }
    85%  { opacity: 0.4; }
    100% { transform: translateY(-10vh); opacity: 0; }
  }

  /* Breathing circle — mounted inline by BreathingCircle component. The
     16s cycle (4s expand → 4s hold → 4s contract → 4s rest) matches a
     classic 4-4-4-4 box-breath pattern so users naturally sync up. */
  .breathing-circle {
    position: relative;
    pointer-events: none;
  }
  .breath-halo,
  .breath-core {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    will-change: transform, opacity;
  }
  .breath-halo {
    background: radial-gradient(
      circle,
      rgba(132, 169, 140, 0.22) 0%,
      rgba(132, 169, 140, 0.08) 50%,
      transparent 80%
    );
    animation: breath-cycle-halo 16s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
  .breath-core {
    background: radial-gradient(
      circle,
      rgba(176, 200, 196, 0.55) 0%,
      rgba(176, 200, 196, 0.20) 60%,
      transparent 90%
    );
    transform: scale(0.6);
    animation: breath-cycle-core 16s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }

  @keyframes breath-cycle-halo {
    0%    { transform: scale(0.85); opacity: 0.85; } /* rest */
    25%   { transform: scale(1.08); opacity: 1.00; } /* end of inhale */
    50%   { transform: scale(1.08); opacity: 1.00; } /* hold */
    75%   { transform: scale(0.85); opacity: 0.85; } /* end of exhale */
    100%  { transform: scale(0.85); opacity: 0.85; } /* rest */
  }
  @keyframes breath-cycle-core {
    0%    { transform: scale(0.55); opacity: 0.6; }
    25%   { transform: scale(0.78); opacity: 0.85; }
    50%   { transform: scale(0.78); opacity: 0.85; }
    75%   { transform: scale(0.55); opacity: 0.6; }
    100%  { transform: scale(0.55); opacity: 0.6; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ripple, .breath-halo, .breath-core { animation: none; }
    .ripple { opacity: 0; }
    .breath-halo { transform: scale(1); opacity: 0.9; }
    .breath-core { transform: scale(0.7); opacity: 0.7; }
  }
`;
