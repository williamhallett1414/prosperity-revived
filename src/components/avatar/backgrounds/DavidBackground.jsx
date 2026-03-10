/**
 * DavidBackground — Faith Gym Illustration
 * Real cartoon gym painting as base. Animated SVG overlay adds:
 *   - Ceiling fluorescent light flicker (2 panels)
 *   - Window sunlight rays pulsing through the arched window
 *   - Punching bag gentle sway
 *   - Barbell weight glint shimmer
 *   - Stopwatch second-hand tick
 *   - Energy burst pulse (sky-blue, brand color #38BDF8)
 *   - Floating sweat/energy motes
 *   - Speaking state: rays intensify, energy pulses faster, motes speed up
 */
import { useEffect, useRef } from 'react';
import gymBg from '@/assets/coach-david-background.jpg';

export default function DavidBackground({ speaking = false, listening = false, thinking = false }) {
  const ambientRef = useRef(null);
  const raysRef    = useRef(null);
  const energyRef  = useRef(null);

  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.style.transition = 'opacity 500ms ease';
      ambientRef.current.style.opacity = speaking ? '0.60' : listening ? '0.42' : '0.28';
    }
    if (raysRef.current) {
      raysRef.current.style.transition = 'opacity 500ms ease';
      raysRef.current.style.opacity = speaking ? '0.80' : '0.48';
    }
    if (energyRef.current) {
      energyRef.current.style.transition = 'opacity 500ms ease';
      energyRef.current.style.opacity = speaking ? '0.72' : '0.40';
    }
  }, [speaking, listening]);

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <style>{`
        /* Ceiling light flicker */
        @keyframes cd-light-l {
          0%,100% { opacity:.55; }
          15%     { opacity:.80; }
          30%     { opacity:.50; }
          55%     { opacity:.75; }
          80%     { opacity:.48; }
        }
        @keyframes cd-light-r {
          0%,100% { opacity:.52; }
          25%     { opacity:.78; }
          50%     { opacity:.46; }
          75%     { opacity:.72; }
        }
        /* Window sun rays spin — slow, majestic */
        @keyframes cd-sunray {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* Window glow breathe */
        @keyframes cd-window {
          0%,100% { opacity:.38; }
          50%     { opacity:.60; }
        }
        /* Punching bag sway */
        @keyframes cd-bag {
          0%,100% { transform: rotate(0deg)   translateX(0px); }
          20%     { transform: rotate(-3deg)  translateX(-4px); }
          50%     { transform: rotate(2.5deg) translateX(3px); }
          75%     { transform: rotate(-1.5deg) translateX(-2px); }
        }
        /* Barbell glint */
        @keyframes cd-glint {
          0%,100% { opacity:0; transform:scaleX(.2); }
          50%     { opacity:.85; transform:scaleX(1); }
        }
        /* Energy pulse rings */
        @keyframes cd-pulse {
          0%   { transform:scale(.7); opacity:.55; }
          100% { transform:scale(1.9); opacity:0; }
        }
        /* Stopwatch tick */
        @keyframes cd-tick {
          0%,99%  { transform: rotate(0deg); }
          100%    { transform: rotate(360deg); }
        }
        /* Mote float */
        @keyframes cd-mote-a {
          0%   { transform:translate(0,0);        opacity:0; }
          10%  { opacity:.70; }
          90%  { opacity:.55; }
          100% { transform:translate(8px,-100px); opacity:0; }
        }
        @keyframes cd-mote-b {
          0%   { transform:translate(0,0);         opacity:0; }
          12%  { opacity:.60; }
          88%  { opacity:.45; }
          100% { transform:translate(-10px,-85px); opacity:0; }
        }
        @keyframes cd-mote-c {
          0%   { transform:translate(0,0);        opacity:0; }
          8%   { opacity:.65; }
          92%  { opacity:.50; }
          100% { transform:translate(5px,-115px); opacity:0; }
        }
        /* Ambient breathe */
        @keyframes cd-breathe {
          0%,100% { opacity:.28; }
          50%     { opacity:.46; }
        }
        /* Banner shimmer */
        @keyframes cd-banner {
          0%,100% { opacity:.14; }
          50%     { opacity:.30; }
        }
        /* Sparkle */
        @keyframes cd-twinkle {
          0%,100% { opacity:0;   transform:scale(.3); }
          50%     { opacity:.90; transform:scale(1.4); }
        }
      `}</style>

      {/* ── Base gym illustration ── */}
      <img
        src={gymBg}
        alt="" aria-hidden="true" draggable={false}
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center top',
          display:'block',
        }}
      />

      {/* ── Dark vignette ── */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse at 50% 38%, transparent 22%, rgba(4,10,20,0.52) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Bottom fade ── */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height:'55%',
        background:'linear-gradient(to bottom, transparent 0%, rgba(6,12,24,0.65) 50%, rgba(6,12,24,0.90) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Animated SVG overlay ── */}
      <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'visible' }}>
        <defs>
          <radialGradient id="cd-sun-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFBE0" stopOpacity="0.95"/>
            <stop offset="35%"  stopColor="#87CEEB" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#38BDF8"  stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cd-lamp-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFBE0" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FFD060" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="cd-energy-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#38BDF8" stopOpacity="0.90"/>
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0"/>
          </radialGradient>
          <filter id="cd-blur4"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="cd-blur8"><feGaussianBlur stdDeviation="8"/></filter>
          <filter id="cd-blur14"><feGaussianBlur stdDeviation="14"/></filter>
          <filter id="cd-blur20"><feGaussianBlur stdDeviation="20"/></filter>
        </defs>

        {/* ── CEILING FLUORESCENT LIGHTS ── */}
        {/* Left panel (~115, 55) */}
        <rect x="60" y="48" width="110" height="22" rx="4" fill="#FFFBE0" filter="url(#cd-blur4)"
          style={{ animation:'cd-light-l 4.5s ease-in-out infinite' }} opacity="0.55"/>
        <ellipse cx="115" cy="80" rx="70" ry="30" fill="#FFFBE0" filter="url(#cd-blur14)" opacity="0.18"
          style={{ animation:'cd-light-l 4.5s ease-in-out infinite', animationDelay:'0.4s' }}/>

        {/* Right panel (~295, 55) */}
        <rect x="230" y="48" width="110" height="22" rx="4" fill="#FFFBE0" filter="url(#cd-blur4)"
          style={{ animation:'cd-light-r 3.8s ease-in-out infinite', animationDelay:'1.0s' }} opacity="0.52"/>
        <ellipse cx="295" cy="80" rx="70" ry="30" fill="#FFFBE0" filter="url(#cd-blur14)" opacity="0.16"
          style={{ animation:'cd-light-r 3.8s ease-in-out infinite', animationDelay:'0.7s' }}/>

        {/* ── ARCHED WINDOW SUN RAYS (~195, 330) ── */}
        <g ref={raysRef} opacity="0.48" style={{ transformOrigin:'195px 340px' }}>
          {/* Slow rotating spokes */}
          <g style={{ transformOrigin:'195px 340px', animation:'cd-sunray 22s linear infinite' }}>
            {[0,18,36,54,72,90,108,126,144,162,180,198,216,234,252,270,288,306,324,342].map((a,i) => {
              const rad = a * Math.PI / 180;
              const len = i % 2 === 0 ? 180 : 110;
              return (
                <line key={i}
                  x1={195 + Math.cos(rad)*14} y1={340 + Math.sin(rad)*14}
                  x2={195 + Math.cos(rad)*len} y2={340 + Math.sin(rad)*len}
                  stroke="#FFFBE0" strokeWidth={i%2===0 ? 2.2 : 1.2}
                  opacity={i%2===0 ? 0.52 : 0.28} strokeLinecap="round"
                />
              );
            })}
          </g>
          {/* Central sun glow */}
          <ellipse cx="195" cy="340" rx="55" ry="55"
            fill="url(#cd-sun-g)" filter="url(#cd-blur14)" opacity="0.75"/>
        </g>
        {/* Window breathing glow */}
        <ellipse cx="195" cy="335" rx="100" ry="105"
          fill="#87CEEB" filter="url(#cd-blur20)" opacity="0.38"
          style={{ animation:'cd-window 3.5s ease-in-out infinite' }}
        />
        {/* Floor sunlight spill */}
        <ellipse cx="195" cy="680" rx="120" ry="48"
          fill="#38BDF8" filter="url(#cd-blur20)" opacity="0.10"
          style={{ animation:'cd-window 3.5s ease-in-out infinite', animationDelay:'0.8s' }}
        />

        {/* ── PUNCHING BAG SWAY (~62, 240) ── */}
        <g style={{ transformOrigin:'62px 175px', animation:'cd-bag 3.2s ease-in-out infinite' }}>
          {/* Subtle glow around bag when swaying */}
          <ellipse cx="62" cy="255" rx="24" ry="40"
            fill="#FF6020" filter="url(#cd-blur8)" opacity="0.14"/>
        </g>

        {/* ── BARBELL WEIGHT GLINTS (~265-330, 368) ── */}
        {/* Left plate glint */}
        <rect x="252" y="360" width="28" height="6" rx="3"
          fill="white" filter="url(#cd-blur4)" opacity="0"
          style={{ animation:'cd-glint 3.5s ease-in-out infinite', animationDelay:'0s' }}/>
        {/* Right plate glint */}
        <rect x="330" y="360" width="28" height="6" rx="3"
          fill="white" filter="url(#cd-blur4)" opacity="0"
          style={{ animation:'cd-glint 3.5s ease-in-out infinite', animationDelay:'1.7s' }}/>

        {/* ── ENERGY PULSE RINGS (centre field, brand sky-blue) ── */}
        <g ref={energyRef} opacity="0.40">
          {[0,1,2,3].map(i => (
            <circle key={i} cx="195" cy="420" r="55"
              fill="none" stroke="#38BDF8" strokeWidth="2.0"
              style={{ transformOrigin:'195px 420px', animation:'cd-pulse 2.4s ease-out infinite', animationDelay:`${i * 0.6}s` }}
            />
          ))}
        </g>

        {/* ── STOPWATCH SECOND HAND (~278, 728) ── */}
        <g style={{ transformOrigin:'278px 728px', animation:`cd-tick ${speaking ? '0.8s' : '1.0s'} steps(60) infinite` }}>
          <line x1="278" y1="728" x2="278" y2="712"
            stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" opacity="0.80"/>
        </g>

        {/* ── AMBIENT GYM ENERGY GLOW ── */}
        <ellipse cx="195" cy="430" rx="155" ry="100"
          ref={ambientRef}
          fill="#38BDF8" filter="url(#cd-blur20)" opacity="0.28"
          style={{ animation:'cd-breathe 3.2s ease-in-out infinite' }}
        />

        {/* ── BANNER GLOW (top, warm orange ~195,115) ── */}
        <ellipse cx="195" cy="118" rx="150" ry="28"
          fill="#FF6A00" filter="url(#cd-blur14)" opacity="0.14"
          style={{ animation:'cd-banner 4.0s ease-in-out infinite' }}
        />

        {/* ── FLOATING ENERGY MOTES ── */}
        {[
          { x:165, y:450, dur:'9s',  delay:'0s',   kf:'cd-mote-a' },
          { x:210, y:470, dur:'11s', delay:'2.8s', kf:'cd-mote-b' },
          { x:182, y:440, dur:'8s',  delay:'5.5s', kf:'cd-mote-c' },
          { x:228, y:455, dur:'10s', delay:'1.2s', kf:'cd-mote-a' },
          { x:172, y:465, dur:'12s', delay:'4.2s', kf:'cd-mote-b' },
          { x:220, y:445, dur:'9.5s',delay:'7.0s', kf:'cd-mote-c' },
        ].map((m,i) => (
          <circle key={i} cx={m.x} cy={m.y} r="2.4" fill="#38BDF8" opacity="0"
            style={{ animation:`${m.kf} ${speaking ? (parseFloat(m.dur)*0.50).toFixed(1)+'s' : m.dur} ease-in-out infinite`, animationDelay:m.delay }}
          />
        ))}

        {/* ── SPARKLE on window sunlight ── */}
        {[
          { x:178, y:318, sz:5, delay:'0s',   dur:'2.5s' },
          { x:212, y:310, sz:4, delay:'0.8s', dur:'3.0s' },
          { x:196, y:302, sz:4, delay:'1.5s', dur:'2.2s' },
          { x:162, y:328, sz:3, delay:'0.4s', dur:'3.5s' },
          { x:228, y:325, sz:3, delay:'1.2s', dur:'2.8s' },
        ].map((s,i) => (
          <g key={i} transform={`translate(${s.x},${s.y})`}
            style={{ transformOrigin:'0 0', animation:`cd-twinkle ${speaking ? (parseFloat(s.dur)*0.5).toFixed(1)+'s' : s.dur} ease-in-out infinite`, animationDelay:s.delay }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke="#E0F4FF" strokeWidth="1.2" strokeLinecap="round"
                transform={`rotate(${a})`}/>
            ))}
            <circle r="1.1" fill="#E0F4FF"/>
          </g>
        ))}

        {/* ── SPEAKING: extra fast energy rings ── */}
        {speaking && (
          <g style={{ opacity:0.38 }}>
            {[0,1,2].map(i => (
              <circle key={i} cx="195" cy="420" r="80"
                fill="none" stroke="#7DD3FC" strokeWidth="1.5"
                style={{ transformOrigin:'195px 420px', animation:'cd-pulse 1.2s ease-out infinite', animationDelay:`${i*0.4}s` }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
