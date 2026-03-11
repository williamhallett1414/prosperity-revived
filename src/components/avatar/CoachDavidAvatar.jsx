/**
 * CoachDavidAvatar — real PNG image + animated SVG/CSS layers.
 * Mirrors GideonAvatar / ChefDanielAvatar architecture exactly.
 * Color palette: sky blue (#38BDF8) + gold (#C9A227) matching Coach David's brand.
 * States: idle | speaking | listening | thinking
 */
import React, { useEffect, useRef, useState } from 'react';

import coachImg from '@/assets/coach-david-avatar.png';

const BLUE      = '#38BDF8';
const BLUE_PALE = '#bae6fd';
const BLUE_MID  = '#0ea5e9';
const GOLD      = '#C9A227';
const GOLD_BRT  = '#F0D060';

const ORBS = [
  {id:0,  cx:108, cy:50,  r:10, blue:true,  dl:0.00, dur:3.2},
  {id:1,  cx:154, cy:30,  r:13, blue:false, dl:0.40, dur:2.8},
  {id:2,  cx:72,  cy:66,  r:7,  blue:false, dl:0.80, dur:3.6},
  {id:3,  cx:186, cy:52,  r:10, blue:true,  dl:0.20, dur:2.6},
  {id:4,  cx:130, cy:18,  r:8,  blue:true,  dl:1.10, dur:3.0},
  {id:5,  cx:204, cy:78,  r:6,  blue:false, dl:0.60, dur:4.0},
  {id:6,  cx:60,  cy:90,  r:8,  blue:false, dl:1.40, dur:3.4},
  {id:7,  cx:170, cy:82,  r:7,  blue:true,  dl:0.90, dur:2.9},
  {id:8,  cx:86,  cy:24,  r:6,  blue:false, dl:1.70, dur:3.8},
  {id:9,  cx:146, cy:60,  r:5,  blue:true,  dl:0.50, dur:2.5},
  {id:10, cx:216, cy:106, r:5,  blue:false, dl:1.20, dur:3.3},
  {id:11, cx:48,  cy:108, r:6,  blue:true,  dl:0.30, dur:3.7},
];

const STARS = [
  {cx:138, cy:44,  sz:5,   dl:0.30},
  {cx:78,  cy:36,  sz:4,   dl:1.00},
  {cx:192, cy:62,  sz:4.5, dl:0.70},
  {cx:114, cy:68,  sz:3.5, dl:1.50},
  {cx:166, cy:38,  sz:3,   dl:0.90},
  {cx:60,  cy:56,  sz:3,   dl:0.55},
];

