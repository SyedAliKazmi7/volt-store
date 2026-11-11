"use client";

import { useActionState } from "react";
import Backdrop from "@/components/three/Backdrop";
import { login } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, { error: "" });

  return (
    <>
      <Backdrop />
      <main className="relative z-10 flex min-h-svh items-center justify-center px-4 pt-16">
        <form
          action={formAction}
          className="rise block w-full max-w-md rounded-3xl border border-white/10 bg-ink/60 p-7 backdrop-blur-xl sm:p-10"
        >
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-volt">VOLT Admin</p>
          <h1 className="mt-2 text-5xl font-bold uppercase leading-[0.95] tracking-tighter">
            <span className="rise text-outline" style={{ animationDelay: "120ms" }}>
              Sign
            </span>{" "}
            <span className="rise text-volt" style={{ animationDelay: "220ms" }}>
              in
            </span>
          </h1>

          <label className="mt-8 block text-sm font-bold">
            Password
            <input
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-white/20 bg-ink/70 px-4 py-3 text-white outline-none transition-colors focus:border-volt"
            />
          </label>

          {state.error && (
            <p role="alert" className="rise mt-4 block rounded-xl border border-hot bg-hot/10 px-4 py-3 text-sm font-bold text-hot">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-60">
            {pending ? "Checking…" : "Enter the panel"}
          </button>
        </form>
      </main>
    </>
  );
}