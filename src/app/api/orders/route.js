import crypto from "node:crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { deliveryFeeFor } from "@/lib/shipping";
import Product from "@/models/Product";
import Order from "@/models/Order";

function fail(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Accepts 03001234567, 0300-1234567, +92 300 1234567 and returns 03001234567 (or null).
function normalisePhone(value) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("92")) digits = "0" + digits.slice(2);
  return /^03\d{9}$/.test(digits) ? digits : null;
}

function clean(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

async function restoreStock(lines) {
  for (const line of lines) {
    await Product.updateOne({ _id: line.product }, { $inc: { stock: line.qty } });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.");
  }

  // ---- Customer details ----
  const customer = {
    name: clean(body?.customer?.name, 80),
    phone: normalisePhone(body?.customer?.phone),
    email: clean(body?.customer?.email, 120),
    address: clean(body?.customer?.address, 300),
    city: clean(body?.customer?.city, 60),
    notes: clean(body?.customer?.notes, 500),
  };

  if (customer.name.length < 3) return fail("Please enter your full name.");
  if (!customer.phone) return fail("Please enter a valid mobile number, like 03001234567.");
  if (customer.email && !/^\S+@\S+\.\S+$/.test(customer.email)) return fail("That email address does not look right.");
  if (customer.address.length < 10) return fail("Please enter your complete delivery address.");
  if (!customer.city) return fail("Please choose your city.");

  // ---- Cart items ----
  const requested = Array.isArray(body?.items) ? body.items : [];
  if (requested.length === 0 || requested.length > 30) return fail("Your cart is empty.");

  for (const item of requested) {
    if (!mongoose.isValidObjectId(item?.id)) return fail("Your cart has an invalid item.");
    if (!Number.isInteger(item?.qty) || item.qty < 1 || item.qty > 10) return fail("Your cart has an invalid quantity.");
  }

  try {
    await connectDB();

    // Prices always come from the database, never from the browser.
    const products = await Product.find({ _id: { $in: requested.map((item) => item.id) } }).lean();
    const byId = new Map(products.map((product) => [String(product._id), product]));

    const lines = [];
    for (const item of requested) {
      const product = byId.get(item.id);
      if (!product) return fail("One of the products in your cart is no longer available.");
      lines.push({
        product: product._id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        qty: item.qty,
      });
    }

    // Reserve stock one line at a time; undo everything if any line fails.
    const reserved = [];
    for (const line of lines) {
      const updated = await Product.findOneAndUpdate(
        { _id: line.product, stock: { $gte: line.qty } },
        { $inc: { stock: -line.qty } }
      );
      if (!updated) {
        await restoreStock(reserved);
        return fail(`Sorry, "${line.name}" does not have enough stock left.`, 409);
      }
      reserved.push(line);
    }

    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    const deliveryFee = deliveryFeeFor(subtotal);

    try {
      const order = await Order.create({
        orderNumber: "VOLT-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
        customer,
        items: lines,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
      });
      return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
    } catch (error) {
      await restoreStock(reserved);
      throw error;
    }
  } catch (error) {
    console.error("Order failed:", error);
    return fail("Something went wrong on our side. Please try again.", 500);
  }
}