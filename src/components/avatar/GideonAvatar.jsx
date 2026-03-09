/**
 * GideonAvatar — fully illustrated SVG character built in code.
 * Inspired by: white gold-trimmed biblical robes, warm brown skin,
 * curly hair, full beard, floating orbs, chalice in right hand.
 *
 * States: idle | speaking | listening | thinking
 * Features: blinking eyes, speaking mouth (opens/closes), body float/bounce,
 *           orbiting golden spheres, sparkle stars, warm glow halo
 */
import React, { useEffect, useRef, useState } from 'react';

const C = {
  skin:'#C8845A', skinShadow:'#A0622E', skinLight:'#DFA070',
  hair:'#4A2E14', hairLight:'#6B4422',
  beard:'#3D2410', beardLight:'#5C3A1E',
  robeMain:'#F2EDE0', robeShadow:'#D8D2C0',
  gold:'#C9A227', goldBright:'#F0D060', goldPale:'#F5E49A',
  eyeWhite:'#FEFCF8', iris:'#5C3A1E', pupil:'#1A0A00', lash:'#2A1608',
  mouthDark:'#7A3820', teeth:'#FEFEFE',
  slipper:'#EDE8DC',
  chalice:'#E0D0A0', chaliceGold:'#C9A227',
  orbGold:'#C9A227', orbTan:'#C4A882',
};

const ORBS = [
  {id:0,cx:82, cy:28, r:9,  col:'gold', dl:0.0, dur:3.2},
  {id:1,cx:118,cy:18, r:11, col:'gold', dl:0.4, dur:2.8},
  {id:2,cx:60, cy:38, r:6,  col:'tan',  dl:0.8, dur:3.6},
  {id:3,cx:140,cy:32, r:8,  col:'gold', dl:0.2, dur:2.6},
  {id:4,cx:98, cy:14, r:7,  col:'tan',  dl:1.1, dur:3.0},
  {id:5,cx:152,cy:52, r:5,  col:'gold', dl:0.6, dur:4.0},
  {id:6,cx:54, cy:58, r:7,  col:'tan',  dl:1.4, dur:3.4},
  {id:7,cx:130,cy:56, r:6,  col:'gold', dl:0.9, dur:2.9},
  {id:8,cx:73, cy:16, r:5,  col:'tan',  dl:1.7, dur:3.8},
];

const STARS=[{cx:106,cy:34,sz:4,dl:0.3},{cx:68,cy:24,sz:3,dl:1.0},{cx:145,cy:44,sz:3.5,dl:0.7},{cx:90,cy:46,sz:2.5,dl:1.5}];

