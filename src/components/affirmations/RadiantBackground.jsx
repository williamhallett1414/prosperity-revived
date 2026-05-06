import React from 'react';

/**
 * RadiantBackground
 * ──────────────────────────────────────────────────────────────────────────
 * Ambient light/morning backdrop for the Affirmations page. The visual
 * metaphor is sunrise — a warm radial glow rising from below the hero card,
 * with a few slow-drifting "breath" particles suggesting calm, expansive
 * inhalation. Companion to SanctuaryBackground but for the radiant/light
 * mood rather than the contemplative/dark mood.
 *
 * Why a separate component:
 *   - Affirmations and Prayer occupy different psychological territory.
 *     Prayer is contemplative turning-inward ("be still"); affirmation is
 *     outward declaration ("I am chosen"). Different lighting, different
 *     mood — a separate ambient layer keeps them visually distinct.
 *   - Mountable inside any page that wants the radiant aesthetic.
 *
 * Implementation notes:
 *   - Pure CSS keyframes + SVG, no JS animation loop.
 *   - Three motion layers: a soft sunrise gradient (static), a pulsing
 *     halo that breathes (12s cycle), and 5 ascending particles staggered
 *     across long durations (15-22s) so the effect is felt rather than
 *     noticed.
 *   - Loads Cormorant Garamond from Google Fonts so any consumer of the
 *     page can use the serif without re-importing. Falls back to Georgia
 *     if the network call fails.
 *   - pointer-events: none and aria-hidden so it never interferes with
 *     touch targets or screen readers.
 *   - Respects prefers-reduced-motion: animations are paused, the static
 *     gradient still renders.
 */
export default function RadiantBackground() {
  return (
    <>
      <style>{CSS}</style>
      <div className="radiant-bg" aria-hidden="true">
        {/* Static base wash — warm cream → soft gold horizon */}
        <div className="radiant-base" />
        {/* Sunrise — radial glow that gently breathes */}
        <div className="radiant-sun" />
        {/* Soft top vignette — keeps focus on the hero card */}
        <div className="radiant-top" />
        {/* Breath particles — five motes drifting upward at different paces */}
        <span className="breath-mote breath-mote-1" />
        <span className="breath-mote breath-mote-2" />
        <span className="breath-mote breath-mote-3" />
        <span className="breath-mote breath-mote-4" />
        <span className="breath-mote breath-mote-5" />
      </div>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

  .radiant-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }

  /* Cream-to-gold horizon. Sits behind everything. */
  .radiant-base {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      #fffefa 0%,
      #fefcf5 25%,
      #fdf8e8 60%,
      #f9efce 100%
    );
  }

  /* Sunrise halo — bottom-up radial that pulses subtly */
  .radiant-sun {
    position: absolute;
    left: 50%;
    bottom: -10%;
    width: 130%;
    height: 70%;
    transform: translateX(-50%);
    background: radial-gradient(
      ellipse at 50% 100%,
      rgba(251, 191, 36, 0.30) 0%,
      rgba(251, 191, 36, 0.18) 25%,
      rgba(245, 158, 11, 0.08) 50%,
      transparent 75%
    );
    filter: blur(2px);
    animation: sun-breathe 12s ease-in-out infinite;
    will-change: opacity, transform;
  }

  @keyframes sun-breathe {
    0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
    50%      { opacity: 0.85; transform: translateX(-50%) scale(1.04); }
  }

  /* Soft white-fade at top — frames the hero card on small screens */
  .radiant-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 25%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.7) 0%,
      transparent 100%
    );
  }

  /* Breath particles — small luminous motes drifting upward */
  .breath-mote {
    position: absolute;
    bottom: -6%;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(254, 243, 199, 1) 0%,
      rgba(251, 191, 36, 0.6) 40%,
      transparent 100%
    );
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.35);
    opacity: 0;
    will-change: transform, opacity;
  }

  .breath-mote-1 { left: 12%; animation: breath 18s ease-in-out  0s infinite; }
  .breath-mote-2 { left: 28%; animation: breath 21s ease-in-out  4s infinite; }
  .breath-mote-3 { left: 51%; animation: breath 16s ease-in-out  8s infinite; }
  .breath-mote-4 { left: 73%; animation: breath 22s ease-in-out 12s infinite; }
  .breath-mote-5 { left: 88%; animation: breath 19s ease-in-out  6s infinite; }

  @keyframes breath {
    0%   { transform: translateY(0)       scale(0.5); opacity: 0; }
    10%  { opacity: 0.6; }
    50%  { transform: translateY(-55vh)   scale(1);   opacity: 0.4; }
    90%  { opacity: 0.2; }
    100% { transform: translateY(-110vh)  scale(0.4); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .radiant-sun, .breath-mote { animation: none; }
    .breath-mote { opacity: 0; }
  }
`;
