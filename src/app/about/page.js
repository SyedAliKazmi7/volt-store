import Link from "next/link";
import Backdrop from "@/components/three/Backdrop";
import Reveal from "@/components/Reveal";
import { formatPKR } from "@/lib/format";
import { DELIVERY_FEE, FREE_DELIVERY_OVER } from "@/lib/shipping";

export const metadata = {
  title: "About — VOLT",
  description: "Who we are, how ordering works and answers to common questions.",
};

const VALUES = [
  { title: "Real specs, no guessing", text: "Every product page lists what matters: the socket, the memory type, the power it needs and its warranty." },
  { title: "Parts that work together", text: "Our PC builder checks compatibility before it suggests anything, so a build you order is a build that boots." },
  { title: "Pay when it arrives", text: "Cash on delivery across Pakistan. You see the box before you pay for it." },
];

const STEPS = [
  { title: "Pick your gear", text: "Browse the shop, let the PC builder choose for your budget, or design a VOLT K65 keyboard." },
  { title: "Place the order", text: "Enter your name, mobile number and address. No card and no account needed." },
  { title: "We call to confirm", text: "We ring the number you gave to confirm the order and the address before it ships." },
  { title: "Delivered to your door", text: "Your order arrives by courier. Pay the rider in cash." },
];

const FAQS = [
  {
    question: "How much is delivery?",
    answer: `Delivery is ${formatPKR(DELIVERY_FEE)} per order, and free on orders of ${formatPKR(FREE_DELIVERY_OVER)} or more.`,
  },
  {
    question: "How do I pay?",
    answer: "Cash on delivery. You pay the courier in cash when the order reaches you.",
  },
  {
    question: "Will the parts from the PC builder fit together?",
    answer:
      "Yes. The builder matches the processor socket to the motherboard, the memory type to the motherboard, and the power supply to the graphics card. If you swap a part, it only offers parts that still fit.",
  },
  {
    question: "What about warranty?",
    answer: "Each product page shows its own warranty, such as a local or brand warranty and its length. Keep your order number; you will need it for a claim.",
  },
  {
    question: "Can I return something?",
    answer: "If an item arrives damaged or is not what you ordered, tell us within 7 days of delivery and we will replace it or refund you.",
  },
  {
    question: "How does a custom keyboard order work?",
    answer: "The design you choose in the configurator (case, keycaps, glow and switches) is saved with your order, and we build the keyboard to match it.",
  },
];

const eyebrow = "font-mono text-xs uppercase tracking-[0.35em] sm:text-sm";
const sectionHeading = "mt-2 text-4xl font-bold uppercase leading-[0.95] tracking-tighter sm:text-6xl";
const card = "rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md sm:p-6";

export default function AboutPage() {
  return (
    <>
      <Backdrop />

      <main className="relative z-10 mx-auto max-w-[1200px] px-4 pb-24 pt-24 sm:px-8">
        {/* ---------- Intro ---------- */}
        <section className="py-10 sm:py-16">
          <p className={`rise ${eyebrow} text-volt`}>About us</p>
          <h1 className="mt-3 text-[15vw] font-bold uppercase leading-[0.88] tracking-tighter sm:text-8xl lg:text-9xl">
            <span className="rise text-outline" style={{ animationDelay: "80ms" }}>
              We are
            </span>
            <br />
            <span className="rise text-volt" style={{ animationDelay: "200ms" }}>
              VOLT.
            </span>
          </h1>
          <p className="rise mt-6 block max-w-2xl text-lg text-mist sm:text-xl" style={{ animationDelay: "320ms" }}>
            A gaming and tech store built for players in Pakistan. We sell graphics cards, processors, consoles and
            peripherals, we help you plan a PC that fits your budget, and we make our own keyboard that you design
            yourself.
          </p>
        </section>

        {/* ---------- What we care about ---------- */}
        <section className="py-10 sm:py-16">
          <Reveal>
            <p className={`${eyebrow} text-hot`}>What we care about</p>
            <h2 className={sectionHeading}>
              <span className="text-outline">Built for</span> <span className="text-volt">players</span>
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 110} className={card}>
                <p className="font-mono text-xs text-volt">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-xl font-bold sm:text-2xl">{value.title}</h3>
                <p className="mt-2 text-mist">{value.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- How ordering works ---------- */}
        <section className="py-10 sm:py-16">
          <Reveal>
            <p className={`${eyebrow} text-volt`}>From cart to desk</p>
            <h2 className={sectionHeading}>
              <span className="text-outline">How it</span> <span className="text-volt">works</span>
            </h2>
          </Reveal>

          <ol className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 110} className={`h-full ${card}`}>
                  <p className="text-5xl font-bold tracking-tighter text-volt sm:text-6xl">{index + 1}</p>
                  <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-mist sm:text-base">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Questions ---------- */}
        <section className="py-10 sm:py-16">
          <Reveal>
            <p className={`${eyebrow} text-hot`}>Good to know</p>
            <h2 className={sectionHeading}>
              <span className="text-outline">Common</span> <span className="text-volt">questions</span>
            </h2>
          </Reveal>

          <div className="mt-8 flex flex-col gap-3">
            {FAQS.map((faq, index) => (
              <Reveal key={faq.question} delay={(index % 4) * 70}>
                <details className={`group ${card} transition-colors duration-300 open:border-volt/60`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold sm:text-xl">
                    {faq.question}
                    <span className="shrink-0 text-2xl text-volt transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-3xl text-mist">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>

          <p className="mt-5 text-xs text-mist">
            VOLT is a demo store built as a portfolio project. The policies above are samples.
          </p>
        </section>

        {/* ---------- Call to action ---------- */}
        <section className="py-10 text-center sm:py-16">
          <Reveal>
            <h2 className="text-[13vw] font-bold uppercase leading-[0.88] tracking-tighter sm:text-8xl">
              <span className="text-outline">Ready to</span>
              <br />
              <span className="text-volt">gear up?</span>
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/shop" className="btn-primary">
                Shop now
              </Link>
              <Link href="/builder" className="btn-ghost">
                Build my PC
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}