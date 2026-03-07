// DavidBackground — Premium Modern Gym, City Dawn View
import { useEffect, useRef } from 'react';
export default function DavidBackground({ speaking = false }) {
  const lightsRef = useRef(null);
  useEffect(() => {
    if (!lightsRef.current) return;
    lightsRef.current.style.transition = 'opacity 400ms ease';
    lightsRef.current.style.opacity = speaking ? '0.55' : '0.32';
  }, [speaking]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="dv-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#060E1E"/>
          <stop offset="50%" stopColor="#0C1A2E"/>
          <stop offset="100%" stopColor="#040A18"/>
        </linearGradient>
        <linearGradient id="dv-dawn" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#080E20"/>
          <stop offset="30%" stopColor="#0C1838"/>
          <stop offset="58%" stopColor="#1A2848"/>
          <stop offset="75%" stopColor="#C04A00"/>
          <stop offset="88%" stopColor="#E86000"/>
          <stop offset="100%" stopColor="#FF9020"/>
        </linearGradient>
        <radialGradient id="dv-sunrise" cx="50%" cy="88%" r="50%">
          <stop offset="0%" stopColor="#FF8C00" stopOpacity="0.85"/>
          <stop offset="40%" stopColor="#E84000" stopOpacity="0.40"/>
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="dv-light1" cx="20%" cy="0%" r="52%">
          <stop offset="0%" stopColor="#A0D0FF" stopOpacity="0.50"/>
          <stop offset="100%" stopColor="#0C1A2E" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="dv-light2" cx="50%" cy="0%" r="52%">
          <stop offset="0%" stopColor="#C0E0FF" stopOpacity="0.60"/>
          <stop offset="100%" stopColor="#0C1A2E" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="dv-light3" cx="80%" cy="0%" r="52%">
          <stop offset="0%" stopColor="#A0D0FF" stopOpacity="0.48"/>
          <stop offset="100%" stopColor="#0C1A2E" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="dv-vig" cx="50%" cy="50%" r="70%">
          <stop offset="50%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#020810" stopOpacity="0.78"/>
        </radialGradient>
        <filter id="dv-glow"><feGaussianBlur stdDeviation="8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="dv-soft"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="dv-glow2"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="390" height="844" fill="url(#dv-bg)"/>
      {/* Ceiling track */}
      <rect width="390" height="58" fill="#0A1428"/>
      {/* Floor-to-ceiling window panorama */}
      <rect x="28" y="58" width="334" height="330" fill="url(#dv-dawn)"/>
      <rect x="28" y="58" width="334" height="330" fill="url(#dv-sunrise)"/>
      {/* City skyline silhouette */}
      <path d="M 28 355 L 28 282 L 50 282 L 50 256 L 62 256 L 62 240 L 74 240 L 74 256 L 86 256
        L 86 272 L 98 272 L 98 248 L 110 248 L 110 264 L 122 264 L 122 236 L 136 236 L 136 220
        L 148 220 L 148 204 L 160 204 L 160 224 L 172 224 L 172 252 L 184 252 L 184 238 L 196 238
        L 196 220 L 208 220 L 208 238 L 220 238 L 220 258 L 232 258 L 232 236 L 244 236 L 244 216
        L 256 216 L 256 232 L 268 232 L 268 248 L 280 248 L 280 260 L 292 260 L 292 242 L 304 242
        L 304 226 L 316 226 L 316 244 L 328 244 L 328 268 L 340 268 L 340 255 L 362 255 L 362 355Z"
        fill="#0A1020" opacity="0.92"/>
      {/* Building windows - tiny lights */}
      {[[148,224],[160,212],[196,228],[244,224],[256,224],[304,234],[316,234]].map(([x,y],i) => (
        <rect key={i} x={x+2} y={y+2} width="6" height="4" fill="#FFB850" opacity={0.35+i*0.05}/>
      ))}
      {[[136,238],[122,252],[172,240],[208,228],[232,250],[268,236],[280,252]].map(([x,y],i) => (
        <rect key={i} x={x+2} y={y+2} width="4" height="3" fill="#A0C8FF" opacity={0.28+i*0.04}/>
      ))}
      {/* Horizon glow */}
      <rect x="28" y="340" width="334" height="20" fill="#FF6000" opacity="0.18" filter="url(#dv-soft)"/>
      {/* Window frame - steel */}
      <rect x="28" y="58" width="4" height="334" fill="#1A2A42"/>
      <rect x="358" y="58" width="4" height="334" fill="#1A2A42"/>
      {[156,284].map((x,i) => <rect key={i} x={x} y="58" width="3" height="334" fill="#1A2A42"/>)}
      {[58,170,280].map((y,i) => <rect key={i} x="28" y={y} width="334" height="3" fill="#1A2A42"/>)}
      {/* Mirror wall full */}
      <rect x="0" y="58" width="28" height="334" fill="#0E1C30" opacity="0.75"/>
      <rect x="362" y="58" width="28" height="334" fill="#0E1C30" opacity="0.75"/>
      <rect x="28" y="58" width="334" height="6" fill="#38BDF8" opacity="0.12" filter="url(#dv-soft)"/>
      {/* Mirror reflection band */}
      <rect x="0" y="58" width="390" height="12" fill="#38BDF8" opacity="0.08"/>
      {/* Industrial pendant lights - bright */}
      {[{x:68,cx:78},{x:183,cx:195},{x:300,cx:312}].map(({x,cx},i) => (
        <g key={i}>
          <line x1={cx} y1="0" x2={cx} y2="44" stroke="#2A3A54" strokeWidth="2.5"/>
          <path d={`M ${cx-26} 44 Q ${cx-26} 32 ${cx} 30 Q ${cx+26} 32 ${cx+26} 44 L ${cx+18} 62 L ${cx-18} 62Z`}
            fill="#1A2A44"/>
          <ellipse cx={cx} cy="44" rx="22" ry="11" fill="#38BDF8" opacity="0.72" filter="url(#dv-glow)"/>
          <ellipse cx={cx} cy="46" rx="14" ry="7" fill="#7ED8FF" opacity="0.65"/>
        </g>
      ))}
      {/* Light cones */}
      <g ref={lightsRef} opacity="0.32">
        <rect width="390" height="844" fill="url(#dv-light1)"/>
        <rect width="390" height="844" fill="url(#dv-light2)"/>
        <rect width="390" height="844" fill="url(#dv-light3)"/>
      </g>
      {/* Blue accent stripe */}
      <rect x="0" y="500" width="390" height="5" fill="#38BDF8" opacity="0.90"/>
      <rect x="0" y="498" width="390" height="5" fill="#38BDF8" opacity="0.25" filter="url(#dv-soft)"/>
      {/* Premium dumbbell rack */}
      <rect x="24" y="390" width="342" height="108" rx="6" fill="#0C1828" stroke="#1C2C46" strokeWidth="2"/>
      <rect x="30" y="402" width="330" height="6" rx="2" fill="#1C2C46"/>
      <rect x="30" y="440" width="330" height="6" rx="2" fill="#1C2C46"/>
      <rect x="30" y="478" width="330" height="6" rx="2" fill="#1C2C46"/>
      {/* Row 1 — colored dumbbells */}
      {[{cx:58,r:10,c:'#4FC3F7'},{cx:98,r:11,c:'#4FC3F7'},{cx:142,r:12,c:'#29B6F6'},{cx:186,r:13,c:'#0288D1'},
        {cx:232,r:14,c:'#0277BD'},{cx:280,r:15,c:'#01579B'},{cx:330,r:16,c:'#1A3060'}].map(({cx,r,c},i) => (
        <g key={i}>
          <ellipse cx={cx-r-4} cy="405" rx={r} ry={r*0.6} fill={c} opacity="0.85"/>
          <rect x={cx-4} y={405-r*0.3} width="8" height={r*0.6} rx="2" fill="#1C2C46"/>
          <ellipse cx={cx+r+4} cy="405" rx={r} ry={r*0.6} fill={c} opacity="0.85"/>
        </g>
      ))}
      {/* Row 2 — heavier, darker */}
      {[{cx:65,r:12,c:'#263952'},{cx:113,r:14,c:'#1E3048'},{cx:165,r:15,c:'#182840'},{cx:219,r:16,c:'#142038'},
        {cx:275,r:17,c:'#102030'},{cx:333,r:18,c:'#0C1828'}].map(({cx,r,c},i) => (
        <g key={i}>
          <ellipse cx={cx-r-4} cy="443" rx={r} ry={r*0.58} fill={c} opacity="0.80"/>
          <rect x={cx-4} y={443-r*0.29} width="8" height={r*0.58} rx="2" fill="#1C2C46"/>
          <ellipse cx={cx+r+4} cy="443" rx={r} ry={r*0.58} fill={c} opacity="0.80"/>
        </g>
      ))}
      {/* Barbell rack left */}
      <rect x="0" y="330" width="24" height="172" rx="4" fill="#0C1828" opacity="0.90"/>
      <rect x="4" y="340" width="16" height="4" rx="1" fill="#1C2C46"/>
      <rect x="4" y="370" width="16" height="4" rx="1" fill="#1C2C46"/>
      <rect x="4" y="400" width="16" height="4" rx="1" fill="#1C2C46"/>
      {/* Barbell rack right */}
      <rect x="366" y="330" width="24" height="172" rx="4" fill="#0C1828" opacity="0.90"/>
      <rect x="370" y="340" width="16" height="4" rx="1" fill="#1C2C46"/>
      <rect x="370" y="370" width="16" height="4" rx="1" fill="#1C2C46"/>
      {/* Rubber floor */}
      <rect x="0" y="504" width="390" height="340" fill="#10182A"/>
      {/* Floor grid */}
      {[540,580,620,660,700,740,780,820].map((y,i) => (
        <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#1A2840" strokeWidth="1.5"/>
      ))}
      {[78,156,234,312].map((x,i) => (
        <line key={i} x1={x} y1="504" x2={x} y2="844" stroke="#1A2840" strokeWidth="1.5"/>
      ))}
      {/* Blue LED accent on floor edge */}
      <rect x="0" y="504" width="390" height="3" fill="#38BDF8" opacity="0.30" filter="url(#dv-soft)"/>
      {/* Kettlebell foreground left */}
      <path d="M 18 488 Q 10 476 10 464 Q 10 452 26 452 Q 42 452 42 464 Q 42 476 34 488Z" fill="#141E30" opacity="0.85"/>
      <ellipse cx="26" cy="452" rx="16" ry="10" fill="#1C2A3E"/>
      <path d="M 20 444 Q 26 436 32 444" fill="none" stroke="#2A3A52" strokeWidth="4" strokeLinecap="round"/>
      <rect width="390" height="844" fill="url(#dv-vig)"/>
    </svg>
  );
}
