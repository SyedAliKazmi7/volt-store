import mongoose from "mongoose";
import { CATEGORY_SLUGS } from "@/lib/categories";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORY_SLUGS },
    price: { type: Number, required: true, min: 0 }, // PKR
    oldPrice: { type: Number, min: 0 }, // optional, shows a discount
    stock: { type: Number, default: 0, min: 0 },
    warranty: { type: String, default: "" },
    description: { type: String, default: "" },
    specs: [{ label: String, value: String, _id: false }],
    images: [String],
    featured: { type: Boolean, default: false },

    // Technical details used by the PC builder to match parts.
    build: {
      socket: { type: String, default: "" }, // processors and motherboards, e.g. AM5
      ramType: { type: String, default: "" }, // motherboards and RAM: DDR4 or DDR5
      wattage: { type: Number }, // power supplies: how many watts it provides
      powerDraw: { type: Number }, // graphics cards: recommended PSU watts
      score: { type: Number }, // performance score, higher is faster
      needsCooler: { type: Boolean, default: false }, // processors sold without a cooler
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);