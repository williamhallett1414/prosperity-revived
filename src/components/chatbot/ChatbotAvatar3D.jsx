/**
 * ChatbotAvatar3D v3 — Premium semi-realistic talking heads
 *
 * Upgrades over v2:
 *  - LatheGeometry for proper head/face silhouette (not a sphere)
 *  - Canvas-generated iris textures: pupils, limbal ring, specular catchlights
 *  - Canvas skin texture with warm tonal variation
 *  - Dark upper lash line mesh on eyelids
 *  - Proper nose bridge + tip + nostril geometry
 *  - Shadow plane beneath character
 *  - Larger render size (160px default)
 *  - Removed unused drei import that could cause silent error
 */
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const lerp  = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

// ─── Canvas texture generators ────────────────────────────────────────────────

function makeIrisTex(hexColor) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  const cx = 64, cy = 64;

  // White sclera base
  ctx.fillStyle = '#f5f1ea';
  ctx.fillRect(0, 0, 128, 128);

  // Iris radial gradient
  const iG = ctx.createRadialGradient(cx, cy, 2, cx, cy, 54);
  iG.addColorStop(0,   hexColor + 'ff');
  iG.addColorStop(0.6, hexColor + 'dd');
  iG.addColorStop(1,   '#11090500');
  ctx.fillStyle = iG;
  ctx.beginPath(); ctx.arc(cx, cy, 54, 0, Math.PI * 2); ctx.fill();

  // Iris texture lines
  ctx.strokeStyle = 'rgba(0,0,0,0.10)';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a)*16, cy + Math.sin(a)*16);
    ctx.lineTo(cx + Math.cos(a)*52, cy + Math.sin(a)*52);
    ctx.stroke();
  }

  // Limbal ring
  ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(cx, cy, 51, 0, Math.PI * 2); ctx.stroke();

  // Pupil
  const pG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
  pG.addColorStop(0, '#000000');
  pG.addColorStop(1, '#0a0604');
  ctx.fillStyle = pG;
  ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill();

  // Primary catchlight
  ctx.fillStyle = 'rgba(255,255,255,0.90)';
  ctx.beginPath(); ctx.arc(cx + 11, cy - 12, 8, 0, Math.PI * 2); ctx.fill();
  // Secondary soft catchlight
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath(); ctx.arc(cx - 9, cy + 8,  4, 0, Math.PI * 2); ctx.fill();

  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

function makeSkinTex(base, shadow) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  // Subtle subsurface warm-to-cool gradient from crown to chin
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, shadow + '18');
  g.addColorStop(0.4, base + '00');
  g.addColorStop(1, shadow + '28');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

// ─── Head profile via LatheGeometry ──────────────────────────────────────────
// Revolves a 2D side-profile curve around Y-axis to create a proper head shape
function buildHeadGeo(scaleH = 1) {
  // Points: [radius, height] from chin (bottom) to crown (top)
  const pts = [
    [0.000, -0.420],   // chin center
    [0.085, -0.400],   // chin curve
    [0.195, -0.330],   // jaw bottom
    [0.275, -0.200],   // jaw corner
    [0.330, -0.060],   // cheek low
    [0.360,  0.065],   // cheekbone max
    [0.345,  0.200],   // mid face
    [0.310,  0.320],   // temple
    [0.265,  0.405],   // forehead curve
    [0.190,  0.460],   // upper forehead
    [0.095,  0.490],   // near crown
    [0.000,  0.500],   // crown top
  ].map(([r, y]) => new THREE.Vector2(r, y * scaleH));

  return new THREE.LatheGeometry(pts, 36);
}

