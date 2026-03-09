/**
 * GideonAvatar v3 — rebuilt to match the reference 3D cartoon character.
 * Big cartoon head, warm dark skin, trimmed goatee, wide bell sleeves,
 * wide-hem robe, fluffy slippers, chalice in right hand, gesture in left.
 */
import React, { useEffect, useRef, useState } from 'react';

/* ─── Palette (matched to reference image) ────────────────────────────────── */
const C = {
  skin:        '#C07848',
  skinShadow:  '#8C4E20',
  skinMid:     '#A86030',
  skinLight:   '#D89060',
  skinHi:      '#E8B080',
  hair:        '#3A2010',
  hairMid:     '#5A3418',
  hairLight:   '#7A4A28',
  goatee:      '#2E1A08',
  goateeMid:   '#4A2A12',
  robeWhite:   '#F4EFE4',
  robeLight:   '#EAE4D6',
  robeMid:     '#D6CFBF',
  robeShadow:  '#BFBAA8',
  robeDark:    '#A8A295',
  gold:        '#C9A227',
  goldBright:  '#F0D060',
  goldPale:    '#F8EBA0',
  goldDark:    '#8A6A00',
  goldInner:   '#D4AA30',
  eyeWhite:    '#FEFCF8',
  iris:        '#7B4A20',
  irisDark:    '#3A1E08',
  pupil:       '#0A0400',
  lash:        '#1E0C04',
  brow:        '#2E1808',
  mouthLine:   '#8A3C20',
  mouthPink:   '#C07060',
  teeth:       '#FEFEFE',
  slipperBase: '#EAE4D6',
  slipperFuzz: '#FAF6EE',
  chalice:     '#DDD098',
  chaliceGold: '#B8960C',
  chaliceHi:   '#F0E0A0',
  orbGold:     '#C9A227',
  orbTan:      '#C4A882',
};

const ORBS = [
  {id:0, cx:110, cy:50,  r:13,  col:'gold', dl:0.0, dur:3.2},
  {id:1, cx:160, cy:30,  r:16,  col:'tan',  dl:0.4, dur:2.8},
  {id:2, cx:72,  cy:64,  r:9,   col:'tan',  dl:0.8, dur:3.6},
  {id:3, cx:190, cy:55,  r:11,  col:'gold', dl:0.2, dur:2.6},
  {id:4, cx:132, cy:18,  r:10,  col:'tan',  dl:1.1, dur:3.0},
  {id:5, cx:208, cy:82,  r:8,   col:'gold', dl:0.6, dur:4.0},
  {id:6, cx:60,  cy:88,  r:10,  col:'tan',  dl:1.4, dur:3.4},
  {id:7, cx:176, cy:88,  r:9,   col:'gold', dl:0.9, dur:2.9},
  {id:8, cx:88,  cy:28,  r:8,   col:'gold', dl:1.7, dur:3.8},
  {id:9, cx:148, cy:68,  r:7,   col:'tan',  dl:0.5, dur:2.5},
  {id:10,cx:220, cy:110, r:6,   col:'gold', dl:1.2, dur:3.3},
  {id:11,cx:50,  cy:110, r:6,   col:'tan',  dl:0.3, dur:3.7},
];

const STARS = [
  {cx:142,cy:44, sz:5.5, dl:0.3},
  {cx:80, cy:40, sz:4,   dl:1.0},
  {cx:194,cy:66, sz:5,   dl:0.7},
  {cx:118,cy:72, sz:4,   dl:1.5},
  {cx:168,cy:42, sz:3.5, dl:0.9},
  {cx:64, cy:56, sz:3,   dl:0.5},
];

