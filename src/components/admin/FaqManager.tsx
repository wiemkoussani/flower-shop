"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Faq = { id: string; question: string; answer: string; sortOrder: number };

export function FaqManager({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function createFaq(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: form.get("question"),
        answer: form.get("answer"),
        sortOrder: Number(form.get("sortOrder") || 0),
        published: true,
      }),
    });
    if (!res.ok) {
      setError("Failed");
      return;
    }
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete FAQ?")) return;
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={createFaq} className="space-y-3 border border-line bg-white p-5">
        <h2 className="font-display text-2xl">Add FAQ</h2>
        <input name="question" className="input" placeholder="Question" required />
        <textarea name="answer" className="input min-h-24" placeholder="Answer" required />
        <input name="sortOrder" type="number" className="input" defaultValue={0} />
        {error && <p className="text-sm text-magenta">{error}</p>}
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
      <ul className="space-y-2">
        {faqs.map((f) => (
          <li key={f.id} className="border border-line bg-white p-4 text-sm">
            <div className="flex justify-between gap-3">
              <p className="font-medium">{f.question}</p>
              <button type="button" className="text-magenta text-xs" onClick={() => remove(f.id)}>
                Delete
              </button>
            </div>
            <p className="mt-2 text-muted">{f.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
