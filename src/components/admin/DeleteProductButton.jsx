"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/admin/actions";

export default function DeleteProductButton({ productId }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000); // forget after 3 seconds
      return;
    }

    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors disabled:opacity-50 ${
          confirming ? "border-hot bg-hot text-white" : "border-white/20 text-mist hover:border-hot hover:text-hot"
        }`}
      >
        <span key={confirming ? "sure" : "delete"} className="rise">
          {pending ? "Deleting…" : confirming ? "Sure?" : "Delete"}
        </span>
      </button>
      {error && <p className="mt-1 text-xs font-bold text-hot">{error}</p>}
    </div>
  );
}