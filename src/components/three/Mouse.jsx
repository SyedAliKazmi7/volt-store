"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const LIME = "#b6ff2e";
const PINK = "#ff2e63";
const DARK = "#1a1d22";
const STEEL = "#3a3f4a";

function Glow({ color }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />;
}

export default function Mouse() {
  const wheel = useRef();

  useFrame((_, delta) => {
    wheel.current.rotation.x -= delta * 3;
  });

  return (
    // Tilted so we look at the top of the mouse from a three-quarter angle.
    <group rotation={[0.6, -0.5, 0]} position={[0, -0.2, 0]}>
      {/* Top shell: the upper half of a stretched sphere */}
      <mesh scale={[0.86, 0.72, 1.46]}>
        <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.28} />
      </mesh>

      {/* Base plate */}
      <mesh scale={[0.86, 1, 1.46]} position={[0, -0.03, 0]}>
        <cylinderGeometry args={[1, 1, 0.06, 64]} />
        <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Light ring around the base */}
      <group scale={[0.87, 1, 1.47]} position={[0, 0.02, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.028, 10, 96]} />
          <Glow color={LIME} />
        </mesh>
      </group>

      {/* Scroll wheel */}
      <group ref={wheel} position={[0, 0.6, -0.72]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.09, 32]} />
          <Glow color={PINK} />
        </mesh>
        {/* A dark notch so the spin is visible */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.1, 0.03, 0.05]} />
          <meshStandardMaterial color={DARK} />
        </mesh>
      </group>

      {/* Side buttons */}
      {[-0.05, 0.32].map((z) => (
        <mesh key={z} position={[-0.8, 0.3, z]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.06, 0.11, 0.3]} />
          <Glow color={LIME} />
        </mesh>
      ))}
    </group>
  );
}