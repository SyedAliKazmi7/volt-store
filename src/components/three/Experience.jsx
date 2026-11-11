"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import Keyboard from "./Keyboard";

// One pose per page section. x is a fraction of the screen width.
const POSES = [
  { x: 0, y: -0.75, rx: 0.9, ry: -0.2, rz: 0.03, s: 0.8, explode: 0 },
  { x: 0.22, y: -0.1, rx: 0.6, ry: 0.55, rz: 0, s: 0.62, explode: 1 },
  { x: -0.22, y: 0, rx: 1.3, ry: 0, rz: -0.3, s: 0.6, explode: 0 },
  { x: 0, y: -0.9, rx: 0.8, ry: 0.3, rz: -0.03, s: 0.8, explode: 0 },
];

// Big keycaps floating in the background. x/y are fractions of the screen.
const CAPS = [
  { x: -0.42, y: 0.28, z: -2, s: 0.9, color: "#b6ff2e" },
  { x: 0.44, y: 0.3, z: -3, s: 1.2, color: "#ff2e63" },
  { x: 0.45, y: -0.12, z: 0.5, s: 0.6, color: "#b6ff2e" },
  { x: -0.46, y: -0.62, z: -1, s: 0.8, color: "#4a505c" },
  { x: -0.45, y: -0.95, z: -1, s: 1.0, color: "#ff2e63" },
  { x: 0.42, y: -1.1, z: -2, s: 1.1, color: "#b6ff2e" },
  { x: 0.05, y: -1.5, z: -3, s: 1.3, color: "#4a505c" },
];

function samplePose(progress) {
  const clamped = Math.min(Math.max(progress, 0), 1) * (POSES.length - 1);
  const index = Math.min(Math.floor(clamped), POSES.length - 2);
  let t = clamped - index;
  t = t * t * (3 - 2 * t); // smoothstep
  const from = POSES[index];
  const to = POSES[index + 1];
  const pose = {};
  for (const key in from) pose[key] = from[key] + (to[key] - from[key]) * t;
  return pose;
}

function Stage() {
  const keyboardGroup = useRef();
  const capsGroup = useRef();
  const motion = useRef({ explode: 0 });
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const smoothPointer = useRef({ x: 0, y: 0 });

  const { width, height } = useThree((state) => state.viewport);
  const narrow = width < height; // phones in portrait
  const baseScale = Math.min(0.42, (width * 0.92) / 17);

  useEffect(() => {
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    // How far through the #story block have we scrolled? 0 -> 1
    const story = document.getElementById("story");
    let target = 0;
    if (story) {
      const max = story.offsetHeight - window.innerHeight;
      const top = story.getBoundingClientRect().top;
      target = max > 0 ? Math.min(Math.max(-top / max, 0), 1) : 0;
    }

    const ease = 1 - Math.exp(-5 * delta);
    progress.current += (target - progress.current) * ease;
    smoothPointer.current.x += (pointer.current.x - smoothPointer.current.x) * ease;
    smoothPointer.current.y += (pointer.current.y - smoothPointer.current.y) * ease;

    const pose = samplePose(progress.current);
    const group = keyboardGroup.current;

    group.position.x = narrow ? 0 : pose.x * width;
    group.position.y = narrow ? -height * 0.12 : pose.y;
    group.rotation.x = pose.rx - smoothPointer.current.y * 0.12;
    group.rotation.y = pose.ry + smoothPointer.current.x * 0.25;
    group.rotation.z = pose.rz;
    // On phones the keyboard is already fitted to the width, so keep it full size.
    group.scale.setScalar(baseScale * (narrow ? 1 : pose.s));

    motion.current.explode = pose.explode;
    capsGroup.current.position.y = progress.current * height * 0.9;
  });

  return (
    <>
      <group ref={keyboardGroup}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
          <Keyboard motion={motion} />
        </Float>
      </group>

      <group ref={capsGroup}>
        {CAPS.map((cap, index) => (
          <Float key={index} speed={1.5 + index * 0.3} rotationIntensity={2} floatIntensity={2}>
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
    </>
  );
}

export default function Experience() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 35 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 6]} intensity={1.8} />
      <pointLight position={[-6, 2, 4]} intensity={50} color="#b6ff2e" />
      <pointLight position={[6, -2, 4]} intensity={50} color="#ff2e63" />

      <Environment resolution={256}>
        <Lightformer intensity={2.5} rotation-x={Math.PI / 2} position={[0, 5, -4]} scale={[12, 6, 1]} />
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-6, 1, 0]} scale={[10, 2, 1]} color="#b6ff2e" />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[6, 1, 0]} scale={[10, 2, 1]} color="#ff2e63" />
      </Environment>

      <Stage />
    </Canvas>
  );
}