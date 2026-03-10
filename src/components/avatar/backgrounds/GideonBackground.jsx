/**
 * GideonBackground — Church Interior Illustration
 * Uses the real cartoon church painting as base image.
 * Animated SVG overlay adds:
 *   - Left candle flicker (amber glow bloom)
 *   - Right candle flicker (amber glow bloom)
 *   - Altar candle pair (left + right of pulpit)
 *   - Cross light rays rotating slowly
 *   - Floating gold dust motes (6 particles)
 *   - Stained glass color pulse (left sun window + right dove window)
 *   - Ambient warm breathing glow over whole scene
 *   - Speaking state: rays brighten, motes speed up, glow intensifies
 */
import { useEffect, useRef } from 'react';
import churchBg from '@/assets/gideon-background.jpg';

export default function GideonBackground({ speaking = false, listening = false, thinking = false }) {
  const overlayRef  = useRef(null);
  const raysRef     = useRef(null);
  const ambientRef  = useRef(null);

  // Respond to speaking state — brighten overlay
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.style.transition = 'opacity 600ms ease';
      overlayRef.current.style.opacity = speaking ? '0.55' : listening ? '0.38' : '0.28';
    }
    if (raysRef.current) {
      raysRef.current.style.transition = 'opacity 600ms ease';
      raysRef.current.style.opacity = speaking ? '0.75' : '0.45';
    }
    if (ambientRef.current) {
      ambientRef.current.style.transition = 'opacity 600ms ease';
      ambientRef.current.style.opacity = speaking ? '0.50' : '0.28';
    }
  }, [speaking, listening]);

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <style>{`
        /* Candle glow bloom */
        @keyframes gb-candle-l {
          0%,100% { opacity:.55; r:18; }
          30%     { opacity:.80; r:24; }
          60%     { opacity:.50; r:16; }
          80%     { opacity:.72; r:22; }
        }
        @keyframes gb-candle-r {
          0%,100% { opacity:.52; r:18; }
          20%     { opacity:.78; r:22; }
          55%     { opacity:.82; r:26; }
          75%     { opacity:.48; r:15; }
        }
        @keyframes gb-candle-al {
          0%,100% { opacity:.48; r:14; }
          40%     { opacity:.72; r:20; }
          70%     { opacity:.42; r:13; }
        }
        @keyframes gb-candle-ar {
          0%,100% { opacity:.50; r:15; }
          25%     { opacity:.75; r:21; }
          65%     { opacity:.40; r:12; }
          85%     { opacity:.70; r:19; }
        }
        /* Flame flicker */
        @keyframes gb-flame-l {
          0%,100% { transform: scaleY(1)   translateX(0px); }
          25%     { transform: scaleY(1.3) translateX(1px); }
          50%     { transform: scaleY(.85) translateX(-1px); }
          75%     { transform: scaleY(1.2) translateX(.5px); }
        }
        @keyframes gb-flame-r {
          0%,100% { transform: scaleY(1)   translateX(0px); }
          20%     { transform: scaleY(.80) translateX(1px); }
          50%     { transform: scaleY(1.4) translateX(-1px); }
          80%     { transform: scaleY(.90) translateX(1px); }
        }
        /* Cross light rays spin */
        @keyframes gb-rays {
          from { transform: rotate(0deg);  }
          to   { transform: rotate(360deg); }
        }
        /* Stained glass pulse */
        @keyframes gb-glass-l {
          0%,100% { opacity:.18; }
          50%     { opacity:.34; }
        }
        @keyframes gb-glass-r {
          0%,100% { opacity:.16; }
          50%     { opacity:.30; }
        }
        /* Dust mote float */
        @keyframes gb-mote-a {
          0%   { transform:translate(0px, 0px)    opacity:0; }
          10%  { opacity:.70; }
          90%  { opacity:.60; }
          100% { transform:translate(6px, -120px); opacity:0; }
        }
        @keyframes gb-mote-b {
          0%   { transform:translate(0px, 0px)   opacity:0; }
          12%  { opacity:.55; }
          88%  { opacity:.50; }
          100% { transform:translate(-8px,-100px); opacity:0; }
        }
        @keyframes gb-mote-c {
          0%   { transform:translate(0px, 0px)   opacity:0; }
          8%   { opacity:.65; }
          92%  { opacity:.55; }
          100% { transform:translate(4px,-140px); opacity:0; }
        }
        /* Ambient breathe */
        @keyframes gb-breathe {
          0%,100% { opacity:.28; }
          50%     { opacity:.40; }
        }
        /* Sparkle twinkle */
        @keyframes gb-twinkle {
          0%,100% { opacity:0;    transform:scale(.4); }
          50%     { opacity:.95;  transform:scale(1.4); }
        }
      `}</style>

      {/* ── Base church illustration ── */}
      <img
        src={churchBg}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center top',
          display:'block',
        }}
      />

      {/* ── Dark vignette to keep UI elements readable ── */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(10,5,0,0.52) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Bottom fade so messages sit on clean surface ── */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height:'55%',
        background:'linear-gradient(to bottom, transparent 0%, rgba(18,10,0,0.65) 55%, rgba(18,10,0,0.88) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Animated SVG overlay — all effects ── */}
      <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'visible' }}>
        <defs>
          {/* Cross rays radial */}
          <radialGradient id="gb-ray-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFE87A" stopOpacity="0.90"/>
            <stop offset="40%"  stopColor="#FFC940" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#FF8800" stopOpacity="0"/>
          </radialGradient>
          {/* Candle bloom */}
          <radialGradient id="gb-cbl" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFD060" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FF8800" stopOpacity="0"/>
          </radialGradient>
          {/* Stained glass left (warm sun orange) */}
          <radialGradient id="gb-sgl" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#FF9020" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FF6000" stopOpacity="0"/>
          </radialGradient>
          {/* Stained glass right (cool dove blue) */}
          <radialGradient id="gb-sgr" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#60C8FF" stopOpacity="1"/>
            <stop offset="100%" stopColor="#2060FF" stopOpacity="0"/>
          </radialGradient>
          <filter id="gb-blur4"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="gb-blur8"><feGaussianBlur stdDeviation="8"/></filter>
          <filter id="gb-blur14"><feGaussianBlur stdDeviation="14"/></filter>
          <filter id="gb-blur20"><feGaussianBlur stdDeviation="20"/></filter>
        </defs>

        {/* ── CROSS LIGHT RAYS (centred on cross ~195,195) ── */}
        <g ref={raysRef} opacity="0.45" style={{ transformOrigin:'195px 195px' }}>
          {/* 8 spinning light rays */}
          <g style={{ transformOrigin:'195px 195px', animation:'gb-rays 28s linear infinite' }}>
            {[0,22.5,45,67.5,90,112.5,135,157.5,180,202.5,225,247.5,270,292.5,315,337.5].map((a,i) => {
              const rad = a * Math.PI / 180;
              const len = i % 2 === 0 ? 200 : 130;
              const w   = i % 2 === 0 ? 2.5 : 1.5;
              return (
                <line key={i}
                  x1={195 + Math.cos(rad)*12} y1={195 + Math.sin(rad)*12}
                  x2={195 + Math.cos(rad)*len} y2={195 + Math.sin(rad)*len}
                  stroke="#FFE87A" strokeWidth={w} opacity={i%2===0 ? 0.55 : 0.30}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
          {/* Central glow blob */}
          <ellipse cx="195" cy="195" rx="48" ry="48"
            fill="url(#gb-ray-g)" filter="url(#gb-blur14)" opacity="0.70"/>
        </g>

        {/* ── STAINED GLASS GLOW — LEFT WINDOW (sun, ~85,330) ── */}
        <ellipse cx="85" cy="310" rx="68" ry="90"
          fill="url(#gb-sgl)" filter="url(#gb-blur20)" opacity="0.18"
          style={{ animation:'gb-glass-l 4.2s ease-in-out infinite' }}
        />
        {/* Floor color cast from left window */}
        <ellipse cx="110" cy="720" rx="80" ry="40"
          fill="#FF8020" filter="url(#gb-blur14)" opacity="0.10"
          style={{ animation:'gb-glass-l 4.2s ease-in-out infinite', animationDelay:'0.5s' }}
        />

        {/* ── STAINED GLASS GLOW — RIGHT WINDOW (dove, ~305,330) ── */}
        <ellipse cx="310" cy="310" rx="68" ry="90"
          fill="url(#gb-sgr)" filter="url(#gb-blur20)" opacity="0.16"
          style={{ animation:'gb-glass-r 5.0s ease-in-out infinite', animationDelay:'1.2s' }}
        />
        {/* Floor color cast from right window */}
        <ellipse cx="280" cy="720" rx="80" ry="40"
          fill="#4090FF" filter="url(#gb-blur14)" opacity="0.09"
          style={{ animation:'gb-glass-r 5.0s ease-in-out infinite', animationDelay:'0.8s' }}
        />

        {/* ── BOTTOM-LEFT CANDLE (~78,575) ── */}
        <g>
          {/* Bloom glow */}
          <circle cx="78" cy="570" r="18" fill="url(#gb-cbl)" filter="url(#gb-blur8)"
            style={{ animation:'gb-candle-l 1.8s ease-in-out infinite' }}/>
          {/* Flame body */}
          <ellipse cx="78" cy="568" rx="4" ry="7" fill="#FFB300" opacity="0.85"
            style={{ transformOrigin:'78px 574px', animation:'gb-flame-l 0.45s ease-in-out infinite' }}/>
          <ellipse cx="78" cy="566" rx="2.5" ry="4" fill="#FFED60" opacity="0.90"
            style={{ transformOrigin:'78px 574px', animation:'gb-flame-l 0.45s ease-in-out infinite', animationDelay:'0.1s' }}/>
        </g>

        {/* ── BOTTOM-RIGHT CANDLE (~312,575) ── */}
        <g>
          <circle cx="312" cy="570" r="18" fill="url(#gb-cbl)" filter="url(#gb-blur8)"
            style={{ animation:'gb-candle-r 2.1s ease-in-out infinite' }}/>
          <ellipse cx="312" cy="568" rx="4" ry="7" fill="#FFB300" opacity="0.85"
            style={{ transformOrigin:'312px 574px', animation:'gb-flame-r 0.52s ease-in-out infinite' }}/>
          <ellipse cx="312" cy="566" rx="2.5" ry="4" fill="#FFED60" opacity="0.90"
            style={{ transformOrigin:'312px 574px', animation:'gb-flame-r 0.52s ease-in-out infinite', animationDelay:'0.15s' }}/>
        </g>

        {/* ── ALTAR CANDLE LEFT (~158,390) ── */}
        <g>
          <circle cx="158" cy="386" r="14" fill="url(#gb-cbl)" filter="url(#gb-blur8)"
            style={{ animation:'gb-candle-al 1.6s ease-in-out infinite', animationDelay:'0.4s' }}/>
          <ellipse cx="158" cy="384" rx="3.5" ry="6" fill="#FFB300" opacity="0.82"
            style={{ transformOrigin:'158px 390px', animation:'gb-flame-l 0.40s ease-in-out infinite', animationDelay:'0.2s' }}/>
          <ellipse cx="158" cy="382" rx="2" ry="3.5" fill="#FFED60" opacity="0.88"
            style={{ transformOrigin:'158px 390px', animation:'gb-flame-l 0.40s ease-in-out infinite', animationDelay:'0.08s' }}/>
        </g>

        {/* ── ALTAR CANDLE RIGHT (~232,390) ── */}
        <g>
          <circle cx="232" cy="386" r="14" fill="url(#gb-cbl)" filter="url(#gb-blur8)"
            style={{ animation:'gb-candle-ar 2.3s ease-in-out infinite', animationDelay:'0.9s' }}/>
          <ellipse cx="232" cy="384" rx="3.5" ry="6" fill="#FFB300" opacity="0.82"
            style={{ transformOrigin:'232px 390px', animation:'gb-flame-r 0.48s ease-in-out infinite', animationDelay:'0.3s' }}/>
          <ellipse cx="232" cy="382" rx="2" ry="3.5" fill="#FFED60" opacity="0.88"
            style={{ transformOrigin:'232px 390px', animation:'gb-flame-r 0.48s ease-in-out infinite', animationDelay:'0.12s' }}/>
        </g>

        {/* ── AMBIENT BREATHING GLOW (altar area) ── */}
        <ellipse cx="195" cy="430" rx="130" ry="90"
          ref={ambientRef}
          fill="#FFD060" filter="url(#gb-blur20)" opacity="0.28"
          style={{ animation:'gb-breathe 3.5s ease-in-out infinite' }}
        />

        {/* ── GOLD DUST MOTES ── */}
        {[
          { x:148, y:520, dur:'12s', delay:'0s',    kf:'gb-mote-a' },
          { x:215, y:540, dur:'9s',  delay:'3.8s',  kf:'gb-mote-b' },
          { x:176, y:500, dur:'14s', delay:'7.2s',  kf:'gb-mote-c' },
          { x:232, y:530, dur:'11s', delay:'1.5s',  kf:'gb-mote-a' },
          { x:162, y:515, dur:'10s', delay:'5.4s',  kf:'gb-mote-b' },
          { x:220, y:505, dur:'13s', delay:'9.0s',  kf:'gb-mote-c' },
        ].map((m,i) => (
          <circle key={i} cx={m.x} cy={m.y} r="2.2" fill="#F5E060" opacity="0"
            style={{ animation:`${m.kf} ${speaking ? (parseFloat(m.dur)*0.55).toFixed(1)+'s' : m.dur} ease-in-out infinite`, animationDelay: m.delay }}
          />
        ))}

        {/* ── SPARKLE STARS near cross ── */}
        {[
          { x:178, y:172, sz:5, delay:'0s',   dur:'2.8s' },
          { x:212, y:165, sz:4, delay:'1.1s', dur:'3.2s' },
          { x:165, y:198, sz:3, delay:'2.0s', dur:'2.5s' },
          { x:222, y:202, sz:3, delay:'0.6s', dur:'3.8s' },
          { x:195, y:158, sz:4, delay:'1.7s', dur:'2.6s' },
        ].map((s,i) => (
          <g key={i} transform={`translate(${s.x},${s.y})`}
            style={{ transformOrigin:'0 0', animation:`gb-twinkle ${speaking ? (parseFloat(s.dur)*0.5).toFixed(1)+'s' : s.dur} ease-in-out infinite`, animationDelay: s.delay }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke="#FFEE80" strokeWidth="1.2" strokeLinecap="round"
                transform={`rotate(${a})`}/>
            ))}
            <circle r="1.2" fill="#FFEE80"/>
          </g>
        ))}

        {/* ── SPEAKING state: extra rays burst overlay ── */}
        {speaking && (
          <g style={{ transformOrigin:'195px 195px', animation:'gb-rays 8s linear infinite', opacity:0.35 }}>
            {[11.25,33.75,56.25,78.75,101.25,123.75,146.25,168.75,191.25,213.75,236.25,258.75,281.25,303.75,326.25,348.75].map((a,i) => {
              const rad = a * Math.PI / 180;
              return (
                <line key={i}
                  x1={195 + Math.cos(rad)*10} y1={195 + Math.sin(rad)*10}
                  x2={195 + Math.cos(rad)*160} y2={195 + Math.sin(rad)*160}
                  stroke="#FFF0A0" strokeWidth="1.2" opacity="0.45" strokeLinecap="round"
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
