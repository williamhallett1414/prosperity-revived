// DanielBackground — 2D Cartoon Kitchen Interior
// Warm domestic kitchen: copper pot rack, pendant lamp, afternoon window light
// Three zones: ceiling/rack/shelves (top) → clear avatar zone (mid) → counter + floor (bottom)

import { useEffect, useRef } from 'react';

export default function DanielBackground({ speaking = false }) {
  const pendantRef = useRef(null);

  useEffect(() => {
    if (!pendantRef.current) return;
    pendantRef.current.style.transition = 'opacity 400ms ease';
    pendantRef.current.style.opacity = speaking ? '0.55' : '0.38';
  }, [speaking]);

  return (
    <svg
      viewBox="0 0 390 844"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="dn-window" cx="18%" cy="28%" r="52%">
          <stop offset="0%"   stopColor="#F5C842" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#051a0d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dn-pendant" cx="50%" cy="28%" r="38%">
          <stop offset="0%"   stopColor="#F5C842" stopOpacity="0.60" />
          <stop offset="100%" stopColor="#051a0d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dn-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="55%"  stopColor="transparent" />
          <stop offset="100%" stopColor="#082814" stopOpacity="0.72" />
        </radialGradient>
        <pattern id="dn-tiles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#e8d0b0" />
          <rect x="1.5" y="1.5" width="37" height="37" fill="#f5edd8" />
          <line x1="0" y1="0" x2="40" y2="0" stroke="#C45C2A" strokeWidth="1.2" opacity="0.45" />
          <line x1="0" y1="0" x2="0"  y2="40" stroke="#C45C2A" strokeWidth="1.2" opacity="0.45" />
        </pattern>
      </defs>

      {/* ── Base ── */}
      <rect width="390" height="844" fill="#082814" />

      {/* ── Ceiling ── */}
      <rect width="390" height="78" fill="#164030" />

      {/* ── Back wall ── */}
      <rect x="0" y="78" width="390" height="410" fill="#d4c8a8" opacity="0.42" />

      {/* ── Window (upper left) ── */}
      <rect x="18" y="88" width="132" height="182" rx="8" fill="#87CEEB" opacity="0.6" />
      {/* Sky outside */}
      <rect x="18" y="88" width="132" height="90"  rx="8" fill="#87CEEB" opacity="0.2" />
      <ellipse cx="62"  cy="130" rx="28" ry="32" fill="#1a5c28" opacity="0.45" />
      <ellipse cx="88"  cy="120" rx="20" ry="26" fill="#22703a" opacity="0.38" />
      {/* Window frame */}
      <rect x="18" y="88" width="132" height="182" rx="8" fill="none" stroke="#8B6914" strokeWidth="5" />
      <line x1="84"  y1="88"  x2="84"  y2="270" stroke="#8B6914" strokeWidth="3" />
      <line x1="18"  y1="180" x2="150" y2="180" stroke="#8B6914" strokeWidth="3" />
      {/* Window light spill */}
      <rect width="390" height="844" fill="url(#dn-window)" opacity="0.75" />

      {/* ── Tile backsplash ── */}
      <rect x="0" y="358" width="390" height="82" fill="url(#dn-tiles)" opacity="0.88" />
      <rect x="0" y="358" width="390" height="82" fill="#082814" opacity="0.32" />

      {/* ── Open shelves (right) ── */}
      {/* Shelf boards */}
      <rect x="252" y="98"  width="138" height="8" rx="3" fill="#5c3a18" />
      <rect x="252" y="196" width="138" height="8" rx="3" fill="#5c3a18" />
      <rect x="252" y="294" width="138" height="8" rx="3" fill="#5c3a18" />
      {/* Shelf 1 items */}
      <rect x="262" y="62"  width="14" height="38" rx="4" fill="#B8960C" opacity="0.9" />
      <rect x="264" y="54"  width="10" height="12" rx="3" fill="#8B6914" />
      <rect x="286" y="73"  width="22" height="26" rx="4" fill="#C45C2A" opacity="0.85" />
      <ellipse cx="297" cy="68"  rx="12" ry="14" fill="#16A34A" opacity="0.9" />
      <ellipse cx="291" cy="61"  rx="8"  ry="9"  fill="#22C55E" opacity="0.8" />
      <rect x="320" y="66"  width="12" height="32" rx="3" fill="#8B6040" opacity="0.82" />
      <rect x="335" y="69"  width="12" height="29" rx="3" fill="#6B4830" opacity="0.82" />
      <rect x="350" y="63"  width="14" height="35" rx="3" fill="#4A7C4A" opacity="0.82" />
      {/* Shelf 2 items */}
      <ellipse cx="288" cy="166" rx="24" ry="12" fill="#8B6914" opacity="0.7" />
      <ellipse cx="281" cy="160" rx="8"  ry="8"  fill="#F5C842" opacity="0.9" />
      <ellipse cx="293" cy="158" rx="9"  ry="9"  fill="#EAB830" opacity="0.9" />
      <ellipse cx="301" cy="161" rx="7"  ry="7"  fill="#F5C842" opacity="0.8" />
      <rect x="328" y="143" width="11" height="36" rx="3" fill="#1B4A2B" opacity="0.85" />
      <rect x="342" y="147" width="11" height="32" rx="3" fill="#2D6B3A" opacity="0.75" />
      <rect x="358" y="144" width="10" height="35" rx="3" fill="#A07828" opacity="0.75" />

      {/* ── Pot rack (upper centre) ── */}
      <rect x="98" y="82" width="194" height="6" rx="3" fill="#8B6914" />
      {/* Pan 1: copper */}
      <line x1="128" y1="88" x2="128" y2="108" stroke="#8B6914" strokeWidth="2" />
      <ellipse cx="128" cy="138" rx="22" ry="14" fill="#B87333" opacity="0.92" />
      <line x1="128" y1="124" x2="128" y2="110" stroke="#6B4220" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="128" cy="138" rx="14" ry="8"  fill="#C8874A" opacity="0.45" />
      {/* Pan 2: cast iron */}
      <line x1="176" y1="88" x2="176" y2="108" stroke="#8B6914" strokeWidth="2" />
      <ellipse cx="176" cy="140" rx="24" ry="15" fill="#2A2A2A" opacity="0.92" />
      <line x1="176" y1="125" x2="176" y2="110" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
      {/* Pan 3: small copper */}
      <line x1="224" y1="88" x2="224" y2="106" stroke="#8B6914" strokeWidth="2" />
      <ellipse cx="224" cy="130" rx="18" ry="11" fill="#B87333" opacity="0.88" />
      <line x1="224" y1="119" x2="224" y2="108" stroke="#6B4220" strokeWidth="3" strokeLinecap="round" />
      {/* Dried herbs */}
      <line x1="262" y1="88" x2="262" y2="112" stroke="#5c3a18" strokeWidth="1.5" />
      <ellipse cx="262" cy="120" rx="8" ry="10" fill="#16803D" opacity="0.82" />
      <ellipse cx="256" cy="115" rx="5" ry="6"  fill="#22C55E" opacity="0.72" />

      {/* ── Pendant lamp ── */}
      <line x1="195" y1="0" x2="195" y2="92" stroke="#3a2a10" strokeWidth="2" />
      <path d="M 164 92 Q 164 78 195 78 Q 226 78 226 92 L 216 112 L 174 112 Z" fill="#8B6914" />
      <ellipse cx="195" cy="92" rx="16" ry="8" fill="#F5C842" opacity="0.62" />
      {/* Light cone */}
      <path d="M 174 112 L 95 285 L 295 285 L 216 112 Z" fill="#F5C842" fillOpacity="0.055" />
      {/* Pendant glow overlay */}
      <g ref={pendantRef} opacity="0.50">
        <rect width="390" height="844" fill="url(#dn-pendant)" />
      </g>

      {/* ── Counter / island ── */}
      <path d="M 0 582 L 0 480 Q 0 468 12 468 L 378 468 Q 390 468 390 480 L 390 582 Z" fill="#5c3a18" />
      {/* Counter top */}
      <rect x="0" y="460" width="390" height="22" rx="6" fill="#7a5230" />
      <line x1="0" y1="466" x2="390" y2="466" stroke="#6a4220" strokeWidth="1"   opacity="0.6" />
      <line x1="0" y1="471" x2="390" y2="471" stroke="#6a4220" strokeWidth="1"   opacity="0.4" />
      <line x1="0" y1="478" x2="390" y2="478" stroke="#6a4220" strokeWidth="0.8" opacity="0.3" />
      {/* Cutting board */}
      <rect x="58"  y="440" width="122" height="24" rx="5" fill="#8B6914" opacity="0.92" />
      <rect x="63"  y="443" width="112" height="18" rx="4" fill="#A07828" />
      {/* Cartoon veg */}
      <ellipse cx="98"  cy="452" rx="10" ry="8"  fill="#22C55E" opacity="0.92" />
      <ellipse cx="124" cy="451" rx="8"  ry="9"  fill="#F5C842" opacity="0.9" />
      <rect x="144"   y="445" width="7"  height="13" rx="3" fill="#C45C2A" opacity="0.85" />
      {/* Herb pot on counter right */}
      <rect x="318"   y="444" width="20" height="18" rx="4" fill="#C45C2A" opacity="0.8" />
      <ellipse cx="328" cy="440" rx="11" ry="12" fill="#15803d" opacity="0.9" />
      <ellipse cx="322" cy="433" rx="7"  ry="8"  fill="#22C55E" opacity="0.8" />

      {/* ── Floor ── */}
      <rect x="0" y="582" width="390" height="262" fill="#0e2e18" />
      <line x1="0" y1="614" x2="390" y2="614" stroke="#0d2a14" strokeWidth="2" />
      <line x1="0" y1="654" x2="390" y2="654" stroke="#0d2a14" strokeWidth="2" />
      <line x1="0" y1="694" x2="390" y2="694" stroke="#0d2a14" strokeWidth="2" />
      <line x1="0" y1="734" x2="390" y2="734" stroke="#0d2a14" strokeWidth="2" />

      {/* ── Vignette ── */}
      <rect width="390" height="844" fill="url(#dn-vignette)" />
    </svg>
  );
}
