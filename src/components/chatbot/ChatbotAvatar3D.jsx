/**
 * ChatbotAvatar3D v4 — Full half-body semi-realistic avatars
 *
 * Major upgrades over v3:
 *  - Full half-body: head + neck + torso + arms + hands (waist-up framing)
 *  - Environment HDR lighting from @react-three/drei (studio preset)
 *  - ContactShadows for realistic ground shadow
 *  - Character-specific clothing: sweater / athletic shirt / chef coat / cardigan
 *  - Arms with elbows, forearms, and stylized hands
 *  - Idle arm swing animation when speaking
 *  - Wider camera for half-body framing
 *  - Canvas no longer clipped circular — full rectangular card
 */
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const lerp  = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

// ─── Canvas texture generators ────────────────────────────────────────────────
function makeIrisTex(hexColor) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  const cx = 64, cy = 64;
  ctx.fillStyle = '#f5f1ea';
  ctx.fillRect(0, 0, 128, 128);
  const iG = ctx.createRadialGradient(cx, cy, 2, cx, cy, 54);
  iG.addColorStop(0,   hexColor + 'ff');
  iG.addColorStop(0.6, hexColor + 'dd');
  iG.addColorStop(1,   '#11090500');
  ctx.fillStyle = iG;
  ctx.beginPath(); ctx.arc(cx, cy, 54, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.10)'; ctx.lineWidth = 0.8;
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a)*16, cy + Math.sin(a)*16);
    ctx.lineTo(cx + Math.cos(a)*52, cy + Math.sin(a)*52);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(cx, cy, 51, 0, Math.PI * 2); ctx.stroke();
  const pG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
  pG.addColorStop(0, '#000000'); pG.addColorStop(1, '#0a0604');
  ctx.fillStyle = pG;
  ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.90)';
  ctx.beginPath(); ctx.arc(cx+11, cy-12, 8, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath(); ctx.arc(cx-9,  cy+8,  4, 0, Math.PI*2); ctx.fill();
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
}

function makeSkinTex(base, shadow) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, shadow + '18'); g.addColorStop(0.4, base + '00'); g.addColorStop(1, shadow + '28');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
}

// ─── Head profile via LatheGeometry ──────────────────────────────────────────
function buildHeadGeo(scaleH = 1) {
  const pts = [
    [0.000, -0.420], [0.085, -0.400], [0.195, -0.330],
    [0.275, -0.200], [0.330, -0.060], [0.360,  0.065],
    [0.345,  0.200], [0.310,  0.320], [0.265,  0.405],
    [0.190,  0.460], [0.095,  0.490], [0.000,  0.500],
  ].map(([r, y]) => new THREE.Vector2(r, y * scaleH));
  return new THREE.LatheGeometry(pts, 36);
}

// ─── Character definitions ────────────────────────────────────────────────────
const CHARS = {
  hannah: {
    label: 'Hannah',
    skin:'#c4845a', skinDark:'#9c6038', skinHi:'#d9a882',
    hair:'#281408', hairMid:'#4a2210', hairSheen:'#7a4820',
    irisHex:'#7a5c3a', lip:'#c4685a', lipDark:'#9e4838',
    // Cozy dusty-rose knit sweater
    cloth1:'#c8a0bc', cloth2:'#a07898', cloth3:'#d4b8cc',
    bodyScale:[0.88, 1.0, 0.80],  // slender feminine build
    shoulderW: 0.32, chestD: 0.22,
    hH:1.09, hW:1.00, hD:0.91, jawW:0.80, jawH:0.53,
    eyeX:0.143, eyeY:0.075, noseY:-0.068, lipY:-0.186,
    browThick:0.022, browArc:-0.10, ckX:0.165, ckY:-0.015,
    armLen:0.52, forearmLen:0.44, handSize:0.090,
    armAngleX: 0.18, armAngleZ: 0.28,
    hairStyle:'curly', acc:'earrings', clothStyle:'sweater',
  },
  coach: {
    label: 'Coach David',
    skin:'#7a4a28', skinDark:'#5c3418', skinHi:'#9c6842',
    hair:'#080808', hairMid:'#181210', hairSheen:'#2e1c14',
    irisHex:'#3C4E53', lip:'#6a3424', lipDark:'#4e2418',
    // Dark performance athletic shirt
    cloth1:'#18182c', cloth2:'#28284c', cloth3:'#0e0e1e',
    bodyScale:[1.10, 1.0, 0.96],  // broad athletic build
    shoulderW: 0.42, chestD: 0.28,
    hH:1.01, hW:1.05, hD:0.97, jawW:0.91, jawH:0.52,
    eyeX:0.150, eyeY:0.065, noseY:-0.082, lipY:-0.198,
    browThick:0.026, browArc:-0.04, ckX:0.190, ckY:-0.042,
    armLen:0.56, forearmLen:0.46, handSize:0.105,
    armAngleX: 0.12, armAngleZ: 0.32,
    hairStyle:'fade', acc:'none', clothStyle:'athletic',
  },
  chef: {
    label: 'Chef Daniel',
    skin:'#c08050', skinDark:'#986030', skinHi:'#d8a870',
    hair:'#180c06', hairMid:'#321610', hairSheen:'#4e2818',
    irisHex:'#684828', lip:'#b05a3c', lipDark:'#884030',
    // White double-breasted chef coat
    cloth1:'#f0ece4', cloth2:'#d8d2c8', cloth3:'#e8e2d8',
    bodyScale:[1.02, 1.0, 0.92],  // stocky but healthy build
    shoulderW: 0.38, chestD: 0.26,
    hH:0.99, hW:1.07, hD:0.95, jawW:0.88, jawH:0.51,
    eyeX:0.148, eyeY:0.058, noseY:-0.090, lipY:-0.208,
    browThick:0.028, browArc:0.02, ckX:0.178, ckY:-0.032,
    armLen:0.50, forearmLen:0.42, handSize:0.098,
    armAngleX: 0.14, armAngleZ: 0.25,
    hairStyle:'wavy', acc:'chef-hat', clothStyle:'chefcoat',
  },
  gideon: {
    label: 'Gideon',
    skin:'#b07848', skinDark:'#886028', skinHi:'#c89060',
    hair:'#160c06', hairMid:'#2e1810', hairSheen:'#422014',
    irisHex:'#583820', lip:'#9a5848', lipDark:'#744038',
    // Earth-tone cardigan over linen shirt
    cloth1:'#887050', cloth2:'#9e8860', cloth3:'#c8b890',
    bodyScale:[0.96, 1.0, 0.88],  // athletic but lean, mid-40s
    shoulderW: 0.36, chestD: 0.24,
    hH:1.07, hW:1.01, hD:0.92, jawW:0.83, jawH:0.53,
    eyeX:0.142, eyeY:0.082, noseY:-0.068, lipY:-0.184,
    browThick:0.024, browArc:-0.07, ckX:0.168, ckY:-0.010,
    armLen:0.54, forearmLen:0.45, handSize:0.096,
    armAngleX: 0.16, armAngleZ: 0.30,
    hairStyle:'textured', acc:'beard', clothStyle:'cardigan',
  },
};

