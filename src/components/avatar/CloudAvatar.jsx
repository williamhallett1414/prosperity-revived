/**
 * CloudAvatar — 3D floating cloud avatar renderer
 *
 * A semi-stylized floating cloud built with Three.js / React Three Fiber.
 * Supports five characters (gideon, hannah, coach, chef, paul), each with
 * their own brand color, glow emissive, and particle palette.
 *
 * Animation states: idle | listening | thinking | speaking
 */
import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const lerp  = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

// ─── Per-bot identity ─────────────────────────────────────────────────────────
const BOT_CLOUD = {
  gideon: {
    color:       '#C9A227',
    emissive:    '#8B6400',
    particleCol: '#F0D98A',
    lobes: [
      [-0.28,  0.12, -0.10],
      [ 0.26,  0.14, -0.08],
      [-0.14,  0.30,  0.06],
      [ 0.12,  0.32,  0.04],
      [-0.34, -0.08, -0.04],
      [ 0.32, -0.06, -0.02],
      [ 0.00, -0.20,  0.00],
      [-0.12,  0.14,  0.28],
      [ 0.10,  0.16,  0.26],
    ],
    lobeScale: 0.30,
    coreRadius: 0.46,
  },
  hannah: {
    color:       '#7AB3D4',
    emissive:    '#2A6A9C',
    particleCol: '#BFD9F0',
    lobes: [
      [-0.24,  0.18,  0.00],
      [ 0.22,  0.20, -0.02],
      [ 0.00,  0.36,  0.02],
      [-0.36,  0.02,  0.04],
      [ 0.34,  0.04,  0.02],
      [-0.18, -0.18,  0.08],
      [ 0.16, -0.20,  0.06],
      [-0.06,  0.18,  0.30],
      [ 0.08,  0.20,  0.28],
    ],
    lobeScale: 0.28,
    coreRadius: 0.42,
  },
  coach: {
    color:       '#38BDF8',
    emissive:    '#0284C7',
    particleCol: '#7DD3FC',
    lobes: [
      [-0.30,  0.08,  0.00],
      [ 0.28,  0.10, -0.02],
      [-0.16,  0.26,  0.04],
      [ 0.14,  0.28,  0.02],
      [-0.36, -0.06,  0.00],
      [ 0.34, -0.04,  0.02],
      [ 0.00, -0.16,  0.04],
      [-0.10,  0.10,  0.32],
    ],
    lobeScale: 0.26,
    coreRadius: 0.44,
  },
  chef: {
    color:       '#22C55E',
    emissive:    '#15803D',
    particleCol: '#86EFAC',
    lobes: [
      [-0.26,  0.16, -0.06],
      [ 0.24,  0.18, -0.04],
      [ 0.00,  0.38,  0.04],
      [-0.38,  0.04,  0.02],
      [ 0.36,  0.06,  0.00],
      [-0.16, -0.22,  0.06],
      [ 0.14, -0.24,  0.04],
      [ 0.00,  0.00,  0.34],
      [-0.14,  0.22,  0.26],
      [ 0.12,  0.24,  0.24],
    ],
    lobeScale: 0.32,
    coreRadius: 0.48,
  },
  paul: {
    color:       '#A78BFA',
    emissive:    '#6D28D9',
    particleCol: '#C4B5FD',
    lobes: [
      [-0.28,  0.10, -0.06],
      [ 0.26,  0.12, -0.04],
      [-0.12,  0.28,  0.08],
      [ 0.10,  0.30,  0.06],
      [-0.34, -0.06,  0.00],
      [ 0.32, -0.04,  0.02],
      [ 0.00, -0.18,  0.02],
      [-0.08,  0.12,  0.30],
    ],
    lobeScale: 0.27,
    coreRadius: 0.44,
  },
};

