import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const FOLDER = "volt-store";

function fail(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request) {
  if (!(await isAdmin())) return fail("Please log in again.", 401);

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
    return fail("Picture upload is not set up. Add the Cloudinary keys to .env.local", 500);
  }

  let file;
  try {
    const form = await request.formData();
    file = form.get("file");
  } catch {
    return fail("Could not read the upload.");
  }

  if (!file || typeof file === "string") return fail("No picture was sent.");
  if (!ALLOWED_TYPES.includes(file.type)) return fail("Only JPG, PNG or WebP pictures are allowed.");
  if (file.size > MAX_BYTES) return fail("That picture is larger than 4 MB.");

  // Cloudinary checks this signature to confirm the upload really comes from us.
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${FOLDER}&timestamp=${timestamp}${secret}`)
    .digest("hex");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", key);
  body.append("timestamp", timestamp);
  body.append("folder", FOLDER);
  body.append("signature", signature);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body,
    });
    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      console.error("Cloudinary upload failed:", data?.error?.message ?? data);
      return fail("The picture could not be uploaded. Check the Cloudinary keys.", 502);
    }

    // Ask Cloudinary to serve a lighter version: best format, good quality, max 1200px wide.
    const url = data.secure_url.replace("/upload/", "/upload/f_auto,q_auto,c_limit,w_1200/");
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return fail("Could not reach the picture service. Try again.", 502);
  }
}