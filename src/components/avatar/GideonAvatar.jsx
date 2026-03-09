/**
 * GideonAvatar v4 — improved speaking animation
 * • Realistic mouth: 3-layer overlay (cavity + teeth + lip) driven by 2 sin waves
 * • Body: gentle sway + subtle breath pulse (no heavy bounce)
 * • Sound ripples emanate from mouth when speaking
 * • Gold energy particles burst outward when speaking
 * • Orbs orbit faster + scatter during speech
 * • Halo pulses brighter in sync with speech amplitude
 * States: idle | speaking | listening | thinking
 */
import React, { useEffect, useRef, useState } from 'react';
import gideonImg from '@/assets/gideon-avatar.png';

const GOLD      = '#C9A227';
const GOLD_PALE = '#F8EBA0';
const GOLD_BRT  = '#F0D060';

const ORBS = [
  {id:0,  cx:108, cy:52,  r:11, gold:true,  dl:0.00, dur:3.2},
  {id:1,  cx:154, cy:32,  r:14, gold:false, dl:0.40, dur:2.8},
  {id:2,  cx:74,  cy:68,  r:8,  gold:false, dl:0.80, dur:3.6},
  {id:3,  cx:184, cy:54,  r:10, gold:true,  dl:0.20, dur:2.6},
  {id:4,  cx:130, cy:20,  r:9,  gold:false, dl:1.10, dur:3.0},
  {id:5,  cx:202, cy:80,  r:7,  gold:true,  dl:0.60, dur:4.0},
  {id:6,  cx:62,  cy:92,  r:9,  gold:false, dl:1.40, dur:3.4},
  {id:7,  cx:168, cy:84,  r:8,  gold:true,  dl:0.90, dur:2.9},
  {id:8,  cx:88,  cy:26,  r:7,  gold:true,  dl:1.70, dur:3.8},
  {id:9,  cx:144, cy:62,  r:6,  gold:false, dl:0.50, dur:2.5},
  {id:10, cx:214, cy:108, r:5,  gold:true,  dl:1.20, dur:3.3},
  {id:11, cx:50,  cy:108, r:6,  gold:false, dl:0.30, dur:3.7},
];

const STARS = [
  {cx:140, cy:46,  sz:5,   dl:0.30},
  {cx:80,  cy:38,  sz:4,   dl:1.00},
  {cx:190, cy:64,  sz:4.5, dl:0.70},
  {cx:116, cy:70,  sz:3.5, dl:1.50},
  {cx:164, cy:40,  sz:3,   dl:0.90},
  {cx:62,  cy:58,  sz:3,   dl:0.55},
];

/* Particles that shoot out when speaking */
const PARTICLES = [
  {id:0, angle:-70, dist:62, sz:4,  dl:0.00},
  {id:1, angle:-40, dist:55, sz:3,  dl:0.18},
  {id:2, angle:-10, dist:68, sz:5,  dl:0.06},
  {id:3, angle: 15, dist:58, sz:3.5,dl:0.24},
  {id:4, angle: 45, dist:64, sz:4,  dl:0.12},
  {id:5, angle:-55, dist:80, sz:2.5,dl:0.30},
  {id:6, angle: 25, dist:75, sz:3,  dl:0.08},
  {id:7, angle:-25, dist:52, sz:4.5,dl:0.20},
];

