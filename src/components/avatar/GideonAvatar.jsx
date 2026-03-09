/**
 * GideonAvatar v2 — fully illustrated SVG character, larger + higher quality.
 * Bigger proportions, richer gradients, more anatomical detail, better hair/beard texture.
 * States: idle | speaking | listening | thinking
 */
import React, { useEffect, useRef, useState } from 'react';

const C = {
  skin:'#C8845A', skinShadow:'#8C5430', skinLight:'#E8A878', skinHighlight:'#F0C8A0',
  hair:'#3A2010', hairMid:'#5A3418', hairLight:'#7A4E28',
  beard:'#2E1A08', beardMid:'#4A2E14', beardLight:'#6A4020',
  robeWhite:'#F5F0E8', robeLight:'#EDE8DC', robeMid:'#D8D2C4', robeShadow:'#C0BAB0', robeDark:'#A8A298',
  gold:'#C9A227', goldBright:'#F0D060', goldPale:'#F8EBA0', goldDark:'#8A6A00',
  eyeWhite:'#FEFCF8', iris:'#6B4422', irisMid:'#4A2C10', pupil:'#0A0400',
  lash:'#1E0C04', brow:'#3A2010',
  mouthPink:'#C07060', mouthDark:'#7A3820', teeth:'#FEFEFE', tongue:'#D06050',
  slipper:'#EAE4D8', slipperFuzz:'#F8F4EE',
  chaliceBody:'#D8C890', chaliceGold:'#B8960C', chaliceLight:'#F0E0A0',
  orbGold:'#C9A227', orbTan:'#C4A882',
};

const ORBS = [
  {id:0,cx:105,cy:42, r:12, col:'gold',dl:0.0,dur:3.2},
  {id:1,cx:152,cy:28, r:14, col:'gold',dl:0.4,dur:2.8},
  {id:2,cx:76, cy:56, r:8,  col:'tan', dl:0.8,dur:3.6},
  {id:3,cx:178,cy:50, r:10, col:'gold',dl:0.2,dur:2.6},
  {id:4,cx:125,cy:20, r:9,  col:'tan', dl:1.1,dur:3.0},
  {id:5,cx:196,cy:75, r:7,  col:'gold',dl:0.6,dur:4.0},
  {id:6,cx:66, cy:80, r:9,  col:'tan', dl:1.4,dur:3.4},
  {id:7,cx:165,cy:78, r:8,  col:'gold',dl:0.9,dur:2.9},
  {id:8,cx:90, cy:24, r:7,  col:'tan', dl:1.7,dur:3.8},
  {id:9,cx:140,cy:60, r:6,  col:'gold',dl:0.5,dur:2.5},
];

const STARS=[
  {cx:136,cy:48,sz:5,dl:0.3},{cx:84,cy:34,sz:4,dl:1.0},
  {cx:182,cy:60,sz:4.5,dl:0.7},{cx:112,cy:64,sz:3.5,dl:1.5},{cx:158,cy:38,sz:3,dl:0.9}
];

