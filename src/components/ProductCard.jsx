"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPKR } from "@/lib/format";

export default function ProductCard({ product, index = 0 }) {
  const wrapper = useRef(null);
  const card = useRef(null);
  const [visible, setVisible] = useState(false);

  // Flip the card in the first time it scrolls into view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);

  const handleMove = (event) => {
    if (event.pointerType !== "mouse") return; // no tilt on touch screens
    const rect = card.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const style = card.current.style;
    style.transform = `perspective(900px) rotateX(${-(y - 0.5) * 12}deg) rotateY(${(x - 0.5) * 14}deg) translateY(-8px) scale(1.02)`;
    style.setProperty("--mx", `${x * 100}%`);
    style.setProperty("--my", `${y * 100}%`);
    style.setProperty("--px", x - 0.5);
    style.setProperty("--py", y - 0.5);
  };

  const handleLeave = () => {
    const style = card.current.style;
    style.transform = "";
    style.setProperty("--px", 0);
    style.setProperty("--py", 0);
  };

  const inStock = product.stock > 0;
  const discount =
    product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  return (
    <div
      ref={wrapper}
      className={`card-reveal h-full ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${(index % 4) * 90}ms` }}
    >
      <Link href={`/shop/${product.slug}`} className="block h-full">
        <article
          ref={card}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          className="card-tilt flex h-full flex-col rounded-2xl border border-white/10 bg-ink/55 p-3 backdrop-blur-md sm:p-4"
        >
          <span className="card-glare" />

          {/* Picture (or brand placeholder) */}
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-steel/70 to-ink">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="card-brand-shift h-full w-full scale-110 object-cover"
              />
            ) : (
              <span className="card-brand-shift">
                <span
                  className="card-brand text-outline block px-2 text-center text-2xl font-bold uppercase tracking-tighter opacity-70 sm:text-4xl"
                  style={{ animationDelay: `${(index % 5) * -0.8}s` }}
                >
                  {product.brand}
                </span>
              </span>
            )}

            {discount > 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-hot px-2.5 py-1 text-[11px] font-bold sm:text-xs">
                -{discount}%
              </span>
            )}
          </div>

          {/* Details */}
          <div className="mt-3 flex flex-1 flex-col">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-volt sm:text-xs">
              {product.brand}
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug sm:text-base">
              {product.name}
            </h3>

            <div className="mt-auto pt-3">
              <p className="text-base font-bold sm:text-xl">{formatPKR(product.price)}</p>
              {discount > 0 && (
                <p className="text-xs text-mist line-through sm:text-sm">{formatPKR(product.oldPrice)}</p>
              )}
              <p className={`mt-2 text-[11px] font-bold sm:text-xs ${inStock ? "text-volt" : "text-hot"}`}>
                {inStock ? "● In stock" : "● Out of stock"}
              </p>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}