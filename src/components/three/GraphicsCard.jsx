"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

const LIME = "#b6ff2e";
const PINK = "#ff2e63";
const STEEL = "#3a3f4a";
const DARK = "#1a1d22";
const SILVER = "#c9ced8";

const BLADE_ANGLES = Array.from({ length: 9 }, (_, index) => (index / 9) * Math.PI * 2);

function Glow({ color }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />;
}

function Fan({ x, color }) {
  const blades = useRef();

  useFrame((_, delta) => {
    blades.current.rotation.z -= delta * 5;
  });

  return (
    <group position={[x, 0, 0.26]}>
      {/* Dark well the fan sits in */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.47, 0.47, 0.04, 48]} />
        <meshStandardMaterial color="#0e1014" roughness={0.8} />
      </mesh>

      {/* Spinning blades */}
      <group ref={blades} position={[0, 0, 0.035]}>
        {BLADE_ANGLES.map((angle) => (
          <group key={angle} rotation={[0, 0, angle]}>
            <mesh position={[0.25, 0, 0]} rotation={[0.35, 0, 0]}>
              <boxGeometry args={[0.36, 0.1, 0.015]} />
              <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.06, 24]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {/* Light ring around the fan */}
      <mesh position={[0, 0, 0.05]}>
        <torusGeometry args={[0.47, 0.02, 10, 56]} />
        <Glow color={color} />
      </mesh>
    </group>
  );
}

export default function GraphicsCard() {
  return (
    <group>
      {/* Shroud */}
      <RoundedBox args={[3.2, 1.4, 0.5]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
      </RoundedBox>

      {/* Metal backplate */}
      <mesh position={[0, 0, -0.265]}>
        <boxGeometry args={[3.2, 1.4, 0.03]} />
        <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Fans */}
      <Fan x={-1.03} color={LIME} />
      <Fan x={0} color={PINK} />
      <Fan x={1.03} color={LIME} />

      {/* Light strip along the top edge */}
      <mesh position={[0, 0.715, 0]}>
        <boxGeometry args={[2.6, 0.035, 0.2]} />
        <Glow color={LIME} />
      </mesh>

      {/* Mounting bracket */}
      <mesh position={[-1.63, -0.05, 0]}>
        <boxGeometry args={[0.05, 1.6, 0.62]} />
        <meshStandardMaterial color={SILVER} metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Slot connector */}
      <mesh position={[-0.6, -0.77, -0.1]}>
        <boxGeometry args={[1.3, 0.14, 0.03]} />
        <meshStandardMaterial color="#d4a84a" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}