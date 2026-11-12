"use client";

import { useState } from "react";
import Link from "next/link";
import ConfiguratorScene from "@/components/three/ConfiguratorScene";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/format";

const COLORS = {
  graphite: { name: "Graphite", hex: "#3a3f4a" },
  black: { name: "Black", hex: "#15171c" },
  charcoal: { name: "Charcoal", hex: "#2b2f38" },
  silver: { name: "Silver", hex: "#c9ced8" },
  white: { name: "White", hex: "#eef1f6" },
  cream: { name: "Cream", hex: "#e8dfcf" },
  navy: { name: "Navy", hex: "#1d2b53" },
  lime: { name: "Lime", hex: "#b6ff2e" },
  pink: { name: "Pink", hex: "#ff2e63" },
  sky: { name: "Sky", hex: "#4de8ff" },
  purple: { name: "Purple", hex: "#7a5cff" },
  orange: { name: "Orange", hex: "#ff8a3d" },
};

// Which colours are offered for each part of the keyboard.
const GROUPS = [
  { key: "case", label: "Case", options: ["graphite", "black", "silver", "white", "navy", "lime", "pink"] },
  { key: "keycap", label: "Keycaps", options: ["charcoal", "white", "cream", "lime", "pink", "sky"] },
  { key: "mod", label: "Modifier keys", options: ["black", "graphite", "white", "purple", "lime", "pink"] },
  { key: "accent", label: "Esc and Enter", options: ["lime", "pink", "sky", "orange", "white"] },
  { key: "glow", label: "Glow", options: ["lime", "pink", "sky", "purple", "orange", "white"] },
];

const PRESETS = [
  { name: "Volt", design: { case: "graphite", keycap: "charcoal", mod: "black", accent: "lime", glow: "lime", cycle: true } },
  { name: "Stealth", design: { case: "black", keycap: "charcoal", mod: "black", accent: "pink", glow: "pink", cycle: false } },
  { name: "Arctic", design: { case: "white", keycap: "white", mod: "graphite", accent: "sky", glow: "sky", cycle: false } },
  { name: "Sunset", design: { case: "navy", keycap: "cream", mod: "purple", accent: "orange", glow: "orange", cycle: true } },
];

const SWITCHES = [
  { id: "Linear", text: "Smooth and quiet, straight down." },
  { id: "Tactile", text: "A soft bump you can feel." },
  { id: "Clicky", text: "Loud, crisp click on every press." },
];

const panel = "rise block rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md sm:p-6";
const heading = "font-mono text-xs uppercase tracking-[0.35em] text-volt";

