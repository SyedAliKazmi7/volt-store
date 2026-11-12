"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, cartTotal, lineKey } from "@/lib/cart";
import { useIsClient } from "@/lib/useIsClient";
import { formatPKR } from "@/lib/format";
import { deliveryFeeFor } from "@/lib/shipping";

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan",
  "Peshawar", "Quetta", "Hyderabad", "Sialkot", "Gujranwala", "Bahawalpur",
  "Sargodha", "Abbottabad", "Other",
];

const field =
  "mt-2 w-full rounded-xl border border-white/20 bg-ink/70 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-volt";

export default function CheckoutForm() {
  const router = useRouter();
  const isClient = useIsClient();
  const items = useCart((state) => state.items);
  const clear = useCart((state) => state.clear);
  const subtotal = useCart(cartTotal);

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", notes: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((item) => ({ id: item.id, qty: item.qty, note: item.note ?? "" })),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setPlaced(true);
      clear();
      router.push(`/order/${data.orderNumber}`);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  };

  if (!isClient) return <p className="mt-12 text-mist">Loading…</p>;

  if (placed) {
    return <p className="rise mt-12 block text-2xl font-bold text-volt">Placing your order…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rise mt-12 block">
        <p className="text-mist">Your cart is empty, so there is nothing to check out.</p>
        <Link href="/shop" className="btn-primary mt-6">
          Browse the store
        </Link>
      </div>
    );
  }

  const deliveryFee = deliveryFeeFor(subtotal);

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
      {/* Details */}
      <div className="rise block rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md sm:p-7">
        <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-volt">Delivery details</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            Full name
            <input required value={form.name} onChange={update("name")} autoComplete="name" placeholder="Ali Khan" className={field} />
          </label>

          <label className="block text-sm font-bold">
            Mobile number
            <input required value={form.phone} onChange={update("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="03001234567" className={field} />
          </label>

          <label className="block text-sm font-bold sm:col-span-2">
            Email <span className="font-normal text-mist">(optional)</span>
            <input value={form.email} onChange={update("email")} type="email" autoComplete="email" placeholder="you@example.com" className={field} />
          </label>

          <label className="block text-sm font-bold sm:col-span-2">
            Complete address
            <textarea required value={form.address} onChange={update("address")} rows={3} autoComplete="street-address" placeholder="House no, street, area" className={field} />
          </label>

          <label className="block text-sm font-bold">
            City
            <select required value={form.city} onChange={update("city")} className={field}>
              <option value="" className="bg-ink">
                Select city
              </option>
              {CITIES.map((city) => (
                <option key={city} value={city} className="bg-ink">
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-bold">
            Order notes <span className="font-normal text-mist">(optional)</span>
            <input value={form.notes} onChange={update("notes")} placeholder="Call before delivery" className={field} />
          </label>
        </div>

        <h2 className="mt-8 font-mono text-xs uppercase tracking-[0.35em] text-volt">Payment</h2>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-volt bg-volt/10 px-4 py-4">
          <span className="h-4 w-4 rounded-full border-4 border-volt bg-ink" />
          <div>
            <p className="font-bold">Cash on Delivery</p>
            <p className="text-sm text-mist">Pay in cash when your order arrives.</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <aside
        className="rise block h-fit rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md lg:sticky lg:top-24"
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-volt">Your order</h2>

        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={lineKey(item)} className="text-sm">
              <div className="flex justify-between gap-4">
                <span className="line-clamp-2 font-bold">{item.name}</span>
                <span className="shrink-0 font-bold">{formatPKR(item.price * item.qty)}</span>
              </div>
              <p className="mt-0.5 text-mist">
                {item.qty} × {formatPKR(item.price)}
              </p>
              {item.note && <p className="mt-1 text-xs text-white/70">Design: {item.note}</p>}
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 border-t border-white/10 pt-5">
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
            <dd className="text-3xl font-bold text-volt">{formatPKR(subtotal + deliveryFee)}</dd>
          </div>
        </dl>

        {error && (
          <p role="alert" className="rise mt-5 block rounded-xl border border-hot bg-hot/10 px-4 py-3 text-sm font-bold text-hot">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-60">
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </aside>
    </form>
  );
}