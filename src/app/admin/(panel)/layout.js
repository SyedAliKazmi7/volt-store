import Link from "next/link";
import Backdrop from "@/components/three/Backdrop";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const TABS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

export default async function AdminLayout({ children }) {
  await requireAdmin();

  return (
    <>
      <Backdrop />

      <div className="relative z-10 mx-auto min-h-svh max-w-[1400px] px-4 pb-20 pt-24 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="rise font-mono text-xs uppercase tracking-[0.35em] text-volt">VOLT Admin</p>
            <nav className="mt-3 flex flex-wrap gap-2">
              {TABS.map((tab, index) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="rise rounded-full border border-white/20 bg-ink/55 px-4 py-2 text-sm font-bold backdrop-blur-md transition-colors hover:border-volt hover:text-volt"
                  style={{ animationDelay: `${80 + index * 60}ms` }}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-white/20 bg-ink/55 px-4 py-2 text-sm font-bold text-mist backdrop-blur-md transition-colors hover:border-hot hover:text-hot"
            >
              Log out
            </button>
          </form>
        </header>

        {children}
      </div>
    </>
  );
}