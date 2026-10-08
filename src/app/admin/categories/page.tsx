import { redirect } from "next/navigation";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Shop sections</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Create and rename the categories products appear under (Hand Tied Bouquets, Gift Sets, etc.).
        Then assign each product to the right section when you add it.
      </p>
      <div className="mt-8">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
