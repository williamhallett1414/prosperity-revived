/**
 * HannahBackground — Cozy Mindset Room Illustration
 * Real cartoon therapy/coaching room as base. Animated SVG overlay adds:
 *   - Table lamp warm glow pulse (left)
 *   - Floor lamp warm glow pulse (centre-right)
 *   - Candle flicker on side table (right, near stone fountain)
 *   - Small candle flicker on console table (left)
 *   - Incense/diffuser steam wisps (right fountain area)
 *   - Coffee steam rising from mug
 *   - Window soft daylight breathe
 *   - Clock second-hand tick (wall, top-right)
 *   - Floating soft lavender/blue motes
 *   - Ambient warm breathing glow
 *   - Speaking state: lamps brighten, motes speed up, steam intensifies
 */
import { useEffect, useRef } from 'react';
import roomBg from '@/assets/hannah-background.jpg';

export default function HannahBackground({ speaking = false, listening = false, thinking = false }) {
  const ambientRef = useRef(null);
  const windowRef  = useRef(null);
  const steamRef   = useRef(null);

  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.style.transition = 'opacity 700ms ease';
      ambientRef.current.style.opacity = speaking ? '0.52' : listening ? '0.38' : '0.25';
    }
    if (windowRef.current) {
      windowRef.current.style.transition = 'opacity 700ms ease';
      windowRef.current.style.opacity = speaking ? '0.55' : '0.32';
    }
    if (steamRef.current) {
      steamRef.current.style.transition = 'opacity 700ms ease';
      steamRef.current.style.opacity = speaking ? '0.90' : '0.65';
    }
  }, [speaking, listening]);

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <style>{`
        /* Table lamp glow */
        @keyframes hb-lamp-l {
          0%,100% { opacity:.50; }
          35%     { opacity:.72; }
          65%     { opacity:.44; }
        }
        /* Floor lamp glow */
        @keyframes hb-lamp-f {
          0%,100% { opacity:.48; }
          40%     { opacity:.68; }
          75%     { opacity:.40; }
        }
        /* Candle flicker */
        @keyframes hb-candle-r {
          0%,100% { opacity:.58; }
          22%     { opacity:.82; }
          55%     { opacity:.50; }
          80%     { opacity:.76; }
        }
        @keyframes hb-candle-l {
          0%,100% { opacity:.52; }
          30%     { opacity:.78; }
          62%     { opacity:.88; }
          85%     { opacity:.46; }
        }
        @keyframes hb-flame {
          0%,100% { transform:scaleY(1)    translateX(0px); }
          28%     { transform:scaleY(1.30) translateX(0.8px); }
          55%     { transform:scaleY(.82)  translateX(-0.8px); }
          78%     { transform:scaleY(1.18) translateX(0.4px); }
        }
        /* Steam / incense wisps */
        @keyframes hb-steam-a {
          0%   { transform:translate(0,0);         opacity:0; }
          10%  { opacity:.65; }
          65%  { opacity:.50; }
          100% { transform:translate(-10px,-85px); opacity:0; }
        }
        @keyframes hb-steam-b {
          0%   { transform:translate(0,0);         opacity:0; }
          12%  { opacity:.58; }
          70%  { opacity:.45; }
          100% { transform:translate(8px,-75px);   opacity:0; }
        }
        @keyframes hb-steam-c {
          0%   { transform:translate(0,0);          opacity:0; }
          8%   { opacity:.62; }
          72%  { opacity:.48; }
          100% { transform:translate(-5px,-100px);  opacity:0; }
        }
        /* Window light breathe */
        @keyframes hb-window {
          0%,100% { opacity:.30; }
          50%     { opacity:.50; }
        }
        /* Clock tick */
        @keyframes hb-tick {
          0%,99%  { transform:rotate(0deg); }
          100%    { transform:rotate(360deg); }
        }
        /* Floating motes */
        @keyframes hb-mote-a {
          0%   { transform:translate(0,0);       opacity:0; }
          10%  { opacity:.60; }
          90%  { opacity:.45; }
          100% { transform:translate(6px,-95px); opacity:0; }
        }
        @keyframes hb-mote-b {
          0%   { transform:translate(0,0);        opacity:0; }
          12%  { opacity:.55; }
          88%  { opacity:.40; }
          100% { transform:translate(-8px,-80px); opacity:0; }
        }
        @keyframes hb-mote-c {
          0%   { transform:translate(0,0);         opacity:0; }
          8%   { opacity:.62; }
          92%  { opacity:.48; }
          100% { transform:translate(4px,-110px);  opacity:0; }
        }
        /* Ambient breathe */
        @keyframes hb-breathe {
          0%,100% { opacity:.25; }
          50%     { opacity:.40; }
        }
        /* Sparkle */
        @keyframes hb-twinkle {
          0%,100% { opacity:0;   transform:scale(.3); }
          50%     { opacity:.88; transform:scale(1.3); }
        }
        /* Lotus / sign shimmer */
        @keyframes hb-lotus {
          0%,100% { opacity:.10; }
          50%     { opacity:.24; }
        }
        /* Zen garden glow */
        @keyframes hb-zen {
          0%,100% { opacity:.14; }
          50%     { opacity:.28; }
        }
      `}</style>

      {/* ── Base cozy room illustration ── */}
      <img
        src={roomBg}
        alt="" aria-hidden="true" draggable={false}
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center top',
          display:'block',
        }}
      />

      {/* ── Soft vignette ── */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse at 50% 40%, transparent 26%, rgba(8,5,2,0.48) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Bottom fade for messages ── */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height:'55%',
        background:'linear-gradient(to bottom, transparent 0%, rgba(10,6,2,0.60) 50%, rgba(10,6,2,0.88) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Animated SVG overlay ── */}
      <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'visible' }}>
        <defs>
          <radialGradient id="hb-lamp-g" cx="50%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#FFE8A0" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FF9030" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="hb-cbl" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFD060" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FF8800" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="hb-window-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#D4EEFF" stopOpacity="1"/>
            <stop offset="100%" stopColor="#87CEEB" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="hb-lav-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#C4B5FD" stopOpacity="0.80"/>
            <stop offset="100%" stopColor="#AFC7E3" stopOpacity="0"/>
          </radialGradient>
          <filter id="hb-blur4"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="hb-blur8"><feGaussianBlur stdDeviation="8"/></filter>
          <filter id="hb-blur14"><feGaussianBlur stdDeviation="14"/></filter>
          <filter id="hb-blur20"><feGaussianBlur stdDeviation="20"/></filter>
        </defs>

        {/* ── TABLE LAMP left (~78, 430) ── */}
        <ellipse cx="78" cy="418" rx="52" ry="38"
          fill="url(#hb-lamp-g)" filter="url(#hb-blur14)"
          style={{ animation:'hb-lamp-l 3.4s ease-in-out infinite' }} opacity="0.50"/>
        {/* Floor spill below lamp */}
        <ellipse cx="78" cy="510" rx="65" ry="28"
          fill="#FFD060" filter="url(#hb-blur14)" opacity="0.14"
          style={{ animation:'hb-lamp-l 3.4s ease-in-out infinite', animationDelay:'0.5s' }}/>

        {/* ── FLOOR LAMP centre-right (~230, 355) ── */}
        <ellipse cx="230" cy="338" rx="58" ry="42"
          fill="url(#hb-lamp-g)" filter="url(#hb-blur14)"
          style={{ animation:'hb-lamp-f 3.8s ease-in-out infinite', animationDelay:'0.9s' }} opacity="0.48"/>
        <ellipse cx="230" cy="420" rx="70" ry="30"
          fill="#FFD060" filter="url(#hb-blur14)" opacity="0.12"
          style={{ animation:'hb-lamp-f 3.8s ease-in-out infinite', animationDelay:'0.6s' }}/>

        {/* ── WINDOW daylight (~195, 268) ── */}
        <ellipse cx="195" cy="265" rx="95" ry="88"
          ref={windowRef}
          fill="url(#hb-window-g)" filter="url(#hb-blur20)" opacity="0.32"
          style={{ animation:'hb-window 4.5s ease-in-out infinite' }}
        />
        {/* Floor light spill from window */}
        <ellipse cx="195" cy="680" rx="100" ry="38"
          fill="#D4EEFF" filter="url(#hb-blur14)" opacity="0.09"
          style={{ animation:'hb-window 4.5s ease-in-out infinite', animationDelay:'1.0s' }}
        />

        {/* ── RIGHT CANDLE on stone fountain table (~318, 495) ── */}
        <g>
          <circle cx="318" cy="488" r="18" fill="url(#hb-cbl)" filter="url(#hb-blur8)"
            style={{ animation:'hb-candle-r 1.9s ease-in-out infinite' }}/>
          <ellipse cx="318" cy="486" rx="3.8" ry="6.5" fill="#FFB300" opacity="0.86"
            style={{ transformOrigin:'318px 492px', animation:'hb-flame 0.44s ease-in-out infinite' }}/>
          <ellipse cx="318" cy="484" rx="2.2" ry="4" fill="#FFED60" opacity="0.92"
            style={{ transformOrigin:'318px 492px', animation:'hb-flame 0.44s ease-in-out infinite', animationDelay:'0.1s' }}/>
        </g>

        {/* ── LEFT SMALL CANDLE on console table (~135, 418) ── */}
        <g>
          <circle cx="135" cy="412" r="13" fill="url(#hb-cbl)" filter="url(#hb-blur8)"
            style={{ animation:'hb-candle-l 2.2s ease-in-out infinite', animationDelay:'0.7s' }}/>
          <ellipse cx="135" cy="410" rx="3" ry="5.5" fill="#FFB300" opacity="0.82"
            style={{ transformOrigin:'135px 415px', animation:'hb-flame 0.50s ease-in-out infinite', animationDelay:'0.2s' }}/>
          <ellipse cx="135" cy="408" rx="1.8" ry="3.5" fill="#FFED60" opacity="0.88"
            style={{ transformOrigin:'135px 415px', animation:'hb-flame 0.50s ease-in-out infinite', animationDelay:'0.08s' }}/>
        </g>

        {/* ── DIFFUSER / INCENSE STEAM right (~330, 528) ── */}
        <g ref={steamRef} opacity="0.65">
          {[
            { x:322, y:545, dur:'6.0s', delay:'0s',   kf:'hb-steam-a' },
            { x:334, y:542, dur:'7.2s', delay:'2.2s', kf:'hb-steam-b' },
            { x:326, y:548, dur:'5.5s', delay:'4.0s', kf:'hb-steam-c' },
            { x:338, y:544, dur:'6.8s', delay:'1.1s', kf:'hb-steam-b' },
          ].map((s,i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx="7" ry="13"
              fill="white" opacity="0" filter="url(#hb-blur4)"
              style={{ animation:`${s.kf} ${s.dur} ease-in-out infinite`, animationDelay:s.delay }}
            />
          ))}
        </g>

        {/* ── COFFEE MUG STEAM left (~125, 500) ── */}
        <g opacity="0.55">
          {[
            { x:120, y:515, dur:'5.8s', delay:'0.5s', kf:'hb-steam-a' },
            { x:130, y:512, dur:'6.5s', delay:'2.8s', kf:'hb-steam-b' },
          ].map((s,i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx="5" ry="10"
              fill="white" opacity="0" filter="url(#hb-blur4)"
              style={{ animation:`${s.kf} ${s.dur} ease-in-out infinite`, animationDelay:s.delay }}
            />
          ))}
        </g>

        {/* ── CLOCK second hand top-right (~330, 168) ── */}
        <g style={{ transformOrigin:'330px 168px', animation:`hb-tick ${speaking ? '0.8s' : '1.0s'} steps(60) infinite` }}>
          <line x1="330" y1="168" x2="330" y2="154"
            stroke="#AFC7E3" strokeWidth="1.6" strokeLinecap="round" opacity="0.75"/>
        </g>

        {/* ── AMBIENT warm lavender glow ── */}
        <ellipse cx="195" cy="440" rx="160" ry="110"
          ref={ambientRef}
          fill="url(#hb-lav-g)" filter="url(#hb-blur20)" opacity="0.25"
          style={{ animation:'hb-breathe 4.2s ease-in-out infinite' }}
        />

        {/* ── ZEN GARDEN glow (foreground ~195,770) ── */}
        <ellipse cx="195" cy="760" rx="100" ry="35"
          fill="#C4B5FD" filter="url(#hb-blur14)" opacity="0.14"
          style={{ animation:'hb-zen 5.0s ease-in-out infinite' }}
        />

        {/* ── LOTUS / SIGN shimmer right (~320, 390) ── */}
        <ellipse cx="322" cy="395" rx="55" ry="70"
          fill="#AFC7E3" filter="url(#hb-blur14)" opacity="0.10"
          style={{ animation:'hb-lotus 4.8s ease-in-out infinite' }}
        />

        {/* ── FLOATING soft lavender/blue motes ── */}
        {[
          { x:160, y:490, dur:'13s', delay:'0s',   kf:'hb-mote-a', col:'#C4B5FD' },
          { x:205, y:510, dur:'11s', delay:'3.2s', kf:'hb-mote-b', col:'#AFC7E3' },
          { x:178, y:480, dur:'14s', delay:'6.5s', kf:'hb-mote-c', col:'#C4B5FD' },
          { x:225, y:495, dur:'12s', delay:'1.5s', kf:'hb-mote-a', col:'#AFC7E3' },
          { x:168, y:505, dur:'10s', delay:'8.0s', kf:'hb-mote-b', col:'#C4B5FD' },
          { x:215, y:485, dur:'15s', delay:'4.8s', kf:'hb-mote-c', col:'#AFC7E3' },
        ].map((m,i) => (
          <circle key={i} cx={m.x} cy={m.y} r="2.0" fill={m.col} opacity="0"
            style={{ animation:`${m.kf} ${speaking ? (parseFloat(m.dur)*0.50).toFixed(1)+'s' : m.dur} ease-in-out infinite`, animationDelay:m.delay }}
          />
        ))}

        {/* ── SPARKLE near lamp / window ── */}
        {[
          { x:188, y:250, sz:4, delay:'0s',   dur:'3.0s' },
          { x:210, y:244, sz:3, delay:'1.0s', dur:'2.6s' },
          { x:196, y:238, sz:4, delay:'1.8s', dur:'3.4s' },
          { x:175, y:255, sz:3, delay:'0.5s', dur:'2.8s' },
          { x:218, y:258, sz:3, delay:'1.4s', dur:'3.2s' },
        ].map((s,i) => (
          <g key={i} transform={`translate(${s.x},${s.y})`}
            style={{ transformOrigin:'0 0', animation:`hb-twinkle ${speaking ? (parseFloat(s.dur)*0.5).toFixed(1)+'s' : s.dur} ease-in-out infinite`, animationDelay:s.delay }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke="#E8E4FF" strokeWidth="1.1" strokeLinecap="round"
                transform={`rotate(${a})`}/>
            ))}
            <circle r="1.0" fill="#E8E4FF"/>
          </g>
        ))}

        {/* ── SPEAKING: extra ambient pulse rings ── */}
        {speaking && (
          <g style={{ opacity:0.32 }}>
            {[0,1,2].map(i => (
              <ellipse key={i} cx="195" cy="440" rx="130" ry="88"
                fill="none" stroke="#C4B5FD" strokeWidth="1.6"
                style={{ transformOrigin:'195px 440px',
                  animation:'hb-lotus 1.8s ease-out infinite',
                  animationDelay:`${i*0.6}s` }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
