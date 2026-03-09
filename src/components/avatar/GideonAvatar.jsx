/**
 * GideonAvatar — uses the real reference PNG image as the character.
 * Animated SVG layers handle: halo, orbs, sparkles, rings, ripples.
 * CSS animations handle: float/bounce/lean/sway, glow, mouth pulse overlay.
 * States: idle | speaking | listening | thinking
 */
import React, { useEffect, useRef, useState } from 'react';
import gideonImg from '@/assets/gideon-avatar.png';

const GOLD      = '#C9A227';
const GOLD_PALE = '#F8EBA0';
const GOLD_BRT  = '#F0D060';

const ORBS = [
  {id:0,  cx:108, cy:52,  r:11,  gold:true,  dl:0.00, dur:3.2},
  {id:1,  cx:154, cy:32,  r:14,  gold:false, dl:0.40, dur:2.8},
  {id:2,  cx:74,  cy:68,  r:8,   gold:false, dl:0.80, dur:3.6},
  {id:3,  cx:184, cy:54,  r:10,  gold:true,  dl:0.20, dur:2.6},
  {id:4,  cx:130, cy:20,  r:9,   gold:false, dl:1.10, dur:3.0},
  {id:5,  cx:202, cy:80,  r:7,   gold:true,  dl:0.60, dur:4.0},
  {id:6,  cx:62,  cy:92,  r:9,   gold:false, dl:1.40, dur:3.4},
  {id:7,  cx:168, cy:84,  r:8,   gold:true,  dl:0.90, dur:2.9},
  {id:8,  cx:88,  cy:26,  r:7,   gold:true,  dl:1.70, dur:3.8},
  {id:9,  cx:144, cy:62,  r:6,   gold:false, dl:0.50, dur:2.5},
  {id:10, cx:214, cy:108, r:5,   gold:true,  dl:1.20, dur:3.3},
  {id:11, cx:50,  cy:108, r:6,   gold:false, dl:0.30, dur:3.7},
];

const STARS = [
  {cx:140, cy:46,  sz:5,   dl:0.30},
  {cx:80,  cy:38,  sz:4,   dl:1.00},
  {cx:190, cy:64,  sz:4.5, dl:0.70},
  {cx:116, cy:70,  sz:3.5, dl:1.50},
  {cx:164, cy:40,  sz:3,   dl:0.90},
  {cx:62,  cy:58,  sz:3,   dl:0.55},
];

