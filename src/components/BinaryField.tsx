import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const EARTH_RADIUS = 2;
const SHELL_RADIUS = EARTH_RADIUS * 1.25; 
const MAX_BITS = 800; // High-density orbital shell of binary data
export const BinaryField = ({ progress }: { progress: number }) => {
  const meshRef0 = useRef<THREE.InstancedMesh>(null!);
  const meshRef1 = useRef<THREE.InstancedMesh>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  // Sharp textures for binary digits
  const binaryTextures = useMemo(() => {
    const createTex = (char: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, 128, 128);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 100px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };
    return [createTex('0'), createTex('1')];
  }, []);
  // Full Spherical Fibonacci Distribution with Stochastic Value Assignment
  const bitPositions = useMemo(() => {
    const points: { pos: THREE.Vector3; matrix: THREE.Matrix4; threshold: number; char: number }[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;
    for (let i = 0; i < MAX_BITS; i++) {
      // Fibonacci spiral mapping
      const t = i / (MAX_BITS - 1);
      const inclination = Math.acos(1 - 2 * t); 
      const azimuth = angleIncrement * i; 
      const x = Math.sin(inclination) * Math.cos(azimuth);
      const y = Math.cos(inclination);
      const z = Math.sin(inclination) * Math.sin(azimuth);
      const pos = new THREE.Vector3(x, y, z).multiplyScalar(SHELL_RADIUS);
      const matrix = new THREE.Matrix4();
      matrix.setPosition(pos);
      // INITIAL STATE RANDOMIZATION FIX:
      // 1. Maintain 50% initial density using a checkerboard index check
      const isInitial = (i % 2 === 0); 
      
      // 2. Randomize reveal order for the non-initial 50%
      const threshold = isInitial ? 0 : Math.random();
      // 3. ASSIGN VALUES COMPLETELY AT RANDOM
      // Decoupled from threshold logic to ensure both groups have a 50/50 mix of 0s and 1s
      const char = Math.random() > 0.5 ? 1 : 0;
      points.push({ pos, matrix, threshold, char });
    }
    return points;
  }, []);
  // Global Lattice Topology
  const lineGeometry = useMemo(() => {
    const points = bitPositions.map(b => b.pos);
    const linePoints: THREE.Vector3[] = [];
    const thresholdAttr: number[] = [];
    for (let i = 0; i < MAX_BITS; i++) {
      const neighbors: { index: number; dist: number }[] = [];
      for (let j = i + 1; j < Math.min(i + 40, MAX_BITS); j++) {
        const d = points[i].distanceTo(points[j]);
        if (d < 0.6) { 
          neighbors.push({ index: j, dist: d });
        }
      }
      neighbors.sort((a, b) => a.dist - b.dist).slice(0, 2).forEach(n => {
        linePoints.push(points[i], points[n.index]);
        const lineThreshold = Math.max(bitPositions[i].threshold, bitPositions[n.index].threshold);
        thresholdAttr.push(lineThreshold, lineThreshold);
      });
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    geometry.setAttribute('threshold', new THREE.BufferAttribute(new Float32Array(thresholdAttr), 1));
    return geometry;
  }, [bitPositions]);
  // Filter thresholds into their respective character buffers
  const bits0 = useMemo(() => bitPositions.filter(b => b.char === 0), [bitPositions]);
  const bits1 = useMemo(() => bitPositions.filter(b => b.char === 1), [bitPositions]);
  
  const threshold0 = useMemo(() => new Float32Array(bits0.map(b => b.threshold)), [bits0]);
  const threshold1 = useMemo(() => new Float32Array(bits1.map(b => b.threshold)), [bits1]);
  useEffect(() => {
    if (meshRef0.current) {
      bits0.forEach((d, i) => meshRef0.current.setMatrixAt(i, d.matrix));
      meshRef0.current.instanceMatrix.needsUpdate = true;
    }
    if (meshRef1.current) {
      bits1.forEach((d, i) => meshRef1.current.setMatrixAt(i, d.matrix));
      meshRef1.current.instanceMatrix.needsUpdate = true;
    }
  }, [bits0, bits1]);
  const bitShader = useMemo(() => ({
    uniforms: { 
      progress: { value: 0 }, 
      map: { value: null },
      uSize: { value: 0.28 } 
    },
    vertexShader: `
      uniform float progress;
      uniform float uSize;
      attribute float threshold;
      varying float vAlpha;
      varying vec2 vUv;
      void main() {
        vAlpha = progress >= threshold ? 1.0 : 0.0;
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        mvPosition.xy += position.xy * uSize; 
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      varying float vAlpha;
      varying vec2 vUv;
      void main() {
        vec4 texColor = texture2D(map, vUv);
        if (texColor.a < 0.2 || vAlpha < 0.1) discard;
        gl_FragColor = vec4(1.0, 1.0, 1.0, texColor.a * 0.85);
      }
    `
  }), []);
  const lineShader = useMemo(() => ({
    uniforms: { progress: { value: 0 } },
    vertexShader: `
      uniform float progress;
      attribute float threshold;
      varying float vAlpha;
      void main() {
        vAlpha = progress >= threshold ? 0.08 : 0.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(0.3, 0.6, 1.0, vAlpha);
      }
    `
  }), []);
  useFrame((state, delta) => {
    // Decelerate rotation to zero before camera penetrates the shell
    const rotMultiplier = Math.max(0, 1 - Math.min(1, progress / 0.65));
    const rotSpeed = delta * 0.08 * rotMultiplier;
    [meshRef0, meshRef1, linesRef].forEach(ref => {
      if (ref.current) {
        ref.current.rotation.y += rotSpeed;
        const mat = ref.current.material as THREE.ShaderMaterial;
        mat.uniforms.progress.value = progress;
      }
    });
  });
  return (
    <group rotation={[0.3, 0, 0]}>
      {/* Delicate Network Mesh */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <shaderMaterial
          transparent
          vertexShader={lineShader.vertexShader}
          fragmentShader={lineShader.fragmentShader}
          uniforms={lineShader.uniforms}
        />
      </lineSegments>
      {/* Bit 0 Nodes */}
      <instancedMesh ref={meshRef0} args={[null!, null!, bits0.length]}>
        <planeGeometry args={[1, 1]}>
          <instancedBufferAttribute attach="attributes-threshold" args={[threshold0, 1]} count={threshold0.length} array={threshold0} itemSize={1} />
        </planeGeometry>
        <shaderMaterial
          transparent
          vertexShader={bitShader.vertexShader}
          fragmentShader={bitShader.fragmentShader}
          uniforms={{ ...bitShader.uniforms, map: { value: binaryTextures[0] } }}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
      {/* Bit 1 Nodes */}
      <instancedMesh ref={meshRef1} args={[null!, null!, bits1.length]}>
        <planeGeometry args={[1, 1]}>
          <instancedBufferAttribute attach="attributes-threshold" args={[threshold1, 1]} count={threshold1.length} array={threshold1} itemSize={1} />
        </planeGeometry>
        <shaderMaterial
          transparent
          vertexShader={bitShader.vertexShader}
          fragmentShader={bitShader.fragmentShader}
          uniforms={{ ...bitShader.uniforms, map: { value: binaryTextures[1] } }}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
};
