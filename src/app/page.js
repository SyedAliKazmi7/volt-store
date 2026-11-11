import Link from "next/link";
import Experience from "@/components/three/Experience";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Showcase from "@/components/Showcase";
import CountUp from "@/components/admin/CountUp";
import { CATEGORIES } from "@/lib/categories";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "Cash on delivery",
  "Graphics cards",
  "Gaming laptops",
  "Custom keyboards",
  "PC builder",
  "Consoles",
  "Delivery across Pakistan",
];

const PERKS = [
  { title: "Cash on Delivery", text: "Pay in cash when the order reaches your door, anywhere in Pakistan." },
  { title: "Warranty on everything", text: "Every product lists its local or brand warranty before you buy." },
  { title: "Parts that fit", text: "The PC builder checks socket, memory type and power before it suggests a build." },
  { title: "Made your way", text: "Design the VOLT K65 keyboard in 3D: case, keycaps and glow." },
];

const eyebrow = "font-mono text-xs uppercase tracking-[0.35em] sm:text-sm";
const bigHeading = "mt-3 text-5xl font-bold uppercase leading-[0.92] tracking-tighter sm:text-7xl lg:text-8xl";
const sectionHeading = "text-4xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-6xl";

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 8);
  const brandCount = new Set(products.map((product) => product.brand)).size;

  const stats = [
    { value: products.length, label: "Products" },
    { value: brandCount, label: "Brands" },
    { value: CATEGORIES.length, label: "Categories" },
  ];

  return (
    <main>
      {/* ================= 3D story ================= */}
      <div id="story" className="relative">
        {/* 3D scene stays pinned while the sections scroll over it */}
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <Experience />
        </div>

        <div className="relative z-10 mt-[-100svh]">
          {/* 1. Hero */}
          <section className="mx-auto flex min-h-svh max-w-[1600px] flex-col justify-between px-4 pb-8 pt-24 sm:px-8 lg:pb-12">
            <Reveal className="text-center">
              <p className={`${eyebrow} text-volt`}>Gaming &amp; tech store · Pakistan</p>
              <h1 className="mt-3 text-[15vw] font-bold uppercase leading-[0.88] tracking-tighter sm:text-[12vw] lg:text-[8.5vw]">
                <span className="text-outline">Gear up.</span>
                <br />
                <span className="text-volt">Play hard.</span>
              </h1>
            </Reveal>

            <Reveal
              delay={150}
              className="flex flex-col items-center gap-5 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left"
            >
              <p className="max-w-sm text-base text-mist sm:text-lg">
                Graphics cards, processors, consoles and custom keyboards. Cash on delivery across Pakistan.
              </p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link href="/shop" className="btn-primary">
                  Shop now
                </Link>
                <Link href="/builder" className="btn-ghost">
                  Build my PC
                </Link>
              </div>
            </Reveal>
          </section>

          {/* 2. Our keyboard (keys fly apart) */}
          <section className="mx-auto flex min-h-svh max-w-[1600px] items-start px-4 pt-24 sm:px-8 lg:items-center lg:pt-0">
            <Reveal className="w-full text-center lg:w-1/2 lg:text-left">
              <p className={`${eyebrow} text-volt`}>01 — VOLT K65</p>
              <h2 className={bigHeading}>
                <span className="text-outline">68 keys.</span>
                <br />
                All yours.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base text-mist sm:text-lg lg:mx-0">
                Our own hot-swap keyboard. Pick the case, the keycaps and the glow, and see it in 3D before you order.
              </p>
              <Link href="/configurator" className="btn-primary mt-7">
                Design yours
              </Link>
            </Reveal>
          </section>

          {/* 3. PC builder */}
          <section className="mx-auto flex min-h-svh max-w-[1600px] items-start px-4 pt-24 sm:px-8 lg:items-center lg:pt-0">
            <Reveal className="w-full text-center lg:ml-auto lg:w-1/2 lg:pl-16 lg:text-left">
              <p className={`${eyebrow} text-hot`}>02 — PC Builder</p>
              <h2 className={bigHeading}>
                <span className="text-outline">Your budget.</span>
                <br />
                Our build.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base text-mist sm:text-lg lg:mx-0">
                Tell us what you can spend and what you play. We pick parts that work together and assemble them in
                front of you.
              </p>
              <Link href="/builder" className="btn-primary mt-7">
                Try the builder
              </Link>
            </Reveal>
          </section>

          {/* 4. Into the store */}
          <section className="mx-auto flex min-h-svh max-w-[1600px] flex-col items-center px-4 pt-24 text-center sm:px-8">
            <Reveal>
              <h2 className="text-[15vw] font-bold uppercase leading-[0.88] tracking-tighter sm:text-[12vw] lg:text-[8.5vw]">
                <span className="text-outline">Ready to</span>
                <br />
                <span className="text-volt">upgrade?</span>
              </h2>
              <div className="mt-8">
                <Link href="/shop" className="btn-primary">
                  Shop all gear
                </Link>
              </div>
            </Reveal>
          </section>
        </div>
      </div>

      {/* ================= Moving strip ================= */}
      <section className="marquee relative z-10 border-y border-white/10 bg-ink/70 py-3 backdrop-blur-md">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((text, index) => (
            <span
              key={index}
              className="mr-8 flex items-center gap-8 font-mono text-xs uppercase tracking-[0.25em] text-white/70 sm:text-sm"
            >
              {text}
              <span aria-hidden="true" className="text-volt">
                ✦
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* ================= Showcase: graphics card ================= */}
      <Showcase model="gpu" side="right">
        <Reveal className="text-center lg:text-left">
          <p className={`${eyebrow} text-volt`}>Graphics cards</p>
          <h2 className={bigHeading}>
            <span className="text-outline">Frames that</span>
            <br />
            hit harder.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-mist sm:text-lg lg:mx-0">
            From 1080p starters to 1440p monsters, with DLSS and ray tracing. Every card lists the power supply it
            needs.
          </p>
          <Link href="/shop?category=graphics-cards" className="btn-primary mt-7">
            Shop graphics cards
          </Link>
        </Reveal>
      </Showcase>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8">
        {/* ================= Numbers ================= */}
        <section className="grid grid-cols-3 gap-3 py-16 sm:gap-6 sm:py-24">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 120} className="text-center">
              <p className="text-5xl font-bold tracking-tighter text-volt sm:text-8xl">
                <CountUp value={stat.value} duration={1600} />
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-mist sm:text-sm">{stat.label}</p>
            </Reveal>
          ))}
        </section>

        {/* ================= Categories ================= */}
        <section className="pb-16 sm:pb-24">
          <Reveal>
            <p className={`${eyebrow} text-volt`}>Find your gear</p>
            <h2 className={`mt-2 ${sectionHeading}`}>
              <span className="text-outline">Shop by</span> <span className="text-volt">category</span>
            </h2>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {CATEGORIES.map((category, index) => (
              <Reveal key={category.slug} delay={(index % 4) * 80}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group flex h-28 flex-col justify-between rounded-2xl border border-white/10 bg-ink/55 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-volt hover:shadow-[0_0_40px_rgba(182,255,46,0.2)] sm:h-36 sm:p-5"
                >
                  <span className="font-mono text-xs text-mist transition-colors group-hover:text-volt">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-end justify-between gap-2">
                    <span className="text-base font-bold leading-tight sm:text-2xl">{category.name}</span>
                    <span className="text-xl text-volt transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= Featured products ================= */}
        {featured.length > 0 && (
          <section className="pb-16 sm:pb-24">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={`${eyebrow} text-hot`}>Picked for you</p>
                <h2 className={`mt-2 ${sectionHeading}`}>
                  <span className="text-outline">Featured</span> <span className="text-volt">gear</span>
                </h2>
              </div>
              <Link href="/shop" className="font-bold underline underline-offset-4 hover:text-volt">
                View all →
              </Link>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {featured.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* ================= Why VOLT ================= */}
        <section className="pb-20 sm:pb-28">
          <Reveal>
            <p className={`${eyebrow} text-volt`}>Why VOLT</p>
            <h2 className={`mt-2 ${sectionHeading}`}>
              <span className="text-outline">Built for</span> <span className="text-volt">players</span>
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {PERKS.map((perk, index) => (
              <Reveal
                key={perk.title}
                delay={index * 100}
                className="rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md sm:p-6"
              >
                <p className="font-mono text-xs text-volt">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-xl font-bold sm:text-2xl">{perk.title}</h3>
                <p className="mt-2 text-sm text-mist sm:text-base">{perk.text}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}