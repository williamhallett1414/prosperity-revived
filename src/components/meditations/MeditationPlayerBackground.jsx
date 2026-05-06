import React from 'react';

/**
 * MeditationPlayerBackground
 * ─────────────────────────────────────────────────────────────────────────
 * Nature-themed ambient layer for the full-screen meditation player.
 * Replaces the previous flat dark-navy gradient with calming imagery
 * that varies by meditation category — sunrise for morning sessions,
 * ocean waves for calm/anxiety, deep night for sleep, etc.
 *
 * Design principles:
 *   1. Pure CSS + SVG. No images, no JS animation loops, no canvas.
 *   2. Slow, hypnotic motion. Animation durations 20-40s, never fast.
 *   3. Theme keyed off meditation.category (morning/calm/faith/heal/focus/sleep).
 *      Falls back to "default serenity" if category is unrecognized.
 *   4. The breathing orb is NOT rendered here — the player keeps that
 *      separately so it can sync to the breathing-state useEffect timer.
 *   5. prefers-reduced-motion respected (all animations pause; static
 *      gradient still renders).
 *
 * Per-theme visual recipe:
 *   morning   → warm pink/gold sunrise + slow-rising sun rays + golden particles
 *   calm      → soft sky-blue + ocean waves at bottom + drifting leaves
 *   faith     → warm cream + soft glow + slow-floating particles
 *   heal      → muted rose/lavender + gentle drifting petals
 *   focus     → clear pale-blue sky + slow drifting clouds
 *   sleep     → deep indigo night + twinkling stars + slow-drifting clouds
 *   default   → sage serenity (matches the page's SerenityBackground palette)
 *
 * Why per-category theming: a "Morning Gratitude" session should feel like
 * dawn; a "Deep Sleep" session should feel like night. Forcing both into
 * the same visual language flattens the spiritual and emotional terrain
 * of the catalog. The user's request was specifically for nature themes,
 * and "different themes per session" is the natural interpretation.
 */
export default function MeditationPlayerBackground({ category = 'default' }) {
  const theme = THEMES[category] || THEMES.default;
  return (
    <>
      <style>{CSS}</style>
      <div className="mp-bg" aria-hidden="true">
        {/* Static base gradient — picks the palette per theme. */}
        <div className="mp-base" style={{ background: theme.baseGradient }} />

        {/* Theme-specific layered motion. Each theme renders only the
            layers that suit it — morning gets sun rays, ocean themes get
            waves, sleep gets stars, etc. */}
        {theme.layers.includes('sunrise')   && <SunriseLayer  color={theme.glowColor} />}
        {theme.layers.includes('rays')      && <RaysLayer     color={theme.glowColor} />}
        {theme.layers.includes('waves')     && <WavesLayer    color={theme.waveColor} />}
        {theme.layers.includes('clouds')    && <CloudsLayer   color={theme.cloudColor} />}
        {theme.layers.includes('stars')     && <StarsLayer    color={theme.starColor} />}
        {theme.layers.includes('leaves')    && <LeavesLayer   color={theme.particleColor} />}
        {theme.layers.includes('petals')    && <PetalsLayer   color={theme.particleColor} />}
        {theme.layers.includes('particles') && <ParticlesLayer color={theme.particleColor} />}
      </div>
    </>
  );
}

