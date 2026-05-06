import React from 'react';

/**
 * DoveAscension
 * ──────────────────────────────────────────────────────────────────────────
 * A single dove flies diagonally up the screen and out the top, leaving a
 * brief trail of luminous particles. Triggered by the user submitting a
 * prayer (any of: public prayer wall, private prayer, or completed ACTS).
 *
 * Visual metaphor: the prayer being lifted up. The dove starts low (where
 * the user just submitted from) and ascends in an arc, fading near the
 * top of the screen.
 *
 * Usage:
 *   {dove && <DoveAscension key={dove} onDone={() => setDove(0)} />}
 *
 * The component is purely cosmetic — it self-removes after the animation
 * completes via onDone(). Re-trigger by passing a new `key` prop. Fire-and-
 * forget; if the user submits another prayer mid-flight the previous dove
 * unmounts cleanly and a new one starts from the beginning.
 *
 * Implementation notes:
 *   • Pure SVG + CSS keyframes. No JS animation loop. The compositor does
 *     the work; cost is constant.
 *   • Wings flap via a 2-frame morph between `wings-up` and `wings-down`
 *     paths, swapped 8x per second.
 *   • Trajectory uses cubic-bezier easing so the arc feels lifted, not
 *     mechanical (slight initial rise, then carried up and away).
 *   • Particle trail uses 4 small dots that fade, sized to feel like
 *     stardust falling off the dove's wake.
 *   • Respects `prefers-reduced-motion`: the dove appears centered,
 *     fades in, and fades out without translating.
 *   • z-index 100 — sits above all page content but below modal overlays
 *     (which sit at z-50 inside their own portal stack and use full-screen
 *     backdrops, so this is fine).
 */
