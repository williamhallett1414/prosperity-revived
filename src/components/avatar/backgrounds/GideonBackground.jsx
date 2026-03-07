// GideonBackground — Grand Candlelit Church Sanctuary
import { useEffect, useRef } from 'react';
export default function GideonBackground({ speaking = false, listening = false, thinking = false }) {
  const glowRef = useRef(null);
  useEffect(() => {
    if (!glowRef.current) return;
    glowRef.current.style.transition = 'opacity 400ms ease';
    glowRef.current.style.opacity = speaking ? '0.60' : '0.38';
  }, [speaking]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="g-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E0E00"/>
          <stop offset="45%" stopColor="#2E1800"/>
          <stop offset="100%" stopColor="#160C00"/>
        </linearGradient>
        <radialGradient id="g-ambient" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#C9841A" stopOpacity="0.55"/>
          <stop offset="60%" stopColor="#8B5500" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#1E0E00" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-window" cx="50%" cy="5%" r="75%">
          <stop offset="0%" stopColor="#FFE880" stopOpacity="0.82"/>
          <stop offset="40%" stopColor="#D4900A" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#1E0E00" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-floor-gold" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-floor-ruby" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B1A1A" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#8B1A1A" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-floor-blue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1B3A8B" stopOpacity="0.20"/>
          <stop offset="100%" stopColor="#1B3A8B" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-candle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD060" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#FFD060" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="g-vig" cx="50%" cy="50%" r="70%">
          <stop offset="50%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#100800" stopOpacity="0.75"/>
        </radialGradient>
        <filter id="g-glow"><feGaussianBlur stdDeviation="8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="g-glow2"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <rect width="390" height="844" fill="url(#g-bg)"/>
      <rect width="390" height="844" fill="url(#g-ambient)"/>
      {/* Stone wall texture bands */}
      {[0,52,104,156,208,260,312,364,416,468,520,572,624,676,728,780].map((y,i) => (
        <rect key={i} x="0" y={y} width="390" height="50" fill={i%2===0 ? "#2A1600" : "#221200"} opacity="0.25"/>
      ))}
      {/* Stone column left */}
      <rect x="0" y="0" width="54" height="740" fill="#2A1800" opacity="0.88"/>
      <rect x="8" y="0" width="38" height="740" fill="#221400" opacity="0.70"/>
      <rect x="4" y="0" width="4" height="740" fill="#3A2200" opacity="0.60"/>
      <rect x="46" y="0" width="4" height="740" fill="#3A2200" opacity="0.60"/>
      {/* Column fluting lines */}
      {[12,20,28,36,44].map((x,i) => <line key={i} x1={x} y1="0" x2={x} y2="740" stroke="#3A2200" strokeWidth="1" opacity="0.35"/>)}
      {/* Capital top left */}
      <path d="M 0 80 Q 27 68 54 80 L 54 96 Q 27 90 0 96Z" fill="#3A2600" opacity="0.90"/>
      <path d="M 0 88 Q 27 76 54 88" fill="none" stroke="#5A3800" strokeWidth="2" opacity="0.60"/>
      {/* Stone column right */}
      <rect x="336" y="0" width="54" height="740" fill="#2A1800" opacity="0.88"/>
      <rect x="344" y="0" width="38" height="740" fill="#221400" opacity="0.70"/>
      <rect x="340" y="0" width="4" height="740" fill="#3A2200" opacity="0.60"/>
      <rect x="382" y="0" width="4" height="740" fill="#3A2200" opacity="0.60"/>
      {[344,352,360,368,376].map((x,i) => <line key={i} x1={x} y1="0" x2={x} y2="740" stroke="#3A2200" strokeWidth="1" opacity="0.35"/>)}
      <path d="M 336 80 Q 363 68 390 80 L 390 96 Q 363 90 336 96Z" fill="#3A2600" opacity="0.90"/>
      <path d="M 336 88 Q 363 76 390 88" fill="none" stroke="#5A3800" strokeWidth="2" opacity="0.60"/>
      {/* Grand pointed arch */}
      <path d="M 60 680 L 60 210 Q 60 20 195 20 Q 330 20 330 210 L 330 680Z" fill="none" stroke="#7A5500" strokeWidth="6"/>
      <path d="M 72 680 L 72 228 Q 72 44 195 44 Q 318 44 318 228 L 318 680Z" fill="none" stroke="#5A3F00" strokeWidth="2.5"/>
      {/* Inner arch decorative */}
      <path d="M 84 680 L 84 242 Q 84 68 195 68 Q 306 68 306 242 L 306 680Z" fill="none" stroke="#3A2800" strokeWidth="1.5" opacity="0.50"/>
      {/* Stained glass window */}
      <path d="M 100 395 L 100 155 Q 100 72 195 72 Q 290 72 290 155 L 290 395Z" fill="#1A0C00" stroke="#7A5500" strokeWidth="3"/>
      {/* Rose window top arch */}
      <circle cx="195" cy="148" r="62" fill="#2A1400" stroke="#7A5500" strokeWidth="2.5"/>
      {/* Rose petals */}
      {[0,45,90,135,180,225,270,315].map((angle,i) => {
        const rad = angle * Math.PI / 180;
        const cx = 195 + Math.round(38 * Math.sin(rad));
        const cy = 148 - Math.round(38 * Math.cos(rad));
        const colors = ['#C9A227','#8B1A1A','#1B3A6B','#1B5C1B','#C9A227','#8B1A1A','#1B3A6B','#1B5C1B'];
        return <ellipse key={i} cx={cx} cy={cy} rx="18" ry="12" fill={colors[i]} opacity="0.75"
          transform={`rotate(${angle} ${cx} ${cy})`}/>;
      })}
      <circle cx="195" cy="148" r="16" fill="#E8B820" opacity="0.80"/>
      <circle cx="195" cy="148" r="10" fill="#FFD860" opacity="0.70"/>
      {/* Rose spokes */}
      {[0,45,90,135,180,225,270,315].map((angle,i) => {
        const rad = angle * Math.PI / 180;
        return <line key={i} x1="195" y1="148" x2={Math.round(195+56*Math.sin(rad))} y2={Math.round(148-56*Math.cos(rad))} stroke="#7A5500" strokeWidth="1.5" opacity="0.65"/>;
      })}
      <circle cx="195" cy="148" r="62" fill="none" stroke="#7A5500" strokeWidth="2.5"/>
      {/* Rectangular panels below rose */}
      <rect x="100" y="216" width="90" height="90" fill="#8B1A1A" opacity="0.55" stroke="#7A5500" strokeWidth="1.5"/>
      <rect x="200" y="216" width="90" height="90" fill="#1B3A6B" opacity="0.55" stroke="#7A5500" strokeWidth="1.5"/>
      <rect x="100" y="313" width="90" height="82" fill="#1B5C1B" opacity="0.50" stroke="#7A5500" strokeWidth="1.5"/>
      <rect x="200" y="313" width="90" height="82" fill="#C9A227" opacity="0.58" stroke="#7A5500" strokeWidth="1.5"/>
      {/* Lead dividers */}
      <line x1="195" y1="210" x2="195" y2="400" stroke="#7A5500" strokeWidth="2.5" opacity="0.80"/>
      <line x1="100" y1="310" x2="290" y2="310" stroke="#7A5500" strokeWidth="2.0" opacity="0.75"/>
      <line x1="100" y1="216" x2="290" y2="216" stroke="#7A5500" strokeWidth="2.0" opacity="0.75"/>
      {/* Window glow */}
      <rect width="390" height="844" fill="url(#g-window)" opacity="0.88"/>
      {/* Wall sconces */}
      <rect x="58" y="288" width="18" height="6" rx="2" fill="#D4A020"/>
      <rect x="63" y="275" width="8" height="14" rx="3" fill="#F0B830" opacity="0.88"/>
      <ellipse cx="67" cy="274" rx="16" ry="10" fill="#FFD060" opacity="0.22" filter="url(#g-glow2)"/>
      <rect x="314" y="288" width="18" height="6" rx="2" fill="#D4A020"/>
      <rect x="319" y="275" width="8" height="14" rx="3" fill="#F0B830" opacity="0.88"/>
      <ellipse cx="323" cy="274" rx="16" ry="10" fill="#FFD060" opacity="0.22" filter="url(#g-glow2)"/>
      {/* Candles on pews */}
      <rect x="148" y="595" width="6" height="28" rx="1" fill="#F5E6C0" opacity="0.92"/>
      <ellipse cx="151" cy="594" rx="4" ry="3" fill="#FF9800" opacity="0.88"/>
      <ellipse cx="151" cy="590" rx="7" ry="5" fill="#FFD060" opacity="0.40" filter="url(#g-glow2)"/>
      <rect x="236" y="595" width="6" height="28" rx="1" fill="#F5E6C0" opacity="0.92"/>
      <ellipse cx="239" cy="594" rx="4" ry="3" fill="#FF9800" opacity="0.88"/>
      <ellipse cx="239" cy="590" rx="7" ry="5" fill="#FFD060" opacity="0.40" filter="url(#g-glow2)"/>
      {/* Candle flicker */}
      <ellipse cx="151" cy="594" rx="3" ry="4" fill="#FFB300" opacity="0.55">
        <animate attributeName="rx" values="3;2;3.5;2.5;3" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="4;5;3;5;4" dur="1.8s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="239" cy="594" rx="3" ry="4" fill="#FFB300" opacity="0.55">
        <animate attributeName="rx" values="3;3.5;2;3;2.5" dur="2.1s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="4;3;5;4;5" dur="2.1s" repeatCount="indefinite"/>
      </ellipse>
      {/* Colored light pools on floor (speaking-reactive) */}
      <g ref={glowRef} opacity="0.38">
        <ellipse cx="145" cy="690" rx="88" ry="50" fill="url(#g-floor-ruby)"/>
        <ellipse cx="245" cy="690" rx="88" ry="50" fill="url(#g-floor-blue)"/>
        <ellipse cx="195" cy="724" rx="110" ry="64" fill="url(#g-floor-gold)"/>
      </g>
      {/* Stone floor */}
      <rect x="0" y="700" width="390" height="144" fill="#221000" opacity="0.80"/>
      {[720,744,768,792,816,840].map((y,i) => <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#3A1800" strokeWidth="1.5"/>)}
      {[78,156,234,312].map((x,i) => <line key={i} x1={x} y1="700" x2={x} y2="844" stroke="#3A1800" strokeWidth="1.5"/>)}
      {/* Left pew */}
      <path d="M 60 692 L 60 628 Q 60 614 74 614 L 168 614 Q 178 614 178 624 L 178 692Z" fill="#321A00"/>
      <rect x="60" y="612" width="118" height="14" rx="4" fill="#3E2400"/>
      <path d="M 68 614 L 68 558 Q 68 546 80 546 L 168 546 L 168 614Z" fill="#281400" opacity="0.82"/>
      {/* Right pew */}
      <path d="M 330 692 L 330 628 Q 330 614 316 614 L 222 614 Q 212 614 212 624 L 212 692Z" fill="#321A00"/>
      <rect x="212" y="612" width="118" height="14" rx="4" fill="#3E2400"/>
      <path d="M 322 614 L 322 558 Q 322 546 310 546 L 222 546 L 222 614Z" fill="#281400" opacity="0.82"/>
      <rect width="390" height="844" fill="url(#g-vig)"/>
      {/* Gold dust motes */}
      {[{x:148,delay:'0s',dur:'13s'},{x:215,delay:'3.8s',dur:'10s'},{x:176,delay:'7.5s',dur:'14s'},{x:232,delay:'1.8s',dur:'11s'}].map((m,i) => (
        <circle key={i} cx={m.x} cy={520} r="2.5" fill="#F0D98A" opacity="0.12">
          <animateTransform attributeName="transform" type="translate" values={`0,0; ${i%2===0?7:-7},-120`} dur={m.dur} begin={m.delay} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;0.14;0" dur={m.dur} begin={m.delay} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}
