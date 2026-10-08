"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/format";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Addon = {
  id: string;
  name: string;
  type: string;
  priceKobo: number;
  imageUrl: string | null;
  active: boolean;
  backSoon: boolean;
};

export function AddonManager({ addons }: { addons: Addon[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function createAddon(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name"));
    const res = await fetch("/api/admin/addons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36),
        type: form.get("type"),
        priceKobo: Math.round(Number(form.get("priceNaira") || 0) * 100),
        imageUrl,
        active: true,
        backSoon: form.get("backSoon") === "on",
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed");
      return;
    }
    (e.target as HTMLFormElement).reset();
    setImageUrl(null);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this add-on?")) return;
    await fetch(`/api/admin/addons/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={createAddon} className="space-y-3 border border-line bg-white p-5">
        <h2 className="font-display text-2xl">Add new</h2>
        <div>
          <label className="label">Type</label>
          <select name="type" className="input" defaultValue="treat">
            <option value="wrapper">Wrapper / hatbox</option>
            <option value="card">Greeting card</option>
            <option value="treat">Treat (cake / tray)</option>
            <option value="balloon">Balloon</option>
          </select>
        </div>
        <div>
          <label className="label">Name</label>
          <input name="name" className="input" required />
        </div>
        <div>
          <label className="label">Price (₦)</label>
          <input name="priceNaira" type="number" min={0} defaultValue={0} className="input" />
        </div>
        <ImageUpload value={imageUrl} onChange={setImageUrl} folder="addons" label="Photo" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="backSoon" /> Back soon
        </label>
        {error && <p className="text-sm text-magenta">{error}</p>}
        <button type="submit" className="btn-primary">
          Create
        </button>
      </form>

      <ul className="space-y-2">
        {addons.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 border border-line bg-white px-4 py-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden border border-line bg-cream">
                {a.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <p className="font-medium">
                  [{a.type}] {a.name}
                </p>
                <p className="text-muted">
                  {formatNaira(a.priceKobo)}
                  {a.backSoon ? " · Back soon" : ""}
                </p>
              </div>
            </div>
            <button type="button" className="text-magenta text-xs uppercase tracking-wide" onClick={() => remove(a.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
