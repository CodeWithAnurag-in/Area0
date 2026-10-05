import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Earth } from './Earth';
import { Atmosphere } from './Atmosphere';
import { BinaryField } from './BinaryField';

export const Scene = ({ progress = 0, animProgress: animProgressProp }: { progress?: number; animProgress?: number }) => {
  const { camera } = useThree();
  
  // Phase 1: Completes full zoom into the globe, clamped [0, 1]
  const animProgress = animProgressProp !== undefined
    ? Math.min(1, Math.max(0, animProgressProp))
    : Math.min(1, Math.max(0, progress));

  useFrame(() => {
    // Zoom from 8.5 (wide orbit) down to 0.4 (fully penetrates into the globe core)
    const zPos = 8.5 - (animProgress * 8.1);
    
    camera.position.set(0, animProgress * 0.1, zPos);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      
      <Stars 
        radius={100} 
        depth={50} 
        count={2000} 
        factor={3} 
        saturation={0} 
        fade 
        speed={0.1} 
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-10, -5, -10]} intensity={1.2} color="#1e40af" />
      <BinaryField progress={animProgress} />
      <Earth progress={animProgress} />
      <Atmosphere />
    </>
  );
};