export default function GideonAvatar({
  isSpeaking=false, isListening=false, isThinking=false,
  width=300, height=360, className=''
}) {
  const state = isSpeaking?'speaking':isListening?'listening':isThinking?'thinking':'idle';

  /* Blink */
  const [blink, setBlink] = useState(false);
  const blinkRef = useRef(null);
  useEffect(() => {
    const go = () => {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); go(); }, 140);
      }, 2000 + Math.random() * 4000);
    };
    go();
    return () => clearTimeout(blinkRef.current);
  }, []);

  /* Speaking mouth */
  const [mouthOpen, setMouthOpen] = useState(0);
  const mouthRef = useRef(null);
  useEffect(() => {
    if (!isSpeaking) { setMouthOpen(0); return; }
    let ph = 0;
    mouthRef.current = setInterval(() => {
      ph += 0.38;
      setMouthOpen(Math.max(0, Math.sin(ph) * 0.95));
    }, 70);
    return () => clearInterval(mouthRef.current);
  }, [isSpeaking]);

  const bodyAnim = state==='speaking' ? 'gv3-bounce'
                 : state==='listening'? 'gv3-lean'
                 : state==='thinking' ? 'gv3-sway'
                 : 'gv3-float';
  const bodyDur = state==='speaking'?'0.48s':state==='listening'?'1.4s':state==='thinking'?'2.8s':'3.8s';
  const glowOp  = state==='speaking'?0.85:state==='listening'?0.55:state==='thinking'?0.40:0.28;
  const eyeSY   = blink ? 0.06 : 1;

  return (
    <div className={className} style={{width,height,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <style>{`
        @keyframes gv3-float {0%,100%{transform:translateY(0) rotate(0deg)}45%{transform:translateY(-10px) rotate(.5deg)}72%{transform:translateY(-7px) rotate(-.4deg)}}
        @keyframes gv3-bounce{0%,100%{transform:translateY(-2px) scale(1)}20%{transform:translateY(-14px) scale(1.04)}45%{transform:translateY(-3px) scale(1.01)}65%{transform:translateY(-15px) scale(1.05)}85%{transform:translateY(-4px) scale(1.02)}}
        @keyframes gv3-lean  {0%,100%{transform:translateY(-5px) rotate(0)}32%{transform:translateY(-13px) rotate(1.8deg)}68%{transform:translateY(-11px) rotate(-1.8deg)}}
        @keyframes gv3-sway  {0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-4px) rotate(2.2deg)}75%{transform:translateY(-4px) rotate(-2.2deg)}}
        @keyframes gv3-orb   {0%,100%{transform:translateY(0) scale(1);opacity:.85}50%{transform:translateY(-9px) scale(1.12);opacity:1}}
        @keyframes gv3-orb-f {0%,100%{transform:translateY(0) scale(.92);opacity:.78}50%{transform:translateY(-13px) scale(1.20);opacity:1}}
        @keyframes gv3-star  {0%,100%{opacity:.08;transform:scale(.45) rotate(0)}50%{opacity:.95;transform:scale(1.55) rotate(45deg)}}
        @keyframes gv3-ripple{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.9);opacity:0}}
        @keyframes gv3-dot   {0%,80%,100%{opacity:.15;transform:translateY(0)}40%{opacity:1;transform:translateY(-5px)}}
        @keyframes gv3-halo  {0%,100%{opacity:var(--gho,.28);transform:scale(1)}50%{opacity:calc(var(--gho,.28)+.16);transform:scale(1.05)}}
        @keyframes gv3-cw    {from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes gv3-ccw   {from{transform:rotate(0)}to{transform:rotate(-360deg)}}
        @keyframes gv3-shim  {0%,100%{filter:brightness(1)}50%{filter:brightness(1.11)}}
        @keyframes gv3-shim-s{0%,100%{filter:brightness(1.06) drop-shadow(0 0 12px rgba(201,162,39,.55))}28%{filter:brightness(1.40) drop-shadow(0 0 32px rgba(201,162,39,1))}58%{filter:brightness(1.13) drop-shadow(0 0 14px rgba(201,162,39,.65))}}
        @keyframes gv3-arm-l {0%,100%{transform:rotate(0)}50%{transform:rotate(-8deg)}}
        @keyframes gv3-arm-ls{0%,100%{transform:rotate(-5deg)}22%{transform:rotate(-18deg)}72%{transform:rotate(4deg)}}
        @keyframes gv3-arm-r {0%,100%{transform:rotate(0)}50%{transform:rotate(6deg)}}
      `}</style>

      <svg viewBox="0 0 260 400" width={width} height={height} style={{overflow:'visible'}}>
        <defs>
          <radialGradient id="gv3-halo-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={C.goldPale} stopOpacity=".92"/>
            <stop offset="40%"  stopColor={C.gold}     stopOpacity=".45"/>
            <stop offset="100%" stopColor={C.gold}     stopOpacity="0"/>
          </radialGradient>
          {/* Face skin — warm brown, lit from upper-left */}
          <radialGradient id="gv3-skin" cx="38%" cy="32%" r="65%">
            <stop offset="0%"   stopColor={C.skinHi}/>
            <stop offset="30%"  stopColor={C.skinLight}/>
            <stop offset="65%"  stopColor={C.skin}/>
            <stop offset="100%" stopColor={C.skinShadow}/>
          </radialGradient>
          <radialGradient id="gv3-skin2" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor={C.skinLight}/>
            <stop offset="70%"  stopColor={C.skin}/>
            <stop offset="100%" stopColor={C.skinShadow}/>
          </radialGradient>
          {/* Robe — warm cream, darker edges */}
          <linearGradient id="gv3-robe" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={C.robeShadow}/>
            <stop offset="20%"  stopColor={C.robeLight}/>
            <stop offset="50%"  stopColor={C.robeWhite}/>
            <stop offset="80%"  stopColor={C.robeLight}/>
            <stop offset="100%" stopColor={C.robeShadow}/>
          </linearGradient>
          <linearGradient id="gv3-robe-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={C.robeWhite}/>
            <stop offset="70%"  stopColor={C.robeLight}/>
            <stop offset="100%" stopColor={C.robeMid}/>
          </linearGradient>
          {/* Gold inner sleeve — warm gold, shaded */}
          <linearGradient id="gv3-gold-sleeve" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={C.goldBright}/>
            <stop offset="40%"  stopColor={C.gold}/>
            <stop offset="100%" stopColor={C.goldDark}/>
          </linearGradient>
          {/* Orbs */}
          <radialGradient id="gv3-orb-gold" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor={C.goldBright}/>
            <stop offset="50%"  stopColor={C.gold}/>
            <stop offset="100%" stopColor={C.goldDark}/>
          </radialGradient>
          <radialGradient id="gv3-orb-tan" cx="36%" cy="30%" r="62%">
            <stop offset="0%"   stopColor="#ECD4AE"/>
            <stop offset="55%"  stopColor={C.orbTan}/>
            <stop offset="100%" stopColor="#6A5030"/>
          </radialGradient>
          {/* Iris */}
          <radialGradient id="gv3-iris" cx="34%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#B07840"/>
            <stop offset="45%"  stopColor={C.iris}/>
            <stop offset="100%" stopColor={C.irisDark}/>
          </radialGradient>
          {/* Hair */}
          <radialGradient id="gv3-hair" cx="44%" cy="22%" r="70%">
            <stop offset="0%"   stopColor={C.hairLight}/>
            <stop offset="50%"  stopColor={C.hairMid}/>
            <stop offset="100%" stopColor={C.hair}/>
          </radialGradient>
          {/* Clip paths for eyes */}
          <clipPath id="gv3-ecL"><ellipse cx="100" cy="130" rx="14" ry="12"/></clipPath>
          <clipPath id="gv3-ecR"><ellipse cx="160" cy="130" rx="14" ry="12"/></clipPath>
        </defs>

        {/* ─── Ambient halo ─── */}
        <ellipse cx="130" cy="230" rx="88" ry="115"
          fill="url(#gv3-halo-g)"
          style={{'--gho':glowOp,transformOrigin:'130px 230px',animation:'gv3-halo 3.2s ease-in-out infinite'}}/>

        {/* ─── Listening ripples ─── */}
        {state==='listening'&&[0,1,2].map(i=>(
          <ellipse key={i} cx="130" cy="230" rx="92" ry="120"
            fill="none" stroke={C.goldPale} strokeWidth="1.5"
            style={{transformOrigin:'130px 230px',animation:'gv3-ripple 2.0s ease-out infinite',animationDelay:`${i*.65}s`}}/>
        ))}

        {/* ─── Deco rings ─── */}
        <circle cx="130" cy="120" r="86" fill="none" stroke={C.goldPale} strokeWidth=".55"
          strokeDasharray="10 13" opacity={state==='speaking'?.5:.16}
          style={{transformOrigin:'130px 120px',animation:`gv3-cw ${state==='speaking'?'3.5s':'13s'} linear infinite`}}/>
        <circle cx="130" cy="120" r="72" fill="none" stroke={C.gold} strokeWidth=".4"
          strokeDasharray="5 18" opacity={state==='idle'?.1:.20}
          style={{transformOrigin:'130px 120px',animation:`gv3-ccw ${state==='speaking'?'5s':'19s'} linear infinite`}}/>

        {/* ─── Orbs ─── */}
        {ORBS.map(o=>(
          <g key={o.id} style={{transformOrigin:`${o.cx}px ${o.cy}px`,
            animation:`${state==='speaking'?'gv3-orb-f':'gv3-orb'} ${state==='speaking'?(o.dur*.33).toFixed(1)+'s':o.dur+'s'} ease-in-out infinite`,
            animationDelay:`${o.dl}s`}}>
            <ellipse cx={o.cx+2.5} cy={o.cy+2.5} rx={o.r*1.1} ry={o.r*.85}
              fill={o.col==='gold'?'#604800':'#504020'} opacity=".32"/>
            <circle cx={o.cx} cy={o.cy} r={o.r}
              fill={o.col==='gold'?'url(#gv3-orb-gold)':'url(#gv3-orb-tan)'}/>
            <ellipse cx={o.cx-o.r*.3} cy={o.cy-o.r*.32} rx={o.r*.36} ry={o.r*.24}
              fill="white" opacity=".55" transform={`rotate(-26,${o.cx-o.r*.3},${o.cy-o.r*.32})`}/>
          </g>
        ))}

        {/* ─── Stars ─── */}
        {STARS.map(s=>(
          <g key={s.cx} transform={`translate(${s.cx},${s.cy})`}
            style={{transformOrigin:'0 0',
              animation:`gv3-star ${state==='speaking'?'0.82s':'2.6s'} ease-in-out infinite`,
              animationDelay:`${s.dl}s`}}>
            {[0,45,90,135].map(a=>(
              <line key={a} x1="0" y1={-s.sz} x2="0" y2={s.sz}
                stroke={C.goldBright} strokeWidth="1.2" strokeLinecap="round"
                transform={`rotate(${a})`}/>
            ))}
            <circle r="1.4" fill={C.goldBright} opacity=".85"/>
          </g>
        ))}

        {/* ════════════ BODY GROUP ════════════ */}
        <g style={{transformOrigin:'130px 390px',
          animation:`${bodyAnim} ${bodyDur} ease-in-out infinite, ${
            state==='speaking'
              ? 'gv3-shim-s .48s ease-in-out infinite'
              : 'gv3-shim 4s ease-in-out infinite'
          }`}}>

          {/* ── Slippers (fluffy, wide) ── */}
          {/* Left */}
          <ellipse cx="100" cy="378" rx="28" ry="12" fill={C.slipperBase}/>
          {/* Fuzz top */}
          <path d="M72,374 Q100,364 128,374 Q100,384 72,374Z" fill={C.slipperFuzz} opacity=".75"/>
          {/* Fuzz texture bumps */}
          {[82,92,102,112,120].map(x=>(
            <ellipse key={x} cx={x} cy={370} rx="5" ry="3.5" fill={C.slipperFuzz} opacity=".6"/>
          ))}
          {/* Right */}
          <ellipse cx="160" cy="378" rx="28" ry="12" fill={C.slipperBase}/>
          <path d="M132,374 Q160,364 188,374 Q160,384 132,374Z" fill={C.slipperFuzz} opacity=".75"/>
          {[140,150,160,170,178].map(x=>(
            <ellipse key={x} cx={x} cy={370} rx="5" ry="3.5" fill={C.slipperFuzz} opacity=".6"/>
          ))}

          {/* ── Robe lower hem (wide layered look) ── */}
          {/* Bottom hem layer */}
          <path d="M46,360 Q130,372 214,360 L210,378 L50,378 Z" fill={C.robeMid} opacity=".7"/>
          {/* Second hem layer */}
          <path d="M52,348 Q130,362 208,348 L214,360 Q130,372 46,360 Z" fill={C.robeLight} opacity=".6"/>

          {/* ── Robe main body — very wide bell shape ── */}
          <path d={`
            M86,186
            C72,194 58,212 50,238
            L40,360 L220,360 L210,238
            C202,212 188,194 174,186
            Z
          `} fill="url(#gv3-robe)"/>

          {/* Robe center body highlight */}
          <path d="M116,190 L116,360 L144,360 L144,190 Z" fill={C.robeWhite} opacity=".38"/>

          {/* Robe fold shadows */}
          <path d="M50,244 C46,272 44,314 44,354 L52,360 L50,238Z" fill={C.robeShadow} opacity=".55"/>
          <path d="M210,244 C214,272 216,314 216,354 L208,360 L210,238Z" fill={C.robeShadow} opacity=".55"/>

          {/* ── LEFT SLEEVE — wide bell, gold-lined interior ── */}
          {/* Gold interior of sleeve (visible when arm is out) */}
          <path d={`
            M86,186 C78,192 66,208 54,232
            L42,270 C46,278 54,282 60,278
            L68,252 C76,232 84,210 88,196 Z
          `} fill="url(#gv3-gold-sleeve)" opacity=".82"/>
          {/* Outer robe over sleeve */}
          <path d={`
            M86,186 C80,192 70,206 62,226
            L50,264 C54,272 62,275 66,272
            L76,246 C82,228 88,208 90,196 Z
          `} fill="url(#gv3-robe-v)" opacity=".90"/>
          {/* Gold trim edge on left sleeve */}
          <path d="M66,272 L50,264 L62,226 C70,206 80,192 86,186"
            fill="none" stroke={C.gold} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M66,272 L50,264 L62,226 C70,206 80,192 86,186"
            fill="none" stroke={C.goldBright} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".65"/>

          {/* ── RIGHT SLEEVE — wide bell, gold-lined ── */}
          {/* Gold interior */}
          <path d={`
            M174,186 C182,192 194,208 206,232
            L218,270 C214,278 206,282 200,278
            L192,252 C184,232 176,210 172,196 Z
          `} fill="url(#gv3-gold-sleeve)" opacity=".82"/>
          {/* Outer robe over sleeve */}
          <path d={`
            M174,186 C180,192 190,206 198,226
            L210,264 C206,272 198,275 194,272
            L184,246 C178,228 172,208 170,196 Z
          `} fill="url(#gv3-robe-v)" opacity=".90"/>
          {/* Gold trim edge right sleeve */}
          <path d="M194,272 L210,264 L198,226 C190,206 180,192 174,186"
            fill="none" stroke={C.gold} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M194,272 L210,264 L198,226 C190,206 180,192 174,186"
            fill="none" stroke={C.goldBright} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".65"/>

          {/* ── Collar gold trim (wide band) ── */}
          <path d="M92,186 Q130,174 168,186" fill="none" stroke={C.gold} strokeWidth="8" strokeLinecap="round"/>
          <path d="M92,186 Q130,174 168,186" fill="none" stroke={C.goldBright} strokeWidth="3.5" strokeLinecap="round" opacity=".6"/>
          <path d="M92,186 Q130,174 168,186" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity=".35"/>

          {/* ── Sash / belt center panel ── */}
          <rect x="114" y="205" width="32" height="153" rx="3" fill={C.robeWhite} opacity=".88"/>
          {/* Sash shading */}
          <rect x="114" y="205" width="6" height="153" rx="0" fill={C.robeMid} opacity=".3"/>
          <rect x="140" y="205" width="6" height="153" rx="0" fill={C.robeMid} opacity=".3"/>
          {/* Gold horizontal stripes */}
          {[216,230,244,258].map(y=>(
            <g key={y}>
              <rect x="114" y={y} width="32" height="4" rx="2" fill={C.gold} opacity=".84"/>
              <rect x="114" y={y} width="32" height="1.5" rx="1" fill={C.goldBright} opacity=".5"/>
            </g>
          ))}
          {/* Belt knot */}
          <ellipse cx="130" cy="208" rx="15" ry="9" fill={C.gold}/>
          <ellipse cx="130" cy="208" rx="15" ry="9" fill="none" stroke={C.goldBright} strokeWidth="1.2" opacity=".65"/>
          <ellipse cx="129" cy="206.5" rx="5.5" ry="3.8" fill={C.goldBright} opacity=".55"/>
          {/* Belt knot side loops */}
          <path d="M115,208 Q108,204 110,212 Q112,218 115,210" fill={C.gold} opacity=".7"/>
          <path d="M145,208 Q152,204 150,212 Q148,218 145,210" fill={C.gold} opacity=".7"/>

          {/* ── LEFT ARM — extended open-palm gesture ── */}
          <g style={{transformOrigin:'96px 192px',
            animation:`${state==='speaking'?'gv3-arm-ls .48s':'gv3-arm-l 3.8s'} ease-in-out infinite`}}>
            {/* Upper arm through sleeve */}
            <path d="M96,192 C86,198 72,216 56,240" stroke={C.skin} strokeWidth="22" strokeLinecap="round" fill="none"/>
            <path d="M96,192 C86,198 72,216 56,240" stroke={C.skinShadow} strokeWidth="22" strokeLinecap="round" fill="none" opacity=".22"/>
            <path d="M96,192 C86,198 72,216 56,240" stroke={C.skinLight} strokeWidth="12" strokeLinecap="round" fill="none" opacity=".4"/>
            {/* Forearm */}
            <path d="M56,240 C47,252 44,263 46,274" stroke={C.skin} strokeWidth="19" strokeLinecap="round" fill="none"/>
            <path d="M56,240 C47,252 44,263 46,274" stroke={C.skinLight} strokeWidth="10" strokeLinecap="round" fill="none" opacity=".38"/>
            {/* Palm — tilted upward, facing camera */}
            <ellipse cx="48" cy="280" rx="17" ry="13" fill="url(#gv3-skin)" transform="rotate(-25,48,280)"/>
            {/* Palm shading */}
            <ellipse cx="48" cy="280" rx="17" ry="13" fill={C.skinMid} opacity=".18" transform="rotate(-25,48,280)"/>
            {/* Fingers (4) */}
            <path d="M36,273 C31,261 31,250 34,245" stroke={C.skin} strokeWidth="8" strokeLinecap="round" fill="none"/>
            <path d="M45,270 C41,258 42,247 45,242" stroke={C.skin} strokeWidth="8.5" strokeLinecap="round" fill="none"/>
            <path d="M55,273 C53,261 54,250 57,245" stroke={C.skin} strokeWidth="8" strokeLinecap="round" fill="none"/>
            <path d="M63,278 C63,267 64,257 67,252" stroke={C.skin} strokeWidth="7.5" strokeLinecap="round" fill="none"/>
            {/* Thumb */}
            <path d="M35,276 C29,268 29,260 33,256 C37,252 43,255 43,262"
              stroke={C.skin} strokeWidth="9" strokeLinecap="round" fill="none"/>
            {/* Knuckle highlights */}
            <path d="M34,245 Q45,240 57,245" fill="none" stroke={C.skinHi} strokeWidth="1.3" opacity=".45"/>
            {/* Palm highlight */}
            <ellipse cx="47" cy="272" rx="7" ry="5" fill={C.skinHi} opacity=".25" transform="rotate(-20,47,272)"/>
          </g>

          {/* ── RIGHT ARM — raised, holding chalice ── */}
          <g style={{transformOrigin:'164px 192px',
            animation:`gv3-arm-r ${state==='speaking'?'.48s':'3.8s'} ease-in-out infinite`,
            animationDelay:'.5s'}}>
            {/* Upper arm */}
            <path d="M164,192 C174,198 188,216 204,238" stroke={C.skin} strokeWidth="22" strokeLinecap="round" fill="none"/>
            <path d="M164,192 C174,198 188,216 204,238" stroke={C.skinShadow} strokeWidth="22" strokeLinecap="round" fill="none" opacity=".22"/>
            <path d="M164,192 C174,198 188,216 204,238" stroke={C.skinLight} strokeWidth="12" strokeLinecap="round" fill="none" opacity=".4"/>
            {/* Forearm — bends upward toward chalice */}
            <path d="M204,238 C210,224 212,210 208,196" stroke={C.skin} strokeWidth="19" strokeLinecap="round" fill="none"/>
            <path d="M204,238 C210,224 212,210 208,196" stroke={C.skinLight} strokeWidth="10" strokeLinecap="round" fill="none" opacity=".38"/>
            {/* Hand cupped around chalice base */}
            <ellipse cx="210" cy="192" rx="14" ry="11" fill="url(#gv3-skin2)" transform="rotate(18,210,192)"/>
            {/* Fingers */}
            <path d="M200,185 C196,175 197,166 200,162" stroke={C.skin} strokeWidth="8" strokeLinecap="round" fill="none"/>
            <path d="M208,183 C205,173 206,164 210,160" stroke={C.skin} strokeWidth="8.5" strokeLinecap="round" fill="none"/>
            <path d="M216,185 C214,175 215,166 218,162" stroke={C.skin} strokeWidth="7.5" strokeLinecap="round" fill="none"/>
            <path d="M222,190 C221,181 222,173 224,169" stroke={C.skin} strokeWidth="7" strokeLinecap="round" fill="none"/>

            {/* ── CHALICE ── matches reference: small cup, simple, held up ── */}
            {/* Base */}
            <ellipse cx="210" cy="178" rx="12" ry="4.5" fill={C.chalice}/>
            <ellipse cx="210" cy="178" rx="12" ry="4.5" fill="none" stroke={C.chaliceGold} strokeWidth="1.2"/>
            {/* Stem */}
            <rect x="207" y="166" width="6" height="12" rx="2.5" fill={C.chalice}/>
            <rect x="207" y="166" width="6" height="12" rx="2.5" fill="none" stroke={C.chaliceGold} strokeWidth=".9"/>
            {/* Cup bowl */}
            <path d="M198,164 L201,148 L219,148 L222,164 Z" fill={C.chalice}/>
            <path d="M198,164 L201,148 L219,148 L222,164 Z" fill="none" stroke={C.chaliceGold} strokeWidth="1.4"/>
            {/* Gold stripes on cup */}
            <path d="M199,157 L221,157" stroke={C.chaliceGold} strokeWidth="1.1" opacity=".8"/>
            <path d="M199,161 L221,161" stroke={C.chaliceGold} strokeWidth="1.1" opacity=".8"/>
            {/* Rim */}
            <ellipse cx="210" cy="148" rx="10" ry="3.8" fill={C.chalice}/>
            <ellipse cx="210" cy="148" rx="10" ry="3.8" fill="none" stroke={C.chaliceGold} strokeWidth="1.3"/>
            {/* Chalice highlight */}
            <path d="M202,150 C202,148 205,147 209,148" fill="none" stroke={C.chaliceHi} strokeWidth="2" strokeLinecap="round" opacity=".75"/>
            {/* Liquid surface */}
            <ellipse cx="210" cy="151" rx="7.5" ry="2.2" fill={C.gold} opacity=".4"/>
          </g>

          {/* ── Neck (short, thick — cartoon proportions) ── */}
          <path d="M112,168 L112,186 Q130,194 148,186 L148,168 Z" fill="url(#gv3-skin)"/>
          <path d="M112,168 L112,186 Q130,194 148,186 L148,168 Z" fill={C.skinShadow} opacity=".16"/>

          {/* ════ HEAD (large — cartoon 3D proportions) ════ */}
          {/* Head base — large round sphere */}
          <ellipse cx="130" cy="108" rx="62" ry="66" fill="url(#gv3-skin)"/>
          {/* Jaw / lower face widening */}
          <path d="M70,124 Q66,148 74,164 Q90,182 130,186 Q170,182 186,164 Q194,148 190,124 Z"
            fill="url(#gv3-skin)"/>
          {/* Forehead shadow for depth */}
          <path d="M76,98 Q130,88 184,98 Q176,68 130,62 Q84,68 76,98 Z" fill={C.skinShadow} opacity=".13"/>
          {/* Cheek roundness highlights */}
          <ellipse cx="90" cy="148" rx="18" ry="14" fill={C.skinLight} opacity=".22" transform="rotate(-10,90,148)"/>
          <ellipse cx="170" cy="148" rx="18" ry="14" fill={C.skinLight} opacity=".22" transform="rotate(10,170,148)"/>
          {/* Cheek blush */}
          <ellipse cx="88" cy="152" rx="14" ry="10" fill="#E07878" opacity=".10" transform="rotate(-8,88,152)"/>
          <ellipse cx="172" cy="152" rx="14" ry="10" fill="#E07878" opacity=".10" transform="rotate(8,172,152)"/>

          {/* ── EARS (round, cartoon) ── */}
          <ellipse cx="69" cy="116" rx="10" ry="14" fill={C.skin}/>
          <ellipse cx="69" cy="116" rx="6.5" ry="9.5" fill={C.skinShadow} opacity=".30"/>
          <path d="M67,109 Q63,116 67,123" fill="none" stroke={C.skinShadow} strokeWidth="1.8" opacity=".45"/>
          <ellipse cx="191" cy="116" rx="10" ry="14" fill={C.skin}/>
          <ellipse cx="191" cy="116" rx="6.5" ry="9.5" fill={C.skinShadow} opacity=".30"/>
          <path d="M193,109 Q197,116 193,123" fill="none" stroke={C.skinShadow} strokeWidth="1.8" opacity=".45"/>

          {/* ── HAIR (short, wavy, dark brown) ── */}
          {/* Back layer */}
          <path d="M72,100 Q68,76 78,58 Q92,36 130,32 Q168,36 182,58 Q192,76 188,100"
            fill={C.hair} opacity=".55"/>
          {/* Main mass */}
          <path d={`
            M72,106 Q68,80 78,60 Q92,38 130,34 Q168,38 182,60
            Q192,80 188,106
            Q180,94 172,88 Q158,80 130,78 Q102,80 88,88 Q80,94 72,106 Z
          `} fill="url(#gv3-hair)"/>
          {/* Right side curl (distinctive from reference) */}
          <path d="M186,96 Q190,82 186,68 Q182,56 176,54 Q172,58 176,68 Q178,78 176,86"
            fill={C.hairMid} opacity=".8"/>
          {/* Left tuck */}
          <path d="M74,96 Q70,82 74,68 Q78,56 84,54 Q88,58 84,68 Q82,78 84,86"
            fill={C.hairMid} opacity=".8"/>
          {/* Top wave / curl — very characteristic in the reference */}
          <path d="M108,78 Q112,60 120,52 Q126,46 130,48 Q134,46 140,52 Q148,60 152,78"
            fill={C.hairMid} opacity=".7"/>
          {/* Top wave highlight */}
          <path d="M114,68 Q122,58 130,56 Q138,58 146,68"
            fill="none" stroke={C.hairLight} strokeWidth="3.5" strokeLinecap="round" opacity=".55"/>
          {/* Front wisp curls */}
          <path d="M92,88 Q96,74 102,66 Q106,60 110,63 Q107,72 105,82"
            fill={C.hairLight} opacity=".75"/>
          <path d="M168,88 Q164,74 158,66 Q154,60 150,63 Q153,72 155,82"
            fill={C.hairLight} opacity=".75"/>
          {/* Hair sheen */}
          <path d="M110,62 Q122,54 130,52 Q138,54 150,62"
            fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".2"/>

          {/* ── EYEBROWS (thick, expressive, slightly furrowed) ── */}
          <path d="M82,100 Q94,93 110,96" stroke={C.brow} strokeWidth="7" strokeLinecap="round" fill="none"/>
          <path d="M82,100 Q94,93 110,96" stroke={C.lash} strokeWidth="3.2" strokeLinecap="round" fill="none" opacity=".72"/>
          <path d="M150,96 Q166,93 178,100" stroke={C.brow} strokeWidth="7" strokeLinecap="round" fill="none"/>
          <path d="M150,96 Q166,93 178,100" stroke={C.lash} strokeWidth="3.2" strokeLinecap="round" fill="none" opacity=".72"/>

          {/* ── EYES (big, round, warm brown) ── */}
          {/* Left eye */}
          <g style={{transformOrigin:'100px 130px',transform:`scaleY(${eyeSY})`,transition:'transform .07s'}}>
            {/* White */}
            <ellipse cx="100" cy="130" rx="14.5" ry="12" fill={C.eyeWhite}/>
            <ellipse cx="100" cy="130" rx="14.5" ry="12" fill="none" stroke={C.lash} strokeWidth="1.6"/>
            {/* Iris */}
            <ellipse cx="100" cy="130" rx="10" ry="10" fill="url(#gv3-iris)" clipPath="url(#gv3-ecL)"/>
            {/* Pupil */}
            <circle cx="100" cy="130" r="5.2" fill={C.pupil}/>
            {/* Catchlights */}
            <circle cx="96.5" cy="126.5" r="2.4" fill="white" opacity=".95"/>
            <circle cx="103" cy="133" r="1.2" fill="white" opacity=".5"/>
            {/* Top lash (thick curve) */}
            <path d="M85.5,122 Q100,117 114.5,122" fill={C.lash} opacity=".93"/>
            {/* Bottom lash */}
            <path d="M85.5,138 Q100,143 114.5,138" fill="none" stroke={C.lash} strokeWidth="1.2" opacity=".35"/>
            {/* Lid crease */}
            <path d="M87,124 Q100,120 113,124" fill="none" stroke={C.skinMid} strokeWidth=".9" opacity=".3"/>
          </g>
          {/* Right eye */}
          <g style={{transformOrigin:'160px 130px',transform:`scaleY(${eyeSY})`,transition:'transform .07s'}}>
            <ellipse cx="160" cy="130" rx="14.5" ry="12" fill={C.eyeWhite}/>
            <ellipse cx="160" cy="130" rx="14.5" ry="12" fill="none" stroke={C.lash} strokeWidth="1.6"/>
            <ellipse cx="160" cy="130" rx="10" ry="10" fill="url(#gv3-iris)" clipPath="url(#gv3-ecR)"/>
            <circle cx="160" cy="130" r="5.2" fill={C.pupil}/>
            <circle cx="156.5" cy="126.5" r="2.4" fill="white" opacity=".95"/>
            <circle cx="163" cy="133" r="1.2" fill="white" opacity=".5"/>
            <path d="M145.5,122 Q160,117 174.5,122" fill={C.lash} opacity=".93"/>
            <path d="M145.5,138 Q160,143 174.5,138" fill="none" stroke={C.lash} strokeWidth="1.2" opacity=".35"/>
            <path d="M147,124 Q160,120 173,124" fill="none" stroke={C.skinMid} strokeWidth=".9" opacity=".3"/>
          </g>

          {/* ── NOSE (round, button — cartoon style) ── */}
          {/* Bridge subtle */}
          <path d="M130,116 Q130,128 127,136" fill="none" stroke={C.skinShadow} strokeWidth="2.2" strokeLinecap="round" opacity=".3"/>
          {/* Tip — round and prominent */}
          <ellipse cx="130" cy="146" rx="10" ry="8" fill={C.skin}/>
          <ellipse cx="130" cy="146" rx="10" ry="8" fill={C.skinShadow} opacity=".2"/>
          {/* Nostril wings */}
          <ellipse cx="122" cy="149" rx="4.5" ry="3.2" fill={C.skinMid} opacity=".55" transform="rotate(-15,122,149)"/>
          <ellipse cx="138" cy="149" rx="4.5" ry="3.2" fill={C.skinMid} opacity=".55" transform="rotate(15,138,149)"/>
          {/* Tip highlight */}
          <ellipse cx="130" cy="143" rx="3.5" ry="2.5" fill={C.skinHi} opacity=".55"/>

          {/* ── MOUTH ── */}
          {mouthOpen < 0.05 ? (
            <g>
              {/* Resting smile */}
              <path d="M114,162 Q130,170 146,162" fill="none" stroke={C.mouthLine} strokeWidth="2.8" strokeLinecap="round"/>
              {/* Upper lip bow */}
              <path d="M114,162 Q122,158 130,160 Q138,158 146,162" fill={C.mouthPink} opacity=".38"/>
            </g>
          ) : (
            <g>
              {/* Open mouth */}
              <path d={`M114,161 Q130,${160+mouthOpen*10} 146,161 Q145,${162+mouthOpen*18} 130,${163+mouthOpen*18} Q115,${162+mouthOpen*18} 114,161Z`}
                fill={C.mouthLine}/>
              {/* Teeth */}
              <path d={`M116,162 Q130,${161+mouthOpen*7} 144,162 Q144,${164+mouthOpen*9} 130,${165+mouthOpen*10} Q116,${164+mouthOpen*9} 116,162Z`}
                fill={C.teeth}/>
              {/* Tooth line */}
              <path d={`M122,${163+mouthOpen*3} L130,${163+mouthOpen*3} L138,${163+mouthOpen*3}`}
                stroke={C.robeShadow} strokeWidth=".9" opacity=".3"/>
              {/* Upper lip */}
              <path d={`M114,161 Q122,157 130,159 Q138,157 146,161`} fill={C.mouthPink} opacity=".45"/>
            </g>
          )}
          {/* Smile creases */}
          <path d="M112,161 Q109,166 110,171" fill="none" stroke={C.skinShadow} strokeWidth="1.3" strokeLinecap="round" opacity=".28"/>
          <path d="M148,161 Q151,166 150,171" fill="none" stroke={C.skinShadow} strokeWidth="1.3" strokeLinecap="round" opacity=".28"/>

          {/* ── GOATEE (trimmed — matches reference: soul patch + chin beard) ── */}
          {/* Mustache — thin, above upper lip */}
          <path d="M116,158 Q124,153 130,156 Q136,153 144,158 Q142,163 130,164 Q118,163 116,158Z"
            fill={C.goatee}/>
          <path d="M116,158 Q124,154 130,156 Q136,154 144,158"
            fill="none" stroke={C.goateeMid} strokeWidth="1" opacity=".5"/>
          {/* Chin goatee — rounded bottom shape */}
          <path d="M118,170 Q122,168 130,170 Q138,168 142,170 Q142,182 138,188 Q134,192 130,193 Q126,192 122,188 Q118,182 118,170Z"
            fill={C.goatee}/>
          <path d="M120,172 Q124,170 130,172 Q136,170 140,172 Q140,182 136,187 Q133,190 130,191 Q127,190 124,187 Q120,182 120,172Z"
            fill={C.goateeMid} opacity=".45"/>
          {/* Soul patch (between lip and chin beard) */}
          <ellipse cx="130" cy="166" rx="5" ry="3.5" fill={C.goatee}/>
          {/* Goatee texture */}
          <path d="M124,174 Q122,182 122,188" fill="none" stroke={C.goateeMid} strokeWidth="1" opacity=".4"/>
          <path d="M130,175 Q130,184 130,191" fill="none" stroke={C.goateeMid} strokeWidth="1" opacity=".4"/>
          <path d="M136,174 Q138,182 138,188" fill="none" stroke={C.goateeMid} strokeWidth="1" opacity=".4"/>
          {/* Goatee highlight */}
          <path d="M124,172 Q130,170 136,172" fill="none" stroke={C.goateeMid} strokeWidth=".8" opacity=".3"/>

        </g>{/* end body group */}

        {/* ── Thinking dots ── */}
        {state==='thinking'&&[0,1,2].map(i=>(
          <circle key={i} cx={112+i*18} cy={388} r={4.5}
            fill={C.gold}
            style={{animation:'gv3-dot 1.1s ease-in-out infinite',animationDelay:`${i*.24}s`}}/>
        ))}

      </svg>
    </div>
  );
}
