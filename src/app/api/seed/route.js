import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { PRODUCTS } from "@/data/products";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  try {
    await connectDB();
    await Product.deleteMany({});

    const docs = PRODUCTS.map((product) => ({
      ...product,
      slug: slugify(product.name),
      specs: product.specs.map(([label, value]) => ({ label, value })),
    }));

    await Product.insertMany(docs);
    return NextResponse.json({ ok: true, inserted: docs.length });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}