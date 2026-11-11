"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useCart, cartCount } from "@/lib/cart";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/builder", label: "PC Builder" },
  { href: "/configurator", label: "Configurator" },
  { href: "/about", label: "About" },
];

// False while the page is rendered on the server, true once it is running in the browser.
const subscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // The cart lives in the browser, so only show its count once we are there.
  const isClient = useIsClient();
  const count = useCart(cartCount);
  const shownCount = isClient ? count : 0;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter" onClick={() => setOpen(false)}>
          VOLT<span className="text-volt">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-medium text-white/70 transition-colors hover:text-volt">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="rounded-full bg-volt px-5 py-2 text-sm font-bold text-ink transition-transform hover:scale-105"
          >
            Cart (
            <span key={shownCount} className="rise">
              {shownCount}
            </span>
            )
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/30 md:hidden"
          >
            <span className={`h-0.5 w-5 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="border-t border-white/10 bg-ink/95 px-4 py-4 md:hidden">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-4 text-2xl font-bold hover:bg-white/5 hover:text-volt"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}