function mkMat(col, rough=0.65, metal=0, extra={}) {
  return new THREE.MeshStandardMaterial({ color:col, roughness:rough, metalness:metal, ...extra });
}

// ─── Hair styles ──────────────────────────────────────────────────────────────
function HairCurly({ h, hs }) {
  const bumps = [[-0.18,0.47,0.09],[0.18,0.45,0.11],[-0.07,0.53,0.01],[0.07,0.51,0.03],[-0.29,0.37,0.01],[0.29,0.37,0.03]];
  return (
    <group>
      <mesh material={h} position={[0,0.33,-0.03]} scale={[0.53,0.27,0.53]}>
        <sphereGeometry args={[1,32,20,0,Math.PI*2,0,Math.PI*0.64]} />
      </mesh>
      <mesh material={h} position={[-0.41,0.09,-0.05]} scale={[0.17,0.30,0.16]}><sphereGeometry args={[1,20,14]} /></mesh>
      <mesh material={h} position={[ 0.41,0.09,-0.05]} scale={[0.17,0.30,0.16]}><sphereGeometry args={[1,20,14]} /></mesh>
      <mesh material={h} position={[0,0.05,-0.42]} scale={[0.48,0.50,0.20]}><sphereGeometry args={[1,24,16]} /></mesh>
      {bumps.map(([x,y,z],i)=>(
        <mesh key={i} material={i%2===0?h:hs} position={[x,y,z]} scale={[0.060,0.042,0.060]}><sphereGeometry args={[1,8,6]} /></mesh>
      ))}
      <mesh material={hs} position={[0.12,0.45,0.19]} scale={[0.13,0.10,0.08]}><sphereGeometry args={[1,14,10]} /></mesh>
    </group>
  );
}

function HairFade({ h }) {
  return (
    <group>
      <mesh material={h} position={[0,0.27,-0.06]} scale={[0.45,0.17,0.45]}><sphereGeometry args={[1,28,18,0,Math.PI*2,0,Math.PI*0.54]} /></mesh>
      <mesh material={h} position={[-0.38,0.09,0.10]} scale={[0.046,0.20,0.12]}><cylinderGeometry args={[1,1.4,1,10]} /></mesh>
      <mesh material={h} position={[ 0.38,0.09,0.10]} scale={[0.046,0.20,0.12]}><cylinderGeometry args={[1,1.4,1,10]} /></mesh>
      <mesh material={h} position={[0,-0.09,-0.38]} scale={[0.40,0.12,0.09]}><sphereGeometry args={[1,14,8]} /></mesh>
    </group>
  );
}

function HairWavy({ h, hs }) {
  return (
    <group>
      <mesh material={h} position={[0,0.27,-0.04]} scale={[0.48,0.23,0.48]}><sphereGeometry args={[1,30,20,0,Math.PI*2,0,Math.PI*0.58]} /></mesh>
      <mesh material={h} position={[-0.37,0.13,-0.09]} scale={[0.10,0.17,0.11]}><sphereGeometry args={[1,14,10]} /></mesh>
      <mesh material={h} position={[ 0.37,0.13,-0.09]} scale={[0.10,0.17,0.11]}><sphereGeometry args={[1,14,10]} /></mesh>
      <mesh material={h} position={[0,0.06,-0.38]} scale={[0.44,0.26,0.15]}><sphereGeometry args={[1,20,14]} /></mesh>
      <mesh material={hs} position={[0.08,0.33,0.20]} scale={[0.10,0.08,0.06]}><sphereGeometry args={[1,10,8]} /></mesh>
    </group>
  );
}

function HairTextured({ h, hs }) {
  const bumps = [[-0.10,0.35,0.21],[0.10,0.37,0.20],[-0.21,0.28,0.14],[0.21,0.30,0.13],[-0.04,0.41,0.10],[0.05,0.39,0.12]];
  return (
    <group>
      <mesh material={h} position={[0,0.26,-0.04]} scale={[0.48,0.23,0.48]}><sphereGeometry args={[1,28,18,0,Math.PI*2,0,Math.PI*0.57]} /></mesh>
      {bumps.map(([x,y,z],i)=>(
        <mesh key={i} material={i%2===0?h:hs} position={[x,y,z]} scale={[0.048,0.036,0.048]}><sphereGeometry args={[1,8,6]} /></mesh>
      ))}
      <mesh material={h} position={[0,0.03,-0.38]} scale={[0.42,0.24,0.15]}><sphereGeometry args={[1,18,12]} /></mesh>
    </group>
  );
}

