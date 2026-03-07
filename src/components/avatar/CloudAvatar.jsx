/**
 * CloudAvatar v2 — High-quality 3D cloud avatar
 *
 * Improvements over v1:
 * - Subsurface-scattering simulation via layered translucent inner geometry
 * - Volumetric glow: three-layer inner/mid/outer halo with independent animation
 * - Organic breathing: multi-frequency Lissajous float (not simple sine)
 * - Personality-specific cloud geometry: unique lobe count, placement, scale per character
 * - Speaking: amplitude-reactive lobe ripple wave + core brightness surge
 * - Wispy equatorial torus ring, per-bot sized
 * - High-DPR canvas (up to 2x), ACESFilmic tone-mapping
 * - Three-point lighting with SSS rim backlight
 * - Particle system: 140 particles in two radial shells with per-particle drift
 *
 * Characters: gideon | hannah | coach | chef | paul
 * States: idle | listening | thinking | speaking
 */
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const lerp  = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

// ─── Per-bot visual identity ───────────────────────────────────────────────────
const BOT_CLOUD = {
  gideon: {
    color:        '#C9A227',
    emissive:     '#7A5500',
    sssColor:     '#F0D98A',
    particleCol:  '#F5E49A',
    lobes: [
      [-0.38, -0.14, -0.06], [ 0.36, -0.12, -0.04], [ 0.00, -0.20,  0.02],
      [-0.20, -0.20,  0.16], [ 0.18, -0.18,  0.18],
      [-0.30,  0.08, -0.12], [ 0.28,  0.10, -0.10],
      [-0.14,  0.06,  0.26], [ 0.12,  0.08,  0.24],
      [-0.18,  0.28,  0.04], [ 0.16,  0.30,  0.02], [ 0.00,  0.38,  0.08],
      [-0.08,  0.22,  0.28],
    ],
    lobeScale:    0.34,
    coreRadius:   0.50,
    ringRadius:   0.88,
    breatheSpeed: 0.30,
    floatSpeed:   0.22,
  },
  hannah: {
    color:        '#7AB3D4',
    emissive:     '#2A6A9C',
    sssColor:     '#C8E4F6',
    particleCol:  '#D0EAFC',
    lobes: [
      [-0.26,  0.00, -0.04], [ 0.24,  0.02, -0.02],
      [-0.16, -0.14,  0.12], [ 0.14, -0.16,  0.10], [ 0.00, -0.18,  0.04],
      [-0.34,  0.12,  0.06], [ 0.32,  0.14,  0.04],
      [-0.10,  0.12,  0.30], [ 0.08,  0.14,  0.28],
      [-0.22,  0.30, -0.02], [ 0.20,  0.32,  0.00], [ 0.00,  0.40,  0.06],
      [-0.10,  0.26,  0.24], [ 0.08,  0.28,  0.22],
    ],
    lobeScale:    0.30,
    coreRadius:   0.44,
    ringRadius:   0.82,
    breatheSpeed: 0.38,
    floatSpeed:   0.30,
  },
  coach: {
    color:        '#38BDF8',
    emissive:     '#0284C7',
    sssColor:     '#A8DEFF',
    particleCol:  '#7DD3FC',
    lobes: [
      [-0.34, -0.08, -0.02], [ 0.32, -0.06,  0.00],
      [-0.18, -0.18,  0.14], [ 0.22, -0.14,  0.18],
      [-0.28,  0.14, -0.10], [ 0.30,  0.16, -0.08],
      [ 0.00,  0.02,  0.30],
      [-0.14,  0.32,  0.06], [ 0.16,  0.34,  0.04], [ 0.02,  0.40,  0.10],
    ],
    lobeScale:    0.27,
    coreRadius:   0.46,
    ringRadius:   0.80,
    breatheSpeed: 0.52,
    floatSpeed:   0.44,
  },
  chef: {
    color:        '#22C55E',
    emissive:     '#15803D',
    sssColor:     '#A7F3C4',
    particleCol:  '#86EFAC',
    lobes: [
      [-0.40, -0.10, -0.08], [ 0.38, -0.08, -0.06], [ 0.00, -0.22,  0.04],
      [-0.22, -0.18,  0.20], [ 0.20, -0.20,  0.18],
      [-0.30,  0.10,  0.08], [ 0.28,  0.12,  0.06],
      [-0.12,  0.08,  0.34], [ 0.10,  0.10,  0.32],
      [-0.22,  0.28, -0.06], [ 0.24,  0.30, -0.04], [ 0.04,  0.42,  0.08],
      [-0.12,  0.26,  0.26], [ 0.14,  0.24,  0.24],
    ],
    lobeScale:    0.33,
    coreRadius:   0.50,
    ringRadius:   0.90,
    breatheSpeed: 0.44,
    floatSpeed:   0.36,
  },
  paul: {
    color:        '#A78BFA',
    emissive:     '#6D28D9',
    sssColor:     '#DDD6FE',
    particleCol:  '#C4B5FD',
    lobes: [
      [-0.30, -0.06, -0.08], [ 0.28, -0.04, -0.06],
      [-0.16, -0.16,  0.14], [ 0.14, -0.18,  0.12], [ 0.00, -0.20,  0.02],
      [-0.26,  0.12, -0.04], [ 0.24,  0.14, -0.02],
      [-0.08,  0.10,  0.30], [ 0.06,  0.12,  0.28],
      [-0.14,  0.30,  0.08], [ 0.12,  0.32,  0.06], [ 0.00,  0.40,  0.10],
    ],
    lobeScale:    0.28,
    coreRadius:   0.45,
    ringRadius:   0.83,
    breatheSpeed: 0.34,
    floatSpeed:   0.26,
  },
};

