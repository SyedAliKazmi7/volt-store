"use client";

import { useState, useTransition } from "react";
import { setOrderStatus } from "@/app/admin/actions";
import { ORDER_STATUSES, STATUS_STYLES } from "@/lib/orderStatus";

export default function OrderStatusSelect({ orderId, status }) {
  const [current, setCurrent] = useState(status);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const handleChange = (event) => {
    const next = event.target.value;
    const previous = current;
    setCurrent(next);
    setError("");

    startTransition(async () => {
      const result = await setOrderStatus(orderId, next);
      if (result?.error) {
        setCurrent(previous);
        setError(result.error);
      }
    });
  };

  return (
    <div>
      <select
        value={current}
        onChange={handleChange}
        disabled={pending || current === "cancelled"}
        aria-label="Order status"
        className={`rounded-full border bg-ink px-4 py-2 text-sm font-bold uppercase outline-none transition-colors disabled:opacity-60 ${STATUS_STYLES[current]}`}
      >
        {ORDER_STATUSES.map((option) => (
          <option key={option} value={option} className="bg-ink text-white">
            {option}
          </option>
        ))}
      </select>
      {pending && <p className="mt-1 text-xs text-mist">Saving…</p>}
      {error && <p className="mt-1 text-xs font-bold text-hot">{error}</p>}
    </div>
  );
}