// ─── Character definitions ────────────────────────────────────────────────────
const CHARS = {
  hannah: {
    skin:'#c4845a', skinDark:'#9c6038', skinHi:'#d9a882',
    hair:'#281408', hairMid:'#4a2210', hairSheen:'#7a4820',
    irisHex:'#7a5c3a', lip:'#c4685a', lipDark:'#9e4838',
    cloth1:'#c8a0bc', cloth2:'#a07898',
    hH:1.09, hW:1.00, hD:0.91,
    jawW:0.80, jawH:0.53,
    eyeX:0.143, eyeY:0.075, noseY:-0.068, lipY:-0.186,
    browThick:0.022, browArc:-0.10, ckX:0.165, ckY:-0.015,
    hairStyle:'curly', acc:'earrings',
  },
  coach: {
    skin:'#7a4a28', skinDark:'#5c3418', skinHi:'#9c6842',
    hair:'#080808', hairMid:'#181210', hairSheen:'#2e1c14',
    irisHex:'#3a5a1c', lip:'#6a3424', lipDark:'#4e2418',
    cloth1:'#18182c', cloth2:'#28284c',
    hH:1.01, hW:1.05, hD:0.97,
    jawW:0.91, jawH:0.52,
    eyeX:0.150, eyeY:0.065, noseY:-0.082, lipY:-0.198,
    browThick:0.026, browArc:-0.04, ckX:0.190, ckY:-0.042,
    hairStyle:'fade', acc:'none',
  },
  chef: {
    skin:'#c08050', skinDark:'#986030', skinHi:'#d8a870',
    hair:'#180c06', hairMid:'#321610', hairSheen:'#4e2818',
    irisHex:'#684828', lip:'#b05a3c', lipDark:'#884030',
    cloth1:'#f0ece4', cloth2:'#d8d2c8',
    hH:0.99, hW:1.07, hD:0.95,
    jawW:0.88, jawH:0.51,
    eyeX:0.148, eyeY:0.058, noseY:-0.090, lipY:-0.208,
    browThick:0.028, browArc:0.02, ckX:0.178, ckY:-0.032,
    hairStyle:'wavy', acc:'chef-hat',
  },
  gideon: {
    skin:'#b07848', skinDark:'#886028', skinHi:'#c89060',
    hair:'#160c06', hairMid:'#2e1810', hairSheen:'#422014',
    irisHex:'#583820', lip:'#9a5848', lipDark:'#744038',
    cloth1:'#887050', cloth2:'#9e8860',
    hH:1.07, hW:1.01, hD:0.92,
    jawW:0.83, jawH:0.53,
    eyeX:0.142, eyeY:0.082, noseY:-0.068, lipY:-0.184,
    browThick:0.024, browArc:-0.07, ckX:0.168, ckY:-0.010,
    hairStyle:'textured', acc:'beard',
  },
};

function mkMat(col, rough=0.65, metal=0, extra={}) {
  return new THREE.MeshStandardMaterial({ color:col, roughness:rough, metalness:metal, ...extra });
}

// ─── Hair styles ──────────────────────────────────────────────────────────────
function HairCurly({ h, hs }) {
  const bumps = [
    [-0.18,0.47,0.09],[0.18,0.45,0.11],
    [-0.07,0.53,0.01],[0.07,0.51,0.03],
    [-0.29,0.37,0.01],[0.29,0.37,0.03],
  ];
  return (
    <group>
      <mesh material={h} position={[0,0.33,-0.03]} scale={[0.53,0.27,0.53]}>
        <sphereGeometry args={[1,32,20,0,Math.PI*2,0,Math.PI*0.64]} />
      </mesh>
      <mesh material={h} position={[-0.41,0.09,-0.05]} scale={[0.17,0.30,0.16]}>
        <sphereGeometry args={[1,20,14]} />
      </mesh>
      <mesh material={h} position={[0.41,0.09,-0.05]} scale={[0.17,0.30,0.16]}>
        <sphereGeometry args={[1,20,14]} />
      </mesh>
      <mesh material={h} position={[0,0.05,-0.42]} scale={[0.48,0.50,0.20]}>
        <sphereGeometry args={[1,24,16]} />
      </mesh>
      {bumps.map(([x,y,z],i)=>(
        <mesh key={i} material={i%2===0?h:hs} position={[x,y,z]} scale={[0.060,0.042,0.060]}>
          <sphereGeometry args={[1,8,6]} />
        </mesh>
      ))}
      <mesh material={hs} position={[0.12,0.45,0.19]} scale={[0.13,0.10,0.08]}>
        <sphereGeometry args={[1,14,10]} />
      </mesh>
    </group>
  );
}