// ─── Dual-shell particle halo ─────────────────────────────────────────────────
function ParticleHalo({ cfg, stateRef }) {
  const INNER = 80;
  const OUTER = 60;
  const TOTAL = INNER + OUTER;

  const pointsRef = useRef();
  const matRef    = useRef();

  const { positions, vels } = useMemo(() => {
    const positions = new Float32Array(TOTAL * 3);
    const vels      = new Float32Array(TOTAL * 3);
    for (let i = 0; i < TOTAL; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = i < INNER
        ? 0.70 + Math.random() * 0.20
        : 0.96 + Math.random() * 0.30;
      positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
      vels[i*3]   = (Math.random() - 0.5) * 0.0014;
      vels[i*3+1] = (Math.random() - 0.5) * 0.0009;
      vels[i*3+2] = (Math.random() - 0.5) * 0.0014;
    }
    return { positions, vels };
  }, []);

  const anim = useRef({ opacity: 0.26, size: 0.018, phase: 0 });

  useFrame((_, delta) => {
    const d  = clamp(delta, 0.001, 0.05);
    const st = stateRef.current;
    const a  = anim.current;
    a.phase += d;

    const tOpacity = st === 'speaking' ? 0.80 : st === 'listening' ? 0.50 : st === 'thinking' ? 0.36 : 0.24;
    const tSize    = st === 'speaking' ? 0.027 : st === 'listening' ? 0.021 : 0.015;

    a.opacity = lerp(a.opacity, tOpacity, d * 3.0);
    a.size    = lerp(a.size,    tSize,    d * 2.5);

    if (matRef.current) {
      matRef.current.opacity = a.opacity + Math.sin(a.phase * 0.85) * 0.028;
      matRef.current.size    = a.size    + Math.sin(a.phase * 1.2)  * 0.002;
    }

    if (pointsRef.current) {
      const spd = st === 'speaking' ? 0.20 : 0.09;
      pointsRef.current.rotation.y += d * spd;
      pointsRef.current.rotation.x += d * spd * 0.38;
    }

    // Per-particle organic drift with shell attraction
    if (pointsRef.current?.geometry) {
      const pos = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < TOTAL; i++) {
        const r = i * 3;
        pos.array[r]   += vels[r];
        pos.array[r+1] += vels[r+1];
        pos.array[r+2] += vels[r+2];
        const x = pos.array[r], y = pos.array[r+1], z = pos.array[r+2];
        const dist = Math.sqrt(x*x + y*y + z*z) || 0.001;
        const targetR = i < INNER ? 0.80 : 1.11;
        const pull = (targetR - dist) * 0.0018;
        pos.array[r]   += (x / dist) * pull;
        pos.array[r+1] += (y / dist) * pull;
        pos.array[r+2] += (z / dist) * pull;
      }
      pos.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={matRef}
        color={cfg.particleCol}
        size={0.015}
        transparent
        opacity={0.24}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Cloud body ────────────────────────────────────────────────────────────────
function CloudBody({ cfg, stateRef }) {
  const groupRef   = useRef();
  const coreRef    = useRef();
  const innerGlRef = useRef();
  const midGlRef   = useRef();
  const outerGlRef = useRef();
  const ringRef    = useRef();
  const lobeRefs   = useRef(cfg.lobes.map(() => React.createRef()));

  const mats = useMemo(() => ({
    core: new THREE.MeshStandardMaterial({
      color: cfg.color, emissive: cfg.emissive, emissiveIntensity: 0.55,
      roughness: 0.40, metalness: 0.05,
    }),
    lobe: new THREE.MeshStandardMaterial({
      color: cfg.color, emissive: cfg.emissive, emissiveIntensity: 0.18,
      roughness: 0.68, metalness: 0.03, transparent: true, opacity: 0.90,
    }),
    innerGlow: new THREE.MeshBasicMaterial({
      color: cfg.sssColor, transparent: true, opacity: 0.18,
      depthWrite: false,
    }),
    midGlow: new THREE.MeshBasicMaterial({
      color: cfg.emissive, transparent: true, opacity: 0.10,
      depthWrite: false,
    }),
    outerGlow: new THREE.MeshBasicMaterial({
      color: cfg.color, transparent: true, opacity: 0.055,
      depthWrite: false,
    }),
    ring: new THREE.MeshBasicMaterial({
      color: cfg.sssColor, transparent: true, opacity: 0.06,
      depthWrite: false, side: THREE.DoubleSide,
    }),
  }), [cfg]);

  const anim = useRef({
    breatheT: 0, floatT: 0, floatT2: 0, talkPhase: 0, thinkT: 0, lobeWave: 0, ringRot: 0,
    scale: 1.0, floatY: 0, emissive: 0.55,
    innerGlOp: 0.18, midGlOp: 0.10, outerGlOp: 0.055, ringOp: 0.06, lobeScale: 1.0,
  });

  useFrame((_, delta) => {
    const d  = clamp(delta, 0.001, 0.05);
    const a  = anim.current;
    const st = stateRef.current;

    a.breatheT += d * cfg.breatheSpeed;
    a.floatT   += d * cfg.floatSpeed;
    a.floatT2  += d * cfg.floatSpeed * 0.618;

    const breathe = Math.sin(a.breatheT) * 0.020 + Math.sin(a.breatheT * 2.3) * 0.007;
    const floatY  = Math.sin(a.floatT) * 0.060 + Math.sin(a.floatT2) * 0.022;

    let tScale = 1.0 + breathe, tFloatY = floatY;
    let tEmissive = 0.50, tInnerGl = 0.18, tMidGl = 0.10, tOuterGl = 0.055, tRingOp = 0.06, tLobeSc = 1.0;

    if (st === 'listening') {
      tScale    = 1.0 + breathe + Math.abs(Math.sin(a.breatheT * 1.6)) * 0.055;
      tEmissive = 0.72; tInnerGl = 0.28; tMidGl = 0.16; tRingOp = 0.12; tFloatY = floatY + 0.05;
    } else if (st === 'thinking') {
      a.thinkT += d * 0.80;
      tScale    = 1.0 + breathe + Math.sin(a.thinkT) * 0.025;
      tEmissive = lerp(0.45, 0.72, (Math.sin(a.thinkT * 0.6) + 1) * 0.5);
      tInnerGl  = lerp(0.15, 0.26, (Math.sin(a.thinkT * 0.7) + 1) * 0.5);
      tMidGl = 0.13;
    } else if (st === 'speaking') {
      a.talkPhase += d * 10.0;
      a.lobeWave  += d * 7.0;
      const w1 = Math.sin(a.talkPhase) * 0.50;
      const w2 = Math.sin(a.talkPhase * 1.618) * 0.30;
      const w3 = Math.sin(a.talkPhase * 2.414) * 0.20;
      const w  = (w1 + w2 + w3) * 0.5 + 0.5;
      tScale    = 1.02 + w * 0.10 + breathe;
      tLobeSc   = 1.0  + w * 0.08;
      tEmissive = 0.70 + w * 1.40;
      tInnerGl  = 0.30 + w * 0.28;
      tMidGl    = 0.18 + w * 0.18;
      tOuterGl  = 0.09 + w * 0.07;
      tRingOp   = 0.10 + w * 0.08;
      tFloatY   = floatY + 0.08;
    }

    a.scale     = lerp(a.scale,     tScale,    d * 4.0);
    a.floatY    = lerp(a.floatY,    tFloatY,   d * 2.2);
    a.emissive  = lerp(a.emissive,  tEmissive, d * 5.5);
    a.innerGlOp = lerp(a.innerGlOp, tInnerGl,  d * 4.5);
    a.midGlOp   = lerp(a.midGlOp,   tMidGl,    d * 3.5);
    a.outerGlOp = lerp(a.outerGlOp, tOuterGl,  d * 3.0);
    a.ringOp    = lerp(a.ringOp,    tRingOp,   d * 3.0);
    a.lobeScale = lerp(a.lobeScale, tLobeSc,   d * 5.0);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(a.scale);
      groupRef.current.position.y = a.floatY;
      if (st === 'thinking') groupRef.current.rotation.y += d * 0.50;
    }

    a.ringRot += d * 0.15;
    if (ringRef.current) { ringRef.current.rotation.z = a.ringRot; ringRef.current.material.opacity = a.ringOp; }
    if (coreRef.current)    coreRef.current.material.emissiveIntensity = a.emissive;
    if (innerGlRef.current) innerGlRef.current.material.opacity = a.innerGlOp;
    if (midGlRef.current)   midGlRef.current.material.opacity   = a.midGlOp;
    if (outerGlRef.current) outerGlRef.current.material.opacity  = a.outerGlOp;

    lobeRefs.current.forEach((r, i) => {
      if (!r.current) return;
      let sc = cfg.lobeScale * a.lobeScale;
      if (st === 'speaking') {
        sc += Math.sin(a.lobeWave + i * 0.48) * 0.04 * (a.lobeScale - 1.0) * 8;
      }
      r.current.scale.setScalar(Math.max(0.01, sc));
    });
  });

  const geos = useMemo(() => ({
    outerGlow: new THREE.SphereGeometry(cfg.coreRadius * 1.55, 16, 12),
    midGlow:   new THREE.SphereGeometry(cfg.coreRadius * 1.25, 20, 16),
    ring:      new THREE.TorusGeometry(cfg.ringRadius, 0.06, 8, 48),
    core:      new THREE.SphereGeometry(cfg.coreRadius, 36, 30),
    innerGlow: new THREE.SphereGeometry(cfg.coreRadius * 0.82, 24, 20),
    lobe:      new THREE.SphereGeometry(1, 22, 18),
  }), [cfg]);

  return (
    <group ref={groupRef}>
      <mesh ref={outerGlRef} geometry={geos.outerGlow} material={mats.outerGlow} />
      <mesh ref={midGlRef}   geometry={geos.midGlow}   material={mats.midGlow} />
      <mesh ref={ringRef}    geometry={geos.ring}       material={mats.ring} />
      <mesh ref={coreRef}    geometry={geos.core}       material={mats.core} />
      <mesh ref={innerGlRef} geometry={geos.innerGlow}  material={mats.innerGlow} />
      {cfg.lobes.map((pos, i) => (
        <mesh key={i} ref={lobeRefs.current[i]} geometry={geos.lobe} material={mats.lobe} position={pos} scale={cfg.lobeScale} />
      ))}
      <ParticleHalo cfg={cfg} stateRef={stateRef} />
    </group>
  );
}

// ─── Public component ──────────────────────────────────────────────────────────
export default function CloudAvatar({
  character   = 'gideon',
  isSpeaking  = false,
  isListening = false,
  isThinking  = false,
  width       = 260,
  height      = 260,
  className   = '',
}) {
  const stateRef = useRef('idle');
  const cfg = BOT_CLOUD[character] || BOT_CLOUD.gideon;

  useEffect(() => {
    stateRef.current = isSpeaking  ? 'speaking'
                     : isListening ? 'listening'
                     : isThinking  ? 'thinking'
                     : 'idle';
  }, [isSpeaking, isListening, isThinking]);

  return (
    <div className={className} style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 42 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Environment preset="studio" />
        <ContactShadows position={[0, -0.90, 0]} opacity={0.20} scale={2.2} blur={2.2} far={1.6} color={cfg.color} />
        <ambientLight intensity={0.55} />
        <pointLight position={[1.8, 2.2, 1.6]} intensity={1.4} color={cfg.color} />
        <pointLight position={[-1.4, -1.2, -0.8]} intensity={0.35} color="#c8d8ff" />
        <pointLight position={[0, 0, -2.4]} intensity={0.50} color={cfg.sssColor} />
        <Suspense fallback={null}>
          <CloudBody cfg={cfg} stateRef={stateRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}