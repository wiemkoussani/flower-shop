import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { formatNaira } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function AdminProductsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: { orderBy: { priceKobo: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          Add product
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-cream text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.category.name}</td>
                <td className="px-4 py-3">{formatNaira(p.variants[0]?.priceKobo ?? 0)}</td>
                <td className="px-4 py-3">{p.active ? "Active" : "Hidden"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-magenta hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
