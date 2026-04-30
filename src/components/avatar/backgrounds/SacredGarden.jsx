/**
 * SacredGarden — Tranquil nighttime garden for Hannah's chat screen
 * 
 * A peaceful sanctuary evoking calm, safety, and healing.
 * Features:
 * - Hanging wisteria/blossom branches from the top
 * - Soft lavender/blue floating orbs (firefly-like)
 * - Gentle falling petals drifting downward
 * - Crescent moon casting silvery light
 * - Still water ripples at the bottom
 * - Orbs intensify when Hannah speaks
 */
import { memo } from 'react';

const SacredGarden = memo(function SacredGarden({ speaking = false }) {
  const glow = speaking ? 1.0 : 0.6;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
          25% { transform: translateY(-12px) translateX(5px); opacity: 0.8; }
          50% { transform: translateY(-6px) translateX(-3px); opacity: 0.6; }
          75% { transform: translateY(-15px) translateX(4px); opacity: 0.75; }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          30% { transform: translateY(-10px) translateX(-6px); opacity: 0.7; }
          60% { transform: translateY(-18px) translateX(3px); opacity: 0.55; }
          80% { transform: translateY(-8px) translateX(-2px); opacity: 0.65; }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.45; }
          20% { transform: translateY(-14px) translateX(4px); opacity: 0.7; }
          50% { transform: translateY(-20px) translateX(-5px); opacity: 0.5; }
          70% { transform: translateY(-8px) translateX(6px); opacity: 0.8; }
        }
        @keyframes petalFall1 {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.4; }
          100% { transform: translateY(920px) translateX(60px) rotate(360deg); opacity: 0; }
        }
        @keyframes petalFall2 {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.45; }
          90% { opacity: 0.35; }
          100% { transform: translateY(920px) translateX(-45px) rotate(-300deg); opacity: 0; }
        }
        @keyframes petalFall3 {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.3; }
          100% { transform: translateY(920px) translateX(35px) rotate(270deg); opacity: 0; }
        }
        @keyframes moonGlow {
          0%, 100% { opacity: 0.15; filter: blur(20px); }
          50% { opacity: 0.22; filter: blur(24px); }
        }
        @keyframes ripple {
          0% { transform: scaleX(1); opacity: 0.12; }
          50% { transform: scaleX(1.05); opacity: 0.06; }
          100% { transform: scaleX(1); opacity: 0.12; }
        }
        @keyframes branchSway {
          0%, 100% { transform: rotate(-0.5deg); }
          50% { transform: rotate(0.5deg); }
        }
      `}</style>

      <svg
        viewBox="0 -100 400 1000"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Orb glow gradient */}
          <radialGradient id="hOrbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity={0.9 * glow} />
            <stop offset="40%" stopColor="#A78BFA" stopOpacity={0.5 * glow} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>

          {/* Moon glow gradient */}
          <radialGradient id="hMoonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#A5B4FC" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Petal gradient */}
          <radialGradient id="hPetal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.3" />
          </radialGradient>

          {/* Water reflection gradient */}
          <linearGradient id="hWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
          </linearGradient>

          {/* Soft blur for orbs */}
          <filter id="hSoftGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>

          <filter id="hPetalBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          </filter>
        </defs>

        {/* ── Crescent Moon ── */}
        <g>
          {/* Moon glow halo */}
          <circle cx="340" cy="260" r="60" fill="url(#hMoonGlow)"
            style={{ animation: 'moonGlow 6s ease-in-out infinite' }} />
          {/* Moon body */}
          <circle cx="340" cy="260" r="16" fill="#E0E7FF" opacity="0.12" />
          {/* Moon crescent cutout */}
          <circle cx="347" cy="255" r="13" fill="#000000" opacity="1" />
          {/* Moon highlights */}
          <circle cx="335" cy="255" r="2" fill="#E0E7FF" opacity="0.08" />
          <circle cx="338" cy="265" r="1" fill="#E0E7FF" opacity="0.06" />
        </g>

        {/* ── Wisteria branches — left cluster ── */}
        <g style={{ animation: 'branchSway 10s ease-in-out infinite', transformOrigin: '0px 240px' }}>
          {/* Main branch */}
          <path d="M-10 240 Q30 255 60 245 Q90 235 110 250" fill="none" stroke="#4A3728" strokeWidth="2.5" opacity="0.5" />
          {/* Sub branch */}
          <path d="M40 250 Q45 275 42 300" fill="none" stroke="#4A3728" strokeWidth="1.5" opacity="0.4" />
          <path d="M75 242 Q78 270 74 295" fill="none" stroke="#4A3728" strokeWidth="1.5" opacity="0.4" />
          
          {/* Blossom clusters hanging down */}
          {[
            { x: 42, y: 270, count: 5 },
            { x: 42, y: 285, count: 4 },
            { x: 42, y: 298, count: 3 },
            { x: 75, y: 265, count: 5 },
            { x: 75, y: 280, count: 4 },
            { x: 75, y: 293, count: 3 },
          ].map((cluster, ci) => (
            <g key={`lc${ci}`}>
              {Array.from({ length: cluster.count }).map((_, i) => (
                <circle key={i}
                  cx={cluster.x + (i - cluster.count / 2) * 3.5}
                  cy={cluster.y + Math.sin(i * 1.2) * 2}
                  r={2.2 - i * 0.15}
                  fill="#C4B5FD"
                  opacity={0.35 - ci * 0.04}
                />
              ))}
            </g>
          ))}
        </g>

        {/* ── Wisteria branches — right cluster ── */}
        <g style={{ animation: 'branchSway 12s ease-in-out infinite 2s', transformOrigin: '400px 235px' }}>
          <path d="M410 235 Q370 250 340 242 Q310 234 290 248" fill="none" stroke="#4A3728" strokeWidth="2.5" opacity="0.5" />
          <path d="M355 246 Q358 275 354 302" fill="none" stroke="#4A3728" strokeWidth="1.5" opacity="0.4" />
          <path d="M320 240 Q323 268 318 292" fill="none" stroke="#4A3728" strokeWidth="1.5" opacity="0.4" />
          
          {[
            { x: 355, y: 268, count: 5 },
            { x: 355, y: 283, count: 4 },
            { x: 355, y: 296, count: 3 },
            { x: 320, y: 262, count: 5 },
            { x: 320, y: 277, count: 4 },
            { x: 320, y: 290, count: 3 },
          ].map((cluster, ci) => (
            <g key={`rc${ci}`}>
              {Array.from({ length: cluster.count }).map((_, i) => (
                <circle key={i}
                  cx={cluster.x + (i - cluster.count / 2) * 3.5}
                  cy={cluster.y + Math.sin(i * 1.2) * 2}
                  r={2.2 - i * 0.15}
                  fill="#DDD6FE"
                  opacity={0.3 - ci * 0.04}
                />
              ))}
            </g>
          ))}
        </g>

        {/* ── Floating orbs (fireflies) ── */}
        <g filter="url(#hSoftGlow)">
          {[
            { cx: 70, cy: 350, r: 6, anim: 'floatOrb1', dur: '7s', delay: '0s' },
            { cx: 320, cy: 400, r: 5, anim: 'floatOrb2', dur: '8s', delay: '1s' },
            { cx: 180, cy: 320, r: 7, anim: 'floatOrb3', dur: '6s', delay: '2s' },
            { cx: 50, cy: 500, r: 4, anim: 'floatOrb1', dur: '9s', delay: '3s' },
            { cx: 350, cy: 530, r: 5, anim: 'floatOrb2', dur: '7.5s', delay: '1.5s' },
            { cx: 130, cy: 450, r: 4.5, anim: 'floatOrb3', dur: '8.5s', delay: '0.5s' },
            { cx: 250, cy: 300, r: 3.5, anim: 'floatOrb1', dur: '6.5s', delay: '4s' },
            { cx: 90, cy: 570, r: 5.5, anim: 'floatOrb2', dur: '7s', delay: '2.5s' },
            { cx: 290, cy: 470, r: 4, anim: 'floatOrb3', dur: '9s', delay: '3.5s' },
            { cx: 200, cy: 550, r: 6, anim: 'floatOrb1', dur: '8s', delay: '1s' },
          ].map((orb, i) => (
            <circle key={i} cx={orb.cx} cy={orb.cy} r={orb.r}
              fill="url(#hOrbGlow)"
              style={{ animation: `${orb.anim} ${orb.dur} ease-in-out infinite ${orb.delay}` }}
            />
          ))}
        </g>

        {/* ── Falling petals ── */}
        {[
          { x: 55, size: 4, anim: 'petalFall1', dur: '14s', delay: '0s' },
          { x: 140, size: 3.5, anim: 'petalFall2', dur: '16s', delay: '2s' },
          { x: 250, size: 3, anim: 'petalFall3', dur: '18s', delay: '4s' },
          { x: 330, size: 4, anim: 'petalFall1', dur: '15s', delay: '6s' },
          { x: 90, size: 3, anim: 'petalFall2', dur: '17s', delay: '8s' },
          { x: 200, size: 3.5, anim: 'petalFall3', dur: '14s', delay: '3s' },
          { x: 370, size: 2.5, anim: 'petalFall1', dur: '19s', delay: '5s' },
          { x: 30, size: 3, anim: 'petalFall2', dur: '16s', delay: '7s' },
          { x: 300, size: 4, anim: 'petalFall3', dur: '13s', delay: '1s' },
          { x: 170, size: 2.5, anim: 'petalFall1', dur: '20s', delay: '9s' },
          { x: 110, size: 3, anim: 'petalFall2', dur: '15s', delay: '11s' },
          { x: 350, size: 3.5, anim: 'petalFall3', dur: '17s', delay: '10s' },
        ].map((petal, i) => (
          <ellipse key={i}
            cx={petal.x} cy={-10}
            rx={petal.size} ry={petal.size * 0.6}
            fill="url(#hPetal)"
            filter="url(#hPetalBlur)"
            style={{ animation: `${petal.anim} ${petal.dur} linear infinite ${petal.delay}` }}
          />
        ))}

        {/* ── Still water / reflection at bottom ── */}
        <rect x="0" y="750" width="400" height="150" fill="url(#hWater)"
          style={{ animation: 'ripple 8s ease-in-out infinite' }} />
        
        {/* Water surface line */}
        <line x1="0" y1="800" x2="400" y2="800" stroke="#818CF8" strokeWidth="0.5" opacity="0.08" />
        
        {/* Subtle reflection ripples */}
        {[760, 780, 820, 850].map((y, i) => (
          <ellipse key={i}
            cx={200} cy={y}
            rx={120 + i * 20} ry={1}
            fill="none"
            stroke="#A5B4FC"
            strokeWidth="0.4"
            opacity={0.06 - i * 0.01}
            style={{ animation: `ripple ${6 + i}s ease-in-out infinite ${i * 0.5}s` }}
          />
        ))}

        {/* ── Ambient glow from top branches ── */}
        <ellipse cx="60" cy="260" rx="80" ry="60" fill="#C4B5FD" opacity={0.04 * glow} />
        <ellipse cx="340" cy="255" rx="80" ry="60" fill="#DDD6FE" opacity={0.03 * glow} />
      </svg>
    </div>
  );
});

export default SacredGarden;
