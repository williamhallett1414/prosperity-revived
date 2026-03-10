/**
 * PaulBackground — Coach Paul's Training Camp (Outdoor)
 * Real cartoon outdoor training scene as base. Animated SVG overlay adds:
 *   - Sun rays rotating slowly top-left (gold/warm, Coach Paul palette)
 *   - Sun lens flare pulse
 *   - 2 birds drifting across sky
 *   - Cloud drift (subtle parallax)
 *   - Grass shimmer / light breeze ripple
 *   - Banner gentle sway glow
 *   - Violet energy pulse rings (brand #A78BFA)
 *   - Floating gold + violet motes
 *   - Sparkle stars on sunbeam
 *   - Ambient outdoor breathe
 *   - Speaking state: sun brightens, motes speed up, energy rings intensify
 */
import { useEffect, useRef } from 'react';
import campBg from '@/assets/coach-paul-background.jpg';

export default function PaulBackground({ speaking = false, listening = false, thinking = false }) {
  const sunRef     = useRef(null);
  const ambientRef = useRef(null);
  const energyRef  = useRef(null);

  useEffect(() => {
    if (sunRef.current) {
      sunRef.current.style.transition = 'opacity 700ms ease';
      sunRef.current.style.opacity = speaking ? '0.85' : '0.55';
    }
    if (ambientRef.current) {
      ambientRef.current.style.transition = 'opacity 700ms ease';
      ambientRef.current.style.opacity = speaking ? '0.55' : listening ? '0.38' : '0.25';
    }
    if (energyRef.current) {
      energyRef.current.style.transition = 'opacity 700ms ease';
      energyRef.current.style.opacity = speaking ? '0.70' : '0.38';
    }
  }, [speaking, listening]);

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <style>{`
        /* Sun rays rotate — slow and majestic (Paul is calm/measured) */
        @keyframes pb-sunray {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* Sun flare pulse */
        @keyframes pb-flare {
          0%,100% { opacity:.50; transform:scale(1.00); }
          50%     { opacity:.82; transform:scale(1.18); }
        }
        /* Bird drift — glide left to right across sky */
        @keyframes pb-bird-a {
          0%   { transform:translate(-40px, 0px);  opacity:0; }
          8%   { opacity:.80; }
          92%  { opacity:.75; }
          100% { transform:translate(440px,-30px); opacity:0; }
        }
        @keyframes pb-bird-b {
          0%   { transform:translate(-40px, 0px);  opacity:0; }
          10%  { opacity:.70; }
          90%  { opacity:.65; }
          100% { transform:translate(440px,-20px); opacity:0; }
        }
        /* Cloud drift */
        @keyframes pb-cloud {
          0%,100% { transform:translateX(0px); }
          50%     { transform:translateX(12px); }
        }
        /* Grass shimmer / breeze */
        @keyframes pb-grass {
          0%,100% { opacity:.08; }
          50%     { opacity:.18; }
        }
        /* Banner glow sway */
        @keyframes pb-banner {
          0%,100% { opacity:.14; transform:scaleX(1.00); }
          50%     { opacity:.26; transform:scaleX(1.02); }
        }
        /* Violet energy pulse */
        @keyframes pb-pulse {
          0%   { transform:scale(.65); opacity:.60; }
          100% { transform:scale(2.00); opacity:0; }
        }
        /* Mote float */
        @keyframes pb-mote-a {
          0%   { transform:translate(0,0);        opacity:0; }
          10%  { opacity:.65; }
          90%  { opacity:.50; }
          100% { transform:translate(7px,-105px); opacity:0; }
        }
        @keyframes pb-mote-b {
          0%   { transform:translate(0,0);         opacity:0; }
          12%  { opacity:.58; }
          88%  { opacity:.45; }
          100% { transform:translate(-9px,-90px);  opacity:0; }
        }
        @keyframes pb-mote-c {
          0%   { transform:translate(0,0);         opacity:0; }
          8%   { opacity:.62; }
          92%  { opacity:.48; }
          100% { transform:translate(5px,-120px);  opacity:0; }
        }
        /* Ambient breathe */
        @keyframes pb-breathe {
          0%,100% { opacity:.25; }
          50%     { opacity:.42; }
        }
        /* Sparkle */
        @keyframes pb-twinkle {
          0%,100% { opacity:0;   transform:scale(.3); }
          50%     { opacity:.92; transform:scale(1.4); }
        }
        /* Flower sway */
        @keyframes pb-flower {
          0%,100% { opacity:.12; }
          50%     { opacity:.24; }
        }
      `}</style>

      {/* ── Base training camp illustration ── */}
      <img
        src={campBg}
        alt="" aria-hidden="true" draggable={false}
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center top',
          display:'block',
        }}
      />

      {/* ── Soft vignette — lighter than indoor bots (outdoor scene) ── */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse at 48% 40%, transparent 28%, rgba(4,8,4,0.44) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Bottom fade for message area ── */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height:'55%',
        background:'linear-gradient(to bottom, transparent 0%, rgba(6,10,4,0.62) 50%, rgba(6,10,4,0.90) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Animated SVG overlay ── */}
      <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'visible' }}>
        <defs>
          <radialGradient id="pb-sun-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFBE0" stopOpacity="1.00"/>
            <stop offset="25%"  stopColor="#FFE060" stopOpacity="0.75"/>
            <stop offset="60%"  stopColor="#FFC040" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="pb-energy-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#A78BFA" stopOpacity="0.85"/>
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="pb-grass-g" cx="50%" cy="0%" r="100%">
            <stop offset="0%"   stopColor="#A3E635" stopOpacity="0.30"/>
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0"/>
          </radialGradient>
          <filter id="pb-blur4"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="pb-blur8"><feGaussianBlur stdDeviation="8"/></filter>
          <filter id="pb-blur14"><feGaussianBlur stdDeviation="14"/></filter>
          <filter id="pb-blur20"><feGaussianBlur stdDeviation="20"/></filter>
          <filter id="pb-blur28"><feGaussianBlur stdDeviation="28"/></filter>
        </defs>

        {/* ── SUN RAYS top-left (~68, 90) ── */}
        <g ref={sunRef} opacity="0.55" style={{ transformOrigin:'68px 90px' }}>
          {/* Slow rotating spokes — Paul's calm 36s vs David's 22s */}
          <g style={{ transformOrigin:'68px 90px', animation:'pb-sunray 36s linear infinite' }}>
            {[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340].map((a,i) => {
              const rad = a * Math.PI / 180;
              const len = i % 2 === 0 ? 200 : 120;
              return (
                <line key={i}
                  x1={68 + Math.cos(rad)*16} y1={90 + Math.sin(rad)*16}
                  x2={68 + Math.cos(rad)*len} y2={90 + Math.sin(rad)*len}
                  stroke="#FFFBE0" strokeWidth={i%2===0 ? 2.5 : 1.4}
                  opacity={i%2===0 ? 0.55 : 0.28} strokeLinecap="round"
                />
              );
            })}
          </g>
          {/* Sun core glow */}
          <circle cx="68" cy="90" r="40"
            fill="url(#pb-sun-g)" filter="url(#pb-blur14)"
            style={{ animation:'pb-flare 4.0s ease-in-out infinite' }}
          />
          {/* Outer halo */}
          <circle cx="68" cy="90" r="80"
            fill="url(#pb-sun-g)" filter="url(#pb-blur28)" opacity="0.38"
            style={{ animation:'pb-flare 4.0s ease-in-out infinite', animationDelay:'0.8s' }}
          />
        </g>

        {/* ── SPARKLE STARS on sunbeam ── */}
        {[
          { x:112, y:118, sz:5, delay:'0s',   dur:'2.8s' },
          { x:88,  y:145, sz:4, delay:'0.9s', dur:'3.2s' },
          { x:135, y:102, sz:3, delay:'1.6s', dur:'2.4s' },
          { x:60,  y:132, sz:4, delay:'0.4s', dur:'3.6s' },
          { x:148, y:128, sz:3, delay:'1.2s', dur:'2.6s' },
        ].map((s,i) => (
          <g key={i} transform={`translate(${s.x},${s.y})`}
            style={{ transformOrigin:'0 0', animation:`pb-twinkle ${speaking ? (parseFloat(s.dur)*0.5).toFixed(1)+'s' : s.dur} ease-in-out infinite`, animationDelay:s.delay }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke="#FFEE80" strokeWidth="1.2" strokeLinecap="round"
                transform={`rotate(${a})`}/>
            ))}
            <circle r="1.1" fill="#FFEE80"/>
          </g>
        ))}

        {/* ── BIRD A — drifts across upper sky ── */}
        <g style={{ animation:`pb-bird-a ${speaking ? '8s' : '14s'} ease-in-out infinite`, animationDelay:'0s' }}>
          {/* Simple W-shape bird silhouette */}
          <path d="M 50 210 Q 54 206 58 210 Q 62 206 66 210"
            fill="none" stroke="#1a3a1a" strokeWidth="1.5" strokeLinecap="round" opacity="0.75"/>
        </g>
        {/* ── BIRD B ── */}
        <g style={{ animation:`pb-bird-b ${speaking ? '10s' : '18s'} ease-in-out infinite`, animationDelay:'5s' }}>
          <path d="M 50 228 Q 53 225 56 228 Q 59 225 62 228"
            fill="none" stroke="#1a3a1a" strokeWidth="1.4" strokeLinecap="round" opacity="0.68"/>
        </g>

        {/* ── CLOUD DRIFT (subtle, centre sky ~195,190) ── */}
        <g style={{ animation:'pb-cloud 8s ease-in-out infinite' }}>
          <ellipse cx="210" cy="190" rx="60" ry="22"
            fill="white" filter="url(#pb-blur14)" opacity="0.06"/>
        </g>

        {/* ── BANNER GLOW (~195, 118) ── */}
        <ellipse cx="195" cy="120" rx="160" ry="28"
          fill="#C9A227" filter="url(#pb-blur14)" opacity="0.14"
          style={{ animation:'pb-banner 4.5s ease-in-out infinite' }}
        />

        {/* ── GRASS SHIMMER / light breeze (mid-field ~195,430) ── */}
        <ellipse cx="195" cy="438" rx="175" ry="80"
          fill="url(#pb-grass-g)" filter="url(#pb-blur20)" opacity="0.08"
          style={{ animation:'pb-grass 5.0s ease-in-out infinite' }}
        />

        {/* ── VIOLET ENERGY PULSE RINGS (brand #A78BFA, calm pace) ── */}
        <g ref={energyRef} opacity="0.38">
          {[0,1,2,3].map(i => (
            <circle key={i} cx="195" cy="440" r="60"
              fill="none" stroke="#A78BFA" strokeWidth="1.8"
              style={{
                transformOrigin:'195px 440px',
                animation:`pb-pulse ${speaking ? '1.8s' : '3.0s'} ease-out infinite`,
                animationDelay:`${i * (speaking ? 0.45 : 0.75)}s`,
              }}
            />
          ))}
        </g>

        {/* ── AMBIENT outdoor violet/gold breathe ── */}
        <ellipse cx="195" cy="440" rx="165" ry="110"
          ref={ambientRef}
          fill="#A78BFA" filter="url(#pb-blur28)" opacity="0.25"
          style={{ animation:'pb-breathe 4.5s ease-in-out infinite' }}
        />

        {/* ── FLOWER SHIMMER bottom-left (~68, 760) ── */}
        <ellipse cx="68" cy="750" rx="48" ry="30"
          fill="#F472B6" filter="url(#pb-blur8)" opacity="0.12"
          style={{ animation:'pb-flower 5.5s ease-in-out infinite' }}
        />

        {/* ── FLOATING MOTES — gold + violet alternating ── */}
        {[
          { x:162, y:480, dur:'15s', delay:'0s',   kf:'pb-mote-a', col:'#C9A227' },
          { x:208, y:500, dur:'13s', delay:'3.5s', kf:'pb-mote-b', col:'#A78BFA' },
          { x:180, y:470, dur:'16s', delay:'7.0s', kf:'pb-mote-c', col:'#C9A227' },
          { x:228, y:490, dur:'14s', delay:'1.8s', kf:'pb-mote-a', col:'#A78BFA' },
          { x:170, y:510, dur:'12s', delay:'9.2s', kf:'pb-mote-b', col:'#C9A227' },
          { x:218, y:475, dur:'17s', delay:'5.0s', kf:'pb-mote-c', col:'#A78BFA' },
        ].map((m,i) => (
          <circle key={i} cx={m.x} cy={m.y} r="2.2" fill={m.col} opacity="0"
            style={{ animation:`${m.kf} ${speaking ? (parseFloat(m.dur)*0.45).toFixed(1)+'s' : m.dur} ease-in-out infinite`, animationDelay:m.delay }}
          />
        ))}

        {/* ── SPEAKING: extra fast pulse rings + sun burst ── */}
        {speaking && (<>
          <g style={{ opacity:0.30 }}>
            {[0,1,2].map(i => (
              <circle key={i} cx="195" cy="440" r="95"
                fill="none" stroke="#C4B5FD" strokeWidth="1.4"
                style={{
                  transformOrigin:'195px 440px',
                  animation:'pb-pulse 1.2s ease-out infinite',
                  animationDelay:`${i*0.4}s`,
                }}
              />
            ))}
          </g>
          {/* Extra sun burst inner ring */}
          <g style={{ transformOrigin:'68px 90px', animation:'pb-sunray 6s linear infinite', opacity:0.28 }}>
            {[10,30,50,70,90,110,130,150,170,190,210,230,250,270,290,310,330,350].map((a,i) => {
              const rad = a * Math.PI / 180;
              return (
                <line key={i}
                  x1={68 + Math.cos(rad)*12} y1={90 + Math.sin(rad)*12}
                  x2={68 + Math.cos(rad)*150} y2={90 + Math.sin(rad)*150}
                  stroke="#FFF8C0" strokeWidth="1.0" opacity="0.40" strokeLinecap="round"
                />
              );
            })}
          </g>
        </>)}
      </svg>
    </div>
  );
}
