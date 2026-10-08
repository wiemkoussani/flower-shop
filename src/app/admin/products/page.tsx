import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductDeleteButton } from "@/components/admin/ProductDeleteButton";
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
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="mt-1 text-sm text-muted">Add, edit or delete anything in the shop. Pick the right section for each item.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/categories" className="btn-ghost">
            Manage sections
          </Link>
          <Link href="/admin/products/new" className="btn-primary">
            + Add product
          </Link>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="border-b border-line bg-cream text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden border border-line bg-cream">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.category.name}</td>
                <td className="px-4 py-3">
                  {(p.variants[0]?.priceKobo ?? 0) === 0 ? "Enquire" : formatNaira(p.variants[0]?.priceKobo ?? 0)}
                </td>
                <td className="px-4 py-3">{p.active ? "Visible" : "Hidden"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/products/${p.id}`} className="text-xs uppercase tracking-wide text-ink hover:text-magenta">
                      Edit
                    </Link>
                    <ProductDeleteButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="text-magenta underline">
                    Add your first product
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
