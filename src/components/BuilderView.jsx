"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CountUp from "@/components/admin/CountUp";
import PCAssembly from "@/components/three/PCAssembly";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/format";

const USES = [
  { id: "gaming", title: "Gaming", text: "Highest frame rates. Most of the budget goes to the graphics card." },
  { id: "editing", title: "Editing", text: "Video and design work. More processor power and memory." },
  { id: "office", title: "Office", text: "Study, browsing and everyday work. Fast storage, modest graphics." },
];

const BRANDS = [
  { id: "any", label: "Any" },
  { id: "amd", label: "AMD" },
  { id: "intel", label: "Intel" },
];

const QUICK_BUDGETS = [200000, 300000, 450000, 600000];
const MIN = 150000;
const MAX = 800000;
const STEP = 5000;
const ASSEMBLY_TIME = 2800; // how long the 3D build plays before the list appears

const panel = "rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md sm:p-7";
const heading = "font-mono text-xs uppercase tracking-[0.35em] text-volt";

// Becomes true shortly after the element appears, so its CSS transition can play.
function useAppear() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShown(true), 40);
    return () => clearTimeout(timer);
  }, []);
  return shown;
}

function PartCard({ part, delay, open, options, onToggle, onPick }) {
  const shown = useAppear();
  const { product } = part;

  return (
    <li
      className={`card-reveal ${shown ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`rounded-2xl border bg-ink/55 p-3 backdrop-blur-md transition-colors duration-300 sm:p-4 ${
          open ? "border-volt shadow-[0_0_40px_rgba(182,255,46,0.18)]" : "border-white/10"
        }`}
      >
        {/* The part itself */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-steel/70 to-ink sm:h-20 sm:w-20">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-outline px-1 text-center text-[10px] font-bold uppercase sm:text-xs">
                {product.brand}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-volt sm:text-xs">{part.label}</p>
            <Link href={`/shop/${product.slug}`} className="mt-1 line-clamp-2 text-sm font-bold hover:text-volt sm:text-lg">
              {product.name}
            </Link>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <p className="text-sm font-bold sm:text-xl">{formatPKR(product.price)}</p>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                open ? "border-volt bg-volt text-ink" : "border-white/25 hover:border-volt hover:text-volt"
              }`}
            >
              {open ? "Close" : "⇄ Swap"}
            </button>
          </div>
        </div>

        {/* Other parts that fit this build */}
        {open && (
          <div className="mt-4 border-t border-white/10 pt-4">
            {options.status === "loading" && (
              <p className="animate-pulse text-sm text-mist">Finding parts that fit…</p>
            )}
            {options.status === "error" && (
              <p className="text-sm font-bold text-hot">Could not load options. Try again.</p>
            )}
            {options.status === "ready" && options.list.length === 0 && (
              <p className="text-sm text-mist">Nothing else in stock fits this build.</p>
            )}
            {options.status === "ready" && options.list.length > 0 && (
              <ul className="flex flex-col gap-2">
                {options.list.map((option, index) => {
                  const difference = option.price - product.price;
                  return (
                    <li key={option._id} className="rise block" style={{ animationDelay: `${index * 60}ms` }}>
                      <button
                        type="button"
                        onClick={() => onPick(option)}
                        className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-all duration-200 hover:translate-x-1 hover:border-volt"
                      >
                        <span className="line-clamp-2 text-sm font-bold sm:text-base">{option.name}</span>
                        <span className="shrink-0 text-right">
                          <span className="block text-sm font-bold sm:text-base">{formatPKR(option.price)}</span>
                          <span className={`block text-xs font-bold ${difference > 0 ? "text-hot" : "text-volt"}`}>
                            {difference > 0 ? "+" : "−"} {formatPKR(Math.abs(difference))}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

function BudgetBar({ total, budget }) {
  const shown = useAppear();
  const over = total > budget;
  const percent = Math.min(100, Math.round((total / budget) * 100));

  return (
    <div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width,background-color] duration-[1400ms] ease-out ${
            over ? "bg-hot shadow-[0_0_20px_rgba(255,46,99,0.6)]" : "bg-volt shadow-[0_0_20px_rgba(182,255,46,0.6)]"
          }`}
          style={{ width: shown ? `${percent}%` : "0%" }}
        />
      </div>
      <p className={`mt-2 text-sm ${over ? "font-bold text-hot" : "text-mist"}`}>
        {over
          ? `${formatPKR(total - budget)} over your budget`
          : `${percent}% of your budget used · ${formatPKR(budget - total)} left`}
      </p>
    </div>
  );
}

export default function BuilderView() {
  const addToCart = useCart((state) => state.add);
  const results = useRef(null);
  const latestRun = useRef(0);
  const latestSwap = useRef(0);

  const [budget, setBudget] = useState(300000);
  const [use, setUse] = useState("gaming");
  const [brand, setBrand] = useState("any");

  const [status, setStatus] = useState("idle"); // idle | loading | assembling | done | error
  const [result, setResult] = useState(null);
  const [parts, setParts] = useState([]); // the build on screen; changes when a part is swapped
  const [runId, setRunId] = useState(0);
  const [replay, setReplay] = useState(0);
  const [added, setAdded] = useState(false);

  const [swapRole, setSwapRole] = useState(null);
  const [options, setOptions] = useState({ status: "loading", list: [], cooler: null });
  const [stagger, setStagger] = useState(true); // one-by-one entrance for a fresh build only

  // On phones the result is below the questions, so bring it into view.
  useEffect(() => {
    if (runId > 0 && window.innerWidth < 1024) {
      results.current?.scrollIntoView({ block: "start" });
    }
  }, [runId]);

  const build = async (amount = budget) => {
    const token = ++latestRun.current; // ignore answers from older clicks
    setStatus("loading");
    setAdded(false);
    setSwapRole(null);

    try {
      const response = await fetch(`/api/builder?budget=${amount}&use=${use}&brand=${brand}`);
      const data = await response.json();
      if (token !== latestRun.current) return;
      if (!response.ok) throw new Error(data.error);

      setResult(data);
      setParts(data.parts ?? []);
      setStagger(true);
      setRunId(token);

      if (data.ok) {
        // Play the 3D assembly first, then reveal the price and the list.
        setStatus("assembling");
        setTimeout(() => {
          if (token === latestRun.current) setStatus("done");
        }, ASSEMBLY_TIME);
      } else {
        setStatus("done");
      }
    } catch {
      if (token !== latestRun.current) return;
      setResult(null);
      setStatus("error");
    }
  };

  const raiseBudget = () => {
    const needed = Math.min(MAX, Math.ceil(result.minimum / STEP) * STEP);
    setBudget(needed);
    build(needed);
  };

  // Open or close the swap list for one part, and ask the server what fits.
  const toggleSwap = async (role) => {
    if (swapRole === role) {
      setSwapRole(null);
      return;
    }

    const token = ++latestSwap.current;
    setSwapRole(role);
    setOptions({ status: "loading", list: [], cooler: null });

    try {
      const response = await fetch("/api/builder/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          build: Object.fromEntries(parts.map((part) => [part.role, part.product._id])),
        }),
      });
      const data = await response.json();
      if (token !== latestSwap.current) return;
      if (!response.ok) throw new Error(data.error);
      setOptions({ status: "ready", list: data.options, cooler: data.cooler });
    } catch {
      if (token !== latestSwap.current) return;
      setOptions({ status: "error", list: [], cooler: null });
    }
  };

  const pickOption = (role, option) => {
    let next = parts.map((part) => (part.role === role ? { ...part, product: option } : part));

    // A new processor may need a separate cooler, or may no longer need one.
    if (role === "cpu") {
      const hasCooler = next.some((part) => part.role === "cooler");
      if (option.needsCooler && !hasCooler && options.cooler) {
        const position = next.findIndex((part) => part.role === "cpu") + 1;
        next = [
          ...next.slice(0, position),
          { role: "cooler", label: "CPU cooler", product: options.cooler },
          ...next.slice(position),
        ];
      } else if (!option.needsCooler && hasCooler) {
        next = next.filter((part) => part.role !== "cooler");
      }
    }

    setParts(next);
    setSwapRole(null);
    setStagger(false);
    setAdded(false);
  };

  const addAll = () => {
    for (const part of parts) addToCart(part.product, 1);
    setAdded(true);
  };

  const total = parts.reduce((sum, part) => sum + part.product.price, 0);
  const busy = status === "loading" || status === "assembling";
  const showStage = result?.ok && (status === "assembling" || status === "done");

  const chip = "rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200";
  const chipOn = "border-volt bg-volt text-ink shadow-[0_0_24px_rgba(182,255,46,0.45)]";
  const chipOff = "border-white/20 bg-white/5 text-white/80 hover:border-volt hover:text-volt";

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr] lg:gap-10">
      {/* ---------- Questions ---------- */}
      <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:h-fit">
        {/* Budget */}
        <section className={`rise block ${panel}`}>
          <h2 className={heading}>1 · Your budget</h2>
          <p className="mt-3 text-4xl font-bold text-volt sm:text-5xl">{formatPKR(budget)}</p>

          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
            aria-label="Budget"
            className="mt-5 w-full cursor-pointer accent-[#b6ff2e]"
          />
          <div className="flex justify-between text-xs text-mist">
            <span>{formatPKR(MIN)}</span>
            <span>{formatPKR(MAX)}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_BUDGETS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setBudget(amount)}
                className={`${chip} ${budget === amount ? chipOn : chipOff}`}
              >
                {amount / 1000}k
              </button>
            ))}
          </div>
        </section>

        {/* Use */}
        <section className={`rise block ${panel}`} style={{ animationDelay: "120ms" }}>
          <h2 className={heading}>2 · What is it for?</h2>
          <div className="mt-4 flex flex-col gap-2">
            {USES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setUse(option.id)}
                aria-pressed={use === option.id}
                className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                  use === option.id
                    ? "scale-[1.02] border-volt bg-volt/10 shadow-[0_0_30px_rgba(182,255,46,0.2)]"
                    : "border-white/15 bg-white/5 hover:border-white/40"
                }`}
              >
                <span className={`block text-lg font-bold ${use === option.id ? "text-volt" : ""}`}>
                  {option.title}
                </span>
                <span className="block text-sm text-mist">{option.text}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Brand */}
        <section className={`rise block ${panel}`} style={{ animationDelay: "240ms" }}>
          <h2 className={heading}>3 · Processor brand</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {BRANDS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBrand(option.id)}
                aria-pressed={brand === option.id}
                className={`${chip} ${brand === option.id ? chipOn : chipOff}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={() => build()}
          disabled={busy}
          className="btn-primary rise w-full disabled:cursor-wait disabled:opacity-60"
          style={{ animationDelay: "360ms" }}
        >
          {busy ? "Assembling…" : "Build my PC"}
        </button>
      </div>

      {/* ---------- Result ---------- */}
      <div ref={results} className="scroll-mt-24">
        {status === "idle" && (
          <div className={`rise flex min-h-[320px] flex-col items-center justify-center text-center ${panel}`} style={{ animationDelay: "300ms" }}>
            <p className="card-brand text-outline text-4xl font-bold uppercase tracking-tighter sm:text-6xl">
              Your build
            </p>
            <p className="mt-4 max-w-sm text-mist">
              Set a budget, pick what the PC is for, and we will choose parts that work together.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className={`flex min-h-[320px] flex-col items-center justify-center text-center ${panel}`}>
            <p className="animate-pulse text-3xl font-bold uppercase tracking-tighter text-volt sm:text-5xl">
              Choosing parts
            </p>
            <p className="mt-3 text-mist">Matching sockets, memory and power…</p>
          </div>
        )}

        {status === "error" && (
          <div className={`rise block ${panel}`}>
            <p className="font-bold text-hot">Something went wrong while building. Please try again.</p>
          </div>
        )}

        {/* 3D stage: parts fly in and lock together */}
        {showStage && (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink/40 backdrop-blur-md">
            <div className="h-[300px] sm:h-[460px]">
              <PCAssembly key={`${runId}-${replay}`} />
            </div>

            <p className="pointer-events-none absolute left-5 top-5 font-mono text-xs uppercase tracking-[0.35em] text-volt">
              <span key={status} className="rise">
                {status === "assembling" ? "Assembling your build…" : "Assembled"}
              </span>
            </p>

            {status === "done" && (
              <button
                type="button"
                onClick={() => setReplay((count) => count + 1)}
                className="rise absolute bottom-4 right-4 rounded-full border border-white/20 bg-ink/70 px-4 py-2 text-sm font-bold transition-colors hover:border-volt hover:text-volt"
              >
                ↻ Replay
              </button>
            )}
          </div>
        )}

        {/* Price and parts list, once the assembly has played */}
        {status === "done" && result?.ok && (
          <div key={runId} className="mt-4">
            <div className={`rise block ${panel}`}>
              <h2 className={heading}>
                Your {result.use} build{result.brand !== "any" ? ` · ${result.brand.toUpperCase()}` : ""}
              </h2>
              <p className={`mt-3 text-4xl font-bold sm:text-6xl ${total > result.budget ? "text-hot" : "text-volt"}`}>
                <CountUp value={total} prefix="Rs. " duration={1000} />
              </p>
              <div className="mt-5">
                <BudgetBar total={total} budget={result.budget} />
              </div>
            </div>

            <ul className="mt-4 flex flex-col gap-3">
              {parts.map((part, index) => (
                <PartCard
                  key={`${part.role}-${part.product._id}`}
                  part={part}
                  delay={stagger ? index * 110 : 0}
                  open={swapRole === part.role}
                  options={options}
                  onToggle={() => toggleSwap(part.role)}
                  onPick={(option) => pickOption(part.role, option)}
                />
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={addAll} className={`btn-primary ${added ? "scale-105" : ""}`}>
                <span key={added ? "added" : "idle"} className="rise">
                  {added ? "✓ All parts added" : "Add all to cart"}
                </span>
              </button>
              {added && (
                <Link href="/cart" className="rise text-center font-bold text-volt underline underline-offset-4">
                  View cart →
                </Link>
              )}
            </div>

            <p className="mt-4 text-xs text-mist">
              Parts are matched for socket, memory type and power. Swap any part to see what else fits. The 3D
              model is an illustration, not the exact products.
            </p>
          </div>
        )}

        {/* Budget too small */}
        {status === "done" && result && !result.ok && result.reason === "budget" && (
          <div key={runId} className={`rise block ${panel}`}>
            <h2 className={heading}>Not enough for a full PC</h2>
            <p className="mt-3 text-2xl font-bold sm:text-3xl">
              A complete build here starts at{" "}
              <span className="text-volt">{formatPKR(result.minimum)}</span>.
            </p>
            <p className="mt-2 text-mist">
              With {formatPKR(budget)} we would have to leave out a part, so we would rather not suggest one.
            </p>

            <button type="button" onClick={raiseBudget} className="btn-primary mt-6">
              Build at {formatPKR(Math.ceil(result.minimum / STEP) * STEP)}
            </button>

            {result.alternatives?.length > 0 && (
              <>
                <h3 className={`mt-8 ${heading}`}>Ready to play within your budget</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {result.alternatives.map((product, index) => (
                    <li key={product._id} className="rise block" style={{ animationDelay: `${200 + index * 90}ms` }}>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-volt"
                      >
                        <span className="font-bold">{product.name}</span>
                        <span className="shrink-0 font-bold text-volt">{formatPKR(product.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* Catalog cannot make a PC for this choice */}
        {status === "done" && result && !result.ok && result.reason === "catalog" && (
          <div key={runId} className={`rise block ${panel}`}>
            <h2 className={heading}>No build available</h2>
            <p className="mt-3 text-lg">
              We do not have every part in stock for this choice right now. Try a different processor brand.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}