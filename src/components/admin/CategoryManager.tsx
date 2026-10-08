"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  _count: { products: number };
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function createSection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description") || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not create section");
      return;
    }
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  async function saveRename(id: string) {
    setError("");
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not rename");
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete section “${name}”?`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not delete");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={createSection} className="space-y-3 border border-line bg-white p-5">
        <h2 className="font-display text-2xl">Add section</h2>
        <p className="text-sm text-muted">Sections are shop categories (e.g. Hand Tied Bouquets, Gift Sets).</p>
        <div>
          <label className="label">Name</label>
          <input name="name" className="input" required placeholder="e.g. Signature Arrangements" />
        </div>
        <div>
          <label className="label">Short description (optional)</label>
          <input name="description" className="input" placeholder="Shown in admin only" />
        </div>
        {error && <p className="text-sm text-magenta">{error}</p>}
        <button type="submit" className="btn-primary">
          Add section
        </button>
      </form>

      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="border border-line bg-white px-4 py-3 text-sm">
            {editingId === c.id ? (
              <div className="flex flex-wrap items-center gap-2">
                <input className="input max-w-xs" value={editName} onChange={(e) => setEditName(e.target.value)} />
                <button type="button" className="btn-primary px-3 py-2 text-xs" onClick={() => saveRename(c.id)}>
                  Save
                </button>
                <button type="button" className="text-xs text-muted" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-muted">
                    {c._count.products} product{c._count.products === 1 ? "" : "s"} · /{c.slug}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-xs uppercase tracking-wide text-ink hover:text-magenta"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-wide text-magenta"
                    onClick={() => remove(c.id, c.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        {categories.length === 0 && (
          <li className="border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-muted">
            No sections yet — add one on the left.
          </li>
        )}
      </ul>
    </div>
  );
}
