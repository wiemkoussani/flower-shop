import { redirect } from "next/navigation";
import { FaqManager } from "@/components/admin/FaqManager";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl">FAQs</h1>
      <div className="mt-6">
        <FaqManager faqs={faqs} />
      </div>
    </div>
  );
}