// ─── Particle halo ────────────────────────────────────────────────────────────
function ParticleHalo({ color, stateRef }) {
  const COUNT = 90;
  const pointsRef = useRef();
  const matRef    = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 0.72 + Math.random() * 0.40;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const anim = useRef({ opacity: 0.35, size: 0.022, phase: 0 });

  useFrame((_, delta) => {
    const d  = clamp(delta, 0.001, 0.05);
    const st = stateRef.current;
    const a  = anim.current;
    a.phase += d;

    const tOpacity = st === 'speaking' ? 0.85 : st === 'listening' ? 0.55 : 0.30;
    const tSize    = st === 'speaking' ? 0.030 : st === 'listening' ? 0.024 : 0.018;

    a.opacity = lerp(a.opacity, tOpacity, d * 3.5);
    a.size    = lerp(a.size,    tSize,    d * 3.0);

    if (matRef.current) {
      matRef.current.opacity = a.opacity + Math.sin(a.phase * 1.2) * 0.04;
      matRef.current.size    = a.size;
    }

    // Slowly rotate the particle cloud
    if (pointsRef.current) {
      pointsRef.current.rotation.y += d * 0.18;
      pointsRef.current.rotation.x += d * 0.06;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={color}
        size={0.018}
        transparent
        opacity={0.30}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Cloud body ───────────────────────────────────────────────────────────────
function CloudBody({ cfg, stateRef }) {
  const groupRef   = useRef();
  const coreRef    = useRef();
  const glow1Ref   = useRef();
  const glow2Ref   = useRef();
  const lobeRefs   = useRef(cfg.lobes.map(() => React.createRef()));

  const mats = useMemo(() => ({
    core:  new THREE.MeshStandardMaterial({ color: cfg.color, emissive: cfg.emissive, emissiveIntensity: 0.4, roughness: 0.55, metalness: 0.08 }),
    lobe:  new THREE.MeshStandardMaterial({ color: cfg.color, emissive: cfg.emissive, emissiveIntensity: 0.15, roughness: 0.72, metalness: 0.04, transparent: true, opacity: 0.92 }),
    glow1: new THREE.MeshBasicMaterial({ color: cfg.emissive, transparent: true, opacity: 0.09, depthWrite: false }),
    glow2: new THREE.MeshBasicMaterial({ color: cfg.color,    transparent: true, opacity: 0.05, depthWrite: false }),
  }), [cfg]);

  const anim = useRef({
    breatheT: 0, floatT: 0, talkPhase: 0, thinkT: 0,
    scale: 1.0, floatY: 0,
    emissive: 0.4, glow1Op: 0.09, glow2Op: 0.05,
    lobeScale: 1.0,
  });

  useFrame((_, delta) => {
    const d  = clamp(delta, 0.001, 0.05);
    const a  = anim.current;
    const st = stateRef.current;

    a.breatheT += d * 0.38;
    a.floatT   += d * 0.28;
    const breathe = Math.sin(a.breatheT) * 0.024;
    const float_  = Math.sin(a.floatT)   * 0.065;

    let tScale     = 1.0 + breathe;
    let tFloatY    = float_;
    let tEmissive  = 0.35;
    let tGlow1     = 0.09;
    let tGlow2     = 0.05;
    let tLobeSc    = 1.0;

    if (st === 'listening') {
      tScale    = 0.96 + Math.abs(Math.sin(a.breatheT * 1.8)) * 0.10;
      tEmissive = 0.55;
      tGlow1    = 0.16;
      tFloatY   = float_ + 0.04;
    } else if (st === 'thinking') {
      a.thinkT += d * 0.9;
      tScale    = 1.0 + Math.sin(a.thinkT) * 0.03;
      tEmissive = lerp(0.30, 0.55, (Math.sin(a.thinkT * 0.5) + 1) * 0.5);
      tGlow1    = 0.12;
    } else if (st === 'speaking') {
      a.talkPhase += d * 9.0;
      const wave = (Math.sin(a.talkPhase) * 0.5 + Math.sin(a.talkPhase * 1.7) * 0.3) * 0.5 + 0.5;
      tScale    = 1.02 + wave * 0.08;
      tLobeSc   = 1.0  + wave * 0.06;
      tEmissive = 0.60 + wave * 1.20;
      tGlow1    = 0.18 + wave * 0.20;
      tGlow2    = 0.10 + wave * 0.08;
      tFloatY   = float_ + 0.10;
    }

    a.scale    = lerp(a.scale,    tScale,    d * 4.5);
    a.floatY   = lerp(a.floatY,   tFloatY,   d * 2.5);
    a.emissive = lerp(a.emissive, tEmissive, d * 6.0);
    a.glow1Op  = lerp(a.glow1Op,  tGlow1,    d * 4.0);
    a.glow2Op  = lerp(a.glow2Op,  tGlow2,    d * 4.0);
    a.lobeScale = lerp(a.lobeScale, tLobeSc, d * 5.0);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(a.scale);
      groupRef.current.position.y = a.floatY;
      if (st === 'thinking') groupRef.current.rotation.y += d * 0.55;
    }
    if (coreRef.current)  coreRef.current.material.emissiveIntensity = a.emissive;
    if (glow1Ref.current) glow1Ref.current.material.opacity = a.glow1Op;
    if (glow2Ref.current) glow2Ref.current.material.opacity = a.glow2Op;
    lobeRefs.current.forEach(r => {
      if (r.current) r.current.scale.setScalar(cfg.lobeScale * a.lobeScale);
    });
  });

  return (
    <group ref={groupRef}>
      {/* Outer glow layers — behind core */}
      <mesh ref={glow2Ref} material={mats.glow2}>
        <sphereGeometry args={[cfg.coreRadius * 1.38, 18, 14]} />
      </mesh>
      <mesh ref={glow1Ref} material={mats.glow1}>
        <sphereGeometry args={[cfg.coreRadius * 1.18, 22, 18]} />
      </mesh>

      {/* Core */}
      <mesh ref={coreRef} material={mats.core}>
        <sphereGeometry args={[cfg.coreRadius, 32, 28]} />
      </mesh>

      {/* Cloud lobes */}
      {cfg.lobes.map((pos, i) => (
        <mesh
          key={i}
          ref={lobeRefs.current[i]}
          material={mats.lobe}
          position={pos}
          scale={cfg.lobeScale}
        >
          <sphereGeometry args={[1, 18, 14]} />
        </mesh>
      ))}

      {/* Particle halo */}
      <ParticleHalo color={cfg.particleCol} stateRef={stateRef} />
    </group>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
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
        camera={{ position: [0, 0, 2.6], fov: 44 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
        dpr={[1, 1.5]}
      >
        <Environment preset="studio" />
        <ContactShadows
          position={[0, -0.80, 0]}
          opacity={0.22}
          scale={2}
          blur={1.8}
          far={1.5}
          color={cfg.color}
        />
        <ambientLight intensity={0.6} />
        <pointLight position={[1.5, 2, 1.5]} intensity={1.2} color={cfg.color} />
        <pointLight position={[-1.5, -1, -1]} intensity={0.4} />
        <Suspense fallback={null}>
          <CloudBody cfg={cfg} stateRef={stateRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
