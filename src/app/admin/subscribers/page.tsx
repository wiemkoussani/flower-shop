import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-3xl">Subscribers</h1>
      <p className="mt-2 text-sm text-muted">Emails from the footer Sign up form.</p>
      <ul className="mt-6 divide-y divide-line border border-line bg-white">
        {subs.map((s) => (
          <li key={s.id} className="flex justify-between px-4 py-3 text-sm">
            <span>{s.email}</span>
            <span className="text-muted">{s.createdAt.toLocaleString()}</span>
          </li>
        ))}
        {subs.length === 0 && <li className="px-4 py-8 text-center text-muted">No subscribers yet</li>}
      </ul>
    </div>
  );
}
