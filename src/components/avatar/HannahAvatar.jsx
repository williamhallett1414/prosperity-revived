/**
 * HannahAvatar — real PNG image + animated SVG/CSS layers.
 * Mirrors Gideon/ChefDaniel/CoachDavid/CoachPaul avatar architecture.
 * Color palette: soft blue (#AFC7E3) + lavender (#C4B5FD) + gold (#C9A227)
 * matching Hannah's brand. Gentle, flowing animations for her warm personality.
 * States: idle | speaking | listening | thinking
 */
import React, { useEffect, useRef, useState } from 'react';
import hannahImg from '@/assets/hannah-avatar.png';

const BLUE       = '#AFC7E3';
const BLUE_PALE  = '#dbeafe';
const BLUE_MID   = '#7ab3d4';
const LAVENDER   = '#C4B5FD';
const LAV_PALE   = '#ede9fe';
const GOLD       = '#C9A227';
const GOLD_BRT   = '#F0D060';

const ORBS = [
  {id:0,  cx:108, cy:50,  r:10, blue:true,  dl:0.00, dur:3.6},
  {id:1,  cx:154, cy:30,  r:13, blue:false, dl:0.50, dur:3.0},
  {id:2,  cx:72,  cy:66,  r:7,  blue:false, dl:0.90, dur:3.8},
  {id:3,  cx:186, cy:52,  r:10, blue:true,  dl:0.28, dur:2.8},
  {id:4,  cx:130, cy:18,  r:8,  blue:true,  dl:1.20, dur:3.2},
  {id:5,  cx:204, cy:78,  r:6,  blue:false, dl:0.70, dur:4.2},
  {id:6,  cx:60,  cy:90,  r:8,  blue:false, dl:1.50, dur:3.6},
  {id:7,  cx:170, cy:82,  r:7,  blue:true,  dl:1.00, dur:3.1},
  {id:8,  cx:86,  cy:24,  r:6,  blue:false, dl:1.80, dur:4.0},
  {id:9,  cx:146, cy:60,  r:5,  blue:true,  dl:0.60, dur:2.7},
  {id:10, cx:216, cy:106, r:5,  blue:false, dl:1.30, dur:3.5},
  {id:11, cx:48,  cy:108, r:6,  blue:true,  dl:0.40, dur:3.9},
];

const STARS = [
  {cx:138, cy:44,  sz:5,   dl:0.35},
  {cx:78,  cy:36,  sz:4,   dl:1.10},
  {cx:192, cy:62,  sz:4.5, dl:0.80},
  {cx:114, cy:68,  sz:3.5, dl:1.60},
  {cx:166, cy:38,  sz:3,   dl:1.00},
  {cx:60,  cy:56,  sz:3,   dl:0.65},
];

