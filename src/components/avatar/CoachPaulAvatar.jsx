/**
 * CoachPaulAvatar — real PNG image + animated SVG/CSS layers.
 * Mirrors Gideon/ChefDaniel/CoachDavid avatar architecture exactly.
 * Color palette: violet (#A78BFA) + gold (#C9A227) matching Coach Paul's brand.
 * States: idle | speaking | listening | thinking
 */
import React, { useEffect, useRef, useState } from 'react';
import paulImg from '@/assets/coach-paul-avatar.png';

const VIOLET      = '#A78BFA';
const VIOLET_PALE = '#ddd6fe';
const VIOLET_MID  = '#7C3AED';
const GOLD        = '#C9A227';
const GOLD_BRT    = '#F0D060';

const ORBS = [
  {id:0,  cx:108, cy:50,  r:10, violet:true,  dl:0.00, dur:3.4},
  {id:1,  cx:154, cy:30,  r:13, violet:false, dl:0.45, dur:2.9},
  {id:2,  cx:72,  cy:66,  r:7,  violet:false, dl:0.85, dur:3.7},
  {id:3,  cx:186, cy:52,  r:10, violet:true,  dl:0.25, dur:2.7},
  {id:4,  cx:130, cy:18,  r:8,  violet:true,  dl:1.15, dur:3.1},
  {id:5,  cx:204, cy:78,  r:6,  violet:false, dl:0.65, dur:4.1},
  {id:6,  cx:60,  cy:90,  r:8,  violet:false, dl:1.45, dur:3.5},
  {id:7,  cx:170, cy:82,  r:7,  violet:true,  dl:0.95, dur:3.0},
  {id:8,  cx:86,  cy:24,  r:6,  violet:false, dl:1.75, dur:3.9},
  {id:9,  cx:146, cy:60,  r:5,  violet:true,  dl:0.55, dur:2.6},
  {id:10, cx:216, cy:106, r:5,  violet:false, dl:1.25, dur:3.4},
  {id:11, cx:48,  cy:108, r:6,  violet:true,  dl:0.35, dur:3.8},
];

const STARS = [
  {cx:138, cy:44,  sz:5,   dl:0.30},
  {cx:78,  cy:36,  sz:4,   dl:1.05},
  {cx:192, cy:62,  sz:4.5, dl:0.75},
  {cx:114, cy:68,  sz:3.5, dl:1.55},
  {cx:166, cy:38,  sz:3,   dl:0.95},
  {cx:60,  cy:56,  sz:3,   dl:0.60},
];