export default function GideonAvatar({
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 300,
  height      = 340,
  className   = '',
}) {
  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'idle';

  /* Speaking mouth pulse (0..1) */
  const [mouthPulse, setMouthPulse] = useState(0);
  const mouthRef = useRef(null);
  useEffect(() => {
    if (!isSpeaking) { setMouthPulse(0); return; }
    let ph = 0;
    mouthRef.current = setInterval(() => {
      ph += 0.38;
      setMouthPulse(Math.max(0, Math.sin(ph) * 0.9));
    }, 72);
    return () => clearInterval(mouthRef.current);
  }, [isSpeaking]);

  /* Blink overlay */
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

  /* Animation params per state */
  const imgAnim   = state === 'speaking'  ? 'ga-speak'
                  : state === 'listening' ? 'ga-lean'
                  : state === 'thinking'  ? 'ga-sway'
                  : 'ga-float';
  const imgDur    = state === 'speaking'  ? '0.55s'
                  : state === 'listening' ? '1.5s'
                  : state === 'thinking'  ? '2.8s'
                  : '3.8s';
  const glowOp    = state === 'speaking'  ? 0.85
                  : state === 'listening' ? 0.55
                  : state === 'thinking'  ? 0.40 : 0.26;
  const orbAnim   = state === 'speaking'  ? 'ga-orb-f' : 'ga-orb';
  const orbMul    = state === 'speaking'  ? 0.34 : 1;

  /* Percentage positions of facial features within the PNG
     (PNG is ~606×605; head occupies roughly the top 55% of the figure)
     These values position overlays relative to the rendered img element */
  // Eye centers as % of img dimensions (approx from reference):
  // Left eye:  ~38% across, ~28% down
  // Right eye: ~60% across, ~28% down
  // Mouth center: ~49% across, ~40% down
  const eyeLX  = 37,  eyeLY  = 28.5;
  const eyeRX  = 61,  eyeRY  = 28.5;
  const mouthX = 49,  mouthY = 39.5;
  const mouthW = 14,  mouthH = 4.5;

  return (
    <div className={className} style={{ width, height, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        /* Gentle float — no heavy vertical travel */
        @keyframes ga-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          45%     { transform: translateY(-7px) rotate(.4deg); }
          75%     { transform: translateY(-5px) rotate(-.3deg); }
        }
        /* Speaking — reduced bounce amplitude */
        @keyframes ga-speak {
          0%,100% { transform: translateY(-1px) scale(1.000); }
          25%     { transform: translateY(-5px) scale(1.018); }
          50%     { transform: translateY(-1px) scale(1.000); }
          75%     { transform: translateY(-5px) scale(1.018); }
        }
        @keyframes ga-lean {
          0%,100% { transform: translateY(-4px) rotate(0deg); }
          35%     { transform: translateY(-9px)  rotate(1.5deg); }
          70%     { transform: translateY(-8px)  rotate(-1.5deg); }
        }
        @keyframes ga-sway {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-4px) rotate(2deg); }
          75%     { transform: translateY(-4px) rotate(-2deg); }
        }
        @keyframes ga-orb {
          0%,100% { transform:translateY(0) scale(1);    opacity:.86; }
          50%     { transform:translateY(-8px) scale(1.1); opacity:1; }
        }
        @keyframes ga-orb-f {
          0%,100% { transform:translateY(0) scale(.94);   opacity:.80; }
          50%     { transform:translateY(-10px) scale(1.16); opacity:1; }
        }
        @keyframes ga-star {
          0%,100% { opacity:.08; transform:scale(.45) rotate(0deg); }
          50%     { opacity:.95; transform:scale(1.5)  rotate(45deg); }
        }
        @keyframes ga-ripple {
          0%   { transform:scale(1);   opacity:.50; }
          100% { transform:scale(1.9); opacity:0; }
        }
        @keyframes ga-dot {
          0%,80%,100% { opacity:.15; transform:translateY(0); }
          40%         { opacity:1;   transform:translateY(-5px); }
        }
        @keyframes ga-halo {
          0%,100% { opacity: var(--gh, .26); transform:scale(1); }
          50%     { opacity: calc(var(--gh, .26) + .16); transform:scale(1.05); }
        }
        @keyframes ga-cw  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ga-ccw { from{transform:rotate(0)} to{transform:rotate(-360deg)} }
        @keyframes ga-glow-speak {
          0%,100% { filter: brightness(1.04) drop-shadow(0 0 10px rgba(201,162,39,.50)); }
          30%     { filter: brightness(1.18) drop-shadow(0 0 28px rgba(201,162,39,.95)); }
        }
        @keyframes ga-glow-idle {
          0%,100% { filter: brightness(1); }
          50%     { filter: brightness(1.06); }
        }
      `}</style>

      {/* ── SVG layer: halo + rings + orbs + stars (z-index behind image) ── */}
      <svg
        viewBox="0 0 260 340"
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          overflow: 'visible', pointerEvents: 'none',
        }}
      >
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

        {/* Ambient halo */}
        <ellipse cx="130" cy="210" rx="90" ry="118"
          fill="url(#ga-halo)"
          style={{ '--gh': glowOp, transformOrigin: '130px 210px', animation: 'ga-halo 3.2s ease-in-out infinite' }}
        />

        {/* Listening ripples */}
        {state === 'listening' && [0,1,2].map(i => (
          <ellipse key={i} cx="130" cy="210" rx="94" ry="124"
            fill="none" stroke={GOLD_PALE} strokeWidth="1.5"
            style={{ transformOrigin:'130px 210px', animation:'ga-ripple 2.0s ease-out infinite', animationDelay:`${i*0.65}s` }}
          />
        ))}

        {/* Spinner rings */}
        <circle cx="130" cy="110" r="88" fill="none" stroke={GOLD_PALE} strokeWidth=".55" strokeDasharray="10 13"
          opacity={state === 'speaking' ? .48 : .14}
          style={{ transformOrigin:'130px 110px', animation:`ga-cw ${state==='speaking'?'3.5s':'13s'} linear infinite` }}
        />
        <circle cx="130" cy="110" r="72" fill="none" stroke={GOLD} strokeWidth=".4" strokeDasharray="5 18"
          opacity={state === 'idle' ? .10 : .20}
          style={{ transformOrigin:'130px 110px', animation:`ga-ccw ${state==='speaking'?'5s':'20s'} linear infinite` }}
        />

        {/* Orbs */}
        {ORBS.map(o => {
          const dur = state === 'speaking' ? (o.dur * orbMul).toFixed(1) + 's' : o.dur + 's';
          return (
            <g key={o.id} style={{ transformOrigin:`${o.cx}px ${o.cy}px`, animation:`${orbAnim} ${dur} ease-in-out infinite`, animationDelay:`${o.dl}s` }}>
              <ellipse cx={o.cx+2} cy={o.cy+2} rx={o.r*1.1} ry={o.r*.85} fill={o.gold?'#604800':'#504020'} opacity=".30"/>
              <circle  cx={o.cx}   cy={o.cy}   r={o.r} fill={o.gold ? 'url(#ga-og)' : 'url(#ga-ot)'}/>
              <ellipse cx={o.cx-o.r*.3} cy={o.cy-o.r*.32} rx={o.r*.36} ry={o.r*.24}
                fill="white" opacity=".55" transform={`rotate(-26,${o.cx-o.r*.3},${o.cy-o.r*.32})`}/>
            </g>
          );
        })}

        {/* Stars */}
        {STARS.map(s => (
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{ transformOrigin:'0 0', animation:`ga-star ${state==='speaking'?'0.82s':'2.6s'} ease-in-out infinite`, animationDelay:`${s.dl}s` }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke={GOLD_BRT} strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${a})`}/>
            ))}
            <circle r="1.3" fill={GOLD_BRT} opacity=".85"/>
          </g>
        ))}
      </svg>

      {/* ── Image + overlays wrapper (animated together) ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        animation: `${imgAnim} ${imgDur} ease-in-out infinite`,
      }}>
        {/* The actual Gideon image */}
        <img
          src={gideonImg}
          alt="Gideon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            display: 'block',
            animation: state === 'speaking'
              ? 'ga-glow-speak 0.55s ease-in-out infinite'
              : 'ga-glow-idle 3.8s ease-in-out infinite',
          }}
        />

        {/* ── Eye blink overlay ── */}
        {blink && (
          <>
            {/* Left eye closed */}
            <div style={{
              position: 'absolute',
              left:   `${eyeLX - 5}%`,
              top:    `${eyeLY - 1.8}%`,
              width:  '10%',
              height: '3.5%',
              background: '#C07848',
              borderRadius: '50%',
            }}/>
            {/* Right eye closed */}
            <div style={{
              position: 'absolute',
              left:   `${eyeRX - 5}%`,
              top:    `${eyeRY - 1.8}%`,
              width:  '10%',
              height: '3.5%',
              background: '#C07848',
              borderRadius: '50%',
            }}/>
          </>
        )}

        {/* ── Mouth open/close overlay when speaking ── */}
        {isSpeaking && mouthPulse > 0.05 && (
          <div style={{
            position:     'absolute',
            left:         `${mouthX - mouthW/2}%`,
            top:          `${mouthY}%`,
            width:        `${mouthW}%`,
            height:       `${mouthH * mouthPulse}%`,
            background:   'radial-gradient(ellipse at 50% 30%, #3A1208 0%, #1A0600 100%)',
            borderRadius: '50%',
            opacity:      mouthPulse * 0.88,
          }}/>
        )}
      </div>

      {/* ── Thinking dots (outside animated wrapper so they don't bob) ── */}
      {state === 'thinking' && (
        <div style={{ position:'absolute', bottom:8, display:'flex', gap:12 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:12, height:12, borderRadius:'50%',
              background: GOLD,
              animation: 'ga-dot 1.1s ease-in-out infinite',
              animationDelay: `${i*0.24}s`,
            }}/>
          ))}
        </div>
      )}
    </div>
  );
}
