import { NextResponse } from "next/server";
import { getSwapOptions, ROLE_LABELS } from "@/lib/builder";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const role = body?.role;
  const build = body?.build;
  if (!ROLE_LABELS[role] || typeof build !== "object" || build === null) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Keep only the roles we know, and only text ids.
  const current = {};
  for (const key of Object.keys(ROLE_LABELS)) {
    if (typeof build[key] === "string") current[key] = build[key];
  }

  try {
    const result = await getSwapOptions(current, role);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Swap options failed:", error);
    return NextResponse.json({ error: "Could not load options." }, { status: 500 });
  }
}