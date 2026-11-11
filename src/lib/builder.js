import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export const BUILDER_USES = ["gaming", "editing", "office"];
export const BUILDER_BRANDS = ["any", "amd", "intel"];

// How much each part matters for each kind of use. Each row adds up to 1.
const WEIGHTS = {
  gaming: { cpu: 0.25, gpu: 0.55, ram: 0.08, ssd: 0.06, psu: 0.03, case: 0.03 },
  editing: { cpu: 0.4, gpu: 0.25, ram: 0.2, ssd: 0.1, psu: 0.03, case: 0.02 },
  office: { cpu: 0.4, gpu: 0.1, ram: 0.2, ssd: 0.2, psu: 0.05, case: 0.05 },
};

// Where leftover money goes first, after the processor and graphics card are fixed.
const UPGRADE_ORDER = {
  gaming: ["ram", "ssd", "psu", "case"],
  editing: ["ram", "ssd", "psu", "case"],
  office: ["ssd", "ram", "case", "psu"],
};

export const ROLE_LABELS = {
  cpu: "Processor",
  mobo: "Motherboard",
  gpu: "Graphics card",
  ram: "Memory",
  ssd: "Storage",
  psu: "Power supply",
  case: "Casing",
  cooler: "CPU cooler",
};

const BUILD_CATEGORIES = [
  "processors", "motherboards", "graphics-cards", "storage-memory",
  "power-supplies", "casings", "coolers",
];

const DEFAULT_PSU_NEED = 450;

const byPrice = (a, b) => a.price - b.price;

function slim(product) {
  return {
    _id: String(product._id),
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    stock: product.stock,
    images: product.images ?? [],
  };
}

// Sort the in-stock catalog into the roles a PC needs.
async function loadParts() {
  await connectDB();
  const products = await Product.find({
    category: { $in: BUILD_CATEGORIES },
    stock: { $gt: 0 },
  }).lean();

  const parts = { cpu: [], mobo: [], gpu: [], ram: [], ssd: [], psu: [], case: [], cooler: [] };

  for (const product of products) {
    const build = product.build ?? {};
    if (product.category === "processors" && build.socket) parts.cpu.push(product);
    else if (product.category === "motherboards" && build.socket && build.ramType) parts.mobo.push(product);
    else if (product.category === "graphics-cards") parts.gpu.push(product);
    else if (product.category === "storage-memory" && build.ramType) parts.ram.push(product);
    else if (product.category === "storage-memory") parts.ssd.push(product);
    else if (product.category === "power-supplies" && build.wattage) parts.psu.push(product);
    else if (product.category === "casings") parts.case.push(product);
    else if (product.category === "coolers") parts.cooler.push(product);
  }

  for (const list of Object.values(parts)) list.sort(byPrice);
  return parts;
}

// Turn raw scores into 0..1 within each role, so roles can be compared fairly.
function makeScorer(parts) {
  const maxByRole = {};
  for (const [role, list] of Object.entries(parts)) {
    maxByRole[role] = Math.max(0, ...list.map((item) => item.build?.score ?? 0));
  }
  return (role, product) => {
    const max = maxByRole[role];
    return max > 0 ? (product.build?.score ?? 0) / max : 0;
  };
}

