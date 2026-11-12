"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import Keyboard from "@/components/three/Keyboard";

const LIME = "#b6ff2e";
const PINK = "#ff2e63";

function Stage({ config, pressedRef }) {
  const groupRef = useRef();
  const pulseRef = useRef(0);
  const width = useThree((state) => state.viewport.width);
  const scale = Math.min(0.52, (width * 0.92) / 17);

  // Every change to the design gives the keyboard a little hop.
  const signature = [config.case, config.keycap, config.mod, config.accent, config.glow, config.cycle].join("|");
  useEffect(() => {
    pulseRef.current = 1;
  }, [signature]);

  useFrame((_, delta) => {
    pulseRef.current *= Math.exp(-6 * delta);
    const pulse = pulseRef.current;
    const group = groupRef.current;
    group.scale.setScalar(scale * (1 + pulse * 0.07));
    group.position.y = pulse * 0.35;
    group.rotation.y = pulse * 0.25;
  });

  // The glow drifts between the chosen colour and a contrasting one.
  const secondGlow = config.glow === PINK ? LIME : PINK;

  return (
    <group ref={groupRef} scale={scale}>
      <Keyboard
        caseColor={config.case}
        keycapColor={config.keycap}
        modColor={config.mod}
        accentColor={config.accent}
        glowColor={config.glow}
        glowColorB={secondGlow}
        cycleGlow={config.cycle}
        pressedRef={pressedRef}
      />
    </group>
  );
}

export default function ConfiguratorScene({ config }) {
  const pressedRef = useRef(new Set());

  // Mirror the visitor's real keyboard onto the 3D one.
  useEffect(() => {
    const pressed = pressedRef.current;

    const onDown = (event) => {
      pressed.add(event.code);
      // Stop the space bar from scrolling the page while "typing" on the model.
      if (event.code === "Space" && document.activeElement === document.body) {
        event.preventDefault();
      }
    };
    const onUp = (event) => pressed.delete(event.code);
    const onBlur = () => pressed.clear();

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 6.5, 8.5], fov: 35 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 6]} intensity={2} />
      <pointLight position={[-6, 3, 4]} intensity={50} color={LIME} />
      <pointLight position={[6, 3, 4]} intensity={50} color={PINK} />

      <Environment resolution={256}>
        <Lightformer intensity={2.5} rotation-x={Math.PI / 2} position={[0, 5, -4]} scale={[12, 6, 1]} />
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-6, 1, 0]} scale={[10, 2, 1]} color={LIME} />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[6, 1, 0]} scale={[10, 2, 1]} color={PINK} />
      </Environment>

      <Stage config={config} pressedRef={pressedRef} />

      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.35} maxPolarAngle={1.35} />
    </Canvas>
  );
}