export default function GideonAvatar({isSpeaking=false,isListening=false,isThinking=false,width=260,height=260,className=''}) {
  const state = isSpeaking?'speaking':isListening?'listening':isThinking?'thinking':'idle';

  const [blink,setBlink]=useState(false);
  const blinkTimer=useRef(null);
  useEffect(()=>{
    const go=()=>{
      blinkTimer.current=setTimeout(()=>{
        setBlink(true);
        setTimeout(()=>{setBlink(false);go();},160);
      },2500+Math.random()*3500);
    };
    go();
    return()=>clearTimeout(blinkTimer.current);
  },[]);

  const [mouthOpen,setMouthOpen]=useState(0);
  const mouthTimer=useRef(null);
  useEffect(()=>{
    if(!isSpeaking){setMouthOpen(0);return;}
    let ph=0;
    mouthTimer.current=setInterval(()=>{ph+=0.38;setMouthOpen(Math.max(0,Math.sin(ph)*0.9));},75);
    return()=>clearInterval(mouthTimer.current);
  },[isSpeaking]);

  const bodyAnim=state==='speaking'?'gb-bounce':state==='listening'?'gb-lean':state==='thinking'?'gb-sway':'gb-float';
  const bodyDur=state==='speaking'?'0.52s':state==='listening'?'1.4s':state==='thinking'?'2.8s':'3.6s';
  const orbAnim=state==='speaking'?'gb-orb-fast':'gb-orb';
  const orbMul=state==='speaking'?0.36:1;
  const glowOp=state==='speaking'?0.75:state==='listening'?0.50:state==='thinking'?0.38:0.22;
  const eyeSY=blink?0.08:1;

  return (
    <div className={className} style={{width,height,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <style>{`
        @keyframes gb-float{0%,100%{transform:translateY(0px) rotate(0deg)}40%{transform:translateY(-7px) rotate(.5deg)}70%{transform:translateY(-5px) rotate(-.4deg)}}
        @keyframes gb-bounce{0%,100%{transform:translateY(-2px) scale(1)}20%{transform:translateY(-9px) scale(1.04)}45%{transform:translateY(-3px) scale(1.01)}65%{transform:translateY(-10px) scale(1.05)}85%{transform:translateY(-4px) scale(1.02)}}
        @keyframes gb-lean{0%,100%{transform:translateY(-4px) rotate(0deg)}30%{transform:translateY(-9px) rotate(1.5deg)}70%{transform:translateY(-8px) rotate(-1.5deg)}}
        @keyframes gb-sway{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-3px) rotate(2deg)}75%{transform:translateY(-3px) rotate(-2deg)}}
        @keyframes gb-orb{0%,100%{transform:translateY(0) scale(1);opacity:.88}50%{transform:translateY(-6px) scale(1.08);opacity:1}}
        @keyframes gb-orb-fast{0%,100%{transform:translateY(0) scale(.95);opacity:.8}50%{transform:translateY(-9px) scale(1.14);opacity:1}}
        @keyframes gb-star{0%,100%{opacity:.1;transform:scale(.6) rotate(0deg)}50%{opacity:.9;transform:scale(1.4) rotate(45deg)}}
        @keyframes gb-ripple{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.7);opacity:0}}
        @keyframes gb-dot{0%,80%,100%{opacity:.15;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}
        @keyframes gb-ring-cw{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes gb-ring-ccw{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes gb-shimmer{0%,100%{filter:brightness(1)}50%{filter:brightness(1.14)}}
        @keyframes gb-shimmer-spk{0%,100%{filter:brightness(1.05) drop-shadow(0 0 8px rgba(201,162,39,.45))}30%{filter:brightness(1.32) drop-shadow(0 0 22px rgba(201,162,39,.95))}60%{filter:brightness(1.1) drop-shadow(0 0 10px rgba(201,162,39,.55))}}
        @keyframes gb-arm-idle{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-6deg)}}
        @keyframes gb-arm-spk{0%,100%{transform:rotate(-4deg)}25%{transform:rotate(-12deg)}75%{transform:rotate(2deg)}}
        @keyframes gb-halo{0%,100%{opacity:var(--gho,.22)}50%{opacity:calc(var(--gho,.22) + .14)}}
      `}</style>

      <svg viewBox="0 0 200 290" width={width} height={height} style={{overflow:'visible'}}>
        <defs>
          <radialGradient id="ghalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.goldPale} stopOpacity=".85"/>
            <stop offset="50%" stopColor={C.gold} stopOpacity=".35"/>
            <stop offset="100%" stopColor={C.gold} stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="gskin" cx="42%" cy="36%" r="60%">
            <stop offset="0%" stopColor={C.skinLight}/>
            <stop offset="70%" stopColor={C.skin}/>
            <stop offset="100%" stopColor={C.skinShadow}/>
          </radialGradient>
          <linearGradient id="grobe" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.robeShadow}/>
            <stop offset="35%" stopColor={C.robeMain}/>
            <stop offset="65%" stopColor={C.robeMain}/>
            <stop offset="100%" stopColor={C.robeShadow}/>
          </linearGradient>
          <radialGradient id="gorb-gold" cx="38%" cy="32%" r="60%">
            <stop offset="0%" stopColor={C.goldBright}/>
            <stop offset="55%" stopColor={C.gold}/>
            <stop offset="100%" stopColor="#7A5A00"/>
          </radialGradient>
          <radialGradient id="gorb-tan" cx="38%" cy="32%" r="60%">
            <stop offset="0%" stopColor="#E8D4B0"/>
            <stop offset="55%" stopColor={C.orbTan}/>
            <stop offset="100%" stopColor="#6A5030"/>
          </radialGradient>
          <radialGradient id="giris" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#8C5830"/>
            <stop offset="60%" stopColor={C.iris}/>
            <stop offset="100%" stopColor="#1A0800"/>
          </radialGradient>
          <radialGradient id="ghair" cx="45%" cy="30%" r="65%">
            <stop offset="0%" stopColor={C.hairLight}/>
            <stop offset="100%" stopColor={C.hair}/>
          </radialGradient>
          <clipPath id="ecL"><ellipse cx="83" cy="95" rx="10" ry="8"/></clipPath>
          <clipPath id="ecR"><ellipse cx="117" cy="95" rx="10" ry="8"/></clipPath>
        </defs>

        {/* Halo */}
        <ellipse cx="100" cy="150" rx="62" ry="78" fill="url(#ghalo)"
          style={{'--gho':glowOp,transformOrigin:'100px 150px',animation:'gb-halo 3s ease-in-out infinite'}}/>

        {/* Listening ripples */}
        {state==='listening'&&[0,1].map(i=>(
          <ellipse key={i} cx="100" cy="150" rx="65" ry="80" fill="none" stroke={C.goldPale} strokeWidth="1.2"
            style={{transformOrigin:'100px 150px',animation:'gb-ripple 1.8s ease-out infinite',animationDelay:`${i*.75}s`}}/>
        ))}

        {/* Deco rings */}
        <circle cx="100" cy="85" r="60" fill="none" stroke={C.goldPale} strokeWidth=".4" strokeDasharray="8 10"
          opacity={state==='speaking'?.38:.12}
          style={{transformOrigin:'100px 85px',animation:`gb-ring-cw ${state==='speaking'?'3s':'11s'} linear infinite`}}/>
        <circle cx="100" cy="85" r="52" fill="none" stroke={C.gold} strokeWidth=".35" strokeDasharray="4 14"
          opacity={state==='idle'?.08:.16}
          style={{transformOrigin:'100px 85px',animation:`gb-ring-ccw ${state==='speaking'?'4.5s':'15s'} linear infinite`}}/>

        {/* Orbs */}
        {ORBS.map(o=>(
          <g key={o.id} style={{transformOrigin:`${o.cx}px ${o.cy}px`,
            animation:`${orbAnim} ${(o.dur*orbMul).toFixed(1)}s ease-in-out infinite`,animationDelay:`${o.dl}s`}}>
            <ellipse cx={o.cx+1.5} cy={o.cy+1.5} rx={o.r} ry={o.r*.92} fill={o.col==='gold'?'#806010':'#806840'} opacity=".4"/>
            <circle cx={o.cx} cy={o.cy} r={o.r} fill={o.col==='gold'?'url(#gorb-gold)':'url(#gorb-tan)'}/>
            <ellipse cx={o.cx-o.r*.28} cy={o.cy-o.r*.3} rx={o.r*.32} ry={o.r*.22} fill="white" opacity=".5"
              transform={`rotate(-25,${o.cx-o.r*.28},${o.cy-o.r*.3})`}/>
          </g>
        ))}

        {/* Sparkle stars */}
        {STARS.map(s=>(
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{transformOrigin:'0 0',animation:`gb-star ${state==='speaking'?'0.9s':'2.4s'} ease-in-out infinite`,animationDelay:`${s.dl}s`}}>
            {[0,45,90,135].map(a=>(
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz} stroke={C.goldBright} strokeWidth=".9"
                strokeLinecap="round" transform={`rotate(${a})`}/>
            ))}
          </g>
        ))}

        {/* ── BODY GROUP (float/bounce/sway/lean) ── */}
        <g style={{transformOrigin:'100px 275px',
          animation:`${bodyAnim} ${bodyDur} ease-in-out infinite, ${state==='speaking'?'gb-shimmer-spk .52s ease-in-out infinite':'gb-shimmer 3.8s ease-in-out infinite'}`}}>

          {/* Slippers */}
          <ellipse cx="82" cy="272" rx="18" ry="8" fill={C.slipper}/>
          <path d="M65,270 Q82,264 99,270 Q82,278 65,270Z" fill="white" opacity=".55"/>
          <ellipse cx="118" cy="272" rx="18" ry="8" fill={C.slipper}/>
          <path d="M101,270 Q118,264 135,270 Q118,278 101,270Z" fill="white" opacity=".55"/>

          {/* Robe main */}
          <path d="M72,128 C62,132 54,145 50,160 L46,265 L154,265 L150,160 C146,145 138,132 128,128 Z" fill="url(#grobe)"/>
          {/* Robe sides fold shadow */}
          <path d="M50,165 C48,185 47,215 47,255 L54,265 L50,160Z" fill={C.robeShadow} opacity=".4"/>
          <path d="M150,165 C152,185 153,215 153,255 L146,265 L150,160Z" fill={C.robeShadow} opacity=".4"/>

          {/* Gold collar trim */}
          <path d="M78,128 Q100,122 122,128" fill="none" stroke={C.gold} strokeWidth="4" strokeLinecap="round"/>
          <path d="M78,128 Q100,122 122,128" fill="none" stroke={C.goldBright} strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>

          {/* Left sleeve */}
          <path d="M72,128 C68,132 60,142 56,150 L48,190 C52,192 56,192 59,190 L66,156 C69,147 72,137 74,131Z"
            fill={C.robeShadow} opacity=".55"/>
          <path d="M63,149 L50,190" stroke={C.gold} strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M63,149 L50,190" stroke={C.goldBright} strokeWidth="1.2" strokeLinecap="round" opacity=".6"/>

          {/* Right sleeve */}
          <path d="M128,128 C132,132 140,142 144,150 L152,188 C148,190 144,190 141,188 L135,155 C131,146 128,136 126,131Z"
            fill={C.robeShadow} opacity=".55"/>
          <path d="M137,149 L150,187" stroke={C.gold} strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M137,149 L150,187" stroke={C.goldBright} strokeWidth="1.2" strokeLinecap="round" opacity=".6"/>

          {/* Sash/belt center panel with gold stripes */}
          <rect x="88" y="148" width="24" height="115" rx="2" fill={C.robeMain} opacity=".9"/>
          {[156,167,178,189].map(y=>(
            <rect key={y} x="88" y={y} width="24" height="2.5" rx="1.2" fill={C.gold} opacity=".7"/>
          ))}
          {/* Belt knot */}
          <ellipse cx="100" cy="150" rx="10" ry="6" fill={C.gold}/>
          <ellipse cx="100" cy="150" rx="10" ry="6" fill="none" stroke={C.goldBright} strokeWidth=".8" opacity=".5"/>
          <ellipse cx="99" cy="149" rx="3.5" ry="2.5" fill={C.goldBright} opacity=".45"/>

          {/* LEFT ARM — gesturing open palm */}
          <g style={{transformOrigin:'76px 135px',
            animation:`${state==='speaking'?'gb-arm-spk .52s':'gb-arm-idle 3.6s'} ease-in-out infinite`}}>
            <path d="M76,135 C70,138 60,150 50,167" stroke={C.skin} strokeWidth="15" strokeLinecap="round" fill="none"/>
            <path d="M76,135 C70,138 60,150 50,167" stroke={C.skinShadow} strokeWidth="15" strokeLinecap="round" fill="none" opacity=".22"/>
            <path d="M76,135 C70,138 60,150 50,167" stroke={C.skinLight} strokeWidth="8" strokeLinecap="round" fill="none" opacity=".42"/>
            {/* forearm */}
            <path d="M50,167 C44,174 42,180 43,186" stroke={C.skin} strokeWidth="13" strokeLinecap="round" fill="none"/>
            <path d="M50,167 C44,174 42,180 43,186" stroke={C.skinLight} strokeWidth="7" strokeLinecap="round" fill="none" opacity=".38"/>
            {/* palm */}
            <ellipse cx="46" cy="190" rx="11" ry="8.5" fill="url(#gskin)" transform="rotate(-18,46,190)"/>
            {/* fingers */}
            <path d="M39,185 C36,177 36,169 38,166" stroke={C.skin} strokeWidth="4.5" strokeLinecap="round" fill="none"/>
            <path d="M45,183 C43,175 44,167 46,164" stroke={C.skin} strokeWidth="5" strokeLinecap="round" fill="none"/>
            <path d="M51,185 C51,177 52,169 54,166" stroke={C.skin} strokeWidth="4.5" strokeLinecap="round" fill="none"/>
            <path d="M56,188 C57,181 58,175 59,172" stroke={C.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
            {/* thumb */}
            <path d="M37,188 C33,184 33,179 35,177 C38,175 41,178 41,182" stroke={C.skin} strokeWidth="5.5" strokeLinecap="round" fill="none"/>
            {/* knuckle line */}
            <path d="M38,166 Q46,163 54,166" fill="none" stroke={C.skinLight} strokeWidth="1" opacity=".5"/>
          </g>

          {/* RIGHT ARM — holding chalice */}
          <g style={{transformOrigin:'124px 135px',
            animation:`gb-arm-idle ${state==='speaking'?'.52s':'3.6s'} ease-in-out infinite`,animationDelay:'.4s'}}>
            <path d="M124,135 C130,138 140,150 148,163" stroke={C.skin} strokeWidth="15" strokeLinecap="round" fill="none"/>
            <path d="M124,135 C130,138 140,150 148,163" stroke={C.skinShadow} strokeWidth="15" strokeLinecap="round" fill="none" opacity=".22"/>
            <path d="M124,135 C130,138 140,150 148,163" stroke={C.skinLight} strokeWidth="8" strokeLinecap="round" fill="none" opacity=".42"/>
            {/* forearm raised */}
            <path d="M148,163 C153,156 154,148 152,141" stroke={C.skin} strokeWidth="13" strokeLinecap="round" fill="none"/>
            <path d="M148,163 C153,156 154,148 152,141" stroke={C.skinLight} strokeWidth="7" strokeLinecap="round" fill="none" opacity=".38"/>
            {/* hand */}
            <ellipse cx="153" cy="138" rx="9.5" ry="7.5" fill="url(#gskin)" transform="rotate(14,153,138)"/>
            <path d="M146,134 C143,128 144,123 147,122" stroke={C.skin} strokeWidth="4.5" strokeLinecap="round" fill="none"/>
            <path d="M151,133 C149,127 150,122 153,121" stroke={C.skin} strokeWidth="4.5" strokeLinecap="round" fill="none"/>
            <path d="M156,135 C155,129 156,124 158,123" stroke={C.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M160,138 C160,132 161,128 162,126" stroke={C.skin} strokeWidth="4" strokeLinecap="round" fill="none"/>
            {/* CHALICE */}
            <path d="M143,122 L145,110 L161,110 L163,122Z" fill={C.chalice}/>
            <path d="M143,122 L145,110 L161,110 L163,122Z" fill="none" stroke={C.chaliceGold} strokeWidth="1.2"/>
            <ellipse cx="153" cy="110" rx="8" ry="3" fill={C.chalice}/>
            <ellipse cx="153" cy="110" rx="8" ry="3" fill="none" stroke={C.chaliceGold} strokeWidth="1"/>
            <path d="M143,117 L163,117" stroke={C.chaliceGold} strokeWidth=".8" opacity=".7"/>
            <path d="M143,120 L163,120" stroke={C.chaliceGold} strokeWidth=".8" opacity=".7"/>
            <rect x="151" y="122" width="4" height="6" rx="1" fill={C.chalice}/>
            <rect x="151" y="122" width="4" height="6" fill="none" stroke={C.chaliceGold} strokeWidth=".8"/>
            <ellipse cx="153" cy="128" rx="7.5" ry="2.8" fill={C.chalice}/>
            <ellipse cx="153" cy="128" rx="7.5" ry="2.8" fill="none" stroke={C.chaliceGold} strokeWidth="1"/>
            <path d="M147,112 C147,111 149,110 152,111" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity=".55"/>
          </g>

          {/* Neck */}
          <rect x="91" y="120" width="18" height="14" rx="4" fill="url(#gskin)"/>

          {/* HEAD */}
          <ellipse cx="100" cy="96" rx="38" ry="40" fill="url(#gskin)"/>
          <path d="M64,106 Q62,120 68,128 Q80,140 100,142 Q120,140 132,128 Q138,120 136,106Z" fill="url(#gskin)"/>
          {/* cheek blush */}
          <ellipse cx="76" cy="109" rx="10" ry="7" fill={C.skinLight} opacity=".2" transform="rotate(-10,76,109)"/>
          <ellipse cx="124" cy="109" rx="10" ry="7" fill={C.skinLight} opacity=".2" transform="rotate(10,124,109)"/>
          {/* ears */}
          <ellipse cx="63" cy="98" rx="6.5" ry="8.5" fill={C.skin}/>
          <ellipse cx="63" cy="98" rx="4" ry="5.5" fill={C.skinShadow} opacity=".3"/>
          <ellipse cx="137" cy="98" rx="6.5" ry="8.5" fill={C.skin}/>
          <ellipse cx="137" cy="98" rx="4" ry="5.5" fill={C.skinShadow} opacity=".3"/>

          {/* HAIR */}
          {/* back layer */}
          <path d="M65,86 Q60,68 67,54 Q76,40 100,38 Q124,40 133,54 Q140,68 135,86" fill={C.hair} opacity=".55"/>
          {/* main mass */}
          <path d="M66,90 Q62,72 68,57 Q77,43 100,40 Q123,43 132,57 Q138,72 134,90 Q128,82 124,77 Q116,70 100,69 Q84,70 76,77 Q72,82 66,90Z" fill="url(#ghair)"/>
          {/* curls left */}
          <path d="M68,80 Q70,70 76,65 Q81,62 84,64 Q80,69 78,75" fill={C.hair} opacity=".75"/>
          {/* curls right */}
          <path d="M132,80 Q130,70 124,65 Q119,62 116,64 Q120,69 122,75" fill={C.hair} opacity=".75"/>
          {/* front wisps */}
          <path d="M82,69 Q84,60 89,56 Q93,52 96,54 Q92,59 90,65" fill={C.hairLight} opacity=".8"/>
          <path d="M118,69 Q116,60 111,56 Q107,52 104,54 Q108,59 110,65" fill={C.hairLight} opacity=".8"/>
          {/* hair highlight */}
          <path d="M86,54 Q93,48 100,46 Q107,48 114,54" fill="none" stroke={C.hairLight} strokeWidth="2.5" strokeLinecap="round" opacity=".38"/>

          {/* EYEBROWS */}
          <path d="M76,82 Q82,78 90,80" stroke={C.hair} strokeWidth="4" strokeLinecap="round" fill="none"/>
          <path d="M76,82 Q82,78 90,80" stroke={C.lash} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".7"/>
          <path d="M110,80 Q118,78 124,82" stroke={C.hair} strokeWidth="4" strokeLinecap="round" fill="none"/>
          <path d="M110,80 Q118,78 124,82" stroke={C.lash} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".7"/>

          {/* EYES */}
          <g style={{transformOrigin:'83px 95px',transform:`scaleY(${eyeSY})`,transition:'transform .07s'}}>
            <ellipse cx="83" cy="95" rx="10.5" ry="8.5" fill={C.eyeWhite}/>
            <ellipse cx="83" cy="95" rx="10.5" ry="8.5" fill="none" stroke={C.lash} strokeWidth="1.2"/>
            <ellipse cx="83" cy="95" rx="7" ry="7" fill="url(#giris)" clipPath="url(#ecL)"/>
            <circle cx="83" cy="95" r="3.4" fill={C.pupil}/>
            <circle cx="81" cy="93" r="1.5" fill="white" opacity=".92"/>
            <circle cx="85" cy="97" r=".7" fill="white" opacity=".4"/>
            <path d="M72.5,89.5 Q83,85 93.5,89.5" fill={C.lash} opacity=".9"/>
            <path d="M72.5,100 Q83,104 93.5,100" fill="none" stroke={C.lash} strokeWidth=".9" opacity=".35"/>
          </g>
          <g style={{transformOrigin:'117px 95px',transform:`scaleY(${eyeSY})`,transition:'transform .07s'}}>
            <ellipse cx="117" cy="95" rx="10.5" ry="8.5" fill={C.eyeWhite}/>
            <ellipse cx="117" cy="95" rx="10.5" ry="8.5" fill="none" stroke={C.lash} strokeWidth="1.2"/>
            <ellipse cx="117" cy="95" rx="7" ry="7" fill="url(#giris)" clipPath="url(#ecR)"/>
            <circle cx="117" cy="95" r="3.4" fill={C.pupil}/>
            <circle cx="115" cy="93" r="1.5" fill="white" opacity=".92"/>
            <circle cx="119" cy="97" r=".7" fill="white" opacity=".4"/>
            <path d="M106.5,89.5 Q117,85 127.5,89.5" fill={C.lash} opacity=".9"/>
            <path d="M106.5,100 Q117,104 127.5,100" fill="none" stroke={C.lash} strokeWidth=".9" opacity=".35"/>
          </g>

          {/* NOSE */}
          <path d="M100,86 Q100,96 98,102" fill="none" stroke={C.skinShadow} strokeWidth="1.8" strokeLinecap="round" opacity=".38"/>
          <ellipse cx="100" cy="107" rx="6.5" ry="5" fill={C.skin}/>
          <ellipse cx="95.5" cy="108.5" rx="2.8" ry="2" fill={C.skinShadow} opacity=".5" transform="rotate(-10,95.5,108.5)"/>
          <ellipse cx="104.5" cy="108.5" rx="2.8" ry="2" fill={C.skinShadow} opacity=".5" transform="rotate(10,104.5,108.5)"/>
          <ellipse cx="100" cy="105" rx="2" ry="1.5" fill={C.skinLight} opacity=".48"/>

          {/* MOUTH */}
          {mouthOpen<0.05?(
            <path d="M91,118 Q100,123 109,118" fill="none" stroke={C.mouthDark} strokeWidth="2" strokeLinecap="round"/>
          ):(
            <g>
              <path d={`M91,117 Q100,${116+mouthOpen*7} 109,117 Q108,${117+mouthOpen*13} 100,${118+mouthOpen*13} Q92,${117+mouthOpen*13} 91,117Z`} fill={C.mouthDark}/>
              <path d={`M93,118 Q100,${117+mouthOpen*5} 107,118 Q107,${119+mouthOpen*6} 100,${119+mouthOpen*7} Q93,${119+mouthOpen*6} 93,118Z`} fill={C.teeth}/>
              <path d={`M96,${118+mouthOpen*2} L100,${118+mouthOpen*2} L104,${118+mouthOpen*2}`} stroke={C.robeShadow} strokeWidth=".6" opacity=".35"/>
              <path d={`M91,117 Q96,115 100,116 Q104,115 109,117`} fill={C.mouthDark} opacity=".55"/>
            </g>
          )}
          <path d="M89,117 Q87,120 88,122" fill="none" stroke={C.skinShadow} strokeWidth="1" strokeLinecap="round" opacity=".3"/>
          <path d="M111,117 Q113,120 112,122" fill="none" stroke={C.skinShadow} strokeWidth="1" strokeLinecap="round" opacity=".3"/>

          {/* BEARD */}
          <path d="M72,112 Q68,120 68,128 Q69,136 75,140 Q83,146 100,148 Q117,146 125,140 Q131,136 132,128 Q132,120 128,112 Q122,122 118,126 Q110,134 100,136 Q90,134 82,126 Q78,122 72,112Z" fill={C.beard}/>
          <path d="M74,114 Q71,122 71,128 Q72,133 77,137 Q84,143 100,145 Q116,143 123,137 Q128,133 129,128 Q129,122 126,114 Q120,124 116,128 Q108,136 100,138 Q92,136 84,128 Q80,124 74,114Z" fill={C.beardLight} opacity=".42"/>
          <ellipse cx="100" cy="144" rx="8" ry="5" fill={C.beard}/>
          {/* mustache */}
          <path d="M88,113 Q94,110 100,113 Q106,110 112,113 Q110,117 100,117 Q90,117 88,113Z" fill={C.beard}/>
          {/* beard texture */}
          {[{x1:79,x2:77,y1:120,y2:134},{x1:87,x2:85,y1:124,y2:138},{x1:95,x2:94,y1:128,y2:142},{x1:100,x2:100,y1:130,y2:144},{x1:105,x2:106,y1:128,y2:142},{x1:113,x2:115,y1:124,y2:138},{x1:121,x2:123,y1:120,y2:134}].map((s,i)=>(
            <path key={i} d={`M${s.x1},${s.y1} Q${(s.x1+s.x2)/2},${(s.y1+s.y2)/2} ${s.x2},${s.y2}`} fill="none" stroke={C.beardLight} strokeWidth=".8" opacity=".38"/>
          ))}

        </g>{/* end body */}

        {/* Thinking dots */}
        {state==='thinking'&&[0,1,2].map(i=>(
          <circle key={i} cx={90+i*10} cy={282} r={2.8} fill={C.gold}
            style={{animation:'gb-dot 1.1s ease-in-out infinite',animationDelay:`${i*.22}s`}}/>
        ))}

      </svg>
    </div>
  );
}
