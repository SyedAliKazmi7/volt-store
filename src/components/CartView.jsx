"use client";

import Link from "next/link";
import { useCart, cartTotal, lineKey } from "@/lib/cart";
import { useIsClient } from "@/lib/useIsClient";
import { formatPKR } from "@/lib/format";
import { deliveryFeeFor, FREE_DELIVERY_OVER } from "@/lib/shipping";

export default function CartView() {
  const isClient = useIsClient();
  const items = useCart((state) => state.items);
  const setQty = useCart((state) => state.setQty);
  const remove = useCart((state) => state.remove);
  const subtotal = useCart(cartTotal);

  if (!isClient) {
    return <p className="mt-12 text-mist">Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rise mt-12 block text-center">
        <p className="text-outline text-6xl font-bold uppercase tracking-tighter sm:text-8xl">Empty</p>
        <p className="mt-4 text-mist">Your cart has nothing in it yet.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Browse the store
        </Link>
      </div>
    );
  }

  const deliveryFee = deliveryFeeFor(subtotal);
  const stepper =
    "flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold transition-colors hover:bg-volt hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white";

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
      {/* Items */}
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => {
          const key = lineKey(item);
          return (
            <li
              key={key}
              className="rise flex gap-3 rounded-2xl border border-white/10 bg-ink/55 p-3 backdrop-blur-md sm:gap-5 sm:p-4"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              {/* Picture or brand placeholder */}
              <Link
                href={`/shop/${item.slug}`}
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-steel/70 to-ink sm:h-28 sm:w-28"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-outline px-1 text-center text-xs font-bold uppercase sm:text-sm">
                    {item.brand}
                  </span>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link href={`/shop/${item.slug}`} className="line-clamp-2 text-sm font-bold hover:text-volt sm:text-lg">
                  {item.name}
                </Link>

                {/* Custom design, if this line has one */}
                {item.note && (
                  <p className="mt-1 rounded-lg border border-volt/30 bg-volt/5 px-3 py-2 text-xs text-white/80 sm:text-sm">
                    <span className="font-bold text-volt">Your design:</span> {item.note}
                  </p>
                )}

                <p className="mt-1 text-xs text-mist sm:text-sm">{formatPKR(item.price)} each</p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                  <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/5 p-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={item.qty <= 1}
                      onClick={() => setQty(key, item.qty - 1)}
                      className={stepper}
                    >
                      −
                    </button>
                    <span key={item.qty} className="rise w-7 text-center font-bold">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={item.qty >= Math.min(item.stock, 10)}
                      onClick={() => setQty(key, item.qty + 1)}
                      className={stepper}
                    >
                      +
                    </button>
                  </div>

                  <p key={item.qty} className="rise text-base font-bold text-volt sm:text-xl">
                    {formatPKR(item.price * item.qty)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => remove(key)}
                  className="mt-2 self-start text-xs text-mist underline underline-offset-4 hover:text-hot"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Summary */}
      <aside className="rise block h-fit rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md lg:sticky lg:top-24">
        <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-volt">Order summary</h2>

        <dl className="mt-5 space-y-3">
          <div className="flex justify-between">
            <dt className="text-mist">Subtotal</dt>
            <dd className="font-bold">{formatPKR(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-mist">Delivery</dt>
            <dd className="font-bold">{deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)}</dd>
          </div>
          <div className="flex items-end justify-between border-t border-white/10 pt-4">
            <dt className="font-bold">Total</dt>
            <dd key={subtotal} className="rise text-3xl font-bold text-volt">
              {formatPKR(subtotal + deliveryFee)}
            </dd>
          </div>
        </dl>

        {deliveryFee > 0 && (
          <p className="mt-3 text-xs text-mist">
            Add {formatPKR(FREE_DELIVERY_OVER - subtotal)} more for free delivery.
          </p>
        )}

        <Link href="/checkout" className="btn-primary mt-6 w-full">
          Checkout
        </Link>
        <p className="mt-3 text-center text-xs text-mist">Cash on Delivery · Pay when it arrives</p>
      </aside>
    </div>
  );
}