"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";

// x/y are fractions of the screen. Kept near the edges, away from headings.
const CAPS = [
  { x: 0.3, y: 0.42, z: -3, s: 1.0, color: "#b6ff2e" },
  { x: 0.47, y: 0.12, z: -2, s: 1.2, color: "#ff2e63" },
  { x: 0.48, y: -0.3, z: 0, s: 0.7, color: "#b6ff2e" },
  { x: -0.49, y: -0.4, z: -3, s: 1.3, color: "#ff2e63" },
  { x: -0.48, y: -0.85, z: -2, s: 1.0, color: "#b6ff2e" },
  { x: 0.46, y: -1.05, z: -1, s: 0.9, color: "#4a505c" },
  { x: -0.47, y: -1.45, z: -3, s: 1.4, color: "#ff2e63" },
  { x: 0.46, y: -1.7, z: -2, s: 1.1, color: "#b6ff2e" },
];

function Caps() {
  const group = useRef();
  const pointer = useRef({ x: 0 });
  const { width, height } = useThree((state) => state.viewport);

  useEffect(() => {
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const ease = 1 - Math.exp(-4 * delta);
    const targetY = (window.scrollY / window.innerHeight) * height * 0.35;
    group.current.position.y += (targetY - group.current.position.y) * ease;
    group.current.position.x += (pointer.current.x * 0.2 - group.current.position.x) * ease;
    group.current.rotation.y += (pointer.current.x * 0.06 - group.current.rotation.y) * ease;
  });

  return (
    <group ref={group}>
      {CAPS.map((cap, index) => (
        <Float key={index} speed={1.5 + index * 0.25} rotationIntensity={2} floatIntensity={1}>
          <RoundedBox
            args={[1, 0.6, 1]}
            radius={0.14}
            smoothness={4}
            scale={cap.s}
            position={[cap.x * width, cap.y * height, cap.z]}
            rotation={[0.6, index, 0.3]}
          >
            <meshStandardMaterial
              color={cap.color}
              emissive={cap.color}
              emissiveIntensity={cap.color === "#4a505c" ? 0 : 0.15}
              roughness={0.5}
              metalness={0}
            />
          </RoundedBox>
        </Float>
      ))}
    </group>
  );
}

export default function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 6]} intensity={1.8} />
        <pointLight position={[-6, 2, 4]} intensity={50} color="#b6ff2e" />
        <pointLight position={[6, -2, 4]} intensity={50} color="#ff2e63" />

        <Environment resolution={256}>
          <Lightformer intensity={2.5} rotation-x={Math.PI / 2} position={[0, 5, -4]} scale={[12, 6, 1]} />
        </Environment>

        <Caps />
      </Canvas>
    </div>
  );
}