// ─── Accessories ──────────────────────────────────────────────────────────────
function ChefHat({ c1, c2 }) {
  return (
    <group position={[0,0.42,0]}>
      <mesh material={c1}><cylinderGeometry args={[0.226,0.258,0.47,26]} /></mesh>
      <mesh material={c1} position={[0,0.33,0]} scale={[1,0.54,1]}><sphereGeometry args={[0.28,24,18]} /></mesh>
      <mesh material={c2} position={[0,-0.250,0]}><cylinderGeometry args={[0.330,0.330,0.044,26]} /></mesh>
      <mesh material={c2} position={[0,-0.215,0]}><torusGeometry args={[0.230,0.012,8,26]} /></mesh>
    </group>
  );
}
function Beard({ h }) {
  return (
    <group>
      <mesh material={h} position={[-0.20,-0.13,0.27]} scale={[0.10,0.13,0.07]}><sphereGeometry args={[1,12,10]} /></mesh>
      <mesh material={h} position={[ 0.20,-0.13,0.27]} scale={[0.10,0.13,0.07]}><sphereGeometry args={[1,12,10]} /></mesh>
      <mesh material={h} position={[0,-0.27,0.270]} scale={[0.33,0.14,0.097]}><sphereGeometry args={[1,20,14]} /></mesh>
      <mesh material={h} position={[0,-0.35,0.232]} scale={[0.25,0.11,0.10]}><sphereGeometry args={[1,16,10]} /></mesh>
      <mesh material={h} position={[0,-0.150,0.312]} scale={[0.22,0.044,0.056]}><sphereGeometry args={[1,14,8]} /></mesh>
    </group>
  );
}
function Earrings({ gold }) {
  return (
    <>
      <mesh material={gold} position={[-0.400,-0.048,0.022]} scale={[0.028,0.028,0.028]}><torusGeometry args={[1,0.36,10,24]} /></mesh>
      <mesh material={gold} position={[ 0.400,-0.048,0.022]} scale={[0.028,0.028,0.028]}><torusGeometry args={[1,0.36,10,24]} /></mesh>
    </>
  );
}

// ─── Clothing styles ──────────────────────────────────────────────────────────

// Cozy knit sweater (Hannah)
function Sweater({ skin, c1, c2, c3, sw, cd }) {
  return (
    <group position={[0,-0.78,0]}>
      {/* Neck */}
      <mesh material={skin} position={[0,0.28,0]}><cylinderGeometry args={[0.11,0.16,0.28,16]} /></mesh>
      {/* Ribbed turtleneck collar */}
      <mesh material={c1} position={[0,0.20,0]}><cylinderGeometry args={[0.155,0.175,0.18,20]} /></mesh>
      <mesh material={c3} position={[0,0.205,0]}><torusGeometry args={[0.166,0.010,8,20]} /></mesh>
      <mesh material={c3} position={[0,0.155,0]}><torusGeometry args={[0.166,0.010,8,20]} /></mesh>
      {/* Upper torso / chest */}
      <mesh material={c1} position={[0,0,0]} scale={[sw*1.05,0.36,cd*1.05]}>
        <sphereGeometry args={[1,24,16,0,Math.PI*2,0,Math.PI*0.55]} />
      </mesh>
      {/* Mid torso */}
      <mesh material={c1} position={[0,-0.30,0]} scale={[sw*0.92,0.28,cd*0.90]}>
        <cylinderGeometry args={[1,0.95,1,20]} />
      </mesh>
      {/* Ribbed hem */}
      <mesh material={c2} position={[0,-0.50,0]} scale={[sw*0.90,0.10,cd*0.88]}>
        <cylinderGeometry args={[1,1,1,20]} />
      </mesh>
      {/* Left shoulder */}
      <mesh material={c1} position={[-sw*0.96,0.08,0]} scale={[0.22,0.16,0.22]}><sphereGeometry args={[1,18,14]} /></mesh>
      {/* Right shoulder */}
      <mesh material={c1} position={[ sw*0.96,0.08,0]} scale={[0.22,0.16,0.22]}><sphereGeometry args={[1,18,14]} /></mesh>
    </group>
  );
}

// Dark fitted athletic shirt (Coach)
function AthleticShirt({ skin, c1, c2, c3, sw, cd }) {
  return (
    <group position={[0,-0.78,0]}>
      <mesh material={skin} position={[0,0.28,0]}><cylinderGeometry args={[0.12,0.17,0.26,16]} /></mesh>
      {/* Chest — wide shoulders */}
      <mesh material={c1} position={[0,0.02,0]} scale={[sw*1.15,0.38,cd*1.12]}>
        <sphereGeometry args={[1,26,18,0,Math.PI*2,0,Math.PI*0.54]} />
      </mesh>
      {/* Chest definition crease */}
      <mesh material={c2} position={[0,0.05,cd*0.90]} scale={[0.04,0.22,0.04]}><sphereGeometry args={[1,8,6]} /></mesh>
      {/* Mid torso */}
      <mesh material={c1} position={[0,-0.30,0]} scale={[sw*1.00,0.30,cd*0.98]}>
        <cylinderGeometry args={[1,0.92,1,20]} />
      </mesh>
      {/* Shirt hem */}
      <mesh material={c2} position={[0,-0.52,0]} scale={[sw*0.96,0.09,cd*0.94]}>
        <cylinderGeometry args={[1,1,1,20]} />
      </mesh>
      {/* Left shoulder (broader) */}
      <mesh material={c1} position={[-sw*1.10,0.10,0]} scale={[0.26,0.18,0.24]}><sphereGeometry args={[1,18,14]} /></mesh>
      <mesh material={c1} position={[ sw*1.10,0.10,0]} scale={[0.26,0.18,0.24]}><sphereGeometry args={[1,18,14]} /></mesh>
      {/* Collar V-neck */}
      <mesh material={c2} position={[0,0.18,cd*0.78]} scale={[0.10,0.12,0.04]}><sphereGeometry args={[1,10,8]} /></mesh>
    </group>
  );
}

