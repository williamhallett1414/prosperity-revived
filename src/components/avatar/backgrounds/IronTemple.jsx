/**
 * IronTemple — Sacred geometry / energy field for Coach David's chat screen
 * 
 * A futuristic-spiritual training ground evoking power and discipline.
 * Features:
 * - Pulsing sacred geometry patterns (hexagons, circles)
 * - Energy circuit lines running along edges
 * - Floating electric blue energy orbs
 * - Power core glow radiating behind avatar
 * - Lightning/energy flickers when David speaks
 * - Geometric grid floor at the bottom
 */
import { memo } from 'react';

const IronTemple = memo(function IronTemple({ speaking = false }) {
  const power = speaking ? 1.0 : 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <style>{`
        @keyframes geoRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes geoRotateReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes geoPulse1 {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.18; transform: scale(1.03); }
        }
        @keyframes geoPulse2 {
          0%, 100% { opacity: 0.06; transform: scale(1.02); }
          50% { opacity: 0.15; transform: scale(0.98); }
        }
        @keyframes energyOrb1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.85; }
          50% { transform: translateY(-10px) translateX(-8px); opacity: 0.5; }
          75% { transform: translateY(-25px) translateX(5px); opacity: 0.7; }
        }
        @keyframes energyOrb2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.35; }
          30% { transform: translateY(-15px) translateX(-12px); opacity: 0.8; }
          60% { transform: translateY(-22px) translateX(6px); opacity: 0.45; }
          85% { transform: translateY(-8px) translateX(-4px); opacity: 0.7; }
        }
        @keyframes energyOrb3 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
          20% { transform: translateY(-18px) translateX(8px); opacity: 0.75; }
          50% { transform: translateY(-28px) translateX(-10px); opacity: 0.4; }
          75% { transform: translateY(-12px) translateX(12px); opacity: 0.85; }
        }
        @keyframes circuitFlow {
          0% { stroke-dashoffset: 40; opacity: 0.1; }
          50% { stroke-dashoffset: 0; opacity: 0.3; }
          100% { stroke-dashoffset: -40; opacity: 0.1; }
        }
        @keyframes circuitFlow2 {
          0% { stroke-dashoffset: 50; opacity: 0.08; }
          50% { stroke-dashoffset: 0; opacity: 0.25; }
          100% { stroke-dashoffset: -50; opacity: 0.08; }
        }
        @keyframes corePulse {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.06); }
        }
        @keyframes lightningFlash {
          0%, 92%, 100% { opacity: 0; }
          94% { opacity: 0.6; }
          96% { opacity: 0; }
          97% { opacity: 0.4; }
          99% { opacity: 0; }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.08; }
        }
        @keyframes particleRise {
          0% { transform: translateY(0); opacity: 0.3; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
      `}</style>

      <svg
        viewBox="0 0 400 900"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Energy orb glow */}
          <radialGradient id="dvOrbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.95 * power} />
            <stop offset="35%" stopColor="#3B82F6" stopOpacity={0.5 * power} />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </radialGradient>

          {/* White-hot energy orb */}
          <radialGradient id="dvHotOrb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E0E7FF" stopOpacity={0.9 * power} />
            <stop offset="30%" stopColor="#93C5FD" stopOpacity={0.5 * power} />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
          </radialGradient>

          {/* Power core gradient */}
          <radialGradient id="dvCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.2 * power} />
            <stop offset="30%" stopColor="#3B82F6" stopOpacity={0.1 * power} />
            <stop offset="60%" stopColor="#1E3A8A" stopOpacity={0.04 * power} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Grid gradient */}
          <linearGradient id="dvGrid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.06" />
          </linearGradient>

          {/* Soft blur */}
          <filter id="dvGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>

          <filter id="dvSharp">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>

        {/* ── Power Core — behind avatar center ── */}
        <circle cx="200" cy="500" r="180" fill="url(#dvCore)"
          style={{ animation: `corePulse ${speaking ? '1.5s' : '4s'} ease-in-out infinite` }} />

        {/* ── Sacred Geometry — outer ring (slow rotate) ── */}
        <g style={{ animation: 'geoRotate 60s linear infinite', transformOrigin: '200px 200px' }}>
          {/* Outer hexagon */}
          <polygon
            points="200,80 304,140 304,260 200,320 96,260 96,140"
            fill="none" stroke="#3B82F6" strokeWidth="0.6"
            style={{ animation: `geoPulse1 ${speaking ? '2s' : '5s'} ease-in-out infinite` }}
          />
          {/* Mid hexagon */}
          <polygon
            points="200,110 278,155 278,245 200,290 122,245 122,155"
            fill="none" stroke="#60A5FA" strokeWidth="0.4"
            style={{ animation: 'geoPulse2 6s ease-in-out infinite 1s' }}
          />
          {/* Connecting lines */}
          {[0, 60, 120, 180, 240, 300].map(angle => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 200 + 120 * Math.cos(rad);
            const y1 = 200 + 120 * Math.sin(rad);
            const x2 = 200 + 80 * Math.cos(rad);
            const y2 = 200 + 80 * Math.sin(rad);
            return (
              <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#3B82F6" strokeWidth="0.3" opacity="0.12" />
            );
          })}
        </g>

        {/* ── Sacred Geometry — inner ring (reverse rotate) ── */}
        <g style={{ animation: 'geoRotateReverse 45s linear infinite', transformOrigin: '200px 200px' }}>
          {/* Inner circle */}
          <circle cx="200" cy="200" r="55" fill="none" stroke="#60A5FA" strokeWidth="0.4"
            style={{ animation: 'geoPulse1 4s ease-in-out infinite 0.5s' }} />
          {/* Inner triangle */}
          <polygon
            points="200,150 243,225 157,225"
            fill="none" stroke="#93C5FD" strokeWidth="0.3"
            style={{ animation: 'geoPulse2 5s ease-in-out infinite' }}
          />
          {/* Inverted triangle */}
          <polygon
            points="200,250 157,175 243,175"
            fill="none" stroke="#93C5FD" strokeWidth="0.3"
            style={{ animation: 'geoPulse1 5s ease-in-out infinite 2s' }}
          />
        </g>

        {/* ── Energy circuit lines — left edge ── */}
        <g>
          <path d="M0 150 L15 150 L25 180 L15 210 L25 240 L15 270 L25 300 L15 330 L0 330"
            fill="none" stroke="#3B82F6" strokeWidth="1"
            strokeDasharray="8 6"
            style={{ animation: 'circuitFlow 3s linear infinite' }} />
          {/* Circuit nodes */}
          {[150, 210, 270, 330].map(y => (
            <circle key={y} cx="15" cy={y} r="2" fill="#60A5FA" opacity={0.3 * power} />
          ))}
        </g>

        {/* ── Energy circuit lines — right edge ── */}
        <g>
          <path d="M400 180 L385 180 L375 210 L385 240 L375 270 L385 300 L375 330 L385 360 L400 360"
            fill="none" stroke="#3B82F6" strokeWidth="1"
            strokeDasharray="8 6"
            style={{ animation: 'circuitFlow2 3.5s linear infinite 0.5s' }} />
          {[180, 240, 300, 360].map(y => (
            <circle key={y} cx="385" cy={y} r="2" fill="#60A5FA" opacity={0.3 * power} />
          ))}
        </g>

        {/* ── Top circuit bar ── */}
        <g>
          <line x1="50" y1="40" x2="350" y2="40" stroke="#1E3A8A" strokeWidth="0.5" opacity="0.15" />
          <line x1="80" y1="50" x2="320" y2="50" stroke="#3B82F6" strokeWidth="0.3" opacity="0.1"
            strokeDasharray="4 8"
            style={{ animation: 'circuitFlow 4s linear infinite' }} />
          {[80, 140, 200, 260, 320].map(x => (
            <rect key={x} x={x - 1.5} y={38} width="3" height="3" rx="0.5"
              fill="#60A5FA" opacity={0.15 * power} />
          ))}
        </g>

        {/* ── Floating energy orbs ── */}
        <g filter="url(#dvGlow)">
          {[
            { cx: 55, cy: 280, r: 6, fill: 'url(#dvOrbGlow)', anim: 'energyOrb1', dur: '5s', delay: '0s' },
            { cx: 345, cy: 320, r: 5, fill: 'url(#dvHotOrb)', anim: 'energyOrb2', dur: '6s', delay: '1s' },
            { cx: 150, cy: 250, r: 7, fill: 'url(#dvOrbGlow)', anim: 'energyOrb3', dur: '7s', delay: '2s' },
            { cx: 300, cy: 200, r: 4.5, fill: 'url(#dvHotOrb)', anim: 'energyOrb1', dur: '6.5s', delay: '3s' },
            { cx: 80, cy: 400, r: 5.5, fill: 'url(#dvOrbGlow)', anim: 'energyOrb2', dur: '5.5s', delay: '0.5s' },
            { cx: 350, cy: 450, r: 5, fill: 'url(#dvHotOrb)', anim: 'energyOrb3', dur: '8s', delay: '1.5s' },
            { cx: 200, cy: 350, r: 6, fill: 'url(#dvOrbGlow)', anim: 'energyOrb1', dur: '7s', delay: '4s' },
            { cx: 120, cy: 450, r: 4, fill: 'url(#dvHotOrb)', anim: 'energyOrb2', dur: '6s', delay: '2.5s' },
          ].map((orb, i) => (
            <circle key={i} cx={orb.cx} cy={orb.cy} r={orb.r} fill={orb.fill}
              style={{ animation: `${orb.anim} ${orb.dur} ease-in-out infinite ${orb.delay}` }} />
          ))}
        </g>

        {/* ── Rising energy particles ── */}
        {[
          { x: 160, y: 500, size: 1.5, dur: '4s', delay: '0s' },
          { x: 240, y: 520, size: 1, dur: '5s', delay: '1s' },
          { x: 180, y: 480, size: 1.2, dur: '3.5s', delay: '2s' },
          { x: 220, y: 510, size: 0.8, dur: '4.5s', delay: '0.5s' },
          { x: 190, y: 530, size: 1.3, dur: '3s', delay: '3s' },
          { x: 210, y: 490, size: 1, dur: '5.5s', delay: '1.5s' },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size}
            fill="#60A5FA" opacity={0.3 * power}
            style={{ animation: `particleRise ${p.dur} ease-out infinite ${p.delay}` }} />
        ))}

        {/* ── Lightning flickers (speaking only) ── */}
        {speaking && (
          <g>
            <line x1="130" y1="60" x2="145" y2="120" stroke="#93C5FD" strokeWidth="1.5"
              style={{ animation: 'lightningFlash 3s linear infinite' }} />
            <line x1="145" y1="120" x2="135" y2="130" stroke="#93C5FD" strokeWidth="1"
              style={{ animation: 'lightningFlash 3s linear infinite' }} />
            <line x1="270" y1="50" x2="258" y2="105" stroke="#BFDBFE" strokeWidth="1.2"
              style={{ animation: 'lightningFlash 4s linear infinite 1.5s' }} />
            <line x1="258" y1="105" x2="265" y2="115" stroke="#BFDBFE" strokeWidth="0.8"
              style={{ animation: 'lightningFlash 4s linear infinite 1.5s' }} />
          </g>
        )}

        {/* ── Geometric grid floor ── */}
        <g style={{ animation: 'gridPulse 6s ease-in-out infinite' }}>
          {/* Perspective grid lines — horizontal */}
          {[780, 800, 820, 840, 860, 880].map(y => (
            <line key={y} x1="0" y1={y} x2="400" y2={y}
              stroke="#3B82F6" strokeWidth="0.3" opacity="0.06" />
          ))}
          {/* Perspective grid lines — vertical (converging) */}
          {[50, 100, 150, 200, 250, 300, 350].map(x => {
            const convergeFactor = (x - 200) * 0.3;
            return (
              <line key={x} x1={x} y1={770} x2={200 + convergeFactor} y2={900}
                stroke="#3B82F6" strokeWidth="0.3" opacity="0.05" />
            );
          })}
        </g>
      </svg>
    </div>
  );
});

export default IronTemple;
