import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import Reveal from "@/components/Reveal";
import { requireAdmin } from "@/lib/auth";
import { CATEGORIES } from "@/lib/categories";
import { connectDB } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products — VOLT Admin",
};

export default async function AdminProductsPage({ searchParams }) {
  await requireAdmin();
  const { category } = await searchParams;
  const active = CATEGORIES.find((item) => item.slug === category);

  await connectDB();
  const products = await Product.find(active ? { category: active.slug } : {})
    .sort({ createdAt: -1 })
    .lean();

  const chip = "rise shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors";
  const chipOn = "border-volt bg-volt text-ink";
  const chipOff = "border-white/20 bg-ink/55 text-white/80 hover:border-volt hover:text-volt";

  return (
    <main className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl">
          <span className="rise text-outline">Pro</span>
          <span className="rise text-volt" style={{ animationDelay: "120ms" }}>
            ducts
          </span>
        </h1>
        <Link href="/admin/products/new" className="btn-primary rise" style={{ animationDelay: "200ms" }}>
          + New product
        </Link>
      </div>

      <p className="rise mt-3 text-sm text-mist" style={{ animationDelay: "240ms" }}>
        {products.length} {products.length === 1 ? "product" : "products"} shown
      </p>

      {/* Category filter */}
      <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href="/admin/products" className={`${chip} ${active ? chipOff : chipOn}`} style={{ animationDelay: "280ms" }}>
          All
        </Link>
        {CATEGORIES.map((item, index) => (
          <Link
            key={item.slug}
            href={`/admin/products?category=${item.slug}`}
            className={`${chip} ${active?.slug === item.slug ? chipOn : chipOff}`}
            style={{ animationDelay: `${310 + index * 30}ms` }}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {products.length === 0 ? (
        <p className="mt-12 text-mist">No products here yet.</p>
      ) : (
        <ul key={`products-${active?.slug ?? "all"}`} className="mt-6 flex flex-col gap-3">
          {products.map((product, index) => (
            <li key={String(product._id)}>
              <Reveal
                delay={(index % 6) * 50}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-ink/55 p-3 backdrop-blur-md sm:p-4"
              >
                {/* Picture or brand */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-steel/70 to-ink">
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-outline px-1 text-center text-[10px] font-bold uppercase">{product.brand}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate font-bold">
                    {product.name}
                    {product.featured && <span className="ml-2 text-xs text-volt">★ Featured</span>}
                  </p>
                  <p className="text-sm text-mist">
                    {CATEGORIES.find((item) => item.slug === product.category)?.name ?? product.category}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-volt">{formatPKR(product.price)}</p>
                  <p className={`text-sm font-bold ${product.stock === 0 ? "text-hot" : product.stock <= 3 ? "text-hot/80" : "text-mist"}`}>
                    {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Link
                    href={`/admin/products/${String(product._id)}`}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold transition-colors hover:border-volt hover:text-volt"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton productId={String(product._id)} />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}