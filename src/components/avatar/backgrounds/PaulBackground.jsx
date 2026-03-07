// PaulBackground — Bright Sunny Park
import { useEffect, useRef } from 'react';
export default function PaulBackground({ speaking = false }) {
  const sunRef = useRef(null);
  useEffect(() => {
    if (!sunRef.current) return;
    sunRef.current.style.transition = 'opacity 500ms ease';
    sunRef.current.style.opacity = speaking ? '0.72' : '0.55';
  }, [speaking]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="p-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E90FF"/>
          <stop offset="45%" stopColor="#56B4FF"/>
          <stop offset="80%" stopColor="#88CCFF"/>
          <stop offset="100%" stopColor="#B8E4FF"/>
        </linearGradient>
        <linearGradient id="p-grass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50"/>
          <stop offset="100%" stopColor="#2E7D32"/>
        </linearGradient>
        <linearGradient id="p-path" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4B896"/>
          <stop offset="100%" stopColor="#B89870"/>
        </linearGradient>
        <radialGradient id="p-sun" cx="72%" cy="12%" r="25%">
          <stop offset="0%" stopColor="#FFEE58" stopOpacity="1.00"/>
          <stop offset="40%" stopColor="#FFD600" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#FFD600" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="p-sunhalo" cx="72%" cy="12%" r="45%">
          <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#FFF9C4" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="p-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#FFF9C4" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="p-vig" cx="50%" cy="50%" r="72%">
          <stop offset="45%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#0A2010" stopOpacity="0.38"/>
        </radialGradient>
        <filter id="p-blur"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="p-blur2"><feGaussianBlur stdDeviation="10"/></filter>
        <filter id="p-sh"><feDropShadow dx="3" dy="4" stdDeviation="6" floodColor="#1A3010" floodOpacity="0.35"/></filter>
        <filter id="p-glow2"><feGaussianBlur stdDeviation="8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* ── Bright blue sky ── */}
      <rect width="390" height="844" fill="url(#p-sky)"/>

      {/* ── Sun halo glow ── */}
      <rect width="390" height="844" fill="url(#p-sunhalo)"/>
      <g ref={sunRef} opacity="0.55">
        <rect width="390" height="844" fill="url(#p-sun)"/>
      </g>

      {/* ── SUN ── */}
      <circle cx="310" cy="68" r="46" fill="#FFEE58" opacity="0.95" filter="url(#p-glow2)"/>
      <circle cx="310" cy="68" r="36" fill="#FFEE58" opacity="1.00"/>
      <circle cx="310" cy="68" r="26" fill="#FFF9C4" opacity="0.90"/>
      {/* Sun rays */}
      {[0,22,45,67,90,112,135,157,180,202,225,247,270,292,315,337].map((a,i) => {
        const r=a*Math.PI/180;
        const r1=52, r2=72+i%3*8;
        return <line key={i}
          x1={Math.round(310+r1*Math.sin(r))} y1={Math.round(68-r1*Math.cos(r))}
          x2={Math.round(310+r2*Math.sin(r))} y2={Math.round(68-r2*Math.cos(r))}
          stroke="#FFD600" strokeWidth={i%2===0?3:2} opacity="0.65"/>;
      })}

      {/* ── CLOUDS ── */}
      {/* Cloud 1 large left */}
      <ellipse cx="60" cy="85" rx="55" ry="28" fill="white" opacity="0.92"/>
      <ellipse cx="30" cy="98" rx="38" ry="22" fill="white" opacity="0.88"/>
      <ellipse cx="90" cy="96" rx="42" ry="24" fill="white" opacity="0.88"/>
      <ellipse cx="62" cy="105" rx="48" ry="20" fill="white" opacity="0.85"/>
      {/* Cloud 2 right */}
      <ellipse cx="185" cy="52" rx="40" ry="20" fill="white" opacity="0.90"/>
      <ellipse cx="162" cy="62" rx="30" ry="18" fill="white" opacity="0.85"/>
      <ellipse cx="208" cy="60" rx="34" ry="18" fill="white" opacity="0.88"/>
      {/* Cloud 3 small far right */}
      <ellipse cx="355" cy="130" rx="30" ry="16" fill="white" opacity="0.80"/>
      <ellipse cx="338" cy="140" rx="22" ry="14" fill="white" opacity="0.75"/>
      <ellipse cx="372" cy="138" rx="24" ry="14" fill="white" opacity="0.78"/>

      {/* ── FAR BACKGROUND TREES (tree line) ── */}
      {[0,30,60,90,120,155,190,220,250,280,310,340,365].map((x,i) => {
        const h=[120,100,140,110,130,95,125,105,135,115,120,100,90][i];
        const g=['#2E7D32','#388E3C','#1B5E20','#33691E','#2E7D32','#388E3C','#1B5E20'][i%7];
        return (
          <g key={i}>
            <rect x={x+8} y={330-h} width={8} height={h*0.4} fill="#5D4037" opacity="0.70"/>
            <ellipse cx={x+12} cy={330-h} rx={22} ry={h*0.55}
              fill={g} opacity="0.82"/>
          </g>
        );
      })}

      {/* ── MID-GROUND GRASS ── */}
      <rect x="0" y="390" width="390" height="454" fill="url(#p-grass)"/>
      {/* Grass horizon line */}
      <path d="M 0 392 Q 98 382 195 390 Q 292 398 390 388 L 390 844 L 0 844Z" fill="#43A047"/>

      {/* ── PARK PATH (centre, perspective) ── */}
      <path d="M 148 844 Q 168 700 180 600 Q 186 540 190 470 Q 192 430 195 400"
        fill="none" stroke="#D4B896" strokeWidth="50" opacity="0.70"/>
      <path d="M 242 844 Q 222 700 210 600 Q 204 540 200 470 Q 198 430 195 400"
        fill="none" stroke="#D4B896" strokeWidth="50" opacity="0.70"/>
      {/* Path fill between */}
      <path d="M 148 844 Q 168 700 180 600 Q 186 540 190 470 Q 192 430 195 400
               Q 198 430 200 470 Q 204 540 210 600 Q 222 700 242 844Z"
        fill="url(#p-path)" opacity="0.82"/>
      {/* Path edge lines */}
      <path d="M 150 844 Q 170 700 182 600 Q 188 538 192 468" fill="none"
        stroke="#C4A880" strokeWidth="2" opacity="0.50" strokeDasharray="8,6"/>
      <path d="M 240 844 Q 220 700 208 600 Q 202 538 198 468" fill="none"
        stroke="#C4A880" strokeWidth="2" opacity="0.50" strokeDasharray="8,6"/>

      {/* ── PARK BENCH (left of path) ── */}
      {/* Bench shadow */}
      <ellipse cx="90" cy="660" rx="60" ry="12" fill="#1A3010" opacity="0.22" filter="url(#p-blur)"/>
      {/* Bench seat */}
      <rect x="38" y="608" width="100" height="10" rx="3" fill="#8B6040" filter="url(#p-sh)"/>
      <rect x="38" y="618" width="100" height="8" rx="2" fill="#7A5030"/>
      {/* Bench back */}
      <rect x="38" y="580" width="100" height="8" rx="3" fill="#8B6040"/>
      <rect x="38" y="591" width="100" height="8" rx="3" fill="#7A5030" opacity="0.85"/>
      {/* Back vertical supports */}
      <rect x="50" y="580" width="7" height="38" rx="2" fill="#6A4020"/>
      <rect x="121" y="580" width="7" height="38" rx="2" fill="#6A4020"/>
      {/* Bench legs */}
      <rect x="46" y="624" width="8" height="30" rx="2" fill="#6A4020"/>
      <rect x="124" y="624" width="8" height="30" rx="2" fill="#6A4020"/>
      <rect x="48" y="650" width="42" height="6" rx="2" fill="#5A3810"/>
      <rect x="90" y="650" width="42" height="6" rx="2" fill="#5A3810"/>

      {/* ── PARK BENCH (right of path) ── */}
      <ellipse cx="305" cy="640" rx="58" ry="11" fill="#1A3010" opacity="0.20" filter="url(#p-blur)"/>
      <rect x="256" y="590" width="96" height="10" rx="3" fill="#8B6040" filter="url(#p-sh)"/>
      <rect x="256" y="600" width="96" height="8" rx="2" fill="#7A5030"/>
      <rect x="256" y="564" width="96" height="8" rx="3" fill="#8B6040"/>
      <rect x="256" y="574" width="96" height="8" rx="3" fill="#7A5030" opacity="0.85"/>
      <rect x="268" y="564" width="7" height="36" rx="2" fill="#6A4020"/>
      <rect x="337" y="564" width="7" height="36" rx="2" fill="#6A4020"/>
      <rect x="264" y="606" width="8" height="28" rx="2" fill="#6A4020"/>
      <rect x="336" y="606" width="8" height="28" rx="2" fill="#6A4020"/>
      <rect x="266" y="630" width="40" height="6" rx="2" fill="#5A3810"/>
      <rect x="306" y="630" width="40" height="6" rx="2" fill="#5A3810"/>

      {/* ── BIG OAK TREE (left) ── */}
      <rect x="10" y="400" width="18" height="320" rx="5" fill="#5D4037" filter="url(#p-sh)"/>
      {/* Branches */}
      <path d="M 19 440 Q 0 400 -10 370" fill="none" stroke="#5D4037" strokeWidth="10" strokeLinecap="round"/>
      <path d="M 19 460 Q 55 420 65 390" fill="none" stroke="#5D4037" strokeWidth="8" strokeLinecap="round"/>
      <path d="M 19 420 Q 10 380 15 350" fill="none" stroke="#5D4037" strokeWidth="9" strokeLinecap="round"/>
      {/* Big canopy */}
      <ellipse cx="19" cy="340" rx="72" ry="90" fill="#2E7D32" opacity="0.92" filter="url(#p-sh)"/>
      <ellipse cx="-10" cy="368" rx="52" ry="62" fill="#388E3C" opacity="0.85"/>
      <ellipse cx="58" cy="360" rx="50" ry="60" fill="#2E7D32" opacity="0.88"/>
      <ellipse cx="22" cy="305" rx="58" ry="68" fill="#43A047" opacity="0.82"/>
      <ellipse cx="-5" cy="325" rx="40" ry="48" fill="#4CAF50" opacity="0.60"/>
      <ellipse cx="48" cy="318" rx="38" ry="46" fill="#4CAF50" opacity="0.58"/>
      {/* Light dapple on tree */}
      <ellipse cx="30" cy="320" rx="18" ry="22" fill="#A5D6A7" opacity="0.25"/>

      {/* ── TALL TREE (right) ── */}
      <rect x="362" y="420" width="16" height="300" rx="4" fill="#5D4037" filter="url(#p-sh)"/>
      <path d="M 370 460 Q 388 418 395 390" fill="none" stroke="#5D4037" strokeWidth="9" strokeLinecap="round"/>
      <path d="M 370 480 Q 345 440 340 408" fill="none" stroke="#5D4037" strokeWidth="7" strokeLinecap="round"/>
      <ellipse cx="370" cy="360" rx="68" ry="85" fill="#1B5E20" opacity="0.90" filter="url(#p-sh)"/>
      <ellipse cx="398" cy="385" rx="48" ry="58" fill="#2E7D32" opacity="0.85"/>
      <ellipse cx="342" cy="378" rx="46" ry="56" fill="#1B5E20" opacity="0.88"/>
      <ellipse cx="370" cy="328" rx="52" ry="62" fill="#388E3C" opacity="0.80"/>
      <ellipse cx="395" cy="342" rx="36" ry="44" fill="#43A047" opacity="0.58"/>

      {/* ── LAMP POST (left of path) ── */}
      <rect x="140" y="440" width="8" height="260" rx="2" fill="#555" filter="url(#p-sh)"/>
      <path d="M 144 440 Q 160 436 165 448 L 162 460 L 144 458Z" fill="#555"/>
      <ellipse cx="165" cy="450" rx="10" ry="6" fill="#FFEE58" opacity="0.85" filter="url(#p-blur)"/>
      {/* Lamp base */}
      <rect x="136" y="694" width="16" height="8" rx="3" fill="#444"/>
      <ellipse cx="144" cy="695" rx="20" ry="6" fill="#333" opacity="0.60"/>

      {/* ── FLOWERS in grass ── */}
      {[{x:55,y:620},{x:80,y:680},{x:310,y:610},{x:340,y:672},{x:25,y:740},{x:365,y:730},{x:115,y:760},{x:278,y:750}].map(({x,y},i) => {
        const colors=['#FF5252','#FFD600','#E040FB','#FF9800','#40C4FF','#FF5252','#FFD600','#E040FB'][i];
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y+14} stroke="#388E3C" strokeWidth="2"/>
            <circle cx={x} cy={y} r="6" fill={colors} opacity="0.90"/>
            <circle cx={x} cy={y} r="3" fill="#FFF9C4" opacity="0.85"/>
          </g>
        );
      })}

      {/* ── GRASS TEXTURE (foreground blades) ── */}
      {[580,620,660,700,740,780,820].map((y,i) => (
        <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#388E3C" strokeWidth="1" opacity="0.10"/>
      ))}

      {/* ── DISTANT BUILDINGS (right skyline) ── */}
      <rect x="338" y="296" width="28" height="96" fill="#4A90C8" opacity="0.30"/>
      <rect x="358" y="280" width="32" height="112" fill="#3A80B8" opacity="0.25"/>

      {/* ── Birds ── */}
      {[[60,155],[75,148],[88,155],[120,138],[134,132],[147,138]].map(([x,y],i) => (
        <path key={i} d={`M ${x-5} ${y} Q ${x} ${y-5} ${x+5} ${y}`}
          fill="none" stroke="#1A3080" strokeWidth="1.8" opacity="0.45">
          <animateTransform attributeName="transform" type="translate"
            values="0,0; -6,-3" dur={`${10+i*1.2}s`} repeatCount="indefinite" additive="sum"/>
        </path>
      ))}

      {/* ── Vignette ── */}
      <rect width="390" height="844" fill="url(#p-vig)"/>
    </svg>
  );
}
