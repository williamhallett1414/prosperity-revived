// GideonBackground — 2D Cartoon Church Interior
// Warm stained-glass sanctuary, golden-hour intimacy
// Three zones: window arch (top) → clear avatar zone (mid) → pews + stone floor (bottom)

import { useEffect, useRef } from 'react';

export default function GideonBackground({ speaking = false, listening = false, thinking = false }) {
  const glowRef = useRef(null);

  // Speaking state: light pools pulse brighter
  useEffect(() => {
    if (!glowRef.current) return;
    glowRef.current.style.transition = 'opacity 400ms ease';
    glowRef.current.style.opacity = speaking ? '0.55' : '0.35';
  }, [speaking]);

  return (
    <svg
      viewBox="0 0 390 844"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="gb-ambient" cx="50%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#9A7010" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#120a00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gb-window" cx="50%" cy="0%" r="70%">
          <stop offset="0%"   stopColor="#F0D98A" stopOpacity="0.75" />
          <stop offset="50%"  stopColor="#C9A227" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#120a00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gb-gold-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#C9A227" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gb-ruby-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#8B1A1A" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#8B1A1A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gb-cobalt-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#1B3A6B" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#1B3A6B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gb-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%"  stopColor="transparent" />
          <stop offset="100%" stopColor="#1c1200" stopOpacity="0.68" />
        </radialGradient>
      </defs>

      {/* ── Base ── */}
      <rect width="390" height="844" fill="#1c1200" />
      <rect width="390" height="620" fill="#2e1e08" />
      <rect width="390" height="620" fill="url(#gb-ambient)" />

      {/* ── Architectural arch frame ── */}
      <path d="M 20 640 L 20 220 Q 20 18 195 18 Q 370 18 370 220 L 370 640 Z"
            fill="none" stroke="#7A5500" strokeWidth="6" />
      <path d="M 50 640 L 50 240 Q 50 48 195 48 Q 340 48 340 240 L 340 640 Z"
            fill="none" stroke="#5A3F00" strokeWidth="2.5" />

      {/* ── Side walls ── */}
      <rect x="0"   y="0" width="46"  height="700" fill="#1a1000" opacity="0.40" />
      <rect x="344" y="0" width="46"  height="700" fill="#1a1000" opacity="0.40" />

      {/* ── Stained-glass window frame ── */}
      <path d="M 98 385 L 98 148 Q 98 68 195 68 Q 292 68 292 148 L 292 385 Z"
            fill="#2a1500" stroke="#7A5500" strokeWidth="3" />

      {/* ── Stained-glass panes ── */}
      {/* Top arch: amber centre */}
      <path d="M 153 72 Q 195 64 237 72 L 232 126 Q 195 110 158 126 Z" fill="#C9A227" opacity="0.72" />
      {/* Top arch: ruby left */}
      <path d="M 102 168 L 102 148 Q 102 98 153 74 L 158 126 Q 122 142 118 176 Z" fill="#8B1A1A" opacity="0.62" />
      {/* Top arch: cobalt right */}
      <path d="M 288 168 L 288 148 Q 288 98 237 74 L 232 126 Q 268 142 272 176 Z" fill="#1B3A6B" opacity="0.62" />
      {/* Mid: gold centre */}
      <path d="M 158 126 Q 195 110 232 126 L 228 196 L 162 196 Z" fill="#E8B830" opacity="0.68" />
      {/* Mid: ruby left */}
      <path d="M 102 176 L 118 176 L 162 196 L 162 258 L 102 258 Z" fill="#7A2A1A" opacity="0.52" />
      {/* Mid: cobalt right */}
      <path d="M 288 176 L 272 176 L 228 196 L 228 258 L 288 258 Z" fill="#2A4A8B" opacity="0.52" />
      {/* Lower gold centre */}
      <path d="M 162 196 L 228 196 L 228 288 L 162 288 Z" fill="#C9A227" opacity="0.58" />
      {/* Lower panes */}
      <path d="M 102 258 L 162 258 L 162 338 L 102 338 Z" fill="#1B3A6B" opacity="0.42" />
      <path d="M 228 258 L 288 258 L 288 338 L 228 338 Z" fill="#8B1A1A" opacity="0.42" />
      <path d="M 162 288 L 228 288 L 228 385 L 162 385 Z" fill="#C9A227" opacity="0.46" />
      <path d="M 102 338 L 162 338 L 162 385 L 102 385 Z" fill="#C9A227" opacity="0.36" />
      <path d="M 228 338 L 288 338 L 288 385 L 228 385 Z" fill="#1B5A1A" opacity="0.36" />

      {/* Lead lines */}
      <line x1="195" y1="68"  x2="195" y2="385" stroke="#7A5500" strokeWidth="2"   opacity="0.7" />
      <line x1="102" y1="196" x2="288" y2="196" stroke="#7A5500" strokeWidth="1.8" opacity="0.6" />
      <line x1="102" y1="258" x2="288" y2="258" stroke="#7A5500" strokeWidth="1.8" opacity="0.6" />
      <line x1="102" y1="338" x2="288" y2="338" stroke="#7A5500" strokeWidth="1.5" opacity="0.5" />

      {/* ── Window glow spill ── */}
      <rect width="390" height="844" fill="url(#gb-window)" opacity="0.85" />

      {/* ── Coloured light pools on floor (speaking-reactive) ── */}
      <g ref={glowRef} opacity="0.35">
        <ellipse cx="148" cy="684" rx="84"  ry="48" fill="url(#gb-ruby-pool)" />
        <ellipse cx="242" cy="684" rx="84"  ry="48" fill="url(#gb-cobalt-pool)" />
        <ellipse cx="195" cy="718" rx="108" ry="62" fill="url(#gb-gold-pool)" />
      </g>

      {/* ── Stone floor ── */}
      <rect x="0" y="700" width="390" height="144" fill="#2a1a08" opacity="0.75" />
      <line x1="0" y1="732" x2="390" y2="732" stroke="#2a1800" strokeWidth="1.5" />
      <line x1="0" y1="762" x2="390" y2="762" stroke="#2a1800" strokeWidth="1.5" />
      <line x1="0" y1="792" x2="390" y2="792" stroke="#2a1800" strokeWidth="1.5" />
      <line x1="98"  y1="700" x2="98"  y2="844" stroke="#2a1800" strokeWidth="1.5" />
      <line x1="195" y1="700" x2="195" y2="844" stroke="#2a1800" strokeWidth="1.5" />
      <line x1="292" y1="700" x2="292" y2="844" stroke="#2a1800" strokeWidth="1.5" />

      {/* ── Left pew ── */}
      <path d="M 0 688 L 0 624 Q 0 612 12 612 L 152 612 Q 160 612 160 620 L 160 688 Z" fill="#2D1A00" />
      <rect x="0"  y="610" width="160" height="14" rx="4" fill="#3D2400" />
      <path d="M 10 610 L 10 558 Q 10 548 20 548 L 152 548 L 152 610 Z" fill="#251400" opacity="0.8" />

      {/* ── Right pew ── */}
      <path d="M 390 688 L 390 624 Q 390 612 378 612 L 238 612 Q 230 612 230 620 L 230 688 Z" fill="#2D1A00" />
      <rect x="230" y="610" width="160" height="14" rx="4" fill="#3D2400" />
      <path d="M 380 610 L 380 558 Q 380 548 370 548 L 238 548 L 238 610 Z" fill="#251400" opacity="0.8" />

      {/* ── Wall sconces ── */}
      <g opacity="0.9">
        <rect x="26" y="302" width="20" height="6" rx="2" fill="#C9A227" />
        <rect x="31" y="290" width="10" height="14" rx="3" fill="#E8B830" opacity="0.85" />
        <ellipse cx="36" cy="290" rx="14" ry="9" fill="#F0D98A" opacity="0.32" />

        <rect x="344" y="302" width="20" height="6" rx="2" fill="#C9A227" />
        <rect x="349" y="290" width="10" height="14" rx="3" fill="#E8B830" opacity="0.85" />
        <ellipse cx="354" cy="290" rx="14" ry="9" fill="#F0D98A" opacity="0.32" />
      </g>

      {/* ── Vignette ── */}
      <rect width="390" height="844" fill="url(#gb-vignette)" />

      {/* ── Dust motes (CSS animation via style tag trick — pure SVG) ── */}
      {[
        { x: 142, delay: '0s',   dur: '11s', size: 2.5 },
        { x: 212, delay: '3.2s', dur: '14s', size: 2   },
        { x: 172, delay: '6.8s', dur: '9s',  size: 1.5 },
        { x: 228, delay: '1.5s', dur: '12s', size: 2   },
        { x: 185, delay: '8s',   dur: '10s', size: 1.5 },
      ].map((m, i) => (
        <circle key={i} cx={m.x} cy="500" r={m.size} fill="#F0D98A" opacity="0.14">
          <animateTransform attributeName="transform" type="translate"
            values={`0,0; ${(i % 2 === 0 ? 6 : -6)},${-100}`}
            dur={m.dur} begin={m.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.14;0" dur={m.dur} begin={m.delay} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
