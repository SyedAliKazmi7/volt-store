"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function AddToCart({ product }) {
  const add = useCart((state) => state.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-full border border-white/20 bg-white/5 px-8 py-4 font-bold text-white/50 sm:w-auto"
      >
        Out of stock
      </button>
    );
  }

  const max = Math.min(product.stock, 10);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const stepper =
    "flex h-11 w-11 items-center justify-center rounded-full text-xl font-bold transition-colors hover:bg-volt hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Quantity */}
      <div className="flex items-center justify-between gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 sm:justify-start">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={qty <= 1}
          onClick={() => setQty((value) => value - 1)}
          className={stepper}
        >
          −
        </button>
        <span key={qty} className="rise w-8 text-center text-lg font-bold">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={qty >= max}
          onClick={() => setQty((value) => value + 1)}
          className={stepper}
        >
          +
        </button>
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={handleAdd}
        className={`btn-primary flex-1 sm:flex-none ${added ? "scale-105" : ""}`}
      >
        <span key={added ? "added" : "idle"} className="rise">
          {added ? "✓ Added to cart" : "Add to cart"}
        </span>
      </button>

      {added && (
        <Link href="/cart" className="rise text-center font-bold text-volt underline underline-offset-4">
          View cart →
        </Link>
      )}
    </div>
  );
}