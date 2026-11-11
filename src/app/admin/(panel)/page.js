import Link from "next/link";
import CountUp from "@/components/admin/CountUp";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import { STATUS_STYLES } from "@/lib/orderStatus";
import Order from "@/models/Order";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard — VOLT Admin",
};

export default async function DashboardPage() {
  await requireAdmin();
  await connectDB();

  const [orderCount, pendingCount, productCount, lowStockCount, revenueRows, latest] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Product.countDocuments(),
    Product.countDocuments({ stock: { $lte: 3 } }),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const stats = [
    { label: "Revenue (not cancelled)", value: revenueRows[0]?.total ?? 0, prefix: "Rs. ", accent: true },
    { label: "Total orders", value: orderCount },
    { label: "Pending orders", value: pendingCount },
    { label: "Products", value: productCount },
    { label: "Low stock (3 or less)", value: lowStockCount },
  ];

  return (
    <main className="mt-10">
      <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl">
        <span className="rise text-outline">Dash</span>
        <span className="rise text-volt" style={{ animationDelay: "120ms" }}>
          board
        </span>
      </h1>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`rise block rounded-2xl border border-white/10 bg-ink/55 p-4 backdrop-blur-md sm:p-5 ${
              stat.accent ? "col-span-2 lg:col-span-1" : ""
            }`}
            style={{ animationDelay: `${200 + index * 90}ms` }}
          >
            <p className="text-xs text-mist sm:text-sm">{stat.label}</p>
            <p className={`mt-2 text-2xl font-bold sm:text-3xl ${stat.accent ? "text-volt" : ""}`}>
              <CountUp value={stat.value} prefix={stat.prefix} />
            </p>
          </div>
        ))}
      </div>

      {/* Latest orders */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-volt sm:text-sm">Latest orders</h2>
          <Link href="/admin/orders" className="text-sm font-bold underline underline-offset-4 hover:text-volt">
            View all →
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="mt-6 text-mist">No orders yet.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {latest.map((order, index) => (
              <li
                key={String(order._id)}
                className="rise flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink/55 px-4 py-4 backdrop-blur-md sm:px-6"
                style={{ animationDelay: `${650 + index * 80}ms` }}
              >
                <div>
                  <p className="font-mono text-sm font-bold">{order.orderNumber}</p>
                  <p className="text-sm text-mist">
                    {order.customer.name} · {order.customer.city}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-volt">{formatPKR(order.total)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}