/**
 * ChatbotAvatar3D - live 3D talking head
 * @react-three/fiber + three.js, no Drei required
 *
 * Props
 *   character   'hannah' | 'coach' | 'chef' | 'gideon'
 *   isSpeaking  boolean
 *   isListening boolean
 *   size        number (px, default 140)
 */
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const lerp = THREE.MathUtils.lerp;

const CHARS = {
  hannah: { skin:'#f5c5a3', hair:'#8b4513', eye:'#6b4226', lip:'#e07878', headScale:[1,1.08,0.92], hairStyle:'long', hat:false },
  coach:  { skin:'#c68642', hair:'#1a1a1a', eye:'#2d5a1b', lip:'#b05e40', headScale:[1,1,0.95],    hairStyle:'short', hat:false },
  chef:   { skin:'#d4a87a', hair:'#2c1810', eye:'#4a3728', lip:'#c26e4a', headScale:[1.02,1,0.93], hairStyle:'medium', hat:true },
  gideon: { skin:'#c8a882', hair:'#3d2b1f', eye:'#5c4033', lip:'#b07860', headScale:[1,1.05,0.94], hairStyle:'medium', hat:false },
};

function Head({ char, isSpeaking, isListening }) {
  const cfg = CHARS[char] || CHARS.hannah;
  const headRef    = useRef();
  const jawRef     = useRef();
  const eyelidLRef = useRef();
  const eyelidRRef = useRef();
  const browLRef   = useRef();
  const browRRef   = useRef();

  const m = useMemo(() => ({
    skin:   new THREE.MeshStandardMaterial({ color: cfg.skin,  roughness: 0.7 }),
    hair:   new THREE.MeshStandardMaterial({ color: cfg.hair,  roughness: 0.9 }),
    eye:    new THREE.MeshStandardMaterial({ color: cfg.eye,   roughness: 0.2, metalness: 0.1 }),
    sclera: new THREE.MeshStandardMaterial({ color:'#ffffff',  roughness: 0.3 }),
    lip:    new THREE.MeshStandardMaterial({ color: cfg.lip,   roughness: 0.5 }),
    teeth:  new THREE.MeshStandardMaterial({ color:'#f5f0e8',  roughness: 0.6 }),
    lid:    new THREE.MeshStandardMaterial({ color: cfg.skin,  roughness: 0.8 }),
    hat:    new THREE.MeshStandardMaterial({ color:'#ffffff',  roughness: 0.9 }),
    brim:   new THREE.MeshStandardMaterial({ color:'#e8e8e8',  roughness: 0.9 }),
    brow:   new THREE.MeshStandardMaterial({ color: cfg.hair,  roughness: 0.9 }),
    pupil:  new THREE.MeshStandardMaterial({ color:'#111111' }),
  }), [cfg.skin, cfg.hair, cfg.eye, cfg.lip]);

  const st = useRef({
    mouth:0, blinkT:0, nextBlink:2+Math.random()*3, blinking:false,
    breatheT:0, swayT:0, talkPhase:0, listenTilt:0,
  });

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const a = st.current;
    a.breatheT += d * 0.4;
    a.swayT    += d * 0.3;
    const breathe = Math.sin(a.breatheT) * 0.008;
    const swayX   = Math.sin(a.swayT * 0.7) * 0.025;
    const swayY   = Math.sin(a.swayT * 0.5) * 0.015;
    a.listenTilt = lerp(a.listenTilt, isListening ? 0.12 : 0, d * 3);
    if (headRef.current) {
      headRef.current.rotation.y = swayX + a.listenTilt;
      headRef.current.rotation.x = swayY + breathe * 0.5;
      headRef.current.position.y = breathe;
    }
    if (isSpeaking) {
      a.talkPhase += d * 8;
      const raw = (Math.sin(a.talkPhase)*0.5+0.5)*0.7 + (Math.sin(a.talkPhase*1.7)*0.5+0.5)*0.3;
      a.mouth = lerp(a.mouth, raw * 0.7, d * 14);
    } else {
      a.mouth = lerp(a.mouth, 0, d * 10);
    }
    if (jawRef.current) {
      jawRef.current.position.y = -0.18 - a.mouth * 0.08;
      jawRef.current.rotation.x =  a.mouth * 0.18;
    }
    a.blinkT += d;
    if (!a.blinking && a.blinkT >= a.nextBlink) { a.blinking = true; a.blinkT = 0; }
    let lidScale = 0;
    if (a.blinking) {
      const t = a.blinkT / 0.14;
      lidScale = t < 0.5 ? t * 2 : (1 - t) * 2;
      if (a.blinkT >= 0.14) { a.blinking = false; a.blinkT = 0; a.nextBlink = 2+Math.random()*4; }
    }
    if (eyelidLRef.current) eyelidLRef.current.scale.y = Math.max(0.01, lidScale);
    if (eyelidRRef.current) eyelidRRef.current.scale.y = Math.max(0.01, lidScale);
    const browY = isListening ? 0.262 : isSpeaking ? 0.248 : 0.24;
    if (browLRef.current) browLRef.current.position.y = lerp(browLRef.current.position.y, browY, d*5);
    if (browRRef.current) browRRef.current.position.y = lerp(browRRef.current.position.y, browY, d*5);
  });

  return (
    <group ref={headRef}>
      <mesh material={m.skin} position={[0,-0.5,0]}><cylinderGeometry args={[0.13,0.16,0.28,12]} /></mesh>
      <mesh material={m.skin} scale={cfg.headScale}><sphereGeometry args={[0.38,32,24]} /></mesh>
      <group ref={jawRef} position={[0,-0.18,0]}>
        <mesh material={m.skin} position={[0,0,0.05]}><sphereGeometry args={[0.27,28,18,0,Math.PI*2,0,Math.PI*0.55]} /></mesh>
        <mesh material={m.lip} position={[0,0.04,0.27]} scale={[0.32,0.055,0.08]}><sphereGeometry args={[1,16,8]} /></mesh>
        <mesh material={m.teeth} position={[0,0.03,0.255]} scale={[0.26,0.04,0.06]}><boxGeometry /></mesh>
      </group>
      <mesh material={m.lip} position={[0,-0.14,0.275]} scale={[0.34,0.06,0.08]}><sphereGeometry args={[1,16,8]} /></mesh>
      <mesh material={m.teeth} position={[0,-0.155,0.27]} scale={[0.26,0.04,0.06]}><boxGeometry /></mesh>
      <mesh material={m.skin} position={[0,0.05,0.34]} scale={[0.11,0.13,0.1]}><sphereGeometry args={[1,16,10]} /></mesh>
      <group position={[-0.13,0.13,0.31]}>
        <mesh material={m.sclera} scale={[0.085,0.075,0.06]}><sphereGeometry args={[1,20,14]} /></mesh>
        <mesh material={m.eye} position={[0,0,0.04]} scale={[0.048,0.048,0.022]}><cylinderGeometry args={[1,1,1,24]} /></mesh>
        <mesh material={m.pupil} position={[0,0,0.055]} scale={[0.022,0.022,0.01]}><cylinderGeometry args={[1,1,1,20]} /></mesh>
        <mesh ref={eyelidLRef} material={m.lid} position={[0,0.038,0.01]} scale={[0.092,0.04,0.065]}>
          <sphereGeometry args={[1,16,8,0,Math.PI*2,0,Math.PI*0.5]} />
        </mesh>
      </group>
      <group position={[0.13,0.13,0.31]}>
        <mesh material={m.sclera} scale={[0.085,0.075,0.06]}><sphereGeometry args={[1,20,14]} /></mesh>
        <mesh material={m.eye} position={[0,0,0.04]} scale={[0.048,0.048,0.022]}><cylinderGeometry args={[1,1,1,24]} /></mesh>
        <mesh material={m.pupil} position={[0,0,0.055]} scale={[0.022,0.022,0.01]}><cylinderGeometry args={[1,1,1,20]} /></mesh>
        <mesh ref={eyelidRRef} material={m.lid} position={[0,0.038,0.01]} scale={[0.092,0.04,0.065]}>
          <sphereGeometry args={[1,16,8,0,Math.PI*2,0,Math.PI*0.5]} />
        </mesh>
      </group>
      <mesh ref={browLRef} material={m.brow} position={[-0.13,0.24,0.33]} rotation={[0,0.1,-0.15]} scale={[0.1,0.018,0.025]}><boxGeometry /></mesh>
      <mesh ref={browRRef} material={m.brow} position={[0.13,0.24,0.33]} rotation={[0,-0.1,0.15]} scale={[0.1,0.018,0.025]}><boxGeometry /></mesh>
      <mesh material={m.skin} position={[-0.37,0.04,0]} scale={[0.06,0.09,0.05]}><sphereGeometry args={[1,14,10]} /></mesh>
      <mesh material={m.skin} position={[0.37,0.04,0]} scale={[0.06,0.09,0.05]}><sphereGeometry args={[1,14,10]} /></mesh>
      {cfg.hairStyle === 'long' && (
        <group>
          <mesh material={m.hair} position={[0,0.28,-0.02]} scale={[0.42,0.18,0.42]}><sphereGeometry args={[1,24,14,0,Math.PI*2,0,Math.PI*0.55]} /></mesh>
          <mesh material={m.hair} position={[-0.34,-0.18,-0.05]} scale={[0.1,0.55,0.08]}><sphereGeometry args={[1,12,10]} /></mesh>
          <mesh material={m.hair} position={[0.34,-0.18,-0.05]} scale={[0.1,0.55,0.08]}><sphereGeometry args={[1,12,10]} /></mesh>
          <mesh material={m.hair} position={[0,-0.08,-0.32]} scale={[0.38,0.5,0.1]}><sphereGeometry args={[1,16,12]} /></mesh>
        </group>
      )}
      {cfg.hairStyle === 'short' && (
        <mesh material={m.hair} position={[0,0.22,-0.04]} scale={[0.43,0.22,0.43]}><sphereGeometry args={[1,22,14,0,Math.PI*2,0,Math.PI*0.55]} /></mesh>
      )}
      {cfg.hairStyle === 'medium' && (
        <group>
          <mesh material={m.hair} position={[0,0.25,-0.02]} scale={[0.43,0.2,0.43]}><sphereGeometry args={[1,22,14,0,Math.PI*2,0,Math.PI*0.55]} /></mesh>
          <mesh material={m.hair} position={[0,-0.04,-0.3]} scale={[0.36,0.32,0.1]}><sphereGeometry args={[1,14,10]} /></mesh>
        </group>
      )}
      {cfg.hat && (
        <group position={[0,0.35,0]}>
          <mesh material={m.hat} position={[0,0.18,0]}><cylinderGeometry args={[0.22,0.24,0.36,20]} /></mesh>
          <mesh material={m.brim} position={[0,0,0]}><cylinderGeometry args={[0.3,0.3,0.04,20]} /></mesh>
          <mesh material={m.hat} position={[0,0.38,0]} scale={[1,0.55,1]}><sphereGeometry args={[0.22,18,14]} /></mesh>
        </group>
      )}
    </group>
  );
}

export default function ChatbotAvatar3D({ character='hannah', isSpeaking=false, isListening=false, size=140, className='' }) {
  return (
    <div className={className} style={{ width:size, height:size, borderRadius:'50%', overflow:'hidden' }}>
      <Canvas camera={{ position:[0,0.05,1.35], fov:42 }} style={{ background:'transparent' }} gl={{ antialias:true, alpha:true }} dpr={Math.min(window.devicePixelRatio,2)}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[-2,3,4]} intensity={1.2} />
        <directionalLight position={[2,1,2]} intensity={0.5} />
        <directionalLight position={[0,-1,-3]} intensity={0.25} color="#aaccff" />
        <group position={[0,-0.1,0]} rotation={[0.04,0,0]}>
          <Suspense fallback={null}>
            <Head char={character} isSpeaking={isSpeaking} isListening={isListening} />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}
