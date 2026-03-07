// PaulBackground — Epic Sunrise Mountain Vista
import { useEffect, useRef } from 'react';
export default function PaulBackground({ speaking = false }) {
  const horizonRef = useRef(null);
  useEffect(() => {
    if (!horizonRef.current) return;
    horizonRef.current.style.transition = 'opacity 400ms ease';
    horizonRef.current.style.opacity = speaking ? '0.52' : '0.32';
  }, [speaking]);
  return (
    <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="p-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#120830"/>
          <stop offset="18%"  stopColor="#230A50"/>
          <stop offset="36%"  stopColor="#4A1580"/>
          <stop offset="54%"  stopColor="#8B35C0"/>
          <stop offset="70%"  stopColor="#D06030"/>
          <stop offset="84%"  stopColor="#F0900A"/>
          <stop offset="93%"  stopColor="#FFB820"/>
          <stop offset="100%" stopColor="#FFD840"/>
        </linearGradient>
        <radialGradient id="p-sun" cx="50%" cy="96%" r="62%">
          <stop offset="0%"   stopColor="#FFE060" stopOpacity="0.95"/>
          <stop offset="28%"  stopColor="#FF7800" stopOpacity="0.65"/>
          <stop offset="60%"  stopColor="#FF4400" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#FF7800" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="p-horizon" cx="50%" cy="100%" r="65%">
          <stop offset="0%"   stopColor="#FFD840" stopOpacity="0.85"/>
          <stop offset="40%"  stopColor="#FF8800" stopOpacity="0.38"/>
          <stop offset="100%" stopColor="#FFD840" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="p-vig" cx="50%" cy="50%" r="72%">
          <stop offset="45%" stopColor="transparent"/>
          <stop offset="100%" stopColor="#080420" stopOpacity="0.72"/>
        </radialGradient>
        <linearGradient id="p-mist" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C8A0FF" stopOpacity="0.20"/>
          <stop offset="100%" stopColor="#C8A0FF" stopOpacity="0"/>
        </linearGradient>
        <filter id="p-blur"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="p-blur2"><feGaussianBlur stdDeviation="12"/></filter>
        <filter id="p-glow"><feGaussianBlur stdDeviation="18" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Sky gradient */}
      <rect width="390" height="844" fill="url(#p-sky)"/>
      {/* Stars */}
      {[[28,42],[68,18],[112,30],[145,52],[180,14],[222,38],[265,22],[298,48],[332,16],[358,40],[18,72],[340,70]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%3===0?1.8:1.2} fill="white" opacity={0.35+i*0.03}>
          <animate attributeName="opacity" values={`${0.2+i*0.03};${0.6+i*0.02};${0.2+i*0.03}`}
            dur={`${3+i*0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      {/* Sun rising */}
      <ellipse cx="195" cy="506" rx="48" ry="48" fill="#FFD840" opacity="0.90" filter="url(#p-glow)"/>
      <ellipse cx="195" cy="506" rx="36" ry="36" fill="#FFEE80" opacity="0.95"/>
      <ellipse cx="195" cy="506" rx="24" ry="24" fill="#FFFAAA" opacity="1.0"/>
      {/* Sun rays */}
      {[0,22,45,67,90,112,135,157,180,202,225,247,270,292,315,337].map((angle,i) => {
        const rad = angle * Math.PI / 180;
        const x1 = 195 + Math.round(52 * Math.sin(rad));
        const y1 = 506 - Math.round(52 * Math.cos(rad));
        const x2 = 195 + Math.round((68+i%3*6) * Math.sin(rad));
        const y2 = 506 - Math.round((68+i%3*6) * Math.cos(rad));
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD040" strokeWidth={i%2===0?2:1} opacity="0.45"/>;
      })}
      {/* Horizon glow */}
      <rect width="390" height="844" fill="url(#p-sun)"/>
      <g ref={horizonRef} opacity="0.32">
        <rect width="390" height="844" fill="url(#p-horizon)"/>
      </g>
      {/* Horizon bar */}
      <rect x="0" y="500" width="390" height="12" fill="#FFD840" opacity="0.28" filter="url(#p-blur)"/>
      {/* Far mountain range */}
      <path d="M 0 495 Q 40 438 80 460 Q 110 440 140 455 Q 165 430 195 445 Q 220 428 248 448 Q 270 432 298 450 Q 325 434 352 452 Q 368 440 390 455 L 390 510 L 0 510Z"
        fill="#4A1A70" opacity="0.60"/>
      {/* Mountain mist */}
      <rect x="0" y="462" width="390" height="50" fill="url(#p-mist)"/>
      {/* Mid mountains */}
      <path d="M 0 520 Q 32 468 68 490 Q 95 470 120 488 Q 148 462 175 480 Q 200 460 228 478 Q 255 465 280 484 Q 310 462 340 480 Q 362 466 390 480 L 390 528 L 0 528Z"
        fill="#3A1458" opacity="0.75"/>
      {/* Rolling hills layer 1 */}
      <path d="M 0 556 Q 50 520 100 540 Q 145 516 195 534 Q 242 518 290 536 Q 335 520 390 538 L 390 570 L 0 570Z"
        fill="#5A2888" opacity="0.70"/>
      {/* Rolling hills layer 2 - deep purple-green */}
      <path d="M 0 600 Q 60 560 115 580 Q 160 558 210 576 Q 255 558 305 578 Q 345 560 390 578 L 390 615 L 0 615Z"
        fill="#3A5028" opacity="0.80"/>
      {/* Rolling hills layer 3 - mid green */}
      <path d="M 0 640 Q 55 605 108 624 Q 152 606 198 622 Q 245 604 296 622 Q 342 604 390 622 L 390 650 L 0 650Z"
        fill="#4A6830" opacity="0.88"/>
      {/* Foreground meadow */}
      <path d="M 0 680 Q 80 656 160 670 Q 230 654 310 668 Q 355 658 390 666 L 390 720 L 0 720Z"
        fill="#5A7A38" opacity="0.92"/>
      {/* Oak tree silhouette right */}
      <rect x="298" y="498" width="14" height="210" rx="5" fill="#1A0C08" opacity="0.88"/>
      {/* Main trunk curves */}
      <path d="M 305 508 Q 295 480 280 460 Q 265 440 278 428" fill="none" stroke="#1A0C08" strokeWidth="10" strokeLinecap="round"/>
      <path d="M 305 508 Q 318 482 332 468 Q 346 454 338 440" fill="none" stroke="#1A0C08" strokeWidth="8" strokeLinecap="round"/>
      {/* Main canopy */}
      <ellipse cx="305" cy="410" rx="58" ry="52" fill="#1A1008" opacity="0.90"/>
      <ellipse cx="278" cy="440" rx="42" ry="36" fill="#1A1008" opacity="0.85"/>
      <ellipse cx="335" cy="438" rx="40" ry="34" fill="#1A1008" opacity="0.85"/>
      <ellipse cx="305" cy="380" rx="44" ry="38" fill="#201408" opacity="0.82"/>
      <ellipse cx="268" cy="418" rx="32" ry="28" fill="#1A1008" opacity="0.80"/>
      <ellipse cx="342" cy="416" rx="30" ry="26" fill="#1A1008" opacity="0.80"/>
      {/* Tree silhouette hint of leaves catching light */}
      <ellipse cx="295" cy="388" rx="22" ry="18" fill="#2A2010" opacity="0.35"/>
      <ellipse cx="320" cy="392" rx="18" ry="14" fill="#2A2010" opacity="0.30"/>
      {/* Left smaller tree */}
      <rect x="58" y="558" width="8" height="150" rx="3" fill="#1A0C08" opacity="0.82"/>
      <ellipse cx="62" cy="520" rx="34" ry="42" fill="#1A1008" opacity="0.85"/>
      <ellipse cx="44" cy="540" rx="26" ry="30" fill="#1A1008" opacity="0.80"/>
      <ellipse cx="80" cy="540" rx="24" ry="28" fill="#1A1008" opacity="0.80"/>
      {/* Stone path center */}
      <path d="M 155 844 Q 175 760 184 680 Q 188 624 192 560 Q 193 530 195 505"
        fill="none" stroke="#C8A870" strokeWidth="28" opacity="0.38"/>
      <path d="M 230 844 Q 212 760 204 680 Q 200 624 197 560 Q 196 530 195 505"
        fill="none" stroke="#C8A870" strokeWidth="28" opacity="0.38"/>
      {/* Path stones */}
      {[[182,780,28,16],[190,740,22,13],[188,700,20,12],[191,660,18,11],[192,630,16,10],
        [193,600,14,9],[194,575,12,8]].map(([x,y,w,h],i) => (
        <ellipse key={i} cx={x+(i%2)*10+w/2} cy={y} rx={w/2} ry={h/2} fill="#B89050" opacity={0.35+i*0.03}/>
      ))}
      {/* Path edge grasses */}
      {[650,680,710,740,770,800,830].map((y,i) => [160,205].map((bx,j) => (
        <path key={`${i}-${j}`} d={`M ${bx+(j?15:-15)} ${y} Q ${bx+(j?18:-18)} ${y-12} ${bx+(j?12:-12)} ${y-20}`}
          fill="none" stroke="#4A6828" strokeWidth="2" opacity="0.40"/>
      )))}
      {/* Birds V formation upper right */}
      {[[288,98],[298,90],[308,84],[318,90],[328,98]].map(([x,y],i) => (
        <path key={i} d={`M ${x-6} ${y} Q ${x} ${y-5} ${x+6} ${y}`} fill="none" stroke="#2A1040" strokeWidth="1.8" opacity="0.55">
          <animateTransform attributeName="transform" type="translate"
            values={`0,0; -${4+i},${-2+i%2}`} dur={`${8+i*0.6}s`} repeatCount="indefinite" additive="sum"/>
        </path>
      ))}
      {/* Horizon mist layers */}
      <rect x="0" y="490" width="390" height="30" fill="#9060D0" opacity="0.08" filter="url(#p-blur)"/>
      {/* Ground grass detail */}
      <rect x="0" y="700" width="390" height="144" fill="#4A6A30" opacity="0.35"/>
      {[710,724,738,752,766,780,794,808,822,836].map((y,i) => (
        <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="#3A5820" strokeWidth="1" opacity="0.12"/>
      ))}
      <rect width="390" height="844" fill="url(#p-vig)"/>
    </svg>
  );
}
