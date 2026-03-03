/**
 * ChatbotAvatar3D — Pixar-meets-Fortnite semi-realistic 3D avatars
 *
 * Characters: Hannah, Coach David, Chef Daniel, Gideon
 * Features:
 *   • Per-character PBR materials (albedo, roughness, metalness)
 *   • Distinct skin tones, hair styles, clothing, accessories
 *   • Animation state machine: idle | listening | thinking | speaking
 *   • Phoneme-style lip sync with multi-harmonic jaw drive
 *   • Natural blinking (random 2-5s intervals)
 *   • Expressive brow lift / furrow per state
 *   • Cheekbone flush when speaking
 *   • Subsurface-style ear/nostril darkening
 *   • Catchlight specular on cornea
 *   • ACESFilmic tone mapping for warm studio feel
 */
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const lerp  = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

// ─────────────────────────────────────────────────────────────────────────────
// CHARACTER CONFIGS
// ─────────────────────────────────────────────────────────────────────────────
const CHARS = {
  hannah: {
    // Nurturing woman, early 30s, warm medium-brown skin, curly hair
    skin:     '#c4845a', skinShadow:'#9c6038', skinHighlight:'#d9a882',
    hair:     '#281408', hairMid:'#4a2210', hairSheen:'#6b3318',
    iris:     '#7a5c3a', lip:'#c4685a', lipDark:'#9e4838',
    cheek:    '#d97860', cloth1:'#c8a0bc', cloth2:'#a07898',
    hW:1.00, hH:1.09, hD:0.91,
    eyeX:0.143, eyeY:0.085, noseY:-0.068, lipY:-0.188,
    browThick:0.021, browArc:-0.10, jawW:0.80, jawH:0.55,
    ckX:0.165, ckY:-0.018,
    hairStyle:'curly', acc:'earrings',
  },
  coach: {
    // Athletic coach, late 20s, medium-dark skin, fade cut, muscular
    skin:     '#7a4a28', skinShadow:'#5c3418', skinHighlight:'#9c6842',
    hair:     '#080808', hairMid:'#181210', hairSheen:'#2a1c14',
    iris:     '#3a5a1c', lip:'#6a3424', lipDark:'#4e2418',
    cheek:    '#8a5a32', cloth1:'#18182c', cloth2:'#28284c',
    hW:1.05, hH:1.01, hD:0.97,
    eyeX:0.150, eyeY:0.070, noseY:-0.082, lipY:-0.198,
    browThick:0.026, browArc:-0.04, jawW:0.91, jawH:0.53,
    ckX:0.190, ckY:-0.042,
    hairStyle:'fade', acc:'none',
  },
  chef: {
    // Charismatic chef, late 30s, warm tan skin, wavy hair, chef attire
    skin:     '#c08050', skinShadow:'#986030', skinHighlight:'#d8a870',
    hair:     '#180c06', hairMid:'#321610', hairSheen:'#4a2414',
    iris:     '#684828', lip:'#b05a3c', lipDark:'#884030',
    cheek:    '#c88e60', cloth1:'#f0ece4', cloth2:'#d8d2c8',
    hW:1.07, hH:0.99, hD:0.95,
    eyeX:0.147, eyeY:0.062, noseY:-0.090, lipY:-0.208,
    browThick:0.028, browArc:0.02, jawW:0.88, jawH:0.51,
    ckX:0.178, ckY:-0.032,
    hairStyle:'wavy', acc:'chef-hat',
  },
  gideon: {
    // Wise mentor, mid 40s, warm brown skin, textured hair, faith-inspired
    skin:     '#b07848', skinShadow:'#886028', skinHighlight:'#c89060',
    hair:     '#160c06', hairMid:'#2e1810', hairSheen:'#3e2010',
    iris:     '#583820', lip:'#9a5848', lipDark:'#744038',
    cheek:    '#c08860', cloth1:'#887050', cloth2:'#9e8860',
    hW:1.01, hH:1.07, hD:0.92,
    eyeX:0.142, eyeY:0.092, noseY:-0.068, lipY:-0.186,
    browThick:0.024, browArc:-0.07, jawW:0.83, jawH:0.54,
    ckX:0.168, ckY:-0.010,
    hairStyle:'textured', acc:'beard',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MATERIAL FACTORY
// ─────────────────────────────────────────────────────────────────────────────
function mkMat(color, roughness=0.65, metalness=0, extra={}) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
}

// ─────────────────────────────────────────────────────────────────────────────
// HAIR STYLES
// ─────────────────────────────────────────────────────────────────────────────
function HairCurly({ h, hs }) {
  // Voluminous curly/coily natural hair — Hannah
  return (
    <group>
      {/* Crown */}
      <mesh material={h} position={[0,0.34,-0.03]} scale={[0.52,0.27,0.52]}>
        <sphereGeometry args={[1,30,20,0,Math.PI*2,0,Math.PI*0.63]} />
      </mesh>
      {/* Left puff */}
      <mesh material={h} position={[-0.40,0.10,-0.04]} scale={[0.16,0.28,0.15]}>
        <sphereGeometry args={[1,18,14]} />
      </mesh>
      {/* Right puff */}
      <mesh material={h} position={[0.40,0.10,-0.04]} scale={[0.16,0.28,0.15]}>
        <sphereGeometry args={[1,18,14]} />
      </mesh>
      {/* Back volume */}
      <mesh material={h} position={[0,0.06,-0.40]} scale={[0.46,0.48,0.18]}>
        <sphereGeometry args={[1,22,14]} />
      </mesh>
      {/* Hairline front edge */}
      <mesh material={h} position={[0,0.28,0.30]} scale={[0.38,0.09,0.06]}>
        <sphereGeometry args={[1,18,10,0,Math.PI*2,0,Math.PI*0.5]} />
      </mesh>
      {/* Sheen highlight */}
      <mesh material={hs} position={[0.10,0.40,0.16]} scale={[0.12,0.09,0.07]}>
        <sphereGeometry args={[1,12,8]} />
      </mesh>
    </group>
  );
}

function HairFade({ h }) {
  // Tight fade — Coach David
  return (
    <group>
      {/* Top cap */}
      <mesh material={h} position={[0,0.27,-0.06]} scale={[0.44,0.16,0.44]}>
        <sphereGeometry args={[1,26,18,0,Math.PI*2,0,Math.PI*0.54]} />
      </mesh>
      {/* Left temple strip */}
      <mesh material={h} position={[-0.37,0.09,0.09]} scale={[0.045,0.18,0.11]}>
        <cylinderGeometry args={[1,1.3,1,10]} />
      </mesh>
      {/* Right temple strip */}
      <mesh material={h} position={[0.37,0.09,0.09]} scale={[0.045,0.18,0.11]}>
        <cylinderGeometry args={[1,1.3,1,10]} />
      </mesh>
      {/* Back nape line */}
      <mesh material={h} position={[0,-0.06,-0.36]} scale={[0.38,0.10,0.08]}>
        <cylinderGeometry args={[1,1.2,1,14]} />
      </mesh>
    </group>
  );
}

function HairWavy({ h, hs }) {
  // Short wavy — Chef Daniel
  return (
    <group>
      {/* Main cap */}
      <mesh material={h} position={[0,0.27,-0.04]} scale={[0.47,0.22,0.47]}>
        <sphereGeometry args={[1,28,18,0,Math.PI*2,0,Math.PI*0.58]} />
      </mesh>
      {/* Side wing left */}
      <mesh material={h} position={[-0.36,0.14,-0.08]} scale={[0.09,0.15,0.10]}>
        <sphereGeometry args={[1,14,10]} />
      </mesh>
      {/* Side wing right */}
      <mesh material={h} position={[0.36,0.14,-0.08]} scale={[0.09,0.15,0.10]}>
        <sphereGeometry args={[1,14,10]} />
      </mesh>
      {/* Back */}
      <mesh material={h} position={[0,0.06,-0.36]} scale={[0.42,0.24,0.14]}>
        <sphereGeometry args={[1,18,12]} />
      </mesh>
      {/* Wave highlight */}
      <mesh material={hs} position={[0.06,0.33,0.18]} scale={[0.09,0.07,0.055]}>
        <sphereGeometry args={[1,10,8]} />
      </mesh>
    </group>
  );
}

function HairTextured({ h, hs }) {
  // Short textured natural — Gideon
  const bumps = [
    [-0.10,0.36,0.20],[0.10,0.38,0.18],
    [-0.20,0.28,0.14],[0.20,0.30,0.12],
    [-0.05,0.40,0.10],[0.05,0.39,0.12],
  ];
  return (
    <group>
      {/* Base cap */}
      <mesh material={h} position={[0,0.26,-0.04]} scale={[0.47,0.22,0.47]}>
        <sphereGeometry args={[1,26,18,0,Math.PI*2,0,Math.PI*0.57]} />
      </mesh>
      {/* Texture curls */}
      {bumps.map(([x,y,z],i) => (
        <mesh key={i} material={i%2===0 ? h : hs} position={[x,y,z]} scale={[0.046,0.034,0.046]}>
          <sphereGeometry args={[1,8,6]} />
        </mesh>
      ))}
      {/* Back */}
      <mesh material={h} position={[0,0.03,-0.36]} scale={[0.40,0.22,0.14]}>
        <sphereGeometry args={[1,16,12]} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCESSORIES
// ─────────────────────────────────────────────────────────────────────────────
function ChefHat({ c1, c2 }) {
  return (
    <group position={[0,0.42,0]}>
      {/* Tall cylinder */}
      <mesh material={c1}>
        <cylinderGeometry args={[0.225,0.255,0.46,24]} />
      </mesh>
      {/* Puffy crown */}
      <mesh material={c1} position={[0,0.32,0]} scale={[1,0.54,1]}>
        <sphereGeometry args={[0.27,22,16]} />
      </mesh>
      {/* Brim */}
      <mesh material={c2} position={[0,-0.245,0]}>
        <cylinderGeometry args={[0.325,0.325,0.042,24]} />
      </mesh>
      {/* Crease line */}
      <mesh material={c2} position={[0,-0.21,0]}>
        <torusGeometry args={[0.228,0.012,8,24]} />
      </mesh>
    </group>
  );
}

function Beard({ h }) {
  return (
    <group>
      {/* Cheek shadow left */}
      <mesh material={h} position={[-0.20,-0.12,0.28]} scale={[0.10,0.12,0.065]}>
        <sphereGeometry args={[1,12,10]} />
      </mesh>
      {/* Cheek shadow right */}
      <mesh material={h} position={[0.20,-0.12,0.28]} scale={[0.10,0.12,0.065]}>
        <sphereGeometry args={[1,12,10]} />
      </mesh>
      {/* Chin beard */}
      <mesh material={h} position={[0,-0.26,0.268]} scale={[0.32,0.13,0.095]}>
        <sphereGeometry args={[1,18,12]} />
      </mesh>
      {/* Chin tip */}
      <mesh material={h} position={[0,-0.33,0.228]} scale={[0.24,0.10,0.10]}>
        <sphereGeometry args={[1,16,10]} />
      </mesh>
      {/* Mustache */}
      <mesh material={h} position={[0,-0.148,0.308]} scale={[0.22,0.042,0.054]}>
        <sphereGeometry args={[1,14,8]} />
      </mesh>
    </group>
  );
}

function Earrings({ gold }) {
  return (
    <>
      <mesh material={gold} position={[-0.397,-0.045,0.020]} scale={[0.027,0.027,0.027]}>
        <torusGeometry args={[1,0.36,10,22]} />
      </mesh>
      <mesh material={gold} position={[0.397,-0.045,0.020]} scale={[0.027,0.027,0.027]}>
        <torusGeometry args={[1,0.36,10,22]} />
      </mesh>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NECK + SHOULDERS + CLOTHING
// ─────────────────────────────────────────────────────────────────────────────
function Torso({ skin, c1, c2 }) {
  return (
    <group position={[0,-0.76,0]}>
      {/* Neck */}
      <mesh material={skin} position={[0,0.26,0]}>
        <cylinderGeometry args={[0.11,0.155,0.28,14]} />
      </mesh>
      {/* Chest / shirt base */}
      <mesh material={c1} scale={[0.64,0.30,0.50]}>
        <sphereGeometry args={[1,22,14,0,Math.PI*2,0,Math.PI*0.50]} />
      </mesh>
      {/* Left shoulder */}
      <mesh material={c1} position={[-0.36,0.06,0]} scale={[0.20,0.16,0.24]}>
        <sphereGeometry args={[1,16,12]} />
      </mesh>
      {/* Right shoulder */}
      <mesh material={c1} position={[0.36,0.06,0]} scale={[0.20,0.16,0.24]}>
        <sphereGeometry args={[1,16,12]} />
      </mesh>
      {/* Collar detail */}
      <mesh material={c2} position={[0,0.17,0.095]} scale={[0.18,0.065,0.065]}>
        <sphereGeometry args={[1,12,8]} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EYE ASSEMBLY (reused for both eyes, mirrored)
// ─────────────────────────────────────────────────────────────────────────────
function Eye({ lid, sclera, iris, pupil, cornea, catchlight, lidRef, shadow }) {
  return (
    <group>
      {/* Socket shadow */}
      <mesh material={shadow} scale={[0.097,0.083,0.042]}>
        <sphereGeometry args={[1,16,12]} />
      </mesh>
      {/* Sclera */}
      <mesh material={sclera} position={[0,0,0.017]} scale={[0.084,0.074,0.044]}>
        <sphereGeometry args={[1,24,18]} />
      </mesh>
      {/* Iris */}
      <mesh material={iris} position={[0,0,0.050]} scale={[0.048,0.048,0.020]}>
        <cylinderGeometry args={[1,0.9,1,30]} />
      </mesh>
      {/* Pupil */}
      <mesh material={pupil} position={[0,0,0.064]} scale={[0.023,0.023,0.011]}>
        <cylinderGeometry args={[0.9,0.9,1,22]} />
      </mesh>
      {/* Cornea gloss */}
      <mesh material={cornea} position={[0,0,0.070]} scale={[0.087,0.076,0.016]}>
        <sphereGeometry args={[1,16,12]} />
      </mesh>
      {/* Catchlight */}
      <mesh material={catchlight} position={[0.020,0.020,0.077]} scale={[0.010,0.010,0.004]}>
        <sphereGeometry args={[1,8,6]} />
      </mesh>
      {/* Eyelid */}
      <mesh ref={lidRef} material={lid} position={[0,0.044,0.016]} scale={[0.092,0.046,0.052]}>
        <sphereGeometry args={[1,18,10,0,Math.PI*2,0,Math.PI*0.52]} />
      </mesh>
      {/* Lower lash line */}
      <mesh material={shadow} position={[0,-0.044,0.021]} scale={[0.088,0.013,0.024]}>
        <sphereGeometry args={[1,14,7,0,Math.PI*2,Math.PI*0.5,Math.PI*0.5]} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ANIMATED HEAD
// ─────────────────────────────────────────────────────────────────────────────
function AvatarHead({ char, stateRef }) {
  const cfg = CHARS[char] || CHARS.hannah;

  const headRef    = useRef();
  const jawRef     = useRef();
  const eyelidLRef = useRef();
  const eyelidRRef = useRef();
  const browLRef   = useRef();
  const browRRef   = useRef();
  const cheekLRef  = useRef();
  const cheekRRef  = useRef();

  // Build all PBR materials once
  const m = useMemo(() => ({
    skin:       mkMat(cfg.skin,          0.72, 0),
    skinDark:   mkMat(cfg.skinShadow,    0.80, 0),
    skinHi:     mkMat(cfg.skinHighlight, 0.58, 0),
    hair:       mkMat(cfg.hair,          0.88, 0),
    hairMid:    mkMat(cfg.hairMid,       0.82, 0),
    hairSheen:  mkMat(cfg.hairSheen,     0.55, 0.06),
    iris:       mkMat(cfg.iris,          0.22, 0.04),
    pupil:      mkMat('#060402',         0.08, 0.25),
    sclera:     mkMat('#f8f4ee',         0.24, 0),
    cornea:     mkMat('#ffffff',         0.00, 0.00, { transparent:true, opacity:0.20 }),
    catchlight: mkMat('#ffffff',         0.00, 0),
    lid:        mkMat(cfg.skin,          0.76, 0),
    lip:        mkMat(cfg.lip,           0.48, 0),
    lipDark:    mkMat(cfg.lipDark,       0.44, 0),
    teeth:      mkMat('#eeead6',         0.54, 0),
    brow:       mkMat(cfg.hair,          0.86, 0),
    nostril:    mkMat(cfg.skinShadow,    0.82, 0),
    cheek:      mkMat(cfg.cheek,         0.90, 0, { transparent:true, opacity:0 }),
    gold:       mkMat('#d4aa70',         0.28, 0.72),
    clothMain:  mkMat(cfg.cloth1,        0.82, 0),
    clothShad:  mkMat(cfg.cloth2,        0.86, 0),
  }), [cfg]);

  // Animation state — ref-based so never triggers re-render
  const anim = useRef({
    mouth:0, talkPhase:0, breatheT:0, swayT:0,
    hRY:0, hRX:0, hRZ:0,
    browL:0, browR:0,
    blinkT:0, nextBlink:1.6+Math.random()*2.8, blinking:false,
    thinkT:0, cheek:0,
  });

  useFrame((_, delta) => {
    const d = clamp(delta, 0.001, 0.05);
    const a = anim.current;
    const st = stateRef.current;  // 'idle'|'listening'|'thinking'|'speaking'

    a.breatheT += d * 0.36;
    a.swayT    += d * 0.26;
    const breathe = Math.sin(a.breatheT) * 0.007;

    // Idle motion targets
    let tRY = Math.sin(a.swayT * 0.70) * 0.021;
    let tRX = Math.sin(a.swayT * 0.52) * 0.011 + breathe * 0.4;
    let tRZ = 0;
    let tMouth = 0, tBrowL = 0, tBrowR = 0, tCheek = 0;

    if (st === 'listening') {
      tRY  += 0.092;   // attentive head tilt
      tRZ   = -0.052;
      tBrowL = 0.012;
      tBrowR = 0.012;
    } else if (st === 'thinking') {
      a.thinkT += d * 1.5;
      tRX += Math.sin(a.thinkT) * 0.026 - 0.034;
      tRY += Math.sin(a.thinkT * 0.62) * 0.042;
      tBrowL = -0.009;
      tBrowR = -0.009;
    } else if (st === 'speaking') {
      a.talkPhase += d * 9.5;
      const w1 = Math.sin(a.talkPhase);
      const w2 = Math.sin(a.talkPhase * 1.76 + 0.42);
      const w3 = Math.sin(a.talkPhase * 2.9);
      const w4 = Math.sin(a.talkPhase * 0.38);
      tMouth = clamp((w1*0.45 + w2*0.30 + w3*0.15 + w4*0.10)*0.5 + 0.48, 0, 1) * 0.80;
      tBrowL = Math.sin(a.talkPhase * 0.35) * 0.013;
      tBrowR = Math.sin(a.talkPhase * 0.35 + 0.28) * 0.013;
      tCheek = 0.40;
      tRX += Math.sin(a.talkPhase * 0.48) * 0.013;
    }

    const hs = 3.8;
    a.hRY   = lerp(a.hRY,   tRY,    d * hs);
    a.hRX   = lerp(a.hRX,   tRX,    d * hs);
    a.hRZ   = lerp(a.hRZ,   tRZ,    d * hs);
    a.mouth = lerp(a.mouth, tMouth, d * 17);
    a.browL = lerp(a.browL, tBrowL, d * 5.5);
    a.browR = lerp(a.browR, tBrowR, d * 5.5);
    a.cheek = lerp(a.cheek, tCheek, d * 4);

    if (headRef.current) {
      headRef.current.rotation.y = a.hRY;
      headRef.current.rotation.x = a.hRX;
      headRef.current.rotation.z = a.hRZ;
      headRef.current.position.y = breathe;
    }
    if (jawRef.current) {
      jawRef.current.position.y = -0.188 - a.mouth * 0.068;
      jawRef.current.rotation.x =  a.mouth * 0.21;
    }
    if (browLRef.current) browLRef.current.position.y = lerp(browLRef.current.position.y, 0.244 + a.browL, d*6.5);
    if (browRRef.current) browRRef.current.position.y = lerp(browRRef.current.position.y, 0.244 + a.browR, d*6.5);
    if (cheekLRef.current) cheekLRef.current.material.opacity = lerp(cheekLRef.current.material.opacity, a.cheek*0.22, d*3.5);
    if (cheekRRef.current) cheekRRef.current.material.opacity = lerp(cheekRRef.current.material.opacity, a.cheek*0.22, d*3.5);

    // Blink
    a.blinkT += d;
    if (!a.blinking && a.blinkT >= a.nextBlink) { a.blinking = true; a.blinkT = 0; }
    let lidY = 0;
    if (a.blinking) {
      const t = a.blinkT / 0.12;
      lidY = t < 0.5 ? t * 2 : (1 - t) * 2;
      if (a.blinkT >= 0.12) { a.blinking=false; a.blinkT=0; a.nextBlink=2+Math.random()*4.2; }
    }
    if (eyelidLRef.current) eyelidLRef.current.scale.y = Math.max(0.02, lidY);
    if (eyelidRRef.current) eyelidRRef.current.scale.y = Math.max(0.02, lidY);
  });

  const ex = cfg.eyeX, ey = cfg.eyeY;

  return (
    <group>
      <group ref={headRef}>

        {/* ── CRANIUM ─── */}
        <mesh material={m.skin} scale={[cfg.hW, cfg.hH, cfg.hD]}>
          <sphereGeometry args={[0.40, 44, 32]} />
        </mesh>

        {/* ── BROW RIDGE ─── */}
        <mesh material={m.skinDark} position={[0,0.187,0.348]} scale={[0.37,0.038,0.062]}>
          <sphereGeometry args={[1,18,8]} />
        </mesh>

        {/* ── CHEEKBONES ─── */}
        <mesh material={m.skin} position={[-0.285,0.002,0.298]} scale={[0.082,0.062,0.062]}>
          <sphereGeometry args={[1,14,10]} />
        </mesh>
        <mesh material={m.skin} position={[0.285,0.002,0.298]} scale={[0.082,0.062,0.062]}>
          <sphereGeometry args={[1,14,10]} />
        </mesh>

        {/* ── CHEEK FLUSH (emotion) ─── */}
        <mesh ref={cheekLRef} material={m.cheek} position={[-cfg.ckX,cfg.ckY,0.308]} scale={[0.135,0.102,0.042]}>
          <sphereGeometry args={[1,16,12]} />
        </mesh>
        <mesh ref={cheekRRef} material={m.cheek} position={[cfg.ckX,cfg.ckY,0.308]} scale={[0.135,0.102,0.042]}>
          <sphereGeometry args={[1,16,12]} />
        </mesh>

        {/* ── JAW GROUP (animated) ─── */}
        <group ref={jawRef} position={[0,-0.188,0]}>
          <mesh material={m.skin} position={[0,0.022,0.038]} scale={[cfg.jawW,cfg.jawH,0.87]}>
            <sphereGeometry args={[0.40,34,22,0,Math.PI*2,0,Math.PI*0.52]} />
          </mesh>
          {/* Lower lip */}
          <mesh material={m.lip} position={[0,0.054,0.308]} scale={[0.302,0.056,0.072]}>
            <sphereGeometry args={[1,18,10]} />
          </mesh>
          {/* Lower teeth */}
          <mesh material={m.teeth} position={[0,0.044,0.298]} scale={[0.245,0.038,0.058]}>
            <boxGeometry />
          </mesh>
          {/* Chin */}
          <mesh material={m.skin} position={[0,-0.082,0.242]} scale={[0.172,0.092,0.082]}>
            <sphereGeometry args={[1,16,12]} />
          </mesh>
        </group>

        {/* ── UPPER LIP ─── */}
        <mesh material={m.lip} position={[0,cfg.lipY,0.318]} scale={[0.312,0.058,0.074]}>
          <sphereGeometry args={[1,18,10]} />
        </mesh>
        {/* Cupid bow left */}
        <mesh material={m.lipDark} position={[-0.052,cfg.lipY+0.027,0.321]} scale={[0.065,0.027,0.038]}>
          <sphereGeometry args={[1,12,8]} />
        </mesh>
        {/* Cupid bow right */}
        <mesh material={m.lipDark} position={[0.052,cfg.lipY+0.027,0.321]} scale={[0.065,0.027,0.038]}>
          <sphereGeometry args={[1,12,8]} />
        </mesh>
        {/* Upper teeth */}
        <mesh material={m.teeth} position={[0,cfg.lipY-0.013,0.302]} scale={[0.245,0.038,0.058]}>
          <boxGeometry />
        </mesh>

        {/* ── PHILTRUM ─── */}
        <mesh material={m.skinDark} position={[0,cfg.lipY+0.062,0.322]} scale={[0.044,0.042,0.017]}>
          <sphereGeometry args={[1,10,8]} />
        </mesh>

        {/* ── NOSE ─── */}
        <group position={[0,cfg.noseY,0]}>
          <mesh material={m.skin} position={[0,0.092,0.332]} scale={[0.057,0.144,0.058]}>
            <sphereGeometry args={[1,14,10]} />
          </mesh>
          <mesh material={m.skin} position={[0,0.022,0.368]} scale={[0.085,0.072,0.073]}>
            <sphereGeometry args={[1,16,12]} />
          </mesh>
          <mesh material={m.skinDark} position={[0,0.002,0.368]} scale={[0.052,0.038,0.032]}>
            <sphereGeometry args={[1,12,8]} />
          </mesh>
          <mesh material={m.nostril} position={[-0.058,-0.006,0.354]} scale={[0.040,0.034,0.042]}>
            <sphereGeometry args={[1,10,8]} />
          </mesh>
          <mesh material={m.nostril} position={[0.058,-0.006,0.354]} scale={[0.040,0.034,0.042]}>
            <sphereGeometry args={[1,10,8]} />
          </mesh>
        </group>

        {/* ── LEFT EYE ─── */}
        <group position={[-ex,ey,0.328]}>
          <Eye
            lid={m.lid} sclera={m.sclera} iris={m.iris}
            pupil={m.pupil} cornea={m.cornea} catchlight={m.catchlight}
            lidRef={eyelidLRef} shadow={m.skinDark}
          />
        </group>

        {/* ── RIGHT EYE ─── */}
        <group position={[ex,ey,0.328]}>
          <Eye
            lid={m.lid} sclera={m.sclera} iris={m.iris}
            pupil={m.pupil} cornea={m.cornea} catchlight={m.catchlight}
            lidRef={eyelidRRef} shadow={m.skinDark}
          />
        </group>

        {/* ── EYEBROWS ─── */}
        <mesh ref={browLRef} material={m.brow}
          position={[-ex-0.010, 0.244, 0.344]}
          rotation={[0, 0.08, cfg.browArc]}
          scale={[0.108, cfg.browThick, 0.023]}>
          <sphereGeometry args={[1,16,10]} />
        </mesh>
        <mesh ref={browRRef} material={m.brow}
          position={[ex+0.010, 0.244, 0.344]}
          rotation={[0,-0.08,-cfg.browArc]}
          scale={[0.108, cfg.browThick, 0.023]}>
          <sphereGeometry args={[1,16,10]} />
        </mesh>

        {/* ── EARS ─── */}
        <group position={[-0.388,0.032,0]}>
          <mesh material={m.skin} scale={[0.060,0.095,0.050]}>
            <sphereGeometry args={[1,16,12]} />
          </mesh>
          <mesh material={m.skinDark} position={[0.012,0.010,0.022]} scale={[0.024,0.058,0.020]}>
            <torusGeometry args={[1,0.4,8,14,Math.PI]} />
          </mesh>
        </group>
        <group position={[0.388,0.032,0]}>
          <mesh material={m.skin} scale={[0.060,0.095,0.050]}>
            <sphereGeometry args={[1,16,12]} />
          </mesh>
          <mesh material={m.skinDark} position={[-0.012,0.010,0.022]} scale={[0.024,0.058,0.020]}>
            <torusGeometry args={[1,0.4,8,14,Math.PI]} />
          </mesh>
        </group>

        {/* ── HAIR ─── */}
        {cfg.hairStyle==='curly'    && <HairCurly    h={m.hair} hs={m.hairSheen} />}
        {cfg.hairStyle==='fade'     && <HairFade     h={m.hair} />}
        {cfg.hairStyle==='wavy'     && <HairWavy     h={m.hair} hs={m.hairSheen} />}
        {cfg.hairStyle==='textured' && <HairTextured h={m.hair} hs={m.hairSheen} />}

        {/* ── ACCESSORIES ─── */}
        {cfg.acc==='chef-hat' && <ChefHat   c1={m.clothMain} c2={m.clothShad} />}
        {cfg.acc==='beard'    && <Beard     h={m.hair} />}
        {cfg.acc==='earrings' && <Earrings  gold={m.gold} />}

      </group>{/* /headRef */}

      {/* ── TORSO / CLOTHING ─── */}
      <Torso skin={m.skin} c1={m.clothMain} c2={m.clothShad} />

    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDIO LIGHTING (warm key + cool fill + rim)
// ─────────────────────────────────────────────────────────────────────────────
function StudioLights() {
  return (
    <>
      {/* Warm key — upper left front */}
      <directionalLight position={[-2.2,3.8,4.2]} intensity={1.75} color="#fff6ec" />
      {/* Cool fill — right side */}
      <directionalLight position={[3.2,1.2,2.2]} intensity={0.55} color="#e8f2ff" />
      {/* Hair/rim light — back top */}
      <directionalLight position={[0.4,-0.4,-3.8]} intensity={0.48} color="#ffeedd" />
      {/* Bounce from below */}
      <directionalLight position={[0,-2.8,1.2]} intensity={0.28} color="#d4e8ff" />
      {/* Ambient fill */}
      <ambientLight intensity={0.52} color="#f2ede8" />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatbotAvatar3D({
  character   = 'hannah',
  isSpeaking  = false,
  isListening = false,
  size        = 150,
  className   = '',
}) {
  const stateRef = useRef('idle');
  useEffect(() => {
    if (isSpeaking)       stateRef.current = 'speaking';
    else if (isListening) stateRef.current = 'listening';
    else                  stateRef.current = 'idle';
  }, [isSpeaking, isListening]);

  return (
    <div
      className={className}
      style={{ width:size, height:size, borderRadius:'50%', overflow:'hidden' }}
    >
      <Canvas
        camera={{ position:[0, 0.09, 1.28], fov:39 }}
        style={{ background:'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        dpr={[1, 2]}
      >
        <StudioLights />
        <group position={[0,-0.03,0]}>
          <Suspense fallback={null}>
            <AvatarHead char={character} stateRef={stateRef} />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}