"use client";

import { useRef } from "react";

export default function ProductVisual({ product, discount = 0 }) {
  const panel = useRef(null);

  const handleMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = panel.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const style = panel.current.style;
    style.transform = `perspective(1200px) rotateX(${-(y - 0.5) * 10}deg) rotateY(${(x - 0.5) * 12}deg)`;
    style.setProperty("--mx", `${x * 100}%`);
    style.setProperty("--my", `${y * 100}%`);
    style.setProperty("--px", x - 0.5);
    style.setProperty("--py", y - 0.5);
  };

  const handleLeave = () => {
    const style = panel.current.style;
    style.transform = "";
    style.setProperty("--px", 0);
    style.setProperty("--py", 0);
  };

  return (
    <div
      ref={panel}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="card-tilt flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-steel/70 to-ink"
    >
      <span className="card-glare" />

      {product.images?.[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.images[0]}
          alt={product.name}
          className="card-brand-shift h-full w-full scale-110 object-cover"
        />
      ) : (
        <span className="card-brand-shift">
          <span className="card-brand text-outline block px-4 text-center text-5xl font-bold uppercase tracking-tighter opacity-70 sm:text-7xl">
            {product.brand}
          </span>
        </span>
      )}

      {discount > 0 && (
        <span className="absolute left-4 top-4 rounded-full bg-hot px-4 py-1.5 text-sm font-bold">
          -{discount}% OFF
        </span>
      )}
    </div>
  );
}