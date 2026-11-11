"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveProduct } from "@/app/admin/actions";
import { CATEGORIES } from "@/lib/categories";

const field =
  "mt-2 w-full rounded-xl border border-white/20 bg-ink/70 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-colors focus:border-volt";
const panel = "rise block rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-md sm:p-7";
const heading = "font-mono text-xs uppercase tracking-[0.35em] text-volt";

export default function ProductForm({ product }) {
  const [state, formAction, pending] = useActionState(saveProduct, { error: "" });

  const [values, setValues] = useState({
    name: product?.name ?? "",
    brand: product?.brand ?? "",
    category: product?.category ?? "",
    price: product?.price ?? "",
    oldPrice: product?.oldPrice ?? "",
    stock: product?.stock ?? 0,
    warranty: product?.warranty ?? "",
    description: product?.description ?? "",
    featured: product?.featured ?? false,
    socket: product?.build?.socket ?? "",
    ramType: product?.build?.ramType ?? "",
    wattage: product?.build?.wattage ?? "",
    powerDraw: product?.build?.powerDraw ?? "",
    score: product?.build?.score ?? "",
    needsCooler: product?.build?.needsCooler ?? false,
  });

  const [images, setImages] = useState(product?.images ?? []);

  const [specs, setSpecs] = useState(
    product?.specs?.length ? product.specs : [{ label: "", value: "" }]
  );

  const update = (key) => (event) =>
    setValues((current) => ({
      ...current,
      [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    }));

  const updateSpec = (index, key) => (event) =>
    setSpecs((current) =>
      current.map((spec, i) => (i === index ? { ...spec, [key]: event.target.value } : spec))
    );

  return (
    <form action={formAction} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
      {product && <input type="hidden" name="id" value={product._id} />}
      <input type="hidden" name="specs" value={JSON.stringify(specs)} />
      <input type="hidden" name="images" value={images.join("\n")} />

      <div className="flex flex-col gap-6">
        {/* Basics */}
        <section className={panel}>
          <h2 className={heading}>Basics</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold sm:col-span-2">
              Product name
              <input name="name" required value={values.name} onChange={update("name")} placeholder="Logitech G502 HERO" className={field} />
            </label>

            <label className="block text-sm font-bold">
              Brand
              <input name="brand" required value={values.brand} onChange={update("brand")} placeholder="Logitech" className={field} />
            </label>

            <label className="block text-sm font-bold">
              Category
              <select name="category" required value={values.category} onChange={update("category")} className={field}>
                <option value="" className="bg-ink">
                  Select category
                </option>
                {CATEGORIES.map((category) => (
                  <option key={category.slug} value={category.slug} className="bg-ink">
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-bold sm:col-span-2">
              Description
              <textarea name="description" rows={3} value={values.description} onChange={update("description")} placeholder="One or two lines about the product." className={field} />
            </label>

            <label className="block text-sm font-bold sm:col-span-2">
              Warranty
              <input name="warranty" value={values.warranty} onChange={update("warranty")} placeholder="1 Year Local Warranty" className={field} />
            </label>
          </div>
        </section>

        {/* Specifications */}
        <section className={panel} style={{ animationDelay: "100ms" }}>
          <h2 className={heading}>Specifications</h2>
          <div className="mt-5 flex flex-col gap-3">
            {specs.map((spec, index) => (
              <div key={index} className="rise flex gap-2">
                <input value={spec.label} onChange={updateSpec(index, "label")} placeholder="Sensor" aria-label="Spec name" className={`${field} mt-0 sm:w-1/3`} />
                <input value={spec.value} onChange={updateSpec(index, "value")} placeholder="HERO 25K" aria-label="Spec value" className={`${field} mt-0`} />
                <button
                  type="button"
                  aria-label="Remove this spec"
                  onClick={() => setSpecs((current) => current.filter((_, i) => i !== index))}
                  className="shrink-0 rounded-xl border border-white/20 px-4 text-lg font-bold text-mist transition-colors hover:border-hot hover:text-hot"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSpecs((current) => [...current, { label: "", value: "" }])}
            className="mt-4 rounded-full border border-white/20 px-4 py-2 text-sm font-bold transition-colors hover:border-volt hover:text-volt"
          >
            + Add spec
          </button>
        </section>

        {/* PC builder info */}
        <section className={panel} style={{ animationDelay: "200ms" }}>
          <h2 className={heading}>PC builder info</h2>
          <p className="mt-2 text-sm text-mist">
            Only fill what applies to this product. The PC builder uses these to pick parts that work together.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold">
              Socket <span className="font-normal text-mist">(processors, motherboards)</span>
              <input name="socket" list="sockets" value={values.socket} onChange={update("socket")} placeholder="AM5" className={field} />
              <datalist id="sockets">
                <option value="AM5" />
                <option value="AM4" />
                <option value="LGA1700" />
                <option value="LGA1851" />
              </datalist>
            </label>

            <label className="block text-sm font-bold">
              RAM type <span className="font-normal text-mist">(motherboards, RAM)</span>
              <select name="ramType" value={values.ramType} onChange={update("ramType")} className={field}>
                <option value="" className="bg-ink">
                  Not applicable
                </option>
                <option value="DDR4" className="bg-ink">
                  DDR4
                </option>
                <option value="DDR5" className="bg-ink">
                  DDR5
                </option>
              </select>
            </label>

            <label className="block text-sm font-bold">
              PSU needed, watts <span className="font-normal text-mist">(graphics cards)</span>
              <input name="powerDraw" type="number" min="0" value={values.powerDraw} onChange={update("powerDraw")} placeholder="550" className={field} />
            </label>

            <label className="block text-sm font-bold">
              Output, watts <span className="font-normal text-mist">(power supplies)</span>
              <input name="wattage" type="number" min="0" value={values.wattage} onChange={update("wattage")} placeholder="650" className={field} />
            </label>

            <label className="block text-sm font-bold sm:col-span-2">
              Performance score <span className="font-normal text-mist">(higher is faster; compare within one category)</span>
              <input name="score" type="number" min="0" value={values.score} onChange={update("score")} placeholder="100" className={field} />
            </label>

            <label className="flex cursor-pointer items-start gap-3 text-sm font-bold sm:col-span-2">
              <input name="needsCooler" type="checkbox" checked={values.needsCooler} onChange={update("needsCooler")} className="mt-0.5 h-5 w-5 shrink-0 accent-[#b6ff2e]" />
              <span>
                Sold without a cooler{" "}
                <span className="font-normal text-mist">
                  (processors only; the builder will add a CPU cooler to the build)
                </span>
              </span>
            </label>
          </div>
        </section>
      </div>

      {/* Side column */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:h-fit">
        <section className={panel} style={{ animationDelay: "150ms" }}>
          <h2 className={heading}>Price and stock</h2>
          <div className="mt-5 grid gap-5">
            <label className="block text-sm font-bold">
              Price (Rs.)
              <input name="price" type="number" min="0" required value={values.price} onChange={update("price")} placeholder="13500" className={field} />
            </label>

            <label className="block text-sm font-bold">
              Old price (Rs.) <span className="font-normal text-mist">(optional, shows a discount)</span>
              <input name="oldPrice" type="number" min="0" value={values.oldPrice} onChange={update("oldPrice")} placeholder="15000" className={field} />
            </label>

            <label className="block text-sm font-bold">
              Stock
              <input name="stock" type="number" min="0" step="1" required value={values.stock} onChange={update("stock")} className={field} />
            </label>

            <label className="flex cursor-pointer items-center gap-3 text-sm font-bold">
              <input name="featured" type="checkbox" checked={values.featured} onChange={update("featured")} className="h-5 w-5 accent-[#b6ff2e]" />
              Show as featured
            </label>
          </div>
        </section>

        <section className={panel} style={{ animationDelay: "250ms" }}>
          <h2 className={heading}>Pictures</h2>
          <ImageUploader images={images} onChange={setImages} />
        </section>

        {state.error && (
          <p role="alert" className="rise block rounded-xl border border-hot bg-hot/10 px-4 py-3 text-sm font-bold text-hot">
            {state.error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button type="submit" disabled={pending} className="btn-primary w-full disabled:cursor-wait disabled:opacity-60">
            {pending ? "Saving…" : product ? "Save changes" : "Add product"}
          </button>
          <Link href="/admin/products" className="btn-ghost w-full">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}