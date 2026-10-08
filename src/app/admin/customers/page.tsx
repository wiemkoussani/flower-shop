import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { formatNaira } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const customers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalKobo: true,
          createdAt: true,
        },
      },
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Customers</h1>
      <p className="mt-2 text-sm text-muted">People who created an account on the website, with their recent orders.</p>

      <div className="mt-8 space-y-4">
        {customers.map((c) => (
          <article key={c.id} className="border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl">{c.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  {c.email}
                  {c.phone ? ` · ${c.phone}` : ""}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                  Joined{" "}
                  {new Date(c.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {c._count.orders} order{c._count.orders === 1 ? "" : "s"}
                  {c.marketingOptIn ? " · VIP list" : ""}
                </p>
              </div>
            </div>
            {c.orders.length > 0 ? (
              <ul className="mt-4 divide-y divide-line border-t border-line">
                {c.orders.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-magenta hover:underline">
                      {o.orderNumber}
                    </Link>
                    <span className="text-muted">{o.status}</span>
                    <span>{formatNaira(o.totalKobo)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">No orders yet.</p>
            )}
          </article>
        ))}
        {customers.length === 0 && (
          <div className="border border-dashed border-line bg-white px-4 py-12 text-center text-sm text-muted">
            No customer accounts yet. They appear here when someone registers via Login on the site.
          </div>
        )}
      </div>
    </div>
  );
}
