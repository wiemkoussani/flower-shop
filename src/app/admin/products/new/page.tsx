import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function NewProductPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl">Add product</h1>
      <p className="mt-2 text-sm text-muted">Name, section, photo upload, price and description — then it appears in the shop.</p>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
