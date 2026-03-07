// DanielBackground — Bright Mediterranean Kitchen
import { useEffect, useRef } from 'react';
export default function DanielBackground({ speaking = false }) {
  const pendantRef = useRef(null);
  useEffect(() => {
    if (!pendantRef.current) return;
    pendantRef.current.style.transition = 'opacity 400ms ease';
    pendantRef.current.style.opacity = speaking ? '0.62' : '0.42';
  }, [speaking]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="d-wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5EDD8"/>
          <stop offset="65%" stopColor="#EEDD C0"/>
          <stop offset="100%" stopColor="#E4D4A8"/>
        </linearGradient>
        <linearGradient id="d-wall2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5EDD8"/>
          <stop offset="100%" stopColor="#E8D8B8"/>
        </linearGradient>
        <linearGradient id="d-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#80C8F0"/>
          <stop offset="60%" stopColor="#C0E8FF"/>
          <stop offset="100%" stopColor="#FFFAC0"/>
        </linearGradient>
        <radialGradient id="d-pendant" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#F5C842" stopOpacity="0.70"/>
          <stop offset="45%" stopColor="#E8943A" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#F5EDD8" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="d-window-glow" cx="75%" cy="15%" r="55%">
          <stop offset="0%" stopColor="#FFE860" stopOpacity="0.70"/>
          <stop offset="50%" stopColor="#FFB830" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#FFF8D0" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="d-vig" cx="50%" cy="50%" r="72%">
          <stop offset="50%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#2A1000" stopOpacity="0.18"/>
        </radialGradient>
        <filter id="d-glow"><feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="d-sh"><feDropShadow dx="2" dy="3" stdDeviation="5" floodColor="#2A1000" floodOpacity="0.18"/></filter>
        <filter id="d-soft"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <rect width="390" height="844" fill="url(#d-wall2)"/>
      {/* Ceiling */}
      <rect x="0" y="0" width="390" height="68" fill="#EAD8B8"/>
      <rect x="0" y="64" width="390" height="6" fill="#D4C09A"/>
      {/* Large sunny window right */}
      <path d="M 232 10 L 386 10 L 386 340 L 232 340Z" fill="url(#d-sky)"/>
      {/* Garden / herbs outside */}
      <ellipse cx="258" cy="340" rx="32" ry="42" fill="#4A8820" opacity="0.28"/>
      <ellipse cx="305" cy="332" rx="44" ry="52" fill="#3A7818" opacity="0.25"/>
      <ellipse cx="358" cy="338" rx="30" ry="44" fill="#5A9228" opacity="0.22"/>
      {/* Fence/garden detail */}
      {[242,258,274,290,306,322,338,354,370].map((x,i) => <line key={i} x1={x} y1="318" x2={x} y2="340" stroke="#3A6814" strokeWidth="2" opacity="0.22"/>)}
      <line x1="232" y1="320" x2="386" y2="320" stroke="#3A6814" strokeWidth="2" opacity="0.22"/>
      {/* Window frame */}
      <rect x="232" y="10" width="154" height="330" fill="none" stroke="#C0A060" strokeWidth="5"/>
      <line x1="309" y1="10" x2="309" y2="340" stroke="#C0A060" strokeWidth="3.5"/>
      <line x1="232" y1="160" x2="386" y2="160" stroke="#C0A060" strokeWidth="3"/>
      <line x1="232" y1="255" x2="386" y2="255" stroke="#C0A060" strokeWidth="2.5"/>
      {/* Window sill */}
      <rect x="222" y="336" width="168" height="18" rx="4" fill="#C0A060"/>
      {/* Herb pots on sill */}
      <ellipse cx="248" cy="335" rx="12" ry="8" fill="#3A8818" opacity="0.88"/>
      <path d="M 248 336 L 242 350 L 254 350Z" fill="#B03818" opacity="0.78"/>
      <ellipse cx="280" cy="334" rx="10" ry="7" fill="#5A9828" opacity="0.85"/>
      <path d="M 280 335 L 274 348 L 286 348Z" fill="#C04820" opacity="0.75"/>
      <ellipse cx="360" cy="335" rx="12" ry="8" fill="#8B8820" opacity="0.80"/>
      <path d="M 360 336 L 354 350 L 366 350Z" fill="#B03818" opacity="0.72"/>
      {/* Left curtain */}
      <path d="M 216 10 Q 226 72 220 148 Q 216 228 224 308 Q 228 360 218 430 L 238 430 L 238 10Z" fill="#E8B878" opacity="0.65"/>
      <path d="M 218 10 Q 222 56 216 104 Q 214 158 220 212" fill="none" stroke="#C89050" strokeWidth="1.5" opacity="0.35"/>
      {/* Window glow overlay */}
      <rect width="390" height="844" fill="url(#d-window-glow)"/>
      {/* Terracotta tile backsplash */}
      <rect x="0" y="68" width="212" height="172" fill="#D86A38" opacity="0.85"/>
      {/* Tile grout lines */}
      {[0,1,2,3,4,5,6].map((row) => [0,1,2,3,4,5,6,7,8].map((col) => {
        const offset = row%2===0 ? 0 : 24;
        return <rect key={`${row}-${col}`} x={col*48+offset} y={68+row*24} width="46" height="22" rx="1"
          fill={row%3===0&&col%2===0 ? "#D05828" : row%3===1 ? "#C85020" : "#D86A38"} opacity="0.90"/>;
      }))}
      {/* Tile grout */}
      {[92,116,140,164,188,212,236].map((y,i) => <line key={i} x1="0" y1={y} x2="212" y2={y} stroke="#A04828" strokeWidth="1.5"/>)}
      {[0,48,96,144,192,240].map((x,i) => <line key={i} x1={x} y1="68" x2={x} y2="240" stroke="#A04828" strokeWidth="1.5"/>)}
      {/* Tile decorative pattern on some tiles */}
      {[{x:8,y:76},{x:104,y:76},{x:56,y:100},{x:152,y:100},{x:8,y:148},{x:104,y:148}].map((t,i) => (
        <circle key={i} cx={t.x+22} cy={t.y+10} r="7" fill="none" stroke="#F5A850" strokeWidth="1.5" opacity="0.55"/>
      ))}
      {/* Open shelving upper left */}
      <rect x="0" y="68" width="6" height="172" fill="#8B6030"/>
      <rect x="0" y="68" width="212" height="8" rx="2" fill="#8B6030"/>
      <rect x="0" y="152" width="212" height="8" rx="2" fill="#8B6030"/>
      <rect x="0" y="236" width="212" height="8" rx="2" fill="#8B6030"/>
      {/* Jars and items on shelf 1 */}
      <rect x="14" y="80" width="22" height="66" rx="6" fill="#A8C8D8" opacity="0.82"/>
      <ellipse cx="25" cy="80" rx="10" ry="5" fill="#B0D0E0" opacity="0.80"/>
      <rect x="44" y="88" width="18" height="58" rx="5" fill="#F5A060" opacity="0.78"/>
      <ellipse cx="53" cy="88" rx="8" ry="4" fill="#F8B870" opacity="0.78"/>
      <rect x="70" y="84" width="24" height="62" rx="6" fill="#8BC878" opacity="0.80"/>
      <ellipse cx="82" cy="84" rx="11" ry="5" fill="#9ED888" opacity="0.80"/>
      {/* Herbs in small pots shelf 1 */}
      <rect x="102" y="110" width="14" height="36" rx="4" fill="#C04820" opacity="0.85"/>
      <ellipse cx="109" cy="109" rx="14" ry="10" fill="#3A8818" opacity="0.85"/>
      <rect x="124" y="108" width="14" height="38" rx="4" fill="#A84018" opacity="0.80"/>
      <ellipse cx="131" cy="107" rx="12" ry="9" fill="#5A9828" opacity="0.82"/>
      <rect x="148" y="112" width="14" height="34" rx="4" fill="#C04820" opacity="0.80"/>
      <ellipse cx="155" cy="111" rx="13" ry="9" fill="#8B8820" opacity="0.78"/>
      {/* Ceramic bowls shelf 2 */}
      <path d="M 12 168 Q 12 160 28 160 Q 44 160 44 168 L 40 182 L 16 182Z" fill="#C45C2A" opacity="0.88"/>
      <ellipse cx="28" cy="168" rx="16" ry="7" fill="#D46A38" opacity="0.85"/>
      <path d="M 58 170 Q 58 162 74 162 Q 90 162 90 170 L 86 184 L 62 184Z" fill="#7AB3D4" opacity="0.85"/>
      <ellipse cx="74" cy="170" rx="16" ry="7" fill="#8AC3E4" opacity="0.82"/>
      <path d="M 104 168 Q 104 160 120 160 Q 136 160 136 168 L 132 182 L 108 182Z" fill="#E8D060" opacity="0.82"/>
      {/* Copper pot rack below ceiling */}
      <rect x="0" y="72" width="224" height="8" rx="3" fill="#8B5A28" opacity="0.90"/>
      {/* Hanging pots */}
      {[30,70,114,160].map((x,i) => {
        const h = [60,80,55,72][i];
        return (
          <g key={i}>
            <line x1={x+16} y1="80" x2={x+16} y2={80+h*0.4} stroke="#6A4018" strokeWidth="2"/>
            <path d={`M ${x} ${80+h*0.4} Q ${x} ${80+h*0.8} ${x+16} ${80+h} Q ${x+32} ${80+h*0.8} ${x+32} ${80+h*0.4}Z`}
              fill="#B87333" opacity="0.88"/>
            <ellipse cx={x+16} cy={80+h*0.4} rx="16" ry="8" fill="#C08040" opacity="0.85"/>
            <ellipse cx={x+16} cy={80+h} rx="14" ry="5" fill="#A06A28" opacity="0.72"/>
          </g>
        );
      })}
      {/* Pendant light center */}
      <line x1="195" y1="0" x2="195" y2="52" stroke="#6A4018" strokeWidth="3"/>
      <path d="M 162 52 Q 162 38 195 36 Q 228 38 228 52 L 220 78 L 170 78Z" fill="#B87333" opacity="0.90"/>
      <ellipse cx="195" cy="52" rx="26" ry="12" fill="#C88040" opacity="0.88"/>
      <ellipse cx="195" cy="52" rx="22" ry="9" fill="#FFD040" opacity="0.65"/>
      <ellipse cx="195" cy="52" rx="30" ry="18" fill="#FFD040" opacity="0.30" filter="url(#d-glow)"/>
      <g ref={pendantRef} opacity="0.42">
        <rect width="390" height="844" fill="url(#d-pendant)"/>
      </g>
      {/* Counter / prep area bottom */}
      <rect x="0" y="596" width="390" height="54" fill="#C8A870" opacity="0.92"/>
      <rect x="0" y="592" width="390" height="10" rx="2" fill="#A88850"/>
      {/* Counter items */}
      {/* Cutting board */}
      <rect x="48" y="570" width="96" height="28" rx="5" fill="#9B7A40" opacity="0.90"/>
      <rect x="52" y="574" width="88" height="20" rx="3" fill="#B08A50"/>
      {/* Vegetables on board */}
      <ellipse cx="72" cy="583" rx="10" ry="6" fill="#E03030" opacity="0.85"/>
      <ellipse cx="96" cy="582" rx="8" ry="5" fill="#E85030" opacity="0.82"/>
      <path d="M 116 578 Q 120 574 128 578 Q 132 582 128 586 Q 120 590 116 586Z" fill="#3A8818" opacity="0.85"/>
      {/* Mixing bowl */}
      <path d="M 182 574 Q 182 560 204 558 Q 226 560 226 574 L 222 590 L 186 590Z" fill="#D4C090" opacity="0.88"/>
      <ellipse cx="204" cy="574" rx="22" ry="9" fill="#E0CC9A" opacity="0.85"/>
      {/* Olive oil bottle */}
      <rect x="256" y="548" width="18" height="50" rx="6" fill="#A0C840" opacity="0.82"/>
      <ellipse cx="265" cy="548" rx="8" ry="5" fill="#B0D848" opacity="0.80"/>
      <rect x="262" y="540" width="6" height="12" rx="2" fill="#8B9840" opacity="0.78"/>
      {/* Counter tiles front edge */}
      {[0,52,104,156,208,260,312,364].map((x,i) => <rect key={i} x={x} y="644" width="50" height="8" fill="#C0986A" opacity="0.90"/>)}
      {/* Floor */}
      <rect x="0" y="648" width="390" height="196" fill="#E8D090" opacity="0.55"/>
      {[660,680,700,720,740,760,780,800,820,840].map((y,i) => <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#B0904A" strokeWidth="1" opacity="0.14"/>)}
      {[0,78,156,234,312,390].map((x,i) => <line key={i} x1={x} y1="648" x2={x} y2="844" stroke="#B0904A" strokeWidth="1" opacity="0.12"/>)}
      <rect width="390" height="844" fill="url(#d-vig)"/>
    </svg>
  );
}
