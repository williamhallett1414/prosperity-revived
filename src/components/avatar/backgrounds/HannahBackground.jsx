// HannahBackground — Premium Warm Coaching Studio
import { useEffect, useRef } from 'react';
export default function HannahBackground({ speaking = false, listening = false }) {
  const glowRef = useRef(null);
  useEffect(() => {
    if (!glowRef.current) return;
    glowRef.current.style.transition = 'opacity 500ms ease';
    glowRef.current.style.opacity = speaking ? '0.65' : listening ? '0.50' : '0.38';
  }, [speaking, listening]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="h-wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8EFE0"/>
          <stop offset="70%" stopColor="#F0E3CC"/>
          <stop offset="100%" stopColor="#E0D0B0"/>
        </linearGradient>
        <linearGradient id="h-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#90C8E8"/>
          <stop offset="55%" stopColor="#DCF0FF"/>
          <stop offset="100%" stopColor="#FFF0A0"/>
        </linearGradient>
        <radialGradient id="h-sun" cx="68%" cy="18%" r="52%">
          <stop offset="0%" stopColor="#FFE680" stopOpacity="0.82"/>
          <stop offset="45%" stopColor="#FFB84D" stopOpacity="0.38"/>
          <stop offset="100%" stopColor="#FFF8E0" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="h-lamp" cx="91%" cy="66%" r="44%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity="0.72"/>
          <stop offset="55%" stopColor="#FF9040" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#FFF0D0" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="h-vig" cx="50%" cy="50%" r="72%">
          <stop offset="48%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#2A1808" stopOpacity="0.20"/>
        </radialGradient>
        <filter id="h-glow"><feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="h-soft"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="h-sh"><feDropShadow dx="2" dy="3" stdDeviation="5" floodColor="#2A1808" floodOpacity="0.18"/></filter>
      </defs>
      <rect width="390" height="844" fill="url(#h-wall)"/>
      <rect x="0" y="0" width="390" height="10" fill="#DDD0B8"/>
      {/* Sky window upper-right */}
      <path d="M 244 10 L 386 10 L 386 358 Q 386 382 315 382 Q 244 382 244 358 L 244 10Z" fill="url(#h-sky)"/>
      {/* Garden silhouettes outside */}
      <ellipse cx="268" cy="372" rx="28" ry="40" fill="#5A8A30" opacity="0.30"/>
      <ellipse cx="310" cy="360" rx="40" ry="50" fill="#4A7820" opacity="0.26"/>
      <ellipse cx="355" cy="368" rx="26" ry="38" fill="#6A9A38" opacity="0.24"/>
      {/* Window frame */}
      <path d="M 244 10 L 244 358 Q 244 386 315 386 Q 386 386 386 358 L 386 10" fill="none" stroke="#C8A870" strokeWidth="5"/>
      <line x1="315" y1="10" x2="315" y2="386" stroke="#C8A870" strokeWidth="3.5"/>
      <line x1="244" y1="168" x2="386" y2="168" stroke="#C8A870" strokeWidth="3"/>
      <line x1="244" y1="276" x2="386" y2="276" stroke="#C8A870" strokeWidth="2.5"/>
      <rect x="234" y="382" width="162" height="16" rx="3" fill="#C8A870"/>
      {/* Window sill pots */}
      <ellipse cx="260" cy="381" rx="10" ry="7" fill="#4A9030" opacity="0.85"/>
      <path d="M 260 381 L 256 393 L 264 393Z" fill="#C84820" opacity="0.72"/>
      <ellipse cx="358" cy="381" rx="9" ry="6" fill="#5A9A38" opacity="0.80"/>
      <path d="M 358 381 L 354 392 L 362 392Z" fill="#C84820" opacity="0.68"/>
      {/* Curtain */}
      <path d="M 228 10 Q 236 72 232 144 Q 228 224 236 304 Q 240 364 232 434 L 250 434 L 250 10Z" fill="#D4A870" opacity="0.68"/>
      {/* Sun rays */}
      <rect width="390" height="844" fill="url(#h-sun)"/>
      {/* Framed botanical art */}
      <rect x="52" y="84" width="150" height="116" rx="7" fill="#EEE4D0" stroke="#A88040" strokeWidth="3.5" filter="url(#h-sh)"/>
      <rect x="62" y="94" width="130" height="96" rx="4" fill="#F8F4EC"/>
      <rect x="65" y="97" width="124" height="90" fill="none" stroke="#D4C0A0" strokeWidth="1.5"/>
      <line x1="127" y1="181" x2="127" y2="150" stroke="#5A8028" strokeWidth="2.5"/>
      <path d="M 127 150 Q 105 128 91 137 Q 78 146 84 163 Q 93 175 109 170 Q 123 163 127 150Z" fill="#6AA838" opacity="0.80"/>
      <path d="M 127 156 Q 148 132 162 141 Q 174 150 168 167 Q 159 177 143 172 Q 131 167 127 156Z" fill="#4A9020" opacity="0.75"/>
      <path d="M 127 168 Q 111 160 98 168 Q 90 179 104 183 Q 117 186 127 178Z" fill="#78B840" opacity="0.70"/>
      {/* Bookshelf right */}
      <rect x="306" y="78" width="84" height="454" rx="5" fill="#7A5430" opacity="0.88" filter="url(#h-sh)"/>
      <rect x="310" y="82" width="76" height="446" rx="3" fill="#5A3C1A"/>
      {[82,194,306,418].map((y,i) => <rect key={i} x="310" y={y} width="76" height="8" rx="2" fill="#3A2810"/>)}
      <g opacity="0.92">
        <rect x="314" y="100" width="10" height="86" rx="2" fill="#D32F2F"/>
        <rect x="326" y="104" width="13" height="82" rx="2" fill="#1565C0"/>
        <rect x="341" y="99" width="9" height="87" rx="2" fill="#F9A825"/>
        <rect x="352" y="106" width="12" height="80" rx="2" fill="#2E7D32"/>
        <rect x="366" y="101" width="8" height="85" rx="2" fill="#6A1B9A" opacity="0.90"/>
        <rect x="376" y="108" width="10" height="78" rx="2" fill="#BF360C"/>
        <ellipse cx="340" cy="93" rx="7" ry="5" fill="#388E3C" opacity="0.88"/>
      </g>
      <g opacity="0.80">
        <rect x="314" y="210" width="13" height="86" rx="2" fill="#00695C"/>
        <rect x="329" y="214" width="9" height="82" rx="2" fill="#C62828"/>
        <rect x="340" y="208" width="14" height="88" rx="2" fill="#1A237E"/>
        <rect x="356" y="212" width="8" height="84" rx="2" fill="#827717"/>
        <rect x="366" y="207" width="10" height="89" rx="2" fill="#880E4F" opacity="0.85"/>
        <rect x="378" y="214" width="9" height="82" rx="2" fill="#37474F"/>
        <rect x="314" y="198" width="6" height="14" fill="#F5E6C8" opacity="0.85"/>
        <ellipse cx="317" cy="197" rx="3" ry="2" fill="#FFB300" opacity="0.80"/>
      </g>
      <g opacity="0.68">
        <rect x="314" y="322" width="14" height="84" rx="2" fill="#0277BD"/>
        <rect x="330" y="326" width="10" height="80" rx="2" fill="#E65100"/>
        <rect x="342" y="320" width="12" height="86" rx="2" fill="#558B2F"/>
        <rect x="356" y="324" width="9" height="82" rx="2" fill="#BF360C" opacity="0.85"/>
        <rect x="367" y="319" width="13" height="87" rx="2" fill="#283593" opacity="0.80"/>
        <rect x="382" y="325" width="9" height="81" rx="2" fill="#6D4C41"/>
      </g>
      {/* Monstera plant left */}
      <path d="M 54 844 Q 50 760 46 680 Q 42 608 50 528 Q 54 466 46 386 Q 40 328 52 268" fill="none" stroke="#3D6B20" strokeWidth="5.5" opacity="0.95"/>
      <path d="M 52 268 Q -10 242 -18 278 Q -24 314 30 334 Q 64 346 76 308 Q 82 282 52 268Z" fill="#4A9828" opacity="0.92"/>
      <path d="M 52 268 Q 18 262 2 280 Q -6 298 18 314" fill="none" stroke="#2D6B10" strokeWidth="2" opacity="0.42"/>
      <path d="M 52 268 Q 28 264 14 274" fill="none" stroke="#1A4808" strokeWidth="2.5" opacity="0.52"/>
      <path d="M 48 282 Q 22 288 8 300" fill="none" stroke="#1A4808" strokeWidth="2.5" opacity="0.52"/>
      <path d="M 49 372 Q -8 350 -14 386 Q -18 422 32 434 Q 66 440 78 412 Q 82 386 49 372Z" fill="#358820" opacity="0.88"/>
      <path d="M 49 372 Q 22 368 6 384" fill="none" stroke="#1A4808" strokeWidth="2" opacity="0.40"/>
      <path d="M 50 480 Q 8 462 2 494 Q -4 524 36 532 Q 62 536 72 506 Q 76 488 50 480Z" fill="#3E9024" opacity="0.82"/>
      <path d="M 51 568 Q 22 555 16 573 Q 12 593 38 599 Q 60 601 64 578 Q 66 562 51 568Z" fill="#307018" opacity="0.78"/>
      <path d="M 30 802 Q 26 816 34 826 Q 42 834 64 834 Q 86 834 92 826 Q 100 816 92 802Z" fill="#C84A1E" opacity="0.92"/>
      <ellipse cx="62" cy="802" rx="30" ry="11" fill="#A03818" opacity="0.92"/>
      <ellipse cx="62" cy="800" rx="26" ry="9" fill="#4A2E10" opacity="0.48"/>
      {/* Sage sofa */}
      <ellipse cx="195" cy="796" rx="168" ry="20" fill="#2A1808" opacity="0.14" filter="url(#h-soft)"/>
      <path d="M 62 790 L 62 692 Q 62 674 80 674 L 318 674 Q 336 674 336 692 L 336 790Z" fill="#7A9870" opacity="0.95"/>
      <path d="M 62 674 L 62 616 Q 62 602 78 602 L 320 602 Q 336 602 336 616 L 336 674Z" fill="#6A8860" opacity="0.92"/>
      <rect x="70" y="606" width="78" height="68" rx="12" fill="#7A9870" opacity="0.95"/>
      <rect x="156" y="606" width="78" height="68" rx="12" fill="#7A9870" opacity="0.95"/>
      <rect x="242" y="606" width="78" height="68" rx="12" fill="#7A9870" opacity="0.95"/>
      {[109,195,281].map((x,i) => <circle key={i} cx={x} cy={640} r="3" fill="#4A6840" opacity="0.45"/>)}
      <rect x="46" y="602" width="24" height="120" rx="12" fill="#6A8860"/>
      <rect x="320" y="602" width="24" height="120" rx="12" fill="#6A8860"/>
      {/* Throw pillow warm */}
      <path d="M 256 618 Q 282 610 308 618 L 312 656 Q 286 664 260 656Z" fill="#E8C490" opacity="0.90"/>
      <line x1="284" y1="610" x2="284" y2="664" stroke="#C4A070" strokeWidth="1.2" opacity="0.30"/>
      <line x1="256" y1="636" x2="312" y2="636" stroke="#C4A070" strokeWidth="1.2" opacity="0.30"/>
      {/* Blue pillow */}
      <path d="M 72 620 Q 94 612 116 620 L 118 652 Q 96 660 74 652Z" fill="#7AB3D4" opacity="0.85"/>
      {/* Floor lamp */}
      <ellipse cx="348" cy="838" rx="22" ry="8" fill="#8B6530" opacity="0.78"/>
      <rect x="340" y="600" width="16" height="240" rx="3" fill="#8B6530" opacity="0.85"/>
      <rect x="326" y="568" width="44" height="36" rx="8" fill="#A07840" opacity="0.90"/>
      <path d="M 312 570 Q 312 548 348 546 Q 384 548 384 570 L 372 596 L 324 596Z" fill="#FFE080" opacity="0.90"/>
      <ellipse cx="348" cy="570" rx="24" ry="10" fill="#FFD060" opacity="0.58"/>
      <ellipse cx="348" cy="562" rx="32" ry="22" fill="#FFD060" opacity="0.25" filter="url(#h-glow)"/>
      <g ref={glowRef} opacity="0.38">
        <rect width="390" height="844" fill="url(#h-lamp)"/>
      </g>
      {/* Coffee table */}
      <rect x="84" y="734" width="162" height="56" rx="8" fill="#A07840" opacity="0.88" filter="url(#h-sh)"/>
      <rect x="84" y="730" width="162" height="14" rx="5" fill="#B89050"/>
      <rect x="106" y="720" width="46" height="34" rx="3" fill="#4A7898" opacity="0.85"/>
      <line x1="129" y1="722" x2="129" y2="752" stroke="#3A6888" strokeWidth="1.5" opacity="0.40"/>
      <ellipse cx="192" cy="730" rx="13" ry="5.5" fill="#F5E8D0" opacity="0.90"/>
      <path d="M 181 726 Q 181 715 192 713 Q 203 715 203 726" fill="#ECD8B8" opacity="0.85"/>
      {/* Rug */}
      <ellipse cx="195" cy="796" rx="178" ry="48" fill="#C4A882" opacity="0.10"/>
      <ellipse cx="195" cy="796" rx="146" ry="36" fill="none" stroke="#C4A882" strokeWidth="2.5" opacity="0.14"/>
      <ellipse cx="195" cy="796" rx="114" ry="26" fill="none" stroke="#C4A882" strokeWidth="1.5" opacity="0.10"/>
      {/* Wood floor */}
      <rect x="0" y="726" width="390" height="118" fill="#8B6030" opacity="0.22"/>
      {[736,752,768,784,800,816,832].map((y,i) => <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#4A3010" strokeWidth="1" opacity="0.09"/>)}
      <rect width="390" height="844" fill="url(#h-vig)"/>
      {[{cx:290,cy:315,r:2,delay:'0s',dur:'9s'},{cx:318,cy:258,r:1.5,delay:'2.5s',dur:'12s'},{cx:344,cy:380,r:2.5,delay:'5s',dur:'10s'}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#FFE082" opacity="0.20">
          <animate attributeName="opacity" values="0;0.22;0" dur={p.dur} begin={p.delay} repeatCount="indefinite"/>
          <animateTransform attributeName="transform" type="translate" values="0,0; 5,-35; 0,0" dur={p.dur} begin={p.delay} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}
