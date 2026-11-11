import Backdrop from "@/components/three/Backdrop";
import BuilderView from "@/components/BuilderView";

export const metadata = {
  title: "PC Builder — VOLT",
  description: "Tell us your budget and we will pick PC parts that work together.",
};

export default function BuilderPage() {
  return (
    <>
      <Backdrop />
      <main className="relative z-10 mx-auto min-h-svh max-w-[1400px] px-4 pb-20 pt-24 sm:px-8">
        <p className="rise font-mono text-xs uppercase tracking-[0.35em] text-volt sm:text-sm">
          Tell us your budget
        </p>
        <h1 className="mt-2 text-5xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">
          <span className="rise text-outline" style={{ animationDelay: "80ms" }}>
            Build
          </span>{" "}
          <span className="rise text-volt" style={{ animationDelay: "180ms" }}>
            my
          </span>{" "}
          <span className="rise text-volt" style={{ animationDelay: "280ms" }}>
            PC
          </span>
        </h1>
        <BuilderView />
      </main>
    </>
  );
}