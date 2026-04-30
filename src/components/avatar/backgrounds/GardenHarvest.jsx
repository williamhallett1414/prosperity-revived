/**
 * GardenHarvest — Nighttime herb garden for Chef Daniel's chat screen
 * 
 * A warm, earthy garden at night with hanging herbs and a lantern.
 * Features:
 * - Hanging herb bundles (rosemary, thyme, basil) from a wooden beam
 * - Warm lantern glow casting golden-green light
 * - Fireflies in warm green/gold tones
 * - Gently falling herb leaves/sprigs
 * - Trailing vine tendrils on the edges
 * - Herbs sway and fireflies brighten when Daniel speaks
 */
import { memo } from 'react';

const GardenHarvest = memo(function GardenHarvest({ speaking = false }) {
  const glow = speaking ? 1.0 : 0.65;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <style>{`
        @keyframes herbSway1 {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        @keyframes herbSway2 {
          0%, 100% { transform: rotate(0.8deg); }
          50% { transform: rotate(-0.8deg); }
        }
        @keyframes fireflyFloat1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          25% { transform: translateY(-15px) translateX(8px); opacity: 0.8; }
          50% { transform: translateY(-8px) translateX(-5px); opacity: 0.5; }
          75% { transform: translateY(-18px) translateX(6px); opacity: 0.7; }
        }
        @keyframes fireflyFloat2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.35; }
          30% { transform: translateY(-12px) translateX(-7px); opacity: 0.75; }
          60% { transform: translateY(-20px) translateX(4px); opacity: 0.45; }
          85% { transform: translateY(-6px) translateX(-3px); opacity: 0.65; }
        }
        @keyframes fireflyFloat3 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
          20% { transform: translateY(-10px) translateX(5px); opacity: 0.8; }
          45% { transform: translateY(-22px) translateX(-6px); opacity: 0.4; }
          70% { transform: translateY(-14px) translateX(8px); opacity: 0.7; }
        }
        @keyframes leafDrift1 {
          0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.45; }
          85% { opacity: 0.35; }
          100% { transform: translateY(920px) translateX(50px) rotate(300deg); opacity: 0; }
        }
        @keyframes leafDrift2 {
          0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.4; }
          85% { opacity: 0.3; }
          100% { transform: translateY(920px) translateX(-40px) rotate(-260deg); opacity: 0; }
        }
        @keyframes leafDrift3 {
          0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.35; }
          85% { opacity: 0.25; }
          100% { transform: translateY(920px) translateX(30px) rotate(200deg); opacity: 0; }
        }
        @keyframes lanternPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.85; }
        }
        @keyframes lanternFlicker {
          0%, 100% { transform: scaleY(1); opacity: 0.9; }
          25% { transform: scaleY(1.06); opacity: 1; }
          50% { transform: scaleY(0.94); opacity: 0.8; }
          75% { transform: scaleY(1.03); opacity: 0.95; }
        }
        @keyframes vineGrow {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.02); }
        }
      `}</style>

      <svg
        viewBox="0 -100 400 1000"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Lantern light gradient */}
          <radialGradient id="dLanternGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.22 * glow} />
            <stop offset="30%" stopColor="#D97706" stopOpacity={0.12 * glow} />
            <stop offset="70%" stopColor="#65A30D" stopOpacity={0.04 * glow} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Firefly glow */}
          <radialGradient id="dFireflyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BEF264" stopOpacity={0.9 * glow} />
            <stop offset="40%" stopColor="#84CC16" stopOpacity={0.5 * glow} />
            <stop offset="100%" stopColor="#365314" stopOpacity="0" />
          </radialGradient>

          {/* Warm firefly */}
          <radialGradient id="dWarmFirefly" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.85 * glow} />
            <stop offset="40%" stopColor="#FBBF24" stopOpacity={0.45 * glow} />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0" />
          </radialGradient>

          {/* Herb leaf gradient */}
          <linearGradient id="dHerbLeaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4D7C0F" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#365314" stopOpacity="0.3" />
          </linearGradient>

          {/* Soft blur */}
          <filter id="dSoftGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>

          <filter id="dLeafBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" />
          </filter>
        </defs>

        {/* ── Wooden beam across top ── */}
        <g>
          <rect x="-10" y="272" width="420" height="6" rx="3" fill="#5C3A1E" opacity="0.55" />
          <rect x="-10" y="273" width="420" height="2" rx="1" fill="#8B6C42" opacity="0.2" />
        </g>

        {/* ── Lantern (center) ── */}
        <g>
          {/* Chain */}
          <line x1="200" y1="278" x2="200" y2="300" stroke="#8B6C42" strokeWidth="1" opacity="0.5" />
          {/* Lantern frame */}
          <rect x="190" y="300" width="20" height="28" rx="3" fill="none" stroke="#92400E" strokeWidth="1.5" opacity="0.6" />
          <line x1="190" y1="300" x2="210" y2="300" stroke="#B45309" strokeWidth="2" opacity="0.5" />
          <line x1="190" y1="328" x2="210" y2="328" stroke="#B45309" strokeWidth="2" opacity="0.5" />
          {/* Lantern top cap */}
          <path d="M195 300 L200 294 L205 300" fill="none" stroke="#92400E" strokeWidth="1.2" opacity="0.5" />
          {/* Flame inside */}
          <g style={{ animation: 'lanternFlicker 2s ease-in-out infinite', transformOrigin: '200px 315px' }}>
            <ellipse cx="200" cy="315" rx="4" ry="7" fill="#FBBF24" opacity="0.8" />
            <ellipse cx="200" cy="313" rx="2.5" ry="4.5" fill="#FEF3C7" opacity="0.9" />
            <ellipse cx="200" cy="311" rx="1" ry="2.5" fill="white" opacity="0.6" />
          </g>
          {/* Lantern glow pool */}
          <ellipse cx="200" cy="410" rx="120" ry="160" fill="url(#dLanternGlow)"
            style={{ animation: 'lanternPulse 4s ease-in-out infinite' }} />
        </g>

        {/* ── Hanging herb bundle — LEFT (rosemary) ── */}
        <g style={{ animation: 'herbSway1 7s ease-in-out infinite', transformOrigin: '80px 278px' }}>
          {/* Twine binding */}
          <line x1="80" y1="278" x2="80" y2="288" stroke="#8B6C42" strokeWidth="1.2" opacity="0.5" />
          <ellipse cx="80" cy="290" rx="6" ry="3" fill="#8B6C42" opacity="0.3" />
          {/* Rosemary sprigs */}
          {[-1, 0, 1].map(i => (
            <g key={`rm${i}`}>
              <line x1={80 + i * 4} y1="290" x2={80 + i * 6} y2="340" stroke="#4D7C0F" strokeWidth="1" opacity="0.5" />
              {[0, 1, 2, 3, 4, 5, 6].map(j => (
                <g key={j}>
                  <ellipse cx={80 + i * 5 - 2.5} cy={295 + j * 7} rx="1.2" ry="3" fill="#4D7C0F" opacity={0.45 - j * 0.03} transform={`rotate(-25, ${80 + i * 5 - 2.5}, ${65 + j * 7})`} />
                  <ellipse cx={80 + i * 5 + 2.5} cy={295 + j * 7} rx="1.2" ry="3" fill="#4D7C0F" opacity={0.45 - j * 0.03} transform={`rotate(25, ${80 + i * 5 + 2.5}, ${65 + j * 7})`} />
                </g>
              ))}
            </g>
          ))}
        </g>

        {/* ── Hanging herb bundle — RIGHT (basil) ── */}
        <g style={{ animation: 'herbSway2 8s ease-in-out infinite 1s', transformOrigin: '320px 278px' }}>
          <line x1="320" y1="278" x2="320" y2="288" stroke="#8B6C42" strokeWidth="1.2" opacity="0.5" />
          <ellipse cx="320" cy="290" rx="6" ry="3" fill="#8B6C42" opacity="0.3" />
          {/* Basil leaves — larger, rounder */}
          {[-1, 0, 1].map(i => (
            <g key={`bs${i}`}>
              <line x1={320 + i * 5} y1="290" x2={320 + i * 4} y2="335" stroke="#166534" strokeWidth="0.8" opacity="0.4" />
              {[0, 1, 2, 3, 4].map(j => (
                <g key={j}>
                  <ellipse cx={320 + i * 4 - 4} cy={298 + j * 9} rx="4" ry="3" fill="#15803D" opacity={0.4 - j * 0.05} transform={`rotate(-15, ${320 + i * 4 - 4}, ${68 + j * 9})`} />
                  <ellipse cx={320 + i * 4 + 4} cy={298 + j * 9} rx="4" ry="3" fill="#15803D" opacity={0.4 - j * 0.05} transform={`rotate(15, ${320 + i * 4 + 4}, ${68 + j * 9})`} />
                </g>
              ))}
            </g>
          ))}
        </g>

        {/* ── Hanging herb — CENTER-LEFT (thyme) ── */}
        <g style={{ animation: 'herbSway1 9s ease-in-out infinite 2s', transformOrigin: '140px 278px' }}>
          <line x1="140" y1="278" x2="140" y2="56" stroke="#8B6C42" strokeWidth="1" opacity="0.4" />
          <ellipse cx="140" cy="287" rx="4" ry="2.5" fill="#8B6C42" opacity="0.25" />
          {[0, 1].map(i => (
            <g key={`th${i}`}>
              <line x1={140 + i * 3 - 1.5} y1="57" x2={140 + i * 2 - 1} y2="325" stroke="#4D7C0F" strokeWidth="0.7" opacity="0.4" />
              {[0, 1, 2, 3, 4, 5, 6, 7].map(j => (
                <g key={j}>
                  <circle cx={140 + i * 2 - 3} cy={290 + j * 5} r="1" fill="#65A30D" opacity={0.4 - j * 0.03} />
                  <circle cx={140 + i * 2 + 1} cy={290 + j * 5} r="1" fill="#65A30D" opacity={0.4 - j * 0.03} />
                </g>
              ))}
            </g>
          ))}
        </g>

        {/* ── Trailing vines on edges ── */}
        <g style={{ animation: 'vineGrow 12s ease-in-out infinite' }}>
          {/* Left vine */}
          <path d="M0 270 Q8 310 4 360 Q0 410 6 460 Q10 500 3 550"
            fill="none" stroke="#365314" strokeWidth="1.5" opacity="0.25" />
          {[140, 180, 230, 280, 330, 380].map((y, i) => (
            <ellipse key={`lv${i}`} cx={4 + (i % 2) * 3} cy={y} rx="3.5" ry="2.5"
              fill="#4D7C0F" opacity={0.2 - i * 0.02}
              transform={`rotate(${-20 + i * 8}, ${4 + (i % 2) * 3}, ${y})`} />
          ))}

          {/* Right vine */}
          <path d="M400 250 Q392 295 396 350 Q400 400 394 450 Q390 490 397 540"
            fill="none" stroke="#365314" strokeWidth="1.5" opacity="0.25" />
          {[130, 175, 220, 270, 320, 370].map((y, i) => (
            <ellipse key={`rv${i}`} cx={396 - (i % 2) * 3} cy={y} rx="3.5" ry="2.5"
              fill="#4D7C0F" opacity={0.2 - i * 0.02}
              transform={`rotate(${20 - i * 8}, ${396 - (i % 2) * 3}, ${y})`} />
          ))}
        </g>

        {/* ── Fireflies ── */}
        <g filter="url(#dSoftGlow)">
          {[
            { cx: 60, cy: 350, r: 5, fill: 'url(#dFireflyGlow)', anim: 'fireflyFloat1', dur: '6s', delay: '0s' },
            { cx: 340, cy: 400, r: 4.5, fill: 'url(#dWarmFirefly)', anim: 'fireflyFloat2', dur: '7s', delay: '1s' },
            { cx: 160, cy: 330, r: 5.5, fill: 'url(#dFireflyGlow)', anim: 'fireflyFloat3', dur: '8s', delay: '2s' },
            { cx: 280, cy: 450, r: 4, fill: 'url(#dWarmFirefly)', anim: 'fireflyFloat1', dur: '7.5s', delay: '3s' },
            { cx: 40, cy: 500, r: 5, fill: 'url(#dFireflyGlow)', anim: 'fireflyFloat2', dur: '6.5s', delay: '0.5s' },
            { cx: 370, cy: 530, r: 4.5, fill: 'url(#dWarmFirefly)', anim: 'fireflyFloat3', dur: '9s', delay: '1.5s' },
            { cx: 120, cy: 470, r: 3.5, fill: 'url(#dFireflyGlow)', anim: 'fireflyFloat1', dur: '8s', delay: '4s' },
            { cx: 240, cy: 310, r: 4, fill: 'url(#dWarmFirefly)', anim: 'fireflyFloat2', dur: '7s', delay: '2.5s' },
            { cx: 90, cy: 570, r: 5, fill: 'url(#dFireflyGlow)', anim: 'fireflyFloat3', dur: '6s', delay: '3.5s' },
          ].map((f, i) => (
            <circle key={i} cx={f.cx} cy={f.cy} r={f.r} fill={f.fill}
              style={{ animation: `${f.anim} ${f.dur} ease-in-out infinite ${f.delay}` }} />
          ))}
        </g>

        {/* ── Falling herb leaves ── */}
        {[
          { x: 70, w: 3, h: 5, anim: 'leafDrift1', dur: '16s', delay: '0s', color: '#4D7C0F' },
          { x: 180, w: 2.5, h: 4, anim: 'leafDrift2', dur: '18s', delay: '3s', color: '#65A30D' },
          { x: 300, w: 3, h: 4.5, anim: 'leafDrift3', dur: '15s', delay: '6s', color: '#15803D' },
          { x: 130, w: 2, h: 3.5, anim: 'leafDrift1', dur: '20s', delay: '9s', color: '#4D7C0F' },
          { x: 350, w: 2.5, h: 4, anim: 'leafDrift2', dur: '17s', delay: '2s', color: '#166534' },
          { x: 50, w: 3, h: 5, anim: 'leafDrift3', dur: '19s', delay: '5s', color: '#65A30D' },
          { x: 250, w: 2, h: 3, anim: 'leafDrift1', dur: '22s', delay: '8s', color: '#15803D' },
          { x: 380, w: 2.5, h: 4, anim: 'leafDrift2', dur: '16s', delay: '11s', color: '#4D7C0F' },
          { x: 100, w: 3, h: 4.5, anim: 'leafDrift3', dur: '18s', delay: '4s', color: '#65A30D' },
          { x: 220, w: 2, h: 3.5, anim: 'leafDrift1', dur: '21s', delay: '7s', color: '#166534' },
        ].map((leaf, i) => (
          <ellipse key={i} cx={leaf.x} cy={-10} rx={leaf.w} ry={leaf.h}
            fill={leaf.color} opacity="0.4"
            filter="url(#dLeafBlur)"
            style={{ animation: `${leaf.anim} ${leaf.dur} linear infinite ${leaf.delay}` }}
          />
        ))}

        {/* ── Ambient ground glow ── */}
        <ellipse cx="200" cy="900" rx="200" ry="80" fill="#365314" opacity={0.05 * glow} />
      </svg>
    </div>
  );
});

export default GardenHarvest;
