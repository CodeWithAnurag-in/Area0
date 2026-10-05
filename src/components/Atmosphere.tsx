import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const ATMOSPHERE_RADIUS = 2.05;
const AtmosphereShader = {
  uniforms: {
    glowColor: { value: new THREE.Color('#38bdf8') },
    viewVector: { value: new THREE.Vector3() }
  },
  vertexShader: `
    varying float intensity;
    void main() {
      vec3 vNormal = normalize(normalMatrix * normal);
      vec3 vNormel = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
      intensity = pow(0.65 - dot(vNormal, vNormel), 2.5);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    varying float intensity;
    void main() {
      vec3 glow = glowColor * intensity;
      gl_FragColor = vec4(glow, intensity);
    }
  `
};
export const Atmosphere = () => {
  const ref = useRef<THREE.ShaderMaterial>(null!);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.uniforms.viewVector.value = state.camera.position;
    }
  });
  return (
    <mesh>
      <sphereGeometry args={[ATMOSPHERE_RADIUS, 64, 64]} />
      <shaderMaterial
        ref={ref}
        vertexShader={AtmosphereShader.vertexShader}
        fragmentShader={AtmosphereShader.fragmentShader}
        uniforms={AtmosphereShader.uniforms}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