export default function GideonAvatar({isSpeaking=false,isListening=false,isThinking=false,width=280,height=310,className=''}) {
  const state = isSpeaking?'speaking':isListening?'listening':isThinking?'thinking':'idle';

  const [blink,setBlink]=useState(false);
  const blinkTimer=useRef(null);
  useEffect(()=>{
    const go=()=>{ blinkTimer.current=setTimeout(()=>{ setBlink(true); setTimeout(()=>{ setBlink(false); go(); },150); },2200+Math.random()*3800); };
    go(); return()=>clearTimeout(blinkTimer.current);
  },[]);

  const [mouthOpen,setMouthOpen]=useState(0);
  const mouthTimer=useRef(null);
  useEffect(()=>{
    if(!isSpeaking){setMouthOpen(0);return;}
    let ph=0; mouthTimer.current=setInterval(()=>{ ph+=0.36; setMouthOpen(Math.max(0,Math.sin(ph)*0.92)); },72);
    return()=>clearInterval(mouthTimer.current);
  },[isSpeaking]);

  const bodyAnim=state==='speaking'?'ga2-bounce':state==='listening'?'ga2-lean':state==='thinking'?'ga2-sway':'ga2-float';
  const bodyDur=state==='speaking'?'0.50s':state==='listening'?'1.4s':state==='thinking'?'2.8s':'3.8s';
  const glowOp=state==='speaking'?0.80:state==='listening'?0.55:state==='thinking'?0.40:0.25;
  const eyeSY=blink?0.06:1;

  return (
    <div className={className} style={{width,height,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <style>{`
        @keyframes ga2-float{0%,100%{transform:translateY(0) rotate(0deg)}45%{transform:translateY(-9px) rotate(.6deg)}72%{transform:translateY(-6px) rotate(-.5deg)}}
        @keyframes ga2-bounce{0%,100%{transform:translateY(-2px) scale(1)}18%{transform:translateY(-12px) scale(1.04)}42%{transform:translateY(-3px) scale(1.01)}62%{transform:translateY(-13px) scale(1.05)}82%{transform:translateY(-4px) scale(1.02)}}
        @keyframes ga2-lean{0%,100%{transform:translateY(-5px) rotate(0deg)}32%{transform:translateY(-11px) rotate(1.8deg)}68%{transform:translateY(-10px) rotate(-1.8deg)}}
        @keyframes ga2-sway{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-4px) rotate(2.2deg)}75%{transform:translateY(-4px) rotate(-2.2deg)}}
        @keyframes ga2-orb{0%,100%{transform:translateY(0) scale(1);opacity:.85}50%{transform:translateY(-8px) scale(1.10);opacity:1}}
        @keyframes ga2-orb-fast{0%,100%{transform:translateY(0) scale(.93);opacity:.78}50%{transform:translateY(-11px) scale(1.18);opacity:1}}
        @keyframes ga2-star{0%,100%{opacity:.08;transform:scale(.5) rotate(0deg)}50%{opacity:.95;transform:scale(1.5) rotate(45deg)}}
        @keyframes ga2-ripple{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.8);opacity:0}}
        @keyframes ga2-dot{0%,80%,100%{opacity:.15;transform:translateY(0)}40%{opacity:1;transform:translateY(-5px)}}
        @keyframes ga2-halo{0%,100%{opacity:var(--gho,.25);transform:scale(1)}50%{opacity:calc(var(--gho,.25) + .15);transform:scale(1.04)}}
        @keyframes ga2-ring-cw{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes ga2-ring-ccw{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
        @keyframes ga2-shimmer{0%,100%{filter:brightness(1)}50%{filter:brightness(1.12)}}
        @keyframes ga2-shimmer-spk{0%,100%{filter:brightness(1.06) drop-shadow(0 0 10px rgba(201,162,39,.5))}28%{filter:brightness(1.36) drop-shadow(0 0 28px rgba(201,162,39,1))}58%{filter:brightness(1.12) drop-shadow(0 0 12px rgba(201,162,39,.6))}}
        @keyframes ga2-arm-idle{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-7deg)}}
        @keyframes ga2-arm-spk{0%,100%{transform:rotate(-5deg)}22%{transform:rotate(-15deg)}72%{transform:rotate(3deg)}}
      `}</style>

      <svg viewBox="0 0 260 380" width={width} height={height} style={{overflow:'visible'}}>
        <defs>
          <radialGradient id="ga2-halo-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.goldPale} stopOpacity=".9"/>
            <stop offset="45%" stopColor={C.gold} stopOpacity=".4"/>
            <stop offset="100%" stopColor={C.gold} stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ga2-skin" cx="40%" cy="34%" r="62%">
            <stop offset="0%" stopColor={C.skinHighlight}/>
            <stop offset="40%" stopColor={C.skinLight}/>
            <stop offset="75%" stopColor={C.skin}/>
            <stop offset="100%" stopColor={C.skinShadow}/>
          </radialGradient>
          <radialGradient id="ga2-skin2" cx="38%" cy="36%" r="58%">
            <stop offset="0%" stopColor={C.skinLight}/>
            <stop offset="65%" stopColor={C.skin}/>
            <stop offset="100%" stopColor={C.skinShadow}/>
          </radialGradient>
          <linearGradient id="ga2-robe" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.robeShadow}/>
            <stop offset="22%" stopColor={C.robeLight}/>
            <stop offset="50%" stopColor={C.robeWhite}/>
            <stop offset="78%" stopColor={C.robeLight}/>
            <stop offset="100%" stopColor={C.robeShadow}/>
          </linearGradient>
          <linearGradient id="ga2-robe-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={C.robeWhite}/>
            <stop offset="60%" stopColor={C.robeLight}/>
            <stop offset="100%" stopColor={C.robeMid}/>
          </linearGradient>
          <radialGradient id="ga2-orb-gold" cx="36%" cy="30%" r="62%">
            <stop offset="0%" stopColor={C.goldBright}/>
            <stop offset="50%" stopColor={C.gold}/>
            <stop offset="100%" stopColor={C.goldDark}/>
          </radialGradient>
          <radialGradient id="ga2-orb-tan" cx="36%" cy="30%" r="62%">
            <stop offset="0%" stopColor="#EAD4AE"/>
            <stop offset="55%" stopColor={C.orbTan}/>
            <stop offset="100%" stopColor="#6A5030"/>
          </radialGradient>
          <radialGradient id="ga2-iris" cx="35%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#9C6840"/>
            <stop offset="50%" stopColor={C.iris}/>
            <stop offset="100%" stopColor={C.irisMid}/>
          </radialGradient>
          <radialGradient id="ga2-hair" cx="42%" cy="25%" r="68%">
            <stop offset="0%" stopColor={C.hairLight}/>
            <stop offset="55%" stopColor={C.hairMid}/>
            <stop offset="100%" stopColor={C.hair}/>
          </radialGradient>
          <radialGradient id="ga2-beard" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stopColor={C.beardLight}/>
            <stop offset="60%" stopColor={C.beardMid}/>
            <stop offset="100%" stopColor={C.beard}/>
          </radialGradient>
          <radialGradient id="ga2-gold-trim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={C.goldBright}/>
            <stop offset="100%" stopColor={C.gold}/>
          </radialGradient>
          <filter id="ga2-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5"/>
          </filter>
          <clipPath id="ga2-ecL"><ellipse cx="106" cy="124" rx="13" ry="11"/></clipPath>
          <clipPath id="ga2-ecR"><ellipse cx="154" cy="124" rx="13" ry="11"/></clipPath>
        </defs>

        {/* ── Halo ── */}
        <ellipse cx="130" cy="195" rx="80" ry="100" fill="url(#ga2-halo-g)"
          style={{'--gho':glowOp,transformOrigin:'130px 195px',animation:'ga2-halo 3.2s ease-in-out infinite'}}/>

        {/* ── Listening ripples ── */}
        {state==='listening'&&[0,1,2].map(i=>(
          <ellipse key={i} cx="130" cy="195" rx="84" ry="104" fill="none"
            stroke={C.goldPale} strokeWidth="1.4"
            style={{transformOrigin:'130px 195px',animation:'ga2-ripple 2.0s ease-out infinite',animationDelay:`${i*0.65}s`}}/>
        ))}

        {/* ── Spinning rings ── */}
        <circle cx="130" cy="112" r="78" fill="none" stroke={C.goldPale} strokeWidth=".5" strokeDasharray="10 12"
          opacity={state==='speaking'?.45:.14}
          style={{transformOrigin:'130px 112px',animation:`ga2-ring-cw ${state==='speaking'?'3.5s':'12s'} linear infinite`}}/>
        <circle cx="130" cy="112" r="66" fill="none" stroke={C.gold} strokeWidth=".4" strokeDasharray="5 16"
          opacity={state==='idle'?.09:.18}
          style={{transformOrigin:'130px 112px',animation:`ga2-ring-ccw ${state==='speaking'?'5s':'18s'} linear infinite`}}/>

        {/* ── Orbs ── */}
        {ORBS.map(o=>(
          <g key={o.id} style={{transformOrigin:`${o.cx}px ${o.cy}px`,
            animation:`${state==='speaking'?'ga2-orb-fast':'ga2-orb'} ${state==='speaking'?(o.dur*.34).toFixed(1)+'s':o.dur+'s'} ease-in-out infinite`,
            animationDelay:`${o.dl}s`}}>
            <ellipse cx={o.cx+2} cy={o.cy+2} rx={o.r*1.05} ry={o.r*.9}
              fill={o.col==='gold'?'#705000':'#604020'} opacity=".35"/>
            <circle cx={o.cx} cy={o.cy} r={o.r} fill={o.col==='gold'?'url(#ga2-orb-gold)':'url(#ga2-orb-tan)'}/>
            <ellipse cx={o.cx-o.r*.3} cy={o.cy-o.r*.32} rx={o.r*.35} ry={o.r*.24}
              fill="white" opacity=".52" transform={`rotate(-28,${o.cx-o.r*.3},${o.cy-o.r*.32})`}/>
            <ellipse cx={o.cx+o.r*.2} cy={o.cy+o.r*.25} rx={o.r*.18} ry={o.r*.12}
              fill="white" opacity=".18"/>
          </g>
        ))}

        {/* ── Stars ── */}
        {STARS.map(s=>(
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{transformOrigin:'0 0',animation:`ga2-star ${state==='speaking'?'0.85s':'2.6s'} ease-in-out infinite`,animationDelay:`${s.dl}s`}}>
            {[0,45,90,135].map(a=>(
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke={C.goldBright} strokeWidth="1.1" strokeLinecap="round" transform={`rotate(${a})`}/>
            ))}
            <circle cx="0" cy="0" r="1.2" fill={C.goldBright} opacity=".8"/>
          </g>
        ))}

        {/* ══ BODY GROUP ══ */}
        <g style={{transformOrigin:'130px 360px',
          animation:`${bodyAnim} ${bodyDur} ease-in-out infinite, ${state==='speaking'?'ga2-shimmer-spk .50s ease-in-out infinite':'ga2-shimmer 4s ease-in-out infinite'}`}}>

          {/* ── Slippers ── */}
          <ellipse cx="104" cy="358" rx="24" ry="11" fill={C.slipper}/>
          <path d="M80,355 Q104,347 128,355 Q104,365 80,355Z" fill={C.slipperFuzz} opacity=".65"/>
          <ellipse cx="104" cy="358" rx="24" ry="11" fill="none" stroke={C.robeShadow} strokeWidth=".5" opacity=".3"/>
          <ellipse cx="156" cy="358" rx="24" ry="11" fill={C.slipper}/>
          <path d="M132,355 Q156,347 180,355 Q156,365 132,355Z" fill={C.slipperFuzz} opacity=".65"/>
          <ellipse cx="156" cy="358" rx="24" ry="11" fill="none" stroke={C.robeShadow} strokeWidth=".5" opacity=".3"/>

          {/* ── Robe main body ── */}
          <path d="M88,166 C74,172 64,188 58,208 L52,350 L208,350 L202,208 C196,188 186,172 172,166 Z" fill="url(#ga2-robe)"/>
          {/* Robe vertical center highlight */}
          <path d="M118,170 L118,348 L142,348 L142,170 Z" fill={C.robeWhite} opacity=".45"/>
          {/* Robe fold shadows sides */}
          <path d="M58,215 C55,240 54,280 54,330 L62,350 L58,208Z" fill={C.robeShadow} opacity=".5"/>
          <path d="M202,215 C205,240 206,280 206,330 L198,350 L202,208Z" fill={C.robeShadow} opacity=".5"/>
          {/* Robe hem folds */}
          <path d="M52,340 Q90,332 130,335 Q170,332 208,340 L208,350 L52,350Z" fill={C.robeMid} opacity=".6"/>

          {/* ── Gold collar trim ── */}
          <path d="M94,166 Q130,156 166,166" fill="none" stroke={C.gold} strokeWidth="5.5" strokeLinecap="round"/>
          <path d="M94,166 Q130,156 166,166" fill="none" stroke={C.goldBright} strokeWidth="2" strokeLinecap="round" opacity=".65"/>
          <path d="M94,166 Q130,156 166,166" fill="none" stroke="white" strokeWidth=".8" strokeLinecap="round" opacity=".3"/>

          {/* ── Left sleeve ── */}
          <path d="M88,166 C82,172 72,184 66,196 L56,246 C60,248 66,248 70,246 L80,202 C84,190 88,178 90,170Z"
            fill={C.robeShadow} opacity=".6"/>
          {/* Left sleeve gold trim */}
          <path d="M78,194 L58,247" stroke={C.gold} strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M78,194 L58,247" stroke={C.goldBright} strokeWidth="1.6" strokeLinecap="round" opacity=".65"/>
          <path d="M78,194 L58,247" stroke="white" strokeWidth=".7" strokeLinecap="round" opacity=".3"/>

          {/* ── Right sleeve ── */}
          <path d="M172,166 C178,172 188,184 194,196 L204,244 C200,246 194,246 190,244 L180,200 C176,188 172,177 170,170Z"
            fill={C.robeShadow} opacity=".6"/>
          {/* Right sleeve gold trim */}
          <path d="M182,194 L202,244" stroke={C.gold} strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M182,194 L202,244" stroke={C.goldBright} strokeWidth="1.6" strokeLinecap="round" opacity=".65"/>
          <path d="M182,194 L202,244" stroke="white" strokeWidth=".7" strokeLinecap="round" opacity=".3"/>

          {/* ── Sash/belt center panel ── */}
          <rect x="110" y="192" width="40" height="156" rx="3" fill={C.robeWhite} opacity=".88"/>
          {/* Gold horizontal sash stripes */}
          {[202,216,230,244].map(y=>(
            <g key={y}>
              <rect x="110" y={y} width="40" height="3.5" rx="1.8" fill={C.gold} opacity=".82"/>
              <rect x="110" y={y} width="40" height="3.5" rx="1.8" fill="none" stroke={C.goldBright} strokeWidth=".6" opacity=".5"/>
            </g>
          ))}
          {/* Belt knot */}
          <ellipse cx="130" cy="194" rx="14" ry="8.5" fill={C.gold}/>
          <ellipse cx="130" cy="194" rx="14" ry="8.5" fill="none" stroke={C.goldBright} strokeWidth="1" opacity=".6"/>
          <ellipse cx="128.5" cy="192.5" rx="5" ry="3.5" fill={C.goldBright} opacity=".5"/>

          {/* ── LEFT ARM — open palm gesture ── */}
          <g style={{transformOrigin:'96px 174px',
            animation:`${state==='speaking'?'ga2-arm-spk .50s':'ga2-arm-idle 3.8s'} ease-in-out infinite`}}>
            {/* Upper arm */}
            <path d="M96,174 C88,178 76,194 62,214" stroke={C.skin} strokeWidth="20" strokeLinecap="round" fill="none"/>
            <path d="M96,174 C88,178 76,194 62,214" stroke={C.skinShadow} strokeWidth="20" strokeLinecap="round" fill="none" opacity=".25"/>
            <path d="M96,174 C88,178 76,194 62,214" stroke={C.skinLight} strokeWidth="11" strokeLinecap="round" fill="none" opacity=".45"/>
            {/* Forearm */}
            <path d="M62,214 C54,224 50,234 52,244" stroke={C.skin} strokeWidth="18" strokeLinecap="round" fill="none"/>
            <path d="M62,214 C54,224 50,234 52,244" stroke={C.skinLight} strokeWidth="10" strokeLinecap="round" fill="none" opacity=".4"/>
            {/* Palm */}
            <ellipse cx="54" cy="250" rx="15" ry="12" fill="url(#ga2-skin2)" transform="rotate(-22,54,250)"/>
            {/* Fingers */}
            <path d="M43,244 C39,234 38,224 41,220" stroke={C.skin} strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M52,241 C49,231 50,221 53,217" stroke={C.skin} strokeWidth="7.5" strokeLinecap="round" fill="none"/>
            <path d="M61,244 C60,234 61,224 64,220" stroke={C.skin} strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M69,248 C69,239 70,231 72,227" stroke={C.skin} strokeWidth="6.5" strokeLinecap="round" fill="none"/>
            {/* Thumb */}
            <path d="M42,248 C36,242 36,235 39,232 C42,229 47,232 47,237" stroke={C.skin} strokeWidth="8" strokeLinecap="round" fill="none"/>
            {/* Knuckle shading */}
            <path d="M41,220 Q53,215 64,220" fill="none" stroke={C.skinShadow} strokeWidth="1.2" opacity=".4"/>
            {/* Highlight on back of hand */}
            <ellipse cx="52" cy="242" rx="6" ry="4" fill={C.skinLight} opacity=".3" transform="rotate(-15,52,242)"/>
          </g>

          {/* ── RIGHT ARM — holding chalice ── */}
          <g style={{transformOrigin:'164px 174px',
            animation:`ga2-arm-idle ${state==='speaking'?'.50s':'3.8s'} ease-in-out infinite`,animationDelay:'.5s'}}>
            {/* Upper arm */}
            <path d="M164,174 C172,178 184,194 198,212" stroke={C.skin} strokeWidth="20" strokeLinecap="round" fill="none"/>
            <path d="M164,174 C172,178 184,194 198,212" stroke={C.skinShadow} strokeWidth="20" strokeLinecap="round" fill="none" opacity=".25"/>
            <path d="M164,174 C172,178 184,194 198,212" stroke={C.skinLight} strokeWidth="11" strokeLinecap="round" fill="none" opacity=".45"/>
            {/* Forearm — raised up toward chalice */}
            <path d="M198,212 C204,200 206,188 202,180" stroke={C.skin} strokeWidth="18" strokeLinecap="round" fill="none"/>
            <path d="M198,212 C204,200 206,188 202,180" stroke={C.skinLight} strokeWidth="10" strokeLinecap="round" fill="none" opacity=".4"/>
            {/* Hand holding chalice */}
            <ellipse cx="204" cy="176" rx="13" ry="10" fill="url(#ga2-skin2)" transform="rotate(18,204,176)"/>
            <path d="M195,170 C192,162 193,155 196,152" stroke={C.skin} strokeWidth="7" strokeLinecap="round" fill="none"/>
            <path d="M202,168 C199,160 200,153 204,150" stroke={C.skin} strokeWidth="7.5" strokeLinecap="round" fill="none"/>
            <path d="M209,170 C207,162 208,155 211,152" stroke={C.skin} strokeWidth="6.5" strokeLinecap="round" fill="none"/>
            <path d="M215,174 C214,167 215,161 217,158" stroke={C.skin} strokeWidth="6" strokeLinecap="round" fill="none"/>

            {/* ── CHALICE ── */}
            {/* Shadow */}
            <ellipse cx="205" cy="178" rx="12" ry="4" fill="rgba(0,0,0,0.2)" filter="url(#ga2-soft)"/>
            {/* Stem */}
            <rect x="199" y="155" width="6" height="10" rx="2" fill={C.chaliceBody}/>
            <rect x="199" y="155" width="6" height="10" rx="2" fill="none" stroke={C.chaliceGold} strokeWidth="1"/>
            {/* Stem node */}
            <ellipse cx="202" cy="155" rx="5.5" ry="3" fill={C.chaliceBody}/>
            <ellipse cx="202" cy="155" rx="5.5" ry="3" fill="none" stroke={C.chaliceGold} strokeWidth=".9"/>
            {/* Cup bowl */}
            <path d="M190,152 L193,136 L211,136 L214,152Z" fill={C.chaliceBody}/>
            <path d="M190,152 L193,136 L211,136 L214,152Z" fill="none" stroke={C.chaliceGold} strokeWidth="1.4"/>
            {/* Gold decorative lines */}
            <path d="M191,145 L213,145" stroke={C.chaliceGold} strokeWidth="1" opacity=".8"/>
            <path d="M191,149 L213,149" stroke={C.chaliceGold} strokeWidth="1" opacity=".8"/>
            {/* Cup rim */}
            <ellipse cx="202" cy="136" rx="9.5" ry="3.5" fill={C.chaliceBody}/>
            <ellipse cx="202" cy="136" rx="9.5" ry="3.5" fill="none" stroke={C.chaliceGold} strokeWidth="1.2"/>
            {/* Base */}
            <ellipse cx="202" cy="166" rx="10" ry="3.8" fill={C.chaliceBody}/>
            <ellipse cx="202" cy="166" rx="10" ry="3.8" fill="none" stroke={C.chaliceGold} strokeWidth="1.2"/>
            {/* Cup highlight */}
            <path d="M194,138 C194,136 197,135 200,136" fill="none" stroke={C.chaliceLight} strokeWidth="1.8" strokeLinecap="round" opacity=".7"/>
            {/* Interior liquid hint */}
            <ellipse cx="202" cy="139" rx="7" ry="2" fill={C.gold} opacity=".35"/>
          </g>

          {/* ── Neck ── */}
          <path d="M114,154 L114,168 Q130,174 146,168 L146,154 Z" fill="url(#ga2-skin)"/>
          <path d="M114,154 L114,168 Q130,174 146,168 L146,154 Z" fill={C.skinShadow} opacity=".18"/>

          {/* ── HEAD ── */}
          {/* Head shape */}
          <ellipse cx="130" cy="122" rx="50" ry="52" fill="url(#ga2-skin)"/>
          {/* Jaw widening */}
          <path d="M82,132 Q78,152 85,164 Q100,178 130,180 Q160,178 175,164 Q182,152 178,132Z" fill="url(#ga2-skin)"/>
          {/* Cheek blush */}
          <ellipse cx="96" cy="142" rx="14" ry="10" fill={C.skinLight} opacity=".22" transform="rotate(-12,96,142)"/>
          <ellipse cx="164" cy="142" rx="14" ry="10" fill={C.skinLight} opacity=".22" transform="rotate(12,164,142)"/>
          {/* Forehead shadow */}
          <path d="M86,108 Q130,100 174,108 Q168,86 130,80 Q92,86 86,108Z" fill={C.skinShadow} opacity=".12"/>
          {/* Ears */}
          <ellipse cx="81" cy="126" rx="8.5" ry="11" fill={C.skin}/>
          <ellipse cx="81" cy="126" rx="5.5" ry="7.5" fill={C.skinShadow} opacity=".32"/>
          <path d="M79,120 Q76,126 79,132" fill="none" stroke={C.skinShadow} strokeWidth="1.5" opacity=".5"/>
          <ellipse cx="179" cy="126" rx="8.5" ry="11" fill={C.skin}/>
          <ellipse cx="179" cy="126" rx="5.5" ry="7.5" fill={C.skinShadow} opacity=".32"/>
          <path d="M181,120 Q184,126 181,132" fill="none" stroke={C.skinShadow} strokeWidth="1.5" opacity=".5"/>

          {/* ── HAIR ── */}
          {/* Back shadow layer */}
          <path d="M84,114 Q78,90 86,70 Q98,48 130,45 Q162,48 174,70 Q182,90 176,114" fill={C.hair} opacity=".6"/>
          {/* Main hair mass */}
          <path d="M85,118 Q80,96 86,74 Q98,50 130,46 Q162,50 174,74 Q180,96 175,118 Q168,108 162,102 Q150,94 130,92 Q110,94 98,102 Q92,108 85,118Z" fill="url(#ga2-hair)"/>
          {/* Hair curls — left */}
          <path d="M86,108 Q90,94 98,86 Q104,80 108,83 Q104,90 100,98" fill={C.hair} opacity=".75"/>
          <path d="M84,116 Q86,104 92,96 Q96,91 100,93 Q97,100 95,107" fill={C.hairMid} opacity=".6"/>
          {/* Hair curls — right */}
          <path d="M174,108 Q170,94 162,86 Q156,80 152,83 Q156,90 160,98" fill={C.hair} opacity=".75"/>
          <path d="M176,116 Q174,104 168,96 Q164,91 160,93 Q163,100 165,107" fill={C.hairMid} opacity=".6"/>
          {/* Front wisps */}
          <path d="M104,92 Q106,78 112,70 Q117,64 120,67 Q116,75 114,84" fill={C.hairLight} opacity=".82"/>
          <path d="M156,92 Q154,78 148,70 Q143,64 140,67 Q144,75 146,84" fill={C.hairLight} opacity=".82"/>
          <path d="M124,88 Q126,74 128,66 Q130,62 132,66 Q134,74 136,88" fill={C.hairMid} opacity=".6"/>
          {/* Hair sheen highlight */}
          <path d="M108,68 Q120,60 130,58 Q140,60 152,68" fill="none" stroke={C.hairLight} strokeWidth="3" strokeLinecap="round" opacity=".42"/>
          <path d="M118,64 Q130,58 142,64" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity=".18"/>

          {/* ── EYEBROWS — thick, expressive ── */}
          <path d="M94,106 Q104,100 116,103" stroke={C.brow} strokeWidth="5.5" strokeLinecap="round" fill="none"/>
          <path d="M94,106 Q104,100 116,103" stroke={C.lash} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".75"/>
          <path d="M144,103 Q156,100 166,106" stroke={C.brow} strokeWidth="5.5" strokeLinecap="round" fill="none"/>
          <path d="M144,103 Q156,100 166,106" stroke={C.lash} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".75"/>

          {/* ── EYES ── */}
          {/* Left eye */}
          <g style={{transformOrigin:'106px 124px',transform:`scaleY(${eyeSY})`,transition:'transform .07s'}}>
            <ellipse cx="106" cy="124" rx="13.5" ry="11" fill={C.eyeWhite}/>
            <ellipse cx="106" cy="124" rx="13.5" ry="11" fill="none" stroke={C.lash} strokeWidth="1.5"/>
            <ellipse cx="106" cy="124" rx="9" ry="9" fill="url(#ga2-iris)" clipPath="url(#ga2-ecL)"/>
            <circle cx="106" cy="124" r="4.5" fill={C.pupil}/>
            {/* Double catchlight */}
            <circle cx="103" cy="121" r="2" fill="white" opacity=".95"/>
            <circle cx="109" cy="127" r="1" fill="white" opacity=".5"/>
            {/* Top lash */}
            <path d="M92.5,116 Q106,111 119.5,116" fill={C.lash} opacity=".92"/>
            {/* Bottom lash */}
            <path d="M92.5,132 Q106,136 119.5,132" fill="none" stroke={C.lash} strokeWidth="1.1" opacity=".38"/>
            {/* Lid crease */}
            <path d="M94,119 Q106,115 118,119" fill="none" stroke={C.skinShadow} strokeWidth=".8" opacity=".3"/>
          </g>
          {/* Right eye */}
          <g style={{transformOrigin:'154px 124px',transform:`scaleY(${eyeSY})`,transition:'transform .07s'}}>
            <ellipse cx="154" cy="124" rx="13.5" ry="11" fill={C.eyeWhite}/>
            <ellipse cx="154" cy="124" rx="13.5" ry="11" fill="none" stroke={C.lash} strokeWidth="1.5"/>
            <ellipse cx="154" cy="124" rx="9" ry="9" fill="url(#ga2-iris)" clipPath="url(#ga2-ecR)"/>
            <circle cx="154" cy="124" r="4.5" fill={C.pupil}/>
            <circle cx="151" cy="121" r="2" fill="white" opacity=".95"/>
            <circle cx="157" cy="127" r="1" fill="white" opacity=".5"/>
            <path d="M140.5,116 Q154,111 167.5,116" fill={C.lash} opacity=".92"/>
            <path d="M140.5,132 Q154,136 167.5,132" fill="none" stroke={C.lash} strokeWidth="1.1" opacity=".38"/>
            <path d="M142,119 Q154,115 166,119" fill="none" stroke={C.skinShadow} strokeWidth=".8" opacity=".3"/>
          </g>

          {/* ── NOSE ── */}
          {/* Bridge */}
          <path d="M130,112 Q130,122 127,130" fill="none" stroke={C.skinShadow} strokeWidth="2.2" strokeLinecap="round" opacity=".35"/>
          {/* Tip */}
          <ellipse cx="130" cy="136" rx="8.5" ry="6.5" fill={C.skin}/>
          <ellipse cx="130" cy="136" rx="8.5" ry="6.5" fill={C.skinShadow} opacity=".22"/>
          {/* Nostrils */}
          <ellipse cx="123" cy="138.5" rx="3.8" ry="2.8" fill={C.skinShadow} opacity=".55" transform="rotate(-12,123,138.5)"/>
          <ellipse cx="137" cy="138.5" rx="3.8" ry="2.8" fill={C.skinShadow} opacity=".55" transform="rotate(12,137,138.5)"/>
          {/* Nose tip highlight */}
          <ellipse cx="130" cy="133" rx="2.8" ry="2" fill={C.skinHighlight} opacity=".52"/>

          {/* ── MOUTH ── */}
          {mouthOpen<0.05?(
            <g>
              <path d="M116,150 Q130,156 144,150" fill="none" stroke={C.mouthDark} strokeWidth="2.5" strokeLinecap="round"/>
              {/* Upper lip bow */}
              <path d="M116,150 Q122,147 130,149 Q138,147 144,150" fill={C.mouthPink} opacity=".4"/>
            </g>
          ):(
            <g>
              {/* Mouth opening */}
              <path d={`M116,149 Q130,${148+mouthOpen*9} 144,149 Q143,${150+mouthOpen*16} 130,${151+mouthOpen*16} Q117,${150+mouthOpen*16} 116,149Z`}
                fill={C.mouthDark}/>
              {/* Teeth */}
              <path d={`M118,150 Q130,${149+mouthOpen*6} 142,150 Q142,${152+mouthOpen*8} 130,${153+mouthOpen*9} Q118,${152+mouthOpen*8} 118,150Z`}
                fill={C.teeth}/>
              {/* Teeth center line */}
              <path d={`M124,${151+mouthOpen*3} L130,${151+mouthOpen*3} L136,${151+mouthOpen*3}`}
                stroke={C.robeShadow} strokeWidth=".8" opacity=".35"/>
              {/* Upper lip */}
              <path d={`M116,149 Q122,146 130,148 Q138,146 144,149`} fill={C.mouthPink} opacity=".5"/>
            </g>
          )}
          {/* Dimples */}
          <path d="M114,149 Q111,153 112,157" fill="none" stroke={C.skinShadow} strokeWidth="1.2" strokeLinecap="round" opacity=".32"/>
          <path d="M146,149 Q149,153 148,157" fill="none" stroke={C.skinShadow} strokeWidth="1.2" strokeLinecap="round" opacity=".32"/>

          {/* ── BEARD ── */}
          {/* Main beard shape */}
          <path d="M90,140 Q86,152 86,164 Q88,176 96,182 Q108,190 130,192 Q152,190 164,182 Q172,176 174,164 Q174,152 170,140 Q162,156 156,162 Q146,172 130,174 Q114,172 104,162 Q98,156 90,140Z" fill="url(#ga2-beard)"/>
          {/* Beard lighter overlay */}
          <path d="M92,142 Q89,154 89,164 Q91,173 98,178 Q110,188 130,190 Q150,188 162,178 Q169,173 171,164 Q171,154 168,142 Q160,158 154,164 Q144,174 130,176 Q116,174 106,164 Q100,158 92,142Z" fill={C.beardLight} opacity=".38"/>
          {/* Chin tuft */}
          <ellipse cx="130" cy="188" rx="11" ry="7" fill="url(#ga2-beard)"/>
          {/* Mustache */}
          <path d="M112,143 Q120,138 130,142 Q140,138 148,143 Q146,149 130,150 Q114,149 112,143Z" fill={C.beard}/>
          <path d="M112,143 Q121,140 130,142 Q139,140 148,143" fill="none" stroke={C.beardLight} strokeWidth="1.2" opacity=".45"/>
          {/* Beard texture strands */}
          {[
            {x1:98,y1:152,x2:95,y2:170},{x1:106,y1:158,x2:103,y2:176},
            {x1:116,y1:164,x2:114,y2:180},{x1:130,y1:168,x2:130,y2:186},
            {x1:144,y1:164,x2:146,y2:180},{x1:154,y1:158,x2:157,y2:176},
            {x1:162,y1:152,x2:165,y2:170}
          ].map((s,i)=>(
            <path key={i} d={`M${s.x1},${s.y1} Q${(s.x1+s.x2)/2},${(s.y1+s.y2)/2} ${s.x2},${s.y2}`}
              fill="none" stroke={C.beardLight} strokeWidth="1" opacity=".38"/>
          ))}
          {/* Beard sheen highlight */}
          <path d="M118,154 Q130,150 142,154" fill="none" stroke="white" strokeWidth="1" opacity=".14"/>

        </g>{/* end body group */}

        {/* ── Thinking dots ── */}
        {state==='thinking'&&[0,1,2].map(i=>(
          <circle key={i} cx={114+i*14} cy={368} r={4}
            fill={C.gold}
            style={{animation:'ga2-dot 1.1s ease-in-out infinite',animationDelay:`${i*.24}s`}}/>
        ))}

      </svg>
    </div>
  );
}
