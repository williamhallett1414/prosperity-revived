// DavidBackground — Gym Interior with Equipment
import { useEffect, useRef } from 'react';
export default function DavidBackground({ speaking = false }) {
  const lightsRef = useRef(null);
  useEffect(() => {
    if (!lightsRef.current) return;
    lightsRef.current.style.transition = 'opacity 400ms ease';
    lightsRef.current.style.opacity = speaking ? '0.65' : '0.40';
  }, [speaking]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="dv-wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A2235"/>
          <stop offset="100%" stopColor="#111828"/>
        </linearGradient>
        <linearGradient id="dv-floor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E2030"/>
          <stop offset="100%" stopColor="#141820"/>
        </linearGradient>
        <linearGradient id="dv-mirror" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E2E48"/>
          <stop offset="100%" stopColor="#182038"/>
        </linearGradient>
        <radialGradient id="dv-light1" cx="20%" cy="0%" r="55%">
          <stop offset="0%" stopColor="#B0D8FF" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#0A1020" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="dv-light2" cx="50%" cy="0%" r="55%">
          <stop offset="0%" stopColor="#C8E8FF" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#0A1020" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="dv-light3" cx="80%" cy="0%" r="55%">
          <stop offset="0%" stopColor="#B0D8FF" stopOpacity="0.50"/>
          <stop offset="100%" stopColor="#0A1020" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="dv-vig" cx="50%" cy="50%" r="72%">
          <stop offset="45%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#060A12" stopOpacity="0.65"/>
        </radialGradient>
        <filter id="dv-blur"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="dv-glow"><feGaussianBlur stdDeviation="8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* ── Base wall ── */}
      <rect width="390" height="844" fill="url(#dv-wall)"/>

      {/* ── Ceiling ── */}
      <rect width="390" height="55" fill="#141C2C"/>
      <rect x="0" y="52" width="390" height="5" fill="#0E1422"/>

      {/* ── MIRROR WALL (full back wall) ── */}
      <rect x="58" y="55" width="274" height="320" fill="url(#dv-mirror)" rx="3"/>
      {/* Mirror frame */}
      <rect x="58" y="55" width="274" height="320" fill="none" stroke="#2A3A54" strokeWidth="4" rx="3"/>
      {/* Mirror reflection tint */}
      <rect x="62" y="59" width="266" height="312" fill="#38BDF8" opacity="0.03" rx="2"/>
      {/* Mirror vertical dividers */}
      <line x1="195" y1="55" x2="195" y2="375" stroke="#2A3A54" strokeWidth="2.5"/>
      <line x1="127" y1="55" x2="127" y2="375" stroke="#2A3A54" strokeWidth="1.5" opacity="0.5"/>
      <line x1="263" y1="55" x2="263" y2="375" stroke="#2A3A54" strokeWidth="1.5" opacity="0.5"/>
      {/* Mirror highlight */}
      <line x1="62" y1="60" x2="62" y2="372" stroke="white" strokeWidth="1.5" opacity="0.06"/>

      {/* ── MOTIVATIONAL BANNER on wall ── */}
      <rect x="100" y="68" width="190" height="40" rx="4" fill="#0E1830" stroke="#38BDF8" strokeWidth="1.5" opacity="0.90"/>
      <text x="195" y="93" textAnchor="middle" fill="#38BDF8" fontSize="14" fontFamily="Arial Black,sans-serif"
        fontWeight="900" letterSpacing="3" opacity="0.80">NO PAIN NO GAIN</text>

      {/* ── LEFT side wall ── */}
      <rect x="0" y="0" width="58" height="700" fill="#141C2C"/>
      <rect x="54" y="55" width="4" height="650" fill="#0E1422"/>
      {/* ── RIGHT side wall ── */}
      <rect x="332" y="0" width="58" height="700" fill="#141C2C"/>
      <rect x="332" y="55" width="4" height="650" fill="#0E1422"/>

      {/* ── PENDANT LIGHTS ── */}
      {[78,195,312].map((cx,i) => (
        <g key={i}>
          <line x1={cx} y1="0" x2={cx} y2="42" stroke="#2A3A54" strokeWidth="2.5"/>
          <path d={`M ${cx-28} 42 Q ${cx-28} 28 ${cx} 26 Q ${cx+28} 28 ${cx+28} 42 L ${cx+20} 62 L ${cx-20} 62Z`}
            fill="#1A2840"/>
          <ellipse cx={cx} cy="42" rx="24" ry="12" fill="#38BDF8" opacity="0.70" filter="url(#dv-glow)"/>
          <ellipse cx={cx} cy="44" rx="16" ry="8" fill="#7FD4FF" opacity="0.65"/>
        </g>
      ))}

      {/* Light cones from pendants */}
      <g ref={lightsRef} opacity="0.40">
        <rect width="390" height="844" fill="url(#dv-light1)"/>
        <rect width="390" height="844" fill="url(#dv-light2)"/>
        <rect width="390" height="844" fill="url(#dv-light3)"/>
      </g>

      {/* ── DUMBBELL RACK (prominent, left side) ── */}
      {/* Rack frame */}
      <rect x="0" y="375" width="140" height="135" rx="4" fill="#0E1828" stroke="#1C2C44" strokeWidth="2"/>
      {/* 3 Rack shelves */}
      <rect x="5" y="392" width="130" height="7" rx="2" fill="#1C2C44"/>
      <rect x="5" y="430" width="130" height="7" rx="2" fill="#1C2C44"/>
      <rect x="5" y="468" width="130" height="7" rx="2" fill="#1C2C44"/>
      {/* Row 1 — small colourful dumbbells */}
      <g>
        <ellipse cx="22"  cy="394" rx="10" ry="6.5" fill="#EF5350" opacity="0.90"/>
        <rect x="29"  y="389" width="7" height="10" rx="1.5" fill="#1C2C44"/>
        <ellipse cx="43"  cy="394" rx="10" ry="6.5" fill="#EF5350" opacity="0.90"/>
        <ellipse cx="62"  cy="393" rx="11" ry="7" fill="#FFA726" opacity="0.88"/>
        <rect x="70"  y="388" width="7" height="11" rx="1.5" fill="#1C2C44"/>
        <ellipse cx="84"  cy="393" rx="11" ry="7" fill="#FFA726" opacity="0.88"/>
        <ellipse cx="104" cy="392" rx="12" ry="7.5" fill="#66BB6A" opacity="0.85"/>
        <rect x="113" y="387" width="7" height="12" rx="1.5" fill="#1C2C44"/>
        <ellipse cx="127" cy="392" rx="12" ry="7.5" fill="#66BB6A" opacity="0.85"/>
      </g>
      {/* Row 2 — medium dumbbells */}
      <g>
        <ellipse cx="24"  cy="432" rx="12" ry="7.5" fill="#42A5F5" opacity="0.88"/>
        <rect x="33"  y="426" width="8" height="12" rx="1.5" fill="#1C2C44"/>
        <ellipse cx="48"  cy="432" rx="12" ry="7.5" fill="#42A5F5" opacity="0.88"/>
        <ellipse cx="72"  cy="431" rx="13" ry="8" fill="#AB47BC" opacity="0.85"/>
        <rect x="82"  y="425" width="8" height="13" rx="1.5" fill="#1C2C44"/>
        <ellipse cx="97"  cy="431" rx="13" ry="8" fill="#AB47BC" opacity="0.85"/>
      </g>
      {/* Row 3 — heavy dumbbells dark */}
      <g>
        <ellipse cx="26"  cy="470" rx="14" ry="8.5" fill="#37474F" opacity="0.88"/>
        <rect x="37"  y="464" width="9" height="13" rx="1.5" fill="#1A2840"/>
        <ellipse cx="53"  cy="470" rx="14" ry="8.5" fill="#37474F" opacity="0.88"/>
        <ellipse cx="82"  cy="469" rx="15" ry="9" fill="#263238" opacity="0.85"/>
        <rect x="94"  y="463" width="9" height="14" rx="1.5" fill="#1A2840"/>
        <ellipse cx="110" cy="469" rx="15" ry="9" fill="#263238" opacity="0.85"/>
      </g>

      {/* ── BARBELL RACK (right side) ── */}
      <rect x="250" y="375" width="140" height="200" rx="4" fill="#0E1828" stroke="#1C2C44" strokeWidth="2"/>
      {/* Upright posts */}
      <rect x="265" y="380" width="12" height="180" rx="2" fill="#1C2C44"/>
      <rect x="373" y="380" width="12" height="180" rx="2" fill="#1C2C44"/>
      {/* Bar hooks */}
      <rect x="260" y="400" width="22" height="8" rx="3" fill="#38BDF8" opacity="0.60"/>
      <rect x="368" y="400" width="22" height="8" rx="3" fill="#38BDF8" opacity="0.60"/>
      <rect x="260" y="440" width="22" height="8" rx="3" fill="#38BDF8" opacity="0.45"/>
      <rect x="368" y="440" width="22" height="8" rx="3" fill="#38BDF8" opacity="0.45"/>
      {/* Barbell on top hooks */}
      <rect x="270" y="393" width="110" height="10" rx="3" fill="#8A9BB0"/>
      {/* Weight plates on barbell */}
      <ellipse cx="278" cy="398" rx="5" ry="15" fill="#37474F"/>
      <ellipse cx="285" cy="398" rx="5" ry="15" fill="#1C2C44"/>
      <ellipse cx="365" cy="398" rx="5" ry="15" fill="#37474F"/>
      <ellipse cx="372" cy="398" rx="5" ry="15" fill="#1C2C44"/>
      {/* Weight plates leaning against rack */}
      <ellipse cx="258" cy="540" rx="10" ry="32" fill="#37474F" opacity="0.90"/>
      <ellipse cx="270" cy="540" rx="9" ry="29" fill="#1C2C44" opacity="0.88"/>
      <ellipse cx="380" cy="540" rx="10" ry="32" fill="#37474F" opacity="0.90"/>
      <ellipse cx="370" cy="540" rx="9" ry="29" fill="#1C2C44" opacity="0.88"/>

      {/* ── BENCH PRESS (centre foreground) ── */}
      {/* Bench frame */}
      <rect x="120" y="540" width="150" height="12" rx="4" fill="#38BDF8" opacity="0.65"/>
      <rect x="128" y="550" width="134" height="8" rx="3" fill="#1C2C44"/>
      {/* Bench pad */}
      <rect x="130" y="520" width="130" height="22" rx="6" fill="#2A3A52"/>
      <rect x="133" y="522" width="124" height="18" rx="5" fill="#1E2E44"/>
      {/* Bench legs */}
      <rect x="132" y="558" width="10" height="30" rx="3" fill="#1A2840"/>
      <rect x="248" y="558" width="10" height="30" rx="3" fill="#1A2840"/>
      {/* Barbell above bench */}
      <rect x="100" y="498" width="190" height="10" rx="3" fill="#8A9BB0" opacity="0.80"/>
      <ellipse cx="110" cy="503" rx="6" ry="20" fill="#38BDF8" opacity="0.55"/>
      <ellipse cx="120" cy="503" rx="5" ry="18" fill="#1C2C44" opacity="0.70"/>
      <ellipse cx="280" cy="503" rx="6" ry="20" fill="#38BDF8" opacity="0.55"/>
      <ellipse cx="270" cy="503" rx="5" ry="18" fill="#1C2C44" opacity="0.70"/>

      {/* ── RUBBER FLOOR ── */}
      <rect x="0" y="575" width="390" height="269" fill="#161C28"/>
      {/* Blue accent stripe */}
      <rect x="0" y="573" width="390" height="5" fill="#38BDF8" opacity="0.80"/>
      <rect x="0" y="571" width="390" height="5" fill="#38BDF8" opacity="0.20" filter="url(#dv-blur)"/>
      {/* Floor grid */}
      {[610,648,686,724,762,800,838].map((y,i) => (
        <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#1E2838" strokeWidth="1.5"/>
      ))}
      {[78,156,234,312].map((x,i) => (
        <line key={i} x1={x} y1="575" x2={x} y2="844" stroke="#1E2838" strokeWidth="1.5"/>
      ))}
      {/* Gym logo on floor */}
      <text x="195" y="720" textAnchor="middle" fill="#38BDF8" fontSize="18" fontFamily="Arial Black,sans-serif"
        fontWeight="900" letterSpacing="4" opacity="0.10">FITNESS ZONE</text>

      {/* ── Vignette ── */}
      <rect width="390" height="844" fill="url(#dv-vig)"/>
    </svg>
  );
}
