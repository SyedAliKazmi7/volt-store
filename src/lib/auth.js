import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "volt_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET is missing or too short. Add it to .env.local");
  }
  return value;
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

// Compares in constant time so the check does not leak how close a guess was.
export function checkPassword(input) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is missing. Add it to .env.local");
  const a = crypto.createHash("sha256").update(String(input ?? "")).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export async function startSession() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  const store = await cookies();
  store.set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdmin() {
  const store = await cookies();
  const value = store.get(COOKIE)?.value;
  if (!value) return false;

  const [expires, signature] = value.split(".");
  if (!expires || !signature) return false;

  const expected = sign(expires);
  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  return Number(expires) > Date.now();
}

// Use at the top of every admin page.
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}