import Link from "next/link";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import Reveal from "@/components/Reveal";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/orderStatus";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Orders — VOLT Admin",
};

function formatDate(date) {
  return new Date(date).toLocaleString("en-GB", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminOrdersPage({ searchParams }) {
  await requireAdmin();
  const { status } = await searchParams;
  const active = ORDER_STATUSES.includes(status) ? status : null;

  await connectDB();
  const orders = await Order.find(active ? { status: active } : {})
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const chip = "rise shrink-0 rounded-full border px-4 py-2 text-sm font-bold capitalize transition-colors";
  const chipOn = "border-volt bg-volt text-ink";
  const chipOff = "border-white/20 bg-white/5 text-white/80 hover:border-volt hover:text-volt";

  return (
    <main className="mt-10">
      <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl">
        <span className="rise text-outline">Or</span>
        <span className="rise text-volt" style={{ animationDelay: "120ms" }}>
          ders
        </span>
      </h1>
      <p className="rise mt-3 text-sm text-mist" style={{ animationDelay: "220ms" }}>
        {orders.length} {orders.length === 1 ? "order" : "orders"} shown
      </p>

      {/* Status filter */}
      <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href="/admin/orders" className={`${chip} ${active ? chipOff : chipOn}`} style={{ animationDelay: "260ms" }}>
          All
        </Link>
        {ORDER_STATUSES.map((option, index) => (
          <Link
            key={option}
            href={`/admin/orders?status=${option}`}
            className={`${chip} ${active === option ? chipOn : chipOff}`}
            style={{ animationDelay: `${300 + index * 40}ms` }}
          >
            {option}
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="mt-12 text-mist">No orders here yet.</p>
      ) : (
        <ul key={`orders-${active ?? "all"}`} className="mt-6 flex flex-col gap-4">
          {orders.map((order, index) => (
            <li key={String(order._id)}>
              <Reveal delay={(index % 5) * 60} className="rounded-2xl border border-white/10 bg-ink/55 p-4 backdrop-blur-md sm:p-6">
                {/* Top row */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-lg font-bold">{order.orderNumber}</p>
                    <p className="text-sm text-mist">{formatDate(order.createdAt)}</p>
                  </div>
                  <OrderStatusSelect orderId={String(order._id)} status={order.status} />
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {/* Customer */}
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-volt">Customer</p>
                    <p className="mt-2 font-bold">{order.customer.name}</p>
                    <p>
                      <a href={`tel:${order.customer.phone}`} className="underline underline-offset-4 hover:text-volt">
                        {order.customer.phone}
                      </a>
                    </p>
                    {order.customer.email && <p className="text-sm text-mist">{order.customer.email}</p>}
                    <p className="mt-2 text-sm text-mist">
                      {order.customer.address}, {order.customer.city}
                    </p>
                    {order.customer.notes && (
                      <p className="mt-2 rounded-lg bg-white/5 px-3 py-2 text-sm">Note: {order.customer.notes}</p>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-volt">Items</p>
                    <ul className="mt-2 space-y-3">
                      {order.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="font-bold">{item.name}</span>
                            <span className="shrink-0 font-bold">{formatPKR(item.price * item.qty)}</span>
                          </div>
                          <p className="text-mist">
                            {item.qty} × {formatPKR(item.price)}
                          </p>
                          {item.note && (
                            <p className="mt-1 rounded-lg border border-volt/30 bg-volt/5 px-3 py-2 text-xs text-white/80">
                              <span className="font-bold text-volt">Custom design:</span> {item.note}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3">
                      <span className="text-sm text-mist">
                        Delivery {order.deliveryFee === 0 ? "free" : formatPKR(order.deliveryFee)} · COD
                      </span>
                      <span className="text-2xl font-bold text-volt">{formatPKR(order.total)}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}