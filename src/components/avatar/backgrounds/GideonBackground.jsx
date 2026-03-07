// GideonBackground — Grand Church Interior
import { useEffect, useRef } from 'react';
export default function GideonBackground({ speaking = false }) {
  const glowRef = useRef(null);
  useEffect(() => {
    if (!glowRef.current) return;
    glowRef.current.style.transition = 'opacity 500ms ease';
    glowRef.current.style.opacity = speaking ? '0.70' : '0.45';
  }, [speaking]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="g-ceiling" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A0F00"/>
          <stop offset="100%" stopColor="#2E1A00"/>
        </linearGradient>
        <linearGradient id="g-wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A2510"/>
          <stop offset="100%" stopColor="#2A1808"/>
        </linearGradient>
        <linearGradient id="g-floor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A1C0C"/>
          <stop offset="100%" stopColor="#1A1008"/>
        </linearGradient>
        <radialGradient id="g-altarlight" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#FF8800" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity="0.80"/>
          <stop offset="100%" stopColor="#FFD060" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-vig" cx="50%" cy="50%" r="72%">
          <stop offset="40%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#0A0500" stopOpacity="0.65"/>
        </radialGradient>
        <filter id="g-blur"><feGaussianBlur stdDeviation="6"/></filter>
        <filter id="g-blur2"><feGaussianBlur stdDeviation="12"/></filter>
        <filter id="g-glow3"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>

      {/* ── Stone wall base ── */}
      <rect width="390" height="844" fill="url(#g-wall)"/>

      {/* ── Vaulted ceiling ── */}
      <rect width="390" height="180" fill="url(#g-ceiling)"/>
      {/* Ceiling ribs / Gothic vaulting */}
      <path d="M 195 0 Q 80 80 0 180" fill="none" stroke="#4A3018" strokeWidth="5"/>
      <path d="M 195 0 Q 310 80 390 180" fill="none" stroke="#4A3018" strokeWidth="5"/>
      <path d="M 195 0 Q 195 100 50 180" fill="none" stroke="#3A2210" strokeWidth="3" opacity="0.6"/>
      <path d="M 195 0 Q 195 100 340 180" fill="none" stroke="#3A2210" strokeWidth="3" opacity="0.6"/>
      <path d="M 195 0 Q 130 60 0 120" fill="none" stroke="#3A2210" strokeWidth="2.5" opacity="0.5"/>
      <path d="M 195 0 Q 260 60 390 120" fill="none" stroke="#3A2210" strokeWidth="2.5" opacity="0.5"/>
      {/* Keystone */}
      <circle cx="195" cy="8" r="12" fill="#5A3C18" stroke="#7A5830" strokeWidth="2"/>

      {/* ── LEFT stone column ── */}
      <rect x="0" y="0" width="58" height="700" fill="#2A1C0E"/>
      <rect x="0" y="0" width="6" height="700" fill="#3A2A18" opacity="0.8"/>
      <rect x="52" y="0" width="6" height="700" fill="#1A1008" opacity="0.8"/>
      {/* Column stone courses */}
      {[0,70,140,210,280,350,420,490,560,630].map((y,i) => (
        <rect key={i} x="0" y={y} width="58" height="2" fill="#1A1008" opacity="0.4"/>
      ))}
      {/* Capital */}
      <path d="M 0 130 Q 29 110 58 130 L 58 155 Q 29 148 0 155Z" fill="#3A2A18"/>
      <line x1="0" y1="140" x2="58" y2="140" stroke="#5A4028" strokeWidth="2" opacity="0.6"/>

      {/* ── RIGHT stone column ── */}
      <rect x="332" y="0" width="58" height="700" fill="#2A1C0E"/>
      <rect x="332" y="0" width="6" height="700" fill="#1A1008" opacity="0.8"/>
      <rect x="384" y="0" width="6" height="700" fill="#3A2A18" opacity="0.8"/>
      {[0,70,140,210,280,350,420,490,560,630].map((y,i) => (
        <rect key={i} x="332" y={y} width="58" height="2" fill="#1A1008" opacity="0.4"/>
      ))}
      <path d="M 332 130 Q 361 110 390 130 L 390 155 Q 361 148 332 155Z" fill="#3A2A18"/>
      <line x1="332" y1="140" x2="390" y2="140" stroke="#5A4028" strokeWidth="2" opacity="0.6"/>

      {/* ── GRAND STAINED GLASS WINDOW (centre back) ── */}
      {/* Outer stone arch */}
      <path d="M 85 380 L 85 130 Q 85 30 195 30 Q 305 30 305 130 L 305 380Z"
        fill="#1A1008" stroke="#5A3C18" strokeWidth="5"/>
      {/* Inner arch decorative */}
      <path d="M 96 380 L 96 138 Q 96 48 195 48 Q 294 48 294 138 L 294 380Z"
        fill="none" stroke="#3A2810" strokeWidth="2"/>

      {/* Rose window circle */}
      <circle cx="195" cy="155" r="74" fill="#0A0600" stroke="#6A4820" strokeWidth="3"/>
      {/* Rose petals - 8 colored segments */}
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const rad = a*Math.PI/180;
        const colors=['#C9A227','#8B1A1A','#1B3A8B','#1A5C1A','#C9A227','#8B1A1A','#1B3A8B','#1A5C1A'];
        const cx2 = 195+Math.round(44*Math.sin(rad));
        const cy2 = 155-Math.round(44*Math.cos(rad));
        return <ellipse key={i} cx={cx2} cy={cy2} rx="20" ry="13"
          fill={colors[i]} opacity="0.82"
          transform={`rotate(${a} ${cx2} ${cy2})`}/>;
      })}
      {/* Rose center */}
      <circle cx="195" cy="155" r="20" fill="#C9A227" opacity="0.88"/>
      <circle cx="195" cy="155" r="12" fill="#FFE060" opacity="0.80"/>
      {/* Spoke lines */}
      {[0,45,90,135,180,225,270,315].map((a,i) => {
        const rad=a*Math.PI/180;
        return <line key={i} x1="195" y1="155"
          x2={Math.round(195+68*Math.sin(rad))} y2={Math.round(155-68*Math.cos(rad))}
          stroke="#6A4820" strokeWidth="2" opacity="0.7"/>;
      })}
      <circle cx="195" cy="155" r="74" fill="none" stroke="#6A4820" strokeWidth="3"/>

      {/* Lancet panels below rose */}
      {/* Left lancet */}
      <path d="M 96 240 L 96 236 L 140 236 L 140 380Z" fill="#8B1A1A" opacity="0.58"/>
      <path d="M 96 236 L 96 380 L 140 380 L 140 236" fill="none" stroke="#6A4820" strokeWidth="1.5"/>
      {/* Centre lancet */}
      <path d="M 148 236 L 148 380 L 242 380 L 242 236Z" fill="#C9A227" opacity="0.52"/>
      <line x1="195" y1="236" x2="195" y2="380" stroke="#6A4820" strokeWidth="2"/>
      <line x1="148" y1="308" x2="242" y2="308" stroke="#6A4820" strokeWidth="1.5"/>
      {/* Right lancet */}
      <path d="M 250 236 L 250 380 L 294 380 L 294 236Z" fill="#1B3A8B" opacity="0.58"/>
      <path d="M 250 236 L 294 236 L 294 380 L 250 380" fill="none" stroke="#6A4820" strokeWidth="1.5"/>
      {/* Horizontal bar */}
      <line x1="96" y1="236" x2="294" y2="236" stroke="#6A4820" strokeWidth="2.5"/>

      {/* ── Window glow spill (altar light) ── */}
      <rect width="390" height="844" fill="url(#g-altarlight)"/>
      <g ref={glowRef} opacity="0.45">
        <rect width="390" height="844" fill="url(#g-glow)" style={{mixBlendMode:'screen'}}/>
      </g>

      {/* ── ALTAR AREA (deep background centre) ── */}
      {/* Altar steps */}
      <rect x="88" y="580" width="214" height="18" rx="3" fill="#3A2810"/>
      <rect x="104" y="562" width="182" height="18" rx="3" fill="#3A2810"/>
      <rect x="120" y="546" width="150" height="18" rx="3" fill="#2E2010"/>
      {/* Altar table */}
      <rect x="130" y="506" width="130" height="42" rx="4" fill="#2A1808" stroke="#5A3C18" strokeWidth="2"/>
      <rect x="130" y="504" width="130" height="8" rx="3" fill="#5A3C18"/>
      {/* Altar cloth */}
      <rect x="134" y="512" width="122" height="32" rx="2" fill="#8B1A1A" opacity="0.70"/>
      <line x1="195" y1="512" x2="195" y2="544" stroke="#C9A227" strokeWidth="1.5" opacity="0.55"/>
      <line x1="134" y1="528" x2="256" y2="528" stroke="#C9A227" strokeWidth="1" opacity="0.40"/>

      {/* ── LARGE CROSS on altar ── */}
      <rect x="188" y="420" width="14" height="88" rx="3" fill="#C9A227"/>
      <rect x="165" y="440" width="60" height="12" rx="3" fill="#C9A227"/>
      {/* Cross glow */}
      <rect x="185" y="417" width="20" height="94" rx="4" fill="#FFE060" opacity="0.30" filter="url(#g-blur)"/>
      <rect x="162" y="437" x="162" y="437" width="66" height="18" rx="5" fill="#FFE060" opacity="0.25" filter="url(#g-blur)"/>

      {/* ── Candle stands flanking altar ── */}
      {/* Left candle stand */}
      <rect x="143" y="464" width="6" height="44" fill="#8B7030"/>
      <rect x="136" y="506" width="20" height="5" rx="2" fill="#6A5020"/>
      <rect x="141" y="450" width="8" height="18" rx="2" fill="#F5E6C0" opacity="0.95"/>
      <ellipse cx="145" cy="449" rx="4" ry="3" fill="#FF9800" opacity="0.90"/>
      <ellipse cx="145" cy="445" rx="6" ry="5" fill="#FFD060" opacity="0.50" filter="url(#g-blur)"/>
      {/* Right candle stand */}
      <rect x="241" y="464" width="6" height="44" fill="#8B7030"/>
      <rect x="234" y="506" width="20" height="5" rx="2" fill="#6A5020"/>
      <rect x="239" y="450" width="8" height="18" rx="2" fill="#F5E6C0" opacity="0.95"/>
      <ellipse cx="243" cy="449" rx="4" ry="3" fill="#FF9800" opacity="0.90"/>
      <ellipse cx="243" cy="445" rx="6" ry="5" fill="#FFD060" opacity="0.50" filter="url(#g-blur)"/>

      {/* Candle flicker animations */}
      <ellipse cx="145" cy="449" rx="3" ry="4" fill="#FFB300" opacity="0.60">
        <animate attributeName="ry" values="4;5.5;3;5;4" dur="1.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.9;0.5;0.8;0.6" dur="1.6s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="243" cy="449" rx="3" ry="4" fill="#FFB300" opacity="0.60">
        <animate attributeName="ry" values="4;3;5.5;4;5" dur="2.0s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0.9;0.6;0.8;0.5" dur="2.0s" repeatCount="indefinite"/>
      </ellipse>

      {/* ── WALL SCONCES (left + right) ── */}
      <rect x="62" y="300" width="22" height="7" rx="2" fill="#8B7030"/>
      <rect x="68" y="285" width="10" height="16" rx="3" fill="#F5E6C0" opacity="0.92"/>
      <ellipse cx="73" cy="284" rx="14" ry="10" fill="#FFD060" opacity="0.28" filter="url(#g-blur)"/>
      <rect x="306" y="300" width="22" height="7" rx="2" fill="#8B7030"/>
      <rect x="312" y="285" width="10" height="16" rx="3" fill="#F5E6C0" opacity="0.92"/>
      <ellipse cx="317" cy="284" rx="14" ry="10" fill="#FFD060" opacity="0.28" filter="url(#g-blur)"/>

      {/* ── WOODEN PEWS (perspective, left + right) ── */}
      {/* Left pew 1 */}
      <path d="M 0 690 L 0 640 Q 0 625 15 625 L 160 625 Q 172 625 172 638 L 172 690Z" fill="#3A2210"/>
      <rect x="0" y="622" width="172" height="10" rx="3" fill="#4A3018"/>
      <path d="M 8 622 L 8 568 Q 8 556 20 556 L 162 556 L 162 622Z" fill="#2E1A08" opacity="0.85"/>
      {/* Left pew 2 (farther, smaller for perspective) */}
      <path d="M 0 570 L 0 535 Q 0 524 12 524 L 145 524 Q 154 524 154 534 L 154 570Z" fill="#2E1A08" opacity="0.75"/>
      <rect x="0" y="521" width="154" height="8" rx="2" fill="#3A2210" opacity="0.75"/>

      {/* Right pew 1 */}
      <path d="M 390 690 L 390 640 Q 390 625 375 625 L 230 625 Q 218 625 218 638 L 218 690Z" fill="#3A2210"/>
      <rect x="218" y="622" width="172" height="10" rx="3" fill="#4A3018"/>
      <path d="M 382 622 L 382 568 Q 382 556 370 556 L 228 556 L 228 622Z" fill="#2E1A08" opacity="0.85"/>
      {/* Right pew 2 */}
      <path d="M 390 570 L 390 535 Q 390 524 378 524 L 245 524 Q 236 524 236 534 L 236 570Z" fill="#2E1A08" opacity="0.75"/>
      <rect x="236" y="521" width="154" height="8" rx="2" fill="#3A2210" opacity="0.75"/>

      {/* ── STONE TILE FLOOR ── */}
      <rect x="0" y="700" width="390" height="144" fill="#221508"/>
      {/* Aisle runner (red carpet) */}
      <rect x="158" y="598" width="74" height="246" fill="#6B1414" opacity="0.72"/>
      <rect x="162" y="598" width="66" height="246" fill="#7A1818" opacity="0.55"/>
      <line x1="170" y1="598" x2="170" y2="844" stroke="#9A2020" strokeWidth="1" opacity="0.25"/>
      <line x1="220" y1="598" x2="220" y2="844" stroke="#9A2020" strokeWidth="1" opacity="0.25"/>
      {/* Floor tiles */}
      {[720,750,780,810,840].map((y,i) => (
        <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#3A2810" strokeWidth="1.5"/>
      ))}
      {[0,78,156,234,312,390].map((x,i) => (
        <line key={i} x1={x} y1="700" x2={x} y2="844" stroke="#3A2810" strokeWidth="1.5"/>
      ))}

      {/* ── Colored light pools from stained glass ── */}
      <ellipse cx="195" cy="680" rx="100" ry="55" fill="#C9A227" opacity="0.12" filter="url(#g-blur2)"/>
      <ellipse cx="140" cy="670" rx="65" ry="40" fill="#8B1A1A" opacity="0.10" filter="url(#g-blur2)"/>
      <ellipse cx="250" cy="670" rx="65" ry="40" fill="#1B3A8B" opacity="0.10" filter="url(#g-blur2)"/>

      {/* ── Vignette ── */}
      <rect width="390" height="844" fill="url(#g-vig)"/>

      {/* ── Gold dust motes ── */}
      {[{x:148,d:'0s',dr:'13s'},{x:215,d:'3.8s',dr:'10s'},{x:176,d:'7.5s',dr:'14s'},{x:232,d:'1.8s',dr:'11s'}].map((m,i) => (
        <circle key={i} cx={m.x} cy={520} r="2.5" fill="#F0D98A" opacity="0.12">
          <animateTransform attributeName="transform" type="translate"
            values={`0,0; ${i%2===0?8:-8},-140`} dur={m.dr} begin={m.d} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;0.18;0" dur={m.dr} begin={m.d} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}