// ─── Per-category theme definitions ─────────────────────────────────────────
// Each theme picks a base gradient + layer recipe + accent colors.
// New themes can be added without changing the layer components themselves.
const THEMES = {
  morning: {
    // Warm pink-to-gold sunrise on a horizon. Used by morning-gratitude,
    // confidence-courage, new-beginnings.
    baseGradient: 'linear-gradient(180deg, #1a2540 0%, #4a3868 25%, #c2745a 60%, #f0a868 80%, #f5c878 100%)',
    glowColor: 'rgba(245, 200, 120, 0.6)',
    particleColor: 'rgba(255, 220, 160, 0.7)',
    layers: ['sunrise', 'rays', 'particles'],
  },
  calm: {
    // Sky-blue with ocean waves at the bottom. anxiety-relief, breathing-reset,
    // letting-go, overcoming-fear.
    baseGradient: 'linear-gradient(180deg, #1e3a5c 0%, #2d5a8a 35%, #4a87b5 65%, #5a9bc4 100%)',
    glowColor: 'rgba(130, 180, 220, 0.5)',
    waveColor: 'rgba(180, 220, 240, 0.35)',
    particleColor: 'rgba(200, 230, 245, 0.5)',
    layers: ['waves', 'leaves'],
  },
  faith: {
    // Warm cream/gold reverent glow. scripture-reflection, purpose-calling,
    // healing-prayer, worship-presence.
    baseGradient: 'linear-gradient(180deg, #2a1d3a 0%, #4a3050 30%, #8b5a4a 65%, #d4a574 100%)',
    glowColor: 'rgba(212, 165, 116, 0.55)',
    particleColor: 'rgba(245, 220, 175, 0.65)',
    layers: ['sunrise', 'particles'],
  },
  heal: {
    // Muted rose/lavender with drifting petals. body-scan, forgiveness-peace,
    // grief-comfort, self-compassion, relationships, joy-restoration.
    baseGradient: 'linear-gradient(180deg, #2d1f3a 0%, #4d3052 35%, #8e5a78 70%, #c08a9a 100%)',
    glowColor: 'rgba(210, 160, 180, 0.5)',
    particleColor: 'rgba(245, 200, 210, 0.55)',
    layers: ['sunrise', 'petals'],
  },
  focus: {
    // Clear pale-blue sky with slow drifting clouds. midday-reset, focus-clarity,
    // abundance-mindset, temptation-resistance, decision-wisdom.
    baseGradient: 'linear-gradient(180deg, #2a4a6c 0%, #4a7898 40%, #7ab0d0 75%, #a8c8e0 100%)',
    glowColor: 'rgba(168, 200, 224, 0.5)',
    cloudColor: 'rgba(255, 255, 255, 0.18)',
    particleColor: 'rgba(220, 235, 248, 0.4)',
    layers: ['clouds', 'particles'],
  },
  sleep: {
    // Deep indigo night with twinkling stars and slow drifting clouds.
    // evening-winddown, deep-sleep, sabbath-rest, strength-exhaustion.
    baseGradient: 'linear-gradient(180deg, #0a1024 0%, #16203c 40%, #1f2a48 70%, #2a3858 100%)',
    glowColor: 'rgba(180, 200, 240, 0.18)',
    cloudColor: 'rgba(80, 100, 150, 0.30)',
    starColor: 'rgba(220, 230, 250, 0.85)',
    layers: ['stars', 'clouds'],
  },
  default: {
    // Sage serenity — matches the meditation list page's palette.
    // Used as fallback for any unrecognized category.
    baseGradient: 'linear-gradient(180deg, #1a2a30 0%, #2a4540 35%, #3d5a4f 70%, #506b5c 100%)',
    glowColor: 'rgba(140, 180, 150, 0.4)',
    particleColor: 'rgba(200, 220, 200, 0.5)',
    layers: ['sunrise', 'leaves'],
  },
};

// ─── Layer components ────────────────────────────────────────────────────────
// Each layer is a positioned overlay that renders one type of motion.

function SunriseLayer({ color }) {
  // Soft radial glow at the horizon (60% from top), breathing slowly.
  return (
    <div className="mp-sunrise" style={{ background: `radial-gradient(circle at 50% 70%, ${color} 0%, transparent 50%)` }} />
  );
}

function RaysLayer({ color }) {
  // Slow-rotating sun rays radiating from the horizon. Suggests dawn light.
  // Two SVG cones at 30° offset, rotating slowly in opposite directions
  // for a subtle parallax that doesn't feel mechanical.
  return (
    <div className="mp-rays-wrap">
      <svg className="mp-rays mp-rays-1" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 12 }).map((_, i) => (
          <polygon
            key={i}
            points="0,0 -3,-100 3,-100"
            fill={color}
            opacity="0.18"
            transform={`rotate(${i * 30})`}
          />
        ))}
      </svg>
      <svg className="mp-rays mp-rays-2" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 8 }).map((_, i) => (
          <polygon
            key={i}
            points="0,0 -2,-100 2,-100"
            fill={color}
            opacity="0.10"
            transform={`rotate(${i * 45 + 22.5})`}
          />
        ))}
      </svg>
    </div>
  );
}