export default function ConfiguratorView({ product }) {
  const addToCart = useCart((state) => state.add);

  const [design, setDesign] = useState(PRESETS[0].design);
  const [switchType, setSwitchType] = useState("Tactile");
  const [added, setAdded] = useState(false);

  // Any change to the design means the "added" tick no longer describes what is on screen.
  const choose = (key, value) => {
    setDesign((current) => ({ ...current, [key]: value }));
    setAdded(false);
  };
  const choosePreset = (preset) => {
    setDesign(preset.design);
    setAdded(false);
  };
  const chooseSwitch = (id) => {
    setSwitchType(id);
    setAdded(false);
  };

  // The 3D scene wants real colour values, not names.
  const config = {
    case: COLORS[design.case].hex,
    keycap: COLORS[design.keycap].hex,
    mod: COLORS[design.mod].hex,
    accent: COLORS[design.accent].hex,
    glow: COLORS[design.glow].hex,
    cycle: design.cycle,
  };

  const activePreset = PRESETS.find((preset) =>
    Object.entries(preset.design).every(([key, value]) => design[key] === value)
  );

  // Plain-words description of the design. This travels with the cart line and the order.
  const note = [
    `Case: ${COLORS[design.case].name}`,
    `Keycaps: ${COLORS[design.keycap].name}`,
    `Modifiers: ${COLORS[design.mod].name}`,
    `Esc/Enter: ${COLORS[design.accent].name}`,
    `Glow: ${COLORS[design.glow].name}${design.cycle ? " (shifting)" : ""}`,
    `Switches: ${switchType}`,
  ].join(" · ");

  const inStock = product && product.stock > 0;

  const handleAdd = () => {
    addToCart(product, 1, note);
    setAdded(true);
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px] lg:gap-8">
      {/* ---------- 3D stage (stays in view while you pick colours) ---------- */}
      <div className="sticky top-16 z-20 lg:top-24 lg:h-fit">
        <div className="relative h-[250px] overflow-hidden rounded-2xl border border-white/10 bg-graphite sm:h-[420px] lg:h-[calc(100svh-9rem)] lg:bg-ink/40 lg:backdrop-blur-md">
          <div className="pointer-events-none absolute inset-[20%] rounded-full bg-volt/15 blur-[90px]" />
          <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
            <ConfiguratorScene config={config} />
          </div>
          <p className="pointer-events-none absolute bottom-3 left-4 right-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-mist sm:text-xs">
            Drag to rotate · Type on your keyboard to press the keys
          </p>
        </div>
      </div>

      {/* ---------- Controls ---------- */}
      <div className="flex flex-col gap-5">
        {/* Ready-made themes */}
        <section className={panel}>
          <h2 className={heading}>Start from a theme</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => choosePreset(preset)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200 ${
                  activePreset?.name === preset.name
                    ? "border-volt bg-volt text-ink shadow-[0_0_24px_rgba(182,255,46,0.45)]"
                    : "border-white/20 bg-white/5 text-white/80 hover:border-volt hover:text-volt"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </section>

        {/* Colours */}
        {GROUPS.map((group, groupIndex) => (
          <section key={group.key} className={panel} style={{ animationDelay: `${80 + groupIndex * 70}ms` }}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className={heading}>{group.label}</h2>
              <p key={design[group.key]} className="rise text-sm font-bold">
                {COLORS[design[group.key]].name}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {group.options.map((id) => {
                const selected = design[group.key] === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => choose(group.key, id)}
                    aria-label={COLORS[id].name}
                    aria-pressed={selected}
                    title={COLORS[id].name}
                    className={`h-11 w-11 rounded-full border-2 transition-all duration-200 ${
                      selected
                        ? "scale-110 border-white shadow-[0_0_0_3px_rgba(182,255,46,0.9)]"
                        : "border-white/25 hover:scale-110 hover:border-white/70"
                    }`}
                    style={{ backgroundColor: COLORS[id].hex }}
                  />
                );
              })}
            </div>

            {group.key === "glow" && (
              <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={design.cycle}
                  onChange={(event) => choose("cycle", event.target.checked)}
                  className="h-5 w-5 accent-[#b6ff2e]"
                />
                Shifting glow <span className="font-normal text-mist">(drifts between two colours)</span>
              </label>
            )}
          </section>
        ))}

        {/* Switches */}
        <section className={panel} style={{ animationDelay: "450ms" }}>
          <h2 className={heading}>Switches</h2>
          <div className="mt-4 flex flex-col gap-2">
            {SWITCHES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => chooseSwitch(option.id)}
                aria-pressed={switchType === option.id}
                className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                  switchType === option.id
                    ? "scale-[1.02] border-volt bg-volt/10 shadow-[0_0_30px_rgba(182,255,46,0.2)]"
                    : "border-white/15 bg-white/5 hover:border-white/40"
                }`}
              >
                <span className={`block font-bold ${switchType === option.id ? "text-volt" : ""}`}>{option.id}</span>
                <span className="block text-sm text-mist">{option.text}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Summary and add to cart */}
        <section className={panel} style={{ animationDelay: "520ms" }}>
          <h2 className={heading}>Your VOLT K65</h2>
          <dl className="mt-4 space-y-2 text-sm">
            {GROUPS.map((group) => (
              <div key={group.key} className="flex justify-between gap-4">
                <dt className="text-mist">{group.label}</dt>
                <dd className="font-bold">
                  {COLORS[design[group.key]].name}
                  {group.key === "glow" && design.cycle ? " (shifting)" : ""}
                </dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="text-mist">Switches</dt>
              <dd className="font-bold">{switchType}</dd>
            </div>
          </dl>

          {product ? (
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-4xl font-bold text-volt">{formatPKR(product.price)}</p>

              {inStock ? (
                <div className="mt-5 flex flex-col gap-3">
                  <button type="button" onClick={handleAdd} className={`btn-primary w-full ${added ? "scale-105" : ""}`}>
                    <span key={added ? "added" : "idle"} className="rise">
                      {added ? "✓ Added to cart" : "Add this design to cart"}
                    </span>
                  </button>
                  {added && (
                    <Link href="/cart" className="rise text-center font-bold text-volt underline underline-offset-4">
                      View cart →
                    </Link>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-5 w-full cursor-not-allowed rounded-full border border-white/20 bg-white/5 px-8 py-4 font-bold text-white/50"
                >
                  Out of stock
                </button>
              )}
            </div>
          ) : (
            <p className="mt-5 border-t border-white/10 pt-5 text-sm text-mist">
              The VOLT K65 is not in the catalog right now, so it cannot be ordered.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}