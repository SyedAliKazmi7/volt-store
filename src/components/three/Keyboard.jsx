"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { KEYS } from "@/lib/keyboardLayout";

const GAP = 0.1;
const CAP_HEIGHT = 0.45;
const CAP_DEPTH = 1 - GAP;
const CAP_Y = 0.1 + CAP_HEIGHT / 2;

export default function Keyboard({
  caseColor = "#3a3f4a",
  keycapColor = "#2b2f38",
  modColor = "#1a1d22",
  accentColor = "#b6ff2e",
  glowColor = "#b6ff2e",
  glowColorB = "#ff2e63",
  cycleGlow = true,
  motion,
  ...props
}) {
  const keyRefs = useRef([]);
  const caseRef = useRef();
  const plateMaterial = useRef();
  const time = useRef(0);

  // One geometry per key width, shared by all keys of that width.
  const geometries = useMemo(() => {
    const map = {};
    for (const key of KEYS) {
      if (!map[key.w]) {
        map[key.w] = new RoundedBoxGeometry(key.w - GAP, CAP_HEIGHT, CAP_DEPTH, 3, 0.08);
      }
    }
    return map;
  }, []);

  // One material per key kind.
  const materials = useMemo(
    () => ({
      alpha: new THREE.MeshStandardMaterial({ color: keycapColor, roughness: 0.5, metalness: 0.15 }),
      mod: new THREE.MeshStandardMaterial({ color: modColor, roughness: 0.5, metalness: 0.15 }),
      accent: new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 0.2,
        roughness: 0.5,
        metalness: 0,
      }),
    }),
    [keycapColor, modColor, accentColor]
  );

  const glowA = useMemo(() => new THREE.Color(glowColor), [glowColor]);
  const glowB = useMemo(() => new THREE.Color(glowColorB), [glowColorB]);

  // A fixed "random" lift amount per key, so the explode looks organic.
  const lifts = useMemo(
    () =>
      KEYS.map((_, index) => {
        const value = Math.sin((index + 1) * 12.9898) * 43758.5453;
        return value - Math.floor(value);
      }),
    []
  );

  useFrame((_, delta) => {
    time.current += delta;
    const t = time.current;
    const explode = motion?.current?.explode ?? 0;

    for (let i = 0; i < KEYS.length; i++) {
      const mesh = keyRefs.current[i];
      if (!mesh) continue;
      const key = KEYS[i];
      const wave = Math.sin(t * 2.2 + key.x * 0.45 + key.z * 0.7) * 0.06;
      mesh.position.y = CAP_Y + wave + explode * (0.6 + lifts[i] * 2.2);
    }

    if (caseRef.current) {
      caseRef.current.position.y = -0.5 - explode * 0.9;
    }

    if (plateMaterial.current) {
      const mix = cycleGlow ? (Math.sin(t * 0.9) + 1) / 2 : 0;
      plateMaterial.current.emissive.lerpColors(glowA, glowB, mix);
    }
  });

  return (
    <group {...props}>
      {/* Case */}
      <RoundedBox ref={caseRef} args={[17, 1, 6]} radius={0.35} smoothness={4} position={[0, -0.5, 0]}>
        <meshStandardMaterial color={caseColor} roughness={0.3} metalness={0.7} />
      </RoundedBox>

      {/* Glowing plate (RGB shows through the gaps between keys) */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[16.04, 0.06, 5.04]} />
        <meshStandardMaterial
          ref={plateMaterial}
          color="#000000"
          emissive={glowColor}
          emissiveIntensity={1.1}
          toneMapped={false}
        />
      </mesh>

      {/* Keycaps */}
      {KEYS.map((key, index) => (
        <mesh
          key={key.code}
          ref={(mesh) => {
            keyRefs.current[index] = mesh;
          }}
          geometry={geometries[key.w]}
          material={materials[key.kind]}
          position={[key.x, CAP_Y, key.z]}
        />
      ))}
    </group>
  );
}