"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";

const STAGGER = 0.26; // seconds between one part and the next
const DURATION = 1.0; // seconds each part takes to arrive
const MAX_SCALE = 1.4; // how big the finished PC is; raise or lower to taste

const LIME = "#b6ff2e";
const PINK = "#ff2e63";
const STEEL = "#3a3f4a";
const DARK = "#1a1d22";
const SILVER = "#c9ced8";

// A fixed "random" number between 0 and 1 for a given seed.
function seeded(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

// Overshoots slightly, then settles: gives the "snap into place" feel.
function easeOutBack(p) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
}

function Glow({ color, ...props }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} {...props} />;
}

function FlyIn({ index, position, children }) {
  const group = useRef();
  const time = useRef(0);

  // Where this part starts: far away, in a different direction for every part.
  const start = useMemo(() => {
    const angle = seeded(index + 1) * Math.PI * 2;
    const radius = 6 + seeded(index + 11) * 3;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.8,
      z: seeded(index + 21) * 5,
      rx: (seeded(index + 31) - 0.5) * 6,
      ry: (seeded(index + 41) - 0.5) * 6,
      rz: (seeded(index + 51) - 0.5) * 6,
    };
  }, [index]);

  useFrame((_, delta) => {
    time.current += Math.min(delta, 0.05);
    const raw = (time.current - index * STAGGER) / DURATION;
    const part = group.current;

    if (raw <= 0) {
      part.visible = false;
      return;
    }

    part.visible = true;
    const remaining = 1 - easeOutBack(Math.min(raw, 1));
    part.position.set(
      position[0] + start.x * remaining,
      position[1] + start.y * remaining,
      position[2] + start.z * remaining
    );
    part.rotation.set(start.rx * remaining, start.ry * remaining, start.rz * remaining);
  });

  return (
    <group ref={group} visible={false}>
      {children}
    </group>
  );
}

function Rig({ children }) {
  const group = useRef();
  const time = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const width = useThree((state) => state.viewport.width);

  // Fill most of the stage, but shrink on very narrow screens so nothing is cut off.
  const scale = Math.min(MAX_SCALE, width / 3.1);

  useEffect(() => {
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    time.current += delta;
    const ease = 1 - Math.exp(-4 * delta);
    const targetY = -0.55 + Math.sin(time.current * 0.5) * 0.25 + pointer.current.x * 0.35;
    const targetX = 0.12 - pointer.current.y * 0.12;
    group.current.rotation.y += (targetY - group.current.rotation.y) * ease;
    group.current.rotation.x += (targetX - group.current.rotation.x) * ease;
  });

  return (
    <group ref={group} scale={scale} rotation={[0.12, -0.55, 0]}>
      {children}
    </group>
  );
}

function Computer() {
  return (
    <Rig>
      {/* 0. Back plate of the case */}
      <FlyIn index={0} position={[0, 0, -0.55]}>
        <mesh>
          <boxGeometry args={[2.2, 2.4, 0.05]} />
          <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.4} />
        </mesh>
      </FlyIn>

      {/* 1. Top, bottom and rear walls */}
      <FlyIn index={1} position={[0, 0, 0]}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[2.25, 0.05, 1.1]} />
          <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[2.25, 0.05, 1.1]} />
          <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-1.1, 0, 0]}>
          <boxGeometry args={[0.05, 2.4, 1.1]} />
          <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.3} />
        </mesh>
      </FlyIn>

      {/* 2. Power supply */}
      <FlyIn index={2} position={[-0.55, -0.92, -0.08]}>
        <mesh>
          <boxGeometry args={[1.0, 0.5, 0.85]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.43]}>
          <boxGeometry args={[0.6, 0.07, 0.02]} />
          <Glow color={LIME} />
        </mesh>
      </FlyIn>

      {/* 3. Motherboard */}
      <FlyIn index={3} position={[-0.2, 0.25, -0.5]}>
        <mesh>
          <boxGeometry args={[1.6, 1.5, 0.04]} />
          <meshStandardMaterial color="#232a36" metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh position={[-0.62, 0.35, 0.06]}>
          <boxGeometry args={[0.12, 0.5, 0.1]} />
          <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.35, -0.5, 0.05]}>
          <boxGeometry args={[0.3, 0.3, 0.06]} />
          <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.3} />
        </mesh>
      </FlyIn>

      {/* 4. Processor */}
      <FlyIn index={4} position={[-0.3, 0.55, -0.46]}>
        <mesh>
          <boxGeometry args={[0.28, 0.28, 0.04]} />
          <meshStandardMaterial color={SILVER} metalness={0.95} roughness={0.2} />
        </mesh>
      </FlyIn>

      {/* 5. CPU cooler */}
      <FlyIn index={5} position={[-0.3, 0.55, -0.22]}>
        <mesh>
          <boxGeometry args={[0.42, 0.5, 0.34]} />
          <meshStandardMaterial color="#aeb4c0" metalness={0.9} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 32]} />
          <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.235]}>
          <torusGeometry args={[0.2, 0.018, 10, 40]} />
          <Glow color={LIME} />
        </mesh>
      </FlyIn>

      {/* 6 and 7. Memory sticks */}
      <FlyIn index={6} position={[0.12, 0.55, -0.37]}>
        <mesh>
          <boxGeometry args={[0.04, 0.62, 0.22]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.045, 0.62, 0.03]} />
          <Glow color={PINK} />
        </mesh>
      </FlyIn>
      <FlyIn index={7} position={[0.22, 0.55, -0.37]}>
        <mesh>
          <boxGeometry args={[0.04, 0.62, 0.22]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.045, 0.62, 0.03]} />
          <Glow color={LIME} />
        </mesh>
      </FlyIn>

      {/* 8. SSD */}
      <FlyIn index={8} position={[0.32, 0.02, -0.465]}>
        <mesh>
          <boxGeometry args={[0.42, 0.1, 0.02]} />
          <meshStandardMaterial color={SILVER} metalness={0.8} roughness={0.3} />
        </mesh>
      </FlyIn>

      {/* 9. Graphics card */}
      <FlyIn index={9} position={[-0.25, -0.22, -0.18]}>
        <RoundedBox args={[1.25, 0.22, 0.55]} radius={0.03} smoothness={3}>
          <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0, 0.28]}>
          <boxGeometry args={[1.0, 0.05, 0.012]} />
          <Glow color={LIME} />
        </mesh>
        {[-0.32, 0.32].map((x) => (
          <mesh key={x} position={[x, -0.115, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
            <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.4} />
          </mesh>
        ))}
      </FlyIn>

      {/* 10. Front panel with fans */}
      <FlyIn index={10} position={[1.1, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.05, 2.4, 1.1]} />
          <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.3} />
        </mesh>
        {[0.72, 0, -0.72].map((y, i) => (
          <mesh key={y} position={[0.035, y, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.3, 0.025, 10, 48]} />
            <Glow color={i === 1 ? PINK : LIME} />
          </mesh>
        ))}
      </FlyIn>
    </Rig>
  );
}

export default function PCAssembly() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.1, 7.2], fov: 35 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} />
      <pointLight position={[-5, 2, 4]} intensity={50} color={LIME} />
      <pointLight position={[5, -2, 4]} intensity={50} color={PINK} />

      <Environment resolution={256}>
        <Lightformer intensity={2.5} rotation-x={Math.PI / 2} position={[0, 5, -4]} scale={[12, 6, 1]} />
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-6, 1, 0]} scale={[10, 2, 1]} color={LIME} />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[6, 1, 0]} scale={[10, 2, 1]} color={PINK} />
      </Environment>

      <Computer />
    </Canvas>
  );
}