const BURST_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export default function HannahAvatar({
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 280,
  height      = 320,
  className   = '',
}) {
  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'idle';

  /* Mouth pulse — gentle, softer than male bots */
  const [mouthOpen, setMouthOpen] = useState(0);
  const mouthRef = useRef(null);
  useEffect(() => {
    if (!isSpeaking) { setMouthOpen(0); return; }
    let ph = 0;
    mouthRef.current = setInterval(() => {
      ph += 0.36;
      setMouthOpen(Math.max(0, Math.sin(ph)));
    }, 75);
    return () => clearInterval(mouthRef.current);
  }, [isSpeaking]);

  /* Blink */
  const [blink, setBlink] = useState(false);
  const blinkRef = useRef(null);
  useEffect(() => {
    const go = () => {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); go(); }, 120);
      }, 2200 + Math.random() * 4500);
    };
    go();
    return () => clearTimeout(blinkRef.current);
  }, []);

  /* Burst particles */
  const [bursts, setBursts] = useState([]);
  const burstRef = useRef(null);
  const burstId  = useRef(0);
  useEffect(() => {
    if (!isSpeaking) { setBursts([]); return; }
    const spawn = () => {
      const angle = BURST_ANGLES[Math.floor(Math.random() * BURST_ANGLES.length)]
                  + (Math.random() - 0.5) * 20;
      const id = burstId.current++;
      setBursts(prev => [...prev.slice(-12), { id, angle, born: Date.now() }]);
      burstRef.current = setTimeout(spawn, 150 + Math.random() * 200);
    };
    burstRef.current = setTimeout(spawn, 120);
    return () => clearTimeout(burstRef.current);
  }, [isSpeaking]);

  useEffect(() => {
    if (!bursts.length) return;
    const t = setTimeout(() => {
      const now = Date.now();
      setBursts(prev => prev.filter(b => now - b.born < 1100));
    }, 200);
    return () => clearTimeout(t);
  }, [bursts]);

  const glowOp  = state === 'speaking' ? 0.85 : state === 'listening' ? 0.50 : state === 'thinking' ? 0.36 : 0.20;
  const orbFast = state === 'speaking';

  /* Hannah face positions — slim figure, head at top of image */
  const eyeLX = 45, eyeLY = 24, eyeRX = 53, eyeRY = 24;
  const mouthX = 50, mouthY = 26;
  const mouthW = 5.8 + mouthOpen * 3.8;
  const mouthH = 1.0 + mouthOpen * 2.5;

  return (
    <div className={className} style={{ width, height, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
        @keyframes hn-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          35%     { transform: translateY(-8px) rotate(.5deg); }
          70%     { transform: translateY(-5px) rotate(-.4deg); }
        }
        @keyframes hn-speak-sway {
          0%   { transform: translateY(-2px) rotate(0deg)    translateX(0px); }
          15%  { transform: translateY(-5px) rotate(-1.0deg) translateX(-2px); }
          30%  { transform: translateY(-3px) rotate(0deg)    translateX(0px); }
          45%  { transform: translateY(-5px) rotate(1.2deg)  translateX(2px); }
          60%  { transform: translateY(-2px) rotate(0deg)    translateX(0px); }
          75%  { transform: translateY(-5px) rotate(-0.9deg) translateX(-2px); }
          90%  { transform: translateY(-3px) rotate(.4deg)   translateX(1px); }
          100% { transform: translateY(-2px) rotate(0deg)    translateX(0px); }
        }
        @keyframes hn-speak-breath {
          0%,100% { transform: scale(1.000); }
          35%     { transform: scale(1.016); }
          65%     { transform: scale(1.007); }
        }
        @keyframes hn-lean {
          0%,100% { transform: translateY(-4px) rotate(0deg); }
          35%     { transform: translateY(-10px) rotate(1.6deg); }
          70%     { transform: translateY(-8px) rotate(-1.6deg); }
        }
        @keyframes hn-sway {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-5px) rotate(1.6deg); }
          75%     { transform: translateY(-5px) rotate(-1.6deg); }
        }
        @keyframes hn-orb {
          0%,100% { transform:translateY(0) scale(1);       opacity:.82; }
          50%     { transform:translateY(-9px) scale(1.12); opacity:1; }
        }
        @keyframes hn-orb-f {
          0%,100% { transform:translateY(0px) scale(.94);    opacity:.80; }
          25%     { transform:translateY(-12px) scale(1.18); opacity:1; }
          75%     { transform:translateY(-6px) scale(1.08);  opacity:.92; }
        }
        @keyframes hn-star {
          0%,100% { opacity:.08; transform:scale(.45) rotate(0deg); }
          50%     { opacity:.96; transform:scale(1.55) rotate(45deg); }
        }
        @keyframes hn-halo {
          0%,100% { opacity:var(--gh,.20); transform:scale(1); }
          50%     { opacity:calc(var(--gh,.20) + .15); transform:scale(1.06); }
        }
        @keyframes hn-halo-spk {
          0%,100% { opacity:.65; transform:scale(1.00); }
          25%     { opacity:.90; transform:scale(1.08); }
          50%     { opacity:.72; transform:scale(1.02); }
          75%     { opacity:.88; transform:scale(1.07); }
        }
        @keyframes hn-cw  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes hn-ccw { from{transform:rotate(0)} to{transform:rotate(-360deg)} }
        @keyframes hn-wave {
          0%   { transform:scale(.65); opacity:.65; }
          100% { transform:scale(1.85); opacity:0; }
        }
        @keyframes hn-burst {
          0%   { transform:translate(0,0) scale(1);    opacity:.90; }
          60%  { opacity:.60; }
          100% { transform:translate(var(--bx), var(--by)) scale(0.3); opacity:0; }
        }
        @keyframes hn-glow-spk {
          0%,100% { filter: brightness(1.05) drop-shadow(0 0 10px rgba(175,199,227,.50)) drop-shadow(0 0 5px rgba(196,181,253,.30)); }
          25%     { filter: brightness(1.22) drop-shadow(0 0 30px rgba(175,199,227,.88)) drop-shadow(0 0 14px rgba(196,181,253,.60)); }
          55%     { filter: brightness(1.09) drop-shadow(0 0 14px rgba(175,199,227,.58)) drop-shadow(0 0 6px rgba(196,181,253,.34)); }
        }
        @keyframes hn-glow-idle {
          0%,100% { filter: brightness(1.00); }
          50%     { filter: brightness(1.05); }
        }
        @keyframes hn-ripple {
          0%   { transform:scale(1);   opacity:.46; }
          100% { transform:scale(2.0); opacity:0; }
        }
        @keyframes hn-dot {
          0%,80%,100% { opacity:.15; transform:translateY(0); }
          40%         { opacity:1;   transform:translateY(-5px); }
        }
      `}</style>

      {/* SVG background layer */}
      <svg viewBox="0 0 260 340"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none' }}>
        <defs>
          <radialGradient id="hn-halo-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={BLUE_PALE}  stopOpacity=".85"/>
            <stop offset="30%"  stopColor={LAVENDER}   stopOpacity=".40"/>
            <stop offset="70%"  stopColor={BLUE}       stopOpacity=".20"/>
            <stop offset="100%" stopColor={BLUE}       stopOpacity="0"/>
          </radialGradient>
          {/* Blue orb */}
          <radialGradient id="hn-ob" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={BLUE_PALE}/>
            <stop offset="50%"  stopColor={BLUE}/>
            <stop offset="100%" stopColor={BLUE_MID}/>
          </radialGradient>
          {/* Lavender orb */}
          <radialGradient id="hn-ol" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={LAV_PALE}/>
            <stop offset="50%"  stopColor={LAVENDER}/>
            <stop offset="100%" stopColor="#7C3AED"/>
          </radialGradient>
        </defs>

        {/* Halo — dual-tone blue+lavender for Hannah */}
        <ellipse cx="130" cy="210" rx="92" ry="120"
          fill="url(#hn-halo-g)"
          style={{
            '--gh': glowOp,
            transformOrigin:'130px 210px',
            animation: state==='speaking' ? 'hn-halo-spk 0.90s ease-in-out infinite' : 'hn-halo 3.8s ease-in-out infinite',
          }}
        />

        {/* Sound-wave rings */}
        {state === 'speaking' && [0,1,2,3].map(i => (
          <ellipse key={i} cx="130" cy="200" rx="62" ry="70"
            fill="none" stroke={LAV_PALE} strokeWidth={1.6 - i*0.25}
            style={{ transformOrigin:'130px 200px', animation:'hn-wave 1.6s ease-out infinite', animationDelay:`${i*0.40}s`, opacity:0 }}
          />
        ))}

        {/* Listening ripples */}
        {state === 'listening' && [0,1,2].map(i => (
          <ellipse key={i} cx="130" cy="210" rx="94" ry="124"
            fill="none" stroke={BLUE_PALE} strokeWidth="1.4"
            style={{ transformOrigin:'130px 210px', animation:'hn-ripple 2.4s ease-out infinite', animationDelay:`${i*0.75}s` }}
          />
        ))}

        {/* Spinner rings — gentle, slower than male bots */}
        <circle cx="130" cy="110" r="88" fill="none" stroke={BLUE_PALE} strokeWidth=".6"
          strokeDasharray="8 15"
          opacity={state==='speaking' ? .42 : .11}
          style={{ transformOrigin:'130px 110px', animation:`hn-cw ${state==='speaking'?'3.6s':'16s'} linear infinite` }}
        />
        <circle cx="130" cy="110" r="72" fill="none" stroke={LAVENDER} strokeWidth=".45"
          strokeDasharray="5 20"
          opacity={state==='idle' ? .09 : .17}
          style={{ transformOrigin:'130px 110px', animation:`hn-ccw ${state==='speaking'?'5.2s':'26s'} linear infinite` }}
        />

        {/* Burst particles — softer, more spread */}
        {bursts.map(b => {
          const rad  = b.angle * Math.PI / 180;
          const dist = 45 + Math.random() * 40;
          const bx   = Math.cos(rad) * dist;
          const by   = Math.sin(rad) * dist;
          const sz   = 2.5 + Math.random() * 4.5;
          const useLav = Math.random() > 0.50;
          return (
            <circle key={b.id} cx="130" cy="185" r={sz}
              fill={useLav ? LAV_PALE : BLUE_PALE}
              style={{ '--bx':`${bx}px`, '--by':`${by}px`, animation:'hn-burst 1.05s ease-out forwards', transformOrigin:'130px 185px' }}
            />
          );
        })}

        {/* Orbs — alternating blue and lavender */}
        {ORBS.map(o => {
          const dur = orbFast ? (o.dur * 0.36).toFixed(1)+'s' : o.dur+'s';
          return (
            <g key={o.id} style={{ transformOrigin:`${o.cx}px ${o.cy}px`, animation:`${orbFast?'hn-orb-f':'hn-orb'} ${dur} ease-in-out infinite`, animationDelay:`${o.dl}s` }}>
              <ellipse cx={o.cx+2} cy={o.cy+2} rx={o.r*1.1} ry={o.r*.85}
                fill={o.blue ? '#0a1e38' : '#1a0840'} opacity=".24"/>
              <circle cx={o.cx} cy={o.cy} r={o.r} fill={o.blue ? 'url(#hn-ob)' : 'url(#hn-ol)'}/>
              <ellipse cx={o.cx-o.r*.3} cy={o.cy-o.r*.32} rx={o.r*.36} ry={o.r*.24}
                fill="white" opacity=".58" transform={`rotate(-26,${o.cx-o.r*.3},${o.cy-o.r*.32})`}/>
            </g>
          );
        })}

        {/* Stars */}
        {STARS.map(s => (
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{ transformOrigin:'0 0', animation:`hn-star ${state==='speaking'?'0.80s':'3.0s'} ease-in-out infinite`, animationDelay:`${s.dl}s` }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke={LAV_PALE} strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${a})`}/>
            ))}
            <circle r="1.3" fill={LAV_PALE} opacity=".88"/>
          </g>
        ))}
      </svg>

      {/* Image + face overlays */}
      <div style={{
        position:'relative', width:'100%', height:'100%', overflow:'hidden',
        animation: state==='speaking'
          ? 'hn-speak-sway 2.0s ease-in-out infinite, hn-speak-breath 0.90s ease-in-out infinite'
          : state==='listening' ? 'hn-lean 1.8s ease-in-out infinite'
          : state==='thinking'  ? 'hn-sway 3.2s ease-in-out infinite'
          : 'hn-float 4.2s ease-in-out infinite',
      }}>
        <img
          src={hannahImg}
          alt="Hannah"
          draggable={false}
          style={{
            width:'100%', height:'100%',
            objectFit:'contain', objectPosition:'center bottom',
            display:'block', userSelect:'none',
            animation: state==='speaking'
              ? 'hn-glow-spk 0.90s ease-in-out infinite'
              : 'hn-glow-idle 4.2s ease-in-out infinite',
          }}
        />

        {/* Eye blink — skin tone matching her complexion */}
        {blink && (<>
          <div style={{ position:'absolute', left:`${eyeLX-5.5}%`, top:`${eyeLY-2}%`, width:'11%', height:'4%',
            background:'linear-gradient(to bottom, #6B3A1F, #8B5030)', borderRadius:'50%', opacity:.88 }}/>
          <div style={{ position:'absolute', left:`${eyeRX-5.5}%`, top:`${eyeRY-2}%`, width:'11%', height:'4%',
            background:'linear-gradient(to bottom, #6B3A1F, #8B5030)', borderRadius:'50%', opacity:.88 }}/>
        </>)}

        {/* Eye glow when speaking — soft blue/lavender blend */}
        {state==='speaking' && !blink && (<>
          <div style={{ position:'absolute', left:`${eyeLX-6}%`, top:`${eyeLY-3}%`, width:'13%', height:'8%',
            background:`radial-gradient(ellipse, ${LAV_PALE}60 0%, transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', left:`${eyeRX-6}%`, top:`${eyeRY-3}%`, width:'13%', height:'8%',
            background:`radial-gradient(ellipse, ${LAV_PALE}60 0%, transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }}/>
        </>)}

        {/* Mouth overlay — smaller, feminine proportions */}
        {isSpeaking && mouthOpen > 0.04 && (
          <div style={{
            position:'absolute',
            left:`${mouthX - mouthW/2}%`, top:`${mouthY}%`,
            width:`${mouthW}%`, height:`${mouthH}%`,
            borderRadius:'50%', overflow:'hidden',
            opacity: 0.75 + mouthOpen * 0.18,
          }}>
            <div style={{ position:'absolute', inset:0,
              background:'radial-gradient(ellipse at 50% 35%, #1A0600 0%, #2E0C06 55%, #4A1A0A 100%)',
              borderRadius:'50%' }}/>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'28%',
              background:'linear-gradient(to bottom, rgba(140,60,30,0.65), transparent)',
              borderRadius:'50% 50% 0 0' }}/>
            <div style={{ position:'absolute', bottom:0, left:'15%', right:'15%', height:'22%',
              background:'rgba(210,120,90,0.28)', borderRadius:'0 0 50% 50%' }}/>
          </div>
        )}
      </div>

      {/* Thinking dots — lavender */}
      {state === 'thinking' && (
        <div style={{ position:'absolute', bottom:6, display:'flex', gap:10, pointerEvents:'none' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:LAVENDER,
              animation:'hn-dot 1.3s ease-in-out infinite', animationDelay:`${i*0.28}s` }}/>
          ))}
        </div>
      )}
    </div>
  );
}
