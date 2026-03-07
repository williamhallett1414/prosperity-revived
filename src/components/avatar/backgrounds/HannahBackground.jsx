// HannahBackground — 2D Cartoon Therapist's Office
// Warm amber table lamp, monstera plant, bookshelf — safe, soft, unhurried
// Three zones: artwork/monstera/shelf (top) → warm cream wall (mid) → sofa + lamp (bottom)

import { useEffect, useRef } from 'react';

export default function HannahBackground({ speaking = false, listening = false }) {
  const lampRef = useRef(null);

  useEffect(() => {
    if (!lampRef.current) return;
    lampRef.current.style.transition = 'opacity 400ms ease';
    // Listening: lamp leans warm
    lampRef.current.style.opacity = speaking ? '0.52' : listening ? '0.42' : '0.34';
  }, [speaking, listening]);

  return (
    <svg
      viewBox="0 0 390 844"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hn-lamp" cx="14%" cy="58%" r="46%">
          <stop offset="0%"   stopColor="#E8C4A0" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#1a2d3d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hn-window" cx="0%" cy="28%" r="48%">
          <stop offset="0%"   stopColor="#C8E4F6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#1a2d3d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hn-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="55%"  stopColor="transparent" />
          <stop offset="100%" stopColor="#1e3348" stopOpacity="0.72" />
        </radialGradient>
      </defs>

      {/* ── Base ── */}
      <rect width="390" height="844" fill="#1e3348" />

      {/* ── Warm cream wall ── */}
      <rect x="0" y="0" width="390" height="645" fill="#d4c4ac" opacity="0.40" />

      {/* ── Sheer curtain (far left) ── */}
      <rect x="0" y="0" width="88" height="555" fill="#C8E4F6" opacity="0.12" />
      <rect x="0" y="0" width="88" height="555" fill="url(#hn-window)" />
      <path d="M 14 0 Q 19 100 11 200 Q 7 300 17 400 Q 21 500 13 555"  fill="none" stroke="#C8E4F6" strokeWidth="1" opacity="0.12" />
      <path d="M 44 0 Q 51 100 43 200 Q 39 300 47 400 Q 51 500 43 555"  fill="none" stroke="#C8E4F6" strokeWidth="1" opacity="0.10" />
      <path d="M 74 0 Q 81 100 73 200 Q 69 300 77 400 Q 81 500 73 555"  fill="none" stroke="#C8E4F6" strokeWidth="1" opacity="0.08" />

      {/* ── Framed artwork (back wall centre-ish) ── */}
      <rect x="148" y="96"  width="122" height="84" rx="5" fill="#263848" stroke="#8B9E8B" strokeWidth="2" opacity="0.92" />
      <rect x="154" y="102" width="110" height="72" rx="3" fill="#243444" />
      <ellipse cx="196" cy="142" rx="32" ry="24" fill="#7AB3D4" opacity="0.22" />
      <path d="M 164 130 Q 196 118 228 132 L 224 150 Q 196 162 168 150 Z" fill="#E8C4A0" opacity="0.18" />
      <line x1="154" y1="158" x2="264" y2="153" stroke="#8B9E8B" strokeWidth="0.8" opacity="0.28" />

      {/* ── Bookshelf (right wall) ── */}
      <rect x="292" y="78"  width="98"  height="408" rx="4" fill="#263848" opacity="0.92" />
      {/* Shelf boards */}
      <rect x="292" y="78"  width="98" height="6" rx="2" fill="#3a2c1e" />
      <rect x="292" y="176" width="98" height="6" rx="2" fill="#3a2c1e" />
      <rect x="292" y="274" width="98" height="6" rx="2" fill="#3a2c1e" />
      <rect x="292" y="372" width="98" height="6" rx="2" fill="#3a2c1e" />
      {/* Books — shelf 1 */}
      <g opacity="0.88">
        <rect x="297" y="96"  width="10" height="76" rx="2" fill="#C45C2A" />
        <rect x="309" y="103" width="14" height="69" rx="2" fill="#7AB3D4" />
        <rect x="325" y="98"  width="9"  height="74" rx="2" fill="#E8C4A0" />
        <rect x="336" y="106" width="12" height="66" rx="2" fill="#8B9E8B" />
        <rect x="350" y="101" width="8"  height="71" rx="2" fill="#A78BFA" opacity="0.72" />
        <rect x="360" y="95"  width="11" height="77" rx="2" fill="#5c7a5c" />
        <rect x="373" y="104" width="10" height="68" rx="2" fill="#8B6914" />
      </g>
      {/* Books — shelf 2 */}
      <g opacity="0.76">
        <rect x="297" y="194" width="12" height="76" rx="2" fill="#5c4a8B" />
        <rect x="311" y="198" width="9"  height="72" rx="2" fill="#C45C2A" />
        <rect x="322" y="192" width="15" height="78" rx="2" fill="#2A6A9C" />
        <rect x="339" y="196" width="8"  height="74" rx="2" fill="#8B9E8B" />
        <rect x="349" y="191" width="11" height="79" rx="2" fill="#E8C4A0" opacity="0.82" />
        <rect x="362" y="199" width="10" height="71" rx="2" fill="#7AB3D4" opacity="0.72" />
        <rect x="374" y="194" width="9"  height="76" rx="2" fill="#5c3a18" />
      </g>
      {/* Books — shelf 3 */}
      <g opacity="0.64">
        <rect x="297" y="292" width="14" height="76" rx="2" fill="#7AB3D4" />
        <rect x="313" y="296" width="10" height="72" rx="2" fill="#E8C4A0" />
        <rect x="325" y="290" width="12" height="78" rx="2" fill="#8B9E8B" />
        <rect x="339" y="294" width="9"  height="74" rx="2" fill="#C45C2A" opacity="0.82" />
        <rect x="350" y="289" width="13" height="79" rx="2" fill="#2A6A9C" opacity="0.72" />
        <rect x="365" y="295" width="10" height="73" rx="2" fill="#8B6914" opacity="0.72" />
      </g>

      {/* ── Monstera plant (upper left) ── */}
      <path d="M 88 560 Q 78 482 73 420 Q 68 370 78 308 Q 88 258 83 178"
            fill="none" stroke="#2D5016" strokeWidth="4" opacity="0.92" />
      {/* Leaf 1 (largest) */}
      <path d="M 80 196 Q 26 166 6 198 Q -12 230 38 250 Q 74 262 88 230 Z"
            fill="#2D5016" opacity="0.88" />
      <path d="M 80 196 Q 28 171 12 208 Q 4 232 38 246"
            fill="none" stroke="#4A7C2A" strokeWidth="1.5" opacity="0.48" />
      <path d="M 80 196 Q 48 178 28 182" fill="none" stroke="#1a3a0a" strokeWidth="1.8" opacity="0.58" />
      <path d="M 76 208 Q 43 218 26 228" fill="none" stroke="#1a3a0a" strokeWidth="1.8" opacity="0.58" />
      {/* Leaf 2 */}
      <path d="M 78 298 Q 18 272 3 308 Q -12 344 33 358 Q 70 366 86 338 Z"
            fill="#1a4a10" opacity="0.82" />
      <path d="M 78 298 Q 36 282 18 308" fill="none" stroke="#3a6a20" strokeWidth="1.2" opacity="0.4" />
      {/* Leaf 3 */}
      <path d="M 83 382 Q 38 364 28 390 Q 20 416 53 424 Q 78 426 86 400 Z"
            fill="#22703a" opacity="0.78" />
      {/* Pot */}
      <path d="M 68 548 Q 60 562 66 574 Q 73 582 102 582 Q 128 582 133 574 Q 138 562 128 548 Z"
            fill="#C45C2A" opacity="0.82" />
      <ellipse cx="98" cy="548" rx="28" ry="10" fill="#8B3a1A" opacity="0.82" />

      {/* ── Sofa ── */}
      <path d="M 8 690 L 8 615 Q 8 598 24 598 L 278 598 Q 292 598 292 614 L 292 690 Z"
            fill="#7A9070" opacity="0.95" />
      {/* Sofa back */}
      <path d="M 8 598 L 8 548 Q 8 538 22 538 L 280 538 Q 292 538 292 548 L 292 598 Z"
            fill="#6A8060" opacity="0.88" />
      {/* Seat dividers */}
      <line x1="100" y1="598" x2="100" y2="690" stroke="#4a5e40" strokeWidth="1.5" opacity="0.45" />
      <line x1="200" y1="598" x2="200" y2="690" stroke="#4a5e40" strokeWidth="1.5" opacity="0.45" />
      {/* Cushions */}
      <rect x="16"  y="542" width="76"  height="57" rx="8" fill="#7a9472" opacity="0.92" />
      <rect x="106" y="542" width="76"  height="57" rx="8" fill="#7a9472" opacity="0.92" />
      <rect x="196" y="542" width="76"  height="57" rx="8" fill="#7a9472" opacity="0.92" />
      {/* Sofa arm */}
      <rect x="276" y="538" width="28" height="104" rx="8" fill="#6A8060" opacity="0.88" />
      {/* Decorative pillow */}
      <rect x="243" y="550" width="46"  height="42" rx="6" fill="#C4A882" opacity="0.88" />
      <line x1="266" y1="550" x2="266" y2="592" stroke="#a88a60" strokeWidth="0.8" opacity="0.4" />
      <line x1="243" y1="571" x2="289" y2="571" stroke="#a88a60" strokeWidth="0.8" opacity="0.4" />

      {/* ── Side table + lamp (left) ── */}
      <ellipse cx="42" cy="592" rx="38" ry="12" fill="#3a2a18" opacity="0.92" />
      <rect x="36" y="592" width="14"  height="58" fill="#2a1e10" opacity="0.82" />
      <rect x="28" y="562" width="28"  height="32" rx="6" fill="#8B6914" opacity="0.92" />
      {/* Lamp shade */}
      <path d="M 16 542 Q 16 527 42 527 Q 68 527 68 542 L 58 562 L 26 562 Z" fill="#E8C4A0" opacity="0.92" />
      <ellipse cx="42" cy="542" rx="18" ry="8" fill="#F5D87A" opacity="0.55" />

      {/* Lamp glow overlay (speaking-reactive) */}
      <g ref={lampRef} opacity="0.50">
        <rect width="390" height="844" fill="url(#hn-lamp)" />
      </g>

      {/* ── Rug ── */}
      <ellipse cx="162" cy="732" rx="162" ry="54" fill="#C4A882" opacity="0.11" />
      <ellipse cx="162" cy="732" rx="130" ry="40" fill="none" stroke="#C4A882" strokeWidth="1.5" opacity="0.14" />
      <ellipse cx="162" cy="732" rx="100" ry="28" fill="none" stroke="#C4A882" strokeWidth="1"   opacity="0.10" />

      {/* ── Floor ── */}
      <rect x="0" y="700" width="390" height="144" fill="#1a2a38" opacity="0.60" />

      {/* ── Vignette ── */}
      <rect width="390" height="844" fill="url(#hn-vignette)" />
    </svg>
  );
}
