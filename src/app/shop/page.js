import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Backdrop from "@/components/three/Backdrop";
import { CATEGORIES } from "@/lib/categories";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop — VOLT",
};

export default async function ShopPage({ searchParams }) {
  const { category } = await searchParams;
  const active = CATEGORIES.find((item) => item.slug === category);
  const products = await getProducts({ category: active?.slug });
  const current = active?.slug ?? "all";
  const titleWords = (active ? active.name : "all gear").split(" ");

  const chip = "rise shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors";
  const chipOn = "border-volt bg-volt text-ink";
  const chipOff = "border-white/20 bg-white/5 text-white/80 hover:border-volt hover:text-volt";

  return (
    <>
      <Backdrop />

      <main className="relative z-10 mx-auto min-h-svh max-w-[1600px] px-4 pb-20 pt-24 sm:px-8">
        <p className="rise font-mono text-xs uppercase tracking-[0.35em] text-volt sm:text-sm">
          VOLT Store — Pakistan
        </p>

        {/* Heading: each word rises in. The key replays it when the category changes. */}
        <h1
          key={`title-${current}`}
          className="mt-2 text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl"
        >
          <span className="rise text-outline" style={{ animationDelay: "80ms" }}>
            Shop
          </span>{" "}
          {titleWords.map((word, index) => (
            <span key={index}>
              <span className="rise text-volt" style={{ animationDelay: `${180 + index * 100}ms` }}>
                {word}
              </span>{" "}
            </span>
          ))}
        </h1>

        <p className="rise mt-3 text-sm text-mist sm:text-base" style={{ animationDelay: "350ms" }}>
          {products.length} {products.length === 1 ? "product" : "products"} · Cash on
          delivery across Pakistan
        </p>

        {/* Category filter (scrolls sideways on phones) */}
        <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link
            href="/shop"
            className={`${chip} ${active ? chipOff : chipOn}`}
            style={{ animationDelay: "400ms" }}
          >
            All
          </Link>
          {CATEGORIES.map((item, index) => (
            <Link
              key={item.slug}
              href={`/shop?category=${item.slug}`}
              className={`${chip} ${active?.slug === item.slug ? chipOn : chipOff}`}
              style={{ animationDelay: `${440 + index * 40}ms` }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Products. The key replays the card animation when the category changes. */}
        {products.length > 0 ? (
          <div
            key={`grid-${current}`}
            className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-mist">No products in this category yet.</p>
        )}
      </main>
    </>
  );
}