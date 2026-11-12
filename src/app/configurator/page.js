import ConfiguratorView from "@/components/ConfiguratorView";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Keyboard configurator — VOLT",
  description: "Design your VOLT K65 keyboard in 3D: case, keycaps, glow and switches.",
};

const K65_SLUG = "volt-k65-custom-mechanical-keyboard";

export default async function ConfiguratorPage() {
  const product = await getProductBySlug(K65_SLUG);

  return (
    <main className="relative z-10 mx-auto min-h-svh max-w-[1600px] px-4 pb-20 pt-24 sm:px-8">
      <p className="rise font-mono text-xs uppercase tracking-[0.35em] text-volt sm:text-sm">VOLT K65</p>
      <h1 className="mt-2 text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl">
        <span className="rise text-outline" style={{ animationDelay: "80ms" }}>
          Make it
        </span>{" "}
        <span className="rise text-volt" style={{ animationDelay: "180ms" }}>
          yours
        </span>
      </h1>
      <ConfiguratorView product={product} />
    </main>
  );
}