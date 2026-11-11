"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import GraphicsCard from "@/components/three/GraphicsCard";

// Which 3D model each name stands for.
const MODELS = {
  gpu: GraphicsCard,
};

function smoothstep(from, to, value) {
  const t = Math.min(Math.max((value - from) / (to - from), 0), 1);
  return t * t * (3 - 2 * t);
}

function Rig({ target, side, children }) {
  const group = useRef();
  const time = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const smoothPointer = useRef({ x: 0, y: 0 });
  const width = useThree((state) => state.viewport.width);
  const scale = Math.min(1.15, width / 4.2);

  useEffect(() => {
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const element = target.current;
    if (!element) return;

    // 0 when the section first peeks in from the bottom, 1 when it has left at the top.
    const rect = element.getBoundingClientRect();
    const screen = window.innerHeight;
    const progress = Math.min(Math.max((screen - rect.top) / (screen + rect.height), 0), 1);
    const enter = smoothstep(0.08, 0.5, progress);

    time.current += delta;
    const ease = 1 - Math.exp(-5 * delta);
    smoothPointer.current.x += (pointer.current.x - smoothPointer.current.x) * ease;
    smoothPointer.current.y += (pointer.current.y - smoothPointer.current.y) * ease;

    const model = group.current;
    const targetX = (1 - enter) * side * 5; // slides in from its side
    const targetRotationY = side * (0.9 - progress * 1.8) + smoothPointer.current.x * 0.3;
    const targetRotationX = 0.25 - smoothPointer.current.y * 0.15;

    model.position.x += (targetX - model.position.x) * ease;
    model.position.y = Math.sin(time.current * 1.2) * 0.08;
    model.rotation.y += (targetRotationY - model.rotation.y) * ease;
    model.rotation.x += (targetRotationX - model.rotation.x) * ease;
  });

  return (
    <group ref={group} scale={scale} position={[side * 5, 0, 0]} rotation={[0.25, side * 0.9, side * 0.06]}>
      {children}
    </group>
  );
}

export default function Showcase({ model, side = "right", children }) {
  const section = useRef(null);
  const [inView, setInView] = useState(false);

  // Only run the 3D scene while this section is on (or near) the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px",
    });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  const Model = MODELS[model];
  const direction = side === "right" ? 1 : -1;

  return (
    <section
      ref={section}
      className="relative z-10 mx-auto grid max-w-[1600px] items-center gap-6 overflow-hidden px-4 py-16 sm:px-8 sm:py-24 lg:min-h-[90svh] lg:grid-cols-2"
    >
      {/* Text */}
      <div className={side === "right" ? "" : "lg:order-2"}>{children}</div>

      {/* 3D object */}
      <div className={`relative h-[300px] sm:h-[440px] lg:h-[600px] ${side === "right" ? "" : "lg:order-1"}`}>
        <div className="pointer-events-none absolute inset-[18%] rounded-full bg-volt/20 blur-[90px]" />
        <div className="absolute inset-0">
          <Canvas frameloop={inView ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 35 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[4, 6, 6]} intensity={2.2} />
            <pointLight position={[-5, 2, 4]} intensity={50} color="#b6ff2e" />
            <pointLight position={[5, -2, 4]} intensity={50} color="#ff2e63" />

            <Environment resolution={256}>
              <Lightformer intensity={2.5} rotation-x={Math.PI / 2} position={[0, 5, -4]} scale={[12, 6, 1]} />
              <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-6, 1, 0]} scale={[10, 2, 1]} color="#b6ff2e" />
              <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[6, 1, 0]} scale={[10, 2, 1]} color="#ff2e63" />
            </Environment>

            <Rig target={section} side={direction}>
              {Model && <Model />}
            </Rig>
          </Canvas>
        </div>
      </div>
    </section>
  );
}