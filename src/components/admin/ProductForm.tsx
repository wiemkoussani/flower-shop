"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };
type VariantInput = { id?: string; name: string; priceNaira: string; color: string };

type Props = {
  categories: Category[];
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    badge: string | null;
    active: boolean;
    featured: boolean;
    videoNote: string;
    specs: string | null;
    categoryId: string;
    variants: { id: string; name: string; priceKobo: number; color: string | null }[];
  };
};

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<VariantInput[]>(
    product?.variants.map((v) => ({
      id: v.id,
      name: v.name,
      priceNaira: String(v.priceKobo / 100),
      color: v.color || "",
    })) || [{ name: "Standard", priceNaira: "0", color: "" }],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      imageUrl: form.get("imageUrl") || null,
      badge: form.get("badge") || null,
      categoryId: form.get("categoryId"),
      active: form.get("active") === "on",
      featured: form.get("featured") === "on",
      videoNote: form.get("videoNote"),
      specs: form.get("specs") || null,
      variants: variants.map((v, i) => ({
        id: v.id,
        name: v.name,
        priceKobo: Math.round(Number(v.priceNaira) * 100),
        color: v.color || null,
        sortOrder: i,
      })),
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Save failed");
      setLoading(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="label" htmlFor="name">Name</label>
        <input id="name" name="name" className="input" defaultValue={product?.name} required />
      </div>
      <div>
        <label className="label" htmlFor="slug">Slug</label>
        <input id="slug" name="slug" className="input" defaultValue={product?.slug} required />
      </div>
      <div>
        <label className="label" htmlFor="categoryId">Category</label>
        <select id="categoryId" name="categoryId" className="input" defaultValue={product?.categoryId} required>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="input min-h-28"
          defaultValue={product?.description}
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="imageUrl">Image URL</label>
        <input id="imageUrl" name="imageUrl" className="input" defaultValue={product?.imageUrl || ""} />
      </div>
      <div>
        <label className="label" htmlFor="badge">Badge (e.g. free upgrade to large)</label>
        <input id="badge" name="badge" className="input" defaultValue={product?.badge || ""} />
      </div>
      <div>
        <label className="label" htmlFor="videoNote">
          Video approval (shown on product page)
        </label>
        <p className="mb-1 text-[12px] text-muted">
          Client asked for this on every order — florist sends video via WhatsApp/email before delivery.
        </p>
        <textarea
          id="videoNote"
          name="videoNote"
          className="input min-h-20"
          defaultValue={
            product?.videoNote ||
            "Once arranged, your florist will send a video via WhatsApp or email for your approval before delivery."
          }
        />
      </div>
      <div>
        <label className="label" htmlFor="specs">
          What&apos;s included / notes (optional)
        </label>
        <p className="mb-1 text-[12px] text-muted">
          For gift sets: cake, card and balloons are included in the set price — not extra add-ons.
          Hand-tied bouquets are flowers only unless you write otherwise here.
        </p>
        <textarea
          id="specs"
          name="specs"
          className="input min-h-24"
          defaultValue={product?.specs || ""}
          placeholder="e.g. Includes arrangement + bento cake + card + balloons"
        />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} /> Active
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} /> Featured
        </label>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs tracking-[0.14em] uppercase text-magenta">Variants / prices (₦)</p>
          <button
            type="button"
            className="text-sm text-magenta"
            onClick={() => setVariants((v) => [...v, { name: "", priceNaira: "0", color: "" }])}
          >
            + Add variant
          </button>
        </div>
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-3">
              <input
                className="input"
                placeholder="Name (e.g. Small)"
                value={v.name}
                onChange={(e) =>
                  setVariants((list) =>
                    list.map((row, idx) => (idx === i ? { ...row, name: e.target.value } : row)),
                  )
                }
                required
              />
              <input
                className="input"
                placeholder="Price Naira"
                type="number"
                min={0}
                value={v.priceNaira}
                onChange={(e) =>
                  setVariants((list) =>
                    list.map((row, idx) => (idx === i ? { ...row, priceNaira: e.target.value } : row)),
                  )
                }
                required
              />
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="Color (optional)"
                  value={v.color}
                  onChange={(e) =>
                    setVariants((list) =>
                      list.map((row, idx) => (idx === i ? { ...row, color: e.target.value } : row)),
                    )
                  }
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    className="btn-ghost px-3"
                    onClick={() => setVariants((list) => list.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-magenta">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}