const BURST_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export default function CoachDavidAvatar({
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 360,
  height      = 420,
  className   = '',
}) {
  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'idle';

  const [bursts, setBursts] = useState([]);
  const burstRef = useRef(null);
  const burstId  = useRef(0);
  useEffect(() => {
    if (!isSpeaking) { setBursts([]); return; }
    const spawn = () => {
      const angle = BURST_ANGLES[Math.floor(Math.random() * BURST_ANGLES.length)]
                  + (Math.random() - 0.5) * 24;
      const id = burstId.current++;
      setBursts(prev => [...prev.slice(-14), { id, angle, born: Date.now() }]);
      burstRef.current = setTimeout(spawn, 220 + Math.random() * 200);
    };
    burstRef.current = setTimeout(spawn, 150);
    return () => clearTimeout(burstRef.current);
  }, [isSpeaking]);

  useEffect(() => {
    if (!bursts.length) return;
    const t = setTimeout(() => {
      const now = Date.now();
      setBursts(prev => prev.filter(b => now - b.born < 900));
    }, 200);
    return () => clearTimeout(t);
  }, [bursts]);

  const glowOp  = state === 'speaking' ? 0.92 : state === 'listening' ? 0.55 : state === 'thinking' ? 0.40 : 0.24;
  const orbFast = state === 'speaking';

  /* Coach David face positions — head is higher up, more athletic build */

  return (
    <div className={className} style={{ width, height, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
        @keyframes cvd-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          40%     { transform: translateY(-7px) rotate(.4deg); }
          72%     { transform: translateY(-5px) rotate(-.3deg); }
        }
        @keyframes cvd-speak {
          0%   { transform: translateY(-2px) rotate(0deg)    translateX(0px)  scale(1.000); }
          15%  { transform: translateY(-5px) rotate(-1.4deg) translateX(-3px) scale(1.012); }
          30%  { transform: translateY(-3px) rotate(0deg)    translateX(0px)  scale(1.020); }
          45%  { transform: translateY(-5px) rotate(1.6deg)  translateX(3px)  scale(1.018); }
          60%  { transform: translateY(-2px) rotate(0deg)    translateX(0px)  scale(1.010); }
          75%  { transform: translateY(-5px) rotate(-1.2deg) translateX(-2px) scale(1.004); }
          90%  { transform: translateY(-3px) rotate(.5deg)   translateX(1px)  scale(1.001); }
          100% { transform: translateY(-2px) rotate(0deg)    translateX(0px)  scale(1.000); }
        }
          15%  { transform: translateY(-5px) rotate(-1.4deg) translateX(-3px); }
          30%  { transform: translateY(-3px) rotate(0deg)    translateX(0px); }
          45%  { transform: translateY(-5px) rotate(1.6deg)  translateX(3px); }
          60%  { transform: translateY(-2px) rotate(0deg)    translateX(0px); }
          75%  { transform: translateY(-5px) rotate(-1.2deg) translateX(-2px); }
          90%  { transform: translateY(-3px) rotate(.5deg)   translateX(1px); }
          100% { transform: translateY(-2px) rotate(0deg)    translateX(0px); }
        }
          35%     { transform: scale(1.022); }
          65%     { transform: scale(1.010); }
        }
        @keyframes cvd-lean {
          0%,100% { transform: translateY(-4px) rotate(0deg); }
          35%     { transform: translateY(-9px) rotate(1.5deg); }
          70%     { transform: translateY(-8px) rotate(-1.5deg); }
        }
        @keyframes cvd-sway {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-4px) rotate(2deg); }
          75%     { transform: translateY(-4px) rotate(-2deg); }
        }
        @keyframes cvd-orb {
          0%,100% { transform:translateY(0) scale(1);       opacity:.86; }
          50%     { transform:translateY(-8px) scale(1.10); opacity:1; }
        }
        @keyframes cvd-orb-f {
          0%,100% { transform:translateY(0px) scale(.95);    opacity:.82; }
          25%     { transform:translateY(-12px) scale(1.20); opacity:1; }
          75%     { transform:translateY(-6px) scale(1.10);  opacity:.95; }
        }
        @keyframes cvd-star {
          0%,100% { opacity:.08; transform:scale(.45) rotate(0deg); }
          50%     { opacity:.95; transform:scale(1.50) rotate(45deg); }
        }
        @keyframes cvd-halo {
          0%,100% { opacity:var(--gh,.24); transform:scale(1); }
          50%     { opacity:calc(var(--gh,.24) + .18); transform:scale(1.06); }
        }
        @keyframes cvd-halo-spk {
          0%,100% { opacity:.70; transform:scale(1.00); }
          25%     { opacity:.97; transform:scale(1.11); }
          50%     { opacity:.78; transform:scale(1.04); }
          75%     { opacity:.95; transform:scale(1.10); }
        }
        @keyframes cvd-cw  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes cvd-ccw { from{transform:rotate(0)} to{transform:rotate(-360deg)} }
        @keyframes cvd-wave {
          0%   { transform:scale(.65); opacity:.72; }
          100% { transform:scale(1.85); opacity:0; }
        }
        @keyframes cvd-burst {
          0%   { transform:translate(0,0) scale(1);    opacity:.95; }
          60%  { opacity:.70; }
          100% { transform:translate(var(--bx), var(--by)) scale(0.3); opacity:0; }
        }
        @keyframes cvd-glow-spk {
          0%,100% { filter: brightness(1.06) drop-shadow(0 0 12px rgba(56,189,248,.55)) drop-shadow(0 0 5px rgba(186,230,253,.35)); }
          25%     { filter: brightness(1.28) drop-shadow(0 0 36px rgba(56,189,248,.95)) drop-shadow(0 0 16px rgba(186,230,253,.70)); }
          55%     { filter: brightness(1.12) drop-shadow(0 0 18px rgba(56,189,248,.65)) drop-shadow(0 0 6px rgba(186,230,253,.38)); }
        }
        @keyframes cvd-glow-idle {
          0%,100% { filter: brightness(1.00); }
          50%     { filter: brightness(1.06); }
        }
        @keyframes cvd-ripple {
          0%   { transform:scale(1);   opacity:.50; }
          100% { transform:scale(1.9); opacity:0; }
        }
        @keyframes cvd-dot {
          0%,80%,100% { opacity:.15; transform:translateY(0); }
          40%         { opacity:1;   transform:translateY(-5px); }
        }
      `}</style>

      {/* SVG background layer */}
      <svg viewBox="0 0 260 340"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none' }}>
        <defs>
          <radialGradient id="cvd-halo-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={BLUE_PALE} stopOpacity=".90"/>
            <stop offset="38%"  stopColor={BLUE}      stopOpacity=".38"/>
            <stop offset="100%" stopColor={BLUE}      stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cvd-ob" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={BLUE_PALE}/>
            <stop offset="50%"  stopColor={BLUE}/>
            <stop offset="100%" stopColor={BLUE_MID}/>
          </radialGradient>
          <radialGradient id="cvd-og" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={GOLD_BRT}/>
            <stop offset="50%"  stopColor={GOLD}/>
            <stop offset="100%" stopColor="#7A5A00"/>
          </radialGradient>
        </defs>

        {/* Halo */}
        <ellipse cx="130" cy="210" rx="92" ry="120"
          fill="url(#cvd-halo-g)"
          style={{
            '--gh': glowOp,
            transformOrigin:'130px 210px',
            animation: state==='speaking' ? 'cvd-halo-spk 1.4s ease-in-out infinite' : 'cvd-halo 3.2s ease-in-out infinite',
          }}
        />

        {/* Sound-wave rings */}
        {state === 'speaking' && [0,1,2,3].map(i => (
          <ellipse key={i} cx="130" cy="200" rx="62" ry="70"
            fill="none" stroke={BLUE_PALE} strokeWidth={1.8 - i*0.3}
            style={{ transformOrigin:'130px 200px', animation:'cvd-wave 1.8s ease-out infinite', animationDelay:`${i*0.32}s`, opacity:0 }}
          />
        ))}

        {/* Listening ripples */}
        {state === 'listening' && [0,1,2].map(i => (
          <ellipse key={i} cx="130" cy="210" rx="94" ry="124"
            fill="none" stroke={BLUE_PALE} strokeWidth="1.5"
            style={{ transformOrigin:'130px 210px', animation:'cvd-ripple 2.0s ease-out infinite', animationDelay:`${i*0.65}s` }}
          />
        ))}

        {/* Spinner rings */}
        <circle cx="130" cy="110" r="88" fill="none" stroke={BLUE_PALE} strokeWidth=".6"
          strokeDasharray="10 13"
          opacity={state==='speaking' ? .52 : .13}
          style={{ transformOrigin:'130px 110px', animation:`cvd-cw ${state==='speaking'?'4.5s':'13s'} linear infinite` }}
        />
        <circle cx="130" cy="110" r="72" fill="none" stroke={BLUE} strokeWidth=".45"
          strokeDasharray="5 18"
          opacity={state==='idle' ? .10 : .20}
          style={{ transformOrigin:'130px 110px', animation:`cvd-ccw ${state==='speaking'?'6s':'20s'} linear infinite` }}
        />

        {/* Burst particles */}
        {bursts.map(b => {
          const rad  = b.angle * Math.PI / 180;
          const dist = 55 + Math.random() * 35;
          const bx   = Math.cos(rad) * dist;
          const by   = Math.sin(rad) * dist;
          const sz   = 3 + Math.random() * 5;
          return (
            <circle key={b.id} cx="130" cy="185" r={sz}
              fill={Math.random() > 0.45 ? BLUE_PALE : GOLD_BRT}
              style={{ '--bx':`${bx}px`, '--by':`${by}px`, animation:'cvd-burst 0.80s ease-out forwards', transformOrigin:'130px 185px' }}
            />
          );
        })}

        {/* Orbs */}
        {ORBS.map(o => {
          const dur = orbFast ? (o.dur * 0.55).toFixed(1)+'s' : o.dur+'s';
          return (
            <g key={o.id} style={{ transformOrigin:`${o.cx}px ${o.cy}px`, animation:`${orbFast?'cvd-orb-f':'cvd-orb'} ${dur} ease-in-out infinite`, animationDelay:`${o.dl}s` }}>
              <ellipse cx={o.cx+2} cy={o.cy+2} rx={o.r*1.1} ry={o.r*.85}
                fill={o.blue ? '#082040' : '#604800'} opacity=".28"/>
              <circle cx={o.cx} cy={o.cy} r={o.r} fill={o.blue ? 'url(#cvd-ob)' : 'url(#cvd-og)'}/>
              <ellipse cx={o.cx-o.r*.3} cy={o.cy-o.r*.32} rx={o.r*.36} ry={o.r*.24}
                fill="white" opacity=".55" transform={`rotate(-26,${o.cx-o.r*.3},${o.cy-o.r*.32})`}/>
            </g>
          );
        })}

        {/* Stars */}
        {STARS.map(s => (
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{ transformOrigin:'0 0', animation:`cvd-star 1.2s':'2.6s'} ease-in-out infinite`, animationDelay:`${s.dl}s` }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke={BLUE_PALE} strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${a})`}/>
            ))}
            <circle r="1.3" fill={BLUE_PALE} opacity=".88"/>
          </g>
        ))}
      </svg>

      {/* Image + face overlays — clipped+zoomed */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:2, pointerEvents:'none' }}>
      <div style={{
        position:'relative', width:'100%', height:'100%',
        transform: 'scale(2.2)', transformOrigin: 'center top',
        animation: state==='speaking'
          ? 'cvd-speak 2.4s ease-in-out infinite'
          : state==='listening' ? 'cvd-lean 1.5s ease-in-out infinite'
          : state==='thinking'  ? 'cvd-sway 2.8s ease-in-out infinite'
          : 'cvd-float 3.8s ease-in-out infinite',
      }}>
        <img
          src={coachImg}
          alt="Coach David"
          draggable={false}
          style={{
            width:'100%', height:'100%',
            objectFit:'contain', objectPosition:'center bottom',
            display:'block', userSelect:'none',
            animation: state==='speaking'
              ? 'cvd-glow-spk 1.4s ease-in-out infinite'
              : 'cvd-glow-idle 3.8s ease-in-out infinite',
          }}
        />

        </div>
      </div>
      {/* ── EQ visualizer when speaking ── */}
      {isSpeaking && (
        <div style={{ position:'absolute', bottom:18, left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'flex-end', gap:3, height:28, pointerEvents:'none', zIndex:20 }}>
          {[0,1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              width:4, borderRadius:2,
              background:'#38BDF8',
              opacity:0.88,
              animation:`cvd-eq ${0.6 + (i % 3) * 0.12}s ease-in-out infinite`,
              animationDelay:`${i * 0.09}s`,
            }}/>
          ))}
        </div>
      )}

      {/* ── Thinking dots ── */}
      {state === 'thinking' && (
        <div style={{ position:'absolute', bottom:6, display:'flex', gap:12, pointerEvents:'none' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:11, height:11, borderRadius:'50%', background:'#38BDF8',
              animation:`cvd-dot 1.1s ease-in-out infinite`, animationDelay:`${i*0.24}s`,
            }}/>
          ))}
        </div>
      )}
    </div>
  );
}