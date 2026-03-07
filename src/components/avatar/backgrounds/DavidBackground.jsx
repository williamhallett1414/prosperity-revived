// DavidBackground — 2D Cartoon Gym Interior
// Cool 6500K industrial pendants, dumbbell rack, rubber floor grid
// Three zones: ceiling/lights/mirror (top) → clear avatar zone (mid) → rack + floor (bottom)

import { useEffect, useRef } from 'react';

export default function DavidBackground({ speaking = false }) {
  const lightsRef = useRef(null);

  useEffect(() => {
    if (!lightsRef.current) return;
    lightsRef.current.style.transition = 'opacity 400ms ease';
    lightsRef.current.style.opacity = speaking ? '0.45' : '0.28';
  }, [speaking]);

  return (
    <svg
      viewBox="0 0 390 844"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="dv-l1" cx="20%" cy="0%" r="50%">
          <stop offset="0%"   stopColor="#E8F4FD" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#0a1628" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dv-l2" cx="50%" cy="0%" r="50%">
          <stop offset="0%"   stopColor="#E8F4FD" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#0a1628" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dv-l3" cx="80%" cy="0%" r="50%">
          <stop offset="0%"   stopColor="#E8F4FD" stopOpacity="0.36" />
          <stop offset="100%" stopColor="#0a1628" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dv-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="55%"  stopColor="transparent" />
          <stop offset="100%" stopColor="#0e1e38" stopOpacity="0.72" />
        </radialGradient>
      </defs>

      {/* ── Base ── */}
      <rect width="390" height="844" fill="#0e1e38" />

      {/* ── Ceiling ── */}
      <rect width="390" height="62" fill="#122438" />

      {/* ── Back wall ── */}
      <rect x="0" y="62" width="390" height="440" fill="#1a2840" />

      {/* ── Mirror panel ── */}
      <rect x="28" y="68" width="334" height="185" rx="4" fill="#1e3050" opacity="0.85" />
      <rect x="28" y="68" width="334" height="185" rx="4" fill="#38BDF8" fillOpacity="0.025"
            stroke="#38BDF825" strokeWidth="1" />

      {/* ── Dumbbell rack ── */}
      <rect x="32" y="278" width="326" height="125" rx="4" fill="#122438" stroke="#1e2d48" strokeWidth="2" />
      {/* Rack shelves */}
      <rect x="38" y="293" width="314" height="6"  rx="2" fill="#1e2d48" />
      <rect x="38" y="338" width="314" height="6"  rx="2" fill="#1e2d48" />
      <rect x="38" y="383" width="314" height="6"  rx="2" fill="#1e2d48" />

      {/* Row 1 dumbbells: light → heavy */}
      <g fill="#2A3A52">
        <ellipse cx="60"  cy="296" rx="11" ry="7" /><rect x="68"  y="291" width="8"  height="10" rx="1" /><ellipse cx="80"  cy="296" rx="11" ry="7" />
      </g>
      <g fill="#344866">
        <ellipse cx="112" cy="295" rx="13" ry="8" /><rect x="121" y="289" width="9"  height="12" rx="1" /><ellipse cx="134" cy="295" rx="13" ry="8" />
      </g>
      <g fill="#38BDF8" opacity="0.65">
        <ellipse cx="172" cy="294" rx="15" ry="9" /><rect x="183" y="287" width="12" height="14" rx="1" /><ellipse cx="199" cy="294" rx="15" ry="9" />
      </g>
      <g fill="#1e3a6e">
        <ellipse cx="245" cy="293" rx="16" ry="10" /><rect x="257" y="285" width="14" height="16" rx="1" /><ellipse cx="275" cy="293" rx="16" ry="10" />
      </g>
      <g fill="#2a4880">
        <ellipse cx="322" cy="292" rx="18" ry="11" /><rect x="336" y="283" width="16" height="18" rx="1" /><ellipse cx="356" cy="292" rx="18" ry="11" />
      </g>

      {/* Row 2 dumbbells: heavier */}
      <g fill="#1A2840" opacity="0.75">
        <ellipse cx="70"  cy="341" rx="16" ry="10" /><rect x="82"  y="333" width="16" height="16" rx="1" /><ellipse cx="102" cy="341" rx="16" ry="10" />
        <ellipse cx="148" cy="340" rx="18" ry="11" /><rect x="162" y="331" width="18" height="18" rx="1" /><ellipse cx="184" cy="340" rx="18" ry="11" />
        <ellipse cx="228" cy="339" rx="20" ry="12" /><rect x="244" y="329" width="20" height="20" rx="1" /><ellipse cx="268" cy="339" rx="20" ry="12" />
        <ellipse cx="318" cy="338" rx="22" ry="13" /><rect x="336" y="327" width="22" height="22" rx="1" /><ellipse cx="362" cy="338" rx="22" ry="13" />
      </g>

      {/* ── Cable machine silhouette (far right) ── */}
      <rect x="342" y="178" width="48" height="325" rx="6" fill="#0f1c2e" opacity="0.92" />
      <rect x="350" y="183" width="32" height="12" rx="3" fill="#1a2840" />
      <line x1="366" y1="195" x2="366" y2="425" stroke="#2a3a52" strokeWidth="3" opacity="0.58" />
      <rect x="354" y="425" width="24" height="20" rx="3" fill="#2A3A52" />

      {/* ── Industrial pendant lights ── */}
      <g>
        {/* Left pendant */}
        <line x1="78"  y1="0" x2="78"  y2="38" stroke="#2a3a52" strokeWidth="2" />
        <path d="M 52 38 Q 52 28 78 28 Q 104 28 104 38 L 96 58 L 60 58 Z" fill="#1e2d48" />
        <ellipse cx="78"  cy="38" rx="20" ry="10" fill="#38BDF8" opacity="0.60" />
        {/* Centre pendant */}
        <line x1="195" y1="0" x2="195" y2="38" stroke="#2a3a52" strokeWidth="2" />
        <path d="M 167 38 Q 167 26 195 26 Q 223 26 223 38 L 213 60 L 177 60 Z" fill="#1e2d48" />
        <ellipse cx="195" cy="38" rx="22" ry="11" fill="#E8F4FD" opacity="0.75" />
        {/* Right pendant */}
        <line x1="312" y1="0" x2="312" y2="38" stroke="#2a3a52" strokeWidth="2" />
        <path d="M 286 38 Q 286 28 312 28 Q 338 28 338 38 L 330 58 L 294 58 Z" fill="#1e2d48" />
        <ellipse cx="312" cy="38" rx="20" ry="10" fill="#38BDF8" opacity="0.55" />
      </g>

      {/* Light cones (speaking-reactive) */}
      <g ref={lightsRef} opacity="0.40">
        <rect width="390" height="844" fill="url(#dv-l1)" />
        <rect width="390" height="844" fill="url(#dv-l2)" />
        <rect width="390" height="844" fill="url(#dv-l3)" />
      </g>

      {/* ── Rubber floor ── */}
      <rect x="0" y="502" width="390" height="342" fill="#182438" />
      {/* Blue accent stripe */}
      <rect x="0" y="500" width="390" height="4" fill="#38BDF8" opacity="0.85" />
      {/* Floor grid */}
      <g stroke="#1a2440" strokeWidth="1.5" opacity="0.65">
        <line x1="0" y1="542" x2="390" y2="542" />
        <line x1="0" y1="582" x2="390" y2="582" />
        <line x1="0" y1="622" x2="390" y2="622" />
        <line x1="0" y1="662" x2="390" y2="662" />
        <line x1="0" y1="702" x2="390" y2="702" />
        <line x1="0" y1="742" x2="390" y2="742" />
        <line x1="78"  y1="502" x2="78"  y2="844" />
        <line x1="156" y1="502" x2="156" y2="844" />
        <line x1="234" y1="502" x2="234" y2="844" />
        <line x1="312" y1="502" x2="312" y2="844" />
      </g>

      {/* ── Small foreground equipment (left) ── */}
      <rect x="4"  y="472" width="36" height="22" rx="6" fill="#1e2d48" opacity="0.82" />
      <rect x="10" y="464" width="22" height="10" rx="3" fill="#2a3a52" opacity="0.72" />

      {/* ── Vignette ── */}
      <rect width="390" height="844" fill="url(#dv-vignette)" />
    </svg>
  );
}