// Double-breasted white chef coat (Chef Daniel)
function ChefCoat({ skin, c1, c2, c3, sw, cd }) {
  return (
    <group position={[0,-0.78,0]}>
      <mesh material={skin} position={[0,0.28,0]}><cylinderGeometry args={[0.115,0.162,0.27,16]} /></mesh>
      {/* Coat body */}
      <mesh material={c1} position={[0,0.01,0]} scale={[sw*1.10,0.40,cd*1.08]}>
        <sphereGeometry args={[1,24,16,0,Math.PI*2,0,Math.PI*0.55]} />
      </mesh>
      <mesh material={c1} position={[0,-0.32,0]} scale={[sw*1.04,0.32,cd*1.02]}>
        <cylinderGeometry args={[1,0.98,1,20]} />
      </mesh>
      {/* Double-breasted buttons — left column */}
      {[-0.08,0.02,0.12].map((y,i)=>(
        <mesh key={i} material={c2} position={[-0.09,y,cd*0.92]} scale={[0.018,0.018,0.018]}>
          <sphereGeometry args={[1,8,6]} />
        </mesh>
      ))}
      {/* Double-breasted buttons — right column */}
      {[-0.08,0.02,0.12].map((y,i)=>(
        <mesh key={i} material={c2} position={[0.09,y,cd*0.92]} scale={[0.018,0.018,0.018]}>
          <sphereGeometry args={[1,8,6]} />
        </mesh>
      ))}
      {/* Coat collar left */}
      <mesh material={c1} position={[-0.08,0.22,cd*0.72]} rotation={[0.1,0.3,-0.2]} scale={[0.10,0.16,0.06]}>
        <sphereGeometry args={[1,10,8]} />
      </mesh>
      {/* Coat collar right */}
      <mesh material={c1} position={[0.08,0.22,cd*0.72]} rotation={[0.1,-0.3,0.2]} scale={[0.10,0.16,0.06]}>
        <sphereGeometry args={[1,10,8]} />
      </mesh>
      {/* Shoulders */}
      <mesh material={c1} position={[-sw*1.02,0.08,0]} scale={[0.23,0.17,0.22]}><sphereGeometry args={[1,18,14]} /></mesh>
      <mesh material={c1} position={[ sw*1.02,0.08,0]} scale={[0.23,0.17,0.22]}><sphereGeometry args={[1,18,14]} /></mesh>
    </group>
  );
}

// Earth-tone cardigan + linen shirt (Gideon)
function Cardigan({ skin, c1, c2, c3, sw, cd }) {
  return (
    <group position={[0,-0.78,0]}>
      <mesh material={skin} position={[0,0.28,0]}><cylinderGeometry args={[0.112,0.158,0.27,16]} /></mesh>
      {/* Inner linen shirt (lighter) */}
      <mesh material={c3} position={[0,0.08,cd*0.88]} scale={[0.12,0.30,0.08]}><sphereGeometry args={[1,12,8]} /></mesh>
      {/* Cardigan body */}
      <mesh material={c1} position={[0,0.01,0]} scale={[sw*1.08,0.40,cd*1.06]}>
        <sphereGeometry args={[1,24,16,0,Math.PI*2,0,Math.PI*0.55]} />
      </mesh>
      <mesh material={c1} position={[0,-0.32,0]} scale={[sw*1.00,0.30,cd*0.98]}>
        <cylinderGeometry args={[1,0.96,1,20]} />
      </mesh>
      {/* Open cardigan front gap */}
      <mesh material={c3} position={[0,-0.05,cd*0.94]} scale={[0.08,0.38,0.04]}><sphereGeometry args={[1,10,8]} /></mesh>
      {/* Cardigan buttons */}
      {[0.08,0.00,-0.10,-0.22].map((y,i)=>(
        <mesh key={i} material={c2} position={[0.02,y,cd*0.95]} scale={[0.014,0.014,0.014]}>
          <sphereGeometry args={[1,8,6]} />
        </mesh>
      ))}
      {/* V-neck shawl collar left */}
      <mesh material={c1} position={[-0.10,0.20,cd*0.75]} rotation={[0.1,0.25,-0.15]} scale={[0.12,0.20,0.07]}>
        <sphereGeometry args={[1,10,8]} />
      </mesh>
      {/* V-neck shawl collar right */}
      <mesh material={c1} position={[0.10,0.20,cd*0.75]} rotation={[0.1,-0.25,0.15]} scale={[0.12,0.20,0.07]}>
        <sphereGeometry args={[1,10,8]} />
      </mesh>
      {/* Shoulders */}
      <mesh material={c1} position={[-sw*1.00,0.08,0]} scale={[0.21,0.16,0.21]}><sphereGeometry args={[1,18,14]} /></mesh>
      <mesh material={c1} position={[ sw*1.00,0.08,0]} scale={[0.21,0.16,0.21]}><sphereGeometry args={[1,18,14]} /></mesh>
    </group>
  );
}

// ─── Imperative mesh helpers ──────────────────────────────────────────────────
function ImpMesh({ geo, material, position, rotation, scale, meshRef: externalRef }) {
  const internalRef = useRef();
  const meshRef = externalRef || internalRef;
  useEffect(() => {
    if (meshRef.current) meshRef.current.geometry = geo;
  }, [geo]);
  return <mesh ref={meshRef} material={material} position={position} rotation={rotation} scale={scale} />;
}