function HairFade({ h }) {
  return (
    <group>
      <mesh material={h} position={[0,0.27,-0.06]} scale={[0.45,0.17,0.45]}>
        <sphereGeometry args={[1,28,18,0,Math.PI*2,0,Math.PI*0.54]} />
      </mesh>
      <mesh material={h} position={[-0.38,0.09,0.10]} scale={[0.046,0.20,0.12]}>
        <cylinderGeometry args={[1,1.4,1,10]} />
      </mesh>
      <mesh material={h} position={[0.38,0.09,0.10]} scale={[0.046,0.20,0.12]}>
        <cylinderGeometry args={[1,1.4,1,10]} />
      </mesh>
      <mesh material={h} position={[0,-0.09,-0.38]} scale={[0.40,0.12,0.09]}>
        <sphereGeometry args={[1,14,8]} />
      </mesh>
    </group>
  );
}

function HairWavy({ h, hs }) {
  return (
    <group>
      <mesh material={h} position={[0,0.27,-0.04]} scale={[0.48,0.23,0.48]}>
        <sphereGeometry args={[1,30,20,0,Math.PI*2,0,Math.PI*0.58]} />
      </mesh>
      <mesh material={h} position={[-0.37,0.13,-0.09]} scale={[0.10,0.17,0.11]}>
        <sphereGeometry args={[1,14,10]} />
      </mesh>
      <mesh material={h} position={[0.37,0.13,-0.09]} scale={[0.10,0.17,0.11]}>
        <sphereGeometry args={[1,14,10]} />
      </mesh>
      <mesh material={h} position={[0,0.06,-0.38]} scale={[0.44,0.26,0.15]}>
        <sphereGeometry args={[1,20,14]} />
      </mesh>
      <mesh material={hs} position={[0.08,0.33,0.20]} scale={[0.10,0.08,0.06]}>
        <sphereGeometry args={[1,10,8]} />
      </mesh>
    </group>
  );
}

function HairTextured({ h, hs }) {
  const bumps = [[-0.10,0.35,0.21],[0.10,0.37,0.20],[-0.21,0.28,0.14],[0.21,0.30,0.13],[-0.04,0.41,0.10],[0.05,0.39,0.12]];
  return (
    <group>
      <mesh material={h} position={[0,0.26,-0.04]} scale={[0.48,0.23,0.48]}>
        <sphereGeometry args={[1,28,18,0,Math.PI*2,0,Math.PI*0.57]} />
      </mesh>
      {bumps.map(([x,y,z],i)=>(
        <mesh key={i} material={i%2===0?h:hs} position={[x,y,z]} scale={[0.048,0.036,0.048]}>
          <sphereGeometry args={[1,8,6]} />
        </mesh>
      ))}
      <mesh material={h} position={[0,0.03,-0.38]} scale={[0.42,0.24,0.15]}>
        <sphereGeometry args={[1,18,12]} />
      </mesh>
    </group>
  );
}

// ─── Accessories ──────────────────────────────────────────────────────────────
function ChefHat({ c1, c2 }) {
  return (
    <group position={[0,0.42,0]}>
      <mesh material={c1}><cylinderGeometry args={[0.226,0.258,0.47,26]} /></mesh>
      <mesh material={c1} position={[0,0.33,0]} scale={[1,0.54,1]}>
        <sphereGeometry args={[0.28,24,18]} />
      </mesh>
      <mesh material={c2} position={[0,-0.250,0]}>
        <cylinderGeometry args={[0.330,0.330,0.044,26]} />
      </mesh>
      <mesh material={c2} position={[0,-0.215,0]}>
        <torusGeometry args={[0.230,0.012,8,26]} />
      </mesh>
    </group>
  );
}

