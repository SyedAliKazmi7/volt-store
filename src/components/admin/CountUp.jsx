"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({ value, prefix = "", duration = 1200 }) {
  const [shown, setShown] = useState(0);
  const current = useRef(0); // the number on screen right now

  useEffect(() => {
    let frame;
    const from = current.current;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // fast at first, slows at the end
      const next = Math.round(from + (value - from) * eased);
      current.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {shown.toLocaleString("en-US")}
    </span>
  );
}