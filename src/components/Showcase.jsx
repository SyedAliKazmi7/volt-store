"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import GraphicsCard from "@/components/three/GraphicsCard";
import Mouse from "@/components/three/Mouse";
import { ComputerParts } from "@/components/three/PCAssembly";

// The PC builds itself as you scroll: the further down, the more parts are in place.
function ScrollPC({ progressRef }) {
  const driveRef = useRef(0);

  useFrame(() => {
    driveRef.current = Math.min(Math.max((progressRef.current - 0.12) / 0.45, 0), 1);
  });

  return (
    <group scale={1.25}>
      <ComputerParts drive={driveRef} />
    </group>
  );
}

// base: starting turn. turn: how far it rotates while you scroll. slide: glides in from the side.
const MODELS = {
  gpu: { Component: GraphicsCard, base: 0.9, turn: 1.8, slide: true },
  mouse: { Component: Mouse, base: 0.9, turn: 1.8, slide: true },
  pc: { Component: ScrollPC, base: -0.3, turn: 0.5, slide: false },
};

function smoothstep(from, to, value) {
  const t = Math.min(Math.max((value - from) / (to - from), 0), 1);
  return t * t * (3 - 2 * t);
}

function Rig({ targetRef, progressRef, side, settings, children }) {
  const groupRef = useRef();
  const timeRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const smoothPointerRef = useRef({ x: 0, y: 0 });
  const width = useThree((state) => state.viewport.width);
  const scale = Math.min(1.15, width / 4.2);

  useEffect(() => {
    const onMove = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const element = targetRef.current;
    if (!element) return;

    // 0 when the section first peeks in from the bottom, 1 when it has left at the top.
    const rect = element.getBoundingClientRect();
    const screen = window.innerHeight;
    const progress = Math.min(Math.max((screen - rect.top) / (screen + rect.height), 0), 1);
    progressRef.current = progress;
    const enter = smoothstep(0.08, 0.5, progress);

    timeRef.current += delta;
    const ease = 1 - Math.exp(-5 * delta);
    const smooth = smoothPointerRef.current;
    smooth.x += (pointerRef.current.x - smooth.x) * ease;
    smooth.y += (pointerRef.current.y - smooth.y) * ease;

    const model = groupRef.current;
    const targetX = settings.slide ? (1 - enter) * side * 5 : 0;
    const targetRotationY = side * (settings.base - progress * settings.turn) + smooth.x * 0.3;
    const targetRotationX = 0.25 - smooth.y * 0.15;

    model.position.x += (targetX - model.position.x) * ease;
    model.position.y = Math.sin(timeRef.current * 1.2) * 0.08;
    model.rotation.y += (targetRotationY - model.rotation.y) * ease;
    model.rotation.x += (targetRotationX - model.rotation.x) * ease;
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      position={[settings.slide ? side * 5 : 0, 0, 0]}
      rotation={[0.25, side * settings.base, side * 0.06]}
    >
      {children}
    </group>
  );
}

export default function Showcase({ model, side = "right", children }) {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const [inView, setInView] = useState(false);

  // Only run the 3D scene while this section is on (or near) the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px",
    });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const settings = MODELS[model];
  const direction = side === "right" ? 1 : -1;

  return (
    <section
      ref={sectionRef}
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

            {settings && (
              <Rig targetRef={sectionRef} progressRef={progressRef} side={direction} settings={settings}>
                <settings.Component progressRef={progressRef} />
              </Rig>
            )}
          </Canvas>
        </div>
      </div>
    </section>
  );
}