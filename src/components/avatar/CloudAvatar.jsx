/**
 * CloudAvatar — CSS/SVG animated cloud avatar (no R3F / Three.js)
 * Fully animated, per-bot colours, speaking/listening/thinking states
 */
import React, { useMemo } from 'react';

const BOT_CLOUD = {
  gideon: { color: '#C9A227', glow: '#F0D98A', particle: '#F5E49A' },
  hannah: { color: '#AFC7E3', glow: '#C8E4F6', particle: '#D0EAFC' },
  coach:  { color: '#38BDF8', glow: '#A8DEFF', particle: '#7DD3FC' },
  chef:   { color: '#22C55E', glow: '#A7F3C4', particle: '#86EFAC' },
  paul:   { color: '#A78BFA', glow: '#DDD6FE', particle: '#C4B5FD' },
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function CloudAvatar({
  character   = 'gideon',
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 260,
  height      = 260,
  className   = '',
}) {
  const cfg = BOT_CLOUD[character] || BOT_CLOUD.gideon;
  const rgb = useMemo(() => hexToRgb(cfg.color), [cfg.color]);
  const glowRgb = useMemo(() => hexToRgb(cfg.glow), [cfg.glow]);

  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'idle';

  const size = Math.min(width, height);

  // Particle positions (deterministic, based on index)
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const r = 38 + (i % 3) * 8;
      return {
        x: 50 + Math.cos(angle) * r,
        y: 50 + Math.sin(angle) * r,
        delay: (i * 0.18).toFixed(2),
        size: 1.5 + (i % 3) * 0.8,
      };
    });
  }, []);

  const scaleAnim = state === 'speaking' ? 'cloudScale-speaking' :
                    state === 'listening' ? 'cloudScale-listening' :
                    state === 'thinking'  ? 'cloudScale-thinking'  : 'cloudScale-idle';

  const glowOpacity = state === 'speaking' ? 0.75 : state === 'listening' ? 0.55 : state === 'thinking' ? 0.45 : 0.30;

  return (
    <div
      className={className}
      style={{ width, height, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <style>{`
        @keyframes cloudScale-idle {
          0%,100% { transform: scale(1.00) translateY(0px); }
          50%      { transform: scale(1.03) translateY(-4px); }
        }
        @keyframes cloudScale-listening {
          0%,100% { transform: scale(1.04) translateY(-3px); }
          50%      { transform: scale(1.08) translateY(-7px); }
        }
        @keyframes cloudScale-thinking {
          0%   { transform: scale(1.00) rotate(0deg) translateY(0px); }
          25%  { transform: scale(1.03) rotate(1.5deg) translateY(-3px); }
          75%  { transform: scale(1.03) rotate(-1.5deg) translateY(-3px); }
          100% { transform: scale(1.00) rotate(0deg) translateY(0px); }
        }
        @keyframes cloudScale-speaking {
          0%,100% { transform: scale(1.04) translateY(-2px); }
          20%     { transform: scale(1.11) translateY(-6px); }
          40%     { transform: scale(1.06) translateY(-3px); }
          60%     { transform: scale(1.12) translateY(-7px); }
          80%     { transform: scale(1.07) translateY(-4px); }
        }
        @keyframes cloudGlow {
          0%,100% { opacity: var(--glow-base); }
          50%      { opacity: calc(var(--glow-base) + 0.18); }
        }
        @keyframes cloudParticle {
          0%,100% { opacity: 0.15; transform: scale(0.7); }
          50%      { opacity: 0.55; transform: scale(1.2); }
        }
        @keyframes cloudRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes cloudThinkDots {
          0%,80%,100% { opacity: 0.2; transform: translateY(0); }
          40%          { opacity: 1;   transform: translateY(-3px); }
        }
      `}</style>

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ overflow: 'visible', filter: `drop-shadow(0 0 ${state === 'speaking' ? 14 : 8}px rgba(${rgb},${glowOpacity}))` }}
      >
        {/* Outer glow ring */}
        <circle
          cx="50" cy="50" r="44"
          fill="none"
          stroke={cfg.glow}
          strokeWidth="0.6"
          opacity={state === 'speaking' ? 0.35 : 0.15}
          style={{
            transformOrigin: '50px 50px',
            animation: 'cloudRing 8s linear infinite',
          }}
          strokeDasharray="12 8"
        />

        {/* Spinning dashed ring */}
        <circle
          cx="50" cy="50" r="38"
          fill="none"
          stroke={cfg.color}
          strokeWidth="0.5"
          opacity={state === 'idle' ? 0.10 : 0.22}
          style={{
            transformOrigin: '50px 50px',
            animation: `cloudRing ${state === 'speaking' ? '3s' : '12s'} linear infinite reverse`,
          }}
          strokeDasharray="6 14"
        />

        {/* Particles */}
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={cfg.particle}
            style={{
              animation: `cloudParticle ${state === 'speaking' ? '0.7s' : '2.2s'} ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              transformOrigin: `${p.x}px ${p.y}px`,
            }}
          />
        ))}

        {/* Main animated cloud body */}
        <g style={{
          transformOrigin: '50px 50px',
          animation: `${scaleAnim} ${
            state === 'speaking' ? '0.55s' :
            state === 'listening' ? '1.2s' :
            state === 'thinking' ? '2.4s' : '3.2s'
          } ease-in-out infinite`,
        }}>
          {/* Inner glow */}
          <circle cx="50" cy="50" r="24"
            fill={cfg.glow}
            opacity="0.18"
          />
          {/* Core lobes */}
          <circle cx="50"  cy="50"  r="20" fill={cfg.color} opacity="0.95" />
          <circle cx="36"  cy="46"  r="13" fill={cfg.color} opacity="0.90" />
          <circle cx="64"  cy="46"  r="13" fill={cfg.color} opacity="0.90" />
          <circle cx="44"  cy="38"  r="11" fill={cfg.color} opacity="0.88" />
          <circle cx="56"  cy="38"  r="11" fill={cfg.color} opacity="0.88" />
          <circle cx="50"  cy="34"  r="10" fill={cfg.color} opacity="0.85" />
          <circle cx="31"  cy="51"  r="10" fill={cfg.color} opacity="0.82" />
          <circle cx="69"  cy="51"  r="10" fill={cfg.color} opacity="0.82" />
          {/* Highlight */}
          <ellipse cx="43" cy="40" rx="6" ry="4" fill="white" opacity="0.22" transform="rotate(-20,43,40)" />
        </g>

        {/* Thinking dots overlay */}
        {state === 'thinking' && [0, 1, 2].map(i => (
          <circle
            key={i}
            cx={44 + i * 6}
            cy="50"
            r="2"
            fill="white"
            style={{
              animation: 'cloudThinkDots 1s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}