import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

const toPlain = (data) => JSON.parse(JSON.stringify(data));

export async function getProducts({ category, featured } = {}) {
  await connectDB();

  const filter = {};
  if (category) filter.category = category;
  if (featured) filter.featured = true;

  const products = await Product.find(filter).sort({ featured: -1, name: 1 }).lean();
  return toPlain(products);
}

export async function getProductBySlug(slug) {
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  return product ? toPlain(product) : null;
}

export async function getRelatedProducts(product, limit = 4) {
  await connectDB();
  const products = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .limit(limit)
    .lean();
  return toPlain(products);
}