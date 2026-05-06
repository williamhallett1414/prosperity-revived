import React, { useMemo } from 'react';

/**
 * SanctuaryBackground
 * ──────────────────────────────────────────────────────────────────────────
 * Ambient, calming visual backdrop for the Prayer page. Two layered ideas:
 *
 *   1. ASCENDING PRAYERS — small, luminous SVG particles that drift slowly
 *      upward from below the viewport, fading as they climb. The metaphor:
 *      a community's prayers rising toward heaven. Each particle has a
 *      randomized start position, drift, scale, and speed so the field
 *      never repeats or feels mechanical.
 *
 *   2. FALLING LEAVES — gentle autumn leaves drifting diagonally, evoking
 *      surrender ("cast your cares"). Soft amber and burnt-orange tones to
 *      match the warm horizon glow.
 *
 * Performance / accessibility notes:
 *   • Pure CSS keyframes + SVG. No canvas, no JS animation loop. Browser
 *     compositor handles everything; effectively free at idle.
 *   • Respects `prefers-reduced-motion`: all motion freezes if the user
 *     has reduced motion turned on at the OS level.
 *   • `pointer-events: none` so it never interferes with touch/click on
 *     the foreground content.
 *   • Particles are positioned with absolute % coordinates and animated
 *     with transform, so the cost is constant regardless of viewport.
 */
export default function SanctuaryBackground() {
  // Generate randomized particle configs once (stable across re-renders)
  const prayers = useMemo(() => makePrayers(14), []);
  const leaves = useMemo(() => makeLeaves(7), []);

  return (
    <>
      <style>{KEYFRAMES_AND_BASE_CSS}</style>

      <div className="sanctuary-bg" aria-hidden="true">
        {/* Sky gradient + soft horizon glow */}
        <div className="sanctuary-sky" />
        <div className="sanctuary-glow" />
        <div className="sanctuary-grain" />

        {/* Ascending prayers — luminous orbs rising from below */}
        <div className="sanctuary-prayers">
          {prayers.map((p, i) => (
            <span
              key={`p-${i}`}
              className="sanctuary-prayer"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                opacity: p.opacity,
                ['--drift']: `${p.drift}px`,
              }}
            />
          ))}
        </div>

        {/* Drifting leaves — gentle autumn fall */}
        <svg
          className="sanctuary-leaves"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <symbol id="leaf-shape" viewBox="-12 -12 24 24">
              {/* Stylized maple-ish leaf, single path */}
              <path
                d="M0,-10 Q4,-7 5,-2 Q9,-3 10,1 Q7,3 4,4 Q5,8 0,10 Q-5,8 -4,4 Q-7,3 -10,1 Q-9,-3 -5,-2 Q-4,-7 0,-10 Z"
                fill="currentColor"
              />
              <line
                x1="0"
                y1="-9"
                x2="0"
                y2="9"
                stroke="rgba(0,0,0,0.18)"
                strokeWidth="0.7"
              />
            </symbol>
          </defs>
        </svg>

        {leaves.map((l, i) => (
          <svg
            key={`l-${i}`}
            className="sanctuary-leaf"
            viewBox="-12 -12 24 24"
            style={{
              left: `${l.left}%`,
              width: `${l.size}px`,
              height: `${l.size}px`,
              color: l.color,
              animationDuration: `${l.duration}s`,
              animationDelay: `${l.delay}s`,
              ['--sway']: `${l.sway}px`,
              ['--rotateEnd']: `${l.rotateEnd}deg`,
            }}
          >
            <use href="#leaf-shape" />
          </svg>
        ))}
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────

function makePrayers(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      left: rand(2, 98),
      size: rand(3, 7),
      duration: rand(14, 26),
      delay: rand(0, 22) * -1, // negative delay = stagger so they're already in flight on mount
      opacity: rand(0.35, 0.7),
      drift: rand(-30, 30), // horizontal drift over the full ascent
    });
  }
  return arr;
}

function makeLeaves(count) {
  const palette = [
    'rgba(217, 119, 6, 0.55)',   // burnt amber
    'rgba(180, 83, 9, 0.50)',    // copper
    'rgba(234, 179, 8, 0.40)',   // muted gold
    'rgba(154, 52, 18, 0.45)',   // deep rust
  ];
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      left: rand(-5, 105),
      size: rand(14, 24),
      duration: rand(22, 38),
      delay: rand(0, 30) * -1,
      sway: rand(40, 90),
      rotateEnd: rand(180, 540),
      color: palette[i % palette.length],
    });
  }
  return arr;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ───────────────────────────────────────────────────────────────────────────
// CSS — kept inline so this component is self-contained and easy to tune
// ───────────────────────────────────────────────────────────────────────────

const KEYFRAMES_AND_BASE_CSS = `
  .sanctuary-bg {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .sanctuary-sky {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 90% 50% at 50% 100%, rgba(251, 191, 36, 0.12) 0%, transparent 60%),
      linear-gradient(180deg,
        #0f1729 0%,
        #1a2547 30%,
        #243154 55%,
        #2d3a5e 75%,
        #3a3a5c 90%,
        #5a4534 100%
      );
  }

  /* Soft warm glow along the bottom horizon — like dawn breaking */
  .sanctuary-glow {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -30%;
    height: 70%;
    background: radial-gradient(ellipse at 50% 100%,
      rgba(251, 191, 36, 0.25) 0%,
      rgba(217, 119, 6, 0.10) 30%,
      transparent 65%
    );
    filter: blur(4px);
  }

  /* Subtle film grain so the gradient doesn't look like flat AI slop */
  .sanctuary-grain {
    position: absolute;
    inset: 0;
    opacity: 0.08;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
  }

  .sanctuary-prayers {
    position: absolute;
    inset: 0;
  }

  .sanctuary-prayer {
    position: absolute;
    bottom: -20px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(254, 243, 199, 1) 0%,
      rgba(251, 191, 36, 0.8) 35%,
      rgba(245, 158, 11, 0.4) 65%,
      transparent 100%
    );
    box-shadow:
      0 0 8px rgba(251, 191, 36, 0.6),
      0 0 16px rgba(251, 191, 36, 0.3);
    animation: ascend linear infinite;
    will-change: transform, opacity;
  }

  @keyframes ascend {
    0% {
      transform: translate3d(0, 0, 0) scale(0.6);
      opacity: 0;
    }
    8% {
      opacity: var(--peak-opacity, 0.7);
    }
    50% {
      transform: translate3d(calc(var(--drift) * 0.5), -50vh, 0) scale(1);
    }
    85% {
      opacity: var(--peak-opacity, 0.4);
    }
    100% {
      transform: translate3d(var(--drift), -110vh, 0) scale(0.4);
      opacity: 0;
    }
  }

  .sanctuary-leaves {
    /* Container svg is just for the shape definition — actual leaves are siblings */
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  .sanctuary-leaf {
    position: absolute;
    top: -40px;
    animation: fall linear infinite;
    will-change: transform;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
  }

  @keyframes fall {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      transform: translate3d(var(--sway), 50vh, 0) rotate(calc(var(--rotateEnd) * 0.5));
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translate3d(0, 110vh, 0) rotate(var(--rotateEnd));
      opacity: 0;
    }
  }

  /* Respect user's motion preference — freeze everything */
  @media (prefers-reduced-motion: reduce) {
    .sanctuary-prayer,
    .sanctuary-leaf {
      animation: none;
      opacity: 0.3;
    }
  }
`;
