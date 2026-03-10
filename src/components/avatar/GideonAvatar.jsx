/**
 * GideonAvatar — real PNG image + rich animated SVG/CSS layers.
 * States: idle | speaking | listening | thinking
 *
 * Speaking improvements:
 *  - Natural figure-8 head sway (not just vertical bounce)
 *  - Layered breath scale pulse
 *  - Sound-wave rings pulsing from chest
 *  - Gold energy burst particles shooting outward
 *  - Improved mouth overlay (wider, two-layer lips)
 *  - Eye brightening overlay
 *  - Faster spinning rings + stronger halo flare
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import gideonImg from '@/assets/gideon-avatar.png';

const GOLD      = '#C9A227';
const GOLD_PALE = '#F8EBA0';
const GOLD_BRT  = '#F0D060';

/* Orbs around Gideon's head */
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

/* Burst particle angles — spread evenly around the figure */
const BURST_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export default function GideonAvatar({
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 280,
  height      = 320,
  className   = '',
}) {
  const state = isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'idle';

  /* ── Mouth open/close (sin wave 0..1) ── */
  const [mouthOpen, setMouthOpen] = useState(0);
  const mouthRef = useRef(null);
  useEffect(() => {
    if (!isSpeaking) { setMouthOpen(0); return; }
    let ph = 0;
    mouthRef.current = setInterval(() => {
      ph += 0.40;
      setMouthOpen(Math.max(0, Math.sin(ph)));
    }, 68);
    return () => clearInterval(mouthRef.current);
  }, [isSpeaking]);

  /* ── Eye blink ── */
  const [blink, setBlink] = useState(false);
  const blinkRef = useRef(null);
  useEffect(() => {
    const go = () => {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); go(); }, 130);
      }, 2200 + Math.random() * 3800);
    };
    go();
    return () => clearTimeout(blinkRef.current);
  }, []);

  /* ── Gold burst particles (speaking only) ── */
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
      burstRef.current = setTimeout(spawn, 120 + Math.random() * 160);
    };
    burstRef.current = setTimeout(spawn, 80);
    return () => clearTimeout(burstRef.current);
  }, [isSpeaking]);

  /* Remove old bursts */
  useEffect(() => {
    if (!bursts.length) return;
    const t = setTimeout(() => {
      const now = Date.now();
      setBursts(prev => prev.filter(b => now - b.born < 900));
    }, 200);
    return () => clearTimeout(t);
  }, [bursts]);

  /* ── Derived animation values ── */
  const glowOp  = state === 'speaking' ? 0.92 : state === 'listening' ? 0.58 : state === 'thinking' ? 0.42 : 0.26;
  const orbFast = state === 'speaking';

  /* ── Facial feature % positions (relative to img bounds) ── */
  const eyeLX = 37, eyeLY = 43, eyeRX = 58, eyeRY = 43;
  const mouthX = 50, mouthY = 54;
  const mouthW = 13 + mouthOpen * 6;  // 13–19% wide
  const mouthH = 2.0 + mouthOpen * 7.0; // 2–9% tall // 1.5–7% tall

  return (
    <div className={className} style={{ width, height, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        /* ── Idle: gentle float ── */
        @keyframes ga-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          40%     { transform: translateY(-7px) rotate(.4deg); }
          72%     { transform: translateY(-5px) rotate(-.3deg); }
        }

        /* ── Speaking: natural figure-8 sway — head tilts & shifts as words flow ── */
        @keyframes ga-speak-sway {
          0%   { transform: translateY(-2px) rotate(0deg)   translateX(0px); }
          15%  { transform: translateY(-5px) rotate(-1.4deg) translateX(-3px); }
          30%  { transform: translateY(-3px) rotate(0deg)   translateX(0px); }
          45%  { transform: translateY(-5px) rotate(1.6deg)  translateX(3px); }
          60%  { transform: translateY(-2px) rotate(0deg)   translateX(0px); }
          75%  { transform: translateY(-5px) rotate(-1.2deg) translateX(-2px); }
          90%  { transform: translateY(-3px) rotate(.5deg)   translateX(1px); }
          100% { transform: translateY(-2px) rotate(0deg)   translateX(0px); }
        }
        /* ── Speaking: breath scale ── */
        @keyframes ga-speak-breath {
          0%,100% { transform: scale(1.000); }
          35%     { transform: scale(1.022); }
          65%     { transform: scale(1.010); }
        }

        @keyframes ga-lean {
          0%,100% { transform: translateY(-4px) rotate(0deg); }
          35%     { transform: translateY(-9px) rotate(1.5deg); }
          70%     { transform: translateY(-8px) rotate(-1.5deg); }
        }
        @keyframes ga-sway {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-4px) rotate(2deg); }
          75%     { transform: translateY(-4px) rotate(-2deg); }
        }

        /* ── Orbs ── */
        @keyframes ga-orb {
          0%,100% { transform:translateY(0) scale(1);      opacity:.86; }
          50%     { transform:translateY(-8px) scale(1.10); opacity:1; }
        }
        @keyframes ga-orb-f {
          0%,100% { transform:translateY(0px) scale(.95);   opacity:.82; }
          25%     { transform:translateY(-12px) scale(1.20); opacity:1; }
          75%     { transform:translateY(-6px) scale(1.10);  opacity:.95; }
        }

        /* ── Stars ── */
        @keyframes ga-star {
          0%,100% { opacity:.08; transform:scale(.45) rotate(0deg); }
          50%     { opacity:.95; transform:scale(1.50) rotate(45deg); }
        }

        /* ── Halo ── */
        @keyframes ga-halo {
          0%,100% { opacity:var(--gh,.26); transform:scale(1); }
          50%     { opacity:calc(var(--gh,.26) + .18); transform:scale(1.06); }
        }
        /* Faster halo flare when speaking */
        @keyframes ga-halo-spk {
          0%,100% { opacity:.72; transform:scale(1.00); }
          25%     { opacity:.98; transform:scale(1.10); }
          50%     { opacity:.80; transform:scale(1.03); }
          75%     { opacity:.96; transform:scale(1.09); }
        }

        /* ── Rings ── */
        @keyframes ga-cw  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ga-ccw { from{transform:rotate(0)} to{transform:rotate(-360deg)} }

        /* ── Sound-wave rings (speaking) ── */
        @keyframes ga-wave {
          0%   { transform:scale(.65); opacity:.70; }
          100% { transform:scale(1.80); opacity:0; }
        }

        /* ── Burst particles ── */
        @keyframes ga-burst {
          0%   { transform: translate(0,0) scale(1);    opacity:.95; }
          60%  { opacity:.70; }
          100% { transform: translate(var(--bx), var(--by)) scale(0.3); opacity:0; }
        }

        /* ── Image glow ── */
        @keyframes ga-glow-spk {
          0%,100% { filter: brightness(1.06) drop-shadow(0 0 12px rgba(201,162,39,.55)) drop-shadow(0 0 4px rgba(255,240,160,.3)); }
          25%     { filter: brightness(1.28) drop-shadow(0 0 36px rgba(201,162,39,1.0)) drop-shadow(0 0 16px rgba(255,240,160,.7)); }
          55%     { filter: brightness(1.12) drop-shadow(0 0 18px rgba(201,162,39,.68)) drop-shadow(0 0 6px rgba(255,240,160,.35)); }
        }
        @keyframes ga-glow-idle {
          0%,100% { filter: brightness(1.00); }
          50%     { filter: brightness(1.06); }
        }

        /* ── Thinking dots ── */
        @keyframes ga-dot {
          0%,80%,100% { opacity:.15; transform:translateY(0); }
          40%         { opacity:1;   transform:translateY(-5px); }
        }

        /* ── Ripple (listening) ── */
        @keyframes ga-ripple {
          0%   { transform:scale(1);   opacity:.50; }
          100% { transform:scale(1.9); opacity:0; }
        }
      `}</style>

      {/* ══ SVG background layer: halo + rings + orbs + stars + waves + bursts ══ */}
      <svg
        viewBox="0 0 260 340"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none' }}
      >
        <defs>
          <radialGradient id="ga-halo-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={GOLD_PALE} stopOpacity=".94"/>
            <stop offset="38%"  stopColor={GOLD}      stopOpacity=".44"/>
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
          <radialGradient id="ga-wave-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={GOLD_PALE} stopOpacity=".0"/>
            <stop offset="70%"  stopColor={GOLD}      stopOpacity=".55"/>
            <stop offset="100%" stopColor={GOLD_PALE} stopOpacity=".0"/>
          </radialGradient>
        </defs>

        {/* Ambient halo */}
        <ellipse cx="130" cy="210" rx="92" ry="120"
          fill="url(#ga-halo-g)"
          style={{
            '--gh': glowOp,
            transformOrigin: '130px 210px',
            animation: state === 'speaking'
              ? 'ga-halo-spk 0.80s ease-in-out infinite'
              : 'ga-halo 3.2s ease-in-out infinite',
          }}
        />

        {/* Sound-wave rings — only when speaking */}
        {state === 'speaking' && [0,1,2,3].map(i => (
          <ellipse key={i}
            cx="130" cy="200" rx="62" ry="70"
            fill="none" stroke={GOLD_PALE} strokeWidth={1.8 - i * 0.3}
            style={{
              transformOrigin: '130px 200px',
              animation: 'ga-wave 1.4s ease-out infinite',
              animationDelay: `${i * 0.35}s`,
              opacity: 0,
            }}
          />
        ))}

        {/* Listening ripples */}
        {state === 'listening' && [0,1,2].map(i => (
          <ellipse key={i} cx="130" cy="210" rx="94" ry="124"
            fill="none" stroke={GOLD_PALE} strokeWidth="1.5"
            style={{ transformOrigin:'130px 210px', animation:'ga-ripple 2.0s ease-out infinite', animationDelay:`${i*0.65}s` }}
          />
        ))}

        {/* Spinner rings — faster when speaking */}
        <circle cx="130" cy="110" r="88" fill="none" stroke={GOLD_PALE} strokeWidth=".6"
          strokeDasharray="10 13"
          opacity={state === 'speaking' ? .55 : .14}
          style={{ transformOrigin:'130px 110px', animation:`ga-cw ${state==='speaking'?'2.8s':'13s'} linear infinite` }}
        />
        <circle cx="130" cy="110" r="72" fill="none" stroke={GOLD} strokeWidth=".45"
          strokeDasharray="5 18"
          opacity={state === 'idle' ? .10 : .22}
          style={{ transformOrigin:'130px 110px', animation:`ga-ccw ${state==='speaking'?'4s':'20s'} linear infinite` }}
        />

        {/* Gold burst particles */}
        {bursts.map(b => {
          const rad = b.angle * Math.PI / 180;
          const dist = 55 + Math.random() * 30;
          const bx = Math.cos(rad) * dist;
          const by = Math.sin(rad) * dist;
          const sz = 3 + Math.random() * 5;
          return (
            <circle
              key={b.id}
              cx="130" cy="185"
              r={sz}
              fill={Math.random() > 0.4 ? GOLD_BRT : GOLD_PALE}
              style={{
                '--bx': `${bx}px`,
                '--by': `${by}px`,
                animation: 'ga-burst 0.85s ease-out forwards',
                transformOrigin: '130px 185px',
              }}
            />
          );
        })}

        {/* Orbs */}
        {ORBS.map(o => {
          const dur = orbFast ? (o.dur * 0.32).toFixed(1) + 's' : o.dur + 's';
          return (
            <g key={o.id} style={{ transformOrigin:`${o.cx}px ${o.cy}px`, animation:`${orbFast?'ga-orb-f':'ga-orb'} ${dur} ease-in-out infinite`, animationDelay:`${o.dl}s` }}>
              <ellipse cx={o.cx+2} cy={o.cy+2} rx={o.r*1.1} ry={o.r*.85} fill={o.gold?'#604800':'#504020'} opacity=".28"/>
              <circle  cx={o.cx}   cy={o.cy}   r={o.r} fill={o.gold ? 'url(#ga-og)' : 'url(#ga-ot)'}/>
              <ellipse cx={o.cx-o.r*.3} cy={o.cy-o.r*.32} rx={o.r*.36} ry={o.r*.24}
                fill="white" opacity=".56" transform={`rotate(-26,${o.cx-o.r*.3},${o.cy-o.r*.32})`}/>
            </g>
          );
        })}

        {/* Stars */}
        {STARS.map(s => (
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{ transformOrigin:'0 0', animation:`ga-star ${state==='speaking'?'0.70s':'2.6s'} ease-in-out infinite`, animationDelay:`${s.dl}s` }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke={GOLD_BRT} strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${a})`}/>
            ))}
            <circle r="1.3" fill={GOLD_BRT} opacity=".88"/>
          </g>
        ))}
      </svg>

      {/* ══ Image + face overlays — clipped + zoomed for bigger face ══ */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:2, pointerEvents:'none' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transform: 'scale(1.6)', transformOrigin: '50% top',
        /* Layer two animations: sway + breath when speaking */
        animation: state === 'speaking'
          ? 'ga-speak-sway 1.6s ease-in-out infinite, ga-speak-breath 0.80s ease-in-out infinite'
          : state === 'listening' ? 'ga-lean 1.5s ease-in-out infinite'
          : state === 'thinking'  ? 'ga-sway 2.8s ease-in-out infinite'
          : 'ga-float 3.8s ease-in-out infinite',
      }}>
        {/* Gideon image */}
        <img
          src={gideonImg}
          alt="Gideon"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            transform: 'scale(1.6)', transformOrigin: '50% top',
            display: 'block',
            userSelect: 'none',
            animation: state === 'speaking'
              ? 'ga-glow-spk 0.80s ease-in-out infinite'
              : 'ga-glow-idle 3.8s ease-in-out infinite',
          }}
        />

        {/* ── Eye blink overlay ── */}
        {blink && (<>
          <div style={{ position:'absolute', left:`${eyeLX-5.2}%`, top:`${eyeLY-1.8}%`, width:'10.5%', height:'3.8%',
            background:'linear-gradient(to bottom, #A05828, #B86A38)', borderRadius:'50%', opacity:.92 }}/>
          <div style={{ position:'absolute', left:`${eyeRX-5.2}%`, top:`${eyeRY-1.8}%`, width:'10.5%', height:'3.8%',
            background:'linear-gradient(to bottom, #A05828, #B86A38)', borderRadius:'50%', opacity:.92 }}/>
        </>)}

        {/* ── Eye brightness overlay when speaking (subtle glow on eyes) ── */}
        {state === 'speaking' && !blink && (<>
          <div style={{ position:'absolute', left:`${eyeLX-6}%`, top:`${eyeLY-3}%`, width:'12%', height:'7%',
            background:`radial-gradient(ellipse, ${GOLD_PALE}55 0%, transparent 70%)`,
            borderRadius:'50%', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', left:`${eyeRX-6}%`, top:`${eyeRY-3}%`, width:'12%', height:'7%',
            background:`radial-gradient(ellipse, ${GOLD_PALE}55 0%, transparent 70%)`,
            borderRadius:'50%', pointerEvents:'none' }}/>
        </>)}

        {/* ── Mouth overlay when speaking ── */}
        {isSpeaking && mouthOpen > 0.04 && (
          <div style={{
            position: 'absolute',
            left:     `${mouthX - mouthW / 2}%`,
            top:      `${mouthY}%`,
            width:    `${mouthW}%`,
            height:   `${mouthH}%`,
            borderRadius: '50%',
            overflow: 'hidden',
            opacity: 0.82 + mouthOpen * 0.12,
          }}>
            {/* Dark mouth cavity */}
            <div style={{
              position:'absolute', inset:0,
              background: 'radial-gradient(ellipse at 50% 35%, #1A0600 0%, #2E0C06 55%, #4A1A0A 100%)',
              borderRadius:'50%',
            }}/>
            {/* Upper lip shadow */}
            <div style={{
              position:'absolute', top:0, left:0, right:0, height:'28%',
              background:'linear-gradient(to bottom, rgba(160,60,20,0.7), transparent)',
              borderRadius:'50% 50% 0 0',
            }}/>
            {/* Lower lip highlight */}
            <div style={{
              position:'absolute', bottom:0, left:'15%', right:'15%', height:'20%',
              background:'rgba(220,130,80,0.25)',
              borderRadius:'0 0 50% 50%',
            }}/>
          </div>
        )}
      </div>
      </div>

      {/* ── Thinking dots ── */}
      {state === 'thinking' && (
        <div style={{ position:'absolute', bottom:6, display:'flex', gap:12, pointerEvents:'none' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:11, height:11, borderRadius:'50%', background:GOLD,
              animation:'ga-dot 1.1s ease-in-out infinite', animationDelay:`${i*0.24}s`,
            }}/>
          ))}
        </div>
      )}
    </div>
  );
}