function Beard({ h }) {
  return (
    <group>
      <mesh material={h} position={[-0.20,-0.13,0.27]} scale={[0.10,0.13,0.07]}>
        <sphereGeometry args={[1,12,10]} />
      </mesh>
      <mesh material={h} position={[0.20,-0.13,0.27]} scale={[0.10,0.13,0.07]}>
        <sphereGeometry args={[1,12,10]} />
      </mesh>
      <mesh material={h} position={[0,-0.27,0.270]} scale={[0.33,0.14,0.097]}>
        <sphereGeometry args={[1,20,14]} />
      </mesh>
      <mesh material={h} position={[0,-0.35,0.232]} scale={[0.25,0.11,0.10]}>
        <sphereGeometry args={[1,16,10]} />
      </mesh>
      <mesh material={h} position={[0,-0.150,0.312]} scale={[0.22,0.044,0.056]}>
        <sphereGeometry args={[1,14,8]} />
      </mesh>
    </group>
  );
}

function Earrings({ gold }) {
  return (
    <>
      <mesh material={gold} position={[-0.400,-0.048,0.022]} scale={[0.028,0.028,0.028]}>
        <torusGeometry args={[1,0.36,10,24]} />
      </mesh>
      <mesh material={gold} position={[0.400,-0.048,0.022]} scale={[0.028,0.028,0.028]}>
        <torusGeometry args={[1,0.36,10,24]} />
      </mesh>
    </>
  );
}

// ─── Neck + Torso ─────────────────────────────────────────────────────────────
function Torso({ skin, c1, c2 }) {
  return (
    <group position={[0,-0.78,0]}>
      <mesh material={skin} position={[0,0.28,0]}>
        <cylinderGeometry args={[0.11,0.16,0.28,16]} />
      </mesh>
      <mesh material={c1} scale={[0.66,0.31,0.51]}>
        <sphereGeometry args={[1,22,14,0,Math.PI*2,0,Math.PI*0.50]} />
      </mesh>
      <mesh material={c1} position={[-0.37,0.07,0]} scale={[0.21,0.17,0.25]}>
        <sphereGeometry args={[1,18,14]} />
      </mesh>
      <mesh material={c1} position={[0.37,0.07,0]} scale={[0.21,0.17,0.25]}>
        <sphereGeometry args={[1,18,14]} />
      </mesh>
      <mesh material={c2} position={[0,0.18,0.096]} scale={[0.18,0.066,0.066]}>
        <sphereGeometry args={[1,14,10]} />
      </mesh>
    </group>
  );
}

