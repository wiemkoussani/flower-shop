import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { formatNaira } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function AdminDashboard() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [orderCount, paidOrders, productCount, recent] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ where: { status: "PAID" }, select: { totalKobo: true } }),
    prisma.product.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { payment: true },
    }),
  ]);

  const revenue = paidOrders.reduce((n, o) => n + o.totalKobo, 0);

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Catalogue follows her brief: bouquets &amp; sets with prices; events/treats/plants = enquire.
        Gift sets include cake + card + balloons. Video approval is on every product. There is no
        customer login yet — buyers checkout as guests.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-line bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-muted">Orders</p>
          <p className="font-display mt-2 text-3xl">{orderCount}</p>
        </div>
        <div className="border border-line bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-muted">Paid revenue</p>
          <p className="font-display mt-2 text-3xl text-magenta">{formatNaira(revenue)}</p>
        </div>
        <div className="border border-line bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-muted">Products</p>
          <p className="font-display mt-2 text-3xl">{productCount}</p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-magenta hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="hover:text-magenta">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{o.senderName}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3">{formatNaira(o.totalKobo)}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
