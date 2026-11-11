import Backdrop from "@/components/three/Backdrop";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata = {
  title: "Checkout — VOLT",
};

export default function CheckoutPage() {
  return (
    <>
      <Backdrop />
      <main className="relative z-10 mx-auto min-h-svh max-w-[1300px] px-4 pb-20 pt-24 sm:px-8">
        <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl">
          <span className="rise text-outline">Check</span>
          <span className="rise text-volt" style={{ animationDelay: "120ms" }}>
            out
          </span>
        </h1>
        <CheckoutForm />
      </main>
    </>
  );
}