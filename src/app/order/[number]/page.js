import Link from "next/link";
import { notFound } from "next/navigation";
import Backdrop from "@/components/three/Backdrop";
import Reveal from "@/components/Reveal";
import { connectDB } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order placed — VOLT",
};

export default async function OrderPage({ params }) {
  const { number } = await params;

  await connectDB();
  const order = await Order.findOne({ orderNumber: number }).lean();
  if (!order) notFound();

  const firstName = order.customer.name.split(" ")[0];
  const phoneEnd = order.customer.phone.slice(-3);

  return (
    <>
      <Backdrop />
      <main className="relative z-10 mx-auto min-h-svh max-w-[900px] px-4 pb-20 pt-24 text-center sm:px-8">
        <p className="rise font-mono text-xs uppercase tracking-[0.35em] text-volt sm:text-sm">
          Thank you, {firstName}
        </p>
        <h1 className="mt-3 text-[14vw] font-bold uppercase leading-[0.88] tracking-tighter sm:text-8xl">
          <span className="rise text-outline" style={{ animationDelay: "100ms" }}>
            Order
          </span>
          <br />
          <span className="rise text-volt" style={{ animationDelay: "220ms" }}>
            placed.
          </span>
        </h1>

        <p className="rise mt-6 text-mist" style={{ animationDelay: "350ms" }}>
          Order number
        </p>
        <p className="rise font-mono text-2xl font-bold sm:text-3xl" style={{ animationDelay: "400ms" }}>
          {order.orderNumber}
        </p>

        <Reveal className="mt-10 rounded-2xl border border-white/10 bg-ink/55 p-5 text-left backdrop-blur-md sm:p-7">
          <ul className="space-y-3">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-4">
                <span>
                  {item.name} <span className="text-mist">× {item.qty}</span>
                </span>
                <span className="shrink-0 font-bold">{formatPKR(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-3 border-t border-white/10 pt-5">
            <div className="flex justify-between">
              <dt className="text-mist">Delivery</dt>
              <dd className="font-bold">{order.deliveryFee === 0 ? "Free" : formatPKR(order.deliveryFee)}</dd>
            </div>
            <div className="flex items-end justify-between">
              <dt className="font-bold">Total (Cash on Delivery)</dt>
              <dd className="text-3xl font-bold text-volt">{formatPKR(order.total)}</dd>
            </div>
          </dl>
        </Reveal>

        <p className="mt-6 text-mist">
          We will call you on the number ending in {phoneEnd} to confirm, then ship to {order.customer.city}.
        </p>

        <Link href="/shop" className="btn-primary mt-8">
          Continue shopping
        </Link>
      </main>
    </>
  );
}