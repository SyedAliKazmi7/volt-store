import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

const STORE_LINKS = [
  { href: "/shop", label: "All products" },
  { href: "/builder", label: "PC Builder" },
  { href: "/configurator", label: "Keyboard configurator" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="text-3xl font-bold tracking-tighter">
            VOLT<span className="text-volt">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-mist">
            Gaming gear, PC parts and consoles, delivered across Pakistan with cash on delivery.
          </p>
        </div>

        <nav aria-label="Categories">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-volt">Shop</p>
          <ul className="mt-4 space-y-2">
            {CATEGORIES.slice(0, 7).map((category) => (
              <li key={category.slug}>
                <Link href={`/shop?category=${category.slug}`} className="text-sm text-white/70 transition-colors hover:text-volt">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Store">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-volt">Store</p>
          <ul className="mt-4 space-y-2">
            {STORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-volt">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-volt">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Rawalpindi, Pakistan</li>
            <li>hello@volt.example</li>
            <li>Mon to Sat, 11am to 8pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1600px] px-4 py-5 text-xs text-mist sm:px-8">
          © {year} VOLT. Demo store built as a portfolio project. Product names belong to their brands; prices are samples.
        </p>
      </div>
    </footer>
  );
}