/**
 * WisdomStudy — Warm contemplative atmosphere for Coach Paul
 * 
 * Evokes a quiet evening study — wisdom, patience, depth.
 * Features:
 * - Soft floating constellation dots connected by faint lines
 * - Warm purple/violet ambient orbs
 * - Gentle rising light particles (like thoughts ascending)
 * - A subtle radial glow behind the avatar
 * - Orbs intensify when Paul speaks
 */
import { memo } from 'react';

const WisdomStudy = memo(function WisdomStudy({ speaking = false }) {
  const glow = speaking ? 1.0 : 0.55;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <style>{`
        @keyframes wsOrb1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          25% { transform: translateY(-14px) translateX(6px); opacity: 0.75; }
          50% { transform: translateY(-8px) translateX(-4px); opacity: 0.5; }
          75% { transform: translateY(-16px) translateX(5px); opacity: 0.7; }
        }
        @keyframes wsOrb2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.35; }
          30% { transform: translateY(-12px) translateX(-8px); opacity: 0.7; }
          60% { transform: translateY(-18px) translateX(5px); opacity: 0.45; }
          85% { transform: translateY(-6px) translateX(-3px); opacity: 0.65; }
        }
        @keyframes wsOrb3 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.45; }
          20% { transform: translateY(-10px) translateX(7px); opacity: 0.8; }
          50% { transform: translateY(-20px) translateX(-5px); opacity: 0.4; }
          75% { transform: translateY(-13px) translateX(4px); opacity: 0.7; }
        }
        @keyframes wsRise {
          0% { transform: translateY(0); opacity: 0.3; }
          100% { transform: translateY(-80px); opacity: 0; }
        }
        @keyframes wsCorePulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.04); }
        }
        @keyframes wsStarTwinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }
        @keyframes wsConstellationPulse {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.12; }
        }
      `}</style>

      <svg
        viewBox="0 -100 400 1000"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="wsOrbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.9 * glow} />
            <stop offset="35%" stopColor="#7C3AED" stopOpacity={0.45 * glow} />
            <stop offset="100%" stopColor="#3B0764" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wsWarmOrb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity={0.8 * glow} />
            <stop offset="40%" stopColor="#A78BFA" stopOpacity={0.4 * glow} />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wsCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.15 * glow} />
            <stop offset="40%" stopColor="#7C3AED" stopOpacity={0.08 * glow} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="wsBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>

        {/* Core glow behind avatar */}
        <circle cx="200" cy="550" r="160" fill="url(#wsCore)"
          style={{ animation: `wsCorePulse ${speaking ? '2s' : '5s'} ease-in-out infinite` }} />

        {/* Constellation dots + lines */}
        <g style={{ animation: 'wsConstellationPulse 8s ease-in-out infinite' }}>
          {[
            [60, 280], [130, 310], [90, 360], [160, 340],
            [300, 290], [340, 330], [280, 370], [360, 380],
            [50, 430], [150, 460], [250, 420], [350, 450],
          ].map(([x, y], i) => (
            <circle key={`star${i}`} cx={x} cy={y} r={1.2} fill="#A78BFA" opacity="0.25"
              style={{ animation: `wsStarTwinkle ${4 + i * 0.5}s ease-in-out infinite ${i * 0.3}s` }} />
          ))}
          {/* Faint constellation lines */}
          {[
            [60, 280, 130, 310], [130, 310, 90, 360], [130, 310, 160, 340],
            [300, 290, 340, 330], [340, 330, 280, 370], [280, 370, 360, 380],
            [50, 430, 150, 460], [250, 420, 350, 450],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={`line${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#A78BFA" strokeWidth="0.3" opacity="0.08" />
          ))}
        </g>

        {/* Floating violet/warm orbs */}
        <g filter="url(#wsBlur)">
          {[
            { cx: 70, cy: 350, r: 6, fill: 'url(#wsOrbGlow)', anim: 'wsOrb1', dur: '7s', delay: '0s' },
            { cx: 330, cy: 380, r: 5, fill: 'url(#wsWarmOrb)', anim: 'wsOrb2', dur: '8s', delay: '1s' },
            { cx: 180, cy: 320, r: 7, fill: 'url(#wsOrbGlow)', anim: 'wsOrb3', dur: '6.5s', delay: '2s' },
            { cx: 50, cy: 480, r: 4.5, fill: 'url(#wsWarmOrb)', anim: 'wsOrb1', dur: '9s', delay: '3s' },
            { cx: 350, cy: 500, r: 5.5, fill: 'url(#wsOrbGlow)', anim: 'wsOrb2', dur: '7.5s', delay: '1.5s' },
            { cx: 140, cy: 440, r: 5, fill: 'url(#wsWarmOrb)', anim: 'wsOrb3', dur: '8.5s', delay: '0.5s' },
            { cx: 260, cy: 310, r: 4, fill: 'url(#wsOrbGlow)', anim: 'wsOrb1', dur: '6s', delay: '4s' },
            { cx: 100, cy: 540, r: 5, fill: 'url(#wsWarmOrb)', anim: 'wsOrb2', dur: '7s', delay: '2.5s' },
            { cx: 300, cy: 460, r: 4.5, fill: 'url(#wsOrbGlow)', anim: 'wsOrb3', dur: '8s', delay: '3.5s' },
          ].map((orb, i) => (
            <circle key={i} cx={orb.cx} cy={orb.cy} r={orb.r} fill={orb.fill}
              style={{ animation: `${orb.anim} ${orb.dur} ease-in-out infinite ${orb.delay}` }} />
          ))}
        </g>

        {/* Rising light particles — thoughts ascending */}
        {[
          { x: 170, y: 560, size: 1.2, dur: '5s', delay: '0s' },
          { x: 230, y: 580, size: 1, dur: '6s', delay: '1s' },
          { x: 190, y: 540, size: 0.8, dur: '4.5s', delay: '2s' },
          { x: 210, y: 570, size: 1.3, dur: '5.5s', delay: '0.5s' },
          { x: 180, y: 590, size: 1, dur: '4s', delay: '3s' },
          { x: 220, y: 550, size: 0.7, dur: '6.5s', delay: '1.5s' },
          { x: 160, y: 520, size: 1.1, dur: '5s', delay: '4s' },
          { x: 240, y: 530, size: 0.9, dur: '4.5s', delay: '2.5s' },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size}
            fill="#A78BFA" opacity={0.3 * glow}
            style={{ animation: `wsRise ${p.dur} ease-out infinite ${p.delay}` }} />
        ))}

        {/* Ambient top glow */}
        <ellipse cx="200" cy="260" rx="120" ry="60" fill="#A78BFA" opacity={0.03 * glow} />
      </svg>
    </div>
  );
});

export default WisdomStudy;
