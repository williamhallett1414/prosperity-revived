/**
 * DanielBackground — Faith Kitchen Illustration
 * Real cartoon kitchen painting as base. Animated SVG overlay adds:
 *   - 3 pendant light glow pulses (ceiling lamps)
 *   - Front-left candle flicker + right candle flicker
 *   - Steam wisps rising from pot on stove
 *   - Oven window orange glow pulse
 *   - Cross light rays (background, subtle) + sparkle stars
 *   - Ambient warm kitchen breathing glow
 *   - Speaking state: steam intensifies, lights brighten, cross rays appear
 */
import { useEffect, useRef } from 'react';
import kitchenBg from '@/assets/chef-daniel-background.jpg';

export default function DanielBackground({ speaking = false, listening = false, thinking = false }) {
  const ambientRef = useRef(null);
  const raysRef    = useRef(null);
  const steamRef   = useRef(null);

  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.style.transition = 'opacity 600ms ease';
      ambientRef.current.style.opacity = speaking ? '0.55' : listening ? '0.40' : '0.28';
    }
    if (raysRef.current) {
      raysRef.current.style.transition = 'opacity 600ms ease';
      raysRef.current.style.opacity = speaking ? '0.60' : '0.28';
    }
    if (steamRef.current) {
      steamRef.current.style.transition = 'opacity 600ms ease';
      steamRef.current.style.opacity = speaking ? '0.90' : '0.65';
    }
  }, [speaking, listening]);

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <style>{`
        /* Pendant lamp glow */
        @keyframes db-lamp-l {
          0%,100% { opacity:.42; r:28; }
          40%     { opacity:.60; r:34; }
          70%     { opacity:.38; r:26; }
        }
        @keyframes db-lamp-m {
          0%,100% { opacity:.45; r:30; }
          30%     { opacity:.65; r:38; }
          65%     { opacity:.40; r:27; }
        }
        @keyframes db-lamp-r {
          0%,100% { opacity:.40; r:26; }
          50%     { opacity:.58; r:32; }
          80%     { opacity:.36; r:24; }
        }
        /* Candle flicker */
        @keyframes db-candle-l {
          0%,100% { opacity:.60; }
          25%     { opacity:.88; }
          55%     { opacity:.52; }
          80%     { opacity:.80; }
        }
        @keyframes db-candle-r {
          0%,100% { opacity:.55; }
          20%     { opacity:.82; }
          60%     { opacity:.90; }
          85%     { opacity:.48; }
        }
        @keyframes db-flame {
          0%,100% { transform:scaleY(1)   translateX(0px); }
          25%     { transform:scaleY(1.35) translateX(1px); }
          50%     { transform:scaleY(.80) translateX(-1px); }
          75%     { transform:scaleY(1.25) translateX(.5px); }
        }
        @keyframes db-flame-r {
          0%,100% { transform:scaleY(1)   translateX(0px); }
          20%     { transform:scaleY(.78) translateX(1px); }
          50%     { transform:scaleY(1.40) translateX(-1px); }
          80%     { transform:scaleY(.92) translateX(1px); }
        }
        /* Steam wisp */
        @keyframes db-steam-a {
          0%   { transform:translate(0,0)     opacity:0; }
          8%   { opacity:.70; }
          60%  { opacity:.55; }
          100% { transform:translate(-12px,-80px) opacity:0; }
        }
        @keyframes db-steam-b {
          0%   { transform:translate(0,0)    opacity:0; }
          10%  { opacity:.60; }
          65%  { opacity:.48; }
          100% { transform:translate(10px,-70px) opacity:0; }
        }
        @keyframes db-steam-c {
          0%   { transform:translate(0,0)    opacity:0; }
          12%  { opacity:.65; }
          70%  { opacity:.50; }
          100% { transform:translate(-6px,-90px) opacity:0; }
        }
        /* Oven glow */
        @keyframes db-oven {
          0%,100% { opacity:.40; }
          35%     { opacity:.68; }
          70%     { opacity:.34; }
        }
        /* Cross rays */
        @keyframes db-rays {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        /* Ambient breathe */
        @keyframes db-breathe {
          0%,100% { opacity:.28; }
          50%     { opacity:.44; }
        }
        /* Sparkle */
        @keyframes db-twinkle {
          0%,100% { opacity:0;   transform:scale(.3); }
          50%     { opacity:.90; transform:scale(1.4); }
        }
        /* Tomato/veggie shimmer */
        @keyframes db-shimmer {
          0%,100% { opacity:.12; }
          50%     { opacity:.28; }
        }
      `}</style>

      {/* ── Base kitchen illustration ── */}
      <img
        src={kitchenBg}
        alt="" aria-hidden="true" draggable={false}
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center top',
          display:'block',
        }}
      />

      {/* ── Dark vignette for readability ── */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse at 50% 35%, transparent 25%, rgba(8,4,0,0.50) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Bottom fade for message area ── */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height:'55%',
        background:'linear-gradient(to bottom, transparent 0%, rgba(12,6,0,0.62) 50%, rgba(12,6,0,0.88) 100%)',
        pointerEvents:'none',
      }}/>

      {/* ── Animated SVG overlay ── */}
      <svg viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'visible' }}>
        <defs>
          <radialGradient id="db-lamp-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFE090" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FF9030" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="db-cbl" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFD060" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FF8800" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="db-oven-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FF6010" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FF3000" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="db-ray-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFE87A" stopOpacity="0.88"/>
            <stop offset="40%"  stopColor="#FFC940" stopOpacity="0.42"/>
            <stop offset="100%" stopColor="#FF8800" stopOpacity="0"/>
          </radialGradient>
          <filter id="db-blur4"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="db-blur8"><feGaussianBlur stdDeviation="8"/></filter>
          <filter id="db-blur14"><feGaussianBlur stdDeviation="14"/></filter>
          <filter id="db-blur20"><feGaussianBlur stdDeviation="20"/></filter>
        </defs>

        {/* ── PENDANT LAMPS glow (left ~88, mid ~215, right ~310) ── */}
        {/* Left lamp */}
        <circle cx="88" cy="95" r="28" fill="url(#db-lamp-g)" filter="url(#db-blur14)"
          style={{ animation:'db-lamp-l 2.8s ease-in-out infinite' }}/>
        <ellipse cx="88" cy="130" rx="50" ry="28" fill="#FFD060" filter="url(#db-blur14)" opacity="0.14"
          style={{ animation:'db-lamp-l 2.8s ease-in-out infinite', animationDelay:'0.3s' }}/>

        {/* Mid lamp */}
        <circle cx="215" cy="82" r="30" fill="url(#db-lamp-g)" filter="url(#db-blur14)"
          style={{ animation:'db-lamp-m 3.2s ease-in-out infinite', animationDelay:'0.7s' }}/>
        <ellipse cx="215" cy="120" rx="55" ry="30" fill="#FFD060" filter="url(#db-blur14)" opacity="0.16"
          style={{ animation:'db-lamp-m 3.2s ease-in-out infinite', animationDelay:'0.5s' }}/>

        {/* Right lamp */}
        <circle cx="314" cy="90" r="26" fill="url(#db-lamp-g)" filter="url(#db-blur14)"
          style={{ animation:'db-lamp-r 2.4s ease-in-out infinite', animationDelay:'1.4s' }}/>
        <ellipse cx="314" cy="122" rx="46" ry="24" fill="#FFD060" filter="url(#db-blur14)" opacity="0.12"
          style={{ animation:'db-lamp-r 2.4s ease-in-out infinite', animationDelay:'1.1s' }}/>

        {/* ── CROSS LIGHT RAYS (centred on cross ~210,285) ── */}
        <g ref={raysRef} opacity="0.28" style={{ transformOrigin:'210px 285px' }}>
          <g style={{ transformOrigin:'210px 285px', animation:'db-rays 32s linear infinite' }}>
            {[0,22.5,45,67.5,90,112.5,135,157.5,180,202.5,225,247.5,270,292.5,315,337.5].map((a,i) => {
              const rad = a * Math.PI / 180;
              const len = i % 2 === 0 ? 160 : 100;
              return (
                <line key={i}
                  x1={210 + Math.cos(rad)*10} y1={285 + Math.sin(rad)*10}
                  x2={210 + Math.cos(rad)*len} y2={285 + Math.sin(rad)*len}
                  stroke="#FFE87A" strokeWidth={i%2===0 ? 2.0 : 1.2}
                  opacity={i%2===0 ? 0.50 : 0.28} strokeLinecap="round"
                />
              );
            })}
          </g>
          <ellipse cx="210" cy="285" rx="36" ry="36"
            fill="url(#db-ray-g)" filter="url(#db-blur14)" opacity="0.65"/>
        </g>

        {/* ── CROSS sparkle stars ── */}
        {[
          { x:196, y:265, sz:5, delay:'0s',   dur:'2.6s' },
          { x:224, y:270, sz:4, delay:'0.9s', dur:'3.0s' },
          { x:208, y:258, sz:3, delay:'1.6s', dur:'2.2s' },
          { x:198, y:296, sz:3, delay:'0.4s', dur:'3.4s' },
          { x:222, y:300, sz:4, delay:'1.2s', dur:'2.8s' },
        ].map((s,i) => (
          <g key={i} transform={`translate(${s.x},${s.y})`}
            style={{ transformOrigin:'0 0', animation:`db-twinkle ${speaking ? (parseFloat(s.dur)*0.5).toFixed(1)+'s' : s.dur} ease-in-out infinite`, animationDelay:s.delay }}>
            {[0,45,90,135].map(a => (
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke="#FFEE80" strokeWidth="1.2" strokeLinecap="round"
                transform={`rotate(${a})`}/>
            ))}
            <circle r="1.1" fill="#FFEE80"/>
          </g>
        ))}

        {/* ── FRONT-LEFT CANDLE (~72,598) ── */}
        <g>
          <circle cx="72" cy="592" r="20" fill="url(#db-cbl)" filter="url(#db-blur8)"
            style={{ animation:'db-candle-l 1.7s ease-in-out infinite' }}/>
          <ellipse cx="72" cy="590" rx="4" ry="7" fill="#FFB300" opacity="0.88"
            style={{ transformOrigin:'72px 597px', animation:'db-flame 0.42s ease-in-out infinite' }}/>
          <ellipse cx="72" cy="588" rx="2.5" ry="4.5" fill="#FFED60" opacity="0.92"
            style={{ transformOrigin:'72px 597px', animation:'db-flame 0.42s ease-in-out infinite', animationDelay:'0.1s' }}/>
        </g>

        {/* ── RIGHT ALTAR CANDLE (~280,378) ── */}
        <g>
          <circle cx="280" cy="372" r="16" fill="url(#db-cbl)" filter="url(#db-blur8)"
            style={{ animation:'db-candle-r 2.0s ease-in-out infinite', animationDelay:'0.6s' }}/>
          <ellipse cx="280" cy="370" rx="3.5" ry="6" fill="#FFB300" opacity="0.85"
            style={{ transformOrigin:'280px 376px', animation:'db-flame-r 0.50s ease-in-out infinite' }}/>
          <ellipse cx="280" cy="368" rx="2" ry="3.5" fill="#FFED60" opacity="0.90"
            style={{ transformOrigin:'280px 376px', animation:'db-flame-r 0.50s ease-in-out infinite', animationDelay:'0.12s' }}/>
        </g>

        {/* ── LEFT ALTAR CANDLE (~148,378) ── */}
        <g>
          <circle cx="148" cy="372" r="15" fill="url(#db-cbl)" filter="url(#db-blur8)"
            style={{ animation:'db-candle-l 1.5s ease-in-out infinite', animationDelay:'0.9s' }}/>
          <ellipse cx="148" cy="370" rx="3.5" ry="6" fill="#FFB300" opacity="0.82"
            style={{ transformOrigin:'148px 376px', animation:'db-flame 0.46s ease-in-out infinite', animationDelay:'0.2s' }}/>
          <ellipse cx="148" cy="368" rx="2" ry="3.5" fill="#FFED60" opacity="0.88"
            style={{ transformOrigin:'148px 376px', animation:'db-flame 0.46s ease-in-out infinite', animationDelay:'0.05s' }}/>
        </g>

        {/* ── WALL SCONCE right side (~355,360) ── */}
        <g>
          <circle cx="355" cy="355" r="18" fill="url(#db-cbl)" filter="url(#db-blur8)"
            style={{ animation:'db-candle-r 2.3s ease-in-out infinite', animationDelay:'1.2s' }}/>
          <ellipse cx="355" cy="353" rx="3" ry="5" fill="#FFB300" opacity="0.80"
            style={{ transformOrigin:'355px 358px', animation:'db-flame-r 0.55s ease-in-out infinite', animationDelay:'0.3s' }}/>
        </g>

        {/* ── STEAM from pot (~192,390) ── */}
        <g ref={steamRef} opacity="0.65">
          {[
            { x:178, y:400, dur:'5.5s', delay:'0s',   kf:'db-steam-a' },
            { x:192, y:398, dur:'6.2s', delay:'1.8s', kf:'db-steam-b' },
            { x:205, y:402, dur:'5.0s', delay:'3.5s', kf:'db-steam-c' },
            { x:184, y:405, dur:'7.0s', delay:'0.9s', kf:'db-steam-b' },
            { x:198, y:400, dur:'5.8s', delay:'4.8s', kf:'db-steam-a' },
          ].map((s,i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx="8" ry="14"
              fill="white" opacity="0"
              filter="url(#db-blur4)"
              style={{ animation:`${s.kf} ${s.dur} ease-in-out infinite`, animationDelay:s.delay }}
            />
          ))}
        </g>

        {/* ── OVEN window glow (~195,548) ── */}
        <ellipse cx="195" cy="548" rx="62" ry="28"
          fill="url(#db-oven-g)" filter="url(#db-blur14)" opacity="0.40"
          style={{ animation:'db-oven 2.6s ease-in-out infinite' }}
        />
        {/* Floor glow from oven */}
        <ellipse cx="195" cy="640" rx="90" ry="38"
          fill="#FF6010" filter="url(#db-blur14)" opacity="0.12"
          style={{ animation:'db-oven 2.6s ease-in-out infinite', animationDelay:'0.4s' }}
        />

        {/* ── AMBIENT warm kitchen glow ── */}
        <ellipse cx="195" cy="420" rx="160" ry="110"
          ref={ambientRef}
          fill="#FFD060" filter="url(#db-blur20)" opacity="0.28"
          style={{ animation:'db-breathe 3.8s ease-in-out infinite' }}
        />

        {/* ── TOMATO / veggie shimmer (foreground counter, ~135,660) ── */}
        <ellipse cx="148" cy="650" rx="50" ry="22"
          fill="#FF4020" filter="url(#db-blur8)" opacity="0.12"
          style={{ animation:'db-shimmer 4.5s ease-in-out infinite' }}
        />

        {/* ── SPEAKING: extra steam + ray burst ── */}
        {speaking && (
          <>
            {/* Extra fast ray spin */}
            <g style={{ transformOrigin:'210px 285px', animation:'db-rays 9s linear infinite', opacity:0.30 }}>
              {[11.25,33.75,56.25,78.75,101.25,123.75,146.25,168.75,191.25,213.75,236.25,258.75,281.25,303.75,326.25,348.75].map((a,i) => {
                const rad = a * Math.PI / 180;
                return (
                  <line key={i}
                    x1={210 + Math.cos(rad)*8} y1={285 + Math.sin(rad)*8}
                    x2={210 + Math.cos(rad)*130} y2={285 + Math.sin(rad)*130}
                    stroke="#FFF0A0" strokeWidth="1.0" opacity="0.40" strokeLinecap="round"
                  />
                );
              })}
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
