// DavidBackground — Premium Gym Interior v4
import { useEffect, useRef } from 'react';
export default function DavidBackground({ speaking = false }) {
  const lightRef = useRef(null);
  useEffect(() => {
    if (!lightRef.current) return;
    lightRef.current.style.transition = 'opacity 400ms ease';
    lightRef.current.style.opacity = speaking ? '0.60' : '0.38';
  }, [speaking]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="g-wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A2E3A"/>
          <stop offset="100%" stopColor="#1E2230"/>
        </linearGradient>
        <linearGradient id="g-mirror" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2E3850"/>
          <stop offset="40%" stopColor="#3A4C68"/>
          <stop offset="70%" stopColor="#344460"/>
          <stop offset="100%" stopColor="#2A3850"/>
        </linearGradient>
        <linearGradient id="g-floor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2C2018"/>
          <stop offset="100%" stopColor="#1C1410"/>
        </linearGradient>
        <linearGradient id="g-rack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A4A4A"/>
          <stop offset="100%" stopColor="#2A2A2A"/>
        </linearGradient>
        <linearGradient id="g-bench" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A1A2E"/>
          <stop offset="100%" stopColor="#12121E"/>
        </linearGradient>
        <radialGradient id="g-light1" cx="18%" cy="0%" r="58%">
          <stop offset="0%" stopColor="#E8F0FF" stopOpacity="0.62"/>
          <stop offset="100%" stopColor="#1E2230" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-light2" cx="50%" cy="0%" r="58%">
          <stop offset="0%" stopColor="#F0F4FF" stopOpacity="0.72"/>
          <stop offset="100%" stopColor="#1E2230" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-light3" cx="82%" cy="0%" r="58%">
          <stop offset="0%" stopColor="#E8F0FF" stopOpacity="0.58"/>
          <stop offset="100%" stopColor="#1E2230" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-vig" cx="50%" cy="50%" r="70%">
          <stop offset="40%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#080810" stopOpacity="0.72"/>
        </radialGradient>
        <filter id="g-glow"><feGaussianBlur stdDeviation="7" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="g-soft"><feGaussianBlur stdDeviation="3"/></filter>
        <filter id="g-sh"><feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.45"/></filter>
        <filter id="g-sh2"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.55"/></filter>
      </defs>

      {/* ══════════════════════════════════════
          BACK WALL + MIRROR
      ══════════════════════════════════════ */}
      <rect width="390" height="844" fill="url(#g-wall)"/>

      {/* Ceiling - darker */}
      <rect width="390" height="62" fill="#181C28"/>
      <rect x="0" y="59" width="390" height="4" fill="#0E1018"/>

      {/* Full mirror wall - back wall */}
      <rect x="0" y="62" width="390" height="360" fill="url(#g-mirror)"/>
      {/* Mirror subtle reflection shimmer */}
      <rect x="0" y="62" width="390" height="360" fill="white" opacity="0.025"/>
      {/* Mirror vertical frame lines (like large gym mirror panels) */}
      <line x1="130" y1="62" x2="130" y2="422" stroke="#1A2238" strokeWidth="3"/>
      <line x1="260" y1="62" x2="260" y2="422" stroke="#1A2238" strokeWidth="3"/>
      {/* Mirror top frame */}
      <rect x="0" y="62" width="390" height="5" fill="#1A2238"/>
      {/* Mirror bottom frame */}
      <rect x="0" y="417" width="390" height="6" fill="#1A2238"/>
      {/* Mirror edge highlights (glass reflection feel) */}
      <line x1="2" y1="66" x2="2" y2="418" stroke="white" strokeWidth="1.5" opacity="0.07"/>
      <line x1="132" y1="66" x2="132" y2="418" stroke="white" strokeWidth="1" opacity="0.05"/>
      <line x1="262" y1="66" x2="262" y2="418" stroke="white" strokeWidth="1" opacity="0.05"/>

      {/* Reflected equipment silhouettes in mirror (subtle) */}
      {/* Reflected barbell rack */}
      <rect x="22" y="200" width="80" height="110" rx="2" fill="#1E2840" opacity="0.35"/>
      {/* Reflected squat rack */}
      <rect x="290" y="170" width="80" height="140" rx="2" fill="#1E2840" opacity="0.30"/>
      {/* Reflected bench */}
      <rect x="130" y="300" width="130" height="55" rx="2" fill="#1E2840" opacity="0.28"/>

      {/* ══════════════════════════════════════
          CEILING TRACK + LED LIGHTS
      ══════════════════════════════════════ */}
      {/* Track rail */}
      <rect x="0" y="28" width="390" height="8" rx="3" fill="#28303E"/>
      {/* 5 LED light fixtures on track */}
      {[30, 110, 195, 280, 360].map((cx, i) => (
        <g key={i}>
          <rect x={cx-14} y="36" width="28" height="22" rx="4" fill="#1E2638"/>
          <rect x={cx-11} y="39" width="22" height="14" rx="3" fill="#F0F8FF" opacity="0.90"/>
          {/* LED strip glow */}
          <rect x={cx-10} y="40" width="20" height="4" rx="2" fill="white" opacity="0.70" filter="url(#g-soft)"/>
        </g>
      ))}
      {/* Light cones */}
      <g ref={lightRef} opacity="0.38">
        <rect width="390" height="844" fill="url(#g-light1)"/>
        <rect width="390" height="844" fill="url(#g-light2)"/>
        <rect width="390" height="844" fill="url(#g-light3)"/>
      </g>

      {/* ══════════════════════════════════════
          MOTIVATIONAL WALL BANNER
      ══════════════════════════════════════ */}
      <rect x="88" y="78" width="214" height="44" rx="5" fill="#0A0E1A" stroke="#E53935" strokeWidth="2" opacity="0.95"/>
      <text x="195" y="97" textAnchor="middle" fill="#FF1744" fontSize="11"
        fontFamily="Arial Black,sans-serif" fontWeight="900" letterSpacing="4" opacity="0.90">TRAIN HARD</text>
      <text x="195" y="114" textAnchor="middle" fill="#FF6D00" fontSize="10"
        fontFamily="Arial Black,sans-serif" fontWeight="900" letterSpacing="2" opacity="0.80">GET RESULTS</text>

      {/* ══════════════════════════════════════
          LEFT SIDE WALL — CABLE MACHINE
      ══════════════════════════════════════ */}
      {/* Machine body */}
      <rect x="0" y="62" width="88" height="420" rx="4" fill="#222830" stroke="#2E3640" strokeWidth="2"/>
      {/* Weight stack */}
      <rect x="6" y="80" width="32" height="180" rx="3" fill="#1A1E28"/>
      {[80,100,120,140,160,180,200,220,240].map((y,i) => (
        <rect key={i} x="8" y={y} width="28" height="18" rx="2"
          fill={i < 5 ? "#2E3848" : "#1A1E28"} stroke="#3A4858" strokeWidth="1"/>
      ))}
      {/* Weight stack pin */}
      <rect x="18" y="196" width="8" height="3" rx="1" fill="#E53935" opacity="0.90"/>
      {/* Pulley top */}
      <circle cx="55" cy="90" r="14" fill="#2A3040" stroke="#3A4050" strokeWidth="2"/>
      <circle cx="55" cy="90" r="8" fill="#1E2838"/>
      <circle cx="55" cy="90" r="4" fill="#3A4858"/>
      {/* Cable */}
      <line x1="55" y1="104" x2="55" y2="310" stroke="#8A9AB0" strokeWidth="2" opacity="0.70"/>
      {/* Handle attachment */}
      <rect x="44" y="308" width="22" height="8" rx="4" fill="#5A6A80"/>
      <ellipse cx="55" cy="316" rx="8" ry="4" fill="#6A7A90"/>
      {/* Machine frame details */}
      <rect x="6" y="280" width="76" height="6" rx="2" fill="#2E3640"/>
      <rect x="6" y="360" width="76" height="6" rx="2" fill="#2E3640"/>
      {/* Footplate */}
      <rect x="2" y="478" width="84" height="8" rx="3" fill="#1A1E28" stroke="#2E3640" strokeWidth="1"/>

      {/* ══════════════════════════════════════
          RIGHT SIDE WALL — SQUAT RACK / POWER CAGE
      ══════════════════════════════════════ */}
      {/* Cage outer frame */}
      <rect x="302" y="62" width="88" height="440" rx="4" fill="#222830" stroke="#2E3640" strokeWidth="2"/>
      {/* Left upright */}
      <rect x="308" y="68" width="16" height="420" rx="3" fill="url(#g-rack)"/>
      {/* Right upright */}
      <rect x="366" y="68" width="16" height="420" rx="3" fill="url(#g-rack)"/>
      {/* Top crossbar */}
      <rect x="308" y="68" width="74" height="14" rx="3" fill="#3A3A3A"/>
      {/* Safety bars */}
      <rect x="306" y="240" width="78" height="10" rx="3" fill="#E53935" opacity="0.85"/>
      <rect x="306" y="300" width="78" height="10" rx="3" fill="#E53935" opacity="0.65"/>
      {/* J-hooks (barbell rests) */}
      <rect x="308" y="185" width="20" height="12" rx="2" fill="#FF6D00" opacity="0.90"/>
      <rect x="362" y="185" width="20" height="12" rx="2" fill="#FF6D00" opacity="0.90"/>
      {/* Barbell on J-hooks */}
      <rect x="308" y="178" width="74" height="9" rx="3" fill="#9E9E9E"/>
      <rect x="306" y="178" width="9" height="9" rx="2" fill="#757575"/>
      <rect x="375" y="178" width="9" height="9" rx="2" fill="#757575"/>
      {/* Weight plates on rack barbell */}
      <ellipse cx="316" cy="183" rx="5" ry="22" fill="#E53935" opacity="0.88"/>
      <ellipse cx="323" cy="183" rx="4" ry="19" fill="#B71C1C" opacity="0.85"/>
      <ellipse cx="373" cy="183" rx="5" ry="22" fill="#E53935" opacity="0.88"/>
      <ellipse cx="367" cy="183" rx="4" ry="19" fill="#B71C1C" opacity="0.85"/>
      {/* Pull-up bar (top) */}
      <rect x="310" y="76" width="70" height="7" rx="3" fill="#5A5A5A"/>
      {/* Weight plates stored on cage posts */}
      <ellipse cx="318" cy="420" rx="7" ry="28" fill="#1565C0" opacity="0.82"/>
      <ellipse cx="327" cy="420" rx="6" ry="24" fill="#0D47A1" opacity="0.80"/>
      <ellipse cx="373" cy="420" rx="7" ry="28" fill="#E53935" opacity="0.82"/>
      <ellipse cx="364" cy="420" rx="6" ry="24" fill="#B71C1C" opacity="0.80"/>

      {/* ══════════════════════════════════════
          DUMBBELL RACK — centre-left background
      ══════════════════════════════════════ */}
      {/* Rack structure - A-frame style */}
      <rect x="90" y="375" width="200" height="120" rx="4" fill="#1A1E28" stroke="#2E3640" strokeWidth="2" filter="url(#g-sh2)"/>
      {/* 3 angled shelves */}
      <path d="M 94 390 L 286 390" stroke="#2E3640" strokeWidth="5" strokeLinecap="round"/>
      <path d="M 94 430 L 286 430" stroke="#2E3640" strokeWidth="5" strokeLinecap="round"/>
      <path d="M 94 468 L 286 468" stroke="#2E3640" strokeWidth="5" strokeLinecap="round"/>

      {/* TOP ROW — light dumbbells (small, colourful) */}
      {[
        {cx:108, w:8,  c1:'#EF5350', c2:'#B71C1C'},
        {cx:128, w:8,  c1:'#EF5350', c2:'#B71C1C'},
        {cx:152, w:9,  c1:'#FF9800', c2:'#E65100'},
        {cx:174, w:9,  c1:'#FF9800', c2:'#E65100'},
        {cx:198, w:10, c1:'#FDD835', c2:'#F57F17'},
        {cx:222, w:10, c1:'#FDD835', c2:'#F57F17'},
        {cx:247, w:11, c1:'#66BB6A', c2:'#1B5E20'},
        {cx:272, w:11, c1:'#66BB6A', c2:'#1B5E20'},
      ].map(({cx,w,c1,c2},i) => (
        <g key={i}>
          <ellipse cx={cx}   cy={384} rx={w}   ry={w*0.62} fill={c1} opacity="0.92"/>
          <rect    x={cx+w-2} y={384-w*0.35} width="10" height={w*0.7} rx="2" fill="#1A1E28"/>
          <ellipse cx={cx+w+8} cy={384} rx={w} ry={w*0.62} fill={c1} opacity="0.92"/>
          <line x1={cx} y1={384} x2={cx+w+8+w} y2={384} stroke={c2} strokeWidth="1" opacity="0.40"/>
        </g>
      ))}

      {/* MIDDLE ROW — medium dumbbells */}
      {[
        {cx:100, w:13, c1:'#42A5F5', c2:'#0D47A1'},
        {cx:130, w:13, c1:'#42A5F5', c2:'#0D47A1'},
        {cx:162, w:14, c1:'#AB47BC', c2:'#4A148C'},
        {cx:196, w:14, c1:'#AB47BC', c2:'#4A148C'},
        {cx:230, w:15, c1:'#26C6DA', c2:'#006064'},
        {cx:266, w:15, c1:'#26C6DA', c2:'#006064'},
      ].map(({cx,w,c1,c2},i) => (
        <g key={i}>
          <ellipse cx={cx}     cy={424} rx={w}   ry={w*0.60} fill={c1} opacity="0.90"/>
          <rect    x={cx+w-2}  y={424-w*0.33} width="11" height={w*0.66} rx="2" fill="#1A1E28"/>
          <ellipse cx={cx+w+9} cy={424} rx={w}   ry={w*0.60} fill={c1} opacity="0.90"/>
        </g>
      ))}

      {/* BOTTOM ROW — heavy dumbbells (dark iron) */}
      {[
        {cx:100, w:16, c1:'#455A64', c2:'#263238'},
        {cx:138, w:17, c1:'#37474F', c2:'#212121'},
        {cx:180, w:18, c1:'#424242', c2:'#212121'},
        {cx:224, w:19, c1:'#37474F', c2:'#1A1A1A'},
        {cx:270, w:20, c1:'#2E2E2E', c2:'#1A1A1A'},
      ].map(({cx,w,c1,c2},i) => (
        <g key={i}>
          <ellipse cx={cx}     cy={462} rx={w}   ry={w*0.58} fill={c1} opacity="0.88"/>
          <rect    x={cx+w-2}  y={462-w*0.31} width="12" height={w*0.62} rx="2" fill="#0E1018"/>
          <ellipse cx={cx+w+10} cy={462} rx={w}  ry={w*0.58} fill={c1} opacity="0.88"/>
          <line x1={cx} y1={462} x2={cx+w+10+w} y2={462} stroke={c2} strokeWidth="1.5" opacity="0.55"/>
        </g>
      ))}

      {/* ══════════════════════════════════════
          BENCH PRESS — centre foreground
      ══════════════════════════════════════ */}
      {/* Bench shadow */}
      <ellipse cx="195" cy="636" rx="110" ry="16" fill="black" opacity="0.35" filter="url(#g-soft)"/>

      {/* Bench uprights / rack */}
      <rect x="146" y="510" width="14" height="110" rx="3" fill="url(#g-rack)" filter="url(#g-sh)"/>
      <rect x="230" y="510" width="14" height="110" rx="3" fill="url(#g-rack)" filter="url(#g-sh)"/>
      {/* J-hook rests */}
      <rect x="143" y="510" width="20" height="10" rx="3" fill="#FF6D00" opacity="0.85"/>
      <rect x="227" y="510" width="20" height="10" rx="3" fill="#FF6D00" opacity="0.85"/>
      {/* Safety spotters */}
      <rect x="143" y="545" width="20" height="7" rx="2" fill="#E53935" opacity="0.65"/>
      <rect x="227" y="545" width="20" height="7" rx="2" fill="#E53935" opacity="0.65"/>
      {/* Crossbar on uprights */}
      <rect x="148" y="507" width="94" height="7" rx="2" fill="#3A3A3A"/>

      {/* Bench pad */}
      <rect x="118" y="565" width="154" height="28" rx="8" fill="#1A1A2E" filter="url(#g-sh)"/>
      <rect x="121" y="567" width="148" height="24" rx="7" fill="#222236"/>
      {/* Pad stitching line */}
      <line x1="195" y1="567" x2="195" y2="591" stroke="#2A2A48" strokeWidth="1.5" opacity="0.60"/>
      <line x1="121" y1="579" x2="269" y2="579" stroke="#2A2A48" strokeWidth="1" opacity="0.50"/>

      {/* Bench legs */}
      <rect x="126" y="592" width="14" height="38" rx="3" fill="#2A2A3A"/>
      <rect x="250" y="592" width="14" height="38" rx="3" fill="#2A2A3A"/>
      {/* Crossbar between legs */}
      <rect x="130" y="620" width="130" height="6" rx="2" fill="#222230"/>

      {/* BARBELL on bench rack */}
      <rect x="92" y="504" width="206" height="10" rx="4" fill="#9E9E9E" filter="url(#g-sh)"/>
      <rect x="91" y="504" width="10" height="10" rx="2" fill="#757575"/>
      <rect x="299" y="504" width="10" height="10" rx="2" fill="#757575"/>
      {/* Red weight plates on bench barbell */}
      <ellipse cx="104" cy="509" rx="6"  ry="26" fill="#E53935" opacity="0.90"/>
      <ellipse cx="113" cy="509" rx="5"  ry="22" fill="#B71C1C" opacity="0.85"/>
      <ellipse cx="121" cy="509" rx="4"  ry="18" fill="#E53935" opacity="0.80"/>
      <ellipse cx="286" cy="509" rx="6"  ry="26" fill="#E53935" opacity="0.90"/>
      <ellipse cx="277" cy="509" rx="5"  ry="22" fill="#B71C1C" opacity="0.85"/>
      <ellipse cx="269" cy="509" rx="4"  ry="18" fill="#E53935" opacity="0.80"/>
      {/* Collar clips */}
      <rect x="126" y="502" width="6" height="14" rx="2" fill="#FFCA28" opacity="0.85"/>
      <rect x="258" y="502" width="6" height="14" rx="2" fill="#FFCA28" opacity="0.85"/>

      {/* ══════════════════════════════════════
          RUBBER FLOOR
      ══════════════════════════════════════ */}
      <rect x="0" y="635" width="390" height="209" fill="url(#g-floor)"/>
      {/* Coloured stripe zones */}
      <rect x="0" y="633" width="390" height="6" fill="#E53935" opacity="0.75"/>
      <rect x="0" y="639" width="390" height="4" fill="#FF6D00" opacity="0.50"/>
      <rect x="0" y="643" width="390" height="3" fill="#FDD835" opacity="0.35"/>
      {/* Floor rubber texture lines */}
      {[660,685,710,735,760,785,810,835].map((y,i) => (
        <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#251810" strokeWidth="1.5"/>
      ))}
      {[65,130,195,260,325].map((x,i) => (
        <line key={i} x1={x} y1="645" x2={x} y2="844" stroke="#251810" strokeWidth="1.5"/>
      ))}
      {/* Floor logo */}
      <text x="195" y="760" textAnchor="middle" fill="#E53935" fontSize="22"
        fontFamily="Arial Black,sans-serif" fontWeight="900" letterSpacing="5" opacity="0.08">IRON GYM</text>

      {/* ══════════════════════════════════════
          SIDE WALLS — equipment fills
      ══════════════════════════════════════ */}
      {/* Treadmill far right background */}
      <rect x="302" y="488" width="88" height="150" rx="3" fill="#1A1E28" opacity="0.70"/>
      <rect x="308" y="496" width="76" height="80" rx="3" fill="#1E2438" opacity="0.88"/>
      {/* Treadmill belt */}
      <rect x="310" y="560" width="72" height="20" rx="3" fill="#111118" stroke="#2E3040" strokeWidth="1.5"/>
      <line x1="310" y1="570" x2="382" y2="570" stroke="#1A1A22" strokeWidth="2"/>
      {/* Treadmill display */}
      <rect x="330" y="498" width="36" height="22" rx="3" fill="#001A0A"/>
      <rect x="332" y="500" width="32" height="18" rx="2" fill="#002810"/>
      <text x="348" y="512" textAnchor="middle" fill="#00FF60" fontSize="8"
        fontFamily="Arial,sans-serif" fontWeight="bold" opacity="0.75">5.8km/h</text>
      {/* Treadmill handlebars */}
      <rect x="312" y="496" width="6" height="50" rx="2" fill="#3A3A3A"/>
      <rect x="376" y="496" width="6" height="50" rx="2" fill="#3A3A3A"/>
      <rect x="310" y="494" width="74" height="6" rx="2" fill="#2A2A2A"/>

      {/* ══════════════════════════════════════
          VIGNETTE + FINAL POLISH
      ══════════════════════════════════════ */}
      <rect width="390" height="844" fill="url(#g-vig)"/>
    </svg>
  );
}
