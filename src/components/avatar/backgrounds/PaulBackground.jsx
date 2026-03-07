// PaulBackground — 2D Cartoon Morning Outdoor Scene
// Pre-dawn sky: deep indigo → purple → gold horizon glow
// Avatar sits at the exact horizon — sky above, hills below, path converges toward it

import { useEffect, useRef } from 'react';

export default function PaulBackground({ speaking = false }) {
  const glowRef = useRef(null);

  useEffect(() => {
    if (!glowRef.current) return;
    glowRef.current.style.transition = 'opacity 400ms ease';
    glowRef.current.style.opacity = speaking ? '0.42' : '0.26';
  }, [speaking]);

  return (
    <svg
      viewBox="0 0 390 844"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0A0718" />
          <stop offset="16%"  stopColor="#1E1B4B" />
          <stop offset="42%"  stopColor="#4C1D95" />
          <stop offset="66%"  stopColor="#7C3AED" />
          <stop offset="80%"  stopColor="#A78BFA" />
          <stop offset="91%"  stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="pl-horizon" cx="50%" cy="100%" r="58%">
          <stop offset="0%"   stopColor="#FCD34D" stopOpacity="0.58" />
          <stop offset="45%"  stopColor="#F59E0B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0A0718" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pl-vignette" cx="50%" cy="50%" r="72%">
          <stop offset="55%"  stopColor="transparent" />
          <stop offset="100%" stopColor="#0A0718" stopOpacity="0.88" />
        </radialGradient>
      </defs>

      {/* ── Sky ── */}
      <rect width="390" height="844" fill="url(#pl-sky)" />

      {/* ── Clouds (very soft, upper zone only) ── */}
      <g opacity="0.21">
        <circle cx="78"  cy="98"  r="28" fill="#E0E7FF" />
        <circle cx="106" cy="90"  r="22" fill="#E0E7FF" />
        <circle cx="128" cy="96"  r="18" fill="#E0E7FF" />
        <circle cx="56"  cy="104" r="17" fill="#E0E7FF" />
      </g>
      <g opacity="0.15">
        <circle cx="292" cy="138" r="22" fill="#E0E7FF" />
        <circle cx="316" cy="130" r="17" fill="#E0E7FF" />
        <circle cx="334" cy="136" r="14" fill="#E0E7FF" />
        <circle cx="273" cy="144" r="14" fill="#E0E7FF" />
      </g>
      <g opacity="0.11">
        <circle cx="195" cy="76"  r="14" fill="#E0E7FF" />
        <circle cx="212" cy="70"  r="11" fill="#E0E7FF" />
        <circle cx="226" cy="74"  r="9"  fill="#E0E7FF" />
      </g>

      {/* ── Birds (upper right — never near avatar) ── */}
      <g fill="none" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" opacity="0.58">
        <path d="M 294 88 Q 298 84 302 88" />
        <path d="M 310 76 Q 315 71 320 76" />
        <path d="M 326 92 Q 331 87 336 92" />
        <path d="M 341 70 Q 347 64 353 70" />
        <path d="M 308 110 Q 313 104 318 110" />
      </g>

      {/* ── Hill layers (far → near) ── */}
      {/* Far hill */}
      <path d="M 0 562 Q 80 512 200 532 Q 312 550 390 512 L 390 844 L 0 844 Z"
            fill="#2D4A2D" opacity="0.44" />
      {/* Mid hill */}
      <path d="M 0 602 Q 72 560 182 572 Q 282 582 390 552 L 390 844 L 0 844 Z"
            fill="#3D6040" opacity="0.66" />
      {/* Near hill / field edge */}
      <path d="M 0 652 Q 102 620 222 632 Q 322 642 390 612 L 390 844 L 0 844 Z"
            fill="#4D7C4D" opacity="0.82" />

      {/* ── Horizon glow bar ── */}
      <rect x="0" y="558" width="390" height="12" fill="#FCD34D" fillOpacity="0.13" />
      <rect x="0" y="558" width="390" height="4"  fill="#FCD34D" fillOpacity="0.22" />

      {/* Horizon radial glow (speaking-reactive) */}
      <g ref={glowRef} opacity="0.26">
        <rect width="390" height="844" fill="url(#pl-horizon)" />
      </g>

      {/* ── Tree silhouette (right side) ── */}
      <rect x="316" y="418" width="18" height="202" rx="4"  fill="#0D0B18" />
      <circle cx="325" cy="398" r="54" fill="#0D0B18" />
      <circle cx="302" cy="418" r="38" fill="#0D0B18" />
      <circle cx="350" cy="414" r="36" fill="#0D0B18" />
      <circle cx="325" cy="376" r="30" fill="#0D0B18" />

      {/* ── Stone path (converges toward avatar at horizon) ── */}
      {/* Path edge lines */}
      <path d="M 153 844 Q 168 722 180 642 Q 186 602 193 572"
            fill="none" stroke="#1E1B4B" strokeWidth="1.5" opacity="0.32" />
      <path d="M 237 844 Q 222 722 210 642 Q 204 602 197 572"
            fill="none" stroke="#1E1B4B" strokeWidth="1.5" opacity="0.32" />
      {/* Path stone marks */}
      <g fill="#2a2040" opacity="0.52">
        <ellipse cx="195" cy="742" rx="42" ry="14" />
        <ellipse cx="188" cy="710" rx="34" ry="11" />
        <ellipse cx="193" cy="682" rx="26" ry="9"  />
        <ellipse cx="196" cy="658" rx="20" ry="7"  />
        <ellipse cx="195" cy="638" rx="16" ry="5"  />
        <ellipse cx="195" cy="622" rx="12" ry="4"  />
      </g>

      {/* ── Ground shadow ── */}
      <rect x="0" y="752" width="390" height="92" fill="#1a2a1a" opacity="0.38" />

      {/* ── Vignette ── */}
      <rect width="390" height="844" fill="url(#pl-vignette)" />

      {/* ── Horizon breathing animation (thinking state hint) ── */}
      <ellipse cx="195" cy="570" rx="180" ry="38" fill="#FCD34D" fillOpacity="0.04">
        <animate attributeName="fill-opacity" values="0.04;0.10;0.04" dur="4s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  );
}