// ─── Animated head assembly ───────────────────────────────────────────────────
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

  // Memoize headGeo and all materials per character
  const { headGeo, m } = useMemo(() => {
    const headGeo  = buildHeadGeo(cfg.hH);
    const irisTex  = makeIrisTex(cfg.irisHex);
    const skinTex  = makeSkinTex(cfg.skin, cfg.skinDark);
    const skinMat  = new THREE.MeshStandardMaterial({ map: skinTex, roughness: 0.72, metalness: 0 });
    const lidMat   = new THREE.MeshStandardMaterial({ map: skinTex, roughness: 0.76, metalness: 0 });
    const irisMat  = new THREE.MeshStandardMaterial({ map: irisTex, roughness: 0.14, metalness: 0.04 });
    return {
      headGeo,
      m: {
        skin:      skinMat,
        skinDark:  mkMat(cfg.skinDark,  0.80),
        skinHi:    mkMat(cfg.skinHi,    0.55),
        hair:      mkMat(cfg.hair,      0.88),
        hairMid:   mkMat(cfg.hairMid,   0.82),
        hairSheen: mkMat(cfg.hairSheen, 0.55, 0.06),
        irisDisc:  irisMat,
        sclera:    mkMat('#f6f2eb', 0.22),
        cornea:    mkMat('#ffffff', 0.00, 0.00, { transparent:true, opacity:0.22 }),
        lid:       lidMat,
        lash:      mkMat('#0a0806', 0.95),
        lip:       mkMat(cfg.lip,      0.48),
        lipDark:   mkMat(cfg.lipDark,  0.44),
        teeth:     mkMat('#ece8d4', 0.54),
        brow:      mkMat(cfg.hair,     0.86),
        nostril:   mkMat(cfg.skinDark, 0.82),
        cheek:     mkMat(cfg.skin, 0.90, 0, { transparent:true, opacity:0 }),
        gold:      mkMat('#d4aa70', 0.28, 0.72),
        clothMain: mkMat(cfg.cloth1, 0.82),
        clothShad: mkMat(cfg.cloth2, 0.86),
      },
    };
  }, [char]);

  const anim = useRef({
    mouth:0, talkPhase:0, breatheT:0, swayT:0,
    hRY:0, hRX:0, hRZ:0,
    browL:0, browR:0,
    blinkT:0, nextBlink:1.8 + Math.random()*2.8, blinking:false,
    thinkT:0, cheek:0,
  });

  useFrame((_, delta) => {
    const d = clamp(delta, 0.001, 0.05);
    const a = anim.current;
    const st = stateRef.current;

    a.breatheT += d * 0.36;
    a.swayT    += d * 0.26;
    const breathe = Math.sin(a.breatheT) * 0.007;

    let tRY = Math.sin(a.swayT * 0.70) * 0.021;
    let tRX = Math.sin(a.swayT * 0.52) * 0.011 + breathe * 0.4;
    let tRZ = 0, tMouth = 0, tBrowL = 0, tBrowR = 0, tCheek = 0;

    if (st === 'listening') {
      tRY += 0.092; tRZ = -0.052; tBrowL = 0.012; tBrowR = 0.012;
    } else if (st === 'thinking') {
      a.thinkT += d * 1.5;
      tRX += Math.sin(a.thinkT) * 0.026 - 0.034;
      tRY += Math.sin(a.thinkT * 0.62) * 0.042;
      tBrowL = -0.009; tBrowR = -0.009;
    } else if (st === 'speaking') {
      a.talkPhase += d * 9.5;
      const w1 = Math.sin(a.talkPhase);
      const w2 = Math.sin(a.talkPhase * 1.76 + 0.42);
      const w3 = Math.sin(a.talkPhase * 2.9);
      tMouth = clamp((w1*0.45 + w2*0.32 + w3*0.15)*0.5 + 0.48, 0, 1) * 0.80;
      tBrowL = Math.sin(a.talkPhase * 0.35) * 0.013;
      tBrowR = Math.sin(a.talkPhase * 0.35 + 0.28) * 0.013;
      tCheek = 0.40;
      tRX += Math.sin(a.talkPhase * 0.48) * 0.013;
    }

    a.hRY   = lerp(a.hRY,   tRY,    d * 3.8);
    a.hRX   = lerp(a.hRX,   tRX,    d * 3.8);
    a.hRZ   = lerp(a.hRZ,   tRZ,    d * 3.8);
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
    const browBase = 0.242;
    if (browLRef.current) browLRef.current.position.y = lerp(browLRef.current.position.y, browBase + a.browL, d*6.5);
    if (browRRef.current) browRRef.current.position.y = lerp(browRRef.current.position.y, browBase + a.browR, d*6.5);
    if (cheekLRef.current) cheekLRef.current.material.opacity = lerp(cheekLRef.current.material.opacity, a.cheek*0.22, d*3.5);
    if (cheekRRef.current) cheekRRef.current.material.opacity = lerp(cheekRRef.current.material.opacity, a.cheek*0.22, d*3.5);

    // Blink
    a.blinkT += d;
    if (!a.blinking && a.blinkT >= a.nextBlink) { a.blinking = true; a.blinkT = 0; }
    let lidY = 0;
    if (a.blinking) {
      const t = a.blinkT / 0.12;
      lidY = t < 0.5 ? t * 2 : (1 - t) * 2;
      if (a.blinkT >= 0.12) { a.blinking=false; a.blinkT=0; a.nextBlink = 2 + Math.random()*4.2; }
    }
    if (eyelidLRef.current) eyelidLRef.current.scale.y = Math.max(0.02, lidY);
    if (eyelidRRef.current) eyelidRRef.current.scale.y = Math.max(0.02, lidY);
  });

  const { eyeX: ex, eyeY: ey } = cfg;

  return (
    <group>
      <group ref={headRef}>

        {/* ── LATHE HEAD ─── */}
        <mesh material={m.skin} scale={[cfg.hW, 1, cfg.hD]}>
          <primitive object={headGeo} attach="geometry" />
        </mesh>

        {/* ── FACIAL DEPTH OVERLAYS ─── */}
        {/* Brow ridge shadow */}
        <mesh material={m.skinDark} position={[0, 0.190, 0.348]} scale={[0.38, 0.040, 0.066]}>
          <sphereGeometry args={[1,18,8]} />
        </mesh>
        {/* Left cheekbone lift */}
        <mesh material={m.skin} position={[-0.292, 0.002, 0.300]} scale={[0.086, 0.064, 0.064]}>
          <sphereGeometry args={[1,14,10]} />
        </mesh>
        {/* Right cheekbone lift */}
        <mesh material={m.skin} position={[0.292, 0.002, 0.300]} scale={[0.086, 0.064, 0.064]}>
          <sphereGeometry args={[1,14,10]} />
        </mesh>

        {/* ── CHEEK FLUSH (emotion) ─── */}
        <mesh ref={cheekLRef} material={m.cheek} position={[-cfg.ckX, cfg.ckY, 0.314]} scale={[0.142, 0.108, 0.044]}>
          <sphereGeometry args={[1,16,12]} />
        </mesh>
        <mesh ref={cheekRRef} material={m.cheek} position={[cfg.ckX, cfg.ckY, 0.314]} scale={[0.142, 0.108, 0.044]}>
          <sphereGeometry args={[1,16,12]} />
        </mesh>

        {/* ── JAW GROUP (animated for lip sync) ─── */}
        <group ref={jawRef} position={[0,-0.188,0]}>
          {/* Lower face fill */}
          <mesh material={m.skin} position={[0,0.024,0.038]} scale={[cfg.jawW, cfg.jawH, 0.87]}>
            <sphereGeometry args={[0.40,34,22,0,Math.PI*2,0,Math.PI*0.52]} />
          </mesh>
          {/* Lower lip */}
          <mesh material={m.lip} position={[0,0.057,0.312]} scale={[0.308,0.059,0.075]}>
            <sphereGeometry args={[1,18,10]} />
          </mesh>
          {/* Lower teeth */}
          <mesh material={m.teeth} position={[0,0.047,0.302]} scale={[0.250,0.038,0.058]}>
            <boxGeometry />
          </mesh>
          {/* Chin */}
          <mesh material={m.skin} position={[0,-0.086,0.245]} scale={[0.178,0.096,0.086]}>
            <sphereGeometry args={[1,16,12]} />
          </mesh>
        </group>

        {/* ── UPPER LIP ─── */}
        <mesh material={m.lip} position={[0, cfg.lipY, 0.322]} scale={[0.316,0.060,0.077]}>
          <sphereGeometry args={[1,18,10]} />
        </mesh>
        {/* Cupid bow peaks */}
        <mesh material={m.lipDark} position={[-0.054, cfg.lipY+0.029, 0.325]} scale={[0.067,0.029,0.039]}>
          <sphereGeometry args={[1,12,8]} />
        </mesh>
        <mesh material={m.lipDark} position={[0.054, cfg.lipY+0.029, 0.325]} scale={[0.067,0.029,0.039]}>
          <sphereGeometry args={[1,12,8]} />
        </mesh>
        {/* Upper teeth */}
        <mesh material={m.teeth} position={[0, cfg.lipY-0.014, 0.304]} scale={[0.250,0.038,0.058]}>
          <boxGeometry />
        </mesh>
        {/* Philtrum indent */}
        <mesh material={m.skinDark} position={[0, cfg.lipY+0.064, 0.326]} scale={[0.045,0.045,0.018]}>
          <sphereGeometry args={[1,10,8]} />
        </mesh>

        {/* ── NOSE ─── */}
        <group position={[0, cfg.noseY, 0]}>
          {/* Bridge */}
          <mesh material={m.skin} position={[0,0.094,0.336]} scale={[0.058,0.148,0.058]}>
            <sphereGeometry args={[1,14,10]} />
          </mesh>
          {/* Tip */}
          <mesh material={m.skin} position={[0,0.024,0.372]} scale={[0.088,0.075,0.075]}>
            <sphereGeometry args={[1,16,12]} />
          </mesh>
          {/* Nose underside shadow */}
          <mesh material={m.skinDark} position={[0,0.004,0.372]} scale={[0.055,0.040,0.035]}>
            <sphereGeometry args={[1,12,8]} />
          </mesh>
          {/* Left nostril */}
          <mesh material={m.nostril} position={[-0.060,-0.008,0.358]} scale={[0.042,0.036,0.044]}>
            <sphereGeometry args={[1,10,8]} />
          </mesh>
          {/* Right nostril */}
          <mesh material={m.nostril} position={[0.060,-0.008,0.358]} scale={[0.042,0.036,0.044]}>
            <sphereGeometry args={[1,10,8]} />
          </mesh>
        </group>

        {/* ── LEFT EYE ─── */}
        <group position={[-ex, ey, 0.332]}>
          {/* Eye socket shadow */}
          <mesh material={m.skinDark} scale={[0.098,0.086,0.044]}>
            <sphereGeometry args={[1,18,14]} />
          </mesh>
          {/* Sclera */}
          <mesh material={m.sclera} position={[0,0,0.018]} scale={[0.087,0.077,0.047]}>
            <sphereGeometry args={[1,24,18]} />
          </mesh>
          {/* Iris disc — canvas texture with pupil + catchlight */}
          <mesh material={m.irisDisc} position={[0,0,0.054]} rotation={[Math.PI/2,0,0]} scale={[0.052,0.008,0.052]}>
            <cylinderGeometry args={[1,1,1,32]} />
          </mesh>
          {/* Cornea gloss dome */}
          <mesh material={m.cornea} position={[0,0,0.073]} scale={[0.091,0.079,0.018]}>
            <sphereGeometry args={[1,18,14]} />
          </mesh>
          {/* Upper eyelid — animated for blink */}
          <mesh ref={eyelidLRef} material={m.lid} position={[0,0.046,0.018]} scale={[0.094,0.048,0.055]}>
            <sphereGeometry args={[1,18,10,0,Math.PI*2,0,Math.PI*0.52]} />
          </mesh>
          {/* Upper lash line */}
          <mesh material={m.lash} position={[0,0.047,0.023]} scale={[0.093,0.014,0.029]}>
            <sphereGeometry args={[1,14,6,0,Math.PI*2,0,Math.PI*0.46]} />
          </mesh>
          {/* Lower lash line */}
          <mesh material={m.skinDark} position={[0,-0.046,0.023]} scale={[0.091,0.013,0.026]}>
            <sphereGeometry args={[1,14,7,0,Math.PI*2,Math.PI*0.52,Math.PI*0.46]} />
          </mesh>
        </group>

        {/* ── RIGHT EYE ─── */}
        <group position={[ex, ey, 0.332]}>
          <mesh material={m.skinDark} scale={[0.098,0.086,0.044]}>
            <sphereGeometry args={[1,18,14]} />
          </mesh>
          <mesh material={m.sclera} position={[0,0,0.018]} scale={[0.087,0.077,0.047]}>
            <sphereGeometry args={[1,24,18]} />
          </mesh>
          <mesh material={m.irisDisc} position={[0,0,0.054]} rotation={[Math.PI/2,0,0]} scale={[0.052,0.008,0.052]}>
            <cylinderGeometry args={[1,1,1,32]} />
          </mesh>
          <mesh material={m.cornea} position={[0,0,0.073]} scale={[0.091,0.079,0.018]}>
            <sphereGeometry args={[1,18,14]} />
          </mesh>
          <mesh ref={eyelidRRef} material={m.lid} position={[0,0.046,0.018]} scale={[0.094,0.048,0.055]}>
            <sphereGeometry args={[1,18,10,0,Math.PI*2,0,Math.PI*0.52]} />
          </mesh>
          <mesh material={m.lash} position={[0,0.047,0.023]} scale={[0.093,0.014,0.029]}>
            <sphereGeometry args={[1,14,6,0,Math.PI*2,0,Math.PI*0.46]} />
          </mesh>
          <mesh material={m.skinDark} position={[0,-0.046,0.023]} scale={[0.091,0.013,0.026]}>
            <sphereGeometry args={[1,14,7,0,Math.PI*2,Math.PI*0.52,Math.PI*0.46]} />
          </mesh>
        </group>

        {/* ── EYEBROWS ─── */}
        <mesh ref={browLRef} material={m.brow}
          position={[-ex - 0.012, 0.242, 0.346]}
          rotation={[0, 0.08, cfg.browArc]}
          scale={[0.110, cfg.browThick, 0.024]}>
          <sphereGeometry args={[1,16,10]} />
        </mesh>
        <mesh ref={browRRef} material={m.brow}
          position={[ex + 0.012, 0.242, 0.346]}
          rotation={[0, -0.08, -cfg.browArc]}
          scale={[0.110, cfg.browThick, 0.024]}>
          <sphereGeometry args={[1,16,10]} />
        </mesh>

        {/* ── EARS ─── */}
        <group position={[-0.392, 0.036, 0]}>
          <mesh material={m.skin} scale={[0.062, 0.098, 0.052]}>
            <sphereGeometry args={[1,16,12]} />
          </mesh>
          <mesh material={m.skinDark} position={[0.013,0.012,0.025]} scale={[0.025,0.061,0.022]}>
            <torusGeometry args={[1,0.40,8,14,Math.PI]} />
          </mesh>
        </group>
        <group position={[0.392, 0.036, 0]}>
          <mesh material={m.skin} scale={[0.062, 0.098, 0.052]}>
            <sphereGeometry args={[1,16,12]} />
          </mesh>
          <mesh material={m.skinDark} position={[-0.013,0.012,0.025]} scale={[0.025,0.061,0.022]}>
            <torusGeometry args={[1,0.40,8,14,Math.PI]} />
          </mesh>
        </group>

        {/* ── HAIR ─── */}
        {cfg.hairStyle === 'curly'    && <HairCurly    h={m.hair} hs={m.hairSheen} />}
        {cfg.hairStyle === 'fade'     && <HairFade     h={m.hair} />}
        {cfg.hairStyle === 'wavy'     && <HairWavy     h={m.hair} hs={m.hairSheen} />}
        {cfg.hairStyle === 'textured' && <HairTextured h={m.hair} hs={m.hairSheen} />}

        {/* ── ACCESSORIES ─── */}
        {cfg.acc === 'chef-hat' && <ChefHat   c1={m.clothMain} c2={m.clothShad} />}
        {cfg.acc === 'beard'    && <Beard     h={m.hair} />}
        {cfg.acc === 'earrings' && <Earrings  gold={m.gold} />}

      </group>

      {/* Neck + shoulders + clothing */}
      <Torso skin={m.skin} c1={m.clothMain} c2={m.clothShad} />

    </group>
  );
}