function WavesLayer({ color }) {
  // Three SVG sine waves at the bottom 30% of the screen, drifting
  // horizontally at different speeds to suggest layered ocean motion.
  return (
    <div className="mp-waves-wrap">
      {/* Each wave is a wide path drifting left or right across a 30s loop.
          The combined motion of three waves at different speeds creates an
          illusion of organic ocean movement without ever truly repeating. */}
      <svg className="mp-wave mp-wave-1" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path
          d="M0,100 C240,140 480,60 720,100 C960,140 1200,60 1440,100 L1440,200 L0,200 Z"
          fill={color}
          opacity="0.35"
        />
      </svg>
      <svg className="mp-wave mp-wave-2" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path
          d="M0,120 C240,80 480,160 720,120 C960,80 1200,160 1440,120 L1440,200 L0,200 Z"
          fill={color}
          opacity="0.45"
        />
      </svg>
      <svg className="mp-wave mp-wave-3" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path
          d="M0,140 C360,170 720,110 1080,140 C1260,155 1320,135 1440,140 L1440,200 L0,200 Z"
          fill={color}
          opacity="0.55"
        />
      </svg>
    </div>
  );
}

function CloudsLayer({ color }) {
  // Three soft cloud shapes drifting slowly horizontally. Different sizes
  // and depths give a sense of three-dimensional space.
  return (
    <div className="mp-clouds-wrap">
      {[
        { top: '15%', size: 220, dur: 80, delay: 0,  opacity: 0.7 },
        { top: '35%', size: 150, dur: 60, delay: -25, opacity: 0.55 },
        { top: '55%', size: 280, dur: 100, delay: -10, opacity: 0.5 },
      ].map((cloud, i) => (
        <div
          key={i}
          className="mp-cloud"
          style={{
            top: cloud.top,
            width: cloud.size,
            height: cloud.size * 0.45,
            opacity: cloud.opacity,
            animation: `mp-cloud-drift ${cloud.dur}s linear ${cloud.delay}s infinite`,
            background: `radial-gradient(ellipse 60% 80% at 30% 50%, ${color} 0%, transparent 70%),
                         radial-gradient(ellipse 70% 90% at 70% 50%, ${color} 0%, transparent 70%),
                         radial-gradient(ellipse 50% 70% at 50% 30%, ${color} 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}

function StarsLayer({ color }) {
  // Twinkling stars distributed across the upper 75% of the screen.
  // Each star has a slightly different twinkle period so they don't pulse
  // in unison. Density is moderate — enough to feel like a clear night
  // without becoming busy.
  const stars = React.useMemo(() => {
    // Deterministic distribution so the layout is stable across renders.
    // Seeded by hand-picked positions rather than Math.random() at module
    // top-level, which would re-roll on hot reload.
    return [
      { x: 5,  y: 8,  size: 2,   dur: 4 },  { x: 18, y: 15, size: 1.5, dur: 5.5 },
      { x: 28, y: 6,  size: 2.5, dur: 6 },  { x: 45, y: 12, size: 1,   dur: 3.5 },
      { x: 58, y: 8,  size: 2,   dur: 5 },  { x: 72, y: 14, size: 1.5, dur: 4.5 },
      { x: 85, y: 6,  size: 2,   dur: 6.5 },{ x: 92, y: 18, size: 1,   dur: 3 },
      { x: 12, y: 25, size: 1.5, dur: 5 },  { x: 35, y: 22, size: 2.5, dur: 7 },
      { x: 50, y: 28, size: 1,   dur: 4 },  { x: 65, y: 24, size: 2,   dur: 5.5 },
      { x: 80, y: 30, size: 1.5, dur: 6 },  { x: 22, y: 38, size: 1,   dur: 3.5 },
      { x: 42, y: 42, size: 2,   dur: 5 },  { x: 60, y: 40, size: 1.5, dur: 6.5 },
      { x: 78, y: 45, size: 1,   dur: 4 },  { x: 15, y: 52, size: 1.5, dur: 5 },
      { x: 88, y: 55, size: 2,   dur: 6 },  { x: 32, y: 58, size: 1,   dur: 4.5 },
      { x: 55, y: 62, size: 1.5, dur: 5.5 },{ x: 70, y: 65, size: 1,   dur: 4 },
    ];
  }, []);
  return (
    <div className="mp-stars-wrap">
      {stars.map((s, i) => (
        <div
          key={i}
          className="mp-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: color,
            animation: `mp-star-twinkle ${s.dur}s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function LeavesLayer({ color }) {
  // 6 SVG leaves drifting diagonally with rotation. Soft and slow.
  return (
    <div className="mp-leaves-wrap">
      {[
        { left: '10%', dur: 28, delay: 0,    drift: 80,  rot: 360 },
        { left: '25%', dur: 36, delay: -8,   drift: -60, rot: -300 },
        { left: '40%', dur: 32, delay: -18,  drift: 50,  rot: 280 },
        { left: '55%', dur: 40, delay: -5,   drift: -90, rot: -240 },
        { left: '72%', dur: 30, delay: -22,  drift: 70,  rot: 320 },
        { left: '88%', dur: 34, delay: -12,  drift: -50, rot: -360 },
      ].map((leaf, i) => (
        <svg
          key={i}
          className="mp-leaf"
          viewBox="-12 -12 24 24"
          style={{
            left: leaf.left,
            animation: `mp-leaf-fall-${i} ${leaf.dur}s linear ${leaf.delay}s infinite`,
            color,
            ['--drift']: `${leaf.drift}px`,
            ['--rot']: `${leaf.rot}deg`,
          }}
        >
          <path
            d="M0,-10 C5,-10 10,-5 10,0 C10,5 5,10 0,10 C-5,10 -10,5 -10,0 C-10,-5 -5,-10 0,-10 Z M0,-8 L0,8"
            fill="currentColor"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="0.5"
            opacity="0.7"
            transform="rotate(45)"
          />
        </svg>
      ))}
    </div>
  );
}

function PetalsLayer({ color }) {
  // Like leaves but as 5-petal flower shapes. Used by heal theme for a
  // softer, more delicate feel than leaves.
  return (
    <div className="mp-leaves-wrap">
      {[
        { left: '8%',  dur: 26, delay: 0,    drift: 60 },
        { left: '24%', dur: 34, delay: -10,  drift: -50 },
        { left: '42%', dur: 30, delay: -16,  drift: 40 },
        { left: '60%', dur: 38, delay: -4,   drift: -70 },
        { left: '78%', dur: 28, delay: -20,  drift: 55 },
        { left: '92%', dur: 32, delay: -8,   drift: -45 },
      ].map((p, i) => (
        <svg
          key={i}
          className="mp-petal"
          viewBox="-10 -10 20 20"
          style={{
            left: p.left,
            animation: `mp-leaf-fall-${i} ${p.dur}s linear ${p.delay}s infinite`,
            color,
            ['--drift']: `${p.drift}px`,
            ['--rot']: '270deg',
          }}
        >
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-5"
              rx="2.5"
              ry="5"
              fill="currentColor"
              opacity="0.55"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="1.5" fill="currentColor" opacity="0.85" />
        </svg>
      ))}
    </div>
  );
}

function ParticlesLayer({ color }) {
  // Small slowly-rising glow dots. Used by morning/faith/focus themes
  // to add gentle motion without dominating.
  return (
    <div className="mp-particles-wrap">
      {Array.from({ length: 14 }).map((_, i) => {
        const left = ((i * 73) % 100);
        const dur = 18 + (i % 6) * 4;
        const delay = -((i * 5) % dur);
        const size = 3 + (i % 3);
        return (
          <div
            key={i}
            className="mp-particle"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              background: color,
              animation: `mp-particle-rise ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

const CSS = `
  .mp-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }
  .mp-base { position: absolute; inset: 0; }
  .mp-sunrise { position: absolute; inset: 0; mix-blend-mode: screen;
    animation: mp-sunrise-breathe 14s ease-in-out infinite; }

  /* ── Sun rays ── */
  .mp-rays-wrap {
    position: absolute;
    left: 50%; bottom: -40%;
    width: 200vh; height: 200vh;
    transform: translateX(-50%);
    mix-blend-mode: screen;
  }
  .mp-rays { position: absolute; inset: 0; transform-origin: center; }
  .mp-rays-1 { animation: mp-rays-spin-cw 180s linear infinite; }
  .mp-rays-2 { animation: mp-rays-spin-ccw 240s linear infinite; }

  /* ── Waves ── */
  .mp-waves-wrap {
    position: absolute;
    left: -30%; right: -30%;
    bottom: 0;
    height: 30%;
  }
  .mp-wave {
    position: absolute;
    left: 0; right: 0;
    bottom: 0;
    width: 200%;
    height: 100%;
  }
  .mp-wave-1 { animation: mp-wave-drift-r 28s ease-in-out infinite alternate; }
  .mp-wave-2 { animation: mp-wave-drift-l 36s ease-in-out infinite alternate; }
  .mp-wave-3 { animation: mp-wave-drift-r 22s ease-in-out infinite alternate; }

  /* ── Clouds ── */
  .mp-clouds-wrap { position: absolute; inset: 0; }
  .mp-cloud {
    position: absolute;
    left: -30%;
    border-radius: 50%;
    filter: blur(8px);
  }

  /* ── Stars ── */
  .mp-stars-wrap { position: absolute; inset: 0; }
  .mp-star {
    position: absolute;
    border-radius: 50%;
    box-shadow: 0 0 4px currentColor;
  }

  /* ── Leaves / petals ── */
  .mp-leaves-wrap { position: absolute; inset: 0; }
  .mp-leaf, .mp-petal {
    position: absolute;
    width: 22px; height: 22px;
    top: -10%;
    will-change: transform, opacity;
  }

  /* ── Particles ── */
  .mp-particles-wrap { position: absolute; inset: 0; }
  .mp-particle {
    position: absolute;
    bottom: -5%;
    border-radius: 50%;
    filter: blur(1px);
    will-change: transform, opacity;
  }

  /* ── Keyframes ── */
  @keyframes mp-sunrise-breathe {
    0%, 100% { opacity: 0.6; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
  }
  @keyframes mp-rays-spin-cw  { from { transform: rotate(0); } to { transform: rotate(360deg); } }
  @keyframes mp-rays-spin-ccw { from { transform: rotate(0); } to { transform: rotate(-360deg); } }
  @keyframes mp-wave-drift-r {
    from { transform: translateX(-25%); }
    to   { transform: translateX(0%); }
  }
  @keyframes mp-wave-drift-l {
    from { transform: translateX(0%); }
    to   { transform: translateX(-25%); }
  }
  @keyframes mp-cloud-drift {
    from { transform: translateX(-100%); }
    to   { transform: translateX(120vw); }
  }
  @keyframes mp-star-twinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50%      { opacity: 1;   transform: scale(1.2); }
  }
  @keyframes mp-particle-rise {
    0%   { transform: translateY(0)        scale(0.6); opacity: 0; }
    15%  { opacity: 0.8; }
    50%  { opacity: 1; }
    85%  { opacity: 0.4; }
    100% { transform: translateY(-110vh)   scale(1); opacity: 0; }
  }

  /* Each leaf gets its own keyframe with unique drift + rotation values
     bound through CSS custom properties for variety. */
  ${[0, 1, 2, 3, 4, 5].map(i => `
  @keyframes mp-leaf-fall-${i} {
    0% {
      transform: translateY(0) translateX(0) rotate(0);
      opacity: 0;
    }
    10% { opacity: 0.8; }
    50% { opacity: 1; }
    90% { opacity: 0.6; }
    100% {
      transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rot));
      opacity: 0;
    }
  }`).join('\n')}

  @media (prefers-reduced-motion: reduce) {
    .mp-sunrise,
    .mp-rays-1, .mp-rays-2,
    .mp-wave-1, .mp-wave-2, .mp-wave-3,
    .mp-cloud, .mp-star, .mp-leaf, .mp-petal, .mp-particle {
      animation: none !important;
    }
    .mp-leaf, .mp-petal, .mp-particle { opacity: 0; }
  }
`;
