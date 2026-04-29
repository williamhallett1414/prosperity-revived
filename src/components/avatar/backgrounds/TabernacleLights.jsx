/**
 * TabernacleLights — Ancient tent oil lamp lights for Gideon's chat screen
 * 
 * SVG-based ambient lighting that evokes the Tabernacle / Old Testament
 * place of worship. Features:
 * - Hanging oil lamps with flickering warm golden flames
 * - Draped fabric/rope across the top
 * - Warm golden light pools radiating down
 * - Subtle smoke/mist wisps
 * - All animated with CSS keyframes
 */
import { memo } from 'react';

const TabernacleLights = memo(function TabernacleLights({ speaking = false }) {
  const flameIntensity = speaking ? 1.0 : 0.7;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <style>{`
        @keyframes flicker1 {
          0%, 100% { opacity: 0.75; transform: scaleY(1) translateX(0); }
          25% { opacity: 0.9; transform: scaleY(1.08) translateX(-0.5px); }
          50% { opacity: 0.65; transform: scaleY(0.95) translateX(0.5px); }
          75% { opacity: 0.85; transform: scaleY(1.04) translateX(-0.3px); }
        }
        @keyframes flicker2 {
          0%, 100% { opacity: 0.7; transform: scaleY(1) translateX(0); }
          30% { opacity: 0.85; transform: scaleY(1.06) translateX(0.4px); }
          60% { opacity: 0.6; transform: scaleY(0.92) translateX(-0.6px); }
          80% { opacity: 0.8; transform: scaleY(1.03) translateX(0.2px); }
        }
        @keyframes flicker3 {
          0%, 100% { opacity: 0.65; transform: scaleY(1.02) translateX(0.3px); }
          20% { opacity: 0.8; transform: scaleY(0.96) translateX(-0.4px); }
          45% { opacity: 0.7; transform: scaleY(1.07) translateX(0.5px); }
          70% { opacity: 0.9; transform: scaleY(0.98) translateX(-0.2px); }
        }
        @keyframes glowPulse1 {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.4; }
        }
        @keyframes glowPulse2 {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.35; }
        }
        @keyframes glowPulse3 {
          0%, 100% { opacity: 0.22; }
          50% { opacity: 0.38; }
        }
        @keyframes smokeRise {
          0% { opacity: 0.15; transform: translateY(0) scaleX(1); }
          50% { opacity: 0.08; transform: translateY(-20px) scaleX(1.3); }
          100% { opacity: 0; transform: translateY(-40px) scaleX(1.6); }
        }
        @keyframes ropeSwing {
          0%, 100% { transform: rotate(-0.3deg); }
          50% { transform: rotate(0.3deg); }
        }
      `}</style>

      <svg
        viewBox="0 0 400 900"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flame gradient */}
          <radialGradient id="flameGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="40%" stopColor="#FF8C00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B4513" stopOpacity="0" />
          </radialGradient>

          {/* Light pool gradient */}
          <radialGradient id="lightPool1" cx="50%" cy="0%" r="80%" fx="50%" fy="10%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity={0.18 * flameIntensity} />
            <stop offset="30%" stopColor="#FFA500" stopOpacity={0.10 * flameIntensity} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="lightPool2" cx="50%" cy="0%" r="70%" fx="50%" fy="10%">
            <stop offset="0%" stopColor="#FFCC44" stopOpacity={0.15 * flameIntensity} />
            <stop offset="40%" stopColor="#CC8800" stopOpacity={0.08 * flameIntensity} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Smoke blur */}
          <filter id="smokeBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>

          {/* Lamp body gradient */}
          <linearGradient id="lampBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B6914" />
            <stop offset="50%" stopColor="#654A0E" />
            <stop offset="100%" stopColor="#3D2B06" />
          </linearGradient>
        </defs>

        {/* ── Draped rope/cord across top ── */}
        <g style={{ animation: 'ropeSwing 8s ease-in-out infinite' }}>
          <path
            d="M -20 55 Q 80 85 140 65 Q 200 45 260 70 Q 320 95 420 50"
            fill="none"
            stroke="#5C3A1E"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M -20 55 Q 80 85 140 65 Q 200 45 260 70 Q 320 95 420 50"
            fill="none"
            stroke="#8B6C42"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>

        {/* ── LAMP 1 (left) ── */}
        <g>
          {/* Chain/rope */}
          <line x1="100" y1="65" x2="100" y2="105" stroke="#5C3A1E" strokeWidth="1.5" opacity="0.5" />
          
          {/* Lamp body */}
          <ellipse cx="100" cy="112" rx="10" ry="6" fill="url(#lampBody)" opacity="0.9" />
          <path d="M90 108 Q92 100 100 98 Q108 100 110 108" fill="url(#lampBody)" opacity="0.85" />
          
          {/* Flame */}
          <g style={{ animation: `flicker1 2.2s ease-in-out infinite`, transformOrigin: '100px 95px' }}>
            <ellipse cx="100" cy="96" rx="4" ry="8" fill="#FFD700" opacity="0.9" />
            <ellipse cx="100" cy="94" rx="2.5" ry="5" fill="#FFF5CC" opacity="0.95" />
            <ellipse cx="100" cy="92" rx="1.2" ry="3" fill="white" opacity="0.8" />
          </g>

          {/* Light pool */}
          <ellipse cx="100" cy="200" rx="90" ry="150" fill="url(#lightPool1)"
            style={{ animation: `glowPulse1 3s ease-in-out infinite` }} />

          {/* Smoke wisps */}
          <g filter="url(#smokeBlur)">
            <circle cx="99" cy="85" r="2" fill="#FFD700" opacity="0.1"
              style={{ animation: 'smokeRise 4s ease-out infinite' }} />
            <circle cx="101" cy="83" r="1.5" fill="#FFCC44" opacity="0.08"
              style={{ animation: 'smokeRise 5s ease-out infinite 1s' }} />
          </g>
        </g>

        {/* ── LAMP 2 (center-right) ── */}
        <g>
          <line x1="260" y1="70" x2="260" y2="100" stroke="#5C3A1E" strokeWidth="1.5" opacity="0.5" />
          
          <ellipse cx="260" cy="107" rx="10" ry="6" fill="url(#lampBody)" opacity="0.9" />
          <path d="M250 103 Q252 95 260 93 Q268 95 270 103" fill="url(#lampBody)" opacity="0.85" />
          
          <g style={{ animation: `flicker2 2.7s ease-in-out infinite`, transformOrigin: '260px 90px' }}>
            <ellipse cx="260" cy="91" rx="4" ry="8" fill="#FFD700" opacity="0.85" />
            <ellipse cx="260" cy="89" rx="2.5" ry="5" fill="#FFF5CC" opacity="0.9" />
            <ellipse cx="260" cy="87" rx="1.2" ry="3" fill="white" opacity="0.75" />
          </g>

          <ellipse cx="260" cy="190" rx="80" ry="140" fill="url(#lightPool2)"
            style={{ animation: `glowPulse2 3.5s ease-in-out infinite` }} />

          <g filter="url(#smokeBlur)">
            <circle cx="259" cy="80" r="2" fill="#FFD700" opacity="0.1"
              style={{ animation: 'smokeRise 4.5s ease-out infinite 0.5s' }} />
          </g>
        </g>

        {/* ── LAMP 3 (far left, smaller) ── */}
        <g>
          <line x1="30" y1="75" x2="30" y2="100" stroke="#5C3A1E" strokeWidth="1.2" opacity="0.4" />
          
          <ellipse cx="30" cy="106" rx="8" ry="5" fill="url(#lampBody)" opacity="0.7" />
          <path d="M22 102 Q24 96 30 94 Q36 96 38 102" fill="url(#lampBody)" opacity="0.7" />
          
          <g style={{ animation: `flicker3 3s ease-in-out infinite`, transformOrigin: '30px 91px' }}>
            <ellipse cx="30" cy="91" rx="3" ry="6" fill="#FFD700" opacity="0.7" />
            <ellipse cx="30" cy="89" rx="2" ry="4" fill="#FFF5CC" opacity="0.8" />
          </g>

          <ellipse cx="30" cy="170" rx="60" ry="110" fill="url(#lightPool1)" opacity="0.5"
            style={{ animation: `glowPulse3 4s ease-in-out infinite` }} />
        </g>

        {/* ── LAMP 4 (far right, smaller) ── */}
        <g>
          <line x1="370" y1="55" x2="370" y2="85" stroke="#5C3A1E" strokeWidth="1.2" opacity="0.4" />
          
          <ellipse cx="370" cy="91" rx="8" ry="5" fill="url(#lampBody)" opacity="0.7" />
          <path d="M362 87 Q364 81 370 79 Q376 81 378 87" fill="url(#lampBody)" opacity="0.7" />
          
          <g style={{ animation: `flicker1 2.5s ease-in-out infinite 0.8s`, transformOrigin: '370px 76px' }}>
            <ellipse cx="370" cy="76" rx="3" ry="6" fill="#FFD700" opacity="0.65" />
            <ellipse cx="370" cy="74" rx="2" ry="4" fill="#FFF5CC" opacity="0.75" />
          </g>

          <ellipse cx="370" cy="160" rx="55" ry="100" fill="url(#lightPool2)" opacity="0.45"
            style={{ animation: `glowPulse1 3.8s ease-in-out infinite 1s` }} />
        </g>

        {/* ── Fabric drapes hanging from rope ── */}
        <g opacity="0.2">
          {/* Left drape */}
          <path d="M50 72 Q48 90 44 105 Q42 115 46 110 Q50 100 52 80 Z" fill="#8B6C42" />
          {/* Center drape */}
          <path d="M180 52 Q178 70 174 85 Q172 92 176 88 Q180 78 182 60 Z" fill="#8B6C42" />
          {/* Right drape */}
          <path d="M330 82 Q328 98 324 110 Q322 118 326 114 Q330 104 332 90 Z" fill="#8B6C42" />
        </g>

        {/* ── Ambient golden particles / dust motes ── */}
        <g>
          {[
            { cx: 60, cy: 180, r: 1, dur: '6s', delay: '0s' },
            { cx: 150, cy: 150, r: 0.8, dur: '7s', delay: '1s' },
            { cx: 200, cy: 200, r: 1.2, dur: '5s', delay: '2s' },
            { cx: 300, cy: 160, r: 0.7, dur: '8s', delay: '0.5s' },
            { cx: 340, cy: 220, r: 1, dur: '6.5s', delay: '3s' },
            { cx: 120, cy: 250, r: 0.6, dur: '7.5s', delay: '1.5s' },
            { cx: 80, cy: 130, r: 0.9, dur: '5.5s', delay: '4s' },
            { cx: 280, cy: 120, r: 0.8, dur: '6s', delay: '2.5s' },
          ].map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#FFD700"
              opacity="0.3"
              style={{
                animation: `smokeRise ${p.dur} ease-in-out infinite ${p.delay}`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});

export default TabernacleLights;
