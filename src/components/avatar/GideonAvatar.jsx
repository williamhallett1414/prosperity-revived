/**
 * GideonAvatar
 * Full-image avatar using the 3D biblical figure illustration.
 * Preserves all animation states from the original CloudAvatar:
 *   idle      — gentle float + slow gold pulse
 *   speaking  — energetic bounce + bright radiance burst
 *   listening — attentive lean + ripple rings
 *   thinking  — subtle sway + golden shimmer
 */
import React, { useMemo } from 'react';
import gideonImg from '@/assets/gideon-avatar.png';

// Deterministic floating particles (same positions as CloudAvatar for continuity)
function buildParticles() {
  return Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const r = 36 + (i % 4) * 9;
    return {
      x: 50 + Math.cos(angle) * r,
      y: 50 + Math.sin(angle) * r,
      delay: (i * 0.16).toFixed(2),
      size: 1.4 + (i % 3) * 0.9,
      isStar: i % 4 === 0,
    };
  });
}

const PARTICLES = buildParticles();

export default function GideonAvatar({
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 260,
  height      = 260,
  className   = '',
}) {
  const state = isSpeaking  ? 'speaking'
              : isListening ? 'listening'
              : isThinking  ? 'thinking'
              : 'idle';

  const glowIntensity = state === 'speaking'  ? 0.85
                      : state === 'listening' ? 0.60
                      : state === 'thinking'  ? 0.45
                      : 0.28;

  const particleSpeed = state === 'speaking'  ? '0.6s'
                      : state === 'thinking'  ? '1.8s'
                      : '2.6s';

  const imageAnim = state === 'speaking'  ? 'gideon-speaking'
                  : state === 'listening' ? 'gideon-listening'
                  : state === 'thinking'  ? 'gideon-thinking'
                  : 'gideon-idle';

  // Halo / glow brightens when speaking
  const haloOpacity = state === 'speaking' ? 0.70 : state === 'listening' ? 0.45 : 0.22;
  const haloScale   = state === 'speaking' ? 1.12 : 1.0;

  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        /* ── Image body animations ── */
        @keyframes gideon-idle {
          0%,100% { transform: translateY(0px) scale(1.00) rotate(0deg); }
          30%      { transform: translateY(-6px) scale(1.01) rotate(0.4deg); }
          70%      { transform: translateY(-4px) scale(1.01) rotate(-0.4deg); }
        }
        @keyframes gideon-listening {
          0%,100% { transform: translateY(-3px) scale(1.02) rotate(0deg); }
          25%     { transform: translateY(-8px) scale(1.03) rotate(1.0deg); }
          75%     { transform: translateY(-8px) scale(1.03) rotate(-1.0deg); }
        }
        @keyframes gideon-thinking {
          0%   { transform: translateY(0px) scale(1.00) rotate(0deg); }
          20%  { transform: translateY(-4px) scale(1.01) rotate(1.8deg); }
          50%  { transform: translateY(-5px) scale(1.01) rotate(0deg); }
          80%  { transform: translateY(-4px) scale(1.01) rotate(-1.8deg); }
          100% { transform: translateY(0px) scale(1.00) rotate(0deg); }
        }
        @keyframes gideon-speaking {
          0%,100% { transform: translateY(-2px) scale(1.03) rotate(0deg); }
          15%     { transform: translateY(-9px) scale(1.07) rotate(0.8deg); }
          35%     { transform: translateY(-4px) scale(1.04) rotate(-0.5deg); }
          55%     { transform: translateY(-10px) scale(1.08) rotate(0.8deg); }
          75%     { transform: translateY(-5px) scale(1.05) rotate(-0.4deg); }
        }

        /* ── Halo breathing ── */
        @keyframes gideon-halo-idle {
          0%,100% { opacity: 0.22; transform: scale(1.0); }
          50%      { opacity: 0.30; transform: scale(1.04); }
        }
        @keyframes gideon-halo-speaking {
          0%,100% { opacity: 0.65; transform: scale(1.10); }
          30%     { opacity: 0.85; transform: scale(1.18); }
          60%     { opacity: 0.70; transform: scale(1.12); }
        }
        @keyframes gideon-halo-thinking {
          0%,100% { opacity: 0.35; transform: scale(1.0) rotate(0deg); }
          50%      { opacity: 0.50; transform: scale(1.05) rotate(3deg); }
        }

        /* ── Rotating outer ring ── */
        @keyframes gideon-ring-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes gideon-ring-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }

        /* ── Particles ── */
        @keyframes gideon-particle {
          0%,100% { opacity: 0.12; transform: scale(0.65); }
          50%      { opacity: 0.65; transform: scale(1.25); }
        }
        @keyframes gideon-star {
          0%,100% { opacity: 0.10; transform: scale(0.6) rotate(0deg); }
          50%      { opacity: 0.80; transform: scale(1.3) rotate(45deg); }
        }

        /* ── Listening ripple rings ── */
        @keyframes gideon-ripple {
          0%   { transform: scale(1.0); opacity: 0.50; }
          100% { transform: scale(1.6); opacity: 0.00; }
        }

        /* ── Thinking dots ── */
        @keyframes gideon-dot {
          0%,80%,100% { opacity: 0.15; transform: translateY(0); }
          40%          { opacity: 0.90; transform: translateY(-4px); }
        }

        /* ── Golden glow shimmer on figure ── */
        @keyframes gideon-shimmer {
          0%,100% { filter: brightness(1.00) saturate(1.0); }
          50%      { filter: brightness(1.18) saturate(1.2); }
        }
        @keyframes gideon-shimmer-speaking {
          0%,100% { filter: brightness(1.05) saturate(1.1) drop-shadow(0 0 8px rgba(201,162,39,0.5)); }
          25%     { filter: brightness(1.30) saturate(1.4) drop-shadow(0 0 18px rgba(201,162,39,0.9)); }
          50%     { filter: brightness(1.12) saturate(1.2) drop-shadow(0 0 10px rgba(201,162,39,0.6)); }
          75%     { filter: brightness(1.28) saturate(1.4) drop-shadow(0 0 16px rgba(201,162,39,0.85)); }
        }
      `}</style>

      {/* ── SVG layer: rings + particles + halo (sits behind the image) ── */}
      <svg
        viewBox="0 0 100 100"
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        {/* Radial halo */}
        <radialGradient id="gideon-halo-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#F5E49A" stopOpacity="0.9" />
          <stop offset="55%"  stopColor="#C9A227" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0.0" />
        </radialGradient>
        <circle
          cx="50" cy="48" r="34"
          fill="url(#gideon-halo-grad)"
          style={{
            transformOrigin: '50px 48px',
            animation: state === 'speaking'
              ? `gideon-halo-speaking ${state === 'speaking' ? '0.55s' : '2s'} ease-in-out infinite`
              : state === 'thinking'
              ? 'gideon-halo-thinking 2.4s ease-in-out infinite'
              : 'gideon-halo-idle 3.5s ease-in-out infinite',
          }}
        />

        {/* Outer dashed ring (clockwise) */}
        <circle
          cx="50" cy="50" r="46"
          fill="none"
          stroke="#F0D98A"
          strokeWidth="0.5"
          strokeDasharray="10 9"
          opacity={state === 'speaking' ? 0.40 : 0.14}
          style={{
            transformOrigin: '50px 50px',
            animation: `gideon-ring-cw ${state === 'speaking' ? '3s' : '10s'} linear infinite`,
          }}
        />

        {/* Inner dashed ring (counter-clockwise) */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="#C9A227"
          strokeWidth="0.4"
          strokeDasharray="5 13"
          opacity={state === 'idle' ? 0.09 : 0.20}
          style={{
            transformOrigin: '50px 50px',
            animation: `gideon-ring-ccw ${state === 'speaking' ? '4s' : '14s'} linear infinite`,
          }}
        />

        {/* Listening ripple rings */}
        {state === 'listening' && [0, 1].map(i => (
          <circle
            key={i}
            cx="50" cy="50" r="36"
            fill="none"
            stroke="#F0D98A"
            strokeWidth="1"
            style={{
              transformOrigin: '50px 50px',
              animation: `gideon-ripple 1.6s ease-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}

        {/* Floating particles + sparkle stars */}
        {PARTICLES.map((p, i) => {
          if (p.isStar) {
            // 4-pointed star using path
            const s = p.size * 1.6;
            return (
              <path
                key={i}
                d={`M${p.x},${p.y - s} L${p.x + s * 0.3},${p.y - s * 0.3} L${p.x + s},${p.y} L${p.x + s * 0.3},${p.y + s * 0.3} L${p.x},${p.y + s} L${p.x - s * 0.3},${p.y + s * 0.3} L${p.x - s},${p.y} L${p.x - s * 0.3},${p.y - s * 0.3} Z`}
                fill="#F5E49A"
                style={{
                  transformOrigin: `${p.x}px ${p.y}px`,
                  animation: `gideon-star ${particleSpeed} ease-in-out infinite`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            );
          }
          return (
            <circle
              key={i}
              cx={p.x} cy={p.y} r={p.size}
              fill="#F5E49A"
              style={{
                transformOrigin: `${p.x}px ${p.y}px`,
                animation: `gideon-particle ${particleSpeed} ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          );
        })}

        {/* Thinking dots */}
        {state === 'thinking' && [0, 1, 2].map(i => (
          <circle
            key={i}
            cx={43 + i * 7} cy={92}
            r={2.2}
            fill="#C9A227"
            style={{
              animation: 'gideon-dot 1.1s ease-in-out infinite',
              animationDelay: `${i * 0.22}s`,
            }}
          />
        ))}
      </svg>

      {/* ── The 3D figure image ── */}
      <img
        src={gideonImg}
        alt="Gideon"
        draggable={false}
        style={{
          position: 'relative',
          zIndex: 1,
          width:  width  * 0.88,
          height: height * 0.88,
          objectFit: 'contain',
          transformOrigin: 'center bottom',
          animation: `${imageAnim} ${
            state === 'speaking'  ? '0.55s' :
            state === 'listening' ? '1.3s'  :
            state === 'thinking'  ? '2.6s'  : '3.8s'
          } ease-in-out infinite, ${
            state === 'speaking' ? 'gideon-shimmer-speaking 0.55s ease-in-out infinite' :
                                   'gideon-shimmer 3.8s ease-in-out infinite'
          }`,
          filter: state === 'speaking'
            ? `drop-shadow(0 0 16px rgba(201,162,39,${glowIntensity}))`
            : `drop-shadow(0 0 ${state === 'listening' ? 10 : 6}px rgba(201,162,39,${glowIntensity}))`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      />
    </div>
  );
}