export async function recommendBuild({ budget, use = "gaming", brand = "any" }) {
  const parts = await loadParts();
  const score = makeScorer(parts);
  const weights = WEIGHTS[use];

  const cpus = parts.cpu.filter(
    (cpu) => brand === "any" || cpu.brand.toLowerCase() === brand
  );

  let best = null;
  let cheapest = Infinity;

  for (const cpu of cpus) {
    const cooler = cpu.build.needsCooler ? parts.cooler[0] : null;
    if (cpu.build.needsCooler && !cooler) continue;

    for (const mobo of parts.mobo) {
      if (mobo.build.socket !== cpu.build.socket) continue;

      const ramOptions = parts.ram.filter((ram) => ram.build.ramType === mobo.build.ramType);
      if (ramOptions.length === 0 || parts.ssd.length === 0 || parts.case.length === 0) continue;

      for (const gpu of parts.gpu) {
        const needed = gpu.build?.powerDraw ?? DEFAULT_PSU_NEED;
        const psuOptions = parts.psu.filter((psu) => psu.build.wattage >= needed);
        if (psuOptions.length === 0) continue;

        // Start with the cheapest part that fits in every remaining slot.
        const pick = {
          cpu, mobo, gpu,
          ram: ramOptions[0],
          ssd: parts.ssd[0],
          psu: psuOptions[0],
          case: parts.case[0],
        };
        if (cooler) pick.cooler = cooler;

        const baseTotal = Object.values(pick).reduce((sum, item) => sum + item.price, 0);
        cheapest = Math.min(cheapest, baseTotal);
        if (baseTotal > budget) continue;

        // Spend what is left on better parts, most important slot first.
        let left = budget - baseTotal;
        const options = { ram: ramOptions, ssd: parts.ssd, psu: psuOptions, case: parts.case };
        const order = [...UPGRADE_ORDER[use]];

        // A separate cooler is upgraded last, only with money nothing else needed.
        if (pick.cooler) {
          options.cooler = parts.cooler;
          order.push("cooler");
        }

        for (const slot of order) {
          const current = pick[slot];
          let choice = current;
          for (const option of options[slot]) {
            const extra = option.price - current.price;
            if (extra <= left && score(slot, option) > score(slot, choice)) choice = option;
          }
          left -= choice.price - current.price;
          pick[slot] = choice;
        }

        const value = Object.entries(weights).reduce(
          (sum, [slot, weight]) => sum + weight * score(slot, pick[slot]),
          0
        );
        const total = budget - left;

        const better =
          !best ||
          value > best.value + 1e-9 ||
          (Math.abs(value - best.value) <= 1e-9 && total < best.total);
        if (better) best = { pick, value, total };
      }
    }
  }

  // The catalog cannot make a full PC at all (for this brand).
  if (cheapest === Infinity) {
    return { ok: false, reason: "catalog" };
  }

  // The budget is too small. Say so, and offer ready-made options instead.
  if (!best) {
    const alternatives = await Product.find({
      category: { $in: ["laptops", "consoles"] },
      stock: { $gt: 0 },
      price: { $lte: budget },
    })
      .sort({ price: -1 })
      .limit(4)
      .lean();

    return {
      ok: false,
      reason: "budget",
      minimum: cheapest,
      alternatives: alternatives.map(slim),
    };
  }

  const order = ["cpu", "cooler", "mobo", "gpu", "ram", "ssd", "psu", "case"];
  return {
    ok: true,
    use,
    brand,
    budget,
    total: best.total,
    remaining: budget - best.total,
    parts: order
      .filter((role) => best.pick[role])
      .map((role) => ({ role, label: ROLE_LABELS[role], product: slim(best.pick[role]) })),
  };
}

// Parts that could replace one role in an existing build and still work with the rest.
// "current" maps each role to a product id, e.g. { cpu: "...", mobo: "...", gpu: "..." }.
export async function getSwapOptions(current, role) {
  if (!ROLE_LABELS[role]) return null;

  const parts = await loadParts();

  // Read the real details of the parts in the build from the database.
  const ids = Object.values(current).filter((id) => mongoose.isValidObjectId(id));
  const docs = await Product.find({ _id: { $in: ids } }).lean();
  const byId = new Map(docs.map((doc) => [String(doc._id), doc]));
  const now = {};
  for (const [key, id] of Object.entries(current)) now[key] = byId.get(String(id));

  const fits = (product) => {
    const build = product.build ?? {};
    switch (role) {
      case "cpu":
        return !now.mobo || build.socket === now.mobo.build?.socket;
      case "mobo":
        return (
          (!now.cpu || build.socket === now.cpu.build?.socket) &&
          (!now.ram || build.ramType === now.ram.build?.ramType)
        );
      case "gpu":
        return !now.psu || (build.powerDraw ?? DEFAULT_PSU_NEED) <= (now.psu.build?.wattage ?? 0);
      case "ram":
        return !now.mobo || build.ramType === now.mobo.build?.ramType;
      case "psu":
        return !now.gpu || build.wattage >= (now.gpu.build?.powerDraw ?? DEFAULT_PSU_NEED);
      default:
        return true; // storage, casing and cooler fit any build here
    }
  };

  const currentId = String(current[role] ?? "");
  const options = parts[role]
    .filter((product) => String(product._id) !== currentId && fits(product))
    .slice(0, 12)
    .map((product) => ({ ...slim(product), needsCooler: Boolean(product.build?.needsCooler) }));

  return {
    options,
    // Offered when the chosen processor has no cooler in the box.
    cooler: parts.cooler[0] ? slim(parts.cooler[0]) : null,
  };
}