// ─── Arm assembly (upper arm + elbow + forearm + wrist + hand) ────────────────
function Arm({ side, skin, sleeve, cfg, armSwingRef }) {
  const s = side === 'L' ? -1 : 1;
  const sw = cfg.shoulderW;
  const aX = cfg.armAngleX;
  const aZ = cfg.armAngleZ * s;
  const aL = cfg.armLen;
  const fL = cfg.forearmLen;
  const hs = cfg.handSize;

  const geos = useMemo(() => ({
    upperArm:   new THREE.CylinderGeometry(0.9, 1, 1, 14),
    elbow:      new THREE.SphereGeometry(1, 14, 10),
    forearm:    new THREE.CylinderGeometry(0.85, 1, 1, 12),
    wrist:      new THREE.SphereGeometry(1, 12, 10),
    palm:       new THREE.SphereGeometry(1, 14, 10),
    finger:     new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
  }), []);

  return (
    <group
      ref={armSwingRef}
      position={[s * sw * 0.94, -0.78, 0]}
      rotation={[aX, 0, aZ]}
    >
      {/* Upper arm */}
      <ImpMesh geo={geos.upperArm} material={sleeve} position={[0,-aL*0.28,0]} scale={[0.115,aL*0.55,0.105]} />
      {/* Elbow */}
      <ImpMesh geo={geos.elbow} material={skin} position={[0,-aL*0.56,0]} scale={[0.095,0.095,0.095]} />
      {/* Forearm */}
      <group position={[0,-aL*0.56,0]} rotation={[0.15, 0, 0]}>
        <ImpMesh geo={geos.forearm} material={skin} position={[0,-fL*0.28,0]} scale={[0.088,fL*0.52,0.080]} />
        {/* Wrist */}
        <ImpMesh geo={geos.wrist} material={skin} position={[0,-fL*0.56,0]} scale={[0.076,0.076,0.064]} />
        {/* Hand (palm) */}
        <group position={[0,-fL*0.56-hs*0.55,0]} rotation={[0.1,0,0]}>
          <ImpMesh geo={geos.palm} material={skin} scale={[hs*1.05, hs*0.72, hs*0.55]} />
          {/* Thumb */}
          <ImpMesh geo={geos.finger} material={skin} position={[s*hs*0.80,-hs*0.10,hs*0.20]} rotation={[0.1,0,s*0.6]} scale={[hs*0.30,hs*0.48,hs*0.26]} />
          {/* Index finger */}
          <ImpMesh geo={geos.finger} material={skin} position={[s*hs*0.30,-hs*0.80,hs*0.10]} rotation={[0.18,0,s*0.04]} scale={[hs*0.21,hs*0.56,hs*0.20]} />
          {/* Middle finger */}
          <ImpMesh geo={geos.finger} material={skin} position={[s*hs*0.08,-hs*0.90,hs*0.06]} rotation={[0.12,0,0]} scale={[hs*0.21,hs*0.60,hs*0.20]} />
          {/* Ring finger */}
          <ImpMesh geo={geos.finger} material={skin} position={[-s*hs*0.14,-hs*0.86,hs*0.04]} rotation={[0.14,0,-s*0.04]} scale={[hs*0.20,hs*0.56,hs*0.19]} />
          {/* Pinky */}
          <ImpMesh geo={geos.finger} material={skin} position={[-s*hs*0.36,-hs*0.72,hs*0.02]} rotation={[0.16,0,-s*0.10]} scale={[hs*0.18,hs*0.44,hs*0.17]} />
        </group>
      </group>
    </group>
  );
}

// ─── Head mesh using imperative geometry assignment ───────────────────────────
function HeadMesh({ headGeo, material, scale }) {
  const meshRef = useRef();
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry = headGeo;
    }
  }, [headGeo]);
  return <mesh ref={meshRef} material={material} scale={scale} />;
}

