import mongoose from "mongoose";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit product — VOLT Admin",
};

export default async function EditProductPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const found = await Product.findById(id).lean();
  if (!found) notFound();

  // Plain data only, so it can be handed to the browser-side form.
  const product = JSON.parse(JSON.stringify(found));

  return (
    <main className="mt-10">
      <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl">
        <span className="rise text-outline">Edit</span>{" "}
        <span className="rise text-volt" style={{ animationDelay: "120ms" }}>
          product
        </span>
      </h1>
      <ProductForm product={product} />
    </main>
  );
}