export default function GideonAvatar({
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 320,
  height      = 380,
  className   = '',
}) {
  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'idle';

  /* ── Speech amplitude: two independent sin waves for natural variation ── */
  const [amp1, setAmp1] = useState(0);  // primary open/close
  const [amp2, setAmp2] = useState(0);  // secondary width variation
  const [amp3, setAmp3] = useState(0);  // halo brightness sync
  const speechRef = useRef(null);
  useEffect(() => {
    if (!isSpeaking) {
      setAmp1(0); setAmp2(0); setAmp3(0);
      return;
    }
    let ph1 = 0, ph2 = 0, ph3 = 0;
    speechRef.current = setInterval(() => {
      ph1 += 0.42;   // ~2.8 Hz  — primary syllable rate
      ph2 += 0.27;   // ~1.8 Hz  — slower jaw movement
      ph3 += 0.18;   // ~1.2 Hz  — slow energy pulse
      setAmp1(Math.max(0, Math.sin(ph1) * 0.95));
      setAmp2(Math.max(0, Math.sin(ph2) * 0.7 + Math.sin(ph1 * 1.6) * 0.3));
      setAmp3(Math.max(0, Math.sin(ph3) * 0.8));
    }, 65);
    return () => clearInterval(speechRef.current);
  }, [isSpeaking]);

  /* ── Blink ── */
  const [blink, setBlink] = useState(false);
  const blinkRef = useRef(null);
  useEffect(() => {
    const go = () => {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); go(); }, 140);
      }, 2200 + Math.random() * 3800);
    };
    go();
    return () => clearTimeout(blinkRef.current);
  }, []);

  /* ── Ripple counter: new ripple every ~0.6s while speaking ── */
  const [ripples, setRipples] = useState([]);
  const rippleRef = useRef(null);
  const rippleId  = useRef(0);
  useEffect(() => {
    if (!isSpeaking) { setRipples([]); return; }
    rippleRef.current = setInterval(() => {
      const id = ++rippleId.current;
      setRipples(r => [...r.slice(-3), { id, ts: Date.now() }]);
      setTimeout(() => setRipples(r => r.filter(x => x.id !== id)), 1200);
    }, 600);
    return () => clearInterval(rippleRef.current);
  }, [isSpeaking]);

  /* derived halo opacity synced to speech */
  const glowOp = state === 'speaking'
    ? 0.55 + amp3 * 0.45          // 0.55–1.0 pulsing
    : state === 'listening' ? 0.55
    : state === 'thinking'  ? 0.40 : 0.26;

  /* Facial feature % positions in the PNG */
  const eyeLX = 37,  eyeLY = 28.5;
  const eyeRX = 61,  eyeRY = 28.5;
  /* Mouth — center of the mouth region in the image */
  const mouthCX = 49,  mouthCY = 40.5;
  const mouthBW = 13;   /* base width % */
  const mouthBH = 4.0;  /* base max height % */

  /* Derived mouth dimensions */
  const openH   = mouthBH * amp1;                        // cavity height
  const widthPc = mouthBW * (1 + amp2 * 0.18);           // slight width variation
  const teethH  = openH * 0.45;                          // teeth strip

  return (
    <div className={className} style={{ width, height, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
        /* Idle float */
        @keyframes ga-float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          45%     { transform: translateY(-7px) rotate(.4deg); }
          75%     { transform: translateY(-5px) rotate(-.3deg); }
        }
        /* Speaking — gentle sway + breath, minimal vertical */
        @keyframes ga-speak-sway {
          0%   { transform: translateY(0)   rotate(0deg)    scaleX(1); }
          15%  { transform: translateY(-3px) rotate(.6deg)  scaleX(1.008); }
          30%  { transform: translateY(-2px) rotate(-.3deg) scaleX(1); }
          50%  { transform: translateY(-4px) rotate(.5deg)  scaleX(1.010); }
          70%  { transform: translateY(-2px) rotate(-.4deg) scaleX(1.005); }
          85%  { transform: translateY(-3px) rotate(.3deg)  scaleX(1.007); }
          100% { transform: translateY(0)   rotate(0deg)    scaleX(1); }
        }
        /* Listening lean */
        @keyframes ga-lean {
          0%,100% { transform: translateY(-4px) rotate(0deg); }
          35%     { transform: translateY(-9px)  rotate(1.5deg); }
          70%     { transform: translateY(-8px)  rotate(-1.5deg); }
        }
        /* Thinking sway */
        @keyframes ga-sway {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-4px) rotate(2deg); }
          75%     { transform: translateY(-4px) rotate(-2deg); }
        }
        /* Orb idle */
        @keyframes ga-orb {
          0%,100% { transform:translateY(0) scale(1);     opacity:.86; }
          50%     { transform:translateY(-8px) scale(1.1); opacity:1; }
        }
        /* Orb speaking — quick scatter */
        @keyframes ga-orb-speak {
          0%   { transform:translateY(0)    scale(1)    rotate(0deg);   opacity:.82; }
          20%  { transform:translateY(-12px) scale(1.18) rotate(8deg);  opacity:1; }
          50%  { transform:translateY(-6px)  scale(.95) rotate(-5deg);  opacity:.88; }
          80%  { transform:translateY(-14px) scale(1.22) rotate(10deg); opacity:1; }
          100% { transform:translateY(0)    scale(1)    rotate(0deg);   opacity:.82; }
        }
        /* Star sparkle */
        @keyframes ga-star {
          0%,100% { opacity:.08; transform:scale(.45) rotate(0deg); }
          50%     { opacity:.95; transform:scale(1.5)  rotate(45deg); }
        }
        /* Listening ripple */
        @keyframes ga-ripple {
          0%   { transform:scale(1);   opacity:.50; }
          100% { transform:scale(1.9); opacity:0; }
        }
        /* Mouth sound ripple — small rings from mouth */
        @keyframes ga-mouth-ripple {
          0%   { transform:scale(0.4); opacity:.70; }
          100% { transform:scale(2.2); opacity:0; }
        }
        /* Speaking particles shoot outward */
        @keyframes ga-particle {
          0%   { transform:translate(0,0) scale(1);    opacity:.90; }
          60%  { opacity:.75; }
          100% { transform:translate(var(--px),var(--py)) scale(0); opacity:0; }
        }
        /* Thinking dots */
        @keyframes ga-dot {
          0%,80%,100% { opacity:.15; transform:translateY(0); }
          40%         { opacity:1;   transform:translateY(-5px); }
        }
        /* Halo breathe */
        @keyframes ga-halo {
          0%,100% { opacity: var(--gh, .26); transform:scale(1); }
          50%     { opacity: calc(var(--gh, .26) + .16); transform:scale(1.05); }
        }
        /* Ring spinners */
        @keyframes ga-cw  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ga-ccw { from{transform:rotate(0)} to{transform:rotate(-360deg)} }
        /* Image glow — speaking: warm gold radiance */
        @keyframes ga-glow-idle {
          0%,100% { filter: brightness(1)    drop-shadow(0 0 0px transparent); }
          50%     { filter: brightness(1.05) drop-shadow(0 2px 8px rgba(201,162,39,.20)); }
        }
      `}</style>

      {/* ── SVG layer (behind image) ── */}
      <svg viewBox="0 0 260 340"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none' }}>
        <defs>
          <radialGradient id="ga-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={GOLD_PALE} stopOpacity=".92"/>
            <stop offset="40%"  stopColor={GOLD}      stopOpacity=".42"/>
            <stop offset="100%" stopColor={GOLD}      stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ga-og" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={GOLD_BRT}/>
            <stop offset="50%"  stopColor={GOLD}/>
            <stop offset="100%" stopColor="#7A5A00"/>
          </radialGradient>
          <radialGradient id="ga-ot" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor="#ECD4AE"/>
            <stop offset="55%"  stopColor="#C4A882"/>
            <stop offset="100%" stopColor="#6A5030"/>
          </radialGradient>
        </defs>

        {/* Halo — synced opacity to speech amplitude */}
        <ellipse cx="130" cy="210" rx="90" ry="118" fill="url(#ga-halo)"
          style={{ '--gh': glowOp, transformOrigin:'130px 210px', animation:'ga-halo 3.2s ease-in-out infinite' }}/>

        {/* Listening ripples */}
        {state === 'listening' && [0,1,2].map(i => (
          <ellipse key={i} cx="130" cy="210" rx="94" ry="124"
            fill="none" stroke={GOLD_PALE} strokeWidth="1.5"
            style={{ transformOrigin:'130px 210px', animation:'ga-ripple 2.0s ease-out infinite', animationDelay:`${i*0.65}s` }}/>
        ))}

        {/* Spinner rings — faster + brighter when speaking */}
        <circle cx="130" cy="110" r="88" fill="none" stroke={GOLD_PALE} strokeWidth=".6"
          strokeDasharray="10 13"
          opacity={state==='speaking' ? .55 : .14}
          style={{ transformOrigin:'130px 110px', animation:`ga-cw ${state==='speaking'?'3s':'13s'} linear infinite` }}/>
        <circle cx="130" cy="110" r="72" fill="none" stroke={GOLD} strokeWidth=".45"
          strokeDasharray="5 18"
          opacity={state==='speaking' ? .35 : .10}
          style={{ transformOrigin:'130px 110px', animation:`ga-ccw ${state==='speaking'?'4.5s':'20s'} linear infinite` }}/>

        {/* Orbs */}
        {ORBS.map(o => {
          const anim = state === 'speaking' ? 'ga-orb-speak' : 'ga-orb';
          const dur  = state === 'speaking'
            ? (o.dur * 0.30 + o.dl * 0.08).toFixed(2) + 's'
            : o.dur + 's';
          return (
            <g key={o.id} style={{ transformOrigin:`${o.cx}px ${o.cy}px`, animation:`${anim} ${dur} ease-in-out infinite`, animationDelay:`${o.dl}s` }}>
              <ellipse cx={o.cx+2} cy={o.cy+2} rx={o.r*1.1} ry={o.r*.85} fill={o.gold?'#604800':'#504020'} opacity=".28"/>
              <circle  cx={o.cx}   cy={o.cy}   r={o.r} fill={o.gold?'url(#ga-og)':'url(#ga-ot)'}/>
              <ellipse cx={o.cx-o.r*.3} cy={o.cy-o.r*.32} rx={o.r*.36} ry={o.r*.24}
                fill="white" opacity=".55" transform={`rotate(-26,${o.cx-o.r*.3},${o.cy-o.r*.32})`}/>
            </g>
          );
        })}

        {/* Stars */}
        {STARS.map(s => (
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{ transformOrigin:'0 0', animation:`ga-star ${state==='speaking'?'0.75s':'2.6s'} ease-in-out infinite`, animationDelay:`${s.dl}s` }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke={GOLD_BRT} strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${a})`}/>
            ))}
            <circle r="1.3" fill={GOLD_BRT} opacity=".85"/>
          </g>
        ))}
      </svg>

      {/* ── Image + face overlay wrapper ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        animation: state === 'speaking'  ? 'ga-speak-sway 1.8s ease-in-out infinite'
                 : state === 'listening' ? 'ga-lean 1.5s ease-in-out infinite'
                 : state === 'thinking'  ? 'ga-sway 2.8s ease-in-out infinite'
                 : 'ga-float 3.8s ease-in-out infinite',
      }}>

        {/* Image */}
        <img src={gideonImg} alt="Gideon" style={{
          width:'100%', height:'100%',
          objectFit:'contain', objectPosition:'center bottom',
          display:'block',
          filter: state === 'speaking'
            ? `brightness(${1.06 + amp3 * 0.12}) drop-shadow(0 0 ${8 + amp3*22}px rgba(201,162,39,${0.35 + amp3*0.65}))`
            : 'brightness(1) drop-shadow(0 2px 8px rgba(201,162,39,.15))',
          transition: 'filter 0.06s linear',
        }}/>

        {/* ── Blink overlay ── */}
        {blink && (<>
          <div style={{ position:'absolute', left:`${eyeLX-5}%`, top:`${eyeLY-1.8}%`, width:'10%', height:'3.5%', background:'#C07848', borderRadius:'50%' }}/>
          <div style={{ position:'absolute', left:`${eyeRX-5}%`, top:`${eyeRY-1.8}%`, width:'10%', height:'3.5%', background:'#C07848', borderRadius:'50%' }}/>
        </>)}

        {/* ── Mouth overlays (3 layers) ── */}
        {isSpeaking && openH > 0.08 && (<>
          {/* 1. Dark mouth cavity */}
          <div style={{
            position:     'absolute',
            left:         `${mouthCX - widthPc/2}%`,
            top:          `${mouthCY}%`,
            width:        `${widthPc}%`,
            height:       `${openH}%`,
            background:   'radial-gradient(ellipse at 50% 20%, #2A0E04 0%, #100400 100%)',
            borderRadius: '40% 40% 55% 55%',
            opacity:      Math.min(1, amp1 * 1.2),
          }}/>
          {/* 2. Teeth strip (upper) */}
          {teethH > 0.15 && (
            <div style={{
              position:     'absolute',
              left:         `${mouthCX - widthPc * 0.38}%`,
              top:          `${mouthCY}%`,
              width:        `${widthPc * 0.76}%`,
              height:       `${teethH}%`,
              background:   'linear-gradient(to bottom, #FEFDF8, #E8E0D0)',
              borderRadius: '30% 30% 10% 10%',
              opacity:      Math.min(1, amp1 * 1.4),
            }}/>
          )}
          {/* 3. Lower lip shadow — darker ellipse at bottom of cavity */}
          <div style={{
            position:     'absolute',
            left:         `${mouthCX - widthPc * 0.44}%`,
            top:          `${mouthCY + openH * 0.6}%`,
            width:        `${widthPc * 0.88}%`,
            height:       `${openH * 0.45}%`,
            background:   '#B05530',
            borderRadius: '50%',
            opacity:      amp1 * 0.55,
          }}/>
        </>)}

        {/* ── Mouth sound ripples (CSS-rendered circles) ── */}
        {ripples.map(rp => (
          <div key={rp.id} style={{
            position:     'absolute',
            left:         `${mouthCX - 6}%`,
            top:          `${mouthCY - 3}%`,
            width:        '12%',
            height:       '6%',
            border:       `1.5px solid ${GOLD_PALE}`,
            borderRadius: '50%',
            pointerEvents:'none',
            animation:    'ga-mouth-ripple 1.1s ease-out forwards',
          }}/>
        ))}

        {/* ── Speaking particles ── */}
        {isSpeaking && PARTICLES.map(p => {
          const rad = p.angle * Math.PI / 180;
          const px  = (Math.cos(rad) * p.dist).toFixed(1) + 'px';
          const py  = (Math.sin(rad) * p.dist - 20).toFixed(1) + 'px';
          return (
            <div key={p.id} style={{
              position:   'absolute',
              left:       `${mouthCX}%`,
              top:        `${mouthCY}%`,
              width:      `${p.sz}px`,
              height:     `${p.sz}px`,
              borderRadius:'50%',
              background: p.id % 3 === 0 ? GOLD_BRT : p.id % 3 === 1 ? GOLD : GOLD_PALE,
              boxShadow:  `0 0 ${p.sz + 2}px ${GOLD}`,
              '--px':      px,
              '--py':      py,
              animation:  `ga-particle ${(0.8 + p.dl * 1.8).toFixed(2)}s ease-out infinite`,
              animationDelay: `${p.dl}s`,
              pointerEvents:'none',
            }}/>
          );
        })}

      </div>{/* end image wrapper */}

      {/* ── Thinking dots ── */}
      {state === 'thinking' && (
        <div style={{ position:'absolute', bottom:8, display:'flex', gap:12 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:12, height:12, borderRadius:'50%', background:GOLD,
              animation:'ga-dot 1.1s ease-in-out infinite', animationDelay:`${i*0.24}s`,
            }}/>
          ))}
        </div>
      )}
    </div>
  );
}