// ─── Full animated character ───────────────────────────────────────────────────
function AvatarBody({ char, stateRef }) {
  const cfg = CHARS[char] || CHARS.hannah;

  // Head refs
  const headRef    = useRef();
  const jawRef     = useRef();
  const eyelidLRef = useRef();
  const eyelidRRef = useRef();
  const browLRef   = useRef();
  const browRRef   = useRef();
  const cheekLRef  = useRef();
  const cheekRRef  = useRef();
  // Body refs
  const armLRef    = useRef();
  const armRRef    = useRef();
  const bodyRef    = useRef();

  const { headGeo, bodyGeos, m } = useMemo(() => {
    const headGeo = buildHeadGeo(cfg.hH);
    const irisTex  = makeIrisTex(cfg.irisHex);
    const skinTex  = makeSkinTex(cfg.skin, cfg.skinDark);
    const bodyGeos = {
      browRidge:   new THREE.SphereGeometry(1, 18, 8),
      cheekbone:   new THREE.SphereGeometry(1, 14, 10),
      cheekFlush:  new THREE.SphereGeometry(1, 16, 12),
      jaw:         new THREE.SphereGeometry(0.40, 34, 22, 0, Math.PI*2, 0, Math.PI*0.52),
      jawLip:      new THREE.SphereGeometry(1, 18, 10),
      jawTeeth:    new THREE.BoxGeometry(),
      jawChin:     new THREE.SphereGeometry(1, 16, 12),
      lipSphere:   new THREE.SphereGeometry(1, 18, 10),
      lipDark:     new THREE.SphereGeometry(1, 12, 8),
      teeth:       new THREE.BoxGeometry(),
      philtrum:    new THREE.SphereGeometry(1, 10, 8),
      noseBridge:  new THREE.SphereGeometry(1, 14, 10),
      noseTip:     new THREE.SphereGeometry(1, 16, 12),
      noseDark:    new THREE.SphereGeometry(1, 12, 8),
      nostril:     new THREE.SphereGeometry(1, 10, 8),
      eyeSocket:   new THREE.SphereGeometry(1, 18, 14),
      sclera:      new THREE.SphereGeometry(1, 24, 18),
      irisDisc:    new THREE.CylinderGeometry(1, 1, 1, 32),
      cornea:      new THREE.SphereGeometry(1, 18, 14),
      eyelidTop:   new THREE.SphereGeometry(1, 18, 10, 0, Math.PI*2, 0, Math.PI*0.52),
      lash:        new THREE.SphereGeometry(1, 14, 6, 0, Math.PI*2, 0, Math.PI*0.46),
      lashBottom:  new THREE.SphereGeometry(1, 14, 7, 0, Math.PI*2, Math.PI*0.52, Math.PI*0.46),
      brow:        new THREE.SphereGeometry(1, 16, 10),
      ear:         new THREE.SphereGeometry(1, 16, 12),
      earInner:    new THREE.TorusGeometry(1, 0.40, 8, 14, Math.PI),
    };
    return {
      headGeo,
      bodyGeos,
      m: {
        skin:      new THREE.MeshStandardMaterial({ map:skinTex, roughness:0.72 }),
        skinDark:  mkMat(cfg.skinDark, 0.80),
        hair:      mkMat(cfg.hair,     0.88),
        hairMid:   mkMat(cfg.hairMid,  0.82),
        hairSheen: mkMat(cfg.hairSheen,0.55, 0.06),
        irisDisc:  new THREE.MeshStandardMaterial({ map:irisTex, roughness:0.14, metalness:0.04 }),
        sclera:    mkMat('#f6f2eb', 0.22),
        cornea:    mkMat('#ffffff', 0.00, 0.00, { transparent:true, opacity:0.22 }),
        lid:       new THREE.MeshStandardMaterial({ map:skinTex, roughness:0.76 }),
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
        clothHi:   mkMat(cfg.cloth3, 0.70),
      },
    };
  }, [char]);

  const anim = useRef({
    mouth:0, talkPhase:0, breatheT:0, swayT:0,
    hRY:0, hRX:0, hRZ:0,
    browL:0, browR:0, cheek:0,
    blinkT:0, nextBlink:1.8+Math.random()*2.8, blinking:false,
    thinkT:0,
    armL:0, armR:0, armPhase:0,
  });

  useFrame((_, delta) => {
    const d = clamp(delta, 0.001, 0.05);
    const a = anim.current;
    const st = stateRef.current;

    a.breatheT += d * 0.36;
    a.swayT    += d * 0.26;
    const breathe = Math.sin(a.breatheT) * 0.007;

    let tRY=Math.sin(a.swayT*0.70)*0.021, tRX=Math.sin(a.swayT*0.52)*0.011+breathe*0.4;
    let tRZ=0, tMouth=0, tBrowL=0, tBrowR=0, tCheek=0;
    let tArmL=0, tArmR=0;

    if (st === 'listening') {
      tRY+=0.092; tRZ=-0.052; tBrowL=0.012; tBrowR=0.012;
    } else if (st === 'thinking') {
      a.thinkT+=d*1.5;
      tRX+=Math.sin(a.thinkT)*0.026-0.034;
      tRY+=Math.sin(a.thinkT*0.62)*0.042;
      tBrowL=-0.009; tBrowR=-0.009;
    } else if (st === 'speaking') {
      a.talkPhase+=d*9.5;
      const w1=Math.sin(a.talkPhase), w2=Math.sin(a.talkPhase*1.76+0.42), w3=Math.sin(a.talkPhase*2.9);
      tMouth=clamp((w1*0.45+w2*0.32+w3*0.15)*0.5+0.48,0,1)*0.80;
      tBrowL=Math.sin(a.talkPhase*0.35)*0.013; tBrowR=Math.sin(a.talkPhase*0.35+0.28)*0.013;
      tCheek=0.40; tRX+=Math.sin(a.talkPhase*0.48)*0.013;
      // Subtle arm gesture while speaking
      a.armPhase+=d*1.8;
      tArmL=Math.sin(a.armPhase)*0.06;
      tArmR=Math.sin(a.armPhase+Math.PI)*0.06;
    }

    a.hRY=lerp(a.hRY,tRY,d*3.8); a.hRX=lerp(a.hRX,tRX,d*3.8); a.hRZ=lerp(a.hRZ,tRZ,d*3.8);
    a.mouth=lerp(a.mouth,tMouth,d*17);
    a.browL=lerp(a.browL,tBrowL,d*5.5); a.browR=lerp(a.browR,tBrowR,d*5.5);
    a.cheek=lerp(a.cheek,tCheek,d*4);
    a.armL=lerp(a.armL,tArmL,d*4); a.armR=lerp(a.armR,tArmR,d*4);

    if (headRef.current) {
      headRef.current.rotation.y=a.hRY; headRef.current.rotation.x=a.hRX;
      headRef.current.rotation.z=a.hRZ; headRef.current.position.y=breathe;
    }
    // Body breathe bob
    if (bodyRef.current) bodyRef.current.position.y = breathe * 0.5;

    if (jawRef.current) {
      jawRef.current.position.y=-0.188-a.mouth*0.068;
      jawRef.current.rotation.x=a.mouth*0.21;
    }
    const browBase=0.242;
    if (browLRef.current) browLRef.current.position.y=lerp(browLRef.current.position.y,browBase+a.browL,d*6.5);
    if (browRRef.current) browRRef.current.position.y=lerp(browRRef.current.position.y,browBase+a.browR,d*6.5);
    if (cheekLRef.current) cheekLRef.current.material.opacity=lerp(cheekLRef.current.material.opacity,a.cheek*0.22,d*3.5);
    if (cheekRRef.current) cheekRRef.current.material.opacity=lerp(cheekRRef.current.material.opacity,a.cheek*0.22,d*3.5);
    // Arm gesture animation
    if (armLRef.current) armLRef.current.rotation.x = cfg.armAngleX + a.armL;
    if (armRRef.current) armRRef.current.rotation.x = cfg.armAngleX + a.armR;

    // Blink
    a.blinkT+=d;
    if (!a.blinking && a.blinkT>=a.nextBlink) { a.blinking=true; a.blinkT=0; }
    let lidY=0;
    if (a.blinking) {
      const t=a.blinkT/0.12; lidY=t<0.5?t*2:(1-t)*2;
      if (a.blinkT>=0.12) { a.blinking=false; a.blinkT=0; a.nextBlink=2+Math.random()*4.2; }
    }
    if (eyelidLRef.current) eyelidLRef.current.scale.y=Math.max(0.02,lidY);
    if (eyelidRRef.current) eyelidRRef.current.scale.y=Math.max(0.02,lidY);
  });

  const ex=cfg.eyeX, ey=cfg.eyeY;
  const sw=cfg.shoulderW, cd=cfg.chestD;

  const ClothComp = {
    sweater:   Sweater,
    athletic:  AthleticShirt,
    chefcoat:  ChefCoat,
    cardigan:  Cardigan,
  }[cfg.clothStyle] || Sweater;

  return (
    <group ref={bodyRef}>
      {/* ── HEAD ─── */}
      <group ref={headRef}>
        <HeadMesh headGeo={headGeo} material={m.skin} scale={[cfg.hW, 1, cfg.hD]} />
        {/* Brow ridge */}
        <ImpMesh geo={bodyGeos.browRidge} material={m.skinDark} position={[0,0.190,0.348]} scale={[0.38,0.040,0.066]} />
        {/* Cheekbones */}
        <ImpMesh geo={bodyGeos.cheekbone} material={m.skin} position={[-0.292,0.002,0.300]} scale={[0.086,0.064,0.064]} />
        <ImpMesh geo={bodyGeos.cheekbone} material={m.skin} position={[ 0.292,0.002,0.300]} scale={[0.086,0.064,0.064]} />
        {/* Cheek flush — need refs so use ImpMesh with forwardRef pattern inline */}
        <ImpMesh geo={bodyGeos.cheekFlush} material={m.cheek} position={[-cfg.ckX,cfg.ckY,0.314]} scale={[0.142,0.108,0.044]} meshRef={cheekLRef} />
        <ImpMesh geo={bodyGeos.cheekFlush} material={m.cheek} position={[ cfg.ckX,cfg.ckY,0.314]} scale={[0.142,0.108,0.044]} meshRef={cheekRRef} />
        {/* Jaw */}
        <group ref={jawRef} position={[0,-0.188,0]}>
          <ImpMesh geo={bodyGeos.jaw} material={m.skin} position={[0,0.024,0.038]} scale={[cfg.jawW,cfg.jawH,0.87]} />
          <ImpMesh geo={bodyGeos.jawLip} material={m.lip} position={[0,0.057,0.312]} scale={[0.308,0.059,0.075]} />
          <ImpMesh geo={bodyGeos.jawTeeth} material={m.teeth} position={[0,0.047,0.302]} scale={[0.250,0.038,0.058]} />
          <ImpMesh geo={bodyGeos.cheekFlush} material={m.skin} position={[0,-0.086,0.245]} scale={[0.178,0.096,0.086]} />
        </group>
        {/* Upper lip */}
        <ImpMesh geo={bodyGeos.lipSphere} material={m.lip} position={[0,cfg.lipY,0.322]} scale={[0.316,0.060,0.077]} />
        <ImpMesh geo={bodyGeos.lipDark} material={m.lipDark} position={[-0.054,cfg.lipY+0.029,0.325]} scale={[0.067,0.029,0.039]} />
        <ImpMesh geo={bodyGeos.lipDark} material={m.lipDark} position={[ 0.054,cfg.lipY+0.029,0.325]} scale={[0.067,0.029,0.039]} />
        <ImpMesh geo={bodyGeos.teeth} material={m.teeth} position={[0,cfg.lipY-0.014,0.304]} scale={[0.250,0.038,0.058]} />
        <ImpMesh geo={bodyGeos.philtrum} material={m.skinDark} position={[0,cfg.lipY+0.064,0.326]} scale={[0.045,0.045,0.018]} />
        {/* Nose */}
        <group position={[0,cfg.noseY,0]}>
          <ImpMesh geo={bodyGeos.noseBridge} material={m.skin} position={[0,0.094,0.336]} scale={[0.058,0.148,0.058]} />
          <ImpMesh geo={bodyGeos.noseTip} material={m.skin} position={[0,0.024,0.372]} scale={[0.088,0.075,0.075]} />
          <ImpMesh geo={bodyGeos.noseDark} material={m.skinDark} position={[0,0.004,0.372]} scale={[0.055,0.040,0.035]} />
          <ImpMesh geo={bodyGeos.nostril} material={m.nostril} position={[-0.060,-0.008,0.358]} scale={[0.042,0.036,0.044]} />
          <ImpMesh geo={bodyGeos.nostril} material={m.nostril} position={[ 0.060,-0.008,0.358]} scale={[0.042,0.036,0.044]} />
        </group>
        {/* Left eye */}
        <group position={[-ex,ey,0.332]}>
          <ImpMesh geo={bodyGeos.eyeSocket} material={m.skinDark} scale={[0.098,0.086,0.044]} />
          <ImpMesh geo={bodyGeos.sclera} material={m.sclera} position={[0,0,0.018]} scale={[0.087,0.077,0.047]} />
          <ImpMesh geo={bodyGeos.irisDisc} material={m.irisDisc} position={[0,0,0.054]} rotation={[Math.PI/2,0,0]} scale={[0.052,0.008,0.052]} />
          <ImpMesh geo={bodyGeos.cornea} material={m.cornea} position={[0,0,0.073]} scale={[0.091,0.079,0.018]} />
          <ImpMesh geo={bodyGeos.eyelidTop} material={m.lid} position={[0,0.046,0.018]} scale={[0.094,0.048,0.055]} meshRef={eyelidLRef} />
          <ImpMesh geo={bodyGeos.lash} material={m.lash} position={[0,0.047,0.023]} scale={[0.093,0.014,0.029]} />
          <ImpMesh geo={bodyGeos.lashBottom} material={m.skinDark} position={[0,-0.046,0.023]} scale={[0.091,0.013,0.026]} />
        </group>
        {/* Right eye */}
        <group position={[ex,ey,0.332]}>
          <ImpMesh geo={bodyGeos.eyeSocket} material={m.skinDark} scale={[0.098,0.086,0.044]} />
          <ImpMesh geo={bodyGeos.sclera} material={m.sclera} position={[0,0,0.018]} scale={[0.087,0.077,0.047]} />
          <ImpMesh geo={bodyGeos.irisDisc} material={m.irisDisc} position={[0,0,0.054]} rotation={[Math.PI/2,0,0]} scale={[0.052,0.008,0.052]} />
          <ImpMesh geo={bodyGeos.cornea} material={m.cornea} position={[0,0,0.073]} scale={[0.091,0.079,0.018]} />
          <ImpMesh geo={bodyGeos.eyelidTop} material={m.lid} position={[0,0.046,0.018]} scale={[0.094,0.048,0.055]} meshRef={eyelidRRef} />
          <ImpMesh geo={bodyGeos.lash} material={m.lash} position={[0,0.047,0.023]} scale={[0.093,0.014,0.029]} />
          <ImpMesh geo={bodyGeos.lashBottom} material={m.skinDark} position={[0,-0.046,0.023]} scale={[0.091,0.013,0.026]} />
        </group>
        {/* Eyebrows */}
        <ImpMesh geo={bodyGeos.brow} material={m.brow} position={[-ex-0.012,0.242,0.346]} rotation={[0,0.08,cfg.browArc]} scale={[0.110,cfg.browThick,0.024]} meshRef={browLRef} />
        <ImpMesh geo={bodyGeos.brow} material={m.brow} position={[ ex+0.012,0.242,0.346]} rotation={[0,-0.08,-cfg.browArc]} scale={[0.110,cfg.browThick,0.024]} meshRef={browRRef} />
        {/* Ears */}
        <group position={[-0.392,0.036,0]}>
          <ImpMesh geo={bodyGeos.ear} material={m.skin} scale={[0.062,0.098,0.052]} />
          <ImpMesh geo={bodyGeos.earInner} material={m.skinDark} position={[0.013,0.012,0.025]} scale={[0.025,0.061,0.022]} />
        </group>
        <group position={[0.392,0.036,0]}>
          <ImpMesh geo={bodyGeos.ear} material={m.skin} scale={[0.062,0.098,0.052]} />
          <ImpMesh geo={bodyGeos.earInner} material={m.skinDark} position={[-0.013,0.012,0.025]} scale={[0.025,0.061,0.022]} />
        </group>
        {/* Hair */}
        {cfg.hairStyle==='curly'    && <HairCurly    h={m.hair} hs={m.hairSheen} />}
        {cfg.hairStyle==='fade'     && <HairFade     h={m.hair} />}
        {cfg.hairStyle==='wavy'     && <HairWavy     h={m.hair} hs={m.hairSheen} />}
        {cfg.hairStyle==='textured' && <HairTextured h={m.hair} hs={m.hairSheen} />}
        {/* Head accessories */}
        {cfg.acc==='chef-hat' && <ChefHat  c1={m.clothMain} c2={m.clothShad} />}
        {cfg.acc==='beard'    && <Beard    h={m.hair} />}
        {cfg.acc==='earrings' && <Earrings gold={m.gold} />}
      </group>

      {/* ── CLOTHING / TORSO ─── */}
      <ClothComp skin={m.skin} c1={m.clothMain} c2={m.clothShad} c3={m.clothHi} sw={sw} cd={cd} />

      {/* ── ARMS ─── */}
      <Arm side="L" skin={m.skin} sleeve={m.clothMain} cfg={cfg} armSwingRef={armLRef} />
      <Arm side="R" skin={m.skin} sleeve={m.clothMain} cfg={cfg} armSwingRef={armRRef} />
    </group>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export default function ChatbotAvatar3D({
  character   = 'hannah',
  isSpeaking  = false,
  isListening = false,
  width       = 200,
  height      = 260,
  className   = '',
}) {
  const stateRef = useRef('idle');
  useEffect(() => {
    stateRef.current = isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle';
  }, [isSpeaking, isListening]);

  return (
    <div className={className} style={{ width, height }}>
      <Canvas
        camera={{ position:[0, -0.18, 2.20], fov:42 }}
        style={{ background:'transparent', width:'100%', height:'100%' }}
        gl={{ antialias:true, alpha:true, toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.10 }}
        shadows
        dpr={[1,2]}
      >
        {/* HDR environment lighting — "studio" gives warm professional look */}
        <Environment preset="studio" />
        {/* Subtle ground shadow */}
        <ContactShadows
          position={[0,-1.55,0]}
          opacity={0.28}
          scale={2.5}
          blur={1.8}
          far={2}
          color="#1a0f08"
        />
        <group position={[0, 0.22, 0]}>
          <Suspense fallback={null}>
            <AvatarBody char={character} stateRef={stateRef} />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}