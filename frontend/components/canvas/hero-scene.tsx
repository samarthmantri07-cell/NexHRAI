"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// --- Premium Particle Network ---
function ParticleNetwork() {
  const meshRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const geometry = useMemo(() => {
    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.03 + mouse.x * 0.08;
    meshRef.current.rotation.x = mouse.y * 0.04;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#8b7cf8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// --- Connection Lines ---
function ConnectionLines() {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const nodes: THREE.Vector3[] = [];
    const nodeCount = 35;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4
        )
      );
    }

    const linePositions: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 3.2) {
          linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    geo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!lineRef.current) return;
    lineRef.current.rotation.y = state.clock.elapsedTime * 0.025;
    lineRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#6d5fff" transparent opacity={0.15} />
    </lineSegments>
  );
}

// --- Orbiting Nodes ---
function OrbitNode({
  radius,
  speed,
  phase,
  color,
}: {
  radius: number;
  speed: number;
  phase: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t) * radius * 0.45;
    ref.current.position.z = Math.sin(t * 0.65) * 1.8;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
    </mesh>
  );
}

// --- Main Scene ---
export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 60 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#6d5fff" />
      <pointLight position={[-5, -5, 5]} intensity={0.6} color="#a78bfa" />
      <pointLight position={[0, 3, 2]} intensity={0.3} color="#22d3ee" />
      <ParticleNetwork />
      <ConnectionLines />
      <OrbitNode radius={3.5} speed={0.35} phase={0} color="#6d5fff" />
      <OrbitNode radius={2.8} speed={0.55} phase={2.1} color="#a78bfa" />
      <OrbitNode radius={4.2} speed={0.22} phase={4.2} color="#22d3ee" />
      <OrbitNode radius={3.1} speed={0.45} phase={1.0} color="#10b981" />
    </Canvas>
  );
}