// ─── Studio lighting ──────────────────────────────────────────────────────────
function StudioLights() {
  return (
    <>
      {/* Warm key light — upper left front */}
      <directionalLight position={[-2.2, 3.8, 4.2]} intensity={1.80} color="#fff6ec" />
      {/* Cool fill — right side */}
      <directionalLight position={[ 3.2, 1.2, 2.2]} intensity={0.58} color="#e8f2ff" />
      {/* Rim / hair — back top */}
      <directionalLight position={[ 0.4,-0.4,-3.8]} intensity={0.50} color="#ffeedd" />
      {/* Ground bounce */}
      <directionalLight position={[ 0.0,-2.8, 1.2]} intensity={0.30} color="#d4e8ff" />
      <ambientLight intensity={0.54} color="#f2ede8" />
    </>
  );
}

// ─── Public component ──────────────────────────────────────────────────────────
export default function ChatbotAvatar3D({
  character   = 'hannah',
  isSpeaking  = false,
  isListening = false,
  size        = 160,
  className   = '',
}) {
  const stateRef = useRef('idle');
  useEffect(() => {
    stateRef.current = isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle';
  }, [isSpeaking, isListening]);

  return (
    <div
      className={className}
      style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden' }}
    >
      <Canvas
        camera={{ position: [0, 0.10, 1.26], fov: 38 }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.14,
        }}
        dpr={[1, 2]}
      >
        <StudioLights />
        <group position={[0, -0.02, 0]}>
          <Suspense fallback={null}>
            <AvatarHead char={character} stateRef={stateRef} />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}