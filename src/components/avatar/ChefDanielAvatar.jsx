/**
 * ChefDanielAvatar — real PNG image + animated SVG/CSS layers.
 * Mirrors GideonAvatar architecture exactly.
 * Color palette: green (#22c55e) + gold (#C9A227) matching Chef Daniel's brand.
 * States: idle | speaking | listening | thinking
 */
import React, { useEffect, useRef, useState } from 'react';
import chefImg from '@/assets/chef-daniel-avatar.png';

const GREEN      = '#22c55e';
const GREEN_PALE = '#bbf7d0';
const GREEN_MID  = '#16a34a';
const GOLD       = '#C9A227';
const GOLD_PALE  = '#F8EBA0';
const GOLD_BRT   = '#F0D060';

/* Orbs — mix of green and gold matching Chef Daniel's apron colors */
const ORBS = [
  {id:0,  cx:108, cy:50,  r:10, green:true,  dl:0.00, dur:3.2},
  {id:1,  cx:154, cy:30,  r:13, green:false, dl:0.40, dur:2.8},
  {id:2,  cx:72,  cy:66,  r:7,  green:false, dl:0.80, dur:3.6},
  {id:3,  cx:186, cy:52,  r:10, green:true,  dl:0.20, dur:2.6},
  {id:4,  cx:130, cy:18,  r:8,  green:true,  dl:1.10, dur:3.0},
  {id:5,  cx:204, cy:78,  r:6,  green:false, dl:0.60, dur:4.0},
  {id:6,  cx:60,  cy:90,  r:8,  green:false, dl:1.40, dur:3.4},
  {id:7,  cx:170, cy:82,  r:7,  green:true,  dl:0.90, dur:2.9},
  {id:8,  cx:86,  cy:24,  r:6,  green:false, dl:1.70, dur:3.8},
  {id:9,  cx:146, cy:60,  r:5,  green:true,  dl:0.50, dur:2.5},
  {id:10, cx:216, cy:106, r:5,  green:false, dl:1.20, dur:3.3},
  {id:11, cx:48,  cy:108, r:6,  green:true,  dl:0.30, dur:3.7},
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

export default function ChefDanielAvatar({
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
      ph += 0.32;
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
      }, 2000 + Math.random() * 4000);
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

  const glowOp  = state === 'speaking' ? 0.90 : state === 'listening' ? 0.55 : state === 'thinking' ? 0.40 : 0.24;
  const orbFast = state === 'speaking';

  /* Chef Daniel facial feature positions (% of image) */
  /* Head is larger/higher — chef hat adds height */
  const eyeLX = 44, eyeLY = 29, eyeRX = 53, eyeRY = 29;
  const mouthX = 49, mouthY = 34;
  const mouthW = 2.5 + mouthOpen * 4.0;
  const mouthH = 0.5 + mouthOpen * 2.0;

  return (
    <div className={className} style={{ width, height, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
        @keyframes cd-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          40%     { transform: translateY(-7px) rotate(.4deg); }
          72%     { transform: translateY(-5px) rotate(-.3deg); }
        }
        @keyframes cd-speak {
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
        @keyframes cd-lean {
          0%,100% { transform: translateY(-4px) rotate(0deg); }
          35%     { transform: translateY(-9px) rotate(1.5deg); }
          70%     { transform: translateY(-8px) rotate(-1.5deg); }
        }
        @keyframes cd-sway {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-4px) rotate(2deg); }
          75%     { transform: translateY(-4px) rotate(-2deg); }
        }
        @keyframes cd-orb {
          0%,100% { transform:translateY(0) scale(1);       opacity:.86; }
          50%     { transform:translateY(-8px) scale(1.10); opacity:1; }
        }
        @keyframes cd-orb-f {
          0%,100% { transform:translateY(0px) scale(.95);    opacity:.82; }
          25%     { transform:translateY(-12px) scale(1.20); opacity:1; }
          75%     { transform:translateY(-6px) scale(1.10);  opacity:.95; }
        }
        @keyframes cd-star {
          0%,100% { opacity:.08; transform:scale(.45) rotate(0deg); }
          50%     { opacity:.95; transform:scale(1.50) rotate(45deg); }
        }
        @keyframes cd-halo {
          0%,100% { opacity:var(--gh,.24); transform:scale(1); }
          50%     { opacity:calc(var(--gh,.24) + .18); transform:scale(1.06); }
        }
        @keyframes cd-halo-spk {
          0%,100% { opacity:.70; transform:scale(1.00); }
          25%     { opacity:.96; transform:scale(1.10); }
          50%     { opacity:.78; transform:scale(1.03); }
          75%     { opacity:.94; transform:scale(1.09); }
        }
        @keyframes cd-cw  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes cd-ccw { from{transform:rotate(0)} to{transform:rotate(-360deg)} }
        @keyframes cd-wave {
          0%   { transform:scale(.65); opacity:.70; }
          100% { transform:scale(1.80); opacity:0; }
        }
        @keyframes cd-burst {
          0%   { transform:translate(0,0) scale(1);    opacity:.95; }
          60%  { opacity:.70; }
          100% { transform:translate(var(--bx), var(--by)) scale(0.3); opacity:0; }
        }
        @keyframes cd-glow-spk {
          0%,100% { filter: brightness(1.06) drop-shadow(0 0 12px rgba(34,197,94,.50)) drop-shadow(0 0 4px rgba(192,255,160,.3)); }
          25%     { filter: brightness(1.26) drop-shadow(0 0 34px rgba(34,197,94,.90)) drop-shadow(0 0 14px rgba(192,255,160,.6)); }
          55%     { filter: brightness(1.11) drop-shadow(0 0 16px rgba(34,197,94,.62)) drop-shadow(0 0 5px rgba(192,255,160,.32)); }
        }
        @keyframes cd-glow-idle {
          0%,100% { filter: brightness(1.00); }
          50%     { filter: brightness(1.06); }
        }
        @keyframes cd-ripple {
          0%   { transform:scale(1);   opacity:.50; }
          100% { transform:scale(1.9); opacity:0; }
        }
        @keyframes cd-dot {
          0%,80%,100% { opacity:.15; transform:translateY(0); }
          40%         { opacity:1;   transform:translateY(-5px); }
        }
      `}</style>

      {/* ── SVG background: halo + rings + orbs + stars + waves + bursts ── */}
      <svg viewBox="0 0 260 340"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none' }}>
        <defs>
          <radialGradient id="cd-halo-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={GREEN_PALE} stopOpacity=".90"/>
            <stop offset="38%"  stopColor={GREEN}      stopOpacity=".38"/>
            <stop offset="100%" stopColor={GREEN}      stopOpacity="0"/>
          </radialGradient>
          {/* Green orb */}
          <radialGradient id="cd-og" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={GREEN_PALE}/>
            <stop offset="50%"  stopColor={GREEN}/>
            <stop offset="100%" stopColor={GREEN_MID}/>
          </radialGradient>
          {/* Gold orb */}
          <radialGradient id="cd-ot" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={GOLD_BRT}/>
            <stop offset="50%"  stopColor={GOLD}/>
            <stop offset="100%" stopColor="#7A5A00"/>
          </radialGradient>
        </defs>

        {/* Halo */}
        <ellipse cx="130" cy="210" rx="92" ry="120"
          fill="url(#cd-halo-g)"
          style={{
            '--gh': glowOp,
            transformOrigin:'130px 210px',
            animation: state==='speaking' ? 'cd-halo-spk 1.4s ease-in-out infinite' : 'cd-halo 3.2s ease-in-out infinite',
          }}
        />

        {/* Sound-wave rings when speaking */}
        {state === 'speaking' && [0,1,2,3].map(i => (
          <ellipse key={i} cx="130" cy="200" rx="62" ry="70"
            fill="none" stroke={GREEN_PALE} strokeWidth={1.8 - i*0.3}
            style={{ transformOrigin:'130px 200px', animation:'cd-wave 1.8s ease-out infinite', animationDelay:`${i*0.35}s`, opacity:0 }}
          />
        ))}

        {/* Listening ripples */}
        {state === 'listening' && [0,1,2].map(i => (
          <ellipse key={i} cx="130" cy="210" rx="94" ry="124"
            fill="none" stroke={GREEN_PALE} strokeWidth="1.5"
            style={{ transformOrigin:'130px 210px', animation:'cd-ripple 2.0s ease-out infinite', animationDelay:`${i*0.65}s` }}
          />
        ))}

        {/* Spinner rings */}
        <circle cx="130" cy="110" r="88" fill="none" stroke={GREEN_PALE} strokeWidth=".6"
          strokeDasharray="10 13"
          opacity={state==='speaking' ? .50 : .13}
          style={{ transformOrigin:'130px 110px', animation:`cd-cw ${state==='speaking'?'4.5s':'13s'} linear infinite` }}
        />
        <circle cx="130" cy="110" r="72" fill="none" stroke={GREEN} strokeWidth=".45"
          strokeDasharray="5 18"
          opacity={state==='idle' ? .10 : .20}
          style={{ transformOrigin:'130px 110px', animation:`cd-ccw ${state==='speaking'?'6s':'20s'} linear infinite` }}
        />

        {/* Burst particles */}
        {bursts.map(b => {
          const rad  = b.angle * Math.PI / 180;
          const dist = 55 + Math.random() * 30;
          const bx   = Math.cos(rad) * dist;
          const by   = Math.sin(rad) * dist;
          const sz   = 3 + Math.random() * 5;
          const useGreen = Math.random() > 0.45;
          return (
            <circle key={b.id} cx="130" cy="185" r={sz}
              fill={useGreen ? GREEN_PALE : GOLD_BRT}
              style={{ '--bx':`${bx}px`, '--by':`${by}px`, animation:'cd-burst 0.85s ease-out forwards', transformOrigin:'130px 185px' }}
            />
          );
        })}

        {/* Orbs */}
        {ORBS.map(o => {
          const dur = orbFast ? (o.dur * 0.55).toFixed(1)+'s' : o.dur+'s';
          return (
            <g key={o.id} style={{ transformOrigin:`${o.cx}px ${o.cy}px`, animation:`${orbFast?'cd-orb-f':'cd-orb'} ${dur} ease-in-out infinite`, animationDelay:`${o.dl}s` }}>
              <ellipse cx={o.cx+2} cy={o.cy+2} rx={o.r*1.1} ry={o.r*.85}
                fill={o.green ? '#0a4020' : '#604800'} opacity=".28"/>
              <circle cx={o.cx} cy={o.cy} r={o.r}
                fill={o.green ? 'url(#cd-og)' : 'url(#cd-ot)'}/>
              <ellipse cx={o.cx-o.r*.3} cy={o.cy-o.r*.32} rx={o.r*.36} ry={o.r*.24}
                fill="white" opacity=".55" transform={`rotate(-26,${o.cx-o.r*.3},${o.cy-o.r*.32})`}/>
            </g>
          );
        })}

        {/* Stars */}
        {STARS.map(s => (
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{ transformOrigin:'0 0', animation:`cd-star 1.2s':'2.6s'} ease-in-out infinite`, animationDelay:`${s.dl}s` }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke={GREEN_PALE} strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${a})`}/>
            ))}
            <circle r="1.3" fill={GREEN_PALE} opacity=".88"/>
          </g>
        ))}
      </svg>

      {/* ── Image + face overlays — clipped+zoomed ── */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:2, pointerEvents:'none' }}>
      <div style={{
        position:'relative', width:'100%', height:'100%',
        animation: state==='speaking'
          ? 'cd-speak 2.4s ease-in-out infinite'
          : state==='listening' ? 'cd-lean 1.5s ease-in-out infinite'
          : state==='thinking'  ? 'cd-sway 2.8s ease-in-out infinite'
          : 'cd-float 3.8s ease-in-out infinite',
      }}>
        <img
          src={chefImg}
          alt="Chef Daniel"
          draggable={false}
          style={{
            width:'100%', height:'100%',
            objectFit:'contain', objectPosition:'center bottom',
            display:'block', userSelect:'none',
            animation: state==='speaking'
              ? 'cd-glow-spk 1.4s ease-in-out infinite'
              : 'cd-glow-idle 3.8s ease-in-out infinite',
          }}
        />

        {/* Eye blink overlay */}
        {blink && (<>
          <div style={{ position:'absolute', left:`${eyeLX-2.5}%`, top:`${eyeLY-1.75}%`, width:'5%', height:'3.5%',
            background:'linear-gradient(to bottom, #8C4E20, #A86030)', borderRadius:'50%', opacity:.90 }}/>
          <div style={{ position:'absolute', left:`${eyeRX-2.5}%`, top:`${eyeRY-1.75}%`, width:'5%', height:'3.5%',
            background:'linear-gradient(to bottom, #8C4E20, #A86030)', borderRadius:'50%', opacity:.90 }}/>
        </>)}

        {/* Eye glow when speaking */}
        {state==='speaking' && !blink && (<>
          <div style={{ position:'absolute', left:`${eyeLX-3.5}%`, top:`${eyeLY-2.5}%`, width:'7%', height:'5%',
            background:`radial-gradient(ellipse, ${GREEN_PALE}50 0%, transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', left:`${eyeRX-3.5}%`, top:`${eyeRY-2.5}%`, width:'7%', height:'5%',
            background:`radial-gradient(ellipse, ${GREEN_PALE}50 0%, transparent 70%)`, borderRadius:'50%', pointerEvents:'none' }}/>
        </>)}

        {/* Mouth overlay */}
        {isSpeaking && mouthOpen > 0.04 && (
          <div style={{
            position:'absolute',
            left:`${mouthX - mouthW/2}%`, top:`${mouthY}%`,
            width:`${mouthW}%`, height:`${mouthH}%`,
            borderRadius:'50%', overflow:'hidden',
            opacity: 0.80 + mouthOpen * 0.14,
          }}>
            <div style={{ position:'absolute', inset:0,
              background:'radial-gradient(ellipse at 50% 35%, #1A0600 0%, #2E0C06 55%, #4A1A0A 100%)',
              borderRadius:'50%' }}/>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'28%',
              background:'linear-gradient(to bottom, rgba(140,50,20,0.7), transparent)',
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
            <div key={i} style={{ width:11, height:11, borderRadius:'50%', background:GREEN,
              animation:'cd-dot 1.1s ease-in-out infinite', animationDelay:`${i*0.24}s` }}/>
          ))}
        </div>
      )}
    </div>
  );
}
