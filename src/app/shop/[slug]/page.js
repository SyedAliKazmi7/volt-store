import Link from "next/link";
import { notFound } from "next/navigation";
import Backdrop from "@/components/three/Backdrop";
import ProductVisual from "@/components/ProductVisual";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { CATEGORIES } from "@/lib/categories";
import { formatPKR } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} — VOLT` : "Product not found — VOLT",
    description: product?.description,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const category = CATEGORIES.find((item) => item.slug === product.category);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;
  const discount =
    product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  const perks = ["Cash on Delivery", "Delivery across Pakistan", product.warranty].filter(Boolean);

  return (
    <>
      <Backdrop />

      <main className="relative z-10 mx-auto min-h-svh max-w-[1400px] px-4 pb-20 pt-24 sm:px-8">
        {/* Breadcrumb */}
        <nav className="rise font-mono text-xs uppercase tracking-[0.2em] text-mist">
          <Link href="/shop" className="hover:text-volt">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-volt">
            {category?.name ?? product.category}
          </Link>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Left: big tilting panel */}
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <ProductVisual product={product} discount={discount} />
          </Reveal>

          {/* Right: details */}
          <div>
            <p className="rise font-mono text-xs uppercase tracking-[0.35em] text-volt sm:text-sm">
              {product.brand}
            </p>

            <h1 className="mt-2 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
              {product.name.split(" ").map((word, index) => (
                <span key={index}>
                  <span className="rise" style={{ animationDelay: `${80 + index * 45}ms` }}>
                    {word}
                  </span>{" "}
                </span>
              ))}
            </h1>

            {/* Price */}
            <div className="rise mt-5 flex flex-wrap items-end gap-x-4 gap-y-1" style={{ animationDelay: "350ms" }}>
              <p className="text-4xl font-bold text-volt sm:text-5xl">{formatPKR(product.price)}</p>
              {discount > 0 && (
                <p className="pb-1 text-lg text-mist line-through">{formatPKR(product.oldPrice)}</p>
              )}
            </div>

            {/* Stock */}
            <p
              className={`rise mt-3 font-bold ${inStock ? "text-volt" : "text-hot"}`}
              style={{ animationDelay: "420ms" }}
            >
              {!inStock && "● Out of stock"}
              {inStock && !lowStock && "● In stock"}
              {lowStock && `● Only ${product.stock} left`}
            </p>

            <p className="rise mt-5 max-w-xl text-base text-mist sm:text-lg" style={{ animationDelay: "480ms" }}>
              {product.description}
            </p>

            <div className="rise mt-7 block" style={{ animationDelay: "560ms" }}>
              <AddToCart product={product} />
            </div>

            {/* Perks */}
            <ul className="mt-7 flex flex-wrap gap-2">
              {perks.map((perk, index) => (
                <li
                  key={perk}
                  className="rise rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold backdrop-blur-md"
                  style={{ animationDelay: `${640 + index * 70}ms` }}
                >
                  {perk}
                </li>
              ))}
            </ul>

            {/* Specs */}
            {product.specs?.length > 0 && (
              <section className="mt-10">
                <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-volt sm:text-sm">
                  Specifications
                </h2>
                <dl className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                  {product.specs.map((spec, index) => (
                    <Reveal key={spec.label} delay={index * 80}>
                      <div className="flex flex-col gap-1 border-b border-white/10 px-5 py-4 last:border-b-0 sm:flex-row sm:gap-6">
                        <dt className="text-sm text-mist sm:w-44 sm:shrink-0">{spec.label}</dt>
                        <dd className="font-bold">{spec.value}</dd>
                      </div>
                    </Reveal>
                  ))}
                </dl>
              </section>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <Reveal>
              <h2 className="text-3xl font-bold uppercase tracking-tighter sm:text-5xl">
                <span className="text-outline">More</span>{" "}
                <span className="text-volt">{category?.name ?? "gear"}</span>
              </h2>
            </Reveal>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {related.map((item, index) => (
                <ProductCard key={item._id} product={item} index={index} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}