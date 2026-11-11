import { NextResponse } from "next/server";
import { recommendBuild, BUILDER_USES, BUILDER_BRANDS } from "@/lib/builder";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const budget = Number(searchParams.get("budget"));
  const use = searchParams.get("use") ?? "gaming";
  const brand = searchParams.get("brand") ?? "any";

  if (!Number.isFinite(budget) || budget < 10000 || budget > 5000000) {
    return NextResponse.json({ error: "Enter a budget between Rs. 10,000 and Rs. 5,000,000." }, { status: 400 });
  }
  if (!BUILDER_USES.includes(use)) {
    return NextResponse.json({ error: "Unknown use." }, { status: 400 });
  }
  if (!BUILDER_BRANDS.includes(brand)) {
    return NextResponse.json({ error: "Unknown brand." }, { status: 400 });
  }

  try {
    const result = await recommendBuild({ budget, use, brand });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Builder failed:", error);
    return NextResponse.json({ error: "Could not build a PC right now." }, { status: 500 });
  }
}