// DanielBackground — Kitchen with Stove and Fridge
import { useEffect, useRef } from 'react';
export default function DanielBackground({ speaking = false }) {
  const lightRef = useRef(null);
  useEffect(() => {
    if (!lightRef.current) return;
    lightRef.current.style.transition = 'opacity 400ms ease';
    lightRef.current.style.opacity = speaking ? '0.55' : '0.35';
  }, [speaking]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="k-wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0EAD8"/>
          <stop offset="100%" stopColor="#E4DAC4"/>
        </linearGradient>
        <linearGradient id="k-cabinet" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B4C2A"/>
          <stop offset="100%" stopColor="#4E3518"/>
        </linearGradient>
        <linearGradient id="k-counter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D0D0D0"/>
          <stop offset="100%" stopColor="#B8B8B8"/>
        </linearGradient>
        <linearGradient id="k-stove" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A2A2A"/>
          <stop offset="100%" stopColor="#1A1A1A"/>
        </linearGradient>
        <linearGradient id="k-fridge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E8"/>
          <stop offset="100%" stopColor="#D0D0D0"/>
        </linearGradient>
        <radialGradient id="k-light" cx="50%" cy="0%" r="65%">
          <stop offset="0%" stopColor="#FFF5D0" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#F0EAD8" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="k-vig" cx="50%" cy="50%" r="72%">
          <stop offset="42%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#1A1008" stopOpacity="0.42"/>
        </radialGradient>
        <radialGradient id="k-burner" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF4500" stopOpacity="0.90"/>
          <stop offset="50%" stopColor="#FF6800" stopOpacity="0.50"/>
          <stop offset="100%" stopColor="#FF4500" stopOpacity="0"/>
        </radialGradient>
        <filter id="k-blur"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="k-blur2"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="k-sh"><feDropShadow dx="2" dy="3" stdDeviation="5" floodColor="#2A1808" floodOpacity="0.20"/></filter>
      </defs>

      {/* ── Wall ── */}
      <rect width="390" height="844" fill="url(#k-wall)"/>

      {/* ── Ceiling / light ambient ── */}
      <rect width="390" height="20" fill="#E8E0C8"/>
      <rect width="390" height="844" fill="url(#k-light)"/>

      {/* ── WINDOW (upper centre) ── */}
      <rect x="128" y="24" width="134" height="112" fill="#A8D8F8"/>
      {/* Sky outside */}
      <rect x="128" y="24" width="134" height="112" fill="#87CEEB"/>
      <rect x="128" y="90" width="134" height="46" fill="#A8D870" opacity="0.30"/>
      {/* Window frame */}
      <rect x="128" y="24" width="134" height="112" fill="none" stroke="#8B6040" strokeWidth="5"/>
      <line x1="195" y1="24" x2="195" y2="136" stroke="#8B6040" strokeWidth="3.5"/>
      <line x1="128" y1="80" x2="262" y2="80" stroke="#8B6040" strokeWidth="3"/>
      {/* Window sill */}
      <rect x="118" y="132" width="154" height="12" rx="3" fill="#8B6040"/>
      {/* Pot on sill */}
      <ellipse cx="148" cy="130" rx="14" ry="10" fill="#3A8818" opacity="0.88"/>
      <path d="M 148 131 L 143 143 L 153 143Z" fill="#A03818" opacity="0.80"/>
      <ellipse cx="245" cy="130" rx="14" ry="10" fill="#6A9828" opacity="0.82"/>
      <path d="M 245 131 L 240 143 L 250 143Z" fill="#A03818" opacity="0.78"/>

      {/* ── UPPER CABINETS (left) ── */}
      <rect x="0" y="20" width="120" height="200" rx="3" fill="url(#k-cabinet)" filter="url(#k-sh)"/>
      <line x1="0" y1="20" x2="120" y2="20" stroke="#3A2410" strokeWidth="2"/>
      {/* Cabinet doors left */}
      <rect x="5" y="28" width="50" height="88" rx="3" fill="#7A5830" stroke="#3A2410" strokeWidth="1.5"/>
      <rect x="61" y="28" width="50" height="88" rx="3" fill="#7A5830" stroke="#3A2410" strokeWidth="1.5"/>
      {/* Cabinet door knobs */}
      <circle cx="52" cy="72" r="4" fill="#C8A860" opacity="0.90"/>
      <circle cx="64" cy="72" r="4" fill="#C8A860" opacity="0.90"/>
      {/* Cabinet lower shelf items (visible through gap) */}
      <rect x="5" y="122" width="50" height="88" rx="3" fill="#7A5830" stroke="#3A2410" strokeWidth="1.5"/>
      <rect x="61" y="122" width="50" height="88" rx="3" fill="#7A5830" stroke="#3A2410" strokeWidth="1.5"/>
      <circle cx="52" cy="164" r="4" fill="#C8A860" opacity="0.90"/>
      <circle cx="64" cy="164" r="4" fill="#C8A860" opacity="0.90"/>

      {/* ── UPPER CABINETS (right) ── */}
      <rect x="270" y="20" width="120" height="200" rx="3" fill="url(#k-cabinet)" filter="url(#k-sh)"/>
      <rect x="275" y="28" width="50" height="88" rx="3" fill="#7A5830" stroke="#3A2410" strokeWidth="1.5"/>
      <rect x="331" y="28" width="50" height="88" rx="3" fill="#7A5830" stroke="#3A2410" strokeWidth="1.5"/>
      <circle cx="277" cy="72" r="4" fill="#C8A860" opacity="0.90"/>
      <circle cx="329" cy="72" r="4" fill="#C8A860" opacity="0.90"/>
      <rect x="275" y="122" width="50" height="88" rx="3" fill="#7A5830" stroke="#3A2410" strokeWidth="1.5"/>
      <rect x="331" y="122" width="50" height="88" rx="3" fill="#7A5830" stroke="#3A2410" strokeWidth="1.5"/>
      <circle cx="277" cy="164" r="4" fill="#C8A860" opacity="0.90"/>
      <circle cx="329" cy="164" r="4" fill="#C8A860" opacity="0.90"/>

      {/* ── POT RACK hanging from ceiling ── */}
      <rect x="0" y="22" width="390" height="6" rx="2" fill="#6B4C2A" opacity="0.80"/>
      {/* Hanging pots */}
      {[22,60,100].map((x,i) => {
        const h=[58,72,64][i];
        return (<g key={i}>
          <line x1={x+16} y1="28" x2={x+16} y2={28+h*0.4} stroke="#5A3C18" strokeWidth="2"/>
          <path d={`M ${x} ${28+h*0.4} Q ${x} ${28+h*0.75} ${x+16} ${28+h} Q ${x+32} ${28+h*0.75} ${x+32} ${28+h*0.4}Z`}
            fill="#A07830" opacity="0.88"/>
          <ellipse cx={x+16} cy={28+h*0.4} rx="16" ry="8" fill="#B88840" opacity="0.85"/>
        </g>);
      })}
      {[288,328,358].map((x,i) => {
        const h=[68,58,62][i];
        return (<g key={i}>
          <line x1={x+16} y1="28" x2={x+16} y2={28+h*0.4} stroke="#5A3C18" strokeWidth="2"/>
          <path d={`M ${x} ${28+h*0.4} Q ${x} ${28+h*0.75} ${x+16} ${28+h} Q ${x+32} ${28+h*0.75} ${x+32} ${28+h*0.4}Z`}
            fill="#A07830" opacity="0.85"/>
          <ellipse cx={x+16} cy={28+h*0.4} rx="16" ry="8" fill="#B88840" opacity="0.82"/>
        </g>);
      })}

      {/* ── BACKSPLASH TILES ── */}
      <rect x="0" y="220" width="390" height="130" fill="#D8C8A0"/>
      {/* Tile grid */}
      {[220,254,288,322,350].map((y,i) => (
        <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#B8A880" strokeWidth="2"/>
      ))}
      {[0,48,96,144,192,240,288,336,384].map((x,i) => (
        <line key={i} x1={x} y1="220" x2={x} y2="350" stroke="#B8A880" strokeWidth="2"/>
      ))}
      {/* Decorative tiles */}
      {[{x:8,y:228},{x:104,y:228},{x:200,y:228},{x:296,y:228},{x:56,y:262},{x:152,y:262},{x:248,y:262},{x:344,y:262}].map((t,i) => (
        <g key={i}>
          <circle cx={t.x+20} cy={t.y+13} r="9" fill="none" stroke="#7A8A60" strokeWidth="1.5" opacity="0.55"/>
          <circle cx={t.x+20} cy={t.y+13} r="5" fill="#9AAA78" opacity="0.35"/>
        </g>
      ))}

      {/* ── COUNTER TOP ── */}
      <rect x="0" y="350" width="390" height="22" rx="3" fill="url(#k-counter)" filter="url(#k-sh)"/>
      <rect x="0" y="348" width="390" height="6" rx="2" fill="#C8C8C8"/>

      {/* ── STOVE (left, big feature) ── */}
      <rect x="5" y="352" width="165" height="270" rx="4" fill="url(#k-stove)" filter="url(#k-sh)"/>
      {/* Stove top surface */}
      <rect x="8" y="352" width="159" height="90" rx="3" fill="#1E1E1E"/>
      {/* 4 Burners */}
      {[{cx:52,cy:384},{cx:118,cy:384},{cx:52,cy:426},{cx:118,cy:426}].map(({cx,cy},i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="22" fill="#111111" stroke="#333" strokeWidth="1.5"/>
          <circle cx={cx} cy={cy} r="18" fill="#0A0A0A" stroke="#222" strokeWidth="1"/>
          <circle cx={cx} cy={cy} r="10" fill="#161616"/>
          {/* Burner grate spokes */}
          {[0,45,90,135].map((a,j) => {
            const r=a*Math.PI/180;
            return <line key={j} x1={cx+Math.round(11*Math.sin(r))} y1={cy-Math.round(11*Math.cos(r))}
              x2={cx+Math.round(20*Math.sin(r))} y2={cy-Math.round(20*Math.cos(r))}
              stroke="#2A2A2A" strokeWidth="3" strokeLinecap="round"/>;
          })}
        </g>
      ))}
      {/* Front left burner ON — glowing blue */}
      <circle cx="52" cy="426" r="22" fill="url(#k-burner)" opacity="0.00"/>
      <circle cx="52" cy="426" r="18" fill="none" stroke="#1E6AFF" strokeWidth="1.5" opacity="0.60">
        <animate attributeName="opacity" values="0.60;0.90;0.60" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="52" cy="426" r="8" fill="none" stroke="#4A9AFF" strokeWidth="1" opacity="0.40">
        <animate attributeName="opacity" values="0.40;0.70;0.40" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      {/* Flame on front-left burner */}
      <ellipse cx="52" cy="414" rx="5" ry="8" fill="#FF6800" opacity="0.70">
        <animate attributeName="ry" values="8;11;7;10;8" dur="0.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.70;0.90;0.60;0.80;0.70" dur="0.8s" repeatCount="indefinite"/>
      </ellipse>
      {/* Stove control knobs */}
      {[30,63,97,130].map((x,i) => (
        <g key={i}>
          <circle cx={x} cy={470} r="10" fill="#2A2A2A" stroke="#444" strokeWidth="1.5"/>
          <line x1={x} y1="462" x2={x} y2="466" stroke="#888" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
      ))}
      {/* Oven door */}
      <rect x="10" y="490" width="155" height="126" rx="3" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="2"/>
      <rect x="18" y="498" width="139" height="110" rx="2" fill="#0E0E0E" stroke="#333" strokeWidth="1.5"/>
      {/* Oven window */}
      <rect x="30" y="510" width="115" height="62" rx="4" fill="#1A0800" stroke="#333" strokeWidth="1.5"/>
      <rect x="32" y="512" width="111" height="58" rx="3" fill="#1E0C04" opacity="0.90"/>
      {/* Oven interior glow */}
      <rect x="32" y="512" width="111" height="58" rx="3" fill="#FF4500" opacity="0.10"/>
      {/* Oven handle */}
      <rect x="40" y="500" width="95" height="8" rx="4" fill="#555" stroke="#666" strokeWidth="1"/>

      {/* ── POT ON STOVE (front right burner) ── */}
      <path d="M 96 414 Q 96 398 118 395 Q 140 398 140 414 L 136 440 L 100 440Z" fill="#A07830" opacity="0.92"/>
      <ellipse cx="118" cy="414" rx="22" ry="9" fill="#B88840" opacity="0.90"/>
      <ellipse cx="118" cy="412" rx="19" ry="7" fill="#C8A050" opacity="0.70"/>
      {/* Pot lid */}
      <ellipse cx="118" cy="393" rx="24" ry="9" fill="#8A6828" opacity="0.88"/>
      <ellipse cx="118" cy="390" rx="20" ry="7" fill="#9A7830" opacity="0.85"/>
      <circle cx="118" cy="385" r="5" fill="#6A5020" opacity="0.90"/>
      {/* Steam */}
      {[108,118,128].map((x,i) => (
        <path key={i} d={`M ${x} 384 Q ${x+4} 372 ${x} 360 Q ${x-4} 348 ${x} 336`}
          fill="none" stroke="white" strokeWidth="2" opacity="0.18" strokeLinecap="round">
          <animate attributeName="opacity" values="0.18;0.06;0.18" dur={`${1.2+i*0.4}s`} repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; 3,-20; 0,0" dur={`${1.8+i*0.3}s`} repeatCount="indefinite"/>
        </path>
      ))}

      {/* ── REFRIGERATOR (right side) ── */}
      <rect x="218" y="352" width="168" height="490" rx="5" fill="url(#k-fridge)" filter="url(#k-sh)"/>
      {/* Fridge border */}
      <rect x="218" y="352" width="168" height="490" rx="5" fill="none" stroke="#B0B0B0" strokeWidth="3"/>
      {/* Fridge door divider */}
      <line x1="218" y1="532" x2="386" y2="532" stroke="#A0A0A0" strokeWidth="3"/>
      {/* Top fridge section (main) */}
      <rect x="222" y="356" width="160" height="172" rx="4" fill="#DCDCDC"/>
      {/* Fridge handle top */}
      <rect x="370" y="380" width="10" height="60" rx="5" fill="#909090" stroke="#808080" strokeWidth="1"/>
      {/* Fridge handle bottom (freezer) */}
      <rect x="370" y="548" width="10" height="50" rx="5" fill="#909090" stroke="#808080" strokeWidth="1"/>
      {/* Freezer section */}
      <rect x="222" y="536" width="160" height="302" rx="4" fill="#D0D0D0"/>
      {/* Fridge interior shelves (top section, door ajar illusion) */}
      <line x1="222" y1="420" x2="382" y2="420" stroke="#C0C0C0" strokeWidth="1.5" opacity="0.60"/>
      <line x1="222" y1="460" x2="382" y2="460" stroke="#C0C0C0" strokeWidth="1.5" opacity="0.60"/>
      <line x1="222" y1="500" x2="382" y2="500" stroke="#C0C0C0" strokeWidth="1.5" opacity="0.60"/>
      {/* Fridge items visible through door */}
      <rect x="228" y="426" width="24" height="30" rx="4" fill="#A8C840" opacity="0.60"/>
      <rect x="258" y="422" width="18" height="34" rx="3" fill="#D84040" opacity="0.55"/>
      <rect x="282" y="424" width="20" height="32" rx="3" fill="#F0A830" opacity="0.58"/>
      <rect x="308" y="426" width="16" height="30" rx="3" fill="#4888D8" opacity="0.55"/>
      {/* Freezer items */}
      <rect x="228" y="550" width="60" height="40" rx="3" fill="#C8E8F8" opacity="0.50"/>
      <rect x="296" y="550" width="60" height="40" rx="3" fill="#A8D8F8" opacity="0.48"/>
      {/* Brand label area on fridge */}
      <rect x="240" y="360" width="90" height="18" rx="3" fill="#E0E0E0"/>
      <text x="285" y="373" textAnchor="middle" fill="#888" fontSize="9"
        fontFamily="Arial,sans-serif" fontWeight="bold" letterSpacing="2">FROSTPRO</text>

      {/* ── COUNTER (lower, base cabinets) ── */}
      <rect x="0" y="372" width="210" height="100" fill="#5A3C18" opacity="0.90"/>
      <rect x="5" y="376" width="200" height="92" fill="#4A3010" opacity="0.88"/>
      {/* Counter items */}
      {/* Knife block */}
      <rect x="170" y="340" width="34" height="38" rx="4" fill="#3A2810" opacity="0.90"/>
      {[177,183,189,195].map((x,i) => (
        <rect key={i} x={x} y={336} width="3" height={[28,32,26,30][i]} rx="1" fill="#888" opacity="0.80"/>
      ))}
      {/* Cutting board */}
      <rect x="10" y="338" width="80" height="18" rx="4" fill="#9B7A40" opacity="0.90"/>
      {/* Bowl with vegetables */}
      <path d="M 110 354 Q 110 338 135 335 Q 160 338 160 354 L 156 366 L 114 366Z" fill="#D4C090" opacity="0.88"/>
      <ellipse cx="135" cy="354" rx="25" ry="9" fill="#E0CC9A" opacity="0.85"/>
      <ellipse cx="125" cy="350" rx="8" ry="6" fill="#E03030" opacity="0.78"/>
      <ellipse cx="138" cy="349" rx="7" ry="5" fill="#3A8818" opacity="0.75"/>
      <ellipse cx="150" cy="350" rx="7" ry="6" fill="#FF8C00" opacity="0.78"/>

      {/* ── FLOOR TILES ── */}
      <rect x="0" y="620" width="390" height="224" fill="#E8D8B8" opacity="0.55"/>
      {/* Floor grid */}
      {[640,680,720,760,800,840].map((y,i) => (
        <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#C4B490" strokeWidth="1.5"/>
      ))}
      {[0,78,156,234,312,390].map((x,i) => (
        <line key={i} x1={x} y1="620" x2={x} y2="844" stroke="#C4B490" strokeWidth="1.5"/>
      ))}

      {/* ── Base cabinet under stove ── */}
      <rect x="0" y="468" width="210" height="155" fill="#5A3C18" opacity="0.92"/>
      <line x1="0" y1="468" x2="210" y2="468" stroke="#4A3010" strokeWidth="2"/>
      <rect x="5" y="472" width="96" height="145" rx="2" fill="#4A3010" stroke="#3A2410" strokeWidth="1.5"/>
      <circle cx="53" cy="545" r="5" fill="#C8A860" opacity="0.88"/>
      <rect x="108" y="472" width="96" height="145" rx="2" fill="#4A3010" stroke="#3A2410" strokeWidth="1.5"/>
      <circle cx="156" cy="545" r="5" fill="#C8A860" opacity="0.88"/>

      {/* Vignette */}
      <rect width="390" height="844" fill="url(#k-vig)"/>
    </svg>
  );
}
