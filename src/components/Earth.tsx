import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const EARTH_RADIUS = 2;
const TEXTURE_BASE = 'https://unpkg.com/three-globe@2.31.0/example/img';
const TEXTURES = {
  day: `${TEXTURE_BASE}/earth-blue-marble.jpg`,
  topo: `${TEXTURE_BASE}/earth-topology.png`,
  spec: `${TEXTURE_BASE}/earth-water.png`,
};
export const Earth = ({ progress }: { progress: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  
  const [day, topo, spec] = useMemo(() => [
    textureLoader.load(TEXTURES.day),
    textureLoader.load(TEXTURES.topo),
    textureLoader.load(TEXTURES.spec),
  ], [textureLoader]);
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Angular velocity deceleration: rotation smoothly drops to 0 as camera approaches penetration
      // Eliminates high-speed tangential spin artifact when entering the sphere surface
      const rotMultiplier = Math.max(0, 1 - Math.min(1, progress / 0.65));
      const rotationSpeed = delta * 0.15 * rotMultiplier;
      groupRef.current.rotation.y += rotationSpeed;
    }
  });
  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* Photorealistic 3D Earth */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial 
          map={day} 
          bumpMap={topo} 
          bumpScale={0.1}
          roughnessMap={spec}
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