export default function DoveAscension({ onDone, fromX = 50 }) {
  return (
    <>
      <style>{KEYFRAMES_AND_CSS}</style>
      <div
        className="dove-stage"
        aria-hidden="true"
        style={{ ['--from-x']: `${fromX}%` }}
        onAnimationEnd={(e) => {
          // The outermost element's flight animation is the longest;
          // when it ends we tell the parent to clear the trigger.
          if (e.animationName === 'dove-flight' && onDone) onDone();
        }}
      >
        {/* Trail particles — small motes of light dropping behind the dove */}
        <span className="dove-mote dove-mote-1" />
        <span className="dove-mote dove-mote-2" />
        <span className="dove-mote dove-mote-3" />
        <span className="dove-mote dove-mote-4" />

        {/* The dove itself — wrapped twice so we can compose translate
             (flight path) and rotate (wing-tilt) without conflict. */}
        <div className="dove-flier">
          <div className="dove-tilt">
            <svg
              className="dove-svg"
              viewBox="-30 -30 60 60"
              width="56"
              height="56"
            >
              <defs>
                <radialGradient id="dove-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(254, 243, 199, 0.9)" />
                  <stop offset="40%" stopColor="rgba(254, 243, 199, 0.4)" />
                  <stop offset="100%" stopColor="rgba(254, 243, 199, 0)" />
                </radialGradient>
              </defs>

              {/* Soft halo behind the bird — like backlight */}
              <circle cx="0" cy="0" r="26" fill="url(#dove-glow)" />

              {/* Body — small ovaloid silhouette */}
              <ellipse cx="0" cy="2" rx="6" ry="3" fill="#f5f1e8" opacity="0.95" />
              {/* Head */}
              <circle cx="6" cy="-1" r="2.6" fill="#f5f1e8" opacity="0.95" />
              {/* Beak — tiny gold triangle */}
              <path d="M 8.5,-1.5 L 11,-0.6 L 8.5,0" fill="#fbbf24" />
              {/* Tail */}
              <path
                d="M -6,2 L -11,-1 L -10,4 Z"
                fill="#f5f1e8"
                opacity="0.9"
              />

              {/* Wings — two paths overlaid, only one visible at a time
                   via opacity flicker. Creates a 2-frame flap. */}
              <path
                className="wing wing-up"
                d="M 0,0 Q -6,-12 -16,-14 Q -8,-6 -2,-2 Z"
                fill="#f5f1e8"
                opacity="0.95"
              />
              <path
                className="wing wing-up"
                d="M 0,0 Q 6,-12 16,-14 Q 8,-6 2,-2 Z"
                fill="#f5f1e8"
                opacity="0.95"
              />
              <path
                className="wing wing-down"
                d="M 0,2 Q -7,8 -15,7 Q -9,3 -2,2 Z"
                fill="#f5f1e8"
                opacity="0.95"
              />
              <path
                className="wing wing-down"
                d="M 0,2 Q 7,8 15,7 Q 9,3 2,2 Z"
                fill="#f5f1e8"
                opacity="0.95"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

const KEYFRAMES_AND_CSS = `
  .dove-stage {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
    overflow: hidden;
  }

  .dove-flier {
    position: absolute;
    /* Start near the bottom of the screen, near where the user just
       interacted (release point passed in via --from-x). */
    left: var(--from-x);
    bottom: 12%;
    transform: translate(-50%, 0);
    animation: dove-flight 2.6s cubic-bezier(0.4, 0.05, 0.3, 1) forwards;
    will-change: transform, opacity;
    filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.5))
            drop-shadow(0 0 4px rgba(254, 243, 199, 0.8));
  }

  /* Slight tilt that follows flight direction — gives a sense of motion */
  .dove-tilt {
    animation: dove-tilt 2.6s ease-out forwards;
    transform-origin: center;
  }

  /* The wing flap — 8 cycles per second. Two wing paths cross-fade so we
     never have an in-between blur frame. */
  .wing-up {
    animation: wing-flap-up 0.18s steps(1, end) infinite;
  }
  .wing-down {
    animation: wing-flap-down 0.18s steps(1, end) infinite;
  }

  @keyframes wing-flap-up {
    0%, 49%   { opacity: 0.95; }
    50%, 100% { opacity: 0; }
  }
  @keyframes wing-flap-down {
    0%, 49%   { opacity: 0; }
    50%, 100% { opacity: 0.95; }
  }

  @keyframes dove-flight {
    0% {
      transform: translate(-50%, 20%) scale(0.6);
      opacity: 0;
    }
    8% {
      opacity: 1;
    }
    /* Slight initial rise / wing-catch */
    20% {
      transform: translate(calc(-50% - 4vw), -10vh) scale(0.85);
    }
    /* Lifted path — the dove is now fully airborne */
    50% {
      transform: translate(calc(-50% + 8vw), -50vh) scale(1);
      opacity: 1;
    }
    /* Continuing up, drifting right */
    80% {
      transform: translate(calc(-50% + 14vw), -90vh) scale(0.95);
      opacity: 0.85;
    }
    100% {
      transform: translate(calc(-50% + 18vw), -120vh) scale(0.7);
      opacity: 0;
    }
  }

  @keyframes dove-tilt {
    0%   { transform: rotate(-8deg); }
    30%  { transform: rotate(-14deg); }
    60%  { transform: rotate(-18deg); }
    100% { transform: rotate(-22deg); }
  }

  /* Trail particles — 4 motes that drop in a slight stagger, fade out */
  .dove-mote {
    position: absolute;
    left: var(--from-x);
    bottom: 12%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(254, 243, 199, 1) 0%,
      rgba(251, 191, 36, 0.7) 40%,
      transparent 100%
    );
    box-shadow: 0 0 6px rgba(251, 191, 36, 0.5);
    opacity: 0;
    transform: translate(-50%, 0);
    will-change: transform, opacity;
  }
  .dove-mote-1 { animation: mote 2s ease-out 0.2s forwards; }
  .dove-mote-2 { animation: mote 2s ease-out 0.5s forwards; }
  .dove-mote-3 { animation: mote 2s ease-out 0.8s forwards; }
  .dove-mote-4 { animation: mote 2s ease-out 1.1s forwards; }

  @keyframes mote {
    0% {
      opacity: 0;
      transform: translate(-50%, 0) scale(0.4);
    }
    20% {
      opacity: 0.9;
    }
    100% {
      opacity: 0;
      transform: translate(calc(-50% + 6vw), -55vh) scale(0.2);
    }
  }

  /* Reduced motion: a gentle fade in/out, no translation. The dove still
     appears as acknowledgement that the prayer was sent. */
  @media (prefers-reduced-motion: reduce) {
    .dove-flier {
      animation: dove-fade-only 1.6s ease-out forwards;
    }
    .dove-tilt { animation: none; transform: none; }
    .wing-up { animation: none; opacity: 0.95; }
    .wing-down { animation: none; opacity: 0; }
    .dove-mote { animation: none; opacity: 0; }
  }

  @keyframes dove-fade-only {
    0%   { opacity: 0; transform: translate(-50%, 0) scale(0.8); bottom: 50%; }
    30%  { opacity: 1; transform: translate(-50%, 0) scale(1); bottom: 50%; }
    70%  { opacity: 1; }
    100% { opacity: 0; bottom: 50%; }
  }
`;