const BURST_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export default function CoachPaulAvatar({
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 360,
  height      = 420,
  className   = '',
}) {
  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'idle';

  /* Mouth pulse */
  const [mouthOpen, setMouthOpen] = useState(0);
  const mouthRef = useRef(null);
  useEffect(() => {
    if (!isSpeaking) { setMouthOpen(0); return; }
    let ph = 0;
    mouthRef.current = setInterval(() => {
      ph += 0.30;
      setMouthOpen(Math.max(0, Math.sin(ph)));
    }, 55);
    return () => clearInterval(mouthRef.current);
  }, [isSpeaking]);

  /* Blink */
  const [blink, setBlink] = useState(false);
  const blinkRef = useRef(null);
  useEffect(() => {
    const go = () => {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); go(); }, 130);
      }, 2500 + Math.random() * 4000);
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
                  + (Math.random() - 0.5) * 22;
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
      setBursts(prev => prev.filter(b => now - b.born < 1000));
    }, 200);
    return () => clearTimeout(t);
  }, [bursts]);

  const glowOp  = state === 'speaking' ? 0.88 : state === 'listening' ? 0.52 : state === 'thinking' ? 0.38 : 0.22;
  const orbFast = state === 'speaking';

  /* Coach Paul face positions — smaller image (319×329), head sits mid-upper */
  const eyeLX = 44, eyeLY = 40, eyeRX = 59, eyeRY = 40;
  const mouthX = 52, mouthY = 42;
  const mouthW = 11.3 + mouthOpen * 7.5;
  const mouthH = 1.0 + mouthOpen * 5.0;

  return (
    <div className={className} style={{ width, height, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
        @keyframes cp-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          40%     { transform: translateY(-7px) rotate(.4deg); }
          72%     { transform: translateY(-5px) rotate(-.3deg); }
        }
        @keyframes cp-speak-sway {
          0%   { transform: translateY(-2px) rotate(0deg)    translateX(0px); }
          15%  { transform: translateY(-5px) rotate(-1.2deg) translateX(-3px); }
          30%  { transform: translateY(-3px) rotate(0deg)    translateX(0px); }
          45%  { transform: translateY(-5px) rotate(1.4deg)  translateX(3px); }
          60%  { transform: translateY(-2px) rotate(0deg)    translateX(0px); }
          75%  { transform: translateY(-5px) rotate(-1.0deg) translateX(-2px); }
          90%  { transform: translateY(-3px) rotate(.4deg)   translateX(1px); }
          100% { transform: translateY(-2px) rotate(0deg)    translateX(0px); }
        }
        @keyframes cp-speak-breath {
          0%,100% { transform: scale(1.000); }
          35%     { transform: scale(1.018); }
          65%     { transform: scale(1.008); }
        }
        @keyframes cp-lean {
          0%,100% { transform: translateY(-4px) rotate(0deg); }
          35%     { transform: translateY(-9px) rotate(1.4deg); }
          70%     { transform: translateY(-8px) rotate(-1.4deg); }
        }
        @keyframes cp-sway {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-4px) rotate(1.8deg); }
          75%     { transform: translateY(-4px) rotate(-1.8deg); }
        }
        @keyframes cp-orb {
          0%,100% { transform:translateY(0) scale(1);       opacity:.84; }
          50%     { transform:translateY(-8px) scale(1.10); opacity:1; }
        }
        @keyframes cp-orb-f {
          0%,100% { transform:translateY(0px) scale(.95);    opacity:.80; }
          25%     { transform:translateY(-11px) scale(1.18); opacity:1; }
          75%     { transform:translateY(-6px) scale(1.08);  opacity:.94; }
        }
        @keyframes cp-star {
          0%,100% { opacity:.07; transform:scale(.45) rotate(0deg); }
          50%     { opacity:.94; transform:scale(1.50) rotate(45deg); }
        }
        @keyframes cp-halo {
          0%,100% { opacity:var(--gh,.22); transform:scale(1); }
          50%     { opacity:calc(var(--gh,.22) + .16); transform:scale(1.05); }
        }
        @keyframes cp-halo-spk {
          0%,100% { opacity:.68; transform:scale(1.00); }
          25%     { opacity:.94; transform:scale(1.09); }
          50%     { opacity:.75; transform:scale(1.02); }
          75%     { opacity:.92; transform:scale(1.08); }
        }
        @keyframes cp-cw  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes cp-ccw { from{transform:rotate(0)} to{transform:rotate(-360deg)} }
        @keyframes cp-wave {
          0%   { transform:scale(.65); opacity:.68; }
          100% { transform:scale(1.82); opacity:0; }
        }
        @keyframes cp-burst {
          0%   { transform:translate(0,0) scale(1);    opacity:.92; }
          60%  { opacity:.65; }
          100% { transform:translate(var(--bx), var(--by)) scale(0.3); opacity:0; }
        }
        @keyframes cp-glow-spk {
          0%,100% { filter: brightness(1.05) drop-shadow(0 0 12px rgba(167,139,250,.52)) drop-shadow(0 0 5px rgba(221,214,254,.32)); }
          25%     { filter: brightness(1.24) drop-shadow(0 0 34px rgba(167,139,250,.92)) drop-shadow(0 0 14px rgba(221,214,254,.64)); }
          55%     { filter: brightness(1.10) drop-shadow(0 0 16px rgba(167,139,250,.60)) drop-shadow(0 0 6px rgba(221,214,254,.36)); }
        }
        @keyframes cp-glow-idle {
          0%,100% { filter: brightness(1.00); }
          50%     { filter: brightness(1.05); }
        }
        @keyframes cp-ripple {
          0%   { transform:scale(1);   opacity:.48; }
          100% { transform:scale(1.9); opacity:0; }
        }
        @keyframes cp-dot {
          0%,80%,100% { opacity:.15; transform:translateY(0); }
          40%         { opacity:1;   transform:translateY(-5px); }
        }
      `}</style>

      {/* SVG background layer */}
      <svg viewBox="0 0 260 340"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none' }}>
        <defs>
          <radialGradient id="cp-halo-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={VIOLET_PALE} stopOpacity=".88"/>
            <stop offset="38%"  stopColor={VIOLET}      stopOpacity=".36"/>
            <stop offset="100%" stopColor={VIOLET}      stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cp-ov" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={VIOLET_PALE}/>
            <stop offset="50%"  stopColor={VIOLET}/>
            <stop offset="100%" stopColor={VIOLET_MID}/>
          </radialGradient>
          <radialGradient id="cp-og" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={GOLD_BRT}/>
            <stop offset="50%"  stopColor={GOLD}/>
            <stop offset="100%" stopColor="#7A5A00"/>
          </radialGradient>
        </defs>

        {/* Halo */}
        <ellipse cx="130" cy="210" rx="92" ry="120"
          fill="url(#cp-halo-g)"
          style={{
            '--gh': glowOp,
            transformOrigin:'130px 210px',
            animation: state==='speaking' ? 'cp-halo-spk 1.5s ease-in-out infinite' : 'cp-halo 3.5s ease-in-out infinite',
          }}
        />

        {/* Sound-wave rings */}
        {state === 'speaking' && [0,1,2,3].map(i => (
          <ellipse key={i} cx="130" cy="200" rx="62" ry="70"
            fill="none" stroke={VIOLET_PALE} strokeWidth={1.8 - i*0.3}
            style={{ transformOrigin:'130px 200px', animation:'cp-wave 1.9s ease-out infinite', animationDelay:`${i*0.38}s`, opacity:0 }}
          />
        ))}

        {/* Listening ripples */}
        {state === 'listening' && [0,1,2].map(i => (
          <ellipse key={i} cx="130" cy="210" rx="94" ry="124"
            fill="none" stroke={VIOLET_PALE} strokeWidth="1.5"
            style={{ transformOrigin:'130px 210px', animation:'cp-ripple 2.2s ease-out infinite', animationDelay:`${i*0.70}s` }}
          />
        ))}

        {/* Spinner rings — slower/calmer than Coach David, matching Paul's deliberate pace */}
        <circle cx="130" cy="110" r="88" fill="none" stroke={VIOLET_PALE} strokeWidth=".6"
          strokeDasharray="10 13"
          opacity={state==='speaking' ? .46 : .12}
          style={{ transformOrigin:'130px 110px', animation:`cp-cw ${state==='speaking'?'4.5s':'15s'} linear infinite` }}
        />
        <circle cx="130" cy="110" r="72" fill="none" stroke={VIOLET} strokeWidth=".45"
          strokeDasharray="5 18"
          opacity={state==='idle' ? .09 : .18}
          style={{ transformOrigin:'130px 110px', animation:`cp-ccw ${state==='speaking'?'6.5s':'24s'} linear infinite` }}
        />

        {/* Burst particles */}
        {bursts.map(b => {
          const rad  = b.angle * Math.PI / 180;
          const dist = 50 + Math.random() * 32;
          const bx   = Math.cos(rad) * dist;
          const by   = Math.sin(rad) * dist;
          const sz   = 3 + Math.random() * 5;
          return (
            <circle key={b.id} cx="130" cy="185" r={sz}
              fill={Math.random() > 0.45 ? VIOLET_PALE : GOLD_BRT}
              style={{ '--bx':`${bx}px`, '--by':`${by}px`, animation:'cp-burst 0.95s ease-out forwards', transformOrigin:'130px 185px' }}
            />
          );
        })}

        {/* Orbs */}
        {ORBS.map(o => {
          const dur = orbFast ? (o.dur * 0.55).toFixed(1)+'s' : o.dur+'s';
          return (
            <g key={o.id} style={{ transformOrigin:`${o.cx}px ${o.cy}px`, animation:`${orbFast?'cp-orb-f':'cp-orb'} ${dur} ease-in-out infinite`, animationDelay:`${o.dl}s` }}>
              <ellipse cx={o.cx+2} cy={o.cy+2} rx={o.r*1.1} ry={o.r*.85}
                fill={o.violet ? '#1a0840' : '#604800'} opacity=".26"/>
              <circle cx={o.cx} cy={o.cy} r={o.r} fill={o.violet ? 'url(#cp-ov)' : 'url(#cp-og)'}/>
              <ellipse cx={o.cx-o.r*.3} cy={o.cy-o.r*.32} rx={o.r*.36} ry={o.r*.24}
                fill="white" opacity=".52" transform={`rotate(-26,${o.cx-o.r*.3},${o.cy-o.r*.32})`}/>
            </g>
          );
        })}

        {/* Stars */}
        {STARS.map(s => (
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{ transformOrigin:'0 0', animation:`cp-star 1.2s':'2.8s'} ease-in-out infinite`, animationDelay:`${s.dl}s` }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke={VIOLET_PALE} strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${a})`}/>
            ))}
            <circle r="1.3" fill={VIOLET_PALE} opacity=".86"/>
          </g>
        ))}
      </svg>

      {/* Image + face overlays — clipped+zoomed */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:2, pointerEvents:'none' }}>
      <div style={{
        position:'relative', width:'100%', height:'100%',
        animation: state==='speaking'
          ? 'cp-speak-sway 2.6s ease-in-out infinite, cp-speak-breath 1.8s ease-in-out infinite'
          : state==='listening' ? 'cp-lean 1.6s ease-in-out infinite'
          : state==='thinking'  ? 'cp-sway 3.0s ease-in-out infinite'
          : 'cp-float 4.0s ease-in-out infinite',
      }}>
        <img
          src={paulImg}
          alt="Coach Paul"
          draggable={false}
          style={{
            width:'100%', height:'100%',
            objectFit:'contain', objectPosition:'center bottom',
            display:'block', userSelect:'none',
            animation: state==='speaking'
              ? 'cp-glow-spk 1.5s ease-in-out infinite'
              : 'cp-glow-idle 4.0s ease-in-out infinite',
          }}
        />

        {/* Eye blink */}
        {blink && (<>
          <div style={{ position:'absolute', left:`${eyeLX-5.5}%`, top:`${eyeLY-2}%`, width:'11%', height:'4%',
            background:'linear-gradient(to bottom, #8C4E20, #A86030)', borderRadius:'50%', opacity:.90 }}/>
          <div style={{ position:'absolute', left:`${eyeRX-5.5}%`, top:`${eyeRY-2}%`, width:'11%', height:'4%',
            background:'linear-gradient(to bottom, #8C4E20, #A86030)', borderRadius:'50%', opacity:.90 }}/>
        </>)}

        {/* Eye glow when speaking */}
        {state==='speaking' && !blink && (<>
          <div style={{ position:'absolute', left:`${eyeLX-6}%`, top:`${eyeLY-3}%`, width:'12%', height:'7%',
            background:`radial-gradient(ellipse, ${VIOLET_PALE}50 0%, transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', left:`${eyeRX-6}%`, top:`${eyeRY-3}%`, width:'12%', height:'7%',
            background:`radial-gradient(ellipse, ${VIOLET_PALE}50 0%, transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }}/>
        </>)}

        {/* Mouth overlay */}
        {isSpeaking && mouthOpen > 0.04 && (
          <div style={{
            position:'absolute',
            left:`${mouthX - mouthW/2}%`, top:`${mouthY}%`,
            width:`${mouthW}%`, height:`${mouthH}%`,
            borderRadius:'50%', overflow:'hidden',
            opacity: 0.78 + mouthOpen * 0.16,
          }}>
            <div style={{ position:'absolute', inset:0,
              background:'radial-gradient(ellipse at 50% 35%, #1A0600 0%, #2E0C06 55%, #4A1A0A 100%)',
              borderRadius:'50%' }}/>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'28%',
              background:'linear-gradient(to bottom, rgba(120,50,20,0.7), transparent)',
              borderRadius:'50% 50% 0 0' }}/>
            <div style={{ position:'absolute', bottom:0, left:'15%', right:'15%', height:'20%',
              background:'rgba(200,110,70,0.25)', borderRadius:'0 0 50% 50%' }}/>
          </div>
        )}
      </div>

      </div>
      {/* Thinking dots */}
      {state === 'thinking' && (
        <div style={{ position:'absolute', bottom:6, display:'flex', gap:12, pointerEvents:'none' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:11, height:11, borderRadius:'50%', background:VIOLET,
              animation:'cp-dot 1.2s ease-in-out infinite', animationDelay:`${i*0.26}s` }}/>
          ))}
        </div>
      )}
    </div>
  );
}
