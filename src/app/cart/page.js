import Backdrop from "@/components/three/Backdrop";
import CartView from "@/components/CartView";

export const metadata = {
  title: "Your cart — VOLT",
};

export default function CartPage() {
  return (
    <>
      <Backdrop />
      <main className="relative z-10 mx-auto min-h-svh max-w-[1300px] px-4 pb-20 pt-24 sm:px-8">
        <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl">
          <span className="rise text-outline">Your</span>{" "}
          <span className="rise text-volt" style={{ animationDelay: "120ms" }}>
            cart
          </span>
        </h1>
        <CartView />
      </main>
    </>
  );
}