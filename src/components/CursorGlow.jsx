"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glow = useRef(null);

  useEffect(() => {
    // Only on devices with a real mouse.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let frame;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (glow.current) glow.current.style.opacity = "1";
    };

    const tick = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      if (glow.current) {
        glow.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={glow} className="cursor-glow" aria-hidden="true" />;
}