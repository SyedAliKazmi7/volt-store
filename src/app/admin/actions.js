"use server";

import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, startSession, endSession, isAdmin } from "@/lib/auth";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { connectDB } from "@/lib/db";
import { ORDER_STATUSES } from "@/lib/orderStatus";
import { slugify } from "@/lib/slug";
import Order from "@/models/Order";
import Product from "@/models/Product";

/* ---------------- Login ---------------- */

export async function login(previousState, formData) {
  // A short pause makes guessing passwords in bulk very slow.
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!checkPassword(formData.get("password"))) {
    return { error: "Wrong password." };
  }

  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ---------------- Orders ---------------- */

export async function setOrderStatus(orderId, status) {
  if (!(await isAdmin())) return { error: "Please log in again." };
  if (!ORDER_STATUSES.includes(status)) return { error: "Unknown status." };
  if (!mongoose.isValidObjectId(orderId)) return { error: "Unknown order." };

  await connectDB();
  const order = await Order.findById(orderId);
  if (!order) return { error: "Order not found." };
  if (order.status === "cancelled") return { error: "A cancelled order cannot be reopened." };
  if (order.status === status) return { ok: true };

  // Cancelling puts the reserved stock back on the shelf.
  if (status === "cancelled") {
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.qty } });
    }
  }

  order.status = status;
  await order.save();

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { ok: true };
}

/* ---------------- Products ---------------- */

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

// Empty input -> undefined, otherwise a number (NaN if it is not one).
function optionalNumber(value) {
  const raw = String(value ?? "").trim();
  return raw === "" ? undefined : Number(raw);
}

export async function saveProduct(previousState, formData) {
  if (!(await isAdmin())) return { error: "Please log in again." };

  const id = text(formData.get("id"), 40);
  const name = text(formData.get("name"), 160);
  const brand = text(formData.get("brand"), 60);
  const category = text(formData.get("category"), 40);
  const price = Number(formData.get("price"));
  const oldPrice = optionalNumber(formData.get("oldPrice"));
  const stock = Number(formData.get("stock"));

  if (name.length < 3) return { error: "Enter the product name." };
  if (!brand) return { error: "Enter the brand." };
  if (!CATEGORY_SLUGS.includes(category)) return { error: "Choose a category." };
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price." };
  if (oldPrice !== undefined && (!Number.isFinite(oldPrice) || oldPrice <= price)) {
    return { error: "Old price must be higher than the price, or left empty." };
  }
  if (!Number.isInteger(stock) || stock < 0) return { error: "Stock must be a whole number, 0 or more." };

  // Specs arrive as JSON from the form.
  let specs = [];
  try {
    specs = JSON.parse(formData.get("specs") || "[]");
  } catch {
    return { error: "Specifications could not be read." };
  }
  specs = (Array.isArray(specs) ? specs : [])
    .map((spec) => ({ label: text(spec?.label, 60), value: text(spec?.value, 200) }))
    .filter((spec) => spec.label && spec.value)
    .slice(0, 20);

  // One picture link per line.
  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6);
  for (const image of images) {
    if (!image.startsWith("/") && !image.startsWith("https://")) {
      return { error: "Picture links must start with https:// or /" };
    }
  }

  const build = {
    socket: text(formData.get("socket"), 20),
    ramType: text(formData.get("ramType"), 10),
    wattage: optionalNumber(formData.get("wattage")),
    powerDraw: optionalNumber(formData.get("powerDraw")),
    score: optionalNumber(formData.get("score")),
    needsCooler: formData.get("needsCooler") === "on",
  };
  for (const key of ["wattage", "powerDraw", "score"]) {
    if (build[key] !== undefined && (!Number.isFinite(build[key]) || build[key] < 0)) {
      return { error: "PC builder numbers must be 0 or more." };
    }
  }

  const data = {
    name,
    brand,
    category,
    price,
    oldPrice,
    stock,
    warranty: text(formData.get("warranty"), 80),
    description: text(formData.get("description"), 1000),
    featured: formData.get("featured") === "on",
    specs,
    images,
    build,
  };

  try {
    await connectDB();

    if (id) {
      if (!mongoose.isValidObjectId(id)) return { error: "Unknown product." };
      const product = await Product.findById(id);
      if (!product) return { error: "Product not found." };
      Object.assign(product, data);
      await product.save();
    } else {
      // Make the web address unique: name, name-2, name-3 ...
      const base = slugify(name);
      let slug = base;
      let counter = 2;
      while (await Product.exists({ slug })) {
        slug = `${base}-${counter++}`;
      }
      await Product.create({ ...data, slug });
    }
  } catch (error) {
    console.error("Saving product failed:", error);
    return { error: "Could not save the product. Please try again." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  redirect("/admin/products");
}

export async function deleteProduct(productId) {
  if (!(await isAdmin())) return { error: "Please log in again." };
  if (!mongoose.isValidObjectId(productId)) return { error: "Unknown product." };

  await connectDB();
  await Product.deleteOne({ _id: productId });

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { ok: true };
}