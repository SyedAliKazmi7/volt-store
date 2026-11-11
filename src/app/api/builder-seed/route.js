import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { slugify } from "@/lib/slug";
import Product from "@/models/Product";
import { NEW_PARTS, BUILD_INFO } from "@/data/builderParts";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  try {
    await connectDB();

    // 1. Add new parts, but never touch one that already exists.
    let added = 0;
    const skipped = [];
    for (const item of NEW_PARTS) {
      const slug = slugify(item.name);
      if (await Product.exists({ slug })) {
        skipped.push(slug);
        continue;
      }
      await Product.create({
        ...item,
        slug,
        specs: item.specs.map(([label, value]) => ({ label, value })),
      });
      added++;
    }

    // 2. Fill in builder details on existing products. Only the build fields change.
    let updated = 0;
    const notFound = [];
    for (const [slug, build] of Object.entries(BUILD_INFO)) {
      const changes = {};
      for (const [key, value] of Object.entries(build)) changes[`build.${key}`] = value;
      const result = await Product.updateOne({ slug }, { $set: changes });
      if (result.matchedCount > 0) updated++;
      else notFound.push(slug);
    }

    return NextResponse.json({ ok: true, added, skipped, updated, notFound });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}