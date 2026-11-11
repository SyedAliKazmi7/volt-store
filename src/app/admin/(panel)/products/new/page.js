import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "New product — VOLT Admin",
};

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <main className="mt-10">
      <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl">
        <span className="rise text-outline">New</span>{" "}
        <span className="rise text-volt" style={{ animationDelay: "120ms" }}>
          product
        </span>
      </h1>
      <ProductForm />
    </